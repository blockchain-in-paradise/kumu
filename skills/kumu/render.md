# Render

Use `SCRIPT.md` as the narration source, `video-plan.md` as the storyboard, and the selected
`brand.md` with `frame.md` as the styling record. Resolve the skill's assets relative to this
skill directory, not a hardcoded Claude installation path. Use the installed
HyperFrames command guidance or `--help` for version-dependent flags.

## Output layout

Keep the run root for `video.mp4`, `thumbnail.jpg`, `SCRIPT.md`, `research.json`,
`video-plan.md`, `caption.txt`, and `composition/`. Inside `composition/`, use
`assets/` for final media, `components/` for registry components, `scenes/` for
sub-compositions when needed, `frames/` for the review frames, and
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

For narrated runs, preflight the current machine once. Reuse the pinned
HyperFrames CLI and inspect
its TTS help. Resolve Python from `HYPERFRAMES_PYTHON`, a project virtual
environment, or `python3`. When using a virtual environment, set
`HYPERFRAMES_PYTHON` to its absolute Python path for HyperFrames TTS and doctor
commands; the CLI does not discover it on its own. Verify Kokoro imports and
model/voice support by producing the first scene and probing its duration.
Retain successful audio.
Check transcription availability when captions are requested. Without voice,
skip TTS and time scenes for comprehension; align supplied speech if provided.

Record working CLI and interpreter paths in the plan.
If needed, use a stable project virtual
environment outside timestamped runs and install the packages required by the
installed TTS version. Long paths can break espeak lookups. For missing Whisper
libraries, check the existing installation and scope loader fixes to the command.

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
If the complete timeline exceeds 90 seconds or an explicit duration, trim repetition
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

Keep each caption phrase stable, usually 3–6 words over at most two lines.
Use the frame's font, position, ink, and current-word treatment. Split long
phrases rather than shrinking them. Clear the highlight at the measured word
end, including pauses, and clear the phrase when finished. Do not use cumulative
highlight, bounce, zoom, resize, typewriter reveals, font-weight changes that
reflow the phrase, or delayed entrance.

Replace stock demo fades and styling with seekable timeline sets of absolute
CSS colors/backgrounds at word starts and ends. Avoid GSAP `className` tweens
and relative class toggles; the state must survive arbitrary frame seeks.
Seek forward and backward across a word boundary and a pause. For completed renders, inspect encoded
frames inside measured word intervals to confirm the highlight paints correctly.
Validate coverage and alignment at the start, middle, and end of speech. The
last phrase must clear before the closing card. Technical checks alone cannot
prove the correct word is highlighted. With captions off, skip this section.

## Composition and audio

Read `hyperframes-core` before writing HTML. Use its seekable timeline and
framework-owned media contract; animate inner scene content as appropriate.
Read `hyperframes-animation` for motion and `hyperframes-keyframes` for camera
moves. For named effects/components, consult `hyperframes-registry` first.
Keep the project and used fonts, images, and audio inside `composition/`.

Build the selected frame's ground and closing card before proliferating
scenes. Inspect them with one evidence scene and active subtitles at phone size.
Preserve the selected frame's ground/overlay stack. Adjust foreground type, layout, or
local backing for contrast rather than changing the background. Apply the frame's
safe areas, scaling pixel values when changing resolution. If the frame does
not specify them, use conservative margins for the target platform and verify
that captions, labels, and closing marks remain readable.

For revisions, compare the prior composition before replacing its visual
structure. Preserve useful comparisons and state changes unless the new design
explains them more clearly. A restyled card with an entrance animation alone
does not replace a working infographic.

Implement from the individual scene brief and shared brand, retaining global
context for continuity. Tie visible changes to measured spoken phrases from the
plan. Use one meaningful action at a time: reveal a dependency, trace a route,
change a state, compare a value, or focus attention on evidence. Camera movement
must preserve orientation. A shot recipe is optional craft guidance; it must
fit the subject and obey the frame's motion rules. Do not add default ambient
movement, a preset transition quota, or a cinematic effect for its own sake.

Time reveals to the explanation. Give every settled element time to be read:
about 0.8 s for a short label once it stops moving, and about 0.3 s per word for
a full sentence, measured after the entrance finishes rather than including it.
Hold the result long enough to understand it.

Build the storyboard's visual with actual content. Blank bars, generic text
lines, and a colored rectangle remain placeholders even when animated. Preserve
spatial relationships in diagrams.
Use consistent scales and labeled units for
charts, direct labels, and a clearly marked break or overflow if a value exceeds
the scale. Prefer a demonstrable input → action → result, a changing diagram,
or an accumulating comparison to several static price cards. Reuse registry
components when they fit; load only the selected component's implementation.
Use a captured product interface only when it adds evidence. Represent an
uncaptured workflow as a diagram or transformation rather than fake UI with a
repeated disclaimer. Avoid downloading an entire effects library or adding
3D/shaders solely to make a scene look more elaborate.
Avoid long empty holds after an entrance, but keep a completed comparison on
screen long enough to understand. A held diagram can be useful without idle
pulsing or gratuitous animation.

Choose one bundled track from `assets/music/` or a supplied track. Vol-12 is
the default bed. Keep it about 24 LU below the narration, measured with FFmpeg's
`ebur128` filter on the voice and on the gained bed; for the bundled tracks
that is roughly 0.05 gain. Adjust after listening to the combined mix. Pick a
few SFX to match actual actions from `assets/sfx/`; reuse a small sound
vocabulary. Copy only selected files. Gain numbers are starting points, not a
loudness guarantee. Read `hyperframes-audio` for
fades, ducking, or effects; do not assume browser volume tweens reach export.

Beat analysis is optional, useful mainly for a requested music-led passage.
The existing `hyperframes beats <composition-dir>` command can analyze local
music after it is placed in the composition; follow the CLI's beat guidance.
Narration and reading time take priority. No custom Python analyzer or
mandatory audio-reactive treatment is needed.
Bundled `assets/music/cues/` files are optional older timing hints, not
HyperFrames beat files.

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

Review the whole script once more against the assembled sequence. Ensure the
hook leads directly into the explanation and the visuals support each spoken
claim. Do not add a new wording rule for every awkward phrase; repair the draft.

Check the things validation cannot establish:

- The first decoded frame has a readable visual hook at phone size; the proof
  object explains the claim. Inspect the review frame captured at 0 s, since a
  settled opening snapshot can miss an empty first frame.
- Measure the opening narration and its visual scene. The first useful example
  should follow the brief hook, without a long setup about an excluded option.
- Required brand ground, fonts, icons, and closing-card structure match
  the selected frame. Essential labels remain readable at phone size.
- Check actual text bounds, caption placement, and safe areas against the frame.
  Starting sizes may be adjusted for legibility; fixed brand requirements remain.
- Compare settled scenes. Repeated layouts should help the viewer compare or
  follow a change. Replace generic mockups and unfinished placeholders with
  meaningful content.
- Check each settled snapshot against the scene rules in `script.md`: no persistent
  navigation chrome, no narration sentence or footnote as visible text, mockup
  fields containing data rather than script examples, about three groups with
  one hero, strokes within the weight ceiling, and no caption highlight color in
  headlines. Fix any failure before rendering.
- Read every visible line as editorial copy. Remove filler words, repeated
  middle-dot separators, generic kickers, and unsupported urgency. If several
  scenes reduce to a large number above a rounded rectangle, redesign the
  proof objects before rendering.
- Captions and narration match; qualifiers stay with their claim, spoken or labeled.
- The closing card has its own readable hold, with no previous scene remnants.

Before frame review, listen to a narration-heavy passage and the closing card
at the actual mix level. Lower music if it competes with speech; full-mix LUFS
does not establish voice-to-music balance. Provide a browser preview or short
combined-mix sample at the frame checkpoint. Listen for pacing, pronunciation,
masking, and cutoffs as well as balance. If playback is unavailable, say which
checks were performed and ask the user to audition the sample. Fix
demonstrated issues and repeat the affected checks.

Design `composition/thumbnail.html` as a separate static cover at the video's
aspect ratio, using HTML, CSS, and SVG with the same browser renderer as the
video. It is HTML rendered to JPEG; no image-generation service is needed.
Profile grids show only a centered crop and platform UI covers the edges, so at
1080×1920 keep all text and the focal subject within x 60–960 and y 240–1400.
That box survives the 3:4 grid crop and clears TikTok's bottom caption band and
right-side buttons. Keep an equivalent centered box for other formats.

Use the chosen title as one headline and one subject-specific hero filling
roughly 40–60% of the safe box. Keep the headline as HTML text for exact
spelling. Do not add a subtitle; revise the plan at the review checkpoint if
the title needs changing.
Add a badge only when it carries a fact neither shows, and draw it as part of
the hero rather than as a separate card. Show the result, a before and after, or the
problem the video solves. Rebuild the video's strongest proof object for the
cover rather than copying the opening frame. The subject should be recognizable
before any text is read: the place, product, or outcome the topic names, not a
generic icon. Repeating the subject from the post caption is fine, and
the video must deliver what it promises. Use the frame's palette and ground and
leave no large empty region. Avoid generic robots, floating UI, fake product
screens, invented data, filler words, and claims the video does not support.

Render two visual cover concepts with the chosen title at final size. Crop each to the safe box,
shrink it to about 150 px wide, and view it slightly blurred, as it appears in
a profile grid. Keep the concept whose headline and hero together make the
video's topic and payoff clear at that size, then convert it to `thumbnail.jpg`
at the run root.
Keep the editable HTML inside `composition/`. The cover is not a frame extracted
from `video.mp4` or a scene added to it, but the first decoded video frame
should also work as a fallback cover, since some platforms choose one.
Write the concise, sourced post caption, the text published with the video, to
`caption.txt`. Keep research and
the plan alongside the editable composition; no extra handoff document is
needed.

### Review frames

Save one settled frame per scene from the composition, with no video encode.
From the run directory:

```bash
npx hyperframes snapshot composition --at 0,<settled times> --no-end --describe false -o composition/frames
```

Take each scene's time after its last planned reveal has finished and before
its exit begins, using the measured timings in the plan. Include 0 s for the
opening and a time inside the closing card's hold. Name the images in scene
order, such as `00-opening.png`, `01-<scene>.png`, and `NN-closing.png`, and
record their timestamps in the plan. These frames show each finished state;
motion, audio, and caption timing still need playback review. Then follow the
entrypoint's frame checkpoint.

### Final render

After the frame checkpoint is approved, aim for one final render using the
installed CLI's supported quality setting and `--output ../video.mp4`. Verify the actual MP4 with `ffprobe`
for dimensions, duration, and expected audio streams, and inspect its opening,
representative content, and ending. Passing `check` alone is not visual QA.
Another full render is justified by an observed export defect or an intentional
revision, not by optional polish discovered because earlier checks were skipped.
Record CLI version, output duration, and render wall time in the existing plan
so encoding cost can be distinguished from research and authoring cost.

Export every decoded frame only on request. It produces about 2,700 PNGs for a
90-second video at 30 fps:

```bash
mkdir -p composition/frames/all
ffmpeg -hide_banner -i video.mp4 -map 0:v:0 -fps_mode passthrough composition/frames/all/frame-%06d.png
```
