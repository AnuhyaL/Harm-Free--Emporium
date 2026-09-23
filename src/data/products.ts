/**
 * SAMPLE DATA — invented products for demonstration only.
 * Product names, prices, certification IDs, patents and specs are placeholders.
 * Certification program names are shown to demonstrate the layout; no real certification is claimed.
 */
import type { Certification, Product, ValueTag } from '@/types';
import { categoryByName } from './categories';
import { vendorById } from './vendors';
import { withPhotos } from './productPhotos';

const CERT = {
  fsc: ['FSC Certified', 'Forest Stewardship Council'],
  ul2743: ['UL 2743 Listed', 'UL Solutions'],
  ul1703: ['UL 61730 Listed', 'UL Solutions'],
  iec: ['IEC 62133 Battery Safety', 'Accredited test lab'],
  nsf53: ['NSF/ANSI 53', 'NSF International'],
  nsf42: ['NSF/ANSI 42', 'NSF International'],
  nsf401: ['NSF/ANSI 401', 'NSF International'],
  omri: ['OMRI Listed', 'Organic Materials Review Institute'],
  safer: ['Safer Choice', 'U.S. EPA'],
  bunny: ['Leaping Bunny', 'Cruelty Free International'],
  usda: ['USDA Organic', 'USDA National Organic Program'],
  roc: ['Regenerative Organic Certified', 'Regenerative Organic Alliance'],
  bpi: ['BPI Certified Compostable', 'Biodegradable Products Institute'],
  energystar: ['ENERGY STAR Certified', 'U.S. EPA / DOE'],
  greenguard: ['GREENGUARD Gold', 'UL Solutions'],
  pfas: ['PFAS-Free Verified', 'Independent third-party lab'],
  c2c: ['Cradle to Cradle Certified Silver', 'Cradle to Cradle Products Innovation Institute'],
  watersense: ['WaterSense Labeled', 'U.S. EPA'],
  fda: ['FDA Food-Contact Compliant', 'Accredited test lab'],
  carb: ['CARB Ultra-Low NOx', 'California Air Resources Board'],
  ahri: ['AHRI Certified', 'Air-Conditioning, Heating & Refrigeration Institute'],
  aham: ['AHAM Verified', 'Association of Home Appliance Manufacturers'],
  ecocert: ['COSMOS Organic', 'Ecocert'],
  nongmo: ['Non-GMO Project Verified', 'Non-GMO Project'],
  gots: ['GOTS Organic', 'Global Organic Textile Standard'],
  bcorp: ['Certified B Corporation', 'B Lab'],
  hempcrete: ['ASTM E84 Class A', 'Accredited fire test lab'],
  ul2272: ['UL 2849 E-Bike System', 'UL Solutions'],
  fcc: ['FCC Part 15', 'Accredited test lab'],
} as const;
type CertKey = keyof typeof CERT;

interface Spec {
  slug: string;
  name: string;
  vendor: string;
  cat: string;
  sub: string;
  price: number;
  msrp: number;
  tags: ValueTag[];
  certs: CertKey[];
  tagline: string;
  desc: string;
  features: string[];
  special: string[];
  usage: string;
  dims: string;
  warranty: number;
  days: [number, number];
  sold: number;
  age: number;
  stock?: number;
  variants?: [string, number][];
  bulk?: boolean;
  refillable?: boolean;
  patents?: string[];
  trademarks?: string[];
  discount?: number;
  freeOver?: number;
}

const SPECS: Spec[] = [
  // ——— Home & Kitchen ———
  {
    slug: 'sunfold-solar-cooker', name: 'SunFold Solar Cooker', vendor: 'v-helio', cat: 'Clean energy cookware', sub: 'Solar ovens',
    price: 149, msrp: 179, tags: ['Cleantech', 'Plastic-Free', 'Made in USA'], certs: ['fda', 'pfas'],
    tagline: 'Bake, simmer and pasteurize with nothing but sunlight.',
    desc: 'A fold-flat reflector oven that reaches 300°F on a clear day. Anodized aluminum panels and a borosilicate window, no coatings, no fuel.',
    features: ['Reaches 250–300°F in full sun', 'Folds to 2 in. flat with carry strap', 'Includes enamel-free steel pot with glass lid', 'Built-in sun-tracking sight'],
    special: ['No fuel, no smoke, no indoor air pollution', 'Replaceable reflector panels instead of a full replacement'],
    usage: 'Set out at 10 a.m. with rice, lentils and water; lunch is ready by 12:30 with no stove running.',
    dims: '24 × 24 × 2 in. folded · 9 lb', warranty: 36, days: [4, 7], sold: 612, age: 120, patents: ['US 11,2XX,XXX'], trademarks: ['SunFold™'],
  },
  {
    slug: 'induction-ready-cast-iron-skillet', name: 'Induction-Ready Cast Iron Skillet', vendor: 'v-terra', cat: 'Clean energy cookware', sub: 'Skillets',
    price: 64, msrp: 78, tags: ['Non-Toxic', 'Plastic-Free', 'Made in USA'], certs: ['pfas', 'fda'],
    tagline: 'Seasoned with flaxseed oil. Zero PTFE, zero PFAS, a hundred years of use.',
    desc: 'A smooth-milled cast iron skillet built for induction cooktops, which use far less energy than gas. Pre-seasoned with organic flax oil.',
    features: ['Machined smooth cooking surface', 'Works on induction, electric, gas and campfire', 'Pour spouts on both sides', 'Helper handle for safe lifting'],
    special: ['No synthetic non-stick coating to wear off', 'Made from 90% recycled iron'],
    usage: 'Sear, roast and bake cornbread in the same pan; re-season with a thin wipe of oil after washing.',
    dims: '10.25 in. diameter · 5.2 lb', warranty: 1200, days: [3, 6], sold: 1480, age: 400,
    variants: [['10.25 in.', 0], ['12 in.', 18]],
  },
  {
    slug: 'swedish-cellulose-sponge-cloths', name: 'Swedish Cellulose Sponge Cloths, 10-Pack', vendor: 'v-kinfolk', cat: 'Durable and non-toxic cleaning cloths', sub: 'Sponge cloths',
    price: 19, msrp: 24, tags: ['Compostable', 'Plastic-Free', 'Non-Toxic'], certs: ['bpi', 'fsc'],
    tagline: 'Each cloth replaces up to 17 rolls of paper towels.',
    desc: 'Cellulose and cotton cloths that absorb 20× their weight, dry fast, and go in the compost when worn out.',
    features: ['Absorbs up to 20× its weight', 'Dishwasher and washing-machine safe', 'Dries quickly to resist odors', 'Printed with water-based inks'],
    special: ['Home compostable at end of life', 'Shipped in a paper sleeve, no plastic'],
    usage: 'Wipe counters, dry dishes and clean spills; toss in the top rack of the dishwasher to refresh.',
    dims: '7.75 × 6.75 in. each', warranty: 0, days: [3, 5], sold: 3920, age: 300, bulk: true,
    variants: [['Botanical print', 0], ['Solid sage', 0]],
  },
  {
    slug: 'organic-cotton-unpaper-towels', name: 'Organic Cotton Unpaper Towels, 12-Roll', vendor: 'v-terra', cat: 'Durable and non-toxic cleaning cloths', sub: 'Reusable towels',
    price: 34, msrp: 42, tags: ['Plastic-Free', 'Compostable', 'Women-Owned'], certs: ['gots'],
    tagline: 'Snap-together towels that roll onto your existing holder.',
    desc: 'Twelve GOTS organic cotton birdseye towels with plant-based snaps, washable hundreds of times.',
    features: ['Snaps into a roll for your holder', 'Birdseye weave for absorbency', 'Softens with every wash', 'Unbleached, undyed option'],
    special: ['Replaces paper towels for years', 'Cotton sourced from a single organic cooperative'],
    usage: 'Keep a roll by the sink and a lidded basket for used towels; wash weekly with regular laundry.',
    dims: '10 × 11 in. each', warranty: 12, days: [4, 7], sold: 980, age: 210,
  },
  {
    slug: 'all-purpose-cleaner-refill-tablets', name: 'All-Purpose Cleaner Refill Tablets, 6-Pack', vendor: 'v-kinfolk', cat: 'Non-toxic and biodegradable cleaner', sub: 'Refills',
    price: 14, msrp: 18, tags: ['Refillable', 'Non-Toxic', 'Plastic-Free', 'Minimal Packaging'], certs: ['safer', 'bunny'],
    tagline: 'Drop, dissolve, done. Six bottles of cleaner in an envelope.',
    desc: 'Plant-derived surfactant tablets that dissolve in tap water to make 16 oz of all-purpose cleaner each. Fragrance-free or lightly scented with essential oils.',
    features: ['Makes 6 × 16 oz bottles', 'Readily biodegradable surfactants', 'Safe on sealed stone, wood and stainless', 'Every ingredient listed with its purpose'],
    special: ['Ships 95% less water weight than ready-to-use cleaner', 'Compostable paper packaging'],
    usage: 'Fill your forever bottle with warm water, drop in a tablet, and wait 15 minutes.',
    dims: 'Envelope 5 × 7 in.', warranty: 0, days: [3, 5], sold: 5210, age: 180, bulk: true, refillable: true,
    variants: [['Fragrance-free', 0], ['Lemongrass', 0], ['Lavender & mint', 0]],
  },
  {
    slug: 'forever-glass-spray-bottle-kit', name: 'Forever Glass Spray Bottle Starter Kit', vendor: 'v-kinfolk', cat: 'Non-toxic and biodegradable cleaner', sub: 'Starter kits',
    price: 36, msrp: 44, tags: ['Refillable', 'Non-Toxic', 'Recyclable'], certs: ['safer', 'bunny'],
    tagline: 'Three glass bottles, three tablets, silicone sleeves. Your last spray bottles.',
    desc: 'Tempered glass bottles with industrial-grade triggers rated for 50,000 sprays, plus one tablet each for kitchen, glass and bathroom.',
    features: ['Three 16 oz tempered glass bottles', 'Silicone sleeves for grip and drop protection', 'Includes kitchen, glass and bathroom tablets', 'Replacement triggers available'],
    special: ['Bottles are infinitely recyclable', 'Trigger take-back program'],
    usage: 'Label each bottle, refill with tablets as they run out; replace only the trigger if it wears.',
    dims: '9 in. tall per bottle', warranty: 24, days: [3, 5], sold: 2740, age: 260, refillable: true,
  },
  {
    slug: 'palm-leaf-plates-50', name: 'Fallen Palm Leaf Plates, 50-Pack', vendor: 'v-loop', cat: 'Recyclable and compostable dishware', sub: 'Plates',
    price: 29, msrp: 35, tags: ['Compostable', 'Bio-Based', 'Plastic-Free'], certs: ['bpi'],
    tagline: 'Made from naturally shed areca leaves, pressed with heat and water only.',
    desc: 'Sturdy party plates that handle hot and saucy food, then break down in a home compost in about 60 days.',
    features: ['10 in. round, 1 in. deep', 'Oven safe to 350°F for 45 min', 'No glues, waxes or coatings', 'Each plate has unique grain'],
    special: ['Leaves are collected after falling; no trees are cut', 'Home compostable in ~60 days'],
    usage: 'Use at picnics, then compost with food scraps instead of bagging for the landfill.',
    dims: '10 in. diameter', warranty: 0, days: [4, 6], sold: 1890, age: 90, bulk: true,
    variants: [['10 in. round', 0], ['8 in. square', -4]],
  },
  {
    slug: 'bamboo-dish-brush-set', name: 'Bamboo Dish Brush Set', vendor: 'v-terra', cat: 'Sustainable kitchenware', sub: 'Brushes',
    price: 22, msrp: 26, tags: ['Plastic-Free', 'Compostable', 'Women-Owned'], certs: ['fsc'],
    tagline: 'Replaceable sisal heads on a bamboo handle you keep for years.',
    desc: 'A long-handled dish brush, a pot scrubber and a bottle brush, all FSC bamboo and plant fiber.',
    features: ['Replaceable brush head', 'Stiff sisal for pots, soft tampico for glass', 'Hanging loop on each handle', 'No plastic, no metal staples in heads'],
    special: ['Heads compost when worn', 'Refill heads sold in 3-packs'],
    usage: 'Swap the head every 8–10 weeks; the old one goes straight into compost.',
    dims: 'Handle 10.5 in.', warranty: 6, days: [3, 6], sold: 2360, age: 340, bulk: true,
  },
  {
    slug: 'organic-beeswax-food-wraps', name: 'Organic Beeswax Food Wraps, 3-Pack', vendor: 'v-terra', cat: 'Sustainable kitchenware', sub: 'Food storage',
    price: 18, msrp: 22, tags: ['Compostable', 'Plastic-Free', 'Small-Batch'], certs: ['gots'],
    tagline: 'Warm with your hands, fold, and it holds. No cling film.',
    desc: 'GOTS cotton coated with beeswax, tree resin and jojoba oil. Lasts about a year of regular use.',
    features: ['Small, medium and large sizes', 'Rinse in cool water with mild soap', 'Refresh with a warm oven', 'Naturally antibacterial'],
    special: ['Compostable at end of life', 'Beeswax from bee-friendly apiaries'],
    usage: 'Wrap half an avocado, cover a bowl, or fold into a snack pouch.',
    dims: 'S 7×8 in. · M 10×11 in. · L 13×14 in.', warranty: 0, days: [3, 5], sold: 3310, age: 150, bulk: true,
  },
  {
    slug: 'stainless-bento-stack', name: 'Stainless Steel Bento Stack', vendor: 'v-terra', cat: 'Sustainable and eco-friendly container', sub: 'Lunch boxes',
    price: 38, msrp: 45, tags: ['Plastic-Free', 'Non-Toxic', 'Recyclable'], certs: ['fda', 'pfas'],
    tagline: 'Two tiers of 18/8 steel with a leak-resistant silicone seal.',
    desc: 'A two-tier lunch container with a divider, stainless latches and a replaceable food-grade silicone gasket.',
    features: ['Two 20 oz tiers + divider', 'Leak-resistant platinum silicone seal', 'Dishwasher safe', 'Replacement seals available'],
    special: ['Fully recyclable steel body', 'No plastic touches your food'],
    usage: 'Pack rice below and vegetables above; the divider keeps sauces apart.',
    dims: '7 × 5 × 4.5 in.', warranty: 60, days: [3, 6], sold: 1420, age: 70,
  },
  {
    slug: 'glass-pantry-jars-bamboo-lids', name: 'Glass Pantry Jars with Bamboo Lids, Set of 6', vendor: 'v-loop', cat: 'Sustainable and eco-friendly container', sub: 'Pantry storage',
    price: 48, msrp: 58, tags: ['Plastic-Free', 'Recyclable', 'Refillable'], certs: ['fsc', 'fda'],
    tagline: 'Bulk-bin ready jars with airtight FSC bamboo lids.',
    desc: 'Borosilicate jars in three sizes, made to take to the bulk store and refill for decades.',
    features: ['Two each: 17, 34 and 51 oz', 'Airtight natural rubber seal', 'Tare weight etched on the base', 'Borosilicate glass resists thermal shock'],
    special: ['Tare weight marked for bulk refill stores', 'Lids compostable, glass recyclable'],
    usage: 'Bring the jars to a refill shop, weigh in, fill up, and skip every bag.',
    dims: 'Tallest 8.5 in.', warranty: 12, days: [4, 7], sold: 1150, age: 220, refillable: true,
  },
  {
    slug: 'tree-free-bamboo-toilet-paper', name: 'Tree-Free Bamboo Toilet Paper, 24 Rolls', vendor: 'v-loop', cat: 'Sustainable and zero-waste paper product', sub: 'Bath tissue',
    price: 39, msrp: 46, tags: ['Plastic-Free', 'Compostable', 'Minimal Packaging'], certs: ['fsc'],
    tagline: 'Three-ply, septic safe, wrapped in paper instead of plastic.',
    desc: 'Made from fast-growing FSC bamboo, unbleached with chlorine. Each roll has 360 sheets.',
    features: ['3-ply, 360 sheets per roll', 'Septic and RV safe', 'No chlorine bleaching, no added fragrance', 'Individually paper-wrapped'],
    special: ['Bamboo regrows in months, not decades', 'Shipped plastic-free'],
    usage: 'Subscribe-and-forget friendly; one box lasts a family of four about six weeks.',
    dims: 'Box 17 × 13 × 9 in.', warranty: 0, days: [3, 6], sold: 4700, age: 380, bulk: true,
  },
  {
    slug: 'compostable-mailers-100', name: 'Compostable Poly-Free Mailers, 100-Pack', vendor: 'v-loop', cat: 'Biodegradable and recyclable packaging', sub: 'Mailers',
    price: 42, msrp: 52, tags: ['Compostable', 'Bio-Based', 'Minimal Packaging'], certs: ['bpi'],
    tagline: 'Plant-based film mailers that behave like poly and break down like a banana peel.',
    desc: 'Made from PBAT and corn starch with a double adhesive strip, so customers can reuse them for returns.',
    features: ['Double peel-and-seal strip for returns', 'Tear- and water-resistant', 'Printable with water-based inks', 'Home compostable in ~180 days'],
    special: ['Designed for small shops shipping plastic-free', 'Bulk tiers for businesses'],
    usage: 'Ship apparel and soft goods; the second strip lets your customer send returns in the same mailer.',
    dims: '10 × 13 in.', warranty: 0, days: [4, 7], sold: 860, age: 60, bulk: true,
    variants: [['10 × 13 in.', 0], ['14.5 × 19 in.', 12]],
  },
  {
    slug: 'honeycomb-paper-wrap', name: 'Honeycomb Paper Cushion Wrap, 250 ft', vendor: 'v-loop', cat: 'Biodegradable and recyclable packaging', sub: 'Void fill',
    price: 34, msrp: 40, tags: ['Recyclable', 'Compostable', 'Plastic-Free'], certs: ['fsc'],
    tagline: 'Expanding kraft paper that replaces bubble wrap.',
    desc: 'Die-cut kraft paper stretches into a 3D honeycomb that locks around fragile items.',
    features: ['250 ft roll with dispenser box', 'Expands to 1.6× length', 'Tissue interleaf included', 'Curbside recyclable'],
    special: ['Replaces bubble wrap and foam peanuts', 'Unbleached FSC kraft'],
    usage: 'Pull, stretch and wrap ceramics; the cells interlock without tape.',
    dims: '15 in. wide roll', warranty: 0, days: [4, 7], sold: 540, age: 45,
  },

  // ——— Energy & Climate ———
  {
    slug: 'helio-1500-power-station', name: 'Helio 1500 Portable Power Station', vendor: 'v-helio', cat: 'Clean energy generator (solar & wind)', sub: 'Power stations',
    price: 1199, msrp: 1399, tags: ['Cleantech', 'Recyclable', 'Made in USA'], certs: ['ul2743', 'iec'],
    tagline: '1,536 Wh of silent, fume-free backup. Swap cells, not the whole unit.',
    desc: 'A LiFePO4 power station with 1,800 W output, 6 AC outlets and solar input up to 800 W. Cells are modular and user-replaceable.',
    features: ['1,536 Wh LiFePO4, 3,500+ cycles', '1,800 W continuous / 3,600 W surge', '800 W solar input, 0–80% in 2 hrs', 'App monitoring over Bluetooth'],
    special: ['User-replaceable battery modules', 'Vendor take-back and refurbishment program'],
    usage: 'Ran a refrigerator, CPAP and router for 14 hours during a grid outage, recharged the next afternoon from two panels.',
    dims: '15.6 × 10.2 × 11.8 in. · 37 lb', warranty: 60, days: [3, 5], sold: 420, age: 30, stock: 18,
    patents: ['US 11,4XX,XXX', 'US D98X,XXX'], trademarks: ['Helio™'], freeOver: 0,
  },
  {
    slug: 'breeze-400-micro-wind-turbine', name: 'Breeze 400 Micro Wind Turbine', vendor: 'v-helio', cat: 'Clean energy generator (solar & wind)', sub: 'Wind',
    price: 689, msrp: 780, tags: ['Cleantech', 'Recyclable'], certs: ['iec', 'fcc'],
    tagline: 'A vertical-axis turbine quiet enough for a backyard.',
    desc: 'A 400 W vertical-axis turbine that starts in 5 mph winds and pairs with the Helio line or any 24 V battery bank.',
    features: ['400 W rated, 5 mph start-up', 'Vertical axis: works in gusty, shifting wind', 'Under 40 dB at 20 ft', 'Aluminum blades, no fiberglass'],
    special: ['Bird-visible blade pattern', 'All-metal construction recyclable at end of life'],
    usage: 'Pairs with solar for 24-hour generation on a coastal cabin roof.',
    dims: '48 in. tall · 42 lb', warranty: 36, days: [6, 10], sold: 88, age: 20, stock: 7, patents: ['US 10,9XX,XXX'],
  },
  {
    slug: 'foldable-200w-solar-panel', name: 'Foldable 200 W Solar Panel', vendor: 'v-helio', cat: 'Clean energy generator (solar & wind)', sub: 'Panels',
    price: 399, msrp: 469, tags: ['Cleantech', 'Recyclable'], certs: ['ul1703'],
    tagline: 'Monocrystalline cells in a canvas case with a built-in kickstand.',
    desc: 'A portable 200 W panel with 23% efficient cells, IP67 junction box and universal MC4 output.',
    features: ['200 W, 23% cell efficiency', 'IP67 water resistance', 'Integrated kickstand with angle guide', 'MC4 and Anderson outputs'],
    special: ['Glass-free design for lighter recycling', 'Recycled canvas case'],
    usage: 'Two panels fully recharge the Helio 1500 between 9 a.m. and 2 p.m. in summer.',
    dims: '23 × 20 × 1 in. folded · 16 lb', warranty: 60, days: [3, 5], sold: 530, age: 110,
  },
  {
    slug: 'bioethanol-cooking-fuel', name: 'Renewable Bioethanol Cooking Fuel, 6 Cans', vendor: 'v-ridgeline', cat: 'Clean energy fuel', sub: 'Cooking fuel',
    price: 32, msrp: 38, tags: ['Bio-Based', 'Recyclable', 'Non-Toxic'], certs: ['pfas'],
    tagline: 'Clean-burning sugarcane ethanol gel for camp stoves and chafers.',
    desc: 'Each steel can burns for 2.5 hours with no soot and no petroleum smell. Safe for indoor chafing.',
    features: ['2.5-hour burn per can', 'Soot-free, low-odor flame', 'Resealable twist cap', 'Steel cans recyclable curbside'],
    special: ['Made from sugarcane waste streams', 'No methanol or diethylene glycol'],
    usage: 'Pack in emergency kits or use for buffet chafing without propane.',
    dims: '3.5 in. can', warranty: 0, days: [4, 7], sold: 770, age: 130, bulk: true,
  },
  {
    slug: 'usb-c-rechargeable-aa-8', name: 'USB-C Rechargeable AA Batteries, 8-Pack', vendor: 'v-helio', cat: 'Sustainable battery', sub: 'Household cells',
    price: 29, msrp: 35, tags: ['Cleantech', 'Recyclable', 'Minimal Packaging'], certs: ['iec'],
    tagline: 'Charge straight from a USB-C cable. 1,000 cycles each.',
    desc: 'Low self-discharge NiMH cells with integrated USB-C ports and a 4-way charging cable.',
    features: ['2,600 mWh per cell', '1,000 recharge cycles', 'Holds 80% charge after a year', 'LED charge indicator on each cell'],
    special: ['Replaces roughly 1,000 single-use batteries', 'Prepaid recycling mailer included'],
    usage: 'Keep four in the TV remotes and four on the charger; swap monthly.',
    dims: 'Standard AA', warranty: 24, days: [3, 5], sold: 2980, age: 240, variants: [['AA', 0], ['AAA', -3]],
  },
  {
    slug: 'solar-lantern-phone-charger', name: 'Solar Lantern & Phone Charger', vendor: 'v-ridgeline', cat: 'Sustainable solar energy light', sub: 'Lanterns',
    price: 44, msrp: 54, tags: ['Cleantech', 'Small-Batch'], certs: ['iec', 'pfas'],
    tagline: 'Collapses flat, charges in the sun, charges your phone back.',
    desc: 'A 150-lumen collapsible lantern with a 2,000 mAh battery and USB-C output.',
    features: ['150 lumens, 4 brightness modes', 'Up to 50 hours on low', 'USB-C in and out', 'Waterproof to IP67'],
    special: ['Solar and USB charging', 'PFAS-free diffuser'],
    usage: 'Hang in the tent, or keep one per bedroom for outages.',
    dims: '4.5 in. diameter, 1 in. collapsed', warranty: 24, days: [3, 6], sold: 1640, age: 160,
  },
  {
    slug: 'solar-path-lights-6', name: 'Warm-White Solar Path Lights, Set of 6', vendor: 'v-helio', cat: 'Sustainable solar energy light', sub: 'Outdoor lighting',
    price: 69, msrp: 84, tags: ['Cleantech', 'Recyclable'], certs: ['iec'],
    tagline: 'Aluminum and glass path lights with replaceable batteries.',
    desc: 'Warm 2,700 K path lights that avoid blue glare for night-active wildlife. Batteries swap out with a coin.',
    features: ['2,700 K warm white, wildlife-friendly', 'Dusk-to-dawn auto sensor', 'Replaceable 18650 cell', 'Die-cast aluminum housing'],
    special: ['Dark-sky friendly downward light', 'Batteries replaceable, not glued'],
    usage: 'Stake along a garden path; they run 10+ hours after a sunny day.',
    dims: '16 in. tall', warranty: 24, days: [4, 7], sold: 910, age: 75,
    variants: [['Bronze', 0], ['Matte black', 0]],
  },
  {
    slug: 'cold-climate-ducted-heat-pump', name: 'Cold-Climate Ducted Heat Pump, 3-Ton', vendor: 'v-northwind', cat: 'Heat pumps (ducted)', sub: 'Whole-home',
    price: 7890, msrp: 8900, tags: ['Cleantech', 'Made in USA'], certs: ['energystar', 'ahri'],
    tagline: 'Full heating capacity down to 5°F. Includes a free Manual J load calculation.',
    desc: 'A variable-speed inverter heat pump using low-GWP R-454B refrigerant, sized by a licensed Northwind installer.',
    features: ['100% capacity at 5°F, operates to -15°F', 'Up to 20 SEER2 / 10 HSPF2', 'Low-GWP R-454B refrigerant', 'Installer-provided Manual J sizing'],
    special: ['Replaces a gas furnace and AC in one system', 'Eligible for federal and utility incentives (verify locally)'],
    usage: 'A 1,900 sq ft home in Vermont cut heating fuel use to zero through winter.',
    dims: 'Outdoor unit 37 × 37 × 14 in.', warranty: 120, days: [10, 21], sold: 64, age: 200, stock: 12,
    variants: [['2-ton', -1200], ['3-ton', 0], ['4-ton', 1450]],
  },
  {
    slug: 'geo-4-ton-geothermal-heat-pump', name: 'Geo 4-Ton Geothermal Heat Pump', vendor: 'v-northwind', cat: 'Geothermal heat pumps', sub: 'Ground-source',
    price: 14500, msrp: 16200, tags: ['Cleantech', 'Made in USA'], certs: ['energystar', 'ahri'],
    tagline: 'Ground-source heating and cooling at up to 5 COP.',
    desc: 'A variable-capacity geothermal unit with desuperheater for hot water. Loop design and drilling arranged by the vendor.',
    features: ['Up to 5.0 COP heating', 'Integrated desuperheater for domestic hot water', 'Variable-speed compressor and blower', 'Quiet indoor-only equipment'],
    special: ['No outdoor unit, no combustion', 'Loop field lasts 50+ years'],
    usage: 'Paired with a vertical loop, heats and cools a 2,800 sq ft home year-round.',
    dims: '26 × 31 × 52 in. · 390 lb', warranty: 120, days: [14, 30], sold: 19, age: 330, stock: 5,
  },
  {
    slug: 'condensing-tankless-water-heater', name: 'Ultra-Low NOx Condensing Tankless Water Heater', vendor: 'v-northwind', cat: 'Gas water heaters', sub: 'Tankless',
    price: 1649, msrp: 1890, tags: ['Cleantech'], certs: ['energystar', 'carb'],
    tagline: 'For homes not yet ready to go all-electric: 0.96 UEF and ultra-low NOx.',
    desc: 'A transition option for gas-served homes that heats on demand, cutting standby loss and nitrogen-oxide emissions.',
    features: ['0.96 UEF condensing efficiency', 'Ultra-low NOx burner (≤14 ng/J)', 'Up to 9.8 GPM', 'Wi-Fi leak and usage monitoring'],
    special: ['Noted as a transition product under the HarmFree Standard', 'Installer take-back of old tank'],
    usage: 'Replaces a 50-gallon tank heater in a closet half the size.',
    dims: '27 × 18 × 10 in.', warranty: 144, days: [7, 14], sold: 77, age: 160, stock: 9,
  },
  {
    slug: 'quiet-35-pint-dehumidifier', name: 'Quiet 35-Pint Dehumidifier', vendor: 'v-northwind', cat: 'Energy-efficient air dehumidifier', sub: 'Portable',
    price: 259, msrp: 299, tags: ['Cleantech'], certs: ['energystar', 'aham'],
    tagline: 'ENERGY STAR efficiency with a low-GWP refrigerant.',
    desc: 'A 35-pint dehumidifier using R-32, with continuous-drain hose and auto-restart after outages.',
    features: ['35 pints/day at AHAM conditions', 'R-32 low-GWP refrigerant', 'Continuous drain or 1.6 gal bucket', '44 dB on low'],
    special: ['2.0 L/kWh energy factor', 'Washable pre-filter, no replacement filters'],
    usage: 'Keeps a finished basement at 45% humidity through summer.',
    dims: '14 × 11 × 22 in.', warranty: 24, days: [3, 6], sold: 690, age: 80,
  },
  {
    slug: 'hepa-air-purifier-washable', name: 'True HEPA Air Purifier, Washable Pre-Filter', vendor: 'v-northwind', cat: 'Sustainable air purifier', sub: 'Room purifiers',
    price: 219, msrp: 259, tags: ['Cleantech', 'Non-Toxic'], certs: ['energystar', 'aham'],
    tagline: 'No ozone, no ionizer, a filter frame you keep.',
    desc: 'H13 HEPA and activated carbon media in a reusable frame, so only the media is replaced.',
    features: ['CADR 250 for rooms up to 400 sq ft', 'H13 HEPA + 1 lb activated carbon', 'Zero ozone output', '24 dB sleep mode'],
    special: ['Reusable filter frame: media-only refills', 'Particle sensor with honest readout'],
    usage: 'Runs in a bedroom during wildfire season; media swapped every 9 months.',
    dims: '12 × 12 × 22 in.', warranty: 36, days: [3, 5], sold: 1120, age: 50, refillable: true,
  },

  // ——— Yard & Garden ———
  {
    slug: 'cordless-21-inch-electric-mower', name: '21" Cordless Electric Mower', vendor: 'v-rootline', cat: 'Electric lawn mowers', sub: 'Push mowers',
    price: 549, msrp: 629, tags: ['Cleantech'], certs: ['iec'],
    tagline: 'A full half-acre on one charge, and your neighbors will not notice.',
    desc: 'A 56 V brushless mower with a steel deck, mulching, bagging and side discharge, plus a 7.5 Ah battery.',
    features: ['Up to 60 min runtime', '3-in-1 mulch, bag, side discharge', 'Folds upright for storage', 'Brushless motor, no oil or gas'],
    special: ['Zero tailpipe emissions', 'Shares battery platform with trimmer and blower'],
    usage: 'Mulches clippings back into the lawn to skip synthetic fertilizer.',
    dims: 'Cutting width 21 in. · 64 lb', warranty: 60, days: [5, 9], sold: 380, age: 140,
  },
  {
    slug: 'cordless-leaf-blower-56v', name: '56 V Cordless Leaf Blower', vendor: 'v-rootline', cat: 'Electric leaf blowers', sub: 'Handheld',
    price: 229, msrp: 269, tags: ['Cleantech'], certs: ['iec'],
    tagline: '650 CFM at 64 dB. Gas-level push without the two-stroke fumes.',
    desc: 'A handheld brushless blower with variable speed and turbo, on the shared 56 V platform.',
    features: ['650 CFM / 200 MPH', '64 dB at operator ear', 'Variable speed trigger + turbo', 'Weighs 6.6 lb with battery'],
    special: ['No two-stroke exhaust', 'Works in noise-restricted neighborhoods'],
    usage: 'Clears a driveway of wet leaves in under 10 minutes.',
    dims: '36 in. long', warranty: 60, days: [4, 7], sold: 510, age: 190,
  },
  {
    slug: 'cordless-trimmer-edger-2in1', name: '2-in-1 Cordless String Trimmer & Edger', vendor: 'v-rootline', cat: 'Electric string trimmers & edgers', sub: 'Trimmers',
    price: 199, msrp: 239, tags: ['Cleantech'], certs: ['iec'],
    tagline: 'Rotate the head and it becomes an edger.',
    desc: 'A 15-inch cutting swath with a rotating head, carbon-fiber shaft and bump-feed line.',
    features: ['15 in. cutting swath', 'Rotating head for edging', 'Carbon fiber shaft', 'Compatible with plant-based line'],
    special: ['Optional compostable nylon-alternative line', 'Shares batteries with mower and blower'],
    usage: 'Edges a sidewalk and trims fence lines in one pass.',
    dims: '58 in. long · 7.9 lb', warranty: 60, days: [4, 7], sold: 430, age: 170,
  },
  {
    slug: 'worm-castings-soil-builder', name: 'Worm Castings Soil Builder, 15 lb', vendor: 'v-rootline', cat: 'Organic and environmentally friendly fertilizer', sub: 'Soil amendments',
    price: 28, msrp: 34, tags: ['Bio-Based', 'Non-Toxic', 'Compostable'], certs: ['omri'],
    tagline: 'Pure vermicompost from food-scrap-fed worms.',
    desc: 'Screened worm castings that add biology and slow-release nutrients without burning roots.',
    features: ['100% worm castings, no fillers', 'Safe for seedlings and houseplants', 'Improves water retention', 'Compostable paper bag'],
    special: ['Made from diverted food scraps', 'Safe around kids, pets and pollinators'],
    usage: 'Mix one part castings to four parts potting soil, or top-dress beds in spring.',
    dims: '15 lb bag', warranty: 0, days: [4, 7], sold: 1780, age: 260, bulk: true,
  },
  {
    slug: 'kelp-fish-liquid-fertilizer', name: 'Kelp & Fish Liquid Fertilizer, 1 gal', vendor: 'v-rootline', cat: 'Organic and environmentally friendly fertilizer', sub: 'Liquid feeds',
    price: 36, msrp: 42, tags: ['Bio-Based', 'Non-Toxic', 'Refillable'], certs: ['omri'],
    tagline: 'Cold-processed kelp and wild fish, refill the jug at participating stores.',
    desc: 'A 2-3-1 liquid feed from byproducts of sustainable fisheries and hand-harvested kelp.',
    features: ['Makes up to 64 gallons', 'Cold-processed to keep enzymes', 'Low odor formula', 'Refillable HDPE jug'],
    special: ['Made from fishery byproducts', 'Jug refill program'],
    usage: 'Two tablespoons per gallon of water every two weeks during growing season.',
    dims: '1 gallon jug', warranty: 0, days: [4, 7], sold: 940, age: 100, refillable: true,
  },
  {
    slug: 'neem-rosemary-garden-spray', name: 'Neem & Rosemary Garden Spray', vendor: 'v-rootline', cat: 'Organic pesticides', sub: 'Insect control',
    price: 21, msrp: 25, tags: ['Non-Toxic', 'Bio-Based'], certs: ['omri'],
    tagline: 'Cold-pressed neem for aphids and mites, applied at dusk to protect pollinators.',
    desc: 'A ready-to-use botanical spray with cold-pressed neem oil, rosemary oil and a plant-based emulsifier.',
    features: ['Controls aphids, mites and whiteflies', 'Safe for edibles up to day of harvest', 'Plant-based emulsifier', 'Recyclable trigger bottle'],
    special: ['Label directions protect bees: apply at dusk', 'No synthetic pyrethroids'],
    usage: 'Spray undersides of leaves at dusk every 7 days until pests subside.',
    dims: '32 oz', warranty: 0, days: [3, 6], sold: 1360, age: 140,
  },
  {
    slug: 'bacillus-fungal-shield', name: 'Bacillus Fungal Shield Concentrate', vendor: 'v-rootline', cat: 'Organic and environmentally friendly disease control', sub: 'Fungicides',
    price: 27, msrp: 32, tags: ['Non-Toxic', 'Bio-Based'], certs: ['omri'],
    tagline: 'Beneficial bacteria that outcompete powdery mildew and blight.',
    desc: 'A Bacillus subtilis concentrate for vegetables, roses and turf, safe for beneficial insects.',
    features: ['Prevents powdery mildew, blight, black spot', 'Zero-day pre-harvest interval', 'Makes 16 gal of spray', 'Store at room temperature'],
    special: ['Living biological, not a synthetic', 'Safe for pollinators once dry'],
    usage: 'Spray tomatoes weekly from first flowers through harvest.',
    dims: '16 oz concentrate', warranty: 0, days: [3, 6], sold: 620, age: 90,
  },
  {
    slug: 'pet-safe-ice-melt', name: 'Pet-Safe Ice Melt, 25 lb', vendor: 'v-rootline', cat: 'Eco- & pet-friendly ice melters', sub: 'Ice melt',
    price: 32, msrp: 38, tags: ['Non-Toxic', 'Bio-Based'], certs: ['omri'],
    tagline: 'Chloride-free CMA that is kind to paws, concrete and lawns.',
    desc: 'Calcium magnesium acetate pellets that melt to 5°F without the salt damage to soil and pets.',
    features: ['Effective to 5°F', 'Chloride-free: no salt burn', 'Safer for concrete and lawns', 'Tinted blue for even spreading'],
    special: ['Gentle on paws and waterways', 'Compostable woven paper bag'],
    usage: 'Spread before a storm to prevent bonding; one bag covers about 2,000 sq ft.',
    dims: '25 lb bag', warranty: 0, days: [4, 7], sold: 880, age: 300,
  },

  // ——— Water ———
  {
    slug: 'countertop-gravity-water-filter', name: 'Countertop Gravity Water Filter', vendor: 'v-clearwater', cat: 'Sustainable water purifier', sub: 'Countertop',
    price: 189, msrp: 219, tags: ['Refillable', 'Plastic-Free', 'Cleantech'], certs: ['nsf53', 'nsf42', 'nsf401'],
    tagline: 'Stainless gravity filter with refillable cartridges. No power, no plumbing.',
    desc: 'A 2.25-gallon stainless system reducing lead, PFAS and chlorine. Cartridge shells are mailed back and refilled.',
    features: ['Reduces lead, PFOA/PFOS, chlorine', '2.25 gal capacity', 'Refillable cartridge shells', 'Works off-grid'],
    special: ['Cartridge shells refilled, not landfilled', 'Performance reports published per batch'],
    usage: 'Fill the top chamber in the morning; clean water all day without a pitcher of plastic.',
    dims: '19 in. tall × 8.5 in. dia.', warranty: 60, days: [3, 6], sold: 1540, age: 190, refillable: true,
  },
  {
    slug: 'under-sink-refillable-filter', name: 'Under-Sink Refillable Filter System', vendor: 'v-clearwater', cat: 'Sustainable water purifier', sub: 'Under-sink',
    price: 249, msrp: 289, tags: ['Refillable', 'Cleantech', 'Minimal Packaging'], certs: ['nsf53', 'nsf401'],
    tagline: 'Two-stage filtration with a dedicated faucet. Cartridge shells go back for refill.',
    desc: 'A quick-connect two-stage system that installs in 20 minutes without cutting pipes.',
    features: ['Two-stage carbon block + KDF', 'Tool-free quarter-turn cartridges', 'Lead-free stainless faucet', '1,000-gallon cartridge life'],
    special: ['Refill-by-mail cartridge program', 'No wastewater, unlike reverse osmosis'],
    usage: 'Installs under a kitchen sink with the included push-fit adapter.',
    dims: '13 × 8 × 4 in.', warranty: 60, days: [3, 6], sold: 780, age: 130, refillable: true,
  },
  {
    slug: 'insulated-steel-bottle-24oz', name: 'Insulated Steel Bottle, 24 oz', vendor: 'v-clearwater', cat: 'Sustainable and eco-friendly water bottle', sub: 'Bottles',
    price: 34, msrp: 40, tags: ['Plastic-Free', 'Recyclable', 'Non-Toxic'], certs: ['fda', 'pfas'],
    tagline: 'Steel cap, steel body, no plastic touching your water.',
    desc: 'Double-wall 18/8 stainless with a steel-and-bamboo cap, keeps drinks cold for 24 hours.',
    features: ['Cold 24 hrs / hot 12 hrs', 'All-steel interior including cap', 'Powder coat free of PFAS', 'Replaceable silicone gasket'],
    special: ['No plastic in contact with contents', 'Lifetime cap replacement'],
    usage: 'Refill at the office and skip roughly 150 bottles a year.',
    dims: '10.5 in. tall', warranty: 1200, days: [3, 5], sold: 3560, age: 280,
    variants: [['Sage', 0], ['Sky', 0], ['Slate', 0], ['Paper white', 0]],
  },
  {
    slug: 'filter-travel-bottle', name: 'Filtering Travel Bottle, 20 oz', vendor: 'v-clearwater', cat: 'Sustainable and eco-friendly water bottle', sub: 'Filter bottles',
    price: 42, msrp: 49, tags: ['Refillable', 'Plastic-Free', 'Cleantech'], certs: ['nsf42', 'nsf53'],
    tagline: 'Refill from any tap on the road with a filter that lasts 100 gallons.',
    desc: 'A stainless bottle with a replaceable carbon filter and a steel straw.',
    features: ['Filters 100 gallons per cartridge', 'Reduces chlorine and lead', 'Stainless straw and lid', 'Leak-proof carry loop'],
    special: ['Cartridges returned by mail for refill', 'Replaces single-use bottles when traveling'],
    usage: 'Fill from a hotel tap and drink through the filter straw.',
    dims: '9.5 in. tall', warranty: 24, days: [3, 5], sold: 1210, age: 40, refillable: true,
  },
  {
    slug: 'smart-leak-sensor-3pack', name: 'Smart Water Leak Sensor, 3-Pack', vendor: 'v-clearwater', cat: 'Water leaks detector', sub: 'Sensors',
    price: 79, msrp: 95, tags: ['Cleantech', 'Minimal Packaging'], certs: ['fcc'],
    tagline: 'Catch a slow drip before it becomes a ceiling stain.',
    desc: 'Battery-sipping sensors with a 100 dB siren and phone alerts, no subscription.',
    features: ['Phone alerts over Wi-Fi hub', '100 dB local siren', '3-year battery life', 'Freeze warning at 40°F'],
    special: ['No monthly subscription', 'Recycled-content housings'],
    usage: 'Place under the water heater, washing machine and kitchen sink.',
    dims: '2.5 in. puck', warranty: 24, days: [3, 5], sold: 1030, age: 55,
  },
  {
    slug: 'watersense-showerhead-15gpm', name: '1.5 GPM WaterSense Showerhead', vendor: 'v-clearwater', cat: 'Water-use reduction hardware', sub: 'Shower',
    price: 39, msrp: 48, tags: ['Cleantech', 'Recyclable'], certs: ['watersense'],
    tagline: 'A full-feeling shower on 40% less water.',
    desc: 'An air-induction showerhead with solid brass body and self-cleaning nozzles.',
    features: ['1.5 gallons per minute', 'Air-induction spray feels like 2.5 GPM', 'Solid brass, lead-free', 'Tool-free install'],
    special: ['Saves about 2,700 gallons a year per person', 'Cuts water-heating energy too'],
    usage: 'Screw on by hand; no tape or wrench needed for most arms.',
    dims: '4 in. face', warranty: 120, days: [3, 5], sold: 2210, age: 320,
    variants: [['Brushed nickel', 0], ['Matte black', 4]],
  },
  {
    slug: 'faucet-aerator-kit', name: 'Faucet Aerator Kit, 6-Piece', vendor: 'v-clearwater', cat: 'Water-use reduction hardware', sub: 'Aerators',
    price: 24, msrp: 29, tags: ['Cleantech', 'Minimal Packaging'], certs: ['watersense'],
    tagline: 'Six aerators for kitchen and bath, most homes need only a minute each.',
    desc: 'Brass aerators at 1.0 and 1.5 GPM with swivel kitchen head, plus adapters for most threads.',
    features: ['Two 1.5 GPM kitchen, four 1.0 GPM bath', 'Swivel spray head for kitchen', 'Male and female thread adapters', 'Rubber washer included'],
    special: ['Pays back in water savings within months', 'Paper box, no blister pack'],
    usage: 'Unscrew the old aerator, screw in the new one, done.',
    dims: 'Standard 15/16 and 55/64 threads', warranty: 60, days: [3, 5], sold: 1350, age: 210,
  },

  // ——— Body & Wellness ———
  {
    slug: 'mineral-bath-soak-jar', name: 'Mineral Bath Soak in Amber Glass', vendor: 'v-hearth', cat: 'Eco-friendly and zero-waste body wellness', sub: 'Bath',
    price: 26, msrp: 30, tags: ['Plastic-Free', 'Small-Batch', 'Refillable'], certs: ['usda', 'bunny'],
    tagline: 'Magnesium flakes, oat and farm-grown lavender. Refill pouches available.',
    desc: 'A small-batch bath soak with magnesium chloride flakes, colloidal oat and regeneratively grown lavender buds.',
    features: ['Magnesium chloride + colloidal oat', 'No synthetic fragrance or dyes', 'About 8 soaks per jar', 'Wooden scoop included'],
    special: ['Refill pouches are home compostable', 'Farm name printed on every batch'],
    usage: 'Dissolve two scoops in a warm bath after a long day in the garden.',
    dims: '16 oz jar', warranty: 0, days: [3, 5], sold: 1270, age: 110, refillable: true,
  },
  {
    slug: 'magnesium-body-butter-tin', name: 'Whipped Magnesium Body Butter', vendor: 'v-hearth', cat: 'Eco-friendly and zero-waste body wellness', sub: 'Body care',
    price: 24, msrp: 28, tags: ['Plastic-Free', 'Non-Toxic', 'Small-Batch'], certs: ['usda'],
    tagline: 'Shea, magnesium and calendula in a recyclable aluminum tin.',
    desc: 'A rich, fast-absorbing butter for dry skin and sore muscles.',
    features: ['Organic shea and cocoa butter', 'Magnesium chloride for muscle comfort', 'Calendula infused in sunflower oil', 'Unscented or lightly scented'],
    special: ['Aluminum tin is infinitely recyclable', 'Made in 40-jar batches'],
    usage: 'Massage into calves and shoulders after a workout or before bed.',
    dims: '4 oz tin', warranty: 0, days: [3, 5], sold: 980, age: 60,
    variants: [['Unscented', 0], ['Cedar & orange', 0]],
  },
  {
    slug: 'solid-shampoo-conditioner-duo', name: 'Solid Shampoo & Conditioner Duo', vendor: 'v-hearth', cat: 'Eco-friendly personal care', sub: 'Hair care',
    price: 28, msrp: 32, tags: ['Plastic-Free', 'Non-Toxic', 'Minimal Packaging'], certs: ['ecocert', 'bunny'],
    tagline: 'Two bars replace about six plastic bottles.',
    desc: 'Sulfate-free shampoo bar and a conditioner bar with plant-based conditioning agents.',
    features: ['Each bar lasts 60–80 washes', 'Sulfate-, silicone- and paraben-free', 'Color-safe', 'Travel-friendly: no TSA liquid limits'],
    special: ['Wrapped in compostable paper', 'No water shipped'],
    usage: 'Swipe the bar across wet hair two or three times, lather, rinse.',
    dims: '2.8 oz each', warranty: 0, days: [3, 5], sold: 2640, age: 230,
    variants: [['Normal hair', 0], ['Dry / curly', 0]],
  },
  {
    slug: 'refillable-deodorant-case', name: 'Refillable Deodorant Case + 3 Refills', vendor: 'v-hearth', cat: 'Eco-friendly personal care', sub: 'Deodorant',
    price: 32, msrp: 38, tags: ['Refillable', 'Plastic-Free', 'Non-Toxic'], certs: ['ecocert', 'bunny'],
    tagline: 'A case you keep forever and compostable paper refills.',
    desc: 'Aluminum-free, baking-soda-free deodorant for sensitive skin in a stainless case.',
    features: ['Aluminum- and baking-soda-free', 'Arrowroot and magnesium hydroxide', 'Stainless refillable case', 'Refills in paper tubes'],
    special: ['Case built to last a lifetime', 'Refills are home compostable'],
    usage: 'Twist up, apply to dry skin; swap refills in seconds.',
    dims: '2.5 oz per refill', warranty: 1200, days: [3, 5], sold: 1760, age: 200, refillable: true,
    variants: [['Unscented', 0], ['Vetiver', 0], ['Rose geranium', 0]],
  },
  {
    slug: 'regenerative-moringa-greens', name: 'Regenerative Moringa Greens Powder', vendor: 'v-hearth', cat: 'Nutrient supplement', sub: 'Greens',
    price: 38, msrp: 44, tags: ['Bio-Based', 'Plastic-Free', 'Small-Batch'], certs: ['usda', 'roc', 'nongmo'],
    tagline: 'Single-origin moringa leaf, shade-dried and packed in glass.',
    desc: 'Nutrient-dense moringa from a partner farm practicing agroforestry. Third-party tested for heavy metals.',
    features: ['30 servings per jar', 'Heavy-metal tested each lot', 'No fillers, sweeteners or flow agents', 'Amber glass, metal lid'],
    special: ['Farm and lot number on every jar', 'Agroforestry-grown'],
    usage: 'Stir one teaspoon into a smoothie or soup each morning.',
    dims: '5.3 oz jar', warranty: 0, days: [3, 5], sold: 1090, age: 85, bulk: true,
  },
  {
    slug: 'plant-omega-3-algae-oil', name: 'Plant Omega-3 Algae Oil Softgels', vendor: 'v-hearth', cat: 'Nutrient supplement', sub: 'Omega-3',
    price: 34, msrp: 40, tags: ['Bio-Based', 'Plastic-Free'], certs: ['nongmo'],
    tagline: 'EPA and DHA straight from algae, the source fish get it from.',
    desc: 'Vegan omega-3 softgels grown in closed tanks, avoiding ocean-caught fish oil.',
    features: ['500 mg EPA + DHA per serving', 'Carrageenan-free plant softgel', 'No fishy aftertaste', '60 softgels, amber glass'],
    special: ['No pressure on wild fish stocks', 'Grown in closed, contaminant-free tanks'],
    usage: 'Take two softgels with a meal daily.',
    dims: '60 count', warranty: 0, days: [3, 5], sold: 760, age: 35, bulk: true,
  },

  // ——— Build & Move ———
  {
    slug: 'hempcrete-block-sample-pallet', name: 'Hempcrete Block, Starter Pallet', vendor: 'v-greenline', cat: 'Sustainable building materials', sub: 'Masonry',
    price: 1290, msrp: 1450, tags: ['Bio-Based', 'Non-Toxic', 'Small-Batch'], certs: ['hempcrete', 'greenguard'],
    tagline: 'Carbon-storing walls that breathe, insulate and resist mold.',
    desc: 'Pre-cast hemp-lime blocks for infill walls, with published embodied-carbon estimates.',
    features: ['R-2.4 per inch', 'Vapor-open: manages moisture', 'Class A fire rating', '48 blocks per pallet'],
    special: ['Stores carbon in the wall for its lifetime', 'No VOCs, no off-gassing'],
    usage: 'Build a 10-ft garden studio wall with lime mortar and a timber frame.',
    dims: '12 × 6 × 24 in. per block', warranty: 120, days: [10, 18], sold: 42, age: 150, stock: 14,
  },
  {
    slug: 'recycled-denim-insulation', name: 'Recycled Denim Insulation Batts', vendor: 'v-greenline', cat: 'Sustainable building materials', sub: 'Insulation',
    price: 89, msrp: 104, tags: ['Recyclable', 'Non-Toxic'], certs: ['greenguard'],
    tagline: 'Itch-free insulation made from post-industrial denim.',
    desc: 'R-13 batts for 2×4 walls, treated with a borate for fire and pest resistance, no formaldehyde.',
    features: ['R-13 for 2×4 walls', 'No itch, no respirator needed', 'Excellent sound dampening', 'Covers 40 sq ft per bundle'],
    special: ['80% recycled denim content', 'Formaldehyde-free'],
    usage: 'Friction-fit between studs in a bedroom remodel; hand-tearable.',
    dims: '15 × 93 in. batts', warranty: 0, days: [5, 9], sold: 310, age: 240, bulk: true,
  },
  {
    slug: 'ridge-cabin-panel-kit', name: 'Ridge Cabin Panel Kit, 160 sq ft', vendor: 'v-greenline', cat: 'Sustainable alternative housing', sub: 'Kit homes',
    price: 18900, msrp: 21500, tags: ['Bio-Based', 'Non-Toxic', 'Made in USA'], certs: ['fsc', 'greenguard'],
    tagline: 'A flat-packed studio of FSC timber and wood-fiber insulation.',
    desc: 'Pre-cut structural panels with wood-fiber insulation and a standing-seam roof, assembled by two people in about a week.',
    features: ['160 sq ft interior', 'Wood-fiber insulated panels, R-24 walls', 'Standing-seam metal roof', 'Design drawings for permit submission'],
    special: ['Minimal site waste: panels cut to size', 'Designed for disassembly and reuse'],
    usage: 'A backyard studio or off-grid cabin pairing with the Helio power station.',
    dims: '10 × 16 ft footprint', warranty: 120, days: [21, 42], sold: 11, age: 260, stock: 4,
    patents: ['US 11,0XX,XXX'],
  },
  {
    slug: 'zero-voc-mineral-wall-paint', name: 'Zero-VOC Mineral Wall Paint, 1 gal', vendor: 'v-greenline', cat: 'Non-toxic paints & coatings', sub: 'Interior paint',
    price: 72, msrp: 84, tags: ['Non-Toxic', 'Bio-Based', 'Small-Batch'], certs: ['greenguard', 'c2c'],
    tagline: 'Silicate paint that bonds with the wall and never peels.',
    desc: 'Potassium silicate mineral paint in 24 earth-pigment colors with no acrylic binder.',
    features: ['Zero VOC, no acrylic', 'Naturally mold-resistant', 'Matte, chalky finish', 'Covers ~350 sq ft per gallon'],
    special: ['Breathable: ideal over plaster and lime', 'Earth pigments, no heavy metals'],
    usage: 'Paint a nursery the day before move-in with no fumes lingering.',
    dims: '1 gallon steel can', warranty: 0, days: [4, 8], sold: 690, age: 130,
    variants: [['Sage', 0], ['Mist', 0], ['Paper white', 0], ['Sky', 0], ['Clay', 0]],
  },
  {
    slug: 'plant-oil-wood-finish', name: 'Plant-Oil Hardwax Wood Finish, 1 L', vendor: 'v-greenline', cat: 'Non-toxic paints & coatings', sub: 'Wood finish',
    price: 58, msrp: 68, tags: ['Non-Toxic', 'Bio-Based'], certs: ['greenguard'],
    tagline: 'Linseed and carnauba finish for floors, tables and toys.',
    desc: 'A penetrating hardwax oil that is food-contact and toy safe once cured.',
    features: ['Covers ~300 sq ft per liter', 'Spot-repairable: no sanding the whole floor', 'Food- and toy-safe when cured', 'Low odor'],
    special: ['No petroleum solvents', 'Repairs instead of refinishing'],
    usage: 'Refinish a butcher block counter with two thin coats.',
    dims: '1 L tin', warranty: 0, days: [4, 8], sold: 470, age: 70,
  },
  {
    slug: 'longtail-cargo-e-bike', name: 'Longtail Cargo E-Bike', vendor: 'v-greenline', cat: 'Green transportation', sub: 'E-bikes',
    price: 3890, msrp: 4400, tags: ['Cleantech', 'Recyclable'], certs: ['ul2272'],
    tagline: 'Two kids and the groceries, no car required.',
    desc: 'A mid-drive cargo e-bike with 400 lb capacity, dual-battery option and hydraulic brakes.',
    features: ['Mid-drive motor, 85 Nm torque', 'Up to 70 miles per battery', '400 lb total capacity', 'Hydraulic disc brakes'],
    special: ['UL 2849 certified electrical system', 'Battery refurbishment program'],
    usage: 'Replaces the second car for school runs and weekly shopping.',
    dims: '76 in. long · 72 lb', warranty: 24, days: [7, 14], sold: 58, age: 25, stock: 6,
    variants: [['Single battery', 0], ['Dual battery', 690]],
  },
  {
    slug: 'folding-commuter-e-scooter', name: 'Folding Commuter E-Scooter', vendor: 'v-greenline', cat: 'Green transportation', sub: 'Scooters',
    price: 749, msrp: 849, tags: ['Cleantech', 'Recyclable'], certs: ['ul2272'],
    tagline: 'Folds in three seconds, rides 25 miles, swaps its battery.',
    desc: 'A 350 W commuter scooter with a swappable battery, dual braking and solid tires.',
    features: ['25-mile range, 18 mph max', 'Swappable battery pack', 'Front drum + regen braking', 'Flat-free solid tires'],
    special: ['Swappable battery extends lifespan', 'Recycled aluminum frame'],
    usage: 'Last-mile commuting from the train station, folded under a desk.',
    dims: '43 × 17 × 47 in. · 31 lb', warranty: 24, days: [4, 8], sold: 190, age: 95,
  },

  // ——— Preparedness ———
  {
    slug: 'hand-crank-weather-radio', name: 'Solar Hand-Crank Weather Radio', vendor: 'v-ridgeline', cat: 'Emergency equipment', sub: 'Radios',
    price: 59, msrp: 69, tags: ['Cleantech', 'Small-Batch'], certs: ['fcc', 'pfas'],
    tagline: 'NOAA alerts, flashlight and phone charging with no batteries to buy.',
    desc: 'An AM/FM/NOAA radio powered by solar, hand crank or USB-C, with an SOS beacon.',
    features: ['NOAA weather alerts', 'Solar, crank and USB-C charging', '4,000 mAh power bank', 'SOS light and siren'],
    special: ['No disposable batteries required', 'PFAS-free rubberized coating'],
    usage: 'Keep by the door during wildfire and hurricane season.',
    dims: '6.5 × 3 × 2.5 in.', warranty: 24, days: [3, 6], sold: 1450, age: 210,
  },
  {
    slug: 'first-responder-trauma-kit', name: 'Reusable First-Responder Trauma Kit', vendor: 'v-ridgeline', cat: 'Emergency equipment', sub: 'First aid',
    price: 119, msrp: 139, tags: ['Small-Batch', 'Made in USA'], certs: ['pfas'],
    tagline: 'A refillable kit with a restock list, built by wildfire crews.',
    desc: 'A roll-out kit in PFAS-free recycled nylon, with a printed refill checklist.',
    features: ['Tourniquet, hemostatic gauze, shears', 'Roll-out organizer with labels', 'Refill checklist and restock packs', 'Recycled nylon, PFAS-free'],
    special: ['Restock packs so the bag lasts decades', 'Designed with volunteer fire crews'],
    usage: 'Mount behind a vehicle seat; restock after use with a single pack.',
    dims: '10 × 7 × 4 in. rolled', warranty: 60, days: [3, 6], sold: 520, age: 180, refillable: true,
  },
  {
    slug: '72-hour-family-survival-kit', name: '72-Hour Family Survival Kit', vendor: 'v-ridgeline', cat: 'Survival kit', sub: 'Go-bags',
    price: 249, msrp: 289, tags: ['Cleantech', 'Small-Batch', 'Made in USA'], certs: ['pfas'],
    tagline: 'Four people, three days, one bag. Solar-powered and PFAS-free.',
    desc: 'A go-bag with water filtration, food, shelter, first aid and solar power for a family of four.',
    features: ['Food and water filtration for 4 people × 72 hrs', 'Solar lantern and crank radio', 'Two emergency bivvies', 'Waterproof document pouch'],
    special: ['Food packed in compostable pouches', 'Rotation reminder card with dates'],
    usage: 'Store by the exit; rotate food every five years using the reminder card.',
    dims: '22 × 14 × 10 in. · 24 lb', warranty: 12, days: [3, 6], sold: 640, age: 45,
    variants: [['Family of 2', -80], ['Family of 4', 0]],
  },
  {
    slug: 'compact-survival-tin', name: 'Compact Everyday Survival Tin', vendor: 'v-ridgeline', cat: 'Survival kit', sub: 'Pocket kits',
    price: 34, msrp: 40, tags: ['Plastic-Free', 'Small-Batch'], certs: ['pfas'],
    tagline: 'Fire, light, signal and water, in a tin the size of a phone.',
    desc: 'A pocket kit with ferro rod, whistle, signal mirror, water tablets and a mini flashlight.',
    features: ['Ferro rod and natural tinder', 'Signal mirror and whistle', 'Water purification tablets', 'Rechargeable mini flashlight'],
    special: ['Steel tin doubles as a cook pot', 'No plastic blister packs'],
    usage: 'Keep in a daypack or glovebox.',
    dims: '5 × 3.5 × 1 in.', warranty: 12, days: [3, 5], sold: 830, age: 15,
  },
];

const round2 = (n: number) => Math.round(n * 100) / 100;
const isoDaysAgo = (days: number) => new Date(Date.UTC(2026, 8, 15) - days * 86400000).toISOString();

function build(spec: Spec, index: number): Product {
  const category = categoryByName(spec.cat);
  if (!category) throw new Error(`Unknown category "${spec.cat}" on ${spec.slug}`);
  const vendor = vendorById(spec.vendor);
  if (!vendor) throw new Error(`Unknown vendor "${spec.vendor}" on ${spec.slug}`);

  const certifications: Certification[] = spec.certs.map((k, i) => ({
    name: CERT[k][0],
    issuer: CERT[k][1],
    id: `HFE-${k.toUpperCase()}-${String(1000 + index * 7 + i).padStart(5, '0')}`,
  }));

  const tiers = spec.bulk
    ? [
        { minQty: 1, unitPrice: spec.price },
        { minQty: 3, unitPrice: round2(spec.price * 0.95) },
        { minQty: 6, unitPrice: round2(spec.price * 0.9) },
      ]
    : [{ minQty: 1, unitPrice: spec.price }];

  const tags = new Set<ValueTag>(spec.tags);
  if (spec.refillable) tags.add('Refillable');

  const alt = spec.name;
  return {
    id: `p-${String(index + 1).padStart(3, '0')}`,
    slug: spec.slug,
    name: spec.name,
    brandName: vendor.name,
    vendorId: vendor.id,
    tagline: spec.tagline,
    description: spec.desc,
    images: [
      { alt: `${alt}, front view`, angle: 'front' },
      { alt: `${alt}, detail view`, angle: 'detail' },
      { alt: `${alt}, in use`, angle: 'context' },
      { alt: `${alt}, packaging`, angle: 'pack' },
    ],
    keyFeatures: spec.features,
    specialAspects: spec.special,
    usageExample: { text: spec.usage, images: [{ alt: `${alt} in use`, angle: 'context' }] },
    category: category.name,
    categorySlug: category.slug,
    subcategory: spec.sub,
    valueTags: [...tags],
    intellectualProperty: {
      patents: spec.patents ?? [],
      trademarks: spec.trademarks ?? [`${vendor.name}®`],
      copyrights: [`© ${vendor.founded}–2026 ${vendor.name}. Product copy and imagery.`],
    },
    certifications,
    pricing: { msrp: spec.msrp, price: spec.price, currency: 'USD', tiers },
    hfeDiscount: {
      type: 'percent',
      value: spec.discount ?? 5,
      note: 'HFE member price — applied automatically when you are signed in.',
    },
    warranty: {
      summary:
        spec.warranty === 0
          ? `Satisfaction guarantee handled by ${vendor.name}. ${vendor.returnPolicy}`
          : spec.warranty >= 1200
            ? `Lifetime limited warranty against manufacturing defects, fulfilled by ${vendor.name}.`
            : `${spec.warranty % 12 === 0 ? `${spec.warranty / 12}-year` : `${spec.warranty}-month`} limited warranty against defects, fulfilled by ${vendor.name}.`,
      durationMonths: spec.warranty,
      providedBy: 'vendor',
      hfeLiable: false,
    },
    shipping: { providedBy: 'vendor', estimateDays: spec.days, freeThreshold: spec.freeOver ?? 50 },
    inventory: { sku: `HFE-${vendor.id.slice(2, 5).toUpperCase()}-${String(index + 101)}`, stock: spec.stock ?? 40 + ((index * 37) % 160) },
    harmFreeSeal: { granted: true, grantedAt: isoDaysAgo(spec.age + 10) },
    dimensions: spec.dims,
    variants: (spec.variants ?? []).map(([label, priceDelta], i) => ({
      id: `${spec.slug}-v${i + 1}`,
      label,
      priceDelta,
      stock: (spec.stock ?? 40) + i * 3,
    })),
    refillable: tags.has('Refillable'),
    createdAt: isoDaysAgo(spec.age),
    unitsSold: spec.sold,
    ratingAvg: 0,
    reviewCount: 0,
  };
}

/** Products before review aggregates are applied (see data/index.ts). */
export const rawProducts: Product[] = SPECS.map(build).map(withPhotos);
