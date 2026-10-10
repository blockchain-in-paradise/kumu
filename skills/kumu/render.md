# Render

Use `video-plan.md` as the storyboard, `SCRIPT.md` as the narration source when
narrated, and the selected style's `style.md` and sample `index.html` with
[frame.md](frame.md) as the styling record. Start the composition from the
style's sample: its background, type, caption, and closing code, and the
motion-value constants at the top of its script instead of new durations and
eases. Resolve skill assets relative to this skill directory. Use the installed
CLI's `--help` for version-dependent flags.

## Output layout

Inside `composition/`: `assets/` for final media,
`components/` for registry components, `scenes/` for sub-compositions when
needed, `frames/` for review frames, and `.work/` for raw audio, transcripts,
model scratch output, and review images. Create only directories you use.

Before installing registry items, set `paths.components` to `components` and
`paths.blocks` to `scenes` in `hyperframes.json`. Commands below run from
`composition/` unless stated otherwise.

## Building the stage

Read `hyperframes-core` before writing HTML. Read `hyperframes-animation` only
if the style's sample lacks the motion needed, and consult
`hyperframes-registry` before hand-building a named visual such as a code
window, terminal, chart, or map.

Build the stage, title, words zone, and closing card first. Inspect one state
at phone size with active captions or lines before building the rest.

When the concept has a model, compute states from it at load time, then place
one tween per state at its planned time. Set displayed values with `tl.set`, so they are correct at
any seek, forward or backward. Never count, simulate, or read the clock during
playback. This pattern is verified with HyperFrames 0.8:

```html
<script>
  // Model: run the real algorithm once and record every state.
  const values = [5, 2, 4, 1, 3], steps = [], v = values.slice();
  for (let i = 0; i < v.length - 1; i++)
    for (let j = 0; j < v.length - 1 - i; j++)
      if (v[j] > v[j + 1]) { [v[j], v[j + 1]] = [v[j + 1], v[j]]; steps.push(v.slice()); }
  // Stage: one element per value, set to its index slot in each state, one tween per state at its planned time.
  const els = new Map(values.map((n) => [n, document.querySelector(`[data-n="${n}"]`)]));
  const tl = gsap.timeline({ paused: true });
  steps.forEach((state, k) => {
    const t = 1 + k * 1.2;   // replace with the measured start from the plan
    state.forEach((n, i) => tl.to(els.get(n), { x: 90 + i * 190, duration: 0.5, ease: "power2.inOut" }, t));
    tl.set("#score", { textContent: `Swaps ${k + 1}` }, t + 0.5);   // set, never counted
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

Photo or clip subjects: see [references/photo-subjects.md](references/photo-subjects.md).

## Narration and timing (narrated mode)

Use the style's `voice` and `voice_speed` from its `style.md` (else `am_adam` at
1.0) for every line. Verify Kokoro by generating the first state group with
`hyperframes tts -v <voice> -s <speed>` and
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
correct `SCRIPT.md` spelling, including diacritics. Never distribute
timestamps by word-count ratios. A displayed `$4.99` may highlight as one unit
over its spoken interval.

If the style's sample already has caption code (boxing), reuse it with the
transcript. Otherwise install and adapt HyperFrames' `caption-highlight`
component rather than hand-rolling captions:

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
`assets/sfx/CREDITS.md`) to `video-plan.md`. Never generate music.

- **Narrated:** keep music about 24 LU below the voice, measured with FFmpeg's
  `ebur128` filter on both; for bundled tracks that is roughly 0.05 gain.
- **Visual:** measure the track with `ebur128` and set its gain so the bed
  sits around -21 LUFS; the bundled tracks are mastered near -14 LUFS, so that
  is roughly 0.45 gain. State changes may land on beats; `hyperframes beats
  <composition-dir>` finds them.
- **Both:** the full mix stays at or below -14 LUFS with true peaks under
  -1 dBTP. You cannot hear the mix, so measure it and record the numbers in
  the plan. The export is stereo, so mono sources read 3 LU louder than a mono
  mix: measure the mix as dual mono (or `video.mp4` after the render) and trim
  `data-volume` until it passes.

Use a few SFX from `assets/sfx/` on actual state changes, reusing a small sound
vocabulary. Read `hyperframes-audio` for fades, ducking, or effects; browser
volume tweens do not reach export. SFX peaks stay at least 8 dB under the voice
peaks: use the style's gains and lower the SFX `data-volume` if the mix
measurement in [review.md](review.md) shows them hot.

## Review

Follow [review.md](review.md) before the frame checkpoint.

## Thumbnail

Finish the plan-stage cover in `composition/thumbnail/index.html` with the
approved title and render it to JPEG with the same browser. Check it once at
about 150 px wide and save it as `thumbnail.jpg` at the run root.

## Final render

After the frame checkpoint is approved, render once at 1080×1920 for TikTok with
`--fps 30 --video-bitrate 20M --output ../video.mp4`. Never 4K (TikTok
downscales and recompresses it harder), never 60 fps, and never moving grain
or other animated noise: each gives TikTok's re-encode more to compress and
the posted video comes out soft. Tested on the boxing style: 30 fps, no grain,
20 Mbps posts sharp. Verify dimensions, duration, and
audio streams with `ffprobe`, and inspect the opening, a middle state, and the
ending. Re-render only for an observed defect or an intentional revision.
Record the CLI version, output duration, and render wall time in the plan.
