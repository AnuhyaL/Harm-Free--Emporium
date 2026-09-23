/**
 * SAMPLE DATA — the mock "database". Persists to localStorage so the demo survives reloads.
 * Seeds one demo account with order history, points and an EarthCoin so account screens have content.
 * Replace with a real backend: see BACKEND_NEEDED.md.
 */
import { productById, productBySlug } from '@/data';
import { REAL_OFFSETS_MS } from '@/lib/orders';
import { summarizeCart } from '@/lib/pricing';
import type {
  Donation,
  EarthCoinEntitlement,
  Order,
  PointsTransaction,
  ReturnRequest,
  Review,
  User,
} from '@/types';
import { orderFromSummary } from './orderFactory';

export interface StoredUser extends User {
  /** Demo only. A real backend never stores or returns plain passwords. */
  password: string;
}

export interface DB {
  version: 1;
  users: StoredUser[];
  sessions: Record<string, string>;
  orders: Order[];
  returns: ReturnRequest[];
  points: PointsTransaction[];
  earthCoins: EarthCoinEntitlement[];
  reviews: Review[];
  donations: Donation[];
  messages: { id: string; name: string; email: string; topic: string; message: string; at: string }[];
  newsletter: string[];
  vendorApplications: { id: string; company: string; email: string; at: string }[];
  orderSeq: number;
}

const KEY = 'hfe-db-v1';
export const DEMO_USER_ID = 'u-demo';
export const DEMO_CREDENTIALS = { email: 'demo@harmfree.example', password: 'harmfree' };

const daysAgo = (d: number, hours = 0) => new Date(Date.now() - d * 86400_000 - hours * 3600_000);

function seed(): DB {
  const user: StoredUser = {
    id: DEMO_USER_ID,
    email: DEMO_CREDENTIALS.email,
    password: DEMO_CREDENTIALS.password,
    firstName: 'Jordan',
    lastName: 'Rivera',
    createdAt: daysAgo(90).toISOString(),
    referralCode: 'JORDAN-SOL10',
    marketingOptIn: true,
    addresses: [
      {
        id: 'addr-1',
        label: 'Home',
        fullName: 'Jordan Rivera',
        line1: '142 Hale Kula Place',
        city: 'Kahului',
        region: 'HI',
        postalCode: '96732',
        country: 'United States',
        phone: '(808) 555-0142',
        isDefault: true,
      },
      {
        id: 'addr-2',
        label: 'Studio',
        fullName: 'Jordan Rivera',
        line1: '88 Front Street',
        line2: 'Unit 3',
        city: 'Lahaina',
        region: 'HI',
        postalCode: '96761',
        country: 'United States',
        isDefault: false,
      },
    ],
  };
  const address = {
    fullName: 'Jordan Rivera',
    line1: '142 Hale Kula Place',
    city: 'Kahului',
    region: 'HI',
    postalCode: '96732',
    country: 'United States',
  };

  const bySlug = (slug: string) => productBySlug(slug)!.id;
  const make = (
    n: number,
    placedAt: Date,
    items: { slug: string; qty: number; variant?: number }[],
    pointsToRedeem = 0,
  ) => {
    const cart = items.map((i) => {
      const p = productBySlug(i.slug)!;
      return { productId: p.id, qty: i.qty, variantId: i.variant !== undefined ? p.variants[i.variant]?.id : undefined };
    });
    const summary = summarizeCart(cart, productById, { member: true, pointsToRedeem, pointsBalance: 5000 });
    return orderFromSummary({
      id: `ord-${n}`,
      number: `HFE-${n}`,
      userId: DEMO_USER_ID,
      email: user.email,
      placedAt,
      address,
      summary,
      method: 'standard',
      payment: { brand: 'Visa', last4: '4242', authCode: `SIM-${n}` },
      offsets: REAL_OFFSETS_MS,
    });
  };

  const o1 = make(100231, daysAgo(34), [
    { slug: 'induction-ready-cast-iron-skillet', qty: 1, variant: 0 },
    { slug: 'bamboo-dish-brush-set', qty: 1 },
    { slug: 'all-purpose-cleaner-refill-tablets', qty: 3, variant: 0 },
  ]);
  const o2 = make(
    100418,
    daysAgo(2, 1),
    [
      { slug: 'countertop-gravity-water-filter', qty: 1 },
      { slug: 'solid-shampoo-conditioner-duo', qty: 1, variant: 1 },
    ],
    300,
  );
  const o3 = make(100502, daysAgo(0, 10), [{ slug: 'usb-c-rechargeable-aa-8', qty: 1, variant: 0 }]);

  const tx = (id: string, source: PointsTransaction['source'], points: number, note: string, at: Date, refId?: string): PointsTransaction => ({
    id, userId: DEMO_USER_ID, source, points, note, at: at.toISOString(), refId,
  });

  const points: PointsTransaction[] = [
    tx('pt-1', 'signup', 200, 'Welcome to HarmFree Rewards', daysAgo(90)),
    tx('pt-2', 'purchase', o1.pointsEarned, `Order ${o1.number}`, daysAgo(34), o1.id),
    tx('pt-3', 'review', 50, 'Review: Induction-Ready Cast Iron Skillet', daysAgo(25)),
    tx('pt-4', 'photo_review', 100, 'Photo bonus: Induction-Ready Cast Iron Skillet', daysAgo(25)),
    tx('pt-5', 'review', 50, 'Review: Bamboo Dish Brush Set', daysAgo(22)),
    tx('pt-6', 'referral', 500, 'Referral: a friend joined with your code', daysAgo(15)),
    tx('pt-7', 'redemption', -300, `Redeemed on order ${o2.number}`, daysAgo(2, 1), o2.id),
    tx('pt-8', 'purchase', o2.pointsEarned, `Order ${o2.number}`, daysAgo(2, 1), o2.id),
    tx('pt-9', 'purchase', o3.pointsEarned, `Order ${o3.number}`, daysAgo(0, 10), o3.id),
  ];

  const reviews: Review[] = [
    {
      id: 'r-user-1',
      productId: bySlug('induction-ready-cast-iron-skillet'),
      userId: DEMO_USER_ID,
      authorName: 'Jordan R.',
      location: 'Kahului, HI',
      rating: 5,
      title: 'Replaced three non-stick pans',
      body: 'Heats evenly on my induction top and the flax seasoning held up after a month of daily eggs.',
      createdAt: daysAgo(25).toISOString(),
      verifiedPurchase: true,
      media: 'photo',
    },
    {
      id: 'r-user-2',
      productId: bySlug('bamboo-dish-brush-set'),
      userId: DEMO_USER_ID,
      authorName: 'Jordan R.',
      location: 'Kahului, HI',
      rating: 4,
      title: 'Great brushes, order extra heads',
      body: 'Sisal is stiff enough for cast iron. I go through heads a bit faster than expected.',
      createdAt: daysAgo(22).toISOString(),
      verifiedPurchase: true,
    },
  ];

  return {
    version: 1,
    users: [user],
    sessions: {},
    orders: [o3, o2, o1],
    returns: [],
    points,
    earthCoins: [
      {
        id: 'ec-1',
        userId: DEMO_USER_ID,
        reason: 'purchase',
        refId: o1.id,
        at: daysAgo(34).toISOString(),
        status: 'recorded',
        serial: 'EC-DEMO-000231',
      },
    ],
    reviews,
    donations: [],
    messages: [],
    newsletter: [],
    vendorApplications: [],
    orderSeq: 100600,
  };
}

let cache: DB | null = null;

export function db(): DB {
  if (cache) return cache;
  try {
    const raw = localStorage.getItem(KEY);
    if (raw) {
      const parsed = JSON.parse(raw) as DB;
      if (parsed.version === 1) {
        // Older saves carried a label prefix on the seeded reviews; strip it.
        for (const r of parsed.reviews) r.body = r.body.replace(/^Sample review from the demo account\. /, '');
        return (cache = parsed);
      }
    }
  } catch {
    /* corrupted or unavailable storage: reseed */
  }
  cache = seed();
  persist();
  return cache;
}

export function persist() {
  if (!cache) return;
  try {
    localStorage.setItem(KEY, JSON.stringify(cache));
  } catch {
    /* storage full or blocked: keep in memory */
  }
}

/** Dev helper exposed on the account settings page. */
export function resetDemoData() {
  cache = seed();
  persist();
}
