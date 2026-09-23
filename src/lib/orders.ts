import type { Order, Shipment, ShipmentEvent, ShipmentStage } from '@/types';

export const STAGES: { stage: ShipmentStage; label: string }[] = [
  { stage: 'placed', label: 'Placed' },
  { stage: 'vendor_confirmed', label: 'Vendor confirmed' },
  { stage: 'packed', label: 'Packed' },
  { stage: 'shipped', label: 'Shipped' },
  { stage: 'out_for_delivery', label: 'Out for delivery' },
  { stage: 'delivered', label: 'Delivered' },
];

export const stageLabel = (s: ShipmentStage) => STAGES.find((x) => x.stage === s)?.label ?? s;

const NOTES: Record<ShipmentStage, (vendor: string, carrier: string) => string> = {
  placed: () => 'Order received by HarmFree Emporium and sent to the vendor.',
  vendor_confirmed: (v) => `${v} confirmed your items are in stock.`,
  packed: (v) => `${v} packed your order in minimal, recycled-content packaging.`,
  shipped: (_, c) => `Handed to ${c}.`,
  out_for_delivery: (_, c) => `Out for delivery with ${c}.`,
  delivered: () => 'Delivered. Enjoy, and thank you for choosing HarmFree.',
};

const LOCATIONS: Partial<Record<ShipmentStage, string>> = {
  shipped: 'Origin facility',
  out_for_delivery: 'Local delivery station',
  delivered: 'Front door',
};

/** Real-world cadence used for seeded historical orders. */
export const REAL_OFFSETS_MS = [0, 4, 20, 44, 92, 100].map((h) => h * 3600_000);
/** Accelerated cadence for orders placed in the demo, so tracking visibly advances. */
export const DEMO_OFFSETS_MS = [0, 1, 3, 6, 10, 15].map((m) => m * 60_000);

export function buildEvents(placedAt: Date, offsets: number[], vendorName: string, carrier: string): ShipmentEvent[] {
  return STAGES.map(({ stage }, i) => ({
    stage,
    at: new Date(placedAt.getTime() + offsets[i]).toISOString(),
    note: NOTES[stage](vendorName, carrier),
    location: LOCATIONS[stage],
  }));
}

export function reachedEvents(shipment: Shipment, now = Date.now()) {
  return shipment.events.filter((e) => new Date(e.at).getTime() <= now);
}

export function currentStage(shipment: Shipment, now = Date.now()): ShipmentStage {
  const reached = reachedEvents(shipment, now);
  return reached.length ? reached[reached.length - 1].stage : 'placed';
}

export function orderStatus(order: Order, now = Date.now()): { label: string; tone: 'progress' | 'done' | 'partial' } {
  const stages = order.shipments.map((s) => currentStage(s, now));
  if (stages.every((s) => s === 'delivered')) return { label: 'Delivered', tone: 'done' };
  if (stages.some((s) => s === 'delivered')) return { label: 'Partially delivered', tone: 'partial' };
  const furthest = Math.max(...stages.map((s) => STAGES.findIndex((x) => x.stage === s)));
  return { label: STAGES[furthest].label, tone: 'progress' };
}

/** Days left to start a return, or null if not delivered yet. Negative when closed. */
export function returnDaysLeft(shipment: Shipment, now = Date.now()): number | null {
  const delivered = shipment.events.find((e) => e.stage === 'delivered');
  if (!delivered || new Date(delivered.at).getTime() > now) return null;
  const closesAt = new Date(delivered.at).getTime() + shipment.returnWindowDays * 86400_000;
  return Math.ceil((closesAt - now) / 86400_000);
}

export function trackingNumberFor(carrier: string, seed: string) {
  let h = 0;
  for (const ch of seed) h = (h * 31 + ch.charCodeAt(0)) >>> 0;
  const digits = String(h).padStart(10, '0') + String((h * 7) >>> 0).padStart(8, '0');
  if (carrier.startsWith('UPS')) return `1Z${digits.slice(0, 16).toUpperCase()}`;
  if (carrier.startsWith('USPS')) return `9400${digits.slice(0, 18)}`;
  return digits.slice(0, 12);
}
