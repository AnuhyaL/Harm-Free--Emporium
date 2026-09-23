import { useId } from 'react';
import { Icon } from '@/components/ui';
import { money } from '@/lib/format';
import { cn } from '@/lib/format';
import type { Product } from '@/types';

export function QtyStepper({ value, onChange, label, min = 1, max = 99, size = 'md' }: { value: number; onChange: (n: number) => void; label: string; min?: number; max?: number; size?: 'sm' | 'md' }) {
  const h = size === 'sm' ? 'h-9' : 'h-11';
  return (
    <div className={cn('inline-flex items-center rounded-full border border-line bg-surface', h)} role="group" aria-label={`Quantity for ${label}`}>
      <button type="button" className={cn('inline-flex w-10 items-center justify-center rounded-l-full hover:bg-tint disabled:opacity-40', h)} onClick={() => onChange(Math.max(min, value - 1))} disabled={value <= min} aria-label="Decrease quantity">
        <Icon name="minus" size={16} />
      </button>
      <input
        type="number"
        inputMode="numeric"
        min={min}
        max={max}
        value={value}
        aria-label="Quantity"
        onChange={(e) => {
          const n = Number(e.target.value);
          if (Number.isFinite(n)) onChange(Math.max(min, Math.min(max, Math.round(n))));
        }}
        className="w-10 bg-transparent text-center text-sm font-semibold [appearance:textfield] focus:outline-none [&::-webkit-inner-spin-button]:appearance-none"
      />
      <button type="button" className={cn('inline-flex w-10 items-center justify-center rounded-r-full hover:bg-tint disabled:opacity-40', h)} onClick={() => onChange(Math.min(max, value + 1))} disabled={value >= max} aria-label="Increase quantity">
        <Icon name="plus" size={16} />
      </button>
    </div>
  );
}

export function VariantPicker({ product, value, onChange }: { product: Product; value?: string; onChange: (id: string) => void }) {
  const id = useId();
  return (
    <fieldset>
      <legend id={id} className="label">
        Option: <span className="font-normal text-muted">{product.variants.find((v) => v.id === value)?.label}</span>
      </legend>
      <div className="flex flex-wrap gap-2" role="radiogroup" aria-labelledby={id}>
        {product.variants.map((v) => {
          const active = v.id === value;
          return (
            <button
              key={v.id}
              type="button"
              role="radio"
              aria-checked={active}
              onClick={() => onChange(v.id)}
              className={cn(
                'rounded-full border px-3.5 py-1.5 text-sm transition-colors',
                active ? 'border-primary bg-primary text-primary-fg' : 'border-line bg-surface hover:bg-tint',
              )}
            >
              {v.label}
              {v.priceDelta !== 0 && <span className="ml-1 opacity-80">{v.priceDelta > 0 ? '+' : '−'}{money(Math.abs(v.priceDelta))}</span>}
            </button>
          );
        })}
      </div>
    </fieldset>
  );
}
