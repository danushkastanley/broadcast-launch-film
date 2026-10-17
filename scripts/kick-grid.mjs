#!/usr/bin/env node
// Fit an exact beat grid to kick/808 onsets in a span (use a span where the kick is steady).
//   node kick-grid.mjs <track> <from s> <to s> <minPeriod s> <maxPeriod s>
// e.g. a ~98 BPM trap: 0.600 0.620 · a 132 BPM house track: 0.450 0.460
// Prints the best period and the first beat at/after <from>; confirm it with music-env.mjs.
import { execFileSync } from "node:child_process";
const [file, from, to, pMin, pMax] = process.argv.slice(2);
if (!pMax) throw new Error("usage: kick-grid.mjs <track> <from> <to> <minPeriod> <maxPeriod>");
const sr = 22050, step = 0.005, hop = Math.round(sr * step);
const b = execFileSync("ffmpeg", ["-v", "error", "-i", file, "-ac", "1", "-ar", String(sr), "-af", "lowpass=f=90,lowpass=f=90", "-f", "f32le", "-"], { maxBuffer: 1 << 30 });
const a = new Float32Array(b.buffer, b.byteOffset, b.length / 4);
const env = []; for (let i = 0; i + hop <= a.length; i += hop) { let s = 0; for (let k = i; k < i + hop; k++) s += a[k] * a[k]; env.push(Math.sqrt(s / hop)); }
const on = env.map((v, i) => Math.max(0, v - (env[i - 3] ?? v)));
let best = [0, 0, -1];
for (let p = +pMin; p <= +pMax; p += 0.0002) for (let ph = 0; ph < p; ph += 0.002) {
  let s = 0; for (let t = +from + ph; t < +to; t += p) { const i = Math.round(t / step); s += (on[i] || 0) + (on[i + 1] || 0) + (on[i - 1] || 0); }
  if (s > best[2]) best = [p, ph, s];
}
const [p, ph] = best;
console.log(`period ${p.toFixed(4)}s (${(60 / p).toFixed(2)} BPM) · first beat ${(+from + ph).toFixed(3)}s · beat k = ${(+from + ph).toFixed(3)} + k×${p.toFixed(4)}`);
