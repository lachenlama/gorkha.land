import { useCallback, useRef, useState } from "react";

export type Toast = (ne: string, en: string, ms?: number) => void;

export const reducedMotion = () => matchMedia("(prefers-reduced-motion: reduce)").matches;

/** The deck's one small toast: only ever one message at a time, a new one replaces the old. */
export function useToast() {
  const [msg, setMsg] = useState<{ ne: string; en: string; on: boolean } | null>(null);
  const timer = useRef(0);

  const toast = useCallback<Toast>((ne, en, ms = 3000) => {
    clearTimeout(timer.current);
    setMsg({ ne, en, on: true });
    timer.current = window.setTimeout(() => setMsg((m) => m && { ...m, on: false }), ms);
  }, []);

  const view = (
    <div role="status" className="pointer-events-none fixed inset-x-0 bottom-6 z-[70] flex justify-center px-4">
      {msg && (
        <p
          aria-hidden={!msg.on}
          className={`toast max-w-md rounded-3xl border border-cream/10 bg-ink/90 px-6 py-3 text-center text-sm backdrop-blur-md transition-opacity duration-200 ${
            msg.on ? "opacity-100" : "opacity-0"
          }`}
        >
          <span lang="ne" className="ne block text-cream">
            {msg.ne}
          </span>
          <span className="block text-cream/60">{msg.en}</span>
        </p>
      )}
    </div>
  );

  return [toast, view] as const;
}
