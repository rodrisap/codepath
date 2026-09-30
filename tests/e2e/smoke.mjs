// Browser smoke test: opens the app in headless Chromium and checks the core
// learning loop works end to end (lesson loads, Python runs, tests check,
// input() works, infinite loops are stopped, trace renders).
//
//   npm run dev            (in another terminal)
//   npm run e2e            (optionally: BASE_URL=http://localhost:4173/ npm run e2e)
import { chromium } from "playwright-core";
import { existsSync, mkdirSync } from "node:fs";

const BASE = process.env.BASE_URL ?? "http://localhost:5173/";
const executablePath = ["/opt/pw-browsers/chromium", process.env.CHROMIUM_PATH].find((p) => p && existsSync(p));
const shots = "test-results";
mkdirSync(shots, { recursive: true });

const browser = await chromium.launch({ executablePath });
const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
const errors = [];
page.on("pageerror", (e) => errors.push(String(e)));
page.on("console", (m) => m.type() === "error" && errors.push(m.text()));

let failed = 0;
async function step(name, fn) {
  try {
    await fn();
    console.log(`✓ ${name}`);
  } catch (e) {
    failed++;
    console.log(`✗ ${name}\n  ${String(e).split("\n")[0]}`);
    await page.screenshot({ path: `${shots}/fail-${name.replace(/\W+/g, "-")}.png`, fullPage: false });
  }
}

const editor = () => page.locator(".cm-content").first();
async function setCode(code) {
  await editor().click();
  await page.keyboard.press("ControlOrMeta+a");
  await page.keyboard.press("Delete");
  // insertText avoids auto-indent/auto-close changing what we type
  await page.keyboard.insertText(code);
}
const output = () => page.getByLabel("Program output");
const bench = () => page.getByRole("region", { name: "Code workbench" });
const benchButton = (name) => bench().getByRole("button", { name, exact: true });

await step("dashboard loads", async () => {
  await page.goto(BASE);
  await page.getByRole("heading", { name: /Welcome/ }).waitFor();
  await page.screenshot({ path: `${shots}/dashboard.png` });
});

await step("lesson loads with trace", async () => {
  await page.goto(`${BASE}#/learn/python/getting-started/hello-print`);
  await page.getByRole("heading", { name: "Your first program" }).waitFor();
  await page.getByText("Step 1 of").first().waitFor();
});

await step("Python loads and Run prints output", async () => {
  await page.getByText("Python ready").waitFor({ timeout: 60_000 });
  await benchButton("Run").click();
  await output().getByText("Welcome to Motel Sol").waitFor({ timeout: 20_000 });
  await page.screenshot({ path: `${shots}/lesson.png` });
});

await step("exercise: wrong answer fails with feedback, right answer passes", async () => {
  await page.getByRole("tab", { name: /Exercise 3/ }).click();
  await setCode('print("Stay total:", 4 + 520, "MXN")');
  await benchButton("Check").click();
  await page.getByText(/should be `?Stay total: 2080 MXN/).first().waitFor({ timeout: 20_000 });
  await setCode('print("Stay total:", 4 * 520, "MXN")');
  await benchButton("Check").click();
  await page.getByText(/All 2 tests passed/).waitFor({ timeout: 20_000 });
  await page.screenshot({ path: `${shots}/passed.png` });
});

await step("interactive input()", async () => {
  await page.getByRole("tab", { name: /Try it/ }).click();
  await setCode('n = input("Nights? ")\nprint("Total:", int(n) * 450)');
  await benchButton("Run").click();
  const box = page.locator("#console-input");
  await box.waitFor({ timeout: 20_000 });
  await box.fill("3");
  await box.press("Enter");
  await output().getByText("Total: 1350").waitFor({ timeout: 20_000 });
});

await step("infinite loop is stopped by the time limit", async () => {
  await setCode("while True:\n    pass");
  await benchButton("Run").click();
  await page.getByText("The program took too long").waitFor({ timeout: 20_000 });
  // and Python still works afterwards
  await setCode('print("still alive")');
  await benchButton("Run").click();
  await output().getByText("still alive").waitFor({ timeout: 30_000 });
});

await step("error translator explains a NameError", async () => {
  await setCode('print("Revenue:", totl)');
  await benchButton("Run").click();
  await page.getByText(/Python doesn't know/).waitFor({ timeout: 20_000 });
  await page.screenshot({ path: `${shots}/error.png` });
});

await step("Trace button shows the stepper", async () => {
  await setCode("total = 0\nfor rate in [450, 500]:\n    total += rate\nprint(total)");
  await benchButton("Trace").click();
  await page.getByText("total = total + rate → 0 + 450 → 450").first().waitFor({ timeout: 20_000 }).catch(async () => {
    await page.getByRole("button", { name: "Full table" }).last().click();
    await page.getByText("total = total + rate → 0 + 450 → 450").first().waitFor({ timeout: 5_000 });
  });
});

await step("warm theme toggles", async () => {
  await page.getByRole("button", { name: /warm night theme/ }).click();
  const theme = await page.evaluate(() => document.documentElement.dataset.theme);
  if (theme !== "warm") throw new Error(`theme is ${theme}`);
  await page.screenshot({ path: `${shots}/warm.png` });
  await page.getByRole("button", { name: /standard dark theme/ }).click();
});

await step("progress survives a reload", async () => {
  await page.waitForTimeout(800);
  await page.reload();
  await page.getByRole("tab", { name: /Exercise 3.*done/ }).waitFor({ timeout: 20_000 });
});

await step("narrow laptop layout", async () => {
  await page.setViewportSize({ width: 1024, height: 700 });
  await page.screenshot({ path: `${shots}/narrow.png` });
});

const relevant = errors.filter((e) => !/favicon|coi-serviceworker/.test(e));
if (relevant.length) {
  console.log("Console errors:\n  " + relevant.join("\n  "));
}
await browser.close();
console.log(failed ? `\n${failed} step(s) failed` : "\nAll smoke steps passed");
process.exit(failed ? 1 : 0);
