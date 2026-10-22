import { defineState } from '../../lib/page-types';
import { KIT as K } from '../../lib/kit';

const st = K.SC('NE');
const o = K.sum('NE', 'ho')!;
const p = K.sum('NE', 'pr')!;
const pld = K.lastDone('NE', 'pr')!;
const galP = K.est(st, 'pr');
const done = p.seasons.filter((x) => x.avg);
const pcheap = done.reduce((a, b) => (b.avg! < a.avg! ? b : a));
const pdear = done.reduce((a, b) => (b.avg! > a.avg! ? b : a));

export default defineState({
  slug: 'nebraska',
  title: 'Nebraska Propane Prices This Week, and Heating Oil, 2026-27',
  description: `Nebraska propane prices from the federal weekly survey for winter 2026-27, with heating oil: where the state ranks, the cost of a fill and past winters.`,
  intro: `Nebraska propane averaged ${K.ppg(p.last[1])} a gallon in the EIA survey of ${K.day(p.last[0])}; heating oil ${K.ppg(o.last[1])}.`,
  resume: `In Nebraska propane far outweighs heating oil among the delivered fuels, and the federal survey follows both every week of the heating season. In the week of ${K.day(p.last[0])}, Nebraska propane averaged ${K.ppg(p.last[1])} a gallon, ${K.ord(K.place('NE', 'pr'))} of ${K.ranked('pr').length} states from the dearest and ${K.ppg(Math.abs(p.last[1] - K.price('US', 'pr')!))} ${K.dir(p.last[1] - K.price('US', 'pr')!, 'above', 'below', 'level with')} the national average. The Census Bureau's 2024 survey counts ${K.num(st.acs.propane)} Nebraska homes heated mainly with propane, ${K.pct(st.acs.propaneShare, 1)} of occupied homes, and only ${K.num(st.acs.oil)} with fuel oil or kerosene; heating oil averaged ${K.ppg(o.last[1])} this week. A normal Nebraska winter counts ${K.num(st.hdd.winter)} heating degree days from November to March, so the EIA's average Midwest propane home would burn about ${K.gal(galP)}, ${K.usd(galP * p.last[1])} at this week's price. Prices exclude sales tax and delivery fees, and each dealer sets its own price around the average.`,
  body: (h) => `
<h2>Nebraska propane winters</h2>
<p>Over the winters on file, the Nebraska propane average from November to March was lowest in ${pcheap.s}, at ${K.ppg(pcheap.avg!)} a gallon, and highest in ${pdear.s}, at ${K.ppg(pdear.avg!)}. Last winter it averaged ${K.ppg(pld.avg!)}, with weeks from ${K.ppg(pld.min[1])} to ${K.ppg(pld.max[1])}. The highest single week since the series began is ${K.ppg(p.record[1])}, on ${K.day(p.record[0])}, a reminder that a cheap state average can still jump in a hard winter.</p>
${h.mini('history', { t: 'Nebraska propane, winter by winter', p: ['st', 'fuel'], d: { st: 'NE', fuel: 'pr' }, c: 'Open the price history' })}
<h2>The dealer's share</h2>
<p>This week the EIA's wholesale propane price for Nebraska is ${p.wholesale ? K.ppg(p.wholesale) : 'unpublished'}. ${K.spread('NE', 'pr') === null ? 'The dealer margin cannot be measured without it.' : `The residential average is ${K.ppg(K.spread('NE', 'pr')!)} above it, about ${K.pct(K.spread('NE', 'pr')! / p.last[1], 0)} of what a household pays.`} That margin covers the truck, the driver, storage through the winter and the tank, and an individual dealer's price can differ from the state average in either direction.</p>
<p>At this week's average, filling a 500-gallon tank from 30 % to 80 % costs ${K.usd(250 * p.last[1])}; a 1,000-gallon tank from 20 % takes 600 gallons, ${K.usd(600 * p.last[1])}. The ${h.a('propane-tank-fill-cost', 'propane tank calculator')} reads any gauge.</p>
<h2>Nebraska against its neighbors</h2>
<p>Nebraska propane is ${K.ppg(Math.abs(p.last[1] - K.price('IA', 'pr')!))} ${K.dir(p.last[1] - K.price('IA', 'pr')!, 'dearer', 'cheaper', 'level')} than Iowa's this week, ${K.ppg(Math.abs(p.last[1] - K.price('KS', 'pr')!))} ${K.dir(p.last[1] - K.price('KS', 'pr')!, 'dearer', 'cheaper', 'level')} than Kansas's and ${K.ppg(Math.abs(p.last[1] - K.price('SD', 'pr')!))} ${K.dir(p.last[1] - K.price('SD', 'pr')!, 'dearer', 'cheaper', 'level')} than South Dakota's. Per million Btu at ENERGY STAR efficiencies, propane heat costs ${K.usd(K.perMBtu({ price: p.last[1], btu: K.P.btu.propane, efficiency: K.P.efficiency.propane }))} in Nebraska this week, against ${K.usd(K.perMBtu({ price: o.last[1], btu: K.P.btu.oil, efficiency: K.P.efficiency.oil }))} for heating oil.</p>
<h2>The cold months</h2>
<p>NOAA's normals give Nebraska ${K.num(st.hdd.month['12'])} heating degree days in December and ${K.num(st.hdd.month['01'])} in January. By the same scaling as the season estimate, the average propane home burns about ${K.gal(galP * (st.hdd.month['12'] + st.hdd.month['01']) / st.hdd.winter)} over those two months, close to a full 500-gallon tank at the 80 % level. The ${h.a('how-long-will-my-oil-last', 'days-left calculator')} turns your gauge into a date. The federal LIHEAP ceiling for four people in Nebraska is ${K.usd(K.liheap('NE', 4))} a year.</p>
<h2>Pre-buy offers</h2>
<p>Propane dealers often offer a pre-buy price in the summer or early autumn for a set number of gallons. Whether it pays depends on the winter that follows, which nobody knows in advance. The ${h.a('lock-in-or-wait', 'lock-in check')} replays each Nebraska winter since ${p.seasons[0].s} against the price you are offered, so you can see how often a lock at that price would have come out ahead of the season's average and by how much.</p>
`,
  faqs: [
    { q: 'What is the price of propane in Nebraska this week?', a: `${K.ppg(p.last[1])} a gallon on average in the EIA survey of ${K.day(p.last[0])}, excluding taxes, against ${K.ppg(K.price('US', 'pr')!)} for the United States. Filling a 500-gallon tank from 30 % to 80 % costs ${K.usd(250 * p.last[1])} at that average. Dealers' prices vary with contracts and tank ownership.` },
    { q: 'What was the most expensive winter for propane in Nebraska?', a: `In the EIA weekly survey, ${pdear.s}, when the Nebraska average from November to March reached ${K.ppg(pdear.avg!)} a gallon. The single dearest week on file is ${K.ppg(p.record[1])}, in the week of ${K.day(p.record[0])}. The cheapest winter was ${pcheap.s}, at ${K.ppg(pcheap.avg!)}.` },
    { q: 'How much propane does a Nebraska home burn in a winter?', a: `The EIA's average Midwest propane home, scaled to Nebraska's ${K.num(st.hdd.winter)} heating degree days from November to March, burns about ${K.gal(galP)} for heat. At this week's average that is ${K.usd(galP * p.last[1])}. Your own delivery tickets from last winter are the better guide.` },
  ],
  related: ['heating-oil-price-history', 'propane-tank-fill-cost', 'propane-prices', 'state:iowa', 'state:kansas', 'state:south-dakota'],
});
