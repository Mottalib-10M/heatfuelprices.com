import { defineState } from '../../lib/page-types';
import { KIT as K } from '../../lib/kit';

const st = K.SC('NY');
const o = K.sum('NY', 'ho')!;
const p = K.sum('NY', 'pr')!;
const ld = K.lastDone('NY', 'ho')!;
const ny = K.L.ny;
const regs = Object.keys(ny.ho).filter((k) => k !== 'statewide').sort((a, b) => ny.ho[b].last[1] - ny.ho[a].last[1]);
const gal = K.est(st, 'ho');

export default defineState({
  slug: 'new-york',
  title: 'New York Heating Oil Prices This Week, by Region, 2026-27',
  description: `New York heating oil prices this week from the federal and state surveys, 2026-27: the EIA average, NYSERDA's regions from Long Island to the North Country.`,
  intro: `New York heating oil averaged ${K.ppg(o.last[1])} a gallon in the EIA survey of ${K.day(o.last[0])}; propane ${K.ppg(p.last[1])}.`,
  resume: `New York has more oil-heated homes than any other state: ${K.num(st.acs.oil)} by the Census Bureau's 2024 count, ${K.pct(st.acs.oilShare, 0)} of occupied homes. In the EIA's survey of ${K.day(o.last[0])}, heating oil averaged ${K.ppg(o.last[1])} a gallon in the state, ${K.ord(K.place('NY', 'ho'))} of ${K.ranked('ho').length}, and propane ${K.ppg(p.last[1])}. New York also runs its own weekly survey through NYSERDA, region by region: this week the dearest region for oil is ${K.NY_REGIONS[regs[0]]} at ${K.ppg(ny.ho[regs[0]].last[1])} and the cheapest ${K.NY_REGIONS[regs[regs.length - 1]]} at ${K.ppg(ny.ho[regs[regs.length - 1]].last[1])}. Over a normal winter of ${K.num(st.hdd.winter)} heating degree days, weighted toward the downstate population, the EIA's average oil home would burn about ${K.gal(gal)}, which is ${K.usd(gal * o.last[1])} at the state average. Prices in both surveys exclude sales tax and any delivery fee, and a dealer's quote can sit above or below either average.`,
  body: (h) => `
<h2>Two surveys, one state</h2>
<p>The EIA figure on this page uses the same method as every other state, so it is the one to compare New York with New Jersey or Connecticut. NYSERDA's figure, published on the state's open data portal, splits New York into regions whose prices differ by much more than the gap between neighboring states. A household in ${K.NY_REGIONS[regs[0]]} and one in ${K.NY_REGIONS[regs[regs.length - 1]]} paid ${K.ppg(ny.ho[regs[0]].last[1] - ny.ho[regs[regs.length - 1]].last[1])} a gallon apart in NYSERDA's latest survey, ${K.usd(200 * (ny.ho[regs[0]].last[1] - ny.ho[regs[regs.length - 1]].last[1]))} on a 200-gallon delivery.</p>
${h.table(['NYSERDA region', 'Heating oil', 'Propane'], regs.map((k) => [K.NY_REGIONS[k] ?? k, K.ppg(ny.ho[k].last[1]), ny.pr[k] ? K.ppg(ny.pr[k].last[1]) : 'grouped']), `NYSERDA weekly residential prices, survey of ${K.day(ny.ho.statewide.last[0])}, dollars per gallon excluding taxes.`, ['l', 'r', 'r'])}
${h.mini('ny', { t: 'Cost of an order in your region', p: ['reg', 'gal'], d: { fuel: 'ho', reg: 'capital' }, c: 'Open the regional lookup' })}
<p>The ${h.a('long-island-heating-oil-prices', 'Long Island page')} follows Nassau and Suffolk week by week, with the price a year ago and last winter's range for the region.</p>
<h2>The EIA record for New York</h2>
<p>Last winter New York's heating oil averaged ${K.ppg(ld.avg!)} from November to March, between a low week of ${K.ppg(ld.min[1])} and a high of ${K.ppg(ld.max[1])} on ${K.day(ld.max[0])}. The highest week since 2013 was ${K.ppg(o.record[1])}. The EIA's wholesale price for New York this week, ${o.wholesale ? K.ppg(o.wholesale) : 'not published'}, leaves a dealer spread of ${K.spread('NY', 'ho') === null ? 'unknown size' : K.ppg(K.spread('NY', 'ho')!)}.</p>
<h2>Propane in New York</h2>
<p>${K.num(st.acs.propane)} New York homes heat with propane, ${K.pct(st.acs.propaneShare, 1)} of the total. The EIA's propane average for the state ranks ${K.ord(K.place('NY', 'pr'))} of ${K.ranked('pr').length} this week; its wholesale figure is ${p.wholesale ? K.ppg(p.wholesale) : 'not published'}. For a propane household, the ${h.a('lock-in-or-wait', 'lock-in check')} replays every winter since 2013-14 against a dealer's fixed price, and the ${h.a('liheap-income-limits', 'LIHEAP page')} gives the income ceiling for heating help, ${K.usd(K.liheap('NY', 4))} a year for four people in New York.</p>
<h2>The New York winter, month by month</h2>
<p>NOAA's population-weighted normals give New York ${K.num(st.hdd.month['11'])} heating degree days in November, ${K.num(st.hdd.month['01'])} in January and ${K.num(st.hdd.month['03'])} in March. Because most New Yorkers live downstate, those figures understate the cold of the North Country and the Southern Tier, where the same house burns more oil. A household with its own delivery tickets should use those gallons in the ${h.a('winter-heating-budget', 'winter budget')} rather than the state average, and check the next fill with the ${h.a('heating-oil-tank-fill-cost', 'tank fill calculator')} at the regional price.</p>
`,
  faqs: [
    { q: 'What is the average heating oil price in New York State this week?', a: `The EIA's survey of ${K.day(o.last[0])} gives ${K.ppg(o.last[1])} a gallon for New York, excluding taxes. NYSERDA's own statewide figure was ${K.ppg(ny.ho.statewide.last[1])} in its survey of ${K.day(ny.ho.statewide.last[0])}. The two surveys sample different dealers, so they rarely match to the cent.` },
    { q: 'Which part of New York has the cheapest heating oil?', a: `In NYSERDA's latest survey, ${K.NY_REGIONS[regs[regs.length - 1]]} at ${K.ppg(ny.ho[regs[regs.length - 1]].last[1])} a gallon. The dearest was ${K.NY_REGIONS[regs[0]]} at ${K.ppg(ny.ho[regs[0]].last[1])}. The order of the regions changes from one week to the next, and individual dealers inside a region quote above and below the average.` },
    { q: 'How many New York homes still heat with oil?', a: `${K.num(st.acs.oil)}, the largest number of any state, according to the Census Bureau's 2024 American Community Survey. They are ${K.pct(st.acs.oilShare, 1)} of occupied homes; utility gas heats ${K.num(st.acs.gas)} and electricity ${K.num(st.acs.electric)}. Propane heats ${K.num(st.acs.propane)}. The Census count of oil homes includes those burning kerosene, which the survey groups with fuel oil in a single category.` },
  ],
  related: ['long-island-heating-oil-prices', 'heating-oil-prices', 'lock-in-or-wait', 'state:new-jersey', 'state:connecticut', 'state:pennsylvania'],
});
