// Drawn people for the Pūpūkahi Tech style: flat busts with no face, one lit and one shadow tone.
// Load after GSAP; it defines window.People:
//   People.SKIN               skin tones (porcelain, light, tan, olive, brown, deep), each [light, shadow]
//   People.LOOKS              presets; spread one and override: { ...People.LOOKS.saver, shirt: "#196d76" }
//   People.person(id, look, label)  the markup for one person (an SVG bust and its plain-word label)
//   People.mount(sel, look, label)  fills the element at sel with that person
// look = { skin, hair, hairColor, top, shirt, prop }; every field is optional.
//   skin:  a key of People.SKIN, or [light, shadow] colors
//   hair:  "short" | "buzz" | "bun" | "long" | "curly" | "bald"
//   top:   "crew" | "collar" | "hoodie"
//   shirt: any color (the style's support colors read best on the ground)
//   prop:  null | "lanyard" | "tie" | "glasses" | "earrings"
(() => {
const SKIN = {
  porcelain: ["#f6d3b8", "#d29f7d"], light: ["#f0c09a", "#c08560"], tan: ["#e0a77c", "#a96c45"],
  olive: ["#c9965f", "#8e6236"], brown: ["#b98256", "#7a4a2c"], deep: ["#8a5a3b", "#4f2f1c"],
};
const LOOKS = {
  saver: { skin: "light", hair: "bun", hairColor: "#5a3420", top: "crew", shirt: "#367d65", prop: null },
  trader: { skin: "brown", hair: "short", hairColor: "#1b1411", top: "collar", shirt: "#ee7c2b", prop: "lanyard" },
  student: { skin: "deep", hair: "curly", hairColor: "#1b1411", top: "hoodie", shirt: "#196d76", prop: null },
  teller: { skin: "olive", hair: "buzz", hairColor: "#2b1d16", top: "collar", shirt: "#fcfaf8", prop: "tie" },
  elder: { skin: "tan", hair: "bald", hairColor: "#000000", top: "crew", shirt: "#d19847", prop: "glasses" },
  founder: { skin: "porcelain", hair: "long", hairColor: "#c8913f", top: "crew", shirt: "#196d76", prop: "earrings" },
};
function person(id, look = {}, label = "") {
  const { skin = "tan", hair = "short", hairColor = "#2b1d16", top = "crew", shirt = "#367d65", prop = null } = look;
  const [s1, s2] = Array.isArray(skin) ? skin : SKIN[skin];
  const line = "rgba(0,0,0,.28)";
  // Head: ellipse cx 95, cy 74, rx 42, ry 47 (top at y 27); shoulders from y 146.
  const back = {
    long: `<path d="M48 72 C42 26 148 26 142 72 L150 152 C128 162 62 162 40 152 Z" fill="${hairColor}"/>`,
  }[hair] || "";
  const front = {
    short: `<path d="M52 74 C50 40 70 27 95 27 C121 27 140 40 138 74 C134 60 124 50 108 48 C92 46 68 50 58 60 C55 64 53 69 52 74 Z" fill="${hairColor}"/>`,
    buzz: `<path d="M53 70 C51 38 71 27 95 27 C120 27 139 38 137 70 C128 52 62 52 53 70 Z" fill="${hairColor}" opacity=".7"/>`,
    bun: `<circle cx="95" cy="22" r="17" fill="${hairColor}"/><path d="M51 80 C46 42 66 26 95 26 C124 26 144 42 139 80 C136 64 128 54 116 50 C100 58 74 56 60 62 C55 67 52 73 51 80 Z" fill="${hairColor}"/>`,
    long: `<path d="M50 82 C46 40 66 25 95 25 C124 25 144 40 140 82 C134 58 120 48 95 50 C80 52 64 58 50 82 Z" fill="${hairColor}"/>`,
    curly: [[60, 52, 16], [75, 37, 17], [95, 31, 18], [115, 37, 17], [130, 52, 16], [52, 70, 12], [138, 70, 12]]
      .map(([x, y, r]) => `<circle cx="${x}" cy="${y}" r="${r}" fill="${hairColor}"/>`).join(""),
    bald: "",
  }[hair];
  const neckline = {
    crew: `<path d="M80 146 Q95 158 110 146" fill="none" stroke="${line}" stroke-width="7" stroke-linecap="round"/>`,
    collar: `<path d="M80 146 L70 168 L93 158 Z M110 146 L120 168 L97 158 Z" fill="${shirt}" stroke="${line}" stroke-width="2.5" stroke-linejoin="round"/>`,
    hoodie: `<path d="M62 156 C62 128 128 128 128 156" fill="none" stroke="${shirt}" stroke-width="16" stroke-linecap="round"/><path d="M62 156 C62 128 128 128 128 156" fill="none" stroke="${line}" stroke-width="16" stroke-linecap="round" opacity=".5"/><path d="M86 160 L84 194 M104 160 L106 194" stroke="#fcfaf8" stroke-width="3" stroke-linecap="round"/>`,
  }[top];
  const props = {
    lanyard: `<path d="M80 152 L90 196 M110 152 L100 196" stroke="#fcfaf8" stroke-width="3" fill="none"/><rect x="83" y="194" width="24" height="30" rx="4" fill="#fcfaf8"/><rect x="88" y="202" width="14" height="4" rx="2" fill="#39a1ac"/>`,
    tie: `<path d="M90 152 L100 152 L104 196 L95 212 L86 196 Z" fill="#1d2930"/>`,
    glasses: `<g fill="rgba(252,250,248,.18)" stroke="#1d2930" stroke-width="3.5"><circle cx="77" cy="84" r="12"/><circle cx="113" cy="84" r="12"/><path d="M89 84 H101" fill="none"/></g>`,
    earrings: `<circle cx="53" cy="98" r="4.5" fill="#e8bb3a"/><circle cx="137" cy="98" r="4.5" fill="#e8bb3a"/>`,
  };
  const onShirt = prop === "lanyard" || prop === "tie" ? props[prop] : "";
  const onHead = prop === "glasses" || prop === "earrings" ? props[prop] : "";
  return `<svg viewBox="0 0 190 230"><defs>
      <radialGradient id="${id}-skin" cx=".38" cy=".32" r=".75"><stop offset="0" stop-color="${s1}"/><stop offset="1" stop-color="${s2}"/></radialGradient>
      <linearGradient id="${id}-fold" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#fff" stop-opacity=".18"/><stop offset="1" stop-color="#000" stop-opacity=".25"/></linearGradient></defs>
    ${back}
    <rect x="78" y="100" width="34" height="62" rx="14" fill="${s2}"/>
    <path d="M16 230 C16 186 34 160 64 151 L80 146 Q95 158 110 146 L126 151 C156 160 174 186 174 230 Z" fill="${shirt}"/>
    <path d="M16 230 C16 186 34 160 64 151 L80 146 Q95 158 110 146 L126 151 C156 160 174 186 174 230 Z" fill="url(#${id}-fold)"/>
    <path d="M48 168 C42 188 40 208 40 230 M142 168 C148 188 150 208 150 230" fill="none" stroke="${line}" stroke-width="3"/>
    ${neckline}${onShirt}
    <ellipse cx="53" cy="82" rx="8" ry="11" fill="${s2}"/><ellipse cx="137" cy="82" rx="8" ry="11" fill="${s2}"/>
    <ellipse cx="95" cy="74" rx="42" ry="47" fill="url(#${id}-skin)"/>
    ${front}${onHead}</svg>${label ? `<b>${label}</b>` : ""}`;
}
const mount = (sel, look, label) => { document.querySelector(sel).innerHTML = person(sel.replace(/\W/g, ""), look, label); };
window.People = { SKIN, LOOKS, person, mount };
})();
