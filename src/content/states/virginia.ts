import { defineState } from '../../lib/page-types';
import { KIT as K } from '../../lib/kit';

const st = K.SC('VA');
const o = K.sum('VA', 'ho')!;
const p = K.sum('VA', 'pr')!;
const ld = K.lastDone('VA', 'ho')!;
const pld = K.lastDone('VA', 'pr')!;
const galO = K.est(st, 'ho'), galP = K.est(st, 'pr');

export default defineState({
  slug: 'virginia',
  title: 'Virginia Heating Oil and Propane Prices This Week, 2026-27',
  description: `Virginia heating oil and propane prices from the federal weekly survey, winter 2026-27: dealer margins, the cost of a fill, last winter and a full season.`,
  intro: `Virginia heating oil averaged ${K.ppg(o.last[1])} a gallon and propane ${K.ppg(p.last[1])} in the EIA survey of ${K.day(o.last[0])}.`,
  resume: `Virginia is an electric-heat state, with ${K.num(st.acs.electric)} homes heated by electricity, but ${K.num(st.acs.oil)} still burn fuel oil or kerosene and ${K.num(st.acs.propane)} burn propane, according to the Census Bureau's 2024 survey. In the EIA's weekly survey of ${K.day(o.last[0])}, Virginia heating oil averaged ${K.ppg(o.last[1])} a gallon, ${K.ord(K.place('VA', 'ho'))} of ${K.ranked('ho').length} states, and propane ${K.ppg(p.last[1])}, ${K.ord(K.place('VA', 'pr'))} of ${K.ranked('pr').length}. Last winter the state's oil averaged ${K.ppg(ld.avg!)} and its propane ${K.ppg(pld.avg!)} from November to March. A normal Virginia winter counts ${K.num(st.hdd.winter)} heating degree days over those months; the EIA's average home would burn about ${K.gal(galO)} of oil or ${K.gal(galP)} of propane over it, which is ${K.usd(galO * o.last[1])} or ${K.usd(galP * p.last[1])} at this week's averages. The survey prices leave out sales tax and delivery fees.`,
  body: (h) => `
<h2>Virginia's dealer margins</h2>
<p>The EIA publishes wholesale prices for Virginia for both fuels: ${o.wholesale ? K.ppg(o.wholesale) : 'unpublished'} for heating oil and ${p.wholesale ? K.ppg(p.wholesale) : 'unpublished'} for propane this week. The residential averages leave ${K.spread('VA', 'ho') === null ? 'an unmeasured margin on oil' : `${K.ppg(K.spread('VA', 'ho')!)} a gallon on oil`} and ${K.spread('VA', 'pr') === null ? 'an unmeasured margin on propane' : `${K.ppg(K.spread('VA', 'pr')!)} on propane`}. On a typical fill that is ${K.spread('VA', 'ho') === null ? 'not measurable for oil' : `${K.usd(200 * K.spread('VA', 'ho')!)} on 200 gallons of oil`} and ${K.spread('VA', 'pr') === null ? 'not measurable for propane' : `${K.usd(250 * K.spread('VA', 'pr')!)} on 250 gallons of propane`}.</p>
${h.mini('price', { t: 'Virginia price and your order', p: ['fuel', 'gal'], d: { st: 'VA', fuel: 'ho', gal: 200 }, c: 'Open the price lookup' })}
<h2>Last winter and the record</h2>
<p>Virginia heating oil ran from ${K.ppg(ld.min[1])} to ${K.ppg(ld.max[1])} last winter, its high week on ${K.day(ld.max[0])}. Propane ranged from ${K.ppg(pld.min[1])} to ${K.ppg(pld.max[1])}. The highest weekly Virginia averages since 2013 are ${K.ppg(o.record[1])} for oil and ${K.ppg(p.record[1])} for propane. This week Virginia oil is ${K.ppg(Math.abs(o.last[1] - K.price('MD', 'ho')!))} ${K.dir(o.last[1] - K.price('MD', 'ho')!, 'dearer', 'cheaper', 'level')} than Maryland's average and ${K.ppg(Math.abs(o.last[1] - K.price('NC', 'ho')!))} ${K.dir(o.last[1] - K.price('NC', 'ho')!, 'dearer', 'cheaper', 'level')} than North Carolina's.</p>
<h2>How far a tank goes in Virginia</h2>
<p>NOAA's population-weighted normals give Virginia ${K.num(st.hdd.month['12'])} heating degree days in December, ${K.num(st.hdd.month['01'])} in January and ${K.num(st.hdd.month['02'])} in February. Spread across those three months, the average oil home burns about ${K.gal(galO * (st.hdd.month['12'] + st.hdd.month['01'] + st.hdd.month['02']) / st.hdd.winter)}, which a 275-gallon tank cannot hold in one fill. The ${h.a('how-long-will-my-oil-last', 'days-left calculator')} reads your gauge and says when to call the dealer. A propane household with a leased tank is usually on automatic delivery; the ${h.a('propane-tank-fill-cost', 'propane tank calculator')} checks the bill against the gauge.</p>
<h2>Choosing a fuel, getting help</h2>
<p>Many Virginia homes already heat with electricity. For a household weighing oil, propane and an electric heat pump, the ${h.a('heating-oil-vs-propane', 'comparison page')} puts all three on the same per-million-Btu basis. The federal LIHEAP ceiling for a family of four in Virginia is ${K.usd(K.liheap('VA', 4))} a year, and ${K.usd(K.liheap('VA', 1))} for a person living alone; the ${h.a('liheap-income-limits', 'LIHEAP page')} gives the other sizes and explains the rule.</p>
<h2>Fixed price or market price</h2>
<p>Heating fuel dealers often offer a price fixed for the winter, or a capped price that can fall but not rise. Whether that pays depends on a winter nobody can see yet. What the record can show is how often the Virginia average over November to March ended above or below the mid-October price: the ${h.a('lock-in-or-wait', 'lock-in check')} replays each season since 2013-14 against the price a dealer offers you, with the gallons you expect to buy.</p>
`,
  faqs: [
    { q: 'What is the average price of heating oil in Virginia this week?', a: `${K.ppg(o.last[1])} a gallon in the EIA survey of ${K.day(o.last[0])}, excluding taxes, against ${K.ppg(K.price('US', 'ho')!)} for the country as a whole. A 200-gallon delivery at the Virginia average costs ${K.usd(200 * o.last[1])}. Dealers' prices differ around the average with the size of the order and the service.` },
    { q: 'How much do Virginia propane dealers charge over wholesale?', a: `${K.spread('VA', 'pr') === null ? 'The survey did not publish a Virginia wholesale propane price this week, so the margin cannot be measured.' : `About ${K.ppg(K.spread('VA', 'pr')!)} a gallon this week: ${K.ppg(p.last[1])} at the house against ${K.ppg(p.wholesale!)} wholesale, both from the EIA survey.`} The margin pays for delivery, storage, the tank and profit, so it is a large part of every propane bill in the state.` },
    { q: 'How many homes in Virginia use propane for heat?', a: `${K.num(st.acs.propane)}, or ${K.pct(st.acs.propaneShare, 1)} of occupied homes, according to the Census Bureau's 2024 American Community Survey. Heating oil heats ${K.num(st.acs.oil)}, utility gas ${K.num(st.acs.gas)} and electricity ${K.num(st.acs.electric)}, by far the most common heating fuel in the state, as in most of the South.` },
  ],
  related: ['heating-oil-tank-fill-cost', 'how-long-will-my-oil-last', 'heating-oil-vs-propane', 'state:maryland', 'state:north-carolina', 'state:kentucky'],
});
