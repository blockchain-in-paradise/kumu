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
- Captions follow the style's caption treatment and highlight only the current
  word. A visual-mode line is one phrase in the style's type with its key word
  in `--highlight`; a new line replaces the last with a short fade or rise.

## Subjects

Flat 2D only: SVG, HTML, and CSS. Show depth with layering, isometric drawing,
or a cross-section.

**Drawn characters** are designed for the video and kept minimal and
consistent. Build each as an SVG rig with separate groups for head, body, and
each limb, and animate rotations around the joints with GSAP `svgOrigin`, for
example `tl.to(".leg-l", { rotation: 18, svgOrigin: "85 206", duration: 0.25 }, t)`.
Characters move to what they act on; never one static pose for the whole video.

**Photo subjects** (cut out with `remove-background`) share one crop style,
scale logic, and shadow. They enter, pop, slide, tilt, or play their clip.

**Legibility.** About 20 or fewer repeated, readable items per phone screen;
reduce or group the data rather than shrinking it.

**State contrast.** The active item is the most visible thing on screen.
Finished items dim to about 40%; eliminated ranges dim as one block. A viewer
sees each change without reading a number.

## Motion

Open with a short intro beat: the cast or stage makes an entrance while the
title lands, and the first frame already shows the setting and title. Show one
change at a time and let it settle. Teach each new kind of change slowly
enough to follow on first watch, speed up repeats of it, and slow down for the
payoff. No ambient motion added to fill time. [review.md](review.md) checks the
pace against the animation map.

## Closing

Every video ends on its payoff: the answer, held long enough to read. Then,
if the style has a `cta`, its closing card follows, standing alone in the
video's world with no logo. A style without a `cta` ends on the payoff.
