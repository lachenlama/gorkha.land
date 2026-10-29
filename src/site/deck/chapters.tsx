export const CHAPTERS = [
  { id: "note", n: "01", en: "The note", ne: "चिठी" },
  { id: "question", n: "02", en: "The question", ne: "पहाडमा के छ र?" },
  { id: "why", n: "03", en: "Why now", ne: "किन अहिले" },
  { id: "movement", n: "04", en: "The movement", ne: "अभियान" },
  { id: "roadmap", n: "05", en: "The umbrella", ne: "एउटै छाता" },
  { id: "jamghat", n: "06", en: "First product", ne: "पहिलो कदम" },
  { id: "join", n: "07", en: "Join in", ne: "सँगै हिँडौँ" },
  { id: "leave-a-note", n: "08", en: "Your note", ne: "तपाईंको कुरा" },
] as const;

export function Chapter({ id }: { id: (typeof CHAPTERS)[number]["id"] }) {
  const { n, en, ne } = CHAPTERS.find((c) => c.id === id)!;
  return (
    <div data-reveal className="mb-12 flex items-baseline gap-4 md:mb-16">
      <span className="font-display text-sm tracking-[0.3em] text-brass">{n}</span>
      <span className="h-px w-10 bg-brass/40" />
      <span className="text-xs tracking-[0.25em] text-cream/55 uppercase">
        {en} · <span className="ne tracking-normal normal-case">{ne}</span>
      </span>
    </div>
  );
}
