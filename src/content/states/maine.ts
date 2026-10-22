import { defineState } from '../../lib/page-types';
import { KIT as K } from '../../lib/kit';

const st = K.SC('ME');
const o = K.sum('ME', 'ho')!;
const p = K.sum('ME', 'pr')!;
const ld = K.lastDone('ME', 'ho')!;
const gal = K.est(st, 'ho');
const cheap = o.seasons.filter((x) => x.avg).reduce((a, b) => (b.avg! < a.avg! ? b : a));

export default defineState({
  slug: 'maine',
  title: 'Maine Heating Oil Prices This Week, Kerosene State 2026-27',
  description: `Maine heating oil and propane prices from the federal weekly survey, 2026-27: half of Maine homes burn oil, the longest winter of New England, and its cost.`,
  intro: `Maine heating oil averaged ${K.ppg(o.last[1])} a gallon in the week of ${K.day(o.last[0])}; propane ${K.ppg(p.last[1])}.`,
  resume: `No state depends on heating oil as much as Maine. The Census Bureau finds ${K.num(st.acs.oil)} Maine homes heated with fuel oil or kerosene, ${K.pct(st.acs.oilShare, 0)} of all occupied homes, and another ${K.num(st.acs.propane)} on propane. Its winter is also the longest of the oil states in the survey but one: ${K.num(st.hdd.winter)} heating degree days from November to March in a normal year. Put together, the EIA's average oil-heated home would burn about ${K.gal(gal)} in Maine this season, and at the ${K.ppg(o.last[1])} average of the survey of ${K.day(o.last[0])} that is ${K.usd(gal * o.last[1])}. Last winter the Maine price averaged ${K.ppg(ld.avg!)}; the cheapest winter on file was ${cheap.s}, at ${K.ppg(cheap.avg!)}. Prices are before tax, and a Maine household's own bill depends on its dealer, its tank and its house.`,
  body: (h) => `
<h2>A long season, measured</h2>
<p>Maine's normal January brings ${K.num(st.hdd.month['01'])} heating degree days and its normal March ${K.num(st.hdd.month['03'])}, more than a January in Maryland. October and April count ${K.num(st.hdd.month['10'])} and ${K.num(st.hdd.month['04'])}, so the heating season spills well beyond the five winter months the EIA uses. A Maine household that fills its tank in October and again in April is not being careless: the shoulder months alone can burn a delivery.</p>
${h.mini('days', { t: 'How long a Maine tank lasts', p: ['now', 'from'], d: { st: 'ME', fuel: 'ho', now: 200, from: '01' }, c: 'Open the days-left calculator' })}
<h2>Where Maine sits in the price table</h2>
<p>This week Maine ranks ${K.ord(K.place('ME', 'ho'))} of ${K.ranked('ho').length} states for heating oil, ${K.ppg(Math.abs(o.last[1] - K.price('US', 'ho')!))} ${K.dir(o.last[1] - K.price('US', 'ho')!, 'above', 'below', 'level with')} the national average. The wholesale price the EIA reports for Maine, ${o.wholesale ? K.ppg(o.wholesale) : 'not published this week'}, leaves a dealer spread of ${K.spread('ME', 'ho') === null ? 'unknown size' : K.ppg(K.spread('ME', 'ho')!)}. Compared with its neighbor, Maine's average is ${K.ppg(Math.abs(o.last[1] - K.price('NH', 'ho')!))} ${K.dir(o.last[1] - K.price('NH', 'ho')!, 'above', 'below', 'level with')} New Hampshire's this week.</p>
<p>For propane, Maine ranks ${K.ord(K.place('ME', 'pr'))} of ${K.ranked('pr').length}. Its highest propane week since 2013 was ${K.ppg(p.record[1])}, on ${K.day(p.record[0])}.</p>
<h2>Wood, oil and the budget</h2>
<p>Maine also counts ${K.num(st.acs.wood)} homes heated mainly with wood, a larger share than any other surveyed state but Vermont. Many oil households burn some wood too, which lowers their gallons: if that is your case, enter your own gallons from last winter in the ${h.a('winter-heating-budget', 'winter budget')} rather than the average. Households under the federal income ceiling, ${K.usd(K.liheap('ME', 2))} a year for two people in Maine, can apply for heating help through the ${h.a('liheap-income-limits', 'LIHEAP program')}.</p>
<h2>Planning deliveries through a Maine winter</h2>
<p>A 275-gallon tank, the most common size in older houses, holds less than the average Maine home burns in January and February together. At ${K.num(st.hdd.month['01'])} degree days in January, the average oil home would use roughly ${K.gal(gal * st.hdd.month['01'] / st.hdd.winter)} that month alone by the same scaling. Households on will-call delivery therefore order several times a season, and each order is priced at the week it is placed. The ${h.a('heating-oil-tank-fill-cost', 'tank fill calculator')} gives the cost of the next delivery at this week's Maine price, and the ${h.a('lock-in-or-wait', 'lock-in check')} replays past winters against a fixed price offered by a dealer.</p>
`,
  faqs: [
    { q: 'What do Maine households pay for heating oil this week?', a: `${K.ppg(o.last[1])} a gallon on average in the EIA survey of ${K.day(o.last[0])}, before tax. That puts a 200-gallon delivery at ${K.usd(200 * o.last[1])} and a full winter for the average oil-heated home at about ${K.usd(gal * o.last[1])}. The survey also publishes a Maine propane average, ${K.ppg(p.last[1])} this week.` },
    { q: 'How many homes in Maine heat with oil?', a: `The Census Bureau's 2024 American Community Survey counts ${K.num(st.acs.oil)} Maine homes whose main heating fuel is fuel oil or kerosene, ${K.pct(st.acs.oilShare, 1)} of the ${K.num(st.acs.homes)} occupied homes. That is the highest share of any state in the EIA price survey. Utility gas heats ${K.num(st.acs.gas)} homes.` },
    { q: 'How cold is a Maine winter for heating purposes?', a: `NOAA's normals give Maine ${K.num(st.hdd.winter)} heating degree days from November to March and ${K.num(st.hdd.year)} over a whole year, weighted by where people live. That is ${K.pct(st.hdd.winter / K.SC('MA').hdd.winter - 1, 0)} more than Massachusetts over the same months, and it is why Maine homes burn more gallons than the national average.` },
  ],
  related: ['how-long-will-my-oil-last', 'winter-heating-budget', 'liheap-income-limits', 'state:new-hampshire', 'state:vermont', 'state:massachusetts'],
});
