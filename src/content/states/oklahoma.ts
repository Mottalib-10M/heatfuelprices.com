import { defineState } from '../../lib/page-types';
import { KIT as K } from '../../lib/kit';

const st = K.SC('OK');
const p = K.sum('OK', 'pr')!;
const pld = K.lastDone('OK', 'pr')!;
const galP = K.est(st, 'pr');
const done = p.seasons.filter((x) => x.avg);
const pcheap = done.reduce((a, b) => (b.avg! < a.avg! ? b : a));
const pdear = done.reduce((a, b) => (b.avg! > a.avg! ? b : a));
const gap = (c: string) => { const d = p.last[1] - K.price(c, 'pr')!; return `${K.ppg(Math.abs(d))} ${K.dir(d, 'dearer', 'cheaper', 'level')}`; };

export default defineState({
  slug: 'oklahoma',
  title: 'Oklahoma Propane Prices This Week, Winter 2026-27 Survey',
  description: `Oklahoma propane prices this week from the federal survey, winter 2026-27: price per gallon, wholesale and the dealer margin, a tank fill and a southern winter.`,
  intro: `Oklahoma propane averaged ${K.ppg(p.last[1])} a gallon in the EIA survey of ${K.day(p.last[0])}.`,
  resume: `Oklahoma heats mostly with gas and electricity, but the Census Bureau's 2024 survey counts ${K.num(st.acs.propane)} homes heated mainly with propane, ${K.pct(st.acs.propaneShare, 1)} of occupied homes. In the EIA's weekly survey of ${K.day(p.last[0])}, Oklahoma propane averaged ${K.ppg(p.last[1])} a gallon, ${K.ord(K.place('OK', 'pr'))} of ${K.ranked('pr').length} states counting from the dearest and ${K.ppg(Math.abs(p.last[1] - K.price('US', 'pr')!))} ${K.dir(p.last[1] - K.price('US', 'pr')!, 'above', 'below', 'level with')} the U.S. average. Over the winters on file, the state's November to March average has ranged from ${K.ppg(pcheap.avg!)} in ${pcheap.s} to ${K.ppg(pdear.avg!)} in ${pdear.s}; last winter it was ${K.ppg(pld.avg!)}. A normal Oklahoma winter counts ${K.num(st.hdd.winter)} heating degree days over those five months, so the EIA's average propane home in the South would burn about ${K.gal(galP)}, ${K.usd(galP * p.last[1])} at this week's price. Heating oil is not surveyed in Oklahoma. Prices exclude taxes and delivery fees.`,
  body: (h) => `
<h2>From wholesale to the house</h2>
<p>The EIA's wholesale propane price for Oklahoma this week is ${p.wholesale ? K.ppg(p.wholesale) : 'not published'}. ${K.spread('OK', 'pr') === null ? 'The dealer margin cannot be measured without it.' : `The residential average is ${K.ppg(K.spread('OK', 'pr')!)} higher, which means the fuel itself is about ${K.pct(p.wholesale! / p.last[1], 0)} of the price and delivery, storage, the tank and the dealer the rest.`} On a 250-gallon fill at the average, the household pays ${K.usd(250 * p.last[1])}.</p>
${h.mini('fill', { t: 'Propane fill in Oklahoma', p: ['tank', 'gauge'], d: { st: 'OK', fuel: 'pr', tank: 500, gauge: 25 }, c: 'Open the tank fill calculator' })}
<h2>Last winter and the record</h2>
<p>Last winter the Oklahoma average ran from ${K.ppg(pld.min[1])} to ${K.ppg(pld.max[1])}, its dearest week on ${K.day(pld.max[0])}. The highest week the survey has recorded in Oklahoma is ${K.ppg(p.record[1])}, on ${K.day(p.record[0])}. The ${h.a('heating-oil-price-history', 'price history')} lists every winter for the state, and the ${h.a('lock-in-or-wait', 'lock-in check')} replays them against a dealer's fixed price.</p>
<h2>Oklahoma and its neighbors</h2>
<p>This week Oklahoma propane is ${gap('TX')} than Texas's average, ${gap('KS')} than Kansas's, ${gap('AR')} than Arkansas's and ${gap('MO')} than Missouri's. Those gaps change from week to week, and a dealer's price can sit well above or below its state's average; the ${h.a('propane-prices', 'propane table')} ranks every surveyed state.</p>
<h2>A short, sharp winter</h2>
<p>NOAA's normals give Oklahoma ${K.num(st.hdd.month['12'])} heating degree days in December and ${K.num(st.hdd.month['01'])} in January, about ${K.pct(st.hdd.month['01'] / K.SC('KS').hdd.month['01'], 0)} of a Kansas January. A propane tank therefore lasts longer than further north, but a cold snap can still empty it faster than the average suggests. The ${h.a('how-long-will-my-oil-last', 'days-left calculator')} turns a gauge reading into a date at the normal pace, and the ${h.a('winter-heating-budget', 'winter budget')} spreads the cost. Per million Btu at the ENERGY STAR furnace rating, Oklahoma propane heat costs ${K.usd(K.perMBtu({ price: p.last[1], btu: K.P.btu.propane, efficiency: K.P.efficiency.propane }))} this week; the ${h.a('heating-oil-vs-propane', 'comparison page')} sets it against an electric heat pump. The federal LIHEAP ceiling for three people in Oklahoma is ${K.usd(K.liheap('OK', 3))} a year; the ${h.a('liheap-income-limits', 'LIHEAP page')} gives the ceiling for every household size.</p>
`,
  faqs: [
    { q: 'What is the propane price in Oklahoma this week?', a: `${K.ppg(p.last[1])} a gallon on average in the EIA survey of ${K.day(p.last[0])}, excluding taxes, against ${K.ppg(K.price('US', 'pr')!)} nationally. Filling a 500-gallon tank from 25 % to 80 % takes 275 gallons, ${K.usd(275 * p.last[1])} at that average. Dealers' prices differ around it.` },
    { q: 'What was the cheapest winter for propane in Oklahoma?', a: `In the EIA weekly survey, ${pcheap.s}, when the Oklahoma average from November to March was ${K.ppg(pcheap.avg!)} a gallon. The dearest was ${pdear.s}, at ${K.ppg(pdear.avg!)}, and last winter averaged ${K.ppg(pld.avg!)}. All are prices as published, before tax and not adjusted for inflation.` },
    { q: 'How many homes in Oklahoma heat with propane?', a: `${K.num(st.acs.propane)}, or ${K.pct(st.acs.propaneShare, 1)} of occupied homes, according to the Census Bureau's 2024 American Community Survey. Utility gas heats ${K.num(st.acs.gas)} Oklahoma homes and electricity ${K.num(st.acs.electric)}. Fuel oil and kerosene heat only ${K.num(st.acs.oil)} homes, and the EIA does not survey heating oil prices in the state.` },
  ],
  related: ['propane-tank-fill-cost', 'heating-oil-price-history', 'propane-prices', 'state:texas', 'state:kansas', 'state:arkansas'],
});
