# Frame

The frame is the shared design law. The selected `brand.md` supplies the colors,
type, spacing, ground, assets, and closing-card handle; this file says how to
apply them. Declare the brand's colors as CSS custom properties on the
composition root (`--canvas`, `--ink`, `--on-highlight`, `--accent`, `--highlight`,
`--panel`, `--border`, and each `support` color as `--support-<name>`) and use
the variables everywhere below. Load the brand's
fonts locally.

# Design law

One headline and one dominant proof object per scene. Row count follows phone-size
readability: a five-item comparison can stay together if its labels remain legible.
Do not collapse and rebuild a chart just to meet an arbitrary three-row limit.
The frame is an editorial field, not a dashboard. Compose each scene's hero
object freely within this law: the brand's colors, type, spacing, safe areas,
and CTA structure are fixed, and the layout and motion of the hero object are
yours to design per scene. Preserve useful object identity across beats; extract
a shared block only when it simplifies real reuse.

Motion reveals information in stages. The film current is left. Ordinary seams
use a left push. A zoom-through is optional, not a required beat; omit it unless
spatial continuity explains the reveal. Keep one readable scene at the handoff,
with no blank landing or overlapping headlines. No crossfades,
floating, breathing, wobble, glassmorphism, card grids, or emoji.

---

# The ground (required on every scene)

Every scene sits on the brand's ground, built exactly as `brand.md` specifies.
Copy its assets into `composition/assets/brand/` and reference them relatively.
The ground is **mandatory**. It makes consecutive scenes read as one film
instead of a stack of slides. Do not substitute a plain flat fill unless the
brand's ground is one.

The ground is static. It does not animate, parallax, or pulse. Only the
content above it moves.

Readable type always sits on the ground, never on a photograph at full
opacity. Preserve every ground layer. For readability, move or enlarge
foreground labels or give the proof object a restrained `--panel` backing; do
not remove or brighten the ground to fix foreground contrast.

## Foreground and subtitles

At 1080×1920, start with 80–112 px headlines, 40–52 px essential evidence labels,
and 52 px captions. Essential billing qualifiers need the same reading priority
as the price. Check at roughly 360 px display width; shorten labels or split a
beat rather than shrinking important text into footnotes. Scale with resolution.
Anchor the visible caption block `spacing.caption_bottom` above the bottom at
1080×1920. This caption-specific default overrides the `spacing.platform_ui_bottom`
inset for other content; adjust it when a supplied platform overlay requires
more clearance. Bottom-align the text inside its container so unused container
height does not lift it. Allow two lines to grow upward and leave 48 px between
captions and proof objects. Check the visible text bounds at phone size, not
only the container's CSS. Align labels to the objects they describe, using one
clear reading order.

Unspoken and finished caption words stay `--ink`; only the current word gets a
`--highlight` background with `--on-highlight` text. Keep this style consistent
across the video. Captions sit directly on the ground with no backing. Phrase
length and highlight timing are in `render.md`.

`--highlight` belongs to the caption's spoken-word highlight and the closing
card's kicker. Do not use it for headline words, prices, stats, step numbers,
badges, or backgrounds; a second highlight element competes with the word being
spoken. `--accent` marks actions, state, and data marks; `--ink` carries
everything else. Give an important value emphasis through size and weight in
`--ink`. These roles apply to interface and emphasis. Depicted objects keep
their real colors, such as a gold coin, green crops, or blue water.

---

# The closing card (required, and its own scene)

The last scene is the follow card. Nothing else shares it: no leftover stat,
no evidence row, no headline from the previous beat. Give it its own scene of
4-6 seconds.

No logo appears in the video, including the closing card. The brand is
established by the ground, palette, type, and closing handle. A brand's notes
may adjust a treatment below for contrast, such as the kicker.

Structure, centered on the visible frame, filled from `cta` in `brand.md`:

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
  position: absolute; inset: 0;
  display: flex; flex-direction: column;
  align-items: center; justify-content: center;
  padding: 0 60px; text-align: center;
}
.cta-kicker { color: var(--highlight); font-size: 45px; font-weight: 800; letter-spacing: .18em; }
.cta-handle { margin: 30px 0 0; color: var(--ink); font-size: 82px; font-weight: 800;
              line-height: 1; letter-spacing: -.06em; }
.socials    { display: flex; align-items: center; justify-content: center;
              gap: 30px; margin-top: 48px; }
.socials svg { display: block; width: 94px; height: 94px; flex: 0 0 94px;
               fill: var(--ink); }
```

Entry: the lockup fades and settles first, kicker rises at 0.30s, handle at
0.48s (`power4.out`, 0.72s), then the icons rise with a 0.10s stagger from
0.98s (`power3.out`, 0.48s). Icons enter last, together, as a set.

## The icons

The brand's `icons/` folder holds monochrome single-path marks with a 16×16
viewBox, `fill="currentColor"`, from one consistent family (Bootstrap Icons,
MIT). Order them as `cta.platforms` lists them.

**Inline the SVG markup** rather than using `<img>`. These carry no internal
`id`s and no baked colors, so inlining is collision-free and lets one CSS rule
color the whole row. Use the first color in `cta.icon_colors` by default; any
other listed color is the only alternative, and applies to every icon. Never
per-platform brand colors: a full-color row does not read as a set, and
platform colors often fail contrast on the brand's ground.

Adding a platform: drop its Bootstrap Icons SVG into the brand's `icons/`
folder named after the platform, then list it in `cta.platforms`.
