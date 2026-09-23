import { useState, type KeyboardEvent, type MouseEvent } from 'react';
import { ProductImage } from '@/components/brand/ProductArt';
import { Icon } from '@/components/ui';
import { Modal } from '@/components/ui/Dialog';
import { cn } from '@/lib/format';
import type { Product } from '@/types';

/** Multi-angle gallery with hover zoom (pointer) and a full-screen zoom dialog (everyone). */
export function Gallery({ product }: { product: Product }) {
  const [index, setIndex] = useState(0);
  const [zoomOpen, setZoomOpen] = useState(false);
  const [origin, setOrigin] = useState<string | null>(null);
  const images = product.images;
  const img = images[index];

  const onMove = (e: MouseEvent<HTMLButtonElement>) => {
    const r = e.currentTarget.getBoundingClientRect();
    setOrigin(`${((e.clientX - r.left) / r.width) * 100}% ${((e.clientY - r.top) / r.height) * 100}%`);
  };
  const onThumbKey = (e: KeyboardEvent) => {
    if (e.key === 'ArrowRight') setIndex((i) => (i + 1) % images.length);
    if (e.key === 'ArrowLeft') setIndex((i) => (i - 1 + images.length) % images.length);
  };

  return (
    <div className="flex flex-col-reverse gap-3 sm:flex-row">
      {images.length > 1 && (
      <div role="tablist" aria-label="Product images" aria-orientation="vertical" className="flex gap-2 sm:flex-col" onKeyDown={onThumbKey}>
        {images.map((im, i) => (
          <button
            key={i}
            type="button"
            role="tab"
            aria-selected={i === index}
            aria-label={im.alt}
            tabIndex={i === index ? 0 : -1}
            onClick={() => setIndex(i)}
            className={cn('h-16 w-16 overflow-hidden rounded-soft border-2 transition-colors sm:h-20 sm:w-20', i === index ? 'border-primary' : 'border-line hover:border-muted')}
          >
            <ProductImage product={product} image={im} sizes="80px" />
          </button>
        ))}
      </div>
      )}
      <div className="min-w-0 flex-1">
        <div className="relative">
        <button
          type="button"
          role={images.length > 1 ? 'tabpanel' : undefined}
          aria-label={`${img.alt}. Open zoomed view`}
          onClick={() => setZoomOpen(true)}
          onMouseMove={onMove}
          onMouseLeave={() => setOrigin(null)}
          className="group block aspect-square w-full cursor-zoom-in overflow-hidden rounded-card border border-line bg-tint"
        >
          <div className="h-full w-full transition-transform duration-200 ease-out" style={origin ? { transform: 'scale(1.8)', transformOrigin: origin } : undefined}>
            <ProductImage product={product} image={img} eager sizes="(min-width: 1024px) 560px, 100vw" />
          </div>
        </button>
        <span className="pointer-events-none absolute bottom-3 right-3 inline-flex items-center gap-1 rounded-full bg-surface/90 px-2.5 py-1 text-xs font-medium shadow-soft">
          <Icon name="search" size={14} /> Zoom
        </span>
        </div>
        {img.credit && (
          <p className="mt-2 text-xs text-muted">
            Representative photo by{' '}
            <a href={img.credit.url} target="_blank" rel="noopener noreferrer">
              {img.credit.name}
            </a>{' '}
            on{' '}
            <a href={img.credit.source === 'Pexels' ? 'https://www.pexels.com/' : 'https://unsplash.com/?utm_source=harmfree&utm_medium=referral'} target="_blank" rel="noopener noreferrer">
              {img.credit.source}
            </a>
          </p>
        )}
      </div>
      <Modal open={zoomOpen} onOpenChange={setZoomOpen} title={img.alt} className="max-w-5xl">
        <div className="mt-4 aspect-square max-h-[75vh] w-full overflow-auto rounded-soft bg-tint">
          <div className="h-[160%] w-[160%]">
            <ProductImage product={product} image={img} sizes="1600px" />
          </div>
        </div>
        <div className="mt-3 flex justify-center gap-2">
          {images.map((im, i) => (
            <button key={i} type="button" onClick={() => setIndex(i)} aria-label={im.alt} aria-pressed={i === index} className={cn('h-3 w-3 rounded-full', i === index ? 'bg-primary' : 'bg-line')} />
          ))}
        </div>
      </Modal>
    </div>
  );
}
