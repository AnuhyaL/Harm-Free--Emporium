import { Link } from 'react-router-dom';
import { api } from '@/api';
import { EarthCoinArt } from '@/components/content/ContentBits';
import { ButtonLink, EmptyState, Icon, Seo, Skeleton } from '@/components/ui';
import { date, money, num } from '@/lib/format';
import { useAsync, useLoyalty, useNow } from '@/lib/hooks';
import { orderStatus } from '@/lib/orders';
import { useWishlist } from '@/store';
import { CopyReferral } from './Rewards';

export default function Dashboard() {
  const orders = useAsync(() => api.orders.list(), []);
  const loyalty = useLoyalty();
  const wish = useWishlist((s) => s.items.length);
  const now = useNow();
  const latest = orders.data?.[0];

  return (
    <div className="space-y-6">
      <Seo title="My account" />
      <h1 className="text-2xl font-semibold">Dashboard</h1>
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <Link to="/account/rewards" className="card block p-5 no-underline hover:shadow-lift">
          <p className="eyebrow">Points</p>
          {loyalty.data ? (
            <>
              <p className="mt-1 font-display text-3xl font-semibold text-fg">{num(loyalty.data.balance)}</p>
              <p className="text-sm text-muted">
                {loyalty.data.tier} tier · worth {money(loyalty.data.balance / 100)}
              </p>
            </>
          ) : (
            <Skeleton className="mt-2 h-10 w-24" />
          )}
        </Link>
        <Link to="/account/orders" className="card block p-5 no-underline hover:shadow-lift">
          <p className="eyebrow">Orders</p>
          {orders.data ? <p className="mt-1 font-display text-3xl font-semibold text-fg">{orders.data.length}</p> : <Skeleton className="mt-2 h-10 w-16" />}
          <p className="text-sm text-muted">View history & tracking</p>
        </Link>
        <Link to="/account/rewards#earthcoin" className="card flex items-center gap-4 p-5 no-underline hover:shadow-lift">
          <EarthCoinArt size={56} />
          <span>
            <span className="eyebrow block">EarthCoins</span>
            <span className="font-display text-3xl font-semibold text-fg">{loyalty.data?.earthCoins.length ?? '–'}</span>
          </span>
        </Link>
        <Link to="/account/wishlist" className="card block p-5 no-underline hover:shadow-lift">
          <p className="eyebrow">Wishlist</p>
          <p className="mt-1 font-display text-3xl font-semibold text-fg">{wish}</p>
          <p className="text-sm text-muted">Saved products</p>
        </Link>
      </div>

      <section aria-labelledby="latest-h" className="card p-6">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <h2 id="latest-h" className="text-lg font-semibold">
            Latest order
          </h2>
          <Link to="/account/orders" className="text-sm font-medium">
            All orders
          </Link>
        </div>
        {orders.loading ? (
          <Skeleton className="mt-4 h-20" />
        ) : latest ? (
          <Link to={`/account/orders/${latest.id}`} className="mt-4 flex flex-wrap items-center justify-between gap-4 rounded-soft bg-tint p-4 no-underline">
            <span>
              <span className="block font-semibold text-fg">{latest.number}</span>
              <span className="text-sm text-muted">
                {date(latest.placedAt)} · {latest.shipments.length} shipment{latest.shipments.length > 1 ? 's' : ''} · {money(latest.totals.total)}
              </span>
            </span>
            <span className="inline-flex items-center gap-2 rounded-full bg-surface px-3 py-1 text-sm font-medium text-fg">
              <Icon name="truck" size={16} /> {orderStatus(latest, now).label}
            </span>
          </Link>
        ) : (
          <div className="mt-4">
            <EmptyState icon="package" title="No orders yet" action={{ label: 'Start shopping', to: '/catalog' }} />
          </div>
        )}
      </section>

      {loyalty.data && (
        <section aria-labelledby="refer-h" className="card grid gap-4 p-6 md:grid-cols-[1fr_auto] md:items-center">
          <div>
            <h2 id="refer-h" className="text-lg font-semibold">
              Give $10, get 500 points
            </h2>
            <p className="text-sm text-muted">Share your code. When a friend signs up with it, you earn 500 points.</p>
          </div>
          <CopyReferral code={loyalty.data.referralCode} />
        </section>
      )}

      <div className="flex flex-wrap gap-3">
        <ButtonLink to="/catalog" variant="secondary">
          Keep shopping
        </ButtonLink>
        <ButtonLink to="/donate" variant="secondary">
          Donate & earn an EarthCoin
        </ButtonLink>
      </div>
    </div>
  );
}
