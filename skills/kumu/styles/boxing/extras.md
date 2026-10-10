# Boxing extras

Read this only when the topic needs it: a named real fighter, a drunken or
unorthodox style, a body shot or the anatomy of a hit, or a knockout ending.
The core rules are in [style.md](style.md).

## Real fighters

Match skin tone, hair, facial hair, a signature tattoo or
print, and the trunks, top, and boot colors; no face, no likeness beyond that, no
logos. Recipes that worked:

| Fighter | Look | Movement |
| --- | --- | --- |
| A drunken-style showman (Emanuel Augustus) | `skin: deep`, `hair: "short"`, `beard`, `print: "leopard"`, black `waistband` | `loose` rest pose, one `wobble` from the first beat to the fade, `stagger` feints, opens in `showboat` |
| A peek-a-boo puncher (Mike Tyson) | `skin: brown`, `hair: "bald"`, `tattoo: "tribalEye"`, black trunks, socks and waistband, `stripe: false` | tight guard, `weave`/`weaveR` under punches, hooks and uppercuts from close range |
| A game-style underdog (Little Mac) | `skin: light`, short black hair, green trunks and gloves (`corner: "#2d8b45"`), `top: "#111111"` | quick, upright, straight punches |

## Drunken or unorthodox fighters

- A drunken or unorthodox fighter never stands still: run one `SportsRig.wobble(tl, f, from, to, amp)` (amp 12
  to 16) from his first beat to the fade, rest him in `loose`, and drop a `stagger` feint between exchanges.
  Set his punches: tween `f.state.wobbleMix` to 0 over the load (0.2 s) and back to 1 after the recoil, or the
  sway twists the punch into a flail.

## Anatomy and body shots

For a "why it works" topic (a liver shot, a body shot, what a punch does), the
rig shows the inside of a fighter. Use it for one or two moments, not as
wallpaper. 

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

## Knockout ending

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
