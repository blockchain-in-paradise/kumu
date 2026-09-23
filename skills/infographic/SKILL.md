---
name: infographic
description: Create a researched, narrated infographic video from a topic, article URL, or notes using HyperFrames and a brand frame.md. Use for social explainers, comparisons, timelines, and how-tos; not product launch trailers or captioning existing footage.
---

# /infographic

Research the subject, design a visual explanation, and deliver a branded video.
This skill owns research, story, and brand direction. HyperFrames supplies the
composition, animation, audio, and rendering tools; it is not a separate agent.

## Inputs and defaults

Accept a topic in natural language or `--topic`, `--url`, `--source <notes>`,
`--script <markdown>` for user-authored narration (preserve its wording),
`--research <json>`. Ask for a subject only when it is missing.

- Default: vertical 1080×1920, 30–90 seconds including any frame-required closing card, narrated with Kokoro
  `af_heart`, phrase captions highlighting the current spoken word, quiet music,
  sparse SFX.
- Honor `--frame <path>`, `--tone <direction>`, `--duration <seconds>`,
  `--format vertical|square|landscape`, `--platform`, `--title`, `--scenes`.
  Square is 1080×1080; landscape is 1920×1080. Tone is freeform, not a preset
  that can override the brand. Duration includes the closing card.
- Honor `--no-voice`, `--no-captions`, `--no-music`, `--no-sfx`.
  Without narration, omit speech captions unless timed speech is supplied;
  keep explanatory labels and allow enough reading time.
- Every completed video includes a separately designed `thumbnail.jpg` and every
  decoded video frame as a PNG under `composition/frames/`.
- `--script-only` ends after the plan, before TTS or rendering.
- Every run belongs in `video-output/YYYY-MM-DD-HHmmss-topic/` in the invoking
  project. Never create a sibling of `video-output/`. For revisions, reuse
  the run directory unless retaining a comparison; then create a new run
  subdirectory. Keep renders, temporary media, and previews inside that run.
- For a new run, do not list or inspect earlier runs in `video-output/`. Open one
  only when the user explicitly asks to review, revise, or resume it.

## Execution environment

Research and script planning need browsing and file creation. Full production
also needs Node.js, HyperFrames and its domain guidance, FFmpeg, a browser
renderer, and the selected speech/transcription tooling in the **current execution
environment**. A web session does not inherit software installed on the user's PC.
Check capabilities once; use available native tools and registry components.
If production is unavailable, complete research/script/planning and report the
specific missing dependency and resume stage. Do not claim to have rendered,
silently change providers, or simulate word timing. When browsing is unavailable,
use supplied sources and mark claims that still need verification.

## Brand

Resolve `--frame`, then project `brand/frame.md`, then the bundled
[assets/brand/frame.md](assets/brand/frame.md). An explicitly supplied path
that is missing is an error, not permission to silently substitute a brand.
An article URL supplies facts; its publisher's identity does not replace the
channel's brand unless requested.

Read the selected frame's tokens and prose. Resolve its asset paths relative
to that file and verify the required files exist before planning. Copy only
used assets into `composition/assets/`, preserving relative paths. Record the
frame path in the plan. User direction wins over frame defaults. Report missing required assets instead of
inventing a logo or silently dropping the ground treatment.

## Workflow

Run the stages below in order, loading their guidance when needed. Complete
the requested stages without intermediate creative approvals unless requested.

1. **Research and gather visual evidence.** Read [research.md](research.md).
   Choose a useful audience question and support its answer in `research.json`.
   Identify images, screenshots, data, or diagrams that can explain the subject.
2. **Write and design.** Read the script and scene-planning sections of
   [production.md](production.md). Write connected narration in `SCRIPT.md`,
   edit it as speech, and create focused scene briefs in `video-plan.md`.
   Stop for `--script-only` before TTS or rendering.
   Use the plan handoff below.
3. **Produce.** Follow the remaining production sections. Check tooling,
   generate and measure narration, finalize selected assets, and compose with
   HyperFrames. Inspect one representative scene with active captions before
   expanding the sequence. Review and validate the complete composition.
4. **Deliver.** Render and inspect `video.mp4`, design an HTML cover and capture
   it as `thumbnail.jpg`, export every decoded frame to `composition/frames/`,
   and write `share-copy.txt`.

Load `hyperframes-core` and `hyperframes-cli` for implementation, `media-use`
for media and speech, and other HyperFrames domain guidance only for the task
at hand. Pass this brief and plan into production without restarting a generic
video intake interview.

### Plan handoff and continuation

After a plan-only run, show the script and plan links, record `Status: awaiting
render decision` and the run path in `video-plan.md`, and ask once:
"Continue with this script and plan to produce the full video? Yes / No."
Wait for an explicit reply; no reply means no production. No leaves the files
ready for later. Requested edits update the same run; approval covers those
edits only unless the user also asks to render.

Yes resumes stage 3 in that exact run directory using the latest saved script,
research, plan, and original options. Clear the previous stop condition. Preserve
the approved wording; resolve documented factual gaps and report any necessary
correction before TTS. Do not restart research or create a new run. An explicit
request to resume a named run and render is already approval. In a new session,
use the run path the user supplies. Full-video requests skip this handoff.

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

Return `video.mp4`, `thumbnail.jpg`, `share-copy.txt`, `research.json`,
`SCRIPT.md`, `video-plan.md`, and the editable `composition/`. Report duration,
dimensions, exported frame count, checks performed, and unresolved limitations.
For a partial run, identify the completed stage and how to resume that run.
Never describe a technical validation pass as proof of editorial quality.
