import { defineState } from '../../lib/page-types';
import { KIT as K } from '../../lib/kit';

const st = K.SC('NJ');
const o = K.sum('NJ', 'ho')!;
const p = K.sum('NJ', 'pr')!;
const ld = K.lastDone('NJ', 'ho')!;
const gal = K.est(st, 'ho');
const yo = K.yoy('NJ', 'ho');

export default defineState({
  slug: 'new-jersey',
  title: 'New Jersey Heating Oil Prices This Week, Winter 2026-27',
  description: `New Jersey heating oil and propane prices from the federal weekly survey, winter 2026-27: price per gallon, dealer spread, cost of a delivery and of a winter.`,
  intro: `New Jersey heating oil averaged ${K.ppg(o.last[1])} a gallon and propane ${K.ppg(p.last[1])} in the EIA survey of ${K.day(o.last[0])}.`,
  resume: `Most New Jersey homes are on the gas network, but heating oil still warms ${K.num(st.acs.oil)} of them according to the Census Bureau, ${K.pct(st.acs.oilShare, 1)} of occupied homes, and propane another ${K.num(st.acs.propane)}. Those households buy in one of the dearer markets of the federal survey: in the week of ${K.day(o.last[0])}, New Jersey heating oil averaged ${K.ppg(o.last[1])} a gallon, ${K.ord(K.place('NJ', 'ho'))} of ${K.ranked('ho').length} states${yo === null ? '' : `, ${K.pct(Math.abs(yo), 0)} ${K.dir(yo, 'higher', 'lower')} than in the same week a year before`}. Propane averaged ${K.ppg(p.last[1])}, ${K.ord(K.place('NJ', 'pr'))} of ${K.ranked('pr').length}. With ${K.num(st.hdd.winter)} heating degree days in a normal winter from November to March, the EIA's average oil-heated home would burn about ${K.gal(gal)} here, which comes to ${K.usd(gal * o.last[1])} at this week's state average. All of these prices exclude sales tax and any delivery charge.`,
  body: (h) => `
<h2>From the terminal to the tank</h2>
<p>New Jersey is one of the few states where the EIA publishes both a wholesale and a retail price for each fuel. This week wholesale heating oil was ${o.wholesale ? K.ppg(o.wholesale) : 'not published'} and wholesale propane ${p.wholesale ? K.ppg(p.wholesale) : 'not published'}. The gap to the residential price is what the dealer adds for trucks, drivers, storage, service and margin: ${K.spread('NJ', 'ho') === null ? 'not measurable this week for oil' : `${K.ppg(K.spread('NJ', 'ho')!)} a gallon for oil`}, ${K.spread('NJ', 'pr') === null ? 'and not measurable for propane' : `${K.ppg(K.spread('NJ', 'pr')!)} for propane`}. The propane margin is the larger share of its price, which is why propane bills move less with the wholesale market than oil bills do.</p>
${h.mini('fill', { t: 'Next oil delivery in New Jersey', p: ['tank', 'gauge'], d: { st: 'NJ', fuel: 'ho', tank: 275, gauge: 30 }, c: 'Open the tank fill calculator' })}
<h2>Last winter in New Jersey</h2>
<p>From November to March last season, New Jersey heating oil averaged ${K.ppg(ld.avg!)} a gallon, with its cheapest week at ${K.ppg(ld.min[1])} and its dearest at ${K.ppg(ld.max[1])} on ${K.day(ld.max[0])}. The highest week the survey has recorded in the state since 2013 is ${K.ppg(o.record[1])}. Against its neighbors this week, New Jersey oil is ${K.ppg(Math.abs(o.last[1] - K.price('NY', 'ho')!))} ${K.dir(o.last[1] - K.price('NY', 'ho')!, 'dearer', 'cheaper', 'level')} than New York's state average and ${K.ppg(Math.abs(o.last[1] - K.price('PA', 'ho')!))} ${K.dir(o.last[1] - K.price('PA', 'ho')!, 'dearer', 'cheaper', 'level')} than Pennsylvania's.</p>
<h2>A milder winter, a smaller bill</h2>
<p>NOAA's normals give New Jersey ${K.num(st.hdd.month['01'])} heating degree days in January, against ${K.num(K.SC('NY').hdd.month['01'])} for New York and ${K.num(K.SC('CT').hdd.month['01'])} for Connecticut. A New Jersey house therefore burns fewer gallons than the same house further north, and the price per gallon matters a little less to the total. The ${h.a('winter-heating-budget', 'winter budget')} spreads the season over its months; the ${h.a('lock-in-or-wait', 'lock-in check')} tells whether a fixed price offered now would have paid off in past winters. Households under the federal income ceiling, ${K.usd(K.liheap('NJ', 3))} a year for three people in New Jersey, can apply for help through the ${h.a('liheap-income-limits', 'LIHEAP program')}.</p>
<h2>Propane households in New Jersey</h2>
<p>A 500-gallon propane tank filled from 30 % to 80 % takes 250 gallons, ${K.usd(250 * p.last[1])} at this week's New Jersey average, against ${K.usd(250 * K.price('US', 'pr')!)} at the national one. Last winter the state's propane averaged ${K.ppg(K.lastDone('NJ', 'pr')!.avg!)} a gallon. The ${h.a('propane-tank-fill-cost', 'propane tank calculator')} covers other tank sizes and gauge readings.</p>
`,
  faqs: [
    { q: 'What is the average heating oil price in New Jersey this week?', a: `${K.ppg(o.last[1])} a gallon in the EIA survey of ${K.day(o.last[0])}, excluding taxes, against ${K.ppg(K.price('US', 'ho')!)} for the country as a whole. A 200-gallon delivery at the New Jersey average comes to ${K.usd(200 * o.last[1])}. Dealers quote around that figure depending on the size of the order and the service included.` },
    { q: 'How much do New Jersey dealers add to the wholesale price of propane?', a: `${K.spread('NJ', 'pr') === null ? 'The EIA did not publish a wholesale propane price for New Jersey this week, so the margin cannot be measured from the survey.' : `About ${K.ppg(K.spread('NJ', 'pr')!)} a gallon this week: the residential average was ${K.ppg(p.last[1])} and the wholesale price ${K.ppg(p.wholesale!)}.`} That margin pays for delivery, storage, the tank and the dealer's profit, and it usually changes far more slowly than the wholesale price itself.` },
    { q: 'How many homes in New Jersey heat with oil or propane?', a: `The Census Bureau's 2024 American Community Survey counts ${K.num(st.acs.oil)} New Jersey homes heated mainly with fuel oil or kerosene and ${K.num(st.acs.propane)} with bottled, tank or LP gas. Together they are a small part of the ${K.num(st.acs.homes)} occupied homes; utility gas heats ${K.num(st.acs.gas)}.` },
  ],
  related: ['heating-oil-tank-fill-cost', 'lock-in-or-wait', 'winter-heating-budget', 'state:new-york', 'state:pennsylvania', 'state:delaware'],
});
