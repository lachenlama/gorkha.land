// The share sheet: a preview of the card (9:16 or 1:1) drawn on the phone, then the native share
// sheet with the image, or a download plus the link copied.

import { useEffect, useState } from "react";
import type { Place } from "../lights";

type Props = { lit: number; place: Place | ""; city: string; onClose(): void };
const TEXT = "पहाडमा के छ र? Come light it and find out. https://gorkha.land/?from=share";
const focus = "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-lamp";

export default function SharePreview({ lit, place, city, onClose }: Props) {
  const [format, setFormat] = useState<"9:16" | "1:1">("9:16");
  const [card, setCard] = useState<{ blob: Blob; url: string } | null>(null);
  const [note, setNote] = useState("");

  useEffect(() => {
    let off = false;
    let url = "";
    setCard(null);
    import("./ShareCard")
      .then((m) => m.drawCard({ format, lit, place, city }))
      .then((blob) => {
        if (off) return;
        url = URL.createObjectURL(blob);
        setCard({ blob, url });
      })
      .catch(() => !off && setNote("That didn't work. Please try again."));
    return () => {
      off = true;
      if (url) URL.revokeObjectURL(url);
    };
  }, [format, lit, place, city]);

  useEffect(() => {
    const esc = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    addEventListener("keydown", esc);
    return () => removeEventListener("keydown", esc);
  }, [onClose]);

  const share = async () => {
    if (!card) return;
    const { shareCard } = await import("./ShareCard");
    if ((await shareCard(card.blob, TEXT)) === "saved") setNote("Saved. Link copied.");
  };

  return (
    <div
      data-share
      role="dialog"
      aria-modal="true"
      aria-label="Share my light"
      className="fixed inset-0 z-30 grid place-items-center bg-ink/85 p-4 backdrop-blur-sm"
      onPointerDown={(e) => e.stopPropagation()}
    >
      <div className="flex max-h-full w-full max-w-sm flex-col items-center gap-4">
        <div className="flex gap-2" role="group" aria-label="Card shape">
          {(["9:16", "1:1"] as const).map((f) => (
            <button
              key={f}
              aria-pressed={format === f}
              onClick={() => setFormat(f)}
              className={`min-h-11 rounded-full border px-5 text-sm transition ${focus} ${
                format === f ? "border-lamp bg-lamp text-ink" : "border-cream/25 text-cream/80"
              }`}
            >
              {f}
            </button>
          ))}
        </div>
        <div className="flex min-h-0 flex-1 items-center justify-center">
          {card ? (
            <img src={card.url} alt="Your light on the hills: the card you can share" className="max-h-[62svh] max-w-full rounded-xl shadow-2xl" />
          ) : (
            <div className={`rounded-xl bg-cream/5 ${format === "9:16" ? "h-[62svh] w-[34.9svh]" : "size-64"}`} aria-hidden />
          )}
        </div>
        <div className="flex gap-3">
          <button disabled={!card} onClick={share} className={`min-h-11 rounded-full bg-lamp px-7 py-3 font-medium text-ink transition hover:bg-cream disabled:opacity-50 ${focus}`}>
            Share
          </button>
          <button onClick={onClose} className={`min-h-11 rounded-full border border-cream/30 px-6 py-3 text-cream ${focus}`}>
            Close
          </button>
        </div>
        <p role="status" className="min-h-5 text-sm text-cream/70">
          {note}
        </p>
      </div>
    </div>
  );
}
