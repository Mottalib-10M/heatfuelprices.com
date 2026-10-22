import { defineState } from '../../lib/page-types';
import { KIT as K } from '../../lib/kit';

const st = K.SC('MS');
const p = K.sum('MS', 'pr')!;
const pld = K.lastDone('MS', 'pr')!;
const galP = K.est(st, 'pr');
const south = K.STATES.filter((x) => x.region === 'South').sort((a, b) => b.acs.propaneShare - a.acs.propaneShare);
const sRank = south.findIndex((x) => x.code === 'MS') + 1;
const done = p.seasons.filter((x) => x.avg);
const pcheap = done.reduce((a, b) => (b.avg! < a.avg! ? b : a));
const gap = (c: string) => { const d = p.last[1] - K.price(c, 'pr')!; return `${K.ppg(Math.abs(d))} ${K.dir(d, 'dearer', 'cheaper', 'level')}`; };

export default defineState({
  slug: 'mississippi',
  title: 'Mississippi Propane Prices This Week, Winter 2026-27',
  description: `Mississippi propane prices from the federal weekly survey, winter 2026-27: one home in ten on propane, the dealer margin, a tank fill and a mild winter's cost.`,
  intro: `Mississippi propane averaged ${K.ppg(p.last[1])} a gallon in the EIA survey of ${K.day(p.last[0])}.`,
  resume: `Mississippi has the ${sRank === 1 ? '' : `${K.ord(sRank)} `}highest share of propane-heated homes among the ${south.length} southern states of the federal survey${sRank === 1 ? '' : `, after ${south.slice(0, sRank - 1).map((x) => x.name).join(' and ')}`}: the Census Bureau's 2024 count is ${K.num(st.acs.propane)}, ${K.pct(st.acs.propaneShare, 1)} of occupied homes, against ${K.pct(K.SC('AL').acs.propaneShare, 1)} in Alabama and ${K.pct(K.SC('TX').acs.propaneShare, 1)} in Texas. In the EIA's weekly survey of ${K.day(p.last[0])}, Mississippi propane averaged ${K.ppg(p.last[1])} a gallon, ${K.ord(K.place('MS', 'pr'))} of ${K.ranked('pr').length} states counting from the dearest and ${K.ppg(Math.abs(p.last[1] - K.price('US', 'pr')!))} ${K.dir(p.last[1] - K.price('US', 'pr')!, 'above', 'below', 'level with')} the national average. Last winter the state averaged ${K.ppg(pld.avg!)} from November to March; the cheapest winter on file was ${pcheap.s}, at ${K.ppg(pcheap.avg!)}. A normal Mississippi winter counts ${K.num(st.hdd.winter)} heating degree days over those months, so the EIA's average propane home in the South would burn about ${K.gal(galP)} for heat, ${K.usd(galP * p.last[1])} at this week's price. The EIA does not survey heating oil in Mississippi. Prices exclude taxes and delivery fees.`,
  body: (h) => `
<h2>Fuel versus delivery in the Mississippi price</h2>
<p>For Mississippi the EIA does print a wholesale propane number, ${p.wholesale ? K.ppg(p.wholesale) : 'though not in this release'}. ${K.spread('MS', 'pr') === null ? 'The retail-wholesale gap therefore cannot be worked out this week.' : `Retail runs ${K.ppg(K.spread('MS', 'pr')!)} higher, so out of every dollar a household spends on propane about ${K.pct(p.wholesale! / p.last[1], 0)} cents buy the molecule and the remaining ${K.pct(K.spread('MS', 'pr')! / p.last[1], 0)} cover the truck, the bulk plant, the tank and the retailer.`} A swing in wholesale prices reaches the household only diluted by that layer.</p>
${h.mini('fill', { t: 'Propane fill in Mississippi', p: ['tank', 'gauge'], d: { st: 'MS', fuel: 'pr', tank: 250, gauge: 25 }, c: 'Open the tank fill calculator' })}
<h2>Mississippi seasons in the record</h2>
<p>Through last November to March, weekly Mississippi averages moved between ${K.ppg(pld.min[1])} and ${K.ppg(pld.max[1])}; the top came on ${K.day(pld.max[0])}. No week in the file beats ${K.ppg(p.record[1])}, set on ${K.day(p.record[0])}. Each past winter is listed on the ${h.a('heating-oil-price-history', 'history page')}, and the ${h.a('lock-in-or-wait', 'lock-or-wait tool')} shows how a fixed offer would have fared in each.</p>
<h2>Next door: Alabama, Tennessee, Arkansas</h2>
<p>Mississippi's average this week is ${gap('AL')} than Alabama's, ${gap('TN')} than Tennessee's and ${gap('AR')} than Arkansas's; Louisiana is not priced by the survey. Two sample orders at the Mississippi average: 137.5 gallons into a 250-gallon tank sitting at 25 %, ${K.usd(137.5 * p.last[1])}, and 250 gallons into a 500-gallon tank at 30 %, ${K.usd(250 * p.last[1])}. Any other combination, fee included, goes through the ${h.a('propane-tank-fill-cost', 'fill calculator')}.</p>
<h2>Heat is the smaller part of the year</h2>
<p>December normally brings ${K.num(st.hdd.month['12'])} degree days to Mississippi and January ${K.num(st.hdd.month['01'])}, by NOAA's population weighting, roughly ${K.pct(st.hdd.month['01'] / K.SC('MO').hdd.month['01'], 0)} of what Missouri sees in January. Over twelve months a propane household here may use a good part of its gallons for hot water and cooking, which the heating estimate ignores; enter actual purchases in the ${h.a('winter-heating-budget', 'budget tool')}. Heat delivered by a 90 % furnace costs ${K.usd(K.perMBtu({ price: p.last[1], btu: K.P.btu.propane, efficiency: K.P.efficiency.propane }))} per million Btu at today's Mississippi price, a figure the ${h.a('heating-oil-vs-propane', 'fuel comparison')} puts beside electric heat, the state's leading choice. LIHEAP's federal income cap for a household of three is ${K.usd(K.liheap('MS', 3))} here (method on the ${h.a('liheap-income-limits', 'LIHEAP page')}).</p>
`,
  faqs: [
    { q: 'What is the propane price in Mississippi this week?', a: `Mississippi averaged ${K.ppg(p.last[1])} a gallon in the EIA's residential survey for ${K.day(p.last[0])}, tax not included; the nationwide average was ${K.ppg(K.price('US', 'pr')!)}. That makes a 137.5-gallon top-up of a 250-gallon tank, from a quarter to 80 %, cost roughly ${K.usd(137.5 * p.last[1])}. Local quotes differ.` },
    { q: 'How many homes in Mississippi heat with propane?', a: `Some ${K.num(st.acs.propane)} Mississippi households, ${K.pct(st.acs.propaneShare, 1)} of the occupied total, name propane as their main heating fuel in the Census Bureau's 2024 survey, the ${sRank === 1 ? '' : `${K.ord(sRank)} `}highest share among the ${south.length} southern states priced by the EIA. Electricity heats ${K.num(st.acs.electric)} and gas ${K.num(st.acs.gas)}.` },
    { q: 'How much propane does a Mississippi home burn for heat?', a: `On a normal Mississippi winter of ${K.num(st.hdd.winter)} degree days, November to March, the EIA's southern propane home works out at about ${K.gal(galP)} of heating fuel, near ${K.usd(galP * p.last[1])} at the current average. Cooking and water heating continue through the summer on top.` },
  ],
  related: ['propane-tank-fill-cost', 'heating-oil-price-history', 'propane-prices', 'state:alabama', 'state:arkansas', 'state:tennessee'],
});
