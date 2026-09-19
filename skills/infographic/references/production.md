# Production

Use `SCRIPT.md` as the narration source, `video-plan.md` as the storyboard, and the selected
`frame.md` as the styling record. Resolve the skill's assets relative to this
skill directory, not a hardcoded Claude installation path. Use the installed
HyperFrames command guidance or `--help` for version-dependent flags.

## Output layout

Keep the run root for `video.mp4`, `thumbnail.jpg`, `SCRIPT.md`, `research.json`,
`video-plan.md`, `share-copy.txt`, and `composition/`. Inside `composition/`, use
`assets/` for final media, `components/` for registry components, `scenes/` for
sub-compositions when needed, `frames/` for the full frame export, and
`.work/` for raw audio, intermediate transcripts, and review images. Create only
directories actually used. Put sampled review images in `.work/review/`, not
in `frames/` or a second directory at the run root.

Before installing registry items, set `paths.components` to `components` and
`paths.blocks` to `scenes` in `hyperframes.json`; keep `paths.assets` as `assets`.
These paths are relative to the composition project. This avoids the default
`composition/compositions/components/` nesting.

Keep final narration and reviewed word timings together as `assets/vo/scene-01.wav`
and `assets/vo/scene-01.words.json`. Preserve raw audio in `.work/vo/` for
corrections; never normalize a normalized file again. Working files may be
removed after successful delivery if no composition or resume step needs them.
Do not remove assets referenced by HTML, configuration, or the registry lockfile.
The commands below run from `composition/` unless stated otherwise.

## Narration and timing

For narrated runs, preflight the current machine before production. Reuse the
project's pinned HyperFrames installation and inspect its `tts --help` once;
resolve the installed executable and reuse it instead of repeatedly downloading
or probing versions. Resolve Python from `HYPERFRAMES_PYTHON`, a project virtual
environment, or `python3`. Verify
`import kokoro_onnx, soundfile` using that interpreter and generate the first
script scene as the smoke test; retain it if successful. Probe its duration.
An import alone does not verify model files or voice support.
Persist the working interpreter and CLI paths in the run's plan, and optionally
in a project-local `video-output/.machine.json`, never in this portable skill.
Read that cache before probing again and re-verify what it claims before relying
on it. Store only environment facts such as interpreter, CLI version, and library
paths. If dependencies are missing, create a project-local virtual
environment at a short stable path and install the packages required by the
installed TTS version. Avoid nesting it inside timestamped outputs: long paths
can break espeak's data-directory lookup. For missing `libwhisper.so`, inspect
the existing Whisper library directory before installing another transcription
engine. Apply any loader-path fix to the transcription command only.
Distinguish permission errors (`EPERM`/`EACCES`) from missing Python/packages;
reinstalling cannot repair a sandbox denial. Request only the required tool
permission, reuse granted permissions, and do not repeat creative approval
questions for work the user already authorized. Test transcription availability
too when captions are requested. `--script-only` skips this preflight.

Before final animation, follow `media-use`'s Kokoro TTS workflow to generate
one WAV per voiced scene under `.work/vo/` from its `SCRIPT.md` text only.
Measure loudness with FFmpeg before timing the scene:

```bash
ffmpeg -hide_banner -i .work/vo/scene-01.wav -af loudnorm=I=-16:TP=-1.5:LRA=11:print_format=json -f null -
```

If the voice is too quiet or peaks prevent a simple gain change, use FFmpeg's
native normalization filter (a two-pass measured filter is also supported):

```bash
ffmpeg -i .work/vo/scene-01.wav -af loudnorm=I=-16:TP=-1.5:LRA=11 -ar 48000 -c:a pcm_s16le assets/vo/scene-01.wav
```

Otherwise copy the raw WAV unchanged to the final path. Preserve raw audio;
regenerate silent/invalid output rather than trying to normalize it. These are
narration preparation targets, not a guarantee about the finished mix. Reuse
unchanged files and batch necessary commands in the execution tool; do not create
a new `normalize-vo.sh` per run. Listen with the chosen music level before export;
check finished-mix loudness and peaks as well.

Do not feed fact IDs,
headings, or delivery notes into speech generation. Do not paraphrase or summarize
the script while preparing TTS inputs. If agent-written narration needs an edit,
update `SCRIPT.md` first, then regenerate the affected audio and captions. Preserve
user-supplied wording unless a rewrite was requested. Measure the actual files:

```bash
ffprobe -v error -show_entries format=duration -of csv=p=0 assets/vo/scene-01.wav
```

Allow each spoken line to finish, with a short natural tail. Allocate the
closing card separately. Let measured speech set the runtime within the
default 30–90-second range; an estimate is not a reason to shorten the script.
If speech exceeds 90 seconds or an explicit requested duration, trim repetition
first while preserving useful explanations and examples. Regenerate only changed
lines; do not speed up speech to force a fit.
Update the plan with measured scene durations. Without voice, time scenes
for comprehension. Transitions must not cut off the final words or labels.

## Current-word subtitles

Transcribe the final WAVs using `media-use`, with an explicit language/model
(`small.en` for this English voice). Save each flat word array to
`assets/vo/scene-01.words.json`: `[{"text":"Hello","start":0.1,"end":0.4}]`.
Keep any unreviewed transcription intermediates in `.work/vo/`.
Check text and boundaries against `SCRIPT.md` and audio, especially names,
prices, contractions, and negations. Correct recognition spelling while keeping
the measured interval; re-align mismatches that change the number of spoken words.
Never distribute timestamps by word-count ratios or split a number's duration
evenly into invented word timings. A displayed `$4.99` may highlight as a unit
over its verified spoken interval. Bad timings require correction or retranscription.

Install HyperFrames' `caption-highlight` component and start from it; do not
hand-roll a caption system. Inspect the
installed component; replace demo words with the reviewed transcript and adapt
its font, dimensions, safe area, and colors to the selected frame. Install just
this component, not the whole captions tag:

```bash
hyperframes add caption-highlight --dir <composition-dir>
```

Use the component's grouping/rendering logic inside the composition, not a separate
`gen-captions.py`. Keep one narration timing record: derive caption offsets and
`<audio data-start>` from it, or read the authored audio attributes. Do not maintain
an independent hardcoded start-time array. Embed transcript data locally at build
time, escape text, and use the registered seekable timeline. Check that word times
are ordered, positive in duration, non-overlapping, and inside the measured speech
window. Correct invalid boundaries against audio; never silently stretch them.
Trimmed/retimed speech must be aligned to the final audio. Reuse the installed
component in revisions; no repeated catalog search or helper generation is needed.

The phrase stays visible while the measured current word changes highlight.
At word end the highlight clears; at phrase end the phrase clears. No cumulative
highlight, bouncing, resizing, entrance delay, or beat-driven subtitle effects.
Replace the demo's overlapping word fades with timeline sets at each word's
start/end so the highlight never lingers into the next word or a pause.
Drive the highlight by setting absolute CSS property values on the word element
at its start and end times: the frame's highlight color and its dark foreground
on, the transparent and ink values off. Do not toggle a CSS class: GSAP 3 removed
`className` tweening, so `tl.set(el, { className: "+=on" })` silently does nothing
and ships captions whose words never highlight, and a relative add/remove could not
survive the arbitrary seeks a frame-by-frame render performs. Every word's on/off
state must be reconstructible from a single seek to any time.
The stock component's red sweep, uppercase font, and animation defaults are not
the brand specification. Override them with the frame's stable phrase/current-word
treatment. Use the shipped local font. Group at natural boundaries, usually 3–6
words, at most two lines; split oversized phrases rather than shrinking the type.

Verify every spoken phrase is covered, and inspect start/middle/end alignment.
Seek forward and backward around a word boundary and a pause: only the current
word may be active, and the final phrase must disappear before the follow card.
Prove the highlight actually paints: capture frames at timestamps inside measured
word intervals, from the encoded video and not only the live composition, and
confirm the current word carries the frame's highlight treatment. Captions that
render their words but never highlight one are a failed build, not a cosmetic
detail; `check` and the plan cannot see it, so it has to be confirmed as pixels.
With captions disabled, skip transcription and caption building.

## Composition and audio

Read `hyperframes-core` before writing HTML. Use its seekable timeline and
framework-owned media contract; animate inner scene content as appropriate.
Read `hyperframes-animation` for motion and `hyperframes-keyframes` for camera
moves. For named effects/components, consult `hyperframes-registry` first.
Keep the project and used fonts, images, and audio inside `composition/`.

Build the selected frame's ground and closing card before proliferating
scenes. Inspect them with one evidence scene and active subtitles at phone size.
Preserve the bundled ground/overlay stack. Adjust foreground type, layout, or
local backing for contrast rather than changing the background. Apply the frame's
safe areas, scaling pixel values when changing resolution. If the frame does
not specify them, use conservative margins for the target platform and verify
that captions, labels, and closing marks remain readable.

For revisions, compare the prior composition before replacing its visual
structure. Preserve useful comparisons and state changes unless the new design
explains them more clearly. A restyled card with an entrance animation alone
does not replace a working infographic.

Time reveals to the explanation. Give every settled element time to be read:
about 0.8 s for a short label once it stops moving, and about 0.3 s per word for
a full sentence, measured after the entrance finishes rather than including it.
Hold the result long enough to understand it.

Build the storyboard's visual with actual content. A finished flyer needs a
readable offer and a relevant image; blank bars and a colored rectangle remain
placeholders even when animated. Preserve spatial relationships in diagrams.
Use consistent scales and labeled units for
charts, direct labels, and a clearly marked break or overflow if a value exceeds
the scale. Prefer a demonstrable input → action → result, a changing diagram,
or an accumulating comparison to several static price cards. Reuse registry
components when they fit; load only the selected component's implementation.
Use a captured product interface only when it adds evidence; otherwise label
invented UI as illustrative. Avoid downloading an entire effects library or
adding 3D/shaders solely to make a scene look more elaborate.
Avoid long empty holds after an entrance, but keep a completed comparison on
screen long enough to understand. A held diagram can be useful without idle
pulsing or gratuitous animation.

Choose one bundled track from `assets/music/` or a supplied track. Vol-12 is
the default bed; begin around 0.10–0.18 gain under narration and adjust after
listening. Pick a few SFX to match actual actions from
`assets/sfx/README.md`; reuse a small sound vocabulary. Copy only selected files. Gain numbers
are starting points, not a loudness guarantee. Read `hyperframes-audio` for
fades, ducking, or effects; do not assume browser volume tweens reach export.

Beat analysis is optional, useful mainly for a requested music-led passage.
The existing `hyperframes beats <composition-dir>` command can analyze local
music after it is placed in the composition; follow the CLI's beat guidance.
Narration and reading time take priority. No custom Python analyzer or
mandatory audio-reactive treatment is needed.

## Review and render

Before the first full export, finish narration loudness, music balance, caption
alignment, phone-size type, and transition handoffs. Keep simple transitions;
a zoom is optional and needs to preserve readable continuity.

Run `hyperframes check --snapshots` with representative settled timestamps and
the actual seams. Inspect that contact sheet, including opening and closing,
rather than immediately taking a duplicate snapshot batch. If the CLI omits a
required timestamp, capture just that time. After a demonstrated defect, inspect
only its affected frames, then run the final check when edits are complete.
There is no screenshot quota; do not repeat full sweeps merely to reassure yourself.

Check the things validation cannot establish:

- The first decoded frame has a readable visual hook at phone size; the proof
  object explains the claim. Inspect `composition/frames/frame-000001.png`
  after export, since a settled opening snapshot can miss an empty first frame.
- Measure the opening narration and its visual scene. The first useful example
  should follow the brief hook, without a long setup about an excluded option.
- Required brand ground, fonts, icons, and closing-card structure match
  the selected frame. Essential labels remain readable at phone size.
- Check actual text bounds, caption placement, and safe areas against the frame.
  Starting sizes may be adjusted for legibility; fixed brand requirements remain.
- Compare settled scenes. Repeated layouts should help the viewer compare or
  follow a change. Replace generic mockups and unfinished placeholders with
  meaningful content.
- Captions and narration match; qualifiers remain visible with their claim.
- The closing card has its own readable hold, with no previous scene remnants.

Review playback with audio for pacing, pronunciation, masking, and cutoffs;
stills cannot establish these. If playback/audio review is unavailable, say
which checks were performed. Fix demonstrated issues and repeat the affected
checks. `--stop-after compose` ends after this stage, before encoding.

For a full video request, aim for one final render after review using the installed CLI's
supported quality setting and `--output ../video.mp4`. If the user requested
a preview/approval checkpoint, honor it. Verify the actual MP4 with `ffprobe`
for dimensions, duration, and expected audio streams, and inspect its opening,
representative content, and ending. Passing `check` alone is not visual QA.
Another full render is justified by an observed export defect or an intentional
revision, not by optional polish discovered because earlier checks were skipped.
Record CLI version, output duration, and render wall time in the existing plan
so encoding cost can be distinguished from research and authoring cost.

Design `composition/thumbnail.html` as a separate static cover at the video's
aspect ratio. Use HTML, CSS, and SVG with the same browser renderer used for
the video. Build a clear focal graphic and a short, specific headline from the
script. Use the selected frame's palette and ground; no image generation or
photo search is part of this step. Keep the headline as HTML text for exact
spelling. Avoid generic robots, floating UI, fake product screens, invented
data, and claims the video does not support. Capture the HTML at final size,
convert the capture to `thumbnail.jpg` at the run root, and inspect it at phone
size. Keep the editable HTML inside `composition/`. The cover is a separate
design, not a frame extracted from `video.mp4` or a scene added to it.
Write concise, sourced platform copy to `share-copy.txt`. Keep research and
the plan alongside the editable composition; no extra handoff document is
needed.

### Full frame export

For every completed video, run from its run directory:

```bash
mkdir -p composition/frames
ffmpeg -hide_banner -i video.mp4 -map 0:v:0 -fps_mode passthrough composition/frames/frame-%06d.png
```

This saves every decoded frame without another browser render. PNGs retain the
encoded video's compression artifacts. For original render frames, use the
installed HyperFrames CLI's `--format png-sequence` with an output directory;
check its help first. That is a separate export and does not include audio.
A 90-second video at 30 fps produces about 2,700 images. Verify the frame count
against `ffprobe` or the renderer summary. Use a contact sheet and targeted
frames for routine review; the full export is a delivery artifact.
