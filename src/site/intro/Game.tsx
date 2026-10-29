// बत्ती बाल: the two canvases over the hero, the HUD, and the rAF loop that runs the engine.

import { useEffect, useRef, useState } from "react";
import { drawMain } from "./draw";
import { Engine, DURATION, type RunResult } from "./engine";
import { drawFog, makeSprites } from "./fog";
import { fitImage, type LampSet } from "./lamps";
import type { Sound } from "./sound";

export type GameProps = {
  img: HTMLImageElement;
  set: LampSet;
  sound: Sound | null;
  reduced: boolean;
  playing: boolean; // the CTA was tapped
  onLit(count: number): void;
  onEnd(r: RunResult): void;
  onSay(msg: string): void; // for the screen-reader live region
};

type Toast = { ne: string; en: string; top: boolean };
const MAX_PRESSES = 40;

export default function Game(p: GameProps) {
  const wrap = useRef<HTMLDivElement>(null);
  const main = useRef<HTMLCanvasElement>(null);
  const fog = useRef<HTMLCanvasElement>(null);
  const bar = useRef<HTMLDivElement>(null);
  const api = useRef<{
    start(): void;
    relayout(): void;
    press(): void;
    finish(): void;
    tap(x: number, y: number): void;
    setSound(s: Sound | null): void;
  }>(null);
  const live = useRef(p); // callbacks and props, always current inside the long-lived effect
  live.current = p;

  const [count, setCount] = useState(0);
  const [buffering, setBuffering] = useState(false);
  const [toast, setToast] = useState<Toast | null>(null);
  const [presses, setPresses] = useState(0);

  useEffect(() => {
    const { img, reduced } = live.current;
    const mc = main.current!.getContext("2d")!;
    const fc = fog.current!.getContext("2d")!;
    const S = makeSprites();
    const debug = location.search.includes("lamps");
    let dpr = 1, fogScale = 0.5, lite = false;
    let raf = 0, last = 0, frames = 0, acc = 0, barK = -1, faded = false, toastTimer = 0;

    const e = new Engine({
      lit: (n) => (setCount(n), live.current.onLit(n)),
      end: (r) => live.current.onEnd(r),
      say: (m) => live.current.onSay(m),
      buffering: setBuffering,
      toast(ne, en, ms, top = false) {
        clearTimeout(toastTimer);
        setToast({ ne, en, top });
        toastTimer = window.setTimeout(() => setToast(null), ms);
      },
    });
    e.sound = live.current.sound;
    if (debug) (window as unknown as { engine: Engine }).engine = e; // `?lamps`: poke it from the console

    const render = () => {
      drawMain(mc, e, S, { dpr, lite, debug });
      drawFog(fc, e, S, fogScale);
    };

    const size = () => {
      const { width: W, height: H } = main.current!.getBoundingClientRect();
      dpr = Math.min(devicePixelRatio || 1, 1.5);
      main.current!.width = Math.round(W * dpr);
      main.current!.height = Math.round(H * dpr);
      fog.current!.width = Math.round(W * fogScale);
      fog.current!.height = Math.round(H * fogScale);
      return [W, H] as const;
    };
    const relayout = () => {
      if (!main.current) return; // a resize can land just after unmount
      const [W, H] = size();
      if (!img.naturalWidth) return; // layout again on load
      e.layout(live.current.set, fitImage(img), W, H);
      if (!raf) render();
    };

    // fade everything out when the run ends: the painting underneath is then exactly the hero
    const fadeOut = (ms: number) => {
      faded = true;
      wrap.current!.style.transition = `opacity ${ms}ms ease`;
      wrap.current!.style.opacity = "0";
    };

    const frame = (ts: number) => {
      const dt = Math.min(100, ts - last);
      last = ts;
      e.step(dt);
      render();
      if (e.ended && !faded) fadeOut(e.endMs);
      const k = Math.round(e.T * 20);
      if (k !== barK && bar.current) {
        barK = k;
        bar.current.style.transform = `scaleX(${Math.max(0, 1 - e.T / DURATION)})`;
        if (e.T >= DURATION - 5) bar.current.style.backgroundColor = "var(--color-brass)";
      }
      // a slow phone degrades once: no motes, straight threads, a coarser fog
      acc += dt;
      if (++frames === 120 || acc > 2000) {
        if (!lite && acc / frames > 24) (lite = true), (fogScale = 0.33), relayout();
        acc = frames = 0;
      }
      raf = e.over ? 0 : requestAnimationFrame(frame);
    };
    const kick = () => {
      if (raf || document.hidden || !e.started || e.over) return;
      last = performance.now();
      raf = requestAnimationFrame(frame);
    };

    api.current = {
      relayout,
      start() {
        if (e.started) return;
        e.start(reduced);
        if (reduced) render();
        else kick();
      },
      press() {
        if (!e.started || e.ended) return;
        if (reduced) (e.lightInOrder(), render());
        else e.lightNext();
      },
      tap: (x, y) => e.tap(x, y),
      setSound: (s) => void (e.sound = s),
      finish() {
        if (e.ended) return;
        e.finishStill();
        fadeOut(300);
        setTimeout(() => live.current.onEnd(e.result(true)), 300);
      },
    };

    const onVisible = () => {
      if (document.hidden) (cancelAnimationFrame(raf), (raf = 0));
      else kick();
    };
    const onKey = (ev: KeyboardEvent) => {
      if ((ev.key !== " " && ev.key !== "Enter") || ev.repeat) return;
      if ((ev.target as Element)?.closest?.("button,a,input,textarea,select")) return;
      ev.preventDefault();
      api.current?.press();
    };
    const ro = new ResizeObserver(relayout);
    ro.observe(main.current!);
    img.addEventListener("load", relayout);
    document.addEventListener("visibilitychange", onVisible);
    addEventListener("keydown", onKey);
    relayout();

    return () => {
      cancelAnimationFrame(raf);
      clearTimeout(toastTimer);
      ro.disconnect();
      img.removeEventListener("load", relayout);
      document.removeEventListener("visibilitychange", onVisible);
      removeEventListener("keydown", onKey);
      api.current = null;
    };
  }, []);

  useEffect(() => void api.current?.relayout(), [p.set]);
  useEffect(() => {
    if (p.playing) api.current?.start();
  }, [p.playing]);
  // the engine holds the sound itself so the loop never reads React state
  useEffect(() => void api.current?.setSound(p.sound), [p.sound]);

  return (
    <div ref={wrap} className="absolute inset-0">
      <canvas
        ref={main}
        aria-hidden
        className="absolute inset-0 h-full w-full touch-none"
        onPointerDown={(ev) => api.current?.tap(ev.clientX, ev.clientY)}
      />
      <canvas ref={fog} aria-hidden className="pointer-events-none absolute inset-0 h-full w-full" />

      {p.playing && (
        <>
          {!p.reduced && (
            <div className="pointer-events-none absolute inset-x-0 top-0 h-0.5" aria-hidden>
              <div ref={bar} className="h-full origin-left bg-lamp" />
            </div>
          )}
          <p
            aria-hidden
            className="pointer-events-none absolute top-[calc(env(safe-area-inset-top)+0.9rem)] left-4 font-display text-lg text-cream/80 tabular-nums md:left-8"
          >
            {count} <span className="ne">बत्ती</span>
          </p>
        </>
      )}

      {buffering && (
        <p aria-hidden className="pointer-events-none absolute inset-x-0 top-[calc(env(safe-area-inset-top)+3.5rem)] text-center text-sm text-cream/80">
          buffering<span>.</span>
          <span className="i-dot2">.</span>
          <span className="i-dot3">.</span>
        </p>
      )}

      {toast && (
        <p
          role="status"
          className={`i-toast pointer-events-none absolute left-1/2 z-10 w-max max-w-[calc(100%-2rem)] -translate-x-1/2 rounded-3xl border border-cream/10 bg-ink/90 px-6 py-3 text-center text-sm backdrop-blur-md ${
            toast.top ? "top-[calc(env(safe-area-inset-top)+5.5rem)]" : "bottom-6"
          }`}
        >
          <span lang="ne" className="ne block text-cream">
            {toast.ne}
          </span>
          <span className="block text-cream/60">{toast.en}</span>
        </p>
      )}

      {p.reduced && p.playing && (
        <div className="absolute inset-x-0 bottom-8 flex justify-center gap-3 px-4">
          <button
            disabled={presses >= MAX_PRESSES}
            onClick={() => (setPresses((n) => n + 1), api.current?.press())}
            className="min-h-11 rounded-full bg-lamp px-6 py-3 text-ink focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-lamp disabled:opacity-50"
          >
            <span lang="ne" className="ne">बत्ती बाल्नुस्</span> · Light a lamp
          </button>
          <button
            onClick={() => api.current?.finish()}
            className="min-h-11 rounded-full border border-cream/30 px-6 py-3 text-cream focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-lamp"
          >
            Done
          </button>
        </div>
      )}
    </div>
  );
}
