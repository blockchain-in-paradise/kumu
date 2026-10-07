// Sports style character kit: a flat side-view fighter rig and a top-down token.
// Load poses.js after this file. Usage:
//   const you = SportsRig.mount(el, SportsRig.LOOKS.you);          // side view, facing right
//   SportsRig.pose(tl, you, "jab", 2.4, 0.25, "power3.out");        // seek-safe pose tween
//   SportsRig.idle(tl, you, 2.0, 7.6);                              // small breathing bob
//   const top = SportsRig.mountTop(el, SportsRig.LOOKS.you);       // top-down token, faces up
// Mirror a side fighter with CSS (transform: scaleX(-1)) on its container to face left.
// Joint angles are degrees, clockwise positive. For hanging limbs, negative swings forward;
// for the torso, positive leans forward. Every joint is a nested <g> rotated around a named
// pivot with an SVG transform attribute, so a forearm follows its upper arm.
window.SportsRig = (() => {
  // Pivots in the 400 x 600 viewBox. The hip is the root; the figure faces right.
  const PIVOT = {
    torso: [200, 300], torsoF: [200, 300],
    armB: [200, 145], foreB: [200, 240], armF: [200, 145], foreF: [200, 240],
    legB: [200, 300], shinB: [200, 425], legF: [200, 300], shinF: [200, 425],
    footB: [200, 550], footF: [200, 550],
  };
  // The lowest ankle sits here, so the foot's underside (ankle + 13) rests on top of the floor line.
  const FLOOR = 535;
  const R = Math.PI / 180;
  const ankleY = (thigh, shin) => 300 + 125 * Math.cos(thigh * R) + 125 * Math.cos((thigh + shin) * R);

  // Looks: skin, hair ("short", "buzz", "bun", "bald"), hair color, shorts, gloves.
  // Shades for the far limbs are derived, so a look is five values.
  const LOOKS = {
    you: { skin: "#d8a47c", hair: "short", hairColor: "#2a211c", shorts: "#ece6da", glove: "#ff3b3b" },
    rival: { skin: "#7b4a33", hair: "buzz", hairColor: "#15110f", shorts: "#3d5aa8", glove: "#ff3b3b" },
  };
  const shade = (hex, f) => "#" + [1, 3, 5].map((i) =>
    Math.round(parseInt(hex.slice(i, i + 2), 16) * f).toString(16).padStart(2, "0")).join("");
  const HAIR = {
    short: (c) => `<circle cx="195" cy="64" r="43" fill="${c}"/>`,
    buzz: (c) => `<circle cx="200" cy="69" r="41" fill="${c}"/>`,
    bun: (c) => `<circle cx="195" cy="64" r="43" fill="${c}"/><circle cx="156" cy="54" r="18" fill="${c}"/>`,
    bald: () => "",
  };

  const limb = (x1, y1, x2, y2, c, w) =>
    `<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" stroke="${c}" stroke-width="${w}" stroke-linecap="round"/>`;
  const arm = (side, c, glove) =>
    `<g data-j="arm${side}">${limb(200, 145, 200, 240, c, 30)}` +
    `<g data-j="fore${side}">${limb(200, 240, 200, 325, c, 27)}<circle cx="200" cy="340" r="27" fill="${glove}"/></g></g>`;
  const leg = (side, c, shorts) =>
    `<g data-j="leg${side}">${limb(200, 300, 200, 425, c, 36)}${limb(200, 296, 200, 372, shorts, 50)}` +
    `<g data-j="shin${side}">${limb(200, 425, 200, 550, c, 31)}<g data-j="foot${side}">${limb(200, 550, 238, 550, c, 26)}</g></g></g>`;

  function mount(container, look) {
    const near = shade(look.skin, 0.9), far = shade(look.skin, 0.72);
    container.innerHTML =
      `<svg viewBox="0 0 400 600" overflow="visible" style="width:100%;height:100%;overflow:visible">` +
      `<g data-j="root">` +
      leg("B", far, shade(look.shorts, 0.75)) +
      `<g data-j="torso">${arm("B", far, shade(look.glove, 0.78))}` +
      `<rect x="156" y="116" width="88" height="200" rx="42" fill="${look.skin}"/>` +
      `<rect x="154" y="262" width="92" height="62" rx="24" fill="${look.shorts}"/>` +
      `${limb(203, 118, 205, 96, look.skin, 26)}${HAIR[look.hair](look.hairColor)}<circle cx="206" cy="76" r="38" fill="${look.skin}"/></g>` +
      leg("F", near, look.shorts) +
      `<g data-j="torsoF">${arm("F", near, look.glove)}</g>` +
      `</g></svg>`;
    const el = {};
    container.querySelectorAll("[data-j]").forEach((g) => (el[g.dataset.j] = g));
    const f = { el, state: { ...window.SportsPoses.guard, bob: 0 } };
    f.apply = () => {
      const s = f.state;
      s.torsoF = s.torso;
      // The body rises or drops so the lowest foot rests flat on the floor; a higher foot
      // tips onto its toes to reach it, like a boxer's raised rear heel.
      const aF = ankleY(s.legF, s.shinF), aB = ankleY(s.legB, s.shinB), low = Math.max(aF, aB);
      const toe = (a) => Math.min(80, Math.asin(Math.min(1, (low - a) / 38)) / R);
      s.footF = -(s.legF + s.shinF) + toe(aF);
      s.footB = -(s.legB + s.shinB) + toe(aB);
      for (const j in PIVOT) el[j].setAttribute("transform", `rotate(${s[j]} ${PIVOT[j][0]} ${PIVOT[j][1]})`);
      el.root.setAttribute("transform", `translate(0 ${FLOOR - low + s.bob})`);
    };
    f.apply();
    return f;
  }

  // Seek-safe: one tween of the fighter's joint state, applied on every render.
  function pose(tl, f, name, t, dur = 0.35, ease = "power3.inOut") {
    const target = window.SportsPoses[name];
    if (!target) throw new Error(`Unknown pose "${name}"`);
    tl.to(f.state, { ...target, duration: dur, ease, onUpdate: f.apply }, t);
  }

  // A finite breathing bob between two times (no infinite repeats, so it renders deterministically).
  function idle(tl, f, from, to, amp = 6, period = 0.7) {
    const n = Math.max(1, Math.floor((to - from) / period));
    tl.to(f.state, { bob: amp, duration: period / 2, ease: "sine.inOut", yoyo: true, repeat: n * 2 - 1, onUpdate: f.apply }, from);
  }

  // Top-down token: shoulders, head (hair from above), and gloves, facing up.
  function mountTop(container, look) {
    const top = look.hair === "bald" ? look.skin : look.hairColor;
    container.innerHTML =
      `<svg viewBox="-110 -110 220 220" style="width:100%;height:100%;overflow:visible">` +
      `<ellipse cx="0" cy="18" rx="70" ry="34" fill="${shade(look.skin, 0.9)}"/>` +
      `<circle cx="-34" cy="-34" r="23" fill="${shade(look.glove, 0.78)}"/><circle cx="30" cy="-48" r="24" fill="${look.glove}"/>` +
      `<circle cx="0" cy="6" r="30" fill="${top}"/></svg>`;
  }

  return { mount, pose, idle, mountTop, LOOKS, PIVOT };
})();
