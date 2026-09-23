import type { ReactNode } from 'react';
import { Mascot } from '@/components/brand/Mascot';
import { Icon } from '@/components/ui';

export function AuthShell({ title, intro, children }: { title: string; intro?: ReactNode; children: ReactNode }) {
  return (
    <div className="container-hfe grid items-center gap-10 py-12 lg:grid-cols-2 lg:py-20">
      <div className="hidden flex-col items-center justify-center rounded-card bg-emerald p-10 text-center text-paper lg:flex">
        <Mascot state="idle" size={220} />
        <p className="mt-6 max-w-sm font-display text-2xl font-semibold">Every account grows a little greener.</p>
        <p className="mt-2 max-w-sm text-paper/80">Earn points on purchases, reviews and referrals, track vendor shipments, and collect EarthCoins.</p>
      </div>
      <div className="mx-auto w-full max-w-md">
        <h1 className="text-2xl font-semibold sm:text-3xl">{title}</h1>
        {intro && <div className="mt-2 text-muted">{intro}</div>}
        <div className="mt-8">{children}</div>
        <p className="mt-8 flex items-start gap-2 rounded-soft border border-dashed border-line p-3 text-xs text-muted">
          <Icon name="info" size={16} className="mt-0.5 shrink-0" />
          Demo mode: accounts are stored only in this browser. No real credentials, email or third-party sign-in are involved.
        </p>
      </div>
    </div>
  );
}
