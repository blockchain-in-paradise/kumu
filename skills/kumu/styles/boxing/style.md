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
preview_at: [0.2, 3.6, 72.5] # the fight on screen from frame 0, the slip counter landing over your shoulder, the closing title card
spacing:
  edge: "60px"
  platform_ui_bottom: "420px"
  caption_bottom: "470px"
cta: null
opening: "cold" # no intro: the fight is on screen from frame 0 and the narration starts at once (see Opening)
closing: "card" # every element fades out, then the title card holds with the bell (see Closing)
---

# Character

Fight night: two fighters in a canvas ring under one spotlight act out one
technique, beat by beat, while a quiet broadcast lower third carries the words
and the camera moves to the view that explains it. Suits technique breakdowns,
footwork, tactics, and why a fighter wins. `index.html` is the working sample
(the slip counter: the hook, the setup, the slip in stages, its base, the
counter, a slow replay, its limits, then a knockout done right and one done
wrong); `thumbnail/index.html` is the cover (the slip seen from behind the
opponent: his jab goes into a pale ghost of where you stood, a dashed arrow
shows the slip, and the title sits above). Every boxing video opens cold, mid-fight, and closes
on a title card (see Opening and Closing).

# Look

- **Arena**: warm off-black, one overhead spotlight (a soft cone and a pool of
  light). The canvas is drawn in 3D so it turns with the camera, with a faint
  weave and rope shadows, and fades into the dark with no edge. No vignette (the spotlight
  cone stays), and no film grain or other moving noise, which makes TikTok's
  re-encode look soft.
- **Fighters**: solid 3D mannequins, flat-shaded: each part one tone plus one
  shadow tone away from the spot, a thin light outline on the outer silhouette
  only. A round head with ears and a hair cap set high (so the back of a head
  still reads), no face; ball-jointed shoulders, a tapered torso, capsule limbs;
  one-piece trunks (a flared waist with a waistband, two trunk legs) with a side
  stripe; boots, socks, white wrist wraps, cuffed gloves with a thumb. Red corner
  ("you") against blue corner, both at full opacity.
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

A look is `{ skin, hair, hairColor, trunks, corner, boots, socks, top }` plus
optional extras. `skin` from `SportsRig.SKIN` (porcelain, light, tan, olive,
brown, deep, ebony); `hair` one of `short`, `buzz`, `bun`, `bald`, `locs`,
`braids`; `corner` `"red"`, `"blue"`, or any color (gloves, waistband, side
stripe); `top` a tank top color or `null`. Extras:

- `beard`: a color; a goatee with a mouth opening, painted on the head.
- `tattoo: "name"`: a head decal from `assets/characters/tattoos.js` around the
  lead eye (load `tattoos.js` after `poses.js`; `tribalEye` is the arch and
  swirls). To add one, trace a reference image into polygon outlines in the same
  format. Body tattoos are not supported.
- `print: "leopard"` (alias `"cheetah"`): a patterned fabric wrapped around the
  trunks as a texture, in place of the `trunks` color and the side stripe.
- `waistband`: a color for the waistband instead of the corner color.
- `stripe: false`: no side stripe on the trunks.

**Sides.** The fighters stand orthodox: `F` (lead) is the fighter's left side, `B`
(rear) his right, so the lead jab is the left hand and the rear straight the
right. Name hands by anatomy in the words and map them this way: the liver is on
his right (the `B` side), and a liver shot is a lead left hook. For a southpaw,
swap them in the words; the rig has no southpaw stance.

`SportsRig.LOOKS`: `red` and `blue` (the sample pair), `veteran`, `prospect`
(tank top), `slugger`, `stylist` (tank top), `porcelain`. Spread a preset and
override: `{ ...SportsRig.LOOKS.blue, top: "#111111" }`.

**Real fighters.** Match skin tone, hair, facial hair, a signature tattoo or
print, and the trunks, top, and boot colors; no face, no likeness beyond that, no
logos. Recipes that worked:

| Fighter | Look | Movement |
| --- | --- | --- |
| A drunken-style showman (Emanuel Augustus) | `skin: deep`, `hair: "short"`, `beard`, `print: "leopard"`, black `waistband` | `loose` rest pose, one `wobble` from the first beat to the fade, `stagger` feints, opens in `showboat` |
| A peek-a-boo puncher (Mike Tyson) | `skin: brown`, `hair: "bald"`, `tattoo: "tribalEye"`, black trunks, socks and waistband, `stripe: false` | tight guard, `weave`/`weaveR` under punches, hooks and uppercuts from close range |
| A game-style underdog (Little Mac) | `skin: light`, short black hair, green trunks and gloves (`corner: "#2d8b45"`), `top: "#111111"` | quick, upright, straight punches |

# Motion and poses

## Fight design

The helpers below make each punch look right; these rules make the fight look
like a fight. Plan each exchange in the States table before writing it.

- **Both fighters fight.** When the hero defends, the opponent is throwing at
  him: a slip, weave, or block always has a punch to beat. In a fight passage
  someone throws at least every 3 s; nobody stands as a target.
- **An exchange has four parts:** a setup (a jab, a feint), the action (the
  punch or the defense the words name), the answer (a counter, or the punch
  landing), and a reset (both step back out to range).
- **Throw combinations, not single punches:** two or three punches about 0.5 s
  apart with `SportsRig.combo`, such as jab-jab-straight, jab-straight-hook,
  straight-hook, or a jab then a body hook. Match them to the words; a punch
  the words name is thrown as that punch.
- **Defense is timed to the punch.** The head starts moving 0.15 to 0.2 s
  before the punch snaps, is all the way out when it arrives, and only crosses
  back (low, through a `bob`) once that arm has come back; crossing under an arm
  still out drags it through his head. Weaving past a combination alternates
  `weave` and `weaveR` (each with a `bob` first), punches about 0.8 s apart,
  from about 320 apart: a weave ducks forward, so at jab range (270) his head
  meets the punches. The weave poses carry their own sidestep; never add a `z`
  tween on top, or he slides. A punch that should land aims at his real head
  and stops on the face (the rig stops it along its own line). A punch caught on the
  guard gets `block` on contact (0.1 s, `power4.out`), then `guard` over 0.3 s;
  without it a blocked punch reads as a clean hit he ignores. A punch that lands
  gets `hit` (or `weaveHit`) and a step back.
- **Distance:**

  | Apart (`x`) | For |
  | --- | --- |
  | 330 or more | resting, feints, talking beats |
  | about 270 | straight punches (jab, straight) |
  | about 185 | hooks, uppercuts, body shots |
  | 190 to 250 | only while a punch is out; two guards held there tangle |

  Reset to 270 to 330 after every exchange. The motion audit fails a hold at
  190 to 250 (`crowded`).
- **Vary it.** Weaves alternate sides, no punch more than twice in a row, head
  and body both get hit, and the fighter who lands changes at least once.
- **The camera shows the contact.** Use a side or three-quarter view where the
  gap between them is visible; a view from behind one fighter hides his
  opponent's punches. Overhead is for footwork and angles, not punches.

## Choreography: use the helpers

Every punch, step, and miss goes through a helper, so the motion rules hold
without thinking about them. Raw pose tweens are for holds, dodges, and slow
motion only.

- `SportsRig.punch(tl, f, name, t, { load, snap, hold, rest, recover, back })`:
  the punch snaps out at `t`. It coils into its load pose first (0.22 s before),
  snaps in 0.16 s, holds 0.2 s, and recoils into `rest` (`guard`) with an
  overshoot. Returns when it lands. `name`: `jab`, `straight`, `slipCounter`,
  `hook`, `rearHook`, `uppercut`, `leadUppercut`, `overhand`.
- `SportsRig.combo(tl, f, ["jab", "jab", "straight"], t, { gap })`: a
  combination, `gap` (0.5) s apart, each punch loading as the last comes back.
  Returns the landing times. Bent punches in it need hook range (185).
- `SportsRig.step(tl, f, x, t, dur)`: a step to `x`; its length sets its time
  (0.3 s plus 1 s per 150 units) unless `dur` is given. Returns when he arrives.
- `SportsRig.dodge(tl, attacker, defender, name, t, { lean, rest, x, stance })`:
  a punch that misses. It aims at where the defender stood, he moves into `lean`
  (`slip`) as it snaps and eases back to `rest` half a second later.
- `SportsRig.exchange(tl, attacker, defender, name, t, { gap, back })`: the
  attacker steps to punching range (`SportsRig.RANGE`: about 270 apart for
  straight punches, 185 for bent ones) so he arrives as it loads, then throws.

The rules they keep, for anything you write by hand:

- **Every punch loads, snaps, and recoils.** Never pose a punch straight out of
  a slip or a lean: it reads as instant and robotic.
- **After a punch lands at close range, recoil and step back to range** within
  about 0.4 s (`back` on `punch` or `exchange`). Two guards held inside each
  other clip through each other.
- **No skids.** A step over 40 units takes at least 0.5 s with
  `power2.inOut`; a lean back is a weight shift (a smaller arch, about half a
  second), not a slide.
- **One move at a time per fighter.** A pose that starts while his previous
  pose is still running stops his limbs dead mid-motion and reads as a twitch.
  The rig trims the earlier move to finish as the next begins (on the first
  render), and `punch` loads a combination straight out of the last punch, so
  write moves at the times the words want; the motion audit still flags any it
  could not fix. A lunge into a punch eases in
  and out (`power2.inOut`), not out only, or it stops with a jolt.
- **A pose change finishes before a camera move starts.** Settle the fighter
  (out of a showboat, into the guard) and then swing the view.
- **A drunken fighter is never still**: `wobble` from the first beat to the
  fade, `wobbleMix` to 0 over each punch's load and back to 1 after it.
- Gloves are solid against the opponent's head, chest, and gloves: a punch into
  a guard stops on the glove. Check the whole timeline with
  `scripts/motion-audit.mjs` (see [review.md](../../review.md)); the sample
  passes with no errors.

## Anatomy and body shots

For a "why it works" topic (a liver shot, a body shot, what a punch does), the
rig shows the inside of a fighter. Use it for one or two moments, not as
wallpaper. `video-output/xray-organ/` is a worked example.

- `SportsRig.xray(tl, f, t, dur, to)`: his skin and clothes fade to a pale,
  see-through shell (`to: 1`) over a skeleton built on his own joints (skull,
  spine, ribs, sternum, clavicles, pelvis, limb bones) and his organs (lungs,
  heart, stomach, liver); `to: 0` fades back.
- `SportsRig.organHit(tl, f, t, dur)`: inside an x-ray, his liver flashes hot
  red, two ripples spread from it, and it settles bruised. Fire it on the
  landing.
- `liverHook` (after `liverLoad`, which `punch` adds): a lead left hook that
  dips the level and digs into the opponent's liver (his right side, under the
  ribs). Throw it with `exchange` from about 185 apart.
- `SportsRig.knockout(tl, stage, loser, t, { kind: "liver", x })`: he stays up
  a beat, clutches his right side with his right hand, is knocked half a step back, then folds onto his
  knees and curls over (not the backward fall of a head shot).
- `stage.mark(f, "liver")` and `"ribs"` ring those spots.
- `SportsRig.orbit(tl, stage, t, dur, degrees)`: a bullet-time sweep around the
  action (hold the fighters still meanwhile); `SportsRig.push(tl, stage, t, dur,
  0.8)`: a slow push in. Slow motion is longer pose and punch durations.

The liver-shot recipe: x-ray the target with the liver ringed while the
camera orbits him; a jab up top pulls his guard high; `exchange` the
`liverHook` with `back` so the attacker steps out; on the landing `xray`
(0.15 s), `organHit`, `shake`, `push`, a short `orbit`; x-ray off; then the
liver knockdown.

## Poses

- `SportsRig.pose(tl, f, name, t, dur, ease)` blends to a pose: `guard`, `jab`,
  `load`, `straight`, `lean`, `slip` (and its stages `slipBend`, `slipTurn`), `slipInside`,
  `slipCounter`, `bob`, `weave`, `weaveR`, `weaveHit`, `hit`, `block`, `step`,
  and the bent punches, each after its load pose: `hookLoad` > `hook` (lead hook),
  `rearHookLoad` > `rearHook`, `upLoad` > `uppercut` (rear), `leadUpLoad` >
  `leadUppercut`, `overLoad` > `overhand` (rear), and the drunken style: `loose`, `stagger` (and `staggerR` to the other side), `drunkSlip`/`drunkSlipR` (a low, lurching dodge under a punch), `showboat`. `weave`/`weaveR` are the tight, textbook dodge (peek-a-boo); don't use them for a drunken fighter.
  Tween `f.state.x` or `z` to step.
- A drunken or unorthodox fighter never stands still: run one `SportsRig.wobble(tl, f, from, to, amp)` (amp 12
  to 16) from his first beat to the fade, rest him in `loose`, and drop a `stagger` feint between exchanges.
  Set his punches: tween `f.state.wobbleMix` to 0 over the load (0.2 s) and back to 1 after the recoil, or the
  sway twists the punch into a flail.
- A look's `beard` (a color) draws a goatee with a mouth opening.
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
- The bodies are solid 3D mannequins (ball-jointed shoulders, tapered torso,
  capsule limbs, one-piece trunks) drawn with WebGL2 and a depth buffer, inside
  the stage SVG between its layers: every part hides exactly what is behind it
  at any angle, with one lit and one shadow tone and an outline around the
  silhouette only. Hair, beard and tattoo are a texture on the head; a trunks
  `print` is a texture wrapped around the shorts. To add a body part, add it in
  `build` (a `capsule`, `sphere` or `rings`), never as SVG over the bodies.
- Other poses: copy the closest and change a few joints (`armF`, `foreF`, `legB`,
  ... swing in the body's plane, 0 hangs down, negative forward; `abd` lifts out;
  `hipYaw`/`chestYaw` turn; `torso` leans; `roll` bends; `head` tilts). A pose's
  `z` is a sidestep that stays until something sets `z` again. Never draw new
  figures for a run.

# Views

`SportsRig.view(tl, stage, name, t, extra)` is one continuous 0.55 s
`power2.inOut` move (yaw, pitch, roll, dolly together), then the camera holds.
`side` for range and timing (frame it `{ tx: -40, dist: 3050 }` when they start a
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
visible changes on every clause, never more than 3 s apart: a fighter's move, a
step, a punch, or a camera move all count, so a highlight is never needed just to
fill time. Highlight only what the words name, on the word, and keep it quiet:

| The words name | Show |
| --- | --- |
| A body part ("bends the knees", "turns at the waist", "the head", "shoulders") | a small ring on that joint (`stage.mark`), with the pose that moves it; both joints for a pair |
| A place or where weight goes ("outside the line", "the rear foot") | one floor note |
| "Where he was" (a slip, a step away) | a ghost at his old spot, gone as soon as he moves again |
| A punch's path ("the punch line", "the jab travels") | the dashed line, only while that punch is out or about to be |
| A punch landing | the burst, the head snap, the shake, the punch sound |
| Nothing that moves | the fighters' own motion, the next camera view, or a slow push in |

Rules that keep it from getting busy:

- One highlight at a time: a ring is gone before the next part is named.
- Never ring gloves or hands, even when the words name one ("the other hand"):
  the punch or the move that uses it shows it.
- No ring on the head when the words say he is watching: show what he watches.
- No dashed circles, no pulsing floor line, no ghost that is not "where he was".
- A whole-body or torso ring only when the words name the body or chest.

`stage.mark(f, part)` is a ring that follows the part through any camera: `head`,
`chest`, `waist`, `leadShoulder`, `rearShoulder`, `leadElbow`, `rearElbow`,
`leadGlove`, `rearGlove`, `leadKnee`, `rearKnee`, `leadFoot`, `rearFoot`,
`liver`, `ribs`. Size it to the joint (about 34 for a shoulder or elbow, 44 for a
knee or foot, 54 for the head). `stage.ghost(f, pose, { x })` is a pale copy of a
pose. `SportsRig.show(tl, thing, t, hold)` fades a mark, ghost, or floor note in at
`t` and out after `hold` s (default 1.2); keep `hold` short enough that it is
gone before the next one. White unless it is the puncher's move.

The animation map only counts DOM tweens, so it cannot see the fighters: check
the gaps in the States table instead. A long timeline makes `hyperframes check`
warn above 300 lines; that is advisory, and the timeline stays in `index.html`
(the check needs `window.__timelines` there).

# Text system: a quiet broadcast lower third

- **Beat tag**, top-left at 84 px in, 250 px down (clear of TikTok's top-left UI): only the chapter name ("The setup"), 36 px
  muted Barlow Condensed caps, no box. It swaps per chapter.
- **Chyron**, the words: a dark bar 470 px from the bottom with a 12 px red tab,
  one sentence in Inter 800 at 54 px, sentence case, one line (two at most),
  the key word underlined in the corner color of whoever does it. The old line
  leaves as a view change starts; the new one lands as it settles.
- **Tags** on the action ("Miss", "Open", "Late"): small dark tags with a
  corner-color tab, Barlow Condensed caps, in clear space above the bodies, never
  under a limb or glove. A hit gets a thin red-and-white burst on the chin.
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
sound marks contact and movement only. The files are mastered loud,
so keep these gains: every SFX peak sits at least 8 dB under the voice peaks.

| Event | File | Gain |
| --- | --- | --- |
| The closing title card | `bell.ogg` | 0.25 |
| A punch lands | `punch.ogg` | 0.25 |
| A punch misses or a fast slip | `whoosh.ogg` | 0.15 |
| A step or pivot | `shuffle.ogg` | 0.15 |
| A tag or floor note appears | `tick.ogg` | 0.12 |
| View change or replay cut | `transition.ogg` | 0.12 |
| A fighter reaches the canvas (1.4 s after the knockdown starts) | `soft-impact.ogg` | 0.25 |

No music, in any mode: the voice and these sounds only.

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

# Opening: cold, mid-fight

No intro and no title up front. At t = 0 the fighters are already in their spots
under the light, in their rest poses, with the beat tag up, and the narration
starts at once (about 0.3 s in); the chyron fades in with the first word. The
first beat is action: the first punch, slip, or pose lands within the first two
seconds. The title appears only on the closing card.

# Closing: the title card

Every boxing video ends on a title card. There is no payoff card and no handle
(`cta: null`); the last spoken line is the last line.

1. **Clear the fight.** About 0.3 s after the last fighter is down (or the last
   exchange settles), one tween over 0.6 s takes every element to opacity 0: the
   stage (fighters, ring, notes, marks, ghosts), the chyron, the beat tag, tags,
   guide lines, and the burst:
   `tl.to([...], { opacity: 0, duration: 0.6, ease: EASE.out }, t)`.
2. **The card.** 0.7 s later the title (Inter 800, 118 px, centered on the bare
   lit backdrop) rises 24 px and fades in over 0.5 s with `power3.out`; the bell
   rings with it.
3. **Hold it** about 2.5 s and end the composition there.

The sample's last lines do exactly this.
