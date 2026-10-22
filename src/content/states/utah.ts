import { defineState } from '../../lib/page-types';
import { KIT as K } from '../../lib/kit';

const st = K.SC('UT');
const p = K.sum('UT', 'pr')!;
const pld = K.lastDone('UT', 'pr')!;
const galP = K.est(st, 'pr');
const yp = K.yoy('UT', 'pr');
const rp = K.replay(p.seasons.filter((x) => x.s !== p.season), p.last[1]);
const gap = (c: string) => { const d = p.last[1] - K.price(c, 'pr')!; return `${K.ppg(Math.abs(d))} ${K.dir(d, 'dearer', 'cheaper', 'level')}`; };

export default defineState({
  slug: 'utah',
  title: 'Utah Propane Prices This Week, Winter 2026-27 Federal Survey',
  description: `Utah propane prices from the federal weekly survey, winter 2026-27: the highest share of gas heat, the price per gallon, a tank fill and a winter's cost.`,
  intro: `Utah propane averaged ${K.ppg(p.last[1])} a gallon in the EIA survey of ${K.day(p.last[0])}.`,
  resume: `Utah has the highest share of gas-heated homes of all ${K.STATES.length} states in the federal survey: ${K.pct(st.acs.gas / st.acs.homes, 0)} by the Census Bureau's 2024 count. Propane is the main heating fuel of ${K.num(st.acs.propane)} homes, ${K.pct(st.acs.propaneShare, 1)} of the total, a small market but one the EIA prices every week. In the survey of ${K.day(p.last[0])}, Utah propane averaged ${K.ppg(p.last[1])} a gallon${yp === null ? '' : `, ${K.pct(Math.abs(yp), 0)} ${K.dir(yp, 'more', 'less')} than a year earlier`}, ${K.ord(K.place('UT', 'pr'))} of ${K.ranked('pr').length} states counting from the dearest and ${K.ppg(Math.abs(p.last[1] - K.price('US', 'pr')!))} ${K.dir(p.last[1] - K.price('US', 'pr')!, 'above', 'below', 'level with')} the national average. A normal Utah winter counts ${K.num(st.hdd.winter)} heating degree days from November to March. The EIA publishes no propane outlook for the West, so this site scales its national average home to Utah's weather: about ${K.gal(galP)} for the season, ${K.usd(galP * p.last[1])} at this week's price. Last winter Utah propane averaged ${K.ppg(pld.avg!)}. Heating oil is not surveyed here. Prices exclude taxes and fees.`,
  body: (h) => `
<h2>Where a Utah propane dollar goes</h2>
<p>No wholesale propane figure is published for Utah itself. For the five Rocky Mountain states together, the EIA's wholesale price this week is ${K.sum('R40', 'pr')?.wholesale ? K.ppg(K.sum('R40', 'pr')!.wholesale!) : 'missing from the release'}; set against Utah's ${K.ppg(p.last[1])}, ${K.sum('R40', 'pr')?.wholesale ? `roughly ${K.pct(1 - K.sum('R40', 'pr')!.wholesale! / p.last[1], 0)} of the residential price is trucking, storage, tank rental and margin rather than fuel` : 'the split between fuel and margin cannot be estimated'}. During the last full season, November through March, Utah households saw weekly averages between ${K.ppg(pld.min[1])} and ${K.ppg(pld.max[1])}, peaking on ${K.day(pld.max[0])}. Utah's all-time high in this series is ${K.ppg(p.record[1])} (${K.day(p.record[0])}).</p>
${h.mini('lockin', { t: 'A Utah fixed price', p: ['fixed', 'gal'], d: { st: 'UT', fuel: 'pr' }, c: 'Open the lock-in check' })}
<h2>Should a Utah household lock?</h2>
<p>Take the mid-October survey price of each season since ${p.seasons[0].s} and compare it with what the following winter actually averaged: the winter came out dearer ${rp.up} times out of ${rp.n}, and the typical gap was ${K.pct(rp.median, 1)}. A pre-buy at today's level would have looked good in those dearer years and poor in the others. Put your dealer's offer into the ${h.a('lock-in-or-wait', 'lock-in check')} to see each year's outcome in dollars.</p>
<h2>Comparing with nearby markets</h2>
<p>Only two neighbors appear in the federal propane survey. Today Utah sits ${gap('CO')} than Colorado and ${gap('ID')} than Idaho, and ${gap('R40')} than the Rocky Mountain average. For a 400-gallon delivery, Utah's average works out at ${K.usd(400 * p.last[1])}; a small 120-gallon cylinder refilled from a fifth to 80 % takes 72 gallons, ${K.usd(72 * p.last[1])}. Other tank sizes are in the ${h.a('propane-tank-fill-cost', 'fill calculator')}.</p>
<h2>Gas country, propane exceptions</h2>
<p>With utility gas in ${K.pct(st.acs.gas / st.acs.homes, 0)} of homes, Utah's propane users are the exception, and NOAA's population-weighted normals, ${K.num(st.hdd.month['01'])} degree days in January and ${K.num(st.hdd.month['12'])} in December, describe the places where most residents live, not an isolated cabin at altitude. Those living higher up should rely on their own tickets in the ${h.a('winter-heating-budget', 'seasonal budget')} and use the ${h.a('how-long-will-my-oil-last', 'tank-life estimate')} as a floor. A million Btu of furnace heat from propane costs ${K.usd(K.perMBtu({ price: p.last[1], btu: K.P.btu.propane, efficiency: K.P.efficiency.propane }))} at this week's price (ENERGY STAR rating); electricity is compared on the ${h.a('heating-oil-vs-propane', 'fuel comparison')}. Federal LIHEAP rules cap eligibility for a four-person Utah household at ${K.usd(K.liheap('UT', 4))} a year (details on the ${h.a('liheap-income-limits', 'LIHEAP page')}).</p>
`,
  faqs: [
    { q: 'What is the price of propane in Utah this week?', a: `The federal survey dated ${K.day(p.last[0])} averages Utah at ${K.ppg(p.last[1])} per gallon before tax, while the national figure is ${K.ppg(K.price('US', 'pr')!)}. Topping up a 500-gallon tank from 30 % to 80 % would therefore run about ${K.usd(250 * p.last[1])}. Expect individual quotes to differ with tank ownership and contract terms.` },
    { q: 'How many Utah homes heat with propane?', a: `The 2024 American Community Survey puts the number at ${K.num(st.acs.propane)}, just ${K.pct(st.acs.propaneShare, 1)} of occupied homes. By contrast ${K.num(st.acs.gas)} Utah homes use utility gas, the largest share among surveyed states, and ${K.num(st.acs.electric)} use electricity, while fuel oil or kerosene serves only ${K.num(st.acs.oil)}.` },
    { q: 'How much propane does a Utah home burn in a winter?', a: `With Utah's ${K.num(st.hdd.winter)} normal degree days for November through March, the EIA's U.S. average propane household scales to roughly ${K.gal(galP)}, or ${K.usd(galP * p.last[1])} at this week's average. A national figure is used because the EIA forecasts no western propane region. Last year's bills remain the best guide.` },
  ],
  related: ['lock-in-or-wait', 'propane-tank-fill-cost', 'propane-prices', 'state:colorado', 'state:idaho', 'state:montana'],
});
