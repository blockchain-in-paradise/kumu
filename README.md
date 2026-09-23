# /Kumu

Kumu is a human-in-loop agent skill that turns a topic, article URL, or
notes into a researched, branded infographic video. It makes a 30–90 second
vertical video with narration, word-highlighted captions, music, and sparse
sound effects, plus a separately designed thumbnail. You review the plan and
scene frames before the agent renders the final video. Built on
[HyperFrames](https://hyperframes.heygen.com/).

## How to run locally

This setup runs the Claude Code CLI from a copy of this repo on your computer.
Plugin marketplace installation, Claude Code on the web, and other agents have
not been tested.

### First-time setup

You need [Claude Code](https://code.claude.com/docs/en/setup),
[Git](https://git-scm.com/downloads), [Node.js 22+](https://nodejs.org/),
[FFmpeg](https://ffmpeg.org/download.html), and [Python 3](https://www.python.org/downloads/).

Then in your terminal run:

```bash
git clone https://github.com/blockchain-in-paradise/kumu.git
cd kumu

# Python environment for Kokoro text-to-speech
python3 -m venv .venv
.venv/bin/pip install kokoro-onnx soundfile
export HYPERFRAMES_PYTHON="$PWD/.venv/bin/python"

# HyperFrames skills, headless browser, and a health check
npx -y hyperframes skills update
npx -y hyperframes browser ensure
npx -y hyperframes doctor
```

`doctor` should pass everything except BGM (MusicGen), which is optional. If
whisper.cpp is missing, HyperFrames installs it the first time captions are
needed. The first narrated run may also download voice and transcription
models.

### Each session

Start Claude Code from the repo root with `HYPERFRAMES_PYTHON` pointing at
the `.venv` interpreter:

```bash
HYPERFRAMES_PYTHON="$PWD/.venv/bin/python" claude --plugin-dir .
```

To skip permission prompts, add `--dangerously-skip-permissions` to the launch
command. Leave it out to use your usual Claude Code permission settings.

Run `/kumu --topic "your topic"`. Output goes under `video-output/` in
this repo. After editing the skill, use `/reload-plugins` or start a new session.

## How to Use

```text
/kumu --topic "How to build a compact automatic sugar cane farm in Minecraft Java Edition" --tone "clear practical instructions for someone building alongside the video"
/kumu --url https://example.com/article --duration 45
```

- `--tone` sets the voice of the script, such as "clear build-along guide".
- `--duration` sets the target length in seconds (30–90, including the closing card).
- `--format vertical|square|landscape` sets the shape. Vertical 1080×1920 is the default.
- `--brand "<name>"` picks a brand by name from your project's `brands/` folder.
- `--no-voice`, `--no-captions`, `--no-music`, `--no-sfx` turn off individual layers.

Every run stops twice for your review (see [Pipeline](#pipeline)). To pick up a
saved run in a new session:

```text
/kumu Resume video-output/<run-directory>/ and continue.
```

## Brand

Styling comes from two files:

- **`brand.md`** holds one brand's values: colors by role, fonts, spacing, the
  background ("ground") recipe, assets, and the closing-card handle.
- **`skills/kumu/frame.md`** is the shared design law: caption style,
  color roles, type sizes, safe areas, and the closing-card layout. It uses
  role names such as `--accent` and `--highlight`, never raw colors, so it works
  with any brand.

The bundled brand is Pūpūkahi Tech Foundation, in
`skills/kumu/assets/brands/pupukahi-tech/`.

Pick one with `--brand "<name>"`; without it, the skill uses Pūpūkahi. To add
your own, copy a bundled brand into a `brands/` folder in your project, rename
it, and edit it. Its folder name or the `name` in its `brand.md` becomes the
`--brand` value:

```bash
mkdir -p brands && cp -r skills/kumu/assets/brands/pupukahi-tech brands/my-brand
```

1. **Colors:** set each role. `canvas` is the background, `ink` the text,
   `accent` actions and data, `highlight` the spoken caption word and closing
   kicker, `on-highlight` the text on it, and `panel` a backing behind content.
2. **Type, spacing, and `cta`:** fonts, safe areas, your handle, and the
   platforms shown on the closing card.
3. **Ground:** rewrite the CSS for your background. A photo works best at low
   opacity as texture; a gradient works too.
4. **Icons:** one monochrome Bootstrap Icons SVG per platform in `icons/`,
   named after the platform.

After building a composition, run `npx hyperframes check <composition-dir>`
and look at the actual frames. If a brand color fails contrast in a role,
note the adjustment in `brand.md`, for example setting the kicker as dark
text on a highlight pill.

## Pipeline

Each run moves through four stages. The agent pauses after the plan and again
after composing the scenes so you can request changes before it continues. At
either checkpoint, reply `Yes` to approve and continue, `No` to stop and keep
the files for later, or describe what you want changed. The agent makes those
changes and asks for another review. You can also edit the files directly
before replying.

1. **Research.** The agent researches the topic and saves supported claims,
   sources, qualifications, and usable visuals to `research.json`.
2. **Script and plan.** It writes the narration in `SCRIPT.md`, then
   `video-plan.md` with a brief for each scene and three or four thumbnail
   title options.

   **Checkpoint 1: plan review.** Read the script and plan and pick a thumbnail
   title. A plain `Yes` uses the recommended one. No audio or video has been
   generated yet, so changes here are cheap.

3. **Compose.** It generates the voiceover, times the word-by-word captions,
   builds the animated scenes in HyperFrames, mixes music and sound effects,
   designs the cover, and writes the post caption.

   **Checkpoint 2: frame review.** Check one finished frame per scene in
   `composition/frames/`, plus `thumbnail.jpg`, `caption.txt`, and a short audio
   preview. Changes are applied to the composition before any video is encoded.

4. **Render.** It encodes the final `video.mp4` and checks it.

Each run gets its own directory:

```text
video-output/
  YYYY-MM-DD-HHmmss-topic/
    research.json
    SCRIPT.md
    video-plan.md
    composition/     HyperFrames project, assets, and review frames
    video.mp4
    thumbnail.jpg
    caption.txt
```

## Credits

- Original workflow: [BRAG](https://github.com/latent-spaces/brag), MIT
- Music: [ende.app](https://ende.app/en), Happy Beats / Business Moves.
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
