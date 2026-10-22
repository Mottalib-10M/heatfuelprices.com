import { defineGuide } from '../../lib/page-types';
import { KIT as K } from '../../lib/kit';

const usO = K.sum('US', 'ho')!;
const usP = K.sum('US', 'pr')!;
const past = (x: typeof usO) => x.seasons.filter((s) => s.s !== x.season);
const rO = K.replay(past(usO), usO.last[1]);
const rP = K.replay(past(usP), usP.last[1]);
const bigUp = rO.rows.reduce((a, b) => (b.change > a.change ? b : a));
const bigDown = rO.rows.reduce((a, b) => (b.change < a.change ? b : a));
const states = K.ranked('ho').map((s) => ({ s, r: K.replay(past(K.sum(s.code, 'ho')!), K.price(s.code, 'ho')!) }));

export default defineGuide({
  id: 'lock-in-or-wait', group: 'buying', order: 20, slug: 'lock-in-or-wait',
  nav: 'Lock in a price or wait', card: 'A fixed or capped price against every winter since 2013-14 in your state.',
  title: 'Lock In Heating Oil Price or Wait? Prebuy Check for 2026-27',
  description: `Lock in a heating oil or propane price for 2026-27? Your dealer's fixed price against this week's average and every winter since 2013-14 in your state.`,
  h1: 'Lock in a heating oil price or wait?',
  intro: `In ${rO.up} of the last ${rO.n} winters, the U.S. heating oil price from November to March averaged above its mid-October level.`,
  resume: `A fixed-price or prebuy contract pays off when the winter's average price ends above the price you lock. The federal survey lets you check how often that has happened. For heating oil, the U.S. winter average ended above the mid-October price in ${rO.up} of the ${rO.n} winters since 2013-14, with a median change of ${K.pct(rO.median, 1)}; the swings ran from ${K.pct(bigDown.change, 0)} in ${bigDown.s} to ${K.pct(bigUp.change, 0)} in ${bigUp.s}. For propane the winter beat October in ${rP.up} of ${rP.n} seasons, median ${K.pct(rP.median, 1)}. History is not a forecast, but it frames the bet. The calculator takes the price your dealer offers, the gallons you commit to and any fee, then tells you what the lock saves or costs at this week's ${K.ppg(usO.last[1])} U.S. average and in each past winter replayed from today's price. It also gives the break-even price: the winter average above which the contract comes out ahead.`,
  body: (h) => `
<h2>Three kinds of contract</h2>
<ul>
<li><strong>Fixed price.</strong> You agree a price per gallon for the season, sometimes for a set number of gallons. If the market falls, you still pay the fixed price.</li>
<li><strong>Prebuy.</strong> You pay in advance for a number of gallons at a set price. Gallons left unused at the end of the season may or may not carry over; the contract says which.</li>
<li><strong>Price cap.</strong> You pay the market price up to a ceiling, and the ceiling above it. Caps usually cost a fee.</li>
</ul>
<p>The calculator handles all three with the same arithmetic: gallons × (market price − your price) − fee. For a cap, enter the cap as the price and remember that you keep the gain when the market ends lower, which the calculator does not count.</p>
<h2>What history says, state by state</h2>
${h.table(['State', 'This week', 'Winters above mid-October', 'Median change', 'Largest rise'], states.map(({ s, r }) => [h.a(`state:${s.slug}`, s.name), K.ppg(K.price(s.code, 'ho')!), `${r.up} of ${r.n}`, K.pct(r.median, 1), K.pct(Math.max(...r.rows.map((x) => x.change)), 0)]), 'Heating oil, EIA weekly survey since October 2013. Mid-October: the survey week nearest October 15; winter: average of November to March.', ['l', 'r', 'r', 'r', 'r'])}
<p>The pattern is not even. Some winters, such as ${bigUp.s}, ran far above their October price; others, such as ${bigDown.s}, fell well below it. A median close to zero means the October price has been a fair guess on average; it says nothing about this winter.</p>
${h.mini('lockin', { t: 'Your dealer\'s offer against this winter', p: ['fixed', 'gal'], d: { st: 'CT', fuel: 'ho' }, c: 'Open the full lock-in check' })}
<h2>How to read the result</h2>
<p>The headline compares the locked price with this week's state average for all the gallons. That is the cost of locking today against buying at today's price all winter, a fair first check but not the real alternative, since the market will move. The replay table applies each past winter's change from mid-October to its November to March average to today's price, so it shows the range of winters you could get. The break-even price is the simplest test: if you think the winter will average above it, the lock pays.</p>
<h2>Questions to ask before signing</h2>
<ul>
<li>Is the price per gallon fixed for any quantity, or only for the gallons prepaid?</li>
<li>What happens to unused prepaid gallons in April?</li>
<li>Is there a fee, and is it refundable?</li>
<li>Does the contract require automatic delivery, a service plan or a minimum purchase?</li>
<li>How does the offered price compare with your state's line in the ${h.a('heating-oil-prices', 'weekly table')} for the same week?</li>
</ul>
<h2>Gallons to commit</h2>
<p>A contract for more gallons than you burn ties up money; one for fewer leaves you on the market for the rest. The ${h.a('winter-heating-budget', 'winter budget')} gives your state's estimate for an average home, or uses your own gallons from last winter. The EIA's forecast for this winter, on the ${h.a('heating-oil-price-forecast', 'forecast page')}, is another reference point for the break-even price.</p>
`,
  faqs: [
    { q: 'Is it worth locking in a heating oil price?', a: `Only if the winter average ends above your locked price plus any fee. Since 2013-14, the U.S. winter average ended above the mid-October price in ${rO.up} of ${rO.n} winters, ${rO.up / rO.n > 0.35 && rO.up / rO.n < 0.65 ? 'so locking has been close to a coin toss, with large swings both ways' : rO.up / rO.n >= 0.65 ? 'so the October price has more often turned out cheap' : 'so the October price has more often turned out dear'}. The calculator gives your break-even price and replays every winter in your state.` },
    { q: 'What is a heating oil prebuy contract?', a: 'An agreement to pay in advance for a set number of gallons at a set price for the coming winter. It protects against a price rise and makes the budget predictable. It costs you if prices fall, and unused gallons may be lost or refunded depending on the contract. Read the terms on carry-over and refunds before paying.' },
    { q: 'When is the best time to lock in a propane price?', a: `The federal survey runs only from October to March, so it cannot show summer prices. Among the weeks it covers, mid-October has been followed by a higher propane winter average in ${rP.up} of ${rP.n} seasons nationwide. Many dealers sell contracts in late summer; compare their offer with the state's October survey price once it appears.` },
  ],
  tool: 'lockin', toolArg: { st: 'MA', fuel: 'ho' },
  related: ['heating-oil-price-history', 'heating-oil-price-forecast', 'winter-heating-budget', 'heating-oil-prices', 'propane-prices'],
  sources: ['eia_ho_weekly', 'eia_pr_weekly', 'eia_wfo'],
});
