# Design system — Broadcast Ink

The template is `assets/frame.broadcast-ink.md`. Copy it to the project as `frame.md`, then change only
the palette block and the brand-mark colour. Everything else (components, motion, zones) stays.

## Palettes

Swap these keys in `frame.md` → `colors`. Keep ink and paper; they are the grammar of the look.

| Palette | accent | paper-accent | accent-dim | When |
|---|---|---|---|---|
| **Ink + signal orange** (default, MockReps) | `#FF5B23` | `#D9480F` | `rgba(255, 91, 35, 0.18)` | Most brands; the warmest and most "broadcast" |
| Ink + electric brand colour | brand colour, lifted to full saturation | the same at about 15% darker | its 18% alpha | The brand wants its own colour as the accent |
| Paper-first + ink + orange | `#FF5B23` | `#D9480F` | as default | A calmer, editorial film: flip the default ground to paper and use ink acts for punch |

Rules:
- One accent per moment. Never put two accent elements on screen competing.
- Check `paper-accent` against paper at ≥ 3:1 for large text and ≥ 4.5:1 for small mono labels; darken it if needed.
- The brand's own colours appear only inside the official logo, unless the brand colour is the chosen accent.

## Type roles (bundled in `assets/fonts/`, all SIL OFL)

| Role | Font | Use |
|---|---|---|
| hero / slam | Anton 400 | Huge condensed caps; one word or short phrase per beat |
| tile / wordmark | Inter 900 | Split-flap tile letters, wordmarks |
| body | Inter 500 | Rare plain lines |
| serif accent | Cormorant Garamond 400/700, `font-style: italic` (synthesised) | One accent line per scene, sentence case, ends in a ✳ |
| mono | JetBrains Mono 400/700 | Labels, chapter tags, typed answers, counters; uppercase, tracked 0.16–0.18em |

The fonts don't include ■, ↳ or ✳. Draw them as small shapes or inline SVG.

## Signature components

These are specified in the template:
- **split-flap-tile:** a rounded tile with a seam. The top half folds through 4–7 deterministic scramble glyphs and locks on the beat, with a 1-frame seam flash.
- **echo-type:** a solid word with 3–5 outline copies trailing behind it. These use transparent fill and `-webkit-text-stroke`.
- **glitch-cut:** 2–5 frames of red and cyan channel copies plus displaced slices. Offsets come from the element's index.
- **accent-rule:** a 3–4px line drawn left to right on a beat.
- **serif-accent-line:** typed on at about 28ms per character, or risen in.
- **mono-tag:** a chapter label (`■ 02 — YOUR ROLE`) or a boxed tag.
- **brand-mark:** the official logo; strokes draw on as "reps".

## Motion rules

- Hits land exactly on beats. Arrivals are hard and fast: `expo.out` / `power4.out` over 0.18–0.35s, or instant swaps. Slams start at scale 1.15–1.35 with blur 8–10px → 0.
- Between hits something always moves a little (a creep, counter, scramble or meter). Hold still for at most 2 beats, except deliberate holds.
- Between scenes, use hard cuts only, on the beat. The glitch-cut sells the cut.
- Forbidden:
  - bounce, elastic, `back.out`, spins;
  - `repeat` / `yoyo`, `Math.random`, `Date.now`;
  - CSS transitions and keyframes;
  - tweening `letterSpacing` (it trips the `gsap_non_transform_motion` lint error);
  - crossfades between scenes.

## Root layers (built once, never by frames)

`scripts/make-chrome.mjs` writes `compositions/chrome.html` from `film.json`:
- **Corner brackets** that boot in during the first second.
- **Top row:** a REC square that blinks on the kick, the brand, a dim label and a scene counter `SC nn/NN`.
- **Bottom row:** a beat-pumping level meter with the BPM, a bar counter `BAR nn/NN`, and a mm:ss:ff timecode at the film fps.
- **Grain:** a feTurbulence plate shifted 12 times per second by a deterministic hash.
- **Vignette:** a soft radial vignette.

The HUD uses `mix-blend-mode: difference`, so it reads light on ink and dark on paper automatically.
