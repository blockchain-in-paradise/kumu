#!/usr/bin/env node
// Motion audit for compositions built on SportsRig (the boxing style). It seeks the timeline in headless Chrome and
// flags, with timestamps, the glitches viewers notice:
//   error   no-load     a punch snaps out without coiling into a load pose first (reads as instant)
//   error   glove-clip  the two fighters' gloves pass inside each other
//   error   crowded     both fighters stand 190 to 250 units apart for over 0.4 s with no punch out: too close for two
//                       guards (the gloves tangle and slide around each other), too far for a hook
//   error   edge        a head, glove, elbow, knee, or foot within 40 px of the frame edge while the stage shows
//   warning skid        a fighter slides more than 50 units along the fight line faster than 250 units/s (a skid)
//   warning body-clip   the two torsos overlap
//   warning pose-camera a pose change of 0.4 s or longer runs while the camera moves
//   error   overlap     a pose move starts while the same fighter's previous move is still running (it stops his
//                       limbs dead mid-motion: a twitch)
//   error   twitch      a glove, elbow, knee, or the head jolts (one frame's acceleration spikes against its
//                       neighbors' at 60 fps), outside the snaps that are meant to be sudden: punches, recoils,
//                       knockdowns, cuts
// Usage: node scripts/motion-audit.mjs <composition dir> [--step 0.05]
// Exits 1 when there is an error. Needs HyperFrames (its Chrome and puppeteer-core); set PUPPETEER_CORE to a
// puppeteer-core folder if it is not found in the npx cache.
import { execSync } from "node:child_process";
import { createRequire } from "node:module";
import { existsSync, readdirSync } from "node:fs";
import { homedir } from "node:os";
import { join, resolve } from "node:path";
import { pathToFileURL } from "node:url";

const dir = resolve(process.argv[2] || ".");
const step = Number(process.argv[process.argv.indexOf("--step") + 1]) || 0.05;
if (!existsSync(join(dir, "index.html"))) { console.error(`No index.html in ${dir}`); process.exit(2); }

const findPuppeteer = () => {
  if (process.env.PUPPETEER_CORE) return process.env.PUPPETEER_CORE;
  const root = join(homedir(), ".npm", "_npx");
  for (const d of existsSync(root) ? readdirSync(root) : []) {
    const p = join(root, d, "node_modules", "puppeteer-core");
    if (existsSync(join(root, d, "node_modules", "hyperframes")) && existsSync(p)) return p;
  }
  throw new Error("puppeteer-core not found: run any npx hyperframes command once, or set PUPPETEER_CORE");
};
const puppeteer = createRequire(import.meta.url)(findPuppeteer());
const chrome = execSync("npx -y hyperframes browser path", { encoding: "utf8" }).trim().split("\n").pop();

const browser = await puppeteer.launch({ executablePath: chrome, args: ["--allow-file-access-from-files", "--no-sandbox", "--enable-unsafe-swiftshader"] });
const page = await browser.newPage();
await page.setViewport({ width: 1080, height: 1920 });
await page.evaluateOnNewDocument(() => { window.__timelines = window.__timelines || {}; });   // the HyperFrames runtime normally makes this
await page.goto(pathToFileURL(join(dir, "index.html")).href);
await page.waitForFunction(() => window.__timelines && Object.keys(window.__timelines).length && window.__sportsStages, { timeout: 20000 });

const data = await page.evaluate((step) => {
  const tl = window.__timelines.main || Object.values(window.__timelines)[0], S = window.__sportsStages[0];
  S.render();   // the first render settles the timeline (see SportsRig.stage), as the renderer's first frame does
  const KEYS = ["head", "glF", "glB", "elF", "elB", "kneeF", "kneeB", "toeF", "toeB", "shF", "shB", "hipF", "hipB"];
  const shown = () => { let o = 1; for (let e = S.svg; e && e.nodeType === 1; e = e.parentElement) o *= Number(getComputedStyle(e).opacity); return o; };
  // Tweens on the fighters and the camera, with global start times.
  const tweens = [];
  const walk = (t, offset) => t.getChildren(false, true, true).forEach((c) => {
    const start = offset + c.startTime();
    if (c.getChildren) return walk(c, start);
    tweens.push({ c, start, end: start + c.duration() });
  });
  walk(tl, 0);
  const poses = window.SportsPoses, LOADS = ["guard", "load", "loose", "hookLoad", "rearHookLoad", "upLoad", "leadUpLoad", "overLoad"];
  const poseOf = (vars) => Object.keys(poses).find((n) => ["armF", "foreF", "armB", "foreB", "torso"].every((k) => (poses[n][k] ?? 0) === (vars[k] ?? 0)));
  const fighterTw = S.fighters.map((f) => tweens.filter((w) => w.c.targets && w.c.targets()[0] === f.state).map((w) => ({ start: w.start, end: w.end, vars: Object.fromEntries(Object.entries(w.c.vars).filter(([, v]) => typeof v === "number")), pose: poseOf(w.c.vars) || null, ease: typeof w.c.vars.ease === "string" ? w.c.vars.ease : "", ko: "ko" in w.c.vars })));
  const camTw = tweens.filter((w) => w.c.targets && w.c.targets()[0] === S.cam && ["yaw", "pitch", "dist", "tx"].some((k) => k in w.c.vars) && w.end - w.start > 0.05).map((w) => [w.start, w.end]);
  const samples = [];
  for (let t = 0; t <= tl.duration() + 1e-6; t += step) {
    tl.seek(t, true); S.solve();
    const o = shown();
    samples.push({ t, o, f: S.fighters.map((f) => ({ ko: f.state.ko, x: f.state.x, z: f.state.z, J: Object.fromEntries(KEYS.map((k) => [k, f.J[k]])), P: Object.fromEntries(KEYS.map((k) => [k, S.project(f.J[k])])) })) });
  }
  // A fine pass at 60 fps for twitches: limb joints only.
  const LIMBS = ["glF", "glB", "elF", "elB", "kneeF", "kneeB", "head"], fine = [];
  for (let t = 0; t <= tl.duration() + 1e-6; t += 1 / 60) {
    tl.seek(t, true); S.solve();
    fine.push({ t, o: shown(), ko: S.fighters.map((f) => f.state.ko >= 0), f: S.fighters.map((f) => LIMBS.map((k) => f.J[k])) });
  }
  return { samples, fighterTw, camTw, fine };
}, step);
await browser.close();

const issues = [];
const add = (level, kind, t, note) => issues.push({ level, kind, t, note });
const d3 = (a, b) => Math.hypot(a.x - b.x, a.y - b.y, a.z - b.z);
const mid = (a, b) => ({ x: (a.x + b.x) / 2, y: (a.y + b.y) / 2, z: (a.z + b.z) / 2 });
const name = (i) => (i === 0 ? "fighter 1" : "fighter 2");

// Punches without a load: a short tween that reaches for the target, with no load pose ending just before it.
data.fighterTw.forEach((tws, i) => tws.forEach((w) => {
  const reach = ["reachF", "reachB", "hookF", "hookB", "upF", "upB", "overF", "overB"].some((k) => (w.vars[k] ?? 0) > 0.5);
  if (!reach || w.end - w.start > 0.25) return;
  // Loaded when the last pose he settled into before the snap is a load pose (a jab sets from a resting guard).
  const before = tws.filter((v) => v !== w && v.pose && v.end <= w.start + 0.02).sort((a, b) => b.end - a.end)[0];
  const loaded = !before || (LOADS_OK(before) && (before.pose !== "guard" || w.pose === "jab" || before.end >= w.start - 0.3));   // no pose before: his mount stance
  if (!loaded) add("error", "no-load", w.start, `${name(i)}'s ${w.pose || "punch"} snaps out without a load pose before it`);
}));
function LOADS_OK(v) { return ["guard", "load", "loose", "hookLoad", "rearHookLoad", "upLoad", "leadUpLoad", "overLoad", "liverLoad"].includes(v.pose); }
// Pose changes during camera moves.
data.fighterTw.forEach((tws, i) => tws.forEach((w) => {
  if (!w.pose || w.end - w.start < 0.4) return;
  for (const [a, b] of data.camTw) if (Math.min(b, w.end) - Math.max(a, w.start) > 0.15) { add("warning", "pose-camera", w.start, `${name(i)} changes into ${w.pose} while the camera moves`); break; }
}));
// Overlapping pose moves on one fighter.
data.fighterTw.forEach((tws, i) => {
  const ps = tws.filter((w) => w.pose).sort((a, b) => a.start - b.start);
  for (let k = 1; k < ps.length; k++) for (let m = 0; m < k; m++) {
    const a = ps[m], b = ps[k];
    if (/power4/.test(b.ease)) continue;   // a snap (a punch, a hit) interrupts by design
    if (b.start > a.start + 0.01 && b.start < a.end - 0.05) add("error", "overlap", b.start, `${name(i)}'s ${b.pose} starts while his ${a.pose} is still running (until ${a.end.toFixed(2)} s)`);
  }
});
// Twitches: a sudden kink in a limb's motion (second difference over 15 units at 60 fps), except right at the start of
// a punch, a recoil, or a knockdown, and across a cut (a jump of over 40 units in one frame).
{
  // A punch landing is an impact for both fighters (the guard it meets is knocked): its window covers everyone.
  // A recoil (back.out) snaps at its start and settles past its overshoot at its end; both are meant to be sudden.
  // Through glove contact a snap or settle moves the other fighter too, so these windows cover both fighters.
  const F = data.fine, own = data.fighterTw.map((tws) => tws.filter((w) => w.ko).map((w) => [w.start - 0.03, w.start + 0.07]));
  const hits = data.fighterTw.flatMap((tws) => tws.filter((w) => /power4/.test(w.ease)).map((w) => [w.start - 0.03, w.end + 0.1])
    .concat(tws.filter((w) => /back\.out/.test(w.ease)).flatMap((w) => [[w.start - 0.03, w.start + 0.1], [w.end - 0.05, w.end + 0.05]])));
  const snaps = own.map((o) => o.concat(hits));
  const LIMBS = ["glove", "glove", "elbow", "elbow", "knee", "knee", "head"];
  const acc = (k, i, j) => { const a = F[k - 1].f[i][j], c = F[k].f[i][j], d = F[k + 1].f[i][j]; return { x: a.x - 2 * c.x + d.x, y: a.y - 2 * c.y + d.y, z: a.z - 2 * c.z + d.z }; };
  for (let k = 2; k + 2 < F.length; k++) {
    if (F[k].o < 0.5) continue;
    F[k].f.forEach((joints, i) => {
      if (snaps[i].some(([a, b]) => F[k].t > a && F[k].t < b) || F[k].ko[i]) return;   // a falling body bounces by design
      joints.forEach((c, j) => {
        const a = F[k - 1].f[i][j], d = F[k + 1].f[i][j];
        if (Math.hypot(c.x - a.x, c.y - a.y, c.z - a.z) > 40 || Math.hypot(d.x - c.x, d.y - c.y, d.z - c.z) > 40) return;
        // A twitch is a spike: this frame's acceleration far from the average of its neighbors'. A fast but smooth
        // move accelerates hard over several frames and does not count. 25 units: a twitch a viewer noticed measured
        // 46; light glove contact measures 12 to 21.
        const p = acc(k - 1, i, j), q = acc(k, i, j), r = acc(k + 1, i, j);
        const jerk = Math.hypot(q.x - (p.x + r.x) / 2, q.y - (p.y + r.y) / 2, q.z - (p.z + r.z) / 2);
        if (jerk > 25) add("error", "twitch", F[k].t, `${name(i)}'s ${LIMBS[j]} jolts (${jerk.toFixed(0)} units)`);
      });
    });
  }
}
// Per-sample checks.
const S = data.samples;
S.forEach((s, k) => {
  if (s.o < 0.5) return;
  s.f.forEach((f, i) => {
    for (const [key, p] of Object.entries(f.P)) if (p && !key.startsWith("sh") && !key.startsWith("hip") && (p.x < 40 || p.x > 1040 || p.y < 40 || p.y > 1880)) { add("error", "edge", s.t, `${name(i)}'s ${key} within 40 px of the frame edge`); break; }
  });
  if (s.f.length === 2) {
    const [a, b] = s.f;
    for (const ga of ["glF", "glB"]) for (const gb of ["glF", "glB"]) if (d3(a.J[ga], b.J[gb]) < 42) add("error", "glove-clip", s.t, `gloves inside each other (${ga} and ${gb})`);
    if (a.ko < 0 && b.ko < 0 && d3(mid(a.J.shF, a.J.hipB), mid(b.J.shF, b.J.hipB)) < 70) add("warning", "body-clip", s.t, "the two torsos overlap");
  }
  // Crowded: a held distance where two guards tangle. A punch (from its load to its recoil) may pass through it.
if (S[0].f.length === 2) {
  const REACH = ["reachF", "reachB", "hookF", "hookB", "upF", "upB", "overF", "overB"];
  const punching = (t) => data.fighterTw.some((tws) => tws.some((w) => REACH.some((k) => (w.vars[k] ?? 0) > 0.5) && t > w.start - 0.3 && t < w.end + 0.7));
  let run = null;
  for (const s of S) {
    const [a, b] = s.f, d = Math.hypot(a.x - b.x, a.z - b.z);
    if (s.o >= 0.5 && a.ko < 0 && b.ko < 0 && d > 190 && d < 250 && !punching(s.t)) { run = run || { t0: s.t, d }; run.t1 = s.t; run.d = Math.min(run.d, d); }
    else if (run) { if (run.t1 - run.t0 >= 0.4) add("error", "crowded", run.t0, `the fighters hold ${Math.round(run.d)} units apart until ${run.t1.toFixed(2)} s: step out to 270 or in to 185`); run = null; }
  }
}
// Skids: a run of fast travel of the hips along the floor.
  if (k === 0) return;
  s.f.forEach((f, i) => {
    if (f.ko >= 0) return;
    const p = S[k - 1].f[i], h0 = mid(p.J.hipF, p.J.hipB), h1 = mid(f.J.hipF, f.J.hipB);
    f.v = Math.abs(h1.x - h0.x) / (s.t - S[k - 1].t);   // along the fight line: a slip off the line is quick by design
  });
});
S[0].f.forEach((_, i) => {
  let run = null;
  for (const s of S) {
    const v = s.f[i].v || 0;
    if (v > 20) { run = run || { t0: s.t, d: 0, n: 0 }; run.d += v * step; run.t1 = s.t; }
    else if (run) {
      const dur = run.t1 - run.t0 + step;
      // A lunge that ends in his own punch is fast by design.
      const lunge = data.fighterTw[i].some((w) => ["reachF", "reachB", "hookF", "hookB", "upF", "upB", "overF", "overB"].some((k) => (w.vars[k] ?? 0) > 0.5) && w.start >= run.t0 - 0.3 && w.start <= run.t1 + 0.5);
      if (!lunge && run.d > 50 && run.d / dur > 250) add("warning", "skid", run.t0, `${name(i)} slides ${Math.round(run.d)} units in ${dur.toFixed(2)} s`);
      run = null;
    }
  }
});

// Merge repeats of the same issue into time ranges.
issues.sort((a, b) => a.kind.localeCompare(b.kind) || a.note.localeCompare(b.note) || a.t - b.t);
const merged = [];
for (const x of issues) {
  const m = merged[merged.length - 1];
  if (m && m.kind === x.kind && m.note === x.note && x.t - m.t1 <= step * 3 + 1e-6) m.t1 = x.t;
  else merged.push({ ...x, t0: x.t, t1: x.t });
}
merged.sort((a, b) => a.t0 - b.t0);
const fmt = (t) => t.toFixed(2);
for (const m of merged) console.log(`${m.level.padEnd(7)} ${m.kind.padEnd(11)} ${fmt(m.t0)}${m.t1 > m.t0 ? `-${fmt(m.t1)}` : ""} s  ${m.note}`);
const errors = merged.filter((m) => m.level === "error").length;
console.log(`${merged.length ? "" : "No issues. "}${errors} error(s), ${merged.length - errors} warning(s) over ${fmt(S[S.length - 1].t)} s`);
process.exit(errors ? 1 : 0);
