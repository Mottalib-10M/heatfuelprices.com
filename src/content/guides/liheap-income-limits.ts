import { defineGuide } from '../../lib/page-types';
import { KIT as K } from '../../lib/kit';
import OTHER from '../../data/liheap-other-states.json';

const L = K.P.liheap;
const fpg = (n: number) => L.fpgBase + L.fpgStep * (n - 1);
const all = [...K.STATES.map((s) => ({ name: s.name, code: s.code, smi: s.smi })), ...(OTHER as Array<{ name: string; code: string; smi: { smi4: number; sixty: number[] } }>)].sort((a, b) => a.name.localeCompare(b.name));
const lim = (x: { smi: { smi4: number; sixty: number[] } }, n: number) => K.liheapLimit({ size: n, fpgBase: L.fpgBase, fpgStep: L.fpgStep, fpgPct: L.fpgPct, sixty: x.smi.sixty, smi4: x.smi.smi4, smiPct: L.smiPct, factors: L.sizeFactors });
const byPov = all.filter((x) => lim(x, 4).rule === 'poverty');
const hi4 = all.reduce((a, b) => (lim(b, 4).limit > lim(a, 4).limit ? b : a));
const lo4 = all.reduce((a, b) => (lim(b, 4).limit < lim(a, 4).limit ? b : a));

export default defineGuide({
  id: 'liheap-income-limits', group: 'buying', order: 21, slug: 'liheap-income-limits',
  nav: 'LIHEAP income limits', card: 'The federal income ceiling for heating help, for each state and household size.',
  title: 'LIHEAP Income Limits by State and Household Size, 2026-27',
  description: `LIHEAP income limits for 2026-27: the federal ceiling for heating help in each state, the greater of 150 % of poverty and 60 % of state median income.`,
  h1: 'LIHEAP income limits: the federal ceiling in your state',
  intro: `For a household of four, the federal ceiling runs from ${K.usd(lim(lo4, 4).limit)} a year in ${lo4.name} to ${K.usd(lim(hi4, 4).limit)} in ${hi4.name} for fiscal year 2027.`,
  resume: `The Low Income Home Energy Assistance Program helps households pay heating bills, including heating oil and propane deliveries. Federal law sets the highest income a state may use: the greater of 150 % of the HHS poverty guideline and 60 % of the state's median income (42 U.S.C. 8624). For 2026 the poverty guideline is ${K.usd(L.fpgBase)} for one person plus ${K.usd(L.fpgStep)} for each additional person in the 48 contiguous states and DC, so 150 % of it is ${K.usd(fpg(4) * L.fpgPct)} for a household of four. Sixty percent of state median income, from the federal table for fiscal year 2027, is higher in every state but ${byPov.length === 0 ? 'none' : byPov.map((x) => x.name).join(', ')}, so it usually sets the ceiling. States can choose a lower limit, but not below 110 % of the poverty guideline. The calculator gives the federal ceiling for your state and household size and, if you type your income, the gap to it. Apply through your state's LIHEAP office: it decides.`,
  body: (h) => `
<h2>The rule in two lines</h2>
<p>Under ${h.src('usc_8624', '42 U.S.C. 8624(b)(2)(B)')}, a state may serve households whose income does not exceed the greater of 150 % of the poverty level and 60 % of the state median income. It may not refuse a household on income alone if the income is under 110 % of the poverty level. Households receiving TANF, SSI, SNAP or certain veterans' benefits can also be eligible by that fact, if the state chooses.</p>
<p>The two lines come from two federal tables. The poverty guidelines are published each year by HHS (${h.src('aspe_fpg', 'HHS poverty guidelines')}). The state median incomes for LIHEAP are published by the Administration for Children and Families for each fiscal year, already multiplied by 60 % and adjusted for household size (${h.src('acf_smi', 'ACF table for FY2027')}), using the factors of ${h.src('cfr_96_85', '45 CFR 96.85')}: ${L.sizeFactors.map((f, i) => `${K.pct(f, 0)} for ${i + 1}`).join(', ')} people, relative to a family of four.</p>
<h2>Ceiling by state, households of 1 to 6</h2>
${h.table(['State', '1 person', '2', '3', '4', '5', '6'], all.map((x) => [x.name, ...[1, 2, 3, 4, 5, 6].map((n) => K.usd(lim(x, n).limit))]), `Federal ceiling, fiscal year 2027 (October 1, 2026 to September 30, 2027): the greater of 150 % of the 2026 HHS poverty guideline and 60 % of state median income (ACF, IM 2026-01, Attachment 4). Yearly income. States may set lower limits.`, ['l', 'r', 'r', 'r', 'r', 'r', 'r'])}
${h.mini('liheap', { t: 'Your household against the federal ceiling', p: ['st', 'size'], d: { st: 'ME', size: 2 }, c: 'Open the full calculator' })}
<h2>What the ceiling is not</h2>
<p>It is not a promise of help. LIHEAP is funded by a yearly federal grant to each state, and each state writes its own plan within the federal rules: it can set a lower income limit, and the statute lets it give priority to the households with the highest home energy costs or needs in relation to income. The amount of a benefit follows the state's own formula. Heating oil and propane households are covered like households on any other fuel.</p>
<p>The state also defines which income counts and over what period. The calculator compares the yearly figure you type with the yearly federal ceiling; your state's application says how to compute yours.</p>
<h2>Where to apply</h2>
<p>Apply through the LIHEAP office of your state or the local agency it designates. Expect to show proof of income for the household, a recent heating bill or delivery ticket and identification. If you heat with oil or propane and the tank is low, say so when you apply, so the agency can tell you how fast it can act.</p>
<h2>And the heating bill itself</h2>
<p>Knowing what your winter will cost helps when you apply. The ${h.a('winter-heating-budget', 'winter budget')} gives the gallons and dollars for your state at this week's price, and the ${h.a('heating-oil-tank-fill-cost', 'tank fill calculator')} the cost of the next delivery.</p>
`,
  faqs: [
    { q: 'What is the LIHEAP income limit for a family of four?', a: `It depends on the state. For fiscal year 2027 the federal ceiling for four people ranges from ${K.usd(lim(lo4, 4).limit)} in ${lo4.name} to ${K.usd(lim(hi4, 4).limit)} in ${hi4.name}: the greater of 150 % of the 2026 poverty guideline (${K.usd(fpg(4) * L.fpgPct)}) and 60 % of the state's median income. Your state may use a lower limit; its LIHEAP office confirms it.` },
    { q: 'Can I get LIHEAP help with heating oil or propane?', a: 'Yes. LIHEAP is for home energy, which covers delivered fuels such as heating oil and propane as well as gas and electricity. For delivered fuels the payment often goes to the dealer as a credit on your account. Ask your state\'s office how it works with fuel dealers and what to do if your tank is nearly empty.' },
    { q: 'Which income counts for the LIHEAP limit?', a: 'Each state defines it in its own plan: which members of the household count, which kinds of income are included or excluded, and over what period the income is measured before being turned into a yearly figure. The federal ceiling on this page is a yearly amount. Use the state\'s application to compute your figure, then compare.' },
  ],
  tool: 'liheap', toolArg: { st: 'PA', size: 3 },
  related: ['winter-heating-budget', 'heating-oil-tank-fill-cost', 'heating-oil-prices', 'propane-prices', 'state:pennsylvania'],
  sources: ['usc_8624', 'cfr_96_85', 'acf_smi', 'aspe_fpg'],
});
