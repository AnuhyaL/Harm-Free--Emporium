/**
 * Pricing engine shared by the cart UI and the (mock) order endpoint,
 * so the numbers a customer sees are the numbers the server charges.
 */
import { PROMO_CODES, REWARDS } from '@/data/content';
import type { CartItem, Product, ShippingMethodId } from '@/types';

export const STANDARD_SHIPPING = 6.95;
export const EXPEDITED_SHIPPING = 14.95;
export const TAX_RATE = 0.05;

export const SHIPPING_METHODS: Record<ShippingMethodId, { label: string; blurb: string }> = {
  standard: { label: 'Standard (vendor-shipped)', blurb: 'Free per vendor over $50, otherwise $6.95 per vendor.' },
  expedited: { label: 'Expedited', blurb: '$14.95 per vendor · arrives 1–3 days sooner.' },
};

export const round2 = (n: number) => Math.round((n + Number.EPSILON) * 100) / 100;

export function tierPrice(product: Product, qty: number) {
  const tier = [...product.pricing.tiers].reverse().find((t) => qty >= t.minQty);
  return tier ? tier.unitPrice : product.pricing.price;
}

export function unitPrice(product: Product, qty: number, variantId: string | undefined, member: boolean) {
  const variant = product.variants.find((v) => v.id === variantId);
  let price = tierPrice(product, qty) + (variant?.priceDelta ?? 0);
  if (member) {
    price =
      product.hfeDiscount.type === 'percent'
        ? price * (1 - product.hfeDiscount.value / 100)
        : price - product.hfeDiscount.value;
  }
  return round2(Math.max(price, 0));
}

export const pointsForAmount = (amount: number) => Math.floor(amount) * REWARDS.pointsPerDollar;

export interface PricedLine {
  item: CartItem;
  product: Product;
  unitPrice: number;
  lineTotal: number;
  variantLabel?: string;
}

export interface VendorGroup {
  vendorId: string;
  vendorName: string;
  lines: PricedLine[];
  subtotal: number;
  shipping: number;
  freeShippingGap: number;
  estimateDays: [number, number];
}

export interface CartSummary {
  groups: VendorGroup[];
  itemCount: number;
  subtotal: number;
  promo?: { code: string; label: string; amount: number };
  promoError?: string;
  pointsRedeemed: number;
  pointsDiscount: number;
  maxRedeemablePoints: number;
  shipping: number;
  tax: number;
  total: number;
  pointsEarned: number;
  earthCoinEligible: boolean;
}

export interface SummaryOptions {
  member: boolean;
  promoCode?: string;
  pointsToRedeem?: number;
  pointsBalance?: number;
  shippingMethod?: ShippingMethodId;
}

export function summarizeCart(
  items: CartItem[],
  productById: (id: string) => Product | undefined,
  opts: SummaryOptions,
): CartSummary {
  const active = items.filter((i) => !i.savedForLater);
  const groupsMap = new Map<string, VendorGroup>();

  for (const item of active) {
    const product = productById(item.productId);
    if (!product) continue;
    const price = unitPrice(product, item.qty, item.variantId, opts.member);
    const line: PricedLine = {
      item,
      product,
      unitPrice: price,
      lineTotal: round2(price * item.qty),
      variantLabel: product.variants.find((v) => v.id === item.variantId)?.label,
    };
    const g = groupsMap.get(product.vendorId) ?? {
      vendorId: product.vendorId,
      vendorName: product.brandName,
      lines: [],
      subtotal: 0,
      shipping: 0,
      freeShippingGap: 0,
      estimateDays: [99, 0] as [number, number],
    };
    g.lines.push(line);
    g.subtotal = round2(g.subtotal + line.lineTotal);
    g.estimateDays = [
      Math.min(g.estimateDays[0], product.shipping.estimateDays[0]),
      Math.max(g.estimateDays[1], product.shipping.estimateDays[1]),
    ];
    groupsMap.set(product.vendorId, g);
  }

  const groups = [...groupsMap.values()];
  const method = opts.shippingMethod ?? 'standard';
  for (const g of groups) {
    const threshold = Math.min(...g.lines.map((l) => l.product.shipping.freeThreshold ?? 50));
    const free = g.subtotal >= threshold;
    g.freeShippingGap = free ? 0 : round2(threshold - g.subtotal);
    g.shipping = method === 'expedited' ? EXPEDITED_SHIPPING : free ? 0 : STANDARD_SHIPPING;
    if (method === 'expedited') {
      g.estimateDays = [Math.max(1, g.estimateDays[0] - 2), Math.max(2, g.estimateDays[1] - 3)];
    }
  }

  const subtotal = round2(groups.reduce((s, g) => s + g.subtotal, 0));
  const itemCount = active.reduce((s, i) => s + i.qty, 0);

  let promo: CartSummary['promo'];
  let promoError: string | undefined;
  if (opts.promoCode) {
    const code = opts.promoCode.trim().toUpperCase();
    const def = PROMO_CODES[code];
    if (!def) promoError = 'That code is not valid.';
    else if (def.minSubtotal && subtotal < def.minSubtotal) promoError = `Requires a subtotal of $${def.minSubtotal}.`;
    else {
      const amount = round2(def.type === 'percent' ? (subtotal * def.value) / 100 : Math.min(def.value, subtotal));
      promo = { code, label: def.label, amount };
    }
  }

  const afterPromo = round2(subtotal - (promo?.amount ?? 0));
  const maxByShare = Math.floor(afterPromo * REWARDS.maxRedeemShare * REWARDS.pointsPerDollarValue);
  const maxRedeemablePoints = Math.max(0, Math.min(opts.pointsBalance ?? 0, maxByShare));
  const requested = Math.max(0, Math.floor(opts.pointsToRedeem ?? 0));
  const pointsRedeemed = Math.min(requested, maxRedeemablePoints);
  const pointsDiscount = round2(pointsRedeemed / REWARDS.pointsPerDollarValue);

  const taxable = round2(afterPromo - pointsDiscount);
  const shipping = round2(groups.reduce((s, g) => s + g.shipping, 0));
  const tax = round2(taxable * TAX_RATE);
  const total = round2(taxable + shipping + tax);

  return {
    groups,
    itemCount,
    subtotal,
    promo,
    promoError,
    pointsRedeemed,
    pointsDiscount,
    maxRedeemablePoints,
    shipping,
    tax,
    total,
    pointsEarned: pointsForAmount(taxable),
    earthCoinEligible: taxable >= REWARDS.earthCoinPurchaseMin,
  };
}
