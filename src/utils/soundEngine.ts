// Synthesized Web Audio API sound engine for the Gothic & Storybook Birthday Experience
// Produces gentle breath/wind whoosh, candle crackle, music-box chimes, door creak & unlock,
// and playful silly cartoon sound effects (bubble pop, boing, slide whistle, dice roll, mystic hum, treasure fanfare).

class SoundEngine {
  private ctx: AudioContext | null = null;
  private isMuted: boolean = false;
  private ambientInterval: number | null = null;
  private isAmbientPlaying: boolean = false;

  private getContext(): AudioContext | null {
    if (this.isMuted) return null;
    if (!this.ctx && typeof window !== 'undefined') {
      const AudioCtx =
        window.AudioContext ||
        (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume().catch(() => {});
    }
    return this.ctx;
  }

  public setMuted(muted: boolean) {
    this.isMuted = muted;
    if (muted) {
      this.stopAmbientMusicBox();
    }
  }

  public getMuted(): boolean {
    return this.isMuted;
  }

  // Gentle breath / wind gust sound + magical shimmer when blowing out the candles
  public playCandleBlow() {
    const ctx = this.getContext();
    if (!ctx) return;

    const now = ctx.currentTime;

    const duration = 1.45;
    const bufferSize = ctx.sampleRate * duration;
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

    const noise = ctx.createBufferSource();
    noise.buffer = buffer;

    const filter = ctx.createBiquadFilter();
    filter.type = 'bandpass';
    filter.frequency.setValueAtTime(320, now);
    filter.frequency.exponentialRampToValueAtTime(680, now + 0.35);
    filter.frequency.exponentialRampToValueAtTime(220, now + duration);
    filter.Q.value = 1.4;

    const noiseGain = ctx.createGain();
    noiseGain.gain.setValueAtTime(0.001, now);
    noiseGain.gain.linearRampToValueAtTime(0.28, now + 0.22);
    noiseGain.gain.exponentialRampToValueAtTime(0.001, now + duration);

    noise.connect(filter);
    filter.connect(noiseGain);
    noiseGain.connect(ctx.destination);
    noise.start(now);
    noise.stop(now + duration);

    const notes = [523.25, 659.25, 783.99, 987.77, 1174.66, 1318.51];
    notes.forEach((freq, idx) => {
      const startTime = now + 0.35 + idx * 0.11;
      this.playChimeNote(freq, startTime, 1.8, 0.055);
    });
  }

  // Play a single delicate music-box bell note
  public playChimeNote(freq: number, startTime?: number, duration = 1.5, volume = 0.06) {
    const ctx = this.getContext();
    if (!ctx) return;

    const start = startTime ?? ctx.currentTime;
    const osc = ctx.createOscillator();
    const overtone = ctx.createOscillator();
    const gain = ctx.createGain();
    const overtoneGain = ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(freq, start);

    overtone.type = 'triangle';
    overtone.frequency.setValueAtTime(freq * 2, start);

    gain.gain.setValueAtTime(0.0001, start);
    gain.gain.linearRampToValueAtTime(volume, start + 0.02);
    gain.gain.exponentialRampToValueAtTime(0.0001, start + duration);

    overtoneGain.gain.setValueAtTime(0.0001, start);
    overtoneGain.gain.linearRampToValueAtTime(volume * 0.25, start + 0.015);
    overtoneGain.gain.exponentialRampToValueAtTime(0.0001, start + duration * 0.45);

    osc.connect(gain);
    overtone.connect(overtoneGain);
    gain.connect(ctx.destination);
    overtoneGain.connect(ctx.destination);

    osc.start(start);
    overtone.start(start);
    osc.stop(start + duration);
    overtone.stop(start + duration);
  }

  // Mystery door unlock & swing open sound
  public playDoorOpen(doorIndex: number) {
    const ctx = this.getContext();
    if (!ctx) return;

    const now = ctx.currentTime;
    const baseFreqs = [
      [440, 554.37, 659.25, 880],
      [392, 493.88, 587.33, 739.99],
      [523.25, 659.25, 783.99, 1046.5],
    ];
    const chord = baseFreqs[doorIndex % baseFreqs.length];

    const woodOsc = ctx.createOscillator();
    const woodGain = ctx.createGain();
    woodOsc.type = 'sine';
    woodOsc.frequency.setValueAtTime(110, now);
    woodOsc.frequency.exponentialRampToValueAtTime(65, now + 0.35);
    woodGain.gain.setValueAtTime(0.001, now);
    woodGain.gain.linearRampToValueAtTime(0.08, now + 0.04);
    woodGain.gain.exponentialRampToValueAtTime(0.001, now + 0.4);
    woodOsc.connect(woodGain);
    woodGain.connect(ctx.destination);
    woodOsc.start(now);
    woodOsc.stop(now + 0.4);

    chord.forEach((freq, i) => {
      this.playChimeNote(freq, now + 0.08 + i * 0.09, 1.6, 0.05);
    });
  }

  // Subtle sparkle / tap chime
  public playSparkle() {
    const ctx = this.getContext();
    if (!ctx) return;
    const now = ctx.currentTime;
    const freqs = [783.99, 1046.5, 1318.51];
    freqs.forEach((f, i) => {
      this.playChimeNote(f, now + i * 0.06, 0.9, 0.045);
    });
  }

  // Silly Cartoon "Boing" Spring Sound (for funny roasts & ridiculous challenges)
  public playBoing() {
    const ctx = this.getContext();
    if (!ctx) return;
    const now = ctx.currentTime;

    const osc = ctx.createOscillator();
    const lfo = ctx.createOscillator();
    const lfoGain = ctx.createGain();
    const gain = ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(160, now);
    osc.frequency.exponentialRampToValueAtTime(520, now + 0.18);
    osc.frequency.exponentialRampToValueAtTime(280, now + 0.48);

    lfo.frequency.setValueAtTime(24, now);
    lfoGain.gain.setValueAtTime(45, now);
    lfo.connect(lfoGain);
    lfoGain.connect(osc.frequency);

    gain.gain.setValueAtTime(0.001, now);
    gain.gain.linearRampToValueAtTime(0.11, now + 0.03);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.52);

    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start(now);
    lfo.start(now);
    osc.stop(now + 0.52);
    lfo.stop(now + 0.52);
  }

  // Bubbling Potion Pop Sound (for Potion Bottle)
  public playBubblePop() {
    const ctx = this.getContext();
    if (!ctx) return;
    const now = ctx.currentTime;

    const bubbleStartFreqs = [280, 360, 440, 560, 680];
    bubbleStartFreqs.forEach((baseF, idx) => {
      const t = now + idx * 0.075;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(baseF, t);
      osc.frequency.exponentialRampToValueAtTime(baseF * 2.1, t + 0.07);

      gain.gain.setValueAtTime(0.001, t);
      gain.gain.linearRampToValueAtTime(0.08, t + 0.015);
      gain.gain.exponentialRampToValueAtTime(0.0001, t + 0.085);

      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(t);
      osc.stop(t + 0.09);
    });
  }

  // Magical Dice Roll Clatter + Ding (for Dice)
  public playDiceRoll() {
    const ctx = this.getContext();
    if (!ctx) return;
    const now = ctx.currentTime;

    // 5 quick wooden clicks
    for (let i = 0; i < 5; i++) {
      const t = now + i * 0.065;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(320 + (i % 3) * 140, t);
      osc.frequency.exponentialRampToValueAtTime(110, t + 0.04);

      gain.gain.setValueAtTime(0.09, t);
      gain.gain.exponentialRampToValueAtTime(0.001, t + 0.045);

      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(t);
      osc.stop(t + 0.05);
    }

    // Victory chime at end of roll
    this.playChimeNote(880, now + 0.34, 1.1, 0.065);
    this.playChimeNote(1174.66, now + 0.42, 1.3, 0.065);
  }

  // Mystic Crystal Ball Shimmer Hum (for Crystal Ball)
  public playMysticOracle() {
    const ctx = this.getContext();
    if (!ctx) return;
    const now = ctx.currentTime;

    const freqs = [440, 554.37, 659.25, 830.61, 1108.73];
    freqs.forEach((f, i) => {
      this.playChimeNote(f, now + i * 0.08, 1.6, 0.045);
    });
  }

  // Silly Slide Whistle Up/Down (for Unexpected Virtual Gifts / Roasts)
  public playSlideWhistle() {
    const ctx = this.getContext();
    if (!ctx) return;
    const now = ctx.currentTime;

    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(380, now);
    osc.frequency.exponentialRampToValueAtTime(1250, now + 0.25);
    osc.frequency.exponentialRampToValueAtTime(520, now + 0.48);
    osc.frequency.exponentialRampToValueAtTime(980, now + 0.62);

    gain.gain.setValueAtTime(0.001, now);
    gain.gain.linearRampToValueAtTime(0.08, now + 0.04);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.65);

    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start(now);
    osc.stop(now + 0.66);
  }

  // Royal Treasure Chest Fanfare
  public playTreasureFanfare() {
    const ctx = this.getContext();
    if (!ctx) return;
    const now = ctx.currentTime;
    const notes = [523.25, 659.25, 783.99, 1046.5];
    notes.forEach((f, i) => {
      const delay = i === 3 ? 0.32 : i * 0.09;
      const dur = i === 3 ? 1.6 : 0.45;
      this.playChimeNote(f, now + delay, dur, 0.07);
    });
  }

  // Optional gentle gothic waltz music-box loop
  public toggleAmbientMusicBox(): boolean {
    if (this.isAmbientPlaying) {
      this.stopAmbientMusicBox();
      return false;
    } else {
      this.startAmbientMusicBox();
      return true;
    }
  }

  public startAmbientMusicBox() {
    if (this.isAmbientPlaying) return;
    const ctx = this.getContext();
    if (!ctx) return;

    this.isAmbientPlaying = true;
    const melody = [
      440.0, 659.25, 587.33, 523.25, 493.88, 392.0, 349.23, 523.25, 493.88, 440.0, 392.0, 329.63,
      440.0, 659.25, 783.99, 698.46, 659.25, 587.33, 523.25, 493.88, 440.0, 329.63, 440.0, 523.25,
    ];
    let step = 0;

    const playStep = () => {
      if (!this.isAmbientPlaying || this.isMuted) return;
      const freq = melody[step % melody.length];
      this.playChimeNote(freq, undefined, 1.4, 0.028);
      if (step % 3 === 0) {
        this.playChimeNote(freq * 0.5, undefined, 1.9, 0.02);
      }
      step++;
    };

    playStep();
    this.ambientInterval = window.setInterval(playStep, 650);
  }

  public stopAmbientMusicBox() {
    this.isAmbientPlaying = false;
    if (this.ambientInterval !== null) {
      clearInterval(this.ambientInterval);
      this.ambientInterval = null;
    }
  }
}

export const soundEngine = new SoundEngine();
