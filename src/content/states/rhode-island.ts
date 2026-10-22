import { defineState } from '../../lib/page-types';
import { KIT as K } from '../../lib/kit';

const st = K.SC('RI');
const o = K.sum('RI', 'ho')!;
const p = K.sum('RI', 'pr')!;
const ld = K.lastDone('RI', 'ho')!;
const gal = K.est(st, 'ho');
const ro = K.replay(o.seasons.filter((x) => x.s !== o.season), o.last[1]);

export default defineState({
  slug: 'rhode-island',
  title: 'Rhode Island Heating Oil Prices This Week, 2026-27 Winter',
  description: `Rhode Island heating oil prices this week from the federal survey, winter 2026-27: one of the dearest oil states, propane near the top, and what a winter costs.`,
  intro: `Rhode Island heating oil averaged ${K.ppg(o.last[1])} a gallon in the week of ${K.day(o.last[0])}, propane ${K.ppg(p.last[1])}.`,
  resume: `Rhode Island sits near the top of both federal price tables this week. Heating oil averaged ${K.ppg(o.last[1])} a gallon in the EIA survey of ${K.day(o.last[0])}, ${K.ord(K.place('RI', 'ho'))} of ${K.ranked('ho').length} states, and propane ${K.ppg(p.last[1])}, ${K.ord(K.place('RI', 'pr'))} of ${K.ranked('pr').length}. A quarter of the state's homes, ${K.num(st.acs.oil)} by the Census Bureau's count, heat with oil, most of the rest with utility gas. Rhode Island's winter is the mildest in New England at ${K.num(st.hdd.winter)} heating degree days from November to March, so the EIA's average oil home would need about ${K.gal(gal)}, or ${K.usd(gal * o.last[1])} at this week's price. Last winter the state's oil averaged ${K.ppg(ld.avg!)} a gallon from November to March. Prices exclude taxes; a dealer's quote can differ from the state average in either direction.`,
  body: (h) => `
<h2>A small state with a high spread</h2>
<p>The EIA's wholesale heating oil price for Rhode Island was ${o.wholesale ? K.ppg(o.wholesale) : 'not published'} this week, within cents of its neighbors. The retail average is what stands out: ${K.spread('RI', 'ho') === null ? 'the survey does not publish the spread this week' : `${K.ppg(K.spread('RI', 'ho')!)} above wholesale, against ${K.ppg(K.spread('MA', 'ho')!)} in Massachusetts and ${K.ppg(K.spread('CT', 'ho')!)} in Connecticut`}. For a household on a 275-gallon tank, each ten cents of spread is about ${K.usd(27.5)} a fill.</p>
${h.mini('price', { t: 'Rhode Island price and your order', p: ['gal'], d: { st: 'RI', fuel: 'ho', gal: 175 }, c: 'Open the price lookup' })}
<h2>What history says for Rhode Island</h2>
<p>Since 2013-14, the Rhode Island winter average ended above the mid-October price in ${ro.up} of ${ro.n} seasons, with a median change of ${K.pct(ro.median, 1)}. Last season it rose from ${ld.oct ? K.ppg(ld.oct) : 'its October level'} in mid-October to an average of ${K.ppg(ld.avg!)}, with a top week of ${K.ppg(ld.max[1])} on ${K.day(ld.max[0])}. The ${h.a('lock-in-or-wait', 'lock-in calculator')} replays each of those winters from today's price.</p>
<h2>Propane in Rhode Island</h2>
<p>Only ${K.num(st.acs.propane)} Rhode Island homes heat with propane, ${K.pct(st.acs.propaneShare, 1)} of the total, and they pay one of the highest prices in the country. The highest week on file was ${K.ppg(p.record[1])} on ${K.day(p.record[0])}. A 500-gallon tank filled from 30 % costs ${K.usd(250 * p.last[1])} at this week's average; the ${h.a('propane-tank-fill-cost', 'propane tank page')} gives other sizes.</p>
<h2>The Rhode Island winter and the bill</h2>
<p>Rhode Island's normal January brings ${K.num(st.hdd.month['01'])} heating degree days, against ${K.num(K.SC('ME').hdd.month['01'])} in Maine, so the same house burns noticeably less oil here than further north. Spread over the season, the average oil home's ${K.gal(gal)} at this week's price come to about ${K.usd(gal * o.last[1] / 5)} a month from November to March. That is the figure behind the ${h.a('winter-heating-budget', 'winter budget')}, which also lets you replace the average with your own gallons. Households with incomes under ${K.usd(K.liheap('RI', 3))} a year for three people can apply for federal heating assistance; the ${h.a('liheap-income-limits', 'LIHEAP page')} explains the limit for every household size.</p>
`,
  faqs: [
    { q: 'Why is Rhode Island heating oil among the dearest in the country?', a: `The wholesale price in Rhode Island is close to its neighbors'. The difference is in the dealer spread, the part added for delivery, service and margin, which the EIA survey shows at ${K.spread('RI', 'ho') === null ? 'an unpublished level' : K.ppg(K.spread('RI', 'ho')!)} a gallon this week. Small markets and service contracts can both widen it.` },
    { q: 'How much does a winter of oil heat cost in Rhode Island?', a: `For the EIA's average oil-heated home scaled to Rhode Island's ${K.num(st.hdd.winter)} degree days, about ${K.gal(gal)} from November to March, or ${K.usd(gal * o.last[1])} at this week's average of ${K.ppg(o.last[1])}. Enter your own gallons in the winter budget for a figure that fits your house.` },
    { q: 'What is the record heating oil price in Rhode Island?', a: `The highest weekly Rhode Island average since October 2013 in the EIA survey is ${K.ppg(o.record[1])}, in the week of ${K.day(o.record[0])}, excluding taxes. The highest average over a whole winter, November to March, was ${K.ppg(Math.max(...o.seasons.filter((x) => x.avg).map((x) => x.avg!)))}. The table under the chart lists every season.` },
  ],
  related: ['lock-in-or-wait', 'propane-tank-fill-cost', 'heating-oil-prices', 'state:connecticut', 'state:massachusetts'],
});
