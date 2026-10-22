import { defineState } from '../../lib/page-types';
import { KIT as K } from '../../lib/kit';

const st = K.SC('KY');
const o = K.sum('KY', 'ho')!;
const p = K.sum('KY', 'pr')!;
const pld = K.lastDone('KY', 'pr')!;
const ld = K.lastDone('KY', 'ho')!;
const galP = K.est(st, 'pr'), galO = K.est(st, 'ho');
const yp = K.yoy('KY', 'pr');

export default defineState({
  slug: 'kentucky',
  title: 'Kentucky Propane and Heating Oil Prices This Week, 2026-27',
  description: `Kentucky propane and heating oil prices from the federal weekly survey for 2026-27: the price of a fill, change on a year, last winter and a mild winter's bill.`,
  intro: `Kentucky propane averaged ${K.ppg(p.last[1])} a gallon and heating oil ${K.ppg(o.last[1])} in the EIA survey of ${K.day(p.last[0])}.`,
  resume: `More than half of Kentucky's homes heat with electricity, but propane remains the fuel of ${K.num(st.acs.propane)} of them by the Census Bureau's 2024 count, ${K.pct(st.acs.propaneShare, 1)} of occupied homes, and fuel oil or kerosene of ${K.num(st.acs.oil)}. In the EIA's weekly survey of ${K.day(p.last[0])}, Kentucky propane averaged ${K.ppg(p.last[1])} a gallon${yp === null ? '' : `, ${K.pct(Math.abs(yp), 0)} ${K.dir(yp, 'more', 'less')} than a year before`}, ${K.ord(K.place('KY', 'pr'))} of ${K.ranked('pr').length} states from the dearest. Heating oil averaged ${K.ppg(o.last[1])}, ${K.ord(K.place('KY', 'ho'))} of ${K.ranked('ho').length}. Kentucky's winter is moderate, ${K.num(st.hdd.winter)} heating degree days from November to March, so the EIA's average propane home would burn about ${K.gal(galP)} over it, ${K.usd(galP * p.last[1])} at this week's price, and the average oil home about ${K.gal(galO)}, ${K.usd(galO * o.last[1])}. These averages leave out sales tax and any delivery fee.`,
  body: (h) => `
<h2>Propane in Kentucky, last winter and now</h2>
<p>Last winter Kentucky propane averaged ${K.ppg(pld.avg!)} a gallon from November to March, between a low week of ${K.ppg(pld.min[1])} and a high of ${K.ppg(pld.max[1])} on ${K.day(pld.max[0])}. The highest week the survey has recorded in Kentucky is ${K.ppg(p.record[1])}. The EIA publishes no wholesale propane price for Kentucky; the Midwest region's wholesale figure, ${K.sum('R20', 'pr')?.wholesale ? K.ppg(K.sum('R20', 'pr')!.wholesale!) : 'unpublished this week'}, gives a sense of how much of the residential price is added after the terminal.</p>
${h.mini('fill', { t: 'Propane fill in Kentucky', p: ['tank', 'gauge'], d: { st: 'KY', fuel: 'pr', tank: 500, gauge: 25 }, c: 'Open the tank fill calculator' })}
<h2>Heating oil in Kentucky</h2>
<p>Kentucky heating oil averaged ${K.ppg(ld.avg!)} a gallon last winter, ranging from ${K.ppg(ld.min[1])} to ${K.ppg(ld.max[1])}. The EIA's wholesale price for the state this week is ${o.wholesale ? K.ppg(o.wholesale) : 'not published'}, leaving a dealer spread of ${K.spread('KY', 'ho') === null ? 'unknown size' : K.ppg(K.spread('KY', 'ho')!)}. This week Kentucky oil is ${K.ppg(Math.abs(o.last[1] - K.price('OH', 'ho')!))} ${K.dir(o.last[1] - K.price('OH', 'ho')!, 'dearer', 'cheaper', 'level')} than Ohio's and ${K.ppg(Math.abs(o.last[1] - K.price('VA', 'ho')!))} ${K.dir(o.last[1] - K.price('VA', 'ho')!, 'dearer', 'cheaper', 'level')} than Virginia's.</p>
<h2>Kentucky against its neighbors for propane</h2>
<p>Kentucky propane is ${K.ppg(Math.abs(p.last[1] - K.price('TN', 'pr')!))} ${K.dir(p.last[1] - K.price('TN', 'pr')!, 'dearer', 'cheaper', 'level')} than Tennessee's this week, ${K.ppg(Math.abs(p.last[1] - K.price('IN', 'pr')!))} ${K.dir(p.last[1] - K.price('IN', 'pr')!, 'dearer', 'cheaper', 'level')} than Indiana's and ${K.ppg(Math.abs(p.last[1] - K.price('OH', 'pr')!))} ${K.dir(p.last[1] - K.price('OH', 'pr')!, 'dearer', 'cheaper', 'level')} than Ohio's. A household near a state line may find dealers on both sides; the ${h.a('propane-prices', 'propane table')} ranks every surveyed state each Wednesday.</p>
<h2>A moderate winter</h2>
<p>NOAA's normals give Kentucky ${K.num(st.hdd.month['01'])} heating degree days in January and ${K.num(st.hdd.month['02'])} in February, about ${K.pct(st.hdd.month['01'] / K.SC('MI').hdd.month['01'], 0)} of a Michigan January. A propane tank lasts longer here than further north. A household that also cooks or heats water with the same tank uses gallons outside the heating season too, which the winter estimate leaves out. The ${h.a('winter-heating-budget', 'winter budget')} takes your own gallons, and the ${h.a('heating-oil-vs-propane', 'comparison page')} puts propane, oil and an electric heat pump side by side per million Btu. The federal LIHEAP ceiling for three people in Kentucky is ${K.usd(K.liheap('KY', 3))} a year; the ${h.a('liheap-income-limits', 'LIHEAP page')} gives every household size and explains how the federal rule sets it.</p>
`,
  faqs: [
    { q: 'What does propane cost in Kentucky this week?', a: `${K.ppg(p.last[1])} a gallon on average in the EIA survey of ${K.day(p.last[0])}, excluding taxes, against ${K.ppg(K.price('US', 'pr')!)} for the United States. Filling a 500-gallon tank from 25 % to 80 % takes 275 gallons, ${K.usd(275 * p.last[1])} at that average. Your dealer's price may differ.` },
    { q: 'Is heating oil sold in Kentucky?', a: `Yes. Kentucky is one of the ${K.ranked('ho').length} states where the EIA surveys heating oil dealers each week from October to March; this week's average is ${K.ppg(o.last[1])} a gallon before tax. The Census Bureau counts ${K.num(st.acs.oil)} Kentucky homes heated mainly with fuel oil or kerosene.` },
    { q: 'How much propane does a Kentucky home use for heat?', a: `The EIA's average propane home, scaled to Kentucky's ${K.num(st.hdd.winter)} heating degree days from November to March, burns about ${K.gal(galP)} for heat over those months. Cooking, hot water and a clothes dryer add to the yearly total. Delivery tickets from last winter give the most accurate figure for your house.` },
  ],
  related: ['propane-tank-fill-cost', 'propane-prices', 'heating-oil-vs-propane', 'state:tennessee', 'state:ohio', 'state:indiana'],
});
