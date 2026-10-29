// Client for the lights counter in server/notes.mjs. Every call fails soft (null) so the
// intro still works on static hosting, where /api/* doesn't exist.

// Keep in sync with PLACES in server/notes.mjs.
export const PLACES = [
  "Darjeeling",
  "Kurseong",
  "Kalimpong",
  "Mirik",
  "Siliguri",
  "Sikkim",
  "Dooars",
  "Elsewhere in India",
  "Abroad",
] as const;
export type Place = (typeof PLACES)[number];

export const PLACE_NE: Record<Place, string> = {
  Darjeeling: "दार्जिलिङ",
  Kurseong: "खरसाङ",
  Kalimpong: "कालेबुङ",
  Mirik: "मिरिक",
  Siliguri: "सिलगढी",
  Sikkim: "सिक्किम",
  Dooars: "डुवर्स",
  "Elsewhere in India": "भारतमा अरू कतै",
  Abroad: "बाहिर कतै",
};

export type LightRun = {
  runId: string;
  lit: number;
  chain: number;
  won: boolean;
  mode: "game" | "still";
  place: Place | "";
  contact?: string;
  consent?: boolean;
};
export type Lights = { total: number; week: { place: Place; n: number }[]; waitlist: number };

async function parse(res: Response): Promise<Lights | null> {
  if (!res.ok) return null;
  const { total, week, waitlist } = await res.json();
  return typeof total === "number" && Array.isArray(week) ? { total, week, waitlist: waitlist ?? 0 } : null;
}

let latest: Promise<Lights | null> | undefined;

/** Current tally, fetched once per page load (a failure is retried on the next call). */
export function getLights(): Promise<Lights | null> {
  latest ??= fetch("/api/lights")
    .then(parse)
    .catch(() => null)
    .then((l) => {
      if (!l) latest = undefined;
      return l;
    });
  return latest;
}

/** Posts one run. With `beacon` (for pagehide) it is fire-and-forget and resolves to null. */
export function postLight(run: LightRun, beacon = false): Promise<Lights | null> {
  const body = JSON.stringify(run);
  if (beacon) {
    try {
      navigator.sendBeacon("/api/light", new Blob([body], { type: "application/json" }));
    } catch {}
    return Promise.resolve(null);
  }
  const posted = fetch("/api/light", { method: "POST", headers: { "Content-Type": "application/json" }, body })
    .then(parse)
    .catch(() => null);
  const prev = latest;
  latest = posted.then((l) => l ?? prev ?? null); // keep the fresh tally for later getLights()
  return posted;
}

const KEY = "gl.light";
export type MyLight = { at: string; lit: number; place: Place | ""; skipped?: boolean };

export function readMyLight(): MyLight | null {
  try {
    return JSON.parse(localStorage.getItem(KEY) ?? "null");
  } catch {
    return null;
  }
}

export function saveMyLight(m: MyLight): void {
  try {
    localStorage.setItem(KEY, JSON.stringify(m));
  } catch {}
}
