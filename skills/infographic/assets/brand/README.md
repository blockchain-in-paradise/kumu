# Brand assets

Everything that makes the video look like *your* channel lives in this folder.
Swap the files, keep the names, and `/infographic` picks them up.

```
brand/
  frame.md          styling: colors, type, spacing, ground, closing card
  ground.webp       background photo, used as a ~18% texture on every scene
  logo.svg          monochrome lockup (for light-on-dark use)
  logo-color.webp   full-color lockup
  icons/
    tiktok.svg      social marks for the closing card
    linkedin.svg    order follows `cta.platforms` in frame.md
    instagram.svg
```

## Making it yours

You have two options.

**Per project (recommended).** Copy this folder to `brand/` at the root of the
project you invoke `/infographic` from, then edit it there. A project-level
`brand/frame.md` wins over the bundled one, so the skill stays clean and each
project can look different.

```bash
cp -r ~/.claude/skills/infographic/assets/brand ./brand
```

**Globally.** Edit the files in place here. Every project then uses your brand
by default. Note that reinstalling or updating the skill may overwrite them.

Either way you can also point at a specific file per run:

```text
/infographic --topic "…" --frame path/to/frame.md
```

## What to change

1. **`frame.md` frontmatter:** `colors`, `typography`, `spacing`, `assets`,
   `cta`. The `assets` paths are relative to `frame.md` itself, so if you keep
   the filenames above you do not need to touch them.
2. **`frame.md` prose:** instructions for applying the brand. The
   ground stack and closing-card spec live here. Rewrite them for your look;
   delete the ground section entirely if you want a plain flat field.
3. **`ground.webp`:** it renders at ~18% opacity as texture,
   not as a picture, so pick something with broad tonal areas rather than fine
   detail or text.
4. **`icons/`:** one monochrome SVG per platform in `cta.platforms`, from
   the same icon family. The bundled frame uses Bootstrap Icons; name each
   file after its platform and follow the frame's color treatment.

## Contrast

Run `hyperframes check` for text contrast and layout, then inspect the actual
frames. Automated checks do not establish logo legibility or brand fidelity.
Prefer an allowed text color, reposition text, or add local backing when contrast fails; report
a conflict if the selected brand cannot meet the required readability.
