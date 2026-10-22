import { defineState } from '../../lib/page-types';
import { KIT as K } from '../../lib/kit';

const st = K.SC('MA');
const oil = K.sum('MA', 'ho')!;
const pro = K.sum('MA', 'pr')!;
const yo = K.yoy('MA', 'ho');
const lastOil = K.lastDone('MA', 'ho')!;
const gallons = K.est(st, 'ho');

export default defineState({
  slug: 'massachusetts',
  title: 'Massachusetts Heating Oil Prices This Week, 2026-27 Season',
  description: `Massachusetts heating oil and propane prices from the weekly federal survey, 2026-27: cost of a 150 or 275 gallon delivery, winter bill and lock-in check.`,
  intro: `${K.ppg(oil.last[1])} a gallon for heating oil and ${K.ppg(pro.last[1])} for propane in the week of ${K.day(oil.last[0])}, before tax.`,
  resume: `Massachusetts households paid an average of ${K.ppg(oil.last[1])} a gallon for heating oil in the federal survey of ${K.day(oil.last[0])}, ${K.dir(yo, 'up', 'down')} ${yo === null ? '' : K.pct(Math.abs(yo), 0)} on the same week of last year, and ${K.ppg(pro.last[1])} for propane. At that price, 150 gallons cost ${K.usd(150 * oil.last[1])} and a full 275-gallon basement tank about ${K.usd(275 * oil.last[1])} before any delivery fee. The Census Bureau counts ${K.num(st.acs.oil)} Massachusetts homes heated with fuel oil or kerosene, ${K.pct(st.acs.oilShare, 0)} of the state's occupied homes, and ${K.num(st.acs.propane)} on bottled or tank gas. A normal Massachusetts winter brings ${K.num(st.hdd.winter)} heating degree days from November to March, which puts an average oil-heated home at about ${K.gal(gallons)} for the season, or ${K.usd(gallons * oil.last[1])} at this week's price. Last winter averaged ${K.ppg(lastOil.avg!)} a gallon. Prices are the EIA's state averages without taxes; your dealer's own price can be higher or lower.`,
  body: (h) => `
<h2>Where Massachusetts stands this week</h2>
<p>Among the ${K.ranked('ho').length} states the EIA surveys for heating oil, Massachusetts ranks ${K.place('MA', 'ho')} from the most expensive this week, ${K.dir(oil.last[1] - K.price('US', 'ho')!, 'above', 'below', 'level with')} the U.S. average of ${K.ppg(K.price('US', 'ho')!)}. The wholesale price for the same week was ${oil.wholesale ? K.ppg(oil.wholesale) : 'not published'}, so dealers in the state were working on a spread of about ${K.spread('MA', 'ho') === null ? 'an unknown amount' : K.ppg(K.spread('MA', 'ho')!)} a gallon to cover trucks, drivers, service plans and margin. That spread is what moves least from week to week; most of the change in the retail price comes from the wholesale market, which follows diesel and crude oil.</p>
<p>Propane tells a different story. Massachusetts ranks ${K.place('MA', 'pr')} of ${K.ranked('pr').length} states for propane this week. Propane is cheap at the wholesale level and expensive to deliver, so the state price sits far above what the gas itself costs, and it moves much less than heating oil from one winter to the next.</p>
${h.mini('fill', { t: 'Cost of your next oil delivery in Massachusetts', p: ['gauge', 'tank'], d: { st: 'MA', fuel: 'ho' }, c: 'Open the tank fill calculator' })}
<h2>A winter on oil in Massachusetts</h2>
<p>The degree days of the state do most of the work in a winter budget. Massachusetts counts ${K.num(st.hdd.month['01'])} degree days in a normal January against ${K.num(st.hdd.month['11'])} in November, so a tank empties more than ${K.dec(st.hdd.month['01'] / st.hdd.month['11'], 1)} times faster in January than in November. A home that takes a delivery every month in late fall can need one every two or three weeks after New Year. The EIA expects the average oil-heated home of the country to burn ${K.gal(K.W.ho.US.gal.base)} this winter in a normal season, ${K.gal(K.W.ho.US.gal.colder)} if it turns colder.</p>
<p>Last season shows how fast the bill can swing. The Massachusetts price started the 2025-26 heating season near ${K.ppg(lastOil.oct ?? lastOil.min[1])}, averaged ${K.ppg(lastOil.avg!)} from November to March and peaked at ${K.ppg(lastOil.max[1])} on ${K.day(lastOil.max[0])}. This week it is ${K.ppg(oil.last[1])}. A home that burned ${K.gal(gallons)} at last winter's average paid ${K.usd(gallons * lastOil.avg!)}; the same gallons at this week's price come to ${K.usd(gallons * oil.last[1])}.</p>
${h.mini('budget', { t: 'Your Massachusetts winter at this week\'s price', p: ['own', 'scen'], d: { st: 'MA', fuel: 'ho' }, c: 'Open the winter budget' })}
<h2>Prebuy offers and the October price</h2>
<p>Massachusetts dealers sell fixed-price and capped contracts in late summer and fall. Whether one pays depends on how the winter's average compares with the price you lock. Replayed on every winter since 2013-14, the mid-October Massachusetts price ended below the November to March average in ${K.replay(oil.seasons.filter((x) => x.s !== oil.season), oil.last[1]).up} of ${K.replay(oil.seasons.filter((x) => x.s !== oil.season), oil.last[1]).n} seasons. The ${h.a('lock-in-or-wait', 'lock-in calculator')} runs that history against the price your dealer offers.</p>
<h2>Help with the bill</h2>
<p>A household of three in Massachusetts can receive federal heating assistance with a yearly income up to ${K.usd(K.liheap('MA', 3))}, the federal ceiling set by 60 % of the state's median income, which is well above 150 % of the poverty line here. The state's program may apply its own limit within that ceiling; the ${h.a('liheap-income-limits', 'LIHEAP calculator')} gives the figure for each household size.</p>
`,
  faqs: [
    { q: 'Why is heating oil in Massachusetts so much dearer than last October?', a: 'The retail price follows the wholesale price of distillate, the same family of fuel as diesel. When wholesale heating oil rises, Massachusetts dealers pass it on within days. The spread between wholesale and retail, which pays for delivery and service, moves far less. The table on this page shows the October price and the winter average of every season since 2013-14.' },
    { q: 'How many Massachusetts homes still heat with oil?', a: `The Census Bureau counts homes by main heating fuel in its American Community Survey. Its 2024 one-year estimate finds ${K.num(st.acs.oil)} Massachusetts homes on fuel oil or kerosene, ${K.pct(st.acs.oilShare, 1)} of occupied homes, against ${K.num(st.acs.propane)} on bottled or tank gas and ${K.num(st.acs.gas)} on utility gas.` },
    { q: 'Does the Massachusetts price on this page include sales tax?', a: 'No. The EIA surveys residential prices excluding taxes in every state, so every figure here is before tax and before any delivery fee. Compare it with the per-gallon line of your delivery ticket, not with the total, and add a tax rate in the calculator options only if your ticket shows one.' },
  ],
  related: ['heating-oil-tank-fill-cost', 'lock-in-or-wait', 'winter-heating-budget', 'state:connecticut', 'state:new-hampshire', 'state:rhode-island'],
});
