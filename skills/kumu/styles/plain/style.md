---
name: "plain"
register: light
colors:
  canvas: "#ececec" # plain light gray background
  ink: "#111111"
  on-highlight: "#111111"
  accent: "#e4572e" # state, action, and data marks
  highlight: "#ffd84d" # caption spoken word and line key word
  panel: "#ffffff"
  border: "rgba(17,17,17,.14)"
typography:
  display: { fontFamily: "Inter", weight: 800, lineHeight: 0.95, tracking: "-0.03em" }
  body: { fontFamily: "Inter", weight: 400, lineHeight: 1.4 }
  fonts: "assets/fonts/inter-{400,600,800}.woff2"
preview_at: [0.2, 2.6, 7] # empty, elements with caption, payoff
spacing:
  edge: "80px"
  platform_ui_bottom: "420px"
  caption_bottom: "340px"
cta: null
---

# Character

Neutral and unbranded, for tests and videos that carry no channel identity.
Clean flat diagrams on a light gray canvas, black type, one orange-red accent.
`index.html` in this folder is the working sample; start compositions from it.

# Look

Plain `--canvas` background, no texture. Props and diagrams are flat white
cards with a 2 px `--border` and a soft shadow (`0 12px 32px rgba(0,0,0,.08)`).
Captions are `--ink` with only the current word on a `--highlight` background.
Scenes change in place or slide; no decorative motion.

# Motion values

| Value | Setting |
| --- | --- |
| Eases | Enter `power3.out`, exit `power2.in`; data that grows over time (a line drawing on) runs linear |
| Durations | Entrances 0.5 s, exits 0.45 s, the payoff card 0.6 s from 0.94 scale |
| Overshoot | None |
| Stagger | 0.08 s between entering elements |
| State changes | Readouts step with the data (`tl.set`) as it advances |

# Closing

No handle and no closing card. The stage clears and the answer stands alone as
a payoff card: the key number very large in `--accent`, one line under it in
`--ink`, held 2–3 s.
