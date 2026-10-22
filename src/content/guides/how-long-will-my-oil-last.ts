import { defineGuide } from '../../lib/page-types';
import { KIT as K } from '../../lib/kit';

const ny = K.SC('NY');
const rate = K.galPerHdd(ny, 'ho');
const jan = ny.hdd.month['01'];
const perDayJan = (rate * jan) / 31;
const perDayNov = (rate * ny.hdd.month['11']) / 30;
const ex = K.tool('days', { st: 'NY', fuel: 'ho', now: 150, from: '12', reserve: 0 });

export default defineGuide({
  id: 'how-long-will-my-oil-last', group: 'costs', order: 13, slug: 'how-long-will-my-oil-last',
  nav: 'How long will my oil last', card: 'Days left in your tank at your state\'s normal weather, month by month.',
  title: 'Heating Oil Days Left: How Long Will My Tank Last? 2026',
  description: `How long heating oil or propane lasts in 2026: days left in the tank from your gallons, your state's normal degree days and the month, with a reorder point.`,
  h1: 'How long will the oil in my tank last?',
  intro: `In a normal New York January the average oil-heated home burns about ${K.dec(perDayJan, 1)} gallons a day; in November, ${K.dec(perDayNov, 1)}.`,
  resume: `A tank lasts as many days as the weather allows. The EIA's average oil-heated home burns ${K.dec(rate, 3)} gallons for each heating degree day, so its daily use follows the cold: in a normal New York winter that is ${K.dec(perDayNov, 1)} gallons a day in November and ${K.dec(perDayJan, 1)} in January, when the state counts ${K.num(jan)} degree days. With 150 gallons in the tank at the start of December, that home reaches empty ${ex.value === 'Through April' ? 'after the end of the season' : `in about ${ex.value}`}. The calculator runs your gallons against your state's normal degree days from NOAA, month by month, and tells you in which month you reach the level you want to reorder at. If you know how many gallons you burned last winter, enter them: the burn rate becomes your home's own. A cold spell burns faster than the normal, so keep a margin of a week or two of January use.`,
  body: (h) => `
<h2>From gallons to days</h2>
<p>The calculator spreads each month's normal degree days evenly over its days and burns gallons at a fixed rate per degree day until the tank reaches your reserve. The rate is the EIA's average home (${K.dec(rate, 3)} gallons per degree day for oil) or yours if you type your winter's total: last winter's gallons divided by your state's normal November to March degree days. It is simple on purpose. Real days are colder or milder than the normal, and the daily use follows them.</p>
${h.table(['Month', 'Normal degree days, New York', 'Gallons a day, average home', 'Days 150 gallons last'], ['10', '11', '12', '01', '02', '03', '04'].map((m) => { const d = [31, 30, 31, 31, 28, 31, 30][['10', '11', '12', '01', '02', '03', '04'].indexOf(m)]; const g = (rate * ny.hdd.month[m]) / d; return [['October', 'November', 'December', 'January', 'February', 'March', 'April'][['10', '11', '12', '01', '02', '03', '04'].indexOf(m)], K.num(ny.hdd.month[m]), K.dec(g, 1), K.num(150 / g)]; }), 'NOAA population-weighted normals 1981-2010; EIA Winter Fuels Outlook rate for the average oil-heated home.', ['l', 'r', 'r', 'r'])}
<h2>Setting a reorder point</h2>
<p>Outside automatic delivery, an order takes a few days to arrive, and longer when everyone calls in the same cold week. A reorder point is the number of gallons that covers the wait plus a margin. At ${K.dec(perDayJan, 1)} gallons a day in a New York January, a week of notice means about ${K.num(perDayJan * 7)} gallons. On a 275-gallon tank that is ${K.pct(perDayJan * 7 / 275, 0)} of the tank; add the margin you want for a cold spell or a late truck.</p>
${h.mini('days', { t: 'When will your tank reach your reorder point?', p: ['now', 'reserve'], d: { st: 'ME', fuel: 'ho', from: '01' }, c: 'Open the full calculator' })}
<h2>Your own burn rate in two readings</h2>
<p>The best rate is yours. Note the gauge on two dates a week or two apart in the same month and convert the fractions to gallons with your tank size. Divide the gallons burned by the days between readings: that is your daily use for that month's weather. Divide it by the month's normal degree days per day in your state (the table above for New York, the state pages for the others) and you have a rate per degree day comparable with the EIA's. Delivery tickets over a whole winter do the same with less effort.</p>
<h2>Propane works the same way</h2>
<p>Switch the fuel to propane and the calculator uses the EIA's propane household of your region. Remember that a propane tank holds about 80 % of its size when full: a 500-gallon tank starts with about ${K.num(500 * K.P.propaneFill.defaultPct)} gallons. The ${h.a('propane-tank-fill-cost', 'propane tank page')} explains the rule. For the cost of the next fill, use the ${h.a('heating-oil-tank-fill-cost', 'tank fill calculator')}; for the whole season, the ${h.a('winter-heating-budget', 'winter budget')}.</p>
<h2>What the calculator does not know</h2>
<p>It does not know your thermostat, your windows, or whether your boiler also heats your water all year: those sit inside your own burn rate if you enter last winter's gallons, and inside the EIA's average if you do not. It does not know next week's weather either. NOAA's normals are thirty-year averages, so a real January can run well above or below them; the EIA's colder scenario for this winter adds ${K.pct(K.W.ho.US.gal.colder / K.W.ho.US.gal.base - 1, 0)} to the average home's oil use. Read the result as the date you would reach your reserve in a normal winter, and keep your margin for the cold weeks.</p>
`,
  faqs: [
    { q: 'How many gallons of heating oil does a house burn per day?', a: `It depends on the weather. The EIA's average oil-heated home burns ${K.dec(rate, 3)} gallons per heating degree day. On a day averaging 35 °F, which counts 30 degree days, that is about ${K.dec(rate * 30, 1)} gallons; on a 50 °F day, about ${K.dec(rate * 15, 1)}. A large or poorly insulated house burns more, a small or tight one less.` },
    { q: 'How long does 100 gallons of heating oil last?', a: `In a normal New York January, about ${K.num(100 / perDayJan)} days for the EIA's average oil-heated home, and about ${K.num(100 / perDayNov)} days in November. Colder states burn it faster, milder ones slower. Enter 100 gallons and your state in the calculator to see the days from the month you choose.` },
    { q: 'When should I order heating oil?', a: 'Before the tank falls below the gallons you would burn while waiting for a delivery, plus a margin for a cold spell. The reorder field of the calculator finds the month you reach it. Ordering ahead also lets you compare the quote with your state\'s weekly average instead of taking the first truck available.' },
  ],
  tool: 'days', toolArg: { fuel: 'ho', st: 'NY', now: 150, from: '12' },
  related: ['heating-oil-tank-fill-cost', 'winter-heating-budget', 'propane-tank-fill-cost', 'state:new-york', 'state:maine'],
  sources: ['eia_wfo', 'noaa_hdd'],
});
