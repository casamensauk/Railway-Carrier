import { useId } from 'react';

interface SliderControlProps {
  label: string;
  value: number;
  min: number;
  max: number;
  step: number;
  onChange: (value: number) => void;
  format?: (value: number) => string;
  unit?: string;
}

export function SliderControl({ label, value, min, max, step, onChange, format, unit }: SliderControlProps) {
  const id = useId();
  const displayValue = format ? format(value) : value.toString();

  return (
    <div className="space-y-2">
      <div className="flex items-baseline justify-between">
        <label htmlFor={id} className="font-mono text-xs uppercase tracking-[0.18em] text-ink-muted">
          {label}
        </label>
        <span className="font-mono text-sm tabular-nums text-ink">
          {displayValue}
          {unit && <span className="ml-1 text-ink-dim">{unit}</span>}
        </span>
      </div>
      <input
        id={id}
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(parseFloat(e.target.value))}
        aria-label={label}
        aria-valuemin={min}
        aria-valuemax={max}
        aria-valuenow={value}
      />
    </div>
  );
}
