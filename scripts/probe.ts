import { createNodePython } from "./lib/node-python.ts";
const core = await createNodePython();
for (const code of [
  'print("Nights:", 3\nprint("Total:", 3 * 450)',
  'print("Total:" 3 * 450)',
  'Print("Invoice")',
  'print("Check-out is at 12:00)',
  '// comment\nprint(1)',
  'print(Welcome to Motel Sol)',
]) { const r = core.run({ code }); console.log(JSON.stringify(code), "=>", r.error?.type, "|", r.error?.message, "| line", r.error?.line); }
