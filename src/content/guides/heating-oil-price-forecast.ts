import { defineGuide } from '../../lib/page-types';
import { KIT as K } from '../../lib/kit';

const W = K.W;
const s = W.seasons;
const cur = s[s.length - 1], prev = s[s.length - 2];
const ho = W.ho.US;
const now = K.price('US', 'ho')!;
const regions = ['Northeast', 'Midwest', 'South', 'US'];

export default defineGuide({
  id: 'heating-oil-price-forecast', group: 'prices', order: 5, slug: 'heating-oil-price-forecast',
  nav: 'Price forecast for this winter', card: 'The EIA\'s forecast for heating oil and propane this winter, and what it means for a bill.',
  title: 'Heating Oil Price Forecast for Winter 2026-27, EIA Outlook',
  description: `Heating oil price forecast for winter 2026-27 from the EIA's October outlook: average price, gallons and bill per home, colder cases, propane by region.`,
  h1: 'Heating oil price forecast for winter 2026-27',
  intro: `The EIA forecasts ${K.ppg(ho.price.base)} a gallon on average for heating oil from November to March, against ${K.ppg(ho.price.history[prev])} last winter.`,
  resume: `The Energy Information Administration's Winter Fuels Outlook, published with its Short-Term Energy Outlook of October 2026, forecasts an average residential heating oil price of ${K.ppg(ho.price.base)} a gallon for November 2026 to March 2027, ${K.dir(ho.price.base - ho.price.history[prev], 'up', 'down')} ${K.pct(Math.abs(ho.price.base / ho.price.history[prev] - 1), 0)} from last winter's ${K.ppg(ho.price.history[prev])}. With a normal winter the average oil-heated household would burn ${K.gal(ho.gal.base)} and spend ${K.usd(ho.spend.base)}, ${K.dir(ho.spend.base - ho.spend.history[prev], 'up', 'down')} ${K.pct(Math.abs(ho.spend.base / ho.spend.history[prev] - 1), 0)} on the year; a colder winter would take the bill to ${K.usd(ho.spend.colder)}, a warmer one to ${K.usd(ho.spend.warmer)}. For propane the EIA forecasts ${K.ppg(W.pr.US.price.base)} a gallon nationwide and ${K.ppg(W.pr.Northeast.price.base)} in the Northeast. The weekly survey of ${K.day(K.L.last_week)} puts heating oil at ${K.ppg(now)}, so the season has opened ${K.dir(now - ho.price.base, 'above', 'below', 'at')} the forecast average. A forecast is revised every month; the figures here are the EIA's, not ours.`,
  body: (h) => `
<h2>The forecast in one table</h2>
${h.table(['', ...s.slice(-3)], [
    ['Heating oil price, U.S.', ...s.slice(-3).map((k) => K.ppg(ho.price.history[k]))],
    ['Gallons per household', ...s.slice(-3).map((k) => K.num(ho.gal.history[k]))],
    ['Winter bill per household', ...s.slice(-3).map((k) => K.usd(ho.spend.history[k]))],
    ['Propane price, U.S.', ...s.slice(-3).map((k) => K.ppg(W.pr.US.price.history[k]))],
    ['Propane bill per household, U.S.', ...s.slice(-3).map((k) => K.usd(W.pr.US.spend.history[k]))],
    ['Heating degree days, Northeast', ...s.slice(-3).map((k) => K.num(W.hdd.Northeast.history[k]))],
  ], `EIA Winter Fuels Outlook, Table WF01 (${W.release}). ${cur}: forecast. Winter: November 1 to March 31. Prices exclude taxes.`, ['l', 'r', 'r', 'r'])}
<h2>Where the forecast comes from</h2>
<p>The winter outlook is part of the EIA's monthly Short-Term Energy Outlook (${h.src('eia_steo', 'STEO')}). Prices are nominal; consumption per household comes from the EIA's 2020 Residential Energy Consumption Survey, corrected for actual and projected heating degree days (${h.src('eia_wfo', 'Table WF01')}). The forecast covers the five months from November through March, and the EIA publishes a warmer case and a colder case for weather ${W.hdd.Northeast.warmer && W.hdd.Northeast.colder ? `${K.pct(1 - W.hdd.Northeast.warmer / W.hdd.Northeast.base, 0)} milder or ${K.pct(W.hdd.Northeast.colder / W.hdd.Northeast.base - 1, 0)} colder than its base case in the Northeast` : 'milder or colder than its base case'}.</p>
<p>Heating oil gets a single U.S. forecast; the EIA counts ${K.num(W.households.US.ho)} oil-heated households, ${K.num(W.households.Northeast.ho)} of them in the Northeast. Propane gets a forecast for the Northeast, the Midwest and the South, the regions where most of the ${K.num(W.households.US.pr)} propane-heated households live.</p>
${h.mini('forecast', { t: 'Forecast by fuel and region', p: ['fuel', 'reg'], d: { fuel: 'pr', reg: 'Midwest' }, c: 'Open the full forecast' })}
<h2>Propane by region</h2>
${h.table(['Region', 'Forecast price', 'Last winter', 'Gallons per household', 'Winter bill, normal', 'Winter bill, colder'], regions.map((r) => { const x = W.pr[r]; return [r === 'US' ? 'U.S. average' : r, K.ppg(x.price.base), K.ppg(x.price.history[prev]), K.num(x.gal.base), K.usd(x.spend.base), K.usd(x.spend.colder)]; }), `EIA Winter Fuels Outlook, ${W.release}. No propane forecast is published for the West.`, ['l', 'r', 'r', 'r', 'r', 'r'])}
<h2>The weather behind the numbers</h2>
<p>Gallons follow heating degree days, and the EIA's three cases differ only by weather. For the Northeast it expects ${K.num(W.hdd.Northeast.base)} degree days from November to March in its base case, against ${K.num(W.hdd.Northeast.history[prev])} last winter, which is why the gallons per oil-heated household ${K.dir(ho.gal.base - ho.gal.history[prev], 'rise', 'fall', 'hold')} to ${K.num(ho.gal.base)} from ${K.num(ho.gal.history[prev])}. A winter as cold as the colder case would take the Northeast to ${K.num(W.hdd.Northeast.colder)} degree days and an oil-heated household to ${K.num(ho.gal.colder)} gallons. Price and weather add up: a dear gallon in a cold winter is the case that strains a budget most.</p>
<h2>From the forecast to your bill</h2>
<p>A national forecast is a starting point. Your state's weekly price can sit well above or below the U.S. average, and your winter can be colder or milder than the nation's. The ${h.a('winter-heating-budget', 'winter budget')} applies this week's price in your state to your state's degree days and also shows the cost at the forecast price. The ${h.a('lock-in-or-wait', 'lock-in check')} uses the forecast as one more yardstick for a fixed-price offer: a locked price below the forecast average looks better than one above it, though the forecast itself can miss.</p>
<h2>How far to trust it</h2>
<p>The EIA revises its outlook each month as prices and weather come in, so the figure for ${cur} will move before the winter ends. The "${prev}" column of the table shows last winter as the EIA now reports it. Treat the forecast as the most informed public estimate available, and the weekly survey as the reality check: each Wednesday the ${h.a('heating-oil-prices', 'state table')} shows where prices actually are.</p>
`,
  faqs: [
    { q: 'Will heating oil prices go down this winter?', a: `The EIA's October 2026 outlook forecasts an average of ${K.ppg(ho.price.base)} a gallon for November to March, while the weekly survey stood at ${K.ppg(now)} in the week of ${K.day(K.L.last_week)}. A forecast ${K.dir(ho.price.base - now, 'above', 'below', 'equal to')} today's price implies prices ${K.dir(ho.price.base - now, 'rising', 'easing', 'holding')} over the season on average. The EIA revises the forecast monthly, and actual weekly prices can swing widely.` },
    { q: 'How much will it cost to heat a home with oil this winter?', a: `For the EIA's average oil-heated household, ${K.usd(ho.spend.base)} from November to March in a normal winter, ${K.usd(ho.spend.colder)} if it is colder and ${K.usd(ho.spend.warmer)} if it is warmer. Your own bill depends on your state's price and weather and on your home. The winter budget calculator scales the estimate to your state.` },
    { q: 'What does the EIA forecast for propane prices this winter?', a: `An average of ${K.ppg(W.pr.US.price.base)} a gallon nationwide for November to March, ${K.ppg(W.pr.Northeast.price.base)} in the Northeast, ${K.ppg(W.pr.Midwest.price.base)} in the Midwest and ${K.ppg(W.pr.South.price.base)} in the South, excluding taxes. The average propane-heated household would spend ${K.usd(W.pr.US.spend.base)} in a normal winter, according to the same outlook.` },
  ],
  tool: 'forecast', toolArg: { fuel: 'ho' },
  related: ['winter-heating-budget', 'lock-in-or-wait', 'heating-oil-price-history', 'heating-oil-prices', 'propane-prices'],
  sources: ['eia_wfo', 'eia_steo', 'eia_shopp'],
});
