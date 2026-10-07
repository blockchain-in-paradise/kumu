# Reference videos

`--ref <url>` points at a video whose structure the user likes. Learn from it;
do not reproduce it.

Download and sample it inside the run, using the `yt-dlp` that
[scripts/setup.sh](../scripts/setup.sh) installs:

```bash
mkdir -p composition/.work/ref && cd composition/.work/ref
"$HOME/.kumu/venv/bin/yt-dlp" -q -o "ref1.%(ext)s" "<url>"
d=$(ffprobe -v error -show_entries format=duration -of csv=p=0 ref1.mp4)
ffmpeg -v error -i ref1.mp4 -vf "fps=12/$d,scale=270:-1,tile=6x2" -frames:v 1 ref1-sheet.jpg
```

If the download fails, ask the user for a screen recording or screenshots
instead. Look at the contact sheet and, when useful, a few full-size frames.
Write a short **Reference notes** section in `video-plan.md`:

- Format: which shape from [concept.md](../concept.md) it uses, or what new one.
- Stage and anchor: what persists and what the viewer tracks.
- Layout: zones, title treatment, where words sit.
- Look: background, palette roles, illustration or photo treatment.
- Pacing: duration, number of states, seconds per state.
- Devices worth borrowing: a counter, a mascot, themed example data, a code
  highlight, a side-by-side comparison.

Use these notes when writing concepts. Do not copy the reference's characters,
assets, branding, jokes, wording, or audio, unless the user explicitly asks to
replicate the reference: then match its topic, characters, layout, and style as
closely as the tools allow, rebuilt from scratch. Match its layout, but pace it
so each change can be followed on first watch. Either way, keep the downloaded
file in `.work/` only; never place its footage or audio in the composition or
delivery.
