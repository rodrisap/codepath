// Loads Pyodide in Node together with the same harness the browser uses.
import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { loadPyodide } from "pyodide";
import { PythonCore } from "../../src/runners/python/core.ts";

export async function createNodePython(): Promise<PythonCore> {
  const py = await loadPyodide({ env: { PYTHONHASHSEED: "0" } });
  const harness = readFileSync(resolve(import.meta.dirname, "../../src/runners/python/harness.py"), "utf8");
  return PythonCore.create(py, harness);
}
