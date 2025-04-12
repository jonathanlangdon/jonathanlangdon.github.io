import { getPerfectInterval, getAdjustedInterval } from './scriptBuff.js';

describe('getPerfectInterval', () => {
  test('returns 1 for input 0', () => {
    expect(getPerfectInterval(0)).toBe(1);
  });

  test('returns 1 for input 1', () => {
    expect(getPerfectInterval(1)).toBe(1);
  });

  test('returns 1 for input 2', () => {
    expect(getPerfectInterval(2)).toBe(1);
  });

  test('returns 2 for input 3', () => {
    expect(getPerfectInterval(3)).toBe(2);
  });

  test('returns 3 for input 4', () => {
    expect(getPerfectInterval(4)).toBe(3);
  });

  test('returns 4 for input 5', () => {
    expect(getPerfectInterval(5)).toBe(4);
  });

  test('returns 13 for input 8', () => {
    expect(getPerfectInterval(8)).toBe(13);
  });

  test('returns 19 for input 9', () => {
    expect(getPerfectInterval(9)).toBe(19);
  });

  test('returns 0 for negative input less than -1', () => {
    expect(getPerfectInterval(-2)).toBe(0);
    expect(getPerfectInterval(-5)).toBe(0);
  });
});

describe('getAdjustedInterval', () => {
  test('returns 129 for (14, 100)', () => {
    expect(getAdjustedInterval(14, 100)).toBe(129);
  });

  test('returns 119 for (14, 90)', () => {
    expect(getAdjustedInterval(14, 90)).toBe(119);
  });

  test('returns 98 for (14, 70)', () => {
    expect(getAdjustedInterval(14, 70)).toBe(98);
  });

  test('returns 88 for (14, 60)', () => {
    expect(getAdjustedInterval(14, 60)).toBe(88);
  });

  test('returns 0 for (14, 50)', () => {
    expect(getAdjustedInterval(14, 50)).toBe(0);
  });
});
