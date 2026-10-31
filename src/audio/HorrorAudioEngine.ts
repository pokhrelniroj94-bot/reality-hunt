import { PlayerSettings } from '../types/game';

export class HorrorAudioEngine {
  private static instance: HorrorAudioEngine;
  private ctx: AudioContext | null = null;

  // Master Gain & Busses
  private masterGain: GainNode | null = null;
  private ambientGain: GainNode | null = null;
  private sfxGain: GainNode | null = null;
  private heartbeatGain: GainNode | null = null;

  // Active Sound Nodes
  private droneOsc1: OscillatorNode | null = null;
  private droneOsc2: OscillatorNode | null = null;
  private droneFilter: BiquadFilterNode | null = null;
  private lfo: OscillatorNode | null = null;
  private lfoGain: GainNode | null = null;

  // Dynamic Heartbeat System
  private heartbeatTimer: number | null = null;
  private currentBpm: number = 65;
  private isHeartbeatActive: boolean = false;

  // Static Generator System
  private staticNode: AudioBufferSourceNode | null = null;
  private staticGainNode: GainNode | null = null;

  // Geiger Counter System
  private geigerInterval: number | null = null;
  private geigerRateMs: number | null = null;

  private isMuted: boolean = false;
  private settings: PlayerSettings | null = null;

  private constructor() {}

  public static getInstance(): HorrorAudioEngine {
    if (!HorrorAudioEngine.instance) {
      HorrorAudioEngine.instance = new HorrorAudioEngine();
    }
    return HorrorAudioEngine.instance;
  }

  public init(settings: PlayerSettings): void {
    this.settings = settings;
    if (this.ctx) return;

    try {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioCtx) {
        console.warn('Web Audio API not supported on this device');
        return;
      }
      this.ctx = new AudioCtx();

      // Master bus
      this.masterGain = this.ctx.createGain();
      this.masterGain.gain.setValueAtTime(settings.masterVolume, this.ctx.currentTime);
      this.masterGain.connect(this.ctx.destination);

      // Sub-busses
      this.ambientGain = this.ctx.createGain();
      this.ambientGain.gain.setValueAtTime(settings.ambientVolume, this.ctx.currentTime);
      this.ambientGain.connect(this.masterGain);

      this.sfxGain = this.ctx.createGain();
      this.sfxGain.gain.setValueAtTime(settings.sfxVolume, this.ctx.currentTime);
      this.sfxGain.connect(this.masterGain);

      this.heartbeatGain = this.ctx.createGain();
      this.heartbeatGain.gain.setValueAtTime(settings.heartbeatVolume, this.ctx.currentTime);
      this.heartbeatGain.connect(this.masterGain);

      this.startAmbientDrone();
    } catch (e) {
      console.warn('Audio initialization deferred until user gesture', e);
    }
  }

  public resumeAudioContext(): void {
    if (this.ctx && this.ctx.state === 'suspended') {
      void this.ctx.resume().catch((error) => {
        console.warn('Unable to resume audio context', error);
      });
    }
  }

  // Atmospheric Sub-bass Drone
  public startAmbientDrone(): void {
    if (!this.ctx || !this.ambientGain) return;
    this.stopAmbientDrone();

    try {
      const now = this.ctx.currentTime;

      // Filter
      this.droneFilter = this.ctx.createBiquadFilter();
      this.droneFilter.type = 'lowpass';
      this.droneFilter.frequency.setValueAtTime(140, now);
      this.droneFilter.Q.setValueAtTime(3.5, now);
      this.droneFilter.connect(this.ambientGain);

      // Osc 1 (Sub 46Hz)
      this.droneOsc1 = this.ctx.createOscillator();
      this.droneOsc1.type = 'sawtooth';
      this.droneOsc1.frequency.setValueAtTime(46, now);

      // Osc 2 (Detuned 47.8Hz for natural beating tension)
      this.droneOsc2 = this.ctx.createOscillator();
      this.droneOsc2.type = 'triangle';
      this.droneOsc2.frequency.setValueAtTime(47.8, now);

      // LFO for breathing filter modulation
      this.lfo = this.ctx.createOscillator();
      this.lfo.frequency.setValueAtTime(0.15, now); // Slow cycle
      this.lfoGain = this.ctx.createGain();
      this.lfoGain.gain.setValueAtTime(45, now);
      this.lfo.connect(this.lfoGain);
      this.lfoGain.connect(this.droneFilter.frequency);

      this.droneOsc1.connect(this.droneFilter);
      this.droneOsc2.connect(this.droneFilter);

      this.droneOsc1.start();
      this.droneOsc2.start();
      this.lfo.start();
    } catch (err) {
      console.warn('Failed starting ambient drone', err);
    }
  }

  public stopAmbientDrone(): void {
    if (this.droneOsc1) {
      try { this.droneOsc1.stop(); this.droneOsc1.disconnect(); } catch {}
      this.droneOsc1 = null;
    }
    if (this.droneOsc2) {
      try { this.droneOsc2.stop(); this.droneOsc2.disconnect(); } catch {}
      this.droneOsc2 = null;
    }
    if (this.lfo) {
      try { this.lfo.stop(); } catch {}
      try { this.lfo.disconnect(); } catch {}
      this.lfo = null;
    }

    if (this.lfoGain) {
      try { this.lfoGain.disconnect(); } catch {}
      this.lfoGain = null;
    }

    if (this.droneFilter) {
      try { this.droneFilter.disconnect(); } catch {}
      this.droneFilter = null;
    }
  }

  // Dynamic Heartbeat System
  public setHeartbeatIntensity(fearLevel: number): void {
    // fearLevel: 0 (calm) to 1.0 (terror)
    const targetBpm = Math.round(60 + fearLevel * 85); // 60 to 145 BPM
    this.currentBpm = targetBpm;

    if (fearLevel > 0.15 && !this.isHeartbeatActive) {
      this.startHeartbeatLoop();
    } else if (fearLevel <= 0.15 && this.isHeartbeatActive) {
      this.stopHeartbeatLoop();
    }
  }

  private startHeartbeatLoop(): void {
    this.isHeartbeatActive = true;
    const triggerStroke = () => {
      if (!this.isHeartbeatActive) return;
      this.playHeartbeatDoublePulse();
      const intervalMs = (60 / this.currentBpm) * 1000;
      this.heartbeatTimer = window.setTimeout(triggerStroke, intervalMs);
    };
    triggerStroke();
  }

  private stopHeartbeatLoop(): void {
    this.isHeartbeatActive = false;
    if (this.heartbeatTimer !== null) {
      clearTimeout(this.heartbeatTimer);
      this.heartbeatTimer = null;
    }
  }

  private playHeartbeatDoublePulse(): void {
    if (!this.ctx || !this.heartbeatGain) return;

    const playThump = (delaySec: number, pitchHz: number, gainVal: number) => {
      if (!this.ctx || !this.heartbeatGain) return;
      const t = this.ctx.currentTime + delaySec;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(pitchHz, t);
      osc.frequency.exponentialRampToValueAtTime(30, t + 0.12);

      gain.gain.setValueAtTime(gainVal, t);
      gain.gain.exponentialRampToValueAtTime(0.001, t + 0.14);

      osc.connect(gain);
      gain.connect(this.heartbeatGain);

      osc.start(t);
      osc.stop(t + 0.15);
    };

    // "Lub" (Primary thump)
    playThump(0, 58, 0.9);
    // "Dub" (Secondary thump 110ms later, slightly lower pitch)
    playThump(0.11, 48, 0.6);
  }

  // Radio Static / White Noise Burst
  public playStaticBurst(durationSec: number = 0.6, intensity: number = 0.5): void {
    if (!this.ctx || !this.sfxGain) return;
    try {
      const bufferSize = Math.floor(this.ctx.sampleRate * durationSec);
      const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
      const data = buffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        data[i] = (Math.random() * 2 - 1) * Math.exp(-i / (bufferSize * 0.7));
      }

      const noise = this.ctx.createBufferSource();
      noise.buffer = buffer;

      const bandpass = this.ctx.createBiquadFilter();
      bandpass.type = 'bandpass';
      bandpass.frequency.setValueAtTime(1200, this.ctx.currentTime);
      bandpass.Q.setValueAtTime(2.0, this.ctx.currentTime);

      const gain = this.ctx.createGain();
      gain.gain.setValueAtTime(intensity * 0.4, this.ctx.currentTime);

      noise.connect(bandpass);
      bandpass.connect(gain);
      gain.connect(this.sfxGain);

      noise.start();
    } catch (e) {
      console.warn('Error playing static burst', e);
    }
  }

  // Geiger Counter Crackle
  public setGeigerProximity(distanceFactor: number): void {
    const safeDistance = Number.isFinite(distanceFactor)
      ? Math.min(1, Math.max(0, distanceFactor))
      : 0;

    if (safeDistance <= 0.05) {
      this.stopGeiger();
      return;
    }

    const rateMs = Math.max(45, Math.floor(350 * (1.05 - safeDistance)));

    // Avoid recreating the interval every game frame.
    if (this.geigerInterval !== null && this.geigerRateMs === rateMs) {
      return;
    }

    this.stopGeiger();

    this.geigerRateMs = rateMs;
    this.geigerInterval = window.setInterval(() => {
      if (Math.random() < 0.65) {
        this.playGeigerClick();
      }
    }, rateMs);
  }

  public stopGeiger(): void {
    if (this.geigerInterval !== null) {
      clearInterval(this.geigerInterval);
      this.geigerInterval = null;
    }

    this.geigerRateMs = null;
  }

  private playGeigerClick(): void {
    if (!this.ctx || !this.sfxGain) return;
    const t = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'square';
    osc.frequency.setValueAtTime(1400 + Math.random() * 800, t);

    gain.gain.setValueAtTime(0.2, t);
    gain.gain.exponentialRampToValueAtTime(0.001, t + 0.015);

    osc.connect(gain);
    gain.connect(this.sfxGain);

    osc.start(t);
    osc.stop(t + 0.02);
  }

  // Jump-scare / Entity Encounter Stinger
  public playEncounterStinger(): void {
    if (!this.ctx || !this.sfxGain) return;
    const t = this.ctx.currentTime;

    const freqs = [185, 196, 370, 392, 740]; // Dissonant cluster
    freqs.forEach((freq) => {
      const osc = this.ctx!.createOscillator();
      const gain = this.ctx!.createGain();

      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(freq, t);
      osc.frequency.linearRampToValueAtTime(freq * 0.7, t + 0.8);

      gain.gain.setValueAtTime(0.25, t);
      gain.gain.exponentialRampToValueAtTime(0.001, t + 1.2);

      osc.connect(gain);
      gain.connect(this.sfxGain!);

      osc.start(t);
      osc.stop(t + 1.25);
    });

    this.playStaticBurst(0.8, 0.7);
  }

  // Puzzle Harmonic Tone (Frequency 432Hz tuning fork)
  public playTuningForkTone(frequency: number = 432, duration: number = 2.0): void {
    if (!this.ctx || !this.sfxGain) return;
    const t = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(frequency, t);

    gain.gain.setValueAtTime(0.4, t);
    gain.gain.exponentialRampToValueAtTime(0.0005, t + duration);

    osc.connect(gain);
    gain.connect(this.sfxGain);

    osc.start(t);
    osc.stop(t + duration);
  }

  // Puzzle Success Chime
  public playPuzzleSuccess(): void {
    if (!this.ctx || !this.sfxGain) return;
    const notes = [329.63, 440, 554.37, 659.25]; // E major chord
    notes.forEach((freq, idx) => {
      const t = this.ctx!.currentTime + idx * 0.09;
      const osc = this.ctx!.createOscillator();
      const gain = this.ctx!.createGain();

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(freq, t);

      gain.gain.setValueAtTime(0.3, t);
      gain.gain.exponentialRampToValueAtTime(0.001, t + 0.8);

      osc.connect(gain);
      gain.connect(this.sfxGain!);

      osc.start(t);
      osc.stop(t + 0.85);
    });
  }

  // Puzzle Failure Dissonant Buzz
  public playPuzzleFailure(): void {
    if (!this.ctx || !this.sfxGain) return;
    const t = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(85, t);
    osc.frequency.linearRampToValueAtTime(65, t + 0.4);

    gain.gain.setValueAtTime(0.35, t);
    gain.gain.exponentialRampToValueAtTime(0.001, t + 0.45);

    osc.connect(gain);
    gain.connect(this.sfxGain);

    osc.start(t);
    osc.stop(t + 0.5);
  }

  // UI Click sound
  public playUIClick(): void {
    if (!this.ctx || !this.sfxGain) return;
    const t = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(800, t);
    osc.frequency.exponentialRampToValueAtTime(400, t + 0.04);

    gain.gain.setValueAtTime(0.15, t);
    gain.gain.exponentialRampToValueAtTime(0.001, t + 0.05);

    osc.connect(gain);
    gain.connect(this.sfxGain);

    osc.start(t);
    osc.stop(t + 0.055);
  }

  public updateSettings(settings: PlayerSettings): void {
    this.settings = settings;
    if (!this.ctx) return;

    if (this.masterGain) {
      this.masterGain.gain.setValueAtTime(settings.masterVolume, this.ctx.currentTime);
    }
    if (this.ambientGain) {
      this.ambientGain.gain.setValueAtTime(settings.ambientVolume, this.ctx.currentTime);
    }
    if (this.sfxGain) {
      this.sfxGain.gain.setValueAtTime(settings.sfxVolume, this.ctx.currentTime);
    }
    if (this.heartbeatGain) {
      this.heartbeatGain.gain.setValueAtTime(settings.heartbeatVolume, this.ctx.currentTime);
    }
  }

  public dispose(): void {
    this.stopAmbientDrone();
    this.stopHeartbeatLoop();
    this.stopGeiger();

    const context = this.ctx;
    this.ctx = null;

    this.masterGain = null;
    this.ambientGain = null;
    this.sfxGain = null;
    this.heartbeatGain = null;
    this.staticNode = null;
    this.staticGainNode = null;
    this.settings = null;

    if (context && context.state !== 'closed') {
      void context.close().catch((error) => {
        console.warn('Failed to close audio context', error);
      });
    }
  }
}

export const audio = HorrorAudioEngine.getInstance();

