import { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { ProductGrid } from '@/components/product/ProductRail';
import { EmptyState, Seo } from '@/components/ui';
import { lookupProduct } from '@/lib/hooks';
import { useAuth, useWishlist } from '@/store';
import { AccountNav } from './AccountLayout';

export default function Wishlist() {
  const user = useAuth((s) => s.user);
  const items = useWishlist((s) => s.items);
  const products = useMemo(() => items.map((i) => lookupProduct(i.productId)).filter((p) => p !== undefined), [items]);

  const body = (
    <>
      <Seo title="Wishlist" />
      <div className="mb-6 flex flex-wrap items-end justify-between gap-2">
        <h1 className="text-2xl font-semibold">Wishlist</h1>
        <p className="text-sm text-muted">{products.length} saved</p>
      </div>
      {!user && (
        <p className="mb-6 rounded-soft bg-tint p-4 text-sm">
          Your wishlist is saved in this browser. <Link to="/login?next=/account/wishlist">Sign in</Link> to see member pricing and earn points when you buy.
        </p>
      )}
      {products.length ? (
        <ProductGrid products={products} />
      ) : (
        <EmptyState icon="heartOutline" title="Nothing saved yet" body="Tap the heart on any product to keep it here for later." action={{ label: 'Browse the catalog', to: '/catalog' }} />
      )}
    </>
  );

  return (
    <div className="container-hfe py-10">
      {user ? (
        <div className="grid gap-8 lg:grid-cols-[240px_1fr]">
          <aside className="lg:sticky lg:top-24 lg:self-start">
            <AccountNav />
          </aside>
          <div className="min-w-0">{body}</div>
        </div>
      ) : (
        body
      )}
    </div>
  );
}
