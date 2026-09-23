---
name: infographic
description: Create a researched, narrated infographic video from a topic, article URL, or notes using HyperFrames and a brand.md. Use for social explainers, comparisons, timelines, and how-tos; not product launch trailers or captioning existing footage.
---

# /infographic

Research the subject, design a visual explanation, and deliver a branded video.
This skill owns research, story, and brand direction. HyperFrames supplies the
composition, animation, audio, and rendering tools; it is not a separate agent.

## Inputs and defaults

Accept a topic in natural language, `--topic`, or `--url`. Ask for a subject only when it is missing.

- Default: vertical 1080×1920, 30–90 seconds including any frame-required closing card, narrated with Kokoro
  `af_heart`, phrase captions highlighting the current spoken word, quiet music, sparse SFX.
- Honor `--brand <name>`, `--tone <direction>`, `--duration <seconds>`,
  and `--format vertical|square|landscape`. Square is 1080×1080; landscape is
  1920×1080. Tone is freeform, not a preset that can override the brand.
  Duration includes the closing card.
- Honor `--no-voice`, `--no-captions`, `--no-music`, `--no-sfx`.
  Without narration, omit speech captions unless timed speech is supplied;
  keep explanatory labels and allow enough reading time.
- Every completed video includes a separately designed `thumbnail.jpg` and one
  settled review frame per scene under `composition/frames/`.
- Every run belongs in `video-output/YYYY-MM-DD-HHmmss-topic/` in the invoking
  project. Never create a sibling of `video-output/`. For revisions, reuse
  the run directory unless retaining a comparison; then create a new run
  subdirectory. Keep renders, temporary media, and previews inside that run.
- For a new run, do not list or inspect earlier runs in `video-output/`. Open one
  only when the user explicitly asks to review, revise, or resume it.

## Execution environment

Research and script planning need browsing and file creation. Full production
also needs Node.js, HyperFrames and its domain guidance, FFmpeg, a browser
renderer, and the selected speech/transcription tooling in the current execution
environment. A web session does not inherit software installed on the user's PC.
Check capabilities once; use available native tools and registry components.
If production is unavailable, complete research/script/planning and report the
specific missing dependency and resume stage. Do not claim to have rendered,
silently change providers, or simulate word timing.

## Brand

`--brand` takes a brand name, matched case-insensitively against each brand's
folder name or the `name` in its `brand.md`. Search the project's `brands/`
folder first, then the bundled [assets/brands/](assets/brands/). Without
`--brand`, use the bundled Pūpūkahi Tech brand. A named brand that cannot be
found is an error, not permission to silently substitute another; list the
available names instead. An article URL supplies facts; its publisher's
identity does not replace the channel's brand unless requested.

Read the selected `brand.md` for colors, type, spacing, ground, assets, and the
closing-card handle, then [frame.md](frame.md) for how to apply them. Together
they are "the frame" referred to elsewhere. Resolve asset paths relative to
`brand.md` and verify the required files exist before planning. Copy only used
assets into `composition/assets/brand/`. Record the brand path in the plan.
User direction wins over brand defaults. Report missing required assets instead
of inventing a logo or silently dropping the ground treatment.

## Workflow

Run these stages in order, stopping at both checkpoints below.

1. **Research.** Read [research.md](research.md). Save supported claims and
   visual sources in `research.json`.
2. **Script and plan.** Read [script.md](script.md). Start `video-plan.md` with
   the run path and the requested options (tone, format, duration, frame, and
   flags) so a later session can resume. Write `SCRIPT.md`, then the scene
   briefs and thumbnail brief in `video-plan.md`. Run no TTS or HyperFrames
   command yet. Stop at the plan checkpoint.
3. **Compose.** Read [render.md](render.md) and build from the approved script
   and plan only. Inspect a captioned scene before expanding the sequence, then
   validate the composition, check the mix, create `thumbnail.jpg` and
   `caption.txt`, and save the review frames. Stop at the frame checkpoint.
4. **Render.** Follow "Final render" in [render.md](render.md) and inspect
   `video.mp4`.

Load `hyperframes-core` and `hyperframes-cli` for implementation, `media-use`
for media and speech, and other HyperFrames domain guidance only for the task
at hand. Pass this brief and plan into production without restarting a generic
video intake interview.

### Checkpoints

Both checkpoints are required on every run, including requests for a full or
finished video.

At each checkpoint, record the status in `video-plan.md`, link the files to
review, ask once, and end the turn. No, or no reply, leaves the run ready for
later. Requested edits update the same run, and the same checkpoint asks again.
A request to continue a named run approves only its current checkpoint.

- **Plan:** record `Status: awaiting plan review`, link `research.json`,
  `SCRIPT.md`, and `video-plan.md`, and ask: "Continue with this script and plan,
  using the recommended thumbnail title unless you pick another? Yes / No."
- **Frames:** record `Status: awaiting frame review`, link `composition/frames/`,
  `thumbnail.jpg`, `caption.txt`, and the audio preview, and ask: "Render the
  final video from this composition? Yes / No."

To resume, read the options and status from `video-plan.md` and continue from
the saved files without repeating completed stages. Use the latest `SCRIPT.md`,
preserve approved wording, and resolve factual gaps before TTS.

## Creative standard

Make the subject recognizable and the explanation useful. Show actual objects,
source material, relationships, and changes. Select the visual form per scene;
a process, comparison, tutorial, and timeline need different treatment.
Keep the selected brand's ground and overlay intact while designing the
foreground around the information. Generic icons cannot carry the main idea.

Write natural, connected speech with a short opening and a supported answer.
Use the user's tone and any supplied writing samples without copying anecdotes.
Do not use em dashes, semicolons, canned contrasts, or middle-dot separators in
agent-written audience copy. Colons belong in times or necessary notation,
not hook formulas. Preserve supplied scripts and verbatim source quotations.

## Delivery

Return `video.mp4`, `thumbnail.jpg`, `caption.txt`, `research.json`,
`SCRIPT.md`, `video-plan.md`, and the editable `composition/`. Report duration,
dimensions, review frame paths, checks performed, and unresolved limitations.
For a partial run, identify the completed stage and how to resume that run.
Never describe a technical validation pass as proof of editorial quality.
