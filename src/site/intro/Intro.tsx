// The front door: "पहाडमा के छ र?", then बत्ती बाल, then the answer. Owns the phase machine, the
// controls, scroll lock, and what gets posted and remembered. The game, sound and end panel are
// loaded on demand while the question fades in, long before the CTA.

import { lazy, Suspense, useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";
import { getLights, postLight, readMyLight, saveMyLight, type Lights } from "../lights";
import type { RunResult } from "./engine";
import type { Form } from "./EndPanel";
import { pickSet } from "./lamps";
import type { Sound } from "./sound";
import "./intro.css";

export type IntroPhase = "question" | "playing" | "end";
export type IntroResult = { lit: number; chain: number; won: boolean; place: Form["place"] } | null; // null = skipped

type Props = { replay?: boolean; onPhase(p: IntroPhase): void; onDone(r: IntroResult): void };

const loadGame = () => import("./Game");
const loadPanel = () => import("./EndPanel");
const loadSound = () => import("./sound");
const Game = lazy(loadGame);
const EndPanel = lazy(loadPanel);

const FOCUSABLE = "button:not([disabled]),input:not([disabled]),a[href],[tabindex]:not([tabindex='-1'])";
const focus = "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-lamp";
const MQ = (q: string) => matchMedia(q).matches;

const newRunId = () => crypto.randomUUID?.() ?? `${Date.now().toString(36)}-${Math.random().toString(36).slice(2)}`;

const readSound = () => {
  try {
    return localStorage.getItem("gl.sound") !== "0";
  } catch {
    return true;
  }
};

const whenLoaded = (img: HTMLImageElement, ms: number) =>
  new Promise<void>((done) => {
    if (img.complete && img.naturalWidth) return done();
    img.addEventListener("load", () => done(), { once: true });
    setTimeout(done, ms);
  });

export default function Intro({ replay = false, onPhase, onDone }: Props) {
  const [img, setImg] = useState<HTMLImageElement | null>(null); // the hero isn't in the DOM until this commit lands
  const [reduced] = useState(() => MQ("(prefers-reduced-motion: reduce)"));
  const [phase, setPhaseState] = useState<IntroPhase>("question");
  const [run, setRun] = useState(0); // bumped by "Play again"
  const [ready, setReady] = useState(replay); // the ink has lifted off the painting (a replay never has it)
  const [cta, setCta] = useState(false);
  const [started, setStarted] = useState(false);
  const [leaving, setLeaving] = useState(false);
  const [soundOn, setSoundOn] = useState(readSound);
  const [sound, setSound] = useState<Sound | null>(null);
  const [set, setSet] = useState(pickSet);
  const [result, setResult] = useState<RunResult | null>(null);
  const [lights, setLights] = useState<Lights | null>(null);
  const [say, setSay] = useState("");

  const root = useRef<HTMLDivElement>(null);
  const ctaBtn = useRef<HTMLButtonElement>(null);
  const ctx = useRef<AudioContext | null>(null);
  const form = useRef<Form>({ place: "", city: "", contact: "", consent: false });
  const final = useRef<RunResult | null>(null); // for pagehide, which can't read state
  const runId = useRef(newRunId());
  const posted = useRef(false);
  const touchY = useRef(0);
  const quick = replay || run > 0; // skip the question, start at the CTA

  const go = (p: IntroPhase) => (setPhaseState(p), onPhase(p));

  // ---- mount: lock scroll, warm the chunks, follow the viewport ---------------------
  useLayoutEffect(() => {
    const hero = document.getElementById("hero-img") as HTMLImageElement | null;
    if (hero) setImg(hero);
    else onDone(null); // no painting to play on: behave like a skip
    const [h, b] = [document.documentElement.style.overflow, document.body.style.overflow];
    document.documentElement.style.overflow = document.body.style.overflow = "hidden";
    return () => void ((document.documentElement.style.overflow = h), (document.body.style.overflow = b));
  }, []);

  useEffect(() => {
    loadGame();
    loadPanel();
    loadSound();
    getLights().then(setLights);
    const mq = matchMedia("(orientation: portrait)");
    const flip = () => setSet(pickSet());
    const hide = () => void (document.hidden ? ctx.current?.suspend() : ctx.current?.resume());
    const bye = () => post(true);
    mq.addEventListener("change", flip);
    document.addEventListener("visibilitychange", hide);
    addEventListener("pagehide", bye);
    return () => {
      mq.removeEventListener("change", flip);
      document.removeEventListener("visibilitychange", hide);
      removeEventListener("pagehide", bye);
      ctx.current?.close();
    };
  }, []);

  // ---- the question: ink lifts at 2 s, the CTA arrives at 2.6 s ---------------------
  useEffect(() => {
    if (!img) return;
    let off = false;
    const reveal = async () => {
      await whenLoaded(img, 4000);
      if (off) return;
      setReady(true);
      setTimeout(() => !off && setCta(true), quick ? 0 : 600);
    };
    const t = setTimeout(reveal, quick ? 0 : 2000);
    return () => ((off = true), clearTimeout(t));
  }, [run, img]);

  useEffect(() => void (cta && ctaBtn.current?.focus({ preventScroll: true })), [cta]);
  useEffect(() => void sound?.setMuted(!soundOn), [sound, soundOn]);

  // ---- sound: no AudioContext until a tap says yes -----------------------------------
  const ensureAudio = () => {
    if (ctx.current) return void ctx.current.resume();
    if (!window.AudioContext) return;
    const c = new AudioContext();
    c.resume();
    ctx.current = c;
    loadSound().then((m) => setSound(m.createSound(c)));
  };

  const toggleSound = () => {
    const on = !soundOn;
    setSoundOn(on);
    try {
      localStorage.setItem("gl.sound", on ? "1" : "0");
    } catch {}
    if (on && started) ensureAudio();
  };

  // ---- leaving: post once, remember, hand back to the deck --------------------------
  const post = (beacon = false) => {
    const r = final.current;
    if (!r || posted.current) return;
    posted.current = true;
    const { place, contact, consent } = form.current;
    const c = contact.trim();
    postLight(
      { runId: runId.current, ...r, mode: reduced ? "still" : "game", place, ...(consent && c ? { contact: c, consent } : {}) },
      beacon,
    );
  };

  const exit = (r: IntroResult) => {
    setLeaving(true);
    setTimeout(() => onDone(r), 400);
  };

  const skip = () => {
    if (leaving) return;
    if (!readMyLight()) saveMyLight({ at: new Date().toISOString(), lit: 0, place: "", skipped: true });
    exit(null);
  };

  const proceed = () => {
    const r = final.current;
    if (leaving || !r) return;
    post();
    const { place } = form.current;
    saveMyLight({ at: new Date().toISOString(), lit: r.lit, place });
    exit({ ...r, place });
  };

  const again = () => {
    post();
    final.current = null;
    posted.current = false;
    runId.current = newRunId();
    setResult(null);
    setStarted(false);
    setCta(false);
    setRun((n) => n + 1);
    go("question");
  };

  const start = () => {
    if (started) return;
    setStarted(true);
    go("playing");
    if (soundOn) ensureAudio();
    setSay("The lamps are going out. Tap a window to light it, and join the lamps together to hold back the fog.");
  };

  const onEnd = useCallback((r: RunResult) => {
    final.current = r;
    setResult(r);
    go("end");
  }, []);
  const onForm = useCallback((f: Form) => void (form.current = f), []);

  // ---- keyboard: Esc leaves, Tab stays inside ----------------------------------------
  useEffect(() => {
    const key = (e: KeyboardEvent) => {
      if (e.key === "Escape" && !document.querySelector("[data-share]")) return phase === "end" ? proceed() : skip();
      if (e.key !== "Tab" || !root.current) return;
      const items = [...root.current.querySelectorAll<HTMLElement>(FOCUSABLE)];
      const first = items[0], last = items[items.length - 1];
      if (!first || !root.current.contains(document.activeElement)) (e.preventDefault(), first?.focus());
      else if (e.shiftKey && document.activeElement === first) (e.preventDefault(), last.focus());
      else if (!e.shiftKey && document.activeElement === last) (e.preventDefault(), first.focus());
    };
    addEventListener("keydown", key);
    return () => removeEventListener("keydown", key);
  });

  if (!img) return null;
  const outsidePanel = (t: EventTarget) => !(t as Element).closest("[data-panel],[data-share]");

  return (
    <div
      ref={root}
      role="dialog"
      aria-modal="true"
      aria-labelledby="i-title"
      className={`i-root fixed inset-0 z-50 select-none overscroll-none transition-opacity duration-400 ${leaving ? "opacity-0" : ""}`}
      onPointerDown={(e) => cta && !started && outsidePanel(e.target) && !(e.target as Element).closest("button") && start()}
      onWheel={(e) => phase === "end" && e.deltaY > 10 && outsidePanel(e.target) && proceed()}
      onTouchStart={(e) => (touchY.current = e.touches[0].clientY)}
      onTouchMove={(e) => phase === "end" && touchY.current - e.touches[0].clientY > 50 && outsidePanel(e.target) && proceed()}
    >
      {phase !== "end" && (
        <div className="absolute top-[max(env(safe-area-inset-top),0.25rem)] right-2 z-30 flex items-center md:right-6">
          {started && (
            <button
              onClick={toggleSound}
              aria-pressed={soundOn}
              aria-label={soundOn ? "Sound on" : "Sound off"}
              className={`grid size-11 place-items-center rounded-full text-cream/70 hover:text-cream ${focus}`}
            >
              <svg viewBox="0 0 24 24" className="size-5" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                <path d="M4 9v6h4l5 4V5L8 9H4z" />
                {soundOn ? <path d="M16.5 8.5a5 5 0 0 1 0 7M19 6a8.5 8.5 0 0 1 0 12" /> : <path d="m17 9 5 6m0-6-5 6" />}
              </svg>
            </button>
          )}
          <button onClick={skip} className={`min-h-11 min-w-11 px-3 text-sm text-cream/55 transition hover:text-cream ${focus}`}>
            Skip →
          </button>
        </div>
      )}

      {phase !== "end" && (
        <Suspense fallback={null}>
          <Game
            key={run}
            img={img}
            set={set}
            sound={sound}
            reduced={reduced}
            playing={started}
            onLit={noop}
            onEnd={onEnd}
            onSay={setSay}
          />
        </Suspense>
      )}

      {/* ink over the painting until 2 s, then it lifts to show the night layer */}
      <div
        aria-hidden
        className={`pointer-events-none absolute inset-0 bg-ink transition-opacity ${ready ? "opacity-0" : ""}`}
        style={{ transitionDuration: reduced ? "200ms" : "1600ms" }}
      />

      <div className={`pointer-events-none absolute inset-x-0 top-[42%] px-6 text-center transition-all duration-400 ${started ? "-translate-y-[60%] opacity-0" : "-translate-y-1/2"}`}>
        <h2
          id="i-title"
          lang="ne"
          className={quick ? "sr-only" : "i-rise ne i-tight i-shadow text-4xl text-cream md:text-6xl"}
          style={{ animationDelay: "300ms" }}
        >
          पहाडमा के छ र?
        </h2>
        {!quick && (
          <p className="i-fade i-shadow font-display text-lg text-cream/60 italic md:text-2xl" style={{ animationDelay: "1500ms" }}>
            What's there in the hills anyway?
          </p>
        )}
      </div>

      {cta && !started && (
        <div className="i-fade absolute inset-x-0 top-[60%] flex flex-col items-center gap-2 px-6" style={{ ["--dur" as string]: "600ms" }}>
          <button
            ref={ctaBtn}
            onClick={start}
            className={`min-h-11 max-w-full rounded-full bg-lamp px-6 py-3 text-center text-ink transition hover:bg-cream ${focus}`}
          >
            <span lang="ne" className="ne">पहिलो बत्ती बाल्नुस्</span> · Light the first lamp
          </button>
          <button
            onClick={toggleSound}
            aria-pressed={soundOn}
            className={`min-h-11 px-4 text-xs text-cream/50 transition hover:text-cream ${focus}`}
          >
            Sound: {soundOn ? "on" : "off"}
          </button>
        </div>
      )}

      {phase === "end" && result && (
        <Suspense fallback={null}>
          <EndPanel result={result} lights={lights} img={img} set={set} leaving={leaving} onForm={onForm} onAgain={again} onContinue={proceed} />
        </Suspense>
      )}

      <p className="sr-only" aria-live="polite">
        {phase === "end" && result ? `${result.won ? "The fog lifted." : "The kuiro won this time. It always lifts."} You lit ${result.lit} lights.` : say}
      </p>
    </div>
  );
}

const noop = () => {};
