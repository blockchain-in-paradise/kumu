# Review

The agent reviews its own work and fixes it before the user sees anything. The
user's only review is watching the video in HyperFrames Studio. So measure
first, look only where the measurements point, fix, and repeat. A score the
agent gives itself proves nothing; a measured error is a fact. Commands run
from the run directory. Save evidence under `composition/.work/review/`.

## 1. Measure

Run all of these. Every error must be fixed; every warning is fixed or
explained in step 3.

1. **Checks.** `npx hyperframes check composition`, lint errors first (a lint
   error disables the layout and contrast audits).
2. **Draft render** at the final frame rate (a flicker lasts one frame, so a
   lower rate hides it):

   ```bash
   npx hyperframes render composition --quality draft --fps 30 --output composition/.work/review/draft.mp4
   ```

3. **Video audit** of that render, in any style:

   ```bash
   node <kumu skill>/scripts/video-audit.mjs composition/.work/review/draft.mp4 \
     --hold <intended still stretches, e.g. 0-2.3,70-73> --crops composition/.work/review/crops
   ```

   It reports `edge` errors (sharp content within 14 px of the frame edge),
   `flicker` warnings (a region that changes for one frame and changes back,
   with a 3-frame crop saved for each), and `dead` warnings (3 s with almost
   nothing moving, outside `--hold`).
4. **Motion audit** (styles built on `SportsRig`, such as boxing): it seeks the
   timeline and lists, with timestamps, punches with no load, twitches, pose
   moves that overlap on one fighter, gloves passing inside each other,
   fighters held where their guards tangle, limbs near the frame edge, skids,
   overlapping torsos, and pose changes during camera moves:

   ```bash
   node <kumu skill>/scripts/motion-audit.mjs composition
   ```

5. **Animation map** (styles that are not `SportsRig`; it only counts DOM
   tweens, so it cannot see fighters). Flags `paced-fast` (under 0.2 s),
   `paced-slow` (over 2 s), dead zones, offscreen elements, and collisions, from
   the installed `hyperframes-animation` skill's
   `scripts/animation-map.mjs composition --out composition/.work/review`.
   Side-by-side items and a running mechanism's long tweens are expected.
6. **Loudness** of the full mix: integrated LUFS and true peak with FFmpeg's
   `ebur128` filter. At or below -14 LUFS, peak under -1 dBTP (and, when the
   style has music, the bed against the voice per [render.md](render.md)).

## 2. Look where the measurements point

View at about 360 px wide, as a phone shows it, and only what the evidence
asks for:

- **One contact image** from the draft: the first frame, the hero state, and
  the closing frame side by side, plus a few evenly spaced frames.
- **Every crop** the video audit saved (at most 8). A flicker at a hit, a
  flash, or a camera shake is intended. A part that blinks when nothing lands
  (hair, clothing, an outline, a label, a shadow) is a defect.
- **A frame at each flagged time** from steps 3 to 5 that has no crop.

Then judge these, with the frame or number that shows each:

- **Edges and overlap.** Nothing important within 40 px of the frame edge in any
  pose; no text or limb over another; the words clear of the subject.
- **Legibility.** Every title, label, and line reads at 360 px; no contrast
  failures; the frame's text budget holds.
- **Motion.** No flicker, jump, or slide; idle loops stay small; every clause
  changes something visible.
- **Content.** Walk the States table against the draft: after the last state, a
  viewer can do or understand the goal sentence; every number and claim matches
  `research.json`; the opening and closing follow the style.

## 3. Fix and repeat

Fix every error and every warning that is a defect, then re-run only the
measurements the fix affects, including a new draft render. Record each round
under a **Review** heading in `video-plan.md` as short bullets: what was
flagged, what was fixed, and the intended warnings with the reason ("62.10 s:
shake on the knockout hit, intended"). Stop at zero errors with every warning
fixed or explained, or after three rounds; list anything still open as a
limitation. A passing review is the agent's judgment, not proof of quality;
the user decides in Studio.

When the user asks for a fix to something that looked wrong (a limb clipping, a
punch that snaps, flicker, a drag), fix it, and if it can be measured from the
timeline or the render, add a check for it to `scripts/motion-audit.mjs` or
`scripts/video-audit.mjs` so the next run catches it first.

## Plan preview (plan checkpoint)

View `composition/frames/plan-preview.png` once. Fix the stills before asking if
the first state, hero, or closing is hard to read at 360 px, or if the hero
graphic does not look like the real thing ([frame.md](frame.md) Subjects).

## The user's review (frame checkpoint)

After the review passes, start the scrubbable Studio preview, give the user its
URL, and stop it after the final render:

```bash
npx hyperframes preview composition --background
npx hyperframes preview composition --stop
```
