# Script and plan

Write the words and the plan for the recommended concept from
[concept.md](concept.md). The stage explains; the words name what the viewer
is seeing and why it matters.

## Narrated mode

Use research to answer one audience question. Draft the narration as connected
paragraphs before deciding scene boundaries. Write to someone who wants to
understand or do the thing. Preserve useful reasoning and prerequisites, and
let the explanation determine its length within 30–90 seconds, including the
frame-required closing card. An explicit duration takes precedence.

Write inside the chosen concept. Its metaphor or stage is the only framing
device: introduce it in a few words, stay inside it, and say plainly when the
explanation leaves it for the real subject ("Computers do this too").

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
  distinction. "One license, one person" needs a sentence explaining who the
  price covers and when additional access changes the cost.
- Remove filler such as "actually", "just", and "simply" when it adds nothing.
  Cut stock praise, artificial suspense, forced triples, and "X, not Y" formulas.
  Follow the entrypoint's audience-copy punctuation rules across speech, labels,
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

There is no `SCRIPT.md`. The on-screen lines carry the words:

- One short line per state group, about eight words or fewer, naming what just
  changed or why it matters ("The middle book rules out half"). Mark its one key
  word in bold in the plan; it renders in `--highlight`.
- Hold each line at least 0.3 s per word plus 0.8 s after it settles.
- The final line lands the payoff and may leave the metaphor
  ("Computers sort their work the same way").
- Lines follow the same factual boundary as narration.

Labels on the stage (values, names, the anchor) are not lines and do not count
toward the budget.

## The plan

`video-plan.md` is the single plan. Write every section as short bullets or
tables. State each decision once; never restate it in another section. After
the header (run path, options, status) and the three concepts, record for the
chosen concept:

**Stage.** What is on screen the whole time; the layout zones (title, stage,
words) at the chosen format; the setting, illustration style, and palette; any
character's design.

**Sources.** What backs each state: fact IDs, captured screens, map data, or a
model (its inputs, the rules or code that compute each state, and its outputs).
Visible values must come from these.

**States.** One row per state, starting with the intro beat (or the style's own
opening, when it defines one):

| # | Words | Stage change | Anchor | Facts | Time |
| - | ----- | ------------ | ------ | ----- | ---- |
| 1 | The spoken phrase or on-screen line that triggers it | What moves, appears, or changes, from what to what | Anchor value after | Fact IDs | Estimate, then measured start after TTS |

Narrated: one row per spoken clause (about 3 s of speech), not one per scene.
A hold is not a stage change, so no row says "hold" or "settle", and
consecutive rows are never more than 3 s apart while the voice speaks (the
title and closing card excepted).

Keep the title, anchor, and the frame's required marks as the only persistent
elements. A list format's n/N counter is the anchor. Do not add step rails,
chapter tabs, or progress bars.

**Audio.** Music track and level, SFX tied to specific state changes.

**Pronunciation.** When narrated, list every word the voice may mispronounce,
especially non-English words, names, and place names, as word and TTS
respelling pairs (Kalākaua: ka-LAH-kow-ah). `SCRIPT.md` keeps the correct spelling. Confirm
uncertain pronunciations with a reliable source or the user.

## Picture rules

- The stage fills roughly 40–60% of the frame. When a state looks empty,
  enlarge the stage or add a meaningful change rather than adding text.
- Follow the text budget in [frame.md](frame.md); labels sit next to what they
  name. Never set a narration sentence or footnote on screen.
- One qualifier per item at most. State a comparison's scope, or that an
  example is illustrative, once where it is introduced, briefly on screen or
  in speech; never pin it for the whole video.
- Mockup and terminal fields hold real or clearly sample data, never script text.
- Weight comes from contrast before thickness: at 1080 px wide, strokes about
  2–3 px, no cards inside cards.

## Thumbnail brief

The recommended title comes from the user's topic: the topic itself in title
case, trimmed to about six words by dropping filler, never reworded around the
concept or metaphor ("how compound interest works" becomes "How Compound
Interest Works"). With a URL or notes instead of a topic, use
the subject's plain name. List two or three alternatives after it, each still
naming the real subject. No subtitle. Describe the hero visual and the result
it promises. The user's pick, or the recommendation after a plain Yes, becomes
the cover title.

Build the cover in `composition/thumbnail/index.html`, starting from the
style's `thumbnail/index.html`, as a static page at the video's aspect ratio.
Link `composition/thumbnail/assets` to `../assets`, as the style's thumbnail
does, so the cover loads the composition's fonts and images.
At 1080×1920, keep text and subject within x 60–960 and y 240–1400, which
survives the profile grid crop and platform UI. Use the title as HTML text and
the stage at its most telling state as the hero, filling 40–60% of that box.
The first video frame should also work as a fallback cover.

Planning ends here. Stop at the plan checkpoint in [SKILL.md](SKILL.md).
