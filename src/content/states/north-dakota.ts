import { defineState } from '../../lib/page-types';
import { KIT as K } from '../../lib/kit';

const st = K.SC('ND');
const p = K.sum('ND', 'pr')!;
const pld = K.lastDone('ND', 'pr')!;
const galP = K.est(st, 'pr');
const done = p.seasons.filter((x) => x.avg);
const pcheap = done.reduce((a, b) => (b.avg! < a.avg! ? b : a));
const gap = (c: string) => { const d = p.last[1] - K.price(c, 'pr')!; return `${K.ppg(Math.abs(d))} ${K.dir(d, 'dearer', 'cheaper', 'level')}`; };

export default defineState({
  slug: 'north-dakota',
  title: 'North Dakota Propane Prices This Week, Winter 2026-27',
  description: `North Dakota propane prices this week from the federal survey, 2026-27: the coldest state in the survey, the cost of a fill and the gallons a long winter takes.`,
  intro: `North Dakota propane averaged ${K.ppg(p.last[1])} a gallon in the EIA survey of ${K.day(p.last[0])}.`,
  resume: `No state in the federal heating fuel survey has a colder winter than North Dakota: NOAA's normals give it ${K.num(st.hdd.winter)} heating degree days from November to March and ${K.num(st.hdd.year)} over a full year. The Census Bureau counts ${K.num(st.acs.propane)} North Dakota homes heated mainly with propane, ${K.pct(st.acs.propaneShare, 1)} of occupied homes, one of the highest shares in the survey. In the EIA's weekly survey of ${K.day(p.last[0])}, North Dakota propane averaged ${K.ppg(p.last[1])} a gallon, ${K.ord(K.place('ND', 'pr'))} of ${K.ranked('pr').length} states counting from the dearest, ${K.ppg(Math.abs(p.last[1] - K.price('US', 'pr')!))} ${K.dir(p.last[1] - K.price('US', 'pr')!, 'above', 'below', 'level with')} the national average. The long winter weighs on the bill more than the price does: the EIA's average Midwest propane home, scaled to North Dakota's weather, would burn about ${K.gal(galP)} over the season, which is ${K.usd(galP * p.last[1])} at this week's average. Heating oil is not surveyed here. Prices exclude taxes.`,
  body: (h) => `
<h2>The gallons a North Dakota winter takes</h2>
<p>North Dakota's normal January counts ${K.num(st.hdd.month['01'])} heating degree days, its December ${K.num(st.hdd.month['12'])} and its February ${K.num(st.hdd.month['02'])}. October and April add ${K.num(st.hdd.month['10'])} and ${K.num(st.hdd.month['04'])}, so the season runs well beyond the five months the EIA uses. By the same scaling as the season estimate, the average propane home burns about ${K.gal(galP * st.hdd.month['01'] / st.hdd.winter)} in January alone. A 500-gallon tank filled to 80 % holds 400 gallons, ${K.dir(400 - galP * (st.hdd.month['12'] + st.hdd.month['01']) / st.hdd.winter, 'more than', 'less than', 'about what')} the average home would burn in December and January together, so a household on will-call delivery has to watch the gauge closely through midwinter.</p>
${h.mini('days', { t: 'Days left in a North Dakota tank', p: ['now', 'from'], d: { st: 'ND', fuel: 'pr', now: 300, from: '12' }, c: 'Open the days-left calculator' })}
<h2>The price per gallon</h2>
<p>Last winter North Dakota propane averaged ${K.ppg(pld.avg!)} from November to March, from ${K.ppg(pld.min[1])} to ${K.ppg(pld.max[1])}. The cheapest winter on file is ${pcheap.s}, at ${K.ppg(pcheap.avg!)}, and the dearest single week ${K.ppg(p.record[1])}, on ${K.day(p.record[0])}. The EIA's wholesale price for the state this week is ${p.wholesale ? K.ppg(p.wholesale) : 'not published'}, which puts the dealer's share at ${K.spread('ND', 'pr') === null ? 'an unmeasured level' : `${K.ppg(K.spread('ND', 'pr')!)} a gallon`}.</p>
<p>This week North Dakota propane is ${gap('SD')} than South Dakota's, ${gap('MN')} than Minnesota's and ${gap('MT')} than Montana's. Filling a 1,000-gallon tank from 20 % to 80 % takes 600 gallons, ${K.usd(600 * p.last[1])} at the state average; the ${h.a('propane-tank-fill-cost', 'propane tank calculator')} handles any size.</p>
<h2>Budget and help</h2>
<p>With so many gallons, a few cents a gallon add up: each ten cents on ${K.gal(galP)} is ${K.usd(galP * 0.1)} over the season. The ${h.a('lock-in-or-wait', 'lock-in check')} replays every North Dakota winter since ${p.seasons[0].s} against a pre-buy price, and the ${h.a('winter-heating-budget', 'winter budget')} spreads the cost month by month. Per million Btu at the ENERGY STAR furnace rating, North Dakota propane heat costs ${K.usd(K.perMBtu({ price: p.last[1], btu: K.P.btu.propane, efficiency: K.P.efficiency.propane }))} this week. The federal LIHEAP ceiling for four people in North Dakota is ${K.usd(K.liheap('ND', 4))} a year; the ${h.a('liheap-income-limits', 'LIHEAP page')} gives the other sizes.</p>
`,
  faqs: [
    { q: 'What is the propane price in North Dakota this week?', a: `${K.ppg(p.last[1])} a gallon on average in the EIA survey of ${K.day(p.last[0])}, excluding taxes, against ${K.ppg(K.price('US', 'pr')!)} nationally. A 500-gallon tank filled from 30 % to 80 % costs ${K.usd(250 * p.last[1])} at that average. Dealers' prices vary with contracts and tank ownership.` },
    { q: 'How much propane does a North Dakota home burn in a winter?', a: `The EIA's average Midwest propane home, scaled to North Dakota's ${K.num(st.hdd.winter)} heating degree days from November to March, burns about ${K.gal(galP)} for heat. October and April add more in North Dakota than almost anywhere. Your own delivery tickets give the most reliable figure for your house.` },
    { q: 'Is North Dakota the coldest state for heating?', a: `Among the ${K.STATES.length} states in the EIA's heating fuel survey, yes: NOAA's population-weighted normals give North Dakota ${K.num(st.hdd.winter)} heating degree days from November to March, against ${K.num(K.SC('MN').hdd.winter)} for Minnesota, the next coldest. January, the coldest month in both, counts ${K.num(st.hdd.month['01'])} degree days in North Dakota against ${K.num(K.SC('MN').hdd.month['01'])} in Minnesota.` },
  ],
  related: ['how-long-will-my-oil-last', 'propane-tank-fill-cost', 'winter-heating-budget', 'state:south-dakota', 'state:minnesota', 'state:montana'],
});
