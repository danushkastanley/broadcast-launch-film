---
version: alpha
name: Broadcast Ink (launch film)
description: >
  Cinematic broadcast-title look for a launch film. Near-black ink and warm paper
  grounds, off-white type, ONE hot accent (signal orange). Huge condensed kinetic type, split-flap
  letter tiles, outline "echo" type, glitch with RGB split, serif italic accent lines, mono
  metadata. A persistent HUD chrome + film grain overlay is built ONCE at the root — frames never
  draw it. The brand colour appears only inside the official logo mark.
unit: the frame — canvas from film.json (1080×1920 / 1920×1080 / 1080×1080 / 1080×1350)
principle: type is the image · one accent · every hit lands on the beat · nothing is ever fully still

colors:
  bg: "#0B0B0C"          # ink — the default ground
  ink-2: "#151517"       # raised ink (tiles on ink, panels)
  ink-3: "#232326"       # hairlines on ink, tile seams
  paper: "#ECE7DD"       # warm paper — the inverted acts
  paper-2: "#DED7CA"     # paper shade (tile seams on paper, panels)
  text: "#F2EEE6"        # off-white type on ink
  text-ink: "#0B0B0C"    # type on paper
  muted: "#8A857C"       # mono metadata, secondary
  muted-ink: "#6B665E"   # mono metadata on paper
  accent: "#FF5B23"      # signal orange — the ONLY accent
  accent-dim: "rgba(255, 91, 35, 0.18)"
  paper-accent: "#D9480F" # the accent on paper grounds (≥3:1 on paper; the bright accent fails there)
  rgb-red: "#FF2D2D"     # glitch channel split only
  rgb-cyan: "#00E5FF"    # glitch channel split only
  brand-mark: "#2455E6"  # REPLACE with the logo's own colour — used ONLY inside the official mark

fonts:
  display: { family: "Anton", file: "assets/fonts/Anton-400.woff2", weight: 400, use: "huge condensed caps — hero words, slams, montage" }
  tile: { family: "Inter", file: "assets/fonts/Inter-900.woff2", weight: 900, use: "split-flap tile letters, wordmark" }
  body: { family: "Inter", file: "assets/fonts/Inter-500.woff2", weight: 500, use: "rare plain lines" }
  serif: { family: "Cormorant Garamond", files: ["assets/fonts/CormorantGaramond-400.woff2", "assets/fonts/CormorantGaramond-700.woff2"], use: "accent lines, always font-style: italic (synthesised slant), sentence case" }
  mono: { family: "JetBrains Mono", files: ["assets/fonts/JetBrainsMono-400.woff2", "assets/fonts/JetBrainsMono-700.woff2"], use: "metadata, labels, typed answers, counters — uppercase, tracked" }

typography:
  hero:      { font: display, px: "220–340", lineHeight: 0.86, tracking: "-0.01em", case: upper }
  slam:      { font: display, px: "150–220", lineHeight: 0.9, case: upper }
  tile:      { font: tile, px: "150–200 inside a tile", case: upper }
  serif-line:{ font: serif, italic: true, px: "64–96", lineHeight: 1.05, color: accent or text }
  mono-label:{ font: mono, px: "22–30", weight: 700, tracking: "0.18em", case: upper, color: muted }
  mono-body: { font: mono, px: "36–44", weight: 400, lineHeight: 1.35, color: text }

zones:
  canvas: "film.json width × height"
  content: "film.json zone [x0, x1, y0, y1] — every word and key visual of a frame lives here"
  chrome: "the root HUD owns x 0–1080 within 64px of every edge (corner brackets, top/bottom metadata rows) — frames keep that margin clear"
  rail: "9:16 only: right of x 960 and below y 1500 is covered by platform UI on Reels/TikTok — background only"

components:
  split-flap-tile:
    look: "rounded rectangle (radius 18px), ink-2 fill on ink or bg #0B0B0C on paper; a 4px horizontal seam across the middle (ink-3 on ink, paper-2 on paper); letter in tile font, text colour (on ink) or paper (on paper tiles), centred"
    motion: "flaps through 4–7 scramble glyphs (deterministic sequence from the letter's index, e.g. 'A7#K2' rotations) ~45ms each, the top half folding down (rotateX on the top half, transform-origin bottom) for each flip, landing on the true letter exactly on its beat; a 1-frame white flash on the seam when it locks"
  echo-type:
    look: "the hero word solid in text colour; 3–5 copies behind it as 2px outlines (-webkit-text-stroke, transparent fill) in muted, larger or offset, fading in opacity 0.5 → 0.1"
    motion: "on a swap, the outlines lag the solid by 1–2 frames each (stagger), giving an echo trail"
  glitch-cut:
    look: "for 2–5 frames: the element duplicated into rgb-red and rgb-cyan copies offset ±6–14px horizontally (mix-blend-mode: screen on ink), 3–6 horizontal slices displaced ±20–80px, then snap clean"
    use: "on hard cuts and word swaps at most once per beat; deterministic offsets from the index — never Math.random"
  accent-rule:
    look: "a 3–4px signal-orange line"
    motion: "draws left→right on a beat (scaleX 0→1, transform-origin left, expo.out 0.35s)"
  serif-accent-line:
    look: "Cormorant Garamond italic, accent colour on ink or text-ink on paper, sentence case, no trailing mark (never an asterisk or sparkle: it reads as a third-party logo)"
    motion: "types on character by character (~28ms/char) or rises 30px with opacity"
  mono-tag:
    look: "mono-label in a 1px muted outline box or with a leading ■ square"
  brand-mark:
    look: "the official logo SVG, never recoloured or redrawn; rebuild it inline only to split its strokes for a draw-on"
    motion: "mark scales in on a hit; strokes draw one by one if the logo has strokes"

motion:
  clock: "film.json bpm. Beat k is at beat0 + k·(60 ÷ bpm) seconds of the FILM. Each frame's Scene lines give frame-relative beat times — land hits on them exactly."
  arrivals: "hard and fast: expo.out / power4.out 0.18–0.35s, or instant cuts. Slams start at scale 1.15–1.35 with a short directional blur (filter: blur 8→0px) and land in 0.2s."
  between hits: "something always moves a little: a slow scale creep (1.00→1.03 over a few beats), a counter ticking, a scramble resolving — never a dead hold longer than 2 beats except where a Scene says HOLD"
  forbidden: "bounce, elastic, back.out overshoot, spins, rubber-banding, infinite repeat/yoyo, Math.random, Date.now, CSS transitions/keyframes, crossfades between whole scenes"

atmosphere:
  - "Ink frames: a very faint radial lift (#141416 centre → bg edges), optional 1px ink-3 crosshair guide lines through centre at 40% opacity."
  - "Paper frames: flat paper with a faint vignette (paper-2 at the edges)."
  - "No gradients of colour, no bokeh, no glow except a subtle orange text-shadow on accent hero words (0 0 24px accent-dim)."
---

# Broadcast Ink

The launch film looks like a late-night broadcast title sequence: big condensed type cut hard to the
kick drum, split-flap boards, outline echoes and glitches, all framed by a quiet HUD and film grain.

- **One accent.** The accent colour carries every emphasis: the one key word, the rule, the
  highlight. Never two accent things competing in one moment. On paper, use the darker paper-accent.
- **Two grounds.** Ink is the default; paper acts invert the palette for punch. The root HUD and
  grain sit above both and adapt automatically. Frames never draw corner brackets, metadata rows,
  BPM counters, timecodes or grain.
- **Type is the image.** Hero words fill the content width. Copy is short: a word, a phrase, a mono
  label, one serif line.
- **Honest content.** Only features the brand states. Example content is marked as fictional.
