import { defineGuide } from '../../lib/page-types';
import { KIT as K } from '../../lib/kit';

const us = K.sum('US', 'pr')!;
const top = K.ranked('pr');
const yo = K.yoy('US', 'pr');
const last = K.lastDone('US', 'pr')!;
const hi = top[0], lo = top[top.length - 1];
const regions = ['R1X', 'R1Y', 'R1Z', 'R20', 'R30', 'R40'].filter((r) => K.sum(r, 'pr'));

export default defineGuide({
  id: 'propane-prices', group: 'prices', order: 2, slug: 'propane-prices',
  nav: 'Propane prices by state', card: 'Residential propane in every surveyed state this week, from Florida to North Dakota.',
  title: 'Propane Prices by State This Week, 2026-27 Heating Season',
  description: `Propane prices by state from the federal weekly survey, 2026-27 heating season: every state ranked, change on a year and the cost of a 500 gallon tank fill.`,
  h1: 'Propane prices by state this week',
  intro: `Residential propane averaged ${K.ppg(us.last[1])} a gallon across the country in the week of ${K.day(us.last[0])}, before tax.`,
  resume: `Propane for home heating averaged ${K.ppg(us.last[1])} a gallon nationwide in the federal survey of ${K.day(us.last[0])}, ${K.dir(yo, 'up', 'down')} ${yo === null ? '' : K.pct(Math.abs(yo), 0)} on the same week of last year. The spread between states is far wider than for heating oil: ${hi.name} paid ${K.ppg(K.price(hi.code, 'pr')!)} and ${lo.name} ${K.ppg(K.price(lo.code, 'pr')!)}, so the same 400 gallons cost ${K.usd(400 * K.price(hi.code, 'pr')!)} in one and ${K.usd(400 * K.price(lo.code, 'pr')!)} in the other. A 500-gallon tank takes about 250 gallons when its gauge reads 30 % and it is filled to 80 %, which is ${K.usd(250 * us.last[1])} at the national average. The EIA surveys ${top.length} states every Monday from October to March and publishes on Wednesday, excluding taxes. Last winter the national price averaged ${K.ppg(last.avg!)} from November to March, and the wholesale price this week was ${us.wholesale ? K.ppg(us.wholesale) : 'not published'}.`,
  body: (h) => `
<h2>Every surveyed state, ranked</h2>
${h.table(['Rank', 'State', 'Price a gallon', 'A year ago', 'Last winter average', '400 gallons'], top.map((s, i) => {
    const x = K.sum(s.code, 'pr')!;
    const ld = K.lastDone(s.code, 'pr');
    return [String(i + 1), h.a(`state:${s.slug}`, s.name), K.ppg(x.last[1]), x.yearAgo ? K.ppg(x.yearAgo[1]) : 'n/a', ld?.avg ? K.ppg(ld.avg) : 'n/a', K.usd(400 * x.last[1])];
  }), `EIA weekly survey, residential propane, week of ${K.day(us.last[0])}, dollars per gallon excluding taxes. Last winter: average of November 2025 to March 2026.`, ['r', 'l', 'r', 'r', 'r', 'r'])}
<h2>Why propane costs twice as much in some states</h2>
<p>The gas itself is cheap and close to uniform: the wholesale price the EIA publishes this week sits between ${K.ppg(Math.min(...top.map((s) => K.sum(s.code, 'pr')!.wholesale ?? 99)))} and ${K.ppg(Math.max(...top.map((s) => K.sum(s.code, 'pr')!.wholesale ?? 0)))} a gallon in the states that report it. What differs is what is added between the terminal and the tank in the yard: the part of the price that pays for trucks, drivers, storage, tank rental and the dealer's margin. In the Midwest district this week, residential propane sits ${K.sum('R20', 'pr')!.wholesale ? K.ppg(K.sum('R20', 'pr')!.last[1] - K.sum('R20', 'pr')!.wholesale!) : 'an unpublished amount'} above wholesale; on the East Coast, ${K.sum('R10', 'pr')!.wholesale ? K.ppg(K.sum('R10', 'pr')!.last[1] - K.sum('R10', 'pr')!.wholesale!) : 'an unpublished amount'}. The EIA counts ${K.num(K.W.households.Midwest.pr)} propane-heated households in the Midwest, more than in any other region.</p>
<p>The regional averages of the survey show the pattern at a glance:</p>
${h.table(['Region (petroleum district)', 'Residential', 'Wholesale', 'Difference'], regions.map((r) => { const x = K.sum(r, 'pr')!; return [K.PADD_NAME[r], K.ppg(x.last[1]), x.wholesale ? K.ppg(x.wholesale) : 'n/a', x.wholesale ? K.ppg(x.last[1] - x.wholesale) : 'n/a']; }), `EIA weekly survey, week of ${K.day(us.last[0])}, excluding taxes.`, ['l', 'r', 'r', 'r'])}
${h.mini('fill', { t: 'Cost to fill your propane tank this week', p: ['st', 'gauge'], d: { fuel: 'pr', st: 'PA', tank: 500 }, c: 'Open the propane tank calculator' })}
<h2>Propane prices move less than oil, but not less in every week</h2>
<p>Over the seasons on file, the national propane price has been steadier than heating oil from one winter to the next. Its highest weeks fall in the depth of winter: the national high since October 2013 was ${K.ppg(us.record[1])} in the week of ${K.day(us.record[0])}. That shape matters for anyone choosing between a fixed price and the weekly market. The ${h.a('lock-in-or-wait', 'lock-in calculator')} replays every past winter of your state, and the ${h.a('winter-heating-budget', 'winter budget')} turns your state's degree days into gallons.</p>
<h2>Propane in states without a heating oil survey</h2>
<p>In ${top.filter((s) => !s.ho).length} of the surveyed states, propane is the only heating fuel the EIA follows: Texas, Florida, Georgia, the Plains, the Rocky Mountain states and the Deep South. The EIA's Winter Fuels Outlook expects an average propane-heated household to burn ${K.gal(K.W.pr.US.gal.base)} this winter nationwide, from ${K.gal(K.W.pr.South.gal.base)} in the South to ${K.gal(K.W.pr.Midwest.gal.base)} in the Midwest. Each state page gives its own price, the curve of the season and every winter since the survey began there.</p>
<h2>A rule to keep in mind when reading a delivery ticket</h2>
<p>Propane is delivered as a liquid that expands as it warms, so tanks are never filled to the top. Federal rules for aboveground home tanks cap the fill at ${K.pct(K.P.propaneFill.weightPct, 0)} of the weight of water the tank holds, which is about ${K.pct(K.volumeFromDensity(K.P.propaneFill.weightPct, K.P.propaneFill.sgHigh), 0)} of its volume; the gauge of a full tank therefore reads about 80 %. A tank of 500 gallons holds about 400 gallons of propane at most. The ${h.a('propane-tank-fill-cost', 'propane tank page')} explains the rule and the tank sizes.</p>
`,
  faqs: [
    { q: 'What is the average price of propane per gallon this week?', a: `The EIA's national average for residential propane was ${K.ppg(us.last[1])} a gallon in the week of ${K.day(us.last[0])}, excluding taxes. State averages ranged from ${K.ppg(K.price(lo.code, 'pr')!)} in ${lo.name} to ${K.ppg(K.price(hi.code, 'pr')!)} in ${hi.name}. Your dealer's price depends on your contract, the size of the delivery and whether you rent or own the tank.` },
    { q: 'Which states have the cheapest propane?', a: `This week the lowest averages were in ${top.slice(-3).reverse().map((s) => `${s.name} (${K.ppg(K.price(s.code, 'pr')!)})`).join(', ')}. The cheapest states sit in the Midwest and the Plains, where the gap between the residential and the wholesale price is the narrowest of the survey. The order of the table changes little from one week to the next.` },
    { q: 'Do propane prices include the tank rental?', a: 'No. The survey records the price per gallon a dealer charges households, excluding taxes. A tank rental, a minimum delivery charge or a fee for a delivery outside the normal route is billed separately and does not appear in the state average. Compare the per-gallon line of your invoice with the state figure.' },
  ],
  tool: 'price', toolArg: { fuel: 'pr', st: 'PA', gal: 250 },
  related: ['propane-tank-fill-cost', 'heating-oil-prices', 'heating-oil-vs-propane', 'state:texas', 'state:michigan', 'state:florida'],
  sources: ['eia_shopp', 'eia_pr_weekly', 'eia_wfo', 'osha_lpg'],
});
