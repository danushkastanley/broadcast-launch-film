#!/usr/bin/env node
// Mount the chrome overlay above every frame and set the film's frame rate on the root.
// Run after EVERY assemble-index.mjs (assembly rewrites index.html).
//   node mount-chrome.mjs --project <dir>
import { readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const i = process.argv.indexOf("--project");
const project = i >= 0 ? process.argv[i + 1] : undefined;
if (!project) throw new Error("usage: mount-chrome.mjs --project <dir>");

const film = JSON.parse(readFileSync(join(project, "film.json"), "utf8"));
const path = join(project, "index.html");
let s = readFileSync(path, "utf8");

const root = s.match(/<div[^>]*\bid="root"[^>]*>/);
if (!root) throw new Error("index.html has no #root");
const duration = root[0].match(/data-duration="([\d.]+)"/)?.[1];
if (!duration) throw new Error("#root has no data-duration");

// Default the composition to the film's fps (60 unless film.json says otherwise) so preview and render agree.
const fpsRoot = /data-fps="[^"]*"/.test(root[0])
  ? root[0].replace(/data-fps="[^"]*"/, `data-fps="${film.fps}"`)
  : root[0].replace(/>$/, ` data-fps="${film.fps}">`);
s = s.replace(root[0], fpsRoot);

if (!s.includes('id="el-chrome"')) {
  const tag =
    `      <div id="el-chrome" class="scene" data-composition-id="chrome" data-composition-src="compositions/chrome.html" ` +
    `data-start="0" data-duration="${duration}" data-track-index="5" style="z-index: 50"></div>\n\n`;
  const anchor = s.indexOf("      <!-- BGM -->");
  const at = anchor >= 0 ? anchor : s.indexOf("</div>", s.lastIndexOf('class="scene"'));
  s = s.slice(0, at) + tag + s.slice(at);
}

writeFileSync(path, s);
console.log(`✓ chrome mounted over ${duration}s · root data-fps=${film.fps}`);
