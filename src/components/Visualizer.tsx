import { useEffect, useState } from 'react';

interface VisualizerProps {
  isPlaying: boolean;
  frequency: number;
  depth: number;
}

function usePrefersReducedMotion() {
  const [reduced, setReduced] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    setReduced(mq.matches);
    const handler = (e: MediaQueryListEvent) => setReduced(e.matches);
    mq.addEventListener('change', handler);
    return () => mq.removeEventListener('change', handler);
  }, []);
  return reduced;
}

export function Visualizer({ isPlaying, frequency, depth }: VisualizerProps) {
  const reducedMotion = usePrefersReducedMotion();
  const animate = isPlaying && !reducedMotion;
  const periodMs = Math.max(50, 1000 / frequency);
  const ringScale = 1 + depth * 0.06;

  return (
    <div className="relative grid h-48 w-48 place-items-center sm:h-56 sm:w-56" aria-hidden="true">
      <div
        className="absolute inset-0 rounded-full border border-accent/30"
        style={{
          animation: animate ? `pulse-ring ${periodMs}ms ease-in-out infinite` : undefined,
          transform: animate ? undefined : `scale(${ringScale})`,
          opacity: isPlaying ? 1 : 0.35,
          transition: 'opacity 400ms ease',
        }}
      />
      <div
        className="absolute inset-6 rounded-full border border-accent/20"
        style={{
          animation: animate ? `pulse-ring ${periodMs * 1.5}ms ease-in-out infinite` : undefined,
          opacity: isPlaying ? 0.9 : 0.25,
          transition: 'opacity 400ms ease',
        }}
      />
      <div
        className="relative grid h-24 w-24 place-items-center rounded-full bg-accent/10 sm:h-28 sm:w-28"
        style={{
          boxShadow: isPlaying ? '0 0 60px var(--accent-glow), inset 0 0 30px var(--accent-glow)' : 'none',
          transition: 'box-shadow 600ms ease',
        }}
      >
        <span className="font-serif text-4xl tabular-nums text-ink sm:text-5xl">{frequency.toFixed(1)}</span>
      </div>
    </div>
  );
}
