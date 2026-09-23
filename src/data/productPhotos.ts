/**
 * Representative product photography — licensed from Unsplash (https://unsplash.com/license):
 * free for commercial use, no permission needed. Each photographer is credited on the product page
 * and in PHOTO_CREDITS.md. These are stock photos of the product *type*, not the vendors' actual
 * items; replace them with vendor photography when it is supplied.
 * The solar cooker photo comes from Pexels (https://www.pexels.com/license/), also free for commercial use.
 *
 * Photos showing prominent brand logos were deliberately excluded.
 *
 * Files live in public/images/products/<slug>-{400,800}.webp (square crops).
 */
import type { Product, ProductImage } from '@/types';

interface Photo {
  /** Photographer's display name on Unsplash */
  name: string;
  /** The photo's Unsplash page (links to the photographer and license) */
  page: string;
  /** Defaults to Unsplash */
  source?: 'Unsplash' | 'Pexels';
}

export const PRODUCT_PHOTOS: Record<string, Photo> = {
  '72-hour-family-survival-kit': { name: 'Max Bender', page: 'https://unsplash.com/photos/brown-and-red-love-print-backpack-Qm9_Mgycw4A' },
  'all-purpose-cleaner-refill-tablets': { name: 'Sophie', page: 'https://unsplash.com/photos/a-group-of-bottles-and-a-rope-on-a-snowy-ground-xQdp-KbIG3s' },
  'bacillus-fungal-shield': { name: 'Shalev Cohen', page: 'https://unsplash.com/photos/red-and-green-tomato-fruit-5Oi5sG6G0z8' },
  'bamboo-dish-brush-set': { name: 'Pille R. Priske', page: 'https://unsplash.com/photos/brown-wooden-rolling-pin-on-white-textile-z_MwDqdYFLU' },
  'bioethanol-cooking-fuel': { name: 'EJ Strat', page: 'https://unsplash.com/photos/black-and-red-smoke-on-black-background-QPx_idKyrpc' },
  'breeze-400-micro-wind-turbine': { name: 'Jacob McGowin', page: 'https://unsplash.com/photos/a-wind-turbine-spins-against-a-blue-sky-yxD6bNzptII' },
  'cold-climate-ducted-heat-pump': { name: 'Kien Nguyen', page: 'https://unsplash.com/photos/a-couple-of-air-conditioners-sitting-on-the-side-of-a-building-3HuYNNM1-8w' },
  'compact-survival-tin': { name: 'Navy Medicine', page: 'https://unsplash.com/photos/person-holding-medical-kit-and-supplies--wYhfVD7Kxs' },
  'compostable-mailers-100': { name: 'Mediamodifier', page: 'https://unsplash.com/photos/white-paper-on-brown-wooden-table-S3Lig53867M' },
  'condensing-tankless-water-heater': { name: 'Michal Balog', page: 'https://unsplash.com/photos/water-heater-on-wall-above-sink-ii5IRyypPhs' },
  'cordless-21-inch-electric-mower': { name: 'Daniel Watson', page: 'https://unsplash.com/photos/green-and-black-lawnmower-on-green-grass-8vBpYpTGo90' },
  'cordless-leaf-blower-56v': { name: 'Callum Hill', page: 'https://unsplash.com/photos/man-in-black-jacket-and-pants-standing-on-stairs--QyvOa0J9Mg' },
  'cordless-trimmer-edger-2in1': { name: 'Kenny Perez', page: 'https://unsplash.com/photos/man-trimming-weeds-around-a-tree-in-a-sunny-yard-x2GgAart-is' },
  'countertop-gravity-water-filter': { name: 'Quan Jing', page: 'https://unsplash.com/photos/pink-flowering-plant-and-water-pitcher-on-a-tiled-windowsill-jmb0zkkf7Mo' },
  'faucet-aerator-kit': { name: 'Sasikan Ulevik', page: 'https://unsplash.com/photos/gray-stainless-steel-faucet-8jQC5RHWuSE' },
  'filter-travel-bottle': { name: 'Bluewater Sweden', page: 'https://unsplash.com/photos/person-holding-stainless-steel-vacuum-flask-MCRKtrpiI-k' },
  'first-responder-trauma-kit': { name: 'Mathurin NAPOLY / matnapo', page: 'https://unsplash.com/photos/open-red-medical-bag-with-supplies-MaKsx8JNbiI' },
  'foldable-200w-solar-panel': { name: 'Newpowa', page: 'https://unsplash.com/photos/a-solar-panel-laying-on-the-ground-in-a-garden-jLb7B-fKkFI' },
  'folding-commuter-e-scooter': { name: 'Kelly Sikkema', page: 'https://unsplash.com/photos/person-in-black-and-white-nike-sneakers-riding-blue-and-white-skateboard-during-daytime-N4tDi48Ct-A' },
  'forever-glass-spray-bottle-kit': { name: 'Lucas van Oort', page: 'https://unsplash.com/photos/a-spray-bottle-on-a-table-with-a-blurry-background-MHrmbMQ8DJ8' },
  'geo-4-ton-geothermal-heat-pump': { name: 'Lukasz Szramuk', page: 'https://unsplash.com/photos/a-large-pipe-with-steam-coming-out-of-it-qhioBLOfc3w' },
  'glass-pantry-jars-bamboo-lids': { name: 'Heather McKean', page: 'https://unsplash.com/photos/a-shelf-filled-with-lots-of-different-types-of-spices-1I9bMlIAIBM' },
  'hand-crank-weather-radio': { name: 'Israa Ali', page: 'https://unsplash.com/photos/person-holding-black-and-gray-radio-gF3T1aT2mW0' },
  'helio-1500-power-station': { name: 'Newpowa', page: 'https://unsplash.com/photos/a-pink-and-white-radio-sitting-on-top-of-a-chair-pzTMQ5loUuU' },
  'hempcrete-block-sample-pallet': { name: 'Henrik Pauly', page: 'https://unsplash.com/photos/a-room-that-is-being-constructed-with-wood-WtJlIY5-T8s' },
  'hepa-air-purifier-washable': { name: 'Fujiphilm', page: 'https://unsplash.com/photos/a-white-air-conditioner-sitting-under-a-table-oodKiqDIyCE' },
  'honeycomb-paper-wrap': { name: 'Mediamodifier', page: 'https://unsplash.com/photos/brown-cardboard-box-on-white-table-5u5IQyQdfkM' },
  'induction-ready-cast-iron-skillet': { name: 'Anshu A', page: 'https://unsplash.com/photos/black-frying-pan-on-brown-wooden-table-KusGQYgRgSE' },
  'insulated-steel-bottle-24oz': { name: 'Joan Tran', page: 'https://unsplash.com/photos/green-bottle-on-white-table-reEySFadyJQ' },
  'kelp-fish-liquid-fertilizer': { name: 'Marine Le Gac', page: 'https://unsplash.com/photos/hand-holding-metal-watering-can-nFtq6e0IqsE' },
  'longtail-cargo-e-bike': { name: 'Mark Stosberg', page: 'https://unsplash.com/photos/people-riding-on-orange-bicycles-during-daytime-Ap-1LVpc0WY' },
  'magnesium-body-butter-tin': { name: 'Eveling Salazar', page: 'https://unsplash.com/photos/a-jar-of-white-cream-floats-above-a-rock-01YhA5XDDLk' },
  'mineral-bath-soak-jar': { name: 'Maddi Bazzocco', page: 'https://unsplash.com/photos/a-cup-of-coffee-and-some-books-on-a-bathtub-TOZqUHD8L38' },
  'neem-rosemary-garden-spray': { name: 'Trung Thanh', page: 'https://unsplash.com/photos/woman-holding-water-sprayer-suAnIFXSuuI' },
  'organic-beeswax-food-wraps': { name: 'Krisztian Tabori', page: 'https://unsplash.com/photos/cake-on-plate-uHAdwgwxGiY' },
  'organic-cotton-unpaper-towels': { name: 'micheile henderson', page: 'https://unsplash.com/photos/assorted-textile-N_wGDmRL4hQ' },
  'palm-leaf-plates-50': { name: 'Carlo', page: 'https://unsplash.com/photos/a-plate-with-a-cookie-and-a-cup-of-coffee-uwSGLJZ83K4' },
  'pet-safe-ice-melt': { name: 'Mathias Reding', page: 'https://unsplash.com/photos/person-walking-pug-in-snowy-weather-j9F-H-zYof0' },
  'plant-oil-wood-finish': { name: 'Doug Bagg', page: 'https://unsplash.com/photos/brown-wooden-handle-brush-on-brown-wooden-table-rxorF_Bs0ak' },
  'plant-omega-3-algae-oil': { name: 'Supliful - Supplements On Demand', page: 'https://unsplash.com/photos/a-bunch-of-pills-sitting-on-top-of-a-table-AYJV-uVBAv4' },
  'quiet-35-pint-dehumidifier': { name: 'Jason Leung', page: 'https://unsplash.com/photos/a-room-with-a-chair-and-a-heater-PeQaDfJwkXU' },
  'recycled-denim-insulation': { name: 'TuanAnh Blue', page: 'https://unsplash.com/photos/a-pile-of-jeans-laying-on-top-of-each-other-XdXk39Bj3B0' },
  'refillable-deodorant-case': { name: 'Rachel Beck', page: 'https://unsplash.com/photos/toiletries-and-personal-care-items-laid-out-flat-eC06lZsnfu0' },
  'regenerative-moringa-greens': { name: 'Andrea Lacasse', page: 'https://unsplash.com/photos/a-wooden-spoon-filled-with-green-powder-XwZqwur07mo' },
  'ridge-cabin-panel-kit': { name: 'Atle Mo', page: 'https://unsplash.com/photos/brown-wooden-house-on-brown-rock-near-body-of-water-ibqEcam6ns4' },
  'smart-leak-sensor-3pack': { name: 'Piotr Łaskawski', page: 'https://unsplash.com/photos/a-spider-on-a-wood-surface-_dRvgM3mlTM' },
  'solar-lantern-phone-charger': { name: 'MD Duran', page: 'https://unsplash.com/photos/camping-at-dusk-with-lit-lanterns-Ipmzwgc3jEo' },
  'solar-path-lights-6': { name: 'Cee', page: 'https://unsplash.com/photos/purple-flowers-on-brown-wooden-table-R_c77Rx9UzM' },
  'solid-shampoo-conditioner-duo': { name: 'Sincerely Media', page: 'https://unsplash.com/photos/white-cube-on-white-surface-RA3Qmv2CbkA' },
  'stainless-bento-stack': { name: 'Jack Cole', page: 'https://unsplash.com/photos/a-sandwich-in-a-metal-container-on-a-marble-table-J-Td0wZ_FgA' },
  'sunfold-solar-cooker': { name: 'Erik Debarre', page: 'https://www.pexels.com/photo/solar-cooker-in-desert-environment-31686958/', source: 'Pexels' },
  'swedish-cellulose-sponge-cloths': { name: 'Sven Brandsma', page: 'https://unsplash.com/photos/blue-denim-textile-on-black-table-rtDTC6b2-RY' },
  'tree-free-bamboo-toilet-paper': { name: 'Anastasiia Chepinska', page: 'https://unsplash.com/photos/white-toilet-paper-roll-on-white-table-gSdhs5DJ1bg' },
  'under-sink-refillable-filter': { name: 'Michael DeMarco', page: 'https://unsplash.com/photos/stainless-steel-faucet-on-white-ceramic-sink-84tx7GYWSRU' },
  'usb-c-rechargeable-aa-8': { name: 'Roberto Sorin', page: 'https://unsplash.com/photos/brown-green-and-blue-round-buttons-ZZ3qxWFZNRg' },
  'watersense-showerhead-15gpm': { name: 'natalia menin', page: 'https://unsplash.com/photos/a-shower-head-with-a-lot-of-water-coming-out-of-it-kvNXrgbmCGM' },
  'worm-castings-soil-builder': { name: 'sippakorn yamkasikorn', page: 'https://unsplash.com/photos/brown-dried-leaves-on-persons-hand-6v9w4ZR2TJE' },
  'zero-voc-mineral-wall-paint': { name: 'Sven Brandsma', page: 'https://unsplash.com/photos/blue-and-white-can-on-white-table-kerFMg52cUA' },
};

function photoImage(product: Product, p: Photo): ProductImage {
  const base = `/images/products/${product.slug}`;
  return {
    src: `${base}-800.webp`,
    srcSet: `${base}-400.webp 400w, ${base}-800.webp 800w`,
    alt: `Representative photo for ${product.name}`,
    credit: { name: p.name, url: p.page, source: p.source ?? 'Unsplash' },
  };
}

/** Swaps the generated illustrations for the licensed photo when one exists. */
export function withPhotos(product: Product): Product {
  const p = PRODUCT_PHOTOS[product.slug];
  if (!p) return product;
  const img = photoImage(product, p);
  return { ...product, images: [img], usageExample: { ...product.usageExample, images: [img] } };
}
