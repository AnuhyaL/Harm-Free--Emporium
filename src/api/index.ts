/**
 * The mock API. Every data access in the app goes through `api.*`, each returning a Promise
 * with simulated latency. To move to a real backend, reimplement these functions with HTTP
 * calls; signatures and return types stay the same. See BACKEND_NEEDED.md.
 */
import {
  categories,
  categoryBySlug,
  categoryGroups,
  faqs,
  policyBySlug,
  postBySlug,
  posts,
  productById,
  productBySlug,
  products,
  REWARDS,
  seedReviews,
  vendorById,
  vendorBySlug,
  vendors,
} from '@/data';
import { aggregate } from '@/data/reviews';
import { DEMO_OFFSETS_MS, currentStage } from '@/lib/orders';
import { summarizeCart } from '@/lib/pricing';
import type {
  Address,
  CartItem,
  Donation,
  EarthCoinEntitlement,
  FacetCount,
  ImpactStats,
  LoyaltyAccount,
  LoyaltyTier,
  OrderAddress,
  PointsTransaction,
  Product,
  ProductPage,
  ProductQuery,
  ReturnRequest,
  ReturnResolution,
  Review,
  ShippingMethodId,
  User,
} from '@/types';
import { ApiError, delay, fail, session, uid } from './client';
import { db, DEMO_USER_ID, persist, type StoredUser } from './db';
import { orderFromSummary } from './orderFactory';

export { ApiError } from './client';
export { DEMO_CREDENTIALS, resetDemoData } from './db';

// ——— helpers ———

const publicUser = ({ password: _pw, ...u }: StoredUser): User => u;

function requireUser(): StoredUser {
  const token = session.get();
  const userId = token ? db().sessions[token] : undefined;
  const user = userId ? db().users.find((u) => u.id === userId) : undefined;
  if (!user) throw new ApiError('Please sign in to continue.', 401, 'unauthenticated');
  return user;
}

function currentUserOrNull(): StoredUser | null {
  try {
    return requireUser();
  } catch {
    return null;
  }
}

/** Wraps a synchronous handler so thrown ApiErrors become rejected promises with latency. */
function handle<T>(fn: () => T, ms?: number): Promise<T> {
  try {
    return delay(fn(), ms);
  } catch (e) {
    if (e instanceof ApiError) return fail(e.message, e.status, e.code);
    throw e;
  }
}

const allReviews = (): Review[] => [...db().reviews, ...seedReviews];

function productWithLiveRatings(p: Product): Product {
  const extra = db().reviews.filter((r) => r.productId === p.id);
  if (!extra.length) return p;
  return { ...p, ...aggregate(allReviews().filter((r) => r.productId === p.id)) };
}

const liveProducts = () => products.map(productWithLiveRatings);

// ——— catalog search & faceting ———

const tokenize = (s: string) => s.toLowerCase().split(/[^a-z0-9]+/).filter(Boolean);

function relevance(p: Product, terms: string[]) {
  if (!terms.length) return 1;
  const hay = {
    name: p.name.toLowerCase(),
    brand: p.brandName.toLowerCase(),
    cat: `${p.category} ${p.subcategory}`.toLowerCase(),
    tags: p.valueTags.join(' ').toLowerCase(),
    body: `${p.tagline} ${p.description} ${p.keyFeatures.join(' ')}`.toLowerCase(),
  };
  let score = 0;
  for (const t of terms) {
    let hit = 0;
    if (hay.name.includes(t)) hit += 6;
    if (hay.cat.includes(t)) hit += 4;
    if (hay.brand.includes(t)) hit += 3;
    if (hay.tags.includes(t)) hit += 3;
    if (hay.body.includes(t)) hit += 1;
    if (!hit) return 0;
    score += hit;
  }
  return score;
}

type FacetKey = 'category' | 'values' | 'certs' | 'vendors' | 'price';

const groupOfCategory = new Map(categoryGroups.flatMap((g) => g.categories.map((c) => [c.slug, g.slug] as const)));

function matches(p: Product, q: ProductQuery, except?: FacetKey) {
  if (q.group && groupOfCategory.get(p.categorySlug) !== q.group) return false;
  if (except !== 'category' && q.category && p.categorySlug !== q.category) return false;
  if (except !== 'values' && q.values?.length && !q.values.every((v) => p.valueTags.includes(v))) return false;
  if (except !== 'certs' && q.certs?.length && !q.certs.some((c) => p.certifications.some((pc) => pc.name === c))) return false;
  if (except !== 'vendors' && q.vendors?.length && !q.vendors.includes(p.vendorId)) return false;
  if (except !== 'price') {
    if (q.minPrice !== undefined && p.pricing.price < q.minPrice) return false;
    if (q.maxPrice !== undefined && p.pricing.price > q.maxPrice) return false;
  }
  if (q.minRating && p.ratingAvg < q.minRating) return false;
  if (q.refillable && !p.refillable) return false;
  return true;
}

function countBy(items: Product[], keys: (p: Product) => string[], label: (k: string) => string): FacetCount[] {
  const m = new Map<string, number>();
  for (const p of items) for (const k of new Set(keys(p))) m.set(k, (m.get(k) ?? 0) + 1);
  return [...m.entries()]
    .map(([value, count]) => ({ value, label: label(value), count }))
    .sort((a, b) => a.label.localeCompare(b.label));
}

function listProducts(q: ProductQuery): ProductPage {
  const terms = tokenize(q.q ?? '');
  const scored = liveProducts()
    .map((p) => ({ p, score: relevance(p, terms) }))
    .filter((x) => x.score > 0);
  const base = scored.map((x) => x.p);
  const filtered = scored.filter((x) => matches(x.p, q));

  const sort = q.sort ?? 'relevance';
  filtered.sort((a, b) => {
    switch (sort) {
      case 'price-asc': return a.p.pricing.price - b.p.pricing.price;
      case 'price-desc': return b.p.pricing.price - a.p.pricing.price;
      case 'rating': return b.p.ratingAvg - a.p.ratingAvg || b.p.reviewCount - a.p.reviewCount;
      case 'newest': return b.p.createdAt.localeCompare(a.p.createdAt);
      case 'best-selling': return b.p.unitsSold - a.p.unitsSold;
      default: return b.score - a.score || b.p.unitsSold - a.p.unitsSold;
    }
  });

  const pageSize = q.pageSize ?? 24;
  const page = Math.max(1, q.page ?? 1);
  const prices = base.map((p) => p.pricing.price);

  return {
    items: filtered.slice((page - 1) * pageSize, page * pageSize).map((x) => x.p),
    total: filtered.length,
    page,
    pageSize,
    facets: {
      categories: countBy(base.filter((p) => matches(p, q, 'category')), (p) => [p.categorySlug], (s) => categoryBySlug(s)?.name ?? s),
      values: countBy(base.filter((p) => matches(p, q, 'values')), (p) => p.valueTags, (v) => v),
      certs: countBy(base.filter((p) => matches(p, q, 'certs')), (p) => p.certifications.map((c) => c.name), (c) => c),
      vendors: countBy(base.filter((p) => matches(p, q, 'vendors')), (p) => [p.vendorId], (id) => vendorById(id)?.name ?? id),
      priceRange: prices.length ? [Math.floor(Math.min(...prices)), Math.ceil(Math.max(...prices))] : [0, 0],
    },
  };
}

// ——— loyalty ———

function tierFor(lifetime: number): { tier: LoyaltyTier; next?: { name: LoyaltyTier; pointsNeeded: number } } {
  const tiers = REWARDS.tiers;
  let idx = 0;
  tiers.forEach((t, i) => {
    if (lifetime >= t.min) idx = i;
  });
  const next = tiers[idx + 1];
  return { tier: tiers[idx].name, next: next ? { name: next.name, pointsNeeded: next.min - lifetime } : undefined };
}

function loyaltyFor(user: StoredUser): LoyaltyAccount {
  const d = db();
  const transactions = d.points.filter((t) => t.userId === user.id).sort((a, b) => b.at.localeCompare(a.at));
  const balance = transactions.reduce((s, t) => s + t.points, 0);
  const lifetimeEarned = transactions.filter((t) => t.points > 0).reduce((s, t) => s + t.points, 0);
  const reviewCount = d.reviews.filter((r) => r.userId === user.id).length;
  const { tier, next } = tierFor(lifetimeEarned);
  return {
    userId: user.id,
    balance,
    lifetimeEarned,
    tier,
    nextTier: next,
    transactions,
    earthCoins: d.earthCoins.filter((e) => e.userId === user.id).sort((a, b) => b.at.localeCompare(a.at)),
    reviewsTowardEarthCoin: reviewCount % REWARDS.reviewsPerEarthCoin,
    referralCode: user.referralCode,
    referrals: transactions.filter((t) => t.source === 'referral').length,
  };
}

function addPoints(userId: string, source: PointsTransaction['source'], points: number, note: string, refId?: string) {
  db().points.push({ id: uid('pt'), userId, source, points, note, at: new Date().toISOString(), refId });
}

function recordEarthCoin(userId: string, reason: EarthCoinEntitlement['reason'], refId?: string) {
  const d = db();
  const serial = `EC-${new Date().getFullYear()}-${String(d.earthCoins.length + 1).padStart(6, '0')}`;
  const coin: EarthCoinEntitlement = { id: uid('ec'), userId, reason, refId, at: new Date().toISOString(), status: 'recorded', serial };
  d.earthCoins.push(coin);
  return coin;
}

// ——— public API ———

export interface PlaceOrderInput {
  items: CartItem[];
  email: string;
  address: OrderAddress;
  shippingMethod: ShippingMethodId;
  promoCode?: string;
  pointsToRedeem?: number;
  /** A simulated payment token. Contains no card number, expiry or CVC. */
  paymentToken: { brand: string; last4: string; outcome: string };
}

export const api = {
  catalog: {
    listProducts: (q: ProductQuery) => delay(listProducts(q)),
    getProduct: (slug: string) =>
      handle(() => {
        const p = productBySlug(slug);
        if (!p) throw new ApiError('Product not found', 404, 'not_found');
        return { product: productWithLiveRatings(p), vendor: vendorById(p.vendorId)! };
      }),
    related: (productId: string, limit = 8) =>
      delay(
        (() => {
          const p = productById(productId);
          if (!p) return [];
          return liveProducts()
            .filter((x) => x.id !== p.id)
            .map((x) => ({
              x,
              s: (x.categorySlug === p.categorySlug ? 5 : 0) +
                (categoryBySlug(x.categorySlug)?.group === categoryBySlug(p.categorySlug)?.group ? 2 : 0) +
                x.valueTags.filter((t) => p.valueTags.includes(t)).length,
            }))
            .sort((a, b) => b.s - a.s || b.x.unitsSold - a.x.unitsSold)
            .slice(0, limit)
            .map((r) => r.x);
        })(),
      ),
    byIds: (ids: string[]) => delay(ids.map((id) => productById(id)).filter(Boolean).map((p) => productWithLiveRatings(p!)), 120),
    bySlugs: (slugs: string[]) => delay(slugs.map((s) => productBySlug(s)).filter(Boolean) as Product[], 120),
    bestSellers: (limit = 10) => delay([...liveProducts()].sort((a, b) => b.unitsSold - a.unitsSold).slice(0, limit)),
    newArrivals: (limit = 10) => delay([...liveProducts()].sort((a, b) => b.createdAt.localeCompare(a.createdAt)).slice(0, limit)),
    suggest: (q: string) =>
      delay(
        (() => {
          const terms = tokenize(q);
          if (!terms.length) return { products: [] as Product[], categories: [] as typeof categories };
          const prods = liveProducts()
            .map((p) => ({ p, s: relevance(p, terms) }))
            .filter((x) => x.s > 0)
            .sort((a, b) => b.s - a.s)
            .slice(0, 6)
            .map((x) => x.p);
          const cats = categories.filter((c) => terms.every((t) => c.name.toLowerCase().includes(t))).slice(0, 4);
          return { products: prods, categories: cats };
        })(),
        90,
      ),
    categoryGroups: () => delay(categoryGroups, 60),
    categoryCounts: () =>
      delay(
        Object.fromEntries(categories.map((c) => [c.slug, products.filter((p) => p.categorySlug === c.slug).length])),
        60,
      ),
  },

  vendors: {
    list: () =>
      delay(
        vendors.map((v) => ({ vendor: v, productCount: products.filter((p) => p.vendorId === v.id).length })),
      ),
    get: (slug: string) =>
      handle(() => {
        const v = vendorBySlug(slug);
        if (!v) throw new ApiError('Vendor not found', 404, 'not_found');
        return { vendor: v, products: liveProducts().filter((p) => p.vendorId === v.id) };
      }),
  },

  reviews: {
    forProduct: (productId: string) =>
      delay(allReviews().filter((r) => r.productId === productId).sort((a, b) => b.createdAt.localeCompare(a.createdAt))),
    featured: (limit = 9) =>
      delay(
        allReviews()
          .filter((r) => r.rating === 5 && !r.userId)
          .sort((a, b) => b.createdAt.localeCompare(a.createdAt))
          .slice(0, limit)
          .map((r) => ({ review: r, product: productById(r.productId)! })),
      ),
    summary: () => delay(aggregate(allReviews()), 60),
    create: (input: { productId: string; rating: Review['rating']; title: string; body: string; media?: 'photo' | 'video' }) =>
      handle(() => {
        const user = requireUser();
        const d = db();
        const review: Review = {
          id: uid('r'),
          productId: input.productId,
          userId: user.id,
          authorName: `${user.firstName} ${user.lastName.charAt(0)}.`,
          location: user.addresses.find((a) => a.isDefault)?.city ?? '',
          rating: input.rating,
          title: input.title,
          body: input.body,
          createdAt: new Date().toISOString(),
          verifiedPurchase: d.orders.some((o) => o.userId === user.id && o.shipments.some((s) => s.lines.some((l) => l.productId === input.productId))),
          media: input.media,
        };
        d.reviews.unshift(review);
        const product = productById(input.productId);
        addPoints(user.id, 'review', REWARDS.reviewPoints, `Review: ${product?.name ?? 'product'}`, review.id);
        let pointsAwarded = REWARDS.reviewPoints;
        if (input.media) {
          addPoints(user.id, 'photo_review', REWARDS.photoReviewBonus, `${input.media === 'video' ? 'Video' : 'Photo'} bonus: ${product?.name ?? 'product'}`, review.id);
          pointsAwarded += REWARDS.photoReviewBonus;
        }
        const count = d.reviews.filter((r) => r.userId === user.id).length;
        const earthCoin = count % REWARDS.reviewsPerEarthCoin === 0 ? recordEarthCoin(user.id, 'reviews', review.id) : undefined;
        persist();
        return { review, pointsAwarded, earthCoin };
      }),
  },

  content: {
    posts: () => delay([...posts].sort((a, b) => b.publishedAt.localeCompare(a.publishedAt))),
    post: (slug: string) =>
      handle(() => {
        const p = postBySlug(slug);
        if (!p) throw new ApiError('Post not found', 404, 'not_found');
        return p;
      }),
    faqs: () => delay(faqs, 100),
    policy: (slug: string) =>
      handle(() => {
        const p = policyBySlug(slug);
        if (!p) throw new ApiError('Policy not found', 404, 'not_found');
        return p;
      }, 100),
  },

  stats: {
    impact: (): Promise<ImpactStats> =>
      delay({
        productsVetted: products.filter((p) => p.harmFreeSeal.granted).length,
        vendors: vendors.length,
        categories: categories.length,
        certificationsTracked: new Set(products.flatMap((p) => p.certifications.map((c) => c.name))).size,
        refillableProducts: products.filter((p) => p.refillable).length,
        plasticFreeProducts: products.filter((p) => p.valueTags.includes('Plastic-Free')).length,
        earthCoinsRecorded: db().earthCoins.length,
        shipmentsTracked: db().orders.reduce((s, o) => s + o.shipments.length, 0),
      }),
  },

  auth: {
    login: (email: string, password: string) =>
      handle(() => {
        const user = db().users.find((u) => u.email.toLowerCase() === email.trim().toLowerCase());
        if (!user || user.password !== password) throw new ApiError('That email and password do not match an account.', 401, 'bad_credentials');
        const token = uid('sess');
        db().sessions[token] = user.id;
        persist();
        session.set(token);
        return publicUser(user);
      }, 450),
    signup: (input: { firstName: string; lastName: string; email: string; password: string; referralCode?: string; marketingOptIn: boolean }) =>
      handle(() => {
        const d = db();
        const email = input.email.trim().toLowerCase();
        if (d.users.some((u) => u.email.toLowerCase() === email)) throw new ApiError('An account with that email already exists.', 409, 'email_taken');
        const user: StoredUser = {
          id: uid('u'),
          email,
          password: input.password,
          firstName: input.firstName.trim(),
          lastName: input.lastName.trim(),
          createdAt: new Date().toISOString(),
          addresses: [],
          referralCode: `${input.firstName.trim().toUpperCase().replace(/[^A-Z]/g, '').slice(0, 8) || 'FRIEND'}-${Math.random().toString(36).slice(2, 6).toUpperCase()}`,
          marketingOptIn: input.marketingOptIn,
        };
        d.users.push(user);
        addPoints(user.id, 'signup', REWARDS.signupPoints, 'Welcome to HarmFree Rewards');
        const code = input.referralCode?.trim().toUpperCase();
        const referrer = code ? d.users.find((u) => u.referralCode === code && u.id !== user.id) : undefined;
        if (referrer) addPoints(referrer.id, 'referral', REWARDS.referralGetsPoints, `Referral: ${user.firstName} joined with your code`, user.id);
        const token = uid('sess');
        d.sessions[token] = user.id;
        persist();
        session.set(token);
        return { user: publicUser(user), referralApplied: Boolean(referrer) };
      }, 500),
    me: () => handle(() => publicUser(requireUser()), 80),
    logout: () =>
      handle(() => {
        const token = session.get();
        if (token) delete db().sessions[token];
        persist();
        session.clear();
        return true;
      }, 120),
    requestPasswordReset: (email: string) => delay({ email: email.trim().toLowerCase(), sent: true }, 500),
    updateProfile: (patch: Partial<Pick<User, 'firstName' | 'lastName' | 'email' | 'marketingOptIn'>>) =>
      handle(() => {
        const user = requireUser();
        if (patch.email && db().users.some((u) => u.id !== user.id && u.email.toLowerCase() === patch.email!.toLowerCase())) {
          throw new ApiError('Another account already uses that email.', 409, 'email_taken');
        }
        Object.assign(user, patch);
        persist();
        return publicUser(user);
      }),
    saveAddress: (address: Omit<Address, 'id'> & { id?: string }) =>
      handle(() => {
        const user = requireUser();
        const id = address.id ?? uid('addr');
        const next: Address = { ...address, id };
        if (next.isDefault || user.addresses.length === 0) {
          user.addresses.forEach((a) => (a.isDefault = false));
          next.isDefault = true;
        }
        const i = user.addresses.findIndex((a) => a.id === id);
        if (i >= 0) user.addresses[i] = next;
        else user.addresses.push(next);
        persist();
        return publicUser(user);
      }),
    deleteAddress: (id: string) =>
      handle(() => {
        const user = requireUser();
        user.addresses = user.addresses.filter((a) => a.id !== id);
        if (user.addresses.length && !user.addresses.some((a) => a.isDefault)) user.addresses[0].isDefault = true;
        persist();
        return publicUser(user);
      }),
  },

  payments: {
    /** Simulates a processor authorization. Only a brand/last4 token ever reaches here. */
    authorize: (token: PlaceOrderInput['paymentToken']) =>
      new Promise<{ approved: boolean; authCode?: string; outcome: string }>((resolve) =>
        setTimeout(
          () =>
            resolve(
              token.outcome === 'approved'
                ? { approved: true, authCode: `SIM-${Math.random().toString(36).slice(2, 8).toUpperCase()}`, outcome: 'approved' }
                : { approved: false, outcome: token.outcome },
            ),
          1100,
        ),
      ),
  },

  orders: {
    list: () =>
      handle(() => {
        const user = requireUser();
        return db().orders.filter((o) => o.userId === user.id).sort((a, b) => b.placedAt.localeCompare(a.placedAt));
      }),
    get: (id: string) =>
      handle(() => {
        const order = db().orders.find((o) => o.id === id);
        if (!order) throw new ApiError('Order not found', 404, 'not_found');
        const user = currentUserOrNull();
        // Guest orders are viewable by id (as if via an emailed link); member orders only by their owner.
        if (order.userId && order.userId !== user?.id) throw new ApiError('Order not found', 404, 'not_found');
        return order;
      }),
    place: async (input: PlaceOrderInput) => {
      const user = currentUserOrNull();
      const auth = await api.payments.authorize(input.paymentToken);
      if (!auth.approved) throw new ApiError('Payment was not approved.', 402, auth.outcome);
      return handle(() => {
        const d = db();
        const loyalty = user ? loyaltyFor(user) : undefined;
        const summary = summarizeCart(input.items, productById, {
          member: Boolean(user),
          promoCode: input.promoCode,
          pointsToRedeem: user ? input.pointsToRedeem : 0,
          pointsBalance: loyalty?.balance ?? 0,
          shippingMethod: input.shippingMethod,
        });
        if (!summary.groups.length) throw new ApiError('Your cart is empty.', 400, 'empty_cart');
        d.orderSeq += 1;
        const order = orderFromSummary({
          id: uid('ord'),
          number: `HFE-${d.orderSeq}`,
          userId: user?.id,
          email: input.email,
          placedAt: new Date(),
          address: input.address,
          summary,
          method: input.shippingMethod,
          payment: { brand: input.paymentToken.brand, last4: input.paymentToken.last4, authCode: auth.authCode! },
          offsets: DEMO_OFFSETS_MS,
        });
        if (!user) order.earthCoinEarned = false;
        d.orders.unshift(order);
        if (user) {
          if (summary.pointsRedeemed) addPoints(user.id, 'redemption', -summary.pointsRedeemed, `Redeemed on order ${order.number}`, order.id);
          addPoints(user.id, 'purchase', summary.pointsEarned, `Order ${order.number}`, order.id);
          if (summary.earthCoinEligible) recordEarthCoin(user.id, 'purchase', order.id);
        }
        persist();
        return order;
      });
    },
  },

  returns: {
    list: () => handle(() => db().returns.filter((r) => r.userId === requireUser().id)),
    forOrder: (orderId: string) => handle(() => db().returns.filter((r) => r.orderId === orderId && r.userId === requireUser().id)),
    create: (input: { orderId: string; shipmentId: string; lines: { productId: string; qty: number }[]; reason: string; details: string; resolution: ReturnResolution }) =>
      handle(() => {
        const user = requireUser();
        const order = db().orders.find((o) => o.id === input.orderId && o.userId === user.id);
        const shipment = order?.shipments.find((s) => s.id === input.shipmentId);
        if (!order || !shipment) throw new ApiError('Order not found', 404, 'not_found');
        if (currentStage(shipment) !== 'delivered') throw new ApiError('Returns open once a shipment is delivered.', 400, 'not_delivered');
        const req: ReturnRequest = {
          id: uid('ret'),
          orderId: order.id,
          userId: user.id,
          shipmentId: shipment.id,
          vendorId: shipment.vendorId,
          vendorName: shipment.vendorName,
          lines: input.lines.map((l) => ({ ...l, name: shipment.lines.find((sl) => sl.productId === l.productId)?.name ?? 'Item' })),
          reason: input.reason,
          details: input.details,
          resolution: input.resolution,
          status: 'forwarded_to_vendor',
          createdAt: new Date().toISOString(),
          rmaNumber: `RMA-${shipment.vendorId.slice(2).toUpperCase()}-${Math.floor(100000 + Math.random() * 899999)}`,
        };
        db().returns.unshift(req);
        persist();
        return req;
      }, 700),
  },

  loyalty: {
    get: () => handle(() => loyaltyFor(requireUser())),
  },

  donations: {
    create: (input: { amount: number; recurring: boolean; email: string; dedication?: string; paymentToken: PlaceOrderInput['paymentToken'] }) =>
      api.payments.authorize(input.paymentToken).then((auth) => {
        if (!auth.approved) return fail('Payment was not approved.', 402, auth.outcome);
        return handle(() => {
          const user = currentUserOrNull();
          const earns = input.amount >= REWARDS.earthCoinDonationMin;
          const donation: Donation = {
            id: uid('don'),
            userId: user?.id,
            email: input.email,
            amount: input.amount,
            recurring: input.recurring,
            dedication: input.dedication,
            at: new Date().toISOString(),
            receiptNumber: `G2G-${new Date().getFullYear()}-${Math.floor(10000 + Math.random() * 89999)}`,
            earthCoinEarned: Boolean(user && earns),
          };
          db().donations.push(donation);
          let earthCoin: EarthCoinEntitlement | undefined;
          if (user && earns) earthCoin = recordEarthCoin(user.id, 'donation', donation.id);
          persist();
          return { donation, earthCoin, earnsWhenSignedIn: !user && earns };
        });
      }),
  },

  forms: {
    contact: (input: { name: string; email: string; topic: string; message: string }) =>
      handle(() => {
        db().messages.push({ id: uid('msg'), ...input, at: new Date().toISOString() });
        persist();
        return { ticket: `CC-${Math.floor(10000 + Math.random() * 89999)}` };
      }, 600),
    newsletter: (email: string) =>
      handle(() => {
        const d = db();
        const e = email.trim().toLowerCase();
        const already = d.newsletter.includes(e);
        if (!already) d.newsletter.push(e);
        persist();
        return { already };
      }, 400),
    vendorApplication: (input: { company: string; email: string }) =>
      handle(() => {
        const id = uid('app');
        db().vendorApplications.push({ id, ...input, at: new Date().toISOString() });
        persist();
        return { reference: `VA-${id.slice(-6).toUpperCase()}` };
      }, 800),
  },
};

export type Api = typeof api;
export const isDemoUser = (u?: User | null) => u?.id === DEMO_USER_ID;
