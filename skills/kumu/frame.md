# Frame

The frame is the floor every style stands on: what keeps a video postable on
TikTok, Reels, and Shorts, readable on a phone, and honest. It sets no look.
The selected style's `style.md` and its sample `index.html` decide the layout,
look, subjects, motion, words, opening, and closing. A section the style leaves
out comes from [styles/plain/style.md](styles/plain/style.md). When a style and
this file disagree, this file wins only on what it covers below.

## Safe area

At 1080×1920, keep text and the subject inside the style's `spacing`: `edge`
from every side and `platform_ui_bottom` clear of the platform's caption and
buttons. Small labels sit at least 250 px from the top and 84 px from the left,
clear of the platform's header. Nothing important comes within 40 px of the
frame edge in any pose or camera move. Scale these for square and landscape.

## Legibility

Check every essential label and result at roughly 360 px display width.
Essential text is at least 40 px at 1080 wide. If it cannot be read, revise
content or placement using the style's rules. Check contrast and repeated
items at their actual display size; source font size alone is not evidence.
Measure text after its font has loaded, not against a fallback font.

## Survives TikTok

Inspect loss of essential detail and gradient banding in a compressed draft.
Essential strokes must survive at phone size; 3 px at 1080 wide is a useful
minimum for explanatory marks. Adjust backgrounds and effects within the
style's rules. This is a compression check, not a rule selecting textures,
gradients, or effects. [render.md](render.md) sets export settings.

## Honest

- Every visible number is computed or cited, never invented for drama.
- Interfaces, command output, and results are captured or run, never made up.
  Mockup and terminal fields hold real or clearly sample data.
- A real object, drawn in any finish, keeps its true shape, proportions,
  layout, and colors. Its parts sit in their real arrangement and overlap
  only where they do in the object. A placeholder box standing in for a part
  is not a drawing.
- Photos show real things as they are; a crop never changes what they show.

## Seek-safe

Everything moves from the HyperFrames timeline, so every seek shows the right
frame: no clock, `requestAnimationFrame`, CSS `infinite`, or random at render
time. Set displayed values from precomputed, explicit timeline states, never
from an incrementing callback during playback. Whether a value steps or
animates between states is decided by the style; intermediate values must
not imply observations or measurements that did not occur.
Set the first frame's state (hidden parts, opening size, header size) with
`gsap.set` outside the timeline, sizing text inside `document.fonts.ready`: a
`tl.set` at time 0 is skipped on the very first frame, which then shows the
wrong state and becomes the fallback cover.
Use the runtime and kit permitted by the style and register them as core
requires. Precompute simulation states; seeking must not advance physics.

## Pace

Validate pacing against the style and the plan's timed actions and reading
holds. Inspect gaps of 3 s or more; they are review signals, not automatic
failures. Do not add activity to silence a detector. Background motion and
caption highlights do not establish that the explanation progresses.

## End

Verify that the style's final state can be understood before the video ends
and that the first frame remains valid on a loop.
