import { useEffect, useRef, useState } from "react";
import Backdrop, { SCENES, WEATHERS, type SceneId, type WeatherId } from "./components/Backdrop";
import Dedicate from "./components/Dedicate";
import InlayCard from "./components/InlayCard";
import Player from "./components/Player";
import Splash from "./components/Splash";
import StoryCard from "./components/StoryCard";
import { songs } from "./data/songs";
import { useYouTube } from "./hooks/useYouTube";
import { ambientEngine, type AmbientMode } from "./lib/ambientSound";
import { readDedication } from "./lib/dedication";

const dedication = readDedication();

// Open on the visitor's own hour
const hour = new Date().getHours();
const startTime = hour < 7 ? "dawn" : hour < 16 ? "day" : hour < 19 ? "dusk" : "night";

const IDLE_MS = 5 * 60 * 1000;

function Chip({
  children,
  onClick,
  label,
  active,
}: {
  children: React.ReactNode;
  onClick: () => void;
  label: string;
  active?: boolean;
}) {
  return (
    <button
      onClick={onClick}
      aria-label={label}
      title={label}
      className={`glass flex h-10 items-center justify-center gap-1.5 rounded-full px-2.5 text-cream/75 transition hover:text-brass ${
        active ? "border-brass/50 text-brass ring-1 ring-brass/30" : ""
      }`}
    >
      <svg
        viewBox="0 0 24 24"
        className="h-[18px] w-[18px] shrink-0"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden
      >
        {children}
      </svg>
    </button>
  );
}

export default function App() {
  const yt = useYouTube(songs, dedication?.song ?? 0);
  const [entered, setEntered] = useState(false);

  // Restore persisted preferences from localStorage if present
  const [scene, setScene] = useState<SceneId>(() => {
    try {
      const saved = localStorage.getItem("gorkhaland_scene");
      if (saved === "chowrasta" || saved === "bazaar") return saved;
    } catch (_) {}
    return "chowrasta";
  });

  const [weather, setWeather] = useState<WeatherId>(() => {
    try {
      const saved = localStorage.getItem("gorkhaland_weather");
      if (saved === "mist" || saved === "rain" || saved === "sun") return saved;
    } catch (_) {}
    return "mist";
  });

  const [ambient, setAmbient] = useState<AmbientMode>(() => {
    try {
      const saved = localStorage.getItem("gorkhaland_ambient");
      if (saved === "rain" || saved === "mist" || saved === "kettle" || saved === "off") return saved;
    } catch (_) {}
    return "rain";
  });

  const [songsOpen, setSongsOpen] = useState(false);
  const [shareOpen, setShareOpen] = useState(false);
  const [storyOpen, setStoryOpen] = useState(false);
  const [idle, setIdle] = useState(false);
  const [blocked, setBlocked] = useState(false);
  const [apiSlow, setApiSlow] = useState(false);
  const fails = useRef(0);

  const ytRef = useRef(yt);
  ytRef.current = yt;

  useEffect(() => {
    document.documentElement.dataset.time = startTime;
  }, []);

  useEffect(() => {
    document.documentElement.dataset.scene = scene;
    try {
      localStorage.setItem("gorkhaland_scene", scene);
    } catch (_) {}
  }, [scene]);

  useEffect(() => {
    document.documentElement.dataset.weather = weather;
    try {
      localStorage.setItem("gorkhaland_weather", weather);
    } catch (_) {}
  }, [weather]);

  // Duck ambient sound when music is playing, raise slightly when paused
  useEffect(() => {
    if (!entered) return;
    ambientEngine.setDucked(yt.playing);
  }, [entered, yt.playing]);

  useEffect(() => {
    const t = setTimeout(() => setApiSlow(true), 7000);
    return () => clearTimeout(t);
  }, []);

  useEffect(() => {
    if (!entered) return;
    const onKey = (e: KeyboardEvent) => {
      const el = e.target as HTMLElement;
      if (e.key === "Escape") {
        setSongsOpen(false);
        setShareOpen(false);
        setStoryOpen(false);
        return;
      }
      if (el.closest("input, textarea, button, a, [contenteditable]")) return;

      const p = ytRef.current;
      if (e.key === " ") {
        e.preventDefault();
        p.toggle();
      } else if (e.key === "ArrowRight") {
        p.seek(Math.min(p.time + 10, p.duration));
      } else if (e.key === "ArrowLeft") {
        p.seek(Math.max(p.time - 10, 0));
      } else if (e.key === "n") {
        p.next();
      } else if (e.key === "p") {
        p.prev();
      } else if (e.key === "s" || e.key === "S") {
        setStoryOpen((s) => !s);
      }
    };
    addEventListener("keydown", onKey);
    return () => removeEventListener("keydown", onKey);
  }, [entered]);

  useEffect(() => {
    if (!yt.error) {
      fails.current = 0;
      return;
    }
    if (fails.current >= songs.length - 1) {
      setBlocked(true);
      return;
    }
    fails.current += 1;
    const t = setTimeout(yt.next, 2600);
    return () => clearTimeout(t);
  }, [yt.error, yt.next]);

  useEffect(() => {
    if (!entered) return;
    let t: number;
    const wake = () => {
      setIdle(false);
      clearTimeout(t);
      t = setTimeout(() => setIdle(true), IDLE_MS);
    };
    wake();
    const events = ["pointerdown", "pointermove", "keydown", "wheel"] as const;
    events.forEach((e) => addEventListener(e, wake, { passive: true }));
    return () => {
      clearTimeout(t);
      events.forEach((e) => removeEventListener(e, wake));
    };
  }, [entered]);

  const cycleAmbient = () => {
    const modes: AmbientMode[] = ["rain", "mist", "kettle", "off"];
    const nextIdx = (modes.indexOf(ambient) + 1) % modes.length;
    const nextMode = modes[nextIdx];
    setAmbient(nextMode);
    ambientEngine.setMode(nextMode);
    try {
      localStorage.setItem("gorkhaland_ambient", nextMode);
    } catch (_) {}
  };

  const cycleWeather = () => {
    const nextIdx = (WEATHERS.findIndex((w) => w.id === weather) + 1) % WEATHERS.length;
    setWeather(WEATHERS[nextIdx].id);
  };

  const cycleScene = () => {
    const nextIdx = (SCENES.findIndex((s) => s.id === scene) + 1) % SCENES.length;
    setScene(SCENES[nextIdx].id);
  };

  const message =
    apiSlow && !yt.ready
      ? "यो नेटवर्कबाट युट्युब खुलेन — गीत बज्न सक्दैन।"
      : blocked
        ? "यहाँबाट कुनै पनि गीत बज्दैन — पछि फेरि आउनुहोला।"
        : yt.error
          ? "यो गीत यहाँ बज्दैन — अर्को हालौं?"
          : undefined;

  const ambientLabels: Record<AmbientMode, string> = {
    rain: "हावापानी · Rain on tin",
    mist: "हावापानी · Mountain mist",
    kettle: "हावापानी · Simmering kettle",
    off: "हावापानी · Muted",
  };

  return (
    <>
      <Backdrop scene={scene} weather={weather} />

      {/* Left controls: Songs drawer + Send dedication */}
      <div className="fixed top-4 left-4 z-20 flex gap-2 md:top-8 md:left-8">
        <Chip onClick={() => setSongsOpen(true)} label="गीतहरू · Songs">
          <path d="M4 6.5h13M4 12h13M4 17.5h8" />
          <circle cx="18.5" cy="16.5" r="2.5" />
          <path d="M21 16.5V9.5" />
        </Chip>
        <Chip onClick={() => setShareOpen(true)} label="पठाउनुहोस् · Send a song">
          <path d="M4.5 12.2L20 4.5l-4.6 15.4-3-6.2z" />
          <path d="M12.4 13.7L20 4.5" />
        </Chip>
      </div>

      {/* Right controls: Ambient Sound + Weather + Scene */}
      <div className="fixed top-4 right-4 z-20 flex gap-2 md:top-8 md:right-8">
        {/* Ambient Sound Bed Cycle */}
        <Chip onClick={cycleAmbient} label={ambientLabels[ambient]} active={ambient !== "off"}>
          {ambient === "rain" && (
            <>
              <path d="M4 14.899A7 7 0 1 1 15.71 8h1.79a4.5 4.5 0 0 1 2.5 8.242" />
              <path d="M8 19v2M12 17v4M16 19v2" />
            </>
          )}
          {ambient === "mist" && (
            <>
              <path d="M4 12h16M7 16h10M9 8h6" />
            </>
          )}
          {ambient === "kettle" && (
            <>
              <path d="M4 19h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-3l-2-3H9L7 7H4a2 2 0 0 0-2 2v8a2 2 0 0 0 2 2z" />
              <circle cx="12" cy="13" r="3" />
            </>
          )}
          {ambient === "off" && (
            <>
              <path d="M11 5L6 9H2v6h4l5 4V5z" />
              <line x1="23" y1="9" x2="17" y2="15" />
              <line x1="17" y1="9" x2="23" y2="15" />
            </>
          )}
        </Chip>

        {/* Weather Mode Cycle */}
        <Chip
          onClick={cycleWeather}
          label={`मौसम · Weather: ${WEATHERS.find((w) => w.id === weather)?.en}`}
        >
          {weather === "mist" && <path d="M4 14h16M6 18h12M8 10h8" />}
          {weather === "rain" && (
            <>
              <path d="M12 3v13" />
              <path d="M8 12l4 4 4-4" />
              <path d="M5 20h14" />
            </>
          )}
          {weather === "sun" && (
            <>
              <circle cx="12" cy="12" r="4" />
              <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41" />
            </>
          )}
        </Chip>

        {/* Scene Cycle */}
        <Chip
          onClick={cycleScene}
          label={`दृश्य · Scene: ${SCENES.find((s) => s.id === scene)?.en}`}
        >
          <rect x="3" y="5" width="18" height="14" rx="1.5" />
          <path d="M3 16.5l4.5-4.5 3.5 3.5 3-3 7 7" />
        </Chip>
      </div>

      <Player yt={yt} message={message} onOpenStory={() => setStoryOpen(true)} />

      <InlayCard
        open={songsOpen}
        onClose={() => setSongsOpen(false)}
        index={yt.index}
        onPick={(i) => {
          yt.jumpTo(i);
          setSongsOpen(false);
        }}
      />

      <StoryCard
        song={yt.song}
        open={storyOpen}
        onClose={() => setStoryOpen(false)}
      />

      <Dedicate open={shareOpen} onClose={() => setShareOpen(false)} song={yt.song} />

      {/* Five minutes still: the hills settle */}
      <div
        className={`pointer-events-none fixed inset-0 z-30 grid place-items-center bg-[#0a1610]/80 backdrop-blur-[3px] transition-opacity duration-[2000ms] ${
          idle ? "opacity-100" : "opacity-0"
        }`}
        aria-hidden
      >
        <p className="ne px-8 text-center text-2xl text-cream/70">हामी यहीँका हौँ</p>
      </div>

      <Splash
        open={!entered}
        ready={yt.ready || apiSlow}
        dedication={dedication}
        song={songs[dedication?.song ?? 0]}
        onEnter={() => {
          yt.play(); // must happen inside user gesture for iOS / browsers
          ambientEngine.start(ambient);
          setEntered(true);
          if (dedication) history.replaceState(null, "", location.pathname);
        }}
      />
    </>
  );
}
