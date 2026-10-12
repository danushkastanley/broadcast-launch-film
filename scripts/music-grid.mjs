#!/usr/bin/env node
// Read a candidate track's beat grid and section map, so scenes can be cut on beats.
//   node music-grid.mjs --project <dir> --track <project-relative.mp3>
// Prints: BPM, beat period, the first steady beat (beat0), strong-beat runs, and a
// per-beat loudness strip (sections show up as plateaus: build / drop / breakdown / tail).
import { execFileSync, spawnSync } from "node:child_process";
import { readFileSync, writeFileSync, copyFileSync, existsSync, rmSync } from "node:fs";
import { join } from "node:path";

const arg = (n) => {
  const i = process.argv.indexOf(`--${n}`);
  return i >= 0 ? process.argv[i + 1] : undefined;
};
const project = arg("project");
const track = arg("track");
if (!project || !track) throw new Error("usage: music-grid.mjs --project <dir> --track <relative path>");

// `hyperframes beats` reads the music element from index.html: mount the track briefly, then restore.
const index = join(project, "index.html");
const backup = join(project, ".hyperframes", "index.before-beats.html");
copyFileSync(index, backup);
try {
  const html = readFileSync(index, "utf8");
  const at = html.indexOf(">", html.indexOf('id="root"')) + 1;
  writeFileSync(
    index,
    html.slice(0, at) +
      `\n<audio id="bgm-probe" data-timeline-role="music" src="${track}" data-start="0" data-duration="600" data-track-index="99"></audio>\n` +
      html.slice(at),
  );
  execFileSync("npx", ["hyperframes", "beats", "--json", "."], { cwd: project, stdio: "pipe" });
} finally {
  copyFileSync(backup, index);
  rmSync(backup);
}

const beatsFile = join(project, "beats", `${track}.json`);
if (!existsSync(beatsFile)) throw new Error(`no beats file at ${beatsFile}`);
const beats = JSON.parse(readFileSync(beatsFile, "utf8")).beats.map((b) => ({ t: b.time, s: b.strength }));
const gaps = beats.slice(1).map((b, i) => b.t - beats[i].t).sort((a, b) => a - b);
const period = gaps[Math.floor(gaps.length / 2)];
const steady = beats.find((b, i) => i + 3 < beats.length && [1, 2, 3].every((k) => Math.abs(beats[i + k].t - b.t - k * period) < 0.03));

console.log(`beats: ${beats.length} · median period ${period.toFixed(5)}s ≈ ${(60 / period).toFixed(1)} BPM`);
console.log(`beat0 (first steady beat): ${steady ? steady.t.toFixed(3) : "n/a"}  → beat k = beat0 + k × period`);
console.log("full-energy sections (runs of strong beats, strength > 0.8, gaps under 3 beats merged):");
const strong = beats.filter((b) => b.s > 0.8).map((b) => b.t);
const runs = [];
for (const t of strong) {
  const last = runs[runs.length - 1];
  if (last && t - last.end < 3 * period) last.end = t;
  else runs.push({ start: t, end: t });
}
for (const r of runs) console.log(`  ${r.start.toFixed(2)}s → ${r.end.toFixed(2)}s`);
console.log("beat0 may sit earlier than the first steady beat: extend the grid backwards (negative k) and check it against the loudness strip.");

// Loudness per beat-length window (RMS dBFS) — plateaus reveal the arrangement.
const probe = spawnSync(
  "ffmpeg",
  ["-hide_banner", "-nostats", "-i", join(project, track), "-ac", "1", "-ar", "44100", "-af",
    `asetnsamples=n=${Math.round(44100 * period)},astats=metadata=1:reset=1,ametadata=print:key=lavfi.astats.Overall.RMS_level`,
    "-f", "null", "-"],
  { encoding: "utf8" },
);
const levels = [...`${probe.stdout}${probe.stderr}`.matchAll(/RMS_level=(-?[\d.]+|-inf)/g)].map((m) => Math.max(-90, Number(m[1]) || -90));
console.log("loudness per beat (dBFS), 16 beats per row:");
for (let i = 0; i < levels.length; i += 16) {
  console.log(`  ${(i * period).toFixed(1).padStart(5)}s  ${levels.slice(i, i + 16).map((v) => String(Math.round(v)).padStart(4)).join("")}`);
}
