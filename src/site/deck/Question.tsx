import { Chapter } from "./chapters";

// [what people say, its gloss, what is actually true]. No numbers on purpose.
const CARDS = [
  [
    "पहाडमा के छ र?",
    "What's there in the hills anyway?",
    "Tea the world knows by name, songs sung far beyond these hills, and people who can cook, fix, teach and build.",
  ],
  [
    "यहाँ बसेर के गर्छस्?",
    "What will you do, staying here?",
    "Run a café. Teach online. Sell to a buyer in another city. The work is here; it just isn't online yet.",
  ],
  [
    "यहाँ त केही गर्ने ठाउँ नै छैन।",
    "There's nothing to do here.",
    "Open mics, football nights, quiz nights, momo worth crossing town for. Nobody has put them on one map.",
  ],
  [
    "राम्रो काम त सबै तल छ।",
    "The good jobs are all down the hill.",
    "More and more of them can be done from up here, with a phone and a signal. The signal is already here.",
  ],
  [
    "बाहिरकाले हामीलाई चिन्दैनन्।",
    "Nobody outside knows us.",
    "They know the tea, the toy train and the mountain. They just haven't met the people yet.",
  ],
  [
    "ठिटाठिटीलाई पहाडको के मतलब?",
    "Young people don't care about the hills.",
    "They're the ones coming home every December. They'll be the ones who put it online.",
  ],
] as const;

export default function Question() {
  return (
    <section id="question" className="grain relative bg-ink py-24 md:py-36">
      <div className="mx-auto max-w-6xl px-4 md:px-8">
        <Chapter id="question" />
        <h2 data-reveal lang="ne" className="ne text-4xl text-cream md:text-6xl" style={{ lineHeight: 1.4 }}>
          पहाडमा के छ र?
        </h2>
        <p data-reveal className="font-display mt-4 max-w-2xl text-xl text-cream/60 italic md:text-2xl">
          Everyone up here has heard it. Here's what's actually here.
        </p>

        <div className="mt-16 grid gap-6 md:grid-cols-2">
          {CARDS.map(([ne, en, truth], i) => (
            <div
              key={en}
              data-reveal
              style={{ ["--d" as string]: `${(i % 2) * 100}ms` }}
              className="rounded-2xl border border-cream/10 bg-pine/50 p-7 md:p-8"
            >
              <p lang="ne" className="ne text-xl text-cream/45">
                {ne}
              </p>
              <p className="text-xs text-cream/40 italic">{en}</p>
              <div className="mt-6 flex gap-3">
                <span className="lampdot mt-[0.6rem] h-1.5 w-1.5 shrink-0 rounded-full" aria-hidden />
                <p className="font-display text-xl leading-snug text-cream">{truth}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
