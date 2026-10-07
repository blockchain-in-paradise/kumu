# Concept

The concept decides whether the video is worth watching. Polish cannot rescue
a video whose picture only restates its narration. Choose the concept before
writing any words.

## What a strong concept has

1. **A concrete stage.** Something the viewer can picture: an everyday metaphor
   (people queuing at a microwave for CPU scheduling, penguins sorting by
   height for bubble sort, a market stall for a Ponzi scheme) or the real
   subject simplified (a cross-section of a dune, a city skyline over time).
   Never abstract boxes, floating icons, or a deck of fact cards.
2. **One stage that changes.** The same stage stays on screen and changes
   state: objects move, grow, wear, reorder, or get labeled. Cuts are rare and
   deliberate. A list of items may reuse one repeated stage per item.
3. **A real model drives it.** The states come from something true: the
   algorithm actually runs, the queue is simulated, the timeline uses sourced
   dates, the terminal shows real command output. Every visible number is
   computed from research facts or the model, never invented for drama.
4. **A visible score.** One value the viewer tracks: average wait, years
   elapsed, swaps so far, height in feet, item 3/7. It makes progress legible.
5. **A title the viewer wants answered.** A question or promise held on screen
   ("Should quick meals skip the line?", "7 tools to supercharge your
   terminal"). The final state pays it off.

Optional, when it fits: a recurring character or mascot, and example data
themed to it (a cat explaining terminal tools, with a `tuna-shop` folder and a
`TODO: feed cat` in the code). It adds personality without inventing facts.

## Formats

These are starting shapes, not templates. Combine or invent as the subject needs.

- **Changing diagram.** One card or cross-section changes in place, with
  numbered headings for each cause or step. Suits mechanisms and geography.
- **World over time.** One scene, a counter, and the world changing as time
  passes. Suits what-ifs, history, and growth or decay.
- **Stand-ins for data.** Characters or objects are the data: they swap, queue,
  or split. Two lanes side by side compare two rules under identical input.
  Suits algorithms, scheduling, probability, and economics.
- **Code beside the stage.** A code panel highlights the line that produced the
  current state. Suits programming explainers. Pairs with stand-ins.
- **Repeated stage list.** The same frame (a terminal, a product card, a map)
  for each of N items, with an n/N counter and one demonstrated result per item.
  Suits tool lists and tips. Each item shows the thing working, not a description.
- **Role-play.** Simple characters act out a scheme or process in a small set.
  Suits finance, social, and legal topics. Keep characters simple and consistent.

## Mode

Recommend narrated or visual for each concept unless `--mode` was given.

- **Visual** when the motion explains itself: an algorithm, a simulation, a
  before and after, a list of demonstrations. Short on-screen lines name what
  changed. Usually 10–40 seconds.
- **Narrated** when the explanation needs reasoning the picture cannot show:
  causes, conditions, history, qualifications, prices. Usually 30–90 seconds.

## Writing the three concepts

Write three concepts that differ in format or metaphor, not three phrasings of
one idea. For each, record in `video-plan.md`:

| Field   | What to write                                                              |
| ------- | -------------------------------------------------------------------------- |
| Title   | The question or promise held on screen                                     |
| Stage   | What is on screen the whole time, in one sentence                          |
| Mapping | For a metaphor, what stands for what, and where the metaphor breaks        |
| Model   | What computes the states (algorithm, simulation, sourced dates, real output) and its fact IDs |
| Score   | The one tracked value and its start and end                                |
| Payoff  | The final state and the one line it lands on                               |
| Mode    | Narrated or visual, and estimated duration                                 |

Then test each and drop or fix any that fails:

- **Swap test.** Replace the topic words with another topic. If the stage
  still works unchanged, it explains nothing specific. Reject it.
- **Mapping test.** A metaphor must preserve the property being explained.
  Queue position and cook time map honestly to job order and burst time; a
  metaphor that needs a disclaimer to stay true is the wrong metaphor.
- **First-frame test.** The opening frame shows the stage and the title, and
  makes the viewer want the answer before any motion.
- **Model test.** Every number on screen can be traced to the model or a fact.
  If the concept needs a figure research cannot support, choose another.

Recommend one and say why in two sentences. The user may pick another at the
plan checkpoint.

## Look

Default to flat 2D: SVG, HTML, and CSS, with a limited palette harmonized with
the brand. It renders fast and suits every format above. Three.js 3D renders
about five times slower; propose it only when depth is essential to the
concept, say so in the concept, and let the user approve it at the checkpoint.

Photos and short clips can play characters (cut out with HyperFrames
`remove-background`) when their reuse basis is recorded in `research.json`.
Treat them consistently: same crop style, same scale logic, same shadow.

With `--ref`, apply the notes from [references/ref-video.md](references/ref-video.md):
borrow structure, pacing, layout, and devices. Never copy a reference's
characters, assets, branding, jokes, or wording.
