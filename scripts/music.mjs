#!/usr/bin/env node
// HeyGen music library helper (uses the signed-in ~/.heygen credential via media-use).
//   node music.mjs search "<query>" ["<query>" …]        → ranked hits with duration + id
//   node music.mjs get "<query>" <id> <out.mp3>          → download one hit from that query
import { searchSounds, heygenAuthHeaders, downloadTo } from "../../media-use/audio/scripts/lib/heygen.mjs";

const [cmd, ...rest] = process.argv.slice(2);
const headers = heygenAuthHeaders();

if (cmd === "search") {
  if (!rest.length) throw new Error('usage: music.mjs search "<query>" …');
  for (const q of rest) {
    const hits = await searchSounds(q, "music", headers, { limit: 8, minScore: 0.3 });
    console.log(`## ${q}`);
    for (const h of hits) {
      console.log(`  ${(h.score ?? 0).toFixed(2)}  ${String(h.duration).padStart(4)}s  ${h.id}  ${(h.description || h.name || "").slice(0, 100)}`);
    }
  }
} else if (cmd === "get") {
  const [q, id, out] = rest;
  if (!q || !id || !out) throw new Error('usage: music.mjs get "<query>" <id> <out.mp3>');
  const hits = await searchSounds(q, "music", headers, { limit: 10, minScore: 0.3 });
  const hit = hits.find((h) => h.id === id);
  if (!hit) throw new Error(`id ${id} is not in the results for "${q}" — re-run search with the same query`);
  await downloadTo(hit.audio_url, out);
  console.log(`✓ ${out} (${hit.duration}s) — ${hit.description || hit.name || ""}`);
} else {
  throw new Error('usage: music.mjs search "<query>" … | get "<query>" <id> <out.mp3>');
}
