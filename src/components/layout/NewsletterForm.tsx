import { zodResolver } from '@hookform/resolvers/zod';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { api } from '@/api';
import { Icon } from '@/components/ui';
import { cn } from '@/lib/format';

const schema = z.object({ email: z.string().trim().email('Enter a valid email address.') });

export function NewsletterForm({ tone = 'light' }: { tone?: 'light' | 'dark' }) {
  const [done, setDone] = useState<string>();
  const { register, handleSubmit, formState } = useForm<z.infer<typeof schema>>({ resolver: zodResolver(schema) });

  if (done) {
    return (
      <p role="status" className={cn('flex items-center gap-2 text-sm', tone === 'dark' ? 'text-paper' : 'text-success')}>
        <Icon name="check" size={16} /> {done}
      </p>
    );
  }

  return (
    <form
      noValidate
      onSubmit={handleSubmit(async ({ email }) => {
        const r = await api.forms.newsletter(email);
        setDone(r.already ? 'You are already on the list. Thank you!' : 'You are in. Watch your inbox for the next issue.');
      })}
    >
      <div className="flex flex-col gap-2 min-[400px]:flex-row">
        <label className="sr-only" htmlFor={`nl-${tone}`}>
          Email address
        </label>
        <input
          id={`nl-${tone}`}
          type="email"
          autoComplete="email"
          placeholder="you@example.com"
          aria-invalid={formState.errors.email ? true : undefined}
          aria-describedby={formState.errors.email ? `nl-${tone}-err` : undefined}
          className={cn(
            'h-11 min-w-0 flex-1 rounded-full border px-4 text-sm focus:outline-none focus:ring-2',
            tone === 'dark'
              ? 'border-paper/30 bg-paper/10 text-paper placeholder:text-paper/60 focus:ring-gold/60'
              : 'border-line bg-surface text-fg placeholder:text-muted focus:ring-link/40',
          )}
          {...register('email')}
        />
        <button
          type="submit"
          disabled={formState.isSubmitting}
          className={cn(
            'h-11 shrink-0 rounded-full px-5 text-sm font-semibold transition hover:brightness-105 disabled:opacity-60',
            tone === 'dark' ? 'bg-gold text-gold-fg' : 'bg-primary text-primary-fg',
          )}
        >
          {formState.isSubmitting ? 'Joining…' : 'Subscribe'}
        </button>
      </div>
      {formState.errors.email && (
        <p id={`nl-${tone}-err`} role="alert" className={cn('mt-1.5 text-xs', tone === 'dark' ? 'text-gold' : 'text-danger')}>
          {formState.errors.email.message}
        </p>
      )}
    </form>
  );
}
