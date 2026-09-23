/**
 * Category taxonomy — seeded verbatim from the HFE category sheet.
 * The seven navigation groups are an editorial layer for the mega-menu only.
 */
import type { Category, CategoryGroup, IconName } from '@/types';

export const slugify = (s: string) =>
  s
    .toLowerCase()
    .replace(/&/g, 'and')
    .replace(/[()]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');

type Raw = [name: string, icon: IconName];

const GROUPS: { name: string; blurb: string; icon: IconName; items: Raw[] }[] = [
  {
    name: 'Home & Kitchen',
    blurb: 'Everyday swaps for a non-toxic home.',
    icon: 'pot',
    items: [
      ['Clean energy cookware', 'pot'],
      ['Durable and non-toxic cleaning cloths', 'cloth'],
      ['Non-toxic and biodegradable cleaner', 'spray'],
      ['Recyclable and compostable dishware', 'plate'],
      ['Sustainable kitchenware', 'pot'],
      ['Sustainable and eco-friendly container', 'box'],
      ['Sustainable and zero-waste paper product', 'paper'],
      ['Biodegradable and recyclable packaging', 'box'],
    ],
  },
  {
    name: 'Energy & Climate',
    blurb: 'Clean power, heat and air for every room.',
    icon: 'sun',
    items: [
      ['Clean energy generator (solar & wind)', 'sun'],
      ['Clean energy fuel', 'flame'],
      ['Sustainable battery', 'battery'],
      ['Sustainable solar energy light', 'lamp'],
      ['Heat pumps (ducted)', 'wind'],
      ['Geothermal heat pumps', 'gauge'],
      ['Gas water heaters', 'flame'],
      ['Energy-efficient air dehumidifier', 'drop'],
      ['Sustainable air purifier', 'wind'],
    ],
  },
  {
    name: 'Yard & Garden',
    blurb: 'Quiet electric tools and living-soil care.',
    icon: 'sprout',
    items: [
      ['Electric lawn mowers', 'mower'],
      ['Electric leaf blowers', 'wind'],
      ['Electric string trimmers & edgers', 'mower'],
      ['Organic and environmentally friendly fertilizer', 'sprout'],
      ['Organic pesticides', 'bug'],
      ['Organic and environmentally friendly disease control', 'leaf'],
      ['Eco- & pet-friendly ice melters', 'snow'],
    ],
  },
  {
    name: 'Water',
    blurb: 'Drink clean, waste less, catch leaks early.',
    icon: 'drop',
    items: [
      ['Sustainable water purifier', 'drop'],
      ['Sustainable and eco-friendly water bottle', 'bottle'],
      ['Water leaks detector', 'gauge'],
      ['Water-use reduction hardware', 'drop'],
    ],
  },
  {
    name: 'Body & Wellness',
    blurb: 'Clean ingredients, zero-waste rituals.',
    icon: 'heart',
    items: [
      ['Eco-friendly and zero-waste body wellness', 'heart'],
      ['Eco-friendly personal care', 'leaf'],
      ['Nutrient supplement', 'pill'],
    ],
  },
  {
    name: 'Build & Move',
    blurb: 'Materials, shelter and transport for the long run.',
    icon: 'brick',
    items: [
      ['Sustainable building materials', 'brick'],
      ['Sustainable alternative housing', 'home'],
      ['Non-toxic paints & coatings', 'spray'],
      ['Green transportation', 'car'],
    ],
  },
  {
    name: 'Preparedness',
    blurb: 'Resilient gear that stays ready, not toxic.',
    icon: 'shield',
    items: [
      ['Emergency equipment', 'shield'],
      ['Survival kit', 'tent'],
    ],
  },
];

export const categoryGroups: CategoryGroup[] = GROUPS.map((g) => ({
  slug: slugify(g.name),
  name: g.name,
  blurb: g.blurb,
  icon: g.icon,
  categories: g.items.map(([name, icon]) => ({ slug: slugify(name), name, group: g.name, icon })),
}));

export const categories: Category[] = categoryGroups
  .flatMap((g) => g.categories)
  .sort((a, b) => a.name.localeCompare(b.name));

export const categoryBySlug = (slug: string) => categories.find((c) => c.slug === slug);
export const categoryByName = (name: string) => categories.find((c) => c.name === name);
