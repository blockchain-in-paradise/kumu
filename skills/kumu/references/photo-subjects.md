# Photo subjects

For styles that use real photos or clips (not drawn characters).

## Sourcing

When the style or concept uses real photos, look first for images that are
already transparent (PNG with an alpha channel) or supplied by the user, since
automatic cutouts of busy photos leave debris; otherwise find photos and short
clips with clear free-use licenses: Pexels, Unsplash, and Pixabay for general subjects, and Wikimedia
Commons for specific models, places, and products (check each file's license
and credit line). If `PEXELS_API_KEY` is set, search Pexels photos and videos
through its API. Prefer clips under 10 seconds with one clear subject on a
simple background, which cut out cleanly.

## Cutouts

download the licensed source into `.work/` and cut it
out. For people, and for any clip (transparent video), use
`hyperframes remove-background <file> -o assets/<name>.png` or `.webm`. For
objects and animals on a plain background, rembg's `isnet-general-use` model
in `$HOME/.kumu/venv/bin/python` works better (keep the largest shape, crop,
save as WebP). Check the edges at full size; if anything from the background
remains, show the photo in a frame or panel instead of a rough cutout.
