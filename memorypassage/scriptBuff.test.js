import { jest } from '@jest/globals';
import {
  getPerfectInterval,
  getAdjustedInterval,
  getResultText
} from './scriptBuff.js';

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

  test('returns 180 for intervals over 180', () => {
    expect(getPerfectInterval(15)).toBe(180);
    expect(getPerfectInterval(16)).toBe(180);
  }); // max 180 days between practice

  test('returns 0 for negative input less than -1', () => {
    expect(getPerfectInterval(-1)).toBe(0);
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

describe('getResultText', () => {
  const originalLocation = window.location;
  let getItemSpy;

  beforeAll(() => {
    jest.useFakeTimers('modern');
  });

  afterAll(() => {
    jest.useRealTimers();
  });

  beforeEach(() => {
    // freeze time at midnight May 1, 2025 local
    jest.setSystemTime(new Date(2025, 4, 1));

    // mock URLSearchParams
    delete window.location;
    window.location = { search: '?verse=testVerseKey' };

    // mock toLocalISODateString (if you still want it)
    global.toLocalISODateString = date =>
      new Date(date.getFullYear(), date.getMonth(), date.getDate())
        .toISOString()
        .split('T')[0];

    // spy on localStorage
    getItemSpy = jest.spyOn(Storage.prototype, 'getItem');
  });

  afterEach(() => {
    // restore
    window.location = originalLocation;
    getItemSpy.mockRestore();
    delete global.toLocalISODateString;
  });

  test('returns "again today" if dueDate matches today and ≥ 60%', () => {
    global.verseIndex = 0;
    getItemSpy.mockReturnValueOnce(
      JSON.stringify({ 0: { repetitions: 5, dueDate: '2025-05-01' } })
    );

    const result = getResultText(75);
    expect(result).toContain('75% and a memory strength of 5');
    expect(result).toContain('Lets practice again today');
  });

  test('returns "again tomorrow" if dueDate is tomorrow and ≥ 60%', () => {
    global.verseIndex = 0;
    getItemSpy.mockReturnValueOnce(
      JSON.stringify({ 0: { repetitions: 2, dueDate: '2025-05-02' } })
    );

    const result = getResultText(90);
    expect(result).toContain('Lets practice again tomorrow');
  });

  test('falls back to today if no data', () => {
    global.verseIndex = 0;
    getItemSpy.mockReturnValueOnce('{}');

    const result = getResultText(100);
    expect(result).toContain('100% and a memory strength of 0');
    expect(result).toContain('Lets practice again today');
  });
});
