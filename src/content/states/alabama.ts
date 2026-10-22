import { defineState } from '../../lib/page-types';
import { KIT as K } from '../../lib/kit';

const st = K.SC('AL');
const p = K.sum('AL', 'pr')!;
const pld = K.lastDone('AL', 'pr')!;
const galP = K.est(st, 'pr');
const yp = K.yoy('AL', 'pr');
const done = p.seasons.filter((x) => x.avg);
const pcheap = done.reduce((a, b) => (b.avg! < a.avg! ? b : a));
const pdear = done.reduce((a, b) => (b.avg! > a.avg! ? b : a));
const gap = (c: string) => { const d = p.last[1] - K.price(c, 'pr')!; return `${K.ppg(Math.abs(d))} ${K.dir(d, 'dearer', 'cheaper', 'level')}`; };

export default defineState({
  slug: 'alabama',
  title: 'Alabama Propane Prices This Week, Winter 2026-27 Survey',
  description: `Alabama propane prices from the federal weekly survey, winter 2026-27: the price per gallon, change on a year, what a fill costs and every winter on file.`,
  intro: `Alabama propane averaged ${K.ppg(p.last[1])} a gallon in the EIA survey of ${K.day(p.last[0])}.`,
  resume: `Two Alabama homes in three heat with electricity, by the Census Bureau's 2024 count, and propane is the main heating fuel of ${K.num(st.acs.propane)} more, ${K.pct(st.acs.propaneShare, 1)} of occupied homes. In the EIA's weekly survey of ${K.day(p.last[0])}, Alabama propane averaged ${K.ppg(p.last[1])} a gallon${yp === null ? '' : `, ${K.pct(Math.abs(yp), 0)} ${K.dir(yp, 'more', 'less')} than a year earlier`}, which ranks the state ${K.ord(K.place('AL', 'pr'))} of ${K.ranked('pr').length} counting from the dearest. Over the winters on file, the November to March average has run from ${K.ppg(pcheap.avg!)} in ${pcheap.s} to ${K.ppg(pdear.avg!)} in ${pdear.s}; last winter it was ${K.ppg(pld.avg!)}. A normal Alabama winter brings ${K.num(st.hdd.winter)} heating degree days over those five months, so the EIA's average propane home in the South would burn about ${K.gal(galP)} for heat, ${K.usd(galP * p.last[1])} at this week's price. The EIA does not survey heating oil in Alabama. Prices exclude taxes and delivery fees.`,
  body: (h) => `
<h2>What makes up the Alabama price</h2>
<p>The EIA's wholesale propane price for Alabama this week is ${p.wholesale ? K.ppg(p.wholesale) : 'unpublished'}. ${K.spread('AL', 'pr') === null ? 'Without it the margin cannot be computed.' : `The residential average sits ${K.ppg(K.spread('AL', 'pr')!)} above it: of each gallon a household buys, ${K.pct(p.wholesale! / p.last[1], 0)} is the fuel and ${K.pct(K.spread('AL', 'pr')! / p.last[1], 0)} pays for delivery, storage, the tank and the dealer.`} On a 250-gallon fill, the dealer's share comes to ${K.spread('AL', 'pr') === null ? 'an unknown sum' : K.usd(250 * K.spread('AL', 'pr')!)}.</p>
${h.mini('history', { t: 'Alabama propane, winter by winter', p: ['st', 'fuel'], d: { st: 'AL', fuel: 'pr' }, c: 'Open the price history' })}
<h2>Seasons in Alabama</h2>
<p>Last winter the Alabama average ran from ${K.ppg(pld.min[1])} to ${K.ppg(pld.max[1])}, the high week on ${K.day(pld.max[0])}. The record week on file is ${K.ppg(p.record[1])}, on ${K.day(p.record[0])}. The ${h.a('heating-oil-price-history', 'price history')} sets each Alabama winter against the national average, and the ${h.a('lock-in-or-wait', 'lock-in check')} replays them against a dealer's fixed price.</p>
<h2>Alabama and its neighbors</h2>
<p>This week Alabama propane is ${gap('MS')} than Mississippi's average, ${gap('GA')} than Georgia's, ${gap('TN')} than Tennessee's and ${gap('FL')} than Florida's. A 500-gallon tank filled from 30 % to 80 % costs ${K.usd(250 * p.last[1])} at the Alabama average, and a 250-gallon tank from 20 % ${K.usd(150 * p.last[1])}. The ${h.a('propane-tank-fill-cost', 'propane tank calculator')} handles other sizes.</p>
<h2>The heating season</h2>
<p>NOAA's population-weighted normals give Alabama ${K.num(st.hdd.month['12'])} heating degree days in December and ${K.num(st.hdd.month['01'])} in January. A household that also heats water or cooks with propane uses gallons all year, which the winter estimate leaves out; the ${h.a('winter-heating-budget', 'winter budget')} takes the gallons you actually buy. Per million Btu at the ENERGY STAR furnace rating, Alabama propane heat costs ${K.usd(K.perMBtu({ price: p.last[1], btu: K.P.btu.propane, efficiency: K.P.efficiency.propane }))} this week; the ${h.a('heating-oil-vs-propane', 'comparison page')} sets it against electricity at the EIA's southern forecast rate. The federal LIHEAP ceiling for three people in Alabama is ${K.usd(K.liheap('AL', 3))} a year; the ${h.a('liheap-income-limits', 'LIHEAP page')} gives the other household sizes.</p>
<h2>Before the first cold snap</h2>
<p>In a mild state the first fill of the season is easy to put off. Alabama's November counts ${K.num(st.hdd.month['11'])} heating degree days in a normal year and its December ${K.num(st.hdd.month['12'])}, so demand climbs quickly once the cold arrives, and the price of each delivery is the price of the week it is made. Checking the gauge in October and comparing the dealer's quote with the state average on this page is the simplest way to avoid a surprise.</p>
`,
  faqs: [
    { q: 'What is the price of propane in Alabama this week?', a: `Alabama's weekly figure from the EIA, dated ${K.day(p.last[0])}, is ${K.ppg(p.last[1])} a gallon with taxes excluded, while the U.S. figure is ${K.ppg(K.price('US', 'pr')!)}. A typical refill of 250 gallons, half of a 500-gallon tank, would come to about ${K.usd(250 * p.last[1])}. Your supplier may charge more or less.` },
    { q: 'What was the most expensive winter for propane in Alabama?', a: `Among the seasons the EIA has recorded, ${pdear.s} tops the list for Alabama with a November to March mean of ${K.ppg(pdear.avg!)} a gallon, while ${pcheap.s} was the cheapest at ${K.ppg(pcheap.avg!)}. The single priciest week was ${K.day(p.record[0])}, at ${K.ppg(p.record[1])}, in nominal dollars before tax.` },
    { q: 'How many Alabama homes heat with propane?', a: `In 2024 the Census Bureau counted ${K.num(st.acs.propane)} Alabama homes heated chiefly by propane, or ${K.pct(st.acs.propaneShare, 1)} of the housing stock in use. Most rely on electricity, ${K.num(st.acs.electric)} homes, and ${K.num(st.acs.gas)} on utility gas; oil and kerosene account for a mere ${K.num(st.acs.oil)}.` },
  ],
  related: ['heating-oil-price-history', 'propane-tank-fill-cost', 'propane-prices', 'state:mississippi', 'state:georgia', 'state:tennessee'],
});
