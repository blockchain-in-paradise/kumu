// Sports style character kit: flat-shaded fighters on a 3D skeleton, one SVG stage, a camera, floor notes,
// punches that aim at the opponent, and a ragdoll. Load poses.js after this file. Usage:
//   const stage = SportsRig.stage(document.getElementById("stage"));          // a full-frame <svg>
//   const you = SportsRig.mount(stage, SportsRig.LOOKS.red, { x: -157, facing: 0 });       // faces +x
//   const rival = SportsRig.mount(stage, SportsRig.LOOKS.blue, { x: 157, facing: 180 });   // faces -x
//   SportsRig.face(you, rival);                                            // punches aim at each other's chin
//   const tl = SportsRig.bind(gsap.timeline({ paused: true }), stage);   // redraw once per update
//   SportsRig.pose(tl, you, "jab", 2.4, 0.16, "power4.out");             // seek-safe pose tween
//   SportsRig.idle(tl, you, 2.0, 16);                                    // gentle breathing bounce (amp 0 = still)
//   SportsRig.appear(tl, stage, 2.3);                                    // fighters fade in (after the title leaves)
//   SportsRig.view(tl, stage, "overhead", 6);                            // one 0.55 s camera move
//   const n = stage.note({ type: "target", at: [157, 0], r: 60 });       // floor note, tween n.o / n.p
//   SportsRig.ragdoll(rival, "hit", { head: [300, 0, -200], kneeF: [-300, -80, 0] });
//   tl.fromTo(rival.state, { ko: -0.001 }, { ko: 2.5, duration: 3, ease: "none", immediateRender: false }, t);
//   const down = SportsRig.knockout(tl, stage, rival, t, { x: 157 });    // the whole knockdown in one call; returns when he is down
//   SportsRig.stand(tl, rival, t, 157);                                  // back on his feet in guard, for a replay
//   const m = stage.mark(you, "head");   SportsRig.show(tl, m, t, 1.2);  // a ring on a body part (see PARTS)
//   const g = stage.ghost(you, "lean", { x: -157 });   SportsRig.show(tl, g, t);   // pale afterimage of a pose
// World: x along the fight line, y up from the floor, z toward the side-view camera. Units are about
// 0.33 cm; the side view draws them at 1.5 px. Angles are degrees. Sagittal angles: 0 hangs down,
// negative swings forward. abd lifts a limb out to its side, chestYaw and hipYaw turn the body (positive
// brings the lead side forward), torso leans forward, roll bends sideways, head tilts the head.
// reachF / reachB (0..1) pull that glove onto the opponent's chin along a straight line; hookF / hookB, upF / upB
// and overF / overB (0..1) bring the same reach in on an arc instead: a hook, an uppercut, an overhand.
window.SportsRig = (() => {
  const R = Math.PI / 180;
  const V = (x, y, z) => ({ x, y, z });
  const add = (a, b) => V(a.x + b.x, a.y + b.y, a.z + b.z);
  const sub = (a, b) => V(a.x - b.x, a.y - b.y, a.z - b.z);
  const mul = (a, s) => V(a.x * s, a.y * s, a.z * s);
  const dot = (a, b) => a.x * b.x + a.y * b.y + a.z * b.z;
  const cross = (a, b) => V(a.y * b.z - a.z * b.y, a.z * b.x - a.x * b.z, a.x * b.y - a.y * b.x);
  const len = (a) => Math.hypot(a.x, a.y, a.z);
  const norm = (a) => mul(a, 1 / (len(a) || 1));
  const mid = (a, b) => mul(add(a, b), 0.5);
  const lerp = (a, b, t) => add(a, mul(sub(b, a), t));
  const sum = (...ps) => ps.reduce(add);
  const rot = (p, k, th) => {
    const c = Math.cos(th), s = Math.sin(th);
    return add(add(mul(p, c), mul(cross(k, p), s)), mul(k, dot(k, p) * (1 - c)));
  };
  const turn = (f, axis, deg) => ({ X: rot(f.X, axis, deg * R), Y: rot(f.Y, axis, deg * R), Z: rot(f.Z, axis, deg * R) });
  const at = (f, o, x, y, z) => add(o, sum(mul(f.X, x), mul(f.Y, y), mul(f.Z, z)));
  const f1 = (n) => n.toFixed(1);

  const L = { thigh: 125, shin: 125, foot: 40, arm: 95, fore: 85, glove: 100, spine: 155, hipW: 26, shW: 44, ankle: 13 };

  // Corner colors (the broadcast convention) and a set of real skin tones.
  const CORNER = { red: "#d2333a", blue: "#2c66d3" };
  const SKIN = { porcelain: "#f0d2bc", light: "#e2b48e", tan: "#c68b5f", olive: "#a97a52", brown: "#875839", deep: "#5e3b27", ebony: "#40291c" };
  // A look: skin, hair ("short", "buzz", "bun", "bald", "locs", "braids"), hairColor, trunks, corner ("red" or
  // "blue": gloves, waistband, side stripe), boots, socks, and top (a tank top color, or null for bare chest).
  const LOOKS = {
    red: { skin: SKIN.tan, hair: "short", hairColor: "#2b1d16", trunks: "#1d1d22", corner: "red", boots: "#1d1d22", socks: "#f1ede6", top: null },
    blue: { skin: SKIN.deep, hair: "locs", hairColor: "#16100c", trunks: "#efece5", corner: "blue", boots: "#efece5", socks: "#f1ede6", top: null },
    veteran: { skin: SKIN.light, hair: "bald", hairColor: "#000000", trunks: "#7a1f24", corner: "red", boots: "#7a1f24", socks: "#f1ede6", top: null },
    prospect: { skin: SKIN.olive, hair: "bun", hairColor: "#22170f", trunks: "#14315f", corner: "blue", boots: "#f1ede6", socks: "#f1ede6", top: "#f1ede6" },
    slugger: { skin: SKIN.brown, hair: "buzz", hairColor: "#140e0a", trunks: "#e7c14b", corner: "red", boots: "#141414", socks: "#141414", top: null },
    stylist: { skin: SKIN.ebony, hair: "braids", hairColor: "#0f0b08", trunks: "#3a3f47", corner: "blue", boots: "#3a3f47", socks: "#f1ede6", top: "#2c66d3" },
    porcelain: { skin: SKIN.porcelain, hair: "short", hairColor: "#b3743b", trunks: "#0f5a3a", corner: "red", boots: "#f1ede6", socks: "#f1ede6", top: null },
  };
  const mix = (hex, to, f) => "#" + [1, 3, 5].map((i) => {
    const a = parseInt(hex.slice(i, i + 2), 16), b = parseInt(to.slice(i, i + 2), 16);
    return Math.round(a + (b - a) * f).toString(16).padStart(2, "0");
  }).join("");
  const dark = (c, f = 0.28) => mix(c, "#000000", f);

  const ZERO = { torso: 0, roll: 0, hipYaw: 0, chestYaw: 0, head: 0, armF: 0, foreF: 0, abdF: 0, armB: 0, foreB: 0, abdB: 0,
    legF: 0, shinF: 0, legB: 0, shinB: 0, legAbdF: 0, legAbdB: 0, reachF: 0, reachB: 0, hookF: 0, hookB: 0, upF: 0, upB: 0, overF: 0, overB: 0 };

  function limbDir(f, a, abd, s) {
    let d = rot(mul(f.Y, -1), f.Z, -a * R), axis = f.Z;
    d = rot(d, f.X, -s * abd * R); axis = rot(axis, f.X, -s * abd * R);
    return { d, axis };
  }

  // Forward kinematics: pose state to world joints. bob dips through the knees; sway shifts weight.
  // chin(target) returns the opponent's chin, or null; reaching arms solve a two-bone IK onto it.
  function fk(st, chin) {
    const F0 = turn({ X: V(1, 0, 0), Y: V(0, 1, 0), Z: V(0, 0, 1) }, V(0, 1, 0), st.facing);
    const P = turn(F0, F0.Y, st.hipYaw + st.sway * 3);
    const C1 = turn(P, P.Y, st.chestYaw), C2 = turn(C1, C1.Z, -st.torso), C = turn(C2, C2.X, st.roll + st.sway * 2);
    const J = {};
    const dip = st.bob * 1.6;
    const legs = (pc) => {
      for (const [k, s] of [["F", 1], ["B", -1]]) {
        const hip = at(P, pc, 0, 0, s * L.hipW);
        const th = limbDir(F0, st["leg" + k] - dip * 0.5, st["legAbd" + k], s);
        const knee = add(hip, mul(th.d, L.thigh));
        const ankle = add(knee, mul(rot(th.d, th.axis, -(st["shin" + k] + dip) * R), L.shin));
        Object.assign(J, { ["hip" + k]: hip, ["knee" + k]: knee, ["ankle" + k]: ankle });
      }
    };
    legs(V(0, 0, 0));
    const low = Math.min(J.ankleF.y, J.ankleB.y);
    const pc = V(st.x + st.sway * 6, L.ankle - low, st.z);
    legs(pc);
    for (const k of ["F", "B"]) {
      const lift = J["ankle" + k].y - L.ankle, tip = Math.asin(Math.min(1, lift / L.foot));
      J["toe" + k] = add(J["ankle" + k], add(mul(F0.X, L.foot * Math.cos(tip)), mul(F0.Y, -L.foot * Math.sin(tip))));
    }
    const neck = at(C, pc, 0, L.spine + 22, 0);
    J.head = add(add(neck, rot(mul(C.Y, 50), C.Z, -st.head * R)), mul(C.X, 6));
    const target = chin && chin();
    for (const [k, s] of [["F", 1], ["B", -1]]) {
      const sh = at(C, pc, 0, L.spine, s * L.shW);
      const up = limbDir(C, st["arm" + k], st["abd" + k], s);
      let el = add(sh, mul(up.d, L.arm));
      let gl = add(el, mul(rot(up.d, up.axis, -st["fore" + k] * R), L.glove));
      const w = st["reach" + k];
      if (target && w > 0) {
        // Two-bone IK: the glove goes to the chin (fully extended toward it if out of range). A straight punch
        // travels the line with the elbow down. A bent punch (hook, uppercut, overhand) comes in on an arc from
        // its own side (out wide, from below, from above and outside), with the elbow on that side; the arc is
        // still wide early in a fast punch, so it reads in the frames, and the arm stays bent.
        const hk = st["hook" + k], uk = st["up" + k], ok = st["over" + k], bw = Math.min(1, hk + uk + ok);
        let to = sub(target, sh), pole = add(V(0, -1, 0), mul(C.Z, s * 0.35)), wb = w;
        if (bw > 0) {
          const flat = norm(V(to.x, 0, to.z));
          let out = norm(cross(V(0, 1, 0), flat)); if (dot(out, mul(C.Z, s)) < 0) out = mul(out, -1);
          const a = sum(mul(out, hk + ok * 0.7), V(0, ok * 0.7 - uk, 0));
          const ap = norm(sub(a, mul(norm(to), dot(a, norm(to)))));
          const sw = 75 * R * Math.sqrt(1 - w) * Math.min(1, bw * 2), r = len(to);
          // Bent all the way through: the reach stays between near and far, so out of range the punch falls short
          // instead of straightening into a jab. Throw these from close range (see style.md).
          const n = hk + uk + ok, near = (115 * hk + 110 * uk + 150 * ok) / n, far = (135 * hk + 135 * uk + 170 * ok) / n;
          to = mul(norm(add(mul(to, Math.cos(sw)), mul(ap, r * Math.sin(sw)))), r + (Math.min(far, Math.max(r, near)) - r) * bw);
          pole = lerp(pole, a, bw);
          wb = w + (Math.min(1, w / 0.35) - w) * bw;
        }
        const d = Math.min(len(to), L.arm + L.glove - 1), dir = norm(to);
        pole = norm(sub(pole, mul(dir, dot(pole, dir))));
        const ca = Math.max(-1, Math.min(1, (L.arm * L.arm + d * d - L.glove * L.glove) / (2 * L.arm * d)));
        const eIK = add(sh, add(mul(dir, L.arm * ca), mul(pole, L.arm * Math.sqrt(1 - ca * ca))));
        const gIK = add(sh, mul(dir, d));
        el = lerp(el, eIK, wb); gl = lerp(gl, gIK, wb);
      }
      Object.assign(J, { ["sh" + k]: sh, ["el" + k]: el, ["gl" + k]: gl });
    }
    return J;
  }

  // ---------- Stage, camera, floor ----------
  const VIEWS = {
    side: { yaw: 0, pitch: 0, roll: 0, dist: 2200, tx: 0, ty: 347, tz: 0, cy: 640 },
    overhead: { yaw: -90, pitch: 88, roll: 0, dist: 2500, tx: 0, ty: 0, tz: 0, cy: 660 },
    threeQuarter: { yaw: -118, pitch: 26, roll: 0, dist: 2700, tx: 50, ty: 260, tz: 0, cy: 720 },
    low: { yaw: 30, pitch: 6, roll: -2, dist: 1950, tx: 20, ty: 300, tz: 0, cy: 660 },
  };
  const CAM_KEYS = ["yaw", "pitch", "roll", "dist", "f", "tx", "ty", "tz", "cx", "cy", "shakeX", "shakeY"];
  const OUTLINE = "#d9cdbd";
  // Where each body mark sits on a fighter (stage.mark(fighter, part)). F is the lead side, B the rear.
  const PARTS = {
    head: (J) => J.head, chest: (J) => lerp(mid(J.shF, J.shB), mid(J.hipF, J.hipB), 0.35),
    waist: (J) => lerp(mid(J.hipF, J.hipB), mid(J.shF, J.shB), 0.15),
    leadKnee: (J) => J.kneeF, rearKnee: (J) => J.kneeB, leadFoot: (J) => J.ankleF, rearFoot: (J) => J.ankleB,
    leadGlove: (J) => J.glF, rearGlove: (J) => J.glB,
    leadElbow: (J) => J.elF, rearElbow: (J) => J.elB,
  };

  function stage(svg, opts = {}) {
    svg.setAttribute("viewBox", "0 0 1080 1920");
    svg.innerHTML = `<defs>
      <filter id="rigShadow" x="-50%" y="-50%" width="200%" height="200%"><feGaussianBlur stdDeviation="10"/></filter>
      <filter id="rigSoft" x="-50%" y="-50%" width="200%" height="200%"><feGaussianBlur stdDeviation="14"/></filter>
      <radialGradient id="rigCanvas"><stop offset="0" stop-color="#2e2722"/><stop offset=".7" stop-color="#241e1a" stop-opacity=".85"/><stop offset="1" stop-color="#1a1512" stop-opacity="0"/></radialGradient>
      <radialGradient id="rigPool"><stop offset="0" stop-color="#6b5c4b" stop-opacity=".95"/><stop offset=".55" stop-color="#4a3f34" stop-opacity=".7"/><stop offset="1" stop-color="#2a241f" stop-opacity="0"/></radialGradient>
      </defs><g data-l="floor"></g><g data-l="notes"></g><g data-l="shadow" filter="url(#rigShadow)"></g><g data-l="ghost"></g><g data-l="outline" opacity=".7"></g><g data-l="bodies"></g><g data-l="fx"></g>`;
    const layer = {};
    svg.querySelectorAll("[data-l]").forEach((g) => (layer[g.dataset.l] = g));
    const cam = Object.assign({ f: 3300, cx: 540, shakeX: 0, shakeY: 0 }, VIEWS.side, opts.camera);
    const S = { svg, cam, fighters: [], hooks: [], notes: [], marks: [], ghosts: [], line: { accent: 0, o: 1 } };
    let basis;
    S.setup = () => {
      const p = cam.pitch * R, y = cam.yaw * R, T = V(cam.tx, cam.ty, cam.tz);
      const pos = add(T, mul(V(Math.sin(y) * Math.cos(p), Math.sin(p), Math.cos(y) * Math.cos(p)), cam.dist));
      const fw = norm(sub(T, pos));
      let right = norm(cross(fw, V(0, 1, 0))), up = cross(right, fw);
      right = rot(right, fw, cam.roll * R); up = rot(up, fw, cam.roll * R);
      basis = { pos, fw, right, up };
    };
    S.camPos = () => basis.pos;
    S.project = (p) => {
      if (Array.isArray(p)) p = V(p[0], p.length > 2 ? p[1] : 0, p.length > 2 ? p[2] : p[1]);
      const d = sub(p, basis.pos), z = dot(d, basis.fw);
      if (z < 40) return null;
      const s = cam.f / z;
      return { x: cam.cx + dot(d, basis.right) * s + cam.shakeX, y: cam.cy - dot(d, basis.up) * s + cam.shakeY, z, s };
    };
    const seg = (a, b) => {
      const za = dot(sub(a, basis.pos), basis.fw), zb = dot(sub(b, basis.pos), basis.fw);
      if (za < 40 && zb < 40) return null;
      if (za < 40) a = add(a, mul(sub(b, a), (40 - za) / (zb - za)));
      if (zb < 40) b = add(b, mul(sub(a, b), (40 - zb) / (za - zb)));
      const pa = S.project(a), pb = S.project(b);
      return pa && pb ? [pa, pb] : null;
    };
    const line = (p, q, w, c, extra = "") =>
      `<line x1="${f1(p.x)}" y1="${f1(p.y)}" x2="${f1(q.x)}" y2="${f1(q.y)}" stroke="${c}" stroke-width="${f1(w)}" stroke-linecap="round"${extra}/>`;
    const poly = (pts, attrs) => {
      const ps = pts.map(S.project);
      if (ps.some((p) => !p)) return "";
      return `<polygon points="${ps.map((p) => `${f1(p.x)},${f1(p.y)}`).join(" ")}" ${attrs}/>`;
    };
    const circlePts = (cx, cz, r, n = 40, y = 0) => Array.from({ length: n }, (_, k) => {
      const a = (k / n) * Math.PI * 2; return V(cx + Math.cos(a) * r, y, cz + Math.sin(a) * r);
    });
    // The ring: a canvas floor that fades into the dark arena (no hard edge at any angle), lit by one
    // overhead spot, with a faint weave that fades with distance and soft rope shadows near the ropes.
    const RING = 1000;
    function drawFloor() {
      let h = poly(circlePts(0, 0, 1500, 48), `fill="url(#rigCanvas)"`);
      h += poly(circlePts(0, 0, 820, 48), `fill="url(#rigPool)"`);
      for (let i = -1350; i <= 1350; i += 150) for (let j = -1350; j < 1350; j += 150) {
        for (const [a, b] of [[V(i, 0, j), V(i, 0, j + 150)], [V(j, 0, i), V(j + 150, 0, i)]]) {
          const fade = Math.max(0, 1 - Math.hypot((a.x + b.x) / 2, (a.z + b.z) / 2) / 1300);
          if (fade <= 0) continue;
          const s = seg(a, b); if (s) h += line(s[0], s[1], 1.5, "#fff", ` stroke-opacity="${(0.05 * fade).toFixed(3)}"`);
        }
      }
      for (const inset of [40, 85]) {
        const e = RING - inset;
        for (const [a, b] of [[V(-e, 0, -e), V(e, 0, -e)], [V(e, 0, -e), V(e, 0, e)], [V(e, 0, e), V(-e, 0, e)], [V(-e, 0, e), V(-e, 0, -e)]]) {
          const s = seg(a, b); if (s) h += line(s[0], s[1], 10 * s[0].s, "#000", ` stroke-opacity=".22" filter="url(#rigSoft)"`);
        }
      }
      return h;
    }
    // The fight line through both stances: neutral by default, white when line.accent is 1.
    function drawLine() {
      const s = seg(V(-1300, 1, 0), V(1300, 1, 0)); if (!s || S.line.o <= 0) return "";
      const c = mix("#8d8173", "#ffffff", S.line.accent);
      return line(s[0], s[1], 2 + S.line.accent, c, ` stroke-opacity="${f1(S.line.o * (0.55 + 0.45 * S.line.accent))}"`);
    }
    // Floor notes, drawn on the floor in 3D. Each has o (opacity 0..1) and p (draw progress 0..1) to tween.
    S.note = (n) => { const o = Object.assign({ o: 0, p: 1, color: "#ffffff" }, n); S.notes.push(o); return o; };
    function drawNote(n) {
      if (n.o <= 0.001) return "";
      const P = (q) => V(q[0], 2, q[1]);
      const o = n.o.toFixed(3);
      if (n.type === "path") {
        const pts = [];
        for (let i = 0; i < n.pts.length - 1; i++) for (let k = 0; k < 12; k++) {
          const t = k / 12, a = n.pts[i], b = n.pts[i + 1];
          pts.push([a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t]);
        }
        pts.push(n.pts[n.pts.length - 1]);
        const upto = Math.max(2, Math.round(pts.length * n.p));
        const ps = pts.slice(0, upto).map((q) => S.project(P(q)));
        if (ps.some((p) => !p)) return "";
        let h = `<polyline points="${ps.map((p) => `${f1(p.x)},${f1(p.y)}`).join(" ")}" fill="none" stroke="${n.color}" stroke-width="4" stroke-dasharray="3 12" stroke-linecap="round" opacity="${o}"/>`;
        if (n.arrow !== false && upto > 2) {
          const a = ps[ps.length - 2], b = ps[ps.length - 1], ang = Math.atan2(b.y - a.y, b.x - a.x);
          const w = (d) => `${f1(b.x + Math.cos(ang + d) * -22)},${f1(b.y + Math.sin(ang + d) * -22)}`;
          h += `<polyline points="${w(0.5)} ${f1(b.x)},${f1(b.y)} ${w(-0.5)}" fill="none" stroke="${n.color}" stroke-width="4" stroke-linecap="round" stroke-linejoin="round" opacity="${o}"/>`;
        }
        return h;
      }
      if (n.type === "target") {
        const r = n.r * (0.6 + 0.4 * n.p);
        return poly(circlePts(n.at[0], n.at[1], r * 1.6, 36, 2), `fill="${n.color}" opacity="${(n.o * 0.18).toFixed(3)}" filter="url(#rigSoft)"`) +
          poly(circlePts(n.at[0], n.at[1], r, 36, 2), `fill="${n.color}" fill-opacity=".2" stroke="${n.color}" stroke-width="3" opacity="${o}"`);
      }
      if (n.type === "ring") {
        const ps = circlePts(n.at[0], n.at[1], n.r, 48, 2).map(S.project);
        if (ps.some((p) => !p)) return "";
        return `<polygon points="${ps.map((p) => `${f1(p.x)},${f1(p.y)}`).join(" ")}" fill="none" stroke="${n.color}" stroke-width="3" stroke-dasharray="6 10" opacity="${o}"/>`;
      }
      if (n.type === "wedge") {
        const pts = [V(n.at[0], 2, n.at[1])];
        for (let k = 0; k <= 16; k++) {
          const a = (n.a0 + (n.a1 - n.a0) * n.p * (k / 16)) * R;
          pts.push(V(n.at[0] + Math.cos(a) * n.r, 2, n.at[1] + Math.sin(a) * n.r));
        }
        return poly(pts, `fill="${n.color}" fill-opacity=".22" stroke="${n.color}" stroke-opacity=".7" stroke-width="2" opacity="${o}"`);
      }
      return "";
    }
    // Body marks: a soft ring on a body part (a key of PARTS) that follows it through any camera. Tween m.o
    // (opacity) and m.p (size) like a floor note, or call SportsRig.show.
    S.mark = (f, part, opts = {}) => {
      if (!PARTS[part]) throw new Error(`Unknown part "${part}". Use one of: ${Object.keys(PARTS).join(", ")}`);
      const m = { r: 58, color: "#ffffff", ...opts, f, part, o: 0, p: 1 }; S.marks.push(m); return m;
    };
    function drawMark(m) {
      if (m.o <= 0.001 || !m.f.J) return "";
      const c = S.project(PARTS[m.part](m.f.J)); if (!c) return "";
      const r = m.r * c.s * (0.6 + 0.4 * m.p);
      return `<circle cx="${f1(c.x)}" cy="${f1(c.y)}" r="${f1(r * 1.5)}" fill="${m.color}" opacity="${(m.o * 0.18).toFixed(3)}" filter="url(#rigSoft)"/>` +
        `<circle cx="${f1(c.x)}" cy="${f1(c.y)}" r="${f1(r)}" fill="${m.color}" fill-opacity=".14" stroke="${m.color}" stroke-width="4" opacity="${m.o.toFixed(3)}"/>`;
    }
    // Ghosts: a pale afterimage of a pose at x (and z): "where you were" or "where you should be". Tween g.o.
    S.ghost = (f, poseName, at = {}) => {
      if (!window.SportsPoses[poseName]) throw new Error(`Unknown pose "${poseName}"`);
      const g = { f, pose: poseName, x: at.x ?? f.state.x, z: at.z ?? f.state.z, o: 0, p: 1 }; S.ghosts.push(g); return g;
    };
    function drawGhost(g) {
      if (g.o <= 0.001) return "";
      const J = fk({ ...ZERO, x: g.x, z: g.z, facing: g.f.state.facing, bob: 0, sway: 0, ...window.SportsPoses[g.pose] }, null);
      const shapes = prims(S, { look: g.f.look }, J).sort((a, b) => b.d - a.d).map((i) => i.o).join("");
      return `<g opacity="${(g.o * 0.38).toFixed(3)}">${shapes}</g>`;
    }
    let floorKey = "";
    S.render = () => {
      S.setup();
      const key = CAM_KEYS.map((k) => cam[k]).join();
      if (key !== floorKey) { layer.floor.innerHTML = drawFloor(); floorKey = key; }
      layer.notes.innerHTML = drawLine() + S.notes.map(drawNote).join("");
      let shadows = "", items = [];
      for (const f of S.fighters) f.J = joints(f);
      collide(S.fighters);
      for (const f of S.fighters) {
        shadows += shadowOf(S, f.J);
        items = items.concat(prims(S, f, f.J));
      }
      items.sort((a, b) => b.d - a.d);
      layer.shadow.innerHTML = shadows;
      layer.ghost.innerHTML = S.ghosts.map(drawGhost).join("");
      // Outlines all go under all fills, so only the outer silhouette shows an edge.
      layer.outline.innerHTML = items.map((i) => i.o).join("");
      layer.bodies.innerHTML = items.map((i) => i.h).join("");
      layer.fx.innerHTML = S.marks.map(drawMark).join("");
      S.hooks.forEach((fn) => fn(S));
    };
    S.onRender = (fn) => S.hooks.push(fn);
    return S;
  }

  function shadowOf(S, J) {
    const c = mid(mid(J.hipF, J.hipB), mid(J.shF, J.shB));
    const foot = mid(J.ankleF, J.ankleB);
    const along = norm(V(J.head.x - foot.x, 0, J.head.z - foot.z));
    const spread = Math.min(1, Math.hypot(J.head.x - c.x, J.head.z - c.z) / 200);
    const side = V(-along.z, 0, along.x);
    const pts = [];
    for (let k = 0; k < 24; k++) {
      const a = (k / 24) * Math.PI * 2;
      const p = S.project(add(V(c.x, 0, c.z), add(mul(along, Math.cos(a) * (95 + 170 * spread)), mul(side, Math.sin(a) * 85))));
      if (!p) return "";
      pts.push(`${f1(p.x)},${f1(p.y)}`);
    }
    return `<polygon points="${pts.join(" ")}" fill="#000" opacity=".55"/>`;
  }

  function hull(ps) {
    ps = ps.slice().sort((a, b) => a.x - b.x || a.y - b.y);
    const c = (o, a, b) => (a.x - o.x) * (b.y - o.y) - (a.y - o.y) * (b.x - o.x);
    const lo = [], hi = [];
    for (const p of ps) { while (lo.length > 1 && c(lo[lo.length - 2], lo[lo.length - 1], p) <= 0) lo.pop(); lo.push(p); }
    for (const p of ps.reverse()) { while (hi.length > 1 && c(hi[hi.length - 2], hi[hi.length - 1], p) <= 0) hi.pop(); hi.push(p); }
    return lo.slice(0, -1).concat(hi.slice(0, -1));
  }

  // Draw list for one fighter. Every part is a flat tone with one shadow tone on the side away from the
  // overhead spot; each part also gives an outline shape that the stage draws under all fills.
  const OUT = 2;
  function prims(S, f, J) {
    const look = f.look, cam = S.camPos(), out = [];
    const corner = CORNER[look.corner] || look.corner;
    const shC = mid(J.shF, J.shB), hipC = mid(J.hipF, J.hipB);
    const up = norm(sub(shC, hipC));
    const lat = norm(sub(J.shF, J.shB)), fwd = norm(cross(up, lat));
    const latP = norm(sub(J.hipF, J.hipB)), fwdP = norm(cross(up, latP));
    const toCam = (p) => norm(sub(cam, p));
    const sideNear = (s, p) => dot(mul(lat, s), toCam(p)) > 0;
    const P = (p) => S.project(p);
    // Clothes are drawn into the part they cover (the host), at its depth and right after it, so skin can
    // never sort over a garment at any camera angle. Everything else sorts on its own depth.
    let host = null;
    const push = (d, o, h) => {
      if (host) { host.o += o; host.h += h; return host; }
      const e = { d, o, h }; out.push(e); return e;
    };
    const wear = (part, draw) => { if (part) { host = part; draw(); host = null; } };
    // Where "up" (toward the spot) points on screen at p, for the lit side of a part.
    const lightDir = (p) => {
      const a = P(p), b = P(add(p, V(0, 40, 0)));
      if (!a || !b) return { x: 0, y: -1 };
      const dx = b.x - a.x, dy = b.y - a.y, l = Math.hypot(dx, dy) || 1;
      return { x: dx / l, y: dy / l };
    };
    const L2 = (p, q, w, c, op = "") =>
      `<line x1="${f1(p.x)}" y1="${f1(p.y)}" x2="${f1(q.x)}" y2="${f1(q.y)}" stroke="${c}" stroke-width="${f1(w)}" stroke-linecap="round"${op}/>`;
    const seg = (a, b, w, c, bias = 0, shadeIt = true) => {
      const p = P(a), q = P(b); if (!p || !q) return;
      const sw = w * (p.s + q.s) / 2;
      let h = L2(p, q, sw, shadeIt ? dark(c, 0.22) : c);
      if (shadeIt) {
        // Lit band offset toward the light, across the limb only.
        const lx = q.x - p.x, ly = q.y - p.y, ll = Math.hypot(lx, ly) || 1, ux = lx / ll, uy = ly / ll;
        const ld = lightDir(mid(a, b)), along = ld.x * ux + ld.y * uy;
        const px = ld.x - along * ux, py = ld.y - along * uy, k = sw * 0.16;
        h += L2({ x: p.x + px * k, y: p.y + py * k }, { x: q.x + px * k, y: q.y + py * k }, sw * 0.74, c);
      }
      return push((p.z + q.z) / 2 + bias, L2(p, q, sw + OUT * 2, OUTLINE), h);
    };
    const disc = (c3, r, fill, bias = 0, shadeIt = true) => {
      const p = P(c3); if (!p) return;
      const rr = r * p.s, ld = lightDir(c3);
      let h = `<circle cx="${f1(p.x)}" cy="${f1(p.y)}" r="${f1(rr)}" fill="${shadeIt ? dark(fill, 0.22) : fill}"/>`;
      if (shadeIt) h += `<circle cx="${f1(p.x + ld.x * rr * 0.16)}" cy="${f1(p.y + ld.y * rr * 0.16)}" r="${f1(rr * 0.82)}" fill="${fill}"/>`;
      return push(p.z + bias, `<circle cx="${f1(p.x)}" cy="${f1(p.y)}" r="${f1(rr + OUT)}" fill="${OUTLINE}"/>`, h);
    };
    const blob = (pts, fill, round, bias = 0, litPts = null) => {
      const ps = pts.map(P); if (ps.some((p) => !p)) return;
      const hh = hull(ps), z = ps.reduce((a, p) => a + p.z, 0) / ps.length, s = ps.reduce((a, p) => a + p.s, 0) / ps.length;
      const pp = (h) => h.map((p) => `${f1(p.x)},${f1(p.y)}`).join(" ");
      const base = litPts ? dark(fill, 0.13) : fill;
      let h = `<polygon points="${pp(hh)}" fill="${base}" stroke="${base}" stroke-width="${f1(round * s)}" stroke-linejoin="round"/>`;
      if (litPts) {
        const lp = litPts.map(P);
        if (!lp.some((p) => !p)) h += `<polygon points="${pp(hull(lp))}" fill="${fill}" stroke="${fill}" stroke-width="${f1(round * s * 0.7)}" stroke-linejoin="round"/>`;
      }
      return push(z + bias, `<polygon points="${pp(hh)}" fill="${OUTLINE}" stroke="${OUTLINE}" stroke-width="${f1(round * s + OUT * 2)}" stroke-linejoin="round"/>`, h);
    };
    const ring = (c, y, w, dp, fw, lt, axis = up) => Array.from({ length: 12 }, (_, k) => {
      const a = (k / 12) * Math.PI * 2;
      return add(c, sum(mul(axis, y), mul(lt, Math.cos(a) * w), mul(fw, Math.sin(a) * dp)));
    });
    const farShade = (c, near) => (near ? c : dark(c, 0.16));
    // A tattoo decal (see tattoos.js) laid on the head sphere around the lead eye and drawn into the head, so it never
    // sorts against the skin. It is skipped when that side of the head faces away from the camera.
    const tattooDecal = (host, tat, hUp, hFwd) => {
      const c = toCam(J.head), n0 = norm(add(add(mul(hFwd, 0.7), mul(lat, 0.7)), mul(hUp, 0.12)));
      if (dot(n0, c) < 0.15) return;
      const eUp = norm(sub(hUp, mul(n0, dot(hUp, n0)))); let eR = norm(cross(eUp, n0)); if (dot(eR, lat) < 0) eR = mul(eR, -1);
      const d = tat.paths.map((path) => {
        const ps = path.map(([x, y]) => {
          const q = add(mul(n0, 39), add(mul(eR, (x - tat.eye[0]) * tat.scale), mul(eUp, -(y - tat.eye[1]) * tat.scale)));
          let n = norm(q); if (dot(n, c) < 0.02) n = norm(sub(n, mul(c, dot(n, c) - 0.02)));   // past the horizon: hold it on the head's outline
          return P(add(J.head, mul(n, 39)));
        });
        return ps.some((q) => !q) ? "" : "M" + ps.map((q) => `${f1(q.x)},${f1(q.y)}`).join("L") + "Z";
      }).join("");
      if (d) wear(host, () => push(0, "", `<path d="${d}" fill="#0b0b0b" fill-opacity=".92" fill-rule="evenodd"/>`));
    };
    // A filled polygon with the same rounded stroke and outline as a blob (for shapes that are not convex).
    const shape = (pts, fill, round) => {
      const ps = pts.map(P); if (ps.some((q) => !q)) return;
      const sc = ps.reduce((a, q) => a + q.s, 0) / ps.length, pp = ps.map((q) => `${f1(q.x)},${f1(q.y)}`).join(" ");
      return push(ps.reduce((a, q) => a + q.z, 0) / ps.length,
        `<polygon points="${pp}" fill="${OUTLINE}" stroke="${OUTLINE}" stroke-width="${f1(round * sc + OUT * 2)}" stroke-linejoin="round"/>`,
        `<polygon points="${pp}" fill="${fill}" stroke="${fill}" stroke-width="${f1(round * sc)}" stroke-linejoin="round"/>`);
    };
    // A garment that wraps the body is drawn as its wall: the strip of it that faces the camera, between two rings
    // [height, half width, half depth]. A filled hull would also fill the opening on top, which reads as an oval on
    // the body and, seen from above, covers it.
    const wall = (c, a, b, fw, lt, fill, round) => {
      const N = 24, ang = (k) => (k / N) * Math.PI * 2;
      const at = (k, r) => add(c, sum(mul(up, r[0]), mul(lt, Math.cos(ang(k)) * r[1]), mul(fw, Math.sin(ang(k)) * r[2])));
      const vis = Array.from({ length: N }, (_, k) => dot(add(mul(lt, Math.cos(ang(k)) / a[1]), mul(fw, Math.sin(ang(k)) / a[2])), toCam(at(k, a))) > 0);
      const k0 = vis.findIndex((v, k) => v && !vis[(k + N - 1) % N]);
      if (k0 < 0) return;
      const ks = [(k0 + N - 1) % N]; for (let k = k0; vis[k % N]; k++) ks.push(k % N); ks.push((ks[ks.length - 1] + 1) % N);
      return shape(ks.map((k) => at(k, a)).concat(ks.slice().reverse().map((k) => at(k, b))), fill, round);
    };
    // Hair is a patch of the head sphere: the part within `half` degrees of an axis tilted `tilt` degrees back from
    // the top. Only the part facing the camera is drawn, and it is drawn into the head itself (like a garment), so it
    // never sorts against the skin: a crescent of crown from the front, the cap from the side and back.
    const ortho = (v) => { const t = Math.abs(v.y) < 0.9 ? V(0, 1, 0) : V(1, 0, 0), u = norm(cross(v, t)); return [u, cross(v, u)]; };
    const hairCap = (host, hUp, hFwd, tilt, half, color) => {
      const a = norm(add(mul(hUp, Math.cos(tilt * R)), mul(hFwd, -Math.sin(tilt * R)))), c = toCam(J.head);
      const ca = Math.cos(half * R), sa = Math.sin(half * R), [u, v] = ortho(a), [w1, w2] = ortho(c);
      const N = 48, ring = [], vis = [];
      for (let k = 0; k < N; k++) {
        const th = (k / N) * Math.PI * 2;
        ring.push(add(mul(a, ca), mul(add(mul(u, Math.cos(th)), mul(v, Math.sin(th))), sa)));
        vis.push(dot(ring[k], c));
      }
      if (!vis.some((d) => d > 0)) return;
      const pts = [];
      if (vis.every((d) => d > 0)) pts.push(...ring);
      else {
        const edge = (i, j) => norm(lerp(ring[i], ring[j], vis[i] / (vis[i] - vis[j])));   // where the cap's edge crosses the head's outline
        const k0 = vis.findIndex((d, k) => d > 0 && vis[(k + N - 1) % N] <= 0);
        pts.push(edge((k0 + N - 1) % N, k0));
        let k = k0; while (vis[k % N] > 0) pts.push(ring[k++ % N]);
        pts.push(edge((k + N - 1) % N, k % N));
        // close the shape along the head's outline, through the stretch of it that is inside the cap
        const ang = (n) => Math.atan2(dot(n, w2), dot(n, w1)), from = ang(pts[pts.length - 1]), to = ang(pts[0]);
        let d = ((to - from + 3 * Math.PI) % (2 * Math.PI)) - Math.PI;
        const at = (f) => add(mul(w1, Math.cos(f)), mul(w2, Math.sin(f)));
        if (dot(at(from + d / 2), a) < ca) d += d > 0 ? -2 * Math.PI : 2 * Math.PI;
        for (let i = 1; i < 10; i++) pts.push(at(from + (d * i) / 10));
      }
      const ps = pts.map((n) => P(add(J.head, mul(n, 39))));
      if (ps.some((q) => !q)) return;
      const poly = ps.map((q) => `${f1(q.x)},${f1(q.y)}`).join(" ");
      wear(host, () => push(0, `<polygon points="${poly}" fill="${OUTLINE}" stroke="${OUTLINE}" stroke-width="${OUT * 2}" stroke-linejoin="round"/>`, `<polygon points="${poly}" fill="${color}"/>`));
    };

    for (const [k, s] of [["F", 1], ["B", -1]]) {
      // Arm: a round shoulder, upper arm, forearm, a white wrap band at the wrist, a cuffed glove with a thumb.
      const n = sideNear(s, J["el" + k]);
      const skin = farShade(look.skin, n), glove = farShade(corner, n);
      const sh = J["sh" + k], el = J["el" + k], gl = J["gl" + k];
      const fd = norm(sub(gl, el));
      disc(sh, 25, skin, 1, false);
      seg(sh, el, 30, skin);
      const wrist = sub(gl, mul(fd, 36));
      wear(seg(el, wrist, 27, skin), () => {
        seg(sub(wrist, mul(fd, 8)), add(wrist, mul(fd, 4)), 28, farShade("#f1ede6", n), 0, false);
        seg(add(wrist, mul(fd, 4)), sub(gl, mul(fd, 14)), 36, dark(glove, 0.12), 0, false);
      });
      disc(gl, 30, glove, -2);
      const thumbDir = norm(add(mul(up, 0.75), mul(lat, -s * 0.55)));
      disc(add(add(gl, mul(thumbDir, 22)), mul(fd, -4)), 12, glove, -2.5, false);
      // Leg: thigh, a trunk leg with a side stripe in the corner color, shin, sock, boot.
      const nl = sideNear(s, J["knee" + k]);
      const leg = farShade(look.skin, nl), trunks = farShade(look.trunks, nl), boot = farShade(look.boots, nl);
      const hip = J["hip" + k], knee = J["knee" + k], ankle = J["ankle" + k], toe = J["toe" + k];
      const tEnd = lerp(hip, knee, 0.55), out3 = mul(latP, s * 25);
      wear(seg(hip, knee, 38, leg), () => {
        seg(hip, tEnd, 54, trunks);
        if (dot(mul(latP, s), toCam(hip)) > 0.15) seg(add(hip, out3), add(tEnd, out3), 9, corner, 0, false);
      });
      wear(seg(knee, lerp(knee, ankle, 0.58), 32, leg), () => {
        seg(lerp(knee, ankle, 0.56), lerp(knee, ankle, 0.66), 34, farShade(look.socks, nl), 0, false);
        seg(lerp(knee, ankle, 0.64), ankle, 35, boot);
      });
      seg(ankle, toe, 28, boot, -1);
    }
    // Torso: tapered (rounded shoulders to narrower hips, deeper at the chest), lit on top.
    const tPts = ring(shC, 18, 46, 20, fwd, lat).concat(ring(shC, -35, 48, 28, fwd, lat), ring(hipC, 30, 34, 23, fwdP, latP), ring(hipC, 0, 35, 21, fwdP, latP));
    const litPts = ring(shC, 18, 46, 20, fwd, lat).concat(ring(shC, -50, 44, 26, fwd, lat));
    // Trunks with a waistband in the corner color, worn over the torso.
    wear(blob(tPts, look.skin, 20, 0, litPts), () => {
      if (look.top) {
        // Tank top, worn over the torso: the torso's own shape from under the collarbones down (so no skin shows at
        // the sides), leaving the shoulders bare, with two straps over them.
        const top = look.top, tk = ring(shC, -12, 36, 25, fwd, lat).concat(ring(shC, -35, 48, 28, fwd, lat), ring(hipC, 30, 34, 23, fwdP, latP), ring(hipC, 0, 35, 21, fwdP, latP));
        blob(tk, top, 20, 0, ring(shC, -12, 36, 25, fwd, lat).concat(ring(shC, -50, 40, 26, fwd, lat)));
        for (const s of [1, -1]) {
          const hi = add(shC, add(mul(up, 14), mul(lat, s * 19))), lo = add(shC, add(mul(up, -16), mul(lat, s * 27)));
          // Only the straps on the side facing the camera: they are drawn over the torso, not sorted against it.
          for (const f of [1, -1]) if (f * dot(fwd, toCam(shC)) > -0.25) seg(add(hi, mul(fwd, f * 6)), add(lo, mul(fwd, f * 14)), 13, top, 0, false);
        }
      }
      wall(hipC, [34, 46, 31], [-26, 48, 32], fwdP, latP, look.trunks, 7);   // wider than the hips' silhouette so no skin shows past the sides
      wall(hipC, [40, 46, 31], [28, 46, 31], fwdP, latP, corner, 3);
    });
    // Neck, head, ears, hair. No face: the hair and ears show which way the head faces.
    const hUp = norm(sub(J.head, shC)), hFwd = norm(sub(fwd, mul(hUp, dot(fwd, hUp))));
    seg(add(shC, mul(up, 15)), sub(J.head, mul(hUp, 26)), 30, look.skin, 6);
    const head = disc(J.head, 39, look.skin, -1);
    for (const s of [1, -1]) disc(add(add(J.head, mul(lat, s * 36)), mul(hFwd, -12)), 9, dark(look.skin, 0.1), -0.8, false);
    const hc = look.hairColor, cap = (tilt, half) => hairCap(head, hUp, hFwd, tilt, half, hc);
    const tat = look.tattoo && window.SportsTattoos && window.SportsTattoos[look.tattoo];
    if (tat) tattooDecal(head, tat, hUp, hFwd);
    // Hair is a cap set high and back on the head, so from behind the lower head and neck still show as skin.
    if (look.hair === "short") cap(28, 66);
    if (look.hair === "buzz") cap(24, 62);
    if (look.hair === "bun") { cap(28, 66); disc(add(J.head, add(mul(hUp, 32), mul(hFwd, -30))), 17, hc, 0, false); }
    if (look.hair === "locs" || look.hair === "braids") {
      cap(32, 70);
      const strands = look.hair === "locs" ? [-26, -13, 0, 13, 26] : [-18, 0, 18];
      for (const x of strands) {
        const a = add(J.head, sum(mul(hUp, 8), mul(hFwd, -26), mul(lat, x)));
        seg(a, add(a, sum(mul(hUp, -62), mul(hFwd, -14), mul(lat, x * 0.3))), look.hair === "locs" ? 13 : 16, hc, 0, false);
      }
    }
    return out;
  }

  // ---------- Fighters ----------
  function mount(S, look, opts = {}) {
    const f = { look, stage: S, foe: null, state: { ...ZERO, ...window.SportsPoses.guard, x: opts.x || 0, z: opts.z || 0, facing: opts.facing || 0, bob: 0, sway: 0, ko: -1 } };
    S.fighters.push(f);
    return f;
  }
  // Make two fighters opponents: each one's reaching punches land on the other's chin.
  const face = (a, b) => { a.foe = b; b.foe = a; };
  const headOf = (f) => (f.state.ko >= 0 && f.rag ? joints(f).head : fk(f.state, null).head);
  function joints(f) {
    if (f.state.ko < 0 || !f.rag) {
      const chin = f.foe ? () => { const h = headOf(f.foe); return add(h, V(0, -16, 0)); } : null;
      return fk(f.state, chin);
    }
    const fr = f.rag, i = Math.min(fr.length - 1, f.state.ko * 60), a = Math.floor(i), b = Math.min(fr.length - 1, a + 1), t = i - a;
    const J = {};
    for (const k in fr[a]) J[k] = add(mul(fr[a][k], 1 - t), mul(fr[b][k], t));
    return J;
  }

  // Gloves are solid against the opponent: after both fighters are posed, a glove that would pass into the other
  // fighter's head or chest stops on its surface (a landed punch does not sink in), and its arm re-bends to reach.
  const GLOVE = 30, HEAD = 39, CHEST = 30, TOUCH = 0.92;
  function collide(fs) {
    const reach = (J, k, g) => {
      const sh = J["sh" + k], to = sub(g, sh), d = Math.min(len(to), L.arm + L.glove - 1), dir = norm(to);
      let pole = sub(J["el" + k], sh); pole = norm(sub(pole, mul(dir, dot(pole, dir))));
      const ca = Math.max(-1, Math.min(1, (L.arm * L.arm + d * d - L.glove * L.glove) / (2 * L.arm * d)));
      J["el" + k] = add(sh, add(mul(dir, L.arm * ca), mul(pole, L.arm * Math.sqrt(1 - ca * ca))));
      J["gl" + k] = add(sh, mul(dir, d));
    };
    const out = (g, c, r) => { const v = sub(g, c), d = len(v); return d < r && d > 0.001 ? add(c, mul(v, r / d)) : g; };
    const seg = (p, a, b) => { const ab = sub(b, a), t = Math.max(0, Math.min(1, dot(sub(p, a), ab) / (dot(ab, ab) || 1))); return add(a, mul(ab, t)); };
    const live = fs.filter((f) => f.J && f.J.glF && f.J.glB);
    for (const f of live) for (const k of ["F", "B"]) {
      let g = f.J["gl" + k];
      // Only the opponent's head and chest, and only when the punch aims at his real body: a punch aimed at a frozen
      // spot is a miss, and pushing it off the dodging head makes it wobble around him. Pushing gloves off each other
      // or off the fighter's own face makes them slide every frame, which reads as liquid.
      for (const o of live) if (o !== f && f.foe && f.foe.state === o.state) {
        g = out(g, o.J.head, (HEAD + GLOVE) * TOUCH);
        g = out(g, seg(g, mid(o.J.shF, o.J.shB), mid(o.J.hipF, o.J.hipB)), (CHEST + GLOVE) * TOUCH);
      }
      if (g !== f.J["gl" + k]) reach(f.J, k, g);
    }
  }

  const bind = (tl, S) => { tl.eventCallback("onUpdate", S.render); return tl; };
  function pose(tl, f, name, t, dur = 0.35, ease = "power3.inOut") {
    const target = window.SportsPoses[name];
    if (!target) throw new Error(`Unknown pose "${name}"`);
    tl.to(f.state, { ...ZERO, ...target, duration: dur, ease }, t);
  }
  // A gentle breathing bounce and weight drift. amp is the knee dip (0 holds still); the second fighter runs 12%
  // slower so the two never bounce in step.
  function idle(tl, f, from, to, amp = 2.5, period = 1.4) {
    const p = period * (1 + 0.12 * (f.stage.fighters.indexOf(f) % 2)), sw = amp / 7;
    const n = Math.max(1, Math.floor((to - from) / p));
    tl.fromTo(f.state, { bob: 0 }, { bob: amp, duration: p / 2, ease: "sine.inOut", yoyo: true, repeat: n * 2 - 1, immediateRender: false }, from);
    const m = Math.max(1, Math.floor((to - from) / (p * 3)));
    tl.fromTo(f.state, { sway: -sw }, { sway: sw, duration: p * 1.5, ease: "sine.inOut", yoyo: true, repeat: m * 2 - 1, immediateRender: false }, from);
  }
  // Fighters fade into the lit ring at t. Hide them first so nothing sits on the frame edge while the title is
  // still up; slide them about 60 units into their spots (tween f.state.x from 60 units out) as they appear.
  function appear(tl, S, t, dur = 0.4) {
    const layer = (l) => S.svg.querySelector(`[data-l="${l}"]`);
    gsap.set([layer("shadow"), layer("bodies"), layer("outline")], { opacity: 0 });
    tl.to([layer("shadow"), layer("bodies")], { opacity: 1, duration: dur, ease: "power2.out" }, t);
    tl.to(layer("outline"), { opacity: 0.7, duration: dur, ease: "power2.out" }, t);
  }
  function camera(tl, S, to, t, dur = 0.55, ease = "power2.inOut") {
    tl.to(S.cam, { ...to, duration: dur, ease }, t);
  }
  const view = (tl, S, name, t, extra = {}, dur = 0.55) => camera(tl, S, { ...VIEWS[name], ...extra }, t, dur, "power2.inOut");
  function shake(tl, S, t, amp = 14) {
    [[amp, -amp * 0.6], [-amp * 0.7, amp * 0.5], [amp * 0.4, -amp * 0.3], [0, 0]].forEach(([x, y], i) =>
      tl.to(S.cam, { shakeX: x, shakeY: y, duration: 0.05, ease: "none" }, t + i * 0.05));
  }

  // ---------- Ragdoll ----------
  const RADIUS = { head: 39, shF: 34, shB: 34, hipF: 30, hipB: 30, elF: 15, elB: 15, glF: 30, glB: 30, kneeF: 19, kneeB: 19, ankleF: 16, ankleB: 16, toeF: 14, toeB: 14 };
  const STICKS = [
    ["shF", "shB"], ["hipF", "hipB"], ["shF", "hipF"], ["shB", "hipB"], ["shF", "hipB"], ["shB", "hipF"],
    ["head", "shF"], ["head", "shB"], ["head", "hipF", 0.35], ["head", "hipB", 0.35],
    ["shF", "elF"], ["elF", "glF"], ["shB", "elB"], ["elB", "glB"],
    ["hipF", "kneeF"], ["kneeF", "ankleF"], ["ankleF", "toeF"], ["kneeF", "toeF"],
    ["hipB", "kneeB"], ["kneeB", "ankleB"], ["ankleB", "toeB"], ["kneeB", "toeB"],
    ["shF", "glF", 0.3, 70], ["shB", "glB", 0.3, 70], ["hipF", "ankleF", 0.3, 110], ["hipB", "ankleB", 0.3, 110],
    ["kneeF", "kneeB", 0.2, 40],
  ];
  // Verlet ragdoll on the same joints, simulated once at load. vel maps a joint ("kneeF") or a group
  // ("head", "upper", "hips", "legs") to [x, y, z] units/s. Buckle the knees (knees forward and down,
  // hips down) so he crumples before he tips.
  // opts.x / opts.z: where he stands when hit (defaults to his current spot).
  function ragdoll(f, poseName, vel = {}, opts = {}) {
    const seconds = opts.seconds || 2.5;
    const st = { ...ZERO, ...window.SportsPoses[poseName], x: opts.x ?? f.state.x, z: opts.z ?? f.state.z, facing: f.state.facing, bob: 0, sway: 0 };
    const J0 = fk(st, null);
    const names = Object.keys(RADIUS);
    const pos = {}, prev = {}, dt = 1 / 60, g = 2900;
    const groupOf = (n) => n === "head" ? "head" : /^(sh|el|gl)/.test(n) ? "upper" : n.startsWith("hip") ? "hips" : "legs";
    for (const n of names) {
      pos[n] = { ...J0[n] };
      const v = vel[n] || vel[groupOf(n)] || [0, 0, 0];
      prev[n] = sub(pos[n], mul(V(v[0], v[1], v[2]), dt));
    }
    const sticks = STICKS.map(([a, b, k = 1, min]) => ({ a, b, k, min, len: min ? null : len(sub(J0[a], J0[b])) }));
    const frames = [];
    const snap = () => { const o = {}; for (const n of names) o[n] = { ...pos[n] }; frames.push(o); };
    snap();
    for (let step = 0; step < seconds * 60; step++) {
      for (const n of names) {
        const p = pos[n], q = prev[n];
        prev[n] = p;
        pos[n] = V(p.x + (p.x - q.x) * 0.995, p.y + (p.y - q.y) * 0.995 - g * dt * dt, p.z + (p.z - q.z) * 0.995);
      }
      for (let it = 0; it < 16; it++) {
        for (const s of sticks) {
          const a = pos[s.a], b = pos[s.b], d = sub(b, a), l = len(d) || 1;
          if (s.min && l >= s.min) continue;
          const corr = mul(d, ((l - (s.min || s.len)) / l) * 0.5 * s.k);
          pos[s.a] = add(a, corr); pos[s.b] = sub(b, corr);
        }
        for (const n of names) {
          const r = RADIUS[n], p = pos[n];
          if (p.y < r) {
            const q = prev[n];
            pos[n] = V(p.x, r, p.z);
            prev[n] = V(p.x - (p.x - q.x) * 0.55, r, p.z - (p.z - q.z) * 0.55);
          }
        }
      }
      snap();
    }
    f.rag = frames;
    return frames;
  }

  // A whole knockdown in one call. Builds the ragdoll for `loser` from his hit pose (opts.x: where he stands at
  // t, as the timeline has him), plays it from t in slow motion for the first 0.3 simulated s and then at full
  // speed, shakes the camera, and swings it to the side he falls toward. opts.kind "straight" (default) drives
  // the head back along the punch, "hook" turns it away. Poses his hit (SportsRig.pose "hit") before t; returns
  // the time he is down.
  function knockout(tl, S, loser, t, opts = {}) {
    const x = opts.x ?? loser.state.x, dir = loser.state.facing === 180 ? 1 : -1, hook = opts.kind === "hook";
    ragdoll(loser, "hit", {
      head: [140 * dir, -40, hook ? -300 : 0], upper: [60 * dir, -160, hook ? -150 : 0], hips: [-40 * dir, -420, -20],
      kneeF: [-300 * dir, -140, 0], kneeB: [-300 * dir, -140, 0],
    }, { x, z: opts.z });
    tl.fromTo(loser.state, { ko: -0.001 }, { ko: 0.3, duration: 0.9, ease: "none", immediateRender: false }, t);
    tl.fromTo(loser.state, { ko: 0.3 }, { ko: 2.5, duration: 1.5, ease: "power1.in", immediateRender: false }, t + 0.9);
    shake(tl, S, t, 18);
    camera(tl, S, { yaw: 44 * dir, pitch: 24, ty: 200, tx: x * 0.76, tz: hook ? -60 : 0, dist: 2600, roll: 3 * dir, cy: 760 }, t + 0.05, 1.4, "power2.out");
    return t + 2.4;
  }
  // Back on his feet in guard at x (a hard reset, for a replay after a knockdown).
  const stand = (tl, f, t, x, z = 0) => tl.set(f.state, { ...ZERO, ...window.SportsPoses.guard, ko: -1, x, z }, t);
  // Fade a floor note, body mark, or ghost in at t and out `hold` seconds after it settles.
  function show(tl, n, t, hold = 1.2) {
    tl.fromTo(n, { o: 0, p: 0 }, { o: 1, p: 1, duration: 0.35, ease: "power3.out", immediateRender: false }, t);
    tl.to(n, { o: 0, duration: 0.25, ease: "power2.in" }, t + 0.35 + hold);
    return n;
  }

  return { stage, bind, mount, face, pose, idle, appear, camera, view, shake, ragdoll, knockout, stand, show, fk, LOOKS, SKIN, CORNER, VIEWS, L };
})();
