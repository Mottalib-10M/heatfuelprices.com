import { defineGuide } from '../../lib/page-types';
import { KIT as K } from '../../lib/kit';

const ny = K.L.ny;
const li = ny.ho.longIsland;
const nyc = ny.ho.nyc;
const sw = ny.ho.statewide;
const regs = Object.keys(ny.ho).filter((k) => k !== 'statewide').sort((a, b) => ny.ho[b].last[1] - ny.ho[a].last[1]);
const eiaNY = K.sum('NY', 'ho')!;
const liYa = li.yearAgo;

export default defineGuide({
  id: 'long-island-heating-oil-prices', group: 'prices', order: 3, slug: 'long-island-heating-oil-prices',
  nav: 'Long Island and New York regions', card: 'NYSERDA\'s weekly heating oil and propane prices for Long Island, NYC and upstate regions.',
  title: 'Long Island Heating Oil Prices This Week, NY Regions 2026',
  description: `Long Island heating oil prices from New York's weekly regional survey, 2026-27: Nassau and Suffolk against NYC, the Hudson Valley and upstate, with costs.`,
  h1: 'Long Island heating oil prices and the other New York regions',
  intro: `Long Island averaged ${K.ppg(li.last[1])} a gallon for heating oil in NYSERDA's survey of ${K.day(li.last[0])}, against ${K.ppg(sw.last[1])} statewide.`,
  resume: `New York State publishes its own weekly survey of home heating oil and propane prices by region, collected by NYSERDA and posted on the state's open data portal. In the survey of ${K.day(li.last[0])}, Long Island paid ${K.ppg(li.last[1])} a gallon for heating oil, New York City ${K.ppg(nyc.last[1])} and the state as a whole ${K.ppg(sw.last[1])}. ${liYa ? `A year earlier Long Island stood at ${K.ppg(liYa[1])}, so the same 200-gallon delivery cost ${K.usd(200 * liYa[1])} then and ${K.usd(200 * li.last[1])} now.` : ''} Long Island ranks ${regs.indexOf('longIsland') + 1} of the ${regs.length} regions from the dearest this week. The federal EIA survey, which this site uses for every other state, gives ${K.ppg(eiaNY.last[1])} for New York in the week of ${K.day(eiaNY.last[0])}; the two surveys sample different dealers and weeks, so a few cents of difference is normal. Prices exclude taxes. The calculator gives the cost of an order in any region for heating oil or propane.`,
  body: (h) => `
<h2>All New York regions this week</h2>
${h.table(['Region', 'Heating oil', 'Week before', 'A year ago', 'Propane'], regs.map((k) => { const x = ny.ho[k]; const p = ny.pr[k]; return [K.NY_REGIONS[k] ?? k, K.ppg(x.last[1]), x.prev ? K.ppg(x.prev[1]) : 'n/a', x.yearAgo ? K.ppg(x.yearAgo[1]) : 'n/a', p ? K.ppg(p.last[1]) : 'grouped']; }), `NYSERDA, average residential prices by region, survey of ${K.day(li.last[0])}, dollars per gallon. Propane: NYSERDA groups the Hudson Valley as one region (Mid-Hudson ${ny.pr.midHudson ? K.ppg(ny.pr.midHudson.last[1]) : 'n/a'}).`, ['l', 'r', 'r', 'r', 'r'])}
<h2>Long Island against the rest of the state</h2>
<p>Long Island's oil-heated homes buy from dealers who serve Nassau and Suffolk counties, and the regional average this week sits ${K.ppg(Math.abs(li.last[1] - sw.last[1]))} ${K.dir(li.last[1] - sw.last[1], 'above', 'below', 'level with')} the state average. Over a 275-gallon fill that is ${K.usd(275 * Math.abs(li.last[1] - sw.last[1]))}. Against New York City the gap is ${K.ppg(Math.abs(li.last[1] - nyc.last[1]))} a gallon, ${K.dir(li.last[1] - nyc.last[1], 'dearer', 'cheaper', 'level')} on the Island.</p>
<p>The New York pages of the federal survey treat the state as one, which hides these differences. For a Long Island household, the regional figure is the better yardstick for a dealer's quote; for comparing New York with Connecticut or New Jersey, the EIA's state averages use the same method everywhere, and the ${h.a('state:new-york', 'New York page')} gives them.</p>
${h.mini('ny', { t: 'Cost of an order in your New York region', p: ['reg', 'gal'], d: { fuel: 'ho', reg: 'longIsland' }, c: 'Open the regional lookup' })}
<h2>The season so far on Long Island</h2>
${(() => { const ss = li.seasons.filter((x) => x.avg); const lastS = ss[ss.length - 1]; return lastS ? `<p>Last winter, the Long Island average ran from ${K.ppg(lastS.min[1])} to ${K.ppg(lastS.max[1])} and averaged ${K.ppg(lastS.avg!)} from November to March. This week's ${K.ppg(li.last[1])} is ${K.pct(Math.abs(li.last[1] / lastS.avg! - 1), 0)} ${K.dir(li.last[1] - lastS.avg!, 'above', 'below', 'away from')} that average. The highest weekly price in the NYSERDA series since October 2013 is ${K.ppg(li.record[1])}, in the week of ${K.day(li.record[0])}.</p>` : ''; })()}
<p>NYSERDA's survey is published with a short delay after the EIA's, and it also runs in some weeks outside the October to March window, so its latest week can differ from the federal one. Each figure on this page carries its own date.</p>
<h2>Propane across New York</h2>
<p>NYSERDA also follows residential propane, with the Hudson Valley grouped as one region. ${(() => { const pk = Object.keys(ny.pr).filter((k) => k !== 'statewide').sort((a, b) => ny.pr[b].last[1] - ny.pr[a].last[1]); return pk.length ? `This week the dearest propane region is ${K.NY_REGIONS[pk[0]] ?? pk[0]} at ${K.ppg(ny.pr[pk[0]].last[1])} a gallon and the cheapest ${K.NY_REGIONS[pk[pk.length - 1]] ?? pk[pk.length - 1]} at ${K.ppg(ny.pr[pk[pk.length - 1]].last[1])}, a gap of ${K.usd(400 * (ny.pr[pk[0]].last[1] - ny.pr[pk[pk.length - 1]].last[1]))} on a 400-gallon fill.` : ''; })()} Propane households on Long Island compare those figures with the gallons of their own tank: a 500-gallon tank filled from 30 % to 80 % takes 250 gallons, and the ${h.a('propane-tank-fill-cost', 'propane tank calculator')} applies the regional or state price to it.</p>
<h2>What a winter costs on Long Island</h2>
<p>NOAA's normals for New York State as a whole count ${K.num(K.SC('NY').hdd.winter)} heating degree days from November to March, a figure weighted by population, so it leans toward the downstate counties where most New Yorkers live. With the EIA's average oil-heated home, that is about ${K.gal(K.est(K.SC('NY'), 'ho'))} for the season, or ${K.usd(K.est(K.SC('NY'), 'ho') * li.last[1])} at this week's Long Island price. The ${h.a('winter-heating-budget', 'winter budget')} lets you replace the average with your own gallons, and the ${h.a('lock-in-or-wait', 'lock-in check')} replays past winters against a dealer's fixed price.</p>
`,
  faqs: [
    { q: 'What is the price of heating oil on Long Island this week?', a: `NYSERDA's regional survey put Long Island at ${K.ppg(li.last[1])} a gallon in the week of ${K.day(li.last[0])}, excluding taxes, against ${K.ppg(sw.last[1])} for New York State. A 150-gallon delivery at that average costs ${K.usd(150 * li.last[1])}. Individual dealers in Nassau and Suffolk can quote above or below the regional average.` },
    { q: 'Why does the Long Island price differ from the EIA New York price?', a: 'They come from two surveys. NYSERDA samples dealers region by region across New York State and publishes on the state\'s open data portal; the EIA samples dealers for its national program and publishes one New York average. Different dealers and reporting days give figures a few cents apart. Each is consistent with itself over time.' },
    { q: 'Is propane cheaper than heating oil on Long Island?', a: `${ny.pr.longIsland ? `Per gallon, ${ny.pr.longIsland.last[1] < li.last[1] ? 'yes' : 'no'}: NYSERDA's Long Island propane average was ${K.ppg(ny.pr.longIsland.last[1])} this week against ${K.ppg(li.last[1])} for oil.` : 'NYSERDA did not publish a Long Island propane price this week.'} Per unit of heat it is another matter, because a gallon of propane holds ${K.pct(K.P.btu.propane / K.P.btu.oil, 0)} of the heat of a gallon of oil, according to the EIA. The heating oil versus propane calculator compares the cost of the same heat.` },
  ],
  tool: 'ny', toolArg: { fuel: 'ho', reg: 'longIsland' },
  related: ['state:new-york', 'heating-oil-prices', 'heating-oil-tank-fill-cost', 'lock-in-or-wait', 'heating-oil-vs-propane'],
  sources: ['nyserda_ho', 'nyserda_pr', 'eia_ho_weekly', 'noaa_hdd'],
});
