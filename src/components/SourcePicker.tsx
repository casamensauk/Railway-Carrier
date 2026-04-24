import { useRef } from 'react';
import { Upload, Waves } from 'lucide-react';
import { useCarrierStore } from '@/store/useCarrierStore';
import { cn } from '@/lib/cn';

interface SourcePickerProps {
  uploadName: string | null;
  onUpload: (file: File) => Promise<void>;
}

export function SourcePicker({ uploadName, onUpload }: SourcePickerProps) {
  const source = useCarrierStore((s) => s.source);
  const setSource = useCarrierStore((s) => s.setSource);
  const setUploadName = useCarrierStore((s) => s.setUploadName);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFile = async (file: File) => {
    try {
      await onUpload(file);
      setUploadName(file.name);
      setSource('upload');
    } catch {
      /* error surfaced via engine state */
    }
  };

  return (
    <div className="space-y-2">
      <span className="font-mono text-xs uppercase tracking-[0.18em] text-ink-muted">Source</span>
      <div className="grid grid-cols-2 gap-2">
        <button
          type="button"
          onClick={() => setSource('brown-noise')}
          aria-pressed={source === 'brown-noise'}
          className={cn(
            'flex items-center justify-center gap-2 rounded-lg border px-3 py-3 text-sm transition-colors',
            source === 'brown-noise'
              ? 'border-accent/70 bg-accent/15 text-ink'
              : 'border-bg-border bg-bg-panel/60 text-ink-muted hover:border-accent/40 hover:text-ink',
          )}
        >
          <Waves className="h-4 w-4" />
          Brown noise
        </button>
        <button
          type="button"
          onClick={() => {
            if (uploadName) {
              setSource('upload');
            } else {
              inputRef.current?.click();
            }
          }}
          aria-pressed={source === 'upload'}
          className={cn(
            'flex items-center justify-center gap-2 rounded-lg border px-3 py-3 text-sm transition-colors',
            source === 'upload'
              ? 'border-accent/70 bg-accent/15 text-ink'
              : 'border-bg-border bg-bg-panel/60 text-ink-muted hover:border-accent/40 hover:text-ink',
          )}
        >
          <Upload className="h-4 w-4" />
          {uploadName ? 'Your audio' : 'Upload'}
        </button>
      </div>
      {uploadName && (
        <div className="flex items-center justify-between rounded-md border border-bg-border bg-bg-panel/40 px-3 py-2 text-xs">
          <span className="truncate font-mono text-ink-muted">{uploadName}</span>
          <button
            type="button"
            onClick={() => inputRef.current?.click()}
            className="font-mono uppercase tracking-[0.16em] text-accent hover:underline"
          >
            Replace
          </button>
        </div>
      )}
      <input
        ref={inputRef}
        type="file"
        accept="audio/mpeg,audio/wav,audio/ogg,audio/*"
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) void handleFile(file);
          e.target.value = '';
        }}
        className="hidden"
        aria-label="Upload audio file"
      />
    </div>
  );
}
