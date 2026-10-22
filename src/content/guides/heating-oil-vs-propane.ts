import { defineGuide } from '../../lib/page-types';
import { KIT as K } from '../../lib/kit';

const P = K.P;
const cost = (code: string) => {
  const o = K.perMBtu({ price: K.price(code, 'ho')!, btu: P.btu.oil, efficiency: P.efficiency.oil });
  const p = K.perMBtu({ price: K.price(code, 'pr')!, btu: P.btu.propane, efficiency: P.efficiency.propane });
  return { o, p };
};
const both = K.STATES.filter((s) => s.ho && K.price(s.code, 'ho') && K.price(s.code, 'pr'));
const us = cost('US');
const oilCheaper = both.filter((s) => cost(s.code).o < cost(s.code).p);
const ratio = P.btu.oil / P.btu.propane;

export default defineGuide({
  id: 'heating-oil-vs-propane', group: 'costs', order: 14, slug: 'heating-oil-vs-propane',
  nav: 'Heating oil vs propane', card: 'Cost of the same heat from oil, propane and electricity, state by state.',
  title: 'Heating Oil vs Propane Cost per Million Btu by State, 2026',
  description: `Heating oil vs propane in 2026: the cost of one million Btu of heat in your state at this week's prices, boiler efficiency included, electric heat too.`,
  h1: 'Heating oil or propane: which heat costs less this week?',
  intro: `At this week's U.S. averages, oil heat costs ${K.usd(us.o)} and propane heat ${K.usd(us.p)} per million Btu delivered, at ENERGY STAR boiler efficiency.`,
  resume: `Comparing a gallon of oil with a gallon of propane misleads, because a gallon of heating oil holds ${K.num(P.btu.oil)} Btu and a gallon of propane ${K.num(P.btu.propane)}, according to the EIA: oil carries ${K.dec(ratio, 2)} times the heat. The fair comparison is the cost of one million Btu delivered into the home, after the efficiency of the boiler or furnace. With ENERGY STAR minimum efficiencies (${K.pct(P.efficiency.oil, 0)} for oil, ${K.pct(P.efficiency.propane, 0)} for gas boilers) and the U.S. averages of the federal survey of ${K.day(K.L.last_week)}, oil heat costs ${K.usd(us.o)} and propane heat ${K.usd(us.p)} per million Btu. In ${oilCheaper.length} of the ${both.length} states where the EIA surveys both fuels, oil is the cheaper heat this week. The calculator takes your state, your equipment's efficiency from its label and, if you want, your own prices and electricity rate.`,
  body: (h) => `
<h2>State by state, this week</h2>
${h.table(['State', 'Oil, per gallon', 'Propane, per gallon', 'Oil heat, per million Btu', 'Propane heat, per million Btu', 'Cheaper heat'], both.sort((a, b) => a.name.localeCompare(b.name)).map((s) => { const c = cost(s.code); return [s.name, K.ppg(K.price(s.code, 'ho')!), K.ppg(K.price(s.code, 'pr')!), K.usd(c.o), K.usd(c.p), c.o < c.p ? 'Oil' : 'Propane']; }), `EIA weekly survey of ${K.day(K.L.last_week)}, excluding taxes. Heat delivered at ${K.pct(P.efficiency.oil, 0)} AFUE for oil and ${K.pct(P.efficiency.propane, 0)} for propane.`, ['l', 'r', 'r', 'r', 'r', 'l'])}
<h2>The formula</h2>
<p>Cost per million Btu delivered = price per unit ÷ (Btu per unit × efficiency) × 1,000,000. Btu per unit come from the EIA (${h.src('eia_btu', 'British thermal units explained')}): ${K.num(P.btu.oil)} for a gallon of heating oil, ${K.num(P.btu.propane)} for a gallon of propane, ${K.num(P.btu.kwh)} for a kilowatthour. Efficiency is the AFUE on the equipment label, the share of the fuel's heat that reaches the home over a season. ENERGY STAR certifies oil boilers from ${K.pct(P.efficiency.oil, 0)} and gas boilers from ${K.pct(P.efficiency.propane, 0)} (${h.src('energystar_boilers', 'ENERGY STAR boilers')}); older equipment can be lower, so use your own label.</p>
<p>Break-even: propane heat costs the same as oil heat when the propane price equals the oil price × ${K.dec((P.btu.propane * P.efficiency.propane) / (P.btu.oil * P.efficiency.oil), 3)} at these efficiencies. At this week's U.S. oil price that is ${K.ppg(K.price('US', 'ho')! * (P.btu.propane * P.efficiency.propane) / (P.btu.oil * P.efficiency.oil))} a gallon of propane, against ${K.ppg(K.price('US', 'pr')!)} in the survey.</p>
${h.mini('compare', { t: 'Your state, your equipment', p: ['st', 'eo'], d: { st: 'NH' }, c: 'Open the full comparison' })}
<h2>Reading the state table</h2>
<p>The table ranks nothing; it puts the two fuels side by side state by state. ${(() => { const g = both.map((x) => ({ x, d: cost(x.code).o / cost(x.code).p - 1 })).sort((a, b) => a.d - b.d); const lo = g[0], hi = g[g.length - 1]; return `This week the two heats are closest in ${lo.x.name}, where oil heat costs ${K.pct(Math.abs(lo.d), 0)} ${K.dir(lo.d, 'more', 'less', 'the same as')} than propane heat, and furthest apart in ${hi.x.name}, where oil heat costs ${K.pct(Math.abs(hi.d), 0)} ${K.dir(hi.d, 'more', 'less', 'the same')}.`; })()} Change the efficiencies in the calculator to your own equipment: an old oil boiler at a low AFUE against a new condensing propane unit, or the reverse, can move the answer a long way.</p>
<h2>Electric resistance for reference</h2>
<p>Baseboard and other resistance heat turn every kilowatthour into ${K.num(P.btu.kwh)} Btu in the room. At the EIA's forecast Northeast winter rate of ${K.dec(K.W.el.Northeast.price.base, 1)} cents per kWh, a million Btu costs ${K.usd(K.perMBtu({ price: K.W.el.Northeast.price.base / 100, btu: P.btu.kwh, efficiency: 1 }))}. The calculator adds that line with your region's forecast rate; type your own rate from your bill for a fair figure. A heat pump moves more heat than the electricity it uses, so its cost per million Btu is lower than resistance heat by its seasonal efficiency, which depends on the model and the climate and is not modeled here.</p>
<h2>What the price comparison leaves out</h2>
<ul>
<li><strong>Switching costs.</strong> A new boiler or furnace, a tank, its removal or installation. Fuel savings pay them back only over several winters.</li>
<li><strong>Tank rental and fees.</strong> A leased propane tank can carry a rental or a minimum-use fee: read the contract before comparing.</li>
<li><strong>Price swings.</strong> Over the seasons on file, the national winter average of heating oil ranged from ${K.ppg(Math.min(...K.sum('US', 'ho')!.seasons.filter((x) => x.avg).map((x) => x.avg!)))} to ${K.ppg(Math.max(...K.sum('US', 'ho')!.seasons.filter((x) => x.avg).map((x) => x.avg!)))} a gallon, and propane from ${K.ppg(Math.min(...K.sum('US', 'pr')!.seasons.filter((x) => x.avg).map((x) => x.avg!)))} to ${K.ppg(Math.max(...K.sum('US', 'pr')!.seasons.filter((x) => x.avg).map((x) => x.avg!)))}. This week's answer can flip in another winter; the ${h.a('heating-oil-price-history', 'history page')} shows every season.</li>
</ul>
<p>For a whole season in your state, the ${h.a('winter-heating-budget', 'winter budget')} gives the gallons of each fuel, and the ${h.a('propane-prices', 'propane table')} and ${h.a('heating-oil-prices', 'heating oil table')} the prices.</p>
`,
  faqs: [
    { q: 'Is propane or heating oil cheaper to heat a house?', a: `It depends on the state and the week. Per million Btu delivered at ENERGY STAR efficiencies, oil heat cost ${K.usd(us.o)} and propane heat ${K.usd(us.p)} at this week's U.S. averages. In ${oilCheaper.length} of the ${both.length} states with both prices, oil was cheaper. Compare per unit of heat, not per gallon, because a gallon of oil carries more heat.` },
    { q: 'How many Btu are in a gallon of propane compared with heating oil?', a: `The EIA gives ${K.num(P.btu.propane)} Btu for a gallon of propane and ${K.num(P.btu.oil)} for a gallon of heating oil. So it takes about ${K.dec(ratio, 2)} gallons of propane to match the heat of one gallon of oil before efficiency. That is why a lower propane price per gallon does not mean cheaper heat.` },
    { q: 'What AFUE should I use for my boiler or furnace?', a: `The one on its label or in its manual. AFUE, annual fuel utilization efficiency, is the share of the fuel's heat that reaches the home over a season. ENERGY STAR certifies oil boilers at ${K.pct(P.efficiency.oil, 0)} and up and gas boilers at ${K.pct(P.efficiency.propane, 0)} and up; older units can be well below. A lower AFUE raises the cost of each million Btu delivered.` },
  ],
  tool: 'compare', toolArg: { st: 'PA' },
  related: ['propane-prices', 'heating-oil-prices', 'winter-heating-budget', 'propane-tank-fill-cost', 'heating-oil-price-history'],
  sources: ['eia_btu', 'energystar_boilers', 'eia_ho_weekly', 'eia_pr_weekly', 'eia_wfo'],
});
