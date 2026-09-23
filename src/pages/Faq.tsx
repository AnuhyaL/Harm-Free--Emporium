import * as Accordion from '@radix-ui/react-accordion';
import { api } from '@/api';
import { ButtonLink, ErrorState, Icon, PageHeader, Seo, Skeleton } from '@/components/ui';
import { useAsync } from '@/lib/hooks';
import type { FAQ } from '@/types';

export default function Faq() {
  const faqs = useAsync(() => api.content.faqs(), []);
  const groups = faqs.data?.reduce<Record<string, FAQ[]>>((acc, f) => {
    (acc[f.group] ??= []).push(f);
    return acc;
  }, {});

  return (
    <>
      <Seo title="FAQ" description="Answers about orders, vendor shipping, returns, warranties, rewards, EarthCoin and the HarmFree Standard." />
      <PageHeader eyebrow="Help center" title="Frequently asked questions" crumbs={[{ label: 'FAQ' }]} />
      <div className="container-hfe max-w-3xl py-14">
        {faqs.error && <ErrorState error={faqs.error} onRetry={faqs.reload} />}
        {faqs.loading && (
          <div className="space-y-3">
            {Array.from({ length: 6 }).map((_, i) => (
              <Skeleton key={i} className="h-14" />
            ))}
          </div>
        )}
        {groups &&
          Object.entries(groups).map(([group, items]) => (
            <section key={group} aria-labelledby={`faq-${group}`} className="mb-10">
              <h2 id={`faq-${group}`} className="mb-3 text-xl font-semibold">
                {group}
              </h2>
              <Accordion.Root type="multiple" className="divide-y divide-line rounded-card border border-line bg-surface">
                {items.map((f, i) => (
                  <Accordion.Item key={i} value={`${group}-${i}`}>
                    <Accordion.Header>
                      <Accordion.Trigger className="group flex w-full items-center justify-between gap-4 px-5 py-4 text-left font-medium hover:bg-tint/50">
                        {f.q}
                        <Icon name="chevronDown" size={18} className="shrink-0 transition-transform duration-200 group-data-[state=open]:rotate-180" />
                      </Accordion.Trigger>
                    </Accordion.Header>
                    <Accordion.Content className="px-5 pb-5 text-muted">{f.a}</Accordion.Content>
                  </Accordion.Item>
                ))}
              </Accordion.Root>
            </section>
          ))}
        <div className="rounded-card bg-tint p-6 text-center">
          <p className="font-semibold">Still need help?</p>
          <ButtonLink to="/contact" className="mt-3">
            Contact Customer Care
          </ButtonLink>
        </div>
      </div>
    </>
  );
}
