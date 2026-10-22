import { defineState } from '../../lib/page-types';
import { KIT as K } from '../../lib/kit';

const st = K.SC('SD');
const p = K.sum('SD', 'pr')!;
const pld = K.lastDone('SD', 'pr')!;
const galP = K.est(st, 'pr');
const rp = K.replay(p.seasons.filter((x) => x.s !== p.season), p.last[1]);
const yp = K.yoy('SD', 'pr');
const gap = (c: string) => { const d = p.last[1] - K.price(c, 'pr')!; return `${K.ppg(Math.abs(d))} ${K.dir(d, 'dearer', 'cheaper', 'level')}`; };

export default defineState({
  slug: 'south-dakota',
  title: 'South Dakota Propane Prices This Week, Winter 2026-27',
  description: `South Dakota propane prices from the federal weekly survey, winter 2026-27: one home in six on propane, the price of a fill, past winters and a long season.`,
  intro: `South Dakota propane averaged ${K.ppg(p.last[1])} a gallon in the EIA survey of ${K.day(p.last[0])}.`,
  resume: `South Dakota has the highest share of propane-heated homes outside northern New England: the Census Bureau's 2024 survey counts ${K.num(st.acs.propane)} of them, ${K.pct(st.acs.propaneShare, 1)} of occupied homes, ranking the state ${K.ord(K.rankOf('SD', (x) => x.acs.propaneShare))} of the ${K.STATES.length} surveyed on that measure. In the EIA's weekly survey of ${K.day(p.last[0])}, South Dakota propane averaged ${K.ppg(p.last[1])} a gallon${yp === null ? '' : `, ${K.pct(Math.abs(yp), 0)} ${K.dir(yp, 'more', 'less')} than a year earlier`}, ${K.ord(K.place('SD', 'pr'))} of ${K.ranked('pr').length} states from the dearest. Its winter is long, ${K.num(st.hdd.winter)} heating degree days from November to March in a normal year, so the EIA's average Midwest propane home would burn about ${K.gal(galP)} over the season, ${K.usd(galP * p.last[1])} at this week's average. Last winter the state averaged ${K.ppg(pld.avg!)} a gallon. The EIA does not survey heating oil in South Dakota. All prices exclude taxes and delivery fees.`,
  body: (h) => `
<h2>Price and margin</h2>
<p>The EIA's wholesale propane price for South Dakota is ${p.wholesale ? K.ppg(p.wholesale) : 'unpublished'} this week. ${K.spread('SD', 'pr') === null ? 'Without it the margin cannot be computed.' : `The residential average sits ${K.ppg(K.spread('SD', 'pr')!)} above it, about ${K.pct(K.spread('SD', 'pr')! / p.last[1], 0)} of what a household pays, for delivery, storage, the tank and the dealer.`} Last winter the residential price ran from ${K.ppg(pld.min[1])} to ${K.ppg(pld.max[1])}. The record week on file is ${K.ppg(p.record[1])}, on ${K.day(p.record[0])}.</p>
${h.mini('lockin', { t: 'A South Dakota pre-buy price', p: ['fixed', 'gal'], d: { st: 'SD', fuel: 'pr' }, c: 'Open the lock-in check' })}
<h2>Locking a price</h2>
<p>Since ${p.seasons[0].s}, the South Dakota winter average ended above the mid-October price in ${rp.up} of ${rp.n} seasons, with a median change of ${K.pct(rp.median, 1)}. With a season of ${K.gal(galP)} for the average home, each ten cents a gallon is worth ${K.usd(galP * 0.1)}. The ${h.a('lock-in-or-wait', 'lock-in check')} runs your dealer's offer against each past winter.</p>
<h2>South Dakota and its neighbors</h2>
<p>This week South Dakota propane is ${gap('ND')} than North Dakota's average, ${gap('MN')} than Minnesota's, ${gap('NE')} than Nebraska's and ${gap('IA')} than Iowa's. Filling a 500-gallon tank from 30 % to 80 % costs ${K.usd(250 * p.last[1])} at the state average, and a 1,000-gallon tank from 20 % ${K.usd(600 * p.last[1])}.</p>
<h2>The months that count</h2>
<p>NOAA's normals give South Dakota ${K.num(st.hdd.month['12'])} heating degree days in December, ${K.num(st.hdd.month['01'])} in January and ${K.num(st.hdd.month['02'])} in February. October and April add ${K.num(st.hdd.month['10'])} and ${K.num(st.hdd.month['04'])}. The ${h.a('how-long-will-my-oil-last', 'days-left calculator')} works for propane and uses these monthly normals to turn a gauge reading into a date, and the ${h.a('winter-heating-budget', 'winter budget')} spreads the season's cost month by month. Per million Btu at the ENERGY STAR furnace rating, South Dakota propane heat costs ${K.usd(K.perMBtu({ price: p.last[1], btu: K.P.btu.propane, efficiency: K.P.efficiency.propane }))} this week; the ${h.a('heating-oil-vs-propane', 'comparison page')} adds electricity. The federal LIHEAP ceiling for four people in South Dakota is ${K.usd(K.liheap('SD', 4))} a year, and ${K.usd(K.liheap('SD', 1))} for a person living alone; the ${h.a('liheap-income-limits', 'LIHEAP page')} explains how the federal rule sets these figures.</p>
`,
  faqs: [
    { q: 'What does propane cost in South Dakota this week?', a: `${K.ppg(p.last[1])} a gallon on average in the EIA survey of ${K.day(p.last[0])}, excluding taxes, against ${K.ppg(K.price('US', 'pr')!)} for the United States. A 500-gallon tank filled from 30 % to 80 % costs ${K.usd(250 * p.last[1])} at that average. Contract and pre-buy prices can differ.` },
    { q: 'How many South Dakota homes heat with propane?', a: `${K.num(st.acs.propane)}, or ${K.pct(st.acs.propaneShare, 1)} of occupied homes, according to the Census Bureau's 2024 American Community Survey. Utility gas heats ${K.num(st.acs.gas)} South Dakota homes and electricity ${K.num(st.acs.electric)}. Fuel oil and kerosene heat only ${K.num(st.acs.oil)}, and the EIA does not include South Dakota in its weekly heating oil survey.` },
    { q: 'How much does a South Dakota winter of propane heat cost?', a: `For the EIA's average Midwest propane home, scaled to South Dakota's ${K.num(st.hdd.winter)} heating degree days from November to March, about ${K.gal(galP)}, or ${K.usd(galP * p.last[1])} at this week's average. A colder winter than normal, a larger house or propane hot water add to that.` },
  ],
  related: ['lock-in-or-wait', 'propane-prices', 'how-long-will-my-oil-last', 'state:north-dakota', 'state:nebraska', 'state:minnesota'],
});
