---
name: kumu
description: Create any informative short video (how-to, comparison, local guide, explainer, decision guide, warning, timeline, list, or what-if) from a topic, article URL, or notes, researched and styled, for TikTok, Reels, and Shorts. Starts from what the viewer should be able to do or understand, then picks the form that teaches it, in a saved style built from reference videos. Narrated with word-highlighted captions or visual-only, built with HyperFrames. Not for product launch trailers or captioning existing footage.
---

# /kumu

Kumu means teacher. Research the subject, decide what the viewer should walk
away able to do or understand, choose the form that teaches it, and deliver a
vertical video in the chosen style. This skill owns research, concept, story,
and style. HyperFrames supplies composition, animation, audio, and
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
- `--style <name>`: the saved look to build in (see Style).
- `--tone <direction>`: freeform writing tone; it never overrides the style.
- `--ref <url>` (repeatable): a video whose structure and pacing to learn from.
  Read [references/ref-video.md](references/ref-video.md).
- `--no-captions`, `--no-music`, `--no-sfx` turn off individual layers.

Every run lives in `video-output/YYYY-MM-DD-HHmmss-topic/` in the invoking
project. Never create a sibling of `video-output/`. Revisions reuse the run
directory unless a comparison is wanted; then create a run subdirectory. For a
new run, do not open earlier runs unless the user asks to review or resume one.

## Setup check

Prefix every HyperFrames command with
`HYPERFRAMES_PYTHON="$HOME/.kumu/venv/bin/python"`. If `~/.kumu/ready` exists,
setup has already passed on this machine; skip the check. Otherwise, before the
first production command, run:

```bash
HYPERFRAMES_PYTHON="$HOME/.kumu/venv/bin/python" npx -y hyperframes doctor
```

If every check passes except BGM (MusicGen), which Kumu never uses, write
`~/.kumu/ready`. If a later command fails for a missing dependency, delete that
file and check again. If anything else fails, tell the user what is missing and offer to run
[scripts/setup.sh](scripts/setup.sh) (macOS and Linux). It installs the Python
voice environment at `~/.kumu/venv`, HyperFrames skills, and the headless
browser. If it reports a missing system package, show its install command and
let the user approve it; never run `sudo` without asking. Research and planning
need no setup, so start them while the user decides.

On Windows or another unsupported system, complete planning, then report what
is missing. Never claim to have rendered or simulate word timing.

## Style

A style is a folder holding `style.md` (tokens and look), `index.html` (a
working sample composition), `thumbnail/` (a cover sample), `preview.png`
(thumbnail, empty, elements, and closing frames side by side), and `assets/`. `--style` matches a folder name or
the `name` in its `style.md`, case-insensitively. Search the project's
`styles/` folder first, then the bundled [styles/](styles/): `pupukahi-tech`
(the default), `plain` (neutral, no closing card), and `motion` (light UI
motion graphics: drifting color fields, white UI cards, a cursor, blur-in
headlines). A named style that cannot
be found is an error: list the available names instead of substituting. An
article's publisher does not replace the style unless requested.

`$kumu style --ref <url> [--ref <url>...] --name <name>` builds a new style from
reference videos: follow [style-builder.md](style-builder.md) instead of the
workflow below.

Read the selected `style.md`, then [frame.md](frame.md). Copy the style's
`index.html` structure and only the assets used into the composition, and
record the style path in the plan. User direction wins over style defaults.

## Workflow

Run these stages in order, stopping at both checkpoints. After each stage,
update a `Stage:` line at the top of `video-plan.md` (for example
`Stage: compose, review round 1`) so an interrupted session resumes exactly
there.

1. **Research.** Read [research.md](research.md). Save supported claims and
   visual sources in `research.json`.
2. **Concept.** Read [concept.md](concept.md). Write three concepts and a
   recommendation into `video-plan.md`, after the run path and requested options
   (mode, style, tone, format, duration, flags, refs) so a later session can resume.
3. **Script and plan.** Read [script.md](script.md). For the recommended
   concept, write the words (`SCRIPT.md` when narrated, the on-screen lines in
   the plan when visual), the stage, its states, and the thumbnail brief. Then
   build only the first state as a still (stage, setting, title, and first
   line, no animation or audio) and save it with `hyperframes snapshot --at 0`
   as `composition/frames/style-frame.png`. Review it as
   [review.md](review.md) describes. Run no TTS yet. Stop at the plan
   checkpoint.
4. **Compose.** Read [frame.md](frame.md) and [render.md](render.md). Build
   from the approved plan only. Inspect one state at phone size before building
   the rest, create `thumbnail.jpg` and `caption.txt`, then run the review in
   [review.md](review.md). Stop at the frame checkpoint.
5. **Render.** Follow "Final render" in [render.md](render.md) and inspect `video.mp4`.

Load `hyperframes-core` and `hyperframes-cli` for implementation, `media-use`
for media and speech, and other HyperFrames guidance only for the task at hand.
Pass this brief and plan into production without a generic intake interview.

### Checkpoints

Both checkpoints are required on every run, including requests for a finished
video. At each, record the status in `video-plan.md`, link the files to review,
ask once, and end the turn. The message is a one-line summary, the links, and
the question; do not quote this skill's rules. No, or no reply, leaves the run
ready for later. Requested edits update the same run, and the same checkpoint
asks again. A request to continue a named run approves only its current
checkpoint.

- **Plan:** record `Status: awaiting plan review`, link `research.json`,
  `video-plan.md`, `SCRIPT.md` when narrated, and the style frame, name the
  style in use (switch with `--style <name>`), and ask: "Continue with
  concept <letter> and this plan, using the recommended thumbnail title unless
  you pick another? Yes / No, or name another concept." Choosing another concept
  rewrites the words and stage for it and asks again.
- **Frames:** record `Status: awaiting frame review`, give the review scores
  and any score below 4 with its reason, link
  `composition/frames/contact-sheet.jpg`, the Studio preview URL,
  `thumbnail.jpg`, `caption.txt`, and the audio preview, and ask: "Render the
  final video from this composition? Yes / No."

To resume, read the options, `Stage:`, and status from `video-plan.md` and
continue from the saved files without repeating completed stages. Preserve approved wording
and resolve factual gaps before TTS.

**Revising a run** (change a line, a color, a scene): edit its existing plan
and composition in place. If the plan lacks a section this workflow expects,
work from the sections it has and add one only when the change needs it.

**Remaking a run** (new concept, new look, or a fresh take on the same topic):
start a new run, copy the old `research.json`, re-check time-sensitive facts
such as prices and policies, and begin at the concept stage.

## Creative standard

Teach one thing well: the form follows the viewer's goal (see
[concept.md](concept.md)), and every number on screen is honest.

Spell Hawaiian and other non-English words correctly everywhere they appear,
including the ʻokina and kahakō (Hawaiʻi, Kalākaua). Pronunciation for the
voice is handled separately in [render.md](render.md).

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
