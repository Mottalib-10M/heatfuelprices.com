import { defineState } from '../../lib/page-types';
import { KIT as K } from '../../lib/kit';

const st = K.SC('VT');
const o = K.sum('VT', 'ho')!;
const p = K.sum('VT', 'pr')!;
const pld = K.lastDone('VT', 'pr')!;
const galO = K.est(st, 'ho'), galP = K.est(st, 'pr');
const gap = (c: string, f: 'ho' | 'pr') => { const d = K.sum('VT', f)!.last[1] - K.price(c, f)!; return `${K.ppg(Math.abs(d))} ${K.dir(d, 'dearer', 'cheaper', 'level')}`; };

export default defineState({
  slug: 'vermont',
  title: 'Vermont Heating Oil and Propane Prices, Winter 2026-27',
  description: `Vermont heating oil and propane prices this week from the federal survey, 2026-27: a state split between oil, propane and wood, and the cost of a winter.`,
  intro: `Vermont heating oil: ${K.ppg(o.last[1])} a gallon; propane: ${K.ppg(p.last[1])}, in the EIA survey of ${K.day(o.last[0])}.`,
  resume: `Vermont spreads its heating across more fuels than almost any other state, and no single one heats even half of its homes. The Census Bureau counts ${K.num(st.acs.oil)} homes on fuel oil or kerosene, ${K.num(st.acs.propane)} on propane and ${K.num(st.acs.wood)} on wood, which is ${K.pct(st.acs.wood / st.acs.homes, 1)} of occupied homes, the largest wood share of any surveyed state. Utility gas reaches ${K.num(st.acs.gas)} homes. In the EIA's survey of ${K.day(o.last[0])}, Vermont heating oil averaged ${K.ppg(o.last[1])} a gallon, ${K.ord(K.place('VT', 'ho'))} of ${K.ranked('ho').length} states, and propane ${K.ppg(p.last[1])}, ${K.ord(K.place('VT', 'pr'))} of ${K.ranked('pr').length}. A normal Vermont winter brings ${K.num(st.hdd.winter)} heating degree days from November to March; the EIA's average home would burn about ${K.gal(galO)} of oil or ${K.gal(galP)} of propane over it, which is ${K.usd(galO * o.last[1])} or ${K.usd(galP * p.last[1])} at this week's averages. Prices exclude taxes and delivery fees, and a home that also burns wood will need fewer gallons.`,
  body: (h) => `
<h2>Propane in Vermont: last winter in figures</h2>
<p>Vermont's propane households paid ${K.ppg(pld.avg!)} a gallon on average from November to March last winter, with a low week of ${K.ppg(pld.min[1])} and a high of ${K.ppg(pld.max[1])}. This week's ${K.ppg(p.last[1])} is ${gap('NH', 'pr')} than New Hampshire's average and ${gap('ME', 'pr')} than Maine's. The EIA publishes no wholesale propane price for Vermont; the residential average includes delivery, the tank and the dealer's margin.</p>
<p>Most Vermont propane tanks are leased from the dealer, which usually ties the household to that dealer for fills. A household that owns its tank can ask several dealers for a price; the ${h.a('propane-tank-fill-cost', 'propane tank calculator')} turns their quotes into the cost of a fill at the 80 % level the industry commonly uses.</p>
${h.mini('fill', { t: 'Propane fill in Vermont', p: ['tank', 'gauge'], d: { st: 'VT', fuel: 'pr', tank: 500, gauge: 25 }, c: 'Open the tank fill calculator' })}
<h2>Heating oil in Vermont</h2>
<p>The wholesale heating oil price the EIA reports for Vermont is ${o.wholesale ? K.ppg(o.wholesale) : 'not published this week'}, which leaves ${K.spread('VT', 'ho') === null ? 'a dealer margin the survey does not show' : `${K.ppg(K.spread('VT', 'ho')!)} a gallon between terminal and home`}. Against the neighbors, Vermont oil is ${gap('NH', 'ho')} than New Hampshire's this week and ${gap('NY', 'ho')} than New York's state average. The highest Vermont week since 2013 was ${K.ppg(o.record[1])}, on ${K.day(o.record[0])}.</p>
<h2>A winter with a wood stove</h2>
<p>Wood is the fuel that sets Vermont apart from its neighbors in the Census figures, ahead of Maine and well ahead of New Hampshire.</p>
<p>A home that burns wood as well as oil or propane uses fewer gallons than the EIA's average, often far fewer. Vermont's normal January counts ${K.num(st.hdd.month['01'])} degree days and its March ${K.num(st.hdd.month['03'])}: the weeks when a stove carries the house are the weeks when the tank is spared. For such a home, the gallons on last winter's delivery tickets are a better starting point than any average, and the ${h.a('winter-heating-budget', 'winter budget')} accepts them. The ${h.a('heating-oil-vs-propane', 'oil against propane page')} compares the two fuels per unit of heat for a household deciding which to keep.</p>
`,
  faqs: [
    { q: 'What does propane cost in Vermont this week?', a: `${K.ppg(p.last[1])} a gallon on average in the EIA survey of ${K.day(p.last[0])}, excluding taxes. A 500-gallon tank filled from 30 % to 80 % takes 250 gallons, about ${K.usd(250 * p.last[1])} at that price. A dealer who owns the tank sets the price; asking for it before each delivery avoids surprises.` },
    { q: 'How many Vermont homes heat with wood?', a: `${K.num(st.acs.wood)} Vermont homes, ${K.pct(st.acs.wood / st.acs.homes, 1)} of the total, name wood as their main heating fuel in the Census Bureau's 2024 American Community Survey. That is the highest share among the ${K.STATES.length} states in the EIA price survey. Oil remains the most common fuel, with ${K.num(st.acs.oil)} homes.` },
    { q: 'How much heating oil does a Vermont home burn in a winter?', a: `The EIA's average oil-heated home, scaled to Vermont's ${K.num(st.hdd.winter)} heating degree days from November to March, burns about ${K.gal(galO)}. At this week's ${K.ppg(o.last[1])} that is ${K.usd(galO * o.last[1])}. A house that also burns wood, or a small and well insulated one, will need much less.` },
  ],
  related: ['propane-tank-fill-cost', 'winter-heating-budget', 'heating-oil-vs-propane', 'state:new-hampshire', 'state:maine', 'state:new-york'],
});
