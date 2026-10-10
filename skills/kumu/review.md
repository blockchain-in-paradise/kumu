# Review

The builder judges what it meant to make; the viewer sees what is on screen.
Before each checkpoint, gather evidence, score it, and fix what fails. Commands run from the run directory.

## Evidence

Save everything under `composition/.work/review/`.

1. **Contact sheet.** One frame at 0 s, at each state's settled time (after its
   last change, before the next), and inside the closing card:

   ```bash
   npx hyperframes snapshot composition --at 0,<settled times> --no-end --describe false -o composition/frames
   ```

2. **Motion strips.** Frames every 0.25 s across four windows: the intro, the
   first change of each kind, one repeated change, and the payoff into the
   closing card. One snapshot call per window, each into its own folder:

   ```bash
   npx hyperframes snapshot composition --at 0,0.25,0.5,0.75,1,1.25,1.5,1.75,2 --no-end --describe false -o composition/.work/review/strip-intro
   ```

3. **Animation map.** Measures every tween and flags `paced-fast` (under 0.2 s),
   `paced-slow` (over 2 s), dead zones with no motion, offscreen elements, and
   collisions. Use the script in the installed `hyperframes-animation` skill:

   ```bash
   HYPERFRAMES_SKILL_PKG_VERSION=$(npx hyperframes --version) HYPERFRAMES_SKILL_BOOTSTRAP_DEPS=1 \
     node <hyperframes-animation skill>/scripts/animation-map.mjs composition --out composition/.work/review
   ```

   Collisions between items that sit side by side by design (a row of books, a
   line of characters) are expected; the rest are worth a look. A running
   mechanism's long rotation and flow tweens are expected `paced-slow`.

4. **Checks.** `hyperframes check` results, with lint errors cleared first
   (a lint error disables the layout and contrast audits).
5. **Loudness.** Integrated LUFS and true peak of the full mix, and of the
   music bed alone, measured with FFmpeg's `ebur128` filter.
6. **Motion audit** (styles built on `SportsRig`, such as boxing). It seeks the
   timeline and lists, with timestamps, punches that snap out without a load,
   twitches (a limb jolting between two frames at 60 fps), pose moves that overlap
   on one fighter, gloves passing inside each other, fighters held at a distance
   where their guards tangle, limbs near the frame edge,
   skids, overlapping torsos, and pose changes during camera moves:

   ```bash
   node <kumu skill>/scripts/motion-audit.mjs composition
   ```

   Its errors cannot be scored away; fix them (the style's choreography helpers
   prevent most). Judge its warnings in the motion strips.

## Reviewer

Review in the same session, as its own pass: open the evidence first, before
re-reading the plan, and judge what is on screen, not what was intended. Every
score cites something in the evidence (a frame, a strip, a map flag, a
measurement). Measured failures (contrast, loudness, `paced-fast`,
`paced-slow`, a dead zone over 3 s under the voice) cannot be scored away; fix
them or name them.

Score each 1–5, with one line of evidence per score:

| Area | A 5 means |
| --- | --- |
| Hook | The first 2 s show the intro title alone on the backdrop, something moves, and the viewer wants the answer; the first item has not appeared yet. Or the style's own opening lands as the style describes (a cold open: action in the first 2 s that makes the viewer want the answer) |
| Teaching | After the last state, a viewer could do or understand the plan's goal sentence |
| Readability | Every title, label, line, and value reads at phone size with no contrast failures; each frame stays within the text budget and no on-screen text uses separator dots, bullets, pipes, or slashes |
| Pace | Each new kind of change can be followed on first watch, repeats move faster, no dead zone over 3 s while the voice speaks (an idle loop is not motion; the intro title, or the style's opening, and the closing card are the only holds), the payoff holds long enough to read |
| Motion | Movement has weight and purpose, characters act rather than slide, nothing flickers, jumps, or overlaps by accident |
| Depiction | Every drawn object reads as the real thing at a glance, follows [frame.md](frame.md) Subjects, and keeps one scale and position across scenes; nothing important touches the frame edge or flickers from frame to frame in any pose |
| Style | Matches the style's sample (`index.html`, `preview.png` when present): background, palette, type, captions, motion vocabulary, and closing; one scale and character design throughout; repeated items vary in entrance and placement, and every item shows its name and key number |
| Audio | Mix at or below -14 LUFS with true peak under -1 dBTP; music sits under the voice or, in visual mode, near -21 LUFS; SFX match actual changes |
| Accuracy | Every number and claim on screen matches the model, sources, and plan |
| Ending | The payoff lands as its own closing frame with the title and stage cleared, then the closing card, if any, stands alone in the video's world; or the style's own closing (such as a loop fade) lands as the style describes |

## Verdict and fixes

When the user asks for a fix to motion that looked wrong (a limb clipping, a
punch that snaps, a slide), fix it, and if that kind of glitch can be measured
from the fighters' joints or the timeline, add a check for it to
`scripts/motion-audit.mjs` so the next run catches it before the user does.

Pass when every score is 4 or higher and nothing blocks the goal. Otherwise
fix the lowest scores first, regenerate only the affected evidence, and review
again. Stop after two fix rounds. Record each round under a **Review** heading
in the plan: scores, problems, and fixes, as short bullets.

The frame checkpoint message lists the final scores and any score below 4 with
its reason. A passing review is the agent's judgment, not proof of quality;
the user decides.

## Plan preview review (plan checkpoint)

At the plan checkpoint, score Hook, Readability, and Depiction on
`composition/frames/plan-preview.png`, and fix the stills before asking if any
is below 4, using the Depiction row above for the hero graphic.

At the frame checkpoint, also start the scrubbable Studio preview so the user
can watch the motion, and stop it after the final render:

```bash
npx hyperframes preview composition --background
npx hyperframes preview composition --stop
```
