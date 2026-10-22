import { defineState } from '../../lib/page-types';
import { KIT as K } from '../../lib/kit';

const st = K.SC('CT');
const o = K.sum('CT', 'ho')!;
const p = K.sum('CT', 'pr')!;
const ld = K.lastDone('CT', 'ho')!;
const pld = K.lastDone('CT', 'pr')!;
const yo = K.yoy('CT', 'ho');
const gal = K.est(st, 'ho');
const rp = K.replay(p.seasons.filter((x) => x.s !== p.season), p.last[1]);

export default defineState({
  slug: 'connecticut',
  title: 'Connecticut Heating Oil Prices This Week, Winter 2026-27',
  description: `Connecticut heating oil and propane prices from the federal weekly survey for winter 2026-27: cost of a fill, a third of homes on oil, and propane's high price.`,
  intro: `Connecticut paid ${K.ppg(o.last[1])} a gallon for heating oil and ${K.ppg(p.last[1])} for propane in the survey week of ${K.day(o.last[0])}.`,
  resume: `One Connecticut home in three heats with oil: the Census Bureau counts ${K.num(st.acs.oil)} of them, ${K.pct(st.acs.oilShare, 0)} of occupied homes, the ${K.ord(K.rankOf('CT', (x) => x.acs.oilShare))} highest share of the ${K.STATES.length} surveyed states. In the EIA's survey of ${K.day(o.last[0])} those homes paid ${K.ppg(o.last[1])} a gallon on average, ${yo === null ? '' : `${K.pct(Math.abs(yo), 0)} ${K.dir(yo, 'more', 'less')} than a year earlier,`} so a 200-gallon delivery came to ${K.usd(200 * o.last[1])} before tax. Propane is the state's sore point: at ${K.ppg(p.last[1])} a gallon it ranks ${K.place('CT', 'pr')} of ${K.ranked('pr').length} surveyed states, ${K.dir(p.last[1] - K.price('US', 'pr')!, 'above', 'below')} the U.S. average of ${K.ppg(K.price('US', 'pr')!)} by ${K.ppg(Math.abs(p.last[1] - K.price('US', 'pr')!))}. Over a normal Connecticut winter of ${K.num(st.hdd.winter)} heating degree days, the EIA's average oil home would burn about ${K.gal(gal)}, which is ${K.usd(gal * o.last[1])} at this week's average. Prices exclude taxes and any delivery fee; the calculator above adds them if you know them.`,
  body: (h) => `
<h2>Oil in Connecticut: a large market, a narrow spread</h2>
<p>With half a million oil-heated homes, Connecticut is one of the largest heating oil markets in the survey. This week its average sits ${K.ppg(Math.abs(o.last[1] - K.price('US', 'ho')!))} ${K.dir(o.last[1] - K.price('US', 'ho')!, 'above', 'below', 'level with')} the national figure, ${K.ord(K.place('CT', 'ho'))} of ${K.ranked('ho').length} states. The EIA's wholesale price for Connecticut the same week was ${o.wholesale ? K.ppg(o.wholesale) : 'not published'}, leaving dealers ${K.spread('CT', 'ho') === null ? 'a margin the survey does not show' : `${K.ppg(K.spread('CT', 'ho')!)} a gallon`} for delivery, service and profit.</p>
<p>Last winter the state averaged ${K.ppg(ld.avg!)} from November to March. Its highest week came on ${K.day(ld.max[0])}, at ${K.ppg(ld.max[1])}. A winter that peaks in March punishes the households who let the tank run low in February.</p>
${h.mini('fill', { t: 'Next oil delivery in Connecticut', p: ['tank', 'gauge'], d: { st: 'CT', fuel: 'ho', tank: 275, gauge: 25 }, c: 'Open the tank fill calculator' })}
<h2>Why Connecticut propane costs so much</h2>
<p>The EIA does not publish a wholesale propane price for Connecticut. The East Coast wholesale figure, ${K.sum('R10', 'pr')?.wholesale ? K.ppg(K.sum('R10', 'pr')!.wholesale!) : 'not published this week'}, shows how much of the ${K.ppg(p.last[1])} retail price is added after the terminal: delivery, storage, the tank and the dealer's margin. Connecticut has ${K.num(st.acs.propane)} homes on bottled or tank gas, ${K.pct(st.acs.propaneShare, 1)} of the total. Last winter the state's propane averaged ${K.ppg(pld.avg!)}.</p>
<p>The price also climbs more often than it falls during a season. In ${rp.up} of the last ${rp.n} winters, the Connecticut propane average from November to March ended above the mid-October price. On that record, a fixed propane price close to the October survey has more often than not turned out cheap, which says nothing certain about this winter. The ${h.a('lock-in-or-wait', 'lock-in check')} runs your offer against each of those winters.</p>
<h2>Oil heat against propane heat here</h2>
<p>Per million Btu delivered at ENERGY STAR boiler efficiency, oil heat costs ${K.usd(K.perMBtu({ price: o.last[1], btu: K.P.btu.oil, efficiency: K.P.efficiency.oil }))} in Connecticut this week and propane heat ${K.usd(K.perMBtu({ price: p.last[1], btu: K.P.btu.propane, efficiency: K.P.efficiency.propane }))}. A household choosing between the two fuels for a new system should compare those figures over several winters, not one: the ${h.a('heating-oil-price-history', 'price history')} shows how far each has moved since 2013-14, and the ${h.a('heating-oil-vs-propane', 'comparison page')} lets you enter the AFUE of your own equipment.</p>
`,
  faqs: [
    { q: 'What is the average heating oil price in Connecticut this week?', a: `The EIA's survey of ${K.day(o.last[0])} gives ${K.ppg(o.last[1])} a gallon for Connecticut, excluding taxes, against ${K.ppg(K.price('US', 'ho')!)} nationally. A 150-gallon delivery at that average costs ${K.usd(150 * o.last[1])}. Dealers in the state price above or below the average depending on the service and the size of the order.` },
    { q: 'Is propane more expensive in Connecticut than elsewhere?', a: `Yes, among the highest in the survey: ${K.ppg(p.last[1])} a gallon this week, rank ${K.place('CT', 'pr')} of ${K.ranked('pr').length} states. A 500-gallon tank going from 30 % to 80 % costs ${K.usd(250 * p.last[1])} at that price, against ${K.usd(250 * K.price('US', 'pr')!)} at the U.S. average. Ask your dealer for the per-gallon price before the delivery.` },
    { q: 'How much oil does a Connecticut house burn in a winter?', a: `The EIA's average oil-heated home, scaled to Connecticut's normal ${K.num(st.hdd.winter)} heating degree days from November to March, burns about ${K.gal(gal)}. January alone brings ${K.num(st.hdd.month['01'])} degree days. Your own delivery tickets from last winter give a better figure, and the winter budget calculator accepts them.` },
  ],
  related: ['heating-oil-tank-fill-cost', 'lock-in-or-wait', 'heating-oil-vs-propane', 'state:massachusetts', 'state:rhode-island', 'state:new-york'],
});
