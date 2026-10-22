import { defineState } from '../../lib/page-types';
import { KIT as K } from '../../lib/kit';

const st = K.SC('IN');
const o = K.sum('IN', 'ho')!;
const p = K.sum('IN', 'pr')!;
const pld = K.lastDone('IN', 'pr')!;
const galP = K.est(st, 'pr');
const rp = K.replay(p.seasons.filter((x) => x.s !== p.season), p.last[1]);

export default defineState({
  slug: 'indiana',
  title: 'Indiana Propane Prices This Week, and Heating Oil, 2026-27',
  description: `Indiana propane prices this week from the federal survey, winter 2026-27, with heating oil: the dealer's share, the cost of a fill, and past winters compared.`,
  intro: `Indiana propane averaged ${K.ppg(p.last[1])} a gallon in the EIA survey of ${K.day(p.last[0])}; heating oil ${K.ppg(o.last[1])}.`,
  resume: `In Indiana, propane comes well behind gas and electricity as a heating fuel, but it still heats a large number of homes: the Census Bureau's 2024 survey counts ${K.num(st.acs.propane)} of them, ${K.pct(st.acs.propaneShare, 1)} of occupied homes, against ${K.num(st.acs.oil)} on fuel oil or kerosene. The EIA's weekly survey of ${K.day(p.last[0])} gives ${K.ppg(p.last[1])} a gallon for Indiana propane, ${K.ord(K.place('IN', 'pr'))} of ${K.ranked('pr').length} states from the dearest and ${K.ppg(Math.abs(p.last[1] - K.price('US', 'pr')!))} ${K.dir(p.last[1] - K.price('US', 'pr')!, 'above', 'below', 'level with')} the national average, and ${K.ppg(o.last[1])} for heating oil. Last winter Indiana propane averaged ${K.ppg(pld.avg!)} from November to March. A normal Indiana winter counts ${K.num(st.hdd.winter)} heating degree days over those months, so the EIA's average Midwest propane home would burn about ${K.gal(galP)}, which is ${K.usd(galP * p.last[1])} at this week's average. The figures exclude sales tax and delivery fees; your dealer sets the price you actually pay.`,
  body: (h) => `
<h2>How the Indiana propane price is built</h2>
<p>The EIA publishes a wholesale propane price for Indiana, ${p.wholesale ? K.ppg(p.wholesale) : 'not available this week'}. ${K.spread('IN', 'pr') === null ? 'Without it the margin cannot be computed.' : `The residential average is ${K.ppg(K.spread('IN', 'pr')!)} above it, so ${K.pct(1 - p.wholesale! / p.last[1], 0)} of the price at the house is delivery, storage, the tank and the dealer, and ${K.pct(p.wholesale! / p.last[1], 0)} is the fuel itself.`} That split explains why a sharp move in wholesale propane shows up only partly, and late, in a household's bill.</p>
<p>Last winter the Indiana average ran from ${K.ppg(pld.min[1])} to ${K.ppg(pld.max[1])}, its high on ${K.day(pld.max[0])}. The record week is ${K.ppg(p.record[1])}, on ${K.day(p.record[0])}. Since ${p.seasons[0].s}, the November to March average ended above the mid-October price in ${rp.up} of ${rp.n} winters.</p>
${h.mini('lockin', { t: 'An Indiana fixed price', p: ['fixed', 'gal'], d: { st: 'IN', fuel: 'pr' }, c: 'Open the lock-in check' })}
<h2>What a delivery costs</h2>
<p>At this week's Indiana average, a 500-gallon tank filled from 30 % to 80 % takes 250 gallons and costs ${K.usd(250 * p.last[1])}; a 1,000-gallon tank from 20 % takes 600 gallons, ${K.usd(600 * p.last[1])}. The ${h.a('propane-tank-fill-cost', 'propane tank calculator')} reads any gauge and adds a fee or tax if you know it. Indiana propane is ${K.ppg(Math.abs(p.last[1] - K.price('OH', 'pr')!))} ${K.dir(p.last[1] - K.price('OH', 'pr')!, 'dearer', 'cheaper', 'level')} than Ohio's this week and ${K.ppg(Math.abs(p.last[1] - K.price('IL', 'pr')!))} ${K.dir(p.last[1] - K.price('IL', 'pr')!, 'dearer', 'cheaper', 'level')} than Illinois's.</p>
<h2>Heating oil in Indiana</h2>
<p>Few Indiana homes burn oil, but the EIA still prices it: ${K.ppg(o.last[1])} a gallon this week, against a wholesale figure of ${o.wholesale ? K.ppg(o.wholesale) : 'an unpublished level'}. Per million Btu at ENERGY STAR efficiencies, Indiana heat costs ${K.usd(K.perMBtu({ price: p.last[1], btu: K.P.btu.propane, efficiency: K.P.efficiency.propane }))} from propane and ${K.usd(K.perMBtu({ price: o.last[1], btu: K.P.btu.oil, efficiency: K.P.efficiency.oil }))} from oil this week; the ${h.a('heating-oil-vs-propane', 'comparison page')} adds electricity.</p>
<h2>The winter ahead</h2>
<p>NOAA's normals give Indiana ${K.num(st.hdd.month['01'])} heating degree days in January, ${K.pct(st.hdd.month['01'] / st.hdd.winter, 0)} of the season's total. The ${h.a('winter-heating-budget', 'winter budget')} spreads the gallons by month, and the EIA's outlook for Midwest propane this winter is on the ${h.a('heating-oil-price-forecast', 'forecast page')}. The federal LIHEAP ceiling for three people in Indiana is ${K.usd(K.liheap('IN', 3))} a year.</p>
`,
  faqs: [
    { q: 'What does propane cost in Indiana this week?', a: `${K.ppg(p.last[1])} a gallon on average in the EIA survey of ${K.day(p.last[0])}, excluding taxes, against ${K.ppg(K.price('US', 'pr')!)} for the United States. A 500-gallon tank filled from 30 % to 80 % costs ${K.usd(250 * p.last[1])} at that average. Ask your dealer for the per-gallon price before the truck comes.` },
    { q: 'Why is the Indiana propane price so far above wholesale?', a: `${K.spread('IN', 'pr') === null ? 'The EIA did not publish an Indiana wholesale price this week.' : `This week the gap is ${K.ppg(K.spread('IN', 'pr')!)} a gallon.`} Residential propane is delivered by truck to individual tanks, often leased from the dealer, and the price covers that delivery, storage through the winter, tank upkeep and the dealer's margin, not only the fuel.` },
    { q: 'How many Indiana homes heat with propane?', a: `${K.num(st.acs.propane)}, or ${K.pct(st.acs.propaneShare, 1)} of occupied homes, according to the Census Bureau's 2024 American Community Survey. Utility gas heats ${K.num(st.acs.gas)} Indiana homes and electricity ${K.num(st.acs.electric)}; fuel oil and kerosene heat only ${K.num(st.acs.oil)}. The same survey counts ${K.num(st.acs.wood)} homes heated mainly with wood.` },
  ],
  related: ['propane-prices', 'lock-in-or-wait', 'propane-tank-fill-cost', 'state:ohio', 'state:illinois', 'state:michigan'],
});
