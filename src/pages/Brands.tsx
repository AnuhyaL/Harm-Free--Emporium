import { Link } from 'react-router-dom';
import { api } from '@/api';
import { ButtonLink, ErrorState, PageHeader, Seo, Skeleton } from '@/components/ui';
import { useAsync } from '@/lib/hooks';

export default function Brands() {
  const res = useAsync(() => api.vendors.list(), []);
  return (
    <>
      <Seo title="Brands" description="The vetted vendors behind HarmFree Emporium. Each ships, supports and warrants its own products." />
      <PageHeader
        eyebrow="Vendor directory"
        title="The makers behind the Emporium"
        intro="Every vendor signs the HFE collaboration agreement and covers shipping, returns, replacements and warranties for what they sell."
        crumbs={[{ label: 'Brands' }]}
      />
      <div className="container-hfe py-12">
        {res.error && <ErrorState error={res.error} onRetry={res.reload} />}
        {res.loading ? (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 6 }).map((_, i) => (
              <Skeleton key={i} className="h-56" />
            ))}
          </div>
        ) : (
          <ul className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {res.data?.map(({ vendor, productCount }) => (
              <li key={vendor.id} className="group relative flex flex-col rounded-card border border-line bg-surface p-6 shadow-soft transition-shadow hover:shadow-lift">
                <span className="mb-4 inline-flex h-14 w-14 items-center justify-center rounded-full bg-primary font-display text-2xl font-semibold text-primary-fg ring-2 ring-gold">{vendor.name.charAt(0)}</span>
                <h2 className="text-xl font-semibold">
                  <Link to={`/brands/${vendor.slug}`} className="text-fg no-underline after:absolute after:inset-0 group-hover:underline">
                    {vendor.name}
                  </Link>
                </h2>
                <p className="text-sm text-muted">
                  {vendor.location} · since {vendor.founded}
                </p>
                <p className="mt-3 flex-1 text-sm">{vendor.tagline}</p>
                <div className="mt-4 flex flex-wrap gap-1.5">
                  {vendor.valueTags.map((t) => (
                    <span key={t} className="chip">{t}</span>
                  ))}
                </div>
                <p className="mt-4 text-xs font-medium text-muted">{productCount} products</p>
              </li>
            ))}
          </ul>
        )}
        <div className="mt-12 rounded-card bg-emerald p-8 text-paper sm:flex sm:items-center sm:justify-between">
          <div>
            <p className="font-display text-xl font-semibold">Make HarmFree products?</p>
            <p className="mt-1 text-paper/80">Apply to list them, and tell your story through Regen Media.</p>
          </div>
          <ButtonLink to="/vendors/apply" variant="gold" className="mt-4 sm:mt-0">
            Apply to sell
          </ButtonLink>
        </div>
      </div>
    </>
  );
}
