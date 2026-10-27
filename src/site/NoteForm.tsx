import { useState } from "react";

// Keep these in sync with server/notes.mjs, which rejects anything else.
export const ROLES = {
  student: "Student / Gen Z",
  business: "Café or business owner",
  away: "Away from home",
  creator: "Creator or builder",
  other: "Something else",
} as const;
export type Role = keyof typeof ROLES;

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

const PROMPTS = ["The hills need…", "A café I love is…", "I could help with…", "I wish there was an app for…"];

type Status = "idle" | "sending" | "sent" | "error";

const field =
  "w-full rounded-xl border border-cream/15 bg-ink/60 px-4 py-3 text-cream placeholder:text-cream/30 focus:border-lamp focus:ring-1 focus:ring-lamp focus:outline-none";

export default function NoteForm({ role, onRole }: { role: Role | ""; onRole: (r: Role) => void }) {
  const [note, setNote] = useState("");
  const [name, setName] = useState("");
  const [place, setPlace] = useState("");
  const [contact, setContact] = useState("");
  const [consent, setConsent] = useState(false);
  const [status, setStatus] = useState<Status>("idle");

  const submit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setStatus("sending");
    const website = (e.currentTarget.elements.namedItem("website") as HTMLInputElement).value;
    try {
      const res = await fetch("/api/notes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ note, name, place, role, contact, consent, website }),
      });
      setStatus(res.ok ? "sent" : "error");
    } catch {
      setStatus("error");
    }
  };

  if (status === "sent") {
    return (
      <div className="paper rounded-sm px-8 py-14 text-center" role="status">
        <p className="ne text-4xl text-gumba">धन्यवाद।</p>
        <p className="ne mt-4 text-xl">तपाईंको कुरा पहाडसम्म पुग्यो।</p>
        <p className="mt-2 text-ink/60">Your words reached the hills. We'll read it soon.</p>
        <button
          onClick={() => {
            setNote("");
            setStatus("idle");
          }}
          className="mt-8 text-sm text-ink/70 underline underline-offset-4 hover:text-ink"
        >
          Leave another note
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={submit} className="space-y-6 rounded-2xl border border-cream/10 bg-ink/40 p-6 md:p-8">
      <fieldset>
        <legend className="mb-3 text-sm text-cream/60">I am…</legend>
        <div className="flex flex-wrap gap-2">
          {(Object.keys(ROLES) as Role[]).map((r) => (
            <button
              key={r}
              type="button"
              onClick={() => onRole(r)}
              aria-pressed={role === r}
              className={`rounded-full border px-4 py-1.5 text-sm transition ${
                role === r ? "border-lamp bg-lamp text-ink" : "border-cream/20 text-cream/70 hover:border-cream/50"
              }`}
            >
              {ROLES[r]}
            </button>
          ))}
        </div>
      </fieldset>

      <div>
        <label htmlFor="note" className="mb-2 block text-sm text-cream/60">
          Your note <span className="text-lamp">*</span>
        </label>
        <textarea
          id="note"
          required
          minLength={3}
          maxLength={1000}
          rows={6}
          value={note}
          onChange={(e) => setNote(e.target.value)}
          placeholder="नेपाली वा English मा लेख्नुस्…"
          className={`${field} resize-y leading-relaxed`}
        />
        <div className="mt-2 flex flex-wrap items-center justify-between gap-2">
          <div className="flex flex-wrap gap-2">
            {PROMPTS.map((p) => (
              <button
                key={p}
                type="button"
                onClick={() => setNote((n) => (n ? n : p + " "))}
                className="rounded-full bg-cream/5 px-3 py-1 text-xs text-cream/55 transition hover:bg-cream/10 hover:text-cream"
              >
                {p}
              </button>
            ))}
          </div>
          <span className="text-xs text-cream/35">{note.length}/1000</span>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label htmlFor="name" className="mb-2 block text-sm text-cream/60">
            Name <span className="text-cream/35">(optional)</span>
          </label>
          <input id="name" maxLength={80} value={name} onChange={(e) => setName(e.target.value)} className={field} />
        </div>
        <div>
          <label htmlFor="place" className="mb-2 block text-sm text-cream/60">
            Where are you?
          </label>
          <select id="place" value={place} onChange={(e) => setPlace(e.target.value)} className={field}>
            <option value="">Choose…</option>
            {PLACES.map((p) => (
              <option key={p}>{p}</option>
            ))}
          </select>
        </div>
      </div>

      <div>
        <label htmlFor="contact" className="mb-2 block text-sm text-cream/60">
          Want a reply? Email, phone or Instagram <span className="text-cream/35">(optional)</span>
        </label>
        <input
          id="contact"
          maxLength={120}
          value={contact}
          onChange={(e) => setContact(e.target.value)}
          className={field}
        />
        {contact && (
          <label className="mt-3 flex items-start gap-3 text-sm text-cream/60">
            <input
              type="checkbox"
              checked={consent}
              onChange={(e) => setConsent(e.target.checked)}
              required
              className="mt-1 accent-[var(--color-lamp)]"
            />
            You can contact me about this note. You'll only use these details to reply, and you'll delete them if I
            ask.
          </label>
        )}
      </div>

      {/* Honeypot: hidden from people, filled in by bots. */}
      <input name="website" tabIndex={-1} autoComplete="off" className="hidden" aria-hidden />

      <div className="flex flex-wrap items-center gap-4">
        <button
          type="submit"
          disabled={status === "sending"}
          className="rounded-full bg-lamp px-7 py-3 font-medium text-ink transition hover:bg-cream disabled:opacity-60"
        >
          {status === "sending" ? "Sending…" : "Send to the hills"}
        </button>
        {status === "error" && (
          <p className="text-sm text-lamp" role="alert">
            That didn't go through. Please try again in a moment.
          </p>
        )}
      </div>
      <p className="text-xs text-cream/35">
        Notes are read by the gorkha.land team. We never publish one without asking you first.
      </p>
    </form>
  );
}
