---
name: "car-cats"
source: "https://www.tiktok.com/t/ZPLFn5Wyp/ (studied for the device: real cat photos reacting with meme captions around a repeated stage; no footage, audio, or wording reused)"
register: dark
colors:
  canvas: "#0b0b0e" # near-black under carbon texture
  ink: "#f5f5f7"
  on-highlight: "#0b0b0e"
  accent: "#ff2d3d" # racing red: key words, bars, payoff
  highlight: "#ff2d3d"
  panel: "rgba(255,255,255,.08)" # empty bar track
  border: "rgba(255,255,255,.14)"
  support:
    muted: "#8b8b96"
    amber: "#ffb020" # warnings, second place, caution
typography:
  display: { fontFamily: "Barlow Condensed", weight: 800, style: italic, lineHeight: 0.9, case: uppercase }
  body: { fontFamily: "Barlow Condensed", weight: 500, lineHeight: 1.2 }
  meme: { fontFamily: "Anton", weight: 400, stroke: "6px black", case: uppercase }
  fonts: "assets/fonts/{barlow-condensed-800-italic,barlow-condensed-600-normal,barlow-condensed-500-normal,anton-400-normal}.woff2"
preview_at: [0.2, 13.3, 15.8] # empty, boxer engine running with cat and line, closing
spacing:
  edge: "70px"
  platform_ui_bottom: "420px"
  caption_bottom: "330px"
cta: null
---

# Character

Fast, loud, and funny: real cars on a dark racing backdrop, with the gato cat
meme reacting to every twist. Suits car comparisons, specs, buying advice, how parts work, and
car culture. `index.html` is the working sample (2024 MX-5 vs GR86 horsepower);
`thumbnail/index.html` is the cover.

# Look

- **Backdrop**: near-black with a fine carbon-fiber weave, a strong red glow
  centered behind the stage, and a vignette. Nothing moves in the backdrop.
- **Cars** sit in skewed photo panels (a parallelogram with a red edge stripe),
  like a racing game menu. A panel leans left or right, sits higher or lower,
  and fills the width at about 940 by 400 px. A car is cut out only when a
  clean transparent image already exists (see Photos); never show a rough
  automatic cutout.
- **The mascot** is `assets/photos/gato.webp` (a transparent cat meme supplied
  by the channel), about 400 px wide. It is big and moves around: it rises from
  the bottom on one side for one car, slams in from the other side for the
  next, peeks from behind a panel edge for a third. It may sit behind the
  words zone; the line stays on top. Its meme caption, in Anton with a black
  stroke, sits centered above its head, never over its face. One reaction per
  beat at most. Other transparent cat memes the user supplies may join it.
- **Parts** (an engine, a turbo, a gearbox) are drawn as in
  [frame.md](../../frame.md) Real objects, with this finish instead of flat
  tones: metal shaded with linear gradients (a bright band along round parts
  such as pistons, pins, and shafts), a thin light edge, and a soft drop
  shadow under the whole drawing. Show the real details that make it read
  (fins, bolts, valves, runners, an oil pan) and the motion in red and orange
  on the drawing, as in the sample's boxer. Real photos stay for whole cars.
- **Data**: one big italic number per car with a small gray unit, placed on
  the side opposite the cat. At most one short amber label (a few words on one
  line, like "Aftermarket support") near the number. No bars for single
  values, no badges, no separator dots.
- **Photos**: look first for images that are already transparent (PNG with an
  alpha channel) and freely licensed, or supplied by the user in the project's
  `media/` folder. Otherwise use a freely licensed photo (Wikimedia Commons
  CC0, public domain, or CC BY; Pexels; Unsplash) in a skewed panel, cropped
  to the car with `object-position`. Prefer clear side or three-quarter views
  on a plain background. Record every credit in `caption.txt`.

# Structure

- **Opening**: the title alone, large and centered on the backdrop, about
  190 px, with the key word in `--accent`. No car, cat, number, or subtitle
  yet. It holds about 1.5 s, then speeds off.
- **Header**: after the intro, the header slot at the top carries only the
  current car's name (make in `--ink`, model in `--accent`, about 140 px) over
  the short red rule. When the next car arrives, the name swaps. No subtitle
  line under it, no rank fraction.
- **Each car** gets its name in the header, its photo panel, its key number,
  and at most one label. Vary the rest from car to car: panel lean and height,
  how the car arrives (drives in from either side, drops from above, slides up
  from below), where the number sits, and where the cat appears.
- **Words zone**: one centered visual-mode line or caption phrase, full width,
  white with a black stroke, its key word in `--accent`.
- **Closing**: see Closing.

# Type and words

Barlow Condensed 800 italic uppercase for the title, header, and numbers.
Visual mode by default: one uppercase italic line with its key word in
`--accent`. Meme captions are the cats' voice, not the facts. Keep frames
light: a viewer reads the name, the number, and the line, nothing else.

# Motion

Hard and fast. The intro title slams in from the left with a slight skew,
car names slam into the header, cars arrive and skid to a stop, numbers count
up, and the mascot pops with a big overshoot. Nothing loops in the
background; motion only happens on a change, except a mechanism, which runs
while it is on screen as [frame.md](../../frame.md) Motion describes.

A mechanism scene plays like a dyno run: the drawing draws itself on in
light gray lines, parts fill in as they are named, then it fires up with a
short shake. Hot flow is `--accent` red and cold flow is a cool blue, both as
glowing dashes moving along their real paths, and spinning parts carry motion
blur at speed. Its key number (boost, rpm, temperature) counts up beside it as
the speed builds.

Between cars, the outgoing car leaves the way the next one does not arrive
(up, sideways, or down) with a short blur, while the header name swaps. Before
the closing, a race pass clears everything: pieces speed off sideways in
opposite directions with a horizontal blur, a skewed red band with a white
center stripe sweeps across the middle like a passing car, and the closing
skids in. The race pass is used once, not between every car.

# Motion values

| Value | Setting |
| --- | --- |
| Eases | Drive and slam `expo.out`, skid `back.out(1.2)`, cat pop `back.out(2)`, exits `power3.in` |
| Durations | Small 0.3 s, medium 0.5 s, a car arrival 0.7 s, a count-up 0.9 s |
| Overshoot | Cars skid about 3%; reaction cats overshoot about 20% |
| Counters | Spec numbers count up in about 12 steps (`tl.set`, seek-safe) |
| Car change | Exits 0.35 s `power3.in` with 12 px blur, next car starts 0.3 s later |
| Race pass | Exits 0.35 s `power3.in` with 14 px blur, band sweep 0.45 s, entry 0.5 s `back.out(1.2)` from 10 px blur |

# Sound

Garage sounds, not engines: the cars are on screen, so the sound is the
workshop around them. Files are in `assets/sfx/` (credits in `CREDITS.md`).
Use about one sound per change, and vary which tool plays so two cars never
sound the same.

| Event | File | Gain |
| --- | --- | --- |
| Video opens (once, under the intro title) | `engine-start.ogg` | 0.4 |
| A car arrives or the header name swaps | `ratchet.ogg`, `impact-wrench.ogg`, or `drill.ogg` | 0.35 |
| A number lands | `hammer.ogg` | 0.35 |
| A label or warning appears | `wrench-drop.ogg` or `toolbox.ogg` | 0.3 |
| Race pass to the closing | `air-hiss.ogg` then `transition.ogg` | 0.35 |
| Closing lands | `soft-impact.ogg` | 0.4 |
| Cat reaction | `meow-short.ogg` or `meow-long.ogg` | 0.45 |

No engine sound after the opening. Music: an energetic bundled track at about
0.45 gain in visual mode.

# Closing

No handle (`cta: null`). After the race pass, the header, cars, cat, numbers,
and lines are all gone. The closing stands alone on the backdrop: the payoff
phrase huge in red italic (about 240 px), centered, with one short uppercase
line under it. Nothing else, and it holds at least 2 s.
