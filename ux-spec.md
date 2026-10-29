# gorkha.land front door — UI/UX build spec

Written October 2026. Implements [experience.md](experience.md). All Nepali follows
[lingo.md](lingo.md) and **must be read aloud by a hill speaker before launch** (lines
marked ⚑ are the ones to check first). Colours are the tokens in `src/site/site.css`
(`ink pine tea himal gumba brass cream paper lamp`). No new dependencies, no audio files,
no new fonts.

---

## 1. Experience principles

- **Feel first, explain second.** The thumb learns "alone you go dark, together you hold"
  before any copy says it. The deck only names what the player already felt.
- **Warm, never loud.** Lamp-light, fog, a chime. No confetti, no score explosions, no
  red. Nobody loses except the fog, and even then *it always lifts*.
- **One gesture.** Tap a window. That's the whole game. Anything else is optional.
- **The hills' own voice.** Darjeeling Nepali, local jokes about load-shedding and
  tankers, never about parties or people. Someone tired of politics should still smile.
- **Built for a ₹8,000 Android on 4G.** Canvas 2D, a 60s loop, under 150 KB of extra JS,
  graceful when sound, vibration, storage or the network are missing.

---

## 2. Intro screen — "पहाडमा के छ र?"

Full-screen fixed overlay (`z-50`, `role="dialog" aria-modal aria-labelledby`), sitting
exactly over the hero. Page scroll is locked while it is mounted.

**Timeline (first visit)**

| t (ms) | What happens |
|---|---|
| 0 | Overlay background `ink`, opaque. **Skip →** top-right, `text-sm text-cream/55`, always visible and focusable first. |
| 300 | `पहाडमा के छ र?` fades + rises 8px over 1200 ms. `ne text-4xl md:text-6xl text-cream`, centred, 42% from top. |
| 1500 | `What's there in the hills anyway?` fades in 800 ms. `font-display italic text-lg md:text-2xl text-cream/60`. |
| 2000 | Overlay background fades ink → transparent over 1600 ms, revealing the hero painting under the game's **night layer** (§3). If the hero image isn't loaded, wait for it (max 4 s), otherwise stay on ink. |
| 2600 | CTA fades in 600 ms: pill `bg-lamp text-ink rounded-full px-6 py-3 min-h-11` — **`पहिलो बत्ती बाल्नुस् · Light the first lamp`**. Under it, `text-xs text-cream/50` toggle: **`Sound: on`** / **`Sound: off`**. |

From 2600 ms, a tap anywhere (or Enter/Space) = CTA. Esc = Skip.

**Sound gating.** No `AudioContext` exists until the CTA tap. The CTA handler creates and
`resume()`s it if sound is on. Sound preference persists in `localStorage["gl.sound"]`
(default on, try/catch).

**On CTA:** question lines fade up and out (400 ms). At +200 ms the **phone in the
rooftop figure's hand** (lamp 0) lights with the first chime — the first lamp in the hills
is a phone. At +600 ms the 60s timer starts. The 3 dark lamps nearest lamp 0 pulse (hint
ring, §3) until the first tap or 5 s.

**Skip:** overlay fades out 400 ms, hero copy plays its existing `.rise`, scroll unlocks.
Saves `{ skipped: true }` (see `MyLight`). No light is posted.

**Returning visitors** (`readMyLight()` not null): no intro. Hero loads as today
(kenburns on) plus a pill 88px from top, centred, `bg-ink/70 border border-cream/10
rounded-full px-4 py-2 text-sm`, auto-hides after 8 s or on scroll > 200 px:
- played before: **`तपाईंको बत्ती अझै बलिरहेको छ · Your light is still on · 12,406 lights · Play again →`**
- skipped before: **`पहाडमा के छ र? · Light a lamp (60 s) →`**

"Play again" re-mounts the intro with `replay` (skips the question, starts at CTA state).
`?play` in the URL always forces the intro.

---

## 3. The game — बत्ती बाल

### Layout

The game is played **on the real hero `<img id="hero-img">`**. The intro adds two canvases
above it, both `position:fixed; inset:0; touch-action:none`:
1. **main canvas** (DPR capped 1.5): night layer, glows, threads, backbone.
2. **fog canvas** at 0.5× CSS pixels (no DPR), stretched — the upscale is the blur.

During play the hero's copy, gradients, `.mist` band and site header/chapter rail are
hidden (`opacity-0`, Site does this from `onPhase`). Kenburns is off so coordinates hold.

**Mapping image → screen** (read `naturalWidth/Height` and computed `object-position`
from the img, so it follows whatever Site sets):
`s = max(W/iw, H/ih); ox = (W - iw*s)*posX; oy = (H - ih*s)*posY; x = ox + nx*iw*s; y = oy + ny*ih*s`.
Lamp set = phone set when `matchMedia("(orientation: portrait)")` matches (same query as
the `<source>`), else desktop. Lamps that land outside `[16, W-16] × [72, H-16]` aren't
spawned. Recompute on resize; lit state is kept by index.

Site must change the landscape focus from `72%` to **`landscape:object-[80%_50%]`** so the
town sits right of the hero copy (at 16:9 this shows image x 0.33–0.92).

**HUD (minimal, top only — the bottom is where fog lives)**
- Timer: 2px bar along the very top edge, `bg-lamp`, shrinking right→left over 60 s;
  turns `bg-brass` in the last 5 s. (Same language as the nav scroll bar.)
- Top-left: `18 बत्ती` — `font-display text-lg text-cream/80`, tabular nums.
- Top-right: speaker icon button (44px) then `Skip →`. Respect safe-area insets.
- Nothing else. No instructions text.

### Lamp states (desktop sizes; phone × 0.8)

| State | Visual | Timing |
|---|---|---|
| dark | 3px dot, `cream` 12% — a hint of a window | — |
| hint | ring 10→18px, `lamp` 40%→0 | 1.6 s loop |
| lighting | core 4px `#fff4dc` + radial glow 26px `lamp` 55%→0 (composite `lighter`); punches a 46px soft hole in the night layer | 0→1 in 260 ms ease-out |
| lit | glow alpha breathes ±6% at 0.3 Hz, random phase per lamp | — |
| on rail | lit + 1px `brass` ring at r=7px | — |
| hunted | alpha jitters 0.25–1 at 12 Hz, glow tints toward `himal` | 1.2 s |
| out | glow collapses, 1px `brass` ember fades | 400 ms + 1 s |
| fogged dark | not drawn, not tappable | — |

**Night layer:** full-rect `ink` at 0.70 (phone 0.62), with `destination-out` holes at lit
lamps. Under it the painting's own windows read as dim — so when the night layer fades at
the end, the screen *becomes* the hero.

**Hit test:** `pointerdown`, nearest non-fogged dark lamp within `min(30px, ½ nearest-
neighbour distance)`. Multi-touch allowed. Haptic `navigator.vibrate?.(8)`.

### Connections

- Connection radius `R = clamp(0.2 × min(W,H), 80, 150)` px.
- Groups = union-find over lit lamps within R (≤ 45 nodes, recompute per change).
- **All lit rail lamps are joined to each other** through the backbone (that's the
  toy-train linking ridges).
- Thread: drawn from each lit lamp to its ≤3 nearest lit neighbours within R. 1px
  `lamp` at 35%, `lighter`, quadratic curve sagging 6% of its length. New threads draw
  A→B over 300 ms. One tiny mote (2px `#fff4dc`) runs each thread every ~4 s, like
  headlights on the hairpins.

### Backbone (toy-train line) — **keep for v1, simplified**

Not a physics object: a fixed polyline drawn as 1px `brass` 18%, dash 2/6, plus a `rail:
true` flag on ~7 lamps per set. Lamps near the line are flagged by hand in the data, so no
distance maths. Covered by fog like everything else.

### Fog

- Colour `#c5cfd0` (cream mixed 35% with himal). Body alpha 0.82; feathered 0→0.82 over
  14% of screen height above the front. Two noise layers (one 512×256 offscreen texture
  of soft radial blobs, generated once) drift at +12 and −7 px/s. Front edge wobbles by
  two sines (amplitude 2.5% H, wavelengths 0.6W and 0.27W).
- **Front F** (screen y fraction) starts at 1.0 and rises at
  `v = (1 − chowY)/50 × phaseMult × max(0.25, 1 − 0.03 × N_net)` per second, where
  `N_net` = lit lamps in groups of ≥3. Unchecked, it reaches Chowrasta at ~52 s.
- **Clearings:** every lamp in a group ≥3 cuts a hole in the fog of radius
  `min(80, 36 + 4 × groupSize)` px. Lamps in clearings are safe and dark lamps in
  clearings stay tappable.
- **Buried:** a lit lamp below F, outside a clearing, in a group <3 → hunted state, then
  out.
- **Hunting:** every `huntInterval`, pick the lit lamp in the smallest group of size ≤2
  (tie → lowest on screen). A tendril (5 soft circles, r 18→10px, alpha 0.6) grows from
  the front to it along a curve over `tendrilTime`; lamp goes hunted. If the player joins
  it into a group ≥3 before arrival, the tendril retreats. Otherwise it goes out (wind
  sound 500 ms). No hunting in the first 6 s. **Lamp 0 (the phone) never goes out.**
- **"buffering…" gust** at 24 s and 42 s: target = largest lit group of size ≥2 with no
  rail lamp (none → gust passes harmlessly). 2.0 s warning: top-centre label
  `buffering…` (`text-sm text-cream/80`, three dots stepping every 300 ms), backbone pulses
  to 60%, target group gets a `himal` ring. First gust only, a toast under it:
  **`ट्रेनको लाइनसँग जोड्नुस्, हावाले निभाउँदैन। · Join the train line. The wind can't touch it.`**
  Then a band of fog sweeps L→R over 900 ms; target lamps go out in sweep order (60 ms
  stagger), wind sound, `vibrate([30,40,30])`. If the group touched a rail lamp in time:
  lamps flicker and hold, whistle plays.

### Difficulty curve

| t (s) | phaseMult | huntInterval | tendrilTime | Event |
|---|---|---|---|---|
| 0–15 | 0.7 | 3.0 s | 1.6 s | 6 s grace, no hunting |
| 15–30 | 0.9 | 2.2 s | 1.4 s | gust at 24 |
| 30–45 | 1.1 | 1.6 s | 1.2 s | gust at 42 |
| 45–55 | 1.3 | 1.2 s | 1.0 s | — |
| 55–60 | front retreats at 5× | none | — | dawn: gold radial glow (`lamp`, `screen`, 0→22%) on Kanchenjunga |

**Lose:** F ≤ `chowY` at any time. Input stops, the same dawn sequence plays from that
moment (the fog lifts anyway). **Win:** reach 60 s.

**Result:** `lit` = lamps lit at the end (excluding the election lamp); `chain` = largest
group size.

### End sequence (both outcomes)

| t after end | |
|---|---|
| 0 | Input off. Chime arpeggio (5 pentatonic notes, 140 ms apart). |
| 0–2400 ms | Night layer alpha → 0, threads fade over 1600 ms, fog fades out. Painting is now exactly the hero. |
| 2400 | Hero gradients fade in 800 ms (Site, on `onPhase("end")`). |
| 3000 | End panel (§4) rises. |

### Sounds (WebAudio, synthesized; master gain 0.18; nothing before the CTA tap)

1. **Chime** (lamp lit): two sines, the note + a fifth above, attack 5 ms, exponential
   decay 900 ms, gain 0.3/0.12. Note = E-major pentatonic `[659, 740, 831, 988, 1109] Hz`
   indexed by `(groupSize − 1) % 5`, so growing a network climbs a scale. ±10 cents random
   detune.
2. **Toy-train whistle** (two groups of ≥2 merge, a lamp joins the rail, or a gust is
   survived): sines at 587, 740, 880 Hz through a bandpass (1200 Hz, Q 2) + a 10% noise
   breath; attack 80 ms, hold 350 ms, release 400 ms, pitch glides −3% over the release.
   Gain 0.08. Max once per 2.5 s.
3. **Wind** (gust, lamp snuffed): 2 s white-noise buffer → bandpass Q 0.7, frequency sweeps
   300→900→300 Hz; gain 0→0.12→0. Gust 1600 ms, snuff 500 ms.

Haptics: lit 8 ms, merge 12 ms, gust `[30,40,30]`. Guard with `"vibrate" in navigator`.

### Reduced motion (`prefers-reduced-motion: reduce`)

Same intro copy with no rise (opacity only, 200 ms). The game becomes a still: the night
painting with no fog and no breathing. A single bottom-centre button
**`बत्ती बाल्नुस् · Light a lamp`** lights the next lamp in index order (static glow, thread
appears instantly), and a second button **`Done`** ends it. Max 40 presses, no timer. End =
night layer removed in one 300 ms opacity fade. Posted with `mode: "still"`, `won: true`.
Keyboard in the normal game: Space/Enter does the same "light next best lamp" (nearest dark
lamp to the last lit one, preferring one that joins a group).

### Lamp coordinates (normalized to the image; verify with `?lamps` debug overlay)

`?lamps` in the URL draws every lamp with its index, the backbone and Chowrasta, so the
builder can nudge positions on real screens. `r` = rail, `e` = election-lamp candidate.

**Desktop — `hills-1792.webp`**
```
0 .742,.718 phone(immortal)
1 .810,.620   2 .848,.640   3 .815,.690   4 .685,.620   5 .640,.640
6 .660,.690   7 .600,.610   8 .590,.710   9 .575,.760  10 .535,.760
11 .615,.790 12 .560,.840  13 .585,.880  14 .545,.890  15 .670,.570
16 .715,.560e 17 .755,.560 18 .800,.560  19 .840,.530  20 .890,.490
21 .635,.540e 22 .690,.460 23 .725,.410e 24 .810,.420  25 .855,.400e
26 .900,.410 27 .780,.350r 28 .855,.330  29 .890,.310  30 .820,.260r
31 .865,.250 32 .905,.205  33 .885,.165r 34 .870,.120  35 .570,.420r
36 .600,.430 37 .660,.400r 38 .400,.510  39 .420,.630r 40 .470,.660r
backbone: .36,.72 → L39 → L40 → .52,.55 → L35 → L37 → L27 → L30 → L33
chowrasta: .88,.16   kanchenjunga: .63,.17   far ridge (diaspora light): .42,.40
```

**Phone — `hills-phone-768.webp`**
```
0 .640,.676 phone(immortal)
1 .800,.440  2 .900,.425  3 .710,.490r  4 .850,.480  5 .590,.530r
6 .770,.515e 7 .890,.525  8 .500,.555   9 .700,.575e 10 .840,.565
11 .400,.590 12 .480,.615 13 .620,.600 14 .780,.600  15 .890,.600
16 .300,.625 17 .400,.650 18 .570,.640e 19 .800,.645 20 .880,.640
21 .180,.690 22 .270,.680 23 .370,.690 24 .470,.680  25 .800,.690
26 .140,.730 27 .240,.725 28 .330,.715 29 .430,.725  30 .200,.765
31 .280,.770 32 .380,.760 33 .180,.540r 34 .280,.525r 35 .440,.515r
36 .130,.585r 37 .135,.645r
backbone: .13,.68 → L37 → L36 → L33 → L34 → L35 → L5 → L3 → .85,.42
chowrasta: .85,.42   kanchenjunga: .58,.19   far ridge (diaspora light): .15,.47
```
Nothing is placed on the rooftop figure, the rooftop slab, or the dark ground below
y .80 (phone) — that's where the fog starts.

---

## 4. End moment, share, counter

The end panel lives in the hero's copy slot: desktop = left column `max-w-xl`, bottom-left
like the hero copy; phone = bottom sheet over the gradient, `rounded-t-3xl bg-ink/80
backdrop-blur-md p-6`, max 70svh, scrollable. Elements rise 300 ms apart.

**Win**
1. `पहाडमा हामी छौँ।` — `ne text-5xl md:text-7xl text-cream`
2. `We are.` — `font-display italic text-2xl text-lamp`
3. `कुइरो फाट्यो। तपाईंले 38 बत्ती बाल्नुभयो, सबैभन्दा लामो माला 14 बत्तीको।` ⚑ /
   `The kuiro lifted. You lit 38 lights. Your longest chain: 14.` (`text-cream/75`)

**Lose** — line 1 becomes `कुइरोले यसपालि जित्यो।` / `The kuiro won this time.`; line 2
`कुइरो त फाटिहाल्छ। फेरि?` ⚑ / `It always lifts. Again?`; **Play again** becomes the
primary button; `पहाडमा हामी छौँ।` follows smaller (`text-2xl text-lamp`).

4. **Live counter:** `पहाडभरि 12,406 बत्ती बलिरहेका छन्। · 12,406 lights are on across
   the hills.` Number `font-display text-lamp`. When the player's run posts, it ticks +1
   with a 600 ms lamp glow behind it. Below 100 total: `तपाईं पहिलो 100 मध्ये एक हुनुहुन्छ।
   · You're one of the first 100.` API down: line hidden, never a 0.
5. **Town picker:** `तपाईं कहाँ हुनुहुन्छ? · Where are you?` — single-select chips
   (`rounded-full border border-cream/20 px-3 py-1.5 text-sm`, selected `bg-lamp text-ink`):
   दार्जिलिङ Darjeeling · खरसाङ Kurseong · कालेबुङ Kalimpong · मिरिक Mirik · सिलगढी Siliguri ·
   सिक्किम Sikkim · डुवर्स Dooars · भारतमा अरू कतै Elsewhere in India ⚑ · बाहिर कतै Abroad.
   Elsewhere/Abroad reveals `Which city? (only on your card)` — text, max 40, **never
   sent to the server** — and lights one extra glow at the set's "far ridge" point with
   `{city} बाट पनि पहाडमा बत्ती बल्यो। · Your light from {city} is on in the hills.`
6. **Mini leaderboard** `यो हप्ता · This week`: top 3 towns, each a row with name, a 4px
   `lamp` bar scaled to #1, and count; the player's town row in `text-lamp`. Hidden if
   fewer than 3 towns have lights.
7. **Buttons:** `Share my light` (primary, `bg-lamp text-ink`), `Play again` (ghost
   `border-cream/30`), then text link `See what we're building ↓`.
8. **Jamghat waitlist** (collapsed link, opens inline): `जमघट सबैभन्दा पहिले चलाउने? ·
   Want first access to Jamghat?` → input `Instagram or email` (max 120) → once filled,
   consent checkbox (required): *"You can contact me when Jamghat opens. You'll only use
   this to tell me about Jamghat, and you'll delete it if I ask."* Same field styles as
   NoteForm.

**Posting the run:** exactly one `postLight` per run, sent when the player leaves the
panel (Continue link, Play again, scroll/wheel/swipe-up, or `pagehide` via
`sendBeacon`). It carries the chosen town and the waitlist contact if consented. Skips and
the share action don't post.

**Leaving:** `See what we're building ↓` (or scroll intent) → panel fades 400 ms, intro
unmounts, `onDone(result)`, hero copy rises (headline unchanged), scroll unlocks. No
auto-scroll. Save `MyLight`.

**Share card** — drawn in `ShareCard.ts` only on tap. `await document.fonts.load()` for
Tiro Devanagari Hindi and Gelasio first. Always uses the phone painting with the first
`lit` phone lamps glowing (night layer 0.35, threads drawn).

*9:16 — 1080×1920*
- Painting full-bleed (cover). Ink gradient 0→95% from y 1100 to 1920.
- y 96, x 80: `गोर्खाल्याण्ड` (Tiro 44px, cream 80%); right-aligned `gorkha.land`
  (Gelasio 36px, cream 60%).
- y 1360: `मैले पहाडमा 38 बत्ती बालेँ।` (Tiro 76px cream)
- next: `पहाडमा हामी छौँ।` (Tiro 92px lamp)
- next: `I lit 38 lights in the hills. We are.` (Gelasio italic 40px, cream 70%)
- next: `खरसाङ · Kurseong` (Inter 34px brass), or for diaspora
  `{city} बाट पनि · Lit from {city}. Still home.`
- y 1820: `आफ्नो बत्ती बाल्नुस् → gorkha.land` (Inter 34px, cream 70%).

*1:1 — 1080×1080*: square crop of the phone painting from y .38 to .94; same text block
bottom-left at 0.8× sizes, header row unchanged, footer at y 1010. Tab `9:16 | 1:1` above
the preview, default 9:16.

Share: `canvas.toBlob` → `File("gorkha-land-light.png")` → if `navigator.canShare({files})`,
`navigator.share({ files, text: "पहाडमा के छ र? Come light it and find out. https://gorkha.land/?from=share" })`;
otherwise download + copy the link with toast `Saved. Link copied.`

---

## 5. Deck changes (Site.tsx)

New order and `CHAPTERS`:

| n | id | en | ne | bg |
|---|---|---|---|---|
| 01 | note | The note | चिठी | pine (unchanged) |
| 02 | question | The question | पहाडमा के छ र? | ink + grain |
| 03 | why | Why now | किन अहिले | pine (was ink) |
| 04 | movement | The movement | अभियान | tea (unchanged) |
| 05 | roadmap | The umbrella | एउटै छाता | ink + grain ⚑ |
| 06 | jamghat | First product | पहिलो कदम | image, gradient now `from-ink` |
| 07 | join | Join in | सँगै हिँडौँ | tea |
| 08 | leave-a-note | Your note | तपाईंको कुरा | pine |

Hero: add `id="hero-img"`, landscape focus `80%`, `data-intro` attribute driving
`opacity-0` on copy/gradients/mist while playing; drop `kenburns` on loads where the
intro ran. Header and chapter rail hidden while the intro is mounted.

**02 — The question (new).** H2: `पहाडमा के छ र?` (`ne`) + `Everyone up here has heard
it. Here's what's actually here.` Six cards, 2-col md / 1-col phone. Each: myth (Tiro,
`text-cream/45`, as people say it) → small English gloss → truth (`font-display text-xl
text-cream`) with a 6px lamp dot that lights (glow transition 600 ms) when the card
reveals. No numbers.

1. `पहाडमा के छ र?` *What's there in the hills anyway?* → Tea the world knows by name,
   songs sung far beyond these hills, and people who can cook, fix, teach and build.
2. `यहाँ बसेर के गर्छस्?` *What will you do, staying here?* → Run a café. Teach online.
   Sell to a buyer in another city. The work is here; it just isn't online yet.
3. `यहाँ त केही गर्ने ठाउँ नै छैन।` *There's nothing to do here.* → Open mics, football
   nights, quiz nights, momo worth crossing town for. Nobody has put them on one map.
4. `राम्रो काम त सबै तल छ।` *The good jobs are all down the hill.* → More and more of them
   can be done from up here, with a phone and a signal. The signal is already here.
5. `बाहिरकाले हामीलाई चिन्दैनन्।` *Nobody outside knows us.* → They know the tea, the toy
   train and the mountain. They just haven't met the people yet.
6. `ठिटाठिटीलाई पहाडको के मतलब?` *Young people don't care about the hills.* → They're the
   ones coming home every December. They'll be the ones who put it online.

**03 — Why now (extended).** Keep the H2, the three verified stats with citations, and the
three problem cards exactly. Add below them a block, `mt-24`, two columns on desktop:
- Left: kicker `AI को जमाना · The AI era` (`text-xs tracking-[0.25em] uppercase
  text-brass`), H3 `font-display text-3xl md:text-5xl`:
  **Machines learn the languages that are written down.**
- Right, `text-lg text-cream/75`: *AI learns from what people write online. A language
  that isn't written online gets left out, or replaced by whichever version is. If hill
  Nepali — दोकान, कुइरो, ठिटाठिटी — isn't online, the machines will teach our children
  someone else's Nepali.* Then `ne text-2xl text-lamp`: `डिजिटल हुनु भनेको आफ्नै आवाज
  जोगाउनु हो।` ⚑ / *Going digital is how the hills keep their own voice.*
- Three small lines below (no numbers): *A café in Chowk Bazaar can reach the world.* ·
  *A student can earn without leaving home.* · *A weaver can sell without a middleman.*
- Any number added here later needs primary-source research first (CLAUDE.md).

**05 — The umbrella as a lamp network.** H2 unchanged. Sub: *Each product is a lamp. We
light one at a time and join them into one network.* Replace the vertical rail with
lamps joined by a 1px thread (`lamp` 35%): horizontal on `lg`, vertical on phone. Lamp
node = 15px circle: lit = `bg-lamp` + `box-shadow 0 0 24px var(--color-lamp)`; next =
`border-lamp` with a 2.4 s glow pulse (none under reduced motion); later = `border-cream/30`.
Each node has its card (Nepali name, English, line, status pill):

| ne | en | line | status |
|---|---|---|---|
| जमघट | Jamghat | Cafés, crews and hangouts. Check in, level up, hold your spot. | Building now (lit) |
| **पुल** | **Pul** | **The bridge: digital infrastructure for the hills. Every dokan, school and homestay online, with a simple web page, UPI payments, a listing on the map, community Wi-Fi points and digital-skills classes.** | **Next** (pulsing) |
| काम | Kaam | Jobs, gigs, internships and scholarships for the hills, all checked. | Then |
| पहाड Live | Pahad Live | Roads, landslides, water and power, reported by people on the ground. | Later |
| हाट | Haat | Tea, churpi, dalle and crafts, straight from the people who make them. | Later |
| बास | Baas | Verified homestays, with your advance payment protected. | Later |

Pul tagline under its card, `ne text-lamp`: `हरेक दोकान, हरेक स्कुल, हरेक होमस्टे — अनलाइन।`

**06 — Jamghat.** Unchanged, plus under the café box: `{waitlist} people are waiting for
the first lamp.` (shown only if ≥ 25).

**07 — Join.** Above the four cards, a counter block `rounded-2xl bg-pine/60 p-8 md:p-10`:
big number `font-display text-6xl md:text-7xl text-lamp`, `बत्ती बलिरहेका छन् · lights are
on across the hills`, the week's top 5 towns as bars (same style as the end panel), and a
`Light yours →` button (`onPlay`: scroll to top instantly, mount intro with `replay`).
Hidden entirely if the API fails.

Everything else (note, manifesto, form, footer) stays as is.

---

## 6. Easter eggs

All need a deliberate action, all show a toast (`fixed bottom-6` centre, `bg-ink/90
border border-cream/10 rounded-full px-5 py-3 text-sm`, Nepali `ne` + English,
`role="status"`, fade 200 ms) unless noted. Never more than one at a time.

| # | Where / trigger | What happens | Copy | Duration |
|---|---|---|---|---|
| 1 | **Election lamp** — game. One random `e` lamp per run looks like any window. Tap it. | Blazes at 3× glow in `brass` (600 ms), holds 1.4 s, fizzles out 800 ms. Doesn't count, doesn't connect, can't be relit. | `यो चुनावको बत्ती थियो। चुनाव आउँदा मात्र बल्छ। · That was the election lamp. It only lights up in election season.` | toast 3 s |
| 2 | **Road under repair** — game. Tap the backbone line ≥30px from any lamp. Once per run. | Small sign drawn at that point: 14px brass triangle cone + label. | `बाटो बन्दै छ। · Road under repair. Since forever.` | 2.5 s |
| 3 | **Load-shedding** — deck. Tap the nav `गोर्खाल्याण्ड` 5 times within 2 s. | Fixed `ink` overlay at 93% (z-60): off 1.2 s, one flicker on at 400 ms for 80 ms, then fades out 300 ms. | `बत्ती गयो… बत्ती आयो! · Power cut. And it's back. Keep the candle out anyway.` | ~1.8 s + toast 3 s |
| 4 | **File pending** — umbrella. Tap any `Later` pill 3 times. | Pill text becomes `File pending`, tilts −6°, `border-gumba text-gumba`. | `फाइल पेन्डिङ छ, अर्को हप्ता आउनुस्। · File pending. Come next week.` | 4 s, then reverts |
| 5 | **Water tanker** — umbrella, Pahad Live line. Hover/tap the word "water" (only `cursor: help`, no underline). | Tooltip bubble above the word. | `ट्याङ्कर? भोलि आउँछ रे। · The tanker's coming tomorrow. It said that yesterday too.` | 4 s or until tap elsewhere |
| 6 | **Kanchenjunga** — deck hero. Double-tap/double-click the top 35% of the hero outside the copy. | Gold glow (`lamp`, 20%) blooms on the peaks for 1.5 s. | `आज कन्चनजङ्घा देखियो! फोटो खिच्नुस्, भोलि कुइरो लाग्छ। · Kanchenjunga is out today! Take the photo. Tomorrow there'll be fog.` | 3 s |
| 7 | **No politics** — footer. Hover/focus/tap `No politics.` | Text swaps in place (no toast). | `No politics. (Except at the chiya dokan.)` | while hovered / 3 s on tap |

All are off in reduced motion except their text.

---

## 7. Accessibility & performance budgets

- **Skip** is first in focus order and always visible; Esc skips. The deck is real HTML
  underneath for crawlers, link previews and screen readers; the intro never mounts for
  bots without JS.
- Canvases `aria-hidden`. A visually hidden `aria-live="polite"` region announces only:
  game start, each gust warning, and the end result.
- All buttons ≥ 44×44px, `focus-visible:outline-2 outline-lamp outline-offset-2`. `lang="ne"`
  on Nepali spans. Text over the painting always sits on an ink gradient (≥ 4.5:1).
- **JS:** ≤ 150 KB raw / ≤ 45 KB gzip extra in total. The initial chunk grows by ≤ 8 KB gzip
  (intro shell + `lights.ts`); `Game.tsx`, `sound.ts` and `ShareCard.ts` are dynamic
  imports, fetched as the intro mounts (ready well before the CTA at 2.6 s).
- **Frames:** 60 fps target, 30 fps floor on a ₹8k Android. No allocations in the rAF loop.
  If the mean frame time is > 24 ms over 2 s, degrade once: drop motes, fog canvas to 0.33×,
  thread curves become straight lines.
- **Canvas:** main canvas DPR capped at 1.5; fog canvas 0.5× CSS px, no DPR.
- **Hidden tab:** on `visibilitychange` → hidden: stop rAF, pause the game clock,
  `audioCtx.suspend()`. Resume on visible.
- The hero `<img>` stays the LCP element and loads exactly as today.
- `GET /api/lights` is fetched at most once per page view (memoised); no polling.

---

## 8. Files and interfaces (three builders, no shared files)

### Builder B — server + client API (owns `server/notes.mjs`, `src/site/lights.ts`)

`src/site/lights.ts`:
```ts
export const PLACES = ["Darjeeling","Kurseong","Kalimpong","Mirik","Siliguri","Sikkim",
  "Dooars","Elsewhere in India","Abroad"] as const;           // same list as notes.mjs
export type Place = (typeof PLACES)[number];
export const PLACE_NE: Record<Place, string>;                 // labels from §4
export type LightRun = { runId: string; lit: number; chain: number; won: boolean;
  mode: "game" | "still"; place: Place | ""; contact?: string; consent?: boolean };
export type Lights = { total: number; week: { place: Place; n: number }[]; waitlist: number };
export function getLights(): Promise<Lights | null>;          // memoised; null on any error
export function postLight(run: LightRun, beacon?: boolean): Promise<Lights | null>;
export type MyLight = { at: string; lit: number; place: Place | ""; skipped?: boolean };
export function readMyLight(): MyLight | null;                // key "gl.light", try/catch
export function saveMyLight(m: MyLight): void;
```

`server/notes.mjs` additions (same style: no deps, `clean`-style validator, self-check):
- `POST /api/light` — body ≤ 2 KB; separate rate limit 20 per 10 min per IP; honeypot
  `website`. Validate: `runId` `/^[a-z0-9-]{8,40}$/i`; `lit` int 0–45; `chain` int 0–lit;
  `won` boolean; `mode` ∈ {game, still}; `place` ∈ PLACES else `""`. Append
  `{at, runId, lit, chain, won, mode, place}` to `data/lights.jsonl`. If `consent === true`
  and `contact` (≤ 120 chars), append `{at, contact, place}` to `data/waitlist.jsonl`.
  **Duplicate `runId` → 200 with the current tally, nothing written.** IP never stored.
  Response: `{ ok: true, total, week, waitlist }`.
- `GET /api/lights` → `{ ok: true, total, week, waitlist }`, `week` = top 5 places with a
  non-empty place over the last 7 days, `n` desc. `Cache-Control: public, max-age=15`.
- On boot, rebuild `total`, the `runId` Set, the 7-day `{t, place}` list and the waitlist
  count from the two files. `// ponytail: in-memory tally rebuilt from JSONL; move to
  Postgres when Jamghat brings the database.`
- Self-check: rejects a bad runId, lit > 45, chain > lit; drops contact without consent;
  dedupes a runId; ranks `week` correctly.
- Caddy and the Vite proxy already forward `/api/*`; nothing else to change.

### Builder A — the intro (owns `src/site/intro/*`)

```
src/site/intro/Intro.tsx     default export; question screen, phase machine, HUD, end panel, waitlist,
                             scroll lock, MyLight save, postLight; lazy-loads the three below
src/site/intro/Game.tsx      canvases + rules + rAF
src/site/intro/lamps.ts      the two lamp sets (§3), types, imageToScreen()
src/site/intro/sound.ts      createSound(ctx) → { chime(step), whistle(), wind(ms), setMuted(b) }
src/site/intro/ShareCard.ts  drawCard(opts): Promise<Blob>; shareCard(blob, text): Promise<void>
src/site/intro/intro.css     keyframes only, imported by Intro.tsx
```
```ts
export type IntroPhase = "question" | "playing" | "end";
export type IntroResult = { lit: number; chain: number; won: boolean; place: Place | "" } | null; // null = skipped
export default function Intro(p: { replay?: boolean; onPhase(p: IntroPhase): void;
  onDone(r: IntroResult): void }): JSX.Element;

// internal (Game.tsx)
type Lamp = { x: number; y: number; rail?: true; election?: true };
type LampSet = { lamps: Lamp[]; backbone: [number, number][]; chowrasta: [number, number];
  kanchenjunga: [number, number]; far: [number, number] };
type GameProps = { img: HTMLImageElement; set: LampSet; sound: Sound | null; reduced: boolean;
  onLit(count: number): void; onEnd(r: { lit: number; chain: number; won: boolean }): void };
```
Intro finds the hero image with `document.getElementById("hero-img")`. Easter eggs 1–2
live here.

### Builder C — the deck (owns `src/site/Site.tsx`, `src/site/site.css`)

- Mount: `const [intro, setIntro] = useState(() => !readMyLight() || location.search.includes("play"))`;
  `const [phase, setPhase] = useState<IntroPhase | "off">(intro ? "question" : "off")`.
  Render `{intro && <Intro replay={replay} onPhase={setPhase} onDone={r => { setIntro(false); setPhase("off"); … }} />}`.
- Hero: `id="hero-img"`, `object-[50%_20%] landscape:object-[80%_50%]`, `data-intro={phase}`;
  CSS hides copy/gradients/mist for `question|playing`, shows gradients for `end`; no
  `kenburns` if the intro ran this load. Hide header + chapter rail while `phase !== "off"`.
- Returning pill (§2), chapters and order (§5), the counter in Join and Jamghat via
  `getLights()`, easter eggs 3–7, the toast helper.
- Until A and B land, stub `Intro` and `lights.ts` locally behind the exact signatures
  above; don't edit their files.

### Deferred (not v1)

College leaderboards (free text on a public board needs moderation first), background
music, server-side share images, and polling the counter.
