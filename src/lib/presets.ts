import type { BrainwavePreset } from '@/audio/types';

export const BRAINWAVE_PRESETS: BrainwavePreset[] = [
  {
    id: 'delta',
    band: 'Delta',
    label: '2 Hz',
    frequency: 2,
    description: 'Deep rest. Slowest band — settle and unwind.',
  },
  {
    id: 'theta',
    band: 'Theta',
    label: '6 Hz',
    frequency: 6,
    description: 'Daydream and creative drift.',
  },
  {
    id: 'alpha',
    band: 'Alpha',
    label: '10 Hz',
    frequency: 10,
    description: 'Calm alertness. Reading, reflection.',
  },
  {
    id: 'beta',
    band: 'Beta',
    label: '16 Hz',
    frequency: 16,
    description: 'Sustained attention. Deep work.',
  },
  {
    id: 'gamma',
    band: 'Gamma',
    label: '30 Hz',
    frequency: 30,
    description: 'High focus. Fast cognitive work.',
  },
];

export const DEFAULT_PRESET_ID = 'beta';

export const FREQUENCY_MIN = 1;
export const FREQUENCY_MAX = 40;

export const TIMER_OPTIONS = [
  { id: '25', label: '25 min', minutes: 25 },
  { id: '45', label: '45 min', minutes: 45 },
  { id: '60', label: '60 min', minutes: 60 },
  { id: '90', label: '90 min', minutes: 90 },
];

export const MAX_SAVED_PRESETS = 6;
