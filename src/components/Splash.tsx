import { useState } from "react";
import type { Song } from "../data/songs";
import type { Dedication } from "../lib/dedication";

type Props = {
  open: boolean;
  ready: boolean;
  onEnter: () => void;
  dedication: Dedication | null;
  song: Song;
};

export default function Splash({ open, ready, onEnter, dedication, song }: Props) {
  const [puffs, setPuffs] = useState<number[]>([]);

  const handleGlassTap = () => {
    setPuffs((p) => [...p, Date.now()]);
  };

  return (
    <div
      inert={!open}
      className={`fixed inset-0 z-50 grid place-items-center bg-[#14261d] transition-opacity duration-[1200ms] ${
        open ? "opacity-100" : "pointer-events-none opacity-0"
      }`}
    >
      {/* fog, lifting */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden opacity-40">
        {["16%", "48%", "74%"].map((top, i) => (
          <div
            key={top}
            className="mist-band absolute inset-x-0 h-56 blur-3xl"
            style={{
              top,
              animationDuration: `${90 + i * 35}s`,
              animationDirection: i === 1 ? "reverse" : "normal",
              backgroundImage:
                "radial-gradient(closest-side at 24% 50%, rgba(216,216,216,.6), transparent)," +
                "radial-gradient(closest-side at 70% 45%, rgba(244,232,215,.45), transparent)",
            }}
          />
        ))}
      </div>

      <div className="relative px-8 text-center">
        {/* a glass, not a cup — tapping it puffs fresh steam */}
        <button
          onClick={handleGlassTap}
          type="button"
          aria-label="A glass of hot chiya"
          title="चियाको गिलास · Tap for steam"
          className="group mx-auto mb-7 block cursor-pointer transition-transform hover:scale-105"
        >
          <svg
            viewBox="0 0 120 130"
            className="mx-auto h-28 w-24"
            fill="none"
            stroke="var(--color-cream)"
            strokeWidth="2"
            strokeLinecap="round"
            aria-hidden
          >
            <g opacity="0.65">
              {[0, 1, 2].map((i) => (
                <path
                  key={i}
                  d={`M${44 + i * 14} 46 c-6 -8 6 -14 0 -22`}
                  style={{ animation: `steam 4.5s ease-out ${i * 1.4}s infinite` }}
                />
              ))}
              {puffs.slice(-3).map((id, idx) => (
                <path
                  key={id}
                  d={`M${51 + idx * 9} 46 c-8 -12 8 -18 0 -30`}
                  className="steam-puff stroke-brass"
                  strokeWidth="2.5"
                />
              ))}
            </g>
            <path d="M34 58 h52 l-9 56 h-34 Z" className="transition group-hover:stroke-brass" />
            <path d="M37 74 h46" opacity="0.5" />
          </svg>
        </button>

        {/* The domain is the Roman wordmark */}
        <h1 className="ne print text-[2.4rem] text-cream sm:text-5xl md:text-6xl">
          गोर्खाल्याण्ड
        </h1>
        <p className="mt-3 font-display text-[13px] tracking-[0.32em] text-brass">
          gorkha.land
        </p>

        {dedication ? (
          <div className="mx-auto mt-8 max-w-xs rotate-[-1deg] bg-cream px-5 py-4 text-tea shadow-[0_14px_36px_rgba(0,0,0,.45)]">
            <p className="hand text-[13px] text-gumba">
              {dedication.from ? `${dedication.from} बाट` : "कसैबाट"}
              {dedication.to && ` — ${dedication.to} लाई`}
            </p>
            <p className="ne mt-2 text-lg leading-snug">{song.titleNe}</p>
            <p className="font-display text-[12.5px] text-tea/55 italic">
              {song.title} · {song.artist}
            </p>
          </div>
        ) : (
          <>
            <p className="ne mx-auto mt-8 max-w-sm text-xl text-cream/85">
              नक्सामा नाम छैन, घर भने यहीँ छ
            </p>
            <p className="mt-1 font-display text-[15px] text-cream/50 italic">
              Unnamed on any map. Still home — and here, the old songs still play.
            </p>
          </>
        )}

        <button
          onClick={onEnter}
          disabled={!ready}
          className="ne mt-10 rounded-[3px] border border-brass bg-brass/10 px-9 py-4 text-lg text-brass transition hover:bg-brass/20 disabled:opacity-40"
        >
          {!ready ? "पर्खनुहोस्…" : dedication ? "सुन्नुहोस्" : "भित्र आउनुहोस्"}
        </button>

        <p className="ne mx-auto mt-8 max-w-xs text-[13px] leading-relaxed text-cream/40">
          यो झ्याल खुला राख्नुहोला
          <span className="mt-1 block font-sans text-[11.5px] not-italic">
            Keep this window open — the songs stop if your phone locks.
          </span>
        </p>

        <p className="ne mx-auto mt-7 max-w-xs text-[13.5px] leading-relaxed text-cream/45">
          हाम्रो पहाड, हाम्रो भाषा, हाम्रो गीत।
          <span className="mt-1 block font-sans text-[11.5px] not-italic">
            Our hills, our language, our songs.
          </span>
        </p>

        <p className="mx-auto mt-6 max-w-xs text-[10.5px] leading-relaxed text-cream/30">
          All songs belong to their respective owners. A non-commercial tribute.
        </p>
      </div>
    </div>
  );
}
