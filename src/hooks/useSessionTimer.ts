import { useEffect, useRef, useState } from 'react';

interface UseSessionTimerOptions {
  isRunning: boolean;
  durationMinutes: number | null;
  onComplete: () => void;
}

export function useSessionTimer({ isRunning, durationMinutes, onComplete }: UseSessionTimerOptions) {
  const [remainingSeconds, setRemainingSeconds] = useState<number | null>(null);
  const completedRef = useRef(false);

  useEffect(() => {
    if (!isRunning || durationMinutes == null) {
      setRemainingSeconds(null);
      completedRef.current = false;
      return;
    }

    const totalSeconds = durationMinutes * 60;
    const startedAt = performance.now();
    completedRef.current = false;
    setRemainingSeconds(totalSeconds);

    const interval = window.setInterval(() => {
      const elapsed = (performance.now() - startedAt) / 1000;
      const remaining = Math.max(0, totalSeconds - elapsed);
      setRemainingSeconds(remaining);
      if (remaining <= 0 && !completedRef.current) {
        completedRef.current = true;
        window.clearInterval(interval);
        onComplete();
      }
    }, 250);

    return () => window.clearInterval(interval);
  }, [isRunning, durationMinutes, onComplete]);

  return remainingSeconds;
}

export function formatRemaining(seconds: number | null): string {
  if (seconds == null) return '—';
  const total = Math.ceil(seconds);
  const mins = Math.floor(total / 60);
  const secs = total % 60;
  return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
}
