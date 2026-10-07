# /Kumu

Kumu is a human-in-the-loop agent skill that turns a topic, article URL, or
notes into a researched explainer video for TikTok, Reels, and Shorts. Each
video is built around one concrete visual concept: an everyday metaphor, a
simplified real scene, or a simulation, with a stage that changes as the
explanation unfolds. Videos are narrated with word-highlighted captions, or
visual-only with short on-screen lines and music. You approve the concept and
plan, then the frames, before anything is rendered. Built on
[HyperFrames](https://hyperframes.heygen.com/).

## Where it runs

Kumu renders on your own computer. It needs macOS or Linux.

| App | Status |
| --- | --- |
| Claude desktop app (Code tab, local session) | Supported, recommended if you don't use a terminal |
| Claude Code in a terminal | Supported |
| Codex app or Codex CLI | Should work (skill and plugin formats are supported), not yet tested |
| OpenCode | Should work, not yet tested |
| Cloud sessions (claude.ai/code, Codex cloud) | Not supported |
| Chat apps (claude.ai chat, ChatGPT) | Not supported (they cannot render video) |
| Windows | Not supported yet |

## Get started

1. Install [Node.js 22+](https://nodejs.org/), [FFmpeg](https://ffmpeg.org/download.html),
   and [Python 3](https://www.python.org/downloads/). On macOS:
   `brew install node ffmpeg python`.
2. Download this repo (Code → Download ZIP, or `git clone https://github.com/blockchain-in-paradise/kumu.git`).
3. Open the `kumu` folder in your agent:
   - **Claude desktop app:** open the Code tab, choose the `kumu` folder, and
     make sure the session runs locally, not in the cloud.
   - **Claude Code:** `cd kumu && claude`
   - **Codex:** open the `kumu` folder in the Codex app, or run `codex` in it.
4. Ask for a video:

   ```text
   /kumu --topic "Why shortest job first cuts average wait time"
   ```

   In Codex, mention the skill as `$kumu` instead of `/kumu`.

On the first run, Kumu checks your setup and offers to run
`skills/kumu/scripts/setup.sh`. It installs the voice model environment in
`~/.kumu/venv`, the HyperFrames skills, and a headless browser, then runs a
health check. Ignore the BGM (MusicGen) check; Kumu only uses bundled or
supplied music. You can also run the
script yourself at any time; it is safe to repeat.

To use Kumu from another project, install it as a plugin. In Claude Code:
`/plugin marketplace add blockchain-in-paradise/kumu`, then
`/plugin install kumu@kumu`. In Codex, add the repo from `/plugins`. Plugin
installs have not been tested yet.

## How to use

```text
/kumu --topic "How bubble sort works" --mode visual
/kumu --url https://example.com/article --duration 45
/kumu --topic "7 git commands worth knowing" --ref https://www.tiktok.com/t/XXXX/
```

- `--mode narrated|visual`: narrated uses a voice and word-highlighted
  captions (30–90 s). Visual has no voice: short on-screen lines, music, and
  sound effects (10–90 s). Without it, Kumu recommends one per concept.
- `--ref <url>`: a video whose structure you like. Kumu studies its layout and
  pacing; it never copies its characters, assets, or wording. Repeatable.
- `--tone` sets the voice of the writing, such as "clear build-along guide".
- `--duration` sets the target length in seconds, including the closing card.
- `--format vertical|square|landscape`. Vertical 1080×1920 is the default.
- `--brand "<name>"` picks a brand from your project's `brands/` folder.
- `--no-captions`, `--no-music`, `--no-sfx` turn off individual layers.
  `--no-voice` is the same as `--mode visual`.

To pick up a saved run in a new session:

```text
/kumu Resume video-output/<run-directory>/ and continue.
```

## Pipeline

1. **Research.** Kumu researches the topic and saves supported claims, sources,
   and usable visuals to `research.json`, including evidence for whatever
   drives the animation (an algorithm, a simulation, real command output).
2. **Concept.** It writes three different concepts. Each names the stage that
   stays on screen, what it stands for, the model that drives it, the one value
   the viewer tracks, and the payoff. It recommends one.
3. **Script and plan.** For the recommended concept it writes the narration
   (`SCRIPT.md`) or the on-screen lines, and the stage's states, each tied to
   the words that trigger it, in `video-plan.md`.

   **Checkpoint 1: plan review.** Approve, pick another concept, or ask for
   changes. Nothing has been generated yet, so changes here are cheap.

4. **Compose.** It generates the voice and captions when narrated, builds the
   animated stage in HyperFrames, mixes music and sound effects, designs the
   cover, and writes the post caption.

   **Checkpoint 2: frame review.** Check the contact sheet of the whole video
   in `composition/frames/contact-sheet.jpg`, plus `thumbnail.jpg`,
   `caption.txt`, and an audio preview.

5. **Render.** It encodes the final `video.mp4` and checks it.

At either checkpoint, reply `Yes` to continue, `No` to stop and keep the files,
or describe what to change. You can also edit the files directly first.

```text
video-output/
  YYYY-MM-DD-HHmmss-topic/
    research.json
    video-plan.md    concepts, stage, states, thumbnail brief, status
    SCRIPT.md        narrated mode only
    composition/     HyperFrames project, assets, review frames, contact sheet
    video.mp4
    thumbnail.jpg
    caption.txt
```

## Brand

A brand sets the chrome: colors, fonts, spacing, captions, the closing card,
and the thumbnail. The concept owns the stage in the middle. Styling comes
from two files:

- **`brand.md`** holds one brand's values: colors by role, fonts, spacing, an
  optional background texture, assets, and the closing-card handle.
- **`skills/kumu/frame.md`** is the shared design law: layout zones, caption
  style, color roles, illustration and motion rules, and the closing card. It
  uses role names such as `--accent` and `--highlight`, so it works with any brand.

The bundled brand is Pūpūkahi Tech Foundation, in
`skills/kumu/assets/brands/pupukahi-tech/`. To add your own, copy it into a
`brands/` folder in your project and edit it. Its folder name or the `name` in
its `brand.md` becomes the `--brand` value:

```bash
mkdir -p brands && cp -r skills/kumu/assets/brands/pupukahi-tech brands/my-brand
```

1. **Colors:** `canvas` is the background, `ink` the text, `accent` state and
   data marks, `highlight` the spoken caption word and closing kicker,
   `on-highlight` the text on it, and `panel` a backing behind content.
2. **Type, spacing, and `cta`:** fonts, safe areas, your handle, and the
   platforms shown on the closing card.
3. **Texture (optional):** CSS for a subtle background under simple stages.
4. **Icons:** one monochrome Bootstrap Icons SVG per platform in `icons/`.

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
