import { defineState } from '../../lib/page-types';
import { KIT as K } from '../../lib/kit';

const st = K.SC('MN');
const o = K.sum('MN', 'ho')!;
const p = K.sum('MN', 'pr')!;
const pld = K.lastDone('MN', 'pr')!;
const ld = K.lastDone('MN', 'ho')!;
const galP = K.est(st, 'pr'), galO = K.est(st, 'ho');
const yp = K.yoy('MN', 'pr');

export default defineState({
  slug: 'minnesota',
  title: 'Minnesota Propane and Heating Oil Prices This Week, 2026-27',
  description: `Minnesota propane and heating oil prices from the federal weekly survey, 2026-27: the coldest oil state in the survey, the cost of a fill and of a full winter.`,
  intro: `Minnesota propane averaged ${K.ppg(p.last[1])} a gallon and heating oil ${K.ppg(o.last[1])} in the EIA survey of ${K.day(p.last[0])}.`,
  resume: `Minnesota has the coldest winter of the ${K.ranked('ho').length} states where the EIA surveys heating oil, and one of the coldest of all ${K.STATES.length}: NOAA's normals give it ${K.num(st.hdd.winter)} heating degree days from November to March, weighted by population. Most of its homes are on utility gas, but the Census Bureau counts ${K.num(st.acs.propane)} on propane and ${K.num(st.acs.oil)} on fuel oil or kerosene. In the survey of ${K.day(p.last[0])}, Minnesota propane averaged ${K.ppg(p.last[1])} a gallon${yp === null ? '' : `, ${K.dir(yp, 'up', 'down')} ${K.pct(Math.abs(yp), 0)} on a year`}, ${K.ord(K.place('MN', 'pr'))} of ${K.ranked('pr').length} states from the dearest; heating oil averaged ${K.ppg(o.last[1])}. On that weather, the EIA's average Midwest propane home would burn about ${K.gal(galP)} over the season, ${K.usd(galP * p.last[1])} at this week's price, and the average oil home about ${K.gal(galO)}, ${K.usd(galO * o.last[1])}. Taxes and delivery fees come on top of all of these averages.`,
  body: (h) => `
<h2>The longest season</h2>
<p>A Minnesota January counts ${K.num(st.hdd.month['01'])} heating degree days in a normal year, and even October and April bring ${K.num(st.hdd.month['10'])} and ${K.num(st.hdd.month['04'])}. Over the whole year the total reaches ${K.num(st.hdd.year)}. For a propane household this means two things: the tank empties faster in midwinter than further south, and the season starts earlier and ends later than the five months the EIA uses for its winter figures. The ${h.a('how-long-will-my-oil-last', 'days-left calculator')} works for propane too and uses Minnesota's monthly normals.</p>
${h.mini('days', { t: 'Days left in a Minnesota tank', p: ['now', 'from'], d: { st: 'MN', fuel: 'pr', now: 250, from: '12' }, c: 'Open the days-left calculator' })}
<h2>Propane prices in Minnesota</h2>
<p>Last winter Minnesota propane averaged ${K.ppg(pld.avg!)} from November to March, from a low of ${K.ppg(pld.min[1])} to a high of ${K.ppg(pld.max[1])}. The highest week the survey has recorded in the state is ${K.ppg(p.record[1])}, on ${K.day(p.record[0])}. The EIA's wholesale price for Minnesota this week is ${p.wholesale ? K.ppg(p.wholesale) : 'not published'}, which puts the dealer's share at ${K.spread('MN', 'pr') === null ? 'an unknown level' : `${K.ppg(K.spread('MN', 'pr')!)} a gallon`}. This week Minnesota propane is ${K.ppg(Math.abs(p.last[1] - K.price('WI', 'pr')!))} ${K.dir(p.last[1] - K.price('WI', 'pr')!, 'dearer', 'cheaper', 'level')} than in Wisconsin and ${K.ppg(Math.abs(p.last[1] - K.price('IA', 'pr')!))} ${K.dir(p.last[1] - K.price('IA', 'pr')!, 'dearer', 'cheaper', 'level')} than in Iowa.</p>
<h2>Heating oil in Minnesota</h2>
<p>Heating oil is a small market in Minnesota, but the EIA still surveys it every week. Last winter it averaged ${K.ppg(ld.avg!)} a gallon. The wholesale price this week, ${o.wholesale ? K.ppg(o.wholesale) : 'unpublished'}, leaves a dealer spread of ${K.spread('MN', 'ho') === null ? 'unknown size' : K.ppg(K.spread('MN', 'ho')!)}. Per million Btu at ENERGY STAR efficiencies, heat from oil costs ${K.usd(K.perMBtu({ price: o.last[1], btu: K.P.btu.oil, efficiency: K.P.efficiency.oil }))} here this week and heat from propane ${K.usd(K.perMBtu({ price: p.last[1], btu: K.P.btu.propane, efficiency: K.P.efficiency.propane }))}; the ${h.a('heating-oil-vs-propane', 'comparison page')} takes your own equipment's rating.</p>
<h2>Budget and assistance</h2>
<p>Because the winter is so long, a Minnesota household's bill depends more on the gallons than on a few cents of price. The ${h.a('winter-heating-budget', 'winter budget')} lets you enter last winter's gallons; the ${h.a('lock-in-or-wait', 'lock-in check')} compares a pre-buy price with past winters. The federal LIHEAP ceiling for a family of four in Minnesota is ${K.usd(K.liheap('MN', 4))} a year, and ${K.usd(K.liheap('MN', 2))} for two people.</p>
`,
  faqs: [
    { q: 'What is the price of propane in Minnesota this week?', a: `${K.ppg(p.last[1])} a gallon on average in the EIA survey of ${K.day(p.last[0])}, excluding taxes, against ${K.ppg(K.price('US', 'pr')!)} nationally. Filling a 500-gallon tank from 30 % to 80 % costs ${K.usd(250 * p.last[1])} at that average. Pre-buy and budget-plan prices offered by Minnesota dealers can be above or below it.` },
    { q: 'How much propane does a Minnesota home use in a winter?', a: `The EIA's average Midwest propane home, scaled to Minnesota's ${K.num(st.hdd.winter)} heating degree days from November to March, burns about ${K.gal(galP)} for heat over those months. October and April add more in Minnesota than in most states. Your delivery tickets from last year are a better guide.` },
    { q: 'Is heating oil still surveyed in Minnesota?', a: `Yes. Minnesota is one of the ${K.ranked('ho').length} states where the EIA collects heating oil prices each week from October to March; this week's average is ${K.ppg(o.last[1])} a gallon before tax. The Census Bureau counts ${K.num(st.acs.oil)} Minnesota homes heated mainly with fuel oil or kerosene.` },
  ],
  related: ['how-long-will-my-oil-last', 'propane-prices', 'winter-heating-budget', 'state:wisconsin', 'state:iowa', 'state:north-dakota'],
});
