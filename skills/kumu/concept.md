# Concept

A teacher starts from what the student needs, then picks the method. Decide
the goal, choose the form that teaches it, then design the stage. Polish cannot
rescue a video whose picture only restates its narration.

## 1. Name the goal

Write one sentence: after watching, the viewer can ___. Then pick the goal it
matches. A topic may serve more than one; choose the one the audience came for.

| The viewer needs to... | Form | Stage | Anchor | Examples |
| --- | --- | --- | --- | --- |
| **Do** something | Walkthrough | The real screen or object, one step at a time, ending on the result | Step n/N | Set up an online account, a game build, renew a license online |
| **Choose** between options | Comparison | Options aligned under identical conditions, building one row or bar at a time | The deciding value | AI subscriptions, phone plans, bank fees |
| **Decide** for their own case | Decision path | A short question path that lights up the route for each kind of viewer | The current question | Do I need a permit? Which transit pass fits me? |
| **Know** where or when | Local guide or timeline | A real map with pins and routes, or a dated timeline | The place or date | Weekend markets in a city, when a rule takes effect, road closures |
| **Spot or avoid** something | Red flags | A realistic sample (a message, a listing, a beach) with each warning sign marked | Flags found n/N | Scam texts, rental listing fraud, beach warning flags |
| **Read** a thing they own | Anatomy | The real document or object, with each part labeled in turn | The part in focus | A utility bill, a pay stub, a nutrition label |
| **Grasp** a size or amount | Scale | Side-by-side scale or a breakdown of one whole | The magnitude | How tall a building is, where a dollar of rent goes |
| **Understand** how it works | Mechanism | A changing diagram, stand-ins for data, or a simulation | The value that changes | How a sorting algorithm works, how weather forms |
| **Remember** a set | List | The same frame repeated for each item, each one shown working | Item n/N | Useful apps, budgeting habits |
| **Imagine** an outcome | What-if | One world changing over time | Time elapsed | A city without power, compound interest over 30 years |

A mechanism can be a changing diagram with numbered causes, stand-ins that
swap or queue (two lanes compare two rules under identical input), a code panel
beside the stage highlighting the current line, or simple characters
role-playing a process.

## 2. Choose literal or metaphor

Concrete practical subjects stay literal: real places, real screens, real
prices, real documents. Someone learning an app needs its actual screens, not
an analogy. Use a metaphor when the subject is abstract
and a familiar everyday scene preserves the property being taught. Any form
may use one when it helps.

## 3. What every concept needs

1. **A concrete stage.** Something the viewer can picture: the real subject,
   simplified (a map, the real app screen, a cross-section) or an everyday
   metaphor. Never abstract boxes, floating icons, or a deck of fact cards.
2. **One stage that changes.** The same stage stays on screen and changes
   state. Cuts are rare and deliberate. A list or walkthrough may repeat one
   frame per item or step.
3. **Real sources behind every state.** Sourced facts, prices, dates, captured
   screens, a real map, an algorithm that actually runs, or real command output.
   Every visible number is computed or cited, never invented for drama.
4. **A visible anchor.** One thing the viewer tracks: step 3/5, the price, the
   date, flags found, swaps so far.
5. **A title the viewer wants answered.** A question or promise held on screen.
   The final state pays it off.

Optional, when it fits: a recurring character or mascot, and example data
themed to it. It adds personality without inventing facts.

## 4. Mode

Recommend narrated or visual for each concept unless `--mode` was given.

- **Visual** when the motion explains itself (an algorithm, a simulation, a
  before and after). Usually 10–40 seconds.
- **Narrated** when it needs reasoning, conditions, or qualifications the
  picture cannot show. Usually 30–90 seconds.

## 5. Write three concepts

Write three concepts covering at least two different forms, so the user gets a
real choice. When the style's `form` is fixed (boxing: a technique breakdown),
write three different angles on the topic within that form instead. Record the
goal sentence once, then for each concept:

| Field   | What to write                                                       |
| ------- | ------------------------------------------------------------------- |
| Form    | From the table above                                                |
| Title   | The question or promise held on screen                              |
| Stage   | What is on screen the whole time, in one sentence                   |
| Setting | Where the stage happens and its scenery within the style, or "the style's background" for diagrams, charts, and maps |
| Mapping | For a metaphor, what stands for what, and where it breaks           |
| Sources | What backs the states (facts, screens, map, model) and fact IDs     |
| Anchor  | The tracked value and its start and end                             |
| Payoff  | The final state and the one line it lands on                        |
| Mode    | Narrated or visual, and estimated duration                          |

Then test the one you will recommend and fix it if it fails; test another only
if the user picks it:

- **Goal test.** After the last state, can the viewer do or understand what the
  goal sentence says? If not, the form is wrong.
- **Swap test.** Replace the topic words with another topic. If the stage still
  works unchanged, it explains nothing specific.
- **Mapping test.** A metaphor must preserve the property being taught; one
  that needs a disclaimer to stay true is the wrong metaphor.
- **First-frame test.** The opening frame shows the title over the style's
  backdrop and makes the viewer want the answer before the first item appears.
- **Source test.** Every number and screen on the stage traces to a fact,
  capture, or model run. If the concept needs something research cannot
  support, choose another.

Recommend one and say why in two sentences. The user may pick another at the
plan checkpoint.

## Look

The style decides the look: its `style.md`, its sample `index.html`, and
[frame.md](frame.md). Concepts describe what happens on the stage, in that
style. Photos show real things as they are (an animal, a product, a whole
car); drawings show parts, internals, diagrams, and anything that moves or
works (see [frame.md](frame.md) Subjects). Say which in the concept.

With `--ref`, apply the notes from [references/ref-video.md](references/ref-video.md):
borrow structure, pacing, layout, and devices. Never copy a reference's
characters, assets, branding, jokes, or wording unless the user explicitly asks
to replicate it.
