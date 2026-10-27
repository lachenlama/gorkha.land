// Procedural Web Audio Ambient Sound Bed for gorkha.land
// Zero network requests, 100% offline, perfectly continuous, no audio file 404s.

export type AmbientMode = "rain" | "mist" | "kettle" | "off";

export interface AmbientController {
  start: () => void;
  stop: () => void;
  setMode: (mode: AmbientMode) => void;
  setDucked: (ducked: boolean) => void;
  getMode: () => AmbientMode;
}

class AmbientSoundEngine {
  private ctx: AudioContext | null = null;
  private masterGain: GainNode | null = null;
  private duckGain: GainNode | null = null;
  private currentMode: AmbientMode = "rain";
  private running = false;
  private cleanupFn: (() => void) | null = null;

  private initContext() {
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioCtx) return;
      this.ctx = new AudioCtx();
      this.masterGain = this.ctx.createGain();
      this.duckGain = this.ctx.createGain();

      this.masterGain.gain.value = 0.22;
      this.duckGain.gain.value = 0.7; // default not ducked

      this.masterGain.connect(this.duckGain);
      this.duckGain.connect(this.ctx.destination);
    }
    if (this.ctx.state === "suspended") {
      this.ctx.resume();
    }
  }

  public start(mode?: AmbientMode) {
    this.initContext();
    if (!this.ctx || !this.masterGain) return;
    if (mode) this.currentMode = mode;
    this.running = true;
    this.rebuildSound();
  }

  public stop() {
    this.running = false;
    if (this.cleanupFn) {
      this.cleanupFn();
      this.cleanupFn = null;
    }
  }

  public setMode(mode: AmbientMode) {
    this.currentMode = mode;
    if (this.running) {
      this.rebuildSound();
    }
  }

  public getMode(): AmbientMode {
    return this.currentMode;
  }

  public setDucked(ducked: boolean) {
    if (!this.ctx || !this.duckGain) return;
    const now = this.ctx.currentTime;
    const target = ducked ? 0.45 : 0.9;
    this.duckGain.gain.cancelScheduledValues(now);
    this.duckGain.gain.linearRampToValueAtTime(target, now + 1.2);
  }

  private rebuildSound() {
    if (this.cleanupFn) {
      this.cleanupFn();
      this.cleanupFn = null;
    }
    if (!this.running || this.currentMode === "off" || !this.ctx || !this.masterGain) return;

    if (this.currentMode === "rain") {
      this.cleanupFn = this.createRainOnTinSound();
    } else if (this.currentMode === "mist") {
      this.cleanupFn = this.createMountainMistSound();
    } else if (this.currentMode === "kettle") {
      this.cleanupFn = this.createKettleSound();
    }
  }

  // --- 1. Rain on Tin Roof (टिनको छानामा पानी परेको आवाज) ---
  private createRainOnTinSound(): () => void {
    const ctx = this.ctx!;
    const dest = this.masterGain!;

    // 1a. Ambient background rain roar (pink noise buffer)
    const bufferSize = ctx.sampleRate * 2;
    const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const data = buffer.getChannelData(0);
    let b0 = 0, b1 = 0, b2 = 0, b3 = 0, b4 = 0, b5 = 0, b6 = 0;
    for (let i = 0; i < bufferSize; i++) {
      const white = Math.random() * 2 - 1;
      b0 = 0.99886 * b0 + white * 0.0555179;
      b1 = 0.99332 * b1 + white * 0.0750759;
      b2 = 0.96900 * b2 + white * 0.1538520;
      b3 = 0.86650 * b3 + white * 0.3104856;
      b4 = 0.55000 * b4 + white * 0.5329522;
      b5 = -0.7616 * b5 - white * 0.0168980;
      data[i] = (b0 + b1 + b2 + b3 + b4 + b5 + b6 + white * 0.5362) * 0.04;
      b6 = white * 0.115926;
    }

    const noiseSource = ctx.createBufferSource();
    noiseSource.buffer = buffer;
    noiseSource.loop = true;

    const rainFilter = ctx.createBiquadFilter();
    rainFilter.type = "bandpass";
    rainFilter.frequency.value = 1100;
    rainFilter.Q.value = 0.7;

    const rainGain = ctx.createGain();
    rainGain.gain.value = 0.5;

    noiseSource.connect(rainFilter);
    rainFilter.connect(rainGain);
    rainGain.connect(dest);
    noiseSource.start();

    // 1b. Procedural tin roof droplet taps (stochastic resonant metallic impulses)
    let dropTimer: number | null = null;
    const triggerDrop = () => {
      if (!this.running || this.currentMode !== "rain") return;
      const now = ctx.currentTime;
      const osc = ctx.createOscillator();
      const dropGain = ctx.createGain();
      const dropFilter = ctx.createBiquadFilter();

      // Tin resonant frequencies: metallic ting with random pitch
      const freq = 1800 + Math.random() * 1600;
      osc.type = Math.random() > 0.4 ? "triangle" : "sine";
      osc.frequency.setValueAtTime(freq, now);
      osc.frequency.exponentialRampToValueAtTime(freq * 0.6, now + 0.06);

      dropFilter.type = "bandpass";
      dropFilter.frequency.value = freq;
      dropFilter.Q.value = 6.0; // ringing metallic resonance

      const peak = 0.08 + Math.random() * 0.18;
      dropGain.gain.setValueAtTime(0.001, now);
      dropGain.gain.linearRampToValueAtTime(peak, now + 0.005);
      dropGain.gain.exponentialRampToValueAtTime(0.0001, now + 0.05 + Math.random() * 0.04);

      osc.connect(dropFilter);
      dropFilter.connect(dropGain);
      dropGain.connect(dest);

      osc.start(now);
      osc.stop(now + 0.12);

      const nextDelay = 35 + Math.random() * 120;
      dropTimer = window.setTimeout(triggerDrop, nextDelay);
    };

    dropTimer = window.setTimeout(triggerDrop, 50);

    return () => {
      if (dropTimer) clearTimeout(dropTimer);
      try {
        noiseSource.stop();
        noiseSource.disconnect();
      } catch (_) {}
    };
  }

  // --- 2. Mountain Mist & Pine Wind (पहाडी कुहिरो र हावा) ---
  private createMountainMistSound(): () => void {
    const ctx = this.ctx!;
    const dest = this.masterGain!;

    const bufferSize = ctx.sampleRate * 3;
    const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const data = buffer.getChannelData(0);
    let lastOut = 0.0;
    for (let i = 0; i < bufferSize; i++) {
      const white = Math.random() * 2 - 1;
      data[i] = (lastOut + 0.02 * white) / 1.02;
      lastOut = data[i];
      data[i] *= 3.5;
    }

    const source = ctx.createBufferSource();
    source.buffer = buffer;
    source.loop = true;

    const filter = ctx.createBiquadFilter();
    filter.type = "lowpass";
    filter.frequency.value = 360;

    // Slow wind modulation LFO
    const lfo = ctx.createOscillator();
    const lfoGain = ctx.createGain();
    lfo.frequency.value = 0.15; // 6-7 second wind gust cycles
    lfoGain.gain.value = 180;
    lfo.connect(lfoGain);
    lfoGain.connect(filter.frequency);
    lfo.start();

    const gain = ctx.createGain();
    gain.gain.value = 0.65;

    source.connect(filter);
    filter.connect(gain);
    gain.connect(dest);
    source.start();

    return () => {
      try {
        lfo.stop();
        source.stop();
        source.disconnect();
      } catch (_) {}
    };
  }

  // --- 3. Tea Stall & Simmering Kettle (चियाको कित्ली) ---
  private createKettleSound(): () => void {
    const ctx = this.ctx!;
    const dest = this.masterGain!;

    // Steam hiss (high-passed noise)
    const bufferSize = ctx.sampleRate * 2;
    const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      data[i] = (Math.random() * 2 - 1) * 0.06;
    }

    const source = ctx.createBufferSource();
    source.buffer = buffer;
    source.loop = true;

    const filter = ctx.createBiquadFilter();
    filter.type = "bandpass";
    filter.frequency.value = 2400;
    filter.Q.value = 2.0;

    const gain = ctx.createGain();
    gain.gain.value = 0.35;

    source.connect(filter);
    filter.connect(gain);
    gain.connect(dest);
    source.start();

    return () => {
      try {
        source.stop();
        source.disconnect();
      } catch (_) {}
    };
  }
}

export const ambientEngine = new AmbientSoundEngine();
