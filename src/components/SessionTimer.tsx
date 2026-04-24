import { useState } from 'react';
import { useCarrierStore } from '@/store/useCarrierStore';
import { TIMER_OPTIONS } from '@/lib/presets';
import { formatRemaining } from '@/hooks/useSessionTimer';
import { cn } from '@/lib/cn';

interface SessionTimerProps {
  isPlaying: boolean;
  remainingSeconds: number | null;
}

export function SessionTimer({ isPlaying, remainingSeconds }: SessionTimerProps) {
  const timerMinutes = useCarrierStore((s) => s.timerMinutes);
  const customTimerMinutes = useCarrierStore((s) => s.customTimerMinutes);
  const setTimerMinutes = useCarrierStore((s) => s.setTimerMinutes);
  const setCustomTimerMinutes = useCarrierStore((s) => s.setCustomTimerMinutes);
  const [showCustom, setShowCustom] = useState(false);

  const isCustom = timerMinutes !== null && !TIMER_OPTIONS.some((o) => o.minutes === timerMinutes);

  return (
    <div className="space-y-2">
      <div className="flex items-baseline justify-between">
        <span className="font-mono text-xs uppercase tracking-[0.18em] text-ink-muted">Session</span>
        {isPlaying && timerMinutes !== null && (
          <span className="font-mono text-sm tabular-nums text-accent">{formatRemaining(remainingSeconds)}</span>
        )}
      </div>
      <div className="grid grid-cols-5 gap-2">
        {TIMER_OPTIONS.map((opt) => (
          <button
            key={opt.id}
            type="button"
            onClick={() => {
              setTimerMinutes(opt.minutes);
              setShowCustom(false);
            }}
            aria-pressed={timerMinutes === opt.minutes && !isCustom}
            className={cn(
              'rounded-md border px-2 py-2 text-xs font-mono uppercase tracking-[0.14em] transition-colors',
              timerMinutes === opt.minutes && !isCustom
                ? 'border-accent/70 bg-accent/15 text-ink'
                : 'border-bg-border bg-bg-panel/60 text-ink-muted hover:border-accent/40 hover:text-ink',
            )}
          >
            {opt.minutes}m
          </button>
        ))}
        <button
          type="button"
          onClick={() => setShowCustom((v) => !v)}
          aria-pressed={isCustom || showCustom}
          className={cn(
            'rounded-md border px-2 py-2 text-xs font-mono uppercase tracking-[0.14em] transition-colors',
            isCustom || showCustom
              ? 'border-accent/70 bg-accent/15 text-ink'
              : 'border-bg-border bg-bg-panel/60 text-ink-muted hover:border-accent/40 hover:text-ink',
          )}
        >
          Custom
        </button>
      </div>
      {(showCustom || isCustom) && (
        <div className="flex items-center gap-2 rounded-md border border-bg-border bg-bg-panel/40 px-3 py-2">
          <label className="font-mono text-xs uppercase tracking-[0.14em] text-ink-muted">Min</label>
          <input
            type="number"
            min={1}
            max={240}
            value={isCustom ? timerMinutes ?? customTimerMinutes : customTimerMinutes}
            onChange={(e) => {
              const next = parseInt(e.target.value, 10);
              if (!Number.isFinite(next)) return;
              setCustomTimerMinutes(next);
              setTimerMinutes(next);
            }}
            className="w-20 rounded border border-bg-border bg-bg-base px-2 py-1 font-mono text-sm tabular-nums text-ink focus:border-accent focus:outline-none"
            aria-label="Custom session minutes"
          />
          <button
            type="button"
            onClick={() => {
              setTimerMinutes(null);
              setShowCustom(false);
            }}
            className="ml-auto font-mono text-xs uppercase tracking-[0.14em] text-ink-dim hover:text-ink"
          >
            No timer
          </button>
        </div>
      )}
    </div>
  );
}
