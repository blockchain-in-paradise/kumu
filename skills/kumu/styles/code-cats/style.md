---
name: "code-cats"
source: "https://www.tiktok.com/t/ZPLFgNsdp/ (studied for vibe and layout: cute characters acting out code above an editor; no footage, audio, or wording reused)"
register: light
colors:
  canvas: "#9fd0f2" # sky blue behind the backdrop while it loads
  ink: "#2c2450" # deep plum for text on light ground
  on-highlight: "#2c2450"
  accent: "#ff8a5c" # props and bowls; accent-ink carries text
  highlight: "#ffd84d" # title yellow
  panel: "#1f2033" # code editor
  border: "rgba(44,36,80,.18)"
  support:
    title-shadow: "#2f5d3a" # deep leaf green
    accent-ink: "#9b421f" # orange-brown text on light ground
    code-keyword: "#ff79c6"
    code-string: "#f1fa8c"
    code-function: "#50fa7b"
    code-variable: "#8be9fd"
typography:
  display: { fontFamily: "Fredoka", weight: 700, lineHeight: 1, tracking: "-0.01em" }
  body: { fontFamily: "Fredoka", weight: 600, lineHeight: 1.3 }
  code: { fontFamily: "JetBrains Mono", weight: 400 }
  fonts: "assets/fonts/{fredoka-600,fredoka-700,jetbrains-mono-400,jetbrains-mono-700}.woff2"
voice: "af_heart"
voice_speed: 1.0
preview_at: [0.2, 3.0, 9.2] # empty, elements with line, payoff
spacing:
  edge: "70px"
  platform_ui_bottom: "420px"
  caption_bottom: "330px"
cta: null
---

# Character

Whimsical, cozy, and playful: flat 2D cartoon cats act out what code does, in
a little world above a code editor or terminal. Suits programming concepts,
algorithms, data structures, and developer tools. `index.html` is the working
sample (a for loop feeding five cats); `thumbnail/index.html` is the cover.

# Look

- **Backdrops** (`assets/backdrops/`): `park` (default: green hills, a tree, a
  bench, blue sky), `cozy-room` (indoors: warm wall, window, shelf, lamp, wood
  floor), and `night-roof` (rooftops under the stars), full-bleed flat SVG
  scenes with their scenery in the top 40% and open ground below. Pick one per
  video, or switch between outdoors and indoors at a chapter change with a
  quick slide. New backdrops follow the same flat, rounded drawing style:
  greens, warm woods, and sky blues, never icy or purple-heavy.
- **Cats** are rigged SVG characters (see the sample's `catSVG`): big round
  head, triangle ears with pink insides, dot eyes with a highlight and a
  happy-arc variant, pink nose, whiskers, blush, round body with a lighter
  belly, a colored scarf, paws, and a tail that swishes from its base. Each cat
  keeps one coat and scarf color all video (Mochi orange, Nori gray, Taro
  black, Ume cream, Kiki brown). Cats stand for the data: items in a list,
  nodes, processes, requests.
- **Props**: a dark code editor (window dots, filename tab, line numbers,
  syntax colors, a yellow highlight bar on the running line), a terminal with
  green output, food bowls, boxes, signs. Code shown is real and runs.
- **Text on the ground** uses `--on-ground`: deep plum with a soft white glow on
  light backdrops (`park`, `cozy-room`), white with a dark glow on
  `night-roof`.

# Type and words

Title at the top in Fredoka 700, about 128 px, title yellow on a rounded
`title-shadow` green backing with its solid drop, and a plum subtitle for the
language or tool on light backdrops. The payoff uses the same backing. A
white pill counter tracks the anchor ("Fed 3/5"), with a dark accent numeral. Visual mode by default: one
short line in the words zone with its key word in `support.accent-ink` on light ground. When narrated,
captions use the same contrast-safe color rules. Keep the bright accent for
props; text on dark ground uses a light accent with verified contrast.

# Motion

Playful and bouncy. Titles and cats pop in with a little overshoot, cats hop
when something happens to them and switch to happy eyes, food lands with a
bounce, tails swish gently. The code highlight steps line by line in time with
what the cats do, so the viewer can match each line to its effect.

# Motion values

| Value | Setting |
| --- | --- |
| Eases | Pop `back.out(1.7)`, enter `power3.out`, exit `power2.in`, hop `power2.out`, landing `bounce.out`, tails `sine.inOut` |
| Durations | Small 0.35 s, medium 0.55 s, a hop 0.22 s up and down |
| Overshoot | Playful: pops overshoot about 10% and settle |
| Stagger | Cats 0.08 s, words 0.05 s |
| Code steps | The first pass of a loop is slow (about 0.45 s per line); repeats step about 0.22 s per line |

# Choreography

Use shared animation guidance to sequence character actions; keep the playful
pops, hops, and landing values above. Cats represent stable data identities,
not decorations. The running code, acted state, and counter share one computed
trace. Introduce an unfamiliar operation slowly, accelerate repeated operations,
then give the result a readable pause.

| Before | Action | Result |
| --- | --- | --- |
| Unfed cats and a loop at its current iteration | Highlight the executing line, deliver the bowl, then show the receiving cat's reaction | That cat is fed and the count increases exactly once |
| Two named items selected by a sorting comparison | Highlight the relevant comparison and exchange their positions if the condition holds | Their identities stay intact while order and output agree with code |

Reject cats hopping while an unrelated line highlights, or a counter changing
before the operation finishes. Stage attention from code to its consequence,
with one active operation at a time. Supporting tails and scenery stay quiet
when the viewer must follow code. A repeated coat is not an identity key;
keep internal item identifiers distinct even with equal values.

# Checks

- Execute the displayed code with the chosen input and retain the state trace.
  Compare highlighted line, acted result, output, and counter at every step.
  The sample's complete runnable source is `assets/examples/feed.py`; the
  editor shows an excerpt whose `names` input is the five cats.
- Inspect code at phone size. Show a readable excerpt when the complete program
  is too dense; record the complete runnable source in the run.
- Play each delivery or swap: the correct cat receives the item, the existing
  rigs keep their pivots, and parts do not detach or intersect accidentally.
- Check fixed coat/scarf identity and the active operation across scene changes.
  Character reactions cannot cover the line or counter the viewer needs.
- Give the first operation and final output enough time to understand;
  faster repeats must still keep the visual trace consistent with execution.

# Sound

Files are in `assets/sfx/` (credits in `CREDITS.md`).

| Event | File | Gain |
| --- | --- | --- |
| Code being typed | `typing.ogg` | 0.35 |
| A single key or line step | `keypress.wav` | 0.3 |
| A cat pops in or hops | `place.ogg` | 0.35 |
| A cat is happy (success) | `meow-gato.ogg`, `meow-classic.ogg`, or `meow-1.ogg` | 0.3 |
| A cat is confused (error, wrong path) | `meowrgh.ogg` | 0.3 |
| A cat does one silly extra (once per video at most) | `meow-minecraft.ogg` | 0.28 |
| Highlight or counter tick | `accent.ogg` | 0.3 |
| Payoff | `purr.ogg` under `payoff.ogg` | 0.3 and 0.45 |

Music: a light, bouncy bundled track at about 0.4 gain in visual mode.

Cat voices play when a cat does something, never at random: the meow starts as
the cat lands, hops, or reacts, so it reads as the cat speaking. At most one meow
per beat, and never two meows within 2 s. Pick the clip by what the cat is doing
(happy, confused, one silly extra) and do not use the same clip twice in a row.
Keep them under the voice: do not start one on a key spoken word, and in
narrated mode lower the gain so the peak stays at least 8 dB under the voice.
The mapping is fixed per event, so the render stays deterministic.

# Closing

No handle by default. The editor clears, every cat hops together, and the
payoff lands in title yellow with a short plum line under it.
