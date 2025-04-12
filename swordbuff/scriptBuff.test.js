import { getPerfectInterval } from './scriptBuff.js';

describe('getInterval', () => {
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
