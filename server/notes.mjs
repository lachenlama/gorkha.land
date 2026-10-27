// Accepts notes from the gorkha.land page and appends them to data/notes.jsonl.
// No dependencies. Run behind Caddy (see Caddyfile):  node server/notes.mjs
// Read notes with:  tail -n 20 data/notes.jsonl
// Self-check:       node server/notes.mjs check
import { appendFile, mkdir } from "node:fs/promises";
import http from "node:http";
import path from "node:path";
import { fileURLToPath } from "node:url";

const PORT = Number(process.env.PORT ?? 8787);
const FILE =
  process.env.NOTES_FILE ?? path.join(path.dirname(fileURLToPath(import.meta.url)), "..", "data", "notes.jsonl");

// Keep in sync with src/site/NoteForm.tsx.
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

// ponytail: in-memory rate limit, resets on restart and isn't shared; fine for one process.
const hits = new Map();
function limited(ip, now = Date.now()) {
  const recent = (hits.get(ip) ?? []).filter((t) => now - t < 10 * 60_000);
  recent.push(now);
  hits.set(ip, recent);
  return recent.length > 5;
}

function send(res, code, body) {
  res.writeHead(code, { "Content-Type": "application/json" });
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
  console.log("notes: all checks passed");
  process.exit(0);
}

await mkdir(path.dirname(FILE), { recursive: true });

http
  .createServer((req, res) => {
    if (req.method !== "POST" || req.url !== "/api/notes") return send(res, 404, { ok: false });

    // Caddy sets X-Forwarded-For; the IP is only used for the rate limit, never stored.
    const ip = String(req.headers["x-forwarded-for"] ?? req.socket.remoteAddress).split(",")[0].trim();
    if (limited(ip)) return send(res, 429, { ok: false });

    let raw = "";
    req.setEncoding("utf8");
    req.on("data", (chunk) => {
      raw += chunk;
      if (raw.length > 8_000) req.destroy();
    });
    req.on("end", async () => {
      let entry = null;
      try {
        entry = clean(JSON.parse(raw));
      } catch {}
      if (!entry) return send(res, 400, { ok: false });
      try {
        await appendFile(FILE, JSON.stringify(entry) + "\n");
        send(res, 200, { ok: true });
      } catch (err) {
        console.error(err);
        send(res, 500, { ok: false });
      }
    });
  })
  .listen(PORT, "127.0.0.1", () => console.log(`notes: listening on 127.0.0.1:${PORT}, writing ${FILE}`));
