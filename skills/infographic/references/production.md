# Production

Use `SCRIPT.md` as the narration source, `video-plan.md` as the storyboard, and the selected
`frame.md` as the styling record. Resolve the skill's assets relative to this
skill directory, not a hardcoded Claude installation path. Use the installed
HyperFrames command guidance or `--help` for version-dependent flags.

## Narration and timing

For narrated runs, preflight the current machine before production. Reuse the
project's pinned HyperFrames installation and inspect its `tts --help`; avoid
repeated `npx` downloads. Resolve Python from `HYPERFRAMES_PYTHON`, a project
virtual environment, or `python3`. Verify `import kokoro_onnx, soundfile` using
that interpreter and generate a short test WAV with the selected voice. Probe
its duration. An import alone does not verify model files or voice support.
Persist the working interpreter and CLI paths in the run's plan, never in this
portable skill. If dependencies are missing, create a project-local virtual
environment and install the packages required by the installed TTS version.
Distinguish permission errors (`EPERM`/`EACCES`) from missing Python/packages;
reinstalling cannot repair a sandbox denial. Request only the required tool
permission, reuse granted permissions, and do not repeat creative approval
questions for work the user already authorized. Test transcription availability
too when captions are requested. `--script-only` skips this preflight.

Before final animation, follow `media-use`'s Kokoro TTS workflow to generate
one WAV per voiced scene from its `SCRIPT.md` text only. Do not feed fact IDs,
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

Transcribe the generated audio using `media-use` for word timing. Check the
transcript against the script, especially names, prices, and negations. Group
captions at natural phrase boundaries, usually three to seven words; short
complete phrases are fine. Offset per-scene timestamps by the scene start.
Caption every spoken phrase, including the opening and final sentence; a scene
summary is not a subtitle. Do not delay subtitles for an entrance animation.
Verify full text coverage against `SCRIPT.md` and spot-check the start, middle,
and end of each scene against actual audio timing. Keep captions clear of
essential labels and the platform UI. With captions
disabled, skip transcription unless another requested feature needs it.

## Composition and audio

Read `hyperframes-core` before writing HTML. Use its seekable timeline and
framework-owned media contract; animate inner scene content as appropriate.
Read `hyperframes-animation` for motion and `hyperframes-keyframes` for camera
moves. For named effects/components, consult `hyperframes-registry` first.
Keep the project and used fonts, images, and audio inside `composition/`.

Build the selected frame's ground and closing card before proliferating
scenes. Inspect them with one evidence scene at phone size. Apply the frame's
safe areas, scaling pixel values when changing resolution. If the frame does
not specify them, use conservative margins for the target platform and verify
that captions, labels, and closing marks remain readable.

For revisions, compare the prior composition before replacing its visual
structure. Preserve useful comparisons and state changes unless the new design
explains them more clearly. A restyled card with an entrance animation alone
does not replace a working infographic.

Time reveals to the explanation. Use consistent scales and labeled units for
charts. Distinguish an illustrative UI from a captured product interface.
Avoid long empty holds after an entrance, but keep a completed comparison on
screen long enough to understand. A held diagram can be useful without idle
pulsing or gratuitous animation.

Choose one bundled track from `assets/music/` or a supplied track. Vol-12 is
the default bed; begin around 0.10–0.18 gain under narration and adjust after
listening. Pick a few SFX to match actual actions; optional selection notes
are in `assets/sfx/sfx-analysis.md`. Copy only selected files. Gain numbers
are starting points, not a loudness guarantee. Read `hyperframes-audio` for
fades, ducking, or effects; do not assume browser volume tweens reach export.

Beat analysis is optional, useful mainly for a requested music-led passage.
The existing `hyperframes beats <composition-dir>` command can analyze local
music after it is placed in the composition; follow the CLI's beat guidance.
Narration and reading time take priority. No custom Python analyzer or
mandatory audio-reactive treatment is needed.

## Review and render

From the composition directory, run `hyperframes check` and fix errors.
Capture representative settled frames and transitions with `hyperframes
snapshot`; actually inspect the images, including the first and last scenes.

Check the things validation cannot establish:

- The opening identifies the subject; the proof object explains the claim.
- Required brand ground, fonts, icons, and closing-card structure match
  the selected frame. Essential labels remain readable at phone size.
- Captions and narration match; qualifiers remain visible with their claim.
- The closing card has its own readable hold, with no previous scene remnants.

Review playback with audio for pacing, pronunciation, masking, and cutoffs;
stills cannot establish these. If playback/audio review is unavailable, say
which checks were performed. Fix demonstrated issues and repeat the affected
checks. `--stop-after compose` ends after this stage, before encoding.

For a full video request, render after review using the installed CLI's
supported quality setting and `--output ../video.mp4`. If the user requested
a preview/approval checkpoint, honor it. Verify the actual MP4 with `ffprobe`
for dimensions, duration, and expected audio streams, and inspect its opening,
representative content, and ending. Passing `check` alone is not visual QA.

Extract a settled, representative frame as `video.jpg` with FFmpeg. Keep it
as a separate thumbnail; do not re-encode the video to insert a one-frame
poster flash. Platform thumbnail selection is outside this workflow.
Write concise, sourced platform copy to `share-copy.txt`. Keep research and
the plan alongside the editable composition; no extra handoff document is
needed.
