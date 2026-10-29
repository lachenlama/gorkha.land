// The share card: the phone painting with the player's own lamps lit, drawn on a canvas only
// when they tap Share (ux-spec §4). Nothing leaves the device until the share sheet does.

import phonePainting from "../../assets/hills-phone-768.webp";
import { PLACE_NE, type Place } from "../lights";
import { PHONE } from "./lamps";

export type CardOpts = { format: "9:16" | "1:1"; lit: number; place: Place | ""; city: string };

const CREAM = "244,232,215";
const LAMP = "#e8b66b";
const BRASS = "#c9a227";
const NE = '"Tiro Devanagari Hindi", serif';
const EN = "Gelasio, serif";
const SANS = "Inter, sans-serif";
export const LINK = "https://gorkha.land/?from=share";

async function ready() {
  const loads = [`44px ${NE}`, `italic 40px ${EN}`, `36px ${EN}`, `34px ${SANS}`].map((f) => document.fonts.load(f, "बत्ती Ab"));
  await Promise.race([Promise.all(loads), new Promise((r) => setTimeout(r, 2500))]); // a missing font falls back, it doesn't block
  const img = new Image();
  img.src = phonePainting;
  await img.decode();
  return img;
}

/** Text that shrinks to fit rather than overflow when the number is long. */
function line(c: CanvasRenderingContext2D, text: string, font: (px: number) => string, px: number, x: number, y: number, fill: string, maxW: number, align: CanvasTextAlign = "left") {
  c.font = font(px);
  const w = c.measureText(text).width;
  if (w > maxW) c.font = font((px * maxW) / w);
  c.fillStyle = fill;
  c.textAlign = align;
  c.fillText(text, x, y);
}

export async function drawCard({ format, lit, place, city }: CardOpts): Promise<Blob> {
  const img = await ready();
  const sq = format === "1:1";
  const W = 1080, H = sq ? 1080 : 1920;
  const cv = document.createElement("canvas");
  cv.width = W;
  cv.height = H;
  const c = cv.getContext("2d")!;

  // painting, cover-fitted; the square keeps the town (y .38 to .94)
  const s = sq ? W / img.naturalWidth : Math.max(W / img.naturalWidth, H / img.naturalHeight);
  const top = sq ? 0.38 * img.naturalHeight * s : (img.naturalHeight * s - H) * 0.2;
  c.drawImage(img, 0, -top, img.naturalWidth * s, img.naturalHeight * s);
  c.fillStyle = "rgba(13,24,19,0.35)"; // the night layer
  c.fillRect(0, 0, W, H);

  // the lamps lit in index order, threaded to their three nearest neighbours
  const pts = PHONE.lamps.slice(0, Math.max(1, lit)).map((l) => [l.x * img.naturalWidth * s, l.y * img.naturalHeight * s - top] as const);
  c.lineWidth = 2;
  c.strokeStyle = "rgba(232,182,107,0.5)";
  pts.forEach(([x, y], i) => {
    pts
      .map(([x2, y2], j) => ({ j, d: Math.hypot(x2 - x, y2 - y) }))
      .filter((o) => o.j > i && o.d < 190)
      .sort((a, b) => a.d - b.d)
      .slice(0, 3)
      .forEach(({ j }) => {
        const [x2, y2] = pts[j];
        c.beginPath();
        c.moveTo(x, y);
        c.quadraticCurveTo((x + x2) / 2, (y + y2) / 2 + 0.12 * Math.hypot(x2 - x, y2 - y), x2, y2);
        c.stroke();
      });
  });
  for (const [x, y] of pts) {
    if (y < 0 || y > H) continue;
    const g = c.createRadialGradient(x, y, 0, x, y, 70);
    g.addColorStop(0, "rgba(255,244,220,0.95)");
    g.addColorStop(0.12, "rgba(232,182,107,0.6)");
    g.addColorStop(1, "rgba(232,182,107,0)");
    c.fillStyle = g;
    c.fillRect(x - 70, y - 70, 140, 140);
  }

  // ink gradient under the words
  const from = sq ? 480 : 1100;
  const shade = c.createLinearGradient(0, from, 0, H);
  shade.addColorStop(0, "rgba(13,24,19,0)");
  shade.addColorStop(1, "rgba(13,24,19,0.95)");
  c.fillStyle = shade;
  c.fillRect(0, from, W, H - from);

  // words
  const k = sq ? 0.8 : 1;
  const y0 = sq ? 735 : 1360;
  const cityName = city.trim();
  const lights = `${lit} ${lit === 1 ? "light" : "lights"}`;
  const where = place && (cityName && (place === "Abroad" || place === "Elsewhere in India") ? `${cityName} बाट पनि · Lit from ${cityName}. Still home.` : `${PLACE_NE[place]} · ${place}`);

  line(c, "गोर्खाल्याण्ड", (p) => `${p}px ${NE}`, 44, 80, 96, `rgba(${CREAM},0.8)`, 520);
  line(c, "gorkha.land", (p) => `${p}px ${EN}`, 36, W - 80, 96, `rgba(${CREAM},0.6)`, 300, "right");
  line(c, `मैले पहाडमा ${lit} बत्ती बालेँ।`, (p) => `${p}px ${NE}`, 76 * k, 80, y0, `rgb(${CREAM})`, W - 160);
  line(c, "पहाडमा हामी छौँ।", (p) => `${p}px ${NE}`, 92 * k, 80, y0 + 110 * k, LAMP, W - 160);
  line(c, `I lit ${lights} in the hills. We are.`, (p) => `italic ${p}px ${EN}`, 40 * k, 80, y0 + 190 * k, `rgba(${CREAM},0.7)`, W - 160);
  if (where) line(c, where, (p) => `${p}px ${SANS}`, 34 * k, 80, y0 + 254 * k, BRASS, W - 160);
  line(c, "आफ्नो बत्ती बाल्नुस् → gorkha.land", (p) => `${p}px ${NE}`, 34, 80, sq ? 1010 : 1820, `rgba(${CREAM},0.7)`, W - 160);

  return new Promise((res, rej) => cv.toBlob((b) => (b ? res(b) : rej(new Error("toBlob failed"))), "image/png"));
}

/** Native share sheet with the image; otherwise download it and copy the link. */
export async function shareCard(blob: Blob, text: string): Promise<"shared" | "saved"> {
  const file = new File([blob], "gorkha-land-light.png", { type: "image/png" });
  if (navigator.canShare?.({ files: [file] })) {
    try {
      await navigator.share({ files: [file], text });
      return "shared";
    } catch (err) {
      if ((err as Error).name === "AbortError") return "shared"; // they closed the sheet
    }
  }
  const a = document.createElement("a");
  a.href = URL.createObjectURL(blob);
  a.download = file.name;
  a.click();
  setTimeout(() => URL.revokeObjectURL(a.href), 5000);
  navigator.clipboard?.writeText(LINK).catch(() => {});
  return "saved";
}
