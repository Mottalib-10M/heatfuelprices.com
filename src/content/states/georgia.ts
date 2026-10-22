import { defineState } from '../../lib/page-types';
import { KIT as K } from '../../lib/kit';

const st = K.SC('GA');
const p = K.sum('GA', 'pr')!;
const pld = K.lastDone('GA', 'pr')!;
const galP = K.est(st, 'pr');
const rp = K.replay(p.seasons.filter((x) => x.s !== p.season), p.last[1]);
const gap = (c: string) => { const d = p.last[1] - K.price(c, 'pr')!; return `${K.ppg(Math.abs(d))} ${K.dir(d, 'dearer', 'cheaper', 'level')}`; };

export default defineState({
  slug: 'georgia',
  title: 'Georgia Propane Prices This Week, Winter 2026-27 Survey',
  description: `Georgia propane prices this week from the federal survey, winter 2026-27: price per gallon, wholesale and margin, the cost of a tank fill and of a mild winter.`,
  intro: `Georgia propane averaged ${K.ppg(p.last[1])} a gallon in the EIA survey of ${K.day(p.last[0])}.`,
  resume: `Georgia's homes heat mostly with electricity and utility gas, but the Census Bureau's 2024 survey counts ${K.num(st.acs.propane)} heated mainly with propane, ${K.pct(st.acs.propaneShare, 1)} of occupied homes. For them the reference price is the EIA's weekly survey, which in the week of ${K.day(p.last[0])} put Georgia propane at ${K.ppg(p.last[1])} a gallon, ${K.ord(K.place('GA', 'pr'))} of ${K.ranked('pr').length} states counting from the dearest and ${K.ppg(Math.abs(p.last[1] - K.price('US', 'pr')!))} ${K.dir(p.last[1] - K.price('US', 'pr')!, 'above', 'below', 'level with')} the national average. Last winter the state's average from November to March was ${K.ppg(pld.avg!)}. A normal Georgia winter counts only ${K.num(st.hdd.winter)} heating degree days over those months, so the EIA's average propane home in the South would burn about ${K.gal(galP)} for heat, ${K.usd(galP * p.last[1])} at this week's price. Cooking and hot water come on top. The EIA does not survey heating oil in Georgia. Prices exclude taxes and delivery fees.`,
  body: (h) => `
<h2>Wholesale and the dealer's share</h2>
<p>The EIA's wholesale propane price for Georgia this week is ${p.wholesale ? K.ppg(p.wholesale) : 'unpublished'}. ${K.spread('GA', 'pr') === null ? 'Without it the margin cannot be computed.' : `The residential average is ${K.ppg(K.spread('GA', 'pr')!)} above it, so the fuel is about ${K.pct(p.wholesale! / p.last[1], 0)} of the price and delivery, storage, the tank and the dealer about ${K.pct(K.spread('GA', 'pr')! / p.last[1], 0)}.`} That split is why the price at the house moves more slowly than the wholesale market.</p>
${h.mini('fill', { t: 'Propane fill in Georgia', p: ['tank', 'gauge'], d: { st: 'GA', fuel: 'pr', tank: 250, gauge: 20 }, c: 'Open the tank fill calculator' })}
<h2>Past winters in Georgia</h2>
<p>Last winter the Georgia average ran from ${K.ppg(pld.min[1])} to ${K.ppg(pld.max[1])}, its dearest week on ${K.day(pld.max[0])}. The highest week the survey has recorded in Georgia is ${K.ppg(p.record[1])}, on ${K.day(p.record[0])}. Since ${p.seasons[0].s}, the November to March average finished above the mid-October price in ${rp.up} of ${rp.n} winters. The ${h.a('lock-in-or-wait', 'lock-in check')} runs a dealer's fixed price against each of them.</p>
<h2>Georgia and its neighbors</h2>
<p>This week Georgia propane is ${gap('FL')} than Florida's average, ${gap('AL')} than Alabama's, ${gap('TN')} than Tennessee's and ${gap('NC')} than North Carolina's. A 250-gallon tank filled from 20 % to 80 % takes 150 gallons, ${K.usd(150 * p.last[1])} at the Georgia average; a 500-gallon tank from 30 % takes 250 gallons, ${K.usd(250 * p.last[1])}.</p>
<h2>A short heating season</h2>
<p>NOAA's population-weighted normals give Georgia ${K.num(st.hdd.month['12'])} heating degree days in December and ${K.num(st.hdd.month['01'])} in January, about ${K.pct(st.hdd.month['01'] / K.SC('OH').hdd.month['01'], 0)} of an Ohio January. A propane tank lasts much longer here than in the Midwest, and the year's gallons can be split between heat, hot water and cooking. The ${h.a('winter-heating-budget', 'winter budget')} takes the gallons you actually buy, and the ${h.a('how-long-will-my-oil-last', 'days-left calculator')} turns a gauge reading into a date at the normal pace of the coming months. Per million Btu at the ENERGY STAR furnace rating, Georgia propane heat costs ${K.usd(K.perMBtu({ price: p.last[1], btu: K.P.btu.propane, efficiency: K.P.efficiency.propane }))} this week; the ${h.a('heating-oil-vs-propane', 'comparison page')} sets it against electricity. The federal LIHEAP ceiling for four people in Georgia is ${K.usd(K.liheap('GA', 4))} a year.</p>
`,
  faqs: [
    { q: 'What does propane cost in Georgia this week?', a: `Georgia's residential propane stood at ${K.ppg(p.last[1])} per gallon in the federal numbers for ${K.day(p.last[0])}, before any tax; nationally it was ${K.ppg(K.price('US', 'pr')!)}. Refilling a 250-gallon tank from 20 % to 80 %, a 150-gallon order, runs near ${K.usd(150 * p.last[1])}. A leased tank ties you to one supplier's price.` },
    { q: 'How many Georgia homes heat with propane?', a: `Georgia counts ${K.num(st.acs.propane)} homes whose primary heat is propane, ${K.pct(st.acs.propaneShare, 1)} of the occupied stock in the 2024 Census estimates. Electric systems warm ${K.num(st.acs.electric)} homes and gas mains ${K.num(st.acs.gas)}. The ${K.num(st.acs.oil)} homes on fuel oil or kerosene are outside the EIA's Georgia coverage.` },
    { q: 'How much propane does a Georgia home use to heat through the winter?', a: `Georgia's mild normal, ${K.num(st.hdd.winter)} degree days across November to March, translates the EIA's southern propane home into roughly ${K.gal(galP)} for space heating, about ${K.usd(galP * p.last[1])} at the going rate. Gas logs, a range and a water heater on the same tank add to the annual total.` },
  ],
  related: ['propane-tank-fill-cost', 'propane-prices', 'lock-in-or-wait', 'state:florida', 'state:alabama', 'state:tennessee'],
});
