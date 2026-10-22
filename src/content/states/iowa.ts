import { defineState } from '../../lib/page-types';
import { KIT as K } from '../../lib/kit';

const st = K.SC('IA');
const o = K.sum('IA', 'ho')!;
const p = K.sum('IA', 'pr')!;
const pld = K.lastDone('IA', 'pr')!;
const galP = K.est(st, 'pr');
const rp = K.replay(p.seasons.filter((x) => x.s !== p.season), p.last[1]);
const pcheap = p.seasons.filter((x) => x.avg).reduce((a, b) => (b.avg! < a.avg! ? b : a));
const pdear = p.seasons.filter((x) => x.avg).reduce((a, b) => (b.avg! > a.avg! ? b : a));

export default defineState({
  slug: 'iowa',
  title: 'Iowa Propane Prices This Week, and Heating Oil, 2026-27',
  description: `Iowa propane prices this week from the federal survey, winter 2026-27: one home in eight on propane, the price of a fill, past winters and heating oil.`,
  intro: `Iowa propane averaged ${K.ppg(p.last[1])} a gallon in the EIA survey of ${K.day(p.last[0])}; heating oil ${K.ppg(o.last[1])}.`,
  resume: `Propane heats a larger share of homes in Iowa than in most states: it ranks ${K.ord(K.rankOf('IA', (x) => x.acs.propaneShare))} of the ${K.STATES.length} surveyed states on that measure. The Census Bureau's 2024 survey counts ${K.num(st.acs.propane)} Iowa homes heated mainly with bottled, tank or LP gas, ${K.pct(st.acs.propaneShare, 1)} of occupied homes, against only ${K.num(st.acs.oil)} on fuel oil or kerosene. In the EIA's weekly survey of ${K.day(p.last[0])}, Iowa propane averaged ${K.ppg(p.last[1])} a gallon, ${K.ord(K.place('IA', 'pr'))} of ${K.ranked('pr').length} surveyed states counting from the dearest, and ${K.ppg(Math.abs(p.last[1] - K.price('US', 'pr')!))} ${K.dir(p.last[1] - K.price('US', 'pr')!, 'above', 'below', 'level with')} the national average. An Iowa winter is long: ${K.num(st.hdd.winter)} heating degree days from November to March in a normal year. The EIA's average Midwest propane home, scaled to that weather, would burn about ${K.gal(galP)} over the season, which is ${K.usd(galP * p.last[1])} at this week's Iowa average. Prices exclude taxes and fees, and each dealer sets its own.`,
  body: (h) => `
<h2>Propane winters in Iowa</h2>
<p>Iowa's propane average from November to March was lowest in ${pcheap.s}, at ${K.ppg(pcheap.avg!)} a gallon, and highest in ${pdear.s}, at ${K.ppg(pdear.avg!)}. Last winter it averaged ${K.ppg(pld.avg!)}, between a low week of ${K.ppg(pld.min[1])} and a high of ${K.ppg(pld.max[1])}. The highest single week since the series began is ${K.ppg(p.record[1])}, on ${K.day(p.record[0])}. Since ${p.seasons[0].s}, the winter average ended above the mid-October price in ${rp.up} of ${rp.n} seasons, with a median change of ${K.pct(rp.median, 1)}.</p>
${h.mini('lockin', { t: 'A fixed propane price in Iowa', p: ['fixed', 'gal'], d: { st: 'IA', fuel: 'pr' }, c: 'Open the lock-in check' })}
<h2>From wholesale to the farm and the house</h2>
<p>The EIA's wholesale propane price for Iowa this week is ${p.wholesale ? K.ppg(p.wholesale) : 'not published'}, so ${K.spread('IA', 'pr') === null ? 'the dealer margin cannot be measured this week' : `${K.ppg(K.spread('IA', 'pr')!)} a gallon of the residential price is delivery, storage, the tank and the dealer's margin`}. On farms propane also dries crops and heats livestock buildings and greenhouses (${h.src('eia_hgl_uses', 'EIA')}), so in a farm state the demand for propane is not only residential.</p>
<p>A 500-gallon tank filled from 30 % to 80 % takes 250 gallons, ${K.usd(250 * p.last[1])} at this week's average; a 1,000-gallon tank from the same reading takes 500 gallons, ${K.usd(500 * p.last[1])}. The ${h.a('propane-tank-fill-cost', 'propane tank calculator')} reads any gauge.</p>
<h2>The cold months</h2>
<p>NOAA's normals give Iowa ${K.num(st.hdd.month['12'])} heating degree days in December, ${K.num(st.hdd.month['01'])} in January and ${K.num(st.hdd.month['02'])} in February. Those three months alone account for ${K.pct((st.hdd.month['12'] + st.hdd.month['01'] + st.hdd.month['02']) / st.hdd.winter, 0)} of the November to March total, so a tank that starts the winter full may need a second fill by February. The ${h.a('winter-heating-budget', 'winter budget')} spreads the cost month by month.</p>
<h2>Heating oil in Iowa</h2>
<p>The EIA also surveys Iowa heating oil, ${K.ppg(o.last[1])} a gallon this week, although few homes still use it. Per million Btu at ENERGY STAR efficiencies, Iowa propane heat costs ${K.usd(K.perMBtu({ price: p.last[1], btu: K.P.btu.propane, efficiency: K.P.efficiency.propane }))} this week and oil heat ${K.usd(K.perMBtu({ price: o.last[1], btu: K.P.btu.oil, efficiency: K.P.efficiency.oil }))}; the ${h.a('heating-oil-vs-propane', 'comparison page')} adds electricity. The federal LIHEAP ceiling for four people in Iowa is ${K.usd(K.liheap('IA', 4))} a year.</p>
`,
  faqs: [
    { q: 'What is the price of propane in Iowa this week?', a: `${K.ppg(p.last[1])} a gallon on average in the EIA survey of ${K.day(p.last[0])}, excluding taxes, against ${K.ppg(K.price('US', 'pr')!)} for the United States. At that average, filling a 500-gallon tank from 30 % to 80 % costs ${K.usd(250 * p.last[1])}. Contract and pre-buy prices offered by Iowa dealers can differ from the weekly average.` },
    { q: 'How much propane does an Iowa home burn in a winter?', a: `The EIA's average propane-heated home in the Midwest, scaled to Iowa's normal ${K.num(st.hdd.winter)} heating degree days from November to March, burns about ${K.gal(galP)} for heat. A large or older farmhouse can burn much more. Last winter's delivery tickets give the best figure for your own home.` },
    { q: 'How many homes in Iowa heat with propane?', a: `${K.num(st.acs.propane)} according to the Census Bureau's 2024 American Community Survey, ${K.pct(st.acs.propaneShare, 1)} of the state's ${K.num(st.acs.homes)} occupied homes. Utility gas heats ${K.num(st.acs.gas)} homes and electricity ${K.num(st.acs.electric)}, both ahead of propane, while heating oil, at ${K.num(st.acs.oil)} homes, is far behind all three.` },
  ],
  related: ['propane-prices', 'propane-tank-fill-cost', 'lock-in-or-wait', 'state:minnesota', 'state:nebraska', 'state:illinois'],
});
