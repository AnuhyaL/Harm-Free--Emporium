import { Link, useParams } from 'react-router-dom';
import { api } from '@/api';
import { ProductImage } from '@/components/brand/ProductArt';
import { Breadcrumbs, ButtonLink, ErrorState, Icon, PageSkeleton, Seo } from '@/components/ui';
import { vendorById } from '@/data';
import { cn, date, dateTime, money } from '@/lib/format';
import { lookupProduct, useAsync, useNow } from '@/lib/hooks';
import { STAGES, currentStage, orderStatus, returnDaysLeft } from '@/lib/orders';
import type { ReturnRequest, Shipment } from '@/types';
import { OrderTotals } from '../OrderConfirmation';

function Timeline({ shipment, now }: { shipment: Shipment; now: number }) {
  const stage = currentStage(shipment, now);
  const reachedIdx = STAGES.findIndex((s) => s.stage === stage);
  return (
    <ol className="relative ml-3 border-l-2 border-line" aria-label={`Tracking timeline for ${shipment.vendorName} shipment`}>
      {STAGES.map((s, i) => {
        const ev = shipment.events.find((e) => e.stage === s.stage);
        const reached = i <= reachedIdx;
        const current = i === reachedIdx;
        return (
          <li key={s.stage} className="relative pb-6 pl-6 last:pb-0" aria-current={current ? 'step' : undefined}>
            <span
              className={cn(
                'absolute -left-[11px] top-0.5 inline-flex h-5 w-5 items-center justify-center rounded-full ring-4 ring-surface',
                reached ? 'bg-primary text-primary-fg' : 'border-2 border-line bg-surface',
              )}
              aria-hidden
            >
              {reached && <Icon name="check" size={12} />}
            </span>
            {reached && i < reachedIdx && <span className="absolute -left-[2px] top-5 h-full w-0.5 bg-primary" aria-hidden />}
            <p className={cn('text-sm font-semibold', !reached && 'text-muted')}>
              {s.label}
              {current && <span className="ml-2 rounded-full bg-gold px-2 py-0.5 text-[11px] font-bold text-gold-fg">Current</span>}
            </p>
            {reached && ev ? (
              <p className="text-sm text-muted">
                {dateTime(ev.at)} · {ev.note}
                {ev.location && ` · ${ev.location}`}
              </p>
            ) : (
              <p className="text-xs text-muted">{ev ? `Expected around ${dateTime(ev.at)}` : 'Pending'}</p>
            )}
            <span className="sr-only">{reached ? 'Completed' : 'Not yet'}</span>
          </li>
        );
      })}
    </ol>
  );
}

function ReturnWindow({ shipment, now, orderId, existing }: { shipment: Shipment; now: number; orderId: string; existing?: ReturnRequest }) {
  const days = returnDaysLeft(shipment, now);
  if (existing) {
    return (
      <p className="rounded-soft bg-tint p-3 text-sm">
        Return {existing.rmaNumber} forwarded to {existing.vendorName} on {date(existing.createdAt)}.
      </p>
    );
  }
  if (days === null) return <p className="text-sm text-muted">Returns open once this shipment is delivered ({shipment.returnWindowDays}-day window).</p>;
  if (days <= 0) return <p className="text-sm text-muted">The {shipment.returnWindowDays}-day return window has closed. Warranty claims still go to {shipment.vendorName}.</p>;
  return (
    <div className="flex flex-wrap items-center justify-between gap-3 rounded-soft bg-tint p-3">
      <p className="text-sm">
        <strong>{days} day{days > 1 ? 's' : ''} left</strong> to start a return with {shipment.vendorName}
      </p>
      <ButtonLink to={`/account/returns/${orderId}?shipment=${shipment.id}`} variant="secondary" size="sm">
        Start a return
      </ButtonLink>
    </div>
  );
}

export default function OrderDetail() {
  const { id = '' } = useParams();
  const now = useNow(15_000);
  const order = useAsync(() => api.orders.get(id), [id]);
  const returns = useAsync(() => api.returns.forOrder(id), [id]);

  if (order.error) return <ErrorState error={order.error} onRetry={order.reload} />;
  if (!order.data) return <PageSkeleton />;
  const o = order.data;
  const st = orderStatus(o, now);

  return (
    <div>
      <Seo title={`Order ${o.number}`} />
      <Breadcrumbs items={[{ label: 'Account', to: '/account' }, { label: 'Orders', to: '/account/orders' }, { label: o.number }]} />
      <div className="mb-6 flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-2xl font-semibold">Order {o.number}</h1>
          <p className="text-sm text-muted">Placed {dateTime(o.placedAt)}</p>
        </div>
        <span className="rounded-full bg-tint px-3 py-1 text-sm font-semibold">{st.label}</span>
      </div>

      <div className="grid gap-6 xl:grid-cols-[1fr_320px]">
        <div className="space-y-6">
          {o.shipments.map((s, i) => (
            <section key={s.id} aria-labelledby={`sh-${s.id}`} className="card p-5 sm:p-6">
              <div className="mb-4 flex flex-wrap items-start justify-between gap-3">
                <div>
                  <h2 id={`sh-${s.id}`} className="text-lg font-semibold">
                    Shipment {i + 1} of {o.shipments.length} · {s.vendorName}
                  </h2>
                  <p className="text-sm text-muted">
                    {s.carrier} · Tracking <span className="font-mono text-fg">{s.trackingNumber}</span>
                  </p>
                </div>
                {vendorById(s.vendorId) && (
                  <Link to={`/brands/${vendorById(s.vendorId)!.slug}`} className="text-sm font-medium">
                    Vendor storefront & warranty contact
                  </Link>
                )}
              </div>
              <div className="grid gap-6 md:grid-cols-[1fr_1fr]">
                <Timeline shipment={s} now={now} />
                <ul className="space-y-3">
                  {s.lines.map((l) => {
                    const p = lookupProduct(l.productId);
                    return (
                      <li key={`${l.productId}-${l.variantId}`} className="flex items-center gap-3 text-sm">
                        {p && (
                          <span className="h-14 w-14 shrink-0 overflow-hidden rounded-lg">
                            <ProductImage product={p} sizes="56px" />
                          </span>
                        )}
                        <span className="flex-1">
                          {p ? <Link to={`/product/${p.slug}`}>{l.name}</Link> : l.name}
                          {l.variantLabel && <span className="text-muted"> · {l.variantLabel}</span>}
                          <span className="block text-xs text-muted">
                            Qty {l.qty} · {money(l.unitPrice)} each
                          </span>
                        </span>
                        <span className="font-medium">{money(l.lineTotal)}</span>
                      </li>
                    );
                  })}
                </ul>
              </div>
              <div className="mt-5">
                <ReturnWindow shipment={s} now={now} orderId={o.id} existing={returns.data?.find((r) => r.shipmentId === s.id)} />
              </div>
            </section>
          ))}
        </div>
        <aside className="space-y-4">
          <div className="card p-5">
            <h2 className="mb-3 text-lg font-semibold">Payment summary</h2>
            <OrderTotals order={o} />
            {o.pointsEarned > 0 && <p className="mt-3 text-sm text-success">+{o.pointsEarned} points earned</p>}
            {o.earthCoinEarned && (
              <p className="mt-1 flex items-center gap-1 text-sm">
                <Icon name="coin" size={16} className="text-gold" /> EarthCoin recorded
              </p>
            )}
          </div>
          <div className="card p-5 text-sm">
            <p className="font-semibold">Shipping address</p>
            <address className="mt-1 not-italic text-muted">
              {o.shippingAddress.fullName}
              <br />
              {o.shippingAddress.line1}
              {o.shippingAddress.line2 && `, ${o.shippingAddress.line2}`}
              <br />
              {o.shippingAddress.city}, {o.shippingAddress.region} {o.shippingAddress.postalCode}
            </address>
          </div>
          <div className="rounded-soft border border-dashed border-line p-4 text-xs text-muted">
            Tracking is simulated from scheduled mock events. Real carrier tracking will connect in a later phase.
          </div>
          <Link to="/contact" className="block text-sm font-medium">
            Need help with this order?
          </Link>
        </aside>
      </div>
    </div>
  );
}
