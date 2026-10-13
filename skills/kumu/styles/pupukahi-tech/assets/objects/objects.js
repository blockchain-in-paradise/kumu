// Pūpūkahi object library: everyday things drawn to the style's one recipe (see style.md, "Drawing objects").
// Light comes from the top left. A body has a four-tone gradient from light to dark, an edge treatment (rim, bezel, border),
// an inset detail, a soft shadow (the `.obj` class), and at most one plain-word label. No outlines, no faces.
//
//   Objects.draw("coin", { label: "USDC" })   returns an SVG string
//   Objects.mount("#id", "padlock")           fills the element
//   Objects.names                             every object
//
// Options: label (coin, seal, safe), color (padlock, mailbox, phone, seal: any base color), seal (page: false to omit),
//          lines and sign (letter: how many printed lines, true for a signature).
(() => {
  let uid = 0;
  const hex = (c) => [1, 3, 5].map((i) => parseInt(c.slice(i, i + 2), 16));
  const mix = (a, b, t) => "#" + hex(a).map((v, i) => Math.round(v + (hex(b)[i] - v) * t).toString(16).padStart(2, "0")).join("");
  const MAT = {
    gold: ["#fff4c8", "#f6cf55", "#dcaa2a", "#a87a14"],
    goldDeep: ["#e8bb3a", "#cf9f27", "#b8860b", "#8a6409"],
    steel: ["#f2f6f7", "#c4d0d4", "#8a9ca3", "#56696f"],
    brass: ["#ffe9b0", "#e8c067", "#bd8c2d", "#7d5a1c"],
    paper: ["#fdf8ea", "#f1e7ca", "#e3d6b2", "#c9b987"],
    glass: ["#3a5663", "#26404c", "#18303a", "#0f222a"],
    wood: ["#d29a62", "#b17a45", "#8f5b33", "#5d3a1f"],
    wax: ["#4fb7c1", "#2a97a3", "#1f8490", "#0f4750"],
    bill: ["#e3f0da", "#cfe3c4", "#a9cc9d", "#86ad7b"],
  };
  const OFF = [0, 0.3, 0.65, 1];
  const tone = (m) => MAT[m] || [mix(m, "#ffffff", 0.6), mix(m, "#ffffff", 0.22), m, mix(m, "#000000", 0.4)];

  // An irregular wax edge, the same on every seal.
  const waxEdge = (cx, cy, r) => { let d = ""; for (let k = 0; k <= 96; k++) { const a = k / 96 * Math.PI * 2, rr = r + 2.8 * Math.sin(7 * a + .5) + 2.2 * Math.sin(11 * a + 1.7) + 1.4 * Math.sin(3 * a);
    d += (k ? "L" : "M") + (cx + rr * Math.cos(a)).toFixed(1) + " " + (cy + rr * Math.sin(a)).toFixed(1); } return d + "Z"; };

  const LIB = {
    coin: ({ lin, rad, o }) => ({ w: 240, h: 240, body: `
      <circle cx="120" cy="120" r="112" fill="${lin("goldDeep")}"/>
      <circle cx="120" cy="120" r="108" fill="none" stroke="#a87a14" stroke-width="9" stroke-dasharray="3.4 3.4" opacity=".7"/>
      <circle cx="120" cy="120" r="100" fill="${rad("gold")}"/>
      <circle cx="120" cy="120" r="78" fill="none" stroke="rgba(255,255,255,.4)" stroke-width="2"/>
      <circle cx="120" cy="120" r="75" fill="none" stroke="rgba(110,72,0,.35)" stroke-width="5"/>
      ${o.label ? `<text x="120" y="${120 + (o.size || 44) * .36 + 2}" text-anchor="middle" font-family="Inter,sans-serif" font-weight="800" font-size="${o.size || 44}" fill="rgba(255,236,170,.6)">${o.label}</text><text x="120" y="${120 + (o.size || 44) * .36}" text-anchor="middle" font-family="Inter,sans-serif" font-weight="800" font-size="${o.size || 44}" fill="#6b4600">${o.label}</text>` : ""}` }),

    cash: ({ lin }) => ({ w: 300, h: 210, body: `
      <g stroke="#4f7a4c" stroke-width="2"><rect x="22" y="132" width="256" height="64" rx="6" fill="#7fa774"/><rect x="16" y="112" width="256" height="64" rx="6" fill="#8db582"/><rect x="26" y="92" width="256" height="64" rx="6" fill="#9cc391"/><rect x="18" y="40" width="256" height="116" rx="8" fill="${lin("bill")}"/></g>
      <rect x="30" y="52" width="232" height="92" rx="5" fill="none" stroke="#5d8a59" stroke-width="2.5"/>
      <ellipse cx="146" cy="98" rx="30" ry="34" fill="#b7d3aa" stroke="#5d8a59" stroke-width="2.5"/>
      <circle cx="62" cy="98" r="16" fill="none" stroke="#5d8a59" stroke-width="2.5"/><circle cx="230" cy="98" r="16" fill="none" stroke="#5d8a59" stroke-width="2.5"/>
      <rect x="128" y="28" width="38" height="178" rx="4" fill="${lin("paper")}" stroke="#a8996f" stroke-width="2"/>` }),

    page: ({ lin, rad, o }) => ({ w: 280, h: 200, body: `
      <rect x="6" y="6" width="268" height="188" rx="8" fill="${lin("paper")}" stroke="#a8996f" stroke-width="2"/>
      <rect x="20" y="20" width="240" height="160" rx="4" fill="none" stroke="#8a7a4a" stroke-width="3"/>
      <rect x="28" y="28" width="224" height="144" rx="2" fill="none" stroke="#8a7a4a" stroke-width="1.5"/>
      <path d="M48 66 H176 M48 90 H146" stroke="#6f6440" stroke-width="6" stroke-linecap="round"/>
      <path d="M48 128 H150 M48 146 H122" stroke="#a89a70" stroke-width="4" stroke-linecap="round"/>
      ${o.seal === false ? "" : `<path d="${waxEdge(206, 130, 30)}" fill="${rad("wax")}"/><circle cx="206" cy="130" r="22" fill="none" stroke="rgba(255,255,255,.28)" stroke-width="2.5"/>`}` }),

    seal: ({ rad, o }) => ({ w: 128, h: 128, body: `
      <path d="${waxEdge(64, 64, 56)}" fill="${rad(o.color || "wax")}"/>
      <circle cx="64" cy="64" r="49" fill="none" stroke="rgba(255,255,255,.26)" stroke-width="3"/>
      <ellipse cx="44" cy="30" rx="22" ry="9" fill="rgba(255,255,255,.14)" transform="rotate(-28 44 30)"/>
      ${o.label ? `<text x="64" y="78" text-anchor="middle" font-family="Inter,sans-serif" font-weight="800" font-size="40" fill="#fcfaf8" stroke="rgba(0,0,0,.25)" stroke-width="1">${o.label}</text>` : ""}` }),

    padlock: ({ lin, o }) => ({ w: 200, h: 250, body: `
      <path d="M52 116 V74 a48 48 0 0 1 96 0 V116" fill="none" stroke="${lin("steel", 1, 0)}" stroke-width="24" stroke-linecap="round"/>
      <path d="M62 112 V76 a38 38 0 0 1 28 -36" fill="none" stroke="rgba(255,255,255,.5)" stroke-width="3" stroke-linecap="round"/>
      <rect x="16" y="106" width="168" height="132" rx="24" fill="${lin(o.color || "brass")}"/>
      <rect x="22" y="112" width="156" height="60" rx="18" fill="rgba(255,255,255,.16)"/>
      <rect x="16" y="106" width="168" height="132" rx="24" fill="none" stroke="rgba(255,255,255,.35)" stroke-width="2"/>
      <circle cx="100" cy="164" r="17" fill="#2a1d08"/><rect x="94" y="168" width="12" height="40" rx="5" fill="#2a1d08"/>
      <circle cx="100" cy="164" r="17" fill="none" stroke="rgba(255,255,255,.25)" stroke-width="2"/>` }),

    key: ({ lin }) => ({ w: 270, h: 120, body: `
      <circle cx="62" cy="60" r="50" fill="${lin("brass")}"/><circle cx="62" cy="60" r="50" fill="none" stroke="rgba(255,255,255,.4)" stroke-width="2"/>
      <circle cx="62" cy="60" r="18" fill="#2a1d08"/><circle cx="62" cy="60" r="18" fill="none" stroke="rgba(255,255,255,.25)" stroke-width="2"/>
      <path d="M30 34 a40 40 0 0 1 40 -16" fill="none" stroke="rgba(255,255,255,.5)" stroke-width="4" stroke-linecap="round"/>
      <rect x="108" y="50" width="146" height="20" rx="8" fill="${lin("brass", 0, 1)}"/>
      <rect x="196" y="68" width="18" height="30" rx="4" fill="${lin("brass")}"/><rect x="226" y="68" width="16" height="22" rx="4" fill="${lin("brass")}"/>
      <rect x="112" y="53" width="136" height="5" rx="2.5" fill="rgba(255,255,255,.45)"/>` }),

    safe: ({ lin, o }) => ({ w: 240, h: 270, body: `
      <rect x="14" y="236" width="40" height="22" rx="6" fill="${lin("steel")}"/><rect x="186" y="236" width="40" height="22" rx="6" fill="${lin("steel")}"/>
      <rect x="14" y="14" width="212" height="230" rx="20" fill="${lin("steel")}"/>
      <rect x="14" y="14" width="212" height="230" rx="20" fill="none" stroke="rgba(255,255,255,.55)" stroke-width="2"/>
      <rect x="36" y="36" width="168" height="186" rx="12" fill="${lin("steel", 1, 1)}" opacity=".9"/>
      <rect x="36" y="36" width="168" height="186" rx="12" fill="none" stroke="rgba(0,0,0,.25)" stroke-width="3"/>
      <circle cx="108" cy="130" r="48" fill="${lin("brass")}"/><circle cx="108" cy="130" r="48" fill="none" stroke="rgba(255,255,255,.4)" stroke-width="2"/>
      <circle cx="108" cy="130" r="40" fill="none" stroke="#7d5a1c" stroke-width="6" stroke-dasharray="2 6" opacity=".8"/>
      <circle cx="108" cy="130" r="24" fill="${lin("steel")}"/><path d="M108 130 L108 108" stroke="#2a1d08" stroke-width="5" stroke-linecap="round"/>
      <rect x="170" y="108" width="22" height="50" rx="9" fill="${lin("brass")}"/>
      ${o.label ? `<text x="120" y="60" text-anchor="middle" font-family="Inter,sans-serif" font-weight="800" font-size="22" fill="#56696f">${o.label}</text>` : ""}` }),

    ledger: ({ lin }) => ({ w: 300, h: 210, body: `
      <path d="M14 52 L150 72 L150 190 L14 168 Z" fill="${lin("wood", 1, 1)}"/><path d="M286 52 L150 72 L150 190 L286 168 Z" fill="${lin("wood", 0, 1)}"/>
      <path d="M22 38 L148 58 L148 176 L22 154 Z" fill="${lin("paper")}" stroke="#a8996f" stroke-width="1.5"/>
      <path d="M278 38 L152 58 L152 176 L278 154 Z" fill="${lin("paper", 0, 1)}" stroke="#a8996f" stroke-width="1.5"/>
      <path d="M150 58 V176" stroke="#8a7a4a" stroke-width="3"/>
      <g stroke="#6f6440" stroke-width="4" stroke-linecap="round" opacity=".75"><path d="M42 74 L130 88 M42 96 L130 110 M42 118 L130 132"/><path d="M170 88 L258 74 M170 110 L258 96"/></g>
      <path d="M170 132 L236 120" stroke="#196d76" stroke-width="6" stroke-linecap="round"/>
      <path d="M196 56 L196 18 L212 28 L228 18 L228 52 Z" fill="#196d76"/>` }),

    receipt: ({ lin }) => ({ w: 190, h: 290, body: `
      <path d="M24 14 H166 V262 L152 250 L138 262 L124 250 L110 262 L96 250 L82 262 L68 250 L54 262 L40 250 L24 262 Z" fill="${lin("paper", 1, 0)}" stroke="#a8996f" stroke-width="2"/>
      <path d="M50 52 H140 M50 80 H118 M50 108 H134" stroke="#5a5238" stroke-width="7" stroke-linecap="round" opacity=".8"/>
      <path d="M50 148 H140" stroke="#a89a70" stroke-width="4" stroke-dasharray="4 10" stroke-linecap="round"/>
      <path d="M50 178 H100 M112 178 H140" stroke="#5a5238" stroke-width="6" stroke-linecap="round" opacity=".7"/>
      <rect x="50" y="204" width="90" height="26" rx="6" fill="#196d76"/>` }),

    phone: ({ lin, o }) => ({ w: 150, h: 290, body: `
      <rect x="12" y="8" width="126" height="274" rx="30" fill="${lin(o.color || "steel")}"/>
      <rect x="12" y="8" width="126" height="274" rx="30" fill="none" stroke="rgba(255,255,255,.5)" stroke-width="2"/>
      <rect x="22" y="20" width="106" height="250" rx="22" fill="${lin("glass", 0, 1)}"/>
      <rect x="56" y="30" width="38" height="9" rx="4.5" fill="#0b161b"/>
      <rect x="34" y="64" width="82" height="34" rx="9" fill="rgba(252,250,248,.9)"/>
      <rect x="34" y="108" width="82" height="34" rx="9" fill="#39a1ac"/>
      <rect x="34" y="152" width="82" height="34" rx="9" fill="rgba(252,250,248,.9)"/>
      <rect x="56" y="254" width="38" height="5" rx="2.5" fill="rgba(252,250,248,.5)"/>
      <path d="M30 28 Q60 100 124 60" fill="none" stroke="rgba(255,255,255,.07)" stroke-width="30"/>` }),

    laptop: ({ lin }) => ({ w: 310, h: 210, body: `
      <rect x="40" y="12" width="230" height="150" rx="12" fill="${lin("steel")}"/><rect x="40" y="12" width="230" height="150" rx="12" fill="none" stroke="rgba(255,255,255,.5)" stroke-width="2"/>
      <rect x="52" y="24" width="206" height="126" rx="5" fill="${lin("glass", 1, 1)}"/>
      <rect x="70" y="44" width="96" height="14" rx="5" fill="rgba(252,250,248,.9)"/><rect x="70" y="68" width="130" height="14" rx="5" fill="#39a1ac"/><rect x="70" y="92" width="76" height="14" rx="5" fill="rgba(252,250,248,.9)"/><rect x="70" y="116" width="112" height="14" rx="5" fill="rgba(252,250,248,.35)"/>
      <path d="M12 168 H298 L280 196 Q277 200 270 200 H40 Q33 200 30 196 Z" fill="${lin("steel", 0, 1)}"/>
      <rect x="125" y="171" width="60" height="7" rx="3.5" fill="rgba(0,0,0,.2)"/>` }),

    mailbox: ({ lin, o }) => ({ w: 250, h: 260, body: `
      <rect x="104" y="150" width="24" height="96" rx="4" fill="${lin("wood", 1, 0)}"/>
      <path d="M26 156 V110 Q26 58 112 58 Q198 58 198 110 V156 Z" fill="${lin(o.color || "#196d76")}"/>
      <path d="M26 156 V110 Q26 58 112 58 Q198 58 198 110 V156 Z" fill="none" stroke="rgba(255,255,255,.35)" stroke-width="2"/>
      <path d="M40 108 Q44 74 112 72" fill="none" stroke="rgba(255,255,255,.35)" stroke-width="5" stroke-linecap="round"/>
      <rect x="62" y="104" width="100" height="10" rx="5" fill="rgba(0,0,0,.35)"/>
      <circle cx="112" cy="136" r="7" fill="${lin("brass")}"/>
      <rect x="198" y="86" width="9" height="62" rx="3" fill="${lin("steel", 1, 0)}"/>
      <path d="M207 88 H236 V114 H207 Z" fill="#ee7c2b"/>` }),

    // Letter: a portrait sheet with a folded corner; o.lines sets how full it is, o.sign adds a signature.
    letter: ({ lin, o }) => { const n = o.lines || 5; let rows = "";
      for (let i = 0; i < n; i++) rows += `<path class="row${i + 1}" d="M34 ${92 + i * (n > 6 ? 21 : 30)} H${i % 3 === 2 ? 140 : 186}" stroke="#7d7250" stroke-width="${n > 6 ? 5 : 7}" stroke-linecap="round"/>`;
      return { w: 220, h: 290, body: `
      <path d="M8 8 H172 L212 48 V282 H8 Z" fill="${lin("paper")}" stroke="#a8996f" stroke-width="2"/>
      <path d="M172 8 V48 H212 Z" fill="${lin("paper", 0, 1)}" stroke="#a8996f" stroke-width="2"/>
      <path d="M10 10 H170" stroke="rgba(255,255,255,.8)" stroke-width="2"/>
      <rect x="20" y="20" width="148" height="260" fill="none" stroke="#e3d6b2" stroke-width="2"/>
      <path d="M34 54 H120" stroke="#4f4630" stroke-width="9" stroke-linecap="round"/>
      ${rows}
      ${o.sign ? `<path d="M34 252 C48 232 58 262 72 244 S96 236 108 250" fill="none" stroke="#196d76" stroke-width="5" stroke-linecap="round"/>` : ""}` }; },

    // Sticky note: a yellow pad sheet with a curled corner and rough handwritten lines.
    notes: ({ lin }) => ({ w: 220, h: 220, body: `
      <path d="M8 8 H212 V168 L164 212 H8 Z" fill="${lin("#d9b743")}"/>
      <path d="M10 10 H210" stroke="rgba(255,255,255,.6)" stroke-width="2"/>
      <path d="M164 212 L172 176 L212 168 Z" fill="${lin("#b8962e", 0, 1)}"/>
      <rect x="20" y="20" width="180" height="146" fill="none" stroke="rgba(120,90,10,.25)" stroke-width="2"/>
      <path d="M30 52 C50 44 70 58 92 50 S130 44 150 52" fill="none" stroke="#4a3b12" stroke-width="6" stroke-linecap="round"/>
      <path d="M34 86 C60 80 82 92 104 84" fill="none" stroke="#4a3b12" stroke-width="6" stroke-linecap="round"/>
      <path d="M120 82 L172 92" stroke="#4a3b12" stroke-width="6" stroke-linecap="round"/>
      <path d="M30 122 C52 114 66 128 92 118 S118 112 132 122" fill="none" stroke="#4a3b12" stroke-width="6" stroke-linecap="round"/>
      <path d="M28 154 C44 148 58 158 74 152" fill="none" stroke="#4a3b12" stroke-width="6" stroke-linecap="round"/>` }),

    // Envelope: paper body, folded flap, a stamp as the inset detail.
    envelope: ({ lin }) => ({ w: 280, h: 200, body: `
      <rect x="8" y="10" width="264" height="180" rx="10" fill="${lin("paper")}" stroke="#a8996f" stroke-width="2"/>
      <path d="M10 12 H270" stroke="rgba(255,255,255,.8)" stroke-width="2"/>
      <path d="M12 16 L140 112 L268 16" fill="none" stroke="#c9b987" stroke-width="4" stroke-linejoin="round"/>
      <path d="M12 186 L112 104 M268 186 L168 104" stroke="#d9cba3" stroke-width="3"/>
      <rect x="206" y="128" width="46" height="46" rx="4" fill="${lin("#196d76")}"/>
      <rect x="212" y="134" width="34" height="34" rx="2" fill="none" stroke="rgba(252,250,248,.6)" stroke-width="2" stroke-dasharray="3 3"/>` }),
  };

  const CSS = ".obj{display:block;overflow:visible;filter:drop-shadow(0 14px 18px rgba(0,0,0,.4))}";
  const draw = (name, o = {}) => {
    if (!LIB[name]) throw new Error("Objects: no object named " + name);
    const P = "ob" + (++uid) + "-"; let defs = "", n = 0;
    const grad = (kind, mat, x2, y2) => { const id = P + (++n), st = tone(mat).map((c, i) => `<stop offset="${OFF[i]}" stop-color="${c}"/>`).join("");
      defs += kind === "lin" ? `<linearGradient id="${id}" x1="0" y1="0" x2="${x2}" y2="${y2}">${st}</linearGradient>` : `<radialGradient id="${id}" cx=".34" cy=".28" r=".85">${st}</radialGradient>`; return `url(#${id})`; };
    const lin = (mat, x2 = 1, y2 = 1) => grad("lin", mat, x2, y2), rad = (mat) => grad("rad", mat);
    const { w, h, body } = LIB[name]({ lin, rad, o });
    return `<svg class="obj obj-${name}" viewBox="0 0 ${w} ${h}" xmlns="http://www.w3.org/2000/svg"><defs>${defs}</defs>${body}</svg>`;
  };
  if (typeof document !== "undefined") { const s = document.createElement("style"); s.textContent = CSS; document.head.append(s); }
  window.Objects = { draw, mount: (sel, name, o) => { document.querySelector(sel).innerHTML = draw(name, o); }, names: Object.keys(LIB) };
})();
