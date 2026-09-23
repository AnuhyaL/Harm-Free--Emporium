/**
 * SAMPLE DATA — generated demonstration reviews. These are not real customer reviews
 * and are labeled "Sample review" wherever they render.
 */
import type { Product, Review } from '@/types';
import { rawProducts } from './products';

/** Small deterministic PRNG so the sample set is stable across reloads. */
export function mulberry32(seed: number) {
  return () => {
    seed |= 0;
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const NAMES = [
  'Maya R.', 'Daniel K.', 'Priya S.', 'Tom W.', 'Leilani K.', 'Marcus J.', 'Hannah L.', 'Jorge M.',
  'Aiko T.', 'Sam B.', 'Rosa G.', 'Ben A.', 'Nadia F.', 'Chris O.', 'Ivy C.', 'Kwame D.',
  'Elena V.', 'Noah P.', 'Grace H.', 'Omar Z.', 'Lucía N.', 'Jess Y.', 'Ravi I.', 'Claire E.',
];
const PLACES = [
  'Maui, HI', 'Portland, OR', 'Austin, TX', 'Asheville, NC', 'Denver, CO', 'Madison, WI', 'Santa Fe, NM',
  'Burlington, VT', 'Oakland, CA', 'Tucson, AZ', 'Boise, ID', 'Ann Arbor, MI', 'Savannah, GA', 'Duluth, MN',
];

const POSITIVE: [string, string][] = [
  ['Does exactly what it promises', 'I was skeptical after years of "eco" products that fell short, but the {name} works as well as what it replaced. The listed certifications made the decision easy.'],
  ['Worth the switch', 'Took a week to adjust my routine and now I would not go back. The {name} feels well made and the packaging was paper only.'],
  ['Built to last', 'You can tell this was designed to be kept, not replaced. Good weight, clean finish, and the vendor answered a question within a day.'],
  ['Our household favorite', 'Everyone in the house uses the {name} daily. No weird smell, no residue, and I like knowing exactly what is in it.'],
  ['Great quality, honest listing', 'Arrived exactly as described. I appreciate that the product page lists the certification IDs instead of vague green claims.'],
  ['Would buy again', 'Second order. The first one has held up beautifully, so I got another as a gift.'],
  ['Better than expected', 'I bought the {name} mostly for the values, but it outperforms the conventional version I used before.'],
  ['Simple and effective', 'No gimmicks. It works, the shipping box was recyclable, and the vendor included care instructions on the inside flap.'],
];
const MIXED: [string, string][] = [
  ['Good, with a learning curve', 'The {name} does the job, though it took some trial and error to get right. Once I read the vendor guide it clicked.'],
  ['Solid but pricey', 'Quality is clearly there and I understand the price, but I wish there was a bulk option. Otherwise happy.'],
  ['Mostly great', 'Performs well. Delivery took a couple of days longer than the estimate, but the vendor kept me updated.'],
];
const NEGATIVE: [string, string][] = [
  ['Not for my use case', 'Well made, but it did not suit how I needed it. The return went straight to the vendor and was handled quickly.'],
];

const ROUND = (n: number) => Math.round(n * 10) / 10;

function reviewsFor(product: Product, index: number): Review[] {
  const rand = mulberry32(index * 9973 + 17);
  const count = 2 + Math.floor(rand() * 6);
  const out: Review[] = [];
  for (let i = 0; i < count; i++) {
    const r = rand();
    const rating = (r < 0.58 ? 5 : r < 0.88 ? 4 : r < 0.97 ? 3 : 2) as Review['rating'];
    const pool = rating >= 4 ? POSITIVE : rating === 3 ? MIXED : NEGATIVE;
    const [title, body] = pool[Math.floor(rand() * pool.length)];
    const media = rand() < 0.18 ? (rand() < 0.7 ? 'photo' : 'video') : undefined;
    out.push({
      id: `r-${product.id}-${i + 1}`,
      productId: product.id,
      authorName: NAMES[Math.floor(rand() * NAMES.length)],
      location: PLACES[Math.floor(rand() * PLACES.length)],
      rating,
      title,
      body: body.replace('{name}', product.name),
      createdAt: new Date(Date.UTC(2026, 8, 15) - Math.floor(rand() * 240) * 86400000).toISOString(),
      verifiedPurchase: rand() < 0.85,
      media,
    });
  }
  return out;
}

export const seedReviews: Review[] = rawProducts.flatMap(reviewsFor);

export function aggregate(reviews: Review[]) {
  if (!reviews.length) return { ratingAvg: 0, reviewCount: 0 };
  return {
    ratingAvg: ROUND(reviews.reduce((s, r) => s + r.rating, 0) / reviews.length),
    reviewCount: reviews.length,
  };
}
