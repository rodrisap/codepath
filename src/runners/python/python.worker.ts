/// <reference lib="webworker" />
/**
 * The Python worker. Pyodide runs here, off the main thread, so the page stays
 * responsive even if your code loops forever.
 */
import harnessSource from "./harness.py?raw";
import { PythonCore } from "./core";
import {
  INPUT_DATA_OFFSET,
  INPUT_LENGTH,
  INPUT_STATE,
  type FromWorker,
  type JobRequest,
  type ToWorker,
} from "./protocol";

declare const self: DedicatedWorkerGlobalScope;

let core: PythonCore | null = null;
let inputState: Int32Array | null = null;
let inputBytes: Uint8Array | null = null;
let currentJob = 0;

function post(msg: FromWorker) {
  self.postMessage(msg);
}

/** Blocks this worker until the page sends a line (possible thanks to Atomics.wait). */
function requestInput(prompt: string): string | null {
  if (!inputState || !inputBytes) return null;
  Atomics.store(inputState, INPUT_STATE, 0);
  post({ type: "input-request", id: currentJob, prompt });
  Atomics.wait(inputState, INPUT_STATE, 0);
  const state = Atomics.load(inputState, INPUT_STATE);
  Atomics.store(inputState, INPUT_STATE, 0);
  if (state !== 1) return null; // Stop was pressed
  const length = Atomics.load(inputState, INPUT_LENGTH);
  // slice() copies out of shared memory; TextDecoder can't read shared buffers directly.
  return new TextDecoder().decode(inputBytes.slice(0, length));
}

async function init(msg: Extract<ToWorker, { type: "init" }>) {
  try {
    const { loadPyodide } = (await import(/* @vite-ignore */ `${msg.indexURL}pyodide.mjs`)) as typeof import("pyodide");
    const py = await loadPyodide({
      indexURL: msg.indexURL,
      packageBaseUrl: msg.packageBaseUrl,
      env: { PYTHONHASHSEED: "0" }, // stable set/dict order, same as the content checker
    });
    if (msg.interruptBuffer) py.setInterruptBuffer(new Uint8Array(msg.interruptBuffer));
    if (msg.inputBuffer) {
      inputState = new Int32Array(msg.inputBuffer, 0, 2);
      inputBytes = new Uint8Array(msg.inputBuffer, INPUT_DATA_OFFSET);
    }
    core = await PythonCore.create(py, harnessSource);
    core.setHost({
      emit: (kind, text) => post({ type: "stream", id: currentJob, kind: kind as "out" | "err" | "in", text }),
      requestInput,
    });
    post({ type: "ready" });
  } catch (err) {
    post({ type: "init-error", message: String(err) });
  }
}

async function runJob(job: JobRequest) {
  if (!core) return post({ type: "failed", id: job.id, message: "Python is not loaded yet." });
  currentJob = job.id;
  try {
    await core.prepare(job.code, (text) => post({ type: "status", id: job.id, text }));
    post({ type: "started", id: job.id });
    let result;
    if (job.type === "run") {
      result = core.run({ code: job.code, stdin: job.stdin, files: job.files, interactive: job.interactive && !!inputState });
    } else if (job.type === "check") {
      result = core.check({ code: job.code, tests: job.tests, stdin: job.stdin, files: job.files });
    } else {
      result = core.trace({ code: job.code, stdin: job.stdin, files: job.files });
    }
    post({ type: "done", id: job.id, result });
  } catch (err) {
    post({ type: "failed", id: job.id, message: String(err) });
  }
}

self.onmessage = (event: MessageEvent<ToWorker>) => {
  const msg = event.data;
  if (msg.type === "init") void init(msg);
  else void runJob(msg);
};
