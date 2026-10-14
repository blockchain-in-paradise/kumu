---
name: "Pūpūkahi Tech Foundation"
source: "https://pupukahitech.org/"
register: dark
colors:
  canvas: "#0e394e" # base of the ground
  ink: "#fcfaf8" # text and default marks
  on-highlight: "#1d2930" # text on the highlight
  accent: "#39a1ac" # actions, state, and data marks
  highlight: "#d19847" # caption spoken word and closing kicker only
  panel: "rgba(14,57,78,.72)" # restrained backing behind a proof object
  border: "rgba(252,250,248,.22)"
  support: # extra diagram colors, used sparingly
    primary: "#196d76"
    palm: "#367d65"
    sunset: "#ee7c2b"
typography:
  display: { fontFamily: "Inter", weight: 800, lineHeight: 0.92, tracking: "-0.04em" }
  body: { fontFamily: "Inter", weight: 400, lineHeight: 1.4 }
  fonts: "assets/fonts/inter-{400,600,800}.woff2"
voice: "af_heart"
voice_speed: 1.0
preview_at: [0.3, 19.0, 42.0] # the sample's frames: title with the hero object, the swap mid-cross with a caption, the closing card
spacing:
  edge: "92px"
  platform_ui_bottom: "420px"
  caption_bottom: "340px"
assets:
  ground: "assets/ground.webp"
  logo: "assets/logo.svg"
  logo_color: "assets/logo-color.webp"
  icon_dir: "assets/icons/"
official_asset_urls:
  logo: "https://pupukahitech.org/assets/logo-white-CuOuO6kL.svg"
  logo_color: "https://storage.googleapis.com/gpt-engineer-file-uploads/VT5rFLkaTBYAF9U6C2W1ZYRJAHj2/social-images/social-1784764299804-Color_logo_with_background.webp"
  ground: "https://pupukahitech.org/assets/hero-bg-DlfPret3.webp"
visuals: drawn # proof objects are built, not sourced; skip photo and screen research
skills: [hyperframes-core, hyperframes-cli, media-use] # implementation; shared pipeline loads design resources
opening: "titled" # the video title as the header and the proof object on screen from frame 0 (see Opening)
closing: "fade" # no payoff: the diagram fades, the object and header fade out together, then the closing card (see Closing)
cta:
  kicker: "FOLLOW"
  handle: "@pupukahi_tech"
  platforms: [tiktok, linkedin, instagram]
  icon_colors: [ink, accent]
---

# Character

Warm off-white editorial type on the darker website register: ocean navy
photographic ground, teal action color, sand-gold highlight, Inter, generous
spacing, and direct community language. Avoid decorative pseudo-Hawaiian motifs.
The audience is local people learning about technology. Show them the real
thing they will use (a phone chat, a letter, a flyer) whenever it can be seen,
and reach for something they already handle only when the idea itself is
invisible (see Literal or metaphor).
`index.html` in this folder is the working sample for quality and helpers
(`ws`, `box`, `at`, `to`, `pull`, `carry`, `take`, `tick`, `price`, `widen`,
`fit`), built from the stablecoins v2 run; its coin, ruler, firm, safe, and lock
are examples, not a required cast. `assets/` holds what earlier videos made
(see Assets); reuse it before drawing anything new.

# Look

One headline and one dominant proof object per scene. Row count follows
phone-size readability. The frame is an editorial field, not a dashboard:
colors, type, spacing, safe areas, and the closing card are fixed, and the
layout and motion of the proof object are designed per scene. Preserve useful
object identity across beats.

Proof objects look like the real thing and are drawn to the recipe in Drawing
objects. Label them in plain words. No value tags on the object: the scale names
the value. What stands behind an object is drawn too, never a text list; a
backing (a shelf lighter than the ground, `#1f6a80` to `#175469` with a teal
border) is one option when the object needs a stage. When something passes from
one object into another, carry the thing itself: a small copy leaves the giver
and lands where it really goes (a note into a chat's message bar, not beside the
phone), in one simple move that slides and shrinks it onto the target. A glowing
teal dotted path is only for a continuous flow with nothing to carry (current, a
feed), and it must start and end on the two objects it joins; never a connector
between boxes, never decoration, never to a person. Keep a settled state to the
headline, one object group, and the caption.

- **Exchanges read as handing over.** An item carried to a person lands at their
  side (the hand side, about chest height), never on the face, and stays visible
  until the next spoken step uses it. A swap moves both items at the same time so
  they cross. People are drawn as large as the object they deal with (about
  240 px wide).
- **Writing is shown as writing.** Text being written appears one letter at a
  time while the pen tip follows the next letter and bobs with each stroke; no
  wipes, slides, or fades. The pen leaves as soon as the line is done.
- **Motion only for a change.** No pulse, bounce, or glow on a word that is merely
  mentioned; something moves or lights only when its state changes.
- **Little text.** One plain label per object at most; people are labelled with
  their name only. Show relationships with small icon boxes (a chain-link box
  holding a code) instead of sentences ("From page 1:"). A secondary copy of a
  document (a neighbor's page, a page in a stack) shows written lines, not its
  values.
- **Scales show only the range in use** (a ruler from $0.99 to $1.01) and widen on
  screen, ticks sliding apart and new ticks fading in after, when the value leaves
  it. The object on the scale sits at least 60 px above it.
- **Things sit where they would.** Cash stands in front of a safe, not on its top;
  a slot is on the door. Use the band from y 470 to 1400; never leave the lower
  half empty while the top is crowded.
- **Draw recognizable things,** never a labelled card standing in for one: a safe
  with a deposit slot, not a "1 coin for $1" sign; a printed flyer and a greeting
  card, not two pages.

The [plain](../plain/style.md) diagram rules (Motion) apply; the sample implements each
of them, so reuse its helpers rather than rewriting them: `ws` (phrase anchors),
`box`, `at`, and `to` (layout positions), `pull`, `carry`, and `take`
(exchanges), `tick`, `price`, and `widen` (the scale names the value), `fit`
(headline size), and `INTRO` (the bookend). In this style:

- **People** follow People and looks below.
- **Exchanged items** are small copies of what the scene already drew (in the
  sample, the small USDC coin and one $1 bill).
- **The scale** lights its mark teal, or sunset below the target.
- **A failure** greys and stops the flow, lands the sunset lock pill (padlock and
  two or three words, `--on-highlight` text) on the top edge of what stopped, and
  greys or dims what depended on it. Never an orange fill or a crack; the lock
  pill is the only orange shape.

The sample is a reference for quality and for its helpers, not a layout to
copy. Fixed across videos: the ground, colors, type, captions, motion values,
opening, closing, and closing card. Designed new for each video: the objects
and what stands behind them, how many scenes there are, where things sit and
which side people enter from, the people's looks, and what a failure stops.

**Scenes.** A list or walkthrough gets one scene per item, each with its own
before and after (messy notes become an email; a blank page becomes a flyer),
its own header, and a small "1 of 3" kicker in `#6fd0da` (40 px, y 250) above
the header (then at y 310). Items need not share a format: a phone chat, a
printed flyer, and a letter can follow each other. A single mechanism stays one
stage that changes. Scenes join with the left push.

Motion reveals information in stages. The film current is left: ordinary seams
use a left push of the scene's objects. Headers and kickers do not travel: at
the seam the old one fades out (0.3 s) and the next fades in (0.3 s) in the
same spot. A zoom-through is optional. Keep one readable scene at each
handoff, with no blank landing or overlapping headlines. No crossfades,
floating, breathing, wobble, glassmorphism, card grids, or emoji.

# Drawing objects

Every object is drawn to one recipe, so a coin, a lock, and a laptop look made
together. `assets/objects/objects.js` implements it (`Objects.draw(name, options)`
or `Objects.mount(selector, name, options)`); draw a missing object by the same
rules and add it there.

- **Light** comes from the top left, always. Shadows fall down and right.
- **Body**: a four-tone gradient from light to dark in the material's own colors
  (gold, steel, brass, paper, glass, wood, or a painted base color), never a
  flat fill.
- **Edge**: a rim, bezel, border, or lip, with a thin light edge on the lit side.
- **Inset detail**: one inner ring, panel, or border that makes it read as built,
  not cut out.
- **Shadow**: soft and low, about `0 14px 18px` at 40% black (the `.obj` class).
- **Label**: at most one, in plain words, in Inter.
- **Real shape**: real proportions and real arrangement of parts. No outlines, no
  faces, no cartoon exaggeration.
- **Color**: the material's true color, pulled slightly toward the ground (muted,
  not neon). Teal, `support`, and sunset mark state and accents on an object,
  not its body. Vary materials as the real things do (white office paper, a
  yellow sticky note, a green greeting card, a white chat screen); the library's
  cream `paper` is for things that really are cream (old ledgers, certificates),
  not the default for every page.
- **Text on an object** keeps 3:1 contrast; darken the object, not the text.

# Literal or metaphor

Decide per idea, not per video.

1. **Literal first.** A task, a tool, a document, a screen, a place, or a price
   is drawn as itself: the chat on a phone (a generic app, header "AI
   Assistant", teal user bubbles, white replies, a message bar with a send
   button), the letter with its fine print, the flyer as printed. Sample text
   reads like the real thing (notes the way a person jots them, an email that
   matches them) and is called an example once, in speech.
2. **A metaphor only for the invisible part.** When the idea cannot be seen
   (a hash, consensus, a key pair, a peg), choose the everyday object that
   behaves the same way (ledger book, seal, mailbox, lockbox, vault, receipt,
   notebook, vending machine). It must pass the mapping test in the root concept
   step, the technical word appears once as a plain label on it, and the
   narration says once, in one short line, where it stops being true. If the
   viewer has to translate the metaphor before learning the idea, drop it.
3. **Keep one** metaphor per video, and keep it to the part it explains; the
   rest of the video stays literal.
4. **Starter pairs** (suggestions, not rules): a fingerprint or hash is a seal;
   a blockchain is sealed ledger pages or a notebook every neighbor keeps a copy
   of; public and private keys are a mailbox slot and its owner's key; a smart
   contract is a vending machine; encryption is a lockbox; two-factor login is a
   door with two locks; cloud storage is a storage unit; a stablecoin is a coin
   backed by a vault. An AI prompt needs no metaphor: show the chat.
5. **Brands.** A product the narration names may appear as its logo, only to
   identify it (Simple Icons path data, CC0; record it in `research.json`
   visuals). Never use a logo as decoration or to imply endorsement.

# People and looks

`assets/characters/people.js` (load it after GSAP) draws people as flat busts
with no face: an oval head with ears, hair shaped to the skull, a neck going
into the collar, rounded shoulders, one lit and one shadow tone. Mount one
with `People.mount("#id", look, "Label")`; labels are 40 px plain words.

A look is `{ skin, hair, hairColor, top, shirt, prop }`. `skin` from
`People.SKIN` (porcelain, light, tan, olive, brown, deep); `hair` one of
`short`, `buzz`, `bun`, `long`, `curly`, `bald`; `top` one of `crew`,
`collar`, `hoodie`; `shirt` any color, best from `support`; `prop` one of
`lanyard`, `tie`, `glasses`, `earrings`, or `null`.

`People.LOOKS`: `saver`, `trader`, `student`, `teller`, `elder`, `founder`.
Spread a preset and override: `{ ...People.LOOKS.teller, skin: "deep" }`.

Choose each person's look to fit the role and the topic (a teller in a collar
and tie, a student in a hoodie); do not leave the sample pair by default. In
one video, no two people share a hair and top, and their shirts differ. To add
a hair, top, or prop, add it to `people.js`, never as SVG drawn over a person
in the composition.

At most three people are on screen. An actor moves beside what they act on, stays
until it is done, and returns to their place. Bystanders stand in a centered row
under the diagram, and their records are small copies of the main object.

# Ground (required on every scene)

Every scene sits on the ground: two static layers, bottom to top. It makes
consecutive scenes read as one film. The photo is a texture, not an image; do
not raise its opacity to make it visible, and do not remove or brighten the
ground to fix foreground contrast. Move or enlarge labels, or give the proof
object a restrained `--panel` backing, instead.

```css
.ground { position: absolute; inset: 0; overflow: hidden; background: var(--canvas); }
.ground-photo {
  position: absolute; inset: 0; opacity: 0.15;
  background: url("assets/ground.webp") center / cover no-repeat;
}
```

# Motion values

| Value | Setting |
| --- | --- |
| Eases | Enter `power3.out`, exit `power3.in`, state moves `power2.inOut`; closing card entries `power4.out` |
| Durations | Entrances 0.6 s, the left-push seam 0.6 s, small state moves 0.5 s |
| Overshoot | None; this style settles without bounce |
| Stagger | 0.08 s between entering elements |
| State changes | Values change by stepping (`tl.set`) at the moment they change, never by counting up |

# Sound

Files are in `assets/sfx/` (credits in `CREDITS.md`).

| Event | File | Gain |
| --- | --- | --- |
| A value changes | `click.ogg` | 0.4 |
| A proof object or panel lands | `place.ogg` | 0.4 |
| Left-push seam | `slide.ogg` | 0.3 |
| Emphasis on the key change | `soft-impact.ogg` | 0.35 |

Music: bundled `happy-beats-business-moves-vol-12`, about 24 LU under the
narration (roughly 0.05 gain).

# Type and captions

Headlines 80–112 px, essential labels 40–52 px, captions 52 px at 1080×1920.
Headlines fill 92–988 px through the sample's `fit()`, set as
`tl.set(hl, { textContent, fontSize: () => fit(text) }, t)` with
`text-wrap: balance`. Keep at least 40 px between the headline's last line and
the object below it.
Captions sit on the ground with no backing. Finished and upcoming words stay
`--ink`; only the current word gets a `--highlight` background with
`--on-highlight` text. `--highlight` is for that word and the closing kicker
only. Give important values emphasis through size and weight in `--ink`.

# Pronunciation

Kokoro reads Hawaiian words as English. In the TTS input only, use these
respellings; `SCRIPT.md`, captions, and on-screen text keep the correct
spelling and diacritics. Draft respellings, to be confirmed by ear with
`video-output/pupukahi-pronunciation-test`; edit this table after listening.

| Word | Respelling |
| --- | --- |
| Pūpūkahi | poo-poo-kah-hee |
| Hawaiʻi | ha-wy-ee |
| kūpuna | koo-poo-nah |
| ʻohana | oh-hah-nah |
| kōkua | koh-koo-ah |
| mahalo | mah-hah-loh |
| aloha | ah-loh-hah |
| Honolulu | hoh-noh-loo-loo |

English tech words are not respelled by default. If the voice mispronounces one,
reword the line instead, and test unusual terms in a short sample before
generating the full script.

Known misreads (reword, do not respell): "redoes" (use "rebuilds" or "makes
again"), "USDC" in running speech (the TTS input spells it "U S D C").

# Words

Write so a viewer who already knows the subject finds nothing vague: name who
does what ("the cheater", not "they", when two parties are on screen), keep one
idea per sentence, and say what a rule means in practice. Say once, near the
start, that the sample data is an example; do not tack "for example" onto a
later line.

# Claims

These topics touch money, security, and law, and the audience may act on them.
List each claim with its source in the plan. A rule or fee that depends on the
place gets one short spoken qualifier ("rules vary by state"), never an
on-screen disclaimer block. Cite Hawaiʻi rules to state sources, not to
national summaries, and say plainly when a protection has limits. No price
predictions, no promise of returns, and no advice to buy anything. Do not name
real incidents, projects, or people other than the subject unless the viewer
needs them to act. Amounts carry a unit, and example data is called an example
once, in speech.

# Opening: titled

No empty intro. At t = 0 the header is the video title (the thumbnail title)
and the opening object (the real subject, or the metaphor's object when the
video has one) is already on screen, large in the free space under the header
(about 1.5× to 1.8×). The narration starts at once. As the
first diagram part arrives, the object scales to its diagram spot (0.6 s,
`power2.inOut`). The
header stays through the explanation and changes only when the scene's subject
changes (a failure state, a new scene); the rest of the stage builds in as the
words name it. Set this first-frame state with `gsap.set`, not `tl.set` at 0, and
measure positions that items travel between before applying the opening scale.

# Closing: fade together

There is no payoff card. On the answer line, the rest of the diagram (scale,
shelf, paths, people, marks) fades over 0.6 s (`power3.in`) while the main
object returns to its opening size and spot (0.8 s, `power2.inOut`), raised
above the fading parts (`zIndex`). In a video of several scenes, the last
scene's header fades first, a short beat, then the scene's objects slide out
left as the opening object slides back in from the right and the title fades
in.

Give the end room: leave about a 1 s pause in the voice before the answer line
so the last scene can be read, and hold the final state about 1.2 s after the
last word before anything fades. After the last spoken line, the main object,
the caption, and the header fade out together over 0.6 s. The closing card
enters about 0.3 s later with its own entries; there is no left push, so the
closing card scene starts 0.9 s after the last word ends.

# Closing card

Its own 4–6 s scene on the ground, nothing else on it, no logo:

```html
<div class="cta-lockup">
  <div class="cta-kicker">FOLLOW</div>
  <h1 class="cta-handle">@pupukahi_tech</h1>
  <div class="socials"><!-- inline icons/*.svg in cta.platforms order (Tabler outline, see assets/icons/CREDITS.md) --></div>
</div>
```

```css
.cta-lockup { position: absolute; inset: 0; display: flex; flex-direction: column;
  align-items: center; justify-content: center; padding: 0 60px; text-align: center; }
.cta-kicker { color: var(--highlight); font-size: 45px; font-weight: 800; letter-spacing: 0.18em; }
.cta-handle { margin: 30px 0 0; color: var(--ink); font-size: 82px; font-weight: 800;
  line-height: 1; letter-spacing: -0.06em; }
.socials { display: flex; align-items: center; justify-content: center; gap: 30px; margin-top: 48px; }
.socials svg { display: block; width: 94px; height: 94px; flex: 0 0 94px; color: var(--ink); }
```

Entry: kicker rises at 0.30 s, handle at 0.48 s (`power4.out`, 0.72 s), then
the icons rise together with a 0.10 s stagger from 0.98 s (`power3.out`, 0.48 s).
Use the first color in `cta.icon_colors` for every icon, never per-platform colors.

# Assets

Reuse these before drawing anything new; each was accepted in a finished video.

- `assets/objects/objects.js` (`Objects.draw`, `Objects.mount`; see `sheet.html`):
  coin, cash, page, seal, padlock, key, safe, ledger, receipt, phone, laptop,
  mailbox, letter (`lines`, `sign`), notes (a sticky note), envelope.
- `assets/characters/people.js`: drawn people (see People and looks).
- `assets/ui/chat-phone.html`: a phone running a generic chat app (header "AI
  Assistant", teal user bubbles, white replies, an attachment chip, a message bar
  with a send button) plus the round logo badges; copy the CSS between its
  markers.
- `assets/ui/messages-phone.html`: a phone running a plain texting app (sender
  header, grey incoming and teal outgoing bubbles, a QR card, sunset underline
  and border marks, a row-snapping scroll) for scam, message, or chat examples.
- `assets/ui/question-path.html`: a decision path (a track with up to five
  stops that turn grey to teal to a sunset flag, yes and no routes ending on the
  lock pill or a teal "Check first" pill); stops arrive before the track.
- `assets/ui/notebook-page.html`: a sealed notebook page (lined paper, top-left
  hash box, payment line, wax seal, "Redone" tag) for chains of records.
- `assets/ui/pencil.svg`: the pencil for writing on screen (see Look).
- `assets/logos/`: ChatGPT, Gemini, and Claude marks with their badge colors and
  license note in `CREDITS.md`.
- `assets/icons/`, `assets/sfx/`, `assets/fonts/`, `assets/ground.webp`: the
  closing-card icons, sound effects, Inter, and the ground.

The sample's CSS coin (ridged rim, pressed ring, 58 px "USDC"), its price ruler,
and its safe with a deposit slot are in `index.html`.

# Checks

Before the Studio checkpoint, besides the root review:

- **Anchors are unique.** Every phrase a state is anchored to occurs once in
  the script; the sample's `ws()` throws on a repeat, so `hyperframes check`
  fails instead of an item moving at the wrong line.
- **Positions are layout positions.** Measure with `box`/`at`/`to` (offsets), not
  screen rectangles, so Studio's scaled preview matches the render; wrap a bare
  SVG in a box before measuring it.
- **Filters start explicit.** Set `filter: grayscale(0) brightness(1)` before
  tweening a grey-out, or the first frames flash black.
- **Every exchange is checked frame by frame.** Take a frame every 0.3 s across
  each carry and swap from a draft render, and confirm each item starts on the
  giver's edge and ends on the receiver's side, without covering the hero's
  label while a copy is drawn out or taken in.
- **Results convince.** Inspect each task's final result at phone size: it
  looks like finished work, its example content fits the task, and its claims
  agree with research. Compare the before and after without relying on speech.
- **Attention stays clear.** Play each important handoff with its caption;
  the destination is visible before transfer and the item stays identifiable.
  A 0.3 s frame series supplements playback; it cannot prove absence of a
  one-frame flash, so retain the root frame-rate video audit.
- **The end has room.** About 1 s of silence before the answer line and 1.2 s held
  after the last word.

# Choreography

Use shared creative and animation references for craft, filtered through this
style's material recipe, restrained motion, and measured transfer helpers.
Design each task as a recognizable before and after; keep abstract parts to
one faithful metaphor. Preserve a clear main object and hand attention to
its result instead of adding a new prop for each spoken clause.

| Before | Action | Result |
| --- | --- | --- |
| Rough stock notes beside an empty table | Each item and its quantity travel together into their matching cells | A readable organized table preserves the example's values |
| A promotion with content but no finished design | Type, illustration, and spacing form one deliberate composition | A convincing poster shows what the tool helped finish |
| Two people discussing a delivery | A relevant phrase leaves the transcript and lands in the decision area | A decision and assigned next step can be distinguished |

These are patterns, not a mandatory cast or layout. A real task may use a
screen, a document, a scene, or an object, whichever best shows the work.
Reject a generic page or device that only identifies the tool; show the
operation and its visible result. Decorative writing, arbitrary product
assembly, and repeated price changes do not substitute for the task.

Anchor actions to unique measured phrases. An action may span several clauses;
allow a purposeful reading hold after it finishes. Use 3 s as a pacing review
signal, not a reason to invent an incidental change. For continuous mechanisms,
the actual working motion remains visible while the mechanism is explained.

At 1080×1920, use a two-line header from y 200, with the diagram at least 60 px
below. Keep repeated objects few and phone-readable; the main band is y 470–1400.
A counter may sit beside the diagram, vertically centered, when introduced.
Bystanders stand 80–100 px below it, leaving 48 px clear above captions.
Teal marks what works, sunset text marks a changed value, and grey marks what
stopped. Every mark denotes a real explanatory state.

Three finished runs show the style at work, in `video-output/`: AI before lunch
(literal, three scenes: notes into an email in a phone chat, a flyer and a
greeting card, a letter and a plain-words reply), stablecoins v2 (the sample:
a coin on a price ruler, a firm, a safe, swaps), and blockchain history v2
(sealed notebook pages, neighbors' copies, a race of stacks).
