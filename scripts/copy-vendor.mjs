// Copies the runtime files we self-host from node_modules into public/vendor/.
// Self-hosting Pyodide's core and sql.js's WASM means the site works without
// a CDN (only optional Python packages such as pandas are fetched from the CDN).
import { cpSync, mkdirSync } from "node:fs";
import { resolve } from "node:path";

const root = resolve(import.meta.dirname, "..");
const out = resolve(root, "public/vendor");
mkdirSync(resolve(out, "pyodide"), { recursive: true });

const pyodideFiles = ["pyodide.mjs", "pyodide.asm.mjs", "pyodide.asm.wasm", "python_stdlib.zip", "pyodide-lock.json"];
for (const f of pyodideFiles) {
  cpSync(resolve(root, "node_modules/pyodide", f), resolve(out, "pyodide", f));
}
cpSync(resolve(root, "node_modules/sql.js/dist/sql-wasm.wasm"), resolve(out, "sql-wasm.wasm"));
// The service worker must sit at the site root: it only controls pages at or below its own folder.
cpSync(resolve(root, "node_modules/coi-serviceworker/coi-serviceworker.min.js"), resolve(root, "public/coi-serviceworker.js"));
console.log("vendor files copied to public/vendor");
