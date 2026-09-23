import { Link } from 'react-router-dom';
import { Mascot } from '@/components/brand/Mascot';
import { ButtonLink, EmptyState } from '@/components/ui';
import { Drawer } from '@/components/ui/Dialog';
import { money } from '@/lib/format';
import { useCartSummary, useLoyalty } from '@/lib/hooks';
import { useAuth, useCart, useUI } from '@/store';
import { EarnLine, VendorGroupBlock } from './CartParts';

export function CartDrawer() {
  const open = useUI((s) => s.cartOpen);
  const setOpen = useUI((s) => s.setCartOpen);
  const pulse = useCart((s) => s.addPulse);
  const user = useAuth((s) => s.user);
  const loyalty = useLoyalty();
  const summary = useCartSummary(undefined, loyalty.data?.balance ?? 0);
  const close = () => setOpen(false);

  return (
    <Drawer open={open} onOpenChange={setOpen} title="Your cart" description="Items in your cart, grouped by the vendor who ships them">
      <div className="relative flex-1 overflow-y-auto px-5 py-4">
        {summary.groups.length === 0 ? (
          <div className="pt-6">
            <EmptyState icon="cart" title="Your cart is empty" body="Sol is ready to push whenever you are." action={<ButtonLink to="/catalog" onClick={close}>Start shopping</ButtonLink>} />
          </div>
        ) : (
          <div className="space-y-4">
            {summary.groups.map((g) => (
              <VendorGroupBlock key={g.vendorId} group={g} compact onNavigate={close} />
            ))}
          </div>
        )}
      </div>
      <div className="border-t border-line bg-bg px-5 pb-5 pt-3">
        <div className="-mt-16 mb-1 flex justify-end" aria-hidden={summary.groups.length === 0 || undefined}>
          <div className="rounded-full bg-surface/0">
            <Mascot state={pulse ? 'push' : 'idle'} pulse={pulse} size={120} />
          </div>
        </div>
        {summary.groups.length > 0 && (
          <>
            <div className="mb-3 flex items-baseline justify-between">
              <span className="text-sm text-muted">Subtotal · {summary.itemCount} items</span>
              <span className="text-lg font-semibold">{money(summary.subtotal)}</span>
            </div>
            <EarnLine summary={summary} member={Boolean(user)} />
            <div className="mt-3 grid grid-cols-2 gap-2">
              <ButtonLink to="/cart" variant="secondary" onClick={close}>
                View cart
              </ButtonLink>
              <ButtonLink to="/checkout" onClick={close}>
                Checkout
              </ButtonLink>
            </div>
            <p className="mt-2 text-center text-xs text-muted">
              Shipping and tax calculated at checkout. <Link to="/policies/shipping" onClick={close}>Vendor shipping policy</Link>
            </p>
          </>
        )}
      </div>
    </Drawer>
  );
}
