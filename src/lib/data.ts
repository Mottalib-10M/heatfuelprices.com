/**
 * The site's data asset (light enough for the browser calculators):
 *  - latest.json  scripts/update-data.py, every Wednesday: EIA weekly residential and wholesale prices,
 *                 summarized by state and fuel (this week, last week, a year ago, every season since 2013-14),
 *                 and NYSERDA's regional prices for New York;
 *  - states.json  scripts/build-states.py: the 38 states of the EIA survey (NOAA heating degree day normals,
 *                 Census ACS 2024 heating fuel counts, LIHEAP 60 % of state median income FY2027);
 *  - winter.json  the same script: EIA Winter Fuels Outlook 2026-27, Table WF01.
 */
import LATEST_RAW from '../data/latest.json';
import STATES_RAW from '../data/states.json';
import OTHER_RAW from '../data/liheap-other-states.json';
import WINTER_RAW from '../data/winter.json';

export type Fuel = 'ho' | 'pr';
export type Pt = [string, number];
export interface Season { s: string; oct: number | null; octDate: string | null; avg: number | null; weeks: number; max: Pt; min: Pt }
export interface Summary { last: Pt; prev: Pt | null; yearAgo: Pt | null; season: string; first: Pt; seasons: Season[]; record: Pt; wholesale?: number | null }
export interface StateRow {
  code: string; name: string; slug: string; region: 'Northeast' | 'Midwest' | 'South' | 'West'; padd: string; ho: boolean; pr: boolean;
  hdd: { year: number; winter: number; month: Record<string, number> };
  acs: { homes: number; gas: number; propane: number; electric: number; oil: number; wood: number; oilShare: number; propaneShare: number };
  smi: { smi4: number; sixty: number[] };
}
interface Latest {
  release_date: string; next_release: string; last_week: string; retrieved_at: string; ny_retrieved_at?: string;
  ho: Record<string, Summary>; pr: Record<string, Summary>; ny: { ho: Record<string, Summary>; pr: Record<string, Summary> };
}
type Num3 = { base: number; warmer: number; colder: number; history: Record<string, number> };
interface Winter {
  release: string; seasons: string[];
  ho: Record<string, { gal: Num3; price: Num3; spend: Num3 }>;
  pr: Record<string, { gal: Num3; price: Num3; spend: Num3 }>;
  hdd: Record<string, Num3>;
  households: Record<string, { ho: number; pr: number }>;
}

export const L = LATEST_RAW as unknown as Latest;
export const STATES = STATES_RAW as unknown as StateRow[];
export const W = WINTER_RAW as unknown as Winter;
/** States outside the price survey, for the LIHEAP limit only (48 contiguous states and DC). */
export const OTHER = OTHER_RAW as unknown as Array<{ code: string; name: string; smi: { smi4: number; sixty: number[] } }>;

export const stateBySlug = (slug: string) => { const s = STATES.find((x) => x.slug === slug); if (!s) throw new Error(`Unknown state ${slug}`); return s; };
export const stateByCode = (code: string) => { const s = STATES.find((x) => x.code === code); if (!s) throw new Error(`Unknown state ${code}`); return s; };
/** The weekly summary of a state (or 'US', or a PADD code) for a fuel; null when the EIA does not publish it. */
export const sum = (code: string, f: Fuel): Summary | null => L[f][code] ?? null;
export const price = (code: string, f: Fuel): number | null => sum(code, f)?.last[1] ?? null;
/** States publishing a fuel this week, ranked from the most to the least expensive. */
export const ranked = (f: Fuel) => STATES.filter((s) => sum(s.code, f)).sort((a, b) => price(b.code, f)! - price(a.code, f)!);
export const placeOf = (code: string, f: Fuel) => ranked(f).findIndex((s) => s.code === code) + 1;
export const FUEL_NAME: Record<Fuel, string> = { ho: 'heating oil', pr: 'propane' };
export const PADD_NAME: Record<string, string> = {
  R10: 'East Coast (PADD 1)', R1X: 'New England (PADD 1A)', R1Y: 'Central Atlantic (PADD 1B)', R1Z: 'Lower Atlantic (PADD 1C)',
  R20: 'Midwest (PADD 2)', R30: 'Gulf Coast (PADD 3)', R40: 'Rocky Mountain (PADD 4)',
};
export const NY_REGIONS: Record<string, string> = {
  statewide: 'New York State average', longIsland: 'Long Island', nyc: 'New York City', lowerHudson: 'Lower Hudson Valley',
  upperHudson: 'Upper Hudson Valley', midHudson: 'Mid-Hudson Valley', capital: 'Capital District', northCountry: 'North Country',
  central: 'Central New York', western: 'Western New York',
};
