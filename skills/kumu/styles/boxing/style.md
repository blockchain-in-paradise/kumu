---
name: "boxing"
source: "https://www.tiktok.com/t/ZPLY2AjpL/ (studied for the device: flat rigged fighters on a dark stage, a headline per beat, annotations on the subject, and a camera that turns between side and top-down views; no footage, audio, characters, or wording reused)"
register: dark
colors:
  canvas: "#111318" # blue-black stage
  ink: "#ece6da" # bone white: text
  on-highlight: "#111318"
  accent: "#ff3b3b" # gloves, the anchor line, headline line 2, misses and hits
  highlight: "#ff3b3b"
  panel: "#1d2029" # stage light in the center
  border: "rgba(255,255,255,.06)" # floor grid
  support:
    muted: "#7d828c" # chapter labels
    guide: "#3ddc84" # the correct move only: target spots, foot paths
typography:
  display: { fontFamily: "Anton", weight: 400, lineHeight: 1.02, case: uppercase }
  label: { fontFamily: "JetBrains Mono", weight: 700, tracking: "0.14em–0.22em", case: uppercase }
  fonts: "assets/fonts/{anton-400-normal,jetbrains-mono-400,jetbrains-mono-700}.woff2"
preview_at: [0.2, 5.2, 12.2] # empty, the lean with the miss drawn on, closing
spacing:
  edge: "70px"
  platform_ui_bottom: "420px"
  caption_bottom: "330px"
cta: null
---

# Character

A coach's whiteboard brought to life: two flat fighters on a dark stage act
out one technique, beat by beat, while a big two-line headline says what is
happening. Suits technique breakdowns, footwork, tactics, why a fighter wins,
and any sport that is about bodies and positions. `index.html` is the working
sample (the pull counter in boxing); `thumbnail/index.html` is the cover.

# Look

- **Stage**: a blue-black canvas with a soft lighter pool in the center, a
  vignette, and a faint perspective grid floor under a thin red line. Nothing
  moves in the background.
- **The anchor** is the red line. In the side view it is the floor; after the
  camera turns to top-down it becomes the line between the fighters. It stays
  on screen through every view.
- **Fighters** come from the kit in `assets/characters/`: capsule limbs, a
  round head with no face, shorts, red gloves. Each fighter has a look (skin,
  hair, hair color, shorts, gloves) so the two never read as the same person;
  shorts are the clearest marker. The viewer's fighter ("you") faces right;
  the other ("him", the rival) faces left (mirror its container with
  `scaleX(-1)`). Far limbs are a shade darker. Both cast a soft floor shadow.
  Never draw new figures for a run; give a real athlete a look that matches
  their skin tone, hair, and trunks color instead.
- **Top-down view**: the kit's tokens (shoulders, head, two gloves from
  above) on the same line.
- **Annotations** are drawn on the subject, never in boxes: dotted lines for
  reach and gaps, dashed green arcs for foot paths, a green glow on the target
  spot, an outline ring for an impact, and tiny mono labels next to what they
  name ("MISS", "LEAD FOOT", "OFF THE LINE"). Red marks a miss, a hit, or the
  problem; green marks only the correct move.

# Characters

`assets/characters/fighter.js` builds the rig and `poses.js` holds the poses.
Load `poses.js` then `fighter.js`, mount each fighter into a 600×900 box (the
figure's feet sit 825 px down, so put the box top 825 px above the floor),
and move between poses with `SportsRig.pose(tl, fighter, name, t, dur, ease)`.
`SportsRig.idle(tl, fighter, from, to)` keeps a held fighter breathing.
`SportsRig.LOOKS` has the sample's two looks; pass any
`{ skin, hair, hairColor, shorts, glove }` to `mount` and `mountTop`, with
hair one of `short`, `buzz`, `bun`, or `bald`.

Poses: `guard`, `jab`, `straight`, `lean`, `hit`, `step`. For a move the kit
lacks, add a pose to `poses.js` in the same joint-angle format by copying the
closest one and changing a few joints. The rig keeps feet flat and
drops or lifts the body so the lowest foot rests flat on the floor, and the
higher foot tips onto its toes to reach it, like a boxer's raised rear heel. For a different sport, keep the rig and
add poses (a squat, a swing, a sprint stride); add a prop such as a racket or
ball as its own SVG attached to a glove or foot position, and keep it flat and
in the palette. With hip-to-hip spacing of about 470 px, a `jab` or
`straight` reaches the other fighter's head and a `lean` takes the head out of
range, as in the sample.

# Structure

- **Opening**: the chapter label and the title alone, large (about 220 px) on
  the empty stage. The fighters are not there yet.
- **Each beat**: one headline of two short lines (white, then red), with the
  label above it naming the chapter ("THE SETUP", "THE COUNTER", "THE EXIT").
  The red line carries the point. One change on the stage per beat, matching
  the headline: the punch lands, the head pulls back, the foot steps.
- **Views**: side view for reach, punches, and timing; top-down for angles,
  footwork, and the line. Change view with the camera, never with a cut.
- **Data**: when a beat needs numbers (records, heights, reach), a small mono
  table or two numbers placed beside the fighters, never a full-screen chart.
- **Closing**: see Closing.

# Type and words

Headlines in Anton uppercase, about 128 px, left-aligned at the top,
at most about 14 characters per line, line 2 in `--accent`. Chapter labels in
JetBrains Mono 700, about 30 px, wide tracking, `--muted`, after a small red
square. Annotation labels in the same mono at about 30 px, colored by meaning.

In visual mode the headline is the line, so the words zone stays empty. When
narrated, the headline still changes per beat and captions sit in the words
zone as plain white Anton about 56 px with a dark outline, the current word
in `--accent`.

# Motion

Calm stage, sharp bodies. Headline lines blur in one at a time (line 2 on its
own phrase) and blur out before the next. Poses blend smoothly; punches snap
out fast and recover slower. Held fighters breathe with a small bob. Impacts
get one outline ring that expands and fades.

The camera is a layer around the whole stage pivoting on the red line. To go
top-down it rotates the world a quarter turn and pushes in slightly while the
side figures blur out and the tokens fade in, so the floor line becomes the
line between them. The camera only moves when the view must change.

# Motion values

| Value | Setting |
| --- | --- |
| Eases | Text in `power3.out`, text out `power2.in`, pose blend `power3.inOut`, punch `power4.out`, camera `power3.inOut`, spot pop `back.out(1.8)` |
| Durations | Text in 0.45 s from 12 px blur, text out 0.22 s, line 2 delay 0.35 s, pose 0.35 s, punch 0.18 s, recover 0.3 s, camera turn 0.9 s |
| Idle | Bob 6 px, 0.7 s per cycle, fighters out of phase by about 0.35 s |
| Camera | Rotate -90° and scale 1.08 around the red line at the floor; side figures fade out 0.2–0.6 s into the turn, tokens fade in from 0.55 s |
| Annotations | Gaps and paths draw in 0.3–0.5 s; labels rise 10 px in 0.25 s |

# Sound

Files are in `assets/sfx/` (credits in `CREDITS.md`). The stage is quiet;
sound marks contact and movement only.

| Event | File | Gain |
| --- | --- | --- |
| Video opens | `bell.ogg` | 0.35 |
| A punch lands | `punch.ogg` | 0.5 |
| A punch misses or a fast slip | `whoosh.ogg` | 0.4 |
| A step or pivot | `shuffle.ogg` | 0.4 |
| A label or annotation appears | `tick.ogg` | 0.3 |
| Camera turn | `transition.ogg` | 0.35 |
| Closing lands | `soft-impact.ogg` | 0.4 |

Music: a low, steady bundled track at about 0.4 gain in visual mode.

# Closing

No handle (`cta: null`). The headline, label, fighters, and line all clear.
The closing stands alone on the stage, centered: the payoff in two lines of
Anton about 112 px (white, then red) and one small mono line under it. It
holds at least 2 s.
