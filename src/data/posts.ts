/**
 * SAMPLE DATA — editorial placeholders. Any figures or scenarios are illustrative.
 */
import type { Post } from '@/types';

export const posts: Post[] = [
  {
    id: 'post-1',
    slug: 'what-the-harmfree-seal-actually-checks',
    title: 'What the HarmFree Seal Actually Checks',
    excerpt:
      'Five pillars, one question: is this product harmful to humans, animals, plants or the planet? Here is how a product earns the seal, and how it can lose it.',
    category: 'Standard',
    author: 'The HFE Vetting Team',
    publishedAt: '2026-08-28T15:00:00.000Z',
    readMinutes: 6,
    hue: 150,
    image: { src: '/images/journal-refill.jpg', alt: 'Concentrated laundry detergent poured through a steel funnel into a reusable glass bottle.' },
    body: [
      { type: 'p', text: 'Most "green" labels answer one narrow question. Is the packaging recyclable? Is the ingredient plant-derived? The HarmFree Standard starts from a broader one: across its whole life, does this product harm humans, animals, plants or the planet?' },
      { type: 'h2', text: 'Five pillars, reviewed in order' },
      { type: 'ul', text: ['Materials & Ingredients: full disclosure, screened against restricted-substance lists.', 'Manufacturing Process: energy, water and worker safety at the factory.', 'Certifications & Lab Validation: third-party proof, with the certificate ID on the product page.', 'Packaging & End-of-Life: what happens to the box and the product when you are done.', 'Company Ethics: labor, transparency and how the vendor handles returns and warranties.'] },
      { type: 'p', text: 'A product must pass every pillar. A strong score on one never offsets a failure on another.' },
      { type: 'quote', text: 'If we cannot show you the proof, we do not make the claim.' },
      { type: 'h2', text: 'Transition products' },
      { type: 'p', text: 'Some categories do not yet have a fully harm-free option at scale. Where we list a transition product, such as an ultra-low-NOx gas water heater for homes not yet ready to electrify, we label it clearly and explain why.' },
    ],
    relatedProductSlugs: ['condensing-tankless-water-heater', 'all-purpose-cleaner-refill-tablets'],
  },
  {
    id: 'post-2',
    slug: 'refill-not-landfill-a-week-of-forever-bottles',
    title: 'Refill, Not Landfill: A Week of Forever Bottles',
    excerpt:
      'We swapped every cleaning spray in a four-person household for glass bottles and dissolvable tablets. Here is what worked, what did not, and what surprised us.',
    category: 'In Action',
    author: 'Kira Nakamura',
    publishedAt: '2026-08-12T15:00:00.000Z',
    readMinutes: 5,
    hue: 170,
    image: { src: '/images/journal-refillable-products.jpg', alt: 'Glass spray and foaming-soap bottles beside concentrated refill tablets on a kitchen counter.' },
    body: [
      { type: 'p', text: 'Day one was mostly labeling. Three glass bottles, three tablets, a permanent marker. By day three nobody in the house was reaching for the old plastic sprays under the sink.' },
      { type: 'h2', text: 'What worked' },
      { type: 'ul', text: ['Tablets dissolved fully in about 15 minutes in warm water.', 'The glass cleaner left fewer streaks than the conventional one we replaced.', 'The fragrance-free option was the family favorite.'] },
      { type: 'h2', text: 'What took adjustment' },
      { type: 'p', text: 'Glass is heavier, so the silicone sleeves matter. We also learned to keep a spare tablet envelope in the drawer so a refill is never a trip to the store.' },
      { type: 'quote', text: 'One envelope of tablets weighs less than the cap of a jug of cleaner.' },
    ],
    relatedProductSlugs: ['forever-glass-spray-bottle-kit', 'all-purpose-cleaner-refill-tablets', 'swedish-cellulose-sponge-cloths'],
  },
  {
    id: 'post-3',
    slug: 'modular-solar-that-you-can-repair',
    title: 'Innovation Spotlight: Modular Solar You Can Repair',
    excerpt:
      'A power station with user-swappable battery modules could keep thousands of units out of e-waste streams. We talked to the engineers behind the design.',
    category: 'Innovation',
    author: 'Regen Media Desk',
    publishedAt: '2026-07-30T15:00:00.000Z',
    readMinutes: 7,
    hue: 45,
    image: { src: '/images/journal-repairable-cleantech.jpg', alt: 'A portable power station on an outdoor table with one swappable battery module pulled out.' },
    body: [
      { type: 'p', text: 'Portable power stations have exploded in popularity, and so has a quiet problem: when the battery wears out, most units are thrown away whole.' },
      { type: 'h2', text: 'Designing for the second life' },
      { type: 'p', text: 'Helio Works built its 1500 model around cell modules that slide out with a single tool. A worn module ships back to the vendor for refurbishment, and the rest of the unit stays in service.' },
      { type: 'quote', text: 'The most sustainable battery is the one you do not have to replace all at once.' },
      { type: 'p', text: 'Refurbished modules go into community disaster kits through the vendor take-back program.' },
    ],
    relatedProductSlugs: ['helio-1500-power-station', 'foldable-200w-solar-panel'],
  },
  {
    id: 'post-4',
    slug: 'regen-media-partner-showcase',
    title: 'Regen Media: How HarmFree Vendors Get Seen',
    excerpt:
      'Vetted vendors can feature in Digital Regeneration World Magazine, Regenerative Media TV and HFE editorial. Here is how the program works.',
    category: 'Regen Media',
    author: 'Regen Media Desk',
    publishedAt: '2026-07-15T15:00:00.000Z',
    readMinutes: 4,
    hue: 220,
    image: { src: '/images/journal-regen-media.jpg', alt: 'A laptop showing the HarmFree Emporium vendor site on a desk beside a Regen Media book, a camera on a tripod and natural soaps.' },
    body: [
      { type: 'p', text: 'Earning the HarmFree Seal is the start. Vendors who pass the Standard can also tell their story through the Regen Media family: Regenerative Media TV segments, Digital Regeneration World Magazine features, and product spotlights here on the HFE blog.' },
      { type: 'h2', text: 'What vendors can expect' },
      { type: 'ul', text: ['An editorial profile focused on proof, not promotion.', 'Placement in seasonal gift guides and themed collections.', 'Co-marketing across Regeneration Global channels.'] },
      { type: 'p', text: 'Interested vendors can start with the application on our Vendors page.' },
    ],
    relatedProductSlugs: [],
  },
  {
    id: 'post-5',
    slug: 'the-quiet-yard-going-electric',
    title: 'The Quiet Yard: Going Electric Without Losing Power',
    excerpt:
      'Gas yard tools emit more per hour than many cars. Here is how one shared battery platform replaced a mower, trimmer and blower.',
    category: 'In Action',
    author: 'Marcus Oyelaran',
    publishedAt: '2026-06-20T15:00:00.000Z',
    readMinutes: 5,
    hue: 95,
    image: { src: '/images/journal-electric-yard.jpg', alt: 'A cordless electric lawn mower, string trimmer, leaf blower and battery packs on a sunlit garden lawn.' },
    body: [
      { type: 'p', text: 'The biggest surprise of switching to electric yard tools was not the lack of fumes. It was hearing birds while mowing.' },
      { type: 'h2', text: 'One battery, three tools' },
      { type: 'p', text: 'A shared 56 V platform means two batteries cover a half-acre lot. Mulching clippings back into the lawn also meant skipping synthetic fertilizer entirely.' },
    ],
    relatedProductSlugs: ['cordless-21-inch-electric-mower', 'cordless-leaf-blower-56v', 'cordless-trimmer-edger-2in1'],
  },
];

export const postBySlug = (slug: string) => posts.find((p) => p.slug === slug);
