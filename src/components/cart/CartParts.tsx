import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { ProductImage } from '@/components/brand/ProductArt';
import { Button, Icon } from '@/components/ui';
import { QtyStepper } from '@/components/product/Pickers';
import { REWARDS } from '@/data';
import { cn, money, num } from '@/lib/format';
import type { CartSummary, PricedLine, VendorGroup } from '@/lib/pricing';
import { lookupProduct } from '@/lib/hooks';
import { useCart } from '@/store';
import type { CartItem } from '@/types';

export function CartLine({ line, compact, onNavigate }: { line: PricedLine; compact?: boolean; onNavigate?: () => void }) {
  const setQty = useCart((s) => s.setQty);
  const remove = useCart((s) => s.remove);
  const toggleSaved = useCart((s) => s.toggleSaved);
  const { product, item } = line;
  return (
    <li className="flex gap-3 py-4">
      <Link to={`/product/${product.slug}`} onClick={onNavigate} className={cn('shrink-0 overflow-hidden rounded-soft border border-line', compact ? 'h-20 w-20' : 'h-24 w-24 sm:h-28 sm:w-28')} tabIndex={-1} aria-hidden>
        <ProductImage product={product} sizes="112px" />
      </Link>
      <div className="flex min-w-0 flex-1 flex-col gap-1">
        <div className="flex justify-between gap-3">
          <div className="min-w-0">
            <Link to={`/product/${product.slug}`} onClick={onNavigate} className="line-clamp-2 text-sm font-semibold text-fg no-underline hover:underline">
              {product.name}
            </Link>
            {line.variantLabel && <p className="text-xs text-muted">{line.variantLabel}</p>}
            <p className="text-xs text-muted">{money(line.unitPrice)} each</p>
          </div>
          <p className="shrink-0 text-sm font-semibold">{money(line.lineTotal)}</p>
        </div>
        <div className="mt-auto flex flex-wrap items-center gap-x-3 gap-y-2 pt-1">
          <QtyStepper size="sm" value={item.qty} label={product.name} onChange={(n) => setQty(item.productId, item.variantId, n)} />
          <button type="button" className="text-xs font-medium text-link underline-offset-2 hover:underline" onClick={() => toggleSaved(item.productId, item.variantId)}>
            Save for later
          </button>
          <button type="button" className="text-xs font-medium text-muted hover:text-danger hover:underline" onClick={() => remove(item.productId, item.variantId)} aria-label={`Remove ${product.name}`}>
            Remove
          </button>
        </div>
        {product.pricing.tiers.length > 1 && (
          <p className="text-[11px] text-muted">
            Buy {product.pricing.tiers[1].minQty}+ for {money(product.pricing.tiers[1].unitPrice)} each
            {product.pricing.tiers[2] && ` · ${product.pricing.tiers[2].minQty}+ for ${money(product.pricing.tiers[2].unitPrice)}`}
          </p>
        )}
      </div>
    </li>
  );
}

export function VendorGroupBlock({ group, compact, onNavigate }: { group: VendorGroup; compact?: boolean; onNavigate?: () => void }) {
  return (
    <section aria-label={`Items shipped by ${group.vendorName}`} className="rounded-card border border-line bg-surface px-4">
      <header className="flex flex-wrap items-center justify-between gap-2 border-b border-line py-3">
        <p className="flex items-center gap-2 text-sm font-semibold">
          <Icon name="truck" size={16} className="text-muted" /> Ships from {group.vendorName}
        </p>
        <p className="text-xs text-muted">
          {group.freeShippingGap > 0 ? (
            <>Add {money(group.freeShippingGap)} from this vendor for free shipping</>
          ) : (
            <span className="font-medium text-success">Free standard shipping</span>
          )}
        </p>
      </header>
      <ul className="divide-y divide-line">
        {group.lines.map((l) => (
          <CartLine key={`${l.item.productId}-${l.item.variantId}`} line={l} compact={compact} onNavigate={onNavigate} />
        ))}
      </ul>
    </section>
  );
}

export function SavedForLater() {
  const all = useCart((s) => s.items);
  const items = useMemo(() => all.filter((i) => i.savedForLater), [all]);
  const toggleSaved = useCart((s) => s.toggleSaved);
  const remove = useCart((s) => s.remove);
  if (!items.length) return null;
  return (
    <section aria-labelledby="saved-heading" className="mt-10">
      <h2 id="saved-heading" className="mb-3 text-lg font-semibold">
        Saved for later ({items.length})
      </h2>
      <SavedList items={items} onMove={toggleSaved} onRemove={remove} />
    </section>
  );
}

function SavedList({ items, onMove, onRemove }: { items: CartItem[]; onMove: (id: string, v?: string) => void; onRemove: (id: string, v?: string) => void }) {
  return (
    <ul className="grid gap-3 sm:grid-cols-2">
      {items.map((i) => {
        const p = lookupProduct(i.productId);
        if (!p) return null;
        return (
          <li key={`${i.productId}-${i.variantId}`} className="flex items-center gap-3 rounded-card border border-line bg-surface p-3">
            <span className="h-16 w-16 shrink-0 overflow-hidden rounded-lg">
              <ProductImage product={p} sizes="64px" />
            </span>
            <div className="min-w-0 flex-1">
              <Link to={`/product/${p.slug}`} className="block truncate text-sm font-semibold text-fg no-underline hover:underline">
                {p.name}
              </Link>
              <div className="mt-1 flex gap-3">
                <button type="button" className="text-xs font-medium text-link hover:underline" onClick={() => onMove(i.productId, i.variantId)}>
                  Move to cart
                </button>
                <button type="button" className="text-xs text-muted hover:text-danger hover:underline" onClick={() => onRemove(i.productId, i.variantId)}>
                  Remove
                </button>
              </div>
            </div>
          </li>
        );
      })}
    </ul>
  );
}

export function PromoCodeForm({ summary }: { summary: CartSummary }) {
  const promoCode = useCart((s) => s.promoCode);
  const setPromo = useCart((s) => s.setPromo);
  const [value, setValue] = useState(promoCode ?? '');

  if (summary.promo) {
    return (
      <div className="flex items-center justify-between rounded-soft bg-tint px-3 py-2 text-sm">
        <span>
          <strong>{summary.promo.code}</strong> · {summary.promo.label}
        </span>
        <button type="button" className="text-xs font-medium text-link hover:underline" onClick={() => { setPromo(undefined); setValue(''); }}>
          Remove
        </button>
      </div>
    );
  }
  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        setPromo(value.trim() ? value.trim().toUpperCase() : undefined);
      }}
    >
      <label htmlFor="promo" className="label">
        Promo code
      </label>
      <div className="flex gap-2">
        <input id="promo" value={value} onChange={(e) => setValue(e.target.value)} className="input h-10 py-0 uppercase" placeholder="e.g. HARMFREE10" aria-invalid={summary.promoError ? true : undefined} aria-describedby={summary.promoError ? 'promo-err' : 'promo-hint'} />
        <Button type="submit" variant="secondary" size="sm" className="h-10">
          Apply
        </Button>
      </div>
      {summary.promoError ? (
        <p id="promo-err" role="alert" className="mt-1 text-xs text-danger">
          {summary.promoError}
        </p>
      ) : (
        <p id="promo-hint" className="mt-1 text-xs text-muted">
          Demo codes: HARMFREE10, EARTHDAY, WELCOME15
        </p>
      )}
    </form>
  );
}

export function PointsRedeem({ summary, balance }: { summary: CartSummary; balance: number }) {
  const pointsToRedeem = useCart((s) => s.pointsToRedeem);
  const setPoints = useCart((s) => s.setPointsToRedeem);
  const max = summary.maxRedeemablePoints;
  const step = 100;
  const usable = Math.floor(max / step) * step;
  const current = Math.min(pointsToRedeem, usable);

  return (
    <fieldset className="rounded-soft border border-line p-3">
      <legend className="px-1 text-sm font-semibold">Use HarmFree points</legend>
      <p className="text-xs text-muted">
        You have {num(balance)} points · {REWARDS.pointsPerDollarValue} points = $1 · up to half your order
      </p>
      {usable < step ? (
        <p className="mt-2 text-xs text-muted">Not enough points to redeem on this order yet.</p>
      ) : (
        <div className="mt-3">
          <label htmlFor="points-range" className="flex justify-between text-sm">
            <span>Redeem</span>
            <span className="font-semibold">
              {num(current)} pts = {money(current / REWARDS.pointsPerDollarValue)}
            </span>
          </label>
          <input
            id="points-range"
            type="range"
            min={0}
            max={usable}
            step={step}
            value={current}
            onChange={(e) => setPoints(Number(e.target.value))}
            className="mt-2 w-full accent-[rgb(var(--primary))]"
          />
        </div>
      )}
    </fieldset>
  );
}

export function SummaryRows({ summary, showShipping = true }: { summary: CartSummary; showShipping?: boolean }) {
  return (
    <dl className="space-y-2 text-sm">
      <div className="flex justify-between">
        <dt className="text-muted">Subtotal ({summary.itemCount} items)</dt>
        <dd>{money(summary.subtotal)}</dd>
      </div>
      {summary.promo && (
        <div className="flex justify-between text-success">
          <dt>Promo {summary.promo.code}</dt>
          <dd>−{money(summary.promo.amount)}</dd>
        </div>
      )}
      {summary.pointsDiscount > 0 && (
        <div className="flex justify-between text-success">
          <dt>Points ({num(summary.pointsRedeemed)})</dt>
          <dd>−{money(summary.pointsDiscount)}</dd>
        </div>
      )}
      {showShipping && (
        <div className="flex justify-between">
          <dt className="text-muted">Shipping ({summary.groups.length} {summary.groups.length === 1 ? 'shipment' : 'shipments'})</dt>
          <dd>{summary.shipping === 0 ? 'Free' : money(summary.shipping)}</dd>
        </div>
      )}
      <div className="flex justify-between">
        <dt className="text-muted">Estimated tax</dt>
        <dd>{money(summary.tax)}</dd>
      </div>
      <div className="flex justify-between border-t border-line pt-3 text-base font-semibold">
        <dt>Total</dt>
        <dd>{money(summary.total)}</dd>
      </div>
    </dl>
  );
}

export function EarnLine({ summary, member }: { summary: CartSummary; member: boolean }) {
  return (
    <div className="rounded-soft bg-tint px-3 py-2.5 text-xs">
      <p className="flex items-center gap-1.5 font-medium">
        <Icon name="gift" size={14} />
        {member ? `You’ll earn ${num(summary.pointsEarned)} points on this order` : (
          <span>
            <Link to="/login?next=/cart">Sign in</Link> to earn {num(summary.pointsEarned)} points and member pricing
          </span>
        )}
      </p>
      {summary.earthCoinEligible && member && (
        <p className="mt-1 flex items-center gap-1.5 text-muted">
          <Icon name="coin" size={14} className="text-gold" /> This order qualifies for an EarthCoin ($35+)
        </p>
      )}
    </div>
  );
}
