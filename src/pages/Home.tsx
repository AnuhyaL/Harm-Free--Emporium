import * as Tabs from '@radix-ui/react-tabs';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { api } from '@/api';
import { Cornucopia } from '@/components/brand/Cornucopia';
import { HeroVideo } from '@/components/brand/HeroVideo';
import { CountUp, EarnTiles, EarthCoinArt, PostCard, ReviewCard } from '@/components/content/ContentBits';
import { NewsletterForm } from '@/components/layout/NewsletterForm';
import { VALUE_TAGS } from '@/components/layout/Header';
import { ProductRail } from '@/components/product/ProductRail';
import { ButtonLink, Icon, Section, Seo, Skeleton, Stars, type IconName } from '@/components/ui';
import { categoryGroups, ORG, PILLARS, vendors } from '@/data';
import { useAsync } from '@/lib/hooks';

function Hero() {
  const summary = useAsync(() => api.reviews.summary(), []);
  return (
    <HeroVideo>
      <div className="container-hfe flex min-h-[560px] items-center py-20 sm:min-h-[640px] lg:min-h-[78vh]">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, ease: 'easeOut' }}
          className="max-w-2xl text-paper"
        >
          <p className="mb-4 text-xs font-semibold uppercase tracking-[0.2em] text-gold">Vetted · Non-Toxic · Regenerative</p>
          <h1 className="text-3xl font-semibold leading-[1.05] sm:text-4xl">HarmFree to Humans, Animals, Plants, and Planet.</h1>
          <p className="mt-5 max-w-xl text-lg text-paper/90">
            A global marketplace of products that are non-toxic, bio-based, cleantech, recyclable and compostable, each one checked against the HarmFree Standard before it reaches you.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <ButtonLink to="/catalog" variant="gold" size="lg">
              Shop the Emporium
            </ButtonLink>
            <ButtonLink to="/standard" variant="outline-light" size="lg">
              The HarmFree Standard
            </ButtonLink>
          </div>
          <div className="mt-8 flex min-h-[24px] flex-wrap items-center gap-2 text-sm text-paper/90">
            {summary.data ? (
              <>
                <Stars value={summary.data.ratingAvg} />
                <span>
                  <strong className="text-paper">{summary.data.ratingAvg.toFixed(1)}</strong> average from {summary.data.reviewCount.toLocaleString()} reviews
                </span>
              </>
            ) : (
              <Skeleton className="h-5 w-64 bg-paper/20" />
            )}
          </div>
        </motion.div>
      </div>
    </HeroVideo>
  );
}

const TRUST: { icon: IconName; title: string; proof: string; to: string }[] = [
  { icon: 'seal', title: 'HarmFree Seal', proof: 'Every product passes all five pillars.', to: '/standard' },
  { icon: 'shield', title: 'Proof, not promises', proof: 'Certificate IDs listed on each product.', to: '/standard#pillar-3' },
  { icon: 'truck', title: 'Vendor-backed', proof: 'Makers cover shipping, returns & warranty.', to: '/policies/returns' },
  { icon: 'refresh', title: 'Reuse · Recycle · Refill', proof: 'Minimal, recycled-content packaging.', to: '/mission' },
  { icon: 'leaf', title: 'Non-profit roots', proof: 'Green2Gold 501(c)(3), Earth Day lineage.', to: '/about' },
];

function TrustBar() {
  return (
    <section aria-label="Why shop HarmFree" className="border-b border-line bg-surface">
      <ul className="container-hfe grid grid-cols-1 gap-4 py-6 sm:grid-cols-2 lg:grid-cols-5 lg:gap-6">
        {TRUST.map((t) => (
          <li key={t.title}>
            <Link to={t.to} className="group flex items-start gap-3 rounded-soft p-1 no-underline">
              <span className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-tint text-fg ring-1 ring-gold/60">
                <Icon name={t.icon} size={20} />
              </span>
              <span>
                <span className="block text-sm font-semibold text-fg group-hover:underline">{t.title}</span>
                <span className="block text-xs text-muted">{t.proof}</span>
              </span>
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}

function ShopByCategory() {
  const counts = useAsync(() => api.catalog.categoryCounts(), []);
  const glyphs = [...new Set(categoryGroups.flatMap((g) => g.categories.map((c) => c.icon)))] as IconName[];
  return (
    <Section id="categories" eyebrow="Shop by Category" title="Everything a HarmFree life needs, in one place" intro="Thirty-seven categories, from compostable dishware to geothermal heat pumps, all held to the same standard.">
      <Cornucopia glyphs={glyphs} className="mx-auto mb-6 w-full max-w-3xl" />
      <ul className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {categoryGroups.map((g, i) => {
          const total = g.categories.reduce((s, c) => s + (counts.data?.[c.slug] ?? 0), 0);
          return (
            <motion.li
              key={g.slug}
              initial={{ x: -24, rotate: -3 }}
              whileInView={{ x: 0, rotate: 0 }}
              viewport={{ once: true, amount: 0.1 }}
              transition={{ duration: 0.3, delay: i * 0.05, ease: 'easeOut' }}
            >
              <Link to={`/catalog?group=${g.slug}`} className="group flex h-full flex-col rounded-card border border-line bg-surface p-5 no-underline shadow-soft transition-shadow duration-200 hover:shadow-lift">
                <span className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-full bg-tint text-fg">
                  <Icon name={g.icon} size={24} />
                </span>
                <span className="font-display text-lg font-semibold text-fg group-hover:underline">{g.name}</span>
                <span className="mt-1 text-sm text-muted">{g.blurb}</span>
                <span className="mt-4 text-xs font-medium text-muted">
                  {g.categories.length} categories{counts.data ? ` · ${total} products` : ''}
                </span>
              </Link>
            </motion.li>
          );
        })}
        <li>
          <Link to="/catalog" className="group flex h-full flex-col justify-between rounded-card bg-primary p-5 text-primary-fg no-underline shadow-soft">
            <span className="font-display text-lg font-semibold">Browse all categories A–Z</span>
            <span className="mt-6 inline-flex items-center gap-2 text-sm font-semibold">
              Open the index <Icon name="arrowRight" size={16} className="transition-transform group-hover:translate-x-1" />
            </span>
          </Link>
        </li>
      </ul>
      <div className="mt-10">
        <h3 className="mb-3 font-sans text-sm font-semibold uppercase tracking-wider text-muted">Shop by Values</h3>
        <ul className="flex flex-wrap gap-2">
          {VALUE_TAGS.map((v) => (
            <li key={v}>
              <Link to={`/catalog?values=${encodeURIComponent(v)}`} className="inline-flex rounded-full border border-line bg-surface px-4 py-2 text-sm text-fg no-underline transition-colors hover:bg-tint">
                {v}
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </Section>
  );
}

function ProductTabs() {
  const best = useAsync(() => api.catalog.bestSellers(10), []);
  const fresh = useAsync(() => api.catalog.newArrivals(10), []);
  const trigger =
    'rounded-full px-4 py-2 text-sm font-semibold text-muted transition-colors data-[state=active]:bg-primary data-[state=active]:text-primary-fg hover:text-fg';
  return (
    <Section id="featured" tint eyebrow="Customer favorites" title="Best sellers & new arrivals">
      <Tabs.Root defaultValue="best">
        <Tabs.List aria-label="Featured products" className="mb-6 inline-flex gap-1 rounded-full border border-line bg-surface p-1">
          <Tabs.Trigger value="best" className={trigger}>
            Best sellers
          </Tabs.Trigger>
          <Tabs.Trigger value="new" className={trigger}>
            New arrivals
          </Tabs.Trigger>
        </Tabs.List>
        <Tabs.Content value="best" className="focus-visible:outline-none">
          <ProductRail products={best.data} loading={best.loading} label="Best sellers" />
        </Tabs.Content>
        <Tabs.Content value="new" className="focus-visible:outline-none">
          <ProductRail products={fresh.data} loading={fresh.loading} label="New arrivals" />
        </Tabs.Content>
      </Tabs.Root>
    </Section>
  );
}

function StandardBand() {
  return (
    <Section
      id="standard"
      eyebrow="The HarmFree Standard"
      title="Five pillars. Every product passes all five."
      intro="A strong score on one pillar never offsets a failure on another. That is what makes the seal mean something."
      action={<ButtonLink to="/standard" variant="secondary">Read the full Standard</ButtonLink>}
    >
      <ol className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
        {PILLARS.map((p) => (
          <li key={p.n} className="relative rounded-card border border-line bg-surface p-5">
            <span className="font-display text-3xl font-semibold text-gold" aria-hidden>
              {String(p.n).padStart(2, '0')}
            </span>
            <h3 className="mt-2 font-sans text-base font-semibold">
              <span className="sr-only">Pillar {p.n}: </span>
              {p.title}
            </h3>
            <p className="mt-1 text-sm text-muted">{p.summary}</p>
          </li>
        ))}
      </ol>
    </Section>
  );
}

function RefillBand() {
  const steps: { icon: IconName; title: string; body: string }[] = [
    { icon: 'bottle', title: 'Keep the vessel', body: 'Glass, steel and aluminum built to last years.' },
    { icon: 'refresh', title: 'Refill by mail', body: 'Tablets, pouches and cartridges ship light.' },
    { icon: 'box', title: 'Send it back', body: 'Vendor take-back turns shells into new stock.' },
  ];
  return (
    <section aria-labelledby="refill-heading" className="bg-emerald text-paper">
      <div className="container-hfe grid items-center gap-10 py-16 lg:grid-cols-2">
        <div>
          <p className="mb-3 text-xs font-semibold uppercase tracking-[0.16em] text-gold">Reuse · Recycle · Refill</p>
          <h2 id="refill-heading" className="text-2xl font-semibold sm:text-3xl">
            Buy the bottle once. Refill it for years.
          </h2>
          <p className="mt-4 max-w-lg text-paper/85">
            Our mission favors products that come back around. Shop refillable cleaners, filters, body care and pantry storage designed to skip the landfill.
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <ButtonLink to="/catalog?refillable=1" variant="gold">
              Shop refillables
            </ButtonLink>
            <ButtonLink to="/mission" variant="outline-light">
              Our mission
            </ButtonLink>
          </div>
        </div>
        <ol className="grid gap-4 sm:grid-cols-3">
          {steps.map((s, i) => (
            <li key={s.title} className="rounded-card border border-paper/15 bg-paper/5 p-5">
              <span className="mb-3 inline-flex h-10 w-10 items-center justify-center rounded-full bg-paper/10 text-gold">
                <Icon name={s.icon} size={20} />
              </span>
              <p className="text-xs text-paper/70">Step {i + 1}</p>
              <p className="font-semibold">{s.title}</p>
              <p className="mt-1 text-sm text-paper/80">{s.body}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}

function Impact() {
  const stats = useAsync(() => api.stats.impact(), []);
  const items = stats.data
    ? [
        { n: stats.data.productsVetted, label: 'Products vetted & sealed' },
        { n: stats.data.vendors, label: 'Vetted vendors' },
        { n: stats.data.categories, label: 'Product categories' },
        { n: stats.data.certificationsTracked, label: 'Certification programs tracked' },
        { n: stats.data.refillableProducts, label: 'Refillable products' },
        { n: stats.data.earthCoinsRecorded, label: 'EarthCoins recorded' },
      ]
    : [];
  return (
    <Section id="impact" eyebrow="Impact, counted from our catalog" title="The Emporium by the numbers">
      {stats.loading ? (
        <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-6">
          {Array.from({ length: 6 }).map((_, i) => (
            <Skeleton key={i} className="h-28" />
          ))}
        </div>
      ) : (
        <dl className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-6">
          {items.map((it) => (
            <div key={it.label} className="flex flex-col rounded-card border border-line bg-surface p-5">
              <dt className="order-2 mt-1 text-sm text-muted">{it.label}</dt>
              <dd className="order-1 font-display text-3xl font-semibold">
                <CountUp to={it.n} />
              </dd>
            </div>
          ))}
        </dl>
      )}
    </Section>
  );
}

function VendorMarquee() {
  const row = [...vendors, ...vendors];
  return (
    <section aria-labelledby="vendors-heading" className="border-y border-line bg-surface py-10">
      <div className="container-hfe mb-6 flex flex-wrap items-end justify-between gap-3">
        <div>
          <p className="eyebrow mb-2">Featured vendors</p>
          <h2 id="vendors-heading" className="text-xl font-semibold sm:text-2xl">
            Makers who stand behind what they sell
          </h2>
        </div>
        <Link to="/brands" className="text-sm font-semibold">
          All brands
        </Link>
      </div>
      <ul className="sr-only">
        {vendors.map((v) => (
          <li key={v.id}>
            <Link to={`/brands/${v.slug}`}>{v.name}</Link>
          </li>
        ))}
      </ul>
      <div className="group relative overflow-hidden" aria-hidden>
        <div className="flex w-max gap-4 motion-safe:animate-[marquee_40s_linear_infinite] group-hover:[animation-play-state:paused]">
          {row.map((v, i) => (
            <Link key={i} to={`/brands/${v.slug}`} tabIndex={-1} className="flex items-center gap-3 rounded-full border border-line bg-bg px-5 py-3 no-underline">
              <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-primary font-display text-sm font-semibold text-primary-fg">{v.name.charAt(0)}</span>
              <span className="whitespace-nowrap text-sm font-semibold text-fg">{v.name}</span>
              <span className="whitespace-nowrap text-xs text-muted">{v.location}</span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}

function ReviewWall() {
  const reviews = useAsync(() => api.reviews.featured(9), []);
  return (
    <Section id="reviews" tint eyebrow="Review wall" title="What shoppers say">
      {reviews.loading ? (
        <div className="grid gap-4 md:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <Skeleton key={i} className="h-40" />
          ))}
        </div>
      ) : (
        <div className="columns-1 gap-4 space-y-4 md:columns-2 lg:columns-3">
          {reviews.data?.map(({ review, product }) => (
            <ReviewCard key={review.id} review={review} product={product} />
          ))}
        </div>
      )}
    </Section>
  );
}

function RewardsBand() {
  return (
    <Section id="rewards" eyebrow="HarmFree Rewards" title="Earn while you do good" intro="Points for shopping, reviewing and referring, redeemable at checkout. Give, and earn an EarthCoin.">
      <div className="grid gap-6 lg:grid-cols-[2fr_1fr]">
        <EarnTiles />
        <div className="flex flex-col items-center justify-center rounded-card bg-navy p-6 text-center text-paper">
          <EarthCoinArt size={128} />
          <p className="mt-4 font-display text-xl font-semibold">EarthCoin</p>
          <p className="mt-1 text-sm text-paper/80">A recognition token from the Green2Gold family for purchases, donations and reviews.</p>
          <div className="mt-4 flex flex-wrap justify-center gap-2">
            <ButtonLink to="/earthcoin" variant="gold" size="sm">
              The EarthCoin story
            </ButtonLink>
            <ButtonLink to="/account/rewards" variant="outline-light" size="sm">
              My rewards
            </ButtonLink>
          </div>
        </div>
      </div>
    </Section>
  );
}

function BlogTeasers() {
  const posts = useAsync(() => api.content.posts(), []);
  return (
    <Section id="journal" tint eyebrow="The Journal" title="Innovation & HarmFree in action" action={<ButtonLink to="/blog" variant="secondary">All stories</ButtonLink>}>
      {posts.loading ? (
        <div className="grid gap-6 md:grid-cols-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <Skeleton key={i} className="h-72" />
          ))}
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-3">
          {posts.data?.slice(0, 3).map((p) => (
            <PostCard key={p.id} post={p} />
          ))}
        </div>
      )}
    </Section>
  );
}

function Newsletter() {
  return (
    <section aria-labelledby="newsletter-heading" className="py-16">
      <div className="container-hfe">
        <div className="grid grid-cols-1 items-center gap-8 rounded-card border border-line bg-surface p-5 shadow-soft sm:p-8 md:grid-cols-2 md:p-12 [&>*]:min-w-0">
          <div>
            <h2 id="newsletter-heading" className="text-2xl font-semibold">
              One email a month. Only the good stuff.
            </h2>
            <p className="mt-2 text-muted">New vetted products, refill drops and stories from the Regen Media family. Unsubscribe anytime.</p>
          </div>
          <NewsletterForm />
        </div>
      </div>
    </section>
  );
}

export default function Home() {
  return (
    <>
      <Seo title="HarmFree Emporium" description={`${ORG.tagline} Shop vetted, non-toxic, regenerative products from makers who stand behind them.`} />
      <Hero />
      <TrustBar />
      <ShopByCategory />
      <ProductTabs />
      <StandardBand />
      <RefillBand />
      <Impact />
      <VendorMarquee />
      <ReviewWall />
      <RewardsBand />
      <BlogTeasers />
      <Newsletter />
    </>
  );
}
