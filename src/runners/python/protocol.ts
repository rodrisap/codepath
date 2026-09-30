/** Messages exchanged between the page (PythonRunner) and the Python worker. */
import type { PyTest } from "../../content/types";
import type { PyRunResult, TestResult, TraceResult } from "./types";

export type JobRequest =
  | { type: "run"; id: number; code: string; stdin?: string[]; files?: Record<string, string>; interactive: boolean }
  | { type: "check"; id: number; code: string; tests: PyTest[]; stdin?: string[]; files?: Record<string, string> }
  | { type: "trace"; id: number; code: string; stdin?: string[]; files?: Record<string, string> };

export type ToWorker =
  | {
      type: "init";
      indexURL: string;
      packageBaseUrl: string;
      /** Present when the page is cross-origin isolated (SharedArrayBuffer available). */
      interruptBuffer?: SharedArrayBuffer;
      inputBuffer?: SharedArrayBuffer;
    }
  | JobRequest;

export type JobResult = PyRunResult | TestResult[] | TraceResult;

export type FromWorker =
  | { type: "ready" }
  | { type: "init-error"; message: string }
  | { type: "status"; id: number; text: string }
  | { type: "started"; id: number }
  | { type: "stream"; id: number; kind: "out" | "err" | "in"; text: string }
  | { type: "input-request"; id: number; prompt: string }
  | { type: "done"; id: number; result: JobResult }
  | { type: "failed"; id: number; message: string };

/**
 * Layout of the input SharedArrayBuffer:
 *   Int32 [0] state: 0 = waiting, 1 = a line is ready, 2 = stop requested
 *   Int32 [1] byte length of the line
 *   bytes from INPUT_DATA_OFFSET: the UTF-8 encoded line
 */
export const INPUT_STATE = 0;
export const INPUT_LENGTH = 1;
export const INPUT_DATA_OFFSET = 8;
export const INPUT_BUFFER_BYTES = 64 * 1024;
