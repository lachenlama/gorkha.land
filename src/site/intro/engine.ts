// The rules of बत्ती बाल (ux-spec §3): lamps, groups, fog, hunting, gusts, the end.
// No DOM and no drawing. Everything lives in typed arrays and `step` allocates nothing,
// so it can run inside requestAnimationFrame on a cheap phone.

import { imageToScreen, PHONE, type Fit, type LampSet } from "./lamps";
import type { Sound } from "./sound";

export const MAX = 48;
export const DARK = 0;
export const LIT = 1;
export const HUNTED = 2;
export const OUT = 3;
export const BLAZE = 4; // the election lamp, burning
export const SPENT = 5; // ...and finished: it can't be relit

const START_LAG = 600; // CTA tap -> timer starts
const LAMP0_AT = 200; // CTA tap -> the phone lamp lights
export const DURATION = 60;
const DAWN_AT = 55;
const GUSTS = [24, 42];
const END_MS = 2400;
const PHASES = [
  { to: 15, mult: 0.7, hunt: 3, tend: 1.6 },
  { to: 30, mult: 0.9, hunt: 2.2, tend: 1.4 },
  { to: 45, mult: 1.1, hunt: 1.6, tend: 1.2 },
  { to: 99, mult: 1.3, hunt: 1.2, tend: 1.0 },
];

export type RunResult = { lit: number; chain: number; won: boolean };
export type Events = {
  lit(count: number): void;
  end(r: RunResult): void;
  say(msg: string): void;
  toast(ne: string, en: string, ms: number, top?: boolean): void;
  buffering(on: boolean): void;
};

const clamp = (v: number, a: number, b: number) => Math.min(b, Math.max(a, v));
const vibrate = (p: number | number[]) => navigator.vibrate?.(p);

export class Engine {
  // layout (screen px)
  n = 0;
  W = 1;
  H = 1;
  u = 1; // size scale: phone lamps are 0.8x
  R = 100; // connection radius
  phone = false;
  px = new Float32Array(MAX);
  py = new Float32Array(MAX);
  ok = new Uint8Array(MAX); // spawned on this screen
  nn = new Float32Array(MAX); // distance to the nearest other lamp
  bb: [number, number][] = [];
  chow: [number, number] = [0, 0];
  kanch: [number, number] = [0, 0];
  far: [number, number] = [0, 0];
  chowY = 0.2;
  hint = [-1, -1, -1];

  // clock
  now = 0;
  startAt = -1;
  T = -1; // seconds on the 60 s timer
  started = false;
  ended = false;
  endAt = 0;
  endMs = END_MS;
  won = false;
  still = false; // reduced motion: no fog, no clock

  // lamps
  st = new Uint8Array(MAX);
  t0 = new Float32Array(MAX); // when the state last changed
  ph = new Float32Array(MAX).map(() => Math.random() * 6.28); // breathing phase
  hv = new Float32Array(MAX); // tendril progress 0..1
  tx = new Float32Array(MAX); // tendril start
  ty = new Float32Array(MAX);
  hdur = new Float32Array(MAX);
  dieAt = new Float32Array(MAX);
  kill = new Uint8Array(MAX); // doomed by a gust, can't be saved
  tg = new Uint8Array(MAX); // in the gust's target group
  jit = new Float32Array(MAX); // flicker until
  fogged = new Uint8Array(MAX);
  clr = new Float32Array(MAX); // clearing radius, eased
  rail = new Uint8Array(MAX); // lamps on the toy-train line
  eIdx = -1; // this run's election lamp

  // groups, threads
  par = new Int8Array(MAX);
  grp = new Int8Array(MAX);
  gs = new Uint8Array(MAX);
  gRail = new Uint8Array(MAX);
  count = 0;
  net = 0; // lit lamps in groups of 3+
  chain = 0;
  edges = new Int8Array(MAX * 6);
  ne = 0;
  eb = new Float32Array(MAX * MAX); // birth time of each thread
  private mark = new Uint8Array(MAX * MAX);
  private sizes = new Uint8Array(MAX); // scratch
  private seen = new Uint8Array(MAX); // scratch
  private cl = new Int8Array(MAX); // lamps that cut clearings
  ncl = 0;

  // fog
  F = 1; // screen-height fraction of the solid front
  nextHunt = 0;
  fogA = 1;
  dawn = 0;

  // gusts
  gi = 0;
  warn = false;
  sweepAt = -1e9;

  // easter egg 2
  road = { done: false, x: 0, y: 0, t: 0 };
  hintOff = false;

  private arp = 5;
  over = false; // the end sequence has finished
  private lamp0 = false;
  private eSeed = Math.random();
  private lastLit = 0;
  private lastCount = -1;
  sound: Sound | null = null;

  constructor(private ev: Events) {}

  // ---- layout ------------------------------------------------------------------

  layout(set: LampSet, fit: Fit, W: number, H: number) {
    this.W = W;
    this.H = H;
    this.phone = set === PHONE;
    this.u = this.phone ? 0.8 : 1;
    this.R = clamp(0.2 * Math.min(W, H), 80, 150);
    this.n = set.lamps.length;
    set.lamps.forEach((l, i) => {
      [this.px[i], this.py[i]] = imageToScreen(fit, l.x, l.y);
      this.rail[i] = +!!l.rail;
      const x = this.px[i], y = this.py[i];
      this.ok[i] = +(i === 0 || (x >= 16 && x <= W - 16 && y >= 72 && y <= H - 16));
    });
    for (let i = 0; i < this.n; i++) {
      let d = 1e9;
      for (let j = 0; j < this.n; j++) if (j !== i && this.ok[j]) d = Math.min(d, Math.hypot(this.px[i] - this.px[j], this.py[i] - this.py[j]));
      this.nn[i] = d;
    }
    this.bb = set.backbone.map((p) => imageToScreen(fit, p[0], p[1]));
    this.chow = imageToScreen(fit, ...set.chowrasta);
    this.kanch = imageToScreen(fit, ...set.kanchenjunga);
    this.far = imageToScreen(fit, ...set.far);
    this.chowY = clamp(this.chow[1] / H, 0.05, 0.9);

    // The three dark lamps nearest the phone get the first hint rings.
    const near = [...Array(this.n).keys()]
      .filter((i) => i && this.ok[i])
      .sort((a, b) => this.d2(a, 0) - this.d2(b, 0));
    this.hint = [near[0] ?? -1, near[1] ?? -1, near[2] ?? -1];

    if (this.eIdx < 0 || !set.lamps[this.eIdx]?.election) {
      const c = set.lamps.flatMap((l, i) => (l.election && this.ok[i] ? [i] : []));
      this.eIdx = c.length ? c[Math.floor(this.eSeed * c.length)] : -1;
    }
    this.recompute(true);
  }

  private d2(a: number, b: number) {
    const dx = this.px[a] - this.px[b], dy = this.py[a] - this.py[b];
    return dx * dx + dy * dy;
  }

  // ---- control -----------------------------------------------------------------

  /** The CTA was tapped. The phone lights at +200 ms, the timer starts at +600 ms. */
  start(still = false) {
    this.started = true;
    this.still = still;
    this.startAt = this.now;
    if (still) this.lightLamp0();
  }

  /** Reduced motion: light the next lamp in index order. Returns false when none is left. */
  lightInOrder() {
    for (let i = 1; i < this.n; i++) {
      if (!this.ok[i] || this.st[i] !== DARK || i === this.eIdx) continue;
      this.light(i);
      return true;
    }
    return false;
  }

  /** Keyboard: the nearest dark lamp to the last one lit, preferring one that joins a group. */
  lightNext() {
    let best = -1, bd = 1e12, joins = false;
    for (let i = 1; i < this.n; i++) {
      if (!this.ok[i] || this.st[i] !== DARK || this.fogged[i] || i === this.eIdx) continue;
      let j = false;
      for (let k = 0; k < this.n && !j; k++) j = this.isLit(k) && this.d2(i, k) < this.R * this.R;
      const d = this.d2(i, this.lastLit);
      if ((j && !joins) || (j === joins && d < bd)) (best = i), (bd = d), (joins = j);
    }
    if (best >= 0) this.light(best);
  }

  tap(x: number, y: number) {
    if (!this.started || this.ended || this.still) return;
    this.hintOff = true;
    let best = -1, bd = 1e9;
    for (let i = 0; i < this.n; i++) {
      if (!this.ok[i] || this.st[i] !== DARK || this.fogged[i]) continue;
      const d = Math.hypot(x - this.px[i], y - this.py[i]);
      if (d < Math.min(30, this.nn[i] / 2) && d < bd) (best = i), (bd = d);
    }
    if (best >= 0) return best === this.eIdx ? this.blaze(best) : this.light(best);
    if (!this.road.done && this.onBackbone(x, y)) {
      this.road = { done: true, x, y, t: this.now };
      this.ev.toast("बाटो बन्दै छ।", "Road under repair. Since forever.", 2500);
    }
  }

  /** Easter egg 2: a tap on the train line, well clear of any lamp. */
  private onBackbone(x: number, y: number) {
    for (let i = 0; i < this.n; i++) if (this.ok[i] && Math.hypot(x - this.px[i], y - this.py[i]) < 30) return false;
    for (let k = 1; k < this.bb.length; k++) {
      const [ax, ay] = this.bb[k - 1], [bx, by] = this.bb[k];
      const l2 = (bx - ax) ** 2 + (by - ay) ** 2 || 1;
      const t = clamp(((x - ax) * (bx - ax) + (y - ay) * (by - ay)) / l2, 0, 1);
      if (Math.hypot(x - (ax + t * (bx - ax)), y - (ay + t * (by - ay))) < 16) return true;
    }
    return false;
  }

  finishStill() {
    this.endGame(true, 300);
  }

  // ---- lamps -------------------------------------------------------------------

  isLit(i: number) {
    return !!this.ok[i] && (this.st[i] === LIT || this.st[i] === HUNTED);
  }

  private lightLamp0() {
    this.lamp0 = true;
    this.light(0);
  }

  private light(i: number) {
    this.st[i] = LIT;
    this.t0[i] = this.still ? -1e6 : this.now;
    this.hintOff = true;
    // For the whistle: which groups of 2+ does this lamp join, and does it reach the rail?
    let merged = 0, hadRail = false;
    this.seen.fill(0);
    for (let j = 0; j < this.n; j++) {
      if (!this.isLit(j) || this.d2(i, j) >= this.R * this.R) continue;
      const g = this.grp[j];
      if (!this.seen[g] && this.gs[j] >= 2) merged++;
      this.seen[g] = 1;
      hadRail ||= !!this.gRail[g];
    }
    this.recompute(this.still);
    this.lastLit = i;
    this.sound?.chime(this.gs[i] - 1);
    if (i && (merged >= 2 || this.rail[i] || (this.gRail[this.grp[i]] && !hadRail))) {
      this.sound?.whistle();
      vibrate(12);
    } else vibrate(8);
  }

  private blaze(i: number) {
    this.st[i] = BLAZE;
    this.t0[i] = this.now;
    this.ev.toast("यो चुनावको बत्ती थियो। चुनाव आउँदा मात्र बल्छ।", "That was the election lamp. It only lights up in election season.", 3000);
  }

  private snuff(i: number) {
    if (i === 0) return;
    this.st[i] = OUT;
    this.t0[i] = this.now;
    this.kill[i] = 0;
    this.hv[i] = 0;
    this.sound?.wind(500);
    this.recompute(false);
  }

  private startHunt(i: number, ms: number) {
    this.st[i] = HUNTED;
    this.t0[i] = this.now;
    this.hdur[i] = ms;
    this.dieAt[i] = this.now + ms;
    this.tx[i] = clamp(this.px[i] + (i % 2 ? 1 : -1) * (50 + ((i * 37) % 90)), 0, this.W);
    this.ty[i] = this.F * this.H;
  }

  // ---- groups and threads ------------------------------------------------------

  private find(i: number) {
    while (this.par[i] !== i) i = this.par[i] = this.par[this.par[i]];
    return i;
  }

  private union(a: number, b: number) {
    this.par[this.find(a)] = this.find(b);
  }

  /** Lit lamps within R join up, every lit rail lamp joins the backbone, and each lamp gets threads to its 3 nearest. */
  recompute(instant: boolean) {
    const { n, sizes } = this;
    const r2 = this.R * this.R;
    for (let i = 0; i < n; i++) this.par[i] = i;
    let rail0 = -1;
    for (let i = 0; i < n; i++) {
      if (!this.isLit(i)) continue;
      for (let j = i + 1; j < n; j++) if (this.isLit(j) && this.d2(i, j) < r2) this.union(i, j);
      if (this.rail[i]) rail0 < 0 ? (rail0 = i) : this.union(i, rail0);
    }
    sizes.fill(0);
    this.gRail.fill(0);
    for (let i = 0; i < n; i++) {
      if (!this.isLit(i)) continue;
      const g = this.find(i);
      sizes[g]++;
      if (this.rail[i]) this.gRail[g] = 1;
    }
    this.count = this.net = this.chain = 0;
    for (let i = 0; i < n; i++) {
      if (!this.isLit(i)) {
        this.gs[i] = 0;
        continue;
      }
      this.grp[i] = this.find(i);
      this.gs[i] = sizes[this.grp[i]];
      this.count++;
      if (this.gs[i] >= 3) this.net++;
      this.chain = Math.max(this.chain, this.gs[i]);
    }

    // threads: each lit lamp to its 3 nearest lit neighbours within R
    this.mark.fill(0);
    for (let i = 0; i < n; i++) {
      if (!this.isLit(i)) continue;
      let a = -1, b = -1, c = -1, da = r2, db = r2, dc = r2;
      for (let j = 0; j < n; j++) {
        if (j === i || !this.isLit(j)) continue;
        const d = this.d2(i, j);
        if (d >= dc) continue;
        if (d < da) (c = b), (dc = db), (b = a), (db = da), (a = j), (da = d);
        else if (d < db) (c = b), (dc = db), (b = j), (db = d);
        else (c = j), (dc = d);
      }
      if (a >= 0) this.mark[Math.min(i, a) * MAX + Math.max(i, a)] = 1;
      if (b >= 0) this.mark[Math.min(i, b) * MAX + Math.max(i, b)] = 1;
      if (c >= 0) this.mark[Math.min(i, c) * MAX + Math.max(i, c)] = 1;
    }
    this.ne = 0;
    for (let i = 0; i < n; i++)
      for (let j = i + 1; j < n; j++) {
        const k = i * MAX + j;
        if (!this.mark[k]) {
          this.eb[k] = 0;
          continue;
        }
        if (!this.eb[k]) this.eb[k] = instant ? -1e6 : this.now || 1;
        this.edges[this.ne * 2] = i;
        this.edges[this.ne * 2 + 1] = j;
        this.ne++;
      }
    if (this.count !== this.lastCount) this.ev.lit((this.lastCount = this.count));
  }

  result(won: boolean): RunResult {
    return { lit: this.count, chain: this.chain, won };
  }

  // ---- the clock ---------------------------------------------------------------

  /** Where the fog's solid front sits at screen x. */
  frontY(x: number) {
    const { W, H, now } = this;
    const w = Math.sin((x / (0.6 * W)) * 6.283 + now * 0.0007) + Math.sin((x / (0.27 * W)) * 6.283 - now * 0.0011);
    return this.F * H + 0.0125 * H * w;
  }

  private inClearing(i: number) {
    for (let k = 0; k < this.ncl; k++) {
      const j = this.cl[k];
      if (this.d2(i, j) < this.radius(j) ** 2) return true;
    }
    return false;
  }

  private radius = (j: number) => Math.min(80, 36 + 4 * this.gs[j]);

  step(dt: number) {
    this.now += dt;
    if (!this.started) return;
    const now = this.now;
    const el = now - this.startAt;
    this.T = (el - START_LAG) / 1000;
    if (!this.lamp0 && el >= LAMP0_AT) this.lightLamp0();
    if (this.ended) return this.stepEnd(dt);

    // clearings: every lamp in a group of 3+ cuts a hole in the fog
    this.ncl = 0;
    for (let i = 0; i < this.n; i++) {
      const target = this.isLit(i) && this.gs[i] >= 3 ? this.radius(i) : 0;
      if (target) this.cl[this.ncl++] = i;
      this.clr[i] += (target - this.clr[i]) * Math.min(1, dt * 0.008);
    }
    for (let i = 0; i < this.n; i++) this.fogged[i] = +(this.ok[i] === 1 && this.py[i] > this.frontY(this.px[i]) && !this.inClearing(i));
    if (this.T < 0) return;

    const T = this.T;
    let k = 0;
    while (T >= PHASES[k].to) k++;
    const ph = PHASES[k];
    const base = (1 - this.chowY) / 50;
    // fog: rises; in the last 5 s it falls back at 5x
    if (T >= DAWN_AT) this.F = Math.min(1, this.F + base * 5 * (dt / 1000));
    else this.F -= base * ph.mult * Math.max(0.25, 1 - 0.03 * this.net) * (dt / 1000);
    this.dawn += ((T >= DAWN_AT ? 1 : 0) - this.dawn) * Math.min(1, dt / 900);
    if (this.F <= this.chowY) return this.endGame(false);
    if (T >= DURATION) return this.endGame(true);

    // lamps in the fog, hunted lamps, embers
    for (let i = 0; i < this.n; i++) {
      const s = this.st[i];
      if (s === LIT && i && this.fogged[i] && this.gs[i] < 3) this.startHunt(i, 1200);
      else if (s === HUNTED) {
        if (this.kill[i]) now >= this.dieAt[i] && this.snuff(i);
        else if (this.gs[i] >= 3) this.st[i] = LIT; // joined up in time: the tendril retreats
        else {
          this.hv[i] = Math.min(1, (now - this.t0[i]) / this.hdur[i]);
          if (this.hv[i] >= 1) this.snuff(i);
        }
      } else if (s === OUT && now - this.t0[i] > 1400) this.st[i] = DARK;
      else if (s === BLAZE && now - this.t0[i] > 2800) this.st[i] = SPENT;
      if (this.st[i] !== HUNTED && this.hv[i] > 0) this.hv[i] = Math.max(0, this.hv[i] - dt / 400);
    }

    // the fog hunts the loneliest lamp
    if (T >= 6 && T < DAWN_AT && now >= this.nextHunt) {
      this.nextHunt = now + ph.hunt * 1000;
      let pick = -1, size = 3;
      for (let i = 1; i < this.n; i++) {
        if (this.st[i] !== LIT) continue;
        if (this.gs[i] < size || (this.gs[i] === size && pick >= 0 && this.py[i] > this.py[pick])) (pick = i), (size = this.gs[i]);
      }
      if (pick >= 0 && size <= 2) this.startHunt(pick, ph.tend * 1000);
    }

    this.gust(T);
  }

  /** "buffering…": a gust takes the biggest cluster that isn't tied to the toy-train line. */
  private gust(T: number) {
    const g = GUSTS[this.gi];
    if (g === undefined) return;
    if (!this.warn && T >= g - 2) {
      let root = -1, size = 1;
      for (let i = 0; i < this.n; i++) if (this.isLit(i) && !this.gRail[this.grp[i]] && this.gs[i] > size) (root = this.grp[i]), (size = this.gs[i]);
      if (root < 0) return void this.gi++; // nothing to take: the gust passes
      for (let i = 0; i < this.n; i++) this.tg[i] = +(this.isLit(i) && this.grp[i] === root);
      this.warn = true;
      this.ev.buffering(true);
      this.ev.say("The wind is coming. Join the train line.");
      if (this.gi === 0) this.ev.toast("ट्रेनको लाइनसँग जोड्नुस्, हावाले निभाउँदैन।", "Join the train line. The wind can't touch it.", 3500, true);
    } else if (this.warn && T >= g) {
      this.warn = false;
      this.gi++;
      this.ev.buffering(false);
      const saved = this.tg.some((f, i) => f && this.isLit(i) && this.gRail[this.grp[i]]);
      if (saved) {
        this.sound?.whistle();
        for (let i = 0; i < this.n; i++) if (this.tg[i]) this.jit[i] = this.now + 800;
      } else {
        this.sweepAt = this.now;
        this.sound?.wind(1600);
        vibrate([30, 40, 30]);
        for (let i = 1; i < this.n; i++) {
          if (!this.tg[i] || !this.isLit(i)) continue;
          this.st[i] = HUNTED;
          this.kill[i] = 1;
          this.dieAt[i] = this.now + 900 * (this.px[i] / this.W);
        }
      }
      this.tg.fill(0);
    }
  }

  // ---- the end -----------------------------------------------------------------

  private endGame(won: boolean, ms = END_MS) {
    if (this.ended) return;
    this.ended = true;
    this.won = won;
    this.endAt = this.now;
    this.endMs = ms;
    this.arp = ms === END_MS ? 0 : 5;
    this.warn = false;
    this.ev.buffering(false);
    this.ev.say(won ? "The fog lifted." : "The fog won this time. It always lifts.");
  }

  private stepEnd(dt: number) {
    const el = this.now - this.endAt;
    while (this.arp < 5 && el >= this.arp * 140) this.sound?.chime(this.arp++); // five pentatonic notes
    this.dawn += (1 - this.dawn) * Math.min(1, dt / 600);
    if (el >= this.endMs && !this.over) {
      this.over = true;
      this.ev.end(this.result(this.won));
    }
  }

  /** 0 while playing, 0..1 over the end sequence. */
  get endP() {
    return this.ended ? clamp((this.now - this.endAt) / this.endMs, 0, 1) : 0;
  }
}
