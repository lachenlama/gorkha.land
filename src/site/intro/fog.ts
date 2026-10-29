// The fog layer, drawn on a half-resolution canvas that CSS stretches (the upscale is the blur),
// and the pre-rendered sprites both layers use, so nothing is allocated per frame.

import type { Engine } from "./engine";

export type Sprites = Record<"hole" | "glow" | "brass" | "himal" | "puff" | "feather" | "band" | "noise", HTMLCanvasElement>;

const FOG = "197,207,208"; // #c5cfd0: cream mixed 35% with himal
const BODY = `rgba(${FOG},0.82)`;

function sprite(w: number, h: number, paint: (c: CanvasRenderingContext2D) => void) {
  const el = document.createElement("canvas");
  el.width = w;
  el.height = h;
  paint(el.getContext("2d")!);
  return el;
}

function radial(size: number, rgb: string, stops: [number, number][]) {
  return sprite(size, size, (c) => {
    const g = c.createRadialGradient(size / 2, size / 2, 0, size / 2, size / 2, size / 2);
    for (const [at, a] of stops) g.addColorStop(at, `rgba(${rgb},${a})`);
    c.fillStyle = g;
    c.fillRect(0, 0, size, size);
  });
}

export function makeSprites(): Sprites {
  const noise = sprite(512, 256, (c) => {
    // Soft blobs, repeated at the edges so the texture tiles without a seam.
    for (let k = 0; k < 46; k++) {
      const x = Math.random() * 512, y = Math.random() * 256, r = 28 + Math.random() * 56;
      const rgb = k % 3 ? "244,232,215" : "126,148,156";
      const g = c.createRadialGradient(0, 0, 0, 0, 0, r);
      g.addColorStop(0, `rgba(${rgb},0.55)`);
      g.addColorStop(1, `rgba(${rgb},0)`);
      c.fillStyle = g;
      for (const dx of [-512, 0, 512])
        for (const dy of [-256, 0, 256]) {
          c.setTransform(1, 0, 0, 1, x + dx, y + dy);
          c.fillRect(-r, -r, 2 * r, 2 * r);
        }
    }
  });
  return {
    hole: radial(64, "255,255,255", [[0, 1], [0.55, 0.85], [1, 0]]),
    glow: radial(64, "232,182,107", [[0, 0.95], [0.3, 0.45], [1, 0]]),
    brass: radial(64, "201,162,39", [[0, 0.95], [0.3, 0.45], [1, 0]]),
    himal: radial(64, "126,168,196", [[0, 0.95], [0.3, 0.45], [1, 0]]),
    puff: radial(64, FOG, [[0, 1], [0.5, 0.6], [1, 0]]),
    feather: sprite(4, 64, (c) => {
      const g = c.createLinearGradient(0, 0, 0, 64);
      g.addColorStop(0, `rgba(${FOG},0)`);
      g.addColorStop(1, BODY);
      c.fillStyle = g;
      c.fillRect(0, 0, 4, 64);
    }),
    band: sprite(64, 4, (c) => {
      const g = c.createLinearGradient(0, 0, 64, 0);
      g.addColorStop(0, `rgba(${FOG},0)`);
      g.addColorStop(0.7, `rgba(${FOG},0.8)`);
      g.addColorStop(1, `rgba(${FOG},0)`);
      c.fillStyle = g;
      c.fillRect(0, 0, 64, 4);
    }),
    noise,
  };
}

/** One drifting layer of texture, kept only where the fog body already is. */
function layer(c: CanvasRenderingContext2D, S: Sprites, e: Engine, scale: number, speed: number, alpha: number) {
  const tw = 512 * scale, th = 256 * scale;
  const x0 = ((e.now * speed) / 1000) % tw - tw;
  c.globalAlpha = alpha;
  for (let x = x0; x < e.W; x += tw) for (let y = 0; y < e.H; y += th) c.drawImage(S.noise, x, y, tw, th);
}

export function drawFog(c: CanvasRenderingContext2D, e: Engine, S: Sprites, scale: number) {
  const { W, H, now } = e;
  c.setTransform(scale, 0, 0, scale, 0, 0);
  c.globalCompositeOperation = "source-over";
  c.globalAlpha = 1;
  c.clearRect(0, 0, W, H);
  if (!e.started || e.still) return;

  // body: solid below the front, feathered over 14% of the height above it
  const snap = (v: number) => Math.round(v * scale) / scale; // whole device pixels, or the seams show
  const feather = snap(0.14 * H);
  c.fillStyle = BODY;
  const step = Math.max(1, Math.round(4 * scale)) / scale; // front columns: whole device pixels wide
  for (let x = 0; x < W; x += step) {
    const y = snap(e.frontY(x + step / 2));
    c.drawImage(S.feather, 0, 0, 4, 64, x, y - feather, step, feather);
    if (y < H) c.fillRect(x, y, step, H - y);
  }

  // two textures drifting at +12 and -7 px/s
  c.globalCompositeOperation = "source-atop";
  layer(c, S, e, 1, 12, 0.5);
  layer(c, S, e, 1.6, -7, 0.4);

  // clearings cut by connected groups
  c.globalCompositeOperation = "destination-out";
  c.globalAlpha = 1;
  for (let i = 0; i < e.n; i++) {
    const r = e.clr[i] * 1.2;
    if (r > 1) c.drawImage(S.hole, e.px[i] - r, e.py[i] - r, 2 * r, 2 * r);
  }

  // tendrils reaching from the front for a lone lamp
  c.globalCompositeOperation = "source-over";
  c.globalAlpha = 0.6;
  for (let i = 0; i < e.n; i++) {
    const p = e.hv[i];
    if (p <= 0) continue;
    const sx = e.tx[i], sy = e.ty[i], ex = e.px[i], ey = e.py[i];
    const len = Math.hypot(ex - sx, ey - sy);
    const bend = (i % 2 ? 1 : -1) * 0.2 * len;
    const cx = (sx + ex) / 2 + bend, cy = (sy + ey) / 2;
    const n = Math.min(40, Math.max(5, Math.ceil((len * p) / 14)));
    for (let k = 0; k < n; k++) {
      const f = k / (n - 1), t = p * f, m = 1 - t;
      const r = 18 - 8 * f;
      c.drawImage(S.puff, m * m * sx + 2 * m * t * cx + t * t * ex - r, m * m * sy + 2 * m * t * cy + t * t * ey - r, 2 * r, 2 * r);
    }
  }

  // the "buffering…" gust sweeping left to right over 900 ms
  const sweep = (now - e.sweepAt) / 900;
  if (sweep >= 0 && sweep <= 1) {
    const bw = 0.35 * W;
    c.globalAlpha = 0.55;
    c.drawImage(S.band, -bw + (W + bw) * sweep, 0, bw, H);
  }
}
