// Runs the real Python harness (Pyodide in Node) to guard the trace explanations.
import { beforeAll, describe, expect, it } from "vitest";
import { createNodePython } from "../../scripts/lib/node-python";
import type { PythonCore } from "../../src/runners/python/core";

let core: PythonCore;
beforeAll(async () => {
  core = await createNodePython();
}, 60_000);

const how = (code: string) => core.trace({ code }).steps.map((s) => s.how);

describe("trace explanations", () => {
  it("shows operator order step by step", () => {
    expect(how("x = 10 + 5 * 2 ** 2")[0]).toBe("x = 10 + 5 * 2 ** 2 → 10 + 5 * 4 → 10 + 20 → 30");
  });
  it("substitutes variables and shows augmented assignment", () => {
    expect(how("total = 0\nprice = 450\ntotal += price")[2]).toBe("total = total + price → 0 + 450 → 450");
  });
  it("short-circuits and/or like Python", () => {
    // 10 / x would crash if it were evaluated; Python never evaluates it.
    expect(how("x = 0\nok = x != 0 and 10 / x > 1")[1]).toBe("ok = x != 0 and 10 / x > 1 → 0 != 0 and 10 / 0 > 1 → False and 10 / 0 > 1 → False");
  });
  it("explains if and loop decisions", () => {
    const steps = how("n = 5\nif n > 3:\n    n = 1\nfor r in [1, 2]:\n    pass");
    expect(steps[1]).toBe("n > 3 → 5 > 3 → True → run the indented block");
    expect(steps[3]).toBe("round 1: r = 1");
    expect(steps.at(-1)).toBe("no items left after 2 round(s) → the loop ends");
  });
  it("marks the line that crashed", () => {
    expect(how('print("a")\nprint(b)').at(-1)).toContain("NameError");
  });
});

describe("checks", () => {
  it("gives specific feedback for a wrong return value", () => {
    const [r] = core.check({
      code: "def f(n, r):\n    return n + r",
      tests: [{ kind: "call", call: "f(3, 50)", expect: 150, hint: "Check if you multiplied by nights." }],
    });
    expect(r.passed).toBe(false);
    expect(r.message).toBe("`f(3, 50)` should return 150, but it returned 53. Check if you multiplied by nights.");
  });
  it("explains a missing return", () => {
    const [r] = core.check({ code: "def f():\n    print(1)", tests: [{ kind: "call", call: "f()", expect: 1 }] });
    expect(r.message).toMatch(/no `return`/);
  });
});
