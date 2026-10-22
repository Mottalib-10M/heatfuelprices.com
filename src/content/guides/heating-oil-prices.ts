import { defineGuide } from '../../lib/page-types';
import { KIT as K } from '../../lib/kit';

const us = K.sum('US', 'ho')!;
const top = K.ranked('ho');
const yo = K.yoy('US', 'ho');
const last = K.lastDone('US', 'ho')!;

export default defineGuide({
  id: 'heating-oil-prices', group: 'prices', order: 1, slug: 'heating-oil-prices',
  nav: 'Heating oil prices by state', card: `The ${K.ranked('ho').length} states of the federal survey, this week, with the change on a year.`,
  title: 'Home Heating Oil Prices per Gallon Today by State, 2026-27',
  description: `Home heating oil prices per gallon today, federal survey, 2026-27 winter: every state ranked, change on a year, wholesale spread, cost of 150 gallons.`,
  h1: 'Home heating oil prices per gallon today: compare states near you',
  intro: `The U.S. average was ${K.ppg(us.last[1])} a gallon in the week of ${K.day(us.last[0])}, before tax; pick your state for its own figure.`,
  resume: `Residential heating oil averaged ${K.ppg(us.last[1])} a gallon in the United States in the federal survey of ${K.day(us.last[0])}, ${K.dir(yo, 'up', 'down')} ${yo === null ? '' : K.pct(Math.abs(yo), 0)} from the same week a year earlier. ${top[0].name} was the most expensive of the ${top.length} surveyed states at ${K.ppg(K.price(top[0].code, 'ho')!)} and ${top[top.length - 1].name} the cheapest at ${K.ppg(K.price(top[top.length - 1].code, 'ho')!)}, a gap of ${K.ppg(K.price(top[0].code, 'ho')! - K.price(top[top.length - 1].code, 'ho')!)} a gallon, or ${K.usd(150 * (K.price(top[0].code, 'ho')! - K.price(top[top.length - 1].code, 'ho')!))} on a 150-gallon delivery. The Energy Information Administration collects these prices every Monday from October to March and publishes them on Wednesday, without taxes. Last winter the national price averaged ${K.ppg(last.avg!)} from November to March. The table below ranks every state, gives the change on a year and the spread over the wholesale price, and links to the page of each state with its own calculators.`,
  body: (h) => `
<h2>All surveyed states, from the dearest to the cheapest</h2>
${h.table(['Rank', 'State', 'Price a gallon', 'Week before', 'A year ago', 'Over wholesale'], top.map((s, i) => {
    const x = K.sum(s.code, 'ho')!;
    return [String(i + 1), h.a(`state:${s.slug}`, s.name), K.ppg(x.last[1]), x.prev ? K.ppg(x.prev[1]) : 'n/a', x.yearAgo ? K.ppg(x.yearAgo[1]) : 'n/a', K.spread(s.code, 'ho') === null ? 'n/a' : K.ppg(K.spread(s.code, 'ho')!)];
  }), `EIA weekly survey, residential No. 2 heating oil, week of ${K.day(us.last[0])}, dollars per gallon excluding taxes. Over wholesale: residential minus wholesale price of the same state and week.`, ['r', 'l', 'r', 'r', 'r', 'r'])}
<h2>Why the survey covers only ${top.length} states</h2>
<p>Heating oil is a regional fuel. The EIA's Winter Fuels Outlook counts ${K.num(K.W.households.US.ho)} American households that heat mainly with heating oil or kerosene, and ${K.num(K.W.households.Northeast.ho)} of them, ${K.pct(K.W.households.Northeast.ho / K.W.households.US.ho, 0)}, live in the Northeast. The weekly survey follows the fuel: New England, the Central Atlantic, the Lower Atlantic states of Virginia and North Carolina, and a band of Midwest states from Ohio to Nebraska. Outside those states too few homes burn oil for a weekly sample, and the site shows the U.S. average there, labeled as such.</p>
<p>The New England states carry the most weight. ${(() => { const r = [...K.STATES].sort((a, b) => b.acs.oilShare - a.acs.oilShare); return `${r[0].name}, with ${K.pct(r[0].acs.oilShare, 0)} of its homes on fuel oil or kerosene according to the Census Bureau, has the highest share of the surveyed states; ${r[1].name} (${K.pct(r[1].acs.oilShare, 0)}) and ${r[2].name} (${K.pct(r[2].acs.oilShare, 0)}) follow`; })()}. In the Midwest states of the survey, oil heats ${K.pct(Math.max(...K.STATES.filter((x) => x.region === 'Midwest' && x.ho).map((x) => x.acs.oilShare)), 0)} of homes at most, and propane is the fuel that rural households compare.</p>
${h.mini('price', { t: 'Price and cost of a delivery in your state', p: ['st', 'gal'], d: { fuel: 'ho' }, c: 'Open the full lookup' })}
<h2>Reading the gap between states</h2>
<p>Two things set a state's price: the wholesale price of distillate delivered to its terminals, and what dealers add on top for trucks, drivers, credit, service plans and margin. The wholesale column of the EIA tells them apart. This week the dealer spread ranges from ${K.ppg(Math.min(...top.map((s) => K.spread(s.code, 'ho') ?? 99)))} to ${K.ppg(Math.max(...top.map((s) => K.spread(s.code, 'ho') ?? 0)))} a gallon across the states that publish both. Wholesale prices move the whole table up or down together; the spread explains most of the order inside it, and it moves slowly.</p>
<p>A state average is not your price. Full-service dealers with burner contracts, discount cash-on-delivery dealers and automatic-delivery plans each price their own way. The survey is still a fair yardstick: if your delivery ticket shows a price far above your state's line for the same week, you have a reason to ask why.</p>
<h2>From the price to a bill</h2>
<p>A gallon price means little until it is multiplied. At this week's U.S. average, filling a 275-gallon basement tank from empty costs ${K.usd(275 * us.last[1])}. The ${h.a('heating-oil-tank-fill-cost', 'tank fill calculator')} works from your gauge reading, the ${h.a('winter-heating-budget', 'winter budget')} from your state's degree days, and the ${h.a('lock-in-or-wait', 'lock-in check')} from every winter since 2013-14. For the weeks past, the ${h.a('heating-oil-price-history', 'price history')} lists each season's October price, winter average and peak.</p>
<h2>When the numbers change</h2>
<p>The survey runs from the first Monday of October to the end of March. The EIA released this week's figures on ${K.day(K.L.release_date)} and plans the next release for ${K.day(K.L.next_release)}. The site reads the files that day and rebuilds every page; if the EIA's server does not answer, the previous week stays online with its date. Late reports can revise the week before by a cent or two, which is why the "week before" column can differ slightly from what you saw last Wednesday.</p>
`,
  faqs: [
    { q: 'Which state has the most expensive heating oil this week?', a: `In the EIA survey of ${K.day(us.last[0])}, ${top[0].name} had the highest average residential price at ${K.ppg(K.price(top[0].code, 'ho')!)} a gallon before tax, and ${top[1].name} came second at ${K.ppg(K.price(top[1].code, 'ho')!)}. The order changes from week to week by a few cents, so the table on this page is rebuilt every Wednesday with the new release.` },
    { q: 'Are the heating oil prices on this page with or without tax?', a: 'Without. The EIA collects and publishes residential heating oil prices excluding taxes in every state, so the figures compare states on the same basis. Your delivery ticket may add a state or local tax, an environmental fee or a delivery charge; the calculators let you add a tax rate in their options.' },
    { q: 'Why is there no heating oil price for my state?', a: `The EIA surveys heating oil only in the states where many homes burn it, mostly in the Northeast and the upper Midwest. If your state is not in the table, the calculators fall back on the U.S. average and say so. Propane is surveyed in more states, ${K.ranked('pr').length} this season, and has its own table.` },
    { q: 'How often are heating oil prices updated?', a: 'Every week of the heating season. Dealers report their price for Monday, the EIA publishes the averages on Wednesday, and this site reads them the same day. From April to September the survey stops, and the pages keep the last week of March until the new season starts in October.' },
  ],
  tool: 'price', toolArg: { fuel: 'ho' },
  related: ['propane-prices', 'heating-oil-tank-fill-cost', 'heating-oil-price-history', 'long-island-heating-oil-prices', 'state:massachusetts', 'state:pennsylvania'],
  sources: ['eia_shopp', 'eia_ho_weekly', 'eia_wfo', 'acs_b25040'],
});
