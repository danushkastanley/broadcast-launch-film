---
version: alpha
name: <Brand> — Pop Flash (multi-colour hype film led by the brand colour)
description: >
  Loud, flashing, poster-pop motion. Full-bleed colour grounds that cut on the beat, giant condensed
  type that fills the screen, split panels, crossing marquee bands, iris and stripe wipes, sticker
  chips, halftone texture. Blue leads (cobalt / electric / midnight), with hot pink, acid lime and
  sunshine yellow as flash colours and black / white as strobe hits. No HUD, no corner brackets, no
  metadata rows, no clocks or countdowns. The brand colour appears only inside the official logo mark.
unit: the frame — canvas 1920×1080, 60fps
principle: every beat changes something big · colour is the rhythm · type fills the frame · never still

colors:
  cobalt: "#0E7C86"      # LEAD ground — the most-used colour in the film
  electric: "#3FC1C9"    # second blue ground / accent
  midnight: "#0B2A33"    # deep blue ground, and the dark type colour
  white: "#FFFFFF"
  ice: "#DDF2F3"         # pale blue (outline echoes on blue, quiet panels)
  pink: "#FF2E88"        # hot pink — flash ground and accent
  lime: "#C8FF2E"        # acid lime — flash ground and accent
  yellow: "#FFD60A"      # sunshine yellow — flash ground and accent
  black: "#07070A"       # strobe hits only
  brand-mark: "#000000"  # brand mark — ONLY inside the official logo

pairs: # ground → allowed type colours (big type first). Never put type on a ground not listed here.
  cobalt: [white, yellow, lime]
  electric: [midnight, white]
  midnight: [white, lime, yellow, pink, electric]
  white: [cobalt, midnight, pink]
  pink: [white, midnight]
  lime: [midnight, cobalt]
  yellow: [midnight, cobalt]
  black: [lime, white, yellow, pink]

fonts:
  display: { family: "Anton", file: "assets/fonts/Anton-400.woff2", weight: 400, use: "giant condensed caps — every hero word" }
  heavy: { family: "Inter", file: "assets/fonts/Inter-900.woff2", weight: 900, use: "sticker chips, panel labels, the wordmark" }
  mono: { family: "JetBrains Mono", files: ["assets/fonts/JetBrainsMono-400.woff2", "assets/fonts/JetBrainsMono-700.woff2"], use: "tiny tags only (FICTIONAL EXAMPLE, url) — uppercase, tracked 0.14em" }

typography:
  mega:   { font: display, px: "380–760", lineHeight: 0.82, case: upper, note: "one word, fills 70–95% of the frame width or height" }
  hero:   { font: display, px: "200–340", lineHeight: 0.86, case: upper }
  panel:  { font: display, px: "110–200", lineHeight: 0.9, case: upper }
  chip:   { font: heavy, px: "34–56", case: upper, tracking: "0.02em" }
  tag:    { font: mono, px: "20–26", weight: 700, tracking: "0.14em", case: upper }

zones:
  canvas: "1920×1080, no HUD — the whole canvas is yours"
  text: "all type inside x 96–1824, y 72–1008 at rest (mega words may bleed past during a slam peak only if they are a full-bleed texture copy, never the readable copy)"
  bleed: "grounds, panels, stripes, bands, rings and halftone go edge to edge and beyond"

components:
  colour-cut:
    look: "the frame's ground is a full-bleed layer whose background colour is SET (not tweened) on beats"
    motion: "gsap.set at the beat time. Max one full-field ground change per beat (never on half-beats) — photosensitivity rule"
  beat-pump:
    look: "the frame's main content group"
    motion: "on every beat: scale 1.045 → 1 over 0.3s power2.out (fromTo, at the beat). Gives the whole frame a kick-drum pulse"
  mega-slam:
    look: "one Anton word, mega size, in a pair colour"
    motion: "arrives on its beat from scale 1.3 + blur(10px) → scale 1 + blur 0 in 0.18s expo.out; between beats a slow creep 1 → 1.03 (linear)"
  echo-stack:
    look: "the hero word repeated 5–7 times in a vertical (or horizontal) stack, alternating solid and 3px outline (-webkit-text-stroke, transparent fill) in the pair colour; the readable copy is the solid one in the middle"
    motion: "the stack slides 1 row per beat (y, 0.22s expo.out) so the words seem to scroll on the kick"
  split-panels:
    look: "2, 3 or 4 full-height vertical panels (or horizontal bands), each its own ground colour from the palette, each holding one panel word or chip; hard edges, no gaps"
    motion: "panels cut in one per beat: each wipes in from its edge (clip-path inset 100% → 0) in 0.22s expo.out, or is SET instantly"
  marquee-band:
    look: "a full-width band 110–150px tall, tilted -6° or +5° (static tilt), ground colour + one repeating Anton or Inter 900 line separated by ' — ' or ' · ' (never asterisks, never sparkles)"
    motion: "x moves linearly across the whole frame duration (one linear tween, ease none); two bands cross in opposite directions"
  iris-wipe:
    look: "the next ground colour revealed by a growing circle"
    motion: "clip-path circle(0% at cx cy) → circle(150%) in 0.3s expo.out, starting ON the beat (counts as that beat's ground change)"
  stripe-wipe:
    look: "6–9 diagonal stripes (skewX -18°) of the next ground colour"
    motion: "stripes slide across left→right staggered 0.02s, 0.28s total, ending covering the frame; counts as a ground change"
  ring-burst:
    look: "2–3 concentric circles, stroke 18–28px, in a pair colour, centred on the hero"
    motion: "on a hit: scale 0.2 → 2.4 and opacity 1 → 0 over 0.45s expo.out, rings staggered 0.06s"
  sticker-chip:
    look: "a rounded pill (radius 999px, padding 18px 34px) in a palette colour with chip type in a pair colour, static tilt −5° to +5°, optional 5px midnight offset shadow (box-shadow 8px 8px 0 midnight)"
    motion: "pops in on its beat: scale 0 → 1 in 0.2s power4.out (no overshoot)"
  halftone:
    look: "a dot grid texture (radial-gradient dots 6px on a 22px grid) in white or midnight at 10–16% opacity over a ground"
    motion: "drifts slowly (background-position linear across the frame)"
  strobe-hit:
    look: "a full-frame white (or black) flash"
    motion: "opacity 1 → 0 over 0.12s, ONLY on section hits named in the Scene lines (drop, main drop, final hit)"
  ui-card:
    look: "an abstract product card: white fill, 5px midnight border, radius 36px, box-shadow 14px 14px 0 midnight; holds a tiny tag, a big line and one simple visual (waveform bars, S·T·A·R tiles, highlighted sentence). Never a real screenshot"
    motion: "slams in on a beat (y 80 → 0, scale 0.92 → 1, 0.22s expo.out); its inner bits react to the beat"
  brand-mark:
    look: "the official logo SVG (public/logo.svg), never recoloured or redrawn, only scaled; inline it to draw its three strokes"
    motion: "scales in on a hit (1.3 → 1 + blur 10 → 0, 0.22s); strokes draw one by one"

motion:
  clock: "132 BPM. Film beat k = k × 0.454545s. Each frame's Scene lines give frame-relative beat times — land hits on them exactly"
  arrivals: "hard and fast: expo.out / power4.out 0.15–0.3s, or instant sets. Slams start at scale 1.2–1.35 with blur 8–10px"
  between hits: "something always moves: beat-pump, marquee drift, halftone drift, creep — never a dead hold"
  forbidden: "bounce, elastic, back.out overshoot, spins, rubber-banding, infinite repeat/yoyo, Math.random, Date.now, CSS transitions/keyframes, crossfades between whole scenes, tweening letterSpacing, HUD chrome, corner brackets, timecodes, BPM counters, countdown clocks, asterisk or sparkle marks"
  flashes: "photosensitivity: at most ONE full-field ground/luminance change per beat (≤ 2.2 per second). Fast half-beat or 8th-note swaps are allowed only on elements smaller than a quarter of the frame (words, chips, panels' text)"
---

# Pop Flash

A hype reel that looks like a pop poster wall cut to an EDM track. Colour IS the rhythm: the ground
changes on the kick, words slam to fill the screen, panels split the frame, bands of text cross it.

- **Blue leads.** Cobalt is the home colour; electric and midnight are the other blues. Pink, lime and
  yellow are flash colours: they arrive on hits and leave on the next beat. Black and white are for
  strobe hits and the end card.
- **One idea per beat.** Each beat changes one big thing: the ground, the word, a panel, a chip.
- **Type is the image.** Copy is short: one to three words a beat. Fill the frame.
- **No chrome.** Nothing on the edges: no brackets, no metadata rows, no counters, no clocks.
- **Honest content.** Only features the brand states. Any example answer is marked FICTIONAL EXAMPLE.
