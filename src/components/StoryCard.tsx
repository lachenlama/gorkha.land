import type { Song } from "../data/songs";
import { SONG_REQUEST_URL } from "../lib/config";

type Props = {
  song: Song;
  open: boolean;
  onClose: () => void;
};

export default function StoryCard({ song, open, onClose }: Props) {
  if (!open || !song.story) return null;

  return (
    <div
      className="fixed inset-0 z-40 grid place-items-center bg-[#0a1610]/70 p-4 backdrop-blur-[4px] transition-all duration-300"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label={`Story of ${song.title}`}
    >
      <div
        className="relative w-full max-w-md rotate-[-0.8deg] p-6 text-tea shadow-[0_25px_60px_rgba(0,0,0,.6)] transition-transform duration-300 sm:p-8"
        onClick={(e) => e.stopPropagation()}
        style={{
          background:
            "linear-gradient(90deg, transparent 0 38px, rgba(122,46,42,.32) 38px 39px, transparent 39px)," +
            "repeating-linear-gradient(#f4e8d7 0 30px, rgba(126,168,196,.3) 30px 31px)",
        }}
      >
        {/* Brass clip accent */}
        <div className="absolute -top-3 left-1/2 h-6 w-12 -translate-x-1/2 rounded-full border border-brass/60 bg-brass/20 shadow-sm" />

        <div className="flex items-start justify-between border-b border-tea/15 pb-3">
          <div>
            <p className="hand text-[13px] tracking-wide text-gumba">गीतको सम्झना · A Memory</p>
            <h3 className="ne text-xl text-tea">{song.titleNe}</h3>
            <p className="font-display text-[12.5px] text-tea/55 italic">
              {song.title} · {song.artist}
            </p>
          </div>
          <button
            onClick={onClose}
            aria-label="Close story"
            className="rounded-[2px] border border-tea/30 px-2.5 py-1 text-[11px] tracking-[0.08em] text-tea/70 uppercase transition hover:border-tea hover:text-tea"
          >
            Close
          </button>
        </div>

        {/* Story memory text */}
        <div className="my-5 space-y-3">
          <p className="ne text-[16px] leading-[1.8] text-tea/90">
            "{song.story.ne}"
          </p>
          <p className="font-sans text-[13px] leading-relaxed text-tea/65 italic">
            "{song.story.en}"
          </p>
        </div>

        {/* Contributor credit & journey */}
        <div className="flex items-center justify-between border-t border-tea/15 pt-3.5">
          <div>
            <p className="hand text-[15px] font-bold text-gumba">
              — {song.story.authorNe}
            </p>
            <p className="hand text-[13px] text-tea/60">
              {song.story.journeyNe} <span className="font-sans text-[11px] not-italic">({song.story.journey})</span>
            </p>
          </div>

          <a
            href={SONG_REQUEST_URL}
            target="_blank"
            rel="noreferrer"
            className="ne text-right text-[12px] text-gumba underline decoration-gumba/40 underline-offset-2 hover:decoration-gumba"
          >
            तपाईंको कथा पठाउनुहोस्
            <span className="block font-sans text-[10.5px] text-tea/50 not-italic">Share a memory</span>
          </a>
        </div>
      </div>
    </div>
  );
}
