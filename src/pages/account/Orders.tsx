import { Link } from 'react-router-dom';
import { api } from '@/api';
import { EmptyState, ErrorState, Icon, Seo, Skeleton } from '@/components/ui';
import { cn, date, money } from '@/lib/format';
import { useAsync, useNow } from '@/lib/hooks';
import { orderStatus } from '@/lib/orders';

export default function Orders() {
  const orders = useAsync(() => api.orders.list(), []);
  const now = useNow();
  return (
    <div>
      <Seo title="Order history" />
      <h1 className="mb-6 text-2xl font-semibold">Orders & tracking</h1>
      {orders.error && <ErrorState error={orders.error} onRetry={orders.reload} />}
      {orders.loading ? (
        <div className="space-y-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <Skeleton key={i} className="h-24" />
          ))}
        </div>
      ) : orders.data?.length ? (
        <ul className="space-y-3">
          {orders.data.map((o) => {
            const st = orderStatus(o, now);
            const items = o.shipments.reduce((n, s) => n + s.lines.reduce((m, l) => m + l.qty, 0), 0);
            return (
              <li key={o.id}>
                <Link to={`/account/orders/${o.id}`} className="card flex flex-wrap items-center gap-4 p-5 no-underline transition-shadow hover:shadow-lift">
                  <span className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-tint text-fg">
                    <Icon name="package" />
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block font-semibold text-fg">{o.number}</span>
                    <span className="block text-sm text-muted">
                      {date(o.placedAt)} · {items} item{items > 1 ? 's' : ''} · {o.shipments.length} shipment{o.shipments.length > 1 ? 's' : ''} ({o.shipments.map((s) => s.vendorName).join(', ')})
                    </span>
                  </span>
                  <span className="text-right">
                    <span className={cn('inline-flex rounded-full px-3 py-1 text-xs font-semibold', st.tone === 'done' ? 'bg-success/15 text-success' : 'bg-tint text-fg')}>{st.label}</span>
                    <span className="mt-1 block text-sm font-semibold text-fg">{money(o.totals.total)}</span>
                  </span>
                  <Icon name="chevronRight" className="text-muted" />
                </Link>
              </li>
            );
          })}
        </ul>
      ) : (
        <EmptyState icon="package" title="No orders yet" body="When you place an order, you can track every vendor shipment here." action={{ label: 'Start shopping', to: '/catalog' }} />
      )}
    </div>
  );
}
