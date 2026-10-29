// The main canvas: night layer, lamp glows, threads, the toy-train line and the small things on it.
// Reads the engine, never changes it. Sprites and a few constants keep it allocation-free.

import { BLAZE, DARK, HUNTED, LIT, MAX, OUT, type Engine } from "./engine";
import type { Sprites } from "./fog";

const INK = "#0d1813";
const CREAM = "#f4e8d7";
const LAMP = "#e8b66b";
const BRASS = "#c9a227";
const CORE = "#fff4dc";
const DASH = [2, 6];
const SOLID: number[] = [];
const TAU = Math.PI * 2;

export type DrawOpts = { dpr: number; lite: boolean; debug: boolean };

const clamp = (v: number) => Math.min(1, Math.max(0, v));
const noise = (n: number) => {
  const x = Math.sin(n * 12.9898) * 43758.5453;
  return x - Math.floor(x);
};

export function drawMain(c: CanvasRenderingContext2D, e: Engine, S: Sprites, o: DrawOpts) {
  const { W, H, n, u, now, px, py, st, t0 } = e;
  c.setTransform(o.dpr, 0, 0, o.dpr, 0, 0);
  c.globalCompositeOperation = "source-over";
  c.globalAlpha = 1;
  c.clearRect(0, 0, W, H);
  const calm = e.still || o.lite;
  const lit = (i: number) => e.isLit(i);
  const ease = (i: number) => 1 - (1 - clamp((now - t0[i]) / 260)) ** 3; // 0 -> 1 in 260 ms

  // night: the painting's own windows read as dim under it, so lifting it reveals the hero
  c.globalAlpha = e.phone ? 0.62 : 0.7;
  c.fillStyle = INK;
  c.fillRect(0, 0, W, H);
  c.globalCompositeOperation = "destination-out";
  for (let i = 0; i < n; i++) {
    if (!lit(i)) continue;
    c.globalAlpha = ease(i);
    c.drawImage(S.hole, px[i] - 23 * u, py[i] - 23 * u, 46 * u, 46 * u);
  }

  // glows
  c.globalCompositeOperation = "lighter";
  c.strokeStyle = BRASS;
  c.lineWidth = 1;
  for (let i = 0; i < n; i++) {
    if (!e.ok[i]) continue;
    const x = px[i], y = py[i], s = st[i], el = now - t0[i];
    if (s === LIT || s === HUNTED) {
      let a = ease(i);
      if (!e.still) a *= 1 + 0.06 * Math.sin(now * 0.00188 + e.ph[i]); // breathes at 0.3 Hz
      const hunted = s === HUNTED || e.jit[i] > now;
      if (hunted) a *= 0.25 + 0.75 * noise(Math.floor(now / 83) + i); // 12 Hz jitter
      c.globalAlpha = 0.55 * a;
      c.drawImage(S.glow, x - 26 * u, y - 26 * u, 52 * u, 52 * u);
      if (hunted) {
        c.globalAlpha = 0.4 * a;
        c.drawImage(S.himal, x - 26 * u, y - 26 * u, 52 * u, 52 * u);
      }
      c.globalAlpha = a;
      c.fillStyle = CORE;
      c.beginPath();
      c.arc(x, y, 2 * u, 0, TAU);
      c.fill();
      if (e.rail[i]) {
        c.globalAlpha = 0.7 * a;
        c.beginPath();
        c.arc(x, y, 7 * u, 0, TAU);
        c.stroke();
      }
    } else if (s === OUT) {
      const k = 1 - el / 400; // the glow collapses, an ember lingers
      if (k > 0) {
        c.globalAlpha = 0.55 * k;
        c.drawImage(S.glow, x - 26 * u * k, y - 26 * u * k, 52 * u * k, 52 * u * k);
      }
      c.globalAlpha = clamp(1 - (el - 400) / 1000) * 0.9;
      c.fillStyle = BRASS;
      c.fillRect(x - 0.5, y - 0.5, 1, 1);
    } else if (s === BLAZE) {
      // the election lamp: blazes 600 ms, holds 1.4 s, fizzles 800 ms
      const a = el < 600 ? el / 600 : el < 2000 ? 1 : (1 - (el - 2000) / 800) * (0.6 + 0.4 * noise(Math.floor(now / 60)));
      c.globalAlpha = 0.9 * clamp(a);
      c.drawImage(S.brass, x - 78 * u, y - 78 * u, 156 * u, 156 * u);
      c.globalAlpha = clamp(a);
      c.fillStyle = CORE;
      c.fillRect(x - 2, y - 2, 4, 4);
    }
  }

  // threads: 1px, sagging 6% of their length, drawing A -> B over 300 ms
  const steps = calm ? 1 : 10;
  const fade = e.ended ? 1 - clamp((now - e.endAt) / 1600) : 1;
  c.globalAlpha = 0.35 * fade;
  c.strokeStyle = LAMP;
  c.beginPath();
  for (let k = 0; k < e.ne; k++) {
    let a = e.edges[2 * k], b = e.edges[2 * k + 1];
    const p = clamp((now - e.eb[a * MAX + b]) / 300);
    if (p <= 0) continue;
    if (t0[b] > t0[a]) {
      const t = a; // draw from the newer lamp
      a = b;
      b = t;
    }
    const ax = px[a], ay = py[a], bx = px[b], by = py[b];
    const sag = calm ? 0 : 0.12 * Math.hypot(bx - ax, by - ay);
    const cx = (ax + bx) / 2, cy = (ay + by) / 2 + sag;
    c.moveTo(ax, ay);
    for (let s = 1; s <= steps; s++) {
      const t = (p * s) / steps, m = 1 - t;
      c.lineTo(m * m * ax + 2 * m * t * cx + t * t * bx, m * m * ay + 2 * m * t * cy + t * t * by);
    }
  }
  c.stroke();

  // motes: headlights on the hairpins
  if (!calm && fade > 0) {
    c.globalAlpha = 0.8 * fade;
    c.fillStyle = CORE;
    for (let k = 0; k < e.ne; k++) {
      const a = e.edges[2 * k], b = e.edges[2 * k + 1];
      if (now - e.eb[a * MAX + b] < 300) continue;
      const t = ((now + k * 733) % 4000) / 4000, m = 1 - t;
      const cx = (px[a] + px[b]) / 2, cy = (py[a] + py[b]) / 2 + 0.12 * Math.hypot(px[b] - px[a], py[b] - py[a]);
      c.fillRect(m * m * px[a] + 2 * m * t * cx + t * t * px[b] - 1, m * m * py[a] + 2 * m * t * cy + t * t * py[b] - 1, 2, 2);
    }
  }

  // the toy-train line, pulsing while a gust is coming
  c.globalCompositeOperation = "source-over";
  if (e.bb.length) {
    c.globalAlpha = 0.18 + (e.warn ? 0.42 * (0.5 + 0.5 * Math.sin(now * 0.012)) : 0);
    c.strokeStyle = BRASS;
    c.setLineDash(DASH);
    c.beginPath();
    c.moveTo(e.bb[0][0], e.bb[0][1]);
    for (let k = 1; k < e.bb.length; k++) c.lineTo(e.bb[k][0], e.bb[k][1]);
    c.stroke();
    c.setLineDash(SOLID);
  }

  // dark windows, hint rings, the gust's target
  c.fillStyle = CREAM;
  for (let i = 0; i < n; i++) {
    if (!e.ok[i] || e.fogged[i] || st[i] !== DARK) continue;
    c.globalAlpha = 0.12;
    c.fillRect(px[i] - 1.5, py[i] - 1.5, 3, 3);
  }
  c.lineWidth = 1.5;
  if (!e.hintOff && e.started && !e.ended && now - e.startAt < 5600) {
    const p = (now % 1600) / 1600;
    c.strokeStyle = LAMP;
    c.globalAlpha = 0.4 * (1 - p);
    for (const i of e.hint) {
      if (i < 0 || st[i] !== DARK) continue;
      c.beginPath();
      c.arc(px[i], py[i], (10 + 8 * p) * u, 0, TAU);
      c.stroke();
    }
  }
  if (e.warn) {
    c.strokeStyle = "#7ea8c4";
    c.globalAlpha = 0.5 + 0.3 * Math.sin(now * 0.012);
    for (let i = 0; i < n; i++) {
      if (!e.tg[i]) continue;
      c.beginPath();
      c.arc(px[i], py[i], 13 * u, 0, TAU);
      c.stroke();
    }
  }

  // easter egg 2: the road sign
  const r = e.road;
  if (r.done && now - r.t < 2500) {
    c.globalAlpha = clamp((2500 - (now - r.t)) / 400);
    c.fillStyle = BRASS;
    c.beginPath();
    c.moveTo(r.x, r.y - 10);
    c.lineTo(r.x + 7, r.y + 4);
    c.lineTo(r.x - 7, r.y + 4);
    c.fill();
    c.fillStyle = INK;
    c.fillRect(r.x - 4, r.y, 8, 1.5);
    c.fillStyle = CREAM;
    c.font = "italic 11px Gelasio, serif";
    c.fillText("Road under repair", r.x + 12, r.y + 3);
  }

  // dawn on Kanchenjunga
  if (e.dawn > 0.01) {
    const rad = 0.28 * Math.max(W, H);
    c.globalCompositeOperation = "screen";
    c.globalAlpha = 0.22 * e.dawn;
    c.drawImage(S.glow, e.kanch[0] - rad, e.kanch[1] - rad, 2 * rad, 2 * rad);
  }

  if (o.debug) debug(c, e);
}

/** `?lamps`: every lamp with its index, the train line, Chowrasta and the far ridge. */
function debug(c: CanvasRenderingContext2D, e: Engine) {
  c.globalCompositeOperation = "source-over";
  c.globalAlpha = 1;
  c.font = "11px monospace";
  c.lineWidth = 1;
  for (let i = 0; i < e.n; i++) {
    c.strokeStyle = e.ok[i] ? (e.rail[i] ? "#7ea8c4" : "#ff5a5a") : "#555";
    c.beginPath();
    c.arc(e.px[i], e.py[i], 6, 0, TAU);
    c.stroke();
    c.fillStyle = "#ffd0d0";
    c.fillText(String(i), e.px[i] + 8, e.py[i] + 4);
  }
  c.strokeStyle = "#7ea8c4";
  c.beginPath();
  e.bb.forEach(([x, y], k) => (k ? c.lineTo(x, y) : c.moveTo(x, y)));
  c.stroke();
  c.fillStyle = "#fff";
  c.fillText("chowrasta", e.chow[0] + 8, e.chow[1]);
  c.fillText("kanchenjunga", e.kanch[0] + 8, e.kanch[1]);
  c.fillText("far ridge", e.far[0] + 8, e.far[1]);
  c.fillText(`F=${e.F.toFixed(2)} chowY=${e.chowY.toFixed(2)} W=${e.W} H=${e.H}`, 12, e.H - 40);
}
