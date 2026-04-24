import { X } from 'lucide-react';
import { useCarrierStore } from '@/store/useCarrierStore';

export function SafetyBanner() {
  const acknowledged = useCarrierStore((s) => s.safetyAcknowledged);
  const acknowledge = useCarrierStore((s) => s.acknowledgeSafety);

  if (acknowledged) return null;

  return (
    <div
      role="alert"
      className="mx-auto max-w-2xl rounded-lg border border-accent/40 bg-accent/5 px-4 py-3 text-sm leading-relaxed text-ink"
    >
      <div className="flex items-start gap-3">
        <p className="flex-1">
          <strong className="font-serif text-base">Use headphones. Start at low volume.</strong>{' '}
          Carrier produces rapidly modulated audio. If you experience discomfort, dizziness, or any unusual sensation,
          stop immediately. If you have a history of seizures or migraine with aura, consult a healthcare professional
          before use.
        </p>
        <button
          type="button"
          onClick={acknowledge}
          aria-label="Dismiss safety notice"
          className="-m-1 rounded p-1 text-ink-muted hover:bg-bg-elevated hover:text-ink"
        >
          <X className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}
