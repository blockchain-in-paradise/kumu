---
name: "plain"
register: light
colors:
  canvas: "#ececec" # plain light gray background
  ink: "#111111"
  on-highlight: "#111111"
  accent: "#e4572e" # state, action, and data marks
  highlight: "#ffd84d" # caption spoken word and line key word
  panel: "#ffffff"
  border: "rgba(17,17,17,.14)"
typography:
  display: { fontFamily: "Inter", weight: 800, lineHeight: 0.95, tracking: "-0.03em" }
  body: { fontFamily: "Inter", weight: 400, lineHeight: 1.4 }
  fonts: "assets/fonts/inter-{400,600,800}.woff2"
preview_at: [0.2, 4.69, 9] # empty, jar and chart mid-growth with caption, payoff
spacing:
  edge: "80px"
  platform_ui_bottom: "420px"
  caption_bottom: "340px"
cta: null
opening: "intro" # the title lands alone first, then clears for the first item (see Opening)
closing: "payoff" # the answer stands alone as a payoff card (see Closing)
---

# Character

Neutral and unbranded, for tests and videos that carry no channel identity.
Clean flat diagrams on a light gray canvas, black type, one orange-red accent.
`index.html` in this folder is the working sample; start compositions from it.

Plain is also the default: any style that leaves out a section below (Layout,
Text and color, Subjects, Opening, Motion, Captions, Checks, Closing) follows
plain's. A style overrides a section by writing its own.

# Layout

At 1080×1920, top to bottom:

- **Title zone** from `spacing.edge` down: the concept's title and the anchor
  when it belongs with the title. A title fills the zone's width: one line when
  it fits at the smallest headline size, else two balanced lines; never one
  word alone on a line, and never a break typed by hand (`<br>`, block spans).
- **Stage zone**: the middle of the frame, owned by the concept. The stage
  fills roughly 40–60% of the frame; when a state looks empty, enlarge the
  stage or add a meaningful change rather than adding text.
- **Words zone**: captions or on-screen lines, anchored `spacing.caption_bottom`
  above the bottom edge, bottom-aligned, growing upward to two lines, 48 px
  clear of the stage.

Use the whole frame: no empty band taller than about 15% of the height. The
title, the anchor, and the words are the only persistent elements; a list's
n/N counter is the anchor. No step rails, chapter tabs, or progress bars.

# Text and color

- `--ink` carries text, `--accent` marks state, action, and data, and
  `--highlight` belongs to the caption's current word, a visual-mode line's key
  word, and a closing kicker. Never use `--highlight` for titles or values.
- **Text budget.** Besides the title and the caption or line, one frame
  carries at most one short label and one key number. A label is a few words on
  one line, next to what it names; drop anything that needs a second line.
- Labels sit on a calm area or a small local backing. Over a busy scene,
  captions and lines get a dark outline and soft shadow on the text itself,
  never a band behind them.
- Weight comes from contrast before thickness. No cards inside cards.

# Subjects

**Photo or drawing.** Photos show real things as they are and stay still
except for entering and leaving: an animal, a product, a whole car. Drawings
show parts, internals, diagrams, and anything that moves or works: gears
turning, water through a pump, money moving between accounts. Show depth with
layering, isometric drawing, shading, or a cross-section.

**Real objects** are drawn from a real reference found in research, used as
reference only, finished as Look below. A cutaway shows the inside when it
matters. An object seen from a new angle keeps its real outline. One diagram
keeps one scale and position across scenes.

**Drawn characters**, when a video needs them, are designed for the video,
minimal and consistent. Build each as an SVG rig with separate groups for
head, body, and each limb, and animate rotations around the joints with GSAP
`svgOrigin`, for example
`tl.to(".leg-l", { rotation: 18, svgOrigin: "85 206", duration: 0.25 }, t)`.
Characters move to what they act on; never one static pose for the whole video.

**Photo subjects** (cut out with `remove-background`) share one crop style,
scale logic, and shadow. They enter, pop, slide, tilt, or play their clip.

**Variation.** The sample sets the quality bar and the helpers, not the
layout: draw each video's people, objects, and placement for its own topic.
Repeated items follow one design, never one template: change how each one
arrives and leaves (side, direction, scale, cut versus slide) and where the
subject sits, so no two items look like the same slide with new words. Each
item still shows its name and its key number.

**State contrast.** The active item is the most visible thing on screen.
Finished items dim to about 40%; eliminated ranges dim as one block. A viewer
sees each change without reading a number.

# Opening

Open with an intro, not the first item: the title (or one hook line) lands
alone over the canvas and holds long enough to read, then clears or shrinks
away before the first item enters. The first frame already shows the canvas
and title.

# Motion

Show one change at a time and let it settle. Teach each new kind of change
slowly enough to follow on first watch, speed up repeats of it, and slow down
for the payoff. No ambient motion added to fill time. The same stage stays on
screen and changes state; cut to a new scene only when the topic changes.

A mechanism is shown working, not labeled. Build its drawing up on screen
(outline first, then each part as the words name it), then run it: parts turn,
slide, or pump, and whatever flows through it (air, fuel, current, money)
travels its real path as moving dashes or particles. Once running, it keeps
running while it is on screen; that motion is the explanation, not filler.
Speed shows the state (a wheel spinning up, flow thickening), and a part in
focus is lit while the rest dims. Drive it with rotation and
`strokeDashoffset` tweens across the state's duration.

A diagram is drawn from what it shows, and every part of it is joined for real:

- **Joins are measured.** A path, arrow, or moving item starts and ends on the
  objects it joins, from their measured boxes, never from typed coordinates.
  No path crosses a label; move the label instead.
- **The main object bookends the video.** When it first appears alone, it is
  large in the free space under the title, then scales to its spot as the
  diagram builds around it. It shrinks again only if something else needs
  the room. On the answer line, the rest of the diagram fades and it returns
  to its opening size and spot, moving above the fading parts.
- **People are drawn when the words name them** and enter on that word (a
  customer, a trader, a saver): one distinct look per role, entering once and
  staying until the scene clears, never fading in and out between beats.
- **Exchanges are carried.** What passes between people and objects is a small
  copy of the scene's own drawing (the coin, one bill from the stack), pulled
  out at the giver, carried across, and taken in by the receiver; never a new
  shape, and never a fade.
- **One way to show a value.** A tag may name the value until a scale (a
  ruler, axis, gauge) is on screen; then the scale names it by lighting the
  mark under the object, and the tag leaves.
- **A failure is the mechanism stopping**, not an overlay: its flow stops and
  greys, a sign or lock lands on the part that stopped, and what depends on it
  dims. Never an X drawn over the diagram.

For camera moves, the stage is one world inside a camera layer. Change the
view (side, top-down, close-up) by moving that layer and keep one anchor
object across views.

# Captions

Install and adapt HyperFrames' `caption-highlight` component (see render.md).
Phrases of 3–6 words over at most two lines, in the words zone. Only the
current word is highlighted. No bounce, zoom, typewriter, or reflowing weight
changes. A visual-mode line is one phrase in the display type with its key
word in `--highlight`; a new line replaces the last with a short fade or rise.

# Checks

Before any render, scan the source for a title broken by hand and a
connecting path drawn from typed coordinates; fix every hit:

```bash
grep -nE 'class="headline"[^>]*>[^<]*(<br|<span)|id="[^"]*(flow|path|link)[^"]*"[^>]* d="M' composition/index.html composition/scenes/*.html
```

Then read the timeline for a person faded out before the scene clears, a
value tag still shown while a scale is on screen, and an X drawn over a
failure.

# Look

Plain `--canvas` background, no texture. Props and diagrams are flat white
cards with a 2 px `--border` and a soft shadow (`0 12px 32px rgba(0,0,0,.08)`).
Captions are `--ink` with only the current word on a `--highlight` background.
Scenes change in place or slide; no decorative motion.

Real objects are flat drawings inside the card, shown working: real shape, a
few telling details, two or three flat tones per part, a 2–3 px outline in
`rgba(17,17,17,.3)`. Neutral grays for the object, `--accent` only for the part
the video is about. In the sample, each year coins from the model drop into an
open glass jar; coins that exist only because interest earned
interest are `--accent` and stack on top of the gray ones as one growing band,
beside a small chart of the same model. Pick still frames between drops.

# Motion values

| Value | Setting |
| --- | --- |
| Eases | Enter `power3.out`, exit `power2.in`; data that grows over time (a line drawing on) runs linear |
| Durations | Entrances 0.5 s, exits 0.45 s, the payoff card 0.6 s from 0.94 scale |
| Overshoot | None |
| Stagger | 0.08 s between entering elements |
| State changes | Readouts step with the data (`tl.set`) as it advances |

# Sound

Files are in `assets/sfx/` (credits in `CREDITS.md`). Nearly silent by design:
a soft `click.ogg` (0.3) when a chart or value starts changing, and
`payoff.ogg` (0.4) when the payoff card lands. Music is optional; when used,
keep it under the voice as `render.md` says.

# Closing

Every video ends on its payoff: the answer, held long enough to read. No
handle and no closing card. The title, stage, labels, and captions clear, and
the answer stands alone as a payoff card: the key number very large in
`--accent`, one line under it in `--ink`, held 2–3 s. A style that inherits
this closing and sets a `cta` follows the payoff with its closing card,
standing alone in the video's world.
