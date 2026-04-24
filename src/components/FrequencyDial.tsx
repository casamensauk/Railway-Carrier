import { SliderControl } from './SliderControl';
import { FREQUENCY_MAX, FREQUENCY_MIN } from '@/lib/presets';

interface FrequencyDialProps {
  frequency: number;
  onChange: (value: number) => void;
}

export function FrequencyDial({ frequency, onChange }: FrequencyDialProps) {
  return (
    <SliderControl
      label="Frequency"
      value={frequency}
      min={FREQUENCY_MIN}
      max={FREQUENCY_MAX}
      step={0.1}
      onChange={onChange}
      format={(v) => v.toFixed(1)}
      unit="Hz"
    />
  );
}
