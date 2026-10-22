import { defineState } from '../../lib/page-types';
import { KIT as K } from '../../lib/kit';

const st = K.SC('NH');
const o = K.sum('NH', 'ho')!;
const p = K.sum('NH', 'pr')!;
const pld = K.lastDone('NH', 'pr')!;
const rp = K.replay(p.seasons.filter((x) => x.s !== p.season), p.last[1]);
const galO = K.est(st, 'ho'), galP = K.est(st, 'pr');

export default defineState({
  slug: 'new-hampshire',
  title: 'New Hampshire Heating Oil and Propane Prices, 2026-27 Winter',
  description: `New Hampshire heating oil and propane prices this week from the federal survey, winter 2026-27: oil and propane homes side by side, fill cost, winter budget.`,
  intro: `New Hampshire: ${K.ppg(o.last[1])} a gallon for heating oil and ${K.ppg(p.last[1])} for propane in the survey of ${K.day(o.last[0])}.`,
  resume: `New Hampshire is the state where oil and propane share the job most evenly. The Census Bureau counts ${K.num(st.acs.oil)} homes heated with fuel oil or kerosene and ${K.num(st.acs.propane)} with bottled or tank gas, ${K.pct(st.acs.oilShare, 0)} and ${K.pct(st.acs.propaneShare, 0)} of occupied homes. The EIA's survey of ${K.day(o.last[0])} priced heating oil at ${K.ppg(o.last[1])} a gallon and propane at ${K.ppg(p.last[1])}. Over a normal New Hampshire winter of ${K.num(st.hdd.winter)} degree days, an average oil home burns about ${K.gal(galO)} and an average propane home about ${K.gal(galP)} by the EIA's regional figures, so the season costs roughly ${K.usd(galO * o.last[1])} on oil and ${K.usd(galP * p.last[1])} on propane at this week's prices. Propane has climbed during the winter in ${rp.up} of the last ${rp.n} seasons here. All figures exclude taxes and delivery fees.`,
  body: (h) => `
<h2>Two fuels, two price paths</h2>
<p>Heating oil in New Hampshire tracks the wholesale market closely: the EIA's wholesale figure for the state is ${o.wholesale ? K.ppg(o.wholesale) : 'not published this week'}, and the dealer spread ${K.spread('NH', 'ho') === null ? 'cannot be measured' : `is ${K.ppg(K.spread('NH', 'ho')!)}`}. Propane follows a slower path. Its winter average last season was ${K.ppg(pld.avg!)}, its low ${K.ppg(pld.min[1])} and its high ${K.ppg(pld.max[1])}: a range of ${K.ppg(pld.max[1] - pld.min[1])} over the whole season.</p>
<p>The difference shows in the table of winters below the chart. For propane households, the mid-October price has been followed by a dearer winter in ${rp.up} of ${rp.n} seasons, with a median rise of ${K.pct(rp.median, 1)}. Oil households have had a less one-sided record.</p>
${h.mini('lockin', { t: 'A propane price offered in New Hampshire', p: ['fixed', 'gal'], d: { st: 'NH', fuel: 'pr' }, c: 'Open the lock-in check' })}
<h2>Same heat, which fuel?</h2>
<p>At ENERGY STAR efficiencies, a million Btu of heat costs ${K.usd(K.perMBtu({ price: o.last[1], btu: K.P.btu.oil, efficiency: K.P.efficiency.oil }))} from oil and ${K.usd(K.perMBtu({ price: p.last[1], btu: K.P.btu.propane, efficiency: K.P.efficiency.propane }))} from propane in New Hampshire this week. The ${h.a('heating-oil-vs-propane', 'comparison calculator')} uses your own boiler or furnace rating. For the next delivery of either fuel, the ${h.a('propane-tank-fill-cost', 'propane tank calculator')} applies the 80 % fill level that oil tanks do not need.</p>
<h2>Neighbors</h2>
<p>This week New Hampshire oil is ${K.ppg(Math.abs(o.last[1] - K.price('MA', 'ho')!))} ${K.dir(o.last[1] - K.price('MA', 'ho')!, 'dearer', 'cheaper', 'level')} than in Massachusetts and ${K.ppg(Math.abs(o.last[1] - K.price('VT', 'ho')!))} ${K.dir(o.last[1] - K.price('VT', 'ho')!, 'dearer', 'cheaper', 'level')} than in Vermont. Propane runs ${K.ppg(Math.abs(p.last[1] - K.price('MA', 'pr')!))} ${K.dir(p.last[1] - K.price('MA', 'pr')!, 'dearer', 'cheaper', 'level')} than in Massachusetts and ${K.ppg(Math.abs(p.last[1] - K.price('ME', 'pr')!))} ${K.dir(p.last[1] - K.price('ME', 'pr')!, 'dearer', 'cheaper', 'level')} than in Maine.</p>
<h2>A New Hampshire winter in gallons</h2>
<p>NOAA's normals give New Hampshire ${K.num(st.hdd.winter)} heating degree days from November to March, of which ${K.num(st.hdd.month['01'])} fall in January. By the EIA's regional figures, the average oil home would burn about ${K.gal(galO * st.hdd.month['01'] / st.hdd.winter)} in January and the average propane home about ${K.gal(galP * st.hdd.month['01'] / st.hdd.winter)}. Propane tanks are usually owned by the dealer and filled on automatic delivery, while oil tanks belong to the house; that difference shapes how often each household sees a bill. The ${h.a('winter-heating-budget', 'winter budget')} spreads the season month by month at this week's price for either fuel, and accepts your own gallons from last winter if you have them.</p>
`,
  faqs: [
    { q: 'What is the price of propane in New Hampshire this week?', a: `${K.ppg(p.last[1])} a gallon on average in the EIA survey of ${K.day(p.last[0])}, excluding taxes, rank ${K.place('NH', 'pr')} of ${K.ranked('pr').length} surveyed states. A 500-gallon tank filled from 30 % to 80 % takes 250 gallons, about ${K.usd(250 * p.last[1])} at that average. Prices from individual dealers vary with contracts and tank ownership.` },
    { q: 'Is heating oil or propane cheaper to heat a New Hampshire home?', a: `Per gallon propane is usually cheaper, but a gallon of it holds about a third less heat than a gallon of oil. Per million Btu at ENERGY STAR efficiencies, oil costs ${K.usd(K.perMBtu({ price: o.last[1], btu: K.P.btu.oil, efficiency: K.P.efficiency.oil }))} and propane ${K.usd(K.perMBtu({ price: p.last[1], btu: K.P.btu.propane, efficiency: K.P.efficiency.propane }))} this week. The answer changes with prices and with your equipment.` },
    { q: 'How many New Hampshire homes use propane for heat?', a: `${K.num(st.acs.propane)}, or ${K.pct(st.acs.propaneShare, 1)} of occupied homes, according to the Census Bureau's 2024 American Community Survey. That is one of the highest propane shares among the Northeast states of the survey. Heating oil still heats more homes, ${K.num(st.acs.oil)}, and utility gas ${K.num(st.acs.gas)}.` },
  ],
  related: ['heating-oil-vs-propane', 'propane-tank-fill-cost', 'lock-in-or-wait', 'state:maine', 'state:vermont', 'state:massachusetts'],
});
