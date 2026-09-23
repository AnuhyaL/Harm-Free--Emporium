import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ProductImage } from '@/components/brand/ProductArt';
import { Icon, Price, RatingLine, SealBadge } from '@/components/ui';
import { cn } from '@/lib/format';
import { unitPrice } from '@/lib/pricing';
import { useAuth, useCart, useUI, useWishlist } from '@/store';
import type { Product } from '@/types';
import { QuickView } from './QuickView';

export function useAddToCart() {
  const add = useCart((s) => s.add);
  const setCartOpen = useUI((s) => s.setCartOpen);
  return (product: Product, qty = 1, variantId?: string) => {
    add(product.id, qty, variantId ?? product.variants[0]?.id);
    setCartOpen(true);
  };
}

export function WishlistButton({ product, className }: { product: Product; className?: string }) {
  const saved = useWishlist((s) => s.items.some((i) => i.productId === product.id));
  const toggle = useWishlist((s) => s.toggle);
  const toast = useUI((s) => s.toast);
  return (
    <button
      type="button"
      aria-pressed={saved}
      aria-label={saved ? `Remove ${product.name} from wishlist` : `Save ${product.name} to wishlist`}
      onClick={() => {
        const added = toggle(product.id);
        toast(added ? 'Saved to your wishlist' : 'Removed from wishlist', added ? { action: { label: 'View', href: '/account/wishlist' } } : undefined);
      }}
      className={cn(
        'inline-flex h-10 w-10 items-center justify-center rounded-full bg-surface/90 text-fg shadow-soft backdrop-blur transition-colors hover:bg-surface',
        className,
      )}
    >
      <Icon name="heartOutline" size={18} filled={saved} className={saved ? 'text-danger' : undefined} />
    </button>
  );
}

export function ProductCard({ product, priority }: { product: Product; priority?: boolean }) {
  const member = Boolean(useAuth((s) => s.user));
  const addToCart = useAddToCart();
  const [quick, setQuick] = useState(false);

  return (
    <motion.article
      className="group relative flex flex-col"
      initial={false}
      whileHover={{ y: -2 }}
      transition={{ duration: 0.2, ease: 'easeOut' }}
    >
      <div className="relative aspect-square overflow-hidden rounded-card border border-line bg-tint">
        <Link to={`/product/${product.slug}`} tabIndex={-1} aria-hidden className="block h-full">
          <ProductImage product={product} eager={priority} className="transition-transform duration-300 ease-out group-hover:scale-[1.03]" />
        </Link>
        <div className="absolute left-2 right-14 top-2 flex flex-col items-start gap-1.5 sm:left-3 sm:top-3">
          {product.harmFreeSeal.granted && <SealBadge compact />}
          {product.refillable && <span className="chip bg-surface/90">Refillable</span>}
        </div>
        <WishlistButton product={product} className="absolute right-2 top-2 z-10 sm:right-3 sm:top-3" />
        <div className="absolute inset-x-2 bottom-2 z-10 flex gap-1.5 sm:inset-x-3 sm:bottom-3 sm:gap-2 opacity-100 transition-opacity duration-200 [@media(hover:hover)_and_(pointer:fine)]:opacity-0 [@media(hover:hover)_and_(pointer:fine)]:group-focus-within:opacity-100 [@media(hover:hover)_and_(pointer:fine)]:group-hover:opacity-100">
          <button
            type="button"
            onClick={() => setQuick(true)}
            aria-label={`Quick view: ${product.name}`}
            className="inline-flex h-9 flex-1 items-center justify-center gap-1.5 rounded-full bg-surface/95 text-xs font-semibold text-fg shadow-soft backdrop-blur hover:bg-surface"
          >
            <Icon name="eye" size={16} />
            <span className="sm:hidden">View</span>
            <span className="max-sm:hidden">Quick view</span>
          </button>
          <button
            type="button"
            onClick={() => addToCart(product)}
            className="inline-flex h-9 flex-1 items-center justify-center gap-1.5 rounded-full bg-primary text-xs font-semibold text-primary-fg shadow-soft hover:brightness-110"
            aria-label={`Add ${product.name} to cart`}
          >
            <Icon name="plus" size={16} /> Add
          </button>
        </div>
      </div>
      <div className="mt-3 flex flex-1 flex-col gap-1">
        <p className="text-xs text-muted">{product.brandName}</p>
        <h3 className="font-sans text-sm font-semibold leading-snug sm:text-base">
          <Link to={`/product/${product.slug}`} className="text-fg no-underline after:absolute after:inset-0 after:content-[''] hover:underline focus-visible:outline-none focus-visible:after:rounded-card focus-visible:after:outline focus-visible:after:outline-[3px] focus-visible:after:outline-link">
            {product.name}
          </Link>
        </h3>
        <RatingLine avg={product.ratingAvg} count={product.reviewCount} />
        <Price
          className="mt-auto pt-1"
          price={product.pricing.price}
          msrp={product.pricing.msrp}
          member={member ? unitPrice(product, 1, undefined, true) : undefined}
        />
      </div>
      <QuickView product={product} open={quick} onOpenChange={setQuick} />
    </motion.article>
  );
}
