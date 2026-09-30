import type { RunError } from "../types";

/** Result of `_cp_run` in harness.py. */
export interface PyRunResult {
  ok: boolean;
  stdout: string;
  stderr: string;
  error: RunError | null;
}

/** One test outcome, as returned by `_cp_check` (and by source-pattern checks). */
export interface TestResult {
  label: string;
  passed: boolean;
  message: string;
  error?: RunError | null;
}

/** One row of the step-by-step trace table. */
export interface TraceStep {
  line: number;
  code: string;
  scope: string; // "main" or the function name
  /** "return-to": this line called a function and continues after the call returned. */
  kind: "line" | "call" | "return-to";
  how: string | null;
  vars: Record<string, string>;
  changed: string[];
  output: string;
}

export interface TraceResult {
  steps: TraceStep[];
  output: string;
  error: RunError | null;
  truncated: boolean;
}
