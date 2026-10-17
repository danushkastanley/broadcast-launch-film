---
version: alpha
name: <Brand> — Fitness app (a metaphor told through premium app UI)
description: >
  A product's steps framed as a workout, designed like a premium fitness app on an OLED phone: pure black
  ground, rounded dark cards, big tabular numerals, four activity rings that close one by one (one per product step), iOS-style pickers, toggles, segmented controls, interval timers and live
  graphs. Full-screen app UI with no device frame, no status bar, no HUD and no countdowns. Cut to a
  98 BPM trap beat with about 18 shots.
unit: the frame — canvas 1080×1920 (9:16), 60fps
principle: every beat, the app does something · numbers and rings carry the story · polished, bright, satisfying

colors:
  bg: "#000000"          # OLED black ground
  card: "#121419"        # card surface
  card-2: "#1C1F26"      # raised control / inner surface
  line: "#2A2E37"        # control borders inside cards (1–2px)
  text: "#FFFFFF"
  text-2: "#8E95A3"      # secondary labels
  blue: "#14A3AE"        # primary action button fill (brand colour, brightened for OLED)
  ring-1: "#5B8CFF"   # ring 1 — step 1 (outermost)
  ring-2: "#33E1C5"   # ring 2 — step 2
  ring-3: "#C6F432"  # ring 3 — step 3
  ring-4: "#FF6B8B" # ring 4 — step 4 (innermost)
  track: "22% opacity of each ring colour"  # unfilled ring track
  brand-mark: "#000000"  # brand mark — only inside the official logo

fonts:
  sans: { family: "Inter", file: "assets/fonts/Inter-var.woff2", weights: "400–800", use: "all UI text; tabular numerals for every number (font-variant-numeric: tabular-nums)" }
  heavy: { family: "Inter", file: "assets/fonts/Inter-900.woff2", weight: 900, use: "giant workout titles and numerals" }

typography:
  mega-num:  { font: heavy, px: "220–320", tracking: "-0.04em", leading: 0.9, note: "rep counts, ring percentages" }
  title:     { font: heavy, px: "96–132", tracking: "-0.035em", leading: 0.95, case: sentence }
  heading:   { font: sans, weight: 800, px: "56–68", tracking: "-0.02em" }
  body:      { font: sans, weight: 600, px: "38–44", leading: 1.25 }
  label:     { font: sans, weight: 700, px: "28–32", color: text-2, note: "sentence case or the app's small caps" }
  metric:    { font: sans, weight: 800, px: "64–96", tabular: true }

zones:
  canvas: "1080×1920, full-screen app UI, no phone frame, no status bar"
  safe: "all text and key UI inside x 60–960, y 200–1490 (right rail and bottom caption area are platform UI); the screen background and big rings may extend beyond"
  margin: "UI cards inset 60px from the left; cards 960px wide max (x 60–1020 is allowed for card backgrounds; text inside them stays ≤ x 960)"

components:
  card:
    look: "card fill, radius 40px, padding 44px; no shadows (OLED apps use tone, not shadow); inner rows separated by 24px space or a card-2 inset"
    motion: "rises 40px + opacity 0 → 1, 0.35s expo.out on its beat; siblings stagger 60ms"
  activity-rings:
    look: "four concentric SVG rings, stroke 52px (scaled for smaller instances), round caps, gap 10px between rings, each with its 22% track. Outer → inner: step 1 (ring-1), step 2 (ring-2), step 3 (ring-3), step 4 (ring-4). Start angle at 12 o'clock, clockwise"
    motion: "a ring closes with stroke-dashoffset to 0 over 0.5s power3.out landing ON its beat; on close: the ring's cap flashes white for 2 frames, the whole ring scales 1 → 1.04 → 1 (0.25s), and a 'haptic' pulse — a soft ring-coloured circle expanding 1 → 1.3 and fading (0.4s)"
  ring-pill:
    look: "small pill with a coloured dot and label (e.g. '● Step 1 · closed'), card-2 fill, radius 999"
  picker-wheel:
    look: "an iOS-style picker: 5 visible rows, the centre row 64px in text, rows above/below smaller and dimmer (opacity 0.55 / 0.25), a card-2 selection band behind the centre row (radius 20)"
    motion: "scrolls row by row on beats (y tween 0.18s power3.out each), landing on the target; deterministic list"
  segmented:
    look: "card-2 track radius 999, segments 34px weight 700, the selected one with a white pill and black text"
    motion: "selection pill slides 0.22s power3.out"
  toggle:
    look: "iOS switch 100×60, off = card-2, on = ring-3 or blue, white knob"
    motion: "knob slides 0.2s power3.out, track colour sets"
  interval-bar:
    look: "a segmented progress bar of N segments (radius 999, 18px tall, 10px gaps); filled = the set's ring colour, empty = its track"
  live-graph:
    look: "a scrolling line graph like a heart-rate trace, 4px stroke in ring-3, with a soft fill below at 15% opacity of the same colour (flat, not a gradient), current value dot at the right edge"
    motion: "the line scrolls left continuously (x tween, linear); values deterministic from time (sum of sines); each beat adds a peak"
  button:
    look: "full-width primary button: blue fill, radius 999, 120px tall, white text 44px weight 800"
    motion: "press = scale 0.97 + a progress ring or fill sweeping inside (for hold-to-start)"
  notification:
    look: "iOS-style banner card: card fill at 92% opacity, radius 40, app icon (the official brand mark 72px) at left, app name + 'now' in text-2, title 40px weight 700, body 36px"
    motion: "drops from y −40 + opacity, 0.3s expo.out; stacks push down"
  brand-mark:
    look: "the official logo SVG (public/logo.svg), never recoloured or redrawn"

motion:
  clock: "98.4 BPM. Beat = 0.6096s. Each frame's Scene lines give frame-relative beat times (n × 0.6096s)"
  shots: "frames contain several shots; a shot change inside a frame is a hard cut on the beat (set), optionally with a 0.18s push (scale 1.04 → 1) on the incoming shot"
  rule: "every beat, something in the app happens: a ring closes, a picker ticks, a toggle flips, a number counts, a card lands"
  numbers: "counting numbers tick on beats or tween with snap: 1 (tabular, never jitter width)"
  between hits: "the UI breathes: subtle scale creep 1 → 1.02 on the main card, graphs keep scrolling, ring caps keep a faint glow"
  forbidden: "bounce/elastic/back eases, spins, repeat/yoyo, Math.random, Date.now, CSS animation/transition, tweening letterSpacing, device frames, status bars, HUD chrome, corner brackets, timecodes, countdown clocks, asterisk or sparkle marks, emoji, inline visibility:'visible'"
---

# Fitness app

The product's steps are the workout, told through premium app UI: notifications, a workout card,
pickers, toggles, interval sets, live graphs, and four activity rings that close one by one on the
beat. Hold to start. The drop lands on "Workout complete" and the end card.

- **The rings are the through-line.** Ring colours are fixed per step across the whole film.
- **Bright on black.** Colour lives in the rings, toggles and graphs; text is white and grey.
- **Honest content.** Every feature named is one the brand states. The workout language is a metaphor:
  no invented stats, streaks, scores or results. Example content is labelled fictional.
