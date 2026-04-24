interface PadVoice {
  freq: number;
  gain: number;
  pan: number;
}

const VOICES: PadVoice[] = [
  { freq: 110, gain: 0.22, pan: 0 },
  { freq: 111, gain: 0.18, pan: -0.35 },
  { freq: 165, gain: 0.14, pan: 0.25 },
  { freq: 220, gain: 0.10, pan: 0 },
  { freq: 219, gain: 0.09, pan: 0.35 },
  { freq: 277, gain: 0.08, pan: -0.25 },
  { freq: 330, gain: 0.05, pan: 0.2 },
];

const LFO_FREQ = 0.05;
const DURATION_SECONDS = 20;

export function createAmbientPadBuffer(ctx: AudioContext): AudioBuffer {
  const sampleRate = ctx.sampleRate;
  const length = Math.floor(sampleRate * DURATION_SECONDS);
  const buffer = ctx.createBuffer(2, length, sampleRate);
  const twoPi = 2 * Math.PI;
  const lfoStep = (twoPi * LFO_FREQ) / sampleRate;

  for (let ch = 0; ch < 2; ch++) {
    const data = buffer.getChannelData(ch);
    const channelSign = ch === 0 ? -1 : 1;
    const phaseOffset = ch === 0 ? 0 : 0.3;
    const channelVoices = VOICES.map((v) => ({
      step: (twoPi * v.freq) / sampleRate,
      gain: v.gain * (1 + v.pan * channelSign * 0.5),
    }));

    for (let i = 0; i < length; i++) {
      let sample = 0;

      for (const v of channelVoices) {
        sample += Math.sin(v.step * i) * v.gain;
      }

      const drift = 0.85 + 0.15 * Math.sin(lfoStep * i + phaseOffset);
      sample *= drift * 0.55;

      data[i] = Math.max(-0.95, Math.min(0.95, sample));
    }
  }

  return buffer;
}
