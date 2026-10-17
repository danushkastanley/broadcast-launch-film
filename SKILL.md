---
name: broadcast-launch-film
description: >
  A cinematic, broadcast-title style launch / brand film (30–90s, default ~60s) cut hard to a
  music track: ink and paper grounds, film grain, a persistent HUD frame (corner brackets, mono
  metadata, live BPM / bar / timecode readouts), huge kinetic type, split-flap letter tiles,
  outline echo type, RGB-split glitches, serif italic accent lines and one hot accent colour.
  No screenshots or voice-over needed. Renders at 60fps by default. Use when someone wants a
  "killer" motion launch video, a Prompt-Motion / "The Frontier"-style title sequence, a
  kinetic-type product intro, or asks to reuse the MockReps launch film look for any brand. Also
  ships four no-HUD looks (Pop Flash hype reel, premium "product performs" film, physical-metaphor
  gym film, fitness-app UI film) and a workflow to recut any film for another aspect ratio.
---

# Broadcast launch film

Builds a music-driven launch film in HyperFrames in the "Broadcast Ink" look. It was proven on
the MockReps launch film: 60.8s, 9:16, 60fps, 11 scenes on a 128 BPM grid. It reuses the
`product-launch-video` pipeline scripts (packets, assembly, checks), and adds:
- a root HUD and grain overlay (`assets/chrome.template.html`);
- a design system (`assets/frame.broadcast-ink.md`);
- the bundled fonts in `assets/fonts/`;
- four more looks with templates, all without the HUD (`references/looks.md`);
- music, safe-zone and delivery helpers in `scripts/`.

Let `SKILL=~/.claude/skills/broadcast-launch-film` and `PL=~/.claude/skills/product-launch-video/scripts`.

## Step 0 — Ask the aspect ratio (always), default everything else

Ask **one** question first, with native question UI, and wait for the answer:

> Which aspect ratio? **9:16 vertical** (Reels / TikTok / Shorts, recommended) · **16:9** (website,
> YouTube, LinkedIn, X) · **1:1** (feeds) · **4:5** (Instagram feed)

Then state these defaults in one short block, without asking. The user can override any of them:

| Setting | Default |
|---|---|
| Frame rate | **60fps** (written to `film.json` and the root `data-fps`; render passes `--fps 60`) |
| Length | ~60s, snapped to the music's real sections |
| Look | **Broadcast Ink** with HUD. Other looks (no HUD): Pop Flash, The product performs, Gym physical, Fitness app — see `references/looks.md`. When the user asks for a new concept or design, offer 3–4 concepts as options (recommended first) |
| Palette | **Ink + signal orange**. Brand colour only inside the logo mark. Alternatives are in `references/design-system.md` |
| Voice | None. Music plus SFX; the type carries the message, so it works with sound off |
| Sources | The brand's site or brief for claims and copy; no screenshots |

Ask a second question only if something material is unknown: the product, the site, or the logo.
Write on-screen copy in the brand's own language and spelling (its site is the reference).

## Step 1 — Project and brief

1. `npx hyperframes init "<dir>/<brand>-launch-film" --non-interactive --example=blank --skill=product-launch-video`
2. Run `npx hyperframes auth status` and relay it. HeyGen sign-in is needed for music and SFX retrieval.
3. Set up assets:
   - `mkdir -p assets/fonts public && cp $SKILL/assets/fonts/*.woff2 assets/fonts/`
   - Put the brand's official logo SVG in `public/` and `assets/`, never redrawn.
4. Gather the truth: capture or read the brand's site (`npx hyperframes capture <url> -o ./capture --json`, or `visible-text.txt` by hand). List what the product actually does. Claims come only from there.
5. Write `BRIEF.md` (shape: `../hyperframes/references/brief-format.md`) with `narration: no`, the aspect ratio, 60fps, the palette and the claim boundaries.
6. Write `film.json`. Its values are filled after Step 2:

```json
{ "width": 1080, "height": 1920, "fps": 60, "duration": 60.8, "bpm": 128, "beat0": 1.9, "bars": 32,
  "brand": "MockReps", "label": "Launch film 2026", "zone": [60, 960, 200, 1490],
  "scenes": [0, 3.775, 9.4, 15.9625] }
```

Safe zones (`zone` = [x0, x1, y0, y1]). The HUD owns the outer 64px:

| Aspect | Canvas | zone | Why |
|---|---|---|---|
| 9:16 | 1080×1920 | 60, 960, 200, 1490 | Right rail and bottom caption area are platform UI |
| 16:9 | 1920×1080 | 120, 1800, 140, 940 | Clear of the HUD rows |
| 1:1 | 1080×1080 | 90, 990, 140, 940 | Clear of the HUD rows |
| 4:5 | 1080×1350 | 80, 1000, 150, 1200 | Clear of the HUD rows and the feed crop |

Looks without the HUD (`"chrome": "none"` in `film.json`) widen the zone: 16:9 → 96, 1824, 80, 1000;
9:16 stays 60, 960, 200, 1490 (platform UI, not the HUD, sets it).

## Step 2 — Music first: the beat grid is the clock

1. Search: `node $SKILL/scripts/music.mjs search "<mood query>" …`. Start with 2–3 queries such as "dark minimal techno, driving kick, tension, 128 bpm" or "energetic tech launch, builds and drops". Keep hits **≥ target length**.
2. Download 2–3 candidates: `node $SKILL/scripts/music.mjs get "<query>" <id> assets/bgm/candidates/<name>.mp3`.
3. Read each candidate's grid: `node $SKILL/scripts/music-grid.mjs --project . --track assets/bgm/candidates/<name>.mp3`.
   - **Prefer a clean grid:** the median period should match one BPM, with a steady kick. Busy cinematic tracks give irregular beats and weak sync.
   - **Map the sections from the loudness strip:** build, drop, full energy, breakdown, swell, final hit.
4. Fix `beat0` and `period`. Beat k is at `beat0 + k·period`; extend the grid backwards if the first steady beat comes late. Every scene starts **exactly on a beat**.
5. Map the story to the music: the problem on the build; the brand reveal **on the drop**; features through full energy; the payoff in the breakdown; the logo **on the final hit**. Scene lengths are whole beats; feature scenes run about 10 beats.
6. Cut the bed: `ffmpeg -i <track> -t <duration> -af "afade=t=out:st=<duration-0.5>:d=0.5" -ar 48000 assets/bgm/film-bed.wav`.
   Start the cut on a beat (`-ss <beat time>`) when the strongest section is mid-track.

When `music-grid.mjs` finds no beats (cinematic or ambient tracks) or the sections are unclear:
- `node $SKILL/scripts/music-bands.mjs <track> <one beat in s>` maps low (kick/808/bass) and high
  (hats/risers/crash) energy per window: the kick entering, drops, a bass drop-out, a hard stop.
- `node $SKILL/scripts/kick-grid.mjs <track> <from> <to> <minPeriod> <maxPeriod>` fits the exact
  period and phase on kick onsets; `music-env.mjs <track> <from> <to> "lowpass=f=90"` confirms a hit
  to 10 ms by eye. Trust a visible onset over a detector.
- A loop with no drop can be given one: splice its own intro back in before the end card
  (`ffmpeg -filter_complex "[0:a]atrim=0:A…[a];[0:a]atrim=0:B…[b];[0:a]atrim=B:C…,afade…[c];[a][b][c]concat=n=3:v=0:a=1"`),
  cutting at beat boundaries, so the bass drops twice.
- If HeyGen says the token expired: `npx hyperframes auth refresh` (no password needed).

## Step 3 — Design system

1. `cp $SKILL/assets/frame.<look>.md frame.md` — `broadcast-ink`, `pop-flash`, `product-performs`, `gym-physical` or `fitness-app` (`references/looks.md`).
2. Apply the palette and brand-mark colour (`references/design-system.md`). Keep the components and motion rules as written.
3. Broadcast Ink: paper acts invert the palette for punch. Use 1–3 of them: the brand drop, one feature, the end card.
4. For a premium or "designed" brief, run `design-taste-frontend`'s draw first and adopt its direction (see `references/looks.md`).
5. Blue/coloured type on a near-black ground must be a light tint of the brand colour, not its saturated base, to pass contrast.

## Step 4 — Storyboard

Write `STORYBOARD.md` with the arc and scene grammar in `references/story-arc.md`:
- frontmatter `format`, `duration`, `message`, `arc`, `mode: autonomous`, `music: none`;
- a `## Video direction` block with the beat formula and the music sections;
- one `## Frame NN` per scene with `transition_in: cut`, `duration`, `blueprint`, `sfx`, `asset_candidates`;
- a "Beats:" line, then Scene lines that place every element (font role, px, x/y) on a frame-relative beat.

**Shot density.** A 30–40s film needs about **16–20 shots**, not 8 scenes: a frame may hold 2–4
shots cut on its beats, and every beat changes something big (a word, a ground, a card, a ring, a
plate). Users read 8 still-ish scenes as "not enough".

**Recurring objects.** When an object spans frames (a barbell, activity rings, a counter), put a
**shared geometry block** in `_film-context.md`: exact positions and sizes, its state at each frame's
t=0, and how it changes. A beat that must *land* (a ring closing) needs its shot to start earlier
(half a beat) so the motion is visible.

Keep `asset_candidates` to `path — short description` with no commas or semicolons; longer lists are
parsed as file names and produce harmless 404 anomalies at assembly.

Copy honesty rules: only features the brand states; label any example as fictional; no invented
numbers, testimonials or logos. Use the brand's own pricing line, if any.

## Step 5 — Build

1. Packets:
   - `node $PL/frame-packets.mjs --project "$PWD" --storyboard "$PWD/STORYBOARD.md"`
   - Packets must be ≤ 48 KB, so cite at most 1–2 rule ids per frame; `compose` frames stay small.
   - Then write `.hyperframes/frame-packets/_film-context.md`: the Video direction block plus the worker build notes in `references/story-arc.md` § Worker notes.
2. Workers:
   - Dispatch **5–6 background sub-agents**, each building 1–2 frames. Each reads `_role.md`, `_film-context.md`, `frame.md`, then its packets.
   - Ask them to seek their frame in headless Chrome to verify beat hits and the safe zone.
3. HUD (Broadcast Ink only; skip for `"chrome": "none"`):
   - Fill the remaining `film.json` values (scene starts, bars = round(duration ÷ bar length)).
   - Run `node $SKILL/scripts/make-chrome.mjs --project .`.
4. Audio:
   - Fetch SFX with `node $PL/audio.mjs --storyboard ./STORYBOARD.md --hyperframes . --out ./audio_meta.json`, then `node $PL/audio.mjs fetch-sfx --storyboard ./STORYBOARD.md --hyperframes .`.
   - Then hand-place every cue on the grid in `audio_meta.json` (`references/sfx.md`): bgm `{path: film-bed.wav, volume: 0.85, source: host}`, each SFX with `source: host`.
5. Assemble (re-run all four lines after every frame or audio change):

```bash
sed -i '' 's/^- status: outline$/- status: animated/' STORYBOARD.md
node $PL/assemble-index.mjs --storyboard ./STORYBOARD.md --hyperframes .
node $SKILL/scripts/mount-chrome.mjs --project .   # skip when "chrome": "none"
node $PL/transitions.mjs inject --storyboard ./STORYBOARD.md --hyperframes .
```

## Step 6 — Verify

1. `npx hyperframes lint` must show **0 errors**. The `id_requires_css_escape`, `id_override_reduced_specificity` and file-size warnings are expected.
2. Run `npx hyperframes check`, then triage each error with `references/qa.md`. Known false positives come from echo outlines, split-flap layers and the HUD's difference blend. Fix everything else.
3. Snapshot about 3 moments per scene: `npx hyperframes snapshot --at "<times>"`, then read `snapshots/contact-sheet*.jpg`. Look for **stray elements leaking between scenes** (see `references/qa.md` § visibility), weak contrast on paper, and empty compositions.
4. Run `npx hyperframes preview --background`, then `node $SKILL/scripts/text-audit.mjs --url http://localhost:<port>/api/projects/<id>/preview --project .`. "brief" hits at slam peaks are fine; anything marked "PERSISTS" gets fixed.
5. Open the preview for the user and ask: **render now, or what changes?**

## Step 7 — Render and deliver (60fps)

```bash
npx hyperframes render --skill=product-launch-video --quality high --fps 60 --output renders/<brand>-launch-film-60fps.mp4
cp renders/<brand>-launch-film-60fps.mp4 <exports>/<Brand>-Launch-Film-60fps.mp4
```

- **The original high-quality master is the deliverable.** It's about 40+ Mbps (~330 MB for 60s) and plays everywhere. Do not re-encode it unless asked.
- If the user asks for a smaller upload copy, use `$SKILL/scripts/deliver.sh <master> <out>`: CRF 19 capped at 16 Mbps, −14 LUFS, −1.5 dB limiter, ~110 MB per minute. Its output name must differ from the master's by more than letter case (macOS treats `Foo.mp4` and `foo.mp4` as the same file).
- Report the real figures from `ffprobe` and `ebur128`: resolution, fps, duration, size, LUFS and peak.
- Send the contact sheet with the scene ids, so revisions can target one frame.
- Flat-colour looks without grain render small (10–35 MB for 35–45s). That is the codec, not low
  quality: pull a full-resolution crop of the most detailed frame to confirm before reporting.
- BGM volume caps at 1.0; quiet tracks land near −18 LUFS. Platforms normalise; say so.

## Step 8 — Record it

Keep a running record next to the projects: add a row and a short entry to `REELS.md` (title, date,
aspect, fps, length, final file, concept, music, look) and the post captions to
`exports/CAPTIONS.md` (LinkedIn, Instagram/TikTok, X ≤ 280 characters). Write captions from the
film's own lines and the brand's real claims.

## Another aspect ratio (adapt an approved film)

1. `rsync -a --exclude renders --exclude snapshots --exclude '.hyperframes/artifacts' <film>/ <film>-16x9/`
2. Back up the approved frames: `cp compositions/frames/*.html .hyperframes/frames-9x16/`.
3. Update `film.json` (width, height, zone), `BRIEF.md` (aspect, destination) and STORYBOARD
   frontmatter `format`; set every frame back to `status: outline`; add a 16:9 adaptation note under
   `## Video direction` (timing, copy, beats, shots and motion stay exactly; only layout changes; the
   approved frame is the reference); rewrite `_film-context.md` with the new safe zone and any shared
   geometry in the new layout.
4. Workers adapt 1–3 frames each from `.hyperframes/frames-9x16/<id>.html`. Wide layouts: big type
   left (~40%), the UI or visual right; stacks become rows; notifications top-right.
5. Assemble, verify and render as usual. Audio, music and SFX carry over untouched.

## References

| File | Read when |
|---|---|
| `references/looks.md` | Step 0/3: the five looks, when to use each, their rules |
| `references/design-system.md` | Step 3: palettes, type roles, components and motion rules |
| `references/story-arc.md` | Step 4–5: the 11-scene arc, scene grammar, worker notes |
| `references/sfx.md` | Step 5: SFX library profiles and placement on the grid |
| `references/qa.md` | Step 6: gotchas, false positives, fixes |
