import { defineState } from '../../lib/page-types';
import { KIT as K } from '../../lib/kit';

const st = K.SC('MI');
const o = K.sum('MI', 'ho')!;
const p = K.sum('MI', 'pr')!;
const pld = K.lastDone('MI', 'pr')!;
const galP = K.est(st, 'pr'), galO = K.est(st, 'ho');
const yp = K.yoy('MI', 'pr');
const rp = K.replay(p.seasons.filter((x) => x.s !== p.season), p.last[1]);

export default defineState({
  slug: 'michigan',
  title: 'Michigan Propane Prices This Week, Heating Oil Too, 2026-27',
  description: `Michigan propane prices this week from the federal survey, 2026-27: one of the largest propane markets, the cost of a fill, past winters, heating oil.`,
  intro: `Michigan propane averaged ${K.ppg(p.last[1])} a gallon in the EIA survey of ${K.day(p.last[0])}; heating oil ${K.ppg(o.last[1])}.`,
  resume: `Michigan has the ${K.ord(K.rankOf('MI', (x) => x.acs.propane))} largest number of propane-heated homes among the states in the survey: the Census Bureau's 2024 count is ${K.num(st.acs.propane)}, ${K.pct(st.acs.propaneShare, 1)} of occupied homes, alongside ${K.num(st.acs.oil)} on fuel oil or kerosene. In the EIA's weekly survey of ${K.day(p.last[0])}, Michigan propane averaged ${K.ppg(p.last[1])} a gallon${yp === null ? '' : `, ${K.pct(Math.abs(yp), 0)} ${K.dir(yp, 'higher', 'lower')} than a year earlier`}, which ranks it ${K.ord(K.place('MI', 'pr'))} of ${K.ranked('pr').length} states from the dearest. Heating oil averaged ${K.ppg(o.last[1])}. A normal Michigan winter counts ${K.num(st.hdd.winter)} heating degree days from November to March, so the EIA's average Midwest propane home would burn about ${K.gal(galP)} over it, which is ${K.usd(galP * p.last[1])} at this week's price, and the average oil home about ${K.gal(galO)}, or ${K.usd(galO * o.last[1])}. The averages exclude taxes and delivery fees, and dealers set their own prices around them.`,
  body: (h) => `
<h2>Michigan propane this winter and last</h2>
<p>Last winter Michigan propane averaged ${K.ppg(pld.avg!)} a gallon from November to March. The cheapest week came at ${K.ppg(pld.min[1])} and the dearest at ${K.ppg(pld.max[1])}, on ${K.day(pld.max[0])}. The highest week since the series began is ${K.ppg(p.record[1])}, on ${K.day(p.record[0])}. Since ${p.seasons[0].s}, the winter average finished above the mid-October price in ${rp.up} of ${rp.n} seasons, with a median change of ${K.pct(rp.median, 1)}: this is the record behind any pre-buy offer a Michigan dealer makes in the autumn.</p>
${h.mini('lockin', { t: 'A Michigan pre-buy price', p: ['fixed', 'gal'], d: { st: 'MI', fuel: 'pr' }, c: 'Open the lock-in check' })}
<h2>Wholesale and retail</h2>
<p>The EIA's wholesale propane price for Michigan this week is ${p.wholesale ? K.ppg(p.wholesale) : 'not published'}. ${K.spread('MI', 'pr') === null ? 'Without it, the dealer margin cannot be measured.' : `The residential average sits ${K.ppg(K.spread('MI', 'pr')!)} above it, which is ${K.pct(K.spread('MI', 'pr')! / p.last[1], 0)} of the price at the house: trucks, storage, the tank, service and margin.`} For heating oil, the wholesale figure is ${o.wholesale ? K.ppg(o.wholesale) : 'unpublished'} and the spread ${K.spread('MI', 'ho') === null ? 'unknown' : K.ppg(K.spread('MI', 'ho')!)}.</p>
<h2>The cost of a fill</h2>
<p>At this week's Michigan average, filling a 500-gallon tank from 30 % to 80 % costs ${K.usd(250 * p.last[1])}, and a 1,000-gallon tank from 25 % costs ${K.usd(550 * p.last[1])}. Leased tanks are normally filled only by the dealer who owns them, so the price you pay is that dealer's, not the state average. The ${h.a('propane-tank-fill-cost', 'propane tank calculator')} turns your gauge reading into gallons and dollars, with an optional delivery fee.</p>
<h2>Michigan against its neighbors</h2>
<p>This week Michigan propane is ${K.ppg(Math.abs(p.last[1] - K.price('OH', 'pr')!))} ${K.dir(p.last[1] - K.price('OH', 'pr')!, 'dearer', 'cheaper', 'level')} than in Ohio, ${K.ppg(Math.abs(p.last[1] - K.price('IN', 'pr')!))} ${K.dir(p.last[1] - K.price('IN', 'pr')!, 'dearer', 'cheaper', 'level')} than in Indiana and ${K.ppg(Math.abs(p.last[1] - K.price('WI', 'pr')!))} ${K.dir(p.last[1] - K.price('WI', 'pr')!, 'dearer', 'cheaper', 'level')} than in Wisconsin. Per million Btu of heat at ENERGY STAR efficiencies, Michigan propane costs ${K.usd(K.perMBtu({ price: p.last[1], btu: K.P.btu.propane, efficiency: K.P.efficiency.propane }))} this week and heating oil ${K.usd(K.perMBtu({ price: o.last[1], btu: K.P.btu.oil, efficiency: K.P.efficiency.oil }))}. The ${h.a('heating-oil-vs-propane', 'comparison page')} adds electricity at the EIA's regional forecast rate.</p>
<h2>Weather and help</h2>
<p>NOAA's normals give Michigan ${K.num(st.hdd.month['01'])} heating degree days in January and ${K.num(st.hdd.month['02'])} in February, weighted by population, so a house in a colder county than the average burns more than these figures suggest. The ${h.a('winter-heating-budget', 'winter budget')} applies those months to your own gallons. The federal LIHEAP income ceiling for four people in Michigan is ${K.usd(K.liheap('MI', 4))} a year.</p>
`,
  faqs: [
    { q: 'What is the average propane price in Michigan this week?', a: `${K.ppg(p.last[1])} a gallon in the EIA survey of ${K.day(p.last[0])}, excluding taxes, against ${K.ppg(K.price('US', 'pr')!)} for the United States. A 500-gallon tank filled from 30 % to 80 % costs ${K.usd(250 * p.last[1])} at that average. The price on your own bill is your dealer's, which can differ from the average.` },
    { q: 'How many Michigan homes heat with propane?', a: `${K.num(st.acs.propane)}, the ${K.ord(K.rankOf('MI', (x) => x.acs.propane))} largest number among the ${K.STATES.length} states in the EIA survey, according to the Census Bureau's 2024 American Community Survey. They are ${K.pct(st.acs.propaneShare, 1)} of occupied homes. Utility gas heats ${K.num(st.acs.gas)} Michigan homes and electricity ${K.num(st.acs.electric)}, while fuel oil and kerosene heat ${K.num(st.acs.oil)}.` },
    { q: 'How much does it cost to heat a Michigan home with propane for a winter?', a: `For the EIA's average Midwest propane home, scaled to Michigan's ${K.num(st.hdd.winter)} heating degree days, about ${K.gal(galP)} from November to March, or ${K.usd(galP * p.last[1])} at this week's average. A larger or draftier house needs more. The winter budget calculator takes your own gallons.` },
  ],
  related: ['propane-prices', 'propane-tank-fill-cost', 'lock-in-or-wait', 'state:wisconsin', 'state:ohio', 'state:indiana'],
});
