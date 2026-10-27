# गोर्खाल्याण्ड / gorkha.land — how the brand is structured and run

Written October 2026, for a solo founder in the foothills. [roadmap.md](roadmap.md)
covers what to build (Jamghat). This file covers how the brand around it is organised
and run: what it stands for, how it looks and sounds, the legal setup, who does what,
where it shows up, the weekly routine, and how progress is measured.

---

## 1. Brand architecture

```
                         गोर्खाल्याण्ड / gorkha.land        ← the main brand: "the hills, online"
                                      │
     ┌──────────────────┬─────────────┴──────┬─────────────────┬──────────────┐
  जमघट Jamghat        काम Kaam          पहाड Live          हाट Haat        बास Baas
  cafés + crews       jobs & gigs        roads & alerts     hill produce    verified stays
  NOW                 later              later              later           later
```

- **gorkha.land is the main brand, and each product carries its name.** People say
  "I'm on gorkha.land" and "my crew holds Kunga on Jamghat."
- **Naming rule:** every product gets one plain Nepali word, written in Devanagari with
  a Roman spelling underneath (जमघट / Jamghat). No English product names.
- **Web addresses:** at launch, `gorkha.land` opens straight into Jamghat. Later products
  get their own paths (`gorkha.land/kaam`). Subdomains only if a product ever needs
  separate hosting.
- **One account, one points system, one verified badge** across every product. A level
  earned in Jamghat counts everywhere.

---

## 2. What the brand stands for

| | |
|---|---|
| **Purpose** | Bring the hills online on their own terms, so people here aren't left behind or spoken for. |
| **Promise** | Everything on gorkha.land has been picked and checked by people from the hills. |
| **Positioning** | For young people in the Darjeeling hills, gorkha.land is the app for going out, finding things and showing up for each other. Unlike Facebook groups and generic apps, it is made here, curated, and rewards you for being part of it. |
| **Values** | **Ours** (made by and for the hills) · **Curated** (quality over quantity) · **Fun first** (a game, not a chore) · **Together** (Nepali, Lepcha, Bhutia, Tibetan, Bengali, everyone) |
| **Hard line** | **Identity, yes; agitation, no.** No party politics, slogans, party colours, or maps with borders drawn on them. Pride in the place is welcome; demands are not. |

### Who it's for

| Person | Who | What they want | What we offer |
|---|---|---|---|
| **The student** (main user) | 17–24, at college in Darjeeling, Kurseong or Siliguri, on Instagram every day | Somewhere to go, status, cheap food, things to do | Crews, perks, events, share cards |
| **The café owner** (paying customer) | Runs a 20–40 seat café, quiet on weekdays and outside tourist season | More customers on slow days, people who come back | Check-ins, a dashboard, free event promotion |
| **The person away from home** (later) | Hill person working in Bengaluru, Delhi or Dubai | To stay connected, and to send help home | Later products: stays, produce, pay-for-home |

---

## 3. Voice

- **Write the way young people in the hills type:** Roman Nepali mixed with English.
  *"Aaja kun crew le Kunga hold garcha? 👀"* rather than formal Nepali or corporate
  English.
- Use Devanagari for the logo, product names and anything formal. Use Roman Nepali and
  English for posts, buttons and notifications.
- Be warm and teasing, never mean. Tease crews, never people.
- Be professional where it counts. Legal pages, café agreements and the privacy policy
  are written in clear English with a Nepali summary.

| Write | Don't write |
|---|---|
| "Crew 'Kuiro Gang' le Glenary's hold garyo this month 🔥" | "Users have successfully captured a venue" |
| "Free momo on your 5th check-in, thanks Sonam's!" | "Exclusive limited-time offer!!!" |
| "Bato level unlocked. Hills recognise you." | Anything about parties, protests or "the struggle" |

---

## 4. How it looks

Start from what [design.md](design.md) already defines: the palette, the type, and the
two-language wordmark. Then make it brighter and faster for Gen Z.

**Visual assets to make, all in one Figma file:**

| Asset | Used where | Phase |
|---|---|---|
| Wordmark (Devanagari + Latin), app icon, favicon | Everywhere | 0 |
| Product badges: Jamghat first, and a template for the rest | App, social media | 0 |
| Level badges: Paila → Chuchuro | App, share cards | 1 |
| Crew card, venue-hold card, season recap card (9:16 for Instagram stories) | Instagram, WhatsApp | 1 |
| QR stand for café counters (A6 tent card) and a "Jamghat partner" window sticker | Cafés | 0 |
| A one-page pitch for cafés, printed and as a PDF | Selling to cafés | 0 |
| Reel templates: intro and outro, caption style | Instagram | 1 |
| A one-page brand sheet: colours, type, do's and don'ts | Ambassadors, cafés | 1 |

**Rule:** anything with the logo on it uses these templates. Nobody, including
ambassadors and cafés, makes their own version.

---

## 5. The legal setup (cheapest version that is still proper)

| Item | Now | Later (trigger) |
|---|---|---|
| **Business type** | **Sole proprietorship**, registered as a small business (Udyam, free) and with a current bank account. This is enough to sign agreements with cafés and accept payments. | Convert to a **private limited company** when you take on a co-founder, raise money, or hire someone |
| **GST** | Not required until services income passes ₹20 lakh a year, but register voluntarily if cafés want GST invoices | Required once income passes ₹20 lakh |
| **Payments** | Razorpay or Cashfree payment links / UPI for the ₹999 café plan (accepts sole proprietors) | Subscriptions that bill cafés automatically |
| **Trademark** | File the **logo as a device mark** in classes 9 (software), 35 (advertising/business services) and 41 (entertainment). Expect an objection to the plain word "Gorkhaland", because it is a place name and politically sensitive. Use a trademark agent; it costs about ₹4.5k government fee per class for a sole proprietor [?] | File "Jamghat" separately once it has traction |
| **Domain and accounts** | gorkha.land in your own name with renewal set to automatic. Reserve **@gorkha.land / @gorkhaland / @jamghat** on Instagram, YouTube and X. Use a separate email for all business accounts. | — |
| **Policies** | Privacy policy (DPDP Act: what location data is collected and when, how to delete your data, minimum age 16), terms of use, community rules, and a one-page **café partner agreement** (the perk the café offers, the free period, either side can leave with 7 days' notice) | Have a lawyer review all four before you start charging |

---

## 6. Who does what

You are the company. Everything else is either leverage or a partner.

| Role | Who | Responsibilities |
|---|---|---|
| **Founder** | You | Product decisions, brand, selling to cafés, deciding what's allowed in the community, the face of Instagram |
| **Building** | You + Claude | The app, the café dashboard, the content templates |
| **Ambassadors** (5–10, unpaid) | College students | Recruit crews, post stories, report problems. Rewarded with a special badge, a hoodie, a line on their CV, and a monthly shoutout. |
| **Partner cafés** (10 at launch) | Café owners | Fund the perks, display the QR stand, post their events |
| **Advisors** (informal) | One café owner, one person in hill media, one lawyer or accountant | Advice once a month over chai |

**Who to bring in, in order:**
1. **A partner based in the hills**, for café relations and events (for equity).
2. **A content and design person**, part-time.
3. **A developer**, only once two products are live.

---

## 7. Where the brand shows up

| Channel | What it's for | How often |
|---|---|---|
| **Instagram** (main channel) | Reels, crew leaderboards, café spotlights, share cards reposted from players | 4 posts a week and stories every day |
| **WhatsApp channel** | Weekly round-up of events and season results | Weekly |
| **Café WhatsApp group** | Partner support and events | As needed |
| **In cafés** | QR stand, window sticker, a poster with the monthly leaderboard | Updated monthly |
| **Colleges** | Ambassador drives, a stall at college festivals | Each term |
| **Hill media and creators** | Local YouTubers and Instagram pages; trade them a free crew perk for a feature | At launch and each season |

### Weekly content

| Day | Post |
|---|---|
| Mon | **Leaderboard:** which crew holds what |
| Wed | **Venue spotlight:** a café's story and its perk |
| Fri | **This weekend:** events plus a trail challenge |
| Sun | **Crew of the week:** a reposted share card |
| 1st of the month | **Season recap and reset:** the biggest post of the month |

### What content is about
1. The game (crews and holding venues)
2. The places (stories behind cafés and hangouts)
3. The people (crews, café owners, Hill Heroes)
4. The hills (seasons, festivals, weather, without politics)

---

## 8. Your routine

| How often | What | Time |
|---|---|---|
| **Daily** | Clear the moderation queue, reply to cafés on WhatsApp, post one story | ~1 hr |
| **Weekly** | 4 posts, build in blocks, look at check-in numbers per café | ~4 hrs content plus build time |
| **Every 2 weeks** | **Trip up the hill:** visit cafés, top up perks, meet ambassadors, film content | 1 day |
| **Monthly** | Season reset, recap post, a one-paragraph report to each café ("you had 42 check-ins, 18 from returning players"), ambassador shoutout | ½ day |
| **Quarterly** | Review the numbers against §10, decide whether to add a product or a town, revisit this document | ½ day |

---

## 9. Phases

| Phase | When | Brand work | Product work ([roadmap.md](roadmap.md)) | Exit when |
|---|---|---|---|---|
| **0. Foundations** | Weeks 1–2 | Register as a proprietorship and Udyam, open the bank account, reserve social handles, file the trademark, finish the logo and QR stand designs, write the café pitch and agreement, ask 20–30 students where they hang out | Repo setup, home page switched to Jamghat | Assets ready; 15 target venues listed |
| **1. Pilot** | Weeks 3–8 | 10 cafés signed, 5–10 ambassadors, share card templates, post teaser reels | Login, map, check-in, crews, points, perks, dashboard, closed beta | 50 players are checking in at 10 cafés |
| **2. Launch** | Weeks 9–12 | Launch night at a partner café, a burst of creator posts, the first season recap | Public PWA, privacy policy and terms live | 300 registered, 100 checking in each week |
| **3. Prove** | Months 4–6 | Café case studies ("Kunga: +30% weekday footfall"), first paying cafés | Paid café plan, trails, sponsored trails | 10 paying cafés, ₹10k+/month |
| **4. Grow** | Months 6–12 | Kurseong, then Kalimpong. Bring in the hills-based partner. | A second product (Kaam or Pahad Live) | 3 towns, 1,000 checking in each week |

---

## 10. Numbers to watch

| Area | Measure | Target at week 12 |
|---|---|---|
| **Players** | Number checking in each week · share of week-1 players still active in week 4 | 100 · 30% |
| **Cafés** | Check-ins per café per week · cafés willing to pay | 30 · 3 or more |
| **Brand** | Instagram followers · share cards posted per week · people who found you without being asked | 1,000 · 50 · showing up in the "how did you hear about us" question |
| **Money** (from month 4) | Monthly revenue · cafés still paying after a month | ₹10k · 90% |
| **Health** | Moderation issues per week · complaints about political content | Low · 0 |

Keep these in a single spreadsheet and update it every Monday. Don't build a dashboard
for them.

---

## 11. Risks and what to do

| Risk | What you do |
|---|---|
| A crew or post brings in politics | Remove it, warn once, ban on a second offence. The community rules say this up front. Never reply in public. |
| A café doesn't honour a perk | Hide the perk the same day, call the owner, and remove the café if it happens again. Players come first, because a perk that isn't honoured costs you their trust. |
| People cheat on check-ins | Switch that café to a rotating code, wipe the cheating crew's points for the season, and post a short note about it. |
| You burn out | Do the routine in §8 and nothing more. Skip a week of posts rather than skip a café trip. Bring in the hills partner by month 6. |
| A data or security incident | Keep backups, collect as little data as possible, and use the DPDP breach steps in the privacy policy. Tell users plainly and quickly. |
| Someone uses the name | The trademark filing in §5, and keep all accounts in your name. |

---

## 12. Budget for the first six months (rough)

| Item | ₹ |
|---|---|
| Server + domain + email (6 months) | ~15,000 |
| Trademark (3 classes, via an agent) | ~20,000–30,000 [?] |
| QR stands, stickers, posters (15 cafés) | ~5,000 |
| Hill trips (12 trips) | ~12,000 |
| Hoodies and badges for ambassadors (10) | ~8,000 |
| Launch night | ~5,000 |
| Legal review of the policies (once) | ~10,000 [?] |
| **Total** | **~75,000–85,000** |

---

## 13. This week

1. Register Udyam and open a current bank account.
2. Reserve @gorkha.land / @jamghat on Instagram, YouTube and X.
3. Post an Instagram story asking "Darjeeling — where do you actually hang out?" and DM
   20 students.
4. Decide the four questions in [roadmap.md](roadmap.md) §10.
5. Book your first trip up the hill for week 2.
