// Accepts notes and lit-lights from the gorkha.land page and appends them to data/*.jsonl.
// No dependencies. Run behind Caddy (see Caddyfile):  node server/notes.mjs
// Read notes with:  tail -n 20 data/notes.jsonl      (lights.jsonl and waitlist.jsonl sit beside it)
// Self-check:       node server/notes.mjs check
import { appendFile, mkdir, readFile } from "node:fs/promises";
import http from "node:http";
import path from "node:path";
import { fileURLToPath } from "node:url";

const PORT = Number(process.env.PORT ?? 8787);
const FILE =
  process.env.NOTES_FILE ?? path.join(path.dirname(fileURLToPath(import.meta.url)), "..", "data", "notes.jsonl");
const LIGHTS_FILE = path.join(path.dirname(FILE), "lights.jsonl");
const WAITLIST_FILE = path.join(path.dirname(FILE), "waitlist.jsonl");
const WEEK = 7 * 24 * 3600_000;

// Keep in sync with src/site/NoteForm.tsx and src/site/lights.ts.
const ROLES = ["student", "business", "away", "creator", "other"];
const PLACES = [
  "Darjeeling",
  "Kurseong",
  "Kalimpong",
  "Mirik",
  "Siliguri",
  "Sikkim",
  "Dooars",
  "Elsewhere in India",
  "Abroad",
];

const str = (v, max) => (typeof v === "string" ? v.trim().slice(0, max) : "");

/** Returns the note to store, or null if it should be rejected. */
export function clean(body) {
  if (!body || typeof body !== "object" || body.website) return null; // website = honeypot
  const note = typeof body.note === "string" ? body.note.trim() : "";
  if (note.length < 3 || note.length > 1000) return null;
  const contact = body.consent === true ? str(body.contact, 120) : "";
  return {
    at: new Date().toISOString(),
    note,
    name: str(body.name, 80),
    place: PLACES.includes(body.place) ? body.place : "",
    role: ROLES.includes(body.role) ? body.role : "",
    contact,
  };
}

/** Returns { run, wait } (wait = waitlist entry, or null without consent), or null if rejected. */
export function cleanLight(body) {
  if (!body || typeof body !== "object" || body.website) return null;
  const { runId, lit, chain, won, mode } = body;
  if (typeof runId !== "string" || !/^[a-z0-9-]{8,40}$/i.test(runId)) return null;
  if (!Number.isInteger(lit) || lit < 0 || lit > 45) return null;
  if (!Number.isInteger(chain) || chain < 0 || chain > lit) return null;
  if (typeof won !== "boolean" || (mode !== "game" && mode !== "still")) return null;
  const at = new Date().toISOString();
  const place = PLACES.includes(body.place) ? body.place : "";
  const contact = body.consent === true ? str(body.contact, 120) : "";
  return { run: { at, runId, lit, chain, won, mode, place }, wait: contact ? { at, contact, place } : null };
}

// ponytail: in-memory tally rebuilt from JSONL; move to Postgres when Jamghat brings the database.
const tally = { total: 0, ids: new Set(), recent: [], waitlist: 0 };
const claim = (runId) => !tally.ids.has(runId) && !!tally.ids.add(runId); // false = duplicate
function count(run) {
  tally.total++;
  if (run.place) tally.recent.push({ t: Date.parse(run.at), place: run.place });
}
function snapshot(now = Date.now()) {
  tally.recent = tally.recent.filter((r) => now - r.t < WEEK);
  const counts = {};
  for (const { place } of tally.recent) counts[place] = (counts[place] ?? 0) + 1;
  const week = Object.entries(counts)
    .map(([place, n]) => ({ place, n }))
    .sort((a, b) => b.n - a.n)
    .slice(0, 5);
  return { ok: true, total: tally.total, week, waitlist: tally.waitlist };
}
async function readLines(file) {
  const text = await readFile(file, "utf8").catch(() => "");
  return text.split("\n").flatMap((l) => {
    try {
      return [JSON.parse(l)];
    } catch {
      return [];
    }
  });
}

// ponytail: in-memory rate limit, resets on restart and isn't shared; fine for one process.
const limiter = (max) => {
  const hits = new Map();
  return (ip, now = Date.now()) => {
    const recent = (hits.get(ip) ?? []).filter((t) => now - t < 10 * 60_000);
    recent.push(now);
    hits.set(ip, recent);
    return recent.length > max;
  };
};
const limited = limiter(5);
const limitedLight = limiter(20);

function send(res, code, body, headers) {
  res.writeHead(code, { "Content-Type": "application/json", ...headers });
  res.end(JSON.stringify(body));
}

if (process.argv[2] === "check") {
  const assert = (await import("node:assert/strict")).default;
  assert.equal(clean({ note: "hi" }), null, "too short");
  assert.equal(clean({ note: "x".repeat(1001) }), null, "too long");
  assert.equal(clean({ note: "hello", website: "spam" }), null, "honeypot");
  const ok = clean({ note: "  A café I love ", place: "Mars", role: "student", contact: "a@b.c", consent: false });
  assert.equal(ok.note, "A café I love");
  assert.equal(ok.place, "", "unknown place dropped");
  assert.equal(ok.role, "student");
  assert.equal(ok.contact, "", "contact dropped without consent");
  assert.equal(clean({ note: "hello", contact: "a@b.c", consent: true }).contact, "a@b.c");
  for (let i = 0; i < 5; i++) assert.equal(limited("t", 1000 + i), false);
  assert.equal(limited("t", 1010), true, "6th note in 10 min is limited");

  const run = { runId: "run-12345", lit: 38, chain: 14, won: true, mode: "game", place: "Kurseong" };
  const bad = [{ runId: "x" }, { runId: "has space!" }, { lit: 46 }, { lit: -1 }, { chain: 39 }, { won: "yes" }, { mode: "x" }, { website: "s" }];
  for (const b of bad) assert.equal(cleanLight({ ...run, ...b }), null, `rejects ${JSON.stringify(b)}`);
  const l = cleanLight({ ...run, place: "Mars", contact: "a@b.c" });
  assert.equal(l.run.place, "", "unknown place dropped");
  assert.equal(l.wait, null, "contact dropped without consent");
  assert.equal(cleanLight({ ...run, contact: "a@b.c", consent: true }).wait.contact, "a@b.c");
  assert.equal(claim("run-12345"), true);
  assert.equal(claim("run-12345"), false, "duplicate runId");
  for (let i = 0; i < 20; i++) assert.equal(limitedLight("t", 1000 + i), false);
  assert.equal(limitedLight("t", 1020), true, "21st light in 10 min is limited");

  const now = Date.parse("2026-01-10T00:00:00Z");
  const daysAgo = (d) => new Date(now - d * 86400_000).toISOString();
  const seen = [["Mirik", 1], ["Kurseong", 2], ["Kurseong", 3], ["Darjeeling", 1], ["Darjeeling", 2], ["Darjeeling", 3], ["Darjeeling", 8], ["", 1]];
  for (const [place, d] of seen) count({ at: daysAgo(d), place });
  const snap = snapshot(now);
  assert.equal(snap.total, 8);
  assert.deepEqual(snap.week.map((w) => `${w.place} ${w.n}`), ["Darjeeling 3", "Kurseong 2", "Mirik 1"], "ranked; old and blank dropped");
  console.log("notes: all checks passed");
  process.exit(0);
}

await mkdir(path.dirname(FILE), { recursive: true });
for (const run of await readLines(LIGHTS_FILE)) if (claim(run.runId)) count(run);
tally.waitlist = (await readLines(WAITLIST_FILE)).length;

/** Reads a JSON body of at most `max` characters; null if it is too big or not JSON. */
const readJson = (req, max) =>
  new Promise((resolve) => {
    let raw = "";
    req.setEncoding("utf8");
    req.on("data", (chunk) => {
      raw += chunk;
      if (raw.length > max) req.destroy();
    });
    req.on("end", () => {
      try {
        resolve(JSON.parse(raw));
      } catch {
        resolve(null);
      }
    });
    req.on("close", () => resolve(null));
  });

// Caddy sets X-Forwarded-For; the IP is only used for the rate limit, never stored.
const clientIp = (req) => String(req.headers["x-forwarded-for"] ?? req.socket.remoteAddress).split(",")[0].trim();

http
  .createServer(async (req, res) => {
    const route = `${req.method} ${req.url.split("?")[0]}`;

    if (route === "GET /api/lights") return send(res, 200, snapshot(), { "Cache-Control": "public, max-age=15" });

    if (route === "POST /api/notes") {
      if (limited(clientIp(req))) return send(res, 429, { ok: false });
      const entry = clean(await readJson(req, 8_000));
      if (!entry) return send(res, 400, { ok: false });
      try {
        await appendFile(FILE, JSON.stringify(entry) + "\n");
        send(res, 200, { ok: true });
      } catch (err) {
        console.error(err);
        send(res, 500, { ok: false });
      }
      return;
    }

    if (route === "POST /api/light") {
      if (limitedLight(clientIp(req))) return send(res, 429, { ok: false });
      const light = cleanLight(await readJson(req, 2_000));
      if (!light) return send(res, 400, { ok: false });
      if (!claim(light.run.runId)) return send(res, 200, snapshot()); // duplicate: nothing written
      try {
        await appendFile(LIGHTS_FILE, JSON.stringify(light.run) + "\n");
        count(light.run);
        if (light.wait) {
          await appendFile(WAITLIST_FILE, JSON.stringify(light.wait) + "\n");
          tally.waitlist++;
        }
        send(res, 200, snapshot());
      } catch (err) {
        console.error(err);
        send(res, 500, { ok: false });
      }
      return;
    }

    send(res, 404, { ok: false });
  })
  .listen(PORT, "127.0.0.1", () => console.log(`notes: listening on 127.0.0.1:${PORT}, writing ${FILE}`));
