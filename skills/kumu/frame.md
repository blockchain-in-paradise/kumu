# Frame

The frame is the law every style follows. The selected style's `style.md`
supplies the look (colors, type, background, subject treatment, motion
vocabulary, captions, and closing card) and its `index.html` is a working
sample of it. Start each composition from that sample. When a style and this
file disagree, the style decides the look and this file decides legibility,
layout safety, and honesty.

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
  one line; drop or move to `caption.txt` anything that needs a second line.
- **No separators.** On-screen text never uses middle dots, bullets, pipes, or
  slashes to join facts ("2011–2013 · 3.0L turbo"). Pick the one fact that
  matters, put two facts on separate lines, or write them as words.
- Captions follow the style's caption treatment and highlight only the current
  word. A visual-mode line is one phrase in the style's type with its key word
  in `--highlight`; a new line replaces the last with a short fade or rise.

## Subjects

Flat 2D only: SVG, HTML, and CSS. Show depth with layering, isometric drawing,
or a cross-section.

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
backdrop and title. Show one
change at a time and let it settle. Teach each new kind of change slowly
enough to follow on first watch, speed up repeats of it, and slow down for the
payoff. No ambient motion added to fill time; characters may keep the small
idle loop their style defines, so a held figure never freezes.

When the style uses camera moves, the stage is one world inside a camera
layer. Change the view (side, top-down, close-up) by moving that layer and
keep the style's anchor object across views; cut to a new scene only when the
topic changes. [review.md](review.md) checks the
pace against the animation map.

## Closing

Every video ends on its payoff: the answer, held long enough to read. The
payoff is its own closing frame: the title, stage, labels, and captions clear,
leaving one large phrase and at most one short line under it on the backdrop.
Then, if the style has a `cta`, its closing card follows, standing alone in the
video's world with no logo. A style without a `cta` ends on that closing frame.
