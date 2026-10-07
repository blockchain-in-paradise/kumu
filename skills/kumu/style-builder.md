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
- Subjects: drawn (flat, line, isometric, characters), real photo cut-outs,
  UI mock-ups, or diagrams; their outline, shadow, and corner treatment.
- Motion vocabulary: how things enter, move, and leave; easing; camera moves;
  signature devices (a cursor, a dotted path, a counter, a mascot reaction).
- Words: title treatment, caption or line style and position, emphasis.
- Pacing: seconds per change, intro and outro.
- Closing: how the reference ends.

With several references, keep what they share and note where they differ.
Never reuse a reference's footage, audio, logos, or characters.

## 2. Build three directions

Make three directions as standalone HyperFrames compositions,
`.build/directions/a/`, `b/`, and `c/`, each about 6–8 s at 1080×1920, with local fonts
and assets. All three show the same neutral demo, so the user compares style,
not content: a two-line title, a small diagram or subject that changes state
twice, one caption or line with its highlight, and the closing, if any.

- **A, faithful:** as close to the references as the tools allow.
- **B, identity:** A's look carrying an existing style's identity (colors,
  handle, closing card) when `--identity` names one; otherwise A with the
  palette pushed further toward its strongest color.
- **C, variation:** the same idea with a different motion intensity or layout.

Follow [frame.md](frame.md): flat 2D, legible at phone size, words in the words
zone. Lint each direction and fix errors.

## 3. Show the gallery

Render each direction to `.build/directions/<x>.mp4` and write
`.build/gallery.html`: the three clips side by side, autoplaying, looped, muted, each
labeled with its letter and a one-line description, plus a still of its most
characteristic frame. Open it in the browser (`xdg-open` or `open`), or give the
user its path.

Ask once and end the turn: "Save A, B, or C as style `<name>`? You can also mix,
for example C's colors with A's motion."

## 4. Save the style

Apply any requested mix, then copy the chosen direction to `styles/<name>/`:

- `index.html`: the direction, cleaned up as the style's working sample.
- `assets/`: its fonts and any textures or icons.
- `preview.mp4`: the direction's render.
- `thumbnail/index.html`: a static cover sample in the style (title and hero in
  the safe box x 60–960, y 240–1400), with `thumbnail/assets` linked to
  `../assets` (`ln -s ../assets thumbnail/assets`).
- `preview.png`: four frames side by side, in order: thumbnail, empty
  (background only), elements with a highlighted caption, and closing (or the
  final hold). The sample must keep its background alone for the first 0.4 s.
  Set `preview_at: [empty, elements, closing]` in `style.md`, then run
  [scripts/style-preview.sh](scripts/style-preview.sh) `styles/<name>`.
- `style.md`: frontmatter tokens in the same shape as the bundled styles
  (`colors`, `typography`, `preview_at`, `spacing`, and `cta` or
  `cta: null`), then short sections for Character, Look, Type and captions,
  Motion, Motion values, and Closing, written from `notes.md` and the chosen
  direction. Motion values is a table of eases by direction, duration bands,
  overshoot, and stagger (plus camera or cursor behavior when used), and the
  sample defines the same values as constants at the top of its script. Name
  the reference URLs as sources.

Report the style name and how to use it: `$kumu --style <name> --topic "..."`.
