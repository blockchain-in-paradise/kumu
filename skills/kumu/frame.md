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

Check text at roughly 360 px display width. Essential text is at least 40 px;
shorten it rather than shrinking it. Show about 20 or fewer repeated, readable
items per screen; reduce or group the data instead. Text never sits on busy
detail or a full-opacity photo without a backing, outline, or shadow that
keeps it readable. Size text after its font has loaded (a function value on
the timeline), never when the script starts, or it sizes against the fallback
font.

## Survives TikTok

TikTok re-encodes every upload at a low bitrate, and thin or noisy detail is
what it loses first. Draw outlines and strokes at least 3 px at 1080 wide. Add
no film grain, noise, or animated texture, and no vignette. Keep large
near-black gradients few and soft, since they band. [render.md](render.md) sets
the render settings.

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
time. Set displayed values with `tl.set`, never by counting during playback.
Set the first frame's state (hidden parts, opening size, header size) with
`gsap.set` outside the timeline, sizing text inside `document.fonts.ready`: a
`tl.set` at time 0 is skipped on the very first frame, which then shows the
wrong state and becomes the fallback cover.
Use SVG, HTML, and CSS, plus a WebGL kit only when the style ships one.

## Pace

While the voice speaks, something visible changes on every clause, never more
than 3 s apart. An idle loop is not a change.

## End

The video ends on something readable, held long enough to read, so the frame a
looping viewer lands on makes sense.
