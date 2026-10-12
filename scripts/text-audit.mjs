#!/usr/bin/env node
// Seek the running Studio preview every 0.25s and report any visible frame text outside the safe zone.
//   node text-audit.mjs --url http://localhost:PORT/api/projects/<id>/preview --project <dir>
// Zone and canvas come from film.json ("zone": [x0, x1, y0, y1]). The chrome overlay is skipped on purpose.
// Expect brief hits at slam peaks / slide-ins (a few frames); anything that persists after a word settles is a bug.
import { spawn } from "node:child_process";
import { readFileSync, mkdtempSync, existsSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";

const arg = (n) => {
  const i = process.argv.indexOf(`--${n}`);
  return i >= 0 ? process.argv[i + 1] : undefined;
};
const url = arg("url");
const project = arg("project");
if (!url || !project) throw new Error("usage: text-audit.mjs --url <preview url> --project <dir>");
const film = JSON.parse(readFileSync(join(project, "film.json"), "utf8"));
const [x0, x1, y0, y1] = film.zone;
// Chrome or Chromium binary: $CHROME_PATH, else the usual macOS / Linux locations.
const CHROME = [
  process.env.CHROME_PATH,
  "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",
  "/usr/bin/google-chrome",
  "/usr/bin/chromium",
].find((p) => p && existsSync(p));
if (!CHROME) throw new Error("Chrome not found: set CHROME_PATH");

const port = 9400 + Math.floor(Math.random() * 400);
const profile = mkdtempSync(join(tmpdir(), "hf-audit-"));
const chrome = spawn(CHROME, ["--headless=new", `--remote-debugging-port=${port}`, `--user-data-dir=${profile}`,
  `--window-size=${film.width},${film.height}`, "about:blank"], { stdio: "ignore" });
try {
  let targets;
  for (let i = 0; i < 40 && !targets; i++) {
    await new Promise((r) => setTimeout(r, 500));
    try { targets = await (await fetch(`http://127.0.0.1:${port}/json`)).json(); } catch {}
  }
  if (!targets) throw new Error("headless Chrome did not start");
  const ws = new WebSocket(targets.find((t) => t.type === "page").webSocketDebuggerUrl);
  await new Promise((r) => ws.addEventListener("open", r, { once: true }));
  let id = 0;
  const pending = new Map();
  ws.addEventListener("message", (e) => { const m = JSON.parse(e.data); pending.get(m.id)?.(m); });
  const send = (method, params = {}) => new Promise((r) => { const i = ++id; pending.set(i, r); ws.send(JSON.stringify({ id: i, method, params })); });
  const evaluate = async (expression) => {
    const res = await send("Runtime.evaluate", { expression, awaitPromise: true, returnByValue: true });
    if (res.result.exceptionDetails) throw new Error(JSON.stringify(res.result.exceptionDetails).slice(0, 300));
    return res.result.result.value;
  };

  await send("Emulation.setDeviceMetricsOverride", { width: film.width, height: film.height, deviceScaleFactor: 1, mobile: false });
  await send("Page.navigate", { url });
  for (let i = 0; i < 60; i++) {
    await new Promise((r) => setTimeout(r, 500));
    if (await evaluate("!!(window.__player && typeof window.__player.seek === 'function')").catch(() => false)) break;
  }

  const probe = `(() => {
    const out = [];
    const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
    while (walker.nextNode()) {
      const node = walker.currentNode;
      const text = node.textContent.trim();
      if (!text) continue;
      const el = node.parentElement;
      const comp = (el.closest('[data-composition-id]') || {}).dataset?.compositionId || '?';
      if (comp === 'chrome' || el.closest('svg defs, style, script')) continue;
      let alpha = 1, hidden = false;
      for (let e = el; e && e !== document.documentElement; e = e.parentElement) {
        const cs = getComputedStyle(e);
        if (cs.display === 'none' || cs.visibility === 'hidden') { hidden = true; break; }
        alpha *= parseFloat(cs.opacity);
      }
      if (hidden || alpha < 0.15) continue;
      const range = document.createRange(); range.selectNodeContents(node);
      const r = [...range.getClientRects()].find((q) => q.width >= 1 && q.height >= 1);
      if (r) out.push({ text: text.slice(0, 32), comp, box: [r.left, r.right, r.top, r.bottom].map(Math.round) });
    }
    return out;
  })()`;

  const issues = new Map();
  for (let t = 0.05; t < film.duration; t += 0.25) {
    await evaluate(`window.__player.seek(${t.toFixed(2)})`);
    await evaluate("new Promise(r => requestAnimationFrame(() => requestAnimationFrame(r)))");
    for (const b of await evaluate(probe)) {
      const [l, r, top, bottom] = b.box;
      if (l < x0 - 2 || r > x1 + 2 || top < y0 - 2 || bottom > y1 + 2) {
        const key = `${b.comp} "${b.text}"`;
        if (!issues.has(key)) issues.set(key, { first: t, last: t, box: b.box });
        else issues.get(key).last = t;
      }
    }
  }
  console.log(`zone x ${x0}–${x1}, y ${y0}–${y1} · ${film.duration}s`);
  if (!issues.size) console.log("  out-of-zone text: none");
  for (const [k, v] of issues) {
    const span = v.last - v.first;
    console.log(`  ${span >= 0.5 ? "PERSISTS" : "brief   "} ${k} ${v.first.toFixed(2)}–${v.last.toFixed(2)}s box x${v.box[0]}–${v.box[1]} y${v.box[2]}–${v.box[3]}`);
  }
  ws.close();
} finally {
  chrome.kill();
}
