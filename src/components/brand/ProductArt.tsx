/**
 * Placeholder product imagery: palette illustrations generated from the category glyph.
 * When real photos exist, ProductImage renders <img srcset> instead (see ASSETS_NEEDED.md).
 */
import { categoryBySlug } from '@/data/categories';
import { iconPath } from '@/components/ui/Icon';
import { cn } from '@/lib/format';
import type { Product, ProductImage as Img } from '@/types';

const GROUNDS = ['--hfe-mist', '--hfe-sage', '--hfe-sky', '--hfe-paper'] as const;
const INKS = ['--hfe-emerald', '--hfe-navy', '--hfe-emerald', '--hfe-navy'] as const;

function hash(s: string) {
  let h = 0;
  for (const c of s) h = (h * 33 + c.charCodeAt(0)) >>> 0;
  return h;
}

const c = (v: string, a = 1) => `rgb(var(${v}) / ${a})`;

export function ProductArt({ product, angle = 'front', className }: { product: Product; angle?: Img['angle']; className?: string }) {
  const h = hash(product.slug);
  const ground = GROUNDS[h % GROUNDS.length];
  const ink = INKS[h % INKS.length];
  const path = iconPath(categoryBySlug(product.categorySlug)?.icon ?? 'leaf');
  const id = `g-${product.id}-${angle}`;

  return (
    <svg viewBox="0 0 400 400" className={cn('h-full w-full', className)} role="presentation" aria-hidden preserveAspectRatio="xMidYMid slice">
      <defs>
        <linearGradient id={id} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor={c(ground)} />
          <stop offset="1" stopColor={c(ground === '--hfe-paper' ? '--hfe-mist' : '--hfe-paper')} />
        </linearGradient>
      </defs>
      <rect width="400" height="400" fill={`url(#${id})`} />
      {angle === 'front' && (
        <>
          <circle cx="200" cy="200" r="128" fill={c('--hfe-paper', 0.6)} />
          <circle cx="200" cy="200" r="128" fill="none" stroke={c('--hfe-gold', 0.7)} strokeWidth="1.5" />
          <svg x="110" y="110" width="180" height="180" viewBox="0 0 24 24">
            <path d={path} fill="none" stroke={c(ink)} strokeWidth="1.1" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </>
      )}
      {angle === 'detail' && (
        <>
          <svg x="-40" y="-20" width="480" height="480" viewBox="0 0 24 24">
            <path d={path} fill="none" stroke={c(ink, 0.85)} strokeWidth="0.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          <circle cx="300" cy="96" r="44" fill="none" stroke={c('--hfe-gold')} strokeWidth="2" strokeDasharray="4 6" />
        </>
      )}
      {angle === 'context' && (
        <>
          <rect x="0" y="286" width="400" height="114" fill={c('--hfe-sage', 0.7)} />
          <path d="M40 286c10-60 40-90 70-100-6 40-30 80-70 100z" fill={c('--hfe-emerald', 0.35)} />
          <path d="M360 286c-8-44-30-70-56-80 4 34 24 64 56 80z" fill={c('--hfe-emerald', 0.25)} />
          <ellipse cx="200" cy="292" rx="96" ry="10" fill={c('--hfe-navy', 0.12)} />
          <svg x="120" y="136" width="160" height="160" viewBox="0 0 24 24">
            <path d={path} fill={c('--hfe-paper', 0.7)} stroke={c(ink)} strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </>
      )}
      {angle === 'pack' && (
        <>
          <path d="M110 150 200 110l90 40v130l-90 40-90-40z" fill={c('--hfe-paper')} stroke={c('--hfe-slate', 0.6)} strokeWidth="2" />
          <path d="M110 150l90 40 90-40M200 190v130" fill="none" stroke={c('--hfe-slate', 0.6)} strokeWidth="2" />
          <svg x="214" y="210" width="60" height="60" viewBox="0 0 24 24">
            <path d={path} fill="none" stroke={c(ink)} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          <circle cx="152" cy="240" r="20" fill="none" stroke={c('--hfe-gold')} strokeWidth="2" />
          <path d="m143 240 6 6 12-12" fill="none" stroke={c('--hfe-emerald')} strokeWidth="2.5" strokeLinecap="round" />
        </>
      )}
    </svg>
  );
}

/** Renders a real image when available, otherwise the palette illustration. */
export function ProductImage({
  product,
  image,
  className,
  sizes = '(min-width: 1024px) 25vw, 50vw',
  eager,
}: {
  product: Product;
  image?: Img;
  className?: string;
  sizes?: string;
  eager?: boolean;
}) {
  const img = image ?? product.images[0];
  if (img?.src) {
    return (
      <img
        src={img.src}
        srcSet={img.srcSet}
        sizes={sizes}
        alt={img.alt}
        loading={eager ? 'eager' : 'lazy'}
        decoding="async"
        width={800}
        height={800}
        className={cn('h-full w-full object-cover', className)}
      />
    );
  }
  return (
    <div role="img" aria-label={`${img?.alt ?? product.name} (illustration placeholder)`} className={cn('h-full w-full', className)}>
      <ProductArt product={product} angle={img?.angle} />
    </div>
  );
}
