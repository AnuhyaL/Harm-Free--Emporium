import { useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { EarnTiles, EarthCoinArt } from '@/components/content/ContentBits';
import { Button, ButtonLink, EmptyState, ErrorState, Icon, Seo, Skeleton } from '@/components/ui';
import { REWARDS } from '@/data';
import { cn, date, money, num } from '@/lib/format';
import { useLoyalty } from '@/lib/hooks';
import type { PointsSource } from '@/types';

const SOURCE_LABEL: Record<PointsSource, string> = {
  purchase: 'Purchase',
  review: 'Review',
  photo_review: 'Media bonus',
  referral: 'Referral',
  redemption: 'Redeemed',
  signup: 'Welcome',
  donation: 'Donation',
};

export function CopyReferral({ code }: { code: string }) {
  const [copied, setCopied] = useState<string>();
  const ref = useRef<HTMLInputElement>(null);
  const link = `${window.location.origin}/signup?ref=${encodeURIComponent(code)}`;
  const copy = async (text: string, what: string) => {
    try {
      await navigator.clipboard.writeText(text);
    } catch {
      ref.current?.select();
    }
    setCopied(what);
    setTimeout(() => setCopied(undefined), 2000);
  };
  return (
    <div className="flex flex-col gap-2 sm:min-w-[320px]">
      <div className="flex gap-2">
        <label htmlFor="ref-link" className="sr-only">
          Your referral link
        </label>
        <input id="ref-link" ref={ref} readOnly value={link} className="input h-10 min-w-0 flex-1 py-0 text-sm" onFocus={(e) => e.currentTarget.select()} />
        <Button size="sm" className="h-10" onClick={() => copy(link, 'link')}>
          <Icon name="copy" size={16} /> Copy link
        </Button>
      </div>
      <p className="text-xs text-muted" aria-live="polite">
        Code <button type="button" className="font-mono font-semibold text-fg hover:underline" onClick={() => copy(code, 'code')}>{code}</button>
        {copied && <span className="ml-2 text-success">Copied {copied}!</span>}
      </p>
    </div>
  );
}

export default function Rewards() {
  const loyalty = useLoyalty();
  if (loyalty.error) return <ErrorState error={loyalty.error} onRetry={loyalty.reload} />;
  const l = loyalty.data;

  const tierMin = l ? REWARDS.tiers.find((t) => t.name === l.tier)!.min : 0;
  const nextMin = l?.nextTier ? tierMin + (l.lifetimeEarned - tierMin) + l.nextTier.pointsNeeded : 0;
  const progress = l?.nextTier ? ((l.lifetimeEarned - tierMin) / (nextMin - tierMin)) * 100 : 100;

  return (
    <div className="space-y-8">
      <Seo title="Rewards & EarthCoin" />
      <h1 className="text-2xl font-semibold">Rewards & EarthCoin</h1>

      {!l ? (
        <Skeleton className="h-40" />
      ) : (
        <section aria-labelledby="bal-h" className="grid gap-4 md:grid-cols-[1.4fr_1fr]">
          <div className="rounded-card bg-emerald p-6 text-paper">
            <p id="bal-h" className="text-xs font-semibold uppercase tracking-[0.16em] text-gold">
              Points balance
            </p>
            <p className="mt-2 font-display text-4xl font-semibold">{num(l.balance)}</p>
            <p className="text-paper/80">Worth {money(l.balance / REWARDS.pointsPerDollarValue)} at checkout</p>
            <div className="mt-6">
              <div className="flex justify-between text-sm">
                <span className="font-semibold">{l.tier} tier</span>
                <span className="text-paper/80">{l.nextTier ? `${num(l.nextTier.pointsNeeded)} to ${l.nextTier.name}` : 'Top tier reached'}</span>
              </div>
              <div className="mt-2 h-2 overflow-hidden rounded-full bg-paper/20" role="progressbar" aria-valuemin={0} aria-valuemax={100} aria-valuenow={Math.round(progress)} aria-label="Progress to next tier">
                <div className="h-full rounded-full bg-gold" style={{ width: `${Math.min(100, progress)}%` }} />
              </div>
              <p className="mt-2 text-xs text-paper/70">{num(l.lifetimeEarned)} lifetime points earned</p>
            </div>
          </div>
          <div className="card flex flex-col justify-between p-6">
            <div>
              <p className="eyebrow">Refer a friend</p>
              <p className="mt-1 font-semibold">
                They get ${REWARDS.referralGivesDollars}, you get {num(REWARDS.referralGetsPoints)} points
              </p>
              <p className="text-sm text-muted">{l.referrals} successful referral{l.referrals === 1 ? '' : 's'}</p>
            </div>
            <div className="mt-4">
              <CopyReferral code={l.referralCode} />
            </div>
          </div>
        </section>
      )}

      <section aria-labelledby="earn-h">
        <h2 id="earn-h" className="mb-4 text-xl font-semibold">
          Ways to earn
        </h2>
        <EarnTiles />
        <p className="mt-3 text-sm text-muted">Redeem in 100-point steps at checkout, up to half of your order subtotal.</p>
      </section>

      <section id="earthcoin" aria-labelledby="ec-h" className="scroll-mt-24">
        <div className="mb-4 flex flex-wrap items-end justify-between gap-3">
          <h2 id="ec-h" className="text-xl font-semibold">
            EarthCoin wallet
          </h2>
          <Link to="/earthcoin" className="text-sm font-medium">
            How EarthCoin works
          </Link>
        </div>
        {l && (
          <div className="card mb-4 p-5">
            <p className="text-sm font-semibold">
              Reviews toward your next EarthCoin: {l.reviewsTowardEarthCoin} / {REWARDS.reviewsPerEarthCoin}
            </p>
            <div className="mt-2 flex gap-1.5" aria-hidden>
              {Array.from({ length: REWARDS.reviewsPerEarthCoin }).map((_, i) => (
                <span key={i} className={cn('h-2 flex-1 rounded-full', i < l.reviewsTowardEarthCoin ? 'bg-gold' : 'bg-line')} />
              ))}
            </div>
          </div>
        )}
        {!l ? (
          <Skeleton className="h-40" />
        ) : l.earthCoins.length ? (
          <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {l.earthCoins.map((c) => (
              <li key={c.id} className="flex items-center gap-4 rounded-card border border-gold/60 bg-navy p-5 text-paper">
                <EarthCoinArt size={72} />
                <div className="text-sm">
                  <p className="font-mono font-semibold">{c.serial}</p>
                  <p className="text-paper/80">
                    {c.reason === 'donation' ? 'Donation' : c.reason === 'purchase' ? 'Purchase $35+' : `${REWARDS.reviewsPerEarthCoin} reviews`} · {date(c.at)}
                  </p>
                  <p className="mt-1 inline-flex rounded-full bg-paper/10 px-2 py-0.5 text-[11px] uppercase tracking-wide">Recorded</p>
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <EmptyState icon="coin" title="No EarthCoins yet" body={`Earn one with a $${REWARDS.earthCoinPurchaseMin}+ order, a $${REWARDS.earthCoinDonationMin}+ donation, or ${REWARDS.reviewsPerEarthCoin} reviews.`} action={{ label: 'Donate', to: '/donate' }} />
        )}
        <p className="mt-3 text-xs text-muted">EarthCoin entitlements are recorded to your account only. No token is minted and no wallet connection is needed in this phase.</p>
      </section>

      <section aria-labelledby="tx-h">
        <h2 id="tx-h" className="mb-4 text-xl font-semibold">
          Points history
        </h2>
        {!l ? (
          <Skeleton className="h-40" />
        ) : (
          <div className="overflow-x-auto rounded-card border border-line bg-surface">
            <table className="w-full min-w-[520px] text-left text-sm">
              <thead className="border-b border-line bg-tint/50 text-xs uppercase tracking-wide text-muted">
                <tr>
                  <th scope="col" className="px-4 py-3 font-semibold">Date</th>
                  <th scope="col" className="px-4 py-3 font-semibold">Activity</th>
                  <th scope="col" className="px-4 py-3 font-semibold">Type</th>
                  <th scope="col" className="px-4 py-3 text-right font-semibold">Points</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-line">
                {l.transactions.map((t) => (
                  <tr key={t.id}>
                    <td className="whitespace-nowrap px-4 py-3 text-muted">{date(t.at)}</td>
                    <td className="px-4 py-3">
                      {t.refId?.startsWith('ord') ? <Link to={`/account/orders/${t.refId}`}>{t.note}</Link> : t.note}
                    </td>
                    <td className="px-4 py-3 text-muted">{SOURCE_LABEL[t.source]}</td>
                    <td className={cn('px-4 py-3 text-right font-semibold', t.points < 0 ? 'text-danger' : 'text-success')}>
                      {t.points > 0 ? '+' : ''}
                      {num(t.points)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>

      <div className="flex flex-wrap gap-3">
        <ButtonLink to="/catalog">Shop & earn</ButtonLink>
        <ButtonLink to="/donate" variant="secondary">
          Donate & earn an EarthCoin
        </ButtonLink>
      </div>
    </div>
  );
}
