---
version: alpha
name: <Brand> — The product performs (premium launch film)
description: >
  A calm, premium product film. White and pale-blue grounds, one near-black ink, the brand colour as
  the only accent (used as whole flat fields and on the one action). One typeface, Inter, at two or
  three sizes. The pictures are the product itself: the two real app screens and true-size interface
  fragments built in HTML, performing their job while a pointer operates them. Art direction dealt by
  design-taste-frontend (direction "The product performs", seed 990501784), with the brand's own type
  and colours kept.
unit: the frame — canvas 1920×1080, 60fps
principle: the product does the talking · one large thing per screen · nothing decorative · everything moves gently

colors:
  bg: "#FFFFFF"          # ground
  surface: "#F1F6F7"     # one-step tone: second ground, stage behind fragments
  ink: "#12202A"         # all running text and headlines; also the dark field
  muted: "#53647B"       # secondary notes only (never running text)
  accent: "#0E7C86"      # brand colour: whole flat fields, the one action, the slider passed-track
  accent-ink: "#FFFFFF"  # type on accent fields
  tint: "#E6F4F5"        # inside product fragments only (selected states, pills)
  line: "#DCE8EA"        # inside product fragments only (control borders)
  brand-mark: "#000000"  # brand mark — only inside the official logo

fonts:
  sans: { family: "Inter", file: "assets/fonts/Inter-var.woff2", weights: "400 / 500 / 600 (variable)", use: "everything" }

typography: # five sizes on the whole film, no more
  display:   { px: 132, weight: 500, tracking: "-0.045em", leading: 0.96, case: sentence, note: "two lines max; the one large thing on a screen" }
  head:      { px: 76,  weight: 500, tracking: "-0.035em", leading: 1.0, case: sentence, note: "two lines max" }
  statement: { px: 40,  weight: 500, tracking: "-0.02em",  leading: 1.25, case: sentence, note: "≤ 25 words, ≤ 3 lines" }
  body:      { px: 28,  weight: 400, tracking: "-0.01em",  leading: 1.45, colour: "ink (muted only for secondary notes)" }
  small:     { px: 22,  weight: 500, tracking: "0",        leading: 1.3 }

zones:
  canvas: "1920×1080; no HUD, no chrome, no film grain"
  margins: "96px left/right, 80px top/bottom; text never closer to an edge"
  alignment: "one vertical alignment at x 518 (27% of the width) carries the hero column and recurs; a second text edge at x 96"
  fields: "flat colour fields run edge to edge; split edges are clean vertical lines at x 960"

components:
  fragment:
    look: "a true-size cropped piece of the product interface, root marked data-ui. Inside it the product's own conventions apply: white cards, 1–2px #DCE8EA control borders, 16px radius, #E6F4F5 selected states, the app's small caps labels, the site's soft shadow `0 16px 48px -24px #375f9838, 0 2px 6px #254b7910` on the floating card only. Text inside at 22–30px so it reads on video. Never a browser or laptop frame, never grey placeholder bars"
    sources: "assets/ui/<screen>.png — the product's real app screens, captured from its site (npx hyperframes capture). Everything else is built in HTML to match them exactly (Inter, same borders, radii, pills, blue #2F6FED-ish selection ring = use accent #0E7C86)"
  pointer:
    look: "a standard macOS arrow cursor drawn as inline SVG (black fill, white 2px outline), 34px tall"
    motion: "moves between targets with power2.inOut 0.5–0.7s; a click is a 0.12s scale 1 → 0.88 → 1 on the cursor plus a 0.2s press state on the target"
  field-split:
    look: "two flat fields meeting on a clean vertical edge (x 960), e.g. accent | white, ink | white"
  slider:
    look: "a real range control: an 8px solid track (passed part in ink, rest in #DCE8EA), a 32px square thumb in accent, stage names at small size under the stops (current in ink, others muted)"
  type-on:
    look: "text appearing as if typed into the fragment: characters reveal left → right at 26–34ms per char with a 2px accent caret"
  logo:
    look: "the official logo SVG (public/logo.svg), never recoloured or redrawn"

motion:
  clock: "120 BPM. Beat k = k × 0.5s of film time. A soft musical phrase hit every 4.0s (film 0, 4, 8 … 40). Scenes start on phrase hits; inside a scene every arrival lands on a 0.5s beat"
  entrance: "the parts of a screen arrive in order — heading, then text, then fragment — staggered 70–90ms, each rising 24–32px with opacity 0 → 1, 0.8–0.9s, power3.out (or expo.out for the fragment)"
  drift: "the one large thing on a screen breathes: scale 1.00 → 1.025 linear across the scene, or a slow 20–40px pan"
  operate: "fragments are operated by the pointer: hover → click → state change (selected ring, pill, typed text, slider thumb)"
  transitions: "between scenes a 0.6s crossfade that starts on the phrase hit (set by the storyboard); inside a scene, swaps are 0.4–0.6s crossfades or rises — never slams"
  forbidden: "slams, strobes, flashes, glitches, RGB split, bounce/elastic/back, spins, repeat/yoyo, Math.random, Date.now, CSS animation/transition, tweening letterSpacing, blur > 6px"

house-rules: # design-taste-frontend, measured on every frame
  - "headlines two lines or fewer"
  - "no eyebrow labels above headings, no pill badges above headlines"
  - "no monospace anywhere"
  - "no index numbering (01 / 02 / Step 2)"
  - "no thin rules, hairlines, outlined boxes, grid lines or crop marks outside data-ui fragments"
  - "no gradients, no glows, no shadows on things at rest (the site's soft shadow is allowed only on a floating product card inside data-ui)"
  - "no tiny uppercase letter-spaced labels outside data-ui"
  - "no icon cards, no rows of identical cards, no glass/blur panels, no emoji, no decorative shapes"
  - "no styled accent word in a headline: one face, one colour per line"
  - "left-aligned; centre at most one moment (the end card)"
  - "running text in full ink; grey only for secondary notes"
---

# The product performs

Software is most convincing doing its job in front of you. Every screen holds one large thing — a
sentence or a true-size piece of the product — and a pointer quietly operates it. Colour comes in
whole calm fields (white, pale tone, the brand colour, ink), never as decoration.

The idea comes from the subject itself (its name, its output, its ritual), written as one sentence
before building: "On this film, <something only this brand has> becomes <the device>."
