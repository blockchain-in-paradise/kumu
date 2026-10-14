# Review

The agent reviews the plan and draft before each human checkpoint.
Measure technical defects and inspect the explanation independently; neither
an audit pass nor a self-assigned score establishes design quality. Commands
run from the run directory. Save evidence under `composition/.work/review/`.
Use the selected style's Choreography (or Motion) and Checks as the artistic contract.

## 1. Measure

Run all of these. Every error must be fixed; every warning is fixed or
explained in step 3.

0. **Style checks** before any render: run the style's Checks section, or
   plain's when the style has none and inherits plain's layout and motion.
   Every hit is fixed.

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
   nothing moving, outside `--hold`). A push or wipe the style
   uses between scenes briefly puts sharp content in an edge strip; that `edge`
   error is intended, so record it in step 3 instead of fixing it.
4. **Kit audit**, when the style's kit names an audit script: run it as the
   style says and fix what it lists.
5. **Animation map** (styles without a kit audit; it only counts DOM
   tweens, so it cannot see a WebGL kit). Flags `paced-fast` (under 0.2 s),
   `paced-slow` (over 2 s), dead zones, offscreen elements, and collisions, from
   the installed `hyperframes-animation` skill's
   `scripts/animation-map.mjs composition --out composition/.work/review`.
   Interpret flags against planned actions, holds, and the style's cadence.
   An audit cannot infer whether ambient motion explains anything.
6. **Loudness** of the full mix: integrated LUFS and true peak with FFmpeg's
   `ebur128` filter. At or below -14 LUFS, peak under -1 dBTP (and, when the
   style has music, the bed against the voice per [render.md](render.md)).

## 2. Inspect every scene and important handoff

Review at about 360 px wide with actual captions and labels:

- **Scene results.** Build a contact sheet containing the opening, the main
  result of every scene, and the closing. Include important intermediate states
  when a scene contains several explanations. Inspect each against its planned
  before, action, result, and the style's drawing and composition rules.
- **Playback.** Inspect every important transfer, transformation, and scene
  transition in motion with surrounding context. Use supported video inspection
  or the seekable preview; if only images are available, sample a sequence
  across the action and disclose that playback was not assessed. A settled
  frame alone cannot establish that the action is readable.
- **Flags.** Inspect every saved audit crop and flagged interval. The audit
  caps crops at eight, not the number of defects to review. A deliberate effect
  is excused only with timestamped evidence, not a blanket transition exception.
- **Speech and sound.** Compare speech anchors and captions with SCRIPT.md.
  Audition the mix and uncertain pronunciations when supported; otherwise
  disclose the listening limitation. Loudness measurements are not listening.

For each scene, record a timestamp and a specific finding:

- **Explanation.** The pictured action teaches the claim, and its result
  advances the viewer's goal. Topic labels alone do not demonstrate behavior.
- **Attention and continuity.** The intended focus and handoff are clear;
  important identities and relationships remain understandable through motion.
- **Readability.** Essential text and marks survive at phone size, remain
  clear of platform UI, and meet the style's text budget. Planned holds give
  the viewer time to read the result after it becomes legible.
- **Style adherence.** Compare the scene to style.md and its sample, including
  its materials, layout, motion values, and bookends. Use the style's Checks
  for specialist behavior; external recipes cannot overrule it.
- **Content.** Claims and displayed values trace to research.json or the
  recorded model; example results are identified; qualifications stay intact.

Record the observed weakness and repair, or concrete evidence of a pass.
"Looks good" and "zero technical errors" are not scene-review evidence.

## 3. Fix and repeat

Fix every error and every warning that is a defect, then re-run only the
measurements the fix affects, including a new draft render. Record each round
under a **Review** heading in `video-plan.md` as short bullets: what was
flagged, what was fixed, and intended warnings with their reason and timestamp.
Stop at zero errors with every warning fixed or explained, or after three
rounds; list anything still open as a
limitation. Require both technical and scene review to pass before final
export. After three unsuccessful rounds, retain the draft, name the unresolved
scene and defect, and stop with a partial deliverable. Do not waive an error
because the round limit was reached. A passing review remains a judgment,
not proof that the user will accept the design.

When the user asks for a fix to something that looked wrong (a limb clipping,
a snap, flicker, a drag), fix it, and if it can be measured, add a check so the
next run catches it first. Put both where they belong:

- A fix or check that matters for one style goes in that style's files: its
  `style.md`, sample, kit, or the kit's audit script.
- Only a pipeline step or a [frame.md](frame.md) floor rule goes in the root
  files, and only a check true for every style goes in
  `scripts/video-audit.mjs`.

After editing shared Markdown, inspect the diff for artistic prescriptions
and named style mechanics, including in the style builder and references.
Move those to the owning style. Shared files may route resources and define
validation steps, but cannot choose a style's look or choreography.

## Plan review

Before TTS or full animation, inspect the opening, hero, closing, and cover
in `composition/frames/plan-preview.png`. Also inspect the main result of every
other proposed scene at phone size; save those frames beside the preview.
Read the States table against those images and the style's Choreography or Motion section:
can each action be built, followed, and understood, and is its result convincing?
Fix weak visuals before production, then show the reviewed plan and
wait for human approval as SKILL.md specifies. Existing approvals are not
reopened needlessly.

## Studio preview

After self-review passes, start the scrubbable preview and provide its URL.
Pause for human approval before final export.
Stop a preview started for this run after final rendering:

```bash
npx hyperframes preview composition --background
npx hyperframes preview composition --stop
```
