export type SourceKind = 'ambient' | 'brown-noise' | 'upload';

export interface AudioSettings {
  frequency: number;
  depth: number;
  volume: number;
}

export interface SavedPreset {
  id: string;
  name: string;
  frequency: number;
  depth: number;
  volume: number;
  source: SourceKind;
}

export interface BrainwavePreset {
  id: string;
  band: string;
  label: string;
  frequency: number;
  description: string;
}
