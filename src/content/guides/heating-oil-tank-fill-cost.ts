import { defineGuide } from '../../lib/page-types';
import { KIT as K } from '../../lib/kit';

const us = K.sum('US', 'ho')!;
const p = us.last[1];
const ya = us.yearAgo?.[1] ?? null;
const sizes = [275, 330, 500, 550, 1000];

export default defineGuide({
  id: 'heating-oil-tank-fill-cost', group: 'costs', order: 10, slug: 'heating-oil-tank-fill-cost',
  nav: 'Heating oil tank fill cost', card: 'What your next delivery costs, from the gauge reading and this week\'s price.',
  title: 'Heating Oil Tank Fill Cost This Week, 275 Gallons, 2026',
  description: `Heating oil tank fill cost at this week's 2026 state price: enter tank size and gauge reading, get the gallons and the bill for a 275, 330 or 550 gallon tank.`,
  h1: 'What it costs to fill a heating oil tank this week',
  intro: `At the U.S. average of ${K.ppg(p)} a gallon, filling a 275-gallon tank from a quarter full costs about ${K.usd(275 * 0.75 * p)} before tax.`,
  resume: `Filling a heating oil tank costs the gallons it takes times your dealer's price per gallon. With the U.S. average of ${K.ppg(p)} from the federal survey of ${K.day(us.last[0])}, a standard 275-gallon tank that reads one quarter on its gauge takes up to ${K.num(275 * 0.75)} gallons, or ${K.usd(275 * 0.75 * p)}; the same tank filled from empty is ${K.usd(275 * p)}. ${ya ? `A year ago the same quarter-to-full delivery would have cost ${K.usd(275 * 0.75 * ya)} at ${K.ppg(ya)} a gallon.` : ''} The price differs by state, so the calculator above starts from your state's average for the week and lets you enter the price your dealer quotes. Real deliveries stop a little short of the brim and dealers do not empty a tank to the last drop, so treat the figure as the most the delivery can cost before tax and any fee. The gauge is the key input: read it before you call, because a tank at one half needs a third fewer gallons than a tank at one quarter.`,
  body: (h) => `
<h2>The arithmetic of a delivery</h2>
<p>A heating oil tank is sold by its nominal size. The gauge on top, a float under a small glass dome, reads in fractions: F, 3/4, 1/2, 1/4, E. Gallons needed = tank size × (1 − gauge fraction). A 275-gallon tank at 1/4 needs up to ${K.num(275 * 0.75)} gallons; at 1/2, ${K.num(275 * 0.5)}. Multiply by the price per gallon and you have the bill before tax and fees. The calculator does exactly this and nothing else, so you can check a delivery ticket line by line.</p>
<p>The table gives the cost at this week's U.S. average for a range of tank sizes, from a single basement tank to a pair of large ones.</p>
${h.table(['Tank size', 'From 1/4 full', 'From 1/2 full', 'From empty'], sizes.map((g) => [`${K.num(g)} gallons`, K.usd(g * 0.75 * p), K.usd(g * 0.5 * p), K.usd(g * p)]), `At ${K.ppg(p)} a gallon, the EIA's U.S. average for ${K.day(us.last[0])}, excluding taxes. Real deliveries stop short of the nominal size, so these are upper bounds.`, ['l', 'r', 'r', 'r'])}
<h2>Why the state matters more than the tank</h2>
<p>The same 200 gallons cost ${K.usd(200 * K.price(K.ranked('ho')[0].code, 'ho')!)} at this week's average in ${K.ranked('ho')[0].name} and ${K.usd(200 * K.price(K.ranked('ho').at(-1)!.code, 'ho')!)} in ${K.ranked('ho').at(-1)!.name}. Within a state the dealer matters too: the survey is an average of many dealers, some full-service with burner maintenance included, some cash-on-delivery. The calculator's "Your dealer's price" option replaces the state average with the price you were quoted.</p>
${h.mini('fill', { t: 'Try your own tank and gauge', p: ['tank', 'gauge'], d: { fuel: 'ho', st: 'CT' }, c: 'Back to the full calculator' })}
<h2>Taxes, fees and minimums</h2>
<p>The federal survey excludes taxes, so its prices are comparable from state to state. Your ticket can add a state or local tax, an environmental or spill fund fee, a small-delivery charge or a weekend surcharge. Heating oil is dyed red because it is exempt from the federal, state and local taxes on fuel for road vehicles, as the EIA explains (${h.src('eia_heating_oil', 'heating oil explained')}); other taxes depend on the state. Enter the rate on your ticket in the calculator options to see the full bill.</p>
<h2>How often you will fill it</h2>
<p>A fill buys a number of degree days, not a number of weeks. The EIA's average oil-heated home burns ${K.gal(K.W.ho.US.gal.base)} from November to March in a normal winter, about ${K.dec(K.W.ho.US.gal.base / K.W.hdd.Northeast.base, 2)} gallons per heating degree day. A normal January in Connecticut brings ${K.num(K.SC('CT').hdd.month['01'])} degree days against ${K.num(K.SC('CT').hdd.month['11'])} in November, so the same delivery lasts ${K.pct(K.SC('CT').hdd.month['11'] / K.SC('CT').hdd.month['01'], 0)} as long after New Year. The ${h.a('how-long-will-my-oil-last', 'days-left calculator')} runs your gallons against your state's normal weather, and the ${h.a('winter-heating-budget', 'winter budget')} adds up the season.</p>
<h2>Before you order</h2>
<ul>
<li>Read the gauge and note the date: two readings a week apart give your own burn rate.</li>
<li>Compare the quoted price with your state's line in the ${h.a('heating-oil-prices', 'weekly table')}; a quote far above it deserves a question.</li>
<li>Ask whether the price changes with the size of the delivery: many dealers price 100 gallons higher than 150 or more.</li>
<li>If a fixed or capped price is on offer, run it through the ${h.a('lock-in-or-wait', 'lock-in check')} first.</li>
</ul>
`,
  faqs: [
    { q: 'How much does it cost to fill a 275 gallon oil tank?', a: `At this week's U.S. average of ${K.ppg(p)} a gallon, excluding taxes, a 275-gallon tank costs up to ${K.usd(275 * p)} from empty and ${K.usd(275 * 0.75 * p)} from a quarter full. A real fill stops a little below the nominal size, so the bill is usually somewhat lower. Use your state's price or your dealer's quote in the calculator for your own figure.` },
    { q: 'How many gallons does a 275 gallon oil tank really hold?', a: 'Less than its name. The 275 on the label is the nominal size, and a delivery stops before the oil reaches the top to leave room for expansion and for the vent. The gauge reading F marks the practical full level. That is why the calculator gives the most a delivery can cost: the real number of gallons on your ticket is the reference.' },
    { q: 'Is it cheaper to fill an oil tank all at once?', a: 'Often, per gallon. Many dealers price small deliveries higher or add a small-delivery fee, so a larger order can cost less per gallon; ask before you order. A full tank also protects against a price jump during a cold spell. It ties up more money at once, and the price you pay is the price of that day, high or low.' },
  ],
  tool: 'fill', toolArg: { fuel: 'ho', st: 'MA', tank: 275, gauge: 25 },
  related: ['heating-oil-prices', 'how-long-will-my-oil-last', 'winter-heating-budget', 'lock-in-or-wait', 'propane-tank-fill-cost'],
  sources: ['eia_ho_weekly', 'eia_heating_oil', 'eia_wfo'],
});
