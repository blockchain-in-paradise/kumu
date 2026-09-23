---
name: "Pūpūkahi Tech Foundation"
source: "https://pupukahitech.org/"
register: dark
colors:
  canvas: "#0e394e"      # base of the ground
  ink: "#fcfaf8"         # text and default marks
  on-highlight: "#1d2930"  # text on the highlight
  accent: "#39a1ac"      # actions, state, and data marks
  highlight: "#d19847"   # caption spoken word and closing kicker only
  panel: "rgba(14,57,78,.72)"   # restrained backing behind a proof object
  border: "rgba(252,250,248,.22)"
  support:               # extra diagram colors, used sparingly
    primary: "#196d76"
    palm: "#367d65"
    sunset: "#ee7c2b"
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
  icon_colors: [ink, accent]
---

# Character

The brand uses warm off-white editorial surfaces, ocean
navy photographic overlays, teal action color, sand-gold highlights, Inter,
rounded controls, generous spacing, and direct community language. Video uses
the darker website register so white type and the closing handle remain clear.
Avoid decorative pseudo-Hawaiian motifs.

# Ground

Three layers, bottom to top. The photo is a texture, not an image; do not raise
its opacity to make it "visible".

```css
.ground {                       /* 1. the canvas */
  position: absolute; inset: 0; overflow: hidden;
  background: var(--canvas);
}
.ground-photo {                 /* 2. the brand photo */
  position: absolute; inset: 0;
  background: url("assets/brand/ground.webp") center / cover no-repeat;
  opacity: .15;
}
.grain {                        /* 3. film grain */
  position: absolute; inset: 0;
  opacity: .045;
  mix-blend-mode: soft-light;
  background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 180 180' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='.85' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='.7'/%3E%3C/svg%3E");
}
```
