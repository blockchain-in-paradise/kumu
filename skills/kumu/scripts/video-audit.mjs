#!/usr/bin/env node
// Video audit: measures a rendered video (any style) for the defects a viewer notices and a still frame hides.
//   warning flicker  a region changes for one frame and changes back: a defect (hair, clothing, a label, a shadow
//                    blinking) unless it is meant (a hit's shake or flash). --crops saves each as a 3-frame strip to judge
//   error   edge     something other than the backdrop enters the outer 14 px of the frame for 3 frames or more
//   warning dead     a stretch with almost no change (nothing moves, so the viewer sees a freeze)
// It reads the render, not the composition, so it sees what the encoder saw. Render a draft at the final frame
// rate first (a flicker lasts one frame, so a lower rate hides it):
//   npx hyperframes render . --quality draft --fps 30 --output .work/review/draft.mp4
// Usage: node scripts/video-audit.mjs <video.mp4> [--hold 0-2.3,70-73] [--dead 3] [--crops <dir>] [--json]
//   --hold   time ranges where stillness is intended (an opening title, the closing card); dead zones skip them
//   --dead   seconds of stillness that count as a freeze (default 3)
//   --crops  folder to save a strip of the three frames around each flicker (at most 12), named flicker-<seconds>.png
// Exits 1 when there is an error. Needs ffmpeg and ffprobe.
import { execSync, spawnSync } from "node:child_process";

const args = process.argv.slice(2);
const file = args.find((a) => !a.startsWith("--") && !/^[\d.,-]+$/.test(a));
const opt = (name, d) => { const i = args.indexOf(`--${name}`); return i < 0 ? d : args[i + 1]; };
if (!file) { console.error("usage: video-audit.mjs <video.mp4> [--hold a-b,c-d] [--dead 3] [--json]"); process.exit(2); }
const holds = (opt("hold", "") || "").split(",").filter(Boolean).map((r) => r.split("-").map(Number));
const deadSec = Number(opt("dead", 3));

const probe = execSync(`ffprobe -v error -select_streams v:0 -show_entries stream=r_frame_rate,width,height -of csv=p=0 "${file}"`, { encoding: "utf8" }).trim().split(",");
const fps = probe[2].split("/").reduce((a, b) => a / b);
const W = 216, H = 384;   // downscaled gray frames: the audit needs shape and brightness, not detail
const raw = spawnSync("ffmpeg", ["-v", "error", "-i", file, "-vf", `scale=${W}:${H}:flags=area,format=gray`, "-f", "rawvideo", "-"], { maxBuffer: 1 << 30 }).stdout;
const N = Math.floor(raw.length / (W * H));
if (N < 4) { console.error("could not read frames"); process.exit(2); }
const F = (i) => raw.subarray(i * W * H, (i + 1) * W * H);
const at = (i) => (i / fps).toFixed(2);
const issues = [];
const add = (level, kind, i, j, note) => issues.push({ level, kind, t0: i / fps, t1: j / fps, note });

// Frame-to-frame change over the whole frame and over a 12 x 16 grid of cells (18 x 24 px each).
const CW = 18, CH = 24, GX = W / CW, GY = H / CH;
const d1 = new Float32Array(N), cell1 = [], cell2 = [];
const cellDiff = (a, b) => {
  const out = new Float32Array(GX * GY);
  for (let y = 0; y < H; y++) for (let x = 0; x < W; x++) out[((y / CH) | 0) * GX + ((x / CW) | 0)] += Math.abs(a[y * W + x] - b[y * W + x]);
  for (let c = 0; c < out.length; c++) out[c] /= CW * CH;
  return out;
};
for (let i = 0; i + 1 < N; i++) {
  cell1.push(cellDiff(F(i), F(i + 1)));
  cell2.push(i + 2 < N ? cellDiff(F(i), F(i + 2)) : null);
  d1[i] = cell1[i].reduce((s, v) => s + v, 0) / cell1[i].length;
}

// Flicker: a cell moves a lot between frames i and i+1, yet frames i and i+2 nearly match (it changed and came back).
// A camera shake does that to the whole frame at once, so only a minority of the moving cells counts as a flicker.
let last = -99;
for (let i = 0; i + 2 < N; i++) {
  const flagged = [];
  let moving = 0;
  for (let c = 0; c < GX * GY; c++) {
    const a = cell1[i][c], b = cell2[i][c];
    if (a > 2) moving++;
    if (a > 7 && b < a * 0.3) flagged.push(c);
  }
  if (!flagged.length || flagged.length >= moving * 0.6) continue;   // none, or a shake or cut that moves everything
  if (i - last <= 2) { last = i; continue; }   // one event, one report
  last = i;
  const c = flagged[0];
  add("warning", "flicker", i, i + 2, `${flagged.length} cell(s) around x ${Math.round(((c % GX) + 0.5) * CW * 5)}, y ${Math.round((((c / GX) | 0) + 0.5) * CH * 5)} change for one frame and change back`);
}

// Edge: the outer strips should hold only the backdrop, which is smooth. A limb, glove, or label crossing the edge
// brings sharp edges into the strip; a lighting shift from a camera move does not.
const BAND = 3, STEEP = 22;   // 14 px at 1080 wide; a gray-level jump between neighbors that counts as an edge
const sharp = { left: [], right: [], top: [], bottom: [] };
for (let i = 0; i < N; i++) {
  const f = F(i); let l = 0, r = 0, t = 0, b = 0;
  for (let y = 0; y < H; y++) {
    for (let x = 0; x < BAND; x++) {
      if (Math.abs(f[y * W + x] - f[y * W + x + 1]) > STEEP) l++;
      if (Math.abs(f[y * W + W - 1 - x] - f[y * W + W - 2 - x]) > STEEP) r++;
    }
  }
  for (let x = 0; x < W; x++) {
    for (let y = 0; y < BAND; y++) {
      if (Math.abs(f[y * W + x] - f[(y + 1) * W + x]) > STEEP) t++;
      if (Math.abs(f[(H - 1 - y) * W + x] - f[(H - 2 - y) * W + x]) > STEEP) b++;
    }
  }
  sharp.left.push(l / (H * BAND)); sharp.right.push(r / (H * BAND)); sharp.top.push(t / (W * BAND)); sharp.bottom.push(b / (W * BAND));
}
for (const [side, v] of Object.entries(sharp)) {
  let run = 0;
  for (let i = 0; i <= N; i++) {
    const off = i < N && v[i] > 0.04;
    if (off) run++;
    else { if (run >= 3) add("error", "edge", i - run, i - 1, `sharp content is in the ${side} edge strip`); run = 0; }
  }
}

// Dead zones: the whole frame barely changes for deadSec or longer, outside the intended holds.
const still = (i) => d1[i] < 0.12;
let s = -1;
const held = (i) => holds.some(([a, b]) => i / fps >= a && i / fps <= b);
for (let i = 0; i <= N - 1; i++) {
  const quiet = i < N - 1 && still(i) && !held(i);
  if (quiet && s < 0) s = i;
  if (!quiet && s >= 0) { if ((i - s) / fps >= deadSec) add("warning", "dead", s, i, `nothing moves for ${((i - s) / fps).toFixed(1)} s`); s = -1; }
}

// Crops: the three frames around each flicker, 2x zoomed on the cells that changed, so they can be judged at a glance.
const cropDir = opt("crops", "");
if (cropDir) {
  execSync(`mkdir -p "${cropDir}"`);
  for (const x of issues.filter((q) => q.kind === "flicker").slice(0, 12)) {
    const m = x.note.match(/x (\d+), y (\d+)/);
    const cx = Math.max(120, Math.min(960, Number(m[1]))), cy = Math.max(120, Math.min(1800, Number(m[2])));
    const frames = [0, 1, 2].map((k) => `${cropDir}/.f${k}.png`);
    frames.forEach((p, k) => spawnSync("ffmpeg", ["-v", "error", "-y", "-ss", String(x.t0 + k / fps), "-i", file, "-frames:v", "1", "-vf", `crop=240:240:${cx - 120}:${cy - 120},scale=360:360:flags=neighbor`, p]));
    spawnSync("ffmpeg", ["-v", "error", "-y", ...frames.flatMap((p) => ["-i", p]), "-filter_complex", "hstack=3", `${cropDir}/flicker-${x.t0.toFixed(2)}.png`]);
    x.note += ` (crop: flicker-${x.t0.toFixed(2)}.png)`;
  }
}

// Report: merge repeats, sort by time.
const out = issues.sort((a, b) => a.t0 - b.t0);
const errors = out.filter((x) => x.level === "error").length;
if (args.includes("--json")) console.log(JSON.stringify({ fps, frames: N, issues: out }, null, 1));
else {
  for (const x of out) console.log(`${x.level.padEnd(7)} ${x.kind.padEnd(8)} ${x.t0.toFixed(2)}${x.t1 > x.t0 + 0.04 ? `-${x.t1.toFixed(2)}` : ""} s  ${x.note}`);
  console.log(`${out.length ? "" : "No issues. "}${errors} error(s), ${out.length - errors} warning(s) over ${(N / fps).toFixed(1)} s at ${fps} fps`);
}
process.exit(errors ? 1 : 0);
