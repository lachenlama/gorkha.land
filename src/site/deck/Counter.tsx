import { PLACE_NE, type Lights } from "../lights";

export const fmt = (n: number) => n.toLocaleString("en-IN");

/** The week's top towns as thin lamp bars, scaled to the leader. */
function WeekBars({ week }: { week: Lights["week"] }) {
  const lead = Math.max(...week.map((w) => w.n), 1);
  return (
    <div>
      <p className="mb-4 text-xs tracking-[0.25em] text-cream/50 uppercase">
        <span lang="ne" className="ne tracking-normal normal-case">
          यो हप्ता
        </span>{" "}
        · This week
      </p>
      <ul className="space-y-3">
        {week.slice(0, 5).map(({ place, n }) => (
          <li key={place} className="grid grid-cols-[8rem_1fr_3rem] items-center gap-3 text-sm sm:grid-cols-[10rem_1fr_3rem]">
            <span className="truncate text-cream/80">
              <span lang="ne" className="ne">
                {PLACE_NE[place]}
              </span>{" "}
              <span className="text-xs text-cream/40">{place}</span>
            </span>
            <span className="h-1 rounded-full bg-cream/10">
              <span className="block h-full rounded-full bg-lamp" style={{ width: `${(n / lead) * 100}%` }} />
            </span>
            <span className="text-right text-cream/60 tabular-nums">{fmt(n)}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

/** The live count above the Join cards. Hidden entirely when the API gave us nothing. */
export default function JoinCounter({ lights, onPlay }: { lights: Lights | null; onPlay(): void }) {
  if (!lights || lights.total < 1) return null;
  return (
    <div className="rise mt-16 grid items-center gap-10 rounded-2xl bg-pine/60 p-8 md:grid-cols-[auto_1fr] md:gap-16 md:p-10">
      <div>
        <p className="font-display glow text-6xl text-lamp md:text-7xl">{fmt(lights.total)}</p>
        <p className="mt-3 text-cream/75">
          <span lang="ne" className="ne">
            {lights.total === 1 ? "बत्ती बलिरहेको छ" : "बत्ती बलिरहेका छन्"}
          </span>{" "}
          · {lights.total === 1 ? "light is" : "lights are"} on across the hills
        </p>
        <button
          onClick={onPlay}
          className="mt-6 min-h-11 rounded-full bg-lamp px-6 py-3 font-medium text-ink transition hover:bg-cream"
        >
          Light yours →
        </button>
      </div>
      {lights.week.length > 0 && <WeekBars week={lights.week} />}
    </div>
  );
}
