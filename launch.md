# गोर्खाल्याण्ड / gorkha.land — how to launch without being the 1,869th listing

> **Parked.** It is listed under "Later, if Jamghat works" in [roadmap.md](roadmap.md) §9.

Written October 2026. This replaces the game in [pivot.md](pivot.md) as the main
product, and the game is now just an optional layer on top. It is based on
[research/finance-tourism.md](research/finance-tourism.md) and
[research/competitors.md](research/competitors.md). Both reports used shallow web
searches. Neither agent could open Facebook, Instagram, Reddit or Google Maps, which is
where most of this market lives, so the walk-through in §5 matters more than either
report.

---

## 1. Your guess was right: the booking layer is crowded

| Who | What they have | Where they fall short |
|---|---|---|
| **Airbnb / Booking.com** | About 1,868 active short-term rentals in Darjeeling (AirDNA, up 42% in a year), 424 stays on Booking.com, Kalimpong hosts rated 5.0 | Expensive for hosts, generic, nothing for the diaspora |
| **Humro Home / North-Bengal.com** | Since 2004, "largest homestay network", books by phone, form and WhatsApp | The website looks old, there are no stated payment or cancellation terms, and you can't pay instantly |
| **Kothaoo, Offbeat Bengal and similar** | Own the market of Bengali groups visiting from Kolkata for a weekend | Built in Bengali and English for people from outside the hills |
| **Government portals** (WB Panchayat Tourism, WBTDC, GTA, Sikkim) | Registries and directories | We couldn't confirm that you can actually book and pay on them |

**Where you would lose:** ranking in Google for "Darjeeling homestay", the Kolkata
weekend market, luxury villas, and undercutting on commission alone. Stayzilla, an Indian
homestay booking site, spent over $13M and shut down in 2017 doing exactly that.

**Where nobody is:** the step where a guest sends a UPI advance to a stranger on WhatsApp.
Most small sites take bookings that way and state no refund or cancellation terms at all.
Every guest is taking a risk, and every honest host is tarred by the scams. Nobody serves
people from the hills who live away from home.

## 2. What to build instead: trust, not another listing

Don't launch a marketplace. Launch the **verification and payment protection** every
other channel lacks, and give hosts a free tool so they come to you without being
recruited one by one.

### Part A: a free booking page for each host (this is how you get hosts)

`gorkha.land/stay/<name>` is a good-looking page in the style the music site already has,
in Nepali, English and Bengali. It has photos, a calendar, house rules, a way to reach
the host on WhatsApp, and a **Pay advance** button.

- **Free for bookings the host brings in.** They put the link in their Instagram bio and
  WhatsApp status instead of sending a QR code. Every host who shares their page is
  advertising you for free.
- This is a better version of what Humro Home does by phone, and it's something
  Airbnb won't do, because Airbnb wants guests to book on Airbnb.

### Part B: the gorkha.land Verified badge and protected advances (this is the product)

- **Verified** means someone from gorkha.land visited in person, the photos match, and
  the host's ID and homestay registration were checked. The checks are done by hand, a
  few at a time. That keeps the list small, and the small size is what makes the badge
  worth trusting.
- **Protected advance:** the guest pays through Razorpay Route, which holds the host's
  share until the check-in date and then pays it out. Razorpay is the licensed party
  holding the money, so gorkha.land never holds anyone's money. Before building, confirm
  with Razorpay that this hold feature can be used for the full stay period [K].
- Disputes are handled under one simple published policy: a full refund if the stay
  didn't match its listing, and nothing otherwise.

### Part C: Ghar Phirne, for people coming home (this is how you get guests)

Bookings that come through gorkha.land itself, rather than from a host's own link, pay
**7–8% commission** (a guess; confirm with hosts):

- **Gift a Stay:** "Book a winter week in Kalimpong for aama-baba." Payment is from India
  or by international card, and the parents get a WhatsApp message in Nepali.
- **Family group bookings:** blocks of several rooms reserved ahead of Dashain, Tihar,
  Losar, Christmas and school reunions.
- Optional extras with a fixed upfront price: an airport pickup from NJP or Bagdogra, a
  verified Sandakphu guide, a tea-garden visit.
- The music room is how people find it: the dedication link ends with *"coming home?
  find a verified stay"*.

**How money flows:** nothing is charged on bookings a host brings in through their own
page. Bookings gorkha.land brings in pay 7–8%. Later, a paid tier for hosts (around
₹299–499 a month) adds a shared calendar that works across booking sites and payment
reminders. The finance side covers payments, protected advances, gifting, group
bookings and, later, working-capital loans for hosts through a partner lender. In that
last case gorkha.land only sends referrals and never lends money itself.

## 3. Why this order

1. **Hosts come first because they cost nothing to sign up.** A free page that is
   better-looking than their QR code spreads on its own. Getting guests before hosts is
   the step that killed Stayzilla.
2. **The badge only means something if it's hard to get.** Twenty homestays checked in
   person are worth more than two thousand listings scraped off the web, and that
   difference is your advantage.
3. **The diaspora comes next because you already reach them.** The music room and the
   WhatsApp sharing already exist. Nobody else is speaking to this audience.
4. **Kolkata tourists come last.** They benefit from protected advances too, and you can
   sell to them on that once the badge has some reviews behind it.

## 4. What to build (one VPS, the stack you already have)

| Piece | How | Cut |
|---|---|---|
| Host pages + calendar | Vite/React pages, Node API, a Postgres table of stays and dates | A shared calendar across booking sites (iCal sync) until hosts ask for it |
| Payments | Razorpay Route: each host gets a linked account, the payment is split automatically, and the host's share is held until check-in | Running your own escrow or wallet: never |
| Messages to guests and hosts | WhatsApp click-to-chat links, then the WhatsApp Business API once volume justifies it | Native app, SMS |
| Admin | One page listing hosts, verification status and disputes | A dashboard |
| Languages | ne / en / bn as JSON files, in the same tone as the music site | A translation library |

Cost: about ₹2–4k a month for the server plus Razorpay's fees.
`ponytail: the calendar is a single table with no sync; add iCal import when a verified host is also on Airbnb.`

## 5. The next eight weeks

| When | What | Kill / go signal |
|---|---|---|
| **Weeks 1–2 (no code)** | Visit or phone 30 homestays found on Google Maps and Instagram, and record how they take bookings and advances. Ask 3–5 Gorkha diaspora groups whether they'd book or gift a stay. Ask a chartered accountant about GST, the tax collected on online marketplace sales (Section 52 TCS) and tour-operator registration. Ask Razorpay whether Route can hold a payment until check-in. | **Go if** 10 or more hosts say yes to a free page and the badge, and 30 or more diaspora people say they'd book or gift a stay. Otherwise stop here, having spent nothing. |
| **Weeks 3–6** | Build the host pages, Razorpay payments and the admin page. Visit 15–20 hosts and photograph them yourself. | Every launch host has a live page and has taken a test payment |
| **Weeks 7–8** | Launch Gift a Stay for Christmas, New Year and Losar (Feb 2027) through the music room and diaspora WhatsApp groups | 20 or more paid bookings by the end of February |
| **Mar–May 2027** | The spring peak. Start offering protected advances to Kolkata tourists. Open more villages. | Hosts ask to join before you ask them |

## 6. What happens to the game

Parked. The stories about places from pivot.md become content on host pages ("walk from
this homestay to Chowrasta: here's what you'll pass"). Check-ins and exploration can come
back later as a loyalty layer that guests unlock by staying. PvP is not part of the plan.
