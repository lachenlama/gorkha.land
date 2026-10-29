// What the player sees when the fog lifts (ux-spec §4): the answer, the live counter, where they are,
// the week's towns, share, and a way into the deck. Desktop: bottom-left like the hero copy;
// phone: a bottom sheet.

import { lazy, Suspense, useEffect, useLayoutEffect, useState } from "react";
import { PLACE_NE, PLACES, type Lights, type Place } from "../lights";
import type { RunResult } from "./engine";
import { fitImage, imageToScreen, type LampSet } from "./lamps";

const SharePreview = lazy(() => import("./SharePreview"));

export type Form = { place: Place | ""; city: string; contact: string; consent: boolean };
type Props = {
  result: RunResult;
  lights: Lights | null;
  img: HTMLImageElement;
  set: LampSet;
  leaving: boolean;
  onForm(f: Form): void;
  onAgain(): void;
  onContinue(): void;
};

const field =
  "w-full rounded-xl border border-cream/15 bg-ink/60 px-4 py-3 text-cream placeholder:text-cream/30 focus:border-lamp focus:ring-1 focus:ring-lamp focus:outline-none";
const focus = "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-lamp";
const fmt = (n: number) => n.toLocaleString("en-IN");
const abroad = (p: Place | "") => p === "Abroad" || p === "Elsewhere in India";

export default function EndPanel({ result, lights, img, set, leaving, onForm, onAgain, onContinue }: Props) {
  const { lit, chain, won } = result;
  const [place, setPlace] = useState<Place | "">("");
  const [city, setCity] = useState("");
  const [contact, setContact] = useState("");
  const [consent, setConsent] = useState(false);
  const [waitlist, setWaitlist] = useState(false);
  const [sharing, setSharing] = useState(false);
  const [ticked, setTicked] = useState(false);

  useEffect(() => onForm({ place, city, contact, consent }), [place, city, contact, consent, onForm]);
  useEffect(() => {
    const t = setTimeout(() => setTicked(true), 1400); // your light joins the count
    return () => clearTimeout(t);
  }, []);

  // staggered rise, 300 ms apart (capped so the buttons never wait long)
  const rise = (n: number) => ({ animationDelay: `${600 + Math.min(n, 6) * 300}ms` });
  const cityName = city.trim();
  const total = lights && lights.total + (ticked ? 1 : 0);
  const top = lights && lights.week.length >= 3 ? lights.week.slice(0, 3) : null;

  const again = (
    <button
      onClick={onAgain}
      className={`min-h-11 rounded-full px-6 py-3 font-medium transition ${focus} ${
        won ? "border border-cream/30 text-cream hover:border-cream" : "bg-lamp text-ink hover:bg-cream"
      }`}
    >
      Play again
    </button>
  );

  return (
    <div className={`absolute inset-x-0 bottom-0 z-20 transition-opacity duration-400 ${leaving ? "opacity-0" : ""}`}>
      <div className="mx-auto max-w-6xl md:px-8 md:pb-14">
        <section
          data-panel
          aria-labelledby="i-end"
          className="max-h-[70svh] touch-pan-y overflow-y-auto overscroll-contain rounded-t-3xl bg-ink/80 p-6 pb-[max(1.5rem,env(safe-area-inset-bottom))] backdrop-blur-md md:max-h-[calc(100svh-7rem)] md:max-w-xl md:rounded-none md:bg-transparent md:p-0 md:backdrop-blur-none"
        >
          {won ? (
            <>
              <h2 id="i-end" lang="ne" className="i-up ne i-tight i-shadow text-5xl text-cream md:text-7xl" style={rise(0)}>
                पहाडमा हामी छौँ।
              </h2>
              <p className="i-up font-display text-2xl text-lamp italic" style={rise(1)}>
                We are.
              </p>
            </>
          ) : (
            <>
              <h2 id="i-end" lang="ne" className="i-up ne i-tight i-shadow text-4xl text-cream md:text-6xl" style={rise(0)}>
                कुइरोले यसपालि जित्यो।
              </h2>
              <p className="i-up font-display text-2xl text-cream/80 italic" style={rise(1)}>
                The kuiro won this time.
              </p>
              <p lang="ne" className="i-up ne i-tight mt-2 text-xl text-cream" style={rise(2)}>
                कुइरो त फाटिहाल्छ। फेरि?
              </p>
              <p className="i-up text-cream/60" style={rise(2)}>
                It always lifts. Again?
              </p>
              <p lang="ne" className="i-up ne i-tight mt-1 text-2xl text-lamp" style={rise(2)}>
                पहाडमा हामी छौँ।
              </p>
            </>
          )}

          <p className="i-up mt-4 text-cream/75" style={rise(2)}>
            <span lang="ne" className="ne i-tight block">
              {won && "कुइरो फाट्यो। "}तपाईंले {lit} बत्ती बाल्नुभयो, सबैभन्दा लामो माला {chain} बत्तीको।
            </span>
            {won && "The kuiro lifted. "}You lit {lit} {lit === 1 ? "light" : "lights"}. Your longest chain: {chain}.
          </p>

          {!won && <div className="i-up mt-5 flex flex-wrap items-center gap-3" style={rise(3)}>{again}</div>}

          {total !== null && (
            <p className="i-up relative mt-6 text-cream/75" style={rise(3)}>
              {ticked && <span aria-hidden className="i-glow absolute -top-3 -left-6 h-14 w-40 rounded-full bg-lamp/40 blur-2xl" />}
              <span lang="ne" className="ne i-tight relative block">
                पहाडभरि <span className="font-display text-2xl text-lamp tabular-nums">{fmt(total)}</span> {total === 1 ? "बत्ती बलिरहेको छ" : "बत्ती बलिरहेका छन्"}।
              </span>
              <span className="relative block text-sm text-cream/60">{fmt(total)} {total === 1 ? "light is" : "lights are"} on across the hills.</span>
              {lights!.total < 100 && (
                <span className="relative mt-1 block text-sm">
                  <span lang="ne" className="ne">तपाईं पहिलो 100 मध्ये एक हुनुहुन्छ।</span> · You're one of the first 100.
                </span>
              )}
            </p>
          )}

          <fieldset className="i-up mt-6" style={rise(4)}>
            <legend className="mb-3 text-sm text-cream/70">
              <span lang="ne" className="ne">तपाईं कहाँ हुनुहुन्छ?</span> · Where are you?
            </legend>
            <div className="flex flex-wrap gap-2">
              {PLACES.map((p) => (
                <button
                  key={p}
                  type="button"
                  aria-pressed={place === p}
                  onClick={() => setPlace(place === p ? "" : p)}
                  className={`min-h-9 rounded-full border px-3 py-1.5 text-sm transition ${focus} ${
                    place === p ? "border-lamp bg-lamp text-ink" : "border-cream/20 text-cream/80 hover:border-cream/50"
                  }`}
                >
                  <span lang="ne" className="ne">{PLACE_NE[p]}</span> {p}
                </button>
              ))}
            </div>
            {abroad(place) && (
              <div className="mt-3">
                <label htmlFor="i-city" className="mb-1 block text-sm text-cream/60">
                  Which city? <span className="text-cream/40">(only on your card)</span>
                </label>
                <input id="i-city" maxLength={40} autoComplete="off" value={city} onChange={(e) => setCity(e.target.value)} className={field} />
                {cityName && (
                  <p className="mt-2 text-sm text-lamp">
                    <span lang="ne" className="ne">{cityName} बाट पनि पहाडमा बत्ती बल्यो।</span> · Your light from {cityName} is on in the hills.
                  </p>
                )}
              </div>
            )}
          </fieldset>

          {top && (
            <div className="i-up mt-6" style={rise(5)}>
              <p className="mb-2 text-sm text-cream/70">
                <span lang="ne" className="ne">यो हप्ता</span> · This week
              </p>
              <ul className="space-y-2">
                {top.map((t) => (
                  <li key={t.place} className={`text-sm ${t.place === place ? "text-lamp" : "text-cream/80"}`}>
                    <div className="flex justify-between">
                      <span>
                        <span lang="ne" className="ne">{PLACE_NE[t.place]}</span> {t.place}
                      </span>
                      <span className="tabular-nums">{fmt(t.n)}</span>
                    </div>
                    <div className="mt-1 h-1 rounded-full bg-cream/10">
                      <div className="h-1 rounded-full bg-lamp" style={{ width: `${(100 * t.n) / top[0].n}%` }} />
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* on a phone the sheet scrolls, so the actions stay pinned to its bottom edge */}
          <div
            className="i-up sticky bottom-0 -mx-6 mt-5 flex flex-wrap items-center gap-3 border-t border-cream/5 bg-ink/95 px-6 pt-3 pb-3 md:static md:mx-0 md:mt-7 md:border-0 md:bg-transparent md:p-0"
            style={rise(6)}
          >
            <button
              onClick={() => setSharing(true)}
              className={`min-h-11 rounded-full bg-lamp px-6 py-3 font-medium text-ink transition hover:bg-cream ${focus}`}
            >
              Share my light
            </button>
            {won && again}
            <button onClick={onContinue} className={`min-h-11 px-2 text-sm text-cream/70 underline underline-offset-4 hover:text-cream ${focus}`}>
              See what we're building ↓
            </button>
          </div>

          <div className="i-up mt-5 pb-2" style={rise(6)}>
            {!waitlist ? (
              <button onClick={() => setWaitlist(true)} className={`min-h-11 text-left text-sm text-cream/60 underline underline-offset-4 hover:text-cream ${focus}`}>
                <span lang="ne" className="ne">जमघट सबैभन्दा पहिले चलाउने?</span> · Want first access to Jamghat?
              </button>
            ) : (
              <div className="space-y-3">
                <label htmlFor="i-contact" className="block text-sm text-cream/60">
                  Instagram or email
                </label>
                <input id="i-contact" maxLength={120} autoComplete="off" value={contact} onChange={(e) => setContact(e.target.value)} className={field} />
                {contact.trim() && (
                  <label className="flex items-start gap-3 text-sm text-cream/60">
                    <input
                      type="checkbox"
                      required
                      checked={consent}
                      onChange={(e) => setConsent(e.target.checked)}
                      className="mt-1 accent-[var(--color-lamp)]"
                    />
                    You can contact me when Jamghat opens. You'll only use this to tell me about Jamghat, and you'll delete it if I ask.
                  </label>
                )}
              </div>
            )}
          </div>
        </section>
      </div>

      {abroad(place) && cityName && <FarLight img={img} set={set} />}
      {sharing && (
        <Suspense fallback={null}>
          <SharePreview lit={lit} place={place} city={cityName} onClose={() => setSharing(false)} />
        </Suspense>
      )}
    </div>
  );
}

/** A diaspora light: one extra glow on the far ridge of the painting. */
function FarLight({ img, set }: { img: HTMLImageElement; set: LampSet }) {
  const [at, setAt] = useState<[number, number]>([0, 0]);
  useLayoutEffect(() => {
    const place = () => setAt(imageToScreen(fitImage(img), ...set.far));
    place();
    addEventListener("resize", place);
    return () => removeEventListener("resize", place);
  }, [img, set]);
  return (
    <div
      aria-hidden
      className="i-far pointer-events-none fixed -z-10 size-28 -translate-x-1/2 -translate-y-1/2 rounded-full"
      style={{
        left: at[0],
        top: at[1],
        background: "radial-gradient(circle, rgba(255,244,220,1) 0, rgba(232,182,107,0.8) 9%, rgba(232,182,107,0.35) 28%, rgba(232,182,107,0) 70%)",
      }}
    />
  );
}
