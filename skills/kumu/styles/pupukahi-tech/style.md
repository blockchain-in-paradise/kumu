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
preview_at: [0.2, 4.6, 9.6] # title with the large coin, trader paid at the counter with reserves feeding the peg and caption, closing
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
visuals: drawn # proof objects are built, not sourced; skip photo and screen research
skills: [hyperframes-core, hyperframes-cli, media-use] # media-use for speech and captions; load no other HyperFrames skills
opening: "titled" # the video title as the header and the proof object on screen from frame 0 (see Opening)
closing: "fade" # no payoff: the elements fade under the header, then the closing card (see Closing)
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
`index.html` in this folder is the working sample; start compositions from it
and keep its helpers (`fit`, `at`, `connect`, `to`, `pull`, `carry`, `take`, `tick`),
its two people, the small coin and bill, and the lock.

# Look

One headline and one dominant proof object per scene. Row count follows
phone-size readability. The frame is an editorial field, not a dashboard:
colors, type, spacing, safe areas, and the closing card are fixed, and the
layout and motion of the proof object are designed per scene. Preserve useful
object identity across beats.

Proof objects look like the real thing. Build recognizable objects (a coin, a
card, a phone, a receipt) with gradients, rims, and soft shadows rather than
flat boxes, label them in plain words. No value tags on the object: the scale names the
value. What stands behind an object is
drawn too (a banded cash stack, a Treasury certificate), never a text list, on
a shelf lighter than the ground (`#1f6a80` to `#175469`) with a teal border so
it reads clearly. When one thing drives another, show it working: the drivers
pulse and a glowing teal dotted path flows from them to what they move. Keep a
settled state to the headline, one object group, and the caption.

The [frame.md](../../frame.md) diagram rules apply; the sample implements each
of them, so reuse its helpers rather than rewriting them: `at` and `connect`
(measured paths), `pull`, `carry`, and `take` (exchanges), `tick` (the scale
names the value), `fit` (headline size), and `INTRO` (the bookend). In this style:

- **People** follow People and looks below.
- **Exchanged items** are small copies of what the scene already drew (in the
  sample, `.coin.mini` and one bill from the cash stack).
- **The scale** lights its mark teal, or sunset below the target.
- **A failure** greys and stops the dotted paths, lands the sunset lock pill
  (padlock and two or three words, `--on-highlight` text) on the shelf's top
  edge, and dims the reserves.

The sample is a reference for quality and for its helpers, not a layout to
copy. Fixed across videos: the ground, colors, type, captions, motion values,
opening, closing, and closing card. Designed new for each video: the main
object and what stands behind it, where things sit and which side people
enter from, the people's looks, and what a failure stops.

Motion reveals information in stages. The film current is left: ordinary seams
use a left push. A zoom-through is optional. Keep one readable scene at each
handoff, with no blank landing or overlapping headlines. No crossfades,
floating, breathing, wobble, glassmorphism, card grids, or emoji.

# People and looks

`assets/characters/people.js` (load it after GSAP) draws people as flat busts
with no face: an oval head with ears, hair shaped to the skull, a neck going
into the collar, rounded shoulders, one lit and one shadow tone. Mount one
with `People.mount("#id", look, "Label")`; labels are 40 px plain words.

A look is `{ skin, hair, hairColor, top, shirt, prop }`. `skin` from
`People.SKIN` (porcelain, light, tan, olive, brown, deep); `hair` one of
`short`, `buzz`, `bun`, `long`, `curly`, `bald`; `top` one of `crew`,
`collar`, `hoodie`; `shirt` any color, best from `support`; `prop` one of
`lanyard`, `tie`, `glasses`, `earrings`, or `null`.

`People.LOOKS`: `saver`, `trader`, `student`, `teller`, `elder`, `founder`.
Spread a preset and override: `{ ...People.LOOKS.teller, skin: "deep" }`.

Choose each person's look to fit the role and the topic (a teller in a collar
and tie, a student in a hoodie); do not leave the sample pair by default. In
one video, no two people share a hair and top, and their shirts differ. To add
a hair, top, or prop, add it to `people.js`, never as SVG drawn over a person
in the composition.

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

Music: bundled `happy-beats-business-moves-vol-12`, about 24 LU under the
narration (roughly 0.05 gain).

# Type and captions

Headlines 80–112 px, essential labels 40–52 px, captions 52 px at 1080×1920.
Headlines fill 92–988 px through the sample's `fit()`, set as
`tl.set(hl, { textContent, fontSize: () => fit(text) }, t)` with
`text-wrap: balance`. Keep at least 40 px between the headline's last line and
the object below it.
Captions sit on the ground with no backing. Finished and upcoming words stay
`--ink`; only the current word gets a `--highlight` background with
`--on-highlight` text. `--highlight` is for that word and the closing kicker
only. Give important values emphasis through size and weight in `--ink`.

# Pronunciation

Kokoro reads Hawaiian words as English. In the TTS input only, use these
respellings; `SCRIPT.md`, captions, and on-screen text keep the correct
spelling and diacritics. Draft respellings, to be confirmed by ear with
`video-output/pupukahi-pronunciation-test`; edit this table after listening.

| Word | Respelling |
| --- | --- |
| Pūpūkahi | poo-poo-kah-hee |
| Hawaiʻi | ha-wy-ee |
| kūpuna | koo-poo-nah |
| ʻohana | oh-hah-nah |
| kōkua | koh-koo-ah |
| mahalo | mah-hah-loh |
| aloha | ah-loh-hah |
| Honolulu | hoh-noh-loo-loo |

# Claims

These topics touch money, security, and law, and the audience may act on them.
List each claim with its source in the plan. A rule or fee that depends on the
place gets one short spoken qualifier ("rules vary by state"), never an
on-screen disclaimer block. Cite Hawaiʻi rules to state sources, not to
national summaries, and say plainly when a protection has limits. No price
predictions, no promise of returns, and no advice to buy anything.

# Opening: titled

No empty intro. At t = 0 the header is the video title (the thumbnail title)
and the scene's main proof object is already on screen, large in the free
space under the header (about 1.8×). The narration starts at once. As the
first diagram part arrives, the object scales to its diagram spot (0.6 s,
`power2.inOut`). The
header stays through the explanation and changes only when the scene's subject
changes (a failure state, a new scene); the rest of the stage builds in as the
words name it.

# Closing: fade under the header

There is no payoff card. On the answer line, the rest of the diagram (scale,
shelf, paths, people, marks) fades over 0.6 s (`power3.in`) while the main
object returns to its opening size and spot (0.8 s, `power2.inOut`), raised
above the fading parts (`zIndex`). After the last spoken line, the object fades over 0.6 s. The header holds alone on the
ground about 1.4 s, then leaves with the left push as the closing card pushes
in (`slide.ogg`).

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
