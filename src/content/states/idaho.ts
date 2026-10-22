import { defineState } from '../../lib/page-types';
import { KIT as K } from '../../lib/kit';

const st = K.SC('ID');
const p = K.sum('ID', 'pr')!;
const pld = K.lastDone('ID', 'pr')!;
const galP = K.est(st, 'pr');
const yp = K.yoy('ID', 'pr');
const done = p.seasons.filter((x) => x.avg);
const pdear = done.reduce((a, b) => (b.avg! > a.avg! ? b : a));
const gap = (c: string) => { const d = p.last[1] - K.price(c, 'pr')!; return `${K.ppg(Math.abs(d))} ${K.dir(d, 'dearer', 'cheaper', 'level')}`; };

export default defineState({
  slug: 'idaho',
  title: 'Idaho Propane Prices This Week, Winter 2026-27 Survey',
  description: `Idaho propane prices from the federal weekly survey, winter 2026-27: price per gallon, change on a year, homes on propane and wood, a fill and a winter's cost.`,
  intro: `Idaho propane averaged ${K.ppg(p.last[1])} a gallon in the EIA survey of ${K.day(p.last[0])}.`,
  resume: `Idaho heats with gas and electricity first, but the Census Bureau's 2024 survey counts ${K.num(st.acs.propane)} homes heated mainly with propane, ${K.pct(st.acs.propaneShare, 1)} of occupied homes, and ${K.num(st.acs.wood)} with wood, one of the larger wood shares among the surveyed states. In the EIA's weekly survey of ${K.day(p.last[0])}, Idaho propane averaged ${K.ppg(p.last[1])} a gallon${yp === null ? '' : `, ${K.pct(Math.abs(yp), 0)} ${K.dir(yp, 'more', 'less')} than in the same week a year before`}, ${K.ord(K.place('ID', 'pr'))} of ${K.ranked('pr').length} states counting from the dearest and ${K.ppg(Math.abs(p.last[1] - K.price('US', 'pr')!))} ${K.dir(p.last[1] - K.price('US', 'pr')!, 'above', 'below', 'level with')} the national average. A normal Idaho winter counts ${K.num(st.hdd.winter)} heating degree days from November to March. The EIA publishes no propane outlook for the West, so this site scales its national average home to Idaho's weather: about ${K.gal(galP)} for the winter, ${K.usd(galP * p.last[1])} at this week's price. Last winter Idaho propane averaged ${K.ppg(pld.avg!)}. Heating oil is not surveyed in Idaho. Prices exclude taxes and delivery fees.`,
  body: (h) => `
<h2>The Idaho price</h2>
<p>Idaho has no wholesale propane series of its own in the EIA release. For the Rocky Mountain district as a whole the wholesale figure is ${K.sum('R40', 'pr')?.wholesale ? K.ppg(K.sum('R40', 'pr')!.wholesale!) : 'unpublished this week'}, well under the ${K.ppg(p.last[1])} that Idaho homes pay; the difference pays for trucks, storage, tanks and the dealer. Last winter the Idaho average ran from ${K.ppg(pld.min[1])} to ${K.ppg(pld.max[1])}, its dearest week on ${K.day(pld.max[0])}. The dearest winter on file is ${pdear.s}, at ${K.ppg(pdear.avg!)}, and the record week ${K.ppg(p.record[1])}, on ${K.day(p.record[0])}.</p>
${h.mini('fill', { t: 'Propane fill in Idaho', p: ['tank', 'gauge'], d: { st: 'ID', fuel: 'pr', tank: 500, gauge: 25 }, c: 'Open the tank fill calculator' })}
<h2>Idaho and its neighbors</h2>
<p>This week Idaho propane is ${gap('MT')} than Montana's average, ${gap('UT')} than Utah's and ${gap('R40')} than the Rocky Mountain regional average; Washington, Oregon, Nevada and Wyoming are not in the propane survey. A 500-gallon tank filled from 25 % to 80 % takes 275 gallons, ${K.usd(275 * p.last[1])} at the Idaho average, and a 1,000-gallon tank from 20 % takes 600 gallons, ${K.usd(600 * p.last[1])}. The ${h.a('propane-tank-fill-cost', 'propane tank calculator')} handles other sizes and adds a delivery fee if there is one.</p>
<h2>Propane and wood through an Idaho winter</h2>
<p>NOAA's population-weighted normals give Idaho ${K.num(st.hdd.month['12'])} heating degree days in December, ${K.num(st.hdd.month['01'])} in January and ${K.num(st.hdd.month['02'])} in February, and October and April add ${K.num(st.hdd.month['10'])} and ${K.num(st.hdd.month['04'])}. A home that burns wood alongside propane uses fewer gallons than the national average home; one in a colder county than the state average uses more. Either way, last winter's delivery tickets are a better starting point, and the ${h.a('winter-heating-budget', 'winter budget')} accepts them. The ${h.a('how-long-will-my-oil-last', 'days-left calculator')} works for propane and turns a gauge reading into a date.</p>
<h2>Price locks and heating help</h2>
<p>Looking back to ${p.seasons[0].s}, the Idaho winter average beat the mid-October price, upward, in ${K.replay(p.seasons.filter((x) => x.s !== p.season), p.last[1]).up} of ${K.replay(p.seasons.filter((x) => x.s !== p.season), p.last[1]).n} seasons; the ${h.a('lock-in-or-wait', 'lock-in check')} replays each of them against a dealer's fixed price. Per million Btu at the ENERGY STAR furnace rating, Idaho propane heat costs ${K.usd(K.perMBtu({ price: p.last[1], btu: K.P.btu.propane, efficiency: K.P.efficiency.propane }))} this week; the ${h.a('heating-oil-vs-propane', 'comparison page')} sets it against electricity. The federal LIHEAP ceiling for four people in Idaho is ${K.usd(K.liheap('ID', 4))} a year; the ${h.a('liheap-income-limits', 'LIHEAP page')} gives the other household sizes.</p>
`,
  faqs: [
    { q: 'What is the price of propane in Idaho this week?', a: `Idaho dealers reported an average of ${K.ppg(p.last[1])} per gallon to the EIA for the week of ${K.day(p.last[0])}, sales tax excluded; the national mean was ${K.ppg(K.price('US', 'pr')!)}. Bringing a 1,000-gallon tank from 20 % up to 80 % would cost around ${K.usd(600 * p.last[1])} at that level, before any delivery charge.` },
    { q: 'How many Idaho homes heat with propane or wood?', a: `The Census Bureau's 2024 American Community Survey counts ${K.num(st.acs.propane)} Idaho homes heated mainly with propane and ${K.num(st.acs.wood)} with wood, out of ${K.num(st.acs.homes)} occupied homes. Utility gas heats ${K.num(st.acs.gas)} and electricity ${K.num(st.acs.electric)}. Fuel oil and kerosene heat ${K.num(st.acs.oil)}, and the EIA does not survey their price in Idaho.` },
    { q: 'How much propane does an Idaho home burn in a winter?', a: `Roughly ${K.gal(galP)} for space heat, if an Idaho home behaves like the EIA's U.S. average propane household adjusted to ${K.num(st.hdd.winter)} degree days between November and March; that is ${K.usd(galP * p.last[1])} at today's average. Homes that lean on a wood stove, common in Idaho by Census counts, will need noticeably less.` },
  ],
  related: ['propane-tank-fill-cost', 'winter-heating-budget', 'propane-prices', 'state:montana', 'state:utah', 'state:colorado'],
});
