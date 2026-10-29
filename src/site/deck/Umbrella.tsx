import { useEffect, useRef, useState, type ReactNode } from "react";
import { Chapter } from "./chapters";
import type { Toast } from "./toast";

type Stage = "lit" | "next" | "then" | "later";

/** Easter egg 5: the word "water" is a tooltip. Closes after 4 s or on a tap elsewhere. */
function Water() {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    if (!open) return;
    const close = () => setOpen(false);
    const away = (e: PointerEvent) => ref.current?.contains(e.target as Node) || close();
    const t = setTimeout(close, 4000);
    addEventListener("pointerdown", away);
    return () => {
      clearTimeout(t);
      removeEventListener("pointerdown", away);
    };
  }, [open]);

  return (
    <span
      ref={ref}
      tabIndex={0}
      className="relative cursor-help"
      onMouseEnter={() => setOpen(true)}
      onFocus={() => setOpen(true)}
      onClick={() => setOpen(true)}
    >
      water
      {open && (
        <span
          role="tooltip"
          className="absolute bottom-full left-0 mb-2 block w-60 rounded-xl border border-cream/15 bg-ink px-4 py-3 text-sm shadow-xl shadow-black/50"
        >
          <span lang="ne" className="ne block text-cream">
            ट्याङ्कर? भोलि आउँछ रे।
          </span>
          <span className="block text-cream/60">The tanker's coming tomorrow. It said that yesterday too.</span>
        </span>
      )}
    </span>
  );
}

const PRODUCTS: { ne: string; en: string; line: ReactNode; stage: Stage; status: string }[] = [
  { ne: "जमघट", en: "Jamghat", line: "Cafés, crews and hangouts. Check in, level up, hold your spot.", stage: "lit", status: "Building now" },
  {
    ne: "पुल",
    en: "Pul",
    line: "The bridge: digital infrastructure for the hills. Every dokan, school and homestay online, with a simple web page, UPI payments, a listing on the map, community Wi-Fi points and digital-skills classes.",
    stage: "next",
    status: "Next",
  },
  { ne: "काम", en: "Kaam", line: "Jobs, gigs, internships and scholarships for the hills, all checked.", stage: "then", status: "Then" },
  {
    ne: "पहाड Live",
    en: "Pahad Live",
    line: (
      <>
        Roads, landslides, <Water /> and power, reported by people on the ground.
      </>
    ),
    stage: "later",
    status: "Later",
  },
  { ne: "हाट", en: "Haat", line: "Tea, churpi, dalle and crafts, straight from the people who make them.", stage: "later", status: "Later" },
  { ne: "बास", en: "Baas", line: "Verified homestays, with your advance payment protected.", stage: "later", status: "Later" },
];

const NODE: Record<Stage, string> = {
  lit: "border-lamp bg-lamp shadow-[0_0_24px_var(--color-lamp)]",
  next: "lamp-pulse border-lamp bg-ink",
  then: "border-cream/30 bg-ink",
  later: "border-cream/30 bg-ink",
};

export default function Umbrella({ toast }: { toast: Toast }) {
  // Easter egg 4: three taps on a "Later" pill and it turns into "File pending" for 4 s.
  const [pending, setPending] = useState("");
  const taps = useRef<Record<string, number>>({});
  const tapLater = (id: string) => {
    taps.current[id] = (taps.current[id] ?? 0) + 1;
    if (taps.current[id] < 3) return;
    taps.current[id] = 0;
    setPending(id);
    toast("फाइल पेन्डिङ छ, अर्को हप्ता आउनुस्।", "File pending. Come next week.", 4000);
    setTimeout(() => setPending((p) => (p === id ? "" : p)), 4000);
  };

  return (
    <section id="roadmap" className="grain relative bg-ink py-24 md:py-36">
      <div className="mx-auto max-w-6xl px-4 md:px-8">
        <Chapter id="roadmap" />
        <h2 data-reveal className="font-display max-w-3xl text-4xl leading-tight md:text-6xl">
          One brand. One product at a time.
        </h2>
        <p data-reveal className="mt-6 max-w-2xl text-lg text-cream/65">
          Each product is a lamp. We light one at a time and join them into one network.
        </p>

        {/* The thread runs through the node centres: down the page on a phone, across on desktop. */}
        <ol className="relative mt-16 space-y-4 before:absolute before:top-2 before:bottom-2 before:left-[7px] before:w-px before:bg-lamp/35 lg:grid lg:grid-cols-[1fr_1.7fr_1fr_1fr_1fr_1fr] lg:gap-3 lg:space-y-0 lg:before:inset-x-2 lg:before:top-[7px] lg:before:bottom-auto lg:before:h-px lg:before:w-auto">
          {PRODUCTS.map((p, i) => {
            const isPul = p.en === "Pul";
            return (
              <li
                key={p.en}
                data-reveal
                style={{ ["--d" as string]: `${i * 90}ms` }}
                className="relative flex flex-col pl-10 has-[[role=tooltip]]:z-10 lg:pt-10 lg:pl-0"
              >
                <span className={`absolute top-2 left-0 h-[15px] w-[15px] rounded-full border-2 lg:top-0 ${NODE[p.stage]}`} aria-hidden />
                <div
                  className={`flex flex-1 flex-col gap-2 rounded-2xl border p-6 transition hover:bg-cream/[0.03] lg:p-5 ${
                    isPul ? "border-lamp/30 bg-lamp/[0.04]" : "border-cream/10"
                  }`}
                >
                  <div>
                    <p lang="ne" className="ne text-2xl text-cream">
                      {p.ne}
                    </p>
                    <p className="text-sm text-cream/50">{p.en}</p>
                  </div>
                  <p className="text-cream/70 lg:text-sm lg:leading-relaxed">{p.line}</p>
                  {p.stage === "later" ? (
                    <button
                      type="button"
                      onClick={() => tapLater(p.en)}
                      className={`mt-auto self-start rounded-full border px-3 py-1 text-xs transition motion-safe:duration-300 ${
                        pending === p.en
                          ? "border-gumba text-gumba motion-safe:-rotate-6"
                          : "border-cream/20 text-cream/60"
                      }`}
                    >
                      {pending === p.en ? "File pending" : p.status}
                    </button>
                  ) : (
                    <span
                      className={`mt-auto self-start rounded-full border px-3 py-1 text-xs ${
                        p.stage === "lit"
                          ? "border-lamp bg-lamp text-ink"
                          : p.stage === "next"
                            ? "border-lamp/60 text-lamp"
                            : "border-cream/20 text-cream/60"
                      }`}
                    >
                      {p.status}
                    </span>
                  )}
                </div>
                {isPul && (
                  <p lang="ne" className="ne mt-3 text-lg text-lamp">
                    हरेक दोकान, हरेक स्कुल, हरेक होमस्टे — अनलाइन।
                  </p>
                )}
              </li>
            );
          })}
        </ol>
      </div>
    </section>
  );
}
