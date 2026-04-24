import { createBrownNoiseBuffer } from './brownNoise';
import type { SourceKind } from './types';

const SMOOTHING = 0.05;
const FADE_OUT_SECONDS = 4;

export interface EngineParams {
  frequency: number;
  depth: number;
  volume: number;
}

export class AudioEngine {
  private ctx: AudioContext | null = null;
  private source: AudioBufferSourceNode | null = null;
  private lfo: OscillatorNode | null = null;
  private lfoGain: GainNode | null = null;
  private modGain: GainNode | null = null;
  private masterGain: GainNode | null = null;
  private brownNoiseBuffer: AudioBuffer | null = null;
  private uploadedBuffer: AudioBuffer | null = null;
  private currentSource: SourceKind = 'brown-noise';
  private isPlaying = false;
  private fadeTimeout: number | null = null;

  private ensureContext(): AudioContext {
    if (!this.ctx) {
      const Ctor = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      this.ctx = new Ctor();
    }
    return this.ctx;
  }

  async resume(): Promise<void> {
    const ctx = this.ensureContext();
    if (ctx.state === 'suspended') {
      await ctx.resume();
    }
  }

  getContext(): AudioContext | null {
    return this.ctx;
  }

  isActive(): boolean {
    return this.isPlaying;
  }

  async loadFile(file: File): Promise<void> {
    const ctx = this.ensureContext();
    const arrayBuffer = await file.arrayBuffer();
    this.uploadedBuffer = await ctx.decodeAudioData(arrayBuffer.slice(0));
  }

  hasUpload(): boolean {
    return this.uploadedBuffer !== null;
  }

  async start(source: SourceKind, params: EngineParams): Promise<void> {
    if (this.isPlaying) {
      await this.stop({ fade: false });
    }

    const ctx = this.ensureContext();
    if (ctx.state === 'suspended') {
      await ctx.resume();
    }

    if (this.fadeTimeout !== null) {
      clearTimeout(this.fadeTimeout);
      this.fadeTimeout = null;
    }

    this.currentSource = source;

    let buffer: AudioBuffer;
    if (source === 'upload') {
      if (!this.uploadedBuffer) {
        throw new Error('No uploaded audio available.');
      }
      buffer = this.uploadedBuffer;
    } else {
      if (!this.brownNoiseBuffer) {
        this.brownNoiseBuffer = createBrownNoiseBuffer(ctx, 10);
      }
      buffer = this.brownNoiseBuffer;
    }

    const sourceNode = ctx.createBufferSource();
    sourceNode.buffer = buffer;
    sourceNode.loop = true;

    const modGain = ctx.createGain();
    modGain.gain.value = 1 - params.depth / 2;

    const lfo = ctx.createOscillator();
    lfo.type = 'sine';
    lfo.frequency.value = params.frequency;

    const lfoGain = ctx.createGain();
    lfoGain.gain.value = params.depth / 2;

    const masterGain = ctx.createGain();
    masterGain.gain.value = params.volume;

    sourceNode.connect(modGain);
    modGain.connect(masterGain);
    masterGain.connect(ctx.destination);

    lfo.connect(lfoGain);
    lfoGain.connect(modGain.gain);

    sourceNode.start();
    lfo.start();

    this.source = sourceNode;
    this.modGain = modGain;
    this.lfo = lfo;
    this.lfoGain = lfoGain;
    this.masterGain = masterGain;
    this.isPlaying = true;
  }

  setFrequency(value: number): void {
    if (!this.lfo || !this.ctx) return;
    this.lfo.frequency.setTargetAtTime(value, this.ctx.currentTime, SMOOTHING);
  }

  setDepth(value: number): void {
    if (!this.modGain || !this.lfoGain || !this.ctx) return;
    const t = this.ctx.currentTime;
    this.modGain.gain.setTargetAtTime(1 - value / 2, t, SMOOTHING);
    this.lfoGain.gain.setTargetAtTime(value / 2, t, SMOOTHING);
  }

  setVolume(value: number): void {
    if (!this.masterGain || !this.ctx) return;
    this.masterGain.gain.setTargetAtTime(value, this.ctx.currentTime, SMOOTHING);
  }

  getCurrentSource(): SourceKind {
    return this.currentSource;
  }

  async stop(options: { fade?: boolean } = { fade: true }): Promise<void> {
    if (!this.isPlaying || !this.ctx) {
      this.cleanup();
      return;
    }

    const ctx = this.ctx;
    const masterGain = this.masterGain;
    const source = this.source;
    const lfo = this.lfo;

    if (options.fade && masterGain) {
      const t = ctx.currentTime;
      masterGain.gain.cancelScheduledValues(t);
      masterGain.gain.setValueAtTime(masterGain.gain.value, t);
      masterGain.gain.linearRampToValueAtTime(0.0001, t + FADE_OUT_SECONDS);

      await new Promise<void>((resolve) => {
        this.fadeTimeout = window.setTimeout(() => {
          this.fadeTimeout = null;
          try {
            source?.stop();
          } catch {
            /* already stopped */
          }
          try {
            lfo?.stop();
          } catch {
            /* already stopped */
          }
          this.cleanup();
          resolve();
        }, FADE_OUT_SECONDS * 1000);
      });
    } else {
      try {
        source?.stop();
      } catch {
        /* already stopped */
      }
      try {
        lfo?.stop();
      } catch {
        /* already stopped */
      }
      this.cleanup();
    }
  }

  private cleanup(): void {
    try {
      this.source?.disconnect();
      this.lfo?.disconnect();
      this.lfoGain?.disconnect();
      this.modGain?.disconnect();
      this.masterGain?.disconnect();
    } catch {
      /* nodes already disconnected */
    }
    this.source = null;
    this.lfo = null;
    this.lfoGain = null;
    this.modGain = null;
    this.masterGain = null;
    this.isPlaying = false;
  }
}
