import { ButtonLink, Icon, PageHeader, Section, Seo } from '@/components/ui';
import { PILLARS, VALUE_TAG_INFO } from '@/data';

export default function Standard() {
  return (
    <>
      <Seo title="The HarmFree Standard" description="Five pillars every HarmFree product must pass: materials, manufacturing, certifications, packaging and company ethics." />
      <PageHeader
        eyebrow="Our vetting methodology"
        title="The HarmFree Standard"
        intro="One question, asked five ways: is this product harmful to humans, animals, plants or the planet? A product earns the HarmFree Global Seal of Approval only when it passes every pillar."
        crumbs={[{ label: 'The HarmFree Standard' }]}
      >
        <nav aria-label="Pillars" className="mt-6 flex flex-wrap gap-2">
          {PILLARS.map((p) => (
            <a key={p.n} href={`#pillar-${p.n}`} className="rounded-full border border-line bg-surface px-3 py-1.5 text-sm text-fg no-underline hover:bg-tint">
              {p.n}. {p.title}
            </a>
          ))}
        </nav>
      </PageHeader>

      <div className="container-hfe space-y-6 py-14">
        {PILLARS.map((p) => (
          <section key={p.n} id={`pillar-${p.n}`} aria-labelledby={`pillar-${p.n}-h`} className="scroll-mt-24 grid gap-6 rounded-card border border-line bg-surface p-6 sm:p-8 md:grid-cols-[120px_1fr]">
            <p className="font-display text-4xl font-semibold text-gold" aria-hidden>
              {String(p.n).padStart(2, '0')}
            </p>
            <div>
              <h2 id={`pillar-${p.n}-h`} className="text-xl font-semibold sm:text-2xl">
                <span className="sr-only">Pillar {p.n}: </span>
                {p.title}
              </h2>
              <p className="mt-2 text-muted">{p.summary}</p>
              <ul className="mt-4 grid gap-2 sm:grid-cols-2">
                {p.checks.map((c) => (
                  <li key={c} className="flex items-start gap-2 text-sm">
                    <Icon name="check" size={18} className="mt-0.5 shrink-0 text-success" />
                    {c}
                  </li>
                ))}
              </ul>
            </div>
          </section>
        ))}
      </div>

      <Section tint eyebrow="How it works" title="From application to seal">
        <ol className="grid gap-4 md:grid-cols-4">
          {[
            ['Apply', 'Vendors submit company info, product lines, certifications, lab results and a sell sheet.'],
            ['Review', 'The HFE team checks every claim against issuer registries and lab reports.'],
            ['Seal', 'Products that pass all five pillars earn the HarmFree Seal and are listed.'],
            ['Re-check', 'Formula changes, lapsed certificates or credible concerns trigger a new review.'],
          ].map(([t, b], i) => (
            <li key={t} className="rounded-card bg-surface p-5">
              <p className="text-xs font-semibold text-muted">Step {i + 1}</p>
              <p className="font-display text-lg font-semibold">{t}</p>
              <p className="mt-1 text-sm text-muted">{b}</p>
            </li>
          ))}
        </ol>
        <p className="mt-6 max-w-3xl text-sm text-muted">
          <strong className="text-fg">Transition products.</strong> In a few categories no fully harm-free option exists at scale yet. When we list a transition product, such as an ultra-low-NOx gas water heater, we say so on its page and explain why.
        </p>
      </Section>

      <Section eyebrow="Value tags" title="What each tag means">
        <dl className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {Object.entries(VALUE_TAG_INFO).map(([k, v]) => (
            <div key={k} className="rounded-soft border border-line bg-surface p-4">
              <dt className="font-semibold">{k}</dt>
              <dd className="text-sm text-muted">{v}</dd>
            </div>
          ))}
        </dl>
        <div className="mt-8 flex flex-wrap gap-3">
          <ButtonLink to="/catalog">Shop sealed products</ButtonLink>
          <ButtonLink to="/vendors/apply" variant="secondary">
            Apply as a vendor
          </ButtonLink>
        </div>
      </Section>
    </>
  );
}
