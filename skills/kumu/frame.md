# Frame

The frame is the shared design law. The selected `brand.md` supplies colors,
type, spacing, an optional background texture, assets, and the closing-card
handle; this file says how to apply them. The brand owns the chrome. The
concept owns the stage.

Declare the brand's colors as CSS custom properties on the composition root
(`--canvas`, `--ink`, `--on-highlight`, `--accent`, `--highlight`, `--panel`,
`--border`, and each `support` color as `--support-<name>`) and use them
everywhere below. Load the brand's fonts locally.

## Layout

At 1080×1920, top to bottom:

- **Title zone** from `spacing.edge` down: the concept's title, 72–104 px, and
  the score when it belongs with the title. Persistent.
- **Stage zone**: the middle of the frame, owned by the concept.
- **Words zone**: captions (narrated) or on-screen lines (visual), anchored
  `spacing.caption_bottom` above the bottom edge, bottom-aligned, growing upward
  to two lines. Keep 48 px between words and the stage.

Scale these for square and landscape. Check text at roughly 360 px display
width; shorten labels rather than shrinking essential text below 40 px.

## Background

Use `--canvas` as a plain background by default. If the brand defines a
texture and it does not compete with the stage, it may sit under everything at
the opacity `brand.md` gives. The background is static. Readable type never
sits on a full-opacity photograph.

## Color

- `--ink` carries text and default marks.
- `--accent` marks state, action, and data: the item that just moved, the
  current code line, the leading lane.
- `--highlight` belongs only to the caption's spoken word and the closing
  kicker. Never use it for titles, values, badges, or stage objects.
- The stage may use its own small illustration palette (skin, wood, water,
  snow) harmonized with the brand. Depicted objects keep their real colors.
- Give an important value emphasis through size and weight in `--ink`.

## Illustration

Flat vector shapes, one stroke weight, limited palette, simple geometry.
Characters are simple and consistent across the video. Photo cut-outs share
one crop style, scale logic, and shadow. No glassmorphism, emoji, card grids,
floating, breathing, wobble, or decorative particles.

## Captions and lines

Captions: 52 px, `--ink`, no backing. Only the current word gets a `--highlight`
background with `--on-highlight` text. Phrase length and timing are in
[render.md](render.md).

Visual-mode lines: 48–56 px, weight 700, `--ink`, centered, no backing. A new
line replaces the previous one with a short fade or rise; no typewriter effect.

## Motion

The stage persists and changes in place. Motion shows one change at a time:
something moves, grows, swaps, wears, or gets labeled. Ease out of each change
and let it settle before the next. Cuts happen only between list items or
where the concept truly changes place; a list item may enter with a left push.
The camera may push in or reframe to follow a change while keeping orientation.
No crossfades between unrelated layouts and no ambient motion added to fill time.

## Closing card

The last scene is the follow card: 3–5 seconds, nothing else on it. No logo
appears anywhere in the video. Fill it from `cta` in `brand.md`:

```html
<div class="cta-lockup">
  <div class="cta-kicker"><!-- cta.kicker --></div>
  <h1 class="cta-handle"><!-- cta.handle --></h1>
  <div class="socials" aria-label="<!-- cta.platforms -->">
    <!-- inline the icon SVGs here, in cta.platforms order -->
  </div>
</div>
```

```css
.cta-lockup {
  position: absolute;
  inset: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 0 60px;
  text-align: center;
}
.cta-kicker {
  color: var(--highlight);
  font-size: 45px;
  font-weight: 800;
  letter-spacing: 0.18em;
}
.cta-handle {
  margin: 30px 0 0;
  color: var(--ink);
  font-size: 82px;
  font-weight: 800;
  line-height: 1;
  letter-spacing: -0.06em;
}
.socials {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 30px;
  margin-top: 48px;
}
.socials svg {
  display: block;
  width: 94px;
  height: 94px;
  flex: 0 0 94px;
  fill: var(--ink);
}
```

Entry: kicker rises at 0.30 s, handle at 0.48 s (`power4.out`, 0.72 s), then
the icons rise together with a 0.10 s stagger from 0.98 s (`power3.out`, 0.48 s).

Icons come from the brand's `icons/` folder: monochrome single-path 16×16
marks with `fill="currentColor"`, from one family (Bootstrap Icons). Inline the
SVG markup in `cta.platforms` order so one CSS rule colors the row. Use the
first color in `cta.icon_colors` for every icon; never per-platform colors. To
add a platform, drop its Bootstrap Icons SVG into `icons/` named after it and
list it in `cta.platforms`.
