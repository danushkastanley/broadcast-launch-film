#!/usr/bin/env node
// Zoomed loudness envelope (10 ms rows) to pin an exact hit, drop or stop by eye.
//   node music-env.mjs <track> <from s> <to s> ["lowpass=f=100" | "highpass=f=3000" | ffmpeg -af chain]
// A kick onset is the first row where the bar jumps; a hard stop is where it collapses.
import { execFileSync } from "node:child_process";
const [file, from, to, af] = process.argv.slice(2);
if (!file || from === undefined || to === undefined) throw new Error("usage: music-env.mjs <track> <from> <to> [af]");
const sr = 22050;
const b = execFileSync("ffmpeg", ["-v", "error", "-ss", from, "-t", String(to - from), "-i", file, "-ac", "1", "-ar", String(sr), "-af", af || "anull", "-f", "f32le", "-"], { maxBuffer: 1 << 30 });
const a = new Float32Array(b.buffer, b.byteOffset, b.length / 4);
const hop = Math.round(sr * 0.01);
for (let i = 0; i + hop <= a.length; i += hop) {
  let s = 0; for (let k = i; k < i + hop; k++) s += a[k] * a[k];
  const db = 10 * Math.log10(s / hop + 1e-12);
  console.log(`${(+from + i / sr).toFixed(2)} ${"#".repeat(Math.max(0, Math.round((db + 50) / 1.5)))}`);
}
