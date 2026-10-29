# गोर्खाल्याण्ड / gorkha.land — the front door: बत्ती बाल (Light the Hills)

Written October 2026. **The plan for what happens when someone opens gorkha.land:** a
60-second game that touches people first, then the page that explains the movement. It
builds on [roadmap.md](roadmap.md) (Jamghat), [brand.md](brand.md) and the site already
in `src/site/`. Every line of Nepali follows [lingo.md](lingo.md).

---

## 1. What we're learning from the Cockroach Janta Party, and what we're not copying

The Cockroach Janta Party (CJP) started on 16 May 2026, after the Chief Justice was
reported to have called unemployed young people "cockroaches." Within weeks it had games:
- [Jantar Mantar](https://cockroachjanatapart.com/jantar-mantar-game/): lead a swarm past
  barricades, water cannons and lathi charges.
- [cockroachjanataparty.io](https://cockroachjanataparty.io/game/): catch falling "youth
  problems" and dodge the "Boot" and "Raid" bombs.

([Wikipedia](https://en.wikipedia.org/wiki/Cockroach_Janta_Party),
[Britannica](https://www.britannica.com/topic/Cockroach-Janta-Party),
[France 24](https://www.france24.com/en/india-s-cockroach-janta-party-goes-viral-as-gen-z-movement-grows))

**What actually made it spread** (none of these are about fighting the police):

1. **Turning an insult into a badge.** They took the word they were dismissed with,
   "cockroach", and made it the name everyone joined under. *"Main bhi cockroach."*
2. **Playing within 3 seconds.** No download, no account, works one-handed.
3. **Something to share after every run.** A share card for WhatsApp and Instagram.
4. **A visible headcount.** "2 lakh members in 7 days."
5. **Leaderboards by state, city and college.** Rivalry between people you actually know.

**What we must not copy: playing against the authorities.** In the hills, "the
authorities" means 2017: police firing, a 104-day bandh, 100 days without internet. A
game where players escape the police here becomes a game about the agitation:
- it reopens grief that many families don't want to relive;
- it splits the communities the name is meant to bring together;
- it is exactly the kind of content that gets blocked under **Section 69A**. CJP's own
  leaders were detained.

[design.md §9](design.md) says it plainly: *if someone opens this and feels argued with,
it has failed.*

**We keep the chase and change the enemy.** The enemy everyone in the hills shares, and
that is nobody's community, is **कुइरो**: the fog that rolls up from the valley and
swallows the lights. It stands for being left behind and cut off, without naming anyone.

**The insult we turn into a badge:** every young person in the hills has heard
**"पहाडमा के छ र?"** (*"What's there in the hills anyway?"*), usually just before they
leave. The game asks that question. The movement's answer, and the badge, is
**"पहाडमा हामी छौँ।"** (*"We are."*)

---

## 2. The flow

```
 open gorkha.land
   │
   ▼
 [0–3 s]   black screen, one line fades in:   पहाडमा के छ र?
           "What's there in the hills anyway?"   ·  [ Tap to light the first lamp ]   · Skip →
   │  (first tap: plays sound if enabled; everything stays silent until then)
   ▼
 [3–60 s]  बत्ती बाल: the GAME (§3)
   │
   ▼
 [60–70 s] the fog clears, dawn on Kanchenjunga, and the answer appears:
           पहाडमा हामी छौँ।  We are.
           "You lit 38 lights. 12,406 lights are on across the hills."
           [ Share my light ]   [ Where are you? Darjeeling ▾ ]
   │
   ▼  scroll, or "See what we're building ↓"
 THE DECK: the current landing page, extended (§5)
```

**The game's last frame is the landing page's first frame.** The game is played *on*
the hero painting. When it ends, every window is lit, the screen looks exactly like the
hero image, and the headline fades in. Nothing cuts away: the player has just lit the
picture they are now looking at.

**People coming back skip the game.** Returning visitors land on the deck with a small
message: *"Your light is still on · 12,406 lights · Play again."*

---

## 3. The game: बत्ती बाल ("Light the Hills")

**Where it happens:** the hero painting at night. Its windows are dark, and fog is
rising from the bottom of the screen.

| | |
|---|---|
| **Goal** | Light as many lamps as you can before the fog takes the ridge |
| **Controls** | Tap a dark window to light it. Nothing else. One thumb. |
| **The network** | Lit lamps within reach of each other join up with a thin thread of light, like the headlights winding between ridges in the painting. Each connected group pushes the fog back around itself. |
| **The chase** | The fog hunts. Its tendrils snuff out **isolated** lamps first, so a lamp on its own goes dark. You win by building connections, not by tapping fast. That is the whole manifesto in one rule. |
| **Getting harder** | The fog speeds up every 15 seconds. Now and then a *"buffering…"* gust blows out a whole cluster unless it is joined to the toy-train line, the backbone across the hill. |
| **End** | After 60 seconds, or if the fog reaches Chowrasta at the top of the ridge. Either way the fog lifts at the end, because in the hills it always does. A lost run ends with *"The kuiro won this time. It always lifts. Again?"* |
| **Score** | Lamps lit, plus a bonus for the size of your largest connected network |
| **Moments that land** | The first lamp comes on with a soft chime. Linking two ridges plays a faint toy-train whistle. The last 5 seconds: the fog breaks and Kanchenjunga turns gold. |

**Why this fits gorkha.land:** the game is the manifesto.
- **The fog is lagging behind:** being offline in the digital and AI era.
- **The lamps are dokans, cafés, students and homestays coming online.**
- **Connecting them is the brand** (one account, one map, one network).
- **Isolated lamps go out:** you can't go digital alone.

People don't have to be told any of this. They feel it in their thumb, then read it in the
deck.

**What it doesn't contain:** police, the state, other communities, flags, slogans,
martyrs, or any sign of 2017. Nobody loses except the fog.

---

## 4. After the game: a light that counts

The CJP's membership count becomes **lights**:

- **The counter:** every finished run adds one light to a live tally: *"12,406 lights
  are on across the hills."*
- **Where you are:** the only thing we ask is optional. It uses the same list as the note
  form: Darjeeling, Kurseong, Kalimpong, Mirik, Siliguri, Sikkim, Dooars, elsewhere in
  India, abroad.
- **Leaderboards by town and college** (college name optional): *Kurseong vs Kalimpong
  this week.* This is where the rivalry goes.
- **Share card** (9:16 and 1:1), generated on the phone:
  - the painting with *your* lit lamps;
  - **"मैले पहाडमा 38 बत्ती बालेँ। पहाडमा हामी छौँ।"** (*I lit 38 lights in the hills.
    We are.*);
  - the town and gorkha.land.

  It shares through the phone's native share sheet to WhatsApp or Instagram. **This is
  the growth engine.**
- **For people living away from home:** if they choose "elsewhere in India" or "abroad",
  their light appears on the ridge from far away: *"Your light from Bangalore is on in
  Darjeeling."* The diaspora is welcomed, not blamed for leaving.
- **A step towards Jamghat:** "Want first access to Jamghat? Leave your Instagram or
  email." This is optional and asks for consent, using the same rules as the note form.
  **The game builds the waitlist for the first product.**

**What we store:** a run's score, its town, and optionally a college. No names unless
someone gives one, and IP addresses are never kept. The counter is approximate, and the
page doesn't pretend otherwise.

---

## 5. The deck: the current landing page, extended

Most of the current page stays. It gets two new chapters and a sharper order, so that
someone who has never been to the hills understands the whole idea:

| # | Chapter | What's new |
|---|---|---|
| 00 | **The hero** (the lit painting, picked up from the game) | Headline unchanged: *The hills are going digital. On our own terms.* |
| 01 | **The note** (चिठी) | Unchanged: the Nepali letter, with English on a toggle |
| 02 | **The question** (पहाडमा के छ र?) | **New.** The things people say about the hills, set beside what is actually true. *"There's nothing to do here" / "The best café you've never heard of is a 4-minute walk from Chowrasta."* Short and proud. Every claim is checked. |
| 03 | **Why now: the digital and AI era** | **Extends the "Why now" section.** Phones and 5G already reach the hills (verified figures, as now). AI tools now let a café, a student or a weaver reach the world without leaving home. *And:* AI learns the languages that are written online, so if hill Nepali isn't online, AI will speak Kathmandu Nepali to our children. Going digital is how the hills keep their own voice. |
| 04 | **The manifesto** (six promises) | Unchanged |
| 05 | **The umbrella** (जमघट → काम → पहाड Live → हाट → बास) | Each product shown as one lit lamp in a network: the game's image again |
| 06 | **Jamghat, the first lamp** | Unchanged, plus a waitlist count fed by the game |
| 07 | **Join in** | Shows the live light counter and the town leaderboard |
| 08 | **Your note** | Unchanged |

**Rules for the deck:**
- **Facts:** every statistic is the latest available, checked against the primary source,
  and cited on the page (see [CLAUDE.md](CLAUDE.md)). The AI-era chapter will need fresh
  research before any number goes in. None are chosen yet.
- **Language:** every line of Nepali follows [lingo.md](lingo.md) and is read aloud by
  someone from the hills before launch.
- **The deck works without the game.** It is the real HTML underneath, so search
  engines, link previews, screen readers and anyone who taps **Skip** see the whole
  thing.

---

## 6. The domains

**gurkha.land should redirect (301) to gorkha.land.** Don't build a second site.
- "Gurkha" is the British Army spelling. It brings in searches from the UK, Hong Kong
  and Brunei and from former soldiers' families, so it's worth owning.
- As the main brand it would lean towards the military and colonial history. The hills'
  own spelling is Gorkha.
- One brand, one counter, one community. Add the redirect to the Caddyfile (or Vercel)
  next to `www`.

---

## 7. How it's built (smallest version that feels good)

| Piece | How | Cut |
|---|---|---|
| Game | One React component drawing on a **Canvas 2D** layer over the painting. About 40 hand-placed window positions for each image (desktop and phone), stored in JSON. The fog is a noise texture with a mask that rises. | Game engines, WebGL, three.js |
| Sound | Three short sounds (chime, train whistle, wind), only after the first tap, with a mute toggle | Background music |
| Counter and leaderboards | Two endpoints added to the existing notes server: `POST /api/light`, `GET /api/lights` (total plus top towns). Each run is one line in a JSONL file; the totals are kept in memory and rebuilt from the file on start. | A database, accounts |
| Share card | Drawn on a canvas in the browser and exported as a PNG, shared with `navigator.share` (download as fallback) | Generating images on the server |
| Returning visitors | One `localStorage` flag wrapped in try/catch, so a blocked flag just means they see the game again | Login |
| Accessibility | **Skip** always visible. `prefers-reduced-motion` gets a still version with "Light a lamp" as a single button. Everything works by keyboard. | — |
| Performance | Under 150 KB of extra JavaScript. Test on a ₹8,000 Android phone over 4G. | — |

`ponytail: the counter is in-memory, rebuilt from a JSONL file; move it to Postgres when
Jamghat brings the database.`

**Hosting:** the counter and the notes need the VPS (Caddy plus the notes server). They
don't work on Vercel's static hosting. Move to the VPS before launch.

---

## 8. Order of work

| Week | Work | Check |
|---|---|---|
| 1 | The regenerated hero (Kurseong/Darjeeling prompts are ready). A playable game prototype with rough fog. Test it on 3 cheap Android phones. | Can a stranger pick it up without instructions in 5 seconds? |
| 2 | The connection and fog-hunting rules, sounds, the end-of-game moment into the hero. The counter and leaderboard on the VPS. The share card. | Do 10 testers share without being asked? |
| 3 | The deck: the "question" chapter, the AI-era chapter (research and verify every number), the lit-lamp umbrella. Native-speaker read-through of all the Nepali. | Every number cited, every Nepali line approved |
| 4 | Soft launch to the 50 founding members. Fix what breaks. | Average game finished, share rate |

**Launch moment:** **mid-December, when people come home for the holidays.** The fog
season, the lights coming on and people coming home all happen at once. The opening line
for social media writes itself: *"पहाडमा के छ र? Come light it and find out."*

**What success looks like after 2 weeks:**
- 5,000 lights.
- At least 25% of finished games shared.
- At least 40% of players scroll into the deck.
- 500 people on the Jamghat waitlist.

---

## 9. Decisions that are yours

1. **The question:** is "पहाडमा के छ र?" the line young people in the hills really hear?
   Or is it something closer to home, like "यहाँ बसेर के गर्छस्?" ("What will you do
   staying here?")? This one line carries the whole thing, so it has to be the real one.
2. **Game name:** बत्ती बाल / *Light the Hills*, or something else?
3. **Launch date:** mid-December (recommended), or sooner as a soft launch?
4. **gurkha.land:** redirect (recommended), or did you have a separate use in mind?
