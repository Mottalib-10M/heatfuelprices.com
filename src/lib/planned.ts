/** Every page id the site is meant to have. Content tests accept links to these ids while pages are being
 *  written; the "all planned pages exist" test fails until each has its file. */
import STATES from '../data/states.json';
export const PLANNED_GUIDES = [
  'heating-oil-prices', 'propane-prices', 'long-island-heating-oil-prices', 'heating-oil-price-history', 'heating-oil-price-forecast',
  'heating-oil-tank-fill-cost', 'propane-tank-fill-cost', 'winter-heating-budget', 'how-long-will-my-oil-last', 'heating-oil-vs-propane',
  'lock-in-or-wait', 'liheap-income-limits',
];
export const PLANNED_STATES = (STATES as Array<{ slug: string }>).map((s) => s.slug);
export const PLANNED_IDS = new Set<string>([...PLANNED_GUIDES, ...PLANNED_STATES.map((s) => `state:${s}`)]);
