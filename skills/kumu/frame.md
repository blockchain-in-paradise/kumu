# Frame

The frame is the law every style follows. The selected style's `style.md`
supplies the look (colors, type, background, subject treatment, motion
vocabulary, captions, and closing card) and its `index.html` is a working
sample of it. Start each composition from that sample. When a style and this
file disagree, the style decides the look and the video's structure (its
opening, closing, and pacing rules) and this file decides legibility, layout
safety, and honesty.

Declare the style's colors as CSS custom properties on the composition root
(`--canvas`, `--ink`, `--on-highlight`, `--accent`, `--highlight`, `--panel`,
`--border`, and each `support` color as `--support-<name>`). Load its fonts
locally.

## Layout

At 1080×1920, top to bottom:

- **Title zone** from `spacing.edge` down: the concept's title and the anchor
  when it belongs with the title. At most two balanced lines; never leave one
  word alone on a line.
- **Stage zone**: the middle of the frame, owned by the concept.
- **Words zone**: captions or on-screen lines, anchored `spacing.caption_bottom`
  above the bottom edge, bottom-aligned, growing upward to two lines, 48 px
  clear of the stage. Keep words here even when replicating a reference, unless
  the user asks otherwise.

Use the whole frame: no empty band taller than about 15% of the height. Scale
the zones for square and landscape. Check text at roughly 360 px display width;
shorten labels rather than shrinking essential text below 40 px.

## Text and color

- Labels sit on a calm area or a small local backing, never on busy detail,
  edges, or a full-opacity photo. Over a busy scene, captions and lines get a
  dark outline and soft shadow on the text itself, never a band behind them.
- `--ink` carries text, `--accent` marks state, action, and data, and
  `--highlight` belongs to the caption's current word, a visual-mode line's key
  word, and a closing kicker. Never use `--highlight` for titles or values.
- Depicted objects keep their real colors.
- **Text budget.** Besides the title and the caption or line, one frame
  carries at most one short label and one key number. A label is a few words on
  one line; drop anything that needs a second line.
- **No separators.** On-screen text never uses middle dots, bullets, pipes, or
  slashes to join facts ("Ages 3–5 · $12 a month"). Pick the one fact that
  matters, put two facts on separate lines, or write them as words.
- Captions follow the style's caption treatment and highlight only the current
  word. A visual-mode line is one phrase in the style's type with its key word
  in `--highlight`; a new line replaces the last with a short fade or rise.

## Subjects

SVG, HTML, and CSS only, no 3D engines. Show depth with layering, isometric
drawing, shading, or a cross-section.

**Photo or drawing.** Photos show real things as they are and stay still
except for entering and leaving: an animal, a product, a whole car. Drawings
show parts, internals, diagrams, and anything that moves or works: gears
turning, water through a pump, money moving between accounts.

**Real objects** (a coin, a phone, a lock, a plant cell) are drawn from a real
reference found in research, used as reference only. Unless the style's Look
sets another treatment (minimal or cartoon), draw them as a clean
illustration: the real shape with a few telling details, each part in two or
three flat tones of its real color with a light outline, a cutaway when the
inside matters. Not photoreal. Whatever the treatment,
keep the true shape, proportions, and layout, show the parts that matter by
their real arrangement (gears meshing at their real centers, a valve where the pipe enters), and let
parts overlap only where they do in the object. An object seen from a new
angle keeps its real outline and proportions. One
diagram keeps one scale and position across scenes. A simple drawing is fine;
a placeholder box standing in for a part is not.

**Drawn characters** come from the style's `assets/characters/` kit when it
ships one: use its rigs and named poses, and add a missing pose in the same
joint-angle format rather than redrawing the figure. Otherwise design them for
the video, minimal and consistent. Build each as an SVG rig with separate groups for head, body, and
each limb, and animate rotations around the joints with GSAP `svgOrigin`, for
example `tl.to(".leg-l", { rotation: 18, svgOrigin: "85 206", duration: 0.25 }, t)`.
Characters move to what they act on; never one static pose for the whole video.

**Photo subjects** (cut out with `remove-background`) share one crop style,
scale logic, and shadow. They enter, pop, slide, tilt, or play their clip.

**Legibility.** About 20 or fewer repeated, readable items per phone screen;
reduce or group the data rather than shrinking it.

**Variation.** Repeated items follow one design, never one template. Within
the style's vocabulary, change how each one arrives and leaves (side,
direction, scale, cut versus slide) and where the subject and any mascot sit,
so no two items look like the same slide with new words. Each item still shows
its name and its key number.

**State contrast.** The active item is the most visible thing on screen.
Finished items dim to about 40%; eliminated ranges dim as one block. A viewer
sees each change without reading a number.

## Motion

Open with an intro, not the first item: the title (or one hook line) lands
alone over the style's backdrop and holds long enough to read, then clears or
shrinks away before the first item enters. The first frame already shows the
backdrop and title. A style may define its own opening instead (boxing opens
cold, mid-fight, with the title only on its closing card); then follow the
style. Show one
change at a time and let it settle. Teach each new kind of change slowly
enough to follow on first watch, speed up repeats of it, and slow down for the
payoff. No ambient motion added to fill time; characters may keep the small
idle loop their style defines, so a held figure never freezes, but an idle loop
is not a change: while the voice speaks, something visible changes on every
clause, never more than 3 s apart.

A mechanism is shown working, not labeled. Build its drawing up on screen
(outline first, then each part as the words name it), then run it: parts turn,
slide, or pump, and whatever flows through it (air, fuel, current, money)
travels its real path as moving dashes or particles. Once running, it keeps
running while it is on screen; that motion is the explanation, not ambient
filler. Speed shows the state (a wheel spinning up, flow thickening), and a
part in focus is lit while the rest dims. Drive all of it from the timeline
(rotation and `strokeDashoffset` tweens across the state's duration), never
CSS `infinite` or the clock, so every seek shows the right frame.

When the style uses camera moves, the stage is one world inside a camera
layer. Change the view (side, top-down, close-up) by moving that layer, or
with the rig's camera when the style's kit ships one, and
keep the style's anchor object across views; cut to a new scene only when the
topic changes. [review.md](review.md) checks the
pace against the animation map.

## Closing

Every video ends on its payoff: the answer, held long enough to read. The
payoff is its own closing frame: the title, stage, labels, and captions clear,
leaving one large phrase and at most one short line under it on the backdrop.
Then, if the style has a `cta`, its closing card follows, standing alone in the
video's world with no logo. A style without a `cta` ends on that closing frame. A style may define its own closing instead (boxing fades every element out so the video loops); then follow the style.
