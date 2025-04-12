import { getInterval } from './scriptBuff.js';

describe('getInterval', () => {
  test('returns 1 for input 0', () => {
    expect(getInterval(0)).toBe(1);
  });

  test('returns 1 for input 1', () => {
    expect(getInterval(1)).toBe(1);
  });

  test('returns 1 for input 2', () => {
    expect(getInterval(2)).toBe(1);
  });

  test('returns 2 for input 3', () => {
    expect(getInterval(3)).toBe(2);
  });

  test('returns 3 for input 4', () => {
    expect(getInterval(4)).toBe(3);
  });

  test('returns 4 for input 5', () => {
    expect(getInterval(5)).toBe(4);
  });

  test('returns 13 for input 8', () => {
    expect(getInterval(8)).toBe(13);
  });

  test('returns 19 for input 9', () => {
    expect(getInterval(9)).toBe(19);
  });

  test('returns 0 for negative input less than -1', () => {
    expect(getInterval(-2)).toBe(0);
    expect(getInterval(-5)).toBe(0);
  });
});
