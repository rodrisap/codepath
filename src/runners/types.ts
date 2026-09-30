/**
 * The pluggable runner interface. Every language (Python, SQL, later Java)
 * implements `CodeRunner`, so the editor, output panel and exercise engine
 * never need to know which language they are talking to.
 */

export type Language = "python" | "sql" | "java";

/** A table of results (used by SQL; Python may return one later for pandas). */
export interface ResultTable {
  columns: string[];
  rows: (string | number | null)[][];
}

/** A runtime or syntax error, in a language-neutral shape. */
export interface RunError {
  type: string; // e.g. "NameError", "SQLiteError", "Timeout"
  message: string;
  line?: number | null;
  col?: number | null;
  traceback?: string;
}

export interface RunInput {
  /** Lines to feed to input() / stdin before asking the user. */
  stdin?: string[];
  /** Sample files to create before running (Python). */
  files?: Record<string, string>;
  /** Name of the sample database to load (SQL). */
  dataset?: string;
}

export interface RunResult {
  stdout: string;
  stderr: string;
  /** Language-specific structured result, e.g. SQL result tables. */
  result?: ResultTable[];
  error?: RunError | null;
  durationMs: number;
}

export interface RunHandlers {
  /** Called with output as it is produced ("out", "err" or "in" = echoed input). */
  onStream?: (kind: StreamKind, text: string) => void;
  /** Called when the program asks for input. Resolve with the line, or null to stop. */
  onInputRequest?: (prompt: string) => Promise<string | null>;
  /** Short progress messages such as "Loading Python…". */
  onStatus?: (status: string) => void;
}

export type StreamKind = "out" | "err" | "in";

export interface CodeRunner {
  readonly language: Language;
  /** Resolves once the runner has loaded (downloads WASM etc. the first time). */
  ready(): Promise<void>;
  run(code: string, input?: RunInput, handlers?: RunHandlers): Promise<RunResult>;
  /** Stop the current run (infinite loop, waiting for input…). */
  stop(): void;
}
