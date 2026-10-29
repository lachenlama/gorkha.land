// Three synthesized sounds (ux-spec §3). No audio files; nothing exists until the CTA tap.

const NOTES = [659, 740, 831, 988, 1109]; // E-major pentatonic: a growing network climbs the scale
const GAIN = 0.18;

export function createSound(ctx: AudioContext) {
  const master = ctx.createGain();
  master.gain.value = GAIN;
  master.connect(ctx.destination);

  const buf = ctx.createBuffer(1, ctx.sampleRate * 2, ctx.sampleRate);
  const d = buf.getChannelData(0);
  for (let i = 0; i < d.length; i++) d[i] = Math.random() * 2 - 1;
  const noise = () => {
    const n = ctx.createBufferSource();
    n.buffer = buf;
    n.loop = true;
    return n;
  };

  let muted = false;
  let lastWhistle = -9;

  /** A sine through its own gain envelope: linear attack, exponential decay. */
  const tone = (hz: number, peak: number, at: number, attack: number, decay: number) => {
    const o = ctx.createOscillator();
    const g = ctx.createGain();
    o.frequency.value = hz;
    g.gain.setValueAtTime(0, at);
    g.gain.linearRampToValueAtTime(peak, at + attack);
    g.gain.exponentialRampToValueAtTime(0.0001, at + attack + decay);
    o.connect(g).connect(master);
    o.start(at);
    o.stop(at + attack + decay + 0.05);
  };

  return {
    /** A lamp comes on. `step` is the group size - 1, so bigger networks sing higher. */
    chime(step: number) {
      if (muted) return;
      const t = ctx.currentTime;
      const hz = NOTES[step % NOTES.length] * 2 ** ((Math.random() * 20 - 10) / 1200);
      tone(hz, 0.3, t, 0.005, 0.9);
      tone(hz * 1.5, 0.12, t, 0.005, 0.9);
    },

    /** The toy train: two ridges joined, a lamp on the rail, a gust survived. */
    whistle() {
      const t = ctx.currentTime;
      if (muted || t - lastWhistle < 2.5) return;
      lastWhistle = t;
      const band = ctx.createBiquadFilter();
      band.type = "bandpass";
      band.frequency.value = 1200;
      band.Q.value = 2;
      const env = ctx.createGain();
      env.gain.setValueAtTime(0, t);
      env.gain.linearRampToValueAtTime(0.08, t + 0.08);
      env.gain.setValueAtTime(0.08, t + 0.43);
      env.gain.linearRampToValueAtTime(0, t + 0.83);
      env.connect(band).connect(master);
      for (const hz of [587, 740, 880]) {
        const o = ctx.createOscillator();
        o.frequency.value = hz;
        o.frequency.setValueAtTime(hz, t + 0.43);
        o.frequency.exponentialRampToValueAtTime(hz * 0.97, t + 0.83);
        o.connect(env);
        o.start(t);
        o.stop(t + 0.9);
      }
      const breath = ctx.createGain();
      breath.gain.value = 0.1;
      const n = noise();
      n.connect(breath).connect(env);
      n.start(t);
      n.stop(t + 0.9);
    },

    /** Wind through the ridge: a gust (1600 ms) or one lamp snuffed (500 ms). */
    wind(ms: number) {
      if (muted) return;
      const t = ctx.currentTime;
      const s = ms / 1000;
      const band = ctx.createBiquadFilter();
      band.type = "bandpass";
      band.Q.value = 0.7;
      band.frequency.setValueAtTime(300, t);
      band.frequency.linearRampToValueAtTime(900, t + s / 2);
      band.frequency.linearRampToValueAtTime(300, t + s);
      const g = ctx.createGain();
      g.gain.setValueAtTime(0, t);
      g.gain.linearRampToValueAtTime(0.12, t + s / 2);
      g.gain.linearRampToValueAtTime(0, t + s);
      const n = noise();
      n.connect(band).connect(g).connect(master);
      n.start(t);
      n.stop(t + s + 0.05);
    },

    setMuted(m: boolean) {
      muted = m;
      master.gain.setTargetAtTime(m ? 0 : GAIN, ctx.currentTime, 0.02);
    },
  };
}

export type Sound = ReturnType<typeof createSound>;
