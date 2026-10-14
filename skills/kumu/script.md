# Script and plan

Write the words and the plan for the recommended concept from
[concept.md](concept.md). The stage explains; the words name what the viewer
is seeing and why it matters.

## Narrated mode

Design and motion resources inform the visual plan, not the narration's
writing standard. Keep the editorial pass below; do not rewrite approved
speech to fit an animation recipe. If a factual correction or duration change
requires new wording, update the script and return it for human approval.

Use research to answer one audience question. Draft the narration as connected
paragraphs before deciding scene boundaries. Write to someone who wants to
understand or do the thing. Preserve useful reasoning and prerequisites, and
let the explanation determine its length within 30–90 seconds, including the
style's closing. An explicit duration takes precedence.

Write inside the chosen concept. Its metaphor or stage is the only framing
device: introduce it in a few words, stay inside it, and say plainly when the
explanation leaves it for the real subject.

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
End the explanation with its answer or result. The style's closing card does
not require a second spoken summary or invented engagement prompt.

Make one editorial pass before TTS:

- Read the draft without headings. Fix jumps, ambiguous pronouns, repeated
  sentence openings, and feature fragments. Vary length as the thought requires.
- Replace slogans and generic claims with a supported action, consequence, or
  distinction, in a sentence that explains who or what it covers.
- Remove filler such as "actually", "just", and "simply" when it adds nothing.
  Cut stock praise, artificial suspense, forced triples, and "X, not Y" formulas.
  Follow the style's audience-copy rules across speech, labels,
  and thumbnail. Do not manufacture personality with slang or typos.
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

Keep exact destination URLs in the plan's on-screen copy.
In narration, name the service and direct the viewer to the address shown on
screen. Do not read protocols,
slashes, query strings, or long paths aloud. If a short address must be spoken,
record its exact displayed URL separately and verify its pronunciation during
TTS preparation. Never feed Markdown link syntax to TTS. A URL shown in a video
is visual text, not a clickable link; do not promise a clickable caption link
unless the selected platform and placement support it.

## Visual mode

There is no `SCRIPT.md`. Write on-screen lines using the style's Type and
words or Captions section (plain's when absent). Lines follow the same factual
boundary as narration. Estimate reading time from when text becomes readable,
not from the start of its entrance, and verify at phone size.

Labels and values on the stage are separate from those lines; include them in
legibility review.

## The plan

`video-plan.md` is the single plan. Write every section as short bullets or
tables. State each decision once; never restate it in another section. After
the header (run path, options, status) and the three concepts, record for the
chosen concept:

**Stage.** What is on screen the whole time; the style's layout at the chosen
format; the setting and any character's design.

**Sources.** What backs each state: fact IDs, captured screens, map data, or a
model (its inputs, the rules or code that compute each state, and its outputs).
Visible values must come from these.

**States.** One row per meaningful action or planned hold, starting with the
style's opening. Use the style's choreography to choose the action:

| # | Words | Before → action → result | Focus / continuity | Anchor | Facts | Time |
| - | ----- | ----------------------- | ------------------ | ------ | ----- | ---- |
| 1 | Phrase or line triggering the action | Readable starting state, specific action, visible result | What the viewer follows and its handoff target | Anchor after | Fact IDs | Estimated start/end, then measured after TTS |

An action can span several clauses. Anchor its start to measured speech and
leave enough time to understand the result before the next action. Record
intentional holds with their interval and reading or explanation purpose;
pass their measured ranges to the video audit. A stricter style cadence still
applies. Do not invent a change for each sentence fragment.

For each scene, identify the main result to inspect and the transfer,
transformation, or transition requiring playback review. Record selected
resources under **Resources**, with the decision they informed, rather than
adding a second storyboard.

**Audio.** Music track and level, SFX tied to specific state changes.

**Pronunciation.** When narrated, list every word the voice may mispronounce,
especially non-English words, names, and place names, as word and TTS
respelling pairs. `SCRIPT.md` keeps the correct spelling. Confirm
uncertain pronunciations with a reliable source or the user.

## On-screen words

The style owns wording density, arrangement, and emphasis. Check displayed
claims against research, keep essential qualifications with the claim they
limit, and identify illustrative examples when introduced. Shortening a
label must not remove a condition that changes its meaning.

## Thumbnail brief

Preserve a supplied cover title. Otherwise recommend a title that accurately
names the subject and useful outcome, using the style's title treatment.
Describe the hero visual and the result it promises. Record the user's
selection at the plan checkpoint; a plain Yes accepts the recommendation.

Build the cover in `composition/thumbnail/index.html`, starting from the
style's `thumbnail/index.html`, as a static page at the video's aspect ratio.
Link `composition/thumbnail/assets` to `../assets`, as the style's thumbnail
does, so the cover loads the composition's fonts and images.
At 1080×1920, keep text and subject within x 60–960 and y 240–1400, which
survives the profile grid crop and platform UI. Adapt the safe region for other
aspect ratios. Use the style's cover composition with real final content.
The first video frame should also work as a fallback cover.

Planning ends with the self-review in [review.md](review.md), then the human
plan checkpoint in [SKILL.md](SKILL.md). Start production only after approval.
