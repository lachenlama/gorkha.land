import { useState } from "react";
import bazaarNarrow from "../assets/bazaar-1280.webp";
import bazaarPhoneNarrow from "../assets/bazaar-phone-900.webp";
import bazaarPhoneWide from "../assets/bazaar-phone-1350.webp";
import bazaarWide from "../assets/bazaar-2400.webp";
import chowrastaNarrow from "../assets/chowrasta-1280.webp";
import chowrastaPhoneNarrow from "../assets/chowrasta-phone-900.webp";
import chowrastaPhoneWide from "../assets/chowrasta-phone-1350.webp";
import chowrastaWide from "../assets/chowrasta-2400.webp";

// Three bands crossing at different speeds and heights. The tile is 900px and
// the keyframe shifts exactly 900px, so each band wraps without a seam.
const BANDS = [
  { top: "8%", h: "34vh", blur: 34, dur: "80s", op: 0.85, reverse: false },
  { top: "34%", h: "40vh", blur: 46, dur: "140s", op: 1, reverse: true },
  { top: "58%", h: "34vh", blur: 28, dur: "105s", op: 0.7, reverse: false },
];

export const SCENES = [
  {
    id: "chowrasta",
    ne: "चौरस्ता",
    en: "Chowrasta",
    narrow: chowrastaNarrow,
    wide: chowrastaWide,
    portraitNarrow: chowrastaPhoneNarrow,
    portraitWide: chowrastaPhoneWide,
    alt: "Chowrasta in Darjeeling at golden hour — the bandstand, Bhanubhakta's statue, ponies and pigeons on the flagstones, Kanchenjunga beyond the pines.",
  },
  {
    id: "bazaar",
    ne: "बजार",
    en: "Bazaar",
    narrow: bazaarNarrow,
    wide: bazaarWide,
    portraitNarrow: bazaarPhoneNarrow,
    portraitWide: bazaarPhoneWide,
    alt: "The market street below Chowrasta at dusk — a lit bakery and tea shop, wet cobbles, prayer flags, and lamps coming on across the hillside.",
  },
] as const;

export type SceneId = (typeof SCENES)[number]["id"];

export const WEATHERS = [
  { id: "mist", ne: "कुहिरो", en: "Mist" },
  { id: "rain", ne: "बर्षा", en: "Rain" },
  { id: "sun", ne: "घाम", en: "Sun" },
] as const;

export type WeatherId = (typeof WEATHERS)[number]["id"];

type Props = {
  scene: SceneId;
  weather?: WeatherId;
};

export default function Backdrop({ scene, weather = "mist" }: Props) {
  const [loaded, setLoaded] = useState<string[]>([]);

  return (
    <div
      className="fixed inset-0 -z-10 overflow-hidden bg-[#1b2a24]"
      style={{ filter: "var(--weather-filter)" }}
    >
      {/* Both scenes stay mounted so switching is a true crossfade */}
      {SCENES.map((s) => {
        const active = s.id === scene;
        const portrait = "portraitWide" in s ? s : null;
        return (
          <picture key={s.id}>
            {portrait && (
              <source
                media="(orientation: portrait)"
                srcSet={`${portrait.portraitNarrow} 900w, ${portrait.portraitWide} 1350w`}
                sizes="100vw"
              />
            )}
            <img
              src={s.wide}
              srcSet={`${s.narrow} 1280w, ${s.wide} 2400w`}
              sizes="(orientation: portrait) 200vw, 100vw"
              alt={active ? s.alt : ""}
              fetchPriority={active ? "high" : "low"}
              onLoad={() => setLoaded((l) => (l.includes(s.id) ? l : [...l, s.id]))}
              className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-[1400ms] ${
                active && loaded.includes(s.id) ? "opacity-100" : "opacity-0"
              }`}
              style={{
                filter: "var(--img-filter)",
                animation: "breathe 140s ease-in-out infinite",
              }}
            />
          </picture>
        );
      })}

      {/* hour of the day tint */}
      <div
        className="absolute inset-0 mix-blend-multiply"
        style={{
          background: "var(--tint)",
          opacity: "var(--tint-op)",
          transition: "opacity 1.4s",
        }}
      />

      {/* mist, moving across the hills */}
      <div
        className="absolute inset-0 overflow-hidden"
        style={{ opacity: "var(--mist-op)", transition: "opacity 1.6s" }}
      >
        {BANDS.map((b) => (
          <div
            key={b.top}
            className="mist-band absolute inset-x-0"
            style={{
              top: b.top,
              height: b.h,
              opacity: b.op,
              filter: `blur(${b.blur}px)`,
              animationDuration: b.dur,
              animationDirection: b.reverse ? "reverse" : "normal",
              backgroundImage:
                "radial-gradient(closest-side at 22% 50%, var(--mist-a), transparent)," +
                "radial-gradient(closest-side at 68% 42%, var(--mist-b), transparent)",
            }}
          />
        ))}
      </div>

      {/* Rain animation layer */}
      {weather === "rain" && (
        <div className="pointer-events-none absolute inset-0 z-0 overflow-hidden opacity-90" aria-hidden>
          <div className="rain-layer absolute inset-0" />
          <div className="rain-layer-dense absolute inset-0 opacity-75" />
        </div>
      )}

      {/* Sun rays layer */}
      {weather === "sun" && (
        <div
          className="pointer-events-none absolute inset-0 mix-blend-screen opacity-40 transition-opacity duration-1000"
          style={{
            background:
              "linear-gradient(135deg, rgba(245, 183, 79, 0.45) 0%, rgba(245, 183, 79, 0.1) 40%, transparent 70%)",
          }}
          aria-hidden
        />
      )}

      {/* scrim for readability */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(180deg, rgba(20,32,26,.35) 0%, transparent 22%, transparent 48%, rgba(16,26,21,.72) 100%)",
        }}
      />

      {/* vignette and grain */}
      <div
        className="absolute inset-0"
        style={{ boxShadow: "inset 0 0 190px 60px rgba(14,24,19,.55)" }}
      />
      <svg className="absolute inset-0 h-full w-full opacity-[0.05] mix-blend-overlay" aria-hidden>
        <filter id="grain">
          <feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="3" />
        </filter>
        <rect width="100%" height="100%" filter="url(#grain)" />
      </svg>
    </div>
  );
}
