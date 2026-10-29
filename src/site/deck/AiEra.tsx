// The AI-era argument under "Why now". Deliberately no numbers: any figure added here
// needs a primary source first (CLAUDE.md).

const REACH = [
  "A café in Chowk Bazaar can reach the world.",
  "A student can earn without leaving home.",
  "A weaver can sell without a middleman.",
];

const hill = (w: string) => (
  <span lang="ne" className="font-nepali text-cream">
    {w}
  </span>
);

export default function AiEra() {
  return (
    <div className="mt-24">
      <div className="grid gap-10 lg:grid-cols-2 lg:gap-16">
        <div data-reveal>
          <p className="text-xs tracking-[0.25em] text-brass uppercase">
            <span lang="ne" className="ne tracking-normal normal-case">
              AI को जमाना
            </span>{" "}
            · The AI era
          </p>
          <h3 className="font-display mt-4 text-3xl leading-tight md:text-5xl">
            Machines learn the languages that are written down.
          </h3>
        </div>
        <div data-reveal style={{ ["--d" as string]: "120ms" }}>
          <p className="text-lg leading-relaxed text-cream/75">
            AI learns from what people write online. A language that isn't written online gets left out, or replaced
            by whichever version is. If hill Nepali — {hill("दोकान")}, {hill("कुइरो")}, {hill("ठिटाठिटी")} — isn't
            online, the machines will teach our children someone else's Nepali.
          </p>
          <p lang="ne" className="ne mt-8 text-2xl text-lamp">
            डिजिटल हुनु भनेको आफ्नै आवाज जोगाउनु हो।
          </p>
          <p className="mt-1 text-sm text-cream/50 italic">Going digital is how the hills keep their own voice.</p>
        </div>
      </div>

      <ul className="mt-14 grid gap-5 border-t border-cream/10 pt-8 md:grid-cols-3 md:gap-8">
        {REACH.map((line, i) => (
          <li key={line} data-reveal style={{ ["--d" as string]: `${i * 120}ms` }} className="flex gap-3 text-cream/70">
            <span className="lampdot mt-[0.6rem] h-1.5 w-1.5 shrink-0 rounded-full" aria-hidden />
            {line}
          </li>
        ))}
      </ul>
    </div>
  );
}
