import { defineGuide } from '../../lib/page-types';
import { KIT as K } from '../../lib/kit';

const W = K.W;
const rate = W.ho.US.gal.base / W.hdd.Northeast.base;
const sample = ['ME', 'MA', 'NY', 'PA', 'MD', 'VA', 'OH', 'MN'].map((c) => K.SC(c));

export default defineGuide({
  id: 'winter-heating-budget', group: 'costs', order: 12, slug: 'winter-heating-budget',
  nav: 'Winter heating budget', card: 'Gallons and dollars for November to March, scaled to your state\'s degree days.',
  title: 'Winter Heating Budget for Oil or Propane by State, 2026-27',
  description: `Winter heating budget for oil or propane in 2026-27: gallons for November to March scaled to your state's degree days, at this week's price, by month.`,
  h1: 'Your winter heating budget for oil or propane',
  intro: `The EIA expects an oil-heated home to spend ${K.usd(W.ho.US.spend.base)} this winter on average; your state's weather and this week's price give your own figure.`,
  resume: `A winter of heating oil costs the gallons your home burns from November to March times the price you pay. The EIA's Winter Fuels Outlook of October 2026 expects the average oil-heated household to burn ${K.gal(W.ho.US.gal.base)} in a normal winter and to spend ${K.usd(W.ho.US.spend.base)} at a forecast average of ${K.ppg(W.ho.US.price.base)} a gallon; propane households burn ${K.gal(W.pr.US.gal.base)} and spend ${K.usd(W.pr.US.spend.base)}. Those are national figures. The calculator scales them to your state with its normal heating degree days, the measure of how cold a winter is: Maine counts ${K.num(K.SC('ME').hdd.winter)} from November to March, Virginia ${K.num(K.SC('VA').hdd.winter)}. At this week's state price, an average oil-heated home in Massachusetts would spend ${K.usd(K.est(K.SC('MA'), 'ho') * K.price('MA', 'ho')!)} this winter. Enter last winter's gallons from your delivery tickets and the estimate becomes your own home's.`,
  body: (h) => `
<h2>How the estimate is built</h2>
<p>Fuel use follows heating degree days: each degree that a day's mean temperature falls below 65 °F adds one. The EIA's outlook (${h.src('eia_wfo', 'Table WF01')}) gives, for each region, the gallons an average household burns and the degree days expected over the same five months. Dividing one by the other gives gallons per degree day. For heating oil, ${K.pct(W.households.Northeast.ho / W.households.US.ho, 0)} of the households are in the Northeast, so the rate is the U.S. household's gallons over the Northeast's degree days: ${K.dec(rate, 3)} gallons per degree day. For propane, each region has its own row.</p>
<p>The rate is then multiplied by your state's normal November to March degree days from NOAA's population-weighted normals (${h.src('noaa_hdd', 'NOAA CPC, 1981-2010')}). A warmer or colder winter applies the EIA's own scenarios. When you type your gallons from last winter, the calculator uses them instead.</p>
${h.table(['State', 'Degree days, Nov to Mar', 'Oil, average home', 'At this week\'s price', 'Propane, average home', 'At this week\'s price'], sample.map((s) => [s.name, K.num(s.hdd.winter), K.gal(K.est(s, 'ho')), K.usd(K.est(s, 'ho') * K.price(s.code, 'ho')!), K.gal(K.est(s, 'pr')), K.usd(K.est(s, 'pr') * K.price(s.code, 'pr')!)]), `Normal winter. Prices: EIA weekly survey of ${K.day(K.L.last_week)}, excluding taxes.`, ['l', 'r', 'r', 'r', 'r', 'r'])}
<h2>Month by month</h2>
<p>A winter budget is not spread evenly. In a normal Pennsylvania winter, December, January and February bring ${K.num(K.SC('PA').hdd.month['12'] + K.SC('PA').hdd.month['01'] + K.SC('PA').hdd.month['02'])} of the season's ${K.num(K.SC('PA').hdd.winter)} degree days, January alone ${K.num(K.SC('PA').hdd.month['01'])} against ${K.num(K.SC('PA').hdd.month['11'])} in November; the calculator splits the season the same way, so you can see when the large bills fall. That timing matters for anyone on a budget plan, where the dealer spreads the estimated cost over equal monthly payments: the plan only works if the estimate is close.</p>
${h.mini('budget', { t: 'Your winter, your gallons', p: ['st', 'own'], d: { fuel: 'ho', st: 'NH' }, c: 'Open the full budget' })}
<h2>Three ways the estimate can miss</h2>
<ul>
<li><strong>Your home is not the average.</strong> Size, insulation, the thermostat setting and whether the boiler also heats your water all move the gallons. Last winter's tickets fix this: enter the total and the calculator uses it.</li>
<li><strong>The winter is not normal.</strong> The EIA's colder scenario adds ${K.pct(W.ho.US.gal.colder / W.ho.US.gal.base - 1, 0)} to oil use; the warmer one takes off ${K.pct(1 - W.ho.US.gal.warmer / W.ho.US.gal.base, 0)}. Switch the "Winter" choice to see both.</li>
<li><strong>The price moves.</strong> The budget uses this week's price for the whole season. The EIA forecasts ${K.ppg(W.ho.US.price.base)} a gallon on average for heating oil this winter, against ${K.ppg(K.price('US', 'ho')!)} in the survey this week. The calculator shows the cost at both.</li>
</ul>
<h2>Using the budget</h2>
<p>Set the money aside by month, or compare it with your dealer's budget plan. If a fixed-price contract is on offer, the gallons of this page are the ones to commit: the ${h.a('lock-in-or-wait', 'lock-in calculator')} takes them from here. If the total is beyond reach, check the ${h.a('liheap-income-limits', 'LIHEAP income ceiling')} of your state: the federal program helps with heating bills for households under it.</p>
`,
  faqs: [
    { q: 'How much heating oil does a house use in a winter?', a: `The EIA's average oil-heated household burns ${K.gal(W.ho.US.gal.base)} from November to March in a normal winter, according to its October 2026 outlook. A house in Maine or Vermont burns more because its winter has more degree days; one in Virginia burns less. Your own tickets from last winter are the best guide, and the calculator accepts them.` },
    { q: 'How much propane does a house use per winter?', a: `The EIA puts the average propane-heated household at ${K.gal(W.pr.US.gal.base)} for November to March nationwide: ${K.gal(W.pr.Northeast.gal.base)} in the Northeast, ${K.gal(W.pr.Midwest.gal.base)} in the Midwest and ${K.gal(W.pr.South.gal.base)} in the South. The figures include water heating where the home uses propane for it. Scale them to your state with the calculator.` },
    { q: 'What is a heating degree day?', a: 'A heating degree day measures how cold a day is for heating: it is the number of degrees by which the day\'s mean temperature falls below 65 °F. A day averaging 30 °F counts 35. Added over a season, degree days predict fuel use well, which is why the EIA and NOAA publish them and the budget calculator relies on them.' },
  ],
  tool: 'budget', toolArg: { fuel: 'ho', st: 'MA' },
  related: ['heating-oil-price-forecast', 'lock-in-or-wait', 'how-long-will-my-oil-last', 'heating-oil-tank-fill-cost', 'liheap-income-limits'],
  sources: ['eia_wfo', 'noaa_hdd', 'eia_ho_weekly', 'eia_pr_weekly'],
});
