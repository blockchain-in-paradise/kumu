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

- Default: vertical 1080×1920, 30–90 seconds including the closing card, narrated with Kokoro
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
- `--refresh-research` refreshes cached facts. `--script-only` is equivalent
  to `--stop-after plan`; `--stop-after research|plan|compose` ends at that stage.
  Compose includes narration, captions, and validation, but no video encode.
- Every run belongs in `video-output/YYYY-MM-DD-HHmmss-topic/` in the invoking
  project. Never create a sibling of `video-output/`. For revisions, reuse
  the run directory unless retaining a comparison; then create a new run
  subdirectory. Keep renders, temporary media, and previews inside that run.
- For a new run, do not list or inspect earlier runs in `video-output/`. Open one
  only when the user explicitly asks to review, revise, or resume it.

## Execution environment

This skill ships instructions and assets, not a `scripts/` package. It can be
loaded by a CLI agent or uploaded as a custom skill in a web app. Flags above
are instructions to the agent, not a separately installed command-line parser.
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

## 1. Research

Read [references/research.md](references/research.md). Write one
`research.json` containing claims, sources, qualifications, and gaps. This is
the factual record; a separate `SOURCES.md` is optional for a requested export.
Stop here for `--stop-after research`.

## 2. Write the narration, then plan the visuals

Draft a connected spoken explanation before choosing scene boundaries or
animation timing. Do not turn research bullets into one short sentence each
or compress the story to fit a preselected layout. Use the user's tone and
any supplied writing examples; visual references do not establish a narrator's
voice.

Use plain language in narration and delivery notes. Do not use em dashes.
When writing examples are supplied, follow their level of detail, rhythm, and
point of view without copying their claims or anecdotes.

For agent-written narration, choose a specific viewer situation and a question
the video can answer. Write the explanation as connected paragraphs before
splitting it into scenes. Develop an example far enough to show what happens
and why it matters. In a comparison, connect the options through the viewer's
needs instead of restarting with a product name, price, and feature list.

Use complete spoken sentences as the default. Keep the connecting words that
carry the reasoning, such as "because", "if", and "so". Read the paragraphs
without their headings: the subject and the move to the next idea should still
be clear. Vary sentence length where the thought calls for it. Do not turn
qualifications into slogans, append feature fragments, or manufacture a voice
with slang and fake personal anecdotes.

Examples of the intended edit, assuming the underlying facts are verified:

- "One license, one person." becomes "That price covers one person, so check
  the team pricing if someone else needs access too."
- "A research assistant, not a writer." becomes "It includes links with its
  answers, which gives you a way to check where the information came from."
- "Gamma: nine dollars ... a thousand AI credits a month." becomes "If you
  already have notes for a supplier pitch, Gamma can turn them into a slide
  deck. You'll still need to check the wording before you send it."

These are examples of sentence structure, not reusable product claims. Put
secondary specs on screen when they interrupt the explanation; keep purchase
conditions visible beside prices. End with a recommendation or answer supported
by the example, rather than a generic instruction to upgrade or save time.

Before TTS, make one editorial pass on the whole script. Repair abrupt jumps,
repeated openings, sentence fragments, and canned contrasts such as "X, not Y".
Remove em dashes by rewriting the relationship between clauses, not swapping
punctuation. Check that research supports the opening and conclusion as well
as individual facts. Preserve useful detail and qualifications. When shortening,
cut a secondary feature or repeated setup before cutting the connective wording
that makes the explanation flow. This pass needs no extra approval or file.

Then divide the draft into scenes and write `SCRIPT.md` with a heading per
scene and only spoken text beneath each heading. This is the editable narration
source. Copy supplied `--script` wording here unchanged; flag factual problems
rather than silently rewriting. User-authored scripts skip the editorial rewrite
unless requested.
Write `video-plan.md` for audience, takeaway, frame, format, runtime, audio,
and storyboard. Reference script scene headings instead of duplicating speech.

For each scene record:

- Purpose and fact IDs (including qualitative claims).
- Exact headline/labels, including units and necessary qualifications.
- What the viewer sees change and what that change explains.
- Matching `SCRIPT.md` scene heading, or `none` for an unvoiced scene.
- Estimated duration, then measured duration after TTS; entrance, settled
  reading time, and handoff to the next scene.

### Choosing what to show

Choose visuals that help the viewer understand this scene. Photos, captured
interfaces, illustrations, diagrams, charts, and text can work together.
Record the chosen visual and its role in the storyboard; no ranking or account
of rejected alternatives is needed. Preserve the brand ground and overlay.
For visual planning, read `hyperframes-creative` and its relevant composition
guidance. The selected frame overrides its generic palette and ambient-motion defaults.

Specify the object, what happens to it, and what the viewer learns. Show a
customer question becoming a useful reply, or rough menu notes becoming a
finished menu with real content. Avoid placeholder bars standing in for the
result. Label invented interfaces and example data as illustrative on screen.
Keep useful objects across scenes when that makes the explanation easier to follow.

Use `media-use` for relevant images and consistent icons, and search
`hyperframes-registry` for reusable components before building them. Adapt
selected assets to the frame. Use a finished icon from one family instead of
approximating it with CSS shapes. Custom SVG is useful for diagrams whose
geometry explains the subject; inspect it at phone size before animating it.

Put a visual hook in the first decoded frame of the video. Show the actual
subject and a short reason to keep watching, readable with sound off at time
zero. Keep the spoken hook to one brief sentence, roughly five seconds or less,
then move into the first useful example. Lead with an included subject rather
than explaining an excluded alternative. Place exclusions where they affect a
choice. Do not open on an empty ground, fading title, or generic promise.
Keep one dominant proof object per beat and labels readable at phone size.
Use visuals to carry comparisons and show the changes the narration explains;
the voice should add reasoning rather than simply read all on-screen text.
Saying a key number or label aloud is useful. Spell out awkward numbers and
abbreviations in agent-written narration for TTS.

Budget any frame-required closing card as its own scene. Within the default
30–90-second range, let the explanation determine the length; do not aim for
30 seconds by default or remove useful examples to meet an estimated runtime.
An explicit `--duration` overrides this range. Stop here for `--script-only`
or `--stop-after plan`.

## 3. Produce

Read [references/production.md](references/production.md). Load HyperFrames
`hyperframes-core` and `hyperframes-cli` for implementation and checks;
`media-use` for narration/transcription; other domain guidance only for the
operation being performed. Use this plan as the workflow input without
restarting a generic video intake interview. If required tooling is missing,
report the concrete dependency and keep the completed plan.

Generate and measure narration before final animation timing. Build the
composition using the existing tools and components in production guidance;
avoid generating standalone helper scripts for routine operations. Check one representative evidence scene with
captions, the audio mix, and the closing card before expanding remaining scenes.
Then validate and inspect the full sequence. Stop here for
`--stop-after compose`; otherwise render the requested deliverable.

## Delivery

Return `video.mp4`, the separately designed `thumbnail.jpg`, `share-copy.txt`, `research.json`,
`SCRIPT.md`, `video-plan.md`, and the editable `composition/`. Report duration, dimensions,
frame count, validation status, and unresolved limitations. For partial runs, state the
completed stage and how to resume it without regenerating approved material.
