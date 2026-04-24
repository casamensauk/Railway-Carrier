import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import type { SavedPreset, SourceKind } from '@/audio/types';
import {
  BRAINWAVE_PRESETS,
  DEFAULT_PRESET_ID,
  FREQUENCY_MAX,
  FREQUENCY_MIN,
  MAX_SAVED_PRESETS,
} from '@/lib/presets';

interface CarrierState {
  frequency: number;
  depth: number;
  volume: number;
  source: SourceKind;
  uploadName: string | null;
  selectedPresetId: string | null;
  savedPresets: SavedPreset[];
  timerMinutes: number | null;
  customTimerMinutes: number;
  safetyAcknowledged: boolean;
  setFrequency: (value: number) => void;
  setDepth: (value: number) => void;
  setVolume: (value: number) => void;
  setSource: (source: SourceKind) => void;
  setUploadName: (name: string | null) => void;
  selectPreset: (id: string) => void;
  setTimerMinutes: (minutes: number | null) => void;
  setCustomTimerMinutes: (minutes: number) => void;
  acknowledgeSafety: () => void;
  saveCurrentAsPreset: (name: string) => boolean;
  applySavedPreset: (id: string) => void;
  removeSavedPreset: (id: string) => void;
}

const defaultPreset = BRAINWAVE_PRESETS.find((p) => p.id === DEFAULT_PRESET_ID) ?? BRAINWAVE_PRESETS[3];

const clamp = (value: number, min: number, max: number) => Math.min(Math.max(value, min), max);

export const useCarrierStore = create<CarrierState>()(
  persist(
    (set, get) => ({
      frequency: defaultPreset.frequency,
      depth: 0.6,
      volume: 0.5,
      source: 'ambient',
      uploadName: null,
      selectedPresetId: DEFAULT_PRESET_ID,
      savedPresets: [],
      timerMinutes: 45,
      customTimerMinutes: 30,
      safetyAcknowledged: false,
      setFrequency: (value) =>
        set({
          frequency: clamp(Math.round(value * 10) / 10, FREQUENCY_MIN, FREQUENCY_MAX),
          selectedPresetId: null,
        }),
      setDepth: (value) => set({ depth: clamp(value, 0, 1) }),
      setVolume: (value) => set({ volume: clamp(value, 0, 1) }),
      setSource: (source) => set({ source }),
      setUploadName: (name) => set({ uploadName: name }),
      selectPreset: (id) => {
        const preset = BRAINWAVE_PRESETS.find((p) => p.id === id);
        if (!preset) return;
        set({ frequency: preset.frequency, selectedPresetId: preset.id });
      },
      setTimerMinutes: (minutes) => set({ timerMinutes: minutes }),
      setCustomTimerMinutes: (minutes) => set({ customTimerMinutes: clamp(minutes, 1, 240) }),
      acknowledgeSafety: () => set({ safetyAcknowledged: true }),
      saveCurrentAsPreset: (name) => {
        const state = get();
        if (state.savedPresets.length >= MAX_SAVED_PRESETS) return false;
        const trimmed = name.trim().slice(0, 32) || 'Untitled';
        const preset: SavedPreset = {
          id: `${Date.now()}`,
          name: trimmed,
          frequency: state.frequency,
          depth: state.depth,
          volume: state.volume,
          source: state.source,
        };
        set({ savedPresets: [...state.savedPresets, preset] });
        return true;
      },
      applySavedPreset: (id) => {
        const preset = get().savedPresets.find((p) => p.id === id);
        if (!preset) return;
        set({
          frequency: preset.frequency,
          depth: preset.depth,
          volume: preset.volume,
          source: preset.source,
          selectedPresetId: null,
        });
      },
      removeSavedPreset: (id) => set({ savedPresets: get().savedPresets.filter((p) => p.id !== id) }),
    }),
    {
      name: 'carrier-state-v1',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        frequency: state.frequency,
        depth: state.depth,
        volume: state.volume,
        source: state.source,
        selectedPresetId: state.selectedPresetId,
        savedPresets: state.savedPresets,
        timerMinutes: state.timerMinutes,
        customTimerMinutes: state.customTimerMinutes,
        safetyAcknowledged: state.safetyAcknowledged,
      }),
    },
  ),
);
