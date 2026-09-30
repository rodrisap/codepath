import { describe, expect, it } from "vitest";
import { runSourceTests } from "../../src/checking/sourceTests";
import { splitSections } from "../../src/content/markdownSections";
import { translatePythonError } from "../../src/errors/pythonErrors";

describe("source tests", () => {
  const test = { kind: "source" as const, label: "uses f-string", pattern: "\\bf[\"']", message: "use f" };
  it("ignores comments unless raw is set", () => {
    expect(runSourceTests('# f"hint"\nprint("x")', [test])[0].passed).toBe(false);
    expect(runSourceTests('print(f"x")', [test])[0].passed).toBe(true);
    expect(runSourceTests('# print("Pool")', [{ ...test, pattern: "#\\s*print", raw: true }])[0].passed).toBe(true);
  });
  it("supports negated patterns", () => {
    const noHardcode = { kind: "source" as const, label: "no 1540", pattern: "1540", negate: true, message: "calc it" };
    expect(runSourceTests("print(1540)", [noHardcode])[0]).toMatchObject({ passed: false, message: "calc it" });
    expect(runSourceTests("print(2 * 770)", [noHardcode])[0].passed).toBe(true);
  });
});

describe("lesson markdown sections", () => {
  it("splits on ## headings, lower-cased", () => {
    const s = splitSections("## Concept\nA\n\nB\n## Common mistakes\n- x\n");
    expect(s).toEqual({ concept: "A\n\nB", "common mistakes": "- x" });
  });
});

describe("error translator", () => {
  it("explains a NameError with a suggestion", () => {
    const t = translatePythonError({ type: "NameError", message: "name 'pritn' is not defined. Did you mean: 'print'?", line: 3 });
    expect(t.title).toContain("pritn");
    expect(t.explanation).toContain("print");
    expect(t.lookAt).toContain("line 3");
  });
  it("explains mixing text and numbers", () => {
    const t = translatePythonError({ type: "TypeError", message: 'can only concatenate str (not "int") to str', line: 1 });
    expect(t.title).toMatch(/text and numbers/);
  });
  it("has a fallback for unknown errors", () => {
    const t = translatePythonError({ type: "WeirdError", message: "?", line: 2 });
    expect(t.title).toBe("WeirdError");
  });
});
