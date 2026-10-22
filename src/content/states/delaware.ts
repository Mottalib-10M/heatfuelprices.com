import { defineState } from '../../lib/page-types';
import { KIT as K } from '../../lib/kit';

const st = K.SC('DE');
const o = K.sum('DE', 'ho')!;
const p = K.sum('DE', 'pr')!;
const ld = K.lastDone('DE', 'ho')!;
const pld = K.lastDone('DE', 'pr')!;
const galO = K.est(st, 'ho'), galP = K.est(st, 'pr');
const gap = (c: string, f: 'ho' | 'pr') => { const d = K.sum('DE', f)!.last[1] - K.price(c, f)!; return `${K.ppg(Math.abs(d))} ${K.dir(d, 'dearer', 'cheaper', 'level')}`; };

export default defineState({
  slug: 'delaware',
  title: 'Delaware Heating Oil and Propane Prices This Week, 2026-27',
  description: `Delaware heating oil and propane prices from the federal weekly survey, 2026-27: one home in ten on propane, the price of a delivery and of a mild winter.`,
  intro: `Delaware heating oil averaged ${K.ppg(o.last[1])} a gallon and propane ${K.ppg(p.last[1])} in the EIA survey of ${K.day(o.last[0])}.`,
  resume: `Delaware is a small market for both fuels, and one where propane matters more than in most of the Mid-Atlantic. The Census Bureau counts ${K.num(st.acs.propane)} Delaware homes heated with propane, ${K.pct(st.acs.propaneShare, 1)} of occupied homes, against ${K.num(st.acs.oil)} on fuel oil or kerosene; electricity heats ${K.num(st.acs.electric)} and utility gas ${K.num(st.acs.gas)}. In the EIA's survey of ${K.day(o.last[0])}, Delaware heating oil averaged ${K.ppg(o.last[1])} a gallon, ${K.ord(K.place('DE', 'ho'))} of ${K.ranked('ho').length} states, and propane ${K.ppg(p.last[1])}, ${K.ord(K.place('DE', 'pr'))} of ${K.ranked('pr').length}. The winter is mild by the standard of the oil states: ${K.num(st.hdd.winter)} heating degree days from November to March. On that weather the EIA's average home would burn about ${K.gal(galO)} of oil or ${K.gal(galP)} of propane, which is ${K.usd(galO * o.last[1])} or ${K.usd(galP * p.last[1])} at this week's averages, before tax.`,
  body: (h) => `
<h2>Propane first</h2>
<p>A Delaware propane household paid ${K.ppg(pld.avg!)} a gallon on average last winter, between a low week of ${K.ppg(pld.min[1])} and a high of ${K.ppg(pld.max[1])}. This week's ${K.ppg(p.last[1])} is ${gap('MD', 'pr')} than Maryland's average and ${gap('NJ', 'pr')} than New Jersey's. The EIA does not publish a wholesale propane price for Delaware, but the neighboring New Jersey figure, ${K.sum('NJ', 'pr')?.wholesale ? K.ppg(K.sum('NJ', 'pr')!.wholesale!) : 'unpublished this week'}, gives an idea of how much of the retail price is added after the terminal.</p>
<p>A 500-gallon tank filled from 30 % to 80 % takes 250 gallons, or ${K.usd(250 * p.last[1])} at this week's Delaware average. A 1,000-gallon tank filled from the same reading takes 500 gallons, ${K.usd(500 * p.last[1])}. The ${h.a('propane-tank-fill-cost', 'propane tank calculator')} reads any gauge and applies the 80 % fill level.</p>
${h.mini('fill', { t: 'Propane fill in Delaware', p: ['tank', 'gauge'], d: { st: 'DE', fuel: 'pr', tank: 500, gauge: 30 }, c: 'Open the tank fill calculator' })}
<h2>Heating oil in Delaware</h2>
<p>The wholesale heating oil price the EIA reports for Delaware this week is ${o.wholesale ? K.ppg(o.wholesale) : 'not published'}, which leaves ${K.spread('DE', 'ho') === null ? 'a dealer margin the survey does not show' : `a dealer spread of ${K.ppg(K.spread('DE', 'ho')!)} a gallon`}. Last winter Delaware oil averaged ${K.ppg(ld.avg!)} from November to March, with its dearest week at ${K.ppg(ld.max[1])} on ${K.day(ld.max[0])}. The highest Delaware week since 2013 is ${K.ppg(o.record[1])}.</p>
<h2>A short heating season</h2>
<p>Delaware's normal January counts ${K.num(st.hdd.month['01'])} heating degree days, its November ${K.num(st.hdd.month['11'])} and its March ${K.num(st.hdd.month['03'])}. That is ${K.pct(1 - st.hdd.month['01'] / K.SC('ME').hdd.month['01'], 0)} fewer than a Maine January, so the same tank lasts longer here and a household on will-call delivery orders less often. The ${h.a('how-long-will-my-oil-last', 'days-left calculator')} uses those monthly normals to say when the next order falls due, and the ${h.a('winter-heating-budget', 'winter budget')} spreads the season's cost month by month. Many Delaware homes heat with electricity; for a household weighing a switch, the ${h.a('heating-oil-vs-propane', 'comparison page')} puts oil, propane and electric heat on the same per-million-Btu basis. The federal LIHEAP ceiling for a family of four in Delaware is ${K.usd(K.liheap('DE', 4))} a year.</p>
`,
  faqs: [
    { q: 'What is the propane price in Delaware this week?', a: `${K.ppg(p.last[1])} a gallon on average in the EIA survey of ${K.day(p.last[0])}, excluding taxes, against ${K.ppg(K.price('US', 'pr')!)} for the country. Filling a 500-gallon tank from 30 % to 80 % at that average costs ${K.usd(250 * p.last[1])}. Leased tanks are usually filled by the dealer who owns them, at that dealer's price.` },
    { q: 'How much does heating oil cost in Delaware?', a: `The EIA's weekly survey put Delaware at ${K.ppg(o.last[1])} a gallon in the week of ${K.day(o.last[0])}, excluding taxes, ${K.ord(K.place('DE', 'ho'))} of the ${K.ranked('ho').length} states surveyed for heating oil. A 200-gallon delivery at that average comes to ${K.usd(200 * o.last[1])}. Your own dealer may quote above or below it.` },
    { q: 'Do more Delaware homes heat with propane or with oil?', a: `With propane: the Census Bureau's 2024 American Community Survey counts ${K.num(st.acs.propane)} Delaware homes heated mainly with bottled, tank or LP gas and ${K.num(st.acs.oil)} with fuel oil or kerosene. Both are far behind electricity, at ${K.num(st.acs.electric)} homes, and utility gas, at ${K.num(st.acs.gas)}.` },
  ],
  related: ['propane-tank-fill-cost', 'propane-prices', 'heating-oil-vs-propane', 'state:maryland', 'state:new-jersey', 'state:pennsylvania'],
});
