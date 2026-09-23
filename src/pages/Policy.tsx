import { NavLink, useParams } from 'react-router-dom';
import { api } from '@/api';
import { ErrorState, PageHeader, PageSkeleton, Seo } from '@/components/ui';
import { policies } from '@/data';
import { cn, date } from '@/lib/format';
import { useAsync } from '@/lib/hooks';

export default function Policy() {
  const { slug = 'terms' } = useParams();
  const policy = useAsync(() => api.content.policy(slug), [slug]);

  if (policy.error) return <ErrorState error={policy.error} onRetry={policy.reload} />;
  if (!policy.data) return <PageSkeleton />;
  const p = policy.data;

  return (
    <>
      <Seo title={p.title} description={p.summary} />
      <PageHeader eyebrow="Policies" title={p.title} intro={p.summary} crumbs={[{ label: 'Policies', to: '/policies/terms' }, { label: p.title }]}>
        <p className="mt-3 text-sm text-muted">Last updated {date(p.updated)}</p>
      </PageHeader>
      <div className="container-hfe grid gap-10 py-14 lg:grid-cols-[220px_1fr]">
        <nav aria-label="Policies" className="lg:sticky lg:top-24 lg:self-start">
          <ul className="flex flex-wrap gap-2 lg:flex-col lg:gap-1">
            {policies.map((x) => (
              <li key={x.slug}>
                <NavLink
                  to={`/policies/${x.slug}`}
                  className={({ isActive }) => cn('block rounded-soft px-3 py-2 text-sm no-underline', isActive ? 'bg-primary text-primary-fg' : 'text-fg hover:bg-tint')}
                >
                  {x.title}
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>
        <article className="prose-hfe max-w-3xl">
          <div className="mb-8 rounded-soft border border-gold/60 bg-tint px-4 py-3 text-sm">
            <strong>Marketplace note:</strong> Products on HarmFree Emporium are sold and fulfilled by independent vendors, who cover shipping, returns, replacements and warranties. HarmFree Emporium is the storefront and vetting body, not the liable party.
          </div>
          {p.sections.map((s) => (
            <section key={s.heading}>
              <h2>{s.heading}</h2>
              {s.body.map((b, i) => (
                <p key={i}>{b}</p>
              ))}
            </section>
          ))}
          <p className="mt-10 text-xs text-muted">Draft policy text for the demo. To be reviewed by counsel before launch.</p>
        </article>
      </div>
    </>
  );
}
