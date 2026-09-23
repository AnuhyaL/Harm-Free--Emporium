import { Link } from 'react-router-dom';
import { Mascot } from '@/components/brand/Mascot';
import { EarnLine, PointsRedeem, PromoCodeForm, SavedForLater, SummaryRows, VendorGroupBlock } from '@/components/cart/CartParts';
import { ButtonLink, EmptyState, Icon, PageHeader, Seo } from '@/components/ui';
import { useCartSummary, useLoyalty } from '@/lib/hooks';
import { useAuth, useCart } from '@/store';

export default function Cart() {
  const user = useAuth((s) => s.user);
  const loyalty = useLoyalty();
  const balance = loyalty.data?.balance ?? 0;
  const summary = useCartSummary(undefined, balance);
  const pulse = useCart((s) => s.addPulse);
  const hasSaved = useCart((s) => s.items.some((i) => i.savedForLater));

  return (
    <>
      <Seo title="Your cart" />
      <PageHeader title="Your cart" crumbs={[{ label: 'Cart' }]} intro={summary.groups.length > 1 ? `Your order will arrive in ${summary.groups.length} shipments, one from each vendor.` : undefined} />
      <div className="container-hfe py-10">
        {summary.groups.length === 0 ? (
          <>
            <EmptyState icon="cart" title="Your cart is empty" body="Find something HarmFree. Sol will push it the rest of the way." action={{ label: 'Browse the catalog', to: '/catalog' }} />
            {hasSaved && <SavedForLater />}
          </>
        ) : (
          <div className="grid gap-8 lg:grid-cols-[1fr_380px]">
            <div>
              <div className="space-y-4">
                {summary.groups.map((g) => (
                  <VendorGroupBlock key={g.vendorId} group={g} />
                ))}
              </div>
              <p className="mt-4 flex items-start gap-2 text-sm text-muted">
                <Icon name="info" size={16} className="mt-0.5 shrink-0" />
                Each vendor ships its own items and covers shipping, returns, replacements and warranties. <Link to="/policies/shipping">Learn more</Link>
              </p>
              <SavedForLater />
            </div>
            <aside aria-labelledby="summary-h" className="lg:sticky lg:top-24 lg:self-start">
              <div className="card space-y-5 p-6">
                <div className="flex items-center justify-between">
                  <h2 id="summary-h" className="text-lg font-semibold">
                    Order summary
                  </h2>
                  <Mascot state={pulse ? 'push' : 'idle'} pulse={pulse} size={96} />
                </div>
                <PromoCodeForm summary={summary} />
                {user && <PointsRedeem summary={summary} balance={balance} />}
                <SummaryRows summary={summary} />
                <EarnLine summary={summary} member={Boolean(user)} />
                <ButtonLink to="/checkout" size="lg" className="w-full">
                  Checkout securely
                </ButtonLink>
                <p className="text-center text-xs text-muted">Shipping shown for standard delivery; choose expedited at checkout.</p>
              </div>
            </aside>
          </div>
        )}
      </div>
    </>
  );
}
