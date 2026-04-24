import { Play, Pause } from 'lucide-react';
import { cn } from '@/lib/cn';

interface PlayButtonProps {
  isPlaying: boolean;
  disabled?: boolean;
  onToggle: () => void;
}

export function PlayButton({ isPlaying, disabled, onToggle }: PlayButtonProps) {
  return (
    <button
      type="button"
      onClick={onToggle}
      disabled={disabled}
      aria-pressed={isPlaying}
      aria-label={isPlaying ? 'Stop session' : 'Start session'}
      className={cn(
        'group relative flex h-16 w-16 items-center justify-center rounded-full border-2 transition-colors',
        'border-accent/60 bg-accent/10 text-accent hover:bg-accent hover:text-bg-base',
        'disabled:cursor-not-allowed disabled:opacity-40',
        isPlaying && 'bg-accent text-bg-base',
      )}
    >
      {isPlaying ? <Pause className="h-6 w-6" strokeWidth={2.4} /> : <Play className="h-6 w-6 translate-x-[2px]" strokeWidth={2.4} />}
    </button>
  );
}
