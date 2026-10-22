import { defineState } from '../../lib/page-types';
import { KIT as K } from '../../lib/kit';

const st = K.SC('TX');
const p = K.sum('TX', 'pr')!;
const pld = K.lastDone('TX', 'pr')!;
const galP = K.est(st, 'pr');
const yp = K.yoy('TX', 'pr');
const rp = K.replay(p.seasons.filter((x) => x.s !== p.season), p.last[1]);
const gap = (c: string) => { const d = p.last[1] - K.price(c, 'pr')!; return `${K.ppg(Math.abs(d))} ${K.dir(d, 'dearer', 'cheaper', 'level')}`; };

export default defineState({
  slug: 'texas',
  title: 'Texas Propane Prices This Week, Federal Survey 2026-27',
  description: `Texas propane prices from the federal weekly survey for 2026-27: the ${K.ord(K.rankOf('TX', (x) => x.acs.propane))}-largest number of propane homes, the dealer margin, fill costs and a short winter.`,
  intro: `Texas propane averaged ${K.ppg(p.last[1])} a gallon in the EIA survey of ${K.day(p.last[0])}.`,
  resume: `Only ${K.pct(st.acs.propaneShare, 1)} of Texas homes heat with propane, yet the state is so large that the Census Bureau's 2024 survey counts ${K.num(st.acs.propane)} of them, the ${K.ord(K.rankOf('TX', (x) => x.acs.propane))} largest number among the states in the federal survey. In the EIA's weekly survey of ${K.day(p.last[0])}, Texas propane averaged ${K.ppg(p.last[1])} a gallon${yp === null ? '' : `, ${K.pct(Math.abs(yp), 0)} ${K.dir(yp, 'more', 'less')} than a year before`}, ${K.ord(K.place('TX', 'pr'))} of ${K.ranked('pr').length} states counting from the dearest. The wholesale price for the state was ${p.wholesale ? K.ppg(p.wholesale) : 'not published'} the same week. Texas winters are short, ${K.num(st.hdd.winter)} heating degree days from November to March in a normal year weighted by population, so the EIA's average propane home in the South would burn about ${K.gal(galP)} for heat, ${K.usd(galP * p.last[1])} at this week's average. Last winter Texas propane averaged ${K.ppg(pld.avg!)}. The EIA does not survey heating oil in Texas. Prices exclude taxes and delivery fees.`,
  body: (h) => `
<h2>Wholesale against residential</h2>
<p>${K.spread('TX', 'pr') === null ? 'The EIA did not publish a Texas wholesale propane price this week, so the margin cannot be computed.' : `The gap between the Texas residential average and the wholesale price is ${K.ppg(K.spread('TX', 'pr')!)} a gallon this week. Put another way, the fuel is about ${K.pct(p.wholesale! / p.last[1], 0)} of the price at the house, and delivery, storage, the tank and the dealer are the rest.`} On a 250-gallon fill that margin comes to ${K.spread('TX', 'pr') === null ? 'an unknown sum' : K.usd(250 * K.spread('TX', 'pr')!)}.</p>
${h.mini('fill', { t: 'Propane fill in Texas', p: ['tank', 'gauge'], d: { st: 'TX', fuel: 'pr', tank: 250, gauge: 20 }, c: 'Open the tank fill calculator' })}
<h2>Past Texas winters</h2>
<p>Last winter the Texas average ran from ${K.ppg(pld.min[1])} to ${K.ppg(pld.max[1])}, its dearest week on ${K.day(pld.max[0])}. The highest week on file is ${K.ppg(p.record[1])}, on ${K.day(p.record[0])}. Since ${p.seasons[0].s}, the November to March average finished above the mid-October price in ${rp.up} of ${rp.n} winters, with a median change of ${K.pct(rp.median, 1)}. The ${h.a('lock-in-or-wait', 'lock-in check')} runs a dealer's fixed price against each of them.</p>
<h2>Texas and its neighbors</h2>
<p>This week Texas propane is ${gap('OK')} than Oklahoma's average and ${gap('AR')} than Arkansas's; New Mexico and Louisiana are not in the propane survey. Against the Gulf Coast regional average of ${K.ppg(K.sum('R30', 'pr')!.last[1])}, Texas is ${gap('R30')}. A 250-gallon tank filled from 20 % to 80 % takes 150 gallons, ${K.usd(150 * p.last[1])} at the Texas average; a 500-gallon tank from 30 % takes 250 gallons, ${K.usd(250 * p.last[1])}. The ${h.a('propane-tank-fill-cost', 'propane tank calculator')} adds a delivery fee or tax if you know it.</p>
<h2>A short winter, and a cold snap</h2>
<p>NOAA's population-weighted normals give Texas ${K.num(st.hdd.month['12'])} heating degree days in December and ${K.num(st.hdd.month['01'])} in January, about ${K.pct(st.hdd.month['01'] / K.SC('KS').hdd.month['01'], 0)} of a Kansas January. A normal Texas winter asks little of a propane tank, but a hard freeze raises daily use sharply for as long as it lasts, and a tank left low going into it can run out before the dealer arrives. The ${h.a('how-long-will-my-oil-last', 'days-left calculator')} turns a gauge reading into a date at the normal pace; in a cold snap, assume less. The ${h.a('winter-heating-budget', 'winter budget')} spreads the season, and per million Btu at the ENERGY STAR furnace rating, Texas propane heat costs ${K.usd(K.perMBtu({ price: p.last[1], btu: K.P.btu.propane, efficiency: K.P.efficiency.propane }))} this week; the ${h.a('heating-oil-vs-propane', 'comparison page')} sets it against electricity. The federal LIHEAP ceiling for four people in Texas is ${K.usd(K.liheap('TX', 4))} a year.</p>
`,
  faqs: [
    { q: 'What does propane cost in Texas this week?', a: `Texas came in at ${K.ppg(p.last[1])} per gallon in the federal tally for ${K.day(p.last[0])}, sales tax left out; the country as a whole stood at ${K.ppg(K.price('US', 'pr')!)}. Topping a 250-gallon tank up from a fifth to 80 % means buying 150 gallons, close to ${K.usd(150 * p.last[1])}. Quotes range widely across a state this big.` },
    { q: 'How many Texas homes heat with propane?', a: `Census figures for 2024 show ${K.num(st.acs.propane)} Texas households using bottled, tank or LP gas as their main heat, ${K.pct(st.acs.propaneShare, 1)} of ${K.num(st.acs.homes)}. Electric heat dominates with ${K.num(st.acs.electric)} homes, followed by utility gas at ${K.num(st.acs.gas)}. A small share of a huge housing stock still makes a large propane market.` },
    { q: 'How much propane does a Texas home burn in a winter?', a: `Applying the EIA's southern propane household to the ${K.num(st.hdd.winter)} degree days Texas sees from November through March gives about ${K.gal(galP)} of heating fuel, roughly ${K.usd(galP * p.last[1])} at present prices. Panhandle cold, an ice storm or a propane water heater push that number up.` },
  ],
  related: ['how-long-will-my-oil-last', 'propane-tank-fill-cost', 'lock-in-or-wait', 'state:oklahoma', 'state:arkansas', 'propane-prices'],
});
