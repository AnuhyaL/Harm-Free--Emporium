import { useParams } from 'react-router-dom';
import { api } from '@/api';
import { ProductGrid } from '@/components/product/ProductRail';
import { ErrorState, Icon, PageHeader, PageSkeleton, Seo } from '@/components/ui';
import { useAsync } from '@/lib/hooks';

export default function Brand() {
  const { slug = '' } = useParams();
  const res = useAsync(() => api.vendors.get(slug), [slug]);
  if (res.error) return <ErrorState error={res.error} onRetry={res.reload} />;
  if (!res.data) return <PageSkeleton />;
  const { vendor, products } = res.data;

  return (
    <>
      <Seo title={vendor.name} description={`${vendor.tagline} Shop ${vendor.name} on HarmFree Emporium.`} />
      <PageHeader eyebrow="Vendor storefront" title={vendor.name} intro={vendor.tagline} crumbs={[{ label: 'Brands', to: '/brands' }, { label: vendor.name }]}>
        <div className="mt-4 flex flex-wrap items-center gap-2">
          {vendor.valueTags.map((t) => (
            <span key={t} className="chip">{t}</span>
          ))}
        </div>
      </PageHeader>
      <div className="container-hfe grid gap-10 py-12 lg:grid-cols-[1fr_320px]">
        <section aria-labelledby="story-h">
          <h2 id="story-h" className="text-xl font-semibold">
            Their story
          </h2>
          <p className="mt-3 text-lg">{vendor.story}</p>
        </section>
        <aside className="card space-y-4 p-5 text-sm">
          <p className="flex items-center gap-2">
            <Icon name="pin" size={16} /> {vendor.location} · founded {vendor.founded}
          </p>
          <div>
            <p className="font-semibold">Certifications</p>
            <ul className="mt-1 space-y-1 text-muted">
              {vendor.certifications.map((c) => (
                <li key={c.id}>
                  {c.name} · {c.id}
                </li>
              ))}
            </ul>
          </div>
          <div>
            <p className="font-semibold">Shipping</p>
            <p className="text-muted">Ships via {vendor.carrier}. Shipping covered by {vendor.name}.</p>
          </div>
          <div>
            <p className="font-semibold">Returns & warranty</p>
            <p className="text-muted">{vendor.returnPolicy}</p>
            <p className="mt-1 text-muted">Warranty contact: {vendor.warrantyContact}</p>
          </div>
        </aside>
      </div>
      <section aria-labelledby="products-h" className="border-t border-line bg-tint/50 py-12">
        <div className="container-hfe">
          <h2 id="products-h" className="mb-6 text-2xl font-semibold">
            Products from {vendor.name} ({products.length})
          </h2>
          <ProductGrid products={products} />
        </div>
      </section>
    </>
  );
}
