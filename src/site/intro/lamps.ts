// The two lamp sets (ux-spec §3), hand-placed on the painting. Coordinates are
// normalised to the image; `?lamps` draws them over the hero so they can be nudged.

export type Pt = [number, number];
export type Lamp = { x: number; y: number; rail?: true; election?: true };
export type LampSet = {
  lamps: Lamp[];
  backbone: Pt[]; // the toy-train line
  chowrasta: Pt;
  kanchenjunga: Pt;
  far: Pt; // the far ridge, where a diaspora light appears
};

type Row = [x: number, y: number, flag?: "r" | "e"]; // r = on the rail, e = election-lamp candidate

function build(rows: Row[], backbone: (number | Pt)[], chowrasta: Pt, kanchenjunga: Pt, far: Pt): LampSet {
  return {
    lamps: rows.map(([x, y, f]) => ({ x, y, ...(f === "r" && { rail: true as const }), ...(f === "e" && { election: true as const }) })),
    backbone: backbone.map((b) => (typeof b === "number" ? [rows[b][0], rows[b][1]] : b)),
    chowrasta,
    kanchenjunga,
    far,
  };
}

// hills-1792.webp. Lamp 0 is the phone in the rooftop figure's hand.
const DESKTOP = build(
  [
    [0.742, 0.718],
    [0.81, 0.62], [0.848, 0.64], [0.815, 0.69], [0.685, 0.62], [0.64, 0.64],
    [0.66, 0.69], [0.6, 0.61], [0.59, 0.71], [0.575, 0.76], [0.535, 0.76],
    [0.615, 0.79], [0.56, 0.84], [0.585, 0.88], [0.545, 0.89], [0.67, 0.57],
    [0.715, 0.56, "e"], [0.755, 0.56], [0.8, 0.56], [0.84, 0.53], [0.89, 0.49],
    [0.635, 0.54, "e"], [0.69, 0.46], [0.725, 0.41, "e"], [0.81, 0.42], [0.855, 0.4, "e"],
    [0.9, 0.41], [0.78, 0.35, "r"], [0.855, 0.33], [0.89, 0.31], [0.82, 0.26, "r"],
    [0.865, 0.25], [0.905, 0.205], [0.885, 0.165, "r"], [0.87, 0.12], [0.57, 0.42, "r"],
    [0.6, 0.43], [0.66, 0.4, "r"], [0.4, 0.51], [0.42, 0.63, "r"], [0.47, 0.66, "r"],
  ],
  [[0.36, 0.72], 39, 40, [0.52, 0.55], 35, 37, 27, 30, 33],
  [0.88, 0.16],
  [0.63, 0.17],
  [0.42, 0.4],
);

// hills-phone-768.webp.
const PHONE = build(
  [
    [0.64, 0.676],
    [0.8, 0.44], [0.9, 0.425], [0.71, 0.49, "r"], [0.85, 0.48], [0.59, 0.53, "r"],
    [0.77, 0.515, "e"], [0.89, 0.525], [0.5, 0.555], [0.7, 0.575, "e"], [0.84, 0.565],
    [0.4, 0.59], [0.48, 0.615], [0.62, 0.6], [0.78, 0.6], [0.89, 0.6],
    [0.3, 0.625], [0.4, 0.65], [0.57, 0.64, "e"], [0.8, 0.645], [0.88, 0.64],
    [0.18, 0.69], [0.27, 0.68], [0.37, 0.69], [0.47, 0.68], [0.8, 0.69],
    [0.14, 0.73], [0.24, 0.725], [0.33, 0.715], [0.43, 0.725], [0.2, 0.765],
    [0.28, 0.77], [0.38, 0.76], [0.18, 0.54, "r"], [0.28, 0.525, "r"], [0.44, 0.515, "r"],
    [0.13, 0.585, "r"], [0.135, 0.645, "r"],
  ],
  [[0.13, 0.68], 37, 36, 33, 34, 35, 5, 3, [0.85, 0.42]],
  [0.85, 0.42],
  [0.58, 0.19],
  [0.15, 0.47],
);

export { DESKTOP, PHONE };

/** Same query as the hero's `<source>`, so the lamps always match the painting that loaded. */
export const pickSet = (): LampSet => (matchMedia("(orientation: portrait)").matches ? PHONE : DESKTOP);

/** Where the painting sits inside its `object-fit: cover` box, read from the live `<img>`. */
export type Fit = { s: number; ox: number; oy: number; iw: number; ih: number };

export function fitImage(img: HTMLImageElement): Fit {
  const r = img.getBoundingClientRect();
  const iw = img.naturalWidth || 1;
  const ih = img.naturalHeight || 1;
  const s = Math.max(r.width / iw, r.height / ih);
  const [px = 0.5, py = 0.5] = [...getComputedStyle(img).objectPosition.matchAll(/(-?[\d.]+)%/g)].map((m) => +m[1] / 100);
  return { s, iw, ih, ox: r.left + (r.width - iw * s) * px, oy: r.top + (r.height - ih * s) * py };
}

export const imageToScreen = (f: Fit, nx: number, ny: number): Pt => [f.ox + nx * f.iw * f.s, f.oy + ny * f.ih * f.s];
