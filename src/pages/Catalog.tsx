import { useMemo, useState, type ReactNode } from 'react';
import { Link, useNavigate, useParams, useSearchParams } from 'react-router-dom';
import { api } from '@/api';
import { ProductGrid } from '@/components/product/ProductRail';
import { Button, EmptyState, ErrorState, Icon, PageHeader, ProductGridSkeleton, Seo, Stars } from '@/components/ui';
import { Drawer } from '@/components/ui/Dialog';
import { categories, categoryBySlug, categoryGroups } from '@/data';
import { cn, num } from '@/lib/format';
import { useAsync, useMediaQuery } from '@/lib/hooks';
import type { FacetCount, ProductPage, ProductQuery, SortKey, ValueTag } from '@/types';

const SORTS: { value: SortKey; label: string }[] = [
  { value: 'relevance', label: 'Relevance' },
  { value: 'best-selling', label: 'Best selling' },
  { value: 'rating', label: 'Top rated' },
  { value: 'newest', label: 'Newest' },
  { value: 'price-asc', label: 'Price: low to high' },
  { value: 'price-desc', label: 'Price: high to low' },
];
const PAGE_SIZE = 12;

const list = (v: string | null) => (v ? v.split(',').filter(Boolean) : []);

function parseQuery(params: URLSearchParams, category?: string): ProductQuery {
  const n = (k: string) => {
    const v = params.get(k);
    return v !== null && v !== '' && Number.isFinite(Number(v)) ? Number(v) : undefined;
  };
  return {
    q: params.get('q') ?? undefined,
    category,
    group: params.get('group') ?? undefined,
    values: list(params.get('values')) as ValueTag[],
    certs: list(params.get('certs')),
    vendors: list(params.get('vendors')),
    minPrice: n('min'),
    maxPrice: n('max'),
    minRating: n('rating'),
    refillable: params.get('refillable') === '1',
    sort: (params.get('sort') as SortKey) || 'relevance',
    page: n('page') ?? 1,
    pageSize: PAGE_SIZE,
  };
}

function AZIndex() {
  const byLetter = useMemo(() => {
    const m = new Map<string, typeof categories>();
    for (const c of categories) {
      const L = c.name.charAt(0).toUpperCase();
      m.set(L, [...(m.get(L) ?? []), c]);
    }
    return [...m.entries()];
  }, []);
  // Collapsed on phones so products show up without a long scroll; open on tablets and up.
  const wide = useMediaQuery('(min-width: 768px)');
  return (
    <details className="group mb-10 rounded-card border border-line bg-surface" open={wide}>
      <summary className="flex cursor-pointer list-none items-center justify-between px-5 py-4 [&::-webkit-details-marker]:hidden">
        <span>
          <span className="font-display text-lg font-semibold">All categories, A–Z</span>
          <span className="ml-2 text-sm text-muted">{categories.length} categories</span>
        </span>
        <Icon name="chevronDown" className="transition-transform group-open:rotate-180" />
      </summary>
      <div className="border-t border-line px-5 py-5">
        <nav aria-label="Jump to letter" className="mb-4 flex flex-wrap gap-1">
          {byLetter.map(([L]) => (
            <a key={L} href={`#az-${L}`} className="inline-flex h-8 w-8 items-center justify-center rounded-full border border-line text-sm font-semibold text-fg no-underline hover:bg-tint">
              {L}
            </a>
          ))}
        </nav>
        <div className="columns-1 gap-8 sm:columns-2 lg:columns-3">
          {byLetter.map(([L, cats]) => (
            <div key={L} id={`az-${L}`} className="mb-4 break-inside-avoid scroll-mt-24">
              <p className="mb-1 font-display text-lg font-semibold text-gold">{L}</p>
              <ul className="space-y-1">
                {cats.map((c) => (
                  <li key={c.slug}>
                    <Link to={`/catalog/${c.slug}`} className="text-sm text-fg no-underline hover:underline">
                      {c.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </details>
  );
}

function FacetGroup({ title, children, defaultOpen = true }: { title: string; children: ReactNode; defaultOpen?: boolean }) {
  return (
    <details className="group border-b border-line py-4" open={defaultOpen}>
      <summary className="flex cursor-pointer list-none items-center justify-between text-sm font-semibold [&::-webkit-details-marker]:hidden">
        {title}
        <Icon name="chevronDown" size={16} className="transition-transform group-open:rotate-180" />
      </summary>
      <div className="mt-3">{children}</div>
    </details>
  );
}

function CheckList({ items, selected, onToggle, name }: { items: FacetCount[]; selected: string[]; onToggle: (v: string) => void; name: string }) {
  if (!items.length) return <p className="text-xs text-muted">No options for this search.</p>;
  return (
    <ul className="max-h-60 space-y-1.5 overflow-y-auto pr-1">
      {items.map((f) => {
        const id = `${name}-${f.value}`;
        return (
          <li key={f.value}>
            <label htmlFor={id} className="flex cursor-pointer items-center gap-2 text-sm">
              <input id={id} type="checkbox" checked={selected.includes(f.value)} onChange={() => onToggle(f.value)} className="h-4 w-4 accent-[rgb(var(--primary))]" />
              <span className="flex-1">{f.label}</span>
              <span className="text-xs text-muted">{f.count}</span>
            </label>
          </li>
        );
      })}
    </ul>
  );
}

interface FacetsProps {
  page?: ProductPage;
  query: ProductQuery;
  set: (patch: Record<string, string | undefined>) => void;
  toggleList: (key: 'values' | 'certs' | 'vendors', v: string) => void;
  onCategory: (slug?: string) => void;
}

function Facets({ page, query, set, toggleList, onCategory }: FacetsProps) {
  const [min, setMin] = useState(query.minPrice?.toString() ?? '');
  const [max, setMax] = useState(query.maxPrice?.toString() ?? '');
  const f = page?.facets;
  return (
    <div>
      <FacetGroup title="Category">
        <ul className="max-h-64 space-y-1 overflow-y-auto pr-1 text-sm">
          {query.category && (
            <li>
              <button type="button" className="text-link hover:underline" onClick={() => onCategory(undefined)}>
                ← All categories
              </button>
            </li>
          )}
          {f?.categories.map((c) => (
            <li key={c.value}>
              <button
                type="button"
                onClick={() => onCategory(c.value)}
                aria-current={query.category === c.value ? 'true' : undefined}
                className={cn('flex w-full justify-between gap-2 rounded px-1 py-0.5 text-left hover:bg-tint', query.category === c.value && 'font-semibold')}
              >
                <span>{c.label}</span>
                <span className="text-xs text-muted">{c.count}</span>
              </button>
            </li>
          ))}
        </ul>
      </FacetGroup>
      <FacetGroup title="Values">
        <CheckList name="val" items={f?.values ?? []} selected={query.values ?? []} onToggle={(v) => toggleList('values', v)} />
      </FacetGroup>
      <FacetGroup title="Certification" defaultOpen={false}>
        <CheckList name="cert" items={f?.certs ?? []} selected={query.certs ?? []} onToggle={(v) => toggleList('certs', v)} />
      </FacetGroup>
      <FacetGroup title="Price">
        <form
          className="flex items-end gap-2"
          onSubmit={(e) => {
            e.preventDefault();
            set({ min: min || undefined, max: max || undefined });
          }}
        >
          <label className="flex-1 text-xs">
            <span className="mb-1 block text-muted">Min $</span>
            <input className="input h-9 py-0 text-sm" inputMode="numeric" value={min} onChange={(e) => setMin(e.target.value.replace(/[^\d]/g, ''))} placeholder={f ? String(f.priceRange[0]) : ''} />
          </label>
          <label className="flex-1 text-xs">
            <span className="mb-1 block text-muted">Max $</span>
            <input className="input h-9 py-0 text-sm" inputMode="numeric" value={max} onChange={(e) => setMax(e.target.value.replace(/[^\d]/g, ''))} placeholder={f ? String(f.priceRange[1]) : ''} />
          </label>
          <Button type="submit" variant="secondary" size="sm">
            Go
          </Button>
        </form>
      </FacetGroup>
      <FacetGroup title="Vendor" defaultOpen={false}>
        <CheckList name="ven" items={f?.vendors ?? []} selected={query.vendors ?? []} onToggle={(v) => toggleList('vendors', v)} />
      </FacetGroup>
      <FacetGroup title="Rating">
        <div className="space-y-1.5" role="radiogroup" aria-label="Minimum rating">
          {[4.5, 4, 3].map((r) => (
            <label key={r} className="flex cursor-pointer items-center gap-2 text-sm">
              <input type="radio" name="rating" checked={query.minRating === r} onChange={() => set({ rating: String(r) })} className="accent-[rgb(var(--primary))]" />
              <Stars value={r} size={14} /> <span>{r}+</span>
            </label>
          ))}
          {query.minRating && (
            <button type="button" className="text-xs text-link hover:underline" onClick={() => set({ rating: undefined })}>
              Any rating
            </button>
          )}
        </div>
      </FacetGroup>
      <div className="py-4">
        <label className="flex cursor-pointer items-center justify-between gap-3 text-sm font-semibold">
          Refillable only
          <input type="checkbox" role="switch" checked={Boolean(query.refillable)} onChange={(e) => set({ refillable: e.target.checked ? '1' : undefined })} className="h-5 w-5 accent-[rgb(var(--primary))]" />
        </label>
      </div>
    </div>
  );
}

export default function Catalog() {
  const { category } = useParams();
  const [params, setParams] = useSearchParams();
  const navigate = useNavigate();
  const [filtersOpen, setFiltersOpen] = useState(false);
  const query = useMemo(() => parseQuery(params, category), [params, category]);
  const result = useAsync(() => api.catalog.listProducts(query), [JSON.stringify(query)]);

  const cat = category ? categoryBySlug(category) : undefined;
  const group = query.group ? categoryGroups.find((g) => g.slug === query.group) : undefined;
  if (category && !cat) return <ErrorState error={Object.assign(new Error('Category not found'), { status: 404 })} />;

  const set = (patch: Record<string, string | undefined>) => {
    const next = new URLSearchParams(params);
    for (const [k, v] of Object.entries(patch)) {
      if (v === undefined || v === '') next.delete(k);
      else next.set(k, v);
    }
    if (!('page' in patch)) next.delete('page');
    setParams(next, { replace: false });
  };
  const toggleList = (key: 'values' | 'certs' | 'vendors', v: string) => {
    const cur = list(params.get(key));
    const nextList = cur.includes(v) ? cur.filter((x) => x !== v) : [...cur, v];
    set({ [key]: nextList.join(',') || undefined });
  };
  const onCategory = (slug?: string) => {
    const next = new URLSearchParams(params);
    next.delete('page');
    navigate({ pathname: slug ? `/catalog/${slug}` : '/catalog', search: next.toString() });
    setFiltersOpen(false);
  };

  const chips: { label: string; clear: () => void }[] = [
    ...(query.q ? [{ label: `“${query.q}”`, clear: () => set({ q: undefined }) }] : []),
    ...(group ? [{ label: group.name, clear: () => set({ group: undefined }) }] : []),
    ...(query.values ?? []).map((v) => ({ label: v, clear: () => toggleList('values', v) })),
    ...(query.certs ?? []).map((v) => ({ label: v, clear: () => toggleList('certs', v) })),
    ...(query.vendors ?? []).map((v) => ({ label: result.data?.facets.vendors.find((f) => f.value === v)?.label ?? v, clear: () => toggleList('vendors', v) })),
    ...(query.minPrice !== undefined || query.maxPrice !== undefined
      ? [{ label: `$${query.minPrice ?? 0}–${query.maxPrice !== undefined ? `$${query.maxPrice}` : 'any'}`, clear: () => set({ min: undefined, max: undefined }) }]
      : []),
    ...(query.minRating ? [{ label: `${query.minRating}+ stars`, clear: () => set({ rating: undefined }) }] : []),
    ...(query.refillable ? [{ label: 'Refillable', clear: () => set({ refillable: undefined }) }] : []),
  ];
  const clearAll = () => navigate(category ? `/catalog/${category}` : '/catalog');

  const title = cat?.name ?? (query.q ? `Results for “${query.q}”` : group?.name ?? 'Shop the Emporium');
  const totalPages = result.data ? Math.max(1, Math.ceil(result.data.total / PAGE_SIZE)) : 1;
  const facetsProps = { page: result.data, query, set, toggleList, onCategory };

  return (
    <>
      <Seo title={title} description={cat ? `Shop HarmFree ${cat.name.toLowerCase()}: vetted, certified and vendor-backed.` : 'Browse every HarmFree product A–Z, filter by values, certification, price, vendor and rating.'} />
      <PageHeader
        eyebrow={cat ? cat.group : 'Catalog'}
        title={title}
        intro={cat ? `Every product here carries the HarmFree Seal, with certifications listed on its page.` : group?.blurb ?? 'Every product here passed all five pillars of the HarmFree Standard.'}
        crumbs={cat ? [{ label: 'Catalog', to: '/catalog' }, { label: cat.name }] : [{ label: 'Catalog' }]}
      />
      <div className="container-hfe py-10">
        {!category && !query.q && <AZIndex />}
        <div className="grid gap-8 lg:grid-cols-[260px_1fr]">
          <aside aria-label="Filters" className="hidden lg:block">
            <h2 className="sr-only">Filters</h2>
            <Facets key={params.toString()} {...facetsProps} />
          </aside>
          <section aria-labelledby="results-heading">
            <div className="mb-4 flex flex-wrap items-center gap-3">
              <h2 id="results-heading" className="mr-auto font-sans text-sm text-muted" aria-live="polite">
                {result.loading ? 'Loading products…' : `${num(result.data?.total ?? 0)} products`}
              </h2>
              <Button variant="secondary" size="sm" className="lg:hidden" onClick={() => setFiltersOpen(true)}>
                <Icon name="filter" size={16} /> Filters{chips.length ? ` (${chips.length})` : ''}
              </Button>
              <label className="flex items-center gap-2 text-sm">
                <span className="text-muted">Sort</span>
                <select className="input h-9 w-auto py-0 pr-8 text-sm" value={query.sort} onChange={(e) => set({ sort: e.target.value === 'relevance' ? undefined : e.target.value })}>
                  {SORTS.map((s) => (
                    <option key={s.value} value={s.value}>
                      {s.label}
                    </option>
                  ))}
                </select>
              </label>
            </div>
            {chips.length > 0 && (
              <ul className="mb-6 flex flex-wrap items-center gap-2" aria-label="Active filters">
                {chips.map((c) => (
                  <li key={c.label}>
                    <button type="button" onClick={c.clear} className="chip gap-1.5 py-1 hover:bg-sage/60" aria-label={`Remove filter ${c.label}`}>
                      {c.label} <Icon name="close" size={12} />
                    </button>
                  </li>
                ))}
                <li>
                  <button type="button" onClick={clearAll} className="text-sm font-medium text-link hover:underline">
                    Clear all
                  </button>
                </li>
              </ul>
            )}
            {result.error ? (
              <ErrorState error={result.error} onRetry={result.reload} />
            ) : result.loading && !result.data ? (
              <ProductGridSkeleton count={8} />
            ) : result.data && result.data.total === 0 ? (
              <EmptyState
                icon="search"
                title="No products match those filters"
                body="Try removing a filter or searching a broader term. Every product here must pass the HarmFree Standard, so some niches are still growing."
                action={<Button onClick={clearAll}>Clear filters</Button>}
              />
            ) : (
              <div className={cn('transition-opacity duration-200', result.loading && 'opacity-60')} aria-busy={result.loading}>
                <ProductGrid products={result.data?.items ?? []} />
                {totalPages > 1 && (
                  <nav aria-label="Pagination" className="mt-10 flex flex-wrap items-center justify-center gap-2">
                    <Button variant="secondary" size="sm" disabled={query.page === 1} onClick={() => set({ page: String((query.page ?? 1) - 1) })}>
                      <Icon name="chevronLeft" size={16} /> Previous
                    </Button>
                    {Array.from({ length: totalPages }).map((_, i) => (
                      <button
                        key={i}
                        type="button"
                        aria-current={query.page === i + 1 ? 'page' : undefined}
                        onClick={() => set({ page: String(i + 1) })}
                        className={cn('h-9 min-w-9 rounded-full px-3 text-sm', query.page === i + 1 ? 'bg-primary text-primary-fg' : 'hover:bg-tint')}
                      >
                        {i + 1}
                      </button>
                    ))}
                    <Button variant="secondary" size="sm" disabled={query.page === totalPages} onClick={() => set({ page: String((query.page ?? 1) + 1) })}>
                      Next <Icon name="chevronRight" size={16} />
                    </Button>
                  </nav>
                )}
              </div>
            )}
          </section>
        </div>
      </div>
      <Drawer open={filtersOpen} onOpenChange={setFiltersOpen} title="Filters" side="left">
        <div className="flex-1 overflow-y-auto px-5">
          <Facets key={params.toString()} {...facetsProps} />
        </div>
        <div className="border-t border-line p-4">
          <Button className="w-full" onClick={() => setFiltersOpen(false)}>
            Show {num(result.data?.total ?? 0)} products
          </Button>
        </div>
      </Drawer>
    </>
  );
}
