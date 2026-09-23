import { useState } from 'react';
import { Link } from 'react-router-dom';
import { ProductImage } from '@/components/brand/ProductArt';
import { Button, Price, RatingLine, SealBadge } from '@/components/ui';
import { Modal } from '@/components/ui/Dialog';
import { unitPrice } from '@/lib/pricing';
import { useAuth, useCart, useUI } from '@/store';
import type { Product } from '@/types';
import { QtyStepper, VariantPicker } from './Pickers';

export function QuickView({ product, open, onOpenChange }: { product: Product; open: boolean; onOpenChange: (o: boolean) => void }) {
  const member = Boolean(useAuth((s) => s.user));
  const add = useCart((s) => s.add);
  const setCartOpen = useUI((s) => s.setCartOpen);
  const [variantId, setVariantId] = useState(product.variants[0]?.id);
  const [qty, setQty] = useState(1);

  if (!open) return null;
  const price = unitPrice(product, qty, variantId, false);

  return (
    <Modal open={open} onOpenChange={onOpenChange} title={product.name} hideTitle>
      <div className="grid gap-6 sm:grid-cols-2">
        <div className="aspect-square overflow-hidden rounded-card bg-tint">
          <ProductImage product={product} eager sizes="(min-width: 640px) 360px, 90vw" />
        </div>
        <div className="flex flex-col gap-3">
          <p className="text-sm text-muted">{product.brandName}</p>
          <h2 className="text-xl font-semibold" aria-hidden>
            {product.name}
          </h2>
          <RatingLine avg={product.ratingAvg} count={product.reviewCount} />
          <Price price={price} msrp={product.pricing.msrp} member={member ? unitPrice(product, qty, variantId, true) : undefined} className="text-lg" />
          <p className="text-sm text-muted">{product.tagline}</p>
          <div className="flex flex-wrap gap-1.5">
            <SealBadge />
            {product.valueTags.slice(0, 4).map((t) => (
              <span key={t} className="chip">{t}</span>
            ))}
          </div>
          {product.variants.length > 0 && <VariantPicker product={product} value={variantId} onChange={setVariantId} />}
          <div className="mt-2 flex flex-wrap items-center gap-3">
            <QtyStepper value={qty} onChange={setQty} label={product.name} />
            <Button
              className="flex-1"
              onClick={() => {
                add(product.id, qty, variantId);
                onOpenChange(false);
                setCartOpen(true);
              }}
            >
              Add to cart
            </Button>
          </div>
          <Link to={`/product/${product.slug}`} className="mt-1 text-sm font-medium" onClick={() => onOpenChange(false)}>
            See full details, certifications and reviews
          </Link>
        </div>
      </div>
    </Modal>
  );
}
