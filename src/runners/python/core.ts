/**
 * PythonCore wraps a loaded Pyodide instance and the harness (harness.py).
 * It is environment-neutral: the browser worker and the Node content checker
 * both use it, so lessons are verified with exactly the code you run.
 */
import type { PyodideInterface } from "pyodide";
import type { PyRunResult, TestResult, TraceResult } from "./types";
import type { PyTest } from "../../content/types";

export interface PyHost {
  emit(kind: string, text: string): void;
  /** Return the typed line, or null if the user pressed Stop. */
  requestInput(prompt: string): string | null;
}

export const PYODIDE_VERSION = "314.0.7";
export const PYODIDE_CDN = `https://cdn.jsdelivr.net/pyodide/v${PYODIDE_VERSION}/full/`;
const STOP_SENTINEL = "\u0000STOP";

export interface PyRunOptions {
  code: string;
  stdin?: string[];
  files?: Record<string, string>;
  interactive?: boolean;
}

export class PythonCore {
  private host: PyHost = { emit: () => {}, requestInput: () => null };

  private constructor(private py: PyodideInterface) {}

  static async create(py: PyodideInterface, harnessSource: string): Promise<PythonCore> {
    const core = new PythonCore(py);
    py.registerJsModule("_cp_js", {
      emit: (kind: string, text: string) => core.host.emit(kind, text),
      request_input: (prompt: string) => core.host.requestInput(prompt) ?? STOP_SENTINEL,
    });
    // Work in a clean folder so lesson files don't clash with Pyodide's own.
    py.runPython("import os\nos.makedirs('/home/pyodide/work', exist_ok=True)\nos.chdir('/home/pyodide/work')");
    py.runPython(harnessSource);
    return core;
  }

  setHost(host: PyHost) {
    this.host = host;
  }

  /** Load packages such as pandas when the code imports them. */
  async prepare(code: string, onMessage?: (msg: string) => void) {
    await this.py.loadPackagesFromImports(code, { messageCallback: onMessage ?? (() => {}) });
  }

  private call<T>(fn: string, opts: unknown): T {
    const pyFn = this.py.globals.get(fn);
    try {
      return JSON.parse(pyFn(JSON.stringify(opts))) as T;
    } finally {
      pyFn.destroy();
    }
  }

  run(opts: PyRunOptions): PyRunResult {
    return this.call<PyRunResult>("_cp_run", opts);
  }

  check(opts: { code: string; tests: PyTest[]; stdin?: string[]; files?: Record<string, string> }): TestResult[] {
    return this.call<TestResult[]>("_cp_check", opts);
  }

  trace(opts: { code: string; stdin?: string[]; files?: Record<string, string> }): TraceResult {
    return this.call<TraceResult>("_cp_trace", opts);
  }
}
