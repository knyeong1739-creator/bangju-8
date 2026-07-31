// Web Audio API Retro Sound Effects & BGM Synthesizer

class RetroAudioManager {
  private ctx: AudioContext | null = null;
  private bgmGain: GainNode | null = null;
  private isBgmPlaying = false;
  private bgmInterval: number | null = null;
  private isMuted = false;

  private getContext(): AudioContext | null {
    if (typeof window === 'undefined') return null;
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
    return this.ctx;
  }

  public toggleMute(): boolean {
    this.isMuted = !this.isMuted;
    if (this.isMuted && this.isBgmPlaying) {
      this.stopBgm();
    }
    return this.isMuted;
  }

  public getMuted(): boolean {
    return this.isMuted;
  }

  public playClick() {
    if (this.isMuted) return;
    const ctx = this.getContext();
    if (!ctx) return;

    try {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(600, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(300, ctx.currentTime + 0.05);

      gain.gain.setValueAtTime(0.15, ctx.currentTime);
      gain.gain.linearRampToValueAtTime(0.01, ctx.currentTime + 0.05);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start();
      osc.stop(ctx.currentTime + 0.05);
    } catch {
      // ignore
    }
  }

  public playOliveChime() {
    if (this.isMuted) return;
    const ctx = this.getContext();
    if (!ctx) return;

    try {
      const now = ctx.currentTime;
      const notes = [523.25, 659.25, 783.99, 1046.50]; // C5, E5, G5, C6
      notes.forEach((freq, idx) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, now + idx * 0.08);

        gain.gain.setValueAtTime(0, now + idx * 0.08);
        gain.gain.linearRampToValueAtTime(0.2, now + idx * 0.08 + 0.02);
        gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.08 + 0.25);

        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.start(now + idx * 0.08);
        osc.stop(now + idx * 0.08 + 0.25);
      });
    } catch {
      // ignore
    }
  }

  public playFanfare() {
    if (this.isMuted) return;
    const ctx = this.getContext();
    if (!ctx) return;

    try {
      const now = ctx.currentTime;
      const arpeggio = [440, 554.37, 659.25, 880, 1108.73, 1318.51]; // A major
      arpeggio.forEach((freq, idx) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'square';
        osc.frequency.setValueAtTime(freq, now + idx * 0.06);

        gain.gain.setValueAtTime(0.1, now + idx * 0.06);
        gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.06 + 0.3);

        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.start(now + idx * 0.06);
        osc.stop(now + idx * 0.06 + 0.3);
      });
    } catch {
      // ignore
    }
  }

  public playAnimalSound(speciesId: string) {
    if (this.isMuted) return;
    const ctx = this.getContext();
    if (!ctx) return;

    try {
      const now = ctx.currentTime;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      switch (speciesId) {
        case 'dog': // Woof
          osc.type = 'sawtooth';
          osc.frequency.setValueAtTime(300, now);
          osc.frequency.exponentialRampToValueAtTime(150, now + 0.15);
          gain.gain.setValueAtTime(0.2, now);
          gain.gain.linearRampToValueAtTime(0.01, now + 0.15);
          osc.connect(gain);
          gain.connect(ctx.destination);
          osc.start(now);
          osc.stop(now + 0.15);
          break;

        case 'cat': // Meow
          osc.type = 'sine';
          osc.frequency.setValueAtTime(500, now);
          osc.frequency.linearRampToValueAtTime(750, now + 0.2);
          osc.frequency.linearRampToValueAtTime(450, now + 0.4);
          gain.gain.setValueAtTime(0.15, now);
          gain.gain.linearRampToValueAtTime(0.01, now + 0.4);
          osc.connect(gain);
          gain.connect(ctx.destination);
          osc.start(now);
          osc.stop(now + 0.4);
          break;

        case 'sparrow': // Chirp
          osc.type = 'sine';
          osc.frequency.setValueAtTime(1200, now);
          osc.frequency.linearRampToValueAtTime(1800, now + 0.08);
          gain.gain.setValueAtTime(0.15, now);
          gain.gain.linearRampToValueAtTime(0.01, now + 0.08);
          osc.connect(gain);
          gain.connect(ctx.destination);
          osc.start(now);
          osc.stop(now + 0.08);
          break;

        case 'bear': // Roar
          osc.type = 'triangle';
          osc.frequency.setValueAtTime(120, now);
          osc.frequency.linearRampToValueAtTime(80, now + 0.35);
          gain.gain.setValueAtTime(0.3, now);
          gain.gain.linearRampToValueAtTime(0.01, now + 0.35);
          osc.connect(gain);
          gain.connect(ctx.destination);
          osc.start(now);
          osc.stop(now + 0.35);
          break;

        default: // Generic chime
          this.playOliveChime();
          break;
      }
    } catch {
      // ignore
    }
  }

  public startBgm(): boolean {
    if (this.isBgmPlaying) return true;
    if (this.isMuted) return false;
    const ctx = this.getContext();
    if (!ctx) return false;

    this.isBgmPlaying = true;

    // Gentle 8-bit / Kalimba Cyworld Minihompy Nostalgia Melody
    const melody = [
      { note: 523.25, duration: 0.4 }, // C5
      { note: 659.25, duration: 0.4 }, // E5
      { note: 783.99, duration: 0.4 }, // G5
      { note: 880.00, duration: 0.8 }, // A5
      { note: 783.99, duration: 0.4 }, // G5
      { note: 659.25, duration: 0.4 }, // E5
      { note: 523.25, duration: 0.8 }, // C5
      { note: 587.33, duration: 0.4 }, // D5
      { note: 659.25, duration: 0.4 }, // E5
      { note: 698.46, duration: 0.4 }, // F5
      { note: 659.25, duration: 0.4 }, // E5
      { note: 587.33, duration: 0.8 }, // D5
    ];

    let noteIndex = 0;
    const playNextNote = () => {
      if (!this.isBgmPlaying || this.isMuted) return;
      const currentCtx = this.getContext();
      if (!currentCtx) return;

      const item = melody[noteIndex % melody.length];
      noteIndex++;

      try {
        const osc = currentCtx.createOscillator();
        const gain = currentCtx.createGain();

        osc.type = 'sine';
        osc.frequency.setValueAtTime(item.note, currentCtx.currentTime);

        gain.gain.setValueAtTime(0.04, currentCtx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, currentCtx.currentTime + item.duration * 0.9);

        osc.connect(gain);
        gain.connect(currentCtx.destination);

        osc.start(currentCtx.currentTime);
        osc.stop(currentCtx.currentTime + item.duration * 0.9);
      } catch {
        // ignore
      }
    };

    playNextNote();
    this.bgmInterval = window.setInterval(playNextNote, 500);
    return true;
  }

  public stopBgm() {
    this.isBgmPlaying = false;
    if (this.bgmInterval) {
      clearInterval(this.bgmInterval);
      this.bgmInterval = null;
    }
  }

  public getIsBgmPlaying(): boolean {
    return this.isBgmPlaying;
  }
}

export const audioManager = new RetroAudioManager();
