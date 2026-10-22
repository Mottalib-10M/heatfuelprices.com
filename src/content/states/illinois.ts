import { defineState } from '../../lib/page-types';
import { KIT as K } from '../../lib/kit';

const st = K.SC('IL');
const p = K.sum('IL', 'pr')!;
const pld = K.lastDone('IL', 'pr')!;
const galP = K.est(st, 'pr');
const rp = K.replay(p.seasons.filter((x) => x.s !== p.season), p.last[1]);
const gap = (c: string) => { const d = p.last[1] - K.price(c, 'pr')!; return `${K.ppg(Math.abs(d))} ${K.dir(d, 'dearer', 'cheaper', 'level')}`; };

export default defineState({
  slug: 'illinois',
  title: 'Illinois Propane Prices This Week, Winter 2026-27 Survey',
  description: `Illinois propane prices this week from the federal survey, winter 2026-27: price per gallon, the dealer's share over wholesale, a tank fill and a full winter.`,
  intro: `Illinois propane averaged ${K.ppg(p.last[1])} a gallon in the EIA survey of ${K.day(p.last[0])}.`,
  resume: `Three Illinois homes in four heat with utility gas, the ${K.ord(K.rankOf('IL', (x) => x.acs.gas / x.acs.homes))} highest share among the states in the EIA's propane survey, so propane is a minority fuel here. The Census Bureau's 2024 survey still counts ${K.num(st.acs.propane)} Illinois homes heated mainly with it, ${K.pct(st.acs.propaneShare, 1)} of occupied homes. In the EIA's weekly survey of ${K.day(p.last[0])}, Illinois propane averaged ${K.ppg(p.last[1])} a gallon, ${K.ord(K.place('IL', 'pr'))} of ${K.ranked('pr').length} states counting from the dearest, and ${K.ppg(Math.abs(p.last[1] - K.price('US', 'pr')!))} ${K.dir(p.last[1] - K.price('US', 'pr')!, 'above', 'below', 'level with')} the U.S. average. Last winter the state averaged ${K.ppg(pld.avg!)} from November to March. A normal Illinois winter brings ${K.num(st.hdd.winter)} heating degree days over those months, so the EIA's average Midwest propane home would burn about ${K.gal(galP)}, which is ${K.usd(galP * p.last[1])} at this week's average. The EIA does not survey heating oil in Illinois. Prices exclude taxes and delivery fees.`,
  body: (h) => `
<h2>Wholesale and the dealer's share</h2>
<p>The EIA publishes a wholesale propane price for Illinois, ${p.wholesale ? K.ppg(p.wholesale) : 'not available this week'}. ${K.spread('IL', 'pr') === null ? 'Without it the margin cannot be computed.' : `Set against the residential average, that leaves ${K.ppg(K.spread('IL', 'pr')!)} a gallon for delivery, storage, the tank and the dealer, ${K.pct(K.spread('IL', 'pr')! / p.last[1], 0)} of what a household pays. On a 250-gallon fill, that share comes to ${K.usd(250 * K.spread('IL', 'pr')!)}.`} Because most of the price is the margin rather than the fuel, a sharp move in the wholesale market shows up only partly in the residential average.</p>
${h.mini('fill', { t: 'Propane fill in Illinois', p: ['tank', 'gauge'], d: { st: 'IL', fuel: 'pr', tank: 500, gauge: 30 }, c: 'Open the tank fill calculator' })}
<h2>Illinois propane, season by season</h2>
<p>Last winter the Illinois average ranged from ${K.ppg(pld.min[1])} to ${K.ppg(pld.max[1])}, its high week on ${K.day(pld.max[0])}. The highest week the survey has recorded in Illinois is ${K.ppg(p.record[1])}, on ${K.day(p.record[0])}. Since ${p.seasons[0].s}, the November to March average finished above the mid-October price in ${rp.up} of ${rp.n} seasons, with a median change of ${K.pct(rp.median, 1)}. The ${h.a('lock-in-or-wait', 'lock-in check')} replays those winters against a dealer's fixed price.</p>
<h2>Illinois against its neighbors</h2>
<p>This week Illinois propane is ${gap('IN')} than Indiana's, ${gap('WI')} than Wisconsin's, ${gap('IA')} than Iowa's and ${gap('MO')} than Missouri's. These are state averages, and individual dealers on either side of a state line set their own prices. The ${h.a('propane-prices', 'propane table')} ranks all ${K.ranked('pr').length} surveyed states.</p>
<h2>Heating a propane home in an Illinois winter</h2>
<p>NOAA's normals give Illinois ${K.num(st.hdd.month['12'])} heating degree days in December, ${K.num(st.hdd.month['01'])} in January and ${K.num(st.hdd.month['02'])} in February, weighted by population. Those three months carry ${K.pct((st.hdd.month['12'] + st.hdd.month['01'] + st.hdd.month['02']) / st.hdd.winter, 0)} of the season's total, so a tank filled in October may need a second fill by midwinter. The ${h.a('how-long-will-my-oil-last', 'days-left calculator')} turns a gauge reading into a date using these normals, and the ${h.a('winter-heating-budget', 'winter budget')} spreads the cost month by month. Per million Btu at the ENERGY STAR furnace rating, Illinois propane heat costs ${K.usd(K.perMBtu({ price: p.last[1], btu: K.P.btu.propane, efficiency: K.P.efficiency.propane }))} this week; the ${h.a('heating-oil-vs-propane', 'comparison page')} sets it against electricity. The federal LIHEAP income ceiling for four people in Illinois is ${K.usd(K.liheap('IL', 4))} a year.</p>
`,
  faqs: [
    { q: 'What is the price of propane in Illinois this week?', a: `${K.ppg(p.last[1])} a gallon on average in the EIA survey of ${K.day(p.last[0])}, excluding taxes, against ${K.ppg(K.price('US', 'pr')!)} for the United States. At that average, filling a 500-gallon tank from 30 % to 80 % costs ${K.usd(250 * p.last[1])}. Dealers' own prices vary with contracts and tank ownership.` },
    { q: 'How many Illinois homes heat with propane?', a: `${K.num(st.acs.propane)}, or ${K.pct(st.acs.propaneShare, 1)} of occupied homes, according to the Census Bureau's 2024 American Community Survey. Utility gas heats ${K.num(st.acs.gas)} Illinois homes and electricity ${K.num(st.acs.electric)}. Fuel oil and kerosene heat only ${K.num(st.acs.oil)}, and the EIA does not survey heating oil in the state at all.` },
    { q: 'How much propane does an Illinois home burn in a winter?', a: `The EIA's average Midwest propane home, scaled to Illinois's ${K.num(st.hdd.winter)} heating degree days from November to March, burns about ${K.gal(galP)} for heat. At this week's average that is ${K.usd(galP * p.last[1])}. Cooking, hot water and drying add to the yearly total.` },
  ],
  related: ['propane-prices', 'propane-tank-fill-cost', 'lock-in-or-wait', 'state:indiana', 'state:wisconsin', 'state:missouri'],
});
