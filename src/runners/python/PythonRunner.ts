/**
 * PythonRunner lives on the main thread. It starts the Python worker, sends it
 * jobs, relays output/input, and enforces the time limit so an endless loop
 * can never freeze the page.
 */
import type { CodeRunner, RunError, RunHandlers, RunInput, RunResult } from "../types";
import type { PyTest } from "../../content/types";
import { PYODIDE_CDN } from "./core";
import {
  INPUT_BUFFER_BYTES,
  INPUT_DATA_OFFSET,
  INPUT_LENGTH,
  INPUT_STATE,
  type FromWorker,
  type JobRequest,
  type JobResult,
} from "./protocol";
import type { PyRunResult, TestResult, TraceResult } from "./types";

export type RunnerStatus = "idle" | "loading" | "ready" | "busy" | "error";

type JobPayload = JobRequest extends infer R ? (R extends JobRequest ? Omit<R, "id"> : never) : never;

interface ActiveJob {
  id: number;
  handlers: RunHandlers;
  resolve: (r: JobResult) => void;
  reject: (e: Error) => void;
  timer?: ReturnType<typeof setTimeout>;
  limitMs: number;
  reason?: "timeout" | "stopped";
  waitingForInput?: boolean;
  started: number;
}

/** True when SharedArrayBuffer can be used (input() and a clean Stop). */
export const canShareMemory = typeof SharedArrayBuffer !== "undefined" && globalThis.crossOriginIsolated === true;

export class PythonRunner implements CodeRunner {
  readonly language = "python" as const;
  /** Time limit per run, in milliseconds. Updated from Settings. */
  timeoutMs = 5000;
  status: RunnerStatus = "idle";

  private worker: Worker | null = null;
  private booting: Promise<void> | null = null;
  private interrupt: Uint8Array | null = null;
  private inputState: Int32Array | null = null;
  private inputBytes: Uint8Array | null = null;
  private job: ActiveJob | null = null;
  private nextId = 1;
  private listeners = new Set<(s: RunnerStatus) => void>();

  onStatus(listener: (s: RunnerStatus) => void): () => void {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  private setStatus(s: RunnerStatus) {
    this.status = s;
    this.listeners.forEach((l) => l(s));
  }

  ready(): Promise<void> {
    if (!this.booting) this.booting = this.boot();
    return this.booting;
  }

  private boot(): Promise<void> {
    this.setStatus("loading");
    const worker = new Worker(new URL("./python.worker.ts", import.meta.url), { type: "module" });
    this.worker = worker;

    let interruptBuffer: SharedArrayBuffer | undefined;
    let inputBuffer: SharedArrayBuffer | undefined;
    if (canShareMemory) {
      interruptBuffer = new SharedArrayBuffer(1);
      inputBuffer = new SharedArrayBuffer(INPUT_DATA_OFFSET + INPUT_BUFFER_BYTES);
      this.interrupt = new Uint8Array(interruptBuffer);
      this.inputState = new Int32Array(inputBuffer, 0, 2);
      this.inputBytes = new Uint8Array(inputBuffer, INPUT_DATA_OFFSET);
    }

    return new Promise<void>((resolve, reject) => {
      worker.onmessage = (event: MessageEvent<FromWorker>) => {
        const msg = event.data;
        if (msg.type === "ready") {
          this.setStatus("ready");
          resolve();
        } else if (msg.type === "init-error") {
          this.setStatus("error");
          this.booting = null;
          reject(new Error(msg.message));
        } else {
          this.handleJobMessage(msg);
        }
      };
      worker.onerror = (e) => {
        this.setStatus("error");
        this.booting = null;
        reject(new Error(e.message || "The Python worker failed to start."));
      };
      worker.postMessage({
        type: "init",
        indexURL: new URL("vendor/pyodide/", document.baseURI).href,
        packageBaseUrl: PYODIDE_CDN,
        interruptBuffer,
        inputBuffer,
      });
    });
  }

  private handleJobMessage(msg: FromWorker) {
    const job = this.job;
    if (!job || !("id" in msg) || msg.id !== job.id) return;
    switch (msg.type) {
      case "status":
        job.handlers.onStatus?.(msg.text);
        break;
      case "started":
        job.started = performance.now();
        this.startTimer(job);
        break;
      case "stream":
        job.handlers.onStream?.(msg.kind, msg.text);
        break;
      case "input-request":
        this.clearTimer(job); // waiting for you doesn't count towards the time limit
        job.waitingForInput = true;
        void this.answerInput(job, msg.prompt);
        break;
      case "done":
        this.finish(job);
        job.resolve(msg.result);
        break;
      case "failed":
        this.finish(job);
        // An interrupt can surface as a failure; report it as the timeout/stop it really was.
        if (job.reason) job.resolve({ ok: false, stdout: "", stderr: "", error: null } satisfies PyRunResult);
        else job.reject(new Error(msg.message));
        break;
    }
  }

  private async answerInput(job: ActiveJob, prompt: string) {
    const answer = job.handlers.onInputRequest ? await job.handlers.onInputRequest(prompt) : null;
    if (this.job !== job || !this.inputState || !this.inputBytes || !job.waitingForInput) return;
    job.waitingForInput = false;
    if (answer === null) {
      job.reason = "stopped";
      Atomics.store(this.inputState, INPUT_STATE, 2);
    } else {
      const bytes = new TextEncoder().encode(answer).slice(0, INPUT_BUFFER_BYTES);
      this.inputBytes.set(bytes);
      Atomics.store(this.inputState, INPUT_LENGTH, bytes.length);
      Atomics.store(this.inputState, INPUT_STATE, 1);
      this.startTimer(job);
    }
    Atomics.notify(this.inputState, INPUT_STATE);
  }

  private startTimer(job: ActiveJob) {
    this.clearTimer(job);
    job.timer = setTimeout(() => this.interruptJob(job, "timeout"), job.limitMs);
  }

  private clearTimer(job: ActiveJob) {
    if (job.timer) clearTimeout(job.timer);
    job.timer = undefined;
  }

  private finish(job: ActiveJob) {
    this.clearTimer(job);
    if (this.interrupt) this.interrupt[0] = 0;
    this.job = null;
    this.setStatus("ready");
  }

  /** Ask Python to stop politely (KeyboardInterrupt); restart the worker if it doesn't. */
  private interruptJob(job: ActiveJob, reason: "timeout" | "stopped") {
    if (this.job !== job) return;
    job.reason = reason;
    if (this.interrupt) {
      this.interrupt[0] = 2; // 2 = SIGINT
      setTimeout(() => {
        if (this.job === job) this.hardRestart(job);
      }, 1500);
    } else {
      this.hardRestart(job);
    }
  }

  private hardRestart(job: ActiveJob) {
    this.worker?.terminate();
    this.worker = null;
    this.booting = null;
    this.finish(job);
    this.setStatus("idle");
    job.resolve({ ok: false, stdout: "", stderr: "", error: null } satisfies PyRunResult);
  }

  private async exec(payload: JobPayload, handlers: RunHandlers, limitMs: number) {
    if (this.job) this.stop();
    handlers.onStatus?.("Loading Python…");
    await this.ready();
    const id = this.nextId++;
    this.setStatus("busy");
    return new Promise<{ result: JobResult; reason?: "timeout" | "stopped"; ms: number }>((resolve, reject) => {
      const job: ActiveJob = {
        id,
        handlers,
        limitMs,
        started: performance.now(),
        resolve: (result) => resolve({ result, reason: job.reason, ms: performance.now() - job.started }),
        reject,
      };
      this.job = job;
      this.worker!.postMessage({ ...payload, id });
    });
  }

  private limitError(reason: "timeout" | "stopped" | undefined, limitMs: number): RunError | null {
    if (reason === "timeout")
      return {
        type: "Timeout",
        message: `Your program ran for more than ${Math.round(limitMs / 1000)} seconds, so it was stopped. This usually means a loop never ends.`,
      };
    if (reason === "stopped") return { type: "Stopped", message: "You stopped the program." };
    return null;
  }

  async run(code: string, input: RunInput = {}, handlers: RunHandlers = {}): Promise<RunResult> {
    const { result, reason, ms } = await this.exec(
      { type: "run", code, stdin: input.stdin, files: input.files, interactive: true },
      handlers,
      this.timeoutMs,
    );
    const r = result as PyRunResult;
    return {
      stdout: r.stdout,
      stderr: r.stderr,
      error: this.limitError(reason, this.timeoutMs) ?? r.error,
      durationMs: ms,
    };
  }

  async check(
    code: string,
    tests: PyTest[],
    opts: { stdin?: string[]; files?: Record<string, string> } = {},
    handlers: RunHandlers = {},
  ): Promise<TestResult[]> {
    const limit = this.timeoutMs * 2;
    const { result, reason } = await this.exec({ type: "check", code, tests, ...opts }, handlers, limit);
    const limitError = this.limitError(reason, limit);
    if (limitError) return [{ label: "Finishes in time", passed: false, message: limitError.message, error: limitError }];
    return result as TestResult[];
  }

  async trace(code: string, opts: { stdin?: string[]; files?: Record<string, string> } = {}, handlers: RunHandlers = {}) {
    const { result, reason } = await this.exec({ type: "trace", code, ...opts }, handlers, this.timeoutMs * 2);
    const limitError = this.limitError(reason, this.timeoutMs * 2);
    if (limitError) return { steps: [], output: "", error: limitError, truncated: true } satisfies TraceResult;
    return result as TraceResult;
  }

  stop() {
    const job = this.job;
    if (!job) return;
    if (this.inputState && job.waitingForInput) {
      // Waiting for input: wake the worker up with "stop" instead of interrupting.
      job.waitingForInput = false;
      job.reason = "stopped";
      Atomics.store(this.inputState, INPUT_STATE, 2);
      Atomics.notify(this.inputState, INPUT_STATE);
      return;
    }
    this.interruptJob(job, "stopped");
  }
}

let shared: PythonRunner | null = null;
/** One Python worker for the whole app (loading Pyodide takes a few seconds). */
export function getPythonRunner(): PythonRunner {
  if (!shared) shared = new PythonRunner();
  return shared;
}
