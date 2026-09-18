# /infographic

Turn a topic, article, or notes into a researched, branded infographic video
with narration and captions. Built on [BRAG](https://github.com/latent-spaces/brag)
and [HyperFrames](https://hyperframes.heygen.com/).

## Install

Claude Code:

```text
/plugin marketplace add blockchain-in-paradise/video-skill
/plugin install infographic@video-skill
```

Other agents:

```bash
npx skills add https://github.com/blockchain-in-paradise/video-skill --skill infographic
```

This repository also exposes the same skill through `.agents/skills/`,
`.claude/skills/`, and `.opencode/skills/` symlinks.

Requires an agent with web research and image inspection, Node.js 22+,
FFmpeg, and HyperFrames with its domain skills. Narration uses Kokoro through
HyperFrames' media tooling. No custom Python music-analysis environment is
required. Check the installation with `npx hyperframes doctor`.

## Use

```text
/infographic --topic "How rate limiting works" --frame brand/frame.md
/infographic --url https://example.com/article --duration 35
/infographic --source notes.md --tone "quiet practical explanation"
/infographic --topic "Affordable AI tools" --script-only
```

Default output is a 30–90 second vertical video with voice, captions, music,
and sparse SFX. Use `--no-voice`, `--no-captions`, `--no-music`, or `--no-sfx`
as needed. Other options and partial runs are documented in
[SKILL.md](skills/infographic/SKILL.md).

## Styling

Copy `skills/infographic/assets/brand/` into your project's `brand/` directory,
then edit `frame.md` and replace the assets it names. The frame contains
colors, typography, spacing, background treatment, and closing-card design.
Asset paths are relative to that frame file.

Resolution: explicit `--frame` → project `brand/frame.md` → bundled brand.
An article's publisher does not automatically replace your channel identity.
The bundled brand is Pūpūkahi Tech Foundation; use your own frame for another
channel. See [brand setup](skills/infographic/assets/brand/README.md).

## Pipeline

1. Research → `research.json`, including sources and necessary qualifications.
2. Write → `SCRIPT.md` for narration; `video-plan.md` for the storyboard.
3. Generate and measure narration → compose scenes and phrase captions.
4. Validate, inspect frames and playback → render, poster, and share copy.

`--script-only` stops after the plan without TTS or rendering.
`--stop-after research|plan|compose` provides other checkpoints; compose
includes audio, captions, and validation. Request a preview checkpoint when
review is needed before encoding.

Every run goes into its own subdirectory of `video-output/`:

```text
video-output/
  YYYY-MM-DD-HHmmss-topic/
    SCRIPT.md
    research.json
    video-plan.md
    composition/
    video.mp4
    video.jpg
    share-copy.txt
```

Edit `SCRIPT.md` to control the spoken words, or supply `--script path/to/script.md`.
The agent preserves supplied wording and flags factual issues separately.
`--script-only` writes the script and storyboard before any voice generation.
`references/` holds two
stage-specific guides, loaded when needed. `assets/references/` holds examples
the user supplied for development review; the workflow does not load them or
use them as styling requirements. Bundled music cue presets
remain optional data for existing projects; normal narrated runs do not read
them or analyze beats.

## Credits

- Original workflow: [BRAG](https://github.com/latent-spaces/brag), MIT
- Music: [ende.app](https://ende.app/en), Happy Beats / Business Moves
- SFX: [Kenney](https://kenney.nl/)
- Platform icons: [Bootstrap Icons](https://icons.getbootstrap.com/), MIT
- Rendering: [HyperFrames](https://hyperframes.heygen.com/)

See [LICENSE](LICENSE).
