import { defineState } from '../../lib/page-types';
import { KIT as K } from '../../lib/kit';

const st = K.SC('MT');
const p = K.sum('MT', 'pr')!;
const pld = K.lastDone('MT', 'pr')!;
const galP = K.est(st, 'pr');
const rp = K.replay(p.seasons.filter((x) => x.s !== p.season), p.last[1]);
const done = p.seasons.filter((x) => x.avg);
const pcheap = done.reduce((a, b) => (b.avg! < a.avg! ? b : a));
const gap = (c: string) => { const d = p.last[1] - K.price(c, 'pr')!; return `${K.ppg(Math.abs(d))} ${K.dir(d, 'dearer', 'cheaper', 'level')}`; };

export default defineState({
  slug: 'montana',
  title: 'Montana Propane Prices This Week, Winter 2026-27 Survey',
  description: `Montana propane prices this week from the federal survey, winter 2026-27: one home in seven on propane, a long cold season, the cost of a fill and of a winter.`,
  intro: `Montana propane averaged ${K.ppg(p.last[1])} a gallon in the EIA survey of ${K.day(p.last[0])}.`,
  resume: `Montana has the highest share of propane-heated homes in the West of the federal survey: the Census Bureau's 2024 count is ${K.num(st.acs.propane)}, ${K.pct(st.acs.propaneShare, 1)} of occupied homes, ranking the state ${K.ord(K.rankOf('MT', (x) => x.acs.propaneShare))} of ${K.STATES.length} on that measure. Wood heats another ${K.num(st.acs.wood)}. The winter is long: ${K.num(st.hdd.winter)} heating degree days from November to March in a normal year and ${K.num(st.hdd.year)} over the whole year. In the EIA's weekly survey of ${K.day(p.last[0])}, Montana propane averaged ${K.ppg(p.last[1])} a gallon, ${K.ord(K.place('MT', 'pr'))} of ${K.ranked('pr').length} states counting from the dearest and ${K.ppg(Math.abs(p.last[1] - K.price('US', 'pr')!))} ${K.dir(p.last[1] - K.price('US', 'pr')!, 'above', 'below', 'level with')} the national average. With no western propane outlook from the EIA, this site scales the national average home to Montana's weather: about ${K.gal(galP)} for the winter, ${K.usd(galP * p.last[1])} at this week's price. Last winter the state averaged ${K.ppg(pld.avg!)}. Heating oil is not surveyed here. Prices exclude taxes and delivery fees.`,
  body: (h) => `
<h2>The gallons a Montana winter takes</h2>
<p>Montana's normal January counts ${K.num(st.hdd.month['01'])} heating degree days, its December ${K.num(st.hdd.month['12'])} and its February ${K.num(st.hdd.month['02'])}; October and April add ${K.num(st.hdd.month['10'])} and ${K.num(st.hdd.month['04'])}. By the same scaling as the season estimate, the average propane home burns about ${K.gal(galP * (st.hdd.month['12'] + st.hdd.month['01']) / st.hdd.winter)} over December and January. A 500-gallon tank filled to 80 % holds 400 gallons, so a household on will-call delivery should watch the gauge closely through midwinter. The ${h.a('how-long-will-my-oil-last', 'days-left calculator')} turns a reading into a date.</p>
${h.mini('days', { t: 'Days left in a Montana tank', p: ['now', 'from'], d: { st: 'MT', fuel: 'pr', now: 250, from: '01' }, c: 'Open the days-left calculator' })}
<h2>The Montana price</h2>
<p>The EIA does not publish a wholesale propane price for Montana. The Rocky Mountain region's wholesale figure, ${K.sum('R40', 'pr')?.wholesale ? K.ppg(K.sum('R40', 'pr')!.wholesale!) : 'unpublished this week'}, shows roughly how much of the ${K.ppg(p.last[1])} residential average is added after the terminal. Last winter the Montana average ran from ${K.ppg(pld.min[1])} to ${K.ppg(pld.max[1])}; the cheapest winter on file is ${pcheap.s}, at ${K.ppg(pcheap.avg!)}, and the record week ${K.ppg(p.record[1])}, on ${K.day(p.record[0])}.</p>
<p>This week Montana propane is ${gap('ND')} than North Dakota's average, ${gap('SD')} than South Dakota's, ${gap('ID')} than Idaho's and ${gap('R40')} than the Rocky Mountain regional average. A 1,000-gallon tank filled from 20 % to 80 % takes 600 gallons, ${K.usd(600 * p.last[1])} at the Montana average; the ${h.a('propane-tank-fill-cost', 'propane tank calculator')} handles any size.</p>
<h2>Locks, budget and help</h2>
<p>Since ${p.seasons[0].s}, the Montana winter average finished above the mid-October price in ${rp.up} of ${rp.n} seasons, with a median change of ${K.pct(rp.median, 1)}. With ${K.gal(galP)} in a season, each ten cents a gallon is worth ${K.usd(galP * 0.1)}. The ${h.a('lock-in-or-wait', 'lock-in check')} replays every winter against a pre-buy price, and the ${h.a('winter-heating-budget', 'winter budget')} spreads the cost month by month and accepts your own gallons, useful in a home that also burns wood. Per million Btu at the ENERGY STAR furnace rating, Montana propane heat costs ${K.usd(K.perMBtu({ price: p.last[1], btu: K.P.btu.propane, efficiency: K.P.efficiency.propane }))} this week. The federal LIHEAP ceiling for four people in Montana is ${K.usd(K.liheap('MT', 4))} a year; the ${h.a('liheap-income-limits', 'LIHEAP page')} gives every household size.</p>
`,
  faqs: [
    { q: 'What does propane cost in Montana this week?', a: `${K.ppg(p.last[1])} a gallon on average in the EIA survey of ${K.day(p.last[0])}, excluding taxes, against ${K.ppg(K.price('US', 'pr')!)} for the United States. A 500-gallon tank filled from 30 % to 80 % costs ${K.usd(250 * p.last[1])} at that average. Dealers' own prices vary with contracts and tank ownership.` },
    { q: 'How many Montana homes heat with propane?', a: `${K.num(st.acs.propane)}, or ${K.pct(st.acs.propaneShare, 1)} of occupied homes, according to the Census Bureau's 2024 American Community Survey. Utility gas heats ${K.num(st.acs.gas)} Montana homes, electricity ${K.num(st.acs.electric)} and wood ${K.num(st.acs.wood)}. Fuel oil and kerosene heat only ${K.num(st.acs.oil)}, and the EIA does not survey heating oil prices in Montana.` },
    { q: 'How much propane will a Montana home need this winter?', a: `Scaling the EIA's national average propane home to Montana's ${K.num(st.hdd.winter)} heating degree days from November to March gives about ${K.gal(galP)} for heat, ${K.usd(galP * p.last[1])} at this week's average. October and April add more in Montana than in most states. Your delivery tickets are the better guide.` },
  ],
  related: ['how-long-will-my-oil-last', 'lock-in-or-wait', 'propane-prices', 'state:idaho', 'state:north-dakota', 'state:south-dakota'],
});
