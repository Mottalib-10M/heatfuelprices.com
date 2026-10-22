import { defineGuide } from '../../lib/page-types';
import { KIT as K } from '../../lib/kit';

const o = K.sum('US', 'ho')!;
const p = K.sum('US', 'pr')!;
const done = o.seasons.filter((x) => x.avg);
const cheap = done.reduce((a, b) => (b.avg! < a.avg! ? b : a));
const dear = done.reduce((a, b) => (b.avg! > a.avg! ? b : a));
const pdone = p.seasons.filter((x) => x.avg);
const pcheap = pdone.reduce((a, b) => (b.avg! < a.avg! ? b : a));
const pdear = pdone.reduce((a, b) => (b.avg! > a.avg! ? b : a));

export default defineGuide({
  id: 'heating-oil-price-history', group: 'prices', order: 4, slug: 'heating-oil-price-history',
  nav: 'Heating oil price history', card: 'Every winter since 2013-14: October price, winter average, high and low, by state.',
  title: 'Heating Oil Price History by Winter Since 2013, Updated 2026',
  description: `Heating oil price history since the 2013-14 winter, updated 2026: each season's October price, winter average, high and low, by state, propane included.`,
  h1: 'Heating oil price history, winter by winter',
  intro: `This week's U.S. average of ${K.ppg(o.last[1])} compares with winter averages from ${K.ppg(cheap.avg!)} (${cheap.s}) to ${K.ppg(dear.avg!)} (${dear.s}).`,
  resume: `The federal weekly survey gives a clean record of what households paid for heating oil each winter since 2013-14. Nationwide, the November to March average was lowest in ${cheap.s} at ${K.ppg(cheap.avg!)} a gallon and highest in ${dear.s} at ${K.ppg(dear.avg!)}. The highest single week on file is ${K.ppg(o.record[1])}, in the week of ${K.day(o.record[0])}. This week's ${K.ppg(o.last[1])} is ${K.dir(o.last[1] - dear.avg!, 'above', 'below', 'level with')} the dearest winter average by ${K.pct(Math.abs(o.last[1] / dear.avg! - 1), 0)}. Propane has moved within a narrower band: its winter averages ran from ${K.ppg(pcheap.avg!)} in ${pcheap.s} to ${K.ppg(pdear.avg!)} in ${pdear.s}. The calculator above shows the history of any surveyed state and fuel, with each season's mid-October price, its winter average and its high and low weeks. All prices are as published, excluding taxes and without adjusting for inflation.`,
  body: (h) => `
<h2>U.S. average, every winter on file</h2>
${h.table(['Winter', 'Heating oil, mid-October', 'Heating oil, Nov-Mar', 'Heating oil high', 'Propane, mid-October', 'Propane, Nov-Mar'], o.seasons.slice().reverse().map((x) => { const y = p.seasons.find((z) => z.s === x.s); return [x.s, x.oct ? K.ppg(x.oct) : 'n/a', x.avg ? K.ppg(x.avg) : 'in progress', `${K.ppg(x.max[1])} (${K.day(x.max[0])})`, y?.oct ? K.ppg(y.oct) : 'n/a', y?.avg ? K.ppg(y.avg) : y ? 'in progress' : 'n/a']; }), 'EIA weekly survey, U.S. residential averages, dollars per gallon excluding taxes, not adjusted for inflation.', ['l', 'r', 'r', 'r', 'r', 'r'])}
<h2>Reading the record</h2>
<p>Three things stand out. First, heating oil's winters differ far more than propane's: the dearest heating oil winter cost ${K.pct(dear.avg! / cheap.avg! - 1, 0)} more a gallon than the cheapest, against ${K.pct(pdear.avg! / pcheap.avg! - 1, 0)} for propane. Heating oil is a distillate, the same family of fuel as diesel (${h.src('eia_heating_oil', 'EIA')}), and its price follows that market; residential propane carries a large delivery margin over its wholesale price, and that margin moves slowly.</p>
<p>Second, the price inside a winter is not flat. In ${dear.s}, the national price ranged from ${K.ppg(dear.min[1])} to ${K.ppg(dear.max[1])} over the season. A household that filled its tank at the wrong week paid much more than one that filled at the right one, which is the case for spreading deliveries or for a capped contract.</p>
<p>Third, October is a poor predictor. The mid-October price was followed by a higher winter average in ${K.replay(o.seasons.filter((x) => x.s !== o.season), o.last[1]).up} of ${K.replay(o.seasons.filter((x) => x.s !== o.season), o.last[1]).n} winters for heating oil. The ${h.a('lock-in-or-wait', 'lock-in page')} turns that into a test of your dealer's offer.</p>
${h.mini('history', { t: 'History of your state', p: ['st', 'fuel'], d: { st: 'ME', fuel: 'ho' }, c: 'Open the full history' })}
<h2>States apart</h2>
<p>State histories follow the national line with their own gap. In the Northeast, where most oil-heated homes are, the gap to the U.S. average is small because those states make up most of it. In the Midwest states of the survey, heating oil has often been cheaper; propane there is among the cheapest in the country. Each state page carries its own winter-by-winter table and the curve of this season against the last.</p>
<h2>Putting your own tickets next to the record</h2>
<p>Delivery tickets carry the date, the gallons and the price per gallon. Set them against the weekly series of your state and you see whether your dealer tracked the market, ran above it in a cold week, or held a contract price while the average moved. A household that paid ${K.ppg(dear.max[1])} in the dearest week of ${dear.s} paid ${K.pct(dear.max[1] / dear.avg! - 1, 0)} over that winter's average; spreading the same gallons over the season would have cost the average. The state pages give each season's high and its date, so a single expensive delivery can be placed in its winter.</p>
<h2>What the history does not show</h2>
<ul>
<li><strong>Summer prices.</strong> The survey runs from October to March only, so it cannot show the price when dealers sell summer fills and contracts.</li>
<li><strong>Inflation.</strong> Prices are as published. A dollar of 2014 bought more than a dollar of 2026.</li>
<li><strong>Your dealer.</strong> A state average hides the spread between dealers in the same town.</li>
<li><strong>Before 2013.</strong> The site keeps the weekly survey from October 2013. The EIA's own pages go back further: ${h.src('eia_ho_weekly', 'EIA weekly heating oil series')}.</li>
</ul>
<p>For the coming winter, the EIA's own forecast is on the ${h.a('heating-oil-price-forecast', 'forecast page')}.</p>
`,
  faqs: [
    { q: 'What was the highest heating oil price ever recorded in this data?', a: `Since October 2013, the highest weekly U.S. average in the EIA survey is ${K.ppg(o.record[1])} a gallon, in the week of ${K.day(o.record[0])}, excluding taxes. The highest winter average is ${K.ppg(dear.avg!)}, in ${dear.s}. State records are on each state page; they can sit well above the national figure in the dearest states.` },
    { q: 'Were heating oil prices lower ten years ago?', a: `The U.S. winter average was ${K.ppg(o.seasons.find((x) => x.s === '2015-16')?.avg ?? cheap.avg!)} a gallon in 2015-16 and ${K.ppg(o.seasons.find((x) => x.s === '2016-17')?.avg ?? cheap.avg!)} in 2016-17, against ${K.ppg(o.last[1])} in the survey this week. Those are prices as published, not adjusted for inflation, so part of the gap is the general rise in prices.` },
    { q: 'Why does the history start in 2013?', a: 'The site keeps every week of the EIA survey since October 2013, which gives more than a dozen complete winters for most states, enough to compare October prices with winter averages season by season. Some propane series start in October 2014. The EIA\'s own series go back further for many states.' },
  ],
  tool: 'history', toolArg: { st: 'MA', fuel: 'ho' },
  related: ['lock-in-or-wait', 'heating-oil-price-forecast', 'heating-oil-prices', 'propane-prices', 'heating-oil-vs-propane'],
  sources: ['eia_ho_weekly', 'eia_pr_weekly', 'eia_shopp'],
});
