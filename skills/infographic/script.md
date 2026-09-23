# Script and plan

## Script and editorial pass

Use research to answer one audience question. Draft the narration as connected
paragraphs before deciding scene boundaries. Write to someone who wants to
understand or do the thing. Preserve useful reasoning and prerequisites, and
let the explanation determine its length within 30–90 seconds, including the
frame-required closing card. An explicit duration takes precedence.

Open with one brief, specific sentence, roughly five seconds or less, that
states the question, useful outcome, or strongest supported finding. Start
explaining immediately. Do not create a fictional customer, personal experience,
or extended scenario to make a comparison sound relatable. Use an example only
when it clarifies the point and remains accurate about the subject.
Use local context when it changes the advice or supplies relevant evidence.
An audience location alone is not a reason to invent a shop, name a town, or
place a map pin. Address the viewer directly when the instruction is universal.

Explain why one step follows another or which condition changes a decision.
Keep connective words such as "because", "if", and "so" where they carry that
reasoning. Move a secondary specification into a short visual label when it
interrupts speech. Essential qualifications stay with their claim, either spoken
or as a short label on the object they limit.
End the explanation with its answer or result. The brand's closing card does
not require a second spoken summary or invented engagement prompt.

Make one editorial pass before TTS:

- Read the draft without headings. Fix jumps, ambiguous pronouns, repeated
  sentence openings, and feature fragments. Vary length as the thought requires.
- Replace slogans and generic claims with a supported action, consequence, or
  distinction. "One license, one person" needs a sentence explaining who the
  price covers and when additional access changes the cost.
- Remove filler such as "actually", "just", and "simply" when it adds nothing.
  Cut stock praise, artificial suspense, forced triples, and "X, not Y" formulas.
  Follow the entrypoint's audience-copy punctuation rules across speech, labels,
  thumbnail, and post caption. Do not manufacture personality with slang or typos.
- Check the opening and ending against research, as well as individual claims.
  Do not claim firsthand testing or experience the user has not supplied.
- Keep each scene relevant to the audience question. Remove side advice that
  interrupts the explanation unless it changes the decision or is necessary
  to understand a claim. Preserve essential qualifications with that claim.
- Read aloud if tools allow, otherwise perform a spoken-language pass and
  disclose that audio was not auditioned. Fix awkward wording and pronunciation.
  Cut repeated setup before cutting the connections that make the prose flow.

Save `SCRIPT.md` with a heading per scene and only spoken text beneath headings.
Keep the narration continuous in meaning across scenes. User-supplied
narration is preserved and skips rewriting unless requested; report factual
problems separately. This file is the source for TTS and all later speech edits.
Do not shorten narration during implementation without updating it.

Keep exact destination URLs in the plan's on-screen copy and `caption.txt`.
In narration, name the service and direct the viewer to the address shown on
screen. Do not read protocols,
slashes, query strings, or long paths aloud. If a short address must be spoken,
record its exact displayed URL separately and verify its pronunciation during
TTS preparation. Never feed Markdown link syntax to TTS. A URL shown in a video
is visual text, not a clickable link; do not promise a clickable caption link
unless the selected platform and placement support it.

## Scene briefs

Use `video-plan.md` as the single plan; no separate beats JSON or duplicate
composition brief is needed. Record audience, question and answer, chosen frame,
format, target duration, audio direction, and then one short brief per scene:

| Field | What to specify |
| --- | --- |
| Purpose | What the viewer should understand or be able to do |
| Evidence | Fact IDs and script scene heading, without duplicating speech |
| Visual | Main object, composition, exact short labels, and any unspoken qualifier as a label |
| Assets | Selected visual IDs, local paths, or the geometry to draw |
| Changes | Initial state, what changes at which spoken phrase, final state |
| Timing | Estimated duration, then measured duration and global start after TTS |
| Handoff | What persists, what leaves, and why the next scene follows |

Read `hyperframes-creative` for relevant composition guidance. Brand tokens and
ground override generic style defaults. Choose the treatment around the subject:

- Comparisons use aligned measures or objects under equivalent conditions.
- Procedures show the actual objects and ordered actions with spatial continuity.
- Mechanisms reveal relationships and state changes in a coherent diagram.
- Timelines and maps use sourced dates, locations, and a readable route or scale.
- Recognizable subjects use suitable photos, item art, screenshots, or faithful
  reconstructions when these improve understanding.

Custom SVG is useful for explanatory geometry, paths, masks, and annotations.
Do not approximate a recognizable object with a generic line icon as the main
visual. Keep generic symbols subordinate. A diagram must encode a relationship
or change beyond restating the narration in boxes. For sourced interfaces, show
verified content; invented application screens are not evidence.

Choose a dominant subject and a clear reading order. Use scale, cropping,
alignment, and contrast to establish hierarchy. Avoid repeated eyebrow/title/
card/footer layouts, decorative pills, dot-separated metadata, tiny qualifiers,
and oversized numbers without context. Repeat positions when they support a
comparison. Related beats may evolve one scene rather than rebuild it.

Captions carry the spoken words, so visible text is labels, values, and at most
one short headline per scene. Do not set a narration sentence, a paraphrase of
it, or an explanatory footnote on screen; the viewer would read the same idea
twice while the captions move. Keep a scene to about three visual groups with
one hero, and label items with a few words placed next to what they name.
A decision point keeps its condition as a short label, such as the yes-or-no
question the viewer answers, because it shows a relationship the picture needs.

Beyond the headline and captions, keep a settled scene to about 15 visible
words. Show at most one qualifier per item; alternate prices, plan fine print,
and upgrade requirements go in narration or `caption.txt`. State a comparison's
scope or date once, where the comparison is introduced, not on every scene.

Less text is not a smaller picture. Let the hero fill roughly 40–60% of the
frame, and enlarge or add a meaningful state when a scene looks empty rather
than restoring sentences.

Build a social post, not a slide deck. Persistent navigation such as step rails,
chapter tabs, slide counters, or player-style progress bars spends space in
every frame and makes scenes read as slides. Show order inside the content: the
hero object changes state, or, when the viewer must follow steps in order, the
current step's object carries its number. The selected frame's required marks
are the only persistent elements.

Mockup fields hold data, not narration. Fill a field with a short, plausible
value or leave it empty; examples introduced with "like", "e.g.", or "such as"
belong in speech only. A clearly sample business name may fill a mockup, but it
stays out of narration and is never presented as a real place.

Weight comes from contrast before thickness. At 1080 px wide, keep strokes and
borders around 2–3 px, icon strokes no heavier than the adjacent label text, and
avoid cards inside cards. Show a duration or progress as a thin bar or a label
rather than a row of heavy blocks. Follow the accent roles in `frame.md`.

Plan the first decoded frame as a complete visual hook, with the recognizable
subject and a brief reason to watch. Do not delay it behind an entrance or fade.
For each scene, ask what the picture communicates before its labels are read.
If it only conveys "several facts", choose a more specific representation.
If changing the topic labels would leave the graphic equally usable, improve
its actual content and relationships. Avoid adding motion to disguise weak material.

Budget the selected frame's closing card separately.

Add a thumbnail brief to `video-plan.md`: three or four candidate titles with
your recommendation marked, the hero visual, and the result it promises. Each
title is two to five words naming the subject and the payoff the viewer wants,
with no subtitle. Avoid instructions, questions, and a measurement the hero
already shows. The user's pick, or the recommendation after a plain Yes,
becomes the cover title.

Planning ends here. Stop at the plan checkpoint in the entrypoint.

