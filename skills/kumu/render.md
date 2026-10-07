# Render

Use `video-plan.md` as the storyboard, `SCRIPT.md` as the narration source when
narrated, and the selected style's `style.md` and sample `index.html` with
[frame.md](frame.md) as the styling record. Start the composition from the
style's sample: its background, type, caption, and closing code, and the
motion-value constants at the top of its script instead of new durations and
eases. Resolve skill assets relative to this skill directory. Prefix every
HyperFrames command with `HYPERFRAMES_PYTHON="$HOME/.kumu/venv/bin/python"`.
Use the installed CLI's `--help` for version-dependent flags.

## Output layout

Inside `composition/`: `assets/` for final media,
`components/` for registry components, `scenes/` for sub-compositions when
needed, `frames/` for review frames, and `.work/` for raw audio, transcripts,
model scratch output, and review images. Create only directories you use.

Before installing registry items, set `paths.components` to `components` and
`paths.blocks` to `scenes` in `hyperframes.json`. Commands below run from
`composition/` unless stated otherwise.

## Building the stage

Read `hyperframes-core` before writing HTML and `hyperframes-animation` for
motion. Consult `hyperframes-registry` before hand-building a named visual
such as a code window, terminal, chart, or map.

Build the stage, title, words zone, and closing card first. Inspect one state
at phone size with active captions or lines before building the rest.

When the concept has a model, compute states from it at load time, then place
one tween per state at its planned time. Set displayed values with `tl.set`, so they are correct at
any seek, forward or backward. Never count, simulate, or read the clock during
playback. This pattern is verified with HyperFrames 0.8:

```html
<script>
  // Model: run the real algorithm once and record every state.
  const values = [5, 2, 4, 1, 3];
  const steps = [];
  const v = values.slice();
  for (let i = 0; i < v.length - 1; i++)
    for (let j = 0; j < v.length - 1 - i; j++)
      if (v[j] > v[j + 1]) { [v[j], v[j + 1]] = [v[j + 1], v[j]]; steps.push(v.slice()); }

  // Stage: one element per value, positioned by its index in each state.
  const x = (i) => 90 + i * 190;
  const els = new Map(values.map((n) => {
    const el = document.createElement("div");
    el.className = "item"; el.textContent = n;
    document.getElementById("stage").appendChild(el);
    return [n, el];
  }));

  // Timeline: one tween per state at its planned time; values are set, not counted.
  const tl = gsap.timeline({ paused: true });
  values.forEach((n, i) => tl.set(els.get(n), { x: x(i) }, 0));
  steps.forEach((state, k) => {
    const t = 1 + k * 1.2; // replace with the measured start from the plan
    state.forEach((n, i) => tl.to(els.get(n), { x: x(i), duration: 0.5, ease: "power2.inOut" }, t));
    tl.set("#score", { textContent: `Swaps ${k + 1}` }, t + 0.5);
  });
  window.__timelines.main = tl;
</script>
```

The same shape covers a queue simulation, a timeline of sourced dates, or a
list of items: compute the states, then map them to times. When the model is
too large to run in the page, run it once in `.work/`, save its states as JSON,
and embed that JSON in the composition.

Build each state with actual content; blank bars and placeholder text stay
placeholders even when animated. Use consistent scales and labeled units.

Photo or clip subjects: download the licensed source into `.work/` and cut it
out. For people, and for any clip (transparent video), use
`hyperframes remove-background <file> -o assets/<name>.png` or `.webm`. For
objects and animals on a plain background, rembg's `isnet-general-use` model
in `$HOME/.kumu/venv/bin/python` works better (keep the largest shape, crop,
save as WebP). Check the edges at full size; if anything from the background
remains, show the photo in a frame or panel instead of a rough cutout.

## Narration and timing (narrated mode)

Verify Kokoro by generating the first state group with `hyperframes tts` and
probing its duration. Generate one WAV per `SCRIPT.md` heading under
`.work/vo/` from the spoken text only: no headings, fact IDs, or notes. Before
generating, replace each word in the plan's Pronunciation table with its
respelling in the TTS input only, then listen to those words in the output. Measure
loudness before timing:

```bash
ffmpeg -hide_banner -i .work/vo/scene-01.wav -af loudnorm=I=-16:TP=-1.5:LRA=11:print_format=json -f null -
```

If it is off target, normalize once into the final path; otherwise copy it unchanged:

```bash
ffmpeg -i .work/vo/scene-01.wav -af loudnorm=I=-16:TP=-1.5:LRA=11 -ar 48000 -c:a pcm_s16le assets/vo/scene-01.wav
```

Never normalize a normalized file again; regenerate silent or invalid output.
Measure each final file with `ffprobe` and let measured speech set the
timeline. If the total exceeds 90 seconds or the requested duration, trim
repetition in `SCRIPT.md` and regenerate only changed lines. Never speed up
speech to fit. Record measured starts in the plan's States table.

## Captions (narrated mode)

Transcribe the final WAVs with `media-use` using an explicit model (`small.en`
for English voices). Save each flat word array to `assets/vo/scene-01.words.json`
as `[{"text":"Hello","start":0.1,"end":0.4}]`. Check words against `SCRIPT.md`,
especially names, numbers, contractions, and negations; fix spelling while
keeping measured intervals. Respelled words appear in captions with their
correct `SCRIPT.md` spelling, including the ʻokina and kahakō. Never distribute
timestamps by word-count ratios. A displayed `$4.99` may highlight as one unit
over its spoken interval.

Install and adapt HyperFrames' `caption-highlight` component rather than
hand-rolling captions:

```bash
hyperframes add caption-highlight --dir <composition-dir>
```

Embed the transcript at build time and derive caption offsets and
`<audio data-start>` from one timing record. Phrases of 3–6 words over at most
two lines. Set colors with absolute `tl.set` calls at word starts and ends, not
class toggles, so the state survives any seek. Clear the highlight at each word
end and the phrase when finished; the last phrase clears before the closing
card. No bounce, zoom, typewriter, or reflowing weight changes. Seek across a
word boundary and a pause, forward and backward, to confirm.

## Audio

Use the style's Sound section: its events, files in the style's `assets/sfx/`,
starting gains, and music track. Fall back to the shared `assets/sfx/` and
`assets/music/` only for events the style does not cover. Copy only selected
files, and add any credit a file's license requires (see the style's
`assets/sfx/CREDITS.md`) to `caption.txt`. Never generate music.

- **Narrated:** keep music about 24 LU below the voice, measured with FFmpeg's
  `ebur128` filter on both; for bundled tracks that is roughly 0.05 gain.
- **Visual:** measure the track with `ebur128` and set its gain so the bed
  sits around -21 LUFS; the bundled tracks are mastered near -14 LUFS, so that
  is roughly 0.45 gain. State changes may land on beats; `hyperframes beats
  <composition-dir>` finds them.
- **Both:** the full mix stays at or below -14 LUFS with true peaks under
  -1 dBTP. You cannot hear the mix, so measure it and record the numbers in
  the plan.

Use a few SFX from `assets/sfx/` on actual state changes, reusing a small sound
vocabulary. Read `hyperframes-audio` for fades, ducking, or effects; browser
volume tweens do not reach export. Listen to a busy passage and the closing
card at the real mix level before the frame checkpoint.

## Review

Follow [review.md](review.md) before the frame checkpoint.

## Thumbnail and caption

Design `composition/thumbnail.html` as a separate static cover at the video's
aspect ratio, starting from the style's `thumbnail/index.html`, and render it
to JPEG with the same browser. At 1080×1920, keep
text and subject within x 60–960 and y 240–1400, which survives the profile
grid crop and platform UI. Use the chosen title as HTML text and rebuild the
stage at its most telling state as the hero, filling 40–60% of that box.
Render two cover variants, view each cropped and about 150 px wide, keep the
clearer one, and save it as `thumbnail.jpg` at the run root. The first video
frame should also work as a fallback cover.

Write the concise, sourced post caption to `caption.txt`, with exact URLs and
required credits.

## Final render

After the frame checkpoint is approved, render once with the CLI's supported
quality setting and `--output ../video.mp4`. Verify dimensions, duration, and
audio streams with `ffprobe`, and inspect the opening, a middle state, and the
ending. Re-render only for an observed defect or an intentional revision.
Record the CLI version, output duration, and render wall time in the plan.
