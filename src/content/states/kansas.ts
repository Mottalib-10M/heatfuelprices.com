import { defineState } from '../../lib/page-types';
import { KIT as K } from '../../lib/kit';

const st = K.SC('KS');
const p = K.sum('KS', 'pr')!;
const pld = K.lastDone('KS', 'pr')!;
const galP = K.est(st, 'pr');
const yp = K.yoy('KS', 'pr');
const done = p.seasons.filter((x) => x.avg);
const pdear = done.reduce((a, b) => (b.avg! > a.avg! ? b : a));
const gap = (c: string) => { const d = p.last[1] - K.price(c, 'pr')!; return `${K.ppg(Math.abs(d))} ${K.dir(d, 'dearer', 'cheaper', 'level')}`; };

export default defineState({
  slug: 'kansas',
  title: 'Kansas Propane Prices This Week, Federal Survey 2026-27',
  description: `Kansas propane prices from the federal weekly survey for winter 2026-27: change on a year, the dealer margin, what a fill costs and what a Kansas winter costs.`,
  intro: `Kansas propane averaged ${K.ppg(p.last[1])} a gallon in the EIA survey of ${K.day(p.last[0])}.`,
  resume: `Kansas propane households are a minority, ${K.num(st.acs.propane)} homes or ${K.pct(st.acs.propaneShare, 1)} of the total by the Census Bureau's 2024 count, but a sizable one in a state where utility gas heats most of the rest. In the EIA's weekly survey of ${K.day(p.last[0])}, Kansas propane averaged ${K.ppg(p.last[1])} a gallon${yp === null ? '' : `, ${K.pct(Math.abs(yp), 0)} ${K.dir(yp, 'more', 'less')} than in the same week a year earlier`}. That ranks Kansas ${K.ord(K.place('KS', 'pr'))} of ${K.ranked('pr').length} states counting from the dearest, ${K.ppg(Math.abs(p.last[1] - K.price('US', 'pr')!))} ${K.dir(p.last[1] - K.price('US', 'pr')!, 'above', 'below', 'level with')} the national average. A normal Kansas winter counts ${K.num(st.hdd.winter)} heating degree days from November to March; the EIA's average Midwest propane home, scaled to that weather, would burn about ${K.gal(galP)}, ${K.usd(galP * p.last[1])} at this week's price. The EIA does not survey heating oil in Kansas. All prices exclude taxes and delivery fees.`,
  body: (h) => `
<h2>From wholesale to the tank</h2>
<p>The wholesale propane price the EIA reports for Kansas this week is ${p.wholesale ? K.ppg(p.wholesale) : 'unpublished'}. ${K.spread('KS', 'pr') === null ? 'Without it the margin cannot be measured.' : `The residential average sits ${K.ppg(K.spread('KS', 'pr')!)} above it: ${K.pct(p.wholesale! / p.last[1], 0)} of the price at the house is the fuel, the rest is delivery, storage, the tank and the dealer.`} For a 500-gallon tank filled from 30 % to 80 %, the bill at the average is ${K.usd(250 * p.last[1])}; for a 1,000-gallon tank from 20 %, ${K.usd(600 * p.last[1])}.</p>
${h.mini('price', { t: 'Kansas propane and your order', p: ['gal'], d: { st: 'KS', fuel: 'pr', gal: 300 }, c: 'Open the price lookup' })}
<h2>Past winters in Kansas</h2>
<p>Last winter Kansas propane averaged ${K.ppg(pld.avg!)} a gallon from November to March, with its cheapest week at ${K.ppg(pld.min[1])} and its dearest at ${K.ppg(pld.max[1])}. The dearest winter on file is ${pdear.s}, at ${K.ppg(pdear.avg!)}, and the dearest single week ${K.ppg(p.record[1])}, on ${K.day(p.record[0])}. The ${h.a('heating-oil-price-history', 'price history')} lists every season for Kansas and the other surveyed states.</p>
<h2>Kansas and its neighbors</h2>
<p>This week Kansas propane is ${gap('MO')} than Missouri's average, ${gap('NE')} than Nebraska's, ${gap('OK')} than Oklahoma's and ${gap('CO')} than Colorado's. Those gaps move from week to week; the ${h.a('propane-prices', 'propane table')} ranks all surveyed states every Wednesday when the EIA publishes.</p>
<h2>The cold months on the plains</h2>
<p>NOAA's population-weighted normals give Kansas ${K.num(st.hdd.month['12'])} heating degree days in December and ${K.num(st.hdd.month['01'])} in January. By the same scaling as the season estimate, the average propane home burns about ${K.gal(galP * st.hdd.month['01'] / st.hdd.winter)} in January alone. The ${h.a('how-long-will-my-oil-last', 'days-left calculator')} reads your gauge and says how long the tank will last at the normal pace of the coming months, and the ${h.a('winter-heating-budget', 'winter budget')} spreads the cost. For a dealer's pre-buy offer, the ${h.a('lock-in-or-wait', 'lock-in check')} replays each Kansas winter since ${p.seasons[0].s}. The federal LIHEAP ceiling for three people in Kansas is ${K.usd(K.liheap('KS', 3))} a year, and the ${h.a('liheap-income-limits', 'LIHEAP page')} gives the ceiling for every other household size.</p>
<p>Per million Btu of delivered heat at the ENERGY STAR furnace rating, Kansas propane costs ${K.usd(K.perMBtu({ price: p.last[1], btu: K.P.btu.propane, efficiency: K.P.efficiency.propane }))} this week; the ${h.a('heating-oil-vs-propane', 'comparison page')} sets that against electricity for a household weighing a heat pump.</p>
`,
  faqs: [
    { q: 'What is the average propane price in Kansas this week?', a: `${K.ppg(p.last[1])} a gallon in the EIA survey of ${K.day(p.last[0])}, excluding taxes, against ${K.ppg(K.price('US', 'pr')!)} nationally. At that price a 500-gallon tank filled from 30 % to 80 % costs ${K.usd(250 * p.last[1])}. The price your dealer charges can be above or below the state average.` },
    { q: 'Has propane gone up in Kansas since last year?', a: `${yp === null ? 'The survey has no Kansas figure for the same week a year ago.' : `This week the Kansas average is ${K.dir(yp, 'up', 'down', 'level')} on a year: ${K.ppg(p.last[1])} a gallon against ${K.ppg(p.yearAgo![1])} a year earlier, a change of ${K.pct(Math.abs(yp), 0)}.`} Last winter's average from November to March was ${K.ppg(pld.avg!)}, which gives another yardstick for this year's prices.` },
    { q: 'How much propane does a Kansas home burn in a winter?', a: `The EIA's average Midwest propane home, scaled to Kansas's ${K.num(st.hdd.winter)} heating degree days from November to March, burns about ${K.gal(galP)} for heat. That is ${K.usd(galP * p.last[1])} at this week's average. Your own delivery tickets from last winter give a better figure.` },
  ],
  related: ['propane-prices', 'heating-oil-price-history', 'how-long-will-my-oil-last', 'state:missouri', 'state:nebraska', 'state:oklahoma'],
});
