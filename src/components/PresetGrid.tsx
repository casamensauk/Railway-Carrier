import { BRAINWAVE_PRESETS } from '@/lib/presets';
import { useCarrierStore } from '@/store/useCarrierStore';
import { cn } from '@/lib/cn';

export function PresetGrid() {
  const selectedId = useCarrierStore((s) => s.selectedPresetId);
  const selectPreset = useCarrierStore((s) => s.selectPreset);

  return (
    <div className="grid grid-cols-5 gap-2">
      {BRAINWAVE_PRESETS.map((preset) => {
        const isActive = preset.id === selectedId;
        return (
          <button
            key={preset.id}
            type="button"
            onClick={() => selectPreset(preset.id)}
            aria-pressed={isActive}
            title={preset.description}
            className={cn(
              'flex flex-col items-center gap-1 rounded-lg border px-2 py-3 text-center transition-colors',
              isActive
                ? 'border-accent/70 bg-accent/15 text-ink'
                : 'border-bg-border bg-bg-panel/60 text-ink-muted hover:border-accent/40 hover:text-ink',
            )}
          >
            <span className="font-serif text-base leading-none">{preset.band}</span>
            <span className="font-mono text-[10px] uppercase tracking-[0.16em] text-ink-dim">{preset.label}</span>
          </button>
        );
      })}
    </div>
  );
}
