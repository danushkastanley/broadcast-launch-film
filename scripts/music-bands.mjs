#!/usr/bin/env node
// Section map from two bands: low (<150 Hz, kick/808/bass) and high (>4 kHz, hats/risers/crash).
// Finds what music-grid.mjs can't: where the kick enters, the drops, a bass drop-out, a hard stop.
//   node music-bands.mjs <track> [window seconds = 0.5]
// Prints rows of "low/high" dBFS per window, 8 windows per row. Use window = one beat to read sections.
import { execFileSync } from "node:child_process";
const [file, winArg] = process.argv.slice(2);
if (!file) throw new Error("usage: music-bands.mjs <track> [window seconds]");
const win = Number(winArg || 0.5), sr = 11025;
const pcm = (af) => {
  const b = execFileSync("ffmpeg", ["-v", "error", "-i", file, "-ac", "1", "-ar", String(sr), "-af", af, "-f", "f32le", "-"], { maxBuffer: 1 << 30 });
  return new Float32Array(b.buffer, b.byteOffset, b.length / 4);
};
const lo = pcm("lowpass=f=150,lowpass=f=150"), hi = pcm("highpass=f=4000,highpass=f=4000");
const n = Math.floor(sr * win);
const db = (a, i) => { let s = 0; for (let k = i; k < i + n && k < a.length; k++) s += a[k] * a[k]; return (10 * Math.log10(s / n + 1e-12)).toFixed(0); };
let row = "";
for (let i = 0, j = 0; i < lo.length; i += n, j++) {
  if (j % 8 === 0) { if (row) console.log(row); row = `${(i / sr).toFixed(2).padStart(6)}s `; }
  row += ` ${db(lo, i).padStart(4)}/${db(hi, i)}`;
}
console.log(row);
