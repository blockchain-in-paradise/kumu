# Render

Use `video-plan.md` as the storyboard, `SCRIPT.md` as the narration source when
narrated, and the selected style's `style.md` and sample `index.html` (with
plain's sections for what it leaves out) as the styling record, inside the
floor [frame.md](frame.md) sets. Start the composition from the style's
sample: its background, type, caption, and closing code, and the motion-value
constants at the top of its script instead of new durations and eases.
Declare the style's colors as CSS custom properties on the composition root
(`--canvas`, `--ink`, `--on-highlight`, `--accent`, `--highlight`, `--panel`,
`--border`, and each `support` color as `--support-<name>`) and load its fonts
locally. Resolve skill assets relative to this skill directory. Use the installed
CLI's `--help` for version-dependent flags.

## Output layout

Inside `composition/`: `assets/` for final media,
`components/` for registry components, `scenes/` for sub-compositions when
needed, `frames/` for review frames, and `.work/` for raw audio, transcripts,
model scratch output, and review images. Create only directories you use.

Before installing registry items, set `paths.components` to `components` and
`paths.blocks` to `scenes` in `hyperframes.json`. Commands below run from
`composition/` unless stated otherwise.

## Building the stage

Read `hyperframes-core` before writing HTML. Select implementation references
through [references/design-resources.md](references/design-resources.md).
Use the style's existing helpers and motion constants; consult registry before
hand-building a named reusable visual. Adapt recipes to the style and verify
seek-safety rather than copying their aesthetics or callback behavior.

Build the style's fixed parts first (its layout, words, and closing). Inspect
one state at phone size with active captions or lines before building the
rest. Use the reviewed scene results, not the demo's arrangement by default.
Implement and inspect the hardest planned action before repeating its pattern.

When the concept has a model, compute states from it at load time, then place
one tween per state at its planned time. Set displayed values as explicit
timeline states, so they are correct at
any seek, forward or backward. Never count, simulate, or read the clock during
playback. Keep model data separate from the style's animation: compute each
state once,
then use the style's helpers to present it at the measured time. Do not put
layout coordinates, materials, or easing choices into the model. Reuse stable
item identifiers; values alone are not identities when duplicates occur.

The same shape covers a queue simulation, a timeline of sourced dates, or a
list of items: compute the states, then map them to times. When the model is
too large to run in the page, run it once in `.work/`, save its states as JSON,
and embed that JSON in the composition.

Build each state with actual content; blank bars and placeholder text stay
placeholders even when animated. Use consistent scales and labeled units.

Photo or clip subjects: see [references/photo-subjects.md](references/photo-subjects.md).

## Narration and timing (narrated mode)

Use the style's `voice` and `voice_speed` from its `style.md` (else `am_adam` at
1.0) for every line. Verify Kokoro by generating the first state group with
`hyperframes tts -v <voice> -s <speed>` and
probing its duration. Generate one WAV per `SCRIPT.md` heading under
`.work/vo/` from the spoken text only: no headings, fact IDs, or notes. Before
generating, replace each word in the style's Pronunciation table (when it has one) and the
plan's Pronunciation table with its respelling in the TTS input only, then listen to those words in the output. Measure
loudness before timing:

```bash
ffmpeg -hide_banner -i .work/vo/scene-01.wav -af loudnorm=I=-16:TP=-1.5:LRA=11:print_format=json -f null -
```

If it is off target, normalize once into the final path; otherwise copy it unchanged:

```bash
ffmpeg -i .work/vo/scene-01.wav -af loudnorm=I=-16:TP=-1.5:LRA=11 -ar 48000 -c:a pcm_s16le assets/vo/scene-01.wav
```

Never normalize a normalized file again; regenerate silent or invalid output.
Measure each final file with `ffprobe` and let measured speech set the
timeline. If the total exceeds 90 seconds or the requested duration, trim
repetition in `SCRIPT.md` and regenerate only changed lines. Never speed up
speech to fit. Record measured starts in the plan's States table.

## Captions (narrated mode)

Transcribe the final WAVs with `media-use` using an explicit model (`small.en`
for English voices). Save each flat word array to `assets/vo/scene-01.words.json`
as `[{"text":"Hello","start":0.1,"end":0.4}]`. Check words against `SCRIPT.md`,
especially names, numbers, contractions, and negations; fix spelling while
keeping measured intervals. Respelled words appear in captions with their
correct `SCRIPT.md` spelling, including diacritics. Never distribute
timestamps by word-count ratios. A displayed `$4.99` may highlight as one unit
over its spoken interval.

Captions look and sit as the style's Captions section (or plain's) says. If
the style's sample already has caption code, reuse it with the transcript.
Otherwise install and adapt HyperFrames' `caption-highlight` component rather
than hand-rolling captions:

```bash
hyperframes add caption-highlight --dir <composition-dir>
```

Embed the transcript at build time and derive caption offsets and
`<audio data-start>` from one timing record. Set colors with absolute `tl.set`
calls at word starts and ends, not class toggles, so the state survives any
seek. Clear the highlight at each word end and the phrase when finished; the
last phrase clears before the closing. Seek across a word boundary and a
pause, forward and backward, to confirm.

## Audio

Use the style's Sound section: its events, files in the style's `assets/sfx/`,
starting gains, and music track. Fall back to the shared `assets/sfx/` and
`assets/music/` only for events the style does not cover. Copy only selected
files, and add any credit a file's license requires (see the style's
`assets/sfx/CREDITS.md`) to `video-plan.md`. Never generate music.

- **Narrated:** keep music about 24 LU below the voice, measured with FFmpeg's
  `ebur128` filter on both; for bundled tracks that is roughly 0.05 gain.
- **Visual:** measure the track with `ebur128` and set its gain so the bed
  sits around -21 LUFS; the bundled tracks are mastered near -14 LUFS, so that
  is roughly 0.45 gain. State changes may land on beats; `hyperframes beats
  <composition-dir>` finds them.
- **Both:** the full mix stays at or below -14 LUFS with true peaks under
  -1 dBTP. You cannot hear the mix, so measure it and record the numbers in
  the plan. The export is stereo, so mono sources read 3 LU louder than a mono
  mix: measure the mix as dual mono (or `video.mp4` after the render) and trim
  `data-volume` until it passes.

Use a few SFX from `assets/sfx/` on actual state changes, reusing a small sound
vocabulary. Read `hyperframes-audio` for fades, ducking, or effects; browser
volume tweens do not reach export. SFX peaks stay at least 8 dB under the voice
peaks: use the style's gains and lower the SFX `data-volume` if the mix
measurement in [review.md](review.md) shows them hot.

## Review

Follow [review.md](review.md) before the human frame checkpoint. Preserve
scene-review evidence as well as audit results.

## Thumbnail

Finish the plan-stage cover in `composition/thumbnail/index.html` with the
approved title and render it to JPEG with the same browser. Check it once at
about 150 px wide and save it as `thumbnail.jpg` at the run root.

## Final render

After self-review passes and the user approves the Studio checkpoint, render
at the requested dimensions and 30 fps with `--video-bitrate 20M --output
../video.mp4`. Use `--fps 30`; the final project dimensions must match the
selected format. A requested partial deliverable is not permission to export.
Use the current CLI's help to confirm flags. Keep the style's effects subject
to the compression validation in frame.md.

Verify dimensions, duration, and audio streams with ffprobe. Inspect the first
frame, each scene's main result, and the ending in the actual export. Check
important motion intervals if export differs from the draft. Re-render only
for an observed defect or intentional revision. Record CLI version, duration,
render wall time, review status, and any inspection limitations in the plan.

## Grow the style's library

After a successful final render, compare every asset the run used with the
style's `assets/` and promote what a later video could reuse: drawn objects
(into its object library and sheet), icons, logos, sounds, music, textures,
fonts, and reusable components (an interface, a prop with parts). Each goes
into the matching `assets/` folder with any credit or license note beside it
(a `CREDITS.md`), and gets one line in the style's `style.md` saying what it is
and how to use it. Promote only assets the user accepted in the final video and
whose license allows reuse. Promote generic versions: strip the run's sample
text, names, and timings, keep the drawing. Skip one-off scenery and anything
the library already has; improve the existing entry instead of adding a near
copy. Record what was promoted in the plan.

Also preserve a small set of accepted choreography examples in the style's
Choreography section: before, action, result, and why it worked. Save a
rejected pattern only when it teaches a reusable distinction, without making
that topic's correction a universal rule. Leave new assets and candidate
examples in the run until the user accepts them; a technical validation pass
is not acceptance.
