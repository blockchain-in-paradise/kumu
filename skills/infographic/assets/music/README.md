# Music

Bundled tracks:

- `happy-beats-business-moves-vol-1-by-ende-dot-app.mp3` (2:44)
- `happy-beats-business-moves-vol-9-by-ende-dot-app.mp3` (1:54)
- `happy-beats-business-moves-vol-10-by-ende-dot-app.mp3` (1:00)
- `happy-beats-business-moves-vol-11-by-ende-dot-app.mp3` (1:28)
- `happy-beats-business-moves-vol-12-by-ende-dot-app.mp3` (1:58)

Source: [ende.app](https://ende.app/en) "Happy Beats / Business Moves" series.

Cue presets live in `cues/`:

- `<track-stem>.music-cues.json` contains full-track beat and strong-cue metadata.
- `<track-stem>.music-cues.md` contains compact planning guidance for the first 20-25 seconds.

These are legacy BRAG analysis outputs, kept as optional timing data for
existing projects. Normal narrated runs do not load them. For requested beat
alignment on a new track, use HyperFrames' `beats` command after placing local
music in the composition. It produces a different, Studio-compatible format;
it does not regenerate these rich cue presets.

Before publishing or redistributing the skill, verify and document the exact music license terms alongside these files.
