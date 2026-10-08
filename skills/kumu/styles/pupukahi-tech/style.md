---
name: "Pūpūkahi Tech Foundation"
source: "https://pupukahitech.org/"
register: dark
colors:
  canvas: "#0e394e" # base of the ground
  ink: "#fcfaf8" # text and default marks
  on-highlight: "#1d2930" # text on the highlight
  accent: "#39a1ac" # actions, state, and data marks
  highlight: "#d19847" # caption spoken word and closing kicker only
  panel: "rgba(14,57,78,.72)" # restrained backing behind a proof object
  border: "rgba(252,250,248,.22)"
  support: # extra diagram colors, used sparingly
    primary: "#196d76"
    palm: "#367d65"
    sunset: "#ee7c2b"
typography:
  display: { fontFamily: "Inter", weight: 800, lineHeight: 0.92, tracking: "-0.04em" }
  body: { fontFamily: "Inter", weight: 400, lineHeight: 1.4 }
  fonts: "assets/fonts/inter-{400,600,800}.woff2"
voice: "af_heart"
voice_speed: 1.0
preview_at: [0.2, 4.6, 9.6] # empty, coin back at the peg with reserves feeding it and caption, closing
spacing:
  edge: "92px"
  platform_ui_bottom: "420px"
  caption_bottom: "340px"
assets:
  ground: "assets/ground.webp"
  logo: "assets/logo.svg"
  logo_color: "assets/logo-color.webp"
  icon_dir: "assets/icons/"
official_asset_urls:
  logo: "https://pupukahitech.org/assets/logo-white-CuOuO6kL.svg"
  logo_color: "https://storage.googleapis.com/gpt-engineer-file-uploads/VT5rFLkaTBYAF9U6C2W1ZYRJAHj2/social-images/social-1784764299804-Color_logo_with_background.webp"
  ground: "https://pupukahitech.org/assets/hero-bg-DlfPret3.webp"
cta:
  kicker: "FOLLOW"
  handle: "@pupukahi_tech"
  platforms: [tiktok, linkedin, instagram]
  icon_colors: [ink, accent]
---

# Character

Warm off-white editorial type on the darker website register: ocean navy
photographic ground, teal action color, sand-gold highlight, Inter, generous
spacing, and direct community language. Avoid decorative pseudo-Hawaiian motifs.
`index.html` in this folder is the working sample; start compositions from it.

# Look

One headline and one dominant proof object per scene. Row count follows
phone-size readability. The frame is an editorial field, not a dashboard:
colors, type, spacing, safe areas, and the closing card are fixed, and the
layout and motion of the proof object are designed per scene. Preserve useful
object identity across beats.

Proof objects look like the real thing. Build recognizable objects (a coin, a
card, a phone, a receipt) with gradients, rims, and soft shadows rather than
flat boxes, label them in plain words, and give values a white price-tag pill
just above the object, with no connector line. What stands behind an object is
drawn too (a banded cash stack, a Treasury certificate), never a text list, on
a shelf lighter than the ground (`#1f6a80` to `#175469`) with a teal border so
it reads clearly. When one thing drives another, show it working: the drivers
pulse and a glowing teal dotted path flows from them to what they move. Keep a
settled state to the headline, one object group, and the caption.

Motion reveals information in stages. The film current is left: ordinary seams
use a left push. A zoom-through is optional. Keep one readable scene at each
handoff, with no blank landing or overlapping headlines. No crossfades,
floating, breathing, wobble, glassmorphism, card grids, or emoji.

# Ground (required on every scene)

Every scene sits on the ground: three static layers, bottom to top. It makes
consecutive scenes read as one film. The photo is a texture, not an image; do
not raise its opacity to make it visible, and do not remove or brighten the
ground to fix foreground contrast. Move or enlarge labels, or give the proof
object a restrained `--panel` backing, instead.

```css
.ground { position: absolute; inset: 0; overflow: hidden; background: var(--canvas); }
.ground-photo {
  position: absolute; inset: 0; opacity: 0.15;
  background: url("assets/ground.webp") center / cover no-repeat;
}
.grain {
  position: absolute; inset: 0; opacity: 0.045; mix-blend-mode: soft-light;
  background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 180 180' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='.85' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='.7'/%3E%3C/svg%3E");
}
```

# Motion values

| Value | Setting |
| --- | --- |
| Eases | Enter `power3.out`, exit `power3.in`, state moves `power2.inOut`; closing card entries `power4.out` |
| Durations | Entrances 0.6 s, the left-push seam 0.6 s, small state moves 0.5 s |
| Overshoot | None; this style settles without bounce |
| Stagger | 0.08 s between entering elements |
| State changes | Values change by stepping (`tl.set`) at the moment they change, never by counting up |

# Sound

Files are in `assets/sfx/` (credits in `CREDITS.md`).

| Event | File | Gain |
| --- | --- | --- |
| A value changes | `click.ogg` | 0.4 |
| A proof object or panel lands | `place.ogg` | 0.4 |
| Left-push seam | `slide.ogg` | 0.3 |
| Emphasis on the key change | `soft-impact.ogg` | 0.35 |
| Payoff | `payoff.ogg` | 0.4 |

Music: bundled `happy-beats-business-moves-vol-12`, about 24 LU under the
narration (roughly 0.05 gain).

# Type and captions

Headlines 80–112 px, essential labels 40–52 px, captions 52 px at 1080×1920.
Captions sit on the ground with no backing. Finished and upcoming words stay
`--ink`; only the current word gets a `--highlight` background with
`--on-highlight` text. `--highlight` is for that word and the closing kicker
only. Give important values emphasis through size and weight in `--ink`.

# Closing card

Its own 4–6 s scene on the ground, nothing else on it, no logo:

```html
<div class="cta-lockup">
  <div class="cta-kicker">FOLLOW</div>
  <h1 class="cta-handle">@pupukahi_tech</h1>
  <div class="socials"><!-- inline icons/*.svg in cta.platforms order --></div>
</div>
```

```css
.cta-lockup { position: absolute; inset: 0; display: flex; flex-direction: column;
  align-items: center; justify-content: center; padding: 0 60px; text-align: center; }
.cta-kicker { color: var(--highlight); font-size: 45px; font-weight: 800; letter-spacing: 0.18em; }
.cta-handle { margin: 30px 0 0; color: var(--ink); font-size: 82px; font-weight: 800;
  line-height: 1; letter-spacing: -0.06em; }
.socials { display: flex; align-items: center; justify-content: center; gap: 30px; margin-top: 48px; }
.socials svg { display: block; width: 94px; height: 94px; flex: 0 0 94px; fill: var(--ink); }
```

Entry: kicker rises at 0.30 s, handle at 0.48 s (`power4.out`, 0.72 s), then
the icons rise together with a 0.10 s stagger from 0.98 s (`power3.out`, 0.48 s).
Use the first color in `cta.icon_colors` for every icon, never per-platform colors.
