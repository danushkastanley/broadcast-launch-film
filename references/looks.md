# Looks

The pipeline (music first, every scene on a beat, workers, QA, a 60fps master) stays the same. The
**look** changes. Each look has a design-system template in `assets/`; copy it to `frame.md` and
remap its placeholder colours (a teal brand colour) to the brand. Each was proven on a real 30–45s
film at 60fps.

| Look | Template | HUD chrome | Feel | Best for |
|---|---|---|---|---|
| Broadcast Ink | `frame.broadcast-ink.md` | yes | late-night title sequence: ink/paper, grain, split-flap, glitch, one hot accent | a cinematic launch film (~60s) |
| Pop Flash | `frame.pop-flash.md` | **no** | loud, flashing, multi-colour poster pop; giant type, split panels, marquee bands, iris/stripe wipes | punchy hype reel, LinkedIn/X attention |
| The product performs | `frame.product-performs.md` | **no** | calm and premium; white/pale fields, one typeface, true-size product UI operated by a pointer | elegant product film; brands with real app screens |
| Gym physical | `frame.gym-physical.md` | **no** | a metaphor made physical (barbell, plates, chalk, LED counter) | concept films built on a pun or metaphor |
| Fitness app | `frame.fitness-app.md` | **no** | premium OLED app UI: activity rings, pickers, toggles, live graphs, notifications | a metaphor told *through* app UI; very shareable |

Ask which look (or offer 3–4 concept options with a recommended one) when the user asks for "a new
concept" or "a different design". Users who say a cut has "not enough scenes" want **more shots and
more motion per beat** — move to Pop Flash or Fitness app density (see SKILL.md § Shot density).

## Pop Flash — rules that matter
- Colour IS the rhythm: the full-bleed ground changes on the kick.
- **Photosensitivity:** at most ONE full-field ground/luminance change per beat (≤ about 2.2/s at 132 BPM),
  never on half-beats. Strobes (white flash 0.12s) only on section hits. Half-beat energy goes on
  elements smaller than a quarter of the frame.
- Type colours only from the template's `pairs` table (each ground lists its legal type colours).
- Check: outline echo stacks need an even row scroll (scroll 2 rows per beat when rows alternate
  solid/outline) so a SOLID readable word always sits on the centre line.

## The product performs — rules that matter
- Run `design-taste-frontend`'s draw for art direction first (`node <taste>/scripts/draw.mjs …
  --options 3`, then `--direction <id>`); with an existing brand keep the brand's palette and type
  (its `--keep palette,type` rule) and take composition only.
- House rules from the taste skill apply outside product fragments: no eyebrows, no monospace, no
  01/02 numbering, no thin rules, no gradients/glows/shadows-at-rest, headlines ≤ 2 lines, one face.
- Pictures are the product: capture the site (`npx hyperframes capture <url>`), use its real app
  screenshots (`capture/assets/*.png`), rebuild other fragments in HTML to match them exactly, mark
  fragment roots `data-ui`.
- Scenes crossfade on the music's phrase hits: `transition_in: crossfade 0.6s` (frame 1 `cut`).
- Find the idea in the subject (its name, its output, its ritual) before building.

## Gym physical / Fitness app — rules that matter
- A recurring object that spans cuts (barbell + plates, the activity rings) needs a **shared
  geometry block** in `_film-context.md`: exact positions/sizes/colours, what state it is in at each
  frame's t=0, and how it changes. Without it, parallel workers draw different objects.
- Fitness app: rings close with a 0.305s dashoffset tween that **ends on the beat**; cut to the ring
  shot on the half-beat before (ring beat − half a beat), never on the landing beat itself.
- Metaphor language is fine; claims stay literal (no invented stats, streaks, scores or results).
- No device frame, no status bar.

## Broadcast Ink
See `design-system.md` (palettes, components, HUD). The HUD is optional in every other look.
