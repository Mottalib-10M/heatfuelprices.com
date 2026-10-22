import { defineGuide } from '../../lib/page-types';
import { KIT as K } from '../../lib/kit';

const us = K.sum('US', 'pr')!;
const p = us.last[1];
const fill = K.P.propaneFill.defaultPct;
const lo = K.volumeFromDensity(K.P.propaneFill.weightPct, K.P.propaneFill.sgHigh);
const hi = K.volumeFromDensity(K.P.propaneFill.weightPct, K.P.propaneFill.sgLow);
const sizes = [120, 250, 500, 1000];

export default defineGuide({
  id: 'propane-tank-fill-cost', group: 'costs', order: 11, slug: 'propane-tank-fill-cost',
  nav: 'Propane tank fill cost', card: 'Gallons and dollars for a 120 to 1,000 gallon tank, with the 80 % rule applied.',
  title: 'Propane Tank Fill Cost, 500 Gallon Tank at 80 %, 2026',
  description: `Propane tank fill cost with the 80 % rule applied, 2026: gallons and dollars to fill a 120, 250, 500 or 1,000 gallon tank at this week's state average.`,
  h1: 'What it costs to fill a propane tank, 80 % rule included',
  intro: `A 500-gallon tank at 30 % takes ${K.num(500 * (fill - 0.3))} gallons to reach 80 %, about ${K.usd(500 * (fill - 0.3) * p)} at this week's U.S. average.`,
  resume: `A propane tank is never filled to its nominal size. Federal rules for aboveground home tanks of up to 1,200 gallons cap the fill at ${K.pct(K.P.propaneFill.weightPct, 0)} of the weight of water the tank holds, which for propane is ${K.pct(lo)} to ${K.pct(hi)} of the tank's volume, and a filled tank commonly reads about 80 % on its gauge. So a 500-gallon tank holds about ${K.num(500 * fill)} gallons of propane at most, and a delivery adds the gap between your gauge and 80 %: from 30 %, that is ${K.num(500 * (fill - 0.3))} gallons. At the U.S. average of ${K.ppg(p)} a gallon in the federal survey of ${K.day(us.last[0])}, the fill costs ${K.usd(500 * (fill - 0.3) * p)} before tax; a full fill from 10 % is ${K.usd(500 * (fill - 0.1) * p)}. Several price pages online multiply the nominal size by the price and overstate the bill by a fifth or more. The calculator applies the rule, starts from your state's average and takes your dealer's price when you have it.`,
  body: (h) => `
<h2>The rule behind the 80 %</h2>
<p>Propane is stored as a liquid under pressure, and the liquid expands as it warms. A tank filled to the top on a cold morning could reach its relief valve on a hot afternoon. The federal rule on the storage of liquefied petroleum gas (${h.src('osha_lpg', '29 CFR 1910.110, Table H-27')}) therefore limits the "filling density", the weight of gas in the tank as a share of the weight of water the tank would hold at 60 °F. For an aboveground tank of up to 1,200 gallons and propane with a specific gravity of ${K.P.propaneFill.sgLow} to ${K.P.propaneFill.sgHigh}, the cap is ${K.pct(K.P.propaneFill.weightPct, 0)}. Divide by the specific gravity and the liquid takes ${K.pct(lo)} to ${K.pct(hi)} of the tank's volume. Drivers stop a little under that ceiling, and a filled tank commonly shows about 80 % on its gauge: the level the calculator starts from, which you can change to what your ticket shows.</p>
<p>The practical consequence: a tank's usable size is about four fifths of its nominal size.</p>
${h.table(['Tank size', 'Holds at 80 %', 'Fill from 20 %', 'Cost from 20 %', 'Fill from 30 %', 'Cost from 30 %'], sizes.map((g) => [`${K.num(g)} gallons`, `${K.num(g * fill)} gal`, `${K.num(g * (fill - 0.2))} gal`, K.usd(g * (fill - 0.2) * p), `${K.num(g * (fill - 0.3))} gal`, K.usd(g * (fill - 0.3) * p)]), `At ${K.ppg(p)} a gallon, the EIA's U.S. residential average for ${K.day(us.last[0])}, excluding taxes.`, ['l', 'r', 'r', 'r', 'r', 'r'])}
<h2>Reading the gauge</h2>
<p>Unlike an oil gauge in fractions, a propane gauge reads in percent of the tank's volume. Gallons in the tank = size × reading. A 500-gallon tank at 30 % holds ${K.num(500 * 0.3)} gallons; filled to 80 %, ${K.num(500 * fill)}. The delivery adds the difference. If your delivery ticket shows more gallons than the gap between the two readings allows, ask the dealer how the gauge was read.</p>
${h.mini('fill', { t: 'Your tank, your gauge', p: ['tank', 'gauge'], d: { fuel: 'pr', st: 'MI', tank: 500, gauge: 25 }, c: 'Open the full propane calculator' })}
<h2>What the state changes</h2>
<p>Propane prices vary more between states than heating oil. This week a 250-gallon fill costs ${K.usd(250 * K.price(K.ranked('pr').at(-1)!.code, 'pr')!)} at the ${K.ranked('pr').at(-1)!.name} average and ${K.usd(250 * K.price(K.ranked('pr')[0].code, 'pr')!)} at the ${K.ranked('pr')[0].name} average. The spread is not in the gas: wholesale propane is close to the same price everywhere. It is in what the dealer adds for delivery, storage, the tank and its own margin. The ${h.a('propane-prices', 'state table')} ranks every surveyed state.</p>
<h2>Owned tank or leased tank</h2>
<p>Many homes lease the tank from the dealer that fills it. The lease usually ties the deliveries to that dealer, so the price per gallon is not shopped from week to week; the state average is then a check rather than a choice. A household that owns its tank can call any dealer, and the gap between its quote and the state line tells it whether to keep calling. Either way, the tank rental and any minimum-use fee are billed apart from the gallons and do not show in the survey.</p>
<h2>A winter's worth of fills</h2>
<p>The EIA's average propane-heated home burns ${K.gal(K.W.pr.US.gal.base)} from November to March nationwide, ${K.gal(K.W.pr.Midwest.gal.base)} in the Midwest and ${K.gal(K.W.pr.Northeast.gal.base)} in the Northeast. With a 500-gallon tank holding about ${K.num(500 * fill)} gallons usable, a Midwest home needs at least two fills over the winter on top of what is in the tank in November. The ${h.a('winter-heating-budget', 'winter budget')} scales those gallons to your state, and the ${h.a('how-long-will-my-oil-last', 'days-left calculator')} works for propane too.</p>
`,
  faqs: [
    { q: 'How much does it cost to fill a 500 gallon propane tank?', a: `At this week's U.S. average of ${K.ppg(p)} a gallon, excluding taxes, a 500-gallon tank going from 30 % to 80 % takes ${K.num(500 * (fill - 0.3))} gallons and costs about ${K.usd(500 * (fill - 0.3) * p)}. From 10 %, it takes ${K.num(500 * (fill - 0.1))} gallons, about ${K.usd(500 * (fill - 0.1) * p)}. State prices differ widely, so use the calculator with your state or your dealer's price.` },
    { q: 'Why is a propane tank only filled to 80 percent?', a: 'Because liquid propane expands when it warms. The federal rule on liquefied petroleum gas storage caps how much gas a home tank may hold by weight, which works out to roughly 82 to 83 % of the tank volume for propane. Drivers stop a little below that, and a full tank commonly reads about 80 % on its gauge.' },
    { q: 'How many gallons are in a 1,000 gallon propane tank when full?', a: `About ${K.num(1000 * fill)} gallons at the usual 80 % fill, and never more than the ${K.pct(hi, 0)} of volume the federal cap allows. Going from 20 % to 80 % takes ${K.num(1000 * (fill - 0.2))} gallons, which costs ${K.usd(1000 * (fill - 0.2) * p)} at this week's U.S. average.` },
  ],
  tool: 'fill', toolArg: { fuel: 'pr', st: 'MI', tank: 500, gauge: 30, fill: 80 },
  related: ['propane-prices', 'heating-oil-vs-propane', 'winter-heating-budget', 'lock-in-or-wait', 'heating-oil-tank-fill-cost'],
  sources: ['osha_lpg', 'eia_pr_weekly', 'eia_wfo'],
});
