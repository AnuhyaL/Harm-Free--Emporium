import { Link, useParams } from 'react-router-dom';
import { api } from '@/api';
import { Mascot } from '@/components/brand/Mascot';
import { EarthCoinArt } from '@/components/content/ContentBits';
import { ButtonLink, ErrorState, Icon, PageSkeleton, Seo } from '@/components/ui';
import { dateTime, money, num } from '@/lib/format';
import { useAsync } from '@/lib/hooks';
import { useAuth } from '@/store';
import type { Order } from '@/types';

export function OrderTotals({ order }: { order: Order }) {
  const t = order.totals;
  return (
    <dl className="space-y-1.5 text-sm">
      <div className="flex justify-between"><dt className="text-muted">Subtotal</dt><dd>{money(t.subtotal)}</dd></div>
      {t.discount > 0 && <div className="flex justify-between text-success"><dt>Promo {t.promoCode}</dt><dd>−{money(t.discount)}</dd></div>}
      {t.pointsDiscount > 0 && <div className="flex justify-between text-success"><dt>Points ({num(t.pointsRedeemed)})</dt><dd>−{money(t.pointsDiscount)}</dd></div>}
      <div className="flex justify-between"><dt className="text-muted">Shipping</dt><dd>{t.shipping === 0 ? 'Free' : money(t.shipping)}</dd></div>
      <div className="flex justify-between"><dt className="text-muted">Tax</dt><dd>{money(t.tax)}</dd></div>
      <div className="flex justify-between border-t border-line pt-2 text-base font-semibold"><dt>Total</dt><dd>{money(t.total)}</dd></div>
      <div className="flex justify-between pt-1 text-xs text-muted"><dt>Paid with</dt><dd>{order.payment.brand} •••• {order.payment.last4} · auth {order.payment.authCode}</dd></div>
    </dl>
  );
}

export default function OrderConfirmation() {
  const { id = '' } = useParams();
  const user = useAuth((s) => s.user);
  const res = useAsync(() => api.orders.get(id), [id]);
  if (res.error) return <ErrorState error={res.error} onRetry={res.reload} />;
  if (!res.data) return <PageSkeleton />;
  const order = res.data;

  return (
    <div className="container-hfe py-12">
      <Seo title={`Order ${order.number} confirmed`} />
      <div className="grid items-center gap-8 rounded-card bg-emerald p-8 text-paper md:grid-cols-[1fr_auto] md:p-12">
        <div role="status">
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-gold">Order confirmed</p>
          <h1 className="mt-2 text-2xl font-semibold sm:text-3xl">Thank you! Order {order.number} is on its way to the {order.shipments.length > 1 ? 'vendors' : 'vendor'}.</h1>
          <p className="mt-3 text-paper/85">
            A copy of this confirmation is below{order.userId ? ' and in your account' : ''}. We’d email it to {order.email} (demo: no email is sent).
          </p>
          {order.userId && (
            <p className="mt-4 inline-flex flex-wrap items-center gap-2 rounded-full bg-paper/10 px-4 py-2 text-sm">
              <Icon name="gift" size={16} className="text-gold" /> +{num(order.pointsEarned)} points earned
              {order.earthCoinEarned && (
                <>
                  <span aria-hidden>·</span>
                  <Icon name="coin" size={16} className="text-gold" /> EarthCoin recorded
                </>
              )}
            </p>
          )}
        </div>
        <div className="flex items-center justify-center gap-2">
          <Mascot state="success" size={150} />
          {order.earthCoinEarned && <EarthCoinArt size={96} />}
        </div>
      </div>

      <div className="mt-10 grid gap-8 lg:grid-cols-[1fr_360px]">
        <section aria-labelledby="ship-h">
          <h2 id="ship-h" className="mb-4 text-xl font-semibold">
            {order.shipments.length} shipment{order.shipments.length > 1 ? 's' : ''}, each from its vendor
          </h2>
          <ul className="space-y-4">
            {order.shipments.map((s) => (
              <li key={s.id} className="card p-5">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <p className="font-semibold">{s.vendorName}</p>
                  <p className="text-sm text-muted">
                    {s.carrier} · {s.trackingNumber}
                  </p>
                </div>
                <ul className="mt-3 divide-y divide-line text-sm">
                  {s.lines.map((l) => (
                    <li key={`${l.productId}-${l.variantId}`} className="flex justify-between gap-3 py-2">
                      <span>
                        {l.qty} × {l.name}
                        {l.variantLabel && <span className="text-muted"> · {l.variantLabel}</span>}
                      </span>
                      <span>{money(l.lineTotal)}</span>
                    </li>
                  ))}
                </ul>
                <p className="mt-2 text-xs text-muted">
                  Returns and warranty for these items are handled by {s.vendorName}. Return window: {s.returnWindowDays} days after delivery.
                </p>
              </li>
            ))}
          </ul>
        </section>
        <aside className="space-y-4">
          <div className="card p-5">
            <h2 className="mb-3 text-lg font-semibold">Summary</h2>
            <p className="mb-3 text-sm text-muted">Placed {dateTime(order.placedAt)}</p>
            <OrderTotals order={order} />
          </div>
          <div className="card p-5 text-sm">
            <p className="font-semibold">Shipping to</p>
            <address className="mt-1 not-italic text-muted">
              {order.shippingAddress.fullName}
              <br />
              {order.shippingAddress.line1}
              {order.shippingAddress.line2 && `, ${order.shippingAddress.line2}`}
              <br />
              {order.shippingAddress.city}, {order.shippingAddress.region} {order.shippingAddress.postalCode}
            </address>
          </div>
          {user && order.userId ? (
            <ButtonLink to={`/account/orders/${order.id}`} className="w-full">
              Track this order
            </ButtonLink>
          ) : (
            <div className="rounded-soft bg-tint p-4 text-sm">
              Guest order. <Link to="/signup">Create an account</Link> to track future orders and earn points. Bookmark this page to check this order again.
            </div>
          )}
          <p className="text-xs text-muted">Demo: tracking advances every few minutes so you can watch the timeline update.</p>
        </aside>
      </div>
    </div>
  );
}
