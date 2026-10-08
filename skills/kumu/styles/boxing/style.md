---
name: "boxing"
source: "https://www.tiktok.com/t/ZPLY2AjpL/ (studied for the devices only: fighters acting out one technique, a line per beat, floor notes, and a camera that changes view; the fight-night look, fighters, broadcast graphics, palette, and type are deliberately distinct from the reference, and no footage, audio, characters, or wording are reused)"
register: dark
colors:
  canvas: "#110e0c" # warm off-black arena
  ink: "#f6f3ee" # white: text
  on-highlight: "#110e0c"
  accent: "#d2333a" # red corner: "you", your gloves and punches, the key word when it is your move
  highlight: "#d2333a"
  panel: "rgba(16,14,13,.84)" # broadcast bars, tags, cards
  border: "rgba(255,255,255,.05)" # canvas weave
  support:
    blue: "#2c66d3" # blue corner: the opponent, his gloves and punches, the key word when it is his move
    muted: "#b6aea3" # small caps lines
    white: "#ffffff" # correct-move floor notes, the line when it is the point
typography:
  display: { fontFamily: "Inter", weight: 800, case: sentence }
  label: { fontFamily: "Barlow Condensed", weight: 600, tracking: "0.1em–0.3em", case: uppercase }
  fonts: "assets/fonts/{inter-600,inter-800,barlow-condensed-600-normal}.woff2 (SIL OFL)"
voice: "bm_george"
voice_speed: 0.95
preview_at: [0.2, 9.42, 21.2] # empty arena, the counter landing on the chin over your shoulder, the last knockdown
spacing:
  edge: "60px"
  platform_ui_bottom: "420px"
  caption_bottom: "470px"
cta: null
closing: "loop" # no end card: every element fades out to the bare backdrop the video opened on (see Closing)
---

# Character

Fight night: two fighters in a canvas ring under one spotlight act out one
technique, beat by beat, while a quiet broadcast lower third carries the words
and the camera moves to the view that explains it. Suits technique breakdowns,
footwork, tactics, and why a fighter wins. `index.html` is the working sample
(the pull counter: done right he drops, then a replay where you stay in range
and you drop); `thumbnail/index.html` is the cover (the side view at the start
with the title). Every boxing video loops: no end card, no payoff card; it fades
out to the bare backdrop it opened on (see Closing).

# Look

- **Arena**: warm off-black, one overhead spotlight (a soft cone and a pool of
  light). The canvas is drawn in 3D so it turns with the camera, with a faint
  weave and rope shadows, and fades into the dark with no edge.
- **Fighters**: flat-shaded, each part one tone plus one shadow tone away from
  the spot, a thin light outline on the outer silhouette only. Head with ears
  and a hair cap set high (so the back of a head still reads), no face; tapered
  torso with round shoulders; trunks with a corner-color waistband and side
  stripe; boots, socks, white wrist wraps, cuffed gloves with a thumb. Red
  corner ("you") against blue corner, both at full opacity.
- **The line**: a thin, low-contrast floor line through both stances, white only
  when the line is the point.
- **Floor notes**, drawn on the floor in 3D: dashed foot paths with arrowheads, a
  glowing target circle, a translucent wedge for a punch's sweep (in the
  puncher's color), a dashed ring for "where you were". Correct moves and
  places are white. No gold or other accent: color comes from the two corners
  and white.

# Fighters and looks

`assets/characters/rig3d.js` holds the rig, cameras, floor notes, and ragdoll;
`poses.js` the poses; load them in that order. Make one stage on a full-frame
`<svg>` with `SportsRig.stage(svg)`, mount each fighter with
`SportsRig.mount(stage, look, { x, facing })` (`facing: 0` faces right, `180`
left; about 314 units apart in guard), call `SportsRig.face(you, rival)` so
punches aim at the other's chin, and bind the timeline once with
`SportsRig.bind(tl, stage)`.

Choose the rival's look to fit the topic (a preset other than `blue`, or a custom mix of skin, hair, trunks, and boots); do not leave the sample pair by default.

A look can carry `tattoo: "name"`, a head decal from `assets/characters/tattoos.js` drawn around the lead eye
(load `tattoos.js` after `poses.js`; `tribalEye` is the arch-and-swirl design). To add another, trace a
reference image into polygon outlines in the same format; body tattoos are not supported.

`SportsRig.LOOKS`: `red` and `blue` (the sample pair), `veteran`, `prospect`
(tank top), `slugger`, `stylist` (tank top), `porcelain`. A look is `{ skin, hair,
hairColor, trunks, corner, boots, socks, top }`: `skin` from `SportsRig.SKIN`
(porcelain, light, tan, olive, brown, deep, ebony), `hair` one of `short`, `buzz`,
`bun`, `bald`, `locs`, `braids`, `corner` `"red"` or `"blue"`, `top` a tank top
color or `null`. For a real athlete match only skin tone, hair, and trunks and
boots colors; no likeness beyond that, no logos.

# Motion and poses

- `SportsRig.pose(tl, f, name, t, dur, ease)` blends to a pose: `guard`, `jab`,
  `load`, `straight`, `lean`, `slip` (and its stages `slipBend`, `slipTurn`), `slipInside`,
  `slipCounter`, `bob`, `weave`, `weaveR`, `weaveHit`, `hit`, `step`,
  and the bent punches, each after its load pose: `hookLoad` > `hook` (lead hook),
  `rearHookLoad` > `rearHook`, `upLoad` > `uppercut` (rear), `leadUpLoad` >
  `leadUppercut`, `overLoad` > `overhand` (rear). Tween `f.state.x` or `z` to step.
- To make a punch miss, aim it at a frozen copy of the target's standing state before he moves: `rival.foe = { state: { ...you.state } }` (his punch goes where your head was; the chin tracking is for punches that should land).
- Match the punch to the words: a "jab" is `jab`, a "hook" is `hookLoad` then `hook`. A load pose coils the
  body the opposite way first (a lead hook dips to the lead side, then the lead shoulder whips around), so the
  turn shows which hand is coming; skip the load and a hook reads as a jab.
- Throw bent punches from close range: the fighters' `x` about 170 to 200 apart (step in first). They stay bent
  at any range, so from further away they fall short instead of straightening into a jab. Load ~0.25 s, punch
  0.18 s with `power4.out`.
- Punches aim themselves: `reachF`/`reachB` (0 to 1) solve the arm onto the
  opponent's chin, fully extended when out of range (a jab "falls short" on its
  own when the target leans away). `hookF`/`hookB`, `upF`/`upB`, and `overF`/`overB` bring the same reach in
  on an arc (out wide, from below, from above) with the elbow on that side; the poses above set them.
  Every punch loads, snaps out, and recoils with an overshoot; a hit snaps the
  head back.
- `SportsRig.idle(tl, f, from, to, amp)` keeps a fighter alive with a slow,
  small breathing bounce and weight drift (`amp` 0 holds still); the second
  fighter runs 12% slower so they never bounce in step. Run it to the end.
- `SportsRig.knockout(tl, stage, loser, t, { x, kind })` is the whole knockdown:
  ragdoll, slow motion into full speed, shake, and a camera that follows the
  fall. `x` is where he stands at `t`; `kind` is `"straight"` (default) or
  `"hook"`. He is on the canvas about 1.4 s after `t`; it returns `t + 2.4`.
  `SportsRig.stand(tl, f, t, x)` puts a fallen fighter back in guard for a
  replay. `SportsRig.ragdoll` is the lower level, for a custom fall.
- Clothes are layered by garment (trunks and stripe on the thigh, waistband and
  trunks on the torso, sock and boot on the shin, wrap and cuff on the forearm),
  so skin never shows through at any camera angle. Hair is a cap on the top and
  back of the head, drawn into the head and clipped to what the camera sees, so
  it never flips behind the skin.
- Other poses: copy the closest and change a few joints (`armF`, `foreF`, `legB`,
  ... swing in the body's plane, 0 hangs down, negative forward; `abd` lifts out;
  `hipYaw`/`chestYaw` turn; `torso` leans; `roll` bends; `head` tilts). A pose's
  `z` is a sidestep that stays until something sets `z` again. Never draw new
  figures for a run.

# Views

`SportsRig.view(tl, stage, name, t, extra)` is one continuous 0.55 s
`power2.inOut` move (yaw, pitch, roll, dolly together), then the camera holds.
`side` for range and timing (frame it `{ tx: -40, dist: 2700 }` when they start a
jab apart and one leans back, so both rear feet stay inside the frame);
`overhead` for the line, angles, and footwork (step the fighters apart so they
read as two bodies); `threeQuarter` (raised, over your
rear shoulder) for a straight landing; `{ yaw: -30, pitch: 32 }` over the left
fighter's back for his hook or uppercut, so the bent arm shows as an L (from the side or front the arc points
at the camera and reads as a jab or a backhand); `{ yaw: -38, pitch: 26 }` for the right fighter's punches
passing over the left fighter's weave; `low` for drama. Never pick an angle where gloves bunch in
front of a face or a horizontal punch collapses into a line, and keep every
limb at least 40 px inside the frame in every pose of a view (widen `dist`
rather than crowd it).
`SportsRig.shake(tl, stage, t)` on impact. Keep heads below the beat tag and feet
above the chyron. Start the fighters just out of jab range so a jab can visibly
fall short.

# Beats: a change on every clause

The fighters' idle bounce is not a change. While the voice speaks, something
visible changes on every clause, never more than 3 s apart, and it lands on the
word that names it. Pick the first row that fits the words:

| The words name | Show |
| --- | --- |
| A body part ("bends the knees", "turns at the waist", "the head") | `stage.mark(f, part)` on it, with the pose that moves it |
| A place or where weight goes ("outside the line", "the rear foot") | a floor note, and a ghost of where the fighter was |
| A punch or its line | the punch pose, its wedge or line, the burst on landing |
| A comparison or a mistake | two ghosts, or the replay of the same move done wrong |
| Nothing that moves | the next camera view, or a slow push in (`SportsRig.camera`, `dist` down about 5% over the clause) |

`stage.mark(f, part)` is a ring that follows the part through any camera: `head`,
`chest`, `waist`, `leadKnee`, `rearKnee`, `leadFoot`, `rearFoot`, `leadGlove`,
`rearGlove`, `leadElbow`, `rearElbow`. `stage.ghost(f, pose, { x })` is a pale copy of a pose, for "where
you were" or "where you should be". `SportsRig.show(tl, thing, t, hold)` fades a
mark, ghost, or floor note in at `t` and out after `hold` s (default 1.2). Keep
to one or two on screen, white unless it is the puncher's move.

The animation map only counts DOM tweens, so it cannot see the fighters: check
the gaps in the States table instead. A long timeline makes `hyperframes check`
warn above 300 lines; that is advisory, and the timeline stays in `index.html`
(the check needs `window.__timelines` there).

# Text system: a quiet broadcast lower third

- **Beat tag**, top-left at 176 px: only the chapter name ("The setup"), small
  muted Barlow Condensed caps, no box. It swaps per chapter.
- **Chyron**, the words: a dark bar 470 px from the bottom with a 12 px red tab,
  one sentence in Inter 800 at 54 px, sentence case, one line (two at most),
  the key word underlined in the corner color of whoever does it. The old line
  leaves as a view change starts; the new one lands as it settles.
- **Tags** on the action ("Miss", "Open", "Late"): small dark tags with a
  corner-color tab, Barlow Condensed caps, in clear space above the bodies, never
  under a limb or glove. A hit gets a thin red-and-white burst on the chin.
- **Intro**: the first frame is the bare lit backdrop (`#stage` at opacity 0), the
  same frame the video closes on. The title in Inter 800 sentence case fades in
  over it, leaves first, and then the fighters fade in and step about 60 units
  into their spots (`SportsRig.appear`), clear of the frame edges.
- Keep it quiet: no scorecards, round cells, or corner bars. Corner colors live
  on the gloves, trunks, and key-word underlines only.

When narrated, the chyron carries the caption phrase with the spoken word
underlined in red.

# Motion values

| Value | Setting |
| --- | --- |
| Eases | Text in `power3.out`, text out `power2.in`, pose `power3.inOut`, punch `power4.out`, recoil `back.out(1.6)`, camera `power2.inOut` |
| Durations | Text in 0.4 s sliding 30 px, text out 0.2 s, pose 0.35 s, load 0.2 s, punch 0.16 s, recoil 0.32 s, view change 0.55 s |
| Idle | Knees flex about 3° and back every 1.4 s (1.57 s for the second fighter); weight drifts a few units every 4.2 s |
| Camera | View change 0.55 s; chyron out at its start, in 0.35 s later; shake 4 steps of 0.05 s, 12–18 px; knockdown follow 1.4 s `power2.out` |
| Ragdoll | First 0.3 simulated s over 0.9 s (slow motion), the rest to 2.5 s over 1.5 s `power1.in` (inside `knockout`) |
| Notes | Wedges draw in 0.25–0.45 s; targets grow in 0.4 s; tags fade in 0.25 s; marks and ghosts fade in 0.35 s, out 0.25 s |
| Replay cut | Stage out 0.25 s, reset both fighters and the side view, stage in 0.3 s |

# Sound

Files are in `assets/sfx/` (credits in `CREDITS.md`). The arena is quiet;
sound marks contact and movement only.

| Event | File | Gain |
| --- | --- | --- |
| Title | `bell.ogg` | 0.35 |
| A punch lands | `punch.ogg` | 0.5 |
| A punch misses or a fast slip | `whoosh.ogg` | 0.4 |
| A step or pivot | `shuffle.ogg` | 0.4 |
| A tag or floor note appears | `tick.ogg` | 0.3 |
| View change or replay cut | `transition.ogg` | 0.3 |
| A fighter reaches the canvas (1.4 s after the knockdown starts) | `soft-impact.ogg` | 0.5 |

Music: a low, steady bundled track at about 0.4 gain in visual mode.

# Optional ending: knockouts

Not a default. Use it only when the prompt asks for a knockout ending, for
example "end with one take done right and one done wrong". The kit:

1. **Done right.** The technique lands and the rival drops: pose the landing,
   then `SportsRig.knockout(tl, stage, rival, t, { x, kind })`. Let the camera
   settle on the fallen fighter for about a second.
2. **Replay, done wrong.** Fade the stage out, reset with `SportsRig.stand` for
   both fighters and `tl.set(stage.cam, { ...SportsRig.VIEWS.side })`, fade in.
   Same exchange, but you stay in range, are late, or lean too far: his punch
   lands, a ghost shows where you needed to be, and `knockout(tl, stage, you, ...)`
   drops you. Swap the beat tag to the failure ("When it fails").

Each take runs about 4 s from the landing to the body on the canvas, and in
narrated mode one sentence covers each take. Either take can be used alone.
The closing below still applies after the last fall.

# Closing: a loop, not a card

The user's standing preference for this style: the video loops. There is no end
card, no payoff card, no closing phrase on screen, and no handle (`cta: null`),
even when the plan names a payoff line; the last spoken line is the ending.
Keep this unless the user asks for a card.

1. **Open on the bare backdrop.** At t = 0 `#stage` is at opacity 0 (no ring, no
   fighters), and the title fades in about 0.35 s later:
   `tl.fromTo("#stage", { opacity: 0 }, { opacity: 1, duration: 0.5 }, 0)`.
2. **Close by fading everything out together.** A second after the last fighter
   is down, one tween over 0.6 s takes every element to opacity 0: the stage
   (fighters, ring, notes, marks, ghosts), the chyron, the beat tag, tags, guide
   lines, and the burst:
   `tl.to([...], { opacity: 0, duration: 0.6, ease: EASE.out }, t)`.
3. **Hold the bare backdrop** about 0.5 s and end the composition there.

The last frame is then the first frame, so the loop has no cut. Check it:
snapshot at 0 and at the duration minus 0.05 s; the two frames must be
identical. The sample's last lines do exactly this.
