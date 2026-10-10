// Boxing broadcast helpers: the motion constants, caption phrases, beat tags, action tags, chyron, and hit burst.
// Load after rig3d.js and poses.js. `const K = BoxingKit(tl)` binds them to a timeline.
const EASE = { text: "power3.out", out: "power2.in", pose: "power3.inOut", punch: "power4.out", recoil: "back.out(1.6)" };
const DUR = { textIn: 0.4, textOut: 0.2, pose: 0.35, punch: 0.16, recover: 0.32 };
const CAPTION_END_PAD = 0.2;

function BoxingKit(tl) {
  // Grouping and absolute word timing adapted from caption-highlight; boxing uses a red underline.
  const addCaptionGroups = (VOICE) => {
    const parent = document.getElementById("captions");
    VOICE.forEach((scene, si) => {
      const groups = scene.groups.map(([first, last], gi) => {
        const phrase = document.createElement("p");
        phrase.className = "phrase";
        phrase.id = `caption-${si}-${gi}`;
        phrase.style.opacity = "0";
        scene.words.slice(first, last + 1).forEach((word, wi) => {
          const span = document.createElement("span");
          span.className = "word";
          span.id = `word-${si}-${first + wi}`;
          span.textContent = word.text;
          phrase.append(span, document.createTextNode(" "));
        });
        parent.appendChild(phrase);
        return { phrase, first, last };
      });
      groups.forEach(({ phrase, first, last }, gi) => {
        const start = scene.start + scene.words[first].start;
        const next = groups[gi + 1] && scene.words[groups[gi + 1].first].start + scene.start;
        const end = Math.min(scene.start + scene.words[last].end + CAPTION_END_PAD, next ?? scene.start + scene.duration);
        tl.set(phrase, { opacity: 1 }, start);
        tl.set(phrase, { opacity: 0 }, end);
        for (let wi = first; wi <= last; wi++) {
          const word = scene.words[wi];
          const span = document.getElementById(`word-${si}-${wi}`);
          tl.set(span, { textDecorationColor: "#d2333a" }, scene.start + word.start);
          tl.set(span, { textDecorationColor: "transparent" }, scene.start + word.end);
        }
      });
    });
  };

  const setBeat = (id, t) => {
    tl.set("#bug span", { opacity: 0 }, t);
    tl.fromTo(`#${id}`, { opacity: 0, x: -12 }, { opacity: 1, x: 0, duration: 0.25, ease: EASE.text }, t);
  };
  const tagIn = (id, t, hold) => {
    tl.fromTo(id, { opacity: 0, y: 10 }, { opacity: 1, y: 0, duration: 0.25, ease: EASE.text, immediateRender: false }, t);
    tl.to(id, { opacity: 0, duration: 0.25 }, t + 0.25 + hold);
  };
  // The chyron rests while nobody speaks over a knockdown, and comes back with the next line.
  const chyronOut = (t) => tl.to("#chyron", { opacity: 0, duration: 0.2, ease: EASE.out }, t);
  const chyronIn = (t) => tl.fromTo("#chyron", { opacity: 0, scaleX: 0.6, transformOrigin: "left center" }, { opacity: 1, scaleX: 1, duration: DUR.textIn, ease: EASE.text, immediateRender: false }, t);
  const burst = (t, big = 1.5, rot = 20) => {
    tl.fromTo("#burst", { opacity: 0, scale: 0.35, rotation: 0 }, { opacity: 1, scale: 1, duration: 0.08, ease: "power4.out", immediateRender: false }, t);
    tl.to("#burst", { opacity: 0, scale: big, rotation: rot, duration: 0.42, ease: "power2.out" }, t + 0.08);
  };
  return { addCaptionGroups, setBeat, tagIn, chyronIn, chyronOut, burst };
}
