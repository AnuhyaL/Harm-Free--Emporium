import { vendorById } from '@/data/vendors';
import { buildEvents, trackingNumberFor } from '@/lib/orders';
import type { CartSummary } from '@/lib/pricing';
import type { Order, OrderAddress, ShippingMethodId } from '@/types';

interface Params {
  id: string;
  number: string;
  userId?: string;
  email: string;
  placedAt: Date;
  address: OrderAddress;
  summary: CartSummary;
  method: ShippingMethodId;
  payment: Order['payment'];
  offsets: number[];
}

/** Turns a priced cart into an order split into one shipment per vendor. */
export function orderFromSummary(p: Params): Order {
  const shipments = p.summary.groups.map((g, i) => {
    const vendor = vendorById(g.vendorId);
    const carrier = vendor?.carrier ?? 'UPS Ground';
    return {
      id: `${p.id}-s${i + 1}`,
      vendorId: g.vendorId,
      vendorName: g.vendorName,
      carrier,
      trackingNumber: trackingNumberFor(carrier, `${p.id}-${g.vendorId}`),
      method: p.method,
      shippingCost: g.shipping,
      lines: g.lines.map((l) => ({
        productId: l.product.id,
        variantId: l.item.variantId,
        name: l.product.name,
        variantLabel: l.variantLabel,
        qty: l.item.qty,
        unitPrice: l.unitPrice,
        lineTotal: l.lineTotal,
      })),
      events: buildEvents(p.placedAt, p.offsets, g.vendorName, carrier),
      returnWindowDays: Number(vendor?.returnPolicy.match(/(\d+)-day/)?.[1] ?? 30),
    };
  });

  return {
    id: p.id,
    number: p.number,
    userId: p.userId,
    email: p.email,
    placedAt: p.placedAt.toISOString(),
    shippingAddress: p.address,
    shipments,
    totals: {
      subtotal: p.summary.subtotal,
      discount: p.summary.promo?.amount ?? 0,
      promoCode: p.summary.promo?.code,
      pointsRedeemed: p.summary.pointsRedeemed,
      pointsDiscount: p.summary.pointsDiscount,
      shipping: p.summary.shipping,
      tax: p.summary.tax,
      total: p.summary.total,
    },
    payment: p.payment,
    pointsEarned: p.summary.pointsEarned,
    earthCoinEarned: p.summary.earthCoinEligible,
  };
}
