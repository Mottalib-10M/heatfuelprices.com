import { defineState } from '../../lib/page-types';
import { KIT as K } from '../../lib/kit';

const st = K.SC('AR');
const p = K.sum('AR', 'pr')!;
const pld = K.lastDone('AR', 'pr')!;
const galP = K.est(st, 'pr');
const yp = K.yoy('AR', 'pr');
const rp = K.replay(p.seasons.filter((x) => x.s !== p.season), p.last[1]);
const gap = (c: string) => { const d = p.last[1] - K.price(c, 'pr')!; return `${K.ppg(Math.abs(d))} ${K.dir(d, 'dearer', 'cheaper', 'level')}`; };

export default defineState({
  slug: 'arkansas',
  title: 'Arkansas Propane Prices This Week, Winter 2026-27 Survey',
  description: `Arkansas propane prices this week from the federal survey, winter 2026-27: price per gallon, change on a year, a tank fill, past winters and the cost of heat.`,
  intro: `Arkansas propane averaged ${K.ppg(p.last[1])} a gallon in the EIA survey of ${K.day(p.last[0])}.`,
  resume: `Arkansas heats mainly with electricity and utility gas, but propane is the main heating fuel of ${K.num(st.acs.propane)} homes by the Census Bureau's 2024 count, ${K.pct(st.acs.propaneShare, 1)} of the total, and wood of another ${K.num(st.acs.wood)}. In the EIA's weekly survey of ${K.day(p.last[0])}, Arkansas propane averaged ${K.ppg(p.last[1])} a gallon${yp === null ? '' : `, ${K.pct(Math.abs(yp), 0)} ${K.dir(yp, 'more', 'less')} than in the same week a year before`}, ${K.ord(K.place('AR', 'pr'))} of ${K.ranked('pr').length} states counting from the dearest and ${K.ppg(Math.abs(p.last[1] - K.price('US', 'pr')!))} ${K.dir(p.last[1] - K.price('US', 'pr')!, 'above', 'below', 'level with')} the national average. Last winter the state averaged ${K.ppg(pld.avg!)} from November to March. A normal Arkansas winter counts ${K.num(st.hdd.winter)} heating degree days over those months, so the EIA's average propane home in the South would burn about ${K.gal(galP)} for heat, ${K.usd(galP * p.last[1])} at this week's price. The EIA does not survey heating oil in Arkansas. Prices exclude taxes and delivery fees.`,
  body: (h) => `
<h2>The Arkansas price</h2>
<p>The EIA does not publish a wholesale propane price for Arkansas. The Gulf Coast region's wholesale figure, ${K.sum('R30', 'pr')?.wholesale ? K.ppg(K.sum('R30', 'pr')!.wholesale!) : 'unpublished this week'}, gives an idea of how much of the ${K.ppg(p.last[1])} residential average is added after the terminal for delivery, storage, the tank and the dealer. Last winter the Arkansas average ran from ${K.ppg(pld.min[1])} to ${K.ppg(pld.max[1])}, its dearest week on ${K.day(pld.max[0])}. The record week on file is ${K.ppg(p.record[1])}, on ${K.day(p.record[0])}.</p>
${h.mini('lockin', { t: 'An Arkansas fixed price', p: ['fixed', 'gal'], d: { st: 'AR', fuel: 'pr' }, c: 'Open the lock-in check' })}
<h2>Fixed price or market price</h2>
<p>Since ${p.seasons[0].s}, the Arkansas winter average ended above the mid-October price in ${rp.up} of ${rp.n} seasons, with a median change of ${K.pct(rp.median, 1)}. That record says how often a fixed price close to the October survey would have paid off; it says nothing certain about this winter. The ${h.a('lock-in-or-wait', 'lock-in check')} replays every season against the price you are offered.</p>
<h2>Arkansas and its neighbors</h2>
<p>This week Arkansas propane is ${gap('MO')} than Missouri's average, ${gap('OK')} than Oklahoma's, ${gap('TX')} than Texas's, ${gap('TN')} than Tennessee's and ${gap('MS')} than Mississippi's. A 500-gallon tank filled from 30 % to 80 % costs ${K.usd(250 * p.last[1])} at the Arkansas average; the ${h.a('propane-tank-fill-cost', 'propane tank calculator')} reads any gauge.</p>
<h2>Propane, wood and the winter</h2>
<p>NOAA's population-weighted normals give Arkansas ${K.num(st.hdd.month['12'])} heating degree days in December, ${K.num(st.hdd.month['01'])} in January and ${K.num(st.hdd.month['02'])} in February. A home that burns wood alongside propane uses fewer gallons than the EIA average, and a home that also heats water or cooks with propane uses more over the year. Either way, the gallons on last winter's delivery tickets are the better starting point, and the ${h.a('winter-heating-budget', 'winter budget')} accepts them. Per million Btu at the ENERGY STAR furnace rating, Arkansas propane heat costs ${K.usd(K.perMBtu({ price: p.last[1], btu: K.P.btu.propane, efficiency: K.P.efficiency.propane }))} this week; the ${h.a('heating-oil-vs-propane', 'comparison page')} sets it against electricity. The federal LIHEAP ceiling for four people in Arkansas is ${K.usd(K.liheap('AR', 4))} a year, and the ${h.a('liheap-income-limits', 'LIHEAP page')} gives the other sizes.</p>
`,
  faqs: [
    { q: 'What does propane cost in Arkansas this week?', a: `${K.ppg(p.last[1])} a gallon on average in the EIA survey of ${K.day(p.last[0])}, excluding taxes, against ${K.ppg(K.price('US', 'pr')!)} for the United States. A 500-gallon tank filled from 30 % to 80 % costs ${K.usd(250 * p.last[1])} at that average. Dealers' own prices vary with contracts and tank ownership.` },
    { q: 'Has propane gone up in Arkansas this year?', a: `${yp === null ? 'The survey has no Arkansas figure for the same week of last year.' : `Against the same week a year ago, the Arkansas average is ${K.dir(yp, 'up', 'down', 'level')} ${K.pct(Math.abs(yp), 0)}: ${K.ppg(p.last[1])} a gallon now against ${K.ppg(p.yearAgo![1])} then.`} Last winter's average from November to March was ${K.ppg(pld.avg!)}, another yardstick for this season's prices, before tax and not adjusted for inflation.` },
    { q: 'How many Arkansas homes heat with propane or wood?', a: `The Census Bureau's 2024 American Community Survey counts ${K.num(st.acs.propane)} Arkansas homes heated mainly with propane and ${K.num(st.acs.wood)} with wood, out of ${K.num(st.acs.homes)} occupied homes. Electricity heats ${K.num(st.acs.electric)} and utility gas ${K.num(st.acs.gas)}. Wood ranks Arkansas ${K.ord(K.rankOf('AR', (x) => x.acs.wood / x.acs.homes))} among the surveyed states for its share of wood-heated homes.` },
  ],
  related: ['lock-in-or-wait', 'propane-tank-fill-cost', 'propane-prices', 'state:missouri', 'state:oklahoma', 'state:mississippi'],
});
