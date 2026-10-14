---
name: "motion"
source: "https://www.tiktok.com/t/ZPLYRsoq9/ (studied for look and motion; no footage, audio, or wording reused)"
register: light
colors:
  canvas: "#f5f7fa" # near-white base under the color fields
  ink: "#1d1d1f"
  on-highlight: "#ffffff"
  accent: "#1765ce" # key words, overlays, active state
  highlight: "#1765ce" # visual-mode key word (text color)
  panel: "#ffffff" # UI cards
  border: "rgba(0,0,0,.06)"
  support:
    muted: "#66666c" # secondary line and labels
    alert: "#f0544f" # a wrong or warning state
    field-blue: "rgba(120,170,255,.55)"
    field-peach: "rgba(255,190,170,.35)"
    field-green: "rgba(170,230,190,.40)"
typography:
  display: { fontFamily: "Inter", weight: 600, lineHeight: 1.05, tracking: "-0.03em" }
  body: { fontFamily: "Inter", weight: 400, lineHeight: 1.4 }
  fonts: "assets/fonts/inter-{400,600,800}.woff2"
voice: "af_heart"
voice_speed: 1.0
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
  left, peach right, green lower) that flow and breathe the whole video: each
  drifts 60–120 px, scales between 0.92 and 1.08, and eases its opacity a
  little, back and forth on its own 6–9 s cycle with offset phases. No texture.
- Subjects: white cards, 28 px radius, hairline `--border`, large soft shadow
  (`0 30px 70px rgba(30,50,90,.14)`), clean rows, fields, and colored
  rounded-square icons. A macOS-style black cursor with a white edge.
- Overlays explain: a translucent `--accent` shape or ring, dotted paths, a
  check that pops on success, a ring that pulses on a target. Use
  `support.alert` only for a wrong or failing state.
- A faint static grain (3%) is optional, not required for banding prevention.
  Keep it only when a compressed draft retains clean foreground detail.
- Real product names and screenshots only when sourced; otherwise neutral
  sample UI.

# Type and words

The words zone is at the top (`spacing.words_top`), centered. Visual mode is
the default: each beat has one headline (about 68 px, weight 600, at most two
balanced lines) with one key word in `--accent`, and an optional gray line
under it (40 px, `support.muted`). Headline words blur in one by one (blur 14 px
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
- The background fields flow continuously, the one ambient motion this style
  allows. They stay behind the content and stay slow enough never to compete
  with it; nothing else moves idly. Drive them from the main timeline (`sine.inOut`
  tweens with `yoyo` and repeats computed to cover the duration), never CSS
  `infinite` or the clock.

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

# Choreography

Use shared resources for UI continuity and attention, keeping this style's
calm cursor-led action and motion values. A beat is target → cursor action →
response → readable result. The destination exists before a panel or overlay
moves toward it. Cursor clicks have a consequence; never use the cursor as an
unconnected pointer drifting around the composition.

| Before | Action | Result |
| --- | --- | --- |
| A neutral example form with a missing field | Cursor focuses the field, enters sample input, then submits | The submitted state visibly reflects that input |
| Two views of the same loading example | Placeholder slots become content in place under equal timing | The shared geometry explains continuity without a product-speed claim |

Reject a panel entrance unrelated to the action or a success check before
submission. Keep active UI flat and large enough to read after the intro tilt;
use motion from the source or target rather than an arbitrary screen edge.
Background drift is atmosphere, not progress. Give completed results reading
holds and simplify competing headlines before adding camera movement.

# Checks

- Inspect each input, cursor target, response, and completed result at phone
  size; essential labels are at least 40 px at 1080 wide. Tiny sample UI text
  may be decorative only if no teaching claim depends on reading it.
- Play every click and panel handoff. The target reacts after the input and
  the cursor lands inside the control in the rendered coordinate system.
- Compare before and after geometry: corresponding fields remain identifiable
  through transitions, and perspective never hides an essential result.
- Background drift and shimmer cannot excuse a missing explanatory action.
  Check the result's reading interval independently of ambient motion.
- The field repeats may extend beyond the root's finite duration to cover
  a partial cycle; that lint warning is intentional only for this ambient
  layer, not a reason to excuse clipped explanatory actions.
- Source actual product behavior, or explicitly identify neutral sample UI.
  Equal illustrative waits are model inputs, not measured performance claims.

# Sound

Files are in `assets/sfx/` (credits in `CREDITS.md`). Gains are starting points
under a music bed near -21 LUFS; measure the mix as `render.md` says.

| Event | File | Gain |
| --- | --- | --- |
| Cursor click or tap | `click.ogg` | 0.5 |
| Card or panel enters | `transition.ogg` | 0.35 |
| Headline swap | `slide.ogg` | 0.25 |
| Card settles or result lands | `place.ogg` | 0.4 |
| Success and closing payoff | `payoff.ogg` | 0.45 |

Music: bundled `happy-beats-business-moves-vol-1` at about 0.4 gain. Sounds
stay soft and sparse: at most one effect per change, none for ambient drift.

# Closing

No handle. The UI and headline blur out, then a glossy `--accent` mark for the
topic (a rounded square with a symbol drawn for the video) pops in, with a
small gray line and a large black two-word payoff (104 px, weight 800) written
for the video.
