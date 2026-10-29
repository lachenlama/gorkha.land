import { useEffect, useState } from "react";
import type { MyLight } from "../lights";
import { fmt } from "./Counter";

/** Shown to visitors who already met the game: a quiet way back in. Gone after 8 s or on scroll. */
export default function ReturningPill({ mine, total, onPlay }: { mine: MyLight; total?: number; onPlay(): void }) {
  const [shown, setShown] = useState(true);

  useEffect(() => {
    const hide = () => setShown(false);
    const onScroll = () => scrollY > 200 && hide();
    const t = setTimeout(hide, 8000);
    addEventListener("scroll", onScroll, { passive: true });
    return () => {
      clearTimeout(t);
      removeEventListener("scroll", onScroll);
    };
  }, []);

  return (
    <div className="pointer-events-none fixed inset-x-0 top-[88px] z-30 flex justify-center px-4">
      <p
        className={`flex flex-wrap items-center justify-center gap-x-2 rounded-3xl border border-cream/10 bg-ink/70 px-4 py-2 text-sm text-cream/80 backdrop-blur-md transition-opacity duration-500 ${
          shown ? "pointer-events-auto" : "opacity-0"
        }`}
      >
        <span lang="ne" className="ne">
          {mine.skipped ? "पहाडमा के छ र?" : "तपाईंको बत्ती अझै बलिरहेको छ"}
        </span>
        {!mine.skipped && <span>· Your light is still on{total ? ` · ${fmt(total)} lights` : ""}</span>}
        <span>·</span>
        <button onClick={onPlay} className="min-h-11 text-lamp underline decoration-lamp/40 underline-offset-4 hover:decoration-lamp">
          {mine.skipped ? "Light a lamp (60 s) →" : "Play again →"}
        </button>
      </p>
    </div>
  );
}
