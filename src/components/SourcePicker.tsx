import { useRef } from 'react';
import { Leaf, Upload, Waves } from 'lucide-react';
import type { SourceKind } from '@/audio/types';
import { useCarrierStore } from '@/store/useCarrierStore';
import { cn } from '@/lib/cn';

interface SourcePickerProps {
  uploadName: string | null;
  onUpload: (file: File) => Promise<void>;
}

interface SourceOption {
  kind: Exclude<SourceKind, 'upload'>;
  label: string;
  Icon: typeof Leaf;
}

const BUILT_IN_SOURCES: SourceOption[] = [
  { kind: 'ambient', label: 'Ambient', Icon: Leaf },
  { kind: 'brown-noise', label: 'Noise', Icon: Waves },
];

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

  const buttonClass = (active: boolean) =>
    cn(
      'flex items-center justify-center gap-2 rounded-lg border px-2 py-3 text-sm transition-colors',
      active
        ? 'border-accent/70 bg-accent/15 text-ink'
        : 'border-bg-border bg-bg-panel/60 text-ink-muted hover:border-accent/40 hover:text-ink',
    );

  return (
    <div className="space-y-2">
      <span className="font-mono text-xs uppercase tracking-[0.18em] text-ink-muted">Source</span>
      <div className="grid grid-cols-3 gap-2">
        {BUILT_IN_SOURCES.map(({ kind, label, Icon }) => (
          <button
            key={kind}
            type="button"
            onClick={() => setSource(kind)}
            aria-pressed={source === kind}
            className={buttonClass(source === kind)}
          >
            <Icon className="h-4 w-4" />
            {label}
          </button>
        ))}
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
          className={buttonClass(source === 'upload')}
        >
          <Upload className="h-4 w-4" />
          {uploadName ? 'Yours' : 'Upload'}
        </button>
      </div>
      {source === 'ambient' && (
        <p className="text-xs leading-relaxed text-ink-dim">
          Warm procedural pad — detuned sines in an open A-major voicing, slow amplitude drift. Modulated at your chosen frequency.
        </p>
      )}
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
