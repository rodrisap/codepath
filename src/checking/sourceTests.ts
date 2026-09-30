/**
 * "source" tests look at the code itself rather than what it does, e.g.
 * "use an f-string" or "don't just print the number 150".
 */
import type { PyTest } from "../content/types";
import type { TestResult } from "../runners/python/types";

type SourceTest = Extract<PyTest, { kind: "source" }>;

/** Remove comments so `# use a for loop` doesn't count as using one. */
function stripComments(code: string): string {
  return code
    .split("\n")
    .map((line) => line.replace(/(^|[^"'])#.*$/, "$1"))
    .join("\n");
}

export function runSourceTests(code: string, tests: PyTest[]): TestResult[] {
  const clean = stripComments(code);
  return tests
    .filter((t): t is SourceTest => t.kind === "source")
    .map((t) => {
      const found = new RegExp(t.pattern, t.flags ?? "m").test(t.raw ? code : clean);
      const passed = t.negate ? !found : found;
      return { label: t.label, passed, message: passed ? "" : t.message };
    });
}
