---
name: kumu
description: Create a researched explainer video for TikTok, Reels, or Shorts from a topic, article URL, or notes, built around one concrete visual concept (a metaphor, a simplified real scene, or a simulation) using HyperFrames and a brand.md. Narrated with word-highlighted captions, or visual-only with on-screen lines. Use for concept explainers, algorithms, comparisons, timelines, what-ifs, and tool lists; not product launch trailers or captioning existing footage.
---

# /kumu

Research the subject, find one concrete visual concept that explains it, and
deliver a branded vertical video. This skill owns research, concept, story, and
brand direction. HyperFrames supplies composition, animation, audio, and
rendering; it is not a separate agent.

## Inputs and defaults

Accept a topic in natural language, `--topic`, or `--url`. Ask for a subject
only when it is missing.

- `--mode narrated|visual`. Narrated: Kokoro `af_heart` voice, phrase captions
  highlighting the spoken word, 30–90 seconds. Visual: no voice, short on-screen
  lines carry the words, music and SFX, 10–90 seconds. Without `--mode`, the
  concept step recommends one. `--no-voice` means `--mode visual`.
- `--duration <seconds>` includes the closing card.
- `--format vertical|square|landscape`: 1080×1920 (default), 1080×1080, 1920×1080.
- `--brand <name>`, `--tone <direction>`. Tone is freeform and never overrides the brand.
- `--ref <url>` (repeatable): a video whose structure and pacing to learn from.
  Read [references/ref-video.md](references/ref-video.md).
- `--no-captions`, `--no-music`, `--no-sfx` turn off individual layers.

Every completed video includes a separately designed `thumbnail.jpg` and one
settled review frame per state under `composition/frames/`.

Every run lives in `video-output/YYYY-MM-DD-HHmmss-topic/` in the invoking
project. Never create a sibling of `video-output/`. Revisions reuse the run
directory unless a comparison is wanted; then create a run subdirectory. For a
new run, do not open earlier runs unless the user asks to review or resume one.

## Setup check

Before the first production command of a session, run:

```bash
HYPERFRAMES_PYTHON="$HOME/.kumu/venv/bin/python" npx -y hyperframes doctor
```

Prefix every HyperFrames command with the same `HYPERFRAMES_PYTHON`. If the
environment is missing or doctor fails a check other than BGM (MusicGen),
which Kumu never uses, tell the user what is missing and offer to run
[scripts/setup.sh](scripts/setup.sh) (macOS and Linux). It installs the Python
voice environment at `~/.kumu/venv`, HyperFrames skills, and the headless
browser. If it reports a missing system package, show its install command and
let the user approve it; never run `sudo` without asking. Research and planning
need no setup, so start them while the user decides.

On Windows or another unsupported system, complete research and planning, then
report the missing dependencies and the resume stage. Never claim to have
rendered, silently change providers, or simulate word timing.

## Brand

`--brand` matches a brand's folder name or the `name` in its `brand.md`,
case-insensitively. Search the project's `brands/` folder first, then the
bundled [assets/brands/](assets/brands/). Without `--brand`, use the bundled
Pūpūkahi Tech brand. A named brand that cannot be found is an error: list the
available names instead of substituting. An article's publisher does not
replace the channel's brand unless requested.

Read the selected `brand.md`, then [frame.md](frame.md) for how to apply it.
Together they are "the frame". Resolve asset paths relative to `brand.md`,
verify required files exist, and copy only used assets into
`composition/assets/brand/`. Record the brand path in the plan. User direction
wins over brand defaults.

## Workflow

Run these stages in order, stopping at both checkpoints.

1. **Research.** Read [research.md](research.md). Save supported claims and
   visual sources in `research.json`.
2. **Concept.** Read [concept.md](concept.md). Write three concepts and a
   recommendation into `video-plan.md`, after the run path and requested options
   (mode, tone, format, duration, brand, flags, refs) so a later session can resume.
3. **Script and plan.** Read [script.md](script.md). For the recommended
   concept, write the words (`SCRIPT.md` when narrated, the on-screen lines in
   the plan when visual), the stage, its states, and the thumbnail brief. Run no
   TTS or HyperFrames command yet. Stop at the plan checkpoint.
4. **Compose.** Read [frame.md](frame.md) and [render.md](render.md). Build
   from the approved plan only. Inspect one state at phone size before building
   the rest, then validate, check the mix, create `thumbnail.jpg` and
   `caption.txt`, and save the review frames and contact sheet. Stop at the
   frame checkpoint.
5. **Render.** Follow "Final render" in [render.md](render.md) and inspect `video.mp4`.

Load `hyperframes-core` and `hyperframes-cli` for implementation, `media-use`
for media and speech, and other HyperFrames guidance only for the task at hand.
Pass this brief and plan into production without a generic intake interview.

### Checkpoints

Both checkpoints are required on every run, including requests for a finished
video. At each, record the status in `video-plan.md`, link the files to review,
ask once, and end the turn. No, or no reply, leaves the run ready for later.
Requested edits update the same run, and the same checkpoint asks again. A
request to continue a named run approves only its current checkpoint.

- **Plan:** record `Status: awaiting plan review`, link `research.json`,
  `video-plan.md`, and `SCRIPT.md` when narrated, and ask: "Continue with
  concept <letter> and this plan, using the recommended thumbnail title unless
  you pick another? Yes / No, or name another concept." Choosing another concept
  rewrites the words and stage for it and asks again.
- **Frames:** record `Status: awaiting frame review`, link
  `composition/frames/contact-sheet.jpg`, `thumbnail.jpg`, `caption.txt`, and
  the audio preview, and ask: "Render the final video from this composition?
  Yes / No."

To resume, read the options and status from `video-plan.md` and continue from
the saved files without repeating completed stages. Preserve approved wording
and resolve factual gaps before TTS.

## Creative standard

The concept carries the video. One concrete stage that changes, driven by a
real model, beats a sequence of well-designed slides. Make the subject
recognizable and every number honest. Generic icons cannot carry the main idea.

Use the user's tone and any supplied writing samples without copying anecdotes.
In agent-written audience copy, do not use em dashes, semicolons, canned
contrasts, or middle-dot separators. Colons belong in times or necessary
notation, not hook formulas. Never write staccato copy: no runs of clipped
sentences or fragments for effect ("Fast. Simple. Free."). Join them into
sentences that carry the reasoning; a visual-mode line is one complete phrase.
Preserve supplied scripts and verbatim quotations.

## Delivery

Return `video.mp4`, `thumbnail.jpg`, `caption.txt`, `research.json`,
`video-plan.md`, `SCRIPT.md` when narrated, and the editable `composition/`.
Report duration, dimensions, the contact sheet path, checks performed, and
unresolved limitations. For a partial run, name the completed stage and how to
resume. Never describe a technical validation pass as proof of editorial quality.
