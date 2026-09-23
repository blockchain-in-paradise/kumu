# /infographic

An agent skill that turns a topic, article URL, or notes into a researched,
branded infographic video: a 30–90 second vertical video with narration,
word-highlighted captions, music, and sparse SFX, plus a separately designed
thumbnail. Built on [HyperFrames](https://hyperframes.heygen.com/).

## Requirements

- An agent with web research and image inspection (e.g. Claude Code, Codex)
- Node.js 22+
- FFmpeg (with `ffprobe`)
- [HyperFrames](https://github.com/heygen-com/hyperframes) skills: `npx skills add heygen-com/hyperframes`
- Python 3 virtual environment with Kokoro for narration
- [whisper.cpp](https://github.com/ggml-org/whisper.cpp) (`whisper-cli` on `PATH`) for caption timing

The HyperFrames CLI runs through `npx` and downloads its own headless Chrome on
first render. Set up narration once, outside any run directory:

```bash
python3 -m venv .venv
.venv/bin/pip install kokoro-onnx soundfile
export HYPERFRAMES_PYTHON="$PWD/.venv/bin/python"
```

Check the setup with `npx hyperframes doctor`. Only Kokoro, whisper-cpp,
FFmpeg, and Chrome matter here; MusicGen is not used.

## Install

Claude Code:

```text
/plugin marketplace add blockchain-in-paradise/video-skill
/plugin install infographic@video-skill
```

Local checkout (for development):

```bash
git clone https://github.com/blockchain-in-paradise/video-skill
cd video-skill
claude --plugin-dir .
```

Then run `/infographic ...`. After editing the skill, restart
`claude --plugin-dir .` to load changes in a fresh session, or use
`/reload-plugins` to refresh the current one.

To run in auto mode without permission prompts, create both
`.claude/settings.json` and `.claude/settings.local.json` in your project with
the same contents:

```json
{
  "permissions": {
    "defaultMode": "auto",
    "allow": ["Edit(./**)", "Write(./**)"]
  }
}
```

Other agents:

```bash
npx skills add https://github.com/blockchain-in-paradise/video-skill --skill infographic
```

## How to Use

```text
/infographic --topic "How rate limiting works"
/infographic --url https://example.com/article --duration 35
/infographic --source notes.md --tone "quiet practical explanation"
/infographic --topic "Affordable AI tools" --script-only
```

- `--script-only` writes the script and storyboard, then asks whether to render. Request edits, reply `Yes` to render, or `No` to keep the draft.
- `--script path/to/script.md` uses your own narration. Wording is preserved; factual issues are flagged separately.
- `--no-voice`, `--no-captions`, `--no-music`, `--no-sfx` turn off individual layers.

Resume a saved plan in a new session:

```text
/infographic Resume video-output/<run-directory>/ and produce the full video.
```

All options are documented in [SKILL.md](skills/infographic/SKILL.md).

## Brand

Copy `skills/infographic/assets/brand/` into your project's `brand/` directory,
then edit `frame.md` and replace the assets it names. The frame defines colors,
typography, spacing, background, and the closing card.

Resolution order: `--frame` → project `brand/frame.md` → bundled brand
(Pūpūkahi Tech Foundation). See [brand setup](skills/infographic/assets/brand/README.md).

## Pipeline

1. **Research** → `research.json`: claims, qualifications, and visual sources.
2. **Script + plan** → `SCRIPT.md` narration and `video-plan.md` scene plan with spoken reveal cues.
3. **Compose** → narration, timed captions, scenes, music, and SFX.
4. **Review + render** → validate, render `video.mp4`, and design `thumbnail.jpg`.

Each run gets its own directory:

```text
video-output/
  YYYY-MM-DD-HHmmss-topic/
    research.json
    SCRIPT.md
    video-plan.md
    composition/     HyperFrames project, assets, and decoded frames
    video.mp4
    thumbnail.jpg
    share-copy.txt
```

## Credits

- Original workflow: [BRAG](https://github.com/latent-spaces/brag), MIT
- Music: [ende.app](https://ende.app/en), Happy Beats / Business Moves
- SFX: [Kenney](https://kenney.nl/)
- Platform icons: [Bootstrap Icons](https://icons.getbootstrap.com/), MIT
- Rendering: [HyperFrames](https://hyperframes.heygen.com/)

### Workflow inspiration

These projects informed the workflow design. Their instructions and code are
not bundled or required at runtime; the skill uses HyperFrames for production.

- [BRAG](https://github.com/latent-spaces/brag): creative orchestration and composition briefs.
- [HVE Video Director](https://github.com/nebrass/hve-video-director): a focused brief for each scene.
- [Writing Style and Tone](https://github.com/creator-futures/social-media-skills/tree/main/skills/writing-style-and-tone): specificity, spoken rhythm, and editing without invented experience.
- [Faceless Shorts Creator](https://github.com/hassancs91/claude-faceless-shorts-creator): explicit narration/visual beats and frame review. This skill keeps those beats in `video-plan.md`.
- [Video TalkCraft](https://github.com/Vincentwei1021/video-talkcraft) and [Video ShotCraft](https://github.com/Vincentwei1021/video-shotcraft): shot planning and motion linked to narration. Their templates, code, and mandatory approval flows are not imported.
