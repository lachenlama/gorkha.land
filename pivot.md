# गोर्खाल्याण्ड / gorkha.land — the pivot: a game you play by walking the hills

> **Superseded by [roadmap.md](roadmap.md)** (Oct 2026). The game has come back as
> Jamghat: crews compete for cafés and hangouts instead of hex zones. The map, privacy
> and server notes below still apply.

Written October 2026. This plan draws on three research notes in `research/`:
[landscape.md](research/landscape.md) (Chowrasta, 55 places nearby, which map grid to use),
[comparables.md](research/comparables.md) (similar games and apps, plus Indian law), and
[quickfacts.md](research/quickfacts.md) (tourism numbers, hosting costs). Each note marks
its claims as checked online [V], from background knowledge [K], or uncertain [?]. Check
anything marked [K] or [?] before you repeat it in public.

Like strategy.md, this is a plan, not a pitch. Where I disagree with the brief, I say so
and explain why.

---

## 0. The pitch in one paragraph

You open gorkha.land on your phone at Chowrasta and see the plaza as the painting the site
already has, with a grid of zones laid over it. You belong to one of three teams. Stand
inside a zone for long enough and your team takes it. Every hour your team holds it, you
earn points. Every zone is also a real place, such as Keventers, the Mahakal steps or the
Bhanubhakta statue. Each place has a story, a two-minute audio guide recorded by someone
from the hills, reviews from real visitors, and sometimes an offer from the shop there.
Scores reset every month. If you live in Bengaluru, you can adopt a zone from far away and
fund its offers. The game makes people walk the place. The stories, reviews and offers are
what keep the app useful once they stop playing.

---

## 1. Three corrections to the brief

### 1.1 Use the sentiment, but don't make players fight over the movement

The brief asks for a PvP game "which will touch the sentiments of people relevant to the
agitation." I would build the sentiment in. I would not make the PvP about the agitation.

- **People died.** The 1986–88 agitation killed roughly 1,200 people, and 2017 brought a
  104-day bandh, police firing and a 100-day internet shutdown. A game where teams fight
  over that history turns grief into a contest. Hill people will see it that way first,
  and the national press will follow.
- **PvP needs opponents.** Base the teams on the movement and someone has to play the
  other side: the state, the police, another party, or another community. Every one of
  those options splits the Nepali, Lepcha, Bhutia, Tibetan and Bengali people that
  [design.md §9](design.md) says the name is meant to bring together.
- **It can get the game shut down.** India blocks apps with confidential Section 69A
  orders and never has to explain why. An app that looks like a separatist mobilisation
  tool is the easiest kind to block. Hong Kong protest apps were pulled from app stores
  in exactly this way (comparables §4).

**What I'd do instead.** Keep the rule design.md already has, *identity, yes; agitation,
no*, and put the feeling in the story layer, not the combat:

| Layer | What it carries |
|---|---|
| Teams (PvP) | Neutral and local: **Kuiro (mist), Ghaam (sun), Pani (rain)**. The site already uses this weather, it sounds like the hills, and it points at nobody. |
| Places | The story behind each place: who stood here, what the language means, songs from Akashvani Kurseong. |
| Seasons | Named after hill festivals and history (Bhanu Jayanti, Dashain, Losar, Tihar), never after protest dates. |
| Mechanics | **Bandh freeze**: when the town shuts down, territory stops decaying and nobody loses ground. Everyone from the hills will understand it, and nobody is put on trial. |
| Memory | A quiet "हामी यहीँका हौँ" (*we are of this place*) wall where people leave a line about home. It is moderated, can't be fought over, and sits outside the game. |

A rule for all content: anything that would make a tired hill resident feel argued with
stays out. No PvP on memorials, no party colours, no maps with borders drawn on them.

### 1.2 "Finance" means rewards paid for by merchants, not money games

The [Online Gaming Act 2025](research/comparables.md) bans any game where players put in
money expecting money back. The penalty is up to 3 years in jail and ₹1 crore, and the
rules have applied since May 2026 [V]. Play-to-earn, virtual land that earns rent, crypto
and cash-out are all out. STEPN, Atlas Earth and Earth 2 show these models go bad even
where they are legal.

**What you can do:** shops pay for offers that players unlock by playing. Shops can
sponsor a zone. You can sell paid tours and group hunts. Players can tip a guide directly
through a UPI link, which never passes through you. Game coins can be **earned only,
never cashed out and never transferred**. That makes them a closed-system prepaid
instrument, which needs no RBI licence [V]. Get a lawyer to look at the grey areas:
redeeming points for vouchers at other shops, sponsored prizes for paid tournaments, and
diaspora players buying vouchers for locals.

### 1.3 Collect data the Pokémon GO way, but with consent and only in aggregate

The data model works: Niantic's most valuable asset turned out to be the map its players
built, which is why its mapping technology was spun off as its own company (comparables
§1). Copy the asset, not the reputation for vacuuming up data:

- **The data you're really after is place data**: places players submit, reviews,
  photos, audio, opening hours. Players hand this over willingly, and it is what tourism
  boards and merchants will pay for.
- **Footfall** is stored only as hourly counts per hex cell of about 175 m (H3 res 9). A
  cell needs at least 10 people before its count is kept. Raw location trails are
  deleted at the end of each season.
- **Other players never see your live location.** The map shows which team holds each
  zone. It never shows a dot for each player.
- **Adults only (18+) for PvP and location at launch.** The DPDP Rules require verifiable
  parental consent for anyone under 18 from about May 2027 [V]. It is easier to start
  adult-only than to add that check later.
- Plain-language consent screens and a privacy page before launch. This replaces the
  "no tracking" promise in [design.md §9](design.md), so say so openly.

---

## 2. Products to learn from (details in comparables.md)

| Copy | From | Why |
|---|---|---|
| Capture a zone, earn points per hour, monthly reset | **Turf** (Sweden) | The smallest PvP loop that has kept players for years, and it works in a small town |
| Teams fighting over real places | **Ingress** | Long-term play driven by team loyalty, not collecting |
| Players submit places and trusted players review them | **Niantic Wayfarer** | The map grows itself, and the result is the asset |
| Mayorships and check-in status | **Foursquare / Swarm** | Being the regular at Keventers costs nothing and is very sticky |
| Levels for reviewers | **Google Local Guides** | Reviews in exchange for status, not money |
| Audio walks narrated by locals | **VoiceMap** | A pocket tour guide people will pay for |

| Avoid | From | Why |
|---|---|---|
| Too many systems at launch | Harry Potter: Wizards Unite | Shut down; players couldn't follow it |
| Building around AR | Minecraft Earth, Peridot | Expensive, drains batteries, doesn't help the core loop |
| Hand-made tour content you visit once | Detour | Shut down; content was costly and nobody came back |
| Pay to earn | STEPN, Atlas Earth | Speculation, then collapse, and now illegal in India |
| Location that hardly matters | Jurassic World Alive | Players play from the sofa and the walking stops |

**New competitor:** West Bengal Tourism launched an official **"Discover Darjeeling"**
app in October 2026 [V per agent, confirm on the Play Store]. Don't compete with it as a
directory. Partner with it: they have listings, you have players and stories.

---

## 3. The map and grid (the UI the whole game sits on)

From [landscape.md](research/landscape.md):

- **Centre of Chowrasta:** 27.04469, 88.26774. The plaza has no traffic. Nehru Road and
  Zakir Hussain Road meet here, and The Mall loops around Observatory Hill. Elevation is
  about 2,050–2,134 m, depending on the source.
- **Phone GPS is off by 10–30 m** in narrow lanes, on steep slopes and in fog. That alone
  decides how big zones can be.

**The grid** (my changes to the agent's recommendation):

| Purpose | Size | Count around Chowrasta | Note |
|---|---|---|---|
| **Capture zones (PvP)** | ~50 hand-picked places, each snapped to an H3 res-10 hex (~66 m edge) | ~50 | The agent suggested ~3,300 res-11 hexes. Few players spread over thousands of zones gives empty, dead territory. Turf works with sparse, named zones. Add more zones when activity justifies it. |
| Explore / reveal the map | H3 res 10 | ~470 | Walking into a hex reveals it. This is the exploration loop and needs no opponent. |
| Footfall stats and rate limits | H3 res 9 | ~67 | The 10-person minimum from §1.3 applies here |
| Realtime channels | H3 res 8 | ~10 | Each phone subscribes to updates for its own res-8 cell and the cells next to it |

**Why H3, not S2 or square tiles:** every hex has six neighbours at the same distance,
`h3-pg` lets the database work with hexes directly, and hexes look good on screen. S2 is
what Niantic uses, but it doesn't help you here.

**Rendering:** MapLibre GL draws a simple map style from one **PMTiles** file served off
the VPS (an OSM extract of Darjeeling, a few MB). The existing Chowrasta painting is laid
over the map at its true position, and the hexes are drawn as a fill layer on top.
three.js and deck.gl are too heavy for cheap Android phones; leave them out of version 1.

**Data gaps to fix before launch:** OSM coordinates are missing for Raj Bhawan, Gymkhana,
Loreto, St Paul's, Bhanu Bhawan, Gorkha Rangamanch, Oxford Book Store, Das Studio and
Chowk Bazaar. One afternoon walking those places with a phone fixes this better than any
API. It also produces the first 50 zones.

---

## 4. Architecture

One VPS, one server process, one database. At this scale that is enough, and it is all
you need for the first year.

```
 phone (PWA: Vite + React + MapLibre)          the existing repo, extended
   │  HTTPS + WebSocket
   ▼
 Caddy  ── automatic TLS for gorkha.land, serves dist/ and the .pmtiles file
   │
   ▼
 game server (Node + TypeScript, `ws`)          one process
   • login (email link + Google)               • zone captures and ticks (in memory, every 10 s)
   • GPS validation and anti-spoofing          • broadcast to each res-8 channel
   • REST: places, reviews, offers, submissions
   │
   ▼
 Postgres + PostGIS + h3-pg                     players, zones, captures, places, reviews,
                                                submissions, offers, footfall counts
 nightly pg_dump → off-site bucket (Backblaze B2 or Cloudflare R2)
```

**Choices, and what I cut:**

| Choice | Instead of | Why |
|---|---|---|
| Keep **Vite + React** and add MapLibre | Next.js, Unity, a native app | The repo already uses it, and a PWA avoids app store review risk (§1.1). Wrap it with Capacitor later if store listing helps distribution. |
| One Node process holding zone state in memory | Redis, Kafka, separate services | A few thousand open connections is easy for one process. Postgres stores every capture as it happens. `ponytail: single node; shard by res-8 region when one process hits about 60% CPU.` |
| Server decides everything | Trusting the client | The phone only reports position and accuracy. The server checks it and ignores anything with accuracy over 40 m or speed over 25 km/h between readings. That is the whole anti-cheat system. |
| Email link + Google login | Phone OTP | SMS one-time codes cost money for every message, and the DLT registration you need to send them in India is slow. Add phone login if users ask for it. |
| Caddy | nginx + certbot | Gets and renews TLS certificates on its own with a few lines of config. |
| Cloudflare in front: **optional** | | The free plan proxies WebSockets [K, check]. Useful against DDoS attacks, but it is one more party seeing user traffic. |

**Hosting:** Vultr or DigitalOcean in **Mumbai or Bangalore**, so the data stays in India
and latency stays low. Start with 2 vCPU / 4 GB at about $20–24 a month and move to
4 vCPU / 8 GB (about $40–48) when you need it [?, third-party prices]. Hetzner has no
Indian data centre.

**A limit of the web:** a PWA can only read location while it is open on screen. There
is no background tracking, so no "adventure sync". That suits a game you play while
walking, and it suits the privacy rules in §1.3.

---

## 5. Build order

Build the risky parts first, as plan.md did. The riskiest assumption here is that GPS at
Chowrasta works well enough to play on, in fog, on cheap phones.

| Phase | Weeks | What ships | You learn |
|---|---|---|---|
| **0. GPS test** | 1 | A map page that shows your hex and the accuracy reading. Walk it on 3 cheap Android phones on a foggy day. | Whether 66 m zones can be played. If they can't, go up to res 9 before writing anything else. |
| **1. Walk and explore** | 2–3 | Login, the Chowrasta map with the painting overlay, hexes that reveal as you walk, 50 hand-made places with stories | Whether people walk around for it without any PvP |
| **2. Zone capture** | 3–4 | Three teams, zone capture and decay, the WebSocket server, monthly season, leaderboard, bandh freeze | Whether teams create rivalry, and whether people come back next week |
| **3. Pocket guide** | 3 | Player-submitted places with review, written reviews, local audio stops (reuse the music-site player) | Whether locals add content without being paid |
| **4. Finance** | 3 | Merchant offers unlocked by holding a zone, sponsored zones, UPI tip links for guides, a simple merchant page | Whether a shop pays ₹500–2,000 a month for a sponsored zone |
| **5. Diaspora and growth** | ongoing | Adopt-a-zone from far away, offers funded by the diaspora (after legal review), Kurseong, Kalimpong, Mirik, Gangtok | Whether the model works beyond Chowrasta |

**Keep the music site.** It becomes the lobby. The rainy room and the cassette player
are what people see while the map loads, and the song dedication link becomes the invite
link.

---

## 6. Getting players

From comparables §6. A town of about 119,000 people has room for one dense group of
players, not a large spread-out one.

1. **30–50 founding players**: college students (St Joseph's, Darjeeling Govt College),
   local musicians and guides. They get permanent founder badges and are the first
   reviewers of place submissions.
2. **Chowrasta Hour**: a fixed weekly hour, such as Saturday at 5 pm, when points count
   double. A crowd at the plaza is the best advert the game can have.
3. **Festival community days** around Dashain, Tihar and Losar, plus the tourist peaks
   in March–May and October–November.
4. **Tourists**: QR cards in hotels and homestays ("walk Chowrasta with a local's
   voice"), plus the partnership with Discover Darjeeling.
5. **Diaspora**: the WhatsApp dedication links the site already has. "Your friend took
   Keventers for Kuiro" is a forward people will send.

**Decide whether to continue at week 12 of phase 2:** if fewer than 150 people play every
week, or fewer than 25% of players come back four weeks later, stop adding features and
fix the core loop.

---

## 7. Money, roughly

| | Monthly |
|---|---|
| VPS | ₹1,700–4,000 |
| Backups, domain, email | ~₹500 |
| **Running cost** | **under ₹5,000** |
| Revenue in year 1, *my guess*: 10–20 sponsored zones at ₹1,000 + tour sales | ₹10k–30k |

It costs little enough to run that it can survive a slow start. The real cost is your
time.

---

## 8. Decisions I need from you

1. **The agitation question (§1.1):** do you accept "identity, not agitation" for the PvP
   layer? Everything else in this plan assumes you do.
2. **Team names:** Kuiro / Ghaam / Pani, or something else? This has to be settled
   before phase 2.
3. **Under-18 players:** keep the game 18+ for now, or build parental consent from the
   start?
4. **App stores:** PWA only (my recommendation), or the Play Store from day one?
5. **The music site:** should it become the lobby (my recommendation), or stay at its
   own URL?
