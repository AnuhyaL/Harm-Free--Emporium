/**
 * Site content: FAQs, policies, the HarmFree Standard, org details.
 * Policy text is a plain-language draft for the demo and must be reviewed by counsel before launch.
 */
import type { FAQ, Policy } from '@/types';

export const ORG = {
  name: 'HarmFree Emporium',
  short: 'HFE',
  tagline: 'HarmFree to Humans, Animals, Plants, and Planets.',
  parent: 'Green2Gold (G2G)',
  parentUrl: 'https://green2gold.org',
  email: 'alan@green2gold.org',
  phone: '(805) 735-7261',
  phoneHref: '+18057357261',
  address: ['5095 Napilihau Street Ste. 109B #383', 'Lahaina, HI 96761'],
  mascot: 'Sol',
  properties: [
    { name: 'Green2Gold', note: '501(c)(3) green-tech incubator', url: 'https://green2gold.org' },
    { name: 'Regeneration Global', note: 'Regenerative projects network' },
    { name: 'Regen Media / Regenerative Media TV', note: 'Stories of regeneration' },
    { name: 'Digital Regeneration World Magazine', note: 'Editorial & features' },
    { name: 'EarthCoin', note: 'Recognition for giving', href: '/earthcoin' },
  ],
};

export const PILLARS = [
  {
    n: 1,
    title: 'Materials & Ingredients',
    summary: 'Full disclosure of what a product is made of, screened against restricted-substance lists.',
    checks: [
      'Complete ingredient or bill-of-materials disclosure to HFE',
      'No PFAS, phthalates, BPA/BPS, formaldehyde donors or heavy-metal pigments',
      'Bio-based, recycled or rapidly renewable inputs preferred',
      'Safety data sheets reviewed for every chemical input',
    ],
  },
  {
    n: 2,
    title: 'Manufacturing Process',
    summary: 'How the product is made matters as much as what it is made of.',
    checks: [
      'Energy and water sources for primary manufacturing disclosed',
      'Wastewater and emissions handling documented',
      'Worker safety program in place at the facility',
      'Continuous-improvement plan for the process footprint',
    ],
  },
  {
    n: 3,
    title: 'Certifications & Lab Validation',
    summary: 'Every claim on an HFE product page is tied to a listed certificate or lab report.',
    checks: [
      'Third-party certifications verified against the issuer registry',
      'Lab results for performance claims (filtration, emissions, efficiency)',
      'Validation reports and endorsements reviewed by the HFE team',
      'Certificate IDs published on the product page',
    ],
  },
  {
    n: 4,
    title: 'Packaging & End-of-Life',
    summary: 'Minimal, recycled-content packaging and a clear plan for when the product is done.',
    checks: [
      'Minimal, recycled-content, plastic-free packaging where possible',
      'Product is reusable, refillable, recyclable, repurposable or compostable',
      'Take-back or refill program where the category allows',
      'Honest disposal instructions on the product page',
    ],
  },
  {
    n: 5,
    title: 'Company Ethics',
    summary: 'The vendor behind the product stands behind it.',
    checks: [
      'Vendor covers shipping, returns, replacements and warranties',
      'Fair labor and transparent supply chain commitments',
      'Signed HFE collaboration agreement and code of conduct',
      'Responsive customer care with a named warranty contact',
    ],
  },
] as const;

export const VALUE_TAG_INFO: Record<string, string> = {
  'Non-Toxic': 'Screened against HFE restricted-substance list.',
  Compostable: 'Breaks down in home or industrial compost.',
  Recyclable: 'Accepted in common recycling streams.',
  Refillable: 'Designed to be refilled rather than replaced.',
  'Plastic-Free': 'No plastic in the product or its packaging.',
  'Bio-Based': 'Made primarily from renewable biological material.',
  Cleantech: 'Replaces fossil fuel use or cuts energy demand.',
  'Minimal Packaging': 'Right-sized, recycled-content packaging.',
  'Made in USA': 'Final assembly in the United States.',
  'Women-Owned': 'Majority women-owned business.',
  'Small-Batch': 'Produced in limited runs by a small maker.',
};

export const REWARDS = {
  pointsPerDollar: 2,
  pointsPerDollarValue: 100, // 100 points = $1
  reviewPoints: 50,
  photoReviewBonus: 100,
  referralGivesDollars: 10,
  referralGetsPoints: 500,
  signupPoints: 200,
  earthCoinDonationMin: 30,
  earthCoinPurchaseMin: 35,
  reviewsPerEarthCoin: 5,
  maxRedeemShare: 0.5,
  tiers: [
    { name: 'Seedling', min: 0 },
    { name: 'Sapling', min: 1500 },
    { name: 'Canopy', min: 5000 },
  ] as const,
};

export const PROMO_CODES: Record<string, { type: 'percent' | 'fixed'; value: number; label: string; minSubtotal?: number }> = {
  HARMFREE10: { type: 'percent', value: 10, label: '10% off your order' },
  EARTHDAY: { type: 'fixed', value: 5, label: '$5 off orders over $25', minSubtotal: 25 },
  WELCOME15: { type: 'percent', value: 15, label: '15% off your first order' },
};

export const TEAM = [
  { name: 'Alan', role: 'Founder, Green2Gold', note: 'Contact for partnerships and vendor collaboration.' },
  { name: 'Vetting Team', role: 'HarmFree Standard review', note: 'Scientists and product specialists who review every application.' },
  { name: 'Customer Care', role: 'Orders & community', note: 'Your first stop for order questions; we route vendor issues for you.' },
  { name: 'Regen Media', role: 'Editorial & storytelling', note: 'Shares vendor stories across the Regen Media family.' },
];

export const faqs: FAQ[] = [
  { group: 'Orders & Shipping', q: 'Who ships my order?', a: 'Each vendor ships its own products directly to you. If your cart includes items from more than one vendor, your order is split into separate shipments, each with its own tracking number.' },
  { group: 'Orders & Shipping', q: 'How much is shipping?', a: 'Shipping is set and covered by each vendor. Standard shipping is free on most vendors’ items once that vendor’s portion of your cart passes $50. Expedited shipping is available at checkout.' },
  { group: 'Orders & Shipping', q: 'How do I track my order?', a: 'Go to Account → Orders and open any order. Each shipment has its own timeline from Placed through Delivered, plus the carrier and tracking number.' },
  { group: 'Returns & Warranty', q: 'Who handles returns?', a: 'Returns go back to the original manufacturer (OEM) or vendor. Start the request from your order page; we forward it to the vendor with everything they need, and the vendor issues your refund, replacement or credit.' },
  { group: 'Returns & Warranty', q: 'Who is responsible for warranties?', a: 'Warranties, replacements and repairs are provided and fulfilled by the vendor. HarmFree Emporium is the storefront and vetting body, not the warrantor, but we will help you reach the right contact.' },
  { group: 'Returns & Warranty', q: 'How long do I have to return something?', a: 'Return windows are set by each vendor and shown on the product page and in your order detail, with a countdown for each shipment.' },
  { group: 'Rewards & EarthCoin', q: 'How do points work?', a: 'You earn 2 points per $1 spent, 50 points per review (plus a 100-point bonus for photo or video reviews), and 500 points for each friend you refer. 100 points equals $1 off at checkout.' },
  { group: 'Rewards & EarthCoin', q: 'What is an EarthCoin?', a: 'EarthCoin is a recognition token from the Green2Gold family. A tax-deductible donation of $30 or more, a purchase of $35 or more, or five published reviews each earn one. In this phase EarthCoins are recorded to your account; no wallet or blockchain connection is required.' },
  { group: 'Rewards & EarthCoin', q: 'Is my donation tax-deductible?', a: 'Donations go to Green2Gold, a 501(c)(3) non-profit, and are tax-deductible to the extent allowed by law. You receive a receipt for your records. (In this demo, no money is collected.)' },
  { group: 'The HarmFree Standard', q: 'How is a product approved?', a: 'Every product is reviewed against the five pillars of the HarmFree Standard: Materials & Ingredients, Manufacturing Process, Certifications & Lab Validation, Packaging & End-of-Life, and Company Ethics. It must pass all five.' },
  { group: 'The HarmFree Standard', q: 'Can a product lose the seal?', a: 'Yes. If a formula changes, a certification lapses or a credible concern is raised, the product is re-reviewed and can be removed.' },
  { group: 'Account', q: 'Do I need an account to shop?', a: 'You can browse and add to cart without one. An account lets you track orders, earn points, keep a wishlist and receive member pricing.' },
];

const UPDATED = '2026-09-01T00:00:00.000Z';

export const policies: Policy[] = [
  {
    slug: 'terms',
    title: 'Terms of Service',
    updated: UPDATED,
    summary: 'The agreement between you and HarmFree Emporium when you use this site.',
    sections: [
      { heading: 'Who we are', body: ['HarmFree Emporium (“HFE”) is an initiative of Green2Gold, a 501(c)(3) non-profit. HFE operates an online marketplace where independent vendors sell products that have passed the HarmFree Standard.'] },
      { heading: 'Marketplace model', body: ['Products are sold and fulfilled by independent vendors. Each vendor is responsible for its products, shipping, returns, replacements and warranties. HFE is the storefront, the vetting body and the community, and is not the seller of record or the warrantor of any product.'] },
      { heading: 'Your account', body: ['You are responsible for keeping your login credentials private and for activity on your account. Tell us promptly if you suspect unauthorized use.'] },
      { heading: 'Rewards and EarthCoin', body: ['Points and EarthCoin entitlements have no cash value, are not transferable, and may be changed or discontinued with notice. EarthCoin entitlements are recorded to your account; HFE does not currently mint tokens or connect to digital wallets.'] },
      { heading: 'Reviews and content', body: ['Reviews must reflect your genuine experience. We may remove content that is false, abusive or promotional.'] },
      { heading: 'Limitation of liability', body: ['To the fullest extent permitted by law, HFE is not liable for product defects, injuries or losses arising from vendor products. Claims about a product should be directed to its vendor; we will help you reach them.'] },
    ],
  },
  {
    slug: 'privacy',
    title: 'Privacy Policy',
    updated: UPDATED,
    summary: 'What we collect, why, and the choices you have.',
    sections: [
      { heading: 'What we collect', body: ['Account details you provide (name, email, addresses), order history, reviews and rewards activity. Payment card details are handled by our payment processor and never stored by HFE.'] },
      { heading: 'Sharing with vendors', body: ['When you order, we share the name, shipping address and order contents with the vendor who fulfills it. Vendors may not use your details for unrelated marketing without your consent.'] },
      { heading: 'Your choices', body: ['You can update your profile, opt out of marketing email, or request deletion of your account at any time from Account settings or by contacting us.'] },
    ],
  },
  {
    slug: 'shipping',
    title: 'Shipping Policy',
    updated: UPDATED,
    summary: 'Vendors ship directly to you and cover shipping costs as listed.',
    sections: [
      { heading: 'Shipped by the vendor', body: ['Every product ships directly from its vendor. Multi-vendor orders arrive in separate packages, each with its own tracking.'] },
      { heading: 'Costs', body: ['Shipping costs are set and covered by vendors. Standard shipping is free per vendor once that vendor’s items in your order reach $50, unless noted on the product page. Expedited shipping is available for a flat fee per vendor.'] },
      { heading: 'Packaging', body: ['Vendors commit to minimal, recycled-content packaging as part of the HarmFree Standard.'] },
    ],
  },
  {
    slug: 'returns',
    title: 'Returns Policy',
    updated: UPDATED,
    summary: 'Returns route to the original manufacturer or vendor, who covers credits and replacements.',
    sections: [
      { heading: 'Returns go to the OEM / vendor', body: ['Returns are processed by the vendor who sold the item. Start a return from your order in your account; HFE forwards the request to the vendor with your order details and a return authorization (RMA) number.'] },
      { heading: 'Return windows', body: ['Each vendor sets its return window, shown on the product page and in your order detail.'] },
      { heading: 'Refunds, credits and replacements', body: ['The vendor decides the resolution under its published policy: refund to the original payment method, store credit, replacement, or warranty repair. Return shipping for defective items is covered by the vendor.'] },
      { heading: 'Points on returns', body: ['Points earned on returned items are reversed once the vendor confirms the return.'] },
    ],
  },
  {
    slug: 'warranty',
    title: 'Warranty Policy',
    updated: UPDATED,
    summary: 'Warranties are provided and fulfilled by vendors. HFE helps you reach them.',
    sections: [
      { heading: 'Vendor warranties', body: ['Each product page lists the warranty duration and terms offered by its vendor. The vendor is the warrantor; HFE is not liable for warranty obligations.'] },
      { heading: 'Making a claim', body: ['Start a return with the resolution “Warranty repair” from your order page, or contact the vendor’s warranty address listed on its storefront. Customer Care can help if you get stuck.'] },
    ],
  },
];

export const policyBySlug = (slug: string) => policies.find((p) => p.slug === slug);
