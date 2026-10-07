---
name: "motion"
source: "https://www.tiktok.com/t/ZPLYRsoq9/ (studied for look and motion; no footage, audio, or wording reused)"
register: light
colors:
  canvas: "#f5f7fa" # near-white base under the color fields
  ink: "#1d1d1f"
  on-highlight: "#ffffff"
  accent: "#2f7bf6" # key words, overlays, active state
  highlight: "#2f7bf6" # visual-mode key word (text color)
  panel: "#ffffff" # UI cards
  border: "rgba(0,0,0,.06)"
  support:
    muted: "#8e8e93" # secondary line and labels
    alert: "#f0544f" # a wrong or warning state
    field-blue: "rgba(120,170,255,.55)"
    field-peach: "rgba(255,190,170,.35)"
    field-green: "rgba(170,230,190,.40)"
typography:
  display: { fontFamily: "Inter", weight: 600, lineHeight: 1.05, tracking: "-0.03em" }
  body: { fontFamily: "Inter", weight: 400, lineHeight: 1.4 }
  fonts: "assets/fonts/inter-{400,600,800}.woff2"
preview_at: [0.2, 2.9, 7.8] # empty, elements with line, closing
spacing:
  edge: "80px"
  words_top: "330px" # this style's words zone sits at the top
  platform_ui_bottom: "420px"
  caption_bottom: "340px"
cta: null
---

# Character

Calm, precise product-design explainer. A near-white page with soft drifting
color fields, crisp white UI cards, a cursor that does the explaining, and a
headline that changes with each beat. It suits interface, software, and
"small detail, big difference" topics, and any concept that can be shown as an
interface or a clean object being used. `index.html` is the working sample;
`thumbnail/index.html` is the cover sample.

# Look

- Background: `--canvas` with three large blurred color fields (blue upper
  left, peach right, green lower) that drift slowly the whole video. No texture.
- Subjects: white cards, 28 px radius, hairline `--border`, large soft shadow
  (`0 30px 70px rgba(30,50,90,.14)`), clean rows, fields, and colored
  rounded-square icons. A macOS-style black cursor with a white edge.
- Overlays explain: a translucent `--accent` shape or ring, dotted paths, a
  check that pops on success, a ring that pulses on a target. Use
  `support.alert` only for a wrong or failing state.
- A faint static grain (3%) over the fields prevents gradient banding.
- Real product names and screenshots only when sourced; otherwise neutral
  sample UI.

# Type and words

The words zone is at the top (`spacing.words_top`), centered. Visual mode is
the default: each beat has one headline (about 68 px, weight 600, at most two
balanced lines) with one key word in `--accent`, and an optional gray line
under it (38 px, `support.muted`). Headline words blur in one by one (blur 14 px
to 0, small rise, 0.07–0.08 s stagger) and blur out before the next. When
narrated, captions replace the gray line, in the top zone, current word in
`--accent` text.

# Motion

- Intro: the background alone for 0.4 s, then headline words blur in and the
  UI floats up while tilted in perspective (rotateX about 12°, rotateY about
  -18°), settling flat over about 2.5 s.
- Beats: one change at a time. The cursor glides on `power2.inOut`; a row
  highlights when reached; panels slide in 30 px with a fade; overlays scale
  in from their origin point. Calm, no bounce.
- The background fields drift continuously; nothing else moves idly.

# Motion values

The sample defines these as constants at the top of its script; videos reuse
them instead of typing durations and eases per tween.

| Value | Setting |
| --- | --- |
| Eases | Enter `expo.out`, exit `power2.in`, move `power2.inOut`, ambient drift `sine.inOut`. Never linear on a spatial move. |
| Durations | Small 0.4 s, medium 0.6 s, large 0.9 s; exits run at 0.7× their entrance |
| Overshoot | Cards and checks settle from 1.02 to 1.0; no elastic or bounce |
| Stagger | Headline words 0.05 s, items 0.08 s, at most 0.5 s per group, in reading order |
| Density | At most a third of the elements move at once |
| Camera | UI tilts in (rotateX about 12°, rotateY about -18°) and settles flat; a slow push-in to 1.04 while a result holds |
| Cursor | Glides on the move ease; a 0.9 scale dip on click, and the target reacts just after |

# Closing

No handle. The UI and headline blur out, then a glossy `--accent` mark for the
topic (a rounded square with a symbol drawn for the video) pops in, with a
small gray line and a large black two-word payoff (104 px, weight 800) written
for the video.
