/**
 * Domain types. Shaped to match a future REST/GraphQL backend one-to-one,
 * so the mock API in src/api can be swapped without touching components.
 */

export type ID = string;
export type ISODate = string;

export type ValueTag =
  | 'Non-Toxic'
  | 'Compostable'
  | 'Recyclable'
  | 'Refillable'
  | 'Plastic-Free'
  | 'Bio-Based'
  | 'Cleantech'
  | 'Minimal Packaging'
  | 'Made in USA'
  | 'Women-Owned'
  | 'Small-Batch';

export interface Certification {
  name: string;
  issuer: string;
  id: string;
}

export interface ProductImage {
  /** Real asset URL. When absent, a generated palette illustration is shown. */
  src?: string;
  srcSet?: string;
  alt: string;
  /** Which illustrated angle to render when there is no real photo. */
  angle?: 'front' | 'detail' | 'context' | 'pack';
  /** Attribution for licensed stock photography. */
  credit?: { name: string; url: string; source: 'Unsplash' | 'Pexels' };
}

export interface PriceTier {
  minQty: number;
  unitPrice: number;
}

export interface ProductVariant {
  id: ID;
  label: string;
  priceDelta: number;
  stock: number;
}

export interface Product {
  id: ID;
  slug: string;
  name: string;
  brandName: string;
  vendorId: ID;
  tagline: string;
  description: string;
  images: ProductImage[];
  video?: string;
  keyFeatures: string[];
  specialAspects: string[];
  usageExample: { text: string; images: ProductImage[] };
  category: string;
  categorySlug: string;
  subcategory: string;
  valueTags: ValueTag[];
  intellectualProperty: { patents: string[]; trademarks: string[]; copyrights: string[] };
  certifications: Certification[];
  pricing: { msrp: number; price: number; currency: 'USD'; tiers: PriceTier[] };
  hfeDiscount: { type: 'percent' | 'fixed'; value: number; note: string };
  warranty: { summary: string; durationMonths: number; providedBy: 'vendor'; hfeLiable: false };
  shipping: { providedBy: 'vendor'; estimateDays: [number, number]; freeThreshold?: number };
  inventory: { sku: string; stock: number };
  harmFreeSeal: { granted: boolean; grantedAt: ISODate };
  dimensions: string;
  variants: ProductVariant[];
  refillable: boolean;
  createdAt: ISODate;
  unitsSold: number;
  ratingAvg: number;
  reviewCount: number;
}

export interface Category {
  slug: string;
  name: string;
  group: string;
  icon: IconName;
}

export interface CategoryGroup {
  slug: string;
  name: string;
  blurb: string;
  icon: IconName;
  categories: Category[];
}

export type IconName =
  | 'leaf' | 'sun' | 'bolt' | 'drop' | 'home' | 'box' | 'bottle' | 'spray' | 'heart'
  | 'shield' | 'wind' | 'flame' | 'car' | 'pot' | 'sprout' | 'bug' | 'snow' | 'brick'
  | 'battery' | 'lamp' | 'cloth' | 'plate' | 'paper' | 'mower' | 'pill' | 'gauge' | 'tent';

export interface Vendor {
  id: ID;
  slug: string;
  name: string;
  tagline: string;
  story: string;
  location: string;
  founded: number;
  valueTags: ValueTag[];
  certifications: Certification[];
  returnPolicy: string;
  warrantyContact: string;
  carrier: string;
  hue: number;
}

export interface Review {
  id: ID;
  productId: ID;
  userId?: ID;
  authorName: string;
  location: string;
  rating: 1 | 2 | 3 | 4 | 5;
  title: string;
  body: string;
  createdAt: ISODate;
  verifiedPurchase: boolean;
  media?: 'photo' | 'video';
}

export interface Address {
  id: ID;
  label: string;
  fullName: string;
  line1: string;
  line2?: string;
  city: string;
  region: string;
  postalCode: string;
  country: string;
  phone?: string;
  isDefault: boolean;
}

export interface User {
  id: ID;
  email: string;
  firstName: string;
  lastName: string;
  createdAt: ISODate;
  addresses: Address[];
  referralCode: string;
  marketingOptIn: boolean;
}

export interface CartItem {
  productId: ID;
  variantId?: ID;
  qty: number;
  savedForLater?: boolean;
}

export interface WishlistItem {
  productId: ID;
  addedAt: ISODate;
}

export type ShipmentStage =
  | 'placed'
  | 'vendor_confirmed'
  | 'packed'
  | 'shipped'
  | 'out_for_delivery'
  | 'delivered';

export interface ShipmentEvent {
  stage: ShipmentStage;
  at: ISODate;
  note: string;
  location?: string;
}

export interface OrderLine {
  productId: ID;
  variantId?: ID;
  name: string;
  variantLabel?: string;
  qty: number;
  unitPrice: number;
  lineTotal: number;
}

export type ShippingMethodId = 'standard' | 'expedited';

export interface Shipment {
  id: ID;
  vendorId: ID;
  vendorName: string;
  carrier: string;
  trackingNumber: string;
  method: ShippingMethodId;
  shippingCost: number;
  lines: OrderLine[];
  /** Scheduled events. The current stage is the latest event whose `at` is in the past. */
  events: ShipmentEvent[];
  returnWindowDays: number;
}

export interface OrderAddress {
  fullName: string;
  line1: string;
  line2?: string;
  city: string;
  region: string;
  postalCode: string;
  country: string;
  phone?: string;
}

export interface Order {
  id: ID;
  number: string;
  userId?: ID;
  email: string;
  placedAt: ISODate;
  shippingAddress: OrderAddress;
  shipments: Shipment[];
  totals: {
    subtotal: number;
    discount: number;
    promoCode?: string;
    pointsRedeemed: number;
    pointsDiscount: number;
    shipping: number;
    tax: number;
    total: number;
  };
  payment: { brand: string; last4: string; authCode: string };
  pointsEarned: number;
  earthCoinEarned: boolean;
}

export type ReturnResolution = 'refund' | 'replacement' | 'store_credit' | 'warranty_repair';

export interface ReturnRequest {
  id: ID;
  orderId: ID;
  userId: ID;
  shipmentId: ID;
  vendorId: ID;
  vendorName: string;
  lines: { productId: ID; name: string; qty: number }[];
  reason: string;
  details: string;
  resolution: ReturnResolution;
  status: 'submitted' | 'forwarded_to_vendor' | 'approved' | 'closed';
  createdAt: ISODate;
  rmaNumber: string;
}

export type PointsSource =
  | 'purchase'
  | 'review'
  | 'photo_review'
  | 'referral'
  | 'redemption'
  | 'signup'
  | 'donation';

export interface PointsTransaction {
  id: ID;
  userId: ID;
  source: PointsSource;
  points: number;
  note: string;
  at: ISODate;
  refId?: ID;
}

export interface EarthCoinEntitlement {
  id: ID;
  userId: ID;
  reason: 'donation' | 'purchase' | 'reviews';
  refId?: ID;
  at: ISODate;
  /** Always 'recorded' in this phase: no minting, no wallet connection. */
  status: 'recorded';
  serial: string;
}

export type LoyaltyTier = 'Seedling' | 'Sapling' | 'Canopy';

export interface LoyaltyAccount {
  userId: ID;
  balance: number;
  lifetimeEarned: number;
  tier: LoyaltyTier;
  nextTier?: { name: LoyaltyTier; pointsNeeded: number };
  transactions: PointsTransaction[];
  earthCoins: EarthCoinEntitlement[];
  reviewsTowardEarthCoin: number;
  referralCode: string;
  referrals: number;
}

export interface Donation {
  id: ID;
  userId?: ID;
  email: string;
  amount: number;
  recurring: boolean;
  dedication?: string;
  at: ISODate;
  receiptNumber: string;
  earthCoinEarned: boolean;
}

export interface PostBlock {
  type: 'p' | 'h2' | 'quote' | 'ul';
  text: string | string[];
}

export interface Post {
  id: ID;
  slug: string;
  title: string;
  excerpt: string;
  category: 'Innovation' | 'In Action' | 'Regen Media' | 'Standard';
  author: string;
  publishedAt: ISODate;
  readMinutes: number;
  hue: number;
  /** Cover photo; falls back to generated art when absent. */
  image?: { src: string; alt: string };
  body: PostBlock[];
  relatedProductSlugs: string[];
}

export type FAQGroup =
  | 'Orders & Shipping'
  | 'Returns & Warranty'
  | 'Rewards & EarthCoin'
  | 'The HarmFree Standard'
  | 'Account';

export interface FAQ {
  q: string;
  a: string;
  group: FAQGroup;
}

export interface Policy {
  slug: string;
  title: string;
  updated: ISODate;
  summary: string;
  sections: { heading: string; body: string[] }[];
}

export type SortKey = 'relevance' | 'price-asc' | 'price-desc' | 'rating' | 'newest' | 'best-selling';

export interface ProductQuery {
  q?: string;
  category?: string;
  group?: string;
  values?: ValueTag[];
  certs?: string[];
  vendors?: string[];
  minPrice?: number;
  maxPrice?: number;
  minRating?: number;
  refillable?: boolean;
  sort?: SortKey;
  page?: number;
  pageSize?: number;
}

export interface FacetCount {
  value: string;
  label: string;
  count: number;
}

export interface ProductPage {
  items: Product[];
  total: number;
  page: number;
  pageSize: number;
  facets: {
    categories: FacetCount[];
    values: FacetCount[];
    certs: FacetCount[];
    vendors: FacetCount[];
    priceRange: [number, number];
  };
}

export interface ImpactStats {
  productsVetted: number;
  vendors: number;
  categories: number;
  certificationsTracked: number;
  refillableProducts: number;
  plasticFreeProducts: number;
  earthCoinsRecorded: number;
  shipmentsTracked: number;
}
