import { useRef, useState, useEffect, useId } from 'react';
import { Icon, ProductGridSkeleton } from '@/components/ui';
import type { Product } from '@/types';
import { ProductCard } from './ProductCard';

/** Horizontally scrolling product carousel with scroll-snap and prev/next controls. */
export function ProductRail({ products, label, loading }: { products?: Product[]; label: string; loading?: boolean }) {
  const ref = useRef<HTMLUListElement>(null);
  const [edges, setEdges] = useState({ start: true, end: false });
  const id = useId();

  const update = () => {
    const el = ref.current;
    if (!el) return;
    setEdges({ start: el.scrollLeft < 8, end: el.scrollLeft + el.clientWidth > el.scrollWidth - 8 });
  };
  useEffect(update, [products]);

  const scroll = (dir: 1 | -1) => {
    const el = ref.current;
    if (el) el.scrollBy({ left: dir * el.clientWidth * 0.85, behavior: 'smooth' });
  };

  if (loading || !products) return <ProductGridSkeleton count={4} />;

  return (
    <div role="region" aria-roledescription="carousel" aria-label={label} className="relative">
      <ul
        ref={ref}
        id={id}
        onScroll={update}
        className="no-scrollbar -mx-4 flex snap-x snap-mandatory gap-4 overflow-x-auto scroll-px-4 px-4 pb-2 sm:gap-6"
      >
        {products.map((p, i) => (
          <li
            key={p.id}
            className="w-[44%] shrink-0 snap-start sm:w-[30%] lg:w-[calc(25%-18px)]"
            aria-roledescription="slide"
            aria-label={`${i + 1} of ${products.length}`}
          >
            <ProductCard product={p} />
          </li>
        ))}
      </ul>
      <div className="mt-4 flex justify-end gap-2">
        <button type="button" aria-controls={id} aria-label="Previous products" disabled={edges.start} onClick={() => scroll(-1)} className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-line bg-surface hover:bg-tint disabled:opacity-40">
          <Icon name="chevronLeft" />
        </button>
        <button type="button" aria-controls={id} aria-label="Next products" disabled={edges.end} onClick={() => scroll(1)} className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-line bg-surface hover:bg-tint disabled:opacity-40">
          <Icon name="chevronRight" />
        </button>
      </div>
    </div>
  );
}

export function ProductGrid({ products }: { products: Product[] }) {
  return (
    <ul className="grid grid-cols-2 gap-x-4 gap-y-8 sm:gap-x-6 md:grid-cols-3 lg:grid-cols-4">
      {products.map((p, i) => (
        <li key={p.id}>
          <ProductCard product={p} priority={i < 4} />
        </li>
      ))}
    </ul>
  );
}
