# SFX on the beat grid

Fetch cues by naming them in each frame's `sfx:` line, then run `audio.mjs fetch-sfx`. That retrieves files into
`assets/sfx/` but places everything at offset 0. Then **rewrite `audio_meta.json` by hand**, so every cue sits
on the grid. Measure each file's onset and peak first:

```bash
for f in assets/sfx/*.mp3; do ffmpeg -hide_banner -nostats -i $f -ac 1 -af "asetnsamples=n=4410,astats=metadata=1:reset=1,ametadata=print:key=lavfi.astats.Overall.RMS_level" -f null - 2>&1 | grep RMS_level | awk -F= -v f=$f 'BEGIN{printf "%s ", f}{printf "%4.0f", $2}END{print ""}'; done
```

Each entry looks like this: `{ "frame": n, "file": "assets/sfx/x.mp3", "offset_s": <frame-relative>, "duration_s": <trim>, "volume": v, "source": "host" }`. Set the music bed as `{ "path": "assets/bgm/film-bed.wav", "volume": 0.85, "source": "host", "duration_s": <film> }`.

## Profiles from the HeyGen library (as fetched for MockReps)

| Name to request | Length | Shape | Placement |
|---|---|---|---|
| `split flap display` | 0.94s | 3 dry clacks | On each tile or row lock, vol 0.35–0.4 |
| `digital glitch` | 1.03s | Burst, then gone by ~0.6s | On glitch-cuts and scrambles, vol 0.25–0.3 |
| `glitch transition` | 0.65s | Short tear | On every montage word or swap, vol 0.18–0.2; big glitches 0.35–0.4 |
| `typewriter` | 2.52s | Key clatter | Under type-ons; trim `duration_s` to the typing length, vol 0.18–0.28 |
| `cinematic impact boom` | 5.39s | Rises ~0.6s, body to ~2.2s, long tail | Start 0.6s before the drop, so its body lands on it, vol 0.5 |
| `deep impact hit` | 1.77s | Immediate thump, ~0.4s peak | On the drop, the hero slam and the final hit, vol 0.45–0.6; trim so it ends at the film end |

Rules:
- One impact per section (drop, climax word, final hit). Glitches and clacks carry the rest.
- Align peaks, not starts: offset = beat time − peak time.
- Trim any cue that would run past the root duration (lint warns `clip_ends_past_root_duration`).
- The music is the loudest layer. SFX stay under it except on the impacts.
