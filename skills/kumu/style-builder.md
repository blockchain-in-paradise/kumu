# Style builder

`$kumu style --ref <url> [--ref <url>...] --name <name> [--identity <style>]`
turns one or more reference videos into a saved, reusable style. The user picks
the look by watching it, not by describing it.

Work in `styles/<name>/.build/` inside the project (never in `video-output/`),
and delete `.build/` once the style is saved. Save the chosen style to the
project's `styles/<name>/`; a style meant to ship with Kumu goes in the skill's
bundled [styles/](styles/) instead. Stop at one checkpoint, after the gallery.

## 1. Study the references

For each reference, follow [references/ref-video.md](references/ref-video.md)
to download it and build a contact sheet, then look at a few full-size frames.
Write `.build/notes.md`:

- Background: color, gradient, texture, scene, or photo.
- Palette: canvas, ink, one accent, highlight, and supporting colors, as hex.
- Type: family or closest free match, weights, sizes, case, tracking.
- Subjects: drawn (flat, line, isometric, characters, 3D mannequins), real
  photo cut-outs, UI mock-ups, or diagrams; their outline, shadow, and corners.
- Characters: proportions, how limbs and joints are drawn, the poses that
  recur, and any idle motion.
- Motion vocabulary: how things enter, move, and leave; easing; camera moves
  and how the camera travels between views; signature devices (a cursor, a
  dotted path, a counter, a mascot reaction).
- Words: title treatment, caption or line style and position, emphasis.
- Pacing: seconds per change, intro and outro.
- Closing: how the reference ends.

With several references, keep what they share and note where they differ.
Never reuse a reference's footage, audio, logos, or characters.

## 2. Choose the kit

A kit is the reusable code behind the style's subjects, so a run never redraws
them. Pick the cheapest that carries the look:

- **None.** Flat shapes, text, diagrams, photos: plain HTML, SVG, and CSS.
- **An existing kit.** Another bundled style's kit, when the subject fits it:
  the boxing kit (`styles/boxing/assets/characters/`, `SportsRig`) draws any
  humanoid in flat-shaded 3D with poses, a camera, floor notes, and a ragdoll.
  A new sport or fighter style is new looks, poses, and sounds on that kit, not
  a new rig.
- **A new kit.** Only when no kit fits and the style will be reused. Build it
  to this contract, which is what makes boxing reliable:
  - **Seek-safe.** Everything is driven by the HyperFrames timeline. No clock,
    no `requestAnimationFrame`, no random at render time. WebGL is allowed;
    seeking any time must show the right frame.
  - **Data, not drawings.** Figures are rigs (SVG groups per part with named
    pivots, or a 3D skeleton). Poses are named joint angles in a `poses.js`.
    Looks (colors, outfit, hair) are a small object.
  - **Helpers hold the motion rules.** A punch, step, or hit is one call that
    loads, snaps, recoils, and settles, so a run cannot write a robotic move.
  - **Measurable.** The kit exposes its stages (for example
    `window.__<kit>Stages`) so an audit script can seek the timeline and check
    joints, as `scripts/motion-audit.mjs` does for boxing. Add the checks the
    new kit needs.
  - **Survives TikTok.** Outlines at least 3 px at 1080 wide, no noise or
    grain, no vignette ([frame.md](frame.md)).

## 3. Build three directions

Make three directions as standalone HyperFrames compositions,
`.build/directions/a/`, `b/`, and `c/`, each about 6–8 s at 1080×1920, with local fonts
and assets. All three show the same neutral demo, so the user compares style,
not content: a two-line title, a small diagram or subject that changes state
twice, one caption or line with its highlight, and the closing, if any. When
the references use characters, the subject is the style's character changing
pose twice; when they use camera moves, the demo includes one view change.

- **A, faithful:** as close to the references as the tools allow.
- **B, identity:** A's look carrying an existing style's identity (colors,
  handle, closing card) when `--identity` names one; otherwise A with the
  palette pushed further toward its strongest color.
- **C, variation:** the same idea with a different motion intensity or layout.

Follow [frame.md](frame.md). Then review each direction yourself, as
[review.md](review.md) describes: check, draft render, video audit, and the
kit's motion audit if it has one. Fix every error before showing anything, so
the user compares looks, not bugs.

## 4. Show the gallery

Render each direction at `--quality draft --fps 30` to
`.build/directions/<x>.mp4` and write `.build/gallery.html`: the three clips
side by side, autoplaying, looped, muted, each labeled with its letter and a
one-line description, plus a still of its most characteristic frame. Open it in
the browser (`xdg-open` or `open`), or give the user its path.

Ask once and end the turn: "Save A, B, or C as style `<name>`? You can also mix,
for example C's colors with A's motion."

## 5. Save the style

Apply any requested mix, then copy the chosen direction to `styles/<name>/`:

- `index.html`: the direction, cleaned up as the style's working sample. Keep
  its helpers separate from its sample words so a run replaces the words and
  keeps the structure.
- `assets/`: its fonts and any textures or icons, and `assets/sfx/` with the
  style's sound effects. Choose sounds that fit the look from the shared Kenney
  set or from CC0, public-domain, or CC BY sources; avoid ShareAlike and
  unknown licenses. Trim each to its moment, fade the ends, normalize to about
  -18 LUFS, and list source, author, and license in `assets/sfx/CREDITS.md`.
- `assets/characters/` (or the kit's folder) when the style uses characters or
  3D: the kit from step 2, with the sample loading it, blending between at
  least two poses, and showing any idle loop. Camera moves go through the kit
  or one camera layer with a single anchor object that stays across views.
- `thumbnail/index.html`: a static cover sample in the style (title and hero in
  the safe box x 60–960, y 240–1400), with `thumbnail/assets` linked to
  `../assets` (`ln -s ../assets thumbnail/assets`).
- `preview.png`: four frames side by side (thumbnail, empty, elements with a
  highlighted caption, closing). The sample keeps its background alone for the
  first 0.4 s. Set `preview_at: [empty, elements, closing]` in `style.md`, then
  run [scripts/style-preview.sh](scripts/style-preview.sh) `styles/<name>`.
- `style.md`: frontmatter tokens in the same shape as the bundled styles
  (`colors`, `typography`, `preview_at`, `spacing`, `cta` or `cta: null`,
  `opening`, `closing`, an optional `voice` Kokoro ID and `voice_speed`), plus
  the settings that keep runs cheap:
  - `form`: set when the style always teaches one form (`"technique"`), so
    concepts vary the angle instead of the form.
  - `visuals: drawn` when nothing is sourced, so research skips photos and screens.
  - `skills`: the HyperFrames skills a run needs (usually
    `[hyperframes-core, hyperframes-cli]`), and no others.

  Then short sections for Character, Look, Type and captions, Motion, Motion
  values, Sound (events, files, gains, music), and Closing, written from
  `notes.md` and the chosen direction. Look says how drawn objects are finished
  (realistic, minimal flat, or cartoon). Motion values is a table of eases by
  direction, duration bands, overshoot, and stagger, and the sample defines the
  same values as constants at the top of its script. Put topic-specific recipes
  (a named subject, an optional ending) in an `extras.md` the style points to,
  so a run reads them only when needed. Name the reference URLs as sources.

Report the style name and how to use it: `$kumu --style <name> --topic "..."`.
