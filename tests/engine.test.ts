import { describe, it, expect } from 'vitest';
import { fillGallons, deliveryCost, volumeFromDensity, winterGallons, monthlySplit, daysLeft, lockGain, breakEven, replay, liheapLimit, perMBtu } from '../src/lib/engine/fuel';
import P from '../src/data/params-2026.json';
import L from '../src/data/latest.json';
import STATES from '../src/data/states.json';

describe('tank fill', () => {
  it('500-gallon propane tank from 30 % to 80 % takes 250 gallons', () => {
    expect(fillGallons({ tank: 500, gauge: 0.3, maxFill: 0.8 })).toBeCloseTo(250, 6);
  });
  it('a gauge above the fill level gives zero, never a negative order', () => {
    expect(fillGallons({ tank: 275, gauge: 0.9, maxFill: 0.8 })).toBe(0);
  });
  it('delivery cost adds tax and flat fee', () => {
    const c = deliveryCost({ gallons: 200, price: 4, tax: 0.05, fee: 25 });
    expect(c.fuel).toBe(800); expect(c.tax).toBeCloseTo(40, 6); expect(c.total).toBeCloseTo(865, 6);
  });
  it('OSHA Table H-27: 42 % by weight at SG 0.504-0.510 is 82-83 % by volume, above the 80 % default', () => {
    expect(volumeFromDensity(0.42, 0.51)).toBeCloseTo(0.8235, 3);
    expect(volumeFromDensity(0.42, 0.504)).toBeCloseTo(0.8333, 3);
    expect(P.propaneFill.defaultPct).toBeLessThan(volumeFromDensity(0.42, 0.51));
  });
});

describe('winter', () => {
  it('own gallons override the estimate', () => {
    expect(winterGallons({ galPerHdd: 0.1, hdd: 5000, own: 600 })).toBe(600);
    expect(winterGallons({ galPerHdd: 0.1, hdd: 5000, scenario: 1.1 })).toBeCloseTo(550, 6);
  });
  it('monthly split sums to the season', () => {
    const r = monthlySplit([['11', 600], ['12', 900], ['01', 1000]], 500);
    expect(r.reduce((a, b) => a + b.gallons, 0)).toBeCloseTo(500, 6);
  });
  it('days left: 100 usable gallons at 1 gal/day in a 31-day month with 0.1 gal/HDD', () => {
    const months = [{ m: '01', hdd: 310, days: 31 }];
    const r = daysLeft({ gallons: 120, reserve: 20, galPerHdd: 0.1, months });
    expect(r.days).toBe(100);
  });
});

describe('lock-in', () => {
  it('gain and break-even', () => {
    expect(lockGain({ fixed: 3, market: 3.5, gallons: 600, fee: 50 })).toBeCloseTo(250, 6);
    expect(breakEven({ fixed: 3, gallons: 500, fee: 50 })).toBeCloseTo(3.1, 6);
  });
  it('replay counts winters that ended above October and the median change', () => {
    const r = replay([{ s: 'a', oct: 2, avg: 2.2 }, { s: 'b', oct: 2, avg: 1.8 }, { s: 'c', oct: 2, avg: 2.4 }, { s: 'd', oct: null, avg: 2 }], 3);
    expect(r.n).toBe(3); expect(r.up).toBe(2); expect(r.median).toBeCloseTo(0.1, 6);
    expect(r.rows[0].implied).toBeCloseTo(3.3, 6);
  });
});

describe('LIHEAP (42 U.S.C. 8624(b)(2)(B))', () => {
  it('takes the greater of 150 % FPG and 60 % SMI', () => {
    const base = { fpgBase: 15960, fpgStep: 5680, fpgPct: 1.5, smi4: 100000, smiPct: 0.6, factors: [0.52, 0.68, 0.84, 1, 1.16, 1.32] };
    const a = liheapLimit({ ...base, size: 1, sixty: [10000] });
    expect(a.limit).toBe(Math.round(15960 * 1.5)); expect(a.rule).toBe('poverty');
    const b = liheapLimit({ ...base, size: 1, sixty: [40000] });
    expect(b.limit).toBe(40000); expect(b.rule).toBe('smi');
  });
  it('2026 poverty guideline for 4 people is 33,000', () => {
    expect(P.liheap.fpgBase + 3 * P.liheap.fpgStep).toBe(33000);
  });
});

describe('heat cost', () => {
  it('per million Btu', () => {
    expect(perMBtu({ price: 3.5, btu: 138500, efficiency: 0.87 })).toBeCloseTo((3.5 / (138500 * 0.87)) * 1e6, 6);
    expect(perMBtu({ price: 3, btu: 1, efficiency: 0 })).toBe(0);
  });
});

describe('data coherence', () => {
  const l = L as any;
  it('latest week and release are dates, the U.S. averages exist', () => {
    expect(l.last_week).toMatch(/^\d{4}-\d{2}-\d{2}$/);
    expect(l.ho.US.last[1]).toBeGreaterThan(0.5); expect(l.pr.US.last[1]).toBeGreaterThan(0.5);
  });
  it('every surveyed state has its fuels, and prices are plausible', () => {
    const S = (Array.isArray(STATES) ? STATES : (STATES as any).states) as any[];
    expect(S.length).toBe(38);
    for (const s of S) {
      if (s.ho) { expect(l.ho[s.code], s.code).toBeTruthy(); expect(l.ho[s.code].last[1]).toBeGreaterThan(1); expect(l.ho[s.code].last[1]).toBeLessThan(15); }
      expect(l.pr[s.code], s.code).toBeTruthy(); expect(l.pr[s.code].last[1]).toBeGreaterThan(0.5); expect(l.pr[s.code].last[1]).toBeLessThan(10);
    }
  });
});
