# गोर्खाल्याण्ड / gorkha.land — जमघट: a game about the hills' hangouts

Written October 2026. This is the main plan and replaces the earlier version of this
file. The music room is dropped; its code stays in git history. Background reading:
[pivot.md](pivot.md) (the original game plan; the map, grid and server design still
apply), [launch.md](launch.md) (verified stays, a later product), and
[research/](research/).

---

## 1. The idea in one paragraph

**जमघट (Jamghat, "the gathering")** is a game played at the cafés and hangouts of
Darjeeling. You and your friends form a **crew**. You check in at a café when you're
there, either by scanning its QR code or by GPS. The crew with the most check-ins at a
venue this month **holds** it: its name goes up on the venue's page and the café gives
that crew a perk. Every check-in earns points that raise your level and unlock better
perks. Open mics, football screenings and quiz nights show up on the same map and are
worth double points. Scores reset every month.

**What each side gets.**
- **Gen Z:** discounts, bragging rights for their crew, a way to find new places and
  things to do, and good-looking cards to post on Instagram.
- **Cafés:** more customers on weekdays and in the off-season, people who come back, a
  simple dashboard showing who comes and when, and free promotion for their events.

This keeps the PvP and territory idea from the original plan, but players compete over
coffee instead of politics.

---

## 2. Why this is better than the earlier versions

| Earlier plan | Problem | Jamghat |
|---|---|---|
| Territory PvP with three teams on hex zones | Needed lots of players, GPS is unreliable in fog, and it touched agitation themes | Crews of friends compete over named venues. A QR code fixes the GPS problem. |
| A community app with 11 products | Needed people on the ground for every product | **One product, one kind of customer (cafés)**, and onboarding can be done by one person |
| A booking site | Crowded and generic | Nobody is doing this in the hills |
| The music room | A nice place to visit, but nothing to do there | Something to do every week, with a reward for doing it |

**Who it borrows from (see [research/comparables.md](research/comparables.md)):**
- **Foursquare/Swarm:** check-ins and "mayorships". Status on its own kept players coming
  back for years.
- **Turf:** hold a place, earn points for it, reset monthly. Proven in small towns.
- **Café loyalty stamps:** the reward is real and the café pays for it.

---

## 3. How the game works

### Check-ins (the core action)
- **A QR stand at the counter plus GPS within about 80 m.** Both are required. The QR
  code means GPS doesn't need to be accurate in fog, and GPS means a photo of the QR
  can't be scanned from home.
- One check-in per venue every 3 hours, and at most 5 a day in total. Nothing worth
  cheating for.
- `ponytail: static QR per venue; switch to a rotating code on the café's phone if
  people start sharing photos of the QR.`

### Crews (the PvP)
- 3–8 friends per crew, with the name and emoji chosen by the crew. College groups,
  bands, football teams, friends from the same neighbourhood.
- **Holding a venue:** the crew with the most check-ins from different members wins.
  Counting unique members, not check-ins, means one obsessive player can't carry a
  crew.
- Monthly reset on the 1st, with a "Season recap" share card for each crew.
- **Leaderboards by town and college:** the friendly version of the rivalry.

### Points and levels (reused from the earlier roadmap)

| Action | Points |
|---|---|
| Check in | 10 |
| First visit to a new venue | +15 |
| Check in at an event | 25 |
| Finish a trail (see below) | 50 |
| Short review after a check-in | 10 |
| Bring in a friend who checks in | 25 |

**Levels:** पाइला Paila (step) → बाटो Bato (path) → भञ्ज्याङ Bhanjyang (pass) →
डाँडा Danda (ridge) → चुचुरो Chuchuro (peak). Each level unlocks better perks.
**Points can't be bought, cashed out or transferred.** That keeps them outside
India's 2025 gaming law and the RBI's prepaid-instrument rules.

### Perks (paid for by the café, never by gorkha.land)
- **First-visit perk:** e.g. a free cookie with your first coffee.
- **Level perk:** e.g. Danda and above get 10% off on weekdays.
- **Crew-holder perk:** e.g. the crew holding the venue gets one free momo plate a week.
- Staff check the perk on the player's screen. There are no coupons and no money
  changes hands through the app.
- Never alcohol perks. Bars are listed for events only, and only shown to users who
  are 18 or older.

### Trails (exploring)
Short routes that take players beyond their usual café, for example:
- **Mall Road café crawl:** 4 venues in a day.
- **Sunrise run:** Tiger Hill, then breakfast at a café on Chowrasta.
- **Momo trail:** 5 momo places in a month.
- **Weekend out:** Lamahatta, Mirik or Kurseong's Dow Hill.

Finishing a trail earns a badge. Later, cafés or tourism businesses can sponsor trails.

### Events
Cafés post their own open mics, gigs, screenings and quiz nights, and you approve them
once a day. Checking in at an event is worth double. This is where the earlier events
idea (जमघट) now lives.

---

## 4. The first map: Darjeeling town

**Hangout areas:**
- Chowrasta and the Mall
- Nehru Road and Laden La Road
- Observatory Hill
- Gandhi Road and Zakir Hussain Road
- Batasia/Ghoom and Tiger Hill (for trails)
- Lebong, Happy Valley, Rock Garden and the Peace Pagoda (for trails)

**Venues to approach first.** Several come from
[research/landscape.md](research/landscape.md). The rest are from memory, **so check
each one on the ground before contacting it:**
- Keventers
- Glenary's
- Sonam's Kitchen
- Kunga
- Joey's Pub (events only)
- Gatty's Café [?]
- Revolver [?]
- other cafés and momo spots popular with students around Chowrasta and the Mall [?]

**The real list comes from Gen Z, not the internet.** Before visiting any café, ask
20–30 Darjeeling students on Instagram "where do you actually hang out?" and pitch the
10 most-mentioned places first.

**Expanding, once Darjeeling works:** Kurseong (Dow Hill, near the colleges), then
Kalimpong (Deolo, Main Road cafés), then Mirik. Siliguri could be its own map later,
since it's where hill students go for coaching and college.

---

## 5. Running it solo from the foothills

| Task | How one person handles it | Time |
|---|---|---|
| Signing up cafés | **One trip up the hill every two weeks.** Visit 4–5 cafés, pitch, leave a QR stand. Target 10 cafés before launch. | 1 day / 2 weeks |
| Café support | One WhatsApp group with all partner cafés. They post their own events and perks through a simple form. | 20 min/day |
| Moderation | Events and reviews go into a queue you clear once a day. Check-ins need no moderation: the rules above stop cheating. | 20 min/day |
| Marketing | You plus 5–10 college ambassadors, recruited online and met on the café trips | 1 hr/day |
| Building | You and Claude, in the existing repo | the rest |

**Pitch to a café (memorise it):** *"Free for 3 months. You give one perk you choose.
We bring students in on weekdays and show you how many came back. If it doesn't
work, throw the QR stand away."*

**What it costs:**
- QR stands: about ₹50–100 each.
- Server: about ₹2,000 a month.
- Travel: bus or shared jeep to Darjeeling and back, twice a month.

---

## 6. Money

| When | Source | Rough numbers (guesses) |
|---|---|---|
| Months 0–3 | Nothing. Every café is free. | Prove that check-ins bring people in. |
| Month 4+ | **Café plan:** ₹999/month for perks, the dashboard, featured events and featured trails | 15 cafés ≈ ₹15k/month, which covers costs |
| Month 6+ | Sponsored trails and seasonal hunts (Durga Puja/Dashain, Christmas, Losar) | ₹2–5k per trail |
| Year 2 | Same model in Kurseong and Kalimpong. Homestays as venues in the stays product ([launch.md](launch.md)). | — |

This is a small business at first. It pays for itself before it pays you, so don't
plan to live on it in year 1.

---

## 7. How it's built (from [pivot.md](pivot.md) §4, simplified)

```
gorkha.land (Vite + React PWA, en / ne)
  map of venues (MapLibre + PMTiles) · check-in (QR + GPS) · crews · points/levels
  · perks · events · trails · share cards · café dashboard
        │ HTTPS
Caddy → Node + TypeScript API → Postgres (+ PostGIS)
```

- **What changed from the original game plan:**
  - No WebSocket server. The hold standings update when the app is opened.
  - No H3 grid at first. Venues are just points on a map.
  - Live updates can come back if players ask for them.
- **Login:** Google sign-in and email links. Phone numbers are optional.
- **Privacy:** location is checked only at the moment of a check-in and never tracked
  in the background. Other players see crew names, never where anyone is. Users must be
  16 or older, with bars hidden from anyone under 18. Plain-language privacy policy
  (DPDP Act).
- **The music room:** removed from the home page and kept in git history. The new home
  page is the Jamghat map.

---

## 8. The first 12 weeks

| Week | What |
|---|---|
| 1 | Ask 20–30 Darjeeling students where they really hang out. Settle the top 15 venues. Design the QR stand and the pitch card. |
| 2 | First trip up the hill: pitch 5 cafés. Building starts: login, venues, check-in. |
| 3–5 | Build crews, points, perks, the hold leaderboard and share cards. Second trip up: 5 more cafés. |
| 6 | Café dashboard and events. Recruit 5–10 ambassadors. |
| 7–8 | Closed beta: about 50 players across 10 cafés. Fix check-in on cheap Android phones. |
| 9 | Public launch with a **launch night at a partner café** (open mic plus the first crew leaderboard) and a reel series. |
| 10–12 | First monthly reset and season recap. Ask cafés about the paid plan for month 4. |

**Success at week 12 (solo-sized targets):**
- 10 cafés live.
- 300 registered players and 100 checking in each week.
- 30 or more check-ins per café per week.
- At least 3 cafés saying they'd pay.

**If it falls short:** with fewer than 30 check-ins per café per week, the perks are
too weak or the venues are wrong. Fix those before adding features.

---

## 9. Later, if Jamghat works

Products from the earlier plan that can be built on the same players and cafés, in this
order:
1. **काम:** jobs and gigs at partner venues.
2. **पहाड Live:** road and landslide reports, with crews as the reporters.
3. **हाट:** hill produce, sold through partner cafés.
4. **बास:** verified homestays.

Each one waits until there is a second person to run it.

---

## 10. Decisions that are yours

1. **The name:** "जमघट / Jamghat", or something else (Guff, Adda, Chiya Guff)?
2. **Minimum age:** 16 (recommended, since Gen Z includes school leavers), or 18?
3. **Where to start:** Darjeeling town (the brand fit), or 2–3 Siliguri cafés first to
   test the game near home before the hill trips?
4. **Free period for cafés:** 3 months, or until they see a set number of check-ins?
