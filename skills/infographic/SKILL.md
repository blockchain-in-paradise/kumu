---
name: infographic
description: Create a researched, narrated infographic video from a topic, article URL, or notes using HyperFrames and a brand frame.md. Use for social explainers, comparisons, and mechanism diagrams; not product launch trailers or captioning existing footage.
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
  `af_heart`, phrase captions, quiet music, sparse SFX.
- Honor `--frame <path>`, `--tone <direction>`, `--duration <seconds>`,
  `--format vertical|square|landscape`, `--platform`, `--title`, `--scenes`.
  Square is 1080×1080; landscape is 1920×1080. Tone is freeform, not a preset
  that can override the brand. Duration includes the closing card.
- Honor `--no-voice`, `--no-captions`, `--no-music`, `--no-sfx`.
  Without narration, omit speech captions unless timed speech is supplied;
  keep explanatory labels and allow enough reading time.
- `--refresh-research` refreshes cached facts. `--script-only` is equivalent
  to `--stop-after plan`; `--stop-after research|plan|compose` ends at that stage.
  Compose includes narration, captions, and validation, but no video encode.
- Every run belongs in `video-output/YYYY-MM-DD-HHmmss-topic/` in the invoking
  project. Never create a sibling of `video-output/`. For revisions, reuse
  the run directory unless retaining a comparison; then create a new run
  subdirectory. Keep renders, temporary media, and previews inside that run.

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

For agent-written narration:

- Open with the specific question, situation, or consequence the video will
  explain. Avoid a generic promise to transform the viewer's life or business.
- Develop the reasoning. For comparisons, explain when an option helps and
  the tradeoff that affects the choice; for mechanisms, connect cause and
  effect through an example. Names, prices, and feature labels alone are
  not an explanation. Keep examples illustrative unless backed by evidence.
- Write sentences someone would say to one interested person. Use natural
  contractions and varied sentence lengths; do not make every sentence a
  slogan or repeat the same introduction for every item. Let transitions
  connect ideas instead of repeatedly announcing the next section.
- End by answering the opening question or giving a specific next step that
  follows from the explanation. The branded follow card is separate.

Before TTS, make one editorial pass: read the draft as continuous speech,
replace lines that could fit almost any topic with concrete details, repair
awkward phrasing, and remove repeated claims. Preserve examples, reasoning,
and factual qualifications. For example, replace "Save time and boost
productivity" with the actual task and how it changes. Do not invent personal
experience, product superiority, or savings to make the copy sound human.
This is an internal revision, not another approval checkpoint or deliverable.

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

Choose visuals by the explanation: a shared-scale comparison, a process
changing state, a timeline, or a concrete example. A number counting from zero
is an entrance effect; it does not explain a fact by itself. A mechanism
without numbers is a valid infographic. Reuse an object across scenes when
that helps the viewer follow the reasoning.

Make the subject and stakes visible in the opening, even with sound off.
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
composition, captions, and audio. Check one representative evidence scene
and the brand closing card visually before expanding the remaining scenes.
Then validate and inspect the full sequence. Stop here for
`--stop-after compose`; otherwise render the requested deliverable.

## Delivery

Return `video.mp4`, `video.jpg`, `share-copy.txt`, `research.json`,
`SCRIPT.md`, `video-plan.md`, and the editable `composition/`. Report duration, dimensions,
validation status, and unresolved limitations. For partial runs, state the
completed stage and how to resume it without regenerating approved material.
