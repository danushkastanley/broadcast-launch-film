#!/usr/bin/env node
// Write compositions/chrome.html (root HUD + film grain) from the project's film.json.
//   node make-chrome.mjs --project <dir>
// film.json: { width, height, fps, duration, bpm, beat0, bars, brand, label, scenes: [start seconds…] }
import { readFileSync, writeFileSync, mkdirSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const HERE = dirname(fileURLToPath(import.meta.url));
const arg = (name) => {
  const i = process.argv.indexOf(`--${name}`);
  return i >= 0 ? process.argv[i + 1] : undefined;
};
const project = arg("project");
if (!project) throw new Error("usage: make-chrome.mjs --project <dir>");

const film = JSON.parse(readFileSync(join(project, "film.json"), "utf8"));
const required = ["width", "height", "fps", "duration", "bpm", "beat0", "bars", "brand", "label", "scenes"];
const missing = required.filter((k) => film[k] === undefined);
if (missing.length) throw new Error(`film.json is missing: ${missing.join(", ")}`);
if (!Array.isArray(film.scenes) || film.scenes[0] !== 0) throw new Error("film.json scenes must start with 0");

const escapeHtml = (s) => String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
const shortSide = Math.min(film.width, film.height);
const values = {
  __W__: film.width,
  __H__: film.height,
  __GW__: film.width + 200,
  __GH__: film.height + 200,
  __FS__: Math.round((22 * shortSide) / 1080),
  __DURATION__: film.duration,
  __FPS__: film.fps,
  __BPM__: film.bpm,
  __BEAT0__: film.beat0,
  __BARS__: film.bars,
  __BRAND__: escapeHtml(film.brand),
  __LABEL__: escapeHtml(film.label),
  __SCENE_COUNT__: String(film.scenes.length).padStart(2, "0"),
  __SCENES__: JSON.stringify(film.scenes),
};

let html = readFileSync(join(HERE, "..", "assets", "chrome.template.html"), "utf8");
for (const [token, value] of Object.entries(values)) html = html.split(token).join(String(value));
const leftover = html.match(/__[A-Z_]+__/);
if (leftover) throw new Error(`unfilled template token ${leftover[0]}`);

const out = join(project, "compositions", "chrome.html");
mkdirSync(dirname(out), { recursive: true });
writeFileSync(out, html);
console.log(`✓ chrome → ${out} (${film.width}×${film.height}, ${film.duration}s, ${film.scenes.length} scenes, ${film.bpm} BPM)`);
