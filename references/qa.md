# QA — gotchas, false positives, fixes

## Real bugs seen in the MockReps build

| Symptom | Cause | Fix |
|---|---|---|
| A small white block appears in the same spot across many scenes | A worker toggled a cursor with `el.style.visibility = "visible"`. An explicit `visible` on a child overrides the inactive scene's hidden state, so it leaks film-wide | Use `"inherit"` / `"hidden"` (or opacity). Grep all frames: `grep -n '"visible"' compositions/frames/*.html`. Find leaks with `document.elementsFromPoint(x, y)` at a seek |
| `gsap_non_transform_motion … letterSpacing` lint **error** | A tween on letterSpacing | Remove it; use scale or blur instead |
| Packet builder fails: `frame packet is N bytes (limit 48000)` | Too many rule ids cited in one frame | Cite fewer rules, or describe the move in plain words |
| Orange text weak on paper (contrast ~2.5:1) | The bright accent on a light ground | Use `paper-accent` (#D9480F) in paper scenes |
| Text clips past the zone at slam peaks | Hero sized for its rest state | Size it for the peak scale, or scale from the left edge; `text-audit.mjs` flags anything that persists |
| The HUD vanishes or the frame count resets after re-assembly | `assemble-index.mjs` rewrites index.html | Always re-run `mount-chrome.mjs` after assembling |
| A re-encode overwrote the master | macOS filesystems are case-insensitive (`Foo.mp4` == `foo.mp4`) | `deliver.sh` refuses same-path output; use clearly different names |

## Expected `hyperframes check` false positives (verify once on the contact sheet, then accept)

- `text_not_painted` on echo-type outline copies: the transparent fill is deliberate.
- `content_overlap` on split-flap tiles: the flap halves and glyph layers overlap by design. It also fires on montage words during glitch frames.
- `contrast_aa_failure` errors on `#chrome-*`: the checker can't see the HUD's `mix-blend-mode: difference`, which keeps it legible on both grounds.
- `container_overflow` / `canvas_overflow` info items during slide-ins.
- `content_overlap` + `contrast_aa_failure` on a segmented control that stacks a second (dark) copy of its labels inside the sliding pill for a clean colour swap: the checker measures the hidden copy.
- `text_not_painted` on the not-yet-typed half of a type-on line that is laid out invisibly so the text never reflows while typing.
- `text_not_painted` on outline rows of an echo stack (Pop Flash) — deliberate.
- Lint warnings `id_requires_css_escape` and `id_override_reduced_specificity`: frame ids start with digits (`05-voice-…`) by contract. `composition_file_too_large` on index.html.

## Seen in the no-HUD looks

- **Cut lands on the event.** If a shot starts on the same beat its key event must land (a ring full, a word locked), the viewer never sees the motion. Start the shot half a beat earlier and land the event on the beat.
- **Headline bleeding beside new panels.** When panels wipe over a headline one by one, hide the headline as the first panel lands, or it shows in slices between them.
- **Readable word hidden by overlays.** A scrolling echo stack under marquee bands can leave only an outline word on the centre line; scroll by an even number of rows so a solid row always sits there.
- **Scale pushes overshoot the zone.** A 1.04 → 1 push or a slow creep can put edge text a few px outside the safe zone for 0.2s; anchor the transform at the near margin (x 96 / x 60) or inset the text.
- **Empty blocks.** A panel taller than its content reads as unfinished; hug the content.
- **Wrong type size for one line.** Measure condensed display type in Chromium before fixing sizes; workers routinely had to step 10–20% down to fit.

## Verification order

1. `lint`: 0 errors.
2. `check`: triage every error against the lists above.
3. Contact sheets at about 3 moments per scene: look for leaks, weak paper contrast, empty layouts and a missing HUD.
4. `text-audit.mjs`: fix every "PERSISTS"; "brief" hits at slam peaks or slide-ins are acceptable.
5. Render at 60fps and confirm with `ffprobe` (`r_frame_rate=60/1`, frame count = duration × 60) and `ebur128` (the master lands around −17 LUFS; that's fine for the original).
