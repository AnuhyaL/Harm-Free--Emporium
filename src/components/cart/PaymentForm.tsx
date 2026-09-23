/**
 * SIMULATED card form. Card number, expiry and CVC live only in this component's state.
 * On submit it emits a token of { brand, last4, outcome } — the only thing that leaves the form.
 */
import { zodResolver } from '@hookform/resolvers/zod';
import { Controller, useForm } from 'react-hook-form';
import { z } from 'zod';
import { Button, Icon, TextField } from '@/components/ui';
import {
  TEST_CARDS,
  cardBrand,
  cvcLength,
  digitsOnly,
  expiryValid,
  formatCardNumber,
  formatExpiry,
  luhnValid,
  testOutcome,
} from '@/lib/payment';
import type { ReactNode } from 'react';

const schema = z
  .object({
    name: z.string().trim().min(2, 'Enter the name on the card.'),
    number: z.string().refine((v) => luhnValid(v), 'Enter a valid card number.'),
    expiry: z.string().refine((v) => expiryValid(v), 'Enter a future expiry date as MM/YY.'),
    cvc: z.string(),
    postal: z.string().trim().min(3, 'Enter the billing postal code.'),
  })
  .superRefine((v, ctx) => {
    if (digitsOnly(v.cvc).length !== cvcLength(v.number)) {
      ctx.addIssue({ code: 'custom', path: ['cvc'], message: `Enter the ${cvcLength(v.number)}-digit security code.` });
    }
  });
type Values = z.infer<typeof schema>;

export interface PaymentToken {
  brand: string;
  last4: string;
  outcome: string;
}

export function PaymentForm({
  onToken,
  submitLabel,
  defaultPostal,
  footer,
  busy,
}: {
  onToken: (t: PaymentToken) => void | Promise<void>;
  submitLabel: ReactNode;
  defaultPostal?: string;
  footer?: ReactNode;
  busy?: boolean;
}) {
  const { register, control, handleSubmit, watch, formState } = useForm<Values>({
    resolver: zodResolver(schema),
    defaultValues: { name: '', number: '', expiry: '', cvc: '', postal: defaultPostal ?? '' },
    mode: 'onTouched',
  });
  const number = watch('number');
  const brand = cardBrand(number);
  const e = formState.errors;

  return (
    <form
      noValidate
      autoComplete="off"
      onSubmit={handleSubmit(async (v) => {
        await onToken({ brand: cardBrand(v.number), last4: digitsOnly(v.number).slice(-4), outcome: testOutcome(v.number) });
      })}
      className="space-y-5"
    >
      <div className="flex items-start gap-2 rounded-soft border border-gold/70 bg-tint px-4 py-3 text-sm">
        <Icon name="info" size={18} className="mt-0.5 shrink-0" />
        <div>
          <p className="font-semibold">Demo mode — no real payment is processed.</p>
          <p className="text-muted">Card details never leave this page. Use a test number:</p>
          <ul className="mt-1 grid gap-x-4 font-mono text-xs sm:grid-cols-2">
            {TEST_CARDS.map((c) => (
              <li key={c.number}>
                {c.number} <span className="font-sans text-muted">· {c.note}</span>
              </li>
            ))}
          </ul>
          <p className="mt-1 text-xs text-muted">Any future expiry, any CVC.</p>
        </div>
      </div>
      <TextField label="Name on card" autoComplete="off" error={e.name?.message} {...register('name')} />
      <Controller
        control={control}
        name="number"
        render={({ field }) => (
          <div className="relative">
            <TextField
              label="Card number"
              inputMode="numeric"
              autoComplete="off"
              placeholder="1234 1234 1234 1234"
              error={e.number?.message}
              value={field.value}
              onBlur={field.onBlur}
              name={field.name}
              ref={field.ref}
              onChange={(ev) => field.onChange(formatCardNumber(ev.target.value))}
            />
            {digitsOnly(number).length > 0 && (
              <span className="pointer-events-none absolute right-3 top-[38px] rounded bg-tint px-2 py-0.5 text-xs font-semibold" aria-live="polite">
                {brand}
              </span>
            )}
          </div>
        )}
      />
      <div className="grid grid-cols-3 gap-4">
        <Controller
          control={control}
          name="expiry"
          render={({ field }) => (
            <TextField label="Expiry" inputMode="numeric" placeholder="MM/YY" autoComplete="off" error={e.expiry?.message} value={field.value} onBlur={field.onBlur} name={field.name} ref={field.ref} onChange={(ev) => field.onChange(formatExpiry(ev.target.value))} />
          )}
        />
        <Controller
          control={control}
          name="cvc"
          render={({ field }) => (
            <TextField label="CVC" inputMode="numeric" placeholder={brand === 'Amex' ? '1234' : '123'} autoComplete="off" error={e.cvc?.message} value={field.value} onBlur={field.onBlur} name={field.name} ref={field.ref} onChange={(ev) => field.onChange(digitsOnly(ev.target.value).slice(0, 4))} />
          )}
        />
        <TextField label="Billing ZIP" autoComplete="off" error={e.postal?.message} {...register('postal')} />
      </div>
      {footer}
      <Button type="submit" size="lg" className="w-full" loading={formState.isSubmitting || busy}>
        {submitLabel}
      </Button>
    </form>
  );
}
