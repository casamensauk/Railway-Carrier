import { useCallback, useEffect, useState } from 'react';
import { AlertTriangle } from 'lucide-react';
import { PlayButton } from '@/components/PlayButton';
import { Visualizer } from '@/components/Visualizer';
import { FrequencyDial } from '@/components/FrequencyDial';
import { SliderControl } from '@/components/SliderControl';
import { PresetGrid } from '@/components/PresetGrid';
import { SourcePicker } from '@/components/SourcePicker';
import { SessionTimer } from '@/components/SessionTimer';
import { SavedPresets } from '@/components/SavedPresets';
import { SafetyBanner } from '@/components/SafetyBanner';
import { useAudioEngine } from '@/hooks/useAudioEngine';
import { useSessionTimer } from '@/hooks/useSessionTimer';
import { useCarrierStore } from '@/store/useCarrierStore';

export default function App() {
  const frequency = useCarrierStore((s) => s.frequency);
  const depth = useCarrierStore((s) => s.depth);
  const volume = useCarrierStore((s) => s.volume);
  const setFrequency = useCarrierStore((s) => s.setFrequency);
  const setDepth = useCarrierStore((s) => s.setDepth);
  const setVolume = useCarrierStore((s) => s.setVolume);
  const uploadName = useCarrierStore((s) => s.uploadName);
  const timerMinutes = useCarrierStore((s) => s.timerMinutes);

  const { isPlaying, error, start, stop, loadFile } = useAudioEngine();
  const [pendingFade, setPendingFade] = useState(false);

  const handleTimerComplete = useCallback(async () => {
    setPendingFade(true);
    await stop({ fade: true });
    setPendingFade(false);
  }, [stop]);

  const remainingSeconds = useSessionTimer({
    isRunning: isPlaying && !pendingFade,
    durationMinutes: timerMinutes,
    onComplete: handleTimerComplete,
  });

  const handleToggle = async () => {
    if (isPlaying) {
      await stop({ fade: false });
    } else {
      await start();
    }
  };

  useEffect(() => {
    const onUnload = () => {
      void stop({ fade: false });
    };
    window.addEventListener('beforeunload', onUnload);
    return () => window.removeEventListener('beforeunload', onUnload);
  }, [stop]);

  return (
    <div className="min-h-screen w-full px-4 pb-16 pt-8 sm:px-6 sm:pt-12">
      <div className="mx-auto flex max-w-2xl flex-col gap-8">
        <header className="flex items-baseline justify-between">
          <h1 className="font-serif text-3xl tracking-tight text-ink sm:text-4xl">
            Carrier
          </h1>
          <span className="font-mono text-[10px] uppercase tracking-[0.22em] text-ink-dim">
            focus audio
          </span>
        </header>

        <SafetyBanner />

        <section
          aria-label="Audio session"
          className="flex flex-col items-center gap-6 rounded-2xl border border-bg-border bg-bg-panel/40 px-6 py-10 backdrop-blur-sm"
        >
          <Visualizer isPlaying={isPlaying} frequency={frequency} depth={depth} />

          <div className="flex flex-col items-center gap-2">
            <PlayButton isPlaying={isPlaying} onToggle={handleToggle} disabled={pendingFade} />
            <p className="h-4 font-mono text-[10px] uppercase tracking-[0.18em] text-ink-dim">
              {pendingFade
                ? 'fading out…'
                : isPlaying
                  ? 'playing — modulating'
                  : 'tap to begin'}
            </p>
          </div>

          {error && (
            <div
              role="alert"
              className="flex items-center gap-2 rounded-md border border-accent/40 bg-accent/10 px-3 py-2 text-xs text-ink"
            >
              <AlertTriangle className="h-4 w-4 text-accent" />
              {error}
            </div>
          )}
        </section>

        <section aria-label="Brainwave presets" className="space-y-3">
          <h2 className="font-mono text-xs uppercase tracking-[0.18em] text-ink-muted">Brainwave bands</h2>
          <PresetGrid />
        </section>

        <section
          aria-label="Live controls"
          className="grid gap-6 rounded-2xl border border-bg-border bg-bg-panel/40 px-6 py-6"
        >
          <FrequencyDial frequency={frequency} onChange={setFrequency} />
          <SliderControl
            label="Depth"
            value={depth}
            min={0}
            max={1}
            step={0.01}
            onChange={setDepth}
            format={(v) => Math.round(v * 100).toString()}
            unit="%"
          />
          <SliderControl
            label="Volume"
            value={volume}
            min={0}
            max={1}
            step={0.01}
            onChange={setVolume}
            format={(v) => Math.round(v * 100).toString()}
            unit="%"
          />
        </section>

        <section
          aria-label="Source"
          className="grid gap-6 rounded-2xl border border-bg-border bg-bg-panel/40 px-6 py-6"
        >
          <SourcePicker uploadName={uploadName} onUpload={loadFile} />
          <SessionTimer isPlaying={isPlaying} remainingSeconds={remainingSeconds} />
        </section>

        <section
          aria-label="Saved presets"
          className="rounded-2xl border border-bg-border bg-bg-panel/40 px-6 py-6"
        >
          <SavedPresets />
        </section>

        <footer className="pt-2 text-center font-mono text-[10px] uppercase tracking-[0.18em] text-ink-dim">
          local-only · no accounts · works offline
        </footer>
      </div>
    </div>
  );
}
