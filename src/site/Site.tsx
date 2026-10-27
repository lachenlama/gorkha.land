import { useEffect, useState } from "react";
import bazaarWide from "../assets/bazaar-2400.webp";
import hills1280 from "../assets/hills-1280.webp";
import hills1792 from "../assets/hills-1792.webp";
import hillsPhone from "../assets/hills-phone-768.webp";
import home1376 from "../assets/home-1376.webp";
import home960 from "../assets/home-960.webp";
import NoteForm, { type Role } from "./NoteForm";

const CHAPTERS = [
  { id: "note", n: "01", en: "The note" },
  { id: "why", n: "02", en: "Why now" },
  { id: "movement", n: "03", en: "The movement" },
  { id: "jamghat", n: "04", en: "First product" },
  { id: "roadmap", n: "05", en: "What's next" },
  { id: "join", n: "06", en: "Join in" },
  { id: "leave-a-note", n: "07", en: "Your note" },
] as const;

function useScrollUi() {
  const [progress, setProgress] = useState(0);
  const [active, setActive] = useState("");

  useEffect(() => {
    let raf = 0;
    const onScroll = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        const max = document.documentElement.scrollHeight - innerHeight;
        setProgress(max > 0 ? scrollY / max : 0);
      });
    };
    onScroll();
    addEventListener("scroll", onScroll, { passive: true });

    const reveal = new IntersectionObserver(
      (entries) =>
        entries.forEach((e) => {
          if (e.isIntersecting) {
            e.target.classList.add("in");
            reveal.unobserve(e.target);
          }
        }),
      { rootMargin: "0px 0px -10% 0px" },
    );
    document.querySelectorAll("[data-reveal]").forEach((el) => reveal.observe(el));

    const chapters = new IntersectionObserver(
      (entries) => entries.forEach((e) => e.isIntersecting && setActive(e.target.id)),
      { rootMargin: "-45% 0px -50% 0px" },
    );
    CHAPTERS.forEach((c) => {
      const el = document.getElementById(c.id);
      if (el) chapters.observe(el);
    });

    return () => {
      removeEventListener("scroll", onScroll);
      reveal.disconnect();
      chapters.disconnect();
    };
  }, []);

  return { progress, active };
}

function Chapter({ n, title, ne, light }: { n: string; title: string; ne: string; light?: boolean }) {
  return (
    <div data-reveal className="mb-12 flex items-baseline gap-4 md:mb-16">
      <span className={`font-display text-sm tracking-[0.3em] ${light ? "text-gumba" : "text-brass"}`}>{n}</span>
      <span className={`h-px w-10 ${light ? "bg-gumba/40" : "bg-brass/40"}`} />
      <span className={`text-xs tracking-[0.25em] uppercase ${light ? "text-ink/60" : "text-cream/55"}`}>
        {title} · <span className="ne tracking-normal normal-case">{ne}</span>
      </span>
    </div>
  );
}

export default function Site() {
  const { progress, active } = useScrollUi();
  const [english, setEnglish] = useState(false);
  const [role, setRole] = useState<Role | "">("");

  const joinAs = (r: Role) => {
    setRole(r);
    document.getElementById("leave-a-note")?.scrollIntoView();
  };

  return (
    <>
      {/* ---- nav ----------------------------------------------------------- */}
      <header className="fixed inset-x-0 top-0 z-40 border-b border-cream/5 bg-ink/55 backdrop-blur-md">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 md:px-8">
          <a href="#top" className="flex items-baseline gap-2">
            <span className="ne text-lg text-cream">गोर्खाल्याण्ड</span>
            <span className="font-display text-sm text-cream/50">gorkha.land</span>
          </a>
          <nav className="flex items-center gap-6 text-sm text-cream/70">
            <a href="#note" className="hidden hover:text-cream md:inline">
              The note
            </a>
            <a href="#movement" className="hidden hover:text-cream md:inline">
              The movement
            </a>
            <a href="#jamghat" className="hidden hover:text-cream md:inline">
              Jamghat
            </a>
            <a
              href="#leave-a-note"
              className="rounded-full bg-brass px-4 py-2 font-medium text-ink transition hover:bg-lamp"
            >
              Leave a note
            </a>
          </nav>
        </div>
        <div className="h-px bg-brass" style={{ width: `${progress * 100}%` }} aria-hidden />
      </header>

      {/* ---- chapter rail (desktop) ---------------------------------------- */}
      <nav aria-label="Chapters" className="fixed top-1/2 right-6 z-30 hidden -translate-y-1/2 flex-col gap-3 xl:flex">
        {CHAPTERS.map((c) => (
          <a key={c.id} href={`#${c.id}`} className="group flex items-center justify-end gap-3">
            <span
              className={`text-xs tracking-wide opacity-0 transition group-hover:opacity-100 ${
                active === c.id ? "text-brass opacity-100" : "text-cream/60"
              }`}
            >
              {c.en}
            </span>
            <span
              className={`h-2 w-2 rounded-full border transition ${
                active === c.id ? "scale-125 border-brass bg-brass" : "border-cream/40"
              }`}
            />
          </a>
        ))}
      </nav>

      <main id="top">
        {/* ---- 00 hero ------------------------------------------------------ */}
        <section className="relative grid min-h-svh place-items-end overflow-hidden">
          <picture className="absolute inset-0">
            <source media="(orientation: portrait)" srcSet={hillsPhone} />
            <img
              src={hills1280}
              srcSet={`${hills1280} 1280w, ${hills1792} 1792w`}
              sizes="100vw"
              alt="The Darjeeling hills at blue hour: Kanchenjunga catching the last light above the mist, town lights coming on along the ridge, and a young person on a rooftop with a glowing phone."
              className="kenburns h-full w-full object-cover object-[50%_20%] landscape:object-[72%_50%]"
            />
          </picture>
          {/* The painting has its own mist; one faint band keeps the valley moving. */}
          <div
            className="mist opacity-30"
            style={{ top: "38%", height: "28vh", ["--dur" as string]: "140s" }}
            aria-hidden
          />
          <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/35 to-transparent" aria-hidden />
          <div className="absolute inset-0 hidden bg-gradient-to-r from-ink/70 via-ink/20 to-transparent md:block" aria-hidden />

          <div className="relative mx-auto w-full max-w-6xl px-4 pt-32 pb-16 md:px-8 md:pb-24">
            <p className="rise mb-6 flex flex-wrap items-center gap-3 text-sm text-cream/75">
              <span className="ne text-base text-lamp">नमस्ते,</span>
              <span>from the hills</span>
              <span className="h-px w-8 bg-cream/30" />
              <span className="tracking-wide">An announcement · October 2026</span>
            </p>
            <h1
              className="rise font-display text-5xl leading-[1.05] text-cream sm:text-6xl md:text-7xl lg:text-8xl"
              style={{ animationDelay: "150ms" }}
            >
              The hills are going digital.
              <br />
              <em className="text-lamp">On our own terms.</em>
            </h1>
            <p
              className="rise mt-8 max-w-2xl text-lg leading-relaxed text-cream/80 md:text-xl"
              style={{ animationDelay: "300ms" }}
            >
              gorkha.land is a movement to bring the economy of the Darjeeling hills online, built here and curated
              by people from here, for everyone who lives in these hills and everyone who had to leave them.
            </p>
            <div className="rise mt-10 flex flex-wrap gap-3" style={{ animationDelay: "450ms" }}>
              <a href="#note" className="rounded-full bg-cream px-6 py-3 font-medium text-ink transition hover:bg-lamp">
                Read the note
              </a>
              <a
                href="#leave-a-note"
                className="rounded-full border border-cream/30 px-6 py-3 text-cream transition hover:border-cream"
              >
                Share your idea
              </a>
            </div>
          </div>
          <a
            href="#note"
            className="absolute bottom-6 left-1/2 hidden -translate-x-1/2 text-xs tracking-[0.3em] text-cream/50 uppercase md:block"
          >
            Scroll ↓
          </a>
        </section>

        {/* ---- 01 the note -------------------------------------------------- */}
        <section id="note" className="relative bg-pine py-24 md:py-36">
          <div className="mx-auto max-w-6xl px-4 md:px-8">
            <Chapter n="01" title="The note" ne="चिठी" />
            <article data-reveal className="paper relative mx-auto max-w-3xl rounded-sm px-6 py-12 sm:px-12 md:px-16 md:py-16">
              <div className="postmark absolute top-6 right-6 hidden h-24 w-24 rotate-[-12deg] place-items-center text-center text-gumba/70 sm:grid">
                <span className="ne text-xs leading-tight">
                  दार्जिलिङ
                  <br />
                  <span className="font-display">2026</span>
                </span>
              </div>

              <div className="mb-8 flex items-center gap-3 text-xs">
                <button
                  onClick={() => setEnglish(false)}
                  aria-pressed={!english}
                  className={`rounded-full px-3 py-1 ${!english ? "bg-ink text-cream" : "text-ink/60 hover:text-ink"}`}
                >
                  नेपाली
                </button>
                <button
                  onClick={() => setEnglish(true)}
                  aria-pressed={english}
                  className={`rounded-full px-3 py-1 ${english ? "bg-ink text-cream" : "text-ink/60 hover:text-ink"}`}
                >
                  Read in English
                </button>
              </div>

              {english ? (
                <div lang="en" className="font-display space-y-5 text-lg leading-relaxed md:text-xl">
                  <p className="text-2xl">Dear hills,</p>
                  <p>
                    In the morning, while the kuiro still covers Chowrasta, someone is pulling up a shop shutter, a mother
                    is boiling tea, and someone is standing at the motor stand, heading down the hill again — to
                    Bangalore, Delhi, Dubai — to earn, to get by.
                  </p>
                  <p>We have all watched that goodbye. Many of us have said it ourselves.</p>
                  <p>
                    These hills gave the world tea, songs and soldiers. Yet the story of how we earn a living is still
                    being written by someone else. Our cafés, our shops, the skills of our young people are either
                    missing from the internet or listed under other people's names.
                  </p>
                  <p className="font-semibold">Now it is our turn.</p>
                  <p>
                    gorkha.land is not a slogan, and it is not a party. It is a small beginning: putting our places, our
                    people and our economy into the digital world with our own hands. A way to earn while staying in the
                    hills, and a reason to come back to them.
                  </p>
                  <p>
                    Wherever you are — on a rain-soaked road to Mirik or in a small rented room somewhere far away — this is
                    yours too.
                  </p>
                  <p>Leave us a few words. We read every one.</p>
                  <p className="hand pt-4 text-3xl text-gumba">We belong here.</p>
                  <p className="hand text-xl text-ink/70">— the gorkha.land family</p>
                </div>
              ) : (
                <div lang="ne" className="ne space-y-5 text-lg md:text-xl">
                  <p className="text-2xl">प्यारो पहाड,</p>
                  <p>
                    बिहान कुइरोले चौरस्ता छोपिरहँदा कसैले दोकानको सटर उठाउँदै छ, कसैकी आमा चिया बनाउँदै हुनुहुन्छ, अनि कोही
                    मोटर स्ट्यान्डमा उभिएर फेरि तल झर्दै छ — बेङ्गलोर, दिल्ली, दुबई — कमाउन, बाँच्न।
                  </p>
                  <p>हामी सबैले त्यो बिदाइ देखेका छौँ। धेरैले त आफैँ गरेका पनि छौँ।</p>
                  <p>
                    हाम्रा डाँडाहरूले संसारलाई चिया दिए, गीत दिए, फौजी दिए। तर हाम्रो आफ्नै कमाइको कथा अझै अरूले नै
                    लेखिरहेका छन्। हाम्रा क्याफे, हाम्रा दोकान, हाम्रा ठिटाठिटीको सीप — इन्टरनेटमा कि त भेटिँदैनन्, कि त
                    अरूकै नाममा भेटिन्छन्।
                  </p>
                  <p className="text-2xl">अब पालो हाम्रो।</p>
                  <p>
                    gorkha.land कुनै नारा होइन, कुनै पार्टी होइन। यो एउटा सानो सुरुवात हो — आफ्ना ठाउँ, आफ्ना मान्छे र आफ्नो
                    काम-धन्दालाई आफ्नै हातले डिजिटल संसारमा उभ्याउने। पहाडमै बसेर कमाउन सकिने, पहाड फर्केर बाँच्न सकिने
                    एउटा बाटो।
                  </p>
                  <p>
                    तपाईं जहाँ भए पनि — झरीमा भिजेको मिरिकको बाटोमा होस् वा बाहिर कतै भाडाको साँघुरो कोठामा — यो तपाईंकै हो।
                  </p>
                  <p>एउटा कुरा लेखेर जानुस्। हामी हरेक कुरा पढ्छौँ।</p>
                  <p className="pt-4 text-3xl text-gumba">हामी यहीँका हौँ।</p>
                  <p className="text-xl text-ink/70">— gorkha.land परिवार</p>
                </div>
              )}
            </article>
          </div>
        </section>

        {/* ---- 02 why now --------------------------------------------------- */}
        <section id="why" className="grain relative bg-ink py-24 md:py-36">
          <div className="mx-auto max-w-6xl px-4 md:px-8">
            <Chapter n="02" title="Why now" ne="किन अहिले" />
            <h2 data-reveal className="font-display max-w-4xl text-4xl leading-tight md:text-6xl">
              Our hills are online. <span className="text-cream/45">Our economy isn't.</span>
            </h2>

            <div className="mt-16 grid gap-px overflow-hidden rounded-2xl bg-cream/10 md:grid-cols-3">
              {[
                {
                  big: "736",
                  label: "5G towers are live across Darjeeling and Kalimpong districts, with 5G in every block headquarters.",
                  note: "Lok Sabha, Unstarred Q. 473, 23 July 2025 (as on 30 June 2025)",
                },
                {
                  big: "149",
                  label: "villages in the hills already have 5G towers: 127 in Darjeeling district, 22 in Kalimpong.",
                  note: "Lok Sabha, Unstarred Q. 473, 23 July 2025",
                },
                {
                  big: "1.19 lakh",
                  label: "people lived in Darjeeling town at the last census, and too many of its young people leave to find work.",
                  note: "Census of India 2011: 118,805",
                },
              ].map((s, i) => (
                <div key={s.big} data-reveal style={{ ["--d" as string]: `${i * 120}ms` }} className="bg-ink p-8 md:p-10">
                  <p className="font-display text-5xl text-lamp md:text-6xl">{s.big}</p>
                  <p className="mt-4 text-cream/80">{s.label}</p>
                  <p className="mt-6 text-xs tracking-wide text-cream/40">{s.note}</p>
                </div>
              ))}
            </div>

            <div className="mt-20 grid gap-10 md:grid-cols-3">
              {[
                ["Young people leave", "There are few jobs and few places built for them, so the brightest go down the hill and many never come back."],
                ["Businesses stay invisible", "The best café in town is on a WhatsApp forward, not on a map. Visitors walk straight past it."],
                ["Money flows downhill", "When we do go online, we use platforms that take their cut and send it far away from here."],
              ].map(([t, d], i) => (
                <div key={t} data-reveal style={{ ["--d" as string]: `${i * 120}ms` }}>
                  <p className="font-display text-2xl text-cream">{t}</p>
                  <p className="mt-3 leading-relaxed text-cream/65">{d}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ---- 03 the movement --------------------------------------------- */}
        <section id="movement" className="relative bg-tea py-24 md:py-36">
          <div className="ridge absolute inset-x-0 -top-px h-16 rotate-180 bg-ink md:h-24" aria-hidden />
          <div className="mx-auto max-w-6xl px-4 md:px-8">
            <Chapter n="03" title="The movement" ne="अभियान" />
            <h2 data-reveal className="font-display max-w-4xl text-4xl leading-tight md:text-6xl">
              A digital movement for the hills. <em className="text-lamp">Built on six promises.</em>
            </h2>

            <div className="mt-16 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {[
                ["यहीँ बनेको", "Made here", "Built in the hills, by people who can tell kuiro from ordinary fog."],
                ["छानिएको", "Curated, not crowded", "Every café, job and seller is checked by our team. A short list you can trust beats a long list you can't."],
                ["कमाएको", "Earned, not bought", "Points, levels and badges come from showing up. They can never be bought or cashed out."],
                ["सबैको पहाड", "Everyone's hills", "Nepali, Lepcha, Bhutia, Tibetan, Bengali. These hills belong to everyone who calls them home."],
                ["पहिचान", "Pride, not politics", "We are proud of where we come from. No parties, no slogans, no flags. Just the hills, moving forward."],
                ["पैसा यहीँ", "Money stays up the hill", "We build for local businesses first, so what is spent in the hills stays in the hills."],
              ].map(([ne, t, d], i) => (
                <div
                  key={t}
                  data-reveal
                  style={{ ["--d" as string]: `${(i % 3) * 100}ms` }}
                  className="rounded-2xl border border-cream/10 bg-pine/50 p-7 backdrop-blur-sm transition hover:border-brass/40"
                >
                  <p className="ne text-lg text-lamp">{ne}</p>
                  <p className="font-display mt-1 text-2xl text-cream">{t}</p>
                  <p className="mt-3 leading-relaxed text-cream/70">{d}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ---- 04 jamghat --------------------------------------------------- */}
        <section id="jamghat" className="relative overflow-hidden py-24 md:py-36">
          <img src={bazaarWide} alt="" className="absolute inset-0 h-full w-full object-cover opacity-30" aria-hidden />
          <div className="absolute inset-0 bg-gradient-to-b from-tea via-ink/90 to-ink" aria-hidden />
          <div className="relative mx-auto max-w-6xl px-4 md:px-8">
            <Chapter n="04" title="First product" ne="पहिलो कदम" />
            <div className="grid items-center gap-16 lg:grid-cols-[1.1fr_0.9fr]">
              <div>
                <p data-reveal className="ne text-3xl text-lamp">
                  जमघट
                </p>
                <h2 data-reveal className="font-display mt-2 text-4xl leading-tight md:text-6xl">
                  Jamghat: the hills' hangouts, turned into a game.
                </h2>
                <p data-reveal className="mt-6 max-w-xl text-lg leading-relaxed text-cream/75">
                  We're starting with the places you already love. Form a crew with your friends, check in at cafés and
                  hangouts across Darjeeling, and compete each month to hold your spot. The cafés reward the crews that
                  show up.
                </p>

                <ol className="mt-12 space-y-8">
                  {[
                    ["Form a crew", "3 to 8 friends: your college group, your band, your football team."],
                    ["Check in", "Scan the QR code at the counter. Every visit earns points and levels you up."],
                    ["Hold the spot", "The crew with the most members checking in holds the café this month, and gets its perk."],
                  ].map(([t, d], i) => (
                    <li key={t} data-reveal style={{ ["--d" as string]: `${i * 120}ms` }} className="flex gap-5">
                      <span className="font-display grid h-10 w-10 shrink-0 place-items-center rounded-full border border-brass/50 text-brass">
                        {i + 1}
                      </span>
                      <div>
                        <p className="font-display text-xl text-cream">{t}</p>
                        <p className="mt-1 text-cream/65">{d}</p>
                      </div>
                    </li>
                  ))}
                </ol>

                <div data-reveal className="mt-12 rounded-2xl border border-lamp/30 bg-lamp/5 p-6">
                  <p className="font-display text-xl text-lamp">Run a café or a hangout?</p>
                  <p className="mt-2 text-cream/75">
                    More regulars on slow weekdays, a simple dashboard of who keeps coming back, and free promotion
                    for your events. <strong className="text-cream">Free for the first three months.</strong>
                  </p>
                  <button
                    onClick={() => joinAs("business")}
                    className="mt-4 text-sm font-medium text-lamp underline decoration-lamp/40 underline-offset-4 hover:decoration-lamp"
                  >
                    Tell us about your place →
                  </button>
                </div>
              </div>

              {/* phone mock: an illustration of the product, with fictional venues */}
              <div data-reveal className="mx-auto w-full max-w-[320px]">
                <div className="rounded-[2.6rem] border border-cream/15 bg-ink p-3 shadow-2xl shadow-black/60">
                  <div className="overflow-hidden rounded-[2rem] bg-pine">
                    <div className="flex items-center justify-between px-5 pt-5 text-[11px] text-cream/50">
                      <span>gorkha.land</span>
                      <span className="ne">जमघट</span>
                    </div>
                    <div className="mx-4 mt-4 rounded-2xl bg-gradient-to-br from-tea to-ink p-4">
                      <p className="text-[11px] tracking-wider text-cream/50 uppercase">Held this month</p>
                      <p className="font-display mt-1 text-xl text-cream">Kuiro Café</p>
                      <p className="mt-2 text-sm text-lamp">☁️ Mist Gang · 42 check-ins</p>
                      <div className="mt-3 h-1.5 rounded-full bg-cream/10">
                        <div className="h-full w-3/4 rounded-full bg-lamp" />
                      </div>
                      <p className="mt-2 text-[11px] text-cream/50">Your crew is 9 check-ins behind</p>
                    </div>
                    <div className="mx-4 mt-3 flex items-center justify-between rounded-xl bg-cream/5 px-4 py-3">
                      <div>
                        <p className="text-[11px] text-cream/50">Your level</p>
                        <p className="ne text-cream">बाटो · Bato</p>
                      </div>
                      <p className="font-display text-lg text-brass">340 pts</p>
                    </div>
                    <p className="mt-4 px-5 text-[11px] tracking-wider text-cream/45 uppercase">Leaderboard</p>
                    <ul className="mx-4 mt-2 mb-4 divide-y divide-cream/5 text-sm">
                      {[
                        ["1", "Mist Gang", "128"],
                        ["2", "Tin Roof Crew", "119"],
                        ["3", "Momo Mafia", "97"],
                      ].map(([r, n, p]) => (
                        <li key={n} className="flex items-center gap-3 py-2.5">
                          <span className="w-4 text-cream/40">{r}</span>
                          <span className="flex-1 text-cream/85">{n}</span>
                          <span className="text-cream/50">{p}</span>
                        </li>
                      ))}
                    </ul>
                    <div className="mx-4 mb-5 rounded-xl border border-brass/30 px-4 py-3 text-sm text-brass">
                      🎁 Crew perk: one free momo plate a week
                    </div>
                  </div>
                </div>
                <p className="mt-4 text-center text-xs text-cream/40">Early concept. Venues shown are fictional.</p>
              </div>
            </div>
          </div>
        </section>

        {/* ---- 05 roadmap --------------------------------------------------- */}
        <section id="roadmap" className="grain relative bg-ink py-24 md:py-36">
          <div className="mx-auto max-w-6xl px-4 md:px-8">
            <Chapter n="05" title="What's next" ne="अगाडिको बाटो" />
            <h2 data-reveal className="font-display max-w-3xl text-4xl leading-tight md:text-6xl">
              One brand. One product at a time.
            </h2>
            <p data-reveal className="mt-6 max-w-2xl text-lg text-cream/65">
              Every product has a Nepali name, uses the same account and the same points, and is checked by the same
              people. We add the next one only when the last one is working.
            </p>

            <ol className="relative mt-16 space-y-4 before:absolute before:top-2 before:bottom-2 before:left-[7px] before:w-px before:bg-cream/15">
              {[
                ["जमघट", "Jamghat", "Cafés, crews and hangouts. Check in, level up, hold your spot.", "Building now"],
                ["काम", "Kaam", "Jobs, gigs, internships and scholarships for the hills, all checked.", "Next"],
                ["पहाड Live", "Pahad Live", "Roads, landslides, water and power, reported by people on the ground.", "Later"],
                ["हाट", "Haat", "Tea, churpi, dalle and crafts, straight from the people who make them.", "Later"],
                ["बास", "Baas", "Verified homestays, with your advance payment protected.", "Later"],
              ].map(([ne, en, d, s], i) => (
                <li key={en} data-reveal style={{ ["--d" as string]: `${i * 90}ms` }} className="relative pl-10">
                  <span
                    className={`absolute top-2 left-0 h-[15px] w-[15px] rounded-full border-2 ${
                      i === 0 ? "border-lamp bg-lamp" : "border-cream/30 bg-ink"
                    }`}
                  />
                  <div className="flex flex-col gap-2 rounded-2xl border border-cream/10 p-6 transition hover:bg-cream/[0.03] md:flex-row md:items-center md:gap-8">
                    <div className="md:w-56">
                      <p className="ne text-2xl text-cream">{ne}</p>
                      <p className="text-sm text-cream/50">{en}</p>
                    </div>
                    <p className="flex-1 text-cream/70">{d}</p>
                    <span
                      className={`self-start rounded-full px-3 py-1 text-xs md:self-center ${
                        i === 0 ? "bg-lamp text-ink" : "border border-cream/20 text-cream/60"
                      }`}
                    >
                      {s}
                    </span>
                  </div>
                </li>
              ))}
            </ol>
          </div>
        </section>

        {/* ---- 06 join ------------------------------------------------------ */}
        <section id="join" className="relative bg-tea py-24 md:py-36">
          <div className="mx-auto max-w-6xl px-4 md:px-8">
            <Chapter n="06" title="Join in" ne="सँगै हिँडौँ" />
            <h2 data-reveal className="font-display max-w-3xl text-4xl leading-tight md:text-6xl">
              A movement needs people. <em className="text-lamp">Here's your place in it.</em>
            </h2>

            <div className="mt-16 grid gap-6 sm:grid-cols-2">
              {(
                [
                  ["student", "Students & Gen Z", "Become a founding member or a campus ambassador. Get a permanent founder badge and help shape the app.", "I want in"],
                  ["business", "Cafés & local businesses", "Be one of the first ten partner venues in Darjeeling. Free for three months.", "Partner with us"],
                  ["away", "Away from home", "From Bengaluru to Dubai, you're still from here. Tell us what you'd want from the hills.", "Share an idea"],
                  ["creator", "Creators & builders", "Photographers, designers, writers, developers. The hills need your skills too.", "Lend a hand"],
                ] as const
              ).map(([r, t, d, cta], i) => (
                <div
                  key={r}
                  data-reveal
                  style={{ ["--d" as string]: `${(i % 2) * 100}ms` }}
                  className="flex flex-col rounded-2xl bg-pine/60 p-8"
                >
                  <p className="font-display text-2xl text-cream">{t}</p>
                  <p className="mt-3 flex-1 leading-relaxed text-cream/70">{d}</p>
                  <button
                    onClick={() => joinAs(r)}
                    className="mt-6 self-start rounded-full border border-lamp/50 px-5 py-2 text-sm text-lamp transition hover:bg-lamp hover:text-ink"
                  >
                    {cta} →
                  </button>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ---- 07 leave a note --------------------------------------------- */}
        <section id="leave-a-note" className="relative bg-pine py-24 md:py-36">
          <div className="mx-auto max-w-6xl px-4 md:px-8">
            <Chapter n="07" title="Your note" ne="तपाईंको कुरा" />
            <div className="grid gap-16 lg:grid-cols-[0.8fr_1.2fr]">
              <div>
                <h2 data-reveal className="font-display text-4xl leading-tight md:text-5xl">
                  What should the hills build next?
                </h2>
                <p data-reveal className="mt-6 text-lg leading-relaxed text-cream/70">
                  An idea, a café you love, something that's broken, a way you could help. Write it in Nepali, English,
                  or both. Every note is read by a person, not a bot.
                </p>
                <p data-reveal className="ne mt-8 text-2xl text-lamp">
                  तपाईंको एउटा कुराले पहाडको भोलि बदल्न सक्छ।
                </p>
                <p data-reveal className="mt-1 text-sm text-cream/50">One note from you could change tomorrow for the hills.</p>
              </div>
              <div data-reveal>
                <NoteForm role={role} onRole={setRole} />
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* ---- footer --------------------------------------------------------- */}
      <footer className="relative flex min-h-[85svh] flex-col justify-end overflow-hidden bg-ink pt-48 pb-10">
        <img
          src={home960}
          srcSet={`${home960} 960w, ${home1376} 1376w`}
          sizes="100vw"
          alt="Dusk on the road up to Darjeeling: a shared jeep with luggage on its roof rounds a hairpin bend beside the toy train, by a lit roadside tea stall."
          loading="lazy"
          className="absolute inset-0 h-full w-full object-cover object-[62%_50%]"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/50 to-ink/10" aria-hidden />
        <div className="ridge absolute inset-x-0 -top-px h-16 rotate-180 bg-pine md:h-24" aria-hidden />
        <div className="relative mx-auto w-full max-w-6xl px-4 md:px-8">
          <p className="ne text-4xl text-cream md:text-6xl">हामी यहीँका हौँ।</p>
          <p className="font-display mt-2 text-xl text-cream/50 italic">We belong here.</p>
          <div className="mt-16 flex flex-col justify-between gap-4 border-t border-cream/10 pt-8 text-sm text-cream/45 md:flex-row">
            <p>© 2026 gorkha.land · Made in the hills</p>
            <p>No ads. No tracking. No politics.</p>
          </div>
        </div>
      </footer>
    </>
  );
}
