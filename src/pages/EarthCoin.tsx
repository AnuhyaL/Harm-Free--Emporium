import { EarthCoinArt } from '@/components/content/ContentBits';
import { ButtonLink, Icon, PageHeader, Section, Seo, type IconName } from '@/components/ui';
import { ORG, REWARDS } from '@/data';

const WAYS: { icon: IconName; title: string; body: string }[] = [
  { icon: 'heart', title: `Donate $${REWARDS.earthCoinDonationMin}+`, body: `A tax-deductible gift to ${ORG.parent}, a 501(c)(3) non-profit, earns an EarthCoin.` },
  { icon: 'cart', title: `Shop $${REWARDS.earthCoinPurchaseMin}+`, body: 'Any HarmFree order of $35 or more (after discounts) earns an EarthCoin for members.' },
  { icon: 'star', title: `Write ${REWARDS.reviewsPerEarthCoin} reviews`, body: 'Every fifth published review earns an EarthCoin, on top of your review points.' },
];

export default function EarthCoin() {
  return (
    <>
      <Seo title="EarthCoin" description="EarthCoin recognizes people who give, shop and review on HarmFree Emporium. Here is its story and policy." />
      <PageHeader eyebrow="Recognition for giving" title="EarthCoin" intro="A token of thanks from the Green2Gold family for everyone who helps HarmFree products, and the non-profit behind them, grow." crumbs={[{ label: 'EarthCoin' }]} />
      <Section>
        <div className="grid items-center gap-10 lg:grid-cols-[auto_1fr]">
          <div className="mx-auto">
            <EarthCoinArt size={240} />
          </div>
          <div className="space-y-4 text-lg">
            <h2 className="text-2xl font-semibold">The story</h2>
            <p>
              Green2Gold was born from the first Earth Day. EarthCoin carries that idea forward: a small, lasting marker that you helped turn green ideas into gold-standard products.
            </p>
            <p>
              Each EarthCoin carries a serial number and the reason it was earned. Over time, EarthCoin will connect to the wider Regeneration Global community and its projects.
            </p>
          </div>
        </div>
      </Section>
      <Section tint eyebrow="How to earn" title="Three ways to earn an EarthCoin">
        <ul className="grid gap-4 md:grid-cols-3">
          {WAYS.map((w) => (
            <li key={w.title} className="rounded-card bg-surface p-6">
              <span className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-full bg-tint">
                <Icon name={w.icon} size={24} />
              </span>
              <p className="font-display text-xl font-semibold">{w.title}</p>
              <p className="mt-1 text-muted">{w.body}</p>
            </li>
          ))}
        </ul>
      </Section>
      <Section eyebrow="Policy" title="EarthCoin policy, in plain language">
        <ul className="max-w-3xl space-y-3">
          {[
            'EarthCoins are recognition tokens. They have no cash value and cannot be sold, exchanged or transferred.',
            'In this phase EarthCoins are recorded to your HarmFree account. No token is minted, and no crypto wallet or blockchain connection is needed.',
            'Donations are made to Green2Gold, a 501(c)(3) non-profit, and are tax-deductible to the extent allowed by law. You receive a receipt.',
            'Purchase EarthCoins require a signed-in account and an order total of $35 or more after discounts. Returned orders may have their EarthCoin reversed.',
            'Future on-chain minting, if introduced, will be opt-in and announced in advance.',
          ].map((t) => (
            <li key={t} className="flex gap-3">
              <Icon name="check" className="mt-0.5 shrink-0 text-success" />
              {t}
            </li>
          ))}
        </ul>
        <div className="mt-8 flex flex-wrap gap-3">
          <ButtonLink to="/donate" variant="gold">
            Donate & earn an EarthCoin
          </ButtonLink>
          <ButtonLink to="/account/rewards#earthcoin" variant="secondary">
            View my EarthCoins
          </ButtonLink>
        </div>
      </Section>
    </>
  );
}
