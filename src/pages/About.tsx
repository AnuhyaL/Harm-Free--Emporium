import { LogoMark } from '@/components/brand/Logo';
import { ButtonLink, Icon, PageHeader, Section, Seo } from '@/components/ui';
import { ORG, PILLARS, TEAM } from '@/data';

const TIMELINE = [
  { year: '1970', text: 'Green2Gold’s founders take part in the first Earth Day and the movement leading to the first UN Conference on the Human Environment (Stockholm, 1972).' },
  { year: 'Decades', text: 'Green2Gold grows into a 501(c)(3) non-profit scientific, educational and R&D green-tech incubator, supporting cleantech and regenerative innovators.' },
  { year: 'Today', text: 'HarmFree Emporium opens as a virtual global marketplace so vetted innovations can reach people directly, with the proof on every product page.' },
];

export default function About() {
  return (
    <>
      <Seo title="About us" description="HarmFree Emporium is an initiative of Green2Gold, a 501(c)(3) non-profit green-tech incubator rooted in the first Earth Day." />
      <PageHeader
        eyebrow="About HarmFree Emporium"
        title="Open hands, a sprouting seed, and a promise: do no harm."
        intro={`${ORG.name} is a virtual global marketplace for products that are green, sustainable, non-toxic, bio-based, cleantech, recyclable, repurposable and compostable. It is an initiative of ${ORG.parent}.`}
        crumbs={[{ label: 'About' }]}
      />

      <Section id="story" eyebrow="Our story" title="From the first Earth Day to your front door">
        <div className="grid gap-10 lg:grid-cols-[1fr_1.2fr]">
          <div className="relative flex items-center justify-center overflow-hidden rounded-card bg-emerald p-10">
            {/* Play on the logo: hands opening around a sprout. Placeholder for the hfe.mp4 visual. */}
            <LogoMark size={220} className="drop-shadow-xl" />
            <p className="absolute bottom-4 left-4 right-4 text-center text-xs text-paper/80">Logo concept placeholder — final mark pending</p>
          </div>
          <div className="space-y-5 text-lg">
            <p>
              Too many “green” products solve one problem by creating another. A plant-based cleaner in a bottle that will outlive us all. A solar gadget glued shut so the battery can never be replaced.
            </p>
            <p>
              HarmFree Emporium exists to close that gap. Every product we list must be harm-free to humans, animals, plants and the planet across its whole life, and we publish the proof: certifications, lab validation and the vendor who stands behind it.
            </p>
            <ol className="space-y-4 border-l-2 border-gold pl-6">
              {TIMELINE.map((t) => (
                <li key={t.year}>
                  <p className="font-display text-xl font-semibold">{t.year}</p>
                  <p className="text-base text-muted">{t.text}</p>
                </li>
              ))}
            </ol>
            <a href={ORG.parentUrl} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 font-semibold">
              Visit Green2Gold.org <Icon name="external" size={14} />
              <span className="sr-only">(opens in a new tab)</span>
            </a>
          </div>
        </div>
      </Section>

      <Section id="values" tint eyebrow="Our values" title="The HarmFree Standard is our values, written down">
        <ol className="grid gap-4 md:grid-cols-5">
          {PILLARS.map((p) => (
            <li key={p.n} className="rounded-card border border-line bg-surface p-5">
              <span className="font-display text-2xl font-semibold text-gold">{p.n}</span>
              <p className="mt-2 font-semibold">{p.title}</p>
              <p className="mt-1 text-sm text-muted">{p.summary}</p>
            </li>
          ))}
        </ol>
        <div className="mt-8 grid gap-4 md:grid-cols-3">
          {[
            { t: 'Proof over promises', b: 'Every claim is tied to a certificate or lab report. No proof, no claim.' },
            { t: 'Makers stay accountable', b: 'Vendors cover shipping, returns, replacements and warranties for what they sell.' },
            { t: 'Community first', b: 'Rewards and EarthCoin recognize people who shop, review, refer and give.' },
          ].map((v) => (
            <div key={v.t} className="rounded-card bg-surface p-5">
              <p className="font-display text-lg font-semibold">{v.t}</p>
              <p className="mt-1 text-sm text-muted">{v.b}</p>
            </div>
          ))}
        </div>
        <ButtonLink to="/standard" className="mt-8">
          Read the full HarmFree Standard
        </ButtonLink>
      </Section>

      <Section id="team" eyebrow="The team" title="People behind the Emporium">
        <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {TEAM.map((m) => (
            <li key={m.name} className="rounded-card border border-line bg-surface p-5">
              <span className="mb-3 inline-flex h-12 w-12 items-center justify-center rounded-full bg-tint font-display text-lg font-semibold">{m.name.charAt(0)}</span>
              <p className="font-semibold">{m.name}</p>
              <p className="text-sm text-muted">{m.role}</p>
              <p className="mt-2 text-sm">{m.note}</p>
            </li>
          ))}
        </ul>
      </Section>

      <Section id="family" tint eyebrow="The Green2Gold family" title="Part of a wider regeneration network">
        <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
          {ORG.properties.map((p) => (
            <li key={p.name} className="rounded-card border border-line bg-surface p-5">
              <p className="font-semibold">{p.name}</p>
              <p className="mt-1 text-sm text-muted">{p.note}</p>
              {p.url && (
                <a href={p.url} target="_blank" rel="noopener noreferrer" className="mt-2 inline-flex items-center gap-1 text-sm">
                  Visit <Icon name="external" size={12} />
                  <span className="sr-only">{p.name} (opens in a new tab)</span>
                </a>
              )}
            </li>
          ))}
        </ul>
      </Section>
    </>
  );
}
