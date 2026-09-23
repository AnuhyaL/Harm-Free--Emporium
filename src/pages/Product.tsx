import { useEffect, useState, type ReactNode } from 'react';
import { Link, useParams } from 'react-router-dom';
import { api } from '@/api';
import { ProductImage } from '@/components/brand/ProductArt';
import { Gallery } from '@/components/product/Gallery';
import { QtyStepper, VariantPicker } from '@/components/product/Pickers';
import { useAddToCart, WishlistButton } from '@/components/product/ProductCard';
import { ProductRail } from '@/components/product/ProductRail';
import { ProductReviews } from '@/components/product/Reviews';
import { Breadcrumbs, Button, ErrorState, Icon, PageSkeleton, RatingLine, SealBadge, Seo } from '@/components/ui';
import { VALUE_TAG_INFO } from '@/data';
import { date, money, num, pctOff } from '@/lib/format';
import { useAsync } from '@/lib/hooks';
import { pointsForAmount, unitPrice } from '@/lib/pricing';
import { useAuth } from '@/store';

function Spec({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div className="grid grid-cols-[140px_1fr] gap-3 border-b border-line py-3 text-sm last:border-0 sm:grid-cols-[180px_1fr]">
      <dt className="text-muted">{label}</dt>
      <dd>{children}</dd>
    </div>
  );
}

export default function ProductPage() {
  const { slug = '' } = useParams();
  const res = useAsync(() => api.catalog.getProduct(slug), [slug]);
  const product = res.data?.product;
  const related = useAsync(() => (product ? api.catalog.related(product.id) : Promise.resolve([])), [product?.id]);
  const member = Boolean(useAuth((s) => s.user));
  const addToCart = useAddToCart();
  const [variantId, setVariantId] = useState<string>();
  const [qty, setQty] = useState(1);

  useEffect(() => {
    setVariantId(product?.variants[0]?.id);
    setQty(1);
  }, [product?.id]); // eslint-disable-line react-hooks/exhaustive-deps

  if (res.error) return <ErrorState error={res.error} onRetry={res.reload} />;
  if (!product || !res.data) return <PageSkeleton />;
  const vendor = res.data.vendor;

  const each = unitPrice(product, qty, variantId, false);
  const memberEach = unitPrice(product, qty, variantId, true);
  const pay = member ? memberEach : each;
  const variant = product.variants.find((v) => v.id === variantId);
  const stock = variant?.stock ?? product.inventory.stock;
  const msrp = product.pricing.msrp + (variant?.priceDelta ?? 0);
  const off = pctOff(msrp, product.pricing.price + (variant?.priceDelta ?? 0));

  return (
    <>
      <Seo title={product.name} description={`${product.tagline} Sold and warranted by ${product.brandName}. HarmFree Seal, ${product.certifications.map((c) => c.name).join(', ')}.`} />
      <div className="container-hfe pt-6">
        <Breadcrumbs items={[{ label: 'Catalog', to: '/catalog' }, { label: product.category, to: `/catalog/${product.categorySlug}` }, { label: product.name }]} />
      </div>

      <div className="container-hfe grid gap-10 pb-14 lg:grid-cols-[1.1fr_1fr]">
        <div className="lg:sticky lg:top-24 lg:self-start">
          <Gallery product={product} />
          {!product.images[0]?.src && <p className="mt-3 text-xs text-muted">Illustrations are placeholders until vendor photography is supplied.</p>}
        </div>

        <div>
          <Link to={`/brands/${vendor.slug}`} className="text-sm font-medium">
            {product.brandName}
          </Link>
          <h1 className="mt-1 text-2xl font-semibold sm:text-3xl">{product.name}</h1>
          <p className="mt-2 text-lg text-muted">{product.tagline}</p>
          <a href="#reviews" className="mt-3 inline-block no-underline">
            <RatingLine avg={product.ratingAvg} count={product.reviewCount} />
          </a>

          <div className="mt-5 rounded-card border border-line bg-surface p-5">
            <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
              <span className="font-display text-3xl font-semibold">{money(pay)}</span>
              {off > 0 && (
                <span className="text-sm text-muted">
                  MSRP <s>{money(msrp)}</s> · {off}% below MSRP
                </span>
              )}
            </div>
            <p className="mt-1 text-sm">
              {member ? (
                <span className="text-success">HFE member price applied ({product.hfeDiscount.value}% off).</span>
              ) : (
                <>
                  <strong>{money(memberEach)}</strong> HFE-buyer price · <Link to={`/login?next=/product/${product.slug}`}>sign in</Link> to apply
                </>
              )}
            </p>
            {product.pricing.tiers.length > 1 && (
              <div className="mt-3">
                <p className="text-xs font-semibold uppercase tracking-wide text-muted">Quantity pricing</p>
                <ul className="mt-1 flex flex-wrap gap-2">
                  {product.pricing.tiers.map((t) => (
                    <li key={t.minQty} className={`rounded-soft border px-3 py-1.5 text-sm ${qty >= t.minQty && (product.pricing.tiers.find((x) => x.minQty > t.minQty)?.minQty ?? Infinity) > qty ? 'border-primary bg-tint font-semibold' : 'border-line'}`}>
                      {t.minQty}+ · {money(t.unitPrice)} ea
                    </li>
                  ))}
                </ul>
              </div>
            )}

            <div className="mt-5 flex flex-wrap gap-1.5">
              {product.harmFreeSeal.granted && <SealBadge size="md" />}
              {product.valueTags.map((t) => (
                <span key={t} className="chip" title={VALUE_TAG_INFO[t]}>
                  {t}
                </span>
              ))}
            </div>

            {product.variants.length > 0 && (
              <div className="mt-5">
                <VariantPicker product={product} value={variantId} onChange={setVariantId} />
              </div>
            )}

            <div className="mt-5 flex flex-wrap items-center gap-3">
              <QtyStepper value={qty} onChange={setQty} label={product.name} max={Math.min(99, stock)} />
              <Button size="lg" className="min-w-[180px] flex-1" onClick={() => addToCart(product, qty, variantId)} disabled={stock === 0}>
                <Icon name="cart" size={18} /> {stock === 0 ? 'Out of stock' : `Add to cart · ${money(pay * qty)}`}
              </Button>
              <WishlistButton product={product} className="h-12 w-12 border border-line" />
            </div>
            <p className="mt-3 flex items-center gap-1.5 text-sm">
              <Icon name="gift" size={16} className="text-gold" /> Earn <strong>{num(pointsForAmount(pay * qty))} points</strong> with this purchase
            </p>
            <p className="mt-1 text-xs text-muted">{stock <= 10 ? `Only ${stock} left from the vendor` : 'In stock with the vendor'} · SKU {product.inventory.sku}</p>
          </div>

          <ul className="mt-5 grid gap-3 sm:grid-cols-2">
            <li className="flex gap-3 rounded-soft bg-tint p-4 text-sm">
              <Icon name="truck" className="shrink-0" />
              <span>
                <strong className="block">Ships from {vendor.name} in {product.shipping.estimateDays[0]}–{product.shipping.estimateDays[1]} business days</strong>
                {product.shipping.freeThreshold === 0 ? 'Free shipping on this item' : `Free vendor shipping on $${product.shipping.freeThreshold}+ from this vendor`} · {vendor.carrier}
              </span>
            </li>
            <li className="flex gap-3 rounded-soft bg-tint p-4 text-sm">
              <Icon name="shield" className="shrink-0" />
              <span>
                <strong className="block">{product.warranty.durationMonths >= 1200 ? 'Lifetime warranty' : product.warranty.durationMonths ? `${product.warranty.durationMonths}-month warranty` : 'Satisfaction guarantee'}</strong>
                Fulfilled by the vendor, not HFE. <a href="#warranty">Details</a>
              </span>
            </li>
          </ul>

          <section aria-labelledby="certs-h" className="mt-8">
            <h2 id="certs-h" className="mb-3 text-lg font-semibold">
              Certifications
            </h2>
            <ul className="flex flex-wrap gap-2">
              {product.certifications.map((c) => (
                <li key={c.id} className="inline-flex items-center gap-2 rounded-full border border-gold/70 bg-surface px-3 py-1.5 text-sm">
                  <Icon name="seal" size={16} className="text-gold" />
                  <span>
                    <strong>{c.name}</strong> <span className="text-muted">· {c.id}</span>
                  </span>
                </li>
              ))}
            </ul>
          </section>
        </div>
      </div>

      <div className="border-t border-line bg-tint/50">
        <div className="container-hfe grid gap-10 py-14 lg:grid-cols-2">
          <section aria-labelledby="about-h">
            <h2 id="about-h" className="text-2xl font-semibold">
              About this product
            </h2>
            <p className="mt-3 text-lg">{product.description}</p>
            <h3 className="mt-6 font-sans text-sm font-semibold uppercase tracking-wider text-muted">Key features</h3>
            <ul className="mt-2 space-y-2">
              {product.keyFeatures.map((f) => (
                <li key={f} className="flex gap-2">
                  <Icon name="check" className="mt-0.5 shrink-0 text-success" /> {f}
                </li>
              ))}
            </ul>
            <h3 className="mt-6 font-sans text-sm font-semibold uppercase tracking-wider text-muted">Why it is HarmFree</h3>
            <ul className="mt-2 space-y-2">
              {product.specialAspects.map((f) => (
                <li key={f} className="flex gap-2">
                  <Icon name="leaf" className="mt-0.5 shrink-0 text-success" /> {f}
                </li>
              ))}
            </ul>
            <div className="mt-8 grid gap-4 rounded-card border border-line bg-surface p-5 sm:grid-cols-[120px_1fr]">
              <div className="aspect-square overflow-hidden rounded-soft">
                <ProductImage product={product} image={product.usageExample.images[0]} sizes="120px" />
              </div>
              <div>
                <h3 className="font-sans text-sm font-semibold uppercase tracking-wider text-muted">In use</h3>
                <p className="mt-1">{product.usageExample.text}</p>
              </div>
            </div>
          </section>

          <section aria-labelledby="specs-h">
            <h2 id="specs-h" className="text-2xl font-semibold">
              Specifications
            </h2>
            <dl className="mt-3 rounded-card border border-line bg-surface px-5">
              <Spec label="Dimensions">{product.dimensions}</Spec>
              <Spec label="Category">
                <Link to={`/catalog/${product.categorySlug}`}>{product.category}</Link> · {product.subcategory}
              </Spec>
              <Spec label="Vendor">
                <Link to={`/brands/${vendor.slug}`}>{vendor.name}</Link> · {vendor.location}
              </Spec>
              <Spec label="MSRP">{money(product.pricing.msrp)}</Spec>
              <Spec label="HFE-buyer discount">
                {product.hfeDiscount.type === 'percent' ? `${product.hfeDiscount.value}%` : money(product.hfeDiscount.value)} · {product.hfeDiscount.note}
              </Spec>
              <Spec label="HarmFree Seal">Granted {date(product.harmFreeSeal.grantedAt)}</Spec>
              <Spec label="Patents">{product.intellectualProperty.patents.length ? product.intellectualProperty.patents.join(', ') : 'None listed'}</Spec>
              <Spec label="Trademarks">{product.intellectualProperty.trademarks.join(', ')}</Spec>
              <Spec label="Copyright">{product.intellectualProperty.copyrights.join(', ')}</Spec>
              <Spec label="SKU">{product.inventory.sku}</Spec>
            </dl>
            <div id="warranty" className="mt-6 scroll-mt-24 rounded-card border border-gold/60 bg-surface p-5">
              <h3 className="flex items-center gap-2 font-sans text-base font-semibold">
                <Icon name="shield" size={18} /> Warranty, returns & shipping
              </h3>
              <p className="mt-2 text-sm">{product.warranty.summary}</p>
              <p className="mt-2 text-sm">
                <strong>Returns:</strong> {vendor.returnPolicy} Returns route to the original manufacturer.
              </p>
              <p className="mt-2 text-sm text-muted">
                HarmFree Emporium is the storefront and vetting body. {vendor.name} sells this product and covers its shipping, returns, replacements and warranty. Warranty contact: {vendor.warrantyContact}. <Link to="/policies/warranty">Warranty policy</Link>
              </p>
            </div>
          </section>
        </div>
      </div>

      <div className="container-hfe py-14">
        <ProductReviews product={product} />
      </div>

      <section aria-labelledby="related-h" className="border-t border-line bg-tint/50 py-14">
        <div className="container-hfe">
          <h2 id="related-h" className="mb-6 text-2xl font-semibold">
            You may also like
          </h2>
          <ProductRail products={related.data} loading={related.loading} label="Related products" />
        </div>
      </section>
    </>
  );
}
