# Story arc and scene grammar

## The proven arc (MockReps, 60.8s, 128 BPM, 11 scenes)

The structure is value-first: tension on the build, the brand on the drop, proof through full energy, the payoff in the breakdown, the logo on the final hit.

| # | Scene | Music section | Beats | Ground | Engine |
|---|---|---|---|---|---|
| 01 | Cold open: an accent line slices the frame on the swell's hit; a mono countdown ticks once per kick | intro swell + first kicks | ~8 | ink | mono counter, accent-rule |
| 02 | The questions: a split-flap departure board flips in four real prompts, then scrambles | kick-only build | 12 | ink | split-flap board |
| 03 | The blank: "YOU KNOW THE ANSWER." → "THEN THE QUESTION LANDS." glitches apart → serif "and nothing comes out." → a one-beat blackout | build end | 14 | ink | slam + glitch + type-on |
| 04 | **Drop:** paper cut; split-flap wordmark tiles lock two per beat; rule; serif tagline | **the drop** | 10 | paper | split-flap wordmark |
| 05 | Feature 1: echo-type hero + beat-pumping waveform + mono subline | full energy | 10 | ink | echo-type, deterministic bars |
| 06 | Feature 2: a word slot swaps on every beat with echo trails, locks on an accent word; chips; serif line | full energy | 10 | ink | in-place token cycle |
| 07 | Feature 3: big split-flap tiles (S T A R) with mono captions; serif line | full energy | 10 | paper | split-flap tiles |
| 08 | Feature 4: a mono answer types, a scan bracket finds the gap, a callout flags it, two slams (labelled FICTIONAL EXAMPLE) | full energy | 10 | ink | type-on + scan + slam |
| 09 | Montage: 8 words, one per beat, alternating ink and paper, rotating entrances; then "PUT / IN / THE / REPS." stacks and glitches | full energy end | 16 | alternating | kinetic beat-slam |
| 10 | Payoff: rep 01 / 02 / 03 of the same answer: rambling (struck), vague (struck), clear (highlighted) → serif "Walk in ready." | breakdown | ~23 | ink | type-on + strike + highlight |
| 11 | End card: mono tagline glitch-builds through the swell; **on the final hit** a paper cut, the logo slams and its strokes draw; wordmark, URL, pricing line | swell + final hit | ~7 | ink → paper | logo assemble |

For other brands, keep the structure: hook on the build, brand on the drop, 3–4 feature scenes, montage, payoff, logo on the final hit. Then swap in the product's own problem, features and payoff. For 30s, drop 02, 05 and 10, and shorten 09 to 8 beats. For 90s, add feature scenes, not longer ones.

## Scene grammar in STORYBOARD.md

```markdown
## Frame 05 — Say it out loud

- scene: Ink. "SAY IT" with outline echoes, a beat-pumping voice waveform, then "OUT LOUD." and the mono line "TEXT OR REAL-TIME VOICE".
- voiceover: ""
- duration: 4.6875s
- transition_in: cut
- status: outline
- src: compositions/frames/05-voice.html
- type: key_feature
- persuasion: Show-don't-tell proof
- beat: confidence
- blueprint: kinetic-type-beats (Adapt)
- sfx: digital glitch
- asset_candidates:

Beats: n × 0.469 (n = 0…9).
Scene 1 (0.0–0.938s): chapter mono-tag "■ 01 — PRACTISE" at x 90, y 300. Echo-type "SAY IT" (Anton 300px, x 90, y 380–640) slams in on 0.0 …
Scene 2 (0.938–2.813s): …
```

- Every Scene line names its font role and px, its x/y inside the zone, the move, and the **frame-relative beat time** it lands on.
- Durations are whole beats. Frame start times are `beat0 + k·period` and go into `film.json` `scenes`.
- Size hero words so that the slam's peak scale still fits the zone, or scale from the left edge.
- Copy is short: a word, a phrase, one mono line, one serif line per scene.

## Worker notes (append to `.hyperframes/frame-packets/_film-context.md`)

```markdown
## Build notes for every frame worker (from the orchestrator)

- Canvas <W>×<H>. Captions: disabled. No narration: time every reveal to the beat times in your Scene lines.
- Declare @font-face inside your <template> for the fonts you use, with project-relative URLs:
  assets/fonts/Anton-400.woff2 ("Anton"), assets/fonts/Inter-900.woff2 ("Inter", 900),
  assets/fonts/Inter-500.woff2 ("Inter", 500), assets/fonts/CormorantGaramond-400.woff2 and -700
  ("Cormorant Garamond"; font-style: italic, synthesised), assets/fonts/JetBrainsMono-400.woff2 and -700 ("JetBrains Mono").
- Paint your full-bleed ground (ink or paper) on a full-duration background clip layer, never on #root.
- Do NOT draw HUD chrome (corner brackets, metadata rows, BPM/bar counters, timecodes) or film grain: a root
  overlay provides them. Keep a 64px margin clear on every edge. Chapter mono-tags in your Scene lines ARE yours.
- Keep all text inside the zone x <x0>–<x1>, y <y0>–<y1>, including at the peak of slams.
- Never set an inline `visibility: "visible"` from script: it overrides the hidden state of an inactive scene and
  leaks the element into every other scene. Toggle with "inherit" / "hidden", or with opacity.
- Never tween letterSpacing. Deterministic everything (indices/time, never Math.random). No CSS animation.
  Entrances use fromTo. No back/elastic/bounce eases.
- Split-flap tiles, echo type, glitch-cut, accent-rule, serif-accent-line and the brand mark are components in
  frame.md: follow those recipes. Fonts lack ■ ↳: draw them. Never add an asterisk/sparkle mark after lines.
```

Dispatch prompt per worker: read `_role.md`, `_film-context.md` (these notes override generic role defaults), `frame.md`, then the packet(s). Give PROJECT_DIR, frame ids and output paths, canvas and "Captions: disabled". Ask the worker to seek its frame in headless Chrome to verify beat hits and the zone. Writing the file is its terminal action.
