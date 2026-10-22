import { defineState } from '../../lib/page-types';
import { KIT as K } from '../../lib/kit';

const st = K.SC('CO');
const p = K.sum('CO', 'pr')!;
const pld = K.lastDone('CO', 'pr')!;
const galP = K.est(st, 'pr');
const rp = K.replay(p.seasons.filter((x) => x.s !== p.season), p.last[1]);
const gap = (c: string) => { const d = p.last[1] - K.price(c, 'pr')!; return `${K.ppg(Math.abs(d))} ${K.dir(d, 'dearer', 'cheaper', 'level')}`; };

export default defineState({
  slug: 'colorado',
  title: 'Colorado Propane Prices This Week, Winter 2026-27 Survey',
  description: `Colorado propane prices this week from the federal survey, winter 2026-27: the price per gallon, wholesale and margin, a tank fill and a long mountain winter.`,
  intro: `Colorado propane averaged ${K.ppg(p.last[1])} a gallon in the EIA survey of ${K.day(p.last[0])}.`,
  resume: `Two Colorado homes in three heat with utility gas, by the Census Bureau's 2024 count, and ${K.num(st.acs.propane)} with propane, ${K.pct(st.acs.propaneShare, 1)} of occupied homes. Those households face a long winter: NOAA's normals give Colorado ${K.num(st.hdd.winter)} heating degree days from November to March, weighted by population, and ${K.num(st.hdd.year)} over the year. In the EIA's weekly survey of ${K.day(p.last[0])}, Colorado propane averaged ${K.ppg(p.last[1])} a gallon, ${K.ord(K.place('CO', 'pr'))} of ${K.ranked('pr').length} states counting from the dearest and ${K.ppg(Math.abs(p.last[1] - K.price('US', 'pr')!))} ${K.dir(p.last[1] - K.price('US', 'pr')!, 'above', 'below', 'level with')} the national average. The EIA publishes no propane outlook for the West, so this site scales its national average home to Colorado's weather: about ${K.gal(galP)} for the winter, ${K.usd(galP * p.last[1])} at this week's price. Last winter the state averaged ${K.ppg(pld.avg!)}. Heating oil is not surveyed in Colorado. Prices exclude taxes and delivery fees.`,
  body: (h) => `
<h2>From the terminal to the tank</h2>
<p>The EIA's wholesale propane price for Colorado this week is ${p.wholesale ? K.ppg(p.wholesale) : 'unpublished'}. ${K.spread('CO', 'pr') === null ? 'Without it the margin cannot be computed.' : `The residential average is ${K.ppg(K.spread('CO', 'pr')!)} above it, so about ${K.pct(K.spread('CO', 'pr')! / p.last[1], 0)} of a Colorado propane bill goes to delivery, storage, the tank and the dealer.`} The price at the house follows the wholesale market only in part, and slowly.</p>
${h.mini('days', { t: 'Days left in a Colorado tank', p: ['now', 'from'], d: { st: 'CO', fuel: 'pr', now: 200, from: '12' }, c: 'Open the days-left calculator' })}
<h2>Seasons in Colorado</h2>
<p>Last winter the Colorado average ran from ${K.ppg(pld.min[1])} to ${K.ppg(pld.max[1])}, its dearest week on ${K.day(pld.max[0])}. The record week on file is ${K.ppg(p.record[1])}, on ${K.day(p.record[0])}. Since ${p.seasons[0].s}, the winter average finished above the mid-October price in ${rp.up} of ${rp.n} seasons, with a median change of ${K.pct(rp.median, 1)}. The ${h.a('lock-in-or-wait', 'lock-in check')} replays each of them against a dealer's fixed price.</p>
<h2>Colorado and its neighbors</h2>
<p>This week Colorado propane is ${gap('UT')} than Utah's average, ${gap('KS')} than Kansas's and ${gap('NE')} than Nebraska's, and ${gap('R40')} than the Rocky Mountain regional average. A 500-gallon tank filled from 30 % to 80 % costs ${K.usd(250 * p.last[1])} at the Colorado average; a 1,000-gallon tank from 20 % takes 600 gallons, ${K.usd(600 * p.last[1])}. The ${h.a('propane-tank-fill-cost', 'propane tank calculator')} handles any size.</p>
<h2>Altitude, cold and the gallons</h2>
<p>Colorado's normal January counts ${K.num(st.hdd.month['01'])} heating degree days, and October and April still bring ${K.num(st.hdd.month['10'])} and ${K.num(st.hdd.month['04'])}, so the heating season runs well beyond the five months of the EIA's winter. Because the state figure is weighted by population, a house in a colder county than the average, high in the mountains for instance, will burn more. The ${h.a('how-long-will-my-oil-last', 'days-left calculator')} works for propane, and the ${h.a('winter-heating-budget', 'winter budget')} takes the gallons you actually bought. Per million Btu at the ENERGY STAR furnace rating, Colorado propane heat costs ${K.usd(K.perMBtu({ price: p.last[1], btu: K.P.btu.propane, efficiency: K.P.efficiency.propane }))} this week; the ${h.a('heating-oil-vs-propane', 'comparison page')} sets it against electricity. The federal LIHEAP ceiling for four people in Colorado is ${K.usd(K.liheap('CO', 4))} a year.</p>
`,
  faqs: [
    { q: 'What is the price of propane in Colorado this week?', a: `In the release covering ${K.day(p.last[0])}, Colorado's residential propane averaged ${K.ppg(p.last[1])} per gallon, untaxed, compared with ${K.ppg(K.price('US', 'pr')!)} across the nation. A 1,000-gallon tank brought from 20 % to 80 % needs 600 gallons, about ${K.usd(600 * p.last[1])}. Mountain deliveries and tank leases change what a dealer quotes.` },
    { q: 'How much propane does a Colorado home burn in a winter?', a: `Since the EIA forecasts no western propane region, the national household is used and stretched to Colorado's ${K.num(st.hdd.winter)} degree days for November to March: near ${K.gal(galP)}, about ${K.usd(galP * p.last[1])} now. A house at elevation, with long shoulder seasons, will go well past that.` },
    { q: 'How many Colorado homes heat with propane?', a: `Colorado had ${K.num(st.acs.propane)} propane-heated homes in the 2024 Census survey, ${K.pct(st.acs.propaneShare, 1)} of those occupied. Gas utilities dominate with ${K.num(st.acs.gas)} homes, electric heat follows with ${K.num(st.acs.electric)}, and heating oil, ${K.num(st.acs.oil)} homes, is not part of the EIA's weekly survey in this state.` },
  ],
  related: ['how-long-will-my-oil-last', 'propane-tank-fill-cost', 'propane-prices', 'state:utah', 'state:kansas', 'state:nebraska'],
});
