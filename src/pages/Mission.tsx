import { api } from '@/api';
import { ProductRail } from '@/components/product/ProductRail';
import { ButtonLink, Icon, PageHeader, Section, Seo, type IconName } from '@/components/ui';
import { useAsync } from '@/lib/hooks';

const PILLARS: { icon: IconName; title: string; body: string; query: string }[] = [
  { icon: 'refresh', title: 'Reuse', body: 'Products built to be kept: cast iron, steel bottles, forever glass, replaceable heads and filters.', query: '/catalog?values=Plastic-Free' },
  { icon: 'box', title: 'Recycle', body: 'Materials that go back into the loop: aluminum, glass, steel and curbside-recyclable paper.', query: '/catalog?values=Recyclable' },
  { icon: 'bottle', title: 'Refill', body: 'Tablets, pouches and cartridge programs that keep the container in service.', query: '/catalog?refillable=1' },
];

export default function Mission() {
  const refillables = useAsync(() => api.catalog.listProducts({ refillable: true, sort: 'best-selling', pageSize: 10 }), []);
  return (
    <>
      <Seo title="Our mission" description="Reuse, recycle, refill: HarmFree Emporium favors products that come back around." />
      <PageHeader
        eyebrow="Mission"
        title="Reuse. Recycle. Refill."
        intro="We try to carry products people can reuse, recycle or refill, so the things that make life better do not end up as tomorrow’s waste."
        crumbs={[{ label: 'Mission' }]}
      />
      <Section>
        <ul className="grid gap-6 md:grid-cols-3">
          {PILLARS.map((p) => (
            <li key={p.title} className="flex flex-col rounded-card border border-line bg-surface p-6">
              <span className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-full bg-tint">
                <Icon name={p.icon} size={24} />
              </span>
              <h2 className="text-xl font-semibold">{p.title}</h2>
              <p className="mt-2 flex-1 text-muted">{p.body}</p>
              <ButtonLink to={p.query} variant="secondary" size="sm" className="mt-5 self-start">
                Shop {p.title.toLowerCase()}
              </ButtonLink>
            </li>
          ))}
        </ul>
      </Section>
      <Section tint eyebrow="Refill favorites" title="Keep the vessel, refill the rest">
        <ProductRail products={refillables.data?.items} loading={refillables.loading} label="Refillable products" />
      </Section>
      <Section eyebrow="Vendor responsibility" title="When a product is done, the maker helps">
        <div className="grid gap-6 md:grid-cols-2">
          <p className="text-lg">
            Under the HarmFree Standard, vendors publish honest end-of-life instructions and, where the category allows, run take-back or refill programs. Returns and warranty claims route straight to the original manufacturer, so repairs and refurbishment happen where the expertise is.
          </p>
          <ul className="space-y-3">
            {['Cartridge shells mailed back and refilled', 'Battery modules swapped and refurbished', 'Trigger sprayers taken back and reused', 'Packaging kept minimal and recycled-content'].map((t) => (
              <li key={t} className="flex items-start gap-2">
                <Icon name="check" className="mt-0.5 shrink-0 text-success" /> {t}
              </li>
            ))}
          </ul>
        </div>
      </Section>
    </>
  );
}
