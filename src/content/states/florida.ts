import { defineState } from '../../lib/page-types';
import { KIT as K } from '../../lib/kit';

const st = K.SC('FL');
const p = K.sum('FL', 'pr')!;
const pld = K.lastDone('FL', 'pr')!;
const galP = K.est(st, 'pr');
const yp = K.yoy('FL', 'pr');
const gap = (c: string) => { const d = p.last[1] - K.price(c, 'pr')!; return `${K.ppg(Math.abs(d))} ${K.dir(d, 'dearer', 'cheaper', 'level')}`; };

export default defineState({
  slug: 'florida',
  title: 'Florida Propane Prices This Week, Federal Survey 2026-27',
  description: `Florida propane prices this week from the federal survey, winter 2026-27: where the state ranks, a tank fill, last winter's range, why heating is a small part.`,
  intro: `Florida propane averaged ${K.ppg(p.last[1])} a gallon in the EIA survey of ${K.day(p.last[0])}.`,
  resume: `Florida is the odd one out of the federal propane survey. Nine homes in ten heat with electricity, by the Census Bureau's 2024 count, and only ${K.num(st.acs.propane)} name propane as their main heating fuel, ${K.pct(st.acs.propaneShare, 1)} of occupied homes. The winter is the mildest of the ${K.STATES.length} surveyed states: ${K.num(st.hdd.winter)} heating degree days from November to March in a normal year. Yet the EIA prices Florida propane every week, and in the survey of ${K.day(p.last[0])} it averaged ${K.ppg(p.last[1])} a gallon${yp === null ? '' : `, ${K.pct(Math.abs(yp), 0)} ${K.dir(yp, 'more', 'less')} than a year before`}, ${K.ord(K.place('FL', 'pr'))} of ${K.ranked('pr').length} states counting from the dearest. Households also buy propane for water heating, cooking, drying clothes, fireplaces, grills and backup generators, uses the EIA lists alongside space heating, so in Florida the price per gallon matters more than the winter. All prices exclude taxes and delivery fees.`,
  body: (h) => `
<h2>Florida's propane price</h2>
<p>The EIA does not publish a wholesale propane price for Florida. The East Coast wholesale figure, ${K.sum('R10', 'pr')?.wholesale ? K.ppg(K.sum('R10', 'pr')!.wholesale!) : 'unpublished this week'}, gives an idea of how much of the ${K.ppg(p.last[1])} residential average is added after the terminal: delivery, storage, the tank and the dealer's margin. Last winter the Florida average ran from ${K.ppg(pld.min[1])} to ${K.ppg(pld.max[1])} and averaged ${K.ppg(pld.avg!)} from November to March. The highest week on file is ${K.ppg(p.record[1])}, on ${K.day(p.record[0])}.</p>
<p>This week Florida propane is ${gap('GA')} than Georgia's average and ${gap('AL')} than Alabama's, and ${K.ppg(Math.abs(p.last[1] - K.price('US', 'pr')!))} ${K.dir(p.last[1] - K.price('US', 'pr')!, 'above', 'below', 'level with')} the national figure.</p>
${h.mini('fill', { t: 'Propane fill in Florida', p: ['tank', 'gauge'], d: { st: 'FL', fuel: 'pr', tank: 120, gauge: 20 }, c: 'Open the tank fill calculator' })}
<h2>What a fill costs</h2>
<p>A home that uses propane only for water, cooking or a generator may have a smaller tank than one heated with it. A 120-gallon tank filled from 20 % to 80 % takes 72 gallons, ${K.usd(72 * p.last[1])} at this week's average; a 250-gallon tank from the same reading takes 150 gallons, ${K.usd(150 * p.last[1])}; a 500-gallon tank, 300 gallons and ${K.usd(300 * p.last[1])}. The ${h.a('propane-tank-fill-cost', 'propane tank calculator')} applies the 80 % fill level commonly used for safety and adds a delivery fee or tax if you know it.</p>
<h2>Heating in Florida</h2>
<p>NOAA's population-weighted normals give Florida ${K.num(st.hdd.month['01'])} heating degree days in January, ${K.pct(st.hdd.month['01'] / K.SC('GA').hdd.month['01'], 0)} of a Georgia January. The EIA's average southern propane home, scaled to that weather, would burn only about ${K.gal(galP)} for heat over the whole winter, ${K.usd(galP * p.last[1])} at this week's price. That is ${K.pct(galP / K.est(K.SC('MN'), 'pr'), 0)} of what the same estimate gives for Minnesota; the ${h.a('winter-heating-budget', 'winter budget')} lets you enter the gallons you actually use. Per million Btu at the ENERGY STAR furnace rating, Florida propane heat costs ${K.usd(K.perMBtu({ price: p.last[1], btu: K.P.btu.propane, efficiency: K.P.efficiency.propane }))} this week; the ${h.a('heating-oil-vs-propane', 'comparison page')} sets it against electricity, which heats most of the state. The federal LIHEAP ceiling for three people in Florida is ${K.usd(K.liheap('FL', 3))} a year, and the federal program covers home cooling as well as heating; the ${h.a('liheap-income-limits', 'LIHEAP page')} explains the limit.</p>
`,
  faqs: [
    { q: 'What is the price of propane in Florida this week?', a: `${K.ppg(p.last[1])} a gallon on average in the EIA survey of ${K.day(p.last[0])}, excluding taxes, against ${K.ppg(K.price('US', 'pr')!)} for the United States. A 120-gallon tank filled from 20 % to 80 % takes 72 gallons, ${K.usd(72 * p.last[1])} at that average. Dealers' prices vary with the tank size and contract.` },
    { q: 'Why does the EIA survey propane in Florida if few homes heat with it?', a: `The survey records the residential price of propane, and households buy propane for many uses besides heating: the EIA lists water heating, cooking, drying clothes, fireplaces, grills and backup generators. The Census Bureau counts ${K.num(st.acs.propane)} Florida homes that heat mainly with propane.` },
    { q: 'How cold is a Florida winter for heating purposes?', a: `NOAA's normals give Florida ${K.num(st.hdd.winter)} heating degree days from November to March, weighted by population, the lowest of the ${K.STATES.length} states in the EIA survey. Minnesota counts ${K.num(K.SC('MN').hdd.winter)} over the same months. Heating is a small part of most Florida energy bills.` },
  ],
  related: ['propane-tank-fill-cost', 'propane-prices', 'heating-oil-vs-propane', 'state:georgia', 'state:alabama', 'state:texas'],
});
