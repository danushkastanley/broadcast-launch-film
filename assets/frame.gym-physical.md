---
version: alpha
name: <Brand> — Gym physical (a product's steps as a gym session)
description: >
  A late-night gym. Black rubber floor, one cone of top light, chalk-white condensed type, a steel
  barbell, and calibrated Olympic plates in brand colour (the real 20 kg plate is blue). An LED rep
  counter in electric blue. The product's steps are framed as a training session: warm-up, sets, reps,
  cool-down. Punchy and playful, cut hard to a 98 BPM trap beat. No HUD, no corner brackets, no
  timecodes or countdowns.
unit: the frame — canvas 1080×1920 (9:16), 60fps
principle: one move per beat · type is heavy and chalky · the bar gets heavier as you practise

colors:
  floor: "#0B0E13"       # default ground (gym floor at night)
  floor-2: "#141922"     # raised surfaces: whiteboard frame, bench, card
  light: "#1C2330"       # the soft top-light pool (flat radial, not a colour gradient: one hue)
  chalk: "#F3F1EA"       # all big type and chalk marks
  steel: "#9AA3B2"       # barbell, collars, secondary labels
  steel-dark: "#5A6373"  # sleeve shading, hairline-free shadows
  plate: "#0E7C86"       # brand colour: the 20 kg plates, the accent fields
  plate-rim: "#0A5C63"   # plate rim / inner ring
  led: "#3FC1C9"         # LED rep counter segments (lit)
  led-off: "#0F2A2D"     # unlit LED segments
  board: "#F3F1EA"       # whiteboard surface (one scene)
  marker: "#0B0E13"      # marker ink on the whiteboard
  marker-blue: "#0E7C86" # second marker colour on the whiteboard
  brand-mark: "#000000"  # brand mark — only inside the official logo

fonts:
  display: { family: "Anton", file: "assets/fonts/Anton-400.woff2", use: "huge condensed caps: SET 1, REPS, the hero phrase" }
  heavy: { family: "Inter", file: "assets/fonts/Inter-900.woff2", weight: 900, use: "plate labels, chips, wordmark" }
  text: { family: "Inter", file: "assets/fonts/Inter-var.woff2", weights: "400–700", use: "one-line explanations, whiteboard items" }

typography:
  slam:  { font: display, px: "200–360", lineHeight: 0.88, case: upper, color: chalk }
  hero:  { font: display, px: "120–180", lineHeight: 0.9, case: upper }
  label: { font: heavy, px: "34–48", case: upper, tracking: "0.02em" }
  line:  { font: text, px: "40–48", weight: 600, lineHeight: 1.25, case: sentence, color: chalk }
  board: { font: text, px: "44–52", weight: 700, case: sentence, color: marker, note: "slight rotation −1° to +1° per line, like handwriting on a whiteboard" }

zones:
  canvas: "1080×1920"
  safe: "all words and key visuals inside x 60–960, y 200–1490 (right rail and bottom caption area are platform UI)"
  bleed: "floor, light pool, barbell sleeves and plates may run off the edges"

components:
  barbell:
    look: "a horizontal Olympic bar drawn in SVG/HTML: shaft 28px tall in steel with a 6px darker knurl band pattern (repeating 3px stripes, steel-dark) on the grip zones, sleeves 44px tall at both ends, collars as 24px-wide steel blocks. Sits at a fixed height in the scene; bleeds off both edges when loaded"
  plate:
    look: "a calibrated 20 kg bumper plate seen edge-on as it slides onto the sleeve: a tall rounded rectangle 64px wide × 440px tall, plate blue with a 10px plate-rim inset, a chalk label rotated 90° (Inter 900 30px) one word per product step. Front-on version (for the end card): a circle 520px with a centre hole, rim ring, '20 KG' chalk lettering and the word on it"
    motion: "slides onto the sleeve from off-screen on its beat (x tween 0.25s power4.out), lands with a 6px recoil (x back 6px and settle 0.12s power2.out — not a bounce ease), the whole bar dips 8px and returns (0.2s) as weight is added"
  led-counter:
    look: "seven-segment digits drawn as divs/SVG polygons, 220–300px tall, segments in led, unlit segments in led-off, a small label 'REPS' in Inter 900 steel above. Real LEDs have a soft glow: box-shadow 0 0 18px rgba(63,193,201,0.55) on lit segments only"
    motion: "a digit changes instantly on its beat (set), with lit segments flashing to full brightness and settling to 85% over 0.2s"
  chalk-slam:
    look: "Anton in chalk, tiny deterministic speckle texture optional (a few chalk-dust dots drawn from the index)"
    motion: "arrives from scale 1.25 + blur 8px → 1 in 0.18s expo.out on the beat; a puff of chalk dust (8–14 small chalk dots) scatters 20–60px from the word's edges and fades over 0.5s, positions from the index (never random)"
  whiteboard:
    look: "a white board 900×1100 with a floor-2 frame (24px), marker text lines, a hand-drawn tick or box per line (SVG strokes)"
    motion: "each line writes on left→right (clip-path inset reveal 0.3s) on its beat; ticks draw on (stroke-dashoffset 0.15s)"
  light-pool:
    look: "a soft flat ellipse of light colour behind the hero, 900×700, blurred 80px, opacity 0.9 — the one top light of a closed gym"
  chip:
    look: "rounded pill (radius 999), floor-2 fill with chalk text, or plate fill with chalk text (Inter 900 34px)"
    motion: "pops in on its beat (scale 0.6 → 1, 0.2s power4.out, no overshoot)"
  brand-mark:
    look: "the official logo SVG, never recoloured or redrawn"

motion:
  clock: "98.4 BPM. Beat = 0.6096s. Each frame's Scene lines give frame-relative beat times (n × 0.6096s): land hits exactly on them"
  rule: "every beat changes one thing: a word slams, a plate loads, a rep counts, a line writes"
  between hits: "the light pool breathes (opacity 0.85 ↔ 0.95 once per bar via fromTo, no repeat), the bar sways 2px, the camera group creeps 1 → 1.03"
  forbidden: "bounce/elastic/back eases, spins, repeat/yoyo, Math.random, Date.now, CSS animation/transition, tweening letterSpacing, HUD chrome, corner brackets, timecodes, countdown clocks, asterisk or sparkle marks, inline visibility:'visible'"
---

# Gym physical

A metaphor made physical: the product's steps become a training session. Each step loads another
plate on the bar, a counter climbs, and at the drop the bar goes up.

- **One accent:** the brand colour lives on the plates and the LEDs. Everything else is chalk on black.
- **Physical, not flat:** the bar has weight. Plates recoil, the bar dips, chalk dust puffs.
- **Honest content:** only features the brand states. Training language is a metaphor; claims are literal.
