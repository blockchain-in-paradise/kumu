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

  // Stance: the poses are authored right side forward (southpaw); MIR = -1 mirrors every body to orthodox (left side
  // forward, so the lead jab is the left hand). fk mirrors the joints across the fight line; anything that derives a
  // fighter's forward from his joints multiplies by MIR to keep it pointing the way he faces.
  const MIR = -1;
  const L = { thigh: 125, shin: 125, foot: 40, arm: 95, fore: 85, glove: 100, spine: 155, hipW: 26, shW: 44, ankle: 13 };

  // Corner colors (the broadcast convention) and a set of real skin tones.
  const CORNER = { red: "#d2333a", blue: "#2c66d3" };
  const SKIN = { porcelain: "#f0d2bc", light: "#e2b48e", tan: "#c68b5f", olive: "#a97a52", brown: "#875839", deep: "#5e3b27", ebony: "#40291c" };
  // A look: skin, hair ("short", "buzz", "bun", "bald", "locs", "braids"), hairColor, trunks, corner ("red" or
  // "blue": gloves, waistband, side stripe), boots, socks, top (a tank top color, or null for bare chest), and optional
  // beard (a color: a goatee, moustache into chin beard, with a mouth opening), tattoo (see tattoos.js), print (trunks
  // pattern: "leopard", or its alias "cheetah") and waistband (a color, instead of the corner color).
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
    legF: 0, shinF: 0, legB: 0, shinB: 0, legAbdF: 0, legAbdB: 0, reachF: 0, reachB: 0, hookF: 0, hookB: 0, upF: 0, upB: 0, overF: 0, overB: 0, body: 0, block: 0 };

  function limbDir(f, a, abd, s) {
    let d = rot(mul(f.Y, -1), f.Z, -a * R), axis = f.Z;
    d = rot(d, f.X, -s * abd * R); axis = rot(axis, f.X, -s * abd * R);
    return { d, axis };
  }

  // Forward kinematics: pose state to world joints. bob dips through the knees; sway shifts weight.
  // chin(target) returns the opponent's chin, or null; reaching arms solve a two-bone IK onto it.
  function fk(st, chin) {
    const F0 = turn({ X: V(1, 0, 0), Y: V(0, 1, 0), Z: V(0, 0, 1) }, V(0, 1, 0), st.facing);
    // Wobble lanes (SportsRig.wobble) add on top of the pose, scaled by wobbleMix (tween it to 0 to set a punch).
    const wm = st.wobbleMix ?? 1, sway = st.sway + (st.wobbleSway || 0) * wm;
    const P = turn(F0, F0.Y, st.hipYaw + sway * 3);
    const C1 = turn(P, P.Y, st.chestYaw), C2 = turn(C1, C1.Z, -st.torso), C = turn(C2, C2.X, st.roll + sway * 2 + (st.wobbleRoll || 0) * wm);
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
    const pc = V(st.x + sway * 6, L.ankle - low, st.z + (st.wobbleZ || 0) * wm);
    legs(pc);
    for (const k of ["F", "B"]) {
      const lift = J["ankle" + k].y - L.ankle, tip = Math.asin(Math.min(1, lift / L.foot));
      J["toe" + k] = add(J["ankle" + k], add(mul(F0.X, L.foot * Math.cos(tip)), mul(F0.Y, -L.foot * Math.sin(tip))));
    }
    const neck = at(C, pc, 0, L.spine + 22, 0);
    J.head = add(add(neck, rot(mul(C.Y, 50), C.Z, -st.head * R)), mul(C.X, 6));
    let target = chin && chin();
    if (target && MIR < 0) target = V(target.x, target.y, -target.z);   // into the unmirrored frame the IK solves in
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
          // A body hook (st.body) keeps the elbow out to the side, level with the fist (dropping it under the line
          // folded the upper arm into his own chest and read as a dislocated arm).
          const a = sum(mul(out, hk + ok * 0.7), V(0, ok * 0.7 - uk - 0.15 * hk * (st.body || 0), 0));
          const ap = norm(sub(a, mul(norm(to), dot(a, norm(to)))));
          const sw = 75 * R * Math.sqrt(1 - w) * Math.min(1, bw * 2), r = len(to);
          // Bent all the way through: the reach stays between near and far, so out of range the punch falls short
          // instead of straightening into a jab. Throw these from close range (see style.md).
          // A body hook reaches further down and across (the target is low and to the side), so it lands instead of
          // falling short and twisting the arm.
          const n = hk + uk + ok, bd = st.body || 0;
          const near = (115 * hk + 110 * uk + 150 * ok) / n + 25 * bd, far = (135 * hk + 135 * uk + 170 * ok) / n + 45 * bd;
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
    if (MIR < 0) for (const k in J) J[k] = V(J[k].x, J[k].y, -J[k].z);
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
  // The liver: under the lower ribs on the fighter's right side, toward the front. The rig's lead side (F) is his right
  // (the fighters stand right side forward), so the liver sits on the F side and the heart and stomach on the B side.
  // liverAt is the organ's center; liverSurface the spot on the body a liver punch aims at.
  const trunk = (J) => {
    const shC = mid(J.shF, J.shB), hipC = mid(J.hipF, J.hipB), up = norm(sub(shC, hipC)), f0 = norm(cross(up, sub(J.shF, J.shB)));
    return { shC, hipC, up, fwd: mul(f0, MIR), lat: cross(f0, up), right: mul(cross(f0, up), MIR) };   // lat: toward the lead (F) side
  };
  const liverAt = (J) => { const T = trunk(J); return sum(lerp(T.hipC, T.shC, 0.45), mul(T.right, 13), mul(T.fwd, 4)); };
  // On the front of his right side, so the hook lands on the ribs instead of wrapping around behind him.
  const liverSurface = (J) => { const T = trunk(J); return sum(lerp(T.hipC, T.shC, 0.5), mul(T.right, 24), mul(T.fwd, 30)); };
  const PARTS = {
    liver: liverAt, ribs: (J) => { const T = trunk(J); return sum(lerp(T.hipC, T.shC, 0.55), mul(T.right, 28), mul(T.fwd, 12)); },
    shoulders: (J) => { const T = trunk(J); return add(T.shC, mul(T.up, 6)); },
    head: (J) => J.head, chest: (J) => lerp(mid(J.shF, J.shB), mid(J.hipF, J.hipB), 0.35),
    waist: (J) => lerp(mid(J.hipF, J.hipB), mid(J.shF, J.shB), 0.15),
    leadKnee: (J) => J.kneeF, rearKnee: (J) => J.kneeB, leadFoot: (J) => J.ankleF, rearFoot: (J) => J.ankleB,
    leadGlove: (J) => J.glF, rearGlove: (J) => J.glB,
    leadElbow: (J) => J.elF, rearElbow: (J) => J.elB, leadShoulder: (J) => J.shF, rearShoulder: (J) => J.shB,
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
    // The bodies (and each ghost) are a WebGL canvas inside the SVG, so they keep their place between its layers.
    const glLayer = (g) => {
      const fo = document.createElementNS("http://www.w3.org/2000/svg", "foreignObject");
      for (const [k, v] of [["x", 0], ["y", 0], ["width", 1080], ["height", 1920]]) fo.setAttribute(k, v);
      const c = document.createElement("canvas"), dpr = Math.max(1, window.devicePixelRatio || 1);
      c.width = 1080 * dpr; c.height = 1920 * dpr; c.style.cssText = "width:1080px;height:1920px;display:block";
      fo.appendChild(c); g.appendChild(fo);
      return { fo, draw: painter(c) };
    };
    const bodies = glLayer(layer.bodies);
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
    // The camera as a WebGL matrix (column-major), matching S.project exactly: pixel x = cx + right*f/z, y = cy - up*f/z.
    const viewProj = () => {
      const { pos, fw, right, up } = basis, n = 40, F = 30000, W = 1080, H = 1920;
      const cx = cam.cx + cam.shakeX, cy = cam.cy + cam.shakeY;
      const rows = [
        [add(mul(right, (2 * cam.f) / W), mul(fw, (2 * cx) / W - 1)), 0],
        [add(mul(up, (2 * cam.f) / H), mul(fw, 1 - (2 * cy) / H)), 0],
        [mul(fw, (F + n) / (F - n)), (-2 * F * n) / (F - n)],
        [fw, 0],
      ];
      const m = new Float32Array(16);
      rows.forEach(([r, c], k) => { m[k] = r.x; m[4 + k] = r.y; m[8 + k] = r.z; m[12 + k] = c - dot(pos, r); });
      return m;
    };
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
    function drawGhost(g, vp) {
      if (!g.gl) g.gl = glLayer(layer.ghost);
      g.gl.fo.style.display = g.o <= 0.001 ? "none" : "";
      if (g.o <= 0.001) return;
      g.gl.fo.setAttribute("opacity", (g.o * 0.38).toFixed(3));
      const B = body();
      build(B, { look: g.f.look }, fk({ ...ZERO, x: g.x, z: g.z, facing: g.f.state.facing, bob: 0, sway: 0, ...window.SportsPoses[g.pose] }, null));
      g.gl.draw(B, vp, "ghost");
    }
    let floorKey = "";
    S.render = () => {
      if (settled !== S.fighters.reduce((n, f) => n + (f.poses || []).length, 0)) settle();
      S.setup();
      const key = CAM_KEYS.map((k) => cam[k]).join();
      if (key !== floorKey) { layer.floor.innerHTML = drawFloor(); floorKey = key; }
      layer.notes.innerHTML = drawLine() + S.notes.map(drawNote).join("");
      let shadows = "";
      const B = body(), vp = viewProj();
      S.solve();
      for (const f of S.fighters) {
        shadows += shadowOf(S, f.J);
        build(B, f, f.J);
      }
      layer.shadow.innerHTML = shadows;
      S.ghosts.forEach((g) => drawGhost(g, vp));
      bodies.draw(B, vp, "body", S.camPos());
      layer.fx.innerHTML = S.marks.map(drawMark).join("");
      S.hooks.forEach((fn) => fn(S));
    };
    // Pose every fighter's joints for the current state without drawing (the motion audit reads them).
    S.solve = () => { for (const f of S.fighters) f.J = joints(f); collide(S.fighters); };
    // One move at a time, whatever order the script wrote them in: once the timeline is built (the first render), a
    // pose move still running when the same fighter's next move starts is trimmed to finish just then (dropped if it
    // had barely begun). Two moves on top of each other stop the limbs dead mid-motion, which reads as a twitch. A snap
    // (power4: a punch, a hit) may interrupt.
    let settled = -1;   // how many pose moves the last pass saw (a render during the build runs it early; rerun on more)
    const settle = () => {
      settled = S.fighters.reduce((n, f) => n + (f.poses || []).length, 0);
      for (const f of S.fighters) {
        // Times come from the timeline itself (a script may shift scenes after building them).
        const at = (p) => p.tween.startTime(), end = (p) => p.tween.startTime() + p.tween.duration();
        const ps = (f.poses || []).filter((p) => p.tween.parent).sort((a, b) => at(a) - at(b));
        for (let i = 0; i < ps.length; i++) {
          const a = ps[i], next = ps.slice(i + 1).find((b) => at(b) > at(a) + 0.01 && at(b) < end(a) - 0.03);
          if (!next || /power4/.test(next.ease)) continue;
          const keep = at(next) - at(a);
          if (keep < 0.08) a.tween.parent.remove(a.tween);
          else a.tween.duration(keep);
        }
      }
    };
    S.onRender = (fn) => S.hooks.push(fn);
    (window.__sportsStages = window.__sportsStages || []).push(S);   // read by scripts/motion-audit.mjs
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

  // ---------- Mannequin (WebGL) ----------
  // The fighters are solid 3D shapes (capsules, spheres, and ring-built torso and shorts) drawn with a depth buffer, so
  // every part hides exactly what is behind it, at any angle and in any pose: there is no draw order to get wrong. The
  // look stays flat: one lit tone and one shadow tone (light from the overhead spot), and one outline around the outer
  // silhouette only, drawn under all fills. Hair, beard and tattoo are a texture on the head; a trunks print is a
  // texture wrapped around the shorts.
  // Prints for trunks: fabric, spot and rosette-center colors, and the world size of one tile of the pattern.
  const PRINTS = {
    leopard: { base: "#d29d58", spot: "#24160c", center: "#b4753a", tile: 120 },
  };
  PRINTS.cheetah = PRINTS.leopard;
  const OUTW = 2.4;   // outline width, world units
  const LIGHT = norm(V(0.15, 1, 0.45));
  const rgb = (hex) => [1, 3, 5].map((i) => parseInt(hex.slice(i, i + 2), 16) / 255);

  // One draw list: fill triangles grouped by texture (null: none), and the inflated hull triangles for the outline.
  // A fill vertex is position, normal, color, uv, shaded (toon) and textured flags: 13 floats.
  // B.shell(alpha, ghost) opens a see-through layer drawn over the solid parts (an x-ray skin, a ripple).
  function body() {
    const hull = [];
    const make = (fills) => (rows, col, shade, tex, outline) => {
      if (!fills.has(tex)) fills.set(tex, []);
      const arr = fills.get(tex), c = rgb(col);
      const vtx = (q) => arr.push(q.p.x, q.p.y, q.p.z, q.n.x, q.n.y, q.n.z, c[0], c[1], c[2], q.uv ? q.uv[0] : 0, q.uv ? q.uv[1] : 0, shade ? 1 : 0, tex ? 1 : 0);
      const hv = (q) => hull.push(q.p.x + q.n.x * OUTW, q.p.y + q.n.y * OUTW, q.p.z + q.n.z * OUTW);
      for (let i = 0; i + 1 < rows.length; i++) for (let j = 0; j + 1 < rows[i].length; j++) {
        const quad = [rows[i][j], rows[i][j + 1], rows[i + 1][j + 1], rows[i][j], rows[i + 1][j + 1], rows[i + 1][j]];
        for (const q of quad) { vtx(q); if (outline) hv(q); }
      }
    };
    const B = { fills: new Map(), hull, layers: [] };
    B.emit = make(B.fills);
    B.shell = (alpha, ghost = 0) => { const L = { alpha, ghost, fills: new Map(), hull }; L.emit = make(L.fills); B.layers.push(L); return L; };
    return B;
  }
  const perp = (ax) => norm(cross(ax, Math.abs(ax.y) < 0.9 ? V(0, 1, 0) : V(1, 0, 0)));
  // A capsule from a to b. o: shade (false: flat), tex and tile (texture wrapped in world units), outline, e1 (where
  // the texture seam starts).
  function capsule(B, a, b, r, col, o = {}) {
    const d = sub(b, a), l = len(d), ax = l > 1e-6 ? mul(d, 1 / l) : V(0, 1, 0);
    const e1 = o.e1 ? norm(sub(o.e1, mul(ax, dot(o.e1, ax)))) : perp(ax), e2 = cross(ax, e1);
    const NU = 18, ends = [];
    for (let k = 0; k <= 6; k++) ends.push([a, 0, -Math.PI / 2 + (k / 6) * (Math.PI / 2)]);
    for (let k = 0; k <= 6; k++) ends.push([b, l, (k / 6) * (Math.PI / 2)]);
    const rep = o.tile ? Math.max(1, Math.round((2 * Math.PI * r) / o.tile)) : 0;
    const rows = ends.map(([c, s, ph]) => Array.from({ length: NU + 1 }, (_, j) => {
      const th = (j / NU) * 2 * Math.PI, rad = add(mul(e1, Math.cos(th)), mul(e2, Math.sin(th)));
      const n = add(mul(rad, Math.cos(ph)), mul(ax, Math.sin(ph)));
      return { p: add(c, mul(n, r)), n, uv: o.tile ? [(j / NU) * rep, (s + ph * r) / o.tile] : null };
    }));
    B.emit(rows, col, o.shade !== false, o.tex || null, o.outline !== false);
  }
  // A sphere; X (front), Y (up), Z (side) orient its texture: u is longitude from the front toward Z, v latitude.
  function sphere(B, c, r, col, o = {}) {
    const X = o.X || V(1, 0, 0), Y = o.Y || V(0, 1, 0), Z = o.Z || V(0, 0, 1);
    const NU = o.tex ? 40 : 20, NV = o.tex ? 24 : 12, rows = [];
    for (let i = 0; i <= NV; i++) {
      const la = -Math.PI / 2 + (i / NV) * Math.PI, row = [];
      for (let j = 0; j <= NU; j++) {
        const lo = -Math.PI + (j / NU) * 2 * Math.PI;
        const n = sum(mul(X, Math.cos(la) * Math.cos(lo)), mul(Z, Math.cos(la) * Math.sin(lo)), mul(Y, Math.sin(la)));
        row.push({ p: add(c, mul(n, r)), n, uv: [j / NU, i / NV] });
      }
      rows.push(row);
    }
    B.emit(rows, col, o.shade !== false, o.tex || null, o.outline !== false);
  }
  // A body of revolution with elliptical rings, bottom to top: each ring { c, X, Y, Z, h, rx, rz } is the ellipse
  // c + Y*h + X*cos*rx + Z*sin*rz; h, rx and rz may be functions of the angle (a cut edge). A ring with rx = rz = 0
  // closes the end. o.tile wraps a texture (u around, v up); o.nu sets the steps around.
  const val = (v, th) => (typeof v === "function" ? v(th) : v);
  function rings(B, rs, col, o = {}) {
    const NU = o.nu || 32, at = (g, th) => sum(g.c, mul(g.Y, val(g.h, th)), mul(g.X, Math.cos(th) * val(g.rx, th)), mul(g.Z, Math.sin(th) * val(g.rz, th)));
    const grid = rs.map((g) => Array.from({ length: NU + 1 }, (_, j) => at(g, (j / NU) * 2 * Math.PI)));
    const rep = o.tile ? Math.max(1, Math.round((Math.PI * (rs[1].rx + rs[1].rz)) / o.tile)) : 0;
    const rows = grid.map((row, i) => row.map((p, j) => {
      const g = rs[i], th = (j / NU) * 2 * Math.PI;
      let n;
      if (g.rx < 0.5 && g.rz < 0.5) n = i === 0 ? mul(g.Y, -1) : g.Y;
      else {
        n = norm(cross(sub(grid[Math.min(grid.length - 1, i + 1)][j], grid[Math.max(0, i - 1)][j]), sub(at(g, th + 0.01), at(g, th - 0.01))));
        if (dot(n, sub(p, add(g.c, mul(g.Y, val(g.h, th))))) < 0) n = mul(n, -1);
      }
      return { p, n, uv: o.tile ? [(j / NU) * rep, val(g.h, th) / o.tile] : null };
    }));
    B.emit(rows, col, o.shade !== false, o.tex || null, o.outline !== false);
  }

  // Head texture for a look (cached): hair cap, beard with the mouth, tattoo, painted in longitude/latitude around the
  // head's own axes (front, up, side). Transparent where the skin shows.
  const headTex = new WeakMap();
  function headTexture(look) {
    if (headTex.has(look)) return headTex.get(look);
    const W = 1024, H = 512, cv = document.createElement("canvas"); cv.width = W; cv.height = H;
    const ctx = cv.getContext("2d");
    const toPx = (n) => [((Math.atan2(n.z, n.x) + Math.PI) / (2 * Math.PI)) * W, ((Math.PI / 2 - Math.asin(Math.max(-1, Math.min(1, n.y)))) / Math.PI) * H];
    // Tattoo: the decal's outline points laid on the head sphere around the lead eye (front, a little up, lead side).
    const tat = look.tattoo && window.SportsTattoos && window.SportsTattoos[look.tattoo];
    if (tat) {
      // The lead eye: his left in an orthodox stance (MIR -1), his right when unmirrored. Z is the head's left.
      const lat = V(0, 0, -MIR), n0 = norm(V(0.7, 0.12, -0.7 * MIR));
      const eUp = norm(sub(V(0, 1, 0), mul(n0, dot(V(0, 1, 0), n0)))); let eR = norm(cross(eUp, n0)); if (dot(eR, lat) < 0) eR = mul(eR, -1);
      ctx.beginPath();
      for (const path of tat.paths) path.forEach(([x, y], i) => {
        const [px, py] = toPx(norm(sum(mul(n0, 39), mul(eR, (x - tat.eye[0]) * tat.scale), mul(eUp, -(y - tat.eye[1]) * tat.scale))));
        i ? ctx.lineTo(px, py) : ctx.moveTo(px, py);
      });
      ctx.fillStyle = "rgba(11,11,11,.92)"; ctx.fill("evenodd");
    }
    const img = ctx.getImageData(0, 0, W, H), d = img.data;
    const put = (k, c, a = 1) => { d[k] = c[0] * 255; d[k + 1] = c[1] * 255; d[k + 2] = c[2] * 255; d[k + 3] = a * 255; };
    const hair = { short: [28, 66], buzz: [24, 62], bun: [28, 66], locs: [40, 88], braids: [40, 88] }[look.hair];   // long hair covers the sides to the ears and the back to the nape
    const hc = rgb(look.hairColor || "#000000"), bc = look.beard && rgb(look.beard), sk = rgb(look.skin), lip = rgb(dark(look.skin, 0.45));
    const lo0 = (lo) => -60 + 30 * (Math.abs(lo) / 30) ** 2, hi0 = (lo) => (Math.abs(lo) <= 22 ? -12 : -12 - (Math.abs(lo) - 22) * 1.9);
    for (let y = 0; y < H; y++) for (let x = 0; x < W; x++) {
      const lo = ((x + 0.5) / W) * 360 - 180, la = 90 - ((y + 0.5) / H) * 180, k = (y * W + x) * 4;
      if (bc && Math.abs(lo) <= 30 && la >= lo0(lo) && la <= Math.max(lo0(lo), hi0(lo))) put(k, bc);
      if (bc && (lo / 14) ** 2 + ((la + 25) / 5) ** 2 <= 1) put(k, (lo / 10) ** 2 + ((la + 25) / 1.8) ** 2 <= 1 ? lip : sk);
      if (hair) {
        const n = V(Math.cos(la * R) * Math.cos(lo * R), Math.sin(la * R), Math.cos(la * R) * Math.sin(lo * R));
        if (n.y * Math.cos(hair[0] * R) - n.x * Math.sin(hair[0] * R) > Math.cos(hair[1] * R)) put(k, hc);
      }
    }
    ctx.putImageData(img, 0, 0);
    cv.clampV = true;   // latitude does not wrap: repeating it bled the transparent south pole into the crown
    headTex.set(look, cv);
    return cv;
  }
  // One tile of a trunks print (cached): leopard rosettes (a deeper center inside a broken ring of dark spots) and
  // specks, at fixed golden-ratio places; shapes that cross the tile edge repeat on the other side, so it wraps.
  const printTex = new Map();
  function printTexture(pr) {
    if (printTex.has(pr)) return printTex.get(pr);
    const S = 256, k = S / pr.tile, cv = document.createElement("canvas"); cv.width = cv.height = S;
    const ctx = cv.getContext("2d");
    const ell = (x, y, rx, ry, a, color) => {
      ctx.fillStyle = color;
      for (const ox of [-S, 0, S]) for (const oy of [-S, 0, S]) { ctx.beginPath(); ctx.ellipse(x + ox, y + oy, rx, ry, a, 0, 2 * Math.PI); ctx.fill(); }
    };
    for (let i = 0; i < 30; i++) {
      const x = ((i * 0.618034) % 1) * S, y = ((i * 0.381966 + i * 0.0331) % 1) * S, jit = (i * 0.754878) % 1, rot = ((i * 0.56984) % 1) * 2 * Math.PI;
      if (i % 4 === 3) { ell(x, y, (2.6 + jit) * k, (2.2 + jit) * k, rot, pr.spot); continue; }
      const r = (8 + 2.5 * jit) * k, n = 3 + (i % 2);
      ell(x, y, r * 0.85, r * 0.75, rot, pr.center);
      for (let j = 0; j < n; j++) {
        const a = rot + (j / n) * 2 * Math.PI + (((i + j) * 0.381966) % 1) * 0.5;
        ell(x + Math.cos(a) * r, y + Math.sin(a) * r, r * (1.2 / n + 0.1), r * 0.36, a + Math.PI / 2, pr.spot);
      }
    }
    printTex.set(pr, cv);
    return cv;
  }

  // The mannequin for one fighter, added to B. Proportions: a slim tapered torso (shoulder joints at its edge, with
  // ball joints), capsule limbs, a round head; trunks as one garment (a flared waist plus two trunk legs, both
  // wider than the body they cover) with a waistband.
  function build(B, f, J) {
    // X-ray (f.state.xray 0..1): the skin and clothes become a see-through shell and the skeleton and organs show inside.
    const xr = (f.state && f.state.xray) || 0, solid = B;
    // Eased, so the skin thins gently at both ends of the fade instead of popping.
    const xe = xr * xr * (3 - 2 * xr);
    if (xr > 0.001) { anatomy(solid, f, J, xe); B = solid.shell(1 - 0.92 * xe, xe); }
    const look = f.look, corner = CORNER[look.corner] || look.corner, skin = look.skin;
    const print = look.print && PRINTS[look.print], trunks = print ? print.base : look.trunks, band = look.waistband || corner;
    const shC = mid(J.shF, J.shB), hipC = mid(J.hipF, J.hipB), up = norm(sub(shC, hipC));
    const f0 = norm(cross(up, sub(J.shF, J.shB))), lat = cross(f0, up), fwd = mul(f0, MIR);
    const fP0 = norm(cross(up, sub(J.hipF, J.hipB))), latP = cross(fP0, up), fwdP = mul(fP0, MIR);
    const C = (h, rx, rz) => ({ c: shC, X: lat, Y: up, Z: fwd, h, rx, rz }), Pv = (h, rx, rz) => ({ c: hipC, X: latP, Y: up, Z: fwdP, h, rx, rz });
    // Torso: pelvis to shoulders, closed at both ends.
    rings(B, [Pv(-14, 0, 0), Pv(-10, 26, 17), Pv(0, 34, 22), Pv(24, 35, 23), C(-50, 40, 27), C(-20, 41, 28), C(6, 42, 25), C(18, 37, 20), C(26, 24, 13), C(29, 0, 0)], skin);
    if (look.top) {
      // A tank top, snug over the torso (its radii plus 3), with a cut top edge that changes height around the body: a
      // scooped neckline in front, higher across the back near the neck, deep armholes at the sides, rising to the
      // straps' roots. Edge angles in degrees: 0 the lead side, 90 the front, 180 the rear side, 270 the back.
      const TORSO = [[-50, 40, 27], [-20, 41, 28], [6, 42, 25], [18, 37, 20], [26, 24, 13]];
      const torsoR = (h) => {
        let i = 0; while (i < TORSO.length - 2 && h > TORSO[i + 1][0]) i++;
        const [h0, x0, z0] = TORSO[i], [h1, x1, z1] = TORSO[i + 1], t = Math.max(0, Math.min(1, (h - h0) / (h1 - h0)));
        return [x0 + (x1 - x0) * t + 3, z0 + (z1 - z0) * t + 3];
      };
      const EDGE = [[0, -30], [40, -6], [52, 6], [62, 6], [75, -14], [90, -22], [105, -14], [118, 6], [128, 6], [140, -6], [180, -30],
        [220, -6], [235, 10], [250, 10], [270, 8], [290, 10], [305, 10], [320, -6], [360, -30]];
      const edge = (th) => {
        const d = (((th / R) % 360) + 360) % 360; let i = 0; while (EDGE[i + 1][0] < d) i++;
        const [a0, h0] = EDGE[i], [a1, h1] = EDGE[i + 1], t = (1 - Math.cos(((d - a0) / (a1 - a0)) * Math.PI)) / 2;
        return h0 + (h1 - h0) * t;
      };
      const band = (f) => { const h = (th) => -36 + (edge(th) + 36) * f; return { c: shC, X: lat, Y: up, Z: fwd, h, rx: (th) => torsoR(h(th))[0], rz: (th) => torsoR(h(th))[1] }; };
      rings(B, [Pv(-2, 37, 25), Pv(24, 38, 26), C(-50, 43, 30), band(0), band(0.5), band(1)], look.top, { nu: 96 });
      for (const s of [1, -1]) {
        // Each strap is one band over the shoulder, front to back, laid along the torso's surface (points as lateral,
        // height, depth from the shoulder center).
        const at = ([x, h, z]) => sum(shC, mul(lat, s * x), mul(up, h), mul(fwd, z));
        const path = [[28, -16, -24], [25, 6, -23], [24, 18, -17], [24, 27, 0], [24, 18, 17], [25, 6, 23], [28, -16, 24]].map(at);
        for (let i = 0; i + 1 < path.length; i++) capsule(B, path[i], path[i + 1], 6, look.top, { shade: false });
      }
    }
    // Shorts: the waist flares from the waistband to the hips, wide enough to hold the tops of the trunk legs.
    const tex = print ? printTexture(print) : null, tile = print ? print.tile : 0;
    rings(B, [Pv(-24, 0, 0), Pv(-20, 32, 23), Pv(-10, 48, 32), Pv(2, 52, 33), Pv(18, 46, 30), Pv(34, 39, 27), Pv(36, 0, 0)], trunks, { tex, tile });
    rings(B, [Pv(27, 41, 29), Pv(41, 39, 27)], band, { shade: false });
    // Neck and head (hair, beard and tattoo are its texture), ears, and hair that stands off the head.
    const hUp = norm(sub(J.head, shC)), hFwd = norm(sub(fwd, mul(hUp, dot(fwd, hUp)))), side = norm(cross(hUp, hFwd));
    capsule(B, add(shC, mul(up, 15)), sub(J.head, mul(hUp, 26)), 14, skin);
    sphere(B, J.head, 39, skin, { X: hFwd, Y: hUp, Z: side, tex: headTexture(look) });
    for (const s of [1, -1]) sphere(B, add(add(J.head, mul(lat, s * 36)), mul(hFwd, -12)), 9, dark(skin, 0.1));
    if (look.hair === "bun") sphere(B, add(J.head, add(mul(hUp, 32), mul(hFwd, -30))), 17, look.hairColor, { shade: false });
    if (look.hair === "locs" || look.hair === "braids") {
      for (const x of look.hair === "locs" ? [-26, -13, 0, 13, 26] : [-18, 0, 18]) {
        const a = add(J.head, sum(mul(hUp, 8), mul(hFwd, -26), mul(lat, x)));
        capsule(B, a, add(a, sum(mul(hUp, -62), mul(hFwd, -14), mul(lat, x * 0.3))), look.hair === "locs" ? 6.5 : 8, look.hairColor, { shade: false });
      }
    }
    for (const [k, s] of [["F", 1], ["B", -1]]) {
      // Arm: a ball shoulder, upper arm, forearm, a white wrap at the wrist, a cuffed glove with a thumb.
      const sh = J["sh" + k], el = J["el" + k], gl = J["gl" + k], fd = norm(sub(gl, el)), wrist = sub(gl, mul(fd, 36));
      sphere(B, sh, 16, skin);
      capsule(B, sh, el, 15, skin);
      capsule(B, el, wrist, 13.5, skin);
      capsule(B, sub(wrist, mul(fd, 8)), add(wrist, mul(fd, 4)), 14, "#f1ede6", { shade: false });
      capsule(B, add(wrist, mul(fd, 4)), sub(gl, mul(fd, 14)), 18, dark(corner, 0.12), { shade: false });
      sphere(B, gl, 30, corner);
      const thumbDir = norm(add(mul(up, 0.75), mul(lat, -s * 0.55)));
      sphere(B, add(add(gl, mul(thumbDir, 22)), mul(fd, -4)), 12, corner, { shade: false });
      // Leg: thigh, a trunk leg (part of the shorts) with a side stripe in the corner color, shin, sock, boot.
      const hip = J["hip" + k], knee = J["knee" + k], ankle = J["ankle" + k], toe = J["toe" + k], tEnd = lerp(hip, knee, 0.55);
      capsule(B, hip, knee, 19, skin);
      capsule(B, hip, tEnd, 25, trunks, { tex, tile, e1: mul(latP, s) });
      if (!print && look.stripe !== false) {
        const ax = norm(sub(tEnd, hip)), out = norm(sub(mul(latP, s), mul(ax, dot(mul(latP, s), ax))));
        capsule(B, add(add(hip, mul(ax, 6)), mul(out, 24)), add(tEnd, mul(out, 24)), 4.5, corner, { shade: false, outline: false });
      }
      capsule(B, knee, lerp(knee, ankle, 0.58), 16, skin);
      capsule(B, lerp(knee, ankle, 0.56), lerp(knee, ankle, 0.66), 17, look.socks, { shade: false });
      capsule(B, lerp(knee, ankle, 0.64), ankle, 17.5, look.boots);
      capsule(B, ankle, toe, 14, look.boots);
    }
  }

  // The inside of a fighter for x-ray: a skeleton built on the rig's own joints (skull, spine, ribs, sternum, clavicles,
  // pelvis, limb bones) and the organs of the torso (lungs, heart, stomach, liver). A liver hit (f.state.liverHit 0..1,
  // see organHit) flashes the liver hot red, sends two ripples out from it, and leaves it bruised.
  const BONE = "#e8dfca";
  function blob(B, c, X, Y, Z, rx, ry, rz, col, o) {
    const prof = [-1, -0.8, -0.45, 0, 0.45, 0.8, 1];
    rings(B, prof.map((t) => { const k = Math.sqrt(Math.max(0, 1 - t * t)); return { c, X, Y, Z, h: t * ry, rx: rx * k, rz: rz * k }; }), col, o);
  }
  function anatomy(B, f, J, xr) {
    const T = trunk(J), { shC, hipC, up, fwd, lat } = T;
    const hUp = norm(sub(J.head, shC));
    // Skull and neck.
    sphere(B, add(J.head, mul(hUp, 2)), 29, BONE);
    sphere(B, sum(J.head, mul(hUp, -18), mul(fwd, 12)), 15, BONE);
    // Spine: vertebrae from the pelvis to the skull, toward the back.
    const base = sum(hipC, mul(up, -4), mul(fwd, -14)), top = sum(shC, mul(up, 20), mul(fwd, -10));
    capsule(B, base, top, 4, BONE);
    for (let i = 0; i <= 10; i++) sphere(B, lerp(base, top, i / 10), 6.5, BONE, { outline: false });
    capsule(B, top, sub(J.head, mul(hUp, 24)), 5, BONE);
    // Ribs: six arcs a side from the spine around to the front, sloping down; the sternum joins them in front.
    for (let r = 0; r < 6; r++) {
      const h = 2 - r * 11, rx = 34 - Math.abs(r - 2.5) * 1.5, rz = 22;
      for (const s of [1, -1]) {
        const pts = Array.from({ length: 9 }, (_, i) => {
          const th = (-80 + (i / 8) * 155) * R;
          return sum(shC, mul(up, h - 12 + (i / 8) * -10), mul(lat, s * rx * Math.cos(th)), mul(fwd, rz * Math.sin(th)));
        });
        for (let i = 0; i + 1 < pts.length; i++) capsule(B, pts[i], pts[i + 1], 3, BONE, { outline: false });
      }
    }
    capsule(B, sum(shC, mul(up, 10), mul(fwd, 22)), sum(shC, mul(up, -64), mul(fwd, 22)), 4.5, BONE);
    for (const k of ["F", "B"]) capsule(B, sum(shC, mul(up, 12), mul(fwd, 18)), J["sh" + k], 4, BONE);
    // Pelvis: two wings and the bridge between the hip joints.
    for (const k of ["F", "B"]) sphere(B, add(lerp(hipC, J["hip" + k], 0.85), mul(up, 12)), 14, BONE);
    capsule(B, J.hipF, J.hipB, 8, BONE);
    // Limbs.
    for (const k of ["F", "B"]) {
      const sh = J["sh" + k], el = J["el" + k], gl = J["gl" + k], wrist = sub(gl, mul(norm(sub(gl, el)), 36));
      sphere(B, sh, 10, BONE); capsule(B, sh, el, 6, BONE); sphere(B, el, 7.5, BONE); capsule(B, el, wrist, 5, BONE); sphere(B, lerp(wrist, gl, 0.6), 11, BONE);
      const hip = J["hip" + k], knee = J["knee" + k], ankle = J["ankle" + k], toe = J["toe" + k];
      sphere(B, hip, 10, BONE); capsule(B, hip, knee, 8, BONE); sphere(B, knee, 10, BONE); capsule(B, knee, ankle, 6.5, BONE); capsule(B, ankle, toe, 5, BONE);
    }
    // Organs.
    for (const s of [1, -1]) blob(B, sum(shC, mul(up, -30), mul(lat, s * 17), mul(fwd, 2)), lat, up, fwd, 13, 24, 15, "#d98d93");
    blob(B, sum(shC, mul(up, -40), mul(T.right, -6), mul(fwd, 9)), lat, up, fwd, 10, 11, 9, "#b3313e");   // heart: left of center
    blob(B, sum(lerp(hipC, shC, 0.42), mul(T.right, -16), mul(fwd, 8)), lat, up, fwd, 12, 10, 10, "#d39b80");   // stomach: left
    const h = (f.state && f.state.liverHit) || 0, flash = h > 0 && h < 1 ? Math.sin(Math.min(1, h * 4) * Math.PI / 2) * (1 - h) : 0;
    const liverCol = mix(mix("#b03a30", "#5e2140", Math.min(1, h * 1.5)), "#ff4a30", flash);
    blob(B, liverAt(J), lat, up, fwd, 17, 10, 12, liverCol, { shade: flash < 0.3 });   // inside the torso at every angle
    if (h > 0 && h < 1) for (const d of [0, 0.22]) {
      const k = Math.max(0, Math.min(1, (h - d) / 0.6)); if (k <= 0 || k >= 1) continue;
      sphere(B.shell((1 - k) * 0.5 * xr), liverAt(J), 22 + 70 * k, "#ff5a3c", { shade: false, outline: false });
    }
  }

  // A WebGL2 canvas that draws draw lists from the stage camera. mode "body": outline then fills; "ghost": every fill in
  // one flat tone (a pale silhouette).
  const VS = `#version 300 es
in vec3 aPos; in vec3 aNrm; in vec3 aCol; in vec2 aUv; in vec2 aMode;
uniform mat4 uVP; out vec3 vN; out vec3 vCol; out vec2 vUv; out vec2 vMode; out vec3 vP;
void main() { vN = aNrm; vCol = aCol; vUv = aUv; vMode = aMode; vP = aPos; gl_Position = uVP * vec4(aPos, 1.0); }`;
  const FS = `#version 300 es
precision highp float;
in vec3 vN; in vec3 vCol; in vec2 vUv; in vec2 vMode; in vec3 vP;
uniform sampler2D uTex; uniform vec3 uLight; uniform vec4 uFlat; uniform float uAlpha; uniform float uGhost; uniform vec3 uCam; out vec4 o;
void main() {
  if (uFlat.a > 0.0) { o = vec4(uFlat.rgb * uFlat.a, uFlat.a); return; }
  vec3 c = vCol;
  if (vMode.y > 0.5) { vec4 t = texture(uTex, vUv); c = c * (1.0 - t.a) + t.rgb; }
  if (vMode.x > 0.5) { float l = dot(normalize(vN), uLight), w = fwidth(l) * 0.75; c *= mix(0.78, 1.0, smoothstep(-0.25 - w, -0.25 + w, l)); }
  if (uAlpha < 1.0) {
    // A see-through layer: an x-ray shell tints cool and glows at its rim (where the surface turns away from the eye).
    float rim = pow(1.0 - abs(dot(normalize(vN), normalize(uCam - vP))), 2.0);
    c = mix(c, vec3(0.62, 0.84, 1.0), 0.8 * uGhost);
    float a = clamp(uAlpha + rim * 0.6 * uGhost, 0.0, 1.0);
    o = vec4(c * a, a); return;
  }
  o = vec4(c, 1.0);
}`;
  function painter(canvas) {
    const gl = canvas.getContext("webgl2", { antialias: true, stencil: true, depth: true, alpha: true, premultipliedAlpha: true, preserveDrawingBuffer: true });
    if (!gl) throw new Error("SportsRig needs WebGL2");
    const shader = (type, src) => {
      const s = gl.createShader(type); gl.shaderSource(s, src); gl.compileShader(s);
      if (!gl.getShaderParameter(s, gl.COMPILE_STATUS)) throw new Error(gl.getShaderInfoLog(s));
      return s;
    };
    const prog = gl.createProgram();
    gl.attachShader(prog, shader(gl.VERTEX_SHADER, VS)); gl.attachShader(prog, shader(gl.FRAGMENT_SHADER, FS));
    ["aPos", "aNrm", "aCol", "aUv", "aMode"].forEach((n, i) => gl.bindAttribLocation(prog, i, n));
    gl.linkProgram(prog);
    const U = (n) => gl.getUniformLocation(prog, n), uVP = U("uVP"), uLight = U("uLight"), uFlat = U("uFlat"), uTex = U("uTex"), uAlpha = U("uAlpha"), uGhost = U("uGhost"), uCam = U("uCam");
    const fillBuf = gl.createBuffer(), hullBuf = gl.createBuffer();
    const fillVao = gl.createVertexArray(); gl.bindVertexArray(fillVao); gl.bindBuffer(gl.ARRAY_BUFFER, fillBuf);
    [[0, 3, 0], [1, 3, 12], [2, 3, 24], [3, 2, 36], [4, 2, 44]].forEach(([i, n, off]) => { gl.enableVertexAttribArray(i); gl.vertexAttribPointer(i, n, gl.FLOAT, false, 52, off); });
    const hullVao = gl.createVertexArray(); gl.bindVertexArray(hullVao); gl.bindBuffer(gl.ARRAY_BUFFER, hullBuf);
    gl.enableVertexAttribArray(0); gl.vertexAttribPointer(0, 3, gl.FLOAT, false, 12, 0);
    gl.bindVertexArray(null);
    const texCache = new Map();
    const texOf = (src) => {
      if (texCache.has(src)) return texCache.get(src);
      const t = gl.createTexture(); gl.bindTexture(gl.TEXTURE_2D, t);
      gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true); gl.pixelStorei(gl.UNPACK_PREMULTIPLY_ALPHA_WEBGL, true);
      if (src) gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, src);
      else gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, 1, 1, 0, gl.RGBA, gl.UNSIGNED_BYTE, new Uint8Array(4));
      gl.generateMipmap(gl.TEXTURE_2D);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR_MIPMAP_LINEAR);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.REPEAT); gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, src && src.clampV ? gl.CLAMP_TO_EDGE : gl.REPEAT);
      texCache.set(src, t); return t;
    };
    const outline = rgb(OUTLINE);
    const drawFills = (fills) => {
      for (const [src, arr] of fills) {
        gl.bindTexture(gl.TEXTURE_2D, texOf(src));
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(arr), gl.DYNAMIC_DRAW);
        gl.drawArrays(gl.TRIANGLES, 0, arr.length / 13);
      }
    };
    return (B, vp, mode, cam = V(0, 0, 0)) => {
      gl.viewport(0, 0, canvas.width, canvas.height);
      gl.clearColor(0, 0, 0, 0); gl.clearDepth(1); gl.clearStencil(0);
      gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT | gl.STENCIL_BUFFER_BIT);
      gl.useProgram(prog);
      gl.uniformMatrix4fv(uVP, false, vp); gl.uniform3f(uLight, LIGHT.x, LIGHT.y, LIGHT.z); gl.uniform1i(uTex, 0);
      gl.uniform1f(uAlpha, 1); gl.uniform1f(uGhost, 0); gl.uniform3f(uCam, cam.x, cam.y, cam.z);
      gl.activeTexture(gl.TEXTURE0);
      if (mode === "body" && B.hull.length) {
        // Outline: the inflated hulls in the outline tone, each pixel once (stencil), under everything.
        gl.disable(gl.DEPTH_TEST); gl.depthMask(false);
        gl.enable(gl.STENCIL_TEST); gl.stencilFunc(gl.NOTEQUAL, 1, 0xff); gl.stencilOp(gl.KEEP, gl.KEEP, gl.REPLACE);
        gl.enable(gl.BLEND); gl.blendFunc(gl.ONE, gl.ONE_MINUS_SRC_ALPHA);
        gl.uniform4f(uFlat, outline[0], outline[1], outline[2], 0.7);
        gl.bindVertexArray(hullVao); gl.bindBuffer(gl.ARRAY_BUFFER, hullBuf);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(B.hull), gl.DYNAMIC_DRAW);
        gl.drawArrays(gl.TRIANGLES, 0, B.hull.length / 3);
      }
      gl.disable(gl.STENCIL_TEST); gl.disable(gl.BLEND);
      gl.enable(gl.DEPTH_TEST); gl.depthFunc(gl.LEQUAL); gl.depthMask(true);
      gl.uniform4f(uFlat, outline[0], outline[1], outline[2], mode === "ghost" ? 1 : 0);
      gl.bindVertexArray(fillVao); gl.bindBuffer(gl.ARRAY_BUFFER, fillBuf);
      drawFills(B.fills);
      // See-through layers last, over the solid parts: depth-tested, not written, blended.
      if (mode === "body" && B.layers.length) {
        gl.depthMask(false); gl.enable(gl.BLEND); gl.blendFunc(gl.ONE, gl.ONE_MINUS_SRC_ALPHA);
        for (const L of B.layers) { gl.uniform1f(uAlpha, L.alpha); gl.uniform1f(uGhost, L.ghost); drawFills(L.fills); }
        gl.depthMask(true); gl.disable(gl.BLEND);
      }
      gl.bindVertexArray(null);
    };
  }

  // ---------- Fighters ----------
  function mount(S, look, opts = {}) {
    const f = { look, stage: S, foe: null, plan: [{ t: -1, x: opts.x || 0 }], moves: [], poses: [], state: { ...ZERO, ...window.SportsPoses.guard, x: opts.x || 0, z: opts.z || 0, facing: opts.facing || 0, bob: 0, sway: 0, wobbleSway: 0, wobbleRoll: 0, wobbleZ: 0, wobbleMix: 1, ko: -1, xray: 0, liverHit: 0 } };
    S.fighters.push(f);
    return f;
  }
  // Make two fighters opponents: each one's reaching punches land on the other's chin.
  const face = (a, b) => { a.foe = b; b.foe = a; };
  const headOf = (f) => (f.state.ko >= 0 && f.rag ? joints(f).head : fk(f.state, null).head);
  function joints(f) {
    if (f.state.ko < 0 || !f.rag) {
      // The reach target: the opponent's chin, or his liver as the pose's body lane rises (a liver hook).
      const chin = f.foe ? () => {
        const h = add(headOf(f.foe), V(0, -16, 0)), b = f.state.body || 0;
        return b > 0 ? lerp(h, liverSurface(f.foe.state.ko >= 0 && f.foe.rag ? joints(f.foe) : fk(f.foe.state, null)), b) : h;
      } : null;
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
      // A straight arm has no bend to keep: its elbow lies on the line, so fall back to an elbow-down pole instead of
      // normalizing noise (which flips the elbow from frame to frame and reads as a glitchy jab).
      // Blend toward elbow-down as the arm straightens (a hard switch here snapped the elbow).
      let pole = sub(J["el" + k], sh); pole = sub(pole, mul(dir, dot(pole, dir)));
      const down = sub(V(0, -1, 0), mul(dir, -dir.y));
      pole = norm(add(pole, mul(down, 12 * Math.max(0, 1 - len(pole) / 12))));
      const ca = Math.max(-1, Math.min(1, (L.arm * L.arm + d * d - L.glove * L.glove) / (2 * L.arm * d)));
      J["el" + k] = add(sh, add(mul(dir, L.arm * ca), mul(pole, L.arm * Math.sqrt(1 - ca * ca))));
      J["gl" + k] = add(sh, mul(dir, d));
    };
    const out = (g, c, r) => { const v = sub(g, c), d = len(v); return d < r && d > 0.001 ? add(c, mul(v, r / d)) : g; };
    // A punch into the head stops where its own line first meets the head, so it lands on the face. (Pushing it out
    // from the head's center slid a glove aimed at the chin around the side of the head: it read as a miss.)
    const back = (g, sh, c, r) => {
      if (len(sub(g, c)) >= r) return g;
      const d = sub(g, sh), n = len(d);
      if (n < 0.001) return out(g, c, r);
      const u = mul(d, 1 / n), m = sub(sh, c), b = dot(m, u), disc = b * b - (dot(m, m) - r * r), t = -b - Math.sqrt(Math.max(0, disc));
      return disc >= 0 && t > 0 && t < n ? add(sh, mul(u, t)) : out(g, c, r);
    };
    const seg = (p, a, b) => { const ab = sub(b, a), t = Math.max(0, Math.min(1, dot(sub(p, a), ab) / (dot(ab, ab) || 1))); return add(a, mul(ab, t)); };
    const live = fs.filter((f) => f.J && f.J.glF && f.J.glB);
    for (const f of live) for (const k of ["F", "B"]) {
      let g = f.J["gl" + k];
      // Only the opponent's head and chest, and only when the punch aims at his real body: a punch aimed at a frozen
      // spot is a miss, and pushing it off the dodging head makes it wobble around him. Pushing gloves off each other
      // or off the fighter's own face makes them slide every frame, which reads as liquid.
      for (const o of live) if (o !== f && f.foe && f.foe.state === o.state) {
        g = back(g, f.J["sh" + k], o.J.head, (HEAD + GLOVE) * TOUCH);
        g = out(g, seg(g, mid(o.J.shF, o.J.shB), mid(o.J.hipF, o.J.hipB)), (CHEST + GLOVE) * TOUCH);
      }
      if (g !== f.J["gl" + k]) reach(f.J, k, g);
    }
    // Gloves are solid against the other fighter's gloves too: two that meet push apart along the line between them,
    // half each, and both arms re-bend to reach (a jab into a guard stops on the glove instead of passing through it).
    // The push eases in over the first 6 units of overlap, so a glove touched by a moving glove does not kink. (Tried
    // and dropped: pushing along each fighter's back, capped or exact solves, punch-only pushes: each made the arms
    // twitch or the gloves teleport or clip; see the motion audit's twitch and glove-clip checks.)
    for (let i = 0; i < live.length; i++) for (let j = i + 1; j < live.length; j++) for (const ka of ["F", "B"]) for (const kb of ["F", "B"]) {
      const A = live[i].J, Bj = live[j].J, ga = A["gl" + ka], gb = Bj["gl" + kb], v = sub(ga, gb), d = len(v), min = 2 * GLOVE * TOUCH;
      if (d >= min || d < 0.001) continue;
      // The punch holds its line and the glove it meets gives way (a guard parts for a jab down the middle, instead of
      // knocking the jab off to the side); two resting guards share it. The share blends with how far each is punching.
      // A guard set to block (the `block` pose) outweighs any punch: the punch stops on it.
      const amt = (f, k) => Math.max(f.state["reach" + k], f.state["hook" + k], f.state["up" + k], f.state["over" + k], 2 * (f.state.block || 0));
      const sa = 0.5 - 0.5 * Math.max(-1, Math.min(1, (amt(live[i], ka) - amt(live[j], kb)) * 3));
      const e = Math.min(1, (min - d) / 6), push = mul(v, ((min - d) / d) * (e * e * (3 - 2 * e)));
      if (sa > 0.001) reach(A, ka, add(ga, mul(push, sa)));
      if (sa < 0.999) reach(Bj, kb, sub(gb, mul(push, 1 - sa)));
    }
  }

  // A big, uneven drunken sway on top of whatever pose the fighter holds: weight drift, a sideways roll, and a small
  // sidestep, on two periods so it never repeats in step. Seek-safe (fromTo tweens on additive lanes). amp ~12-16 reads
  // as loose on purpose; it settles back to still over the last 0.3 s. A punch thrown inside the sway reads as a flail:
  // tween f.state.wobbleMix to 0 over the load and back to 1 after the recoil (see style.md).
  function wobble(tl, f, from, to, amp = 14) {
    for (const [period, channels] of [[2.3, { wobbleSway: amp / 6 }], [3.7, { wobbleRoll: amp, wobbleZ: amp * 0.8 }]]) {
      const end = Math.max(from, to - 0.3), quarter = period / 4;
      for (let t = from, i = 0; t < end; t += quarter, i++) {
        const duration = Math.min(quarter, end - t), a = Math.sin((i * Math.PI) / 2), b = Math.sin(((i + duration / quarter) * Math.PI) / 2);
        const start = {}, finish = {};
        for (const key in channels) { start[key] = channels[key] * a; finish[key] = channels[key] * b; }
        tl.fromTo(f.state, start, { ...finish, duration, ease: i % 2 ? "sine.in" : "sine.out", immediateRender: false }, t);
      }
      tl.to(f.state, { ...Object.fromEntries(Object.keys(channels).map((k) => [k, 0])), duration: to - end, ease: "sine.inOut" }, end);
    }
  }

  const bind = (tl, S) => { tl.eventCallback("onUpdate", S.render); return tl; };
  function pose(tl, f, name, t, dur = 0.35, ease = "power3.inOut") {
    const target = window.SportsPoses[name];
    if (!target) throw new Error(`Unknown pose "${name}"`);
    // Its own tween (tl.to returns the timeline), so the settle pass can trim or drop this move alone.
    const tween = gsap.to(f.state, { ...ZERO, ...target, duration: dur, ease }), move = [t, t + dur];
    tl.add(tween, t);
    if (f.moves) { f.moves.push(move); f.poses.push({ tween, move, ease }); }
    return tween;
  }
  // When the fighter's last pose move that started before t is done: a new move started earlier would run on top of it
  // and stop the limbs dead mid-motion (a twitch).
  const freeAt = (f, t) => (f.moves || []).reduce((m, [a, b]) => (a < t - 1e-3 ? Math.max(m, b) : m), -Infinity);
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
    if (opts.kind === "liver") {
      // A liver shot: he stays up for a beat (the famous delay), grabs his side, then folds straight down onto his
      // knees and curls forward, instead of snapping back. Returns when he is down.
      const fold = t + (opts.delay ?? 0.75), back = x + 50 * dir;   // the body shot knocks him half a step back
      pose(tl, loser, "clutch", t + 0.12, 0.5, "power2.inOut");
      tl.to(loser.state, { x: back, duration: 0.5, ease: "power2.out" }, t + 0.12);
      ragdoll(loser, "clutch", {
        head: [-20 * dir, -40, 0], upper: [-25 * dir, -220, 0], hips: [0, -420, 0],
        kneeF: [-70 * dir, -300, 0], kneeB: [-70 * dir, -300, 0],
      }, { x: back, z: opts.z });
      tl.fromTo(loser.state, { ko: -0.001 }, { ko: 2.5, duration: 2.2, ease: "power1.in", immediateRender: false }, fold);
      shake(tl, S, t, 10);
      // Near side-on, so the two fighters stay apart on screen while he hunches and folds.
      camera(tl, S, { yaw: 10 * dir, pitch: 16, ty: 200, tx: x * 0.85, dist: 2800, roll: 2 * dir, cy: 800 }, fold - 0.2, 1.6, "power2.inOut");
      return fold + 1.8;
    }
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
  const stand = (tl, f, t, x, z = 0) => { f.plan.push({ t, x }); f.plan.sort((a, b) => a.t - b.t); return tl.set(f.state, { ...ZERO, ...window.SportsPoses.guard, ko: -1, x, z }, t); };

  // ---------- Choreography ----------
  // Helpers that build the motion rules in, so a punch always loads, a step never skids, and a landed punch never
  // leaves two guards inside each other. Use them instead of raw pose tweens for punches, steps and misses.
  // The pose each punch coils into first (a jab sets from the guard).
  const LOADS = { jab: "guard", straight: "load", slipCounter: "load", hook: "hookLoad", rearHook: "rearHookLoad",
    uppercut: "upLoad", leadUppercut: "leadUpLoad", overhand: "overLoad", liverHook: "liverLoad" };
  // Punching range (x apart): straight punches reach from about 270, bent ones need about 185.
  const RANGE = { jab: 270, straight: 270, slipCounter: 270, overhand: 230, hook: 185, rearHook: 185, uppercut: 185, leadUppercut: 185, liverHook: 185 };
  // Where a fighter stands at t, from the steps planned so far (step, stand, mount).
  const planned = (f, t) => { let x = f.plan[0].x; for (const p of f.plan) if (p.t <= t + 1e-6) x = p.x; return x; };
  // A step to x at t. Its length sets its time: 0.3 s plus 1 s per 150 units (a 60-unit step takes 0.7 s), unless
  // dur is given. Returns when he arrives.
  function step(tl, f, x, t, dur, ease = "power2.inOut") {
    const d = dur ?? Math.min(1, 0.3 + Math.abs(x - planned(f, t)) / 150);
    tl.to(f.state, { x, duration: d, ease }, t);
    f.plan.push({ t: t + d, x }); f.plan.sort((a, b) => a.t - b.t);
    return t + d;
  }
  // X-ray: fade f's skin and clothes to a see-through shell over his skeleton and organs (to = 1), or back (to = 0).
  function xray(tl, f, t, dur = 0.7, to = 1) { tl.to(f.state, { xray: to, duration: dur, ease: "sine.inOut" }, t); }
  // A liver hit seen in x-ray: the liver flashes hot red, two ripples spread from it, and it settles bruised.
  function organHit(tl, f, t, dur = 1.4) { tl.fromTo(f.state, { liverHit: 0 }, { liverHit: 1, duration: dur, ease: "power1.out", immediateRender: false }, t); }
  // Bullet-time camera: orbit `deg` degrees around the current target over dur (hold the fighters still meanwhile).
  function orbit(tl, S, t, dur, deg, ease = "sine.inOut") { tl.to(S.cam, { yaw: `+=${deg}`, duration: dur, ease }, t); }
  // A slow push in: the camera closes to `factor` of its distance over dur.
  function push(tl, S, t, dur, factor = 0.85, ease = "sine.inOut") { tl.to(S.cam, { dist: () => S.cam.dist * factor, duration: dur, ease }, t); }
  // A punch that snaps out at t: it coils into its load pose first (o.load s before, default 0.22), snaps out in
  // o.snap s (0.16, power4.out), holds o.hold s (0.2), and recoils into o.rest ("guard") with an overshoot. o.back:
  // an x to step back to as it recoils, after a punch lands at close range. Returns the time it lands.
  function punch(tl, f, name, t, o = {}) {
    if (!LOADS[name]) throw new Error(`Unknown punch "${name}". Use one of: ${Object.keys(LOADS).join(", ")}`);
    // A move still running when the load would begin (a recoil in a combination, a recovery) makes way: one that has
    // barely started is dropped, a longer one is trimmed to finish as the load begins, so the next punch loads straight
    // out of it, as in a real combination. Then the load fits after his last move (never under 0.12 s).
    const want = t - (o.load ?? 0.22);
    for (const p of f.poses) {
      const [a, b] = p.move;
      if (/power4/.test(p.ease) || a >= want || b <= want + 0.02) continue;
      if (want - a < 0.12) { tl.remove(p.tween); p.move[1] = a; }
      else { p.tween.duration(want - a); p.move[1] = want; }
    }
    const load = Math.max(0.12, Math.min(o.load ?? 0.22, t - freeAt(f, t))), snap = o.snap ?? 0.16, hit = t + snap, rec = hit + (o.hold ?? 0.2);
    pose(tl, f, LOADS[name], t - load, load, "power3.inOut");
    pose(tl, f, name, t, snap, "power4.out");
    pose(tl, f, o.rest || "guard", rec, o.recover ?? 0.32, "back.out(1.6)");
    if (o.back !== undefined) step(tl, f, o.back, rec);
    return hit;
  }
  // A combination: the punches `gap` s apart (0.5 by default), each loading as the last one comes back (a 0.1 s hold),
  // so it flows like jab-jab-straight instead of three separate punches. Other options pass to every punch(). Returns
  // the landing times, to time the defender's slips, blocks, or hits to.
  function combo(tl, f, names, t, o = {}) {
    const { gap = 0.5, ...rest } = o;
    return names.map((name, i) => punch(tl, f, name, t + i * gap, { hold: 0.1, recover: 0.28, ...rest }));
  }
  // A punch that misses: the attacker aims at where the defender stood (a frozen copy of his o.stance at o.x, his
  // planned spot by default), the defender moves into o.lean ("slip") as it snaps, holds, and eases back to o.rest
  // ("guard") half a second later. o.punch passes options to punch(). Returns the time it would have landed.
  function dodge(tl, att, def, name, t, o = {}) {
    const frozen = { state: { ...ZERO, ...window.SportsPoses[o.stance || "guard"], x: o.x ?? planned(def, t), z: 0, facing: def.state.facing, bob: 0, sway: 0, ko: -1 } };
    tl.set(att, { foe: frozen }, t - 0.4);
    const hit = punch(tl, att, name, t, o.punch);
    pose(tl, def, o.lean || "slip", t - 0.08, 0.32, "sine.inOut");
    pose(tl, def, o.rest || "guard", hit + 0.45, 0.45, "power3.inOut");
    tl.set(att, { foe: def }, hit + 0.5);
    return hit;
  }
  // The attacker steps into range for the punch (RANGE, or o.gap) so he arrives as it loads, then throws it. Pass
  // o.back to step back out after it lands. A body punch changes levels on the way in: its load (the dip) runs
  // through the whole step, so his gloves arrive under the opponent's guard instead of into it. Returns when it lands.
  const BODY = { liverHook: true };
  function exchange(tl, att, def, name, t, o = {}) {
    const dx = planned(def, t) - planned(att, t), dir = Math.sign(dx) || 1, to = planned(def, t) - dir * (o.gap ?? RANGE[name]);
    let d = Math.min(1, 0.3 + Math.abs(to - planned(att, t)) / 150);
    const load = o.load ?? 0.22, moves = Math.abs(to - planned(att, t)) > 2;
    // Start once his previous move is done: shorten the step (to 0.3 s at least) rather than overlap it.
    const start = Math.max(t - load - d, Math.min(freeAt(att, t), t - load - 0.3));
    d = t - load - start;
    if (moves) step(tl, att, to, start, d);
    return punch(tl, att, name, t, BODY[name] && moves && o.load === undefined ? { ...o, load: load + d } : o);
  }
  // Fade a floor note, body mark, or ghost in at t and out `hold` seconds after it settles.
  function show(tl, n, t, hold = 1.2) {
    tl.fromTo(n, { o: 0, p: 0 }, { o: 1, p: 1, duration: 0.35, ease: "power3.out", immediateRender: false }, t);
    tl.to(n, { o: 0, duration: 0.25, ease: "power2.in" }, t + 0.35 + hold);
    return n;
  }

  return { stage, bind, mount, face, pose, idle, wobble, appear, camera, view, shake, ragdoll, knockout, stand, show, step, planned, punch, combo, dodge, exchange, xray, organHit, orbit, push, fk, LOOKS, SKIN, CORNER, VIEWS, L, RANGE };
})();
