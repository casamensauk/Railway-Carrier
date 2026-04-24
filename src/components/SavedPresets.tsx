import { useState } from 'react';
import { Bookmark, Plus, Trash2 } from 'lucide-react';
import { useCarrierStore } from '@/store/useCarrierStore';
import { MAX_SAVED_PRESETS } from '@/lib/presets';
import { cn } from '@/lib/cn';

export function SavedPresets() {
  const savedPresets = useCarrierStore((s) => s.savedPresets);
  const saveCurrentAsPreset = useCarrierStore((s) => s.saveCurrentAsPreset);
  const applySavedPreset = useCarrierStore((s) => s.applySavedPreset);
  const removeSavedPreset = useCarrierStore((s) => s.removeSavedPreset);
  const [isAdding, setIsAdding] = useState(false);
  const [name, setName] = useState('');

  const atLimit = savedPresets.length >= MAX_SAVED_PRESETS;

  const handleSave = () => {
    if (saveCurrentAsPreset(name)) {
      setName('');
      setIsAdding(false);
    }
  };

  return (
    <div className="space-y-2">
      <div className="flex items-baseline justify-between">
        <span className="font-mono text-xs uppercase tracking-[0.18em] text-ink-muted">Saved presets</span>
        <span className="font-mono text-[10px] uppercase tracking-[0.14em] text-ink-dim">
          {savedPresets.length}/{MAX_SAVED_PRESETS}
        </span>
      </div>
      {savedPresets.length === 0 && !isAdding && (
        <p className="rounded-md border border-dashed border-bg-border px-3 py-3 text-xs text-ink-dim">
          Save up to {MAX_SAVED_PRESETS} combinations of frequency, depth, volume, and source.
        </p>
      )}
      {savedPresets.length > 0 && (
        <ul className="space-y-1">
          {savedPresets.map((preset) => (
            <li key={preset.id} className="flex items-center gap-2 rounded-md border border-bg-border bg-bg-panel/60 px-3 py-2">
              <button
                type="button"
                onClick={() => applySavedPreset(preset.id)}
                className="flex-1 text-left text-sm text-ink hover:text-accent"
              >
                <span className="block font-serif text-base leading-tight">{preset.name}</span>
                <span className="font-mono text-[10px] uppercase tracking-[0.14em] text-ink-dim">
                  {preset.frequency.toFixed(1)} Hz · depth {Math.round(preset.depth * 100)}% · {preset.source === 'upload' ? 'upload' : 'noise'}
                </span>
              </button>
              <button
                type="button"
                onClick={() => removeSavedPreset(preset.id)}
                aria-label={`Remove preset ${preset.name}`}
                className="rounded p-1 text-ink-dim hover:bg-bg-elevated hover:text-ink"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </li>
          ))}
        </ul>
      )}
      {isAdding ? (
        <div className="flex items-center gap-2">
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') handleSave();
              if (e.key === 'Escape') {
                setIsAdding(false);
                setName('');
              }
            }}
            placeholder="Name this preset"
            maxLength={32}
            autoFocus
            className="flex-1 rounded border border-bg-border bg-bg-base px-3 py-2 text-sm text-ink focus:border-accent focus:outline-none"
            aria-label="Preset name"
          />
          <button
            type="button"
            onClick={handleSave}
            className="rounded bg-accent px-3 py-2 text-sm font-medium text-bg-base hover:bg-accent-soft"
          >
            Save
          </button>
        </div>
      ) : (
        <button
          type="button"
          onClick={() => setIsAdding(true)}
          disabled={atLimit}
          className={cn(
            'flex w-full items-center justify-center gap-2 rounded-md border border-dashed border-bg-border px-3 py-2 text-xs font-mono uppercase tracking-[0.14em]',
            atLimit ? 'text-ink-dim' : 'text-ink-muted hover:border-accent/40 hover:text-ink',
          )}
        >
          {atLimit ? <Bookmark className="h-3.5 w-3.5" /> : <Plus className="h-3.5 w-3.5" />}
          {atLimit ? 'Preset limit reached' : 'Save current as preset'}
        </button>
      )}
    </div>
  );
}
