# gorkha.land

The brand site for the Darjeeling hills: a single page at `src/site/`, plus a small notes
server at `server/notes.mjs`. The plans live in `roadmap.md` (Jamghat) and `brand.md`.
The old music room in `src/App.tsx` and `src/components/` is no longer used by the site.

## Nepali text: required reading

**Any Nepali you write (in the UI, the site, notifications, social posts or docs) must
follow [lingo.md](lingo.md).** In short:

- Write **Darjeeling-hills Nepali, not Kathmandu Nepali**: दोकान not पसल, कुइरो not
  कुहिरो, ठिटाठिटी not युवा, …नुस् not …नुहोस्.
- **Never use Nepal's calendar** (no Bikram Sambat dates such as "Kartik 2083"), and
  never present the hills as part of Nepal.
- Identity, not agitation: no party politics or slogans.
- Write numbers in Latin digits.

## Facts on public pages

Every number shown on the site must be the latest available and checked against a
primary source (a government answer, the census, an official dataset), with the source
cited on the page. If you can't verify a number, leave it out.

## Commands

- `npm run dev` runs the site. Run `npm run notes` in a second terminal so the note form
  works locally.
- `npm run build` type-checks and builds.
- `node server/notes.mjs check` runs the notes server's self-check.
