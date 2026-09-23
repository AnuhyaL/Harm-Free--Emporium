import { rawProducts } from './products';
import { aggregate, seedReviews } from './reviews';

export * from './categories';
export * from './vendors';
export * from './posts';
export * from './content';
export { seedReviews } from './reviews';

/** Products with rating aggregates computed from the sample review set. */
export const products = rawProducts.map((p) => ({
  ...p,
  ...aggregate(seedReviews.filter((r) => r.productId === p.id)),
}));

export const productById = (id: string) => products.find((p) => p.id === id);
export const productBySlug = (slug: string) => products.find((p) => p.slug === slug);
