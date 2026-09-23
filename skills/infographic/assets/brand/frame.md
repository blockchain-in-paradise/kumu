---
name: "Pūpūkahi Tech Foundation: ocean editorial motion"
source: "https://pupukahitech.org/"
colors:
  canvas: "#0e394e"
  ink: "#fcfaf8"
  foreground-dark: "#1d2930"
  primary: "#196d76"
  accent: "#39a1ac"
  accent-2: "#d19847"
  ocean-light: "#39a1ac"
  sand: "#d19847"
  palm: "#367d65"
  sunset: "#ee7c2b"
  border: "rgba(252,250,248,.22)"
typography:
  display: { fontFamily: "Inter", weight: 800, lineHeight: 0.92, tracking: "-0.04em" }
  body: { fontFamily: "Inter", weight: 400, lineHeight: 1.4 }
spacing:
  edge: "92px"
  platform_ui_bottom: "420px"
  caption_bottom: "340px"
assets:
  ground: "ground.webp"
  logo: "logo.svg"
  logo_color: "logo-color.webp"
  icon_dir: "icons/"
official_asset_urls:
  logo: "https://pupukahitech.org/assets/logo-white-CuOuO6kL.svg"
  logo_color: "https://storage.googleapis.com/gpt-engineer-file-uploads/VT5rFLkaTBYAF9U6C2W1ZYRJAHj2/social-images/social-1784764299804-Color_logo_with_background.webp"
  ground: "https://pupukahitech.org/assets/hero-bg-DlfPret3.webp"
cta:
  kicker: "FOLLOW"
  handle: "@pupukahi_tech"
  platforms: [tiktok, linkedin, instagram]
---

# Design law

The website establishes the brand: warm off-white editorial surfaces, ocean
navy photographic overlays, teal action color, sand-gold highlights, Inter,
rounded controls, generous spacing, and direct community language. Video uses
the darker website register so white type and the closing handle remain clear.

One headline and one dominant proof object per scene. Row count follows phone-size
readability: a five-item comparison can stay together if its labels remain legible.
Do not collapse and rebuild a chart just to meet an arbitrary three-row limit.
The frame is an editorial field, not a dashboard. Compose each scene's hero
object freely within this law: the colors, type, spacing, safe areas, logo
treatment, and CTA structure above are fixed, and the layout and motion of the
hero object are yours to design per scene. Preserve useful object identity across
beats; extract a shared block only when it simplifies real reuse.

Motion reveals information in stages. The film current is left. Ordinary seams
use a left push. A zoom-through is optional, not a required beat; omit it unless
spatial continuity explains the reveal. Keep one readable scene at the handoff,
with no blank landing or overlapping headlines. No crossfades,
floating, breathing, wobble, glassmorphism, card grids, emoji, or decorative
pseudo-Hawaiian motifs.

---

# The ground (required on every scene)

Every scene sits on the same four-layer ground, in this order, bottom to top.
Copy the assets into `composition/assets/brand/` and reference them relatively.
This stack is **mandatory**. It makes consecutive scenes read as one
film instead of a stack of slides. Do not substitute a plain flat fill, and do
not raise the photo opacity to make it "visible": it is a texture, not an image.

```css
.ground {                       /* 1. the canvas */
  position: absolute; inset: 0; overflow: hidden;
  background: #0e394e;
}
.ground-photo {                 /* 2. the brand photo, barely there */
  position: absolute; inset: 0;
  background: url("assets/brand/ground.webp") center / cover no-repeat;
  opacity: .15;
}
.ambient {                      /* 3a. teal bloom, top-right */
  position: absolute; width: 900px; height: 900px;
  top: -230px; right: -280px; border-radius: 50%;
  background: radial-gradient(circle, rgba(57,161,172,.42), rgba(57,161,172,0) 68%);
  opacity: .72;
}
.ambient-two {                  /* 3b. sand bloom, bottom-left */
  position: absolute; width: 760px; height: 760px;
  left: -360px; bottom: -230px; border-radius: 50%;
  background: radial-gradient(circle, rgba(209,152,71,.18), rgba(209,152,71,0) 70%);
}
.grain {                        /* 4. film grain */
  position: absolute; inset: 0;
  opacity: .045;
  mix-blend-mode: soft-light;
  background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 180 180' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='.85' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='.7'/%3E%3C/svg%3E");
}
```

The ground is static. It does not animate, parallax, or pulse. Only the
content above it moves. The two blooms stay in their corners for the whole
film so the frame keeps a consistent light direction.

Readable type always sits on the ground, never on a photograph at full
opacity. Preserve the ground, photo, blooms, and grain. For readability, move or
enlarge foreground labels or give the proof object a restrained navy backing;
do not remove or brighten the ground to fix foreground contrast.

## Foreground and subtitles

At 1080×1920, start with 80–112 px headlines, 40–52 px essential evidence labels,
and 52 px captions. Essential billing qualifiers need the same reading priority
as the price. Check at roughly 360 px display width; shorten labels or split a
beat rather than shrinking important text into footnotes. Scale with resolution.
Anchor the visible caption block 340 px above the bottom at 1080×1920. This
caption-specific default overrides the 420 px inset for other content; adjust
it when a supplied platform overlay requires more clearance. Bottom-align the
text inside its container so unused container height does not lift it. Allow
two lines to grow upward and leave 48 px between captions and proof objects.
Check the visible text bounds at phone size, not only the container's CSS.
Align labels to the objects they describe, using one clear reading order.

Captions show a stable phrase of usually 3–6 words, at most two lines. Unspoken
and finished words stay ink; only the current word gets a sand background with
dark foreground text. Clear that highlight at the word's measured end, including
pauses. Use no bounce, zoom, typewriter reveal, or changing font weight that
reflows the phrase. Keep this style consistent across the video. A subtle navy
backing behind the caption band is allowed; it does not replace the ground stack.

Sand belongs to the caption's spoken-word highlight and the closing card's
kicker. Do not use it for headline words, prices, stats, step numbers, badges,
or backgrounds; a second sand element competes with the word being spoken.
Teal marks actions and state; ink carries everything else. Give an important
value emphasis through size and weight in ink.

---

# The closing card (required, and its own scene)

The last scene is the follow card. Nothing else shares it: no leftover stat,
no evidence row, no headline from the previous beat. Give it its own scene of
4-6 seconds.

No logo appears in the video, including the closing card. The brand is
established by the ground, palette, type, and closing handle.

Structure, centered on the visible frame:

```html
<div class="cta-lockup">
  <div class="cta-kicker">FOLLOW</div>
  <h1 class="cta-handle">@pupukahi_tech</h1>
  <div class="socials" aria-label="TikTok, LinkedIn, and Instagram">
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
.cta-kicker { color: #d19847; font-size: 45px; font-weight: 800; letter-spacing: .18em; }
.cta-handle { margin: 30px 0 0; color: #fcfaf8; font-size: 82px; font-weight: 800;
              line-height: 1; letter-spacing: -.06em; }
.socials    { display: flex; align-items: center; justify-content: center;
              gap: 30px; margin-top: 48px; }
.socials svg { display: block; width: 94px; height: 94px; flex: 0 0 94px;
               fill: #fcfaf8; }
```

Entry: the lockup fades and settles first, kicker rises at 0.30s, handle at
0.48s (`power4.out`, 0.72s), then the icons rise with a 0.10s stagger from
0.98s (`power3.out`, 0.48s). Icons enter last, together, as a set.

## The icons

`icons/` holds monochrome single-path marks with a 16×16 viewBox, `fill="currentColor"`,
one consistent family (Bootstrap Icons, MIT). Order them as `cta.platforms`
lists them.

**Inline the SVG markup** rather than using `<img>`. These carry no internal
`id`s and no baked colors, so inlining is collision-free and lets one CSS rule
color the whole row:

```css
.socials svg { fill: #fcfaf8; }   /* ink: one value, all three marks */
```

Ink (`#fcfaf8`) is the default. The teal accent (`#39a1ac`) is the only other
permitted value, and if you use it, use it on all three. Never per-platform
brand colors: a full-color row does not read as a set on this ground, the
dark-variant glyphs lose their offset paths against navy, and LinkedIn blue on
navy fails contrast.

Adding a platform: drop its Bootstrap Icons SVG into `icons/` named after the
platform, then list it in `cta.platforms`.
