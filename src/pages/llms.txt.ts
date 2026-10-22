/** llms.txt (RECETTE §21), generated from the page registry. */
import { GUIDES, STATE_PAGES, stateId } from '../lib/pages';
import { SITE_URL, LAST_UPDATED, SITE_NAMES } from '../data/site-config';
import { route } from '../i18n/routes';
import { GROUPS, label } from '../i18n/nav';
import { L } from '../lib/data';
export function GET() {
  const lines = [
    `# ${SITE_NAMES.en}`, '',
    `> Residential heating oil and propane prices in the United States, state by state, from the Energy Information Administration's weekly survey (October to March, excluding taxes; latest week ${L.last_week}), with NYSERDA's regional prices for New York. Calculators for the cost of filling an oil or propane tank (propane tanks filled to about 80 % under 29 CFR 1910.110), a winter heating budget scaled to each state's NOAA degree days, the choice between a fixed-price contract and the weekly price (replayed on every winter since 2013-14), the days a tank lasts, the federal LIHEAP income ceiling (42 U.S.C. 8624) and the cost of heat from oil, propane and electricity. Independent site published by Radif Partners, not affiliated with the EIA or any dealer. Source: U.S. Energy Information Administration. Last updated ${LAST_UPDATED}.`, '',
    ...GROUPS.flatMap((g) => [`## ${g.label}`, ...GUIDES.filter((p) => p.group === g.id).map((p) => `- [${p.nav}](${SITE_URL}${route(p.id, 'en')}): ${p.card}`), '']),
    '## States', ...STATE_PAGES.map((s) => `- [${label(stateId(s.slug))}](${SITE_URL}${route(stateId(s.slug), 'en')}): ${s.intro}`), '',
    '## About', `- [Where the prices come from](${SITE_URL}${route('method', 'en')})`, `- [About](${SITE_URL}${route('about', 'en')})`,
  ];
  return new Response(lines.join('\n') + '\n', { headers: { 'Content-Type': 'text/plain; charset=utf-8' } });
}
