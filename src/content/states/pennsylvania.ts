import { defineState } from '../../lib/page-types';
import { KIT as K } from '../../lib/kit';

const st = K.SC('PA');
const o = K.sum('PA', 'ho')!;
const p = K.sum('PA', 'pr')!;
const ld = K.lastDone('PA', 'ho')!;
const pld = K.lastDone('PA', 'pr')!;
const galO = K.est(st, 'ho'), galP = K.est(st, 'pr');
const ro = K.replay(o.seasons.filter((x) => x.s !== o.season), o.last[1]);

export default defineState({
  slug: 'pennsylvania',
  title: 'Pennsylvania Heating Oil Prices This Week, Winter 2026-27',
  description: `Pennsylvania heating oil and propane prices this week from the federal survey, 2026-27: the second-largest oil market, wholesale spread and a winter's cost.`,
  intro: `Pennsylvania heating oil averaged ${K.ppg(o.last[1])} a gallon in the EIA survey of ${K.day(o.last[0])}; propane ${K.ppg(p.last[1])}.`,
  resume: `Pennsylvania has the second-largest number of oil-heated homes in the country after New York: ${K.num(st.acs.oil)} by the Census Bureau's 2024 count, ${K.pct(st.acs.oilShare, 1)} of occupied homes, with ${K.num(st.acs.propane)} more on propane. In the EIA's weekly survey of ${K.day(o.last[0])}, Pennsylvania heating oil averaged ${K.ppg(o.last[1])} a gallon, ${K.ord(K.place('PA', 'ho'))} of ${K.ranked('ho').length} states, and propane ${K.ppg(p.last[1])}, ${K.ord(K.place('PA', 'pr'))} of ${K.ranked('pr').length}. A normal Pennsylvania winter counts ${K.num(st.hdd.winter)} heating degree days from November to March. Over it, the EIA's average home would burn about ${K.gal(galO)} of oil, which is ${K.usd(galO * o.last[1])} at this week's average, or ${K.gal(galP)} of propane, which is ${K.usd(galP * p.last[1])}. Last winter Pennsylvania oil averaged ${K.ppg(ld.avg!)}. These prices leave out taxes and fees, and your own dealer's price can differ from the average.`,
  body: (h) => `
<h2>What a Pennsylvania dealer adds</h2>
<p>The EIA publishes a wholesale price for both fuels in Pennsylvania. This week heating oil sold at ${o.wholesale ? K.ppg(o.wholesale) : 'an unpublished price'} wholesale and propane at ${p.wholesale ? K.ppg(p.wholesale) : 'an unpublished price'}. The residential averages above them leave ${K.spread('PA', 'ho') === null ? 'an unknown oil margin' : `${K.ppg(K.spread('PA', 'ho')!)} a gallon on oil`} and ${K.spread('PA', 'pr') === null ? 'an unknown propane margin' : `${K.ppg(K.spread('PA', 'pr')!)} on propane`} for delivery and the dealer. On a 500-gallon propane fill from 30 % to 80 %, the propane margin alone is ${K.spread('PA', 'pr') === null ? 'not measurable' : K.usd(250 * K.spread('PA', 'pr')!)}.</p>
${h.mini('lockin', { t: 'A fixed oil price in Pennsylvania', p: ['fixed', 'gal'], d: { st: 'PA', fuel: 'ho' }, c: 'Open the lock-in check' })}
<h2>The Pennsylvania record</h2>
<p>Since 2013-14, the Pennsylvania heating oil average over November to March ended above its mid-October price in ${ro.up} of ${ro.n} winters, with a median change of ${K.pct(ro.median, 1)}. Last season's oil price ran from ${K.ppg(ld.min[1])} to ${K.ppg(ld.max[1])}; propane averaged ${K.ppg(pld.avg!)} with a high week of ${K.ppg(pld.max[1])}. The highest Pennsylvania oil week since 2013 was ${K.ppg(o.record[1])}, on ${K.day(o.record[0])}.</p>
<h2>Pennsylvania against its neighbors</h2>
<p>This week Pennsylvania oil is ${K.ppg(Math.abs(o.last[1] - K.price('NJ', 'ho')!))} ${K.dir(o.last[1] - K.price('NJ', 'ho')!, 'dearer', 'cheaper', 'level')} than in New Jersey and ${K.ppg(Math.abs(o.last[1] - K.price('OH', 'ho')!))} ${K.dir(o.last[1] - K.price('OH', 'ho')!, 'dearer', 'cheaper', 'level')} than in Ohio. Propane is ${K.ppg(Math.abs(p.last[1] - K.price('NY', 'pr')!))} ${K.dir(p.last[1] - K.price('NY', 'pr')!, 'dearer', 'cheaper', 'level')} than New York's average. Electricity heats ${K.num(st.acs.electric)} Pennsylvania homes; a household thinking of leaving oil can compare the cost of heat per million Btu on the ${h.a('heating-oil-vs-propane', 'comparison page')}, which also takes an electric rate.</p>
<h2>Budget and help</h2>
<p>The ${h.a('winter-heating-budget', 'winter budget')} applies this week's Pennsylvania price to the state's normal weather month by month. The federal LIHEAP ceiling for a family of four in Pennsylvania is ${K.usd(K.liheap('PA', 4))} a year; the ${h.a('liheap-income-limits', 'LIHEAP page')} gives every household size.</p>
<h2>Ordering oil in Pennsylvania</h2>
<p>Pennsylvania's normal January brings ${K.num(st.hdd.month['01'])} heating degree days and its December ${K.num(st.hdd.month['12'])}. By the same scaling as the winter estimate, the average oil home burns about ${K.gal(galO * (st.hdd.month['12'] + st.hdd.month['01']) / st.hdd.winter)} over those two months, close to a full 275-gallon tank. A household on will-call delivery that waits for the gauge to reach a quarter should check the ${h.a('how-long-will-my-oil-last', 'days-left calculator')} before the holidays, when dealers are busiest and a run-out costs the most. Each order is billed at the price of the week it is placed, so the ${h.a('heating-oil-tank-fill-cost', 'tank fill calculator')} shows what the next one costs at this week's average.</p>
`,
  faqs: [
    { q: 'What do Pennsylvania households pay for heating oil this week?', a: `The EIA's survey of ${K.day(o.last[0])} gives ${K.ppg(o.last[1])} a gallon for Pennsylvania, excluding taxes. At that price a 150-gallon delivery costs ${K.usd(150 * o.last[1])} and a 250-gallon one ${K.usd(250 * o.last[1])}. Some dealers set a minimum order or add a fee for small deliveries.` },
    { q: 'Is propane cheaper in Pennsylvania than in New England?', a: `This week Pennsylvania propane averaged ${K.ppg(p.last[1])} a gallon against ${K.ppg(K.sum('R1X', 'pr')!.last[1])} for New England in the same survey, excluding taxes. The New England figure is the EIA's own average for the six states of that region. A dealer's own price can still be higher or lower than either average, so a quote is the figure to compare.` },
    { q: 'How many Pennsylvania homes are heated with oil?', a: `${K.num(st.acs.oil)}, according to the Census Bureau's 2024 American Community Survey, or ${K.pct(st.acs.oilShare, 1)} of the ${K.num(st.acs.homes)} occupied homes in the state. Only New York has more oil-heated homes among the fifty states. Utility gas heats ${K.num(st.acs.gas)} homes, electricity ${K.num(st.acs.electric)} and propane ${K.num(st.acs.propane)}.` },
  ],
  related: ['lock-in-or-wait', 'heating-oil-vs-propane', 'winter-heating-budget', 'state:new-jersey', 'state:new-york', 'state:ohio'],
});
