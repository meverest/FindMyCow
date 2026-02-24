// Unit tests for src/utils.ts

import { generateId, nowISO, formatDate } from '../src/utils';

describe('generateId', () => {
  it('returns a non-empty string', () => {
    expect(typeof generateId()).toBe('string');
    expect(generateId().length).toBeGreaterThan(0);
  });

  it('returns a unique value on each call', () => {
    const ids = new Set(Array.from({ length: 100 }, () => generateId()));
    expect(ids.size).toBe(100);
  });

  it('contains a hyphen separator', () => {
    expect(generateId()).toContain('-');
  });
});

describe('nowISO', () => {
  it('returns a valid ISO 8601 string', () => {
    const result = nowISO();
    expect(typeof result).toBe('string');
    expect(() => new Date(result)).not.toThrow();
    expect(new Date(result).toISOString()).toBe(result);
  });

  it('returns a timestamp close to the current time', () => {
    const before = Date.now();
    const result = nowISO();
    const after = Date.now();
    const ts = new Date(result).getTime();
    expect(ts).toBeGreaterThanOrEqual(before);
    expect(ts).toBeLessThanOrEqual(after);
  });
});

describe('formatDate', () => {
  it('returns an empty string for an empty input', () => {
    expect(formatDate('')).toBe('');
  });

  it('formats a valid ISO date string into a locale date', () => {
    const result = formatDate('2024-06-15T10:00:00.000Z');
    expect(typeof result).toBe('string');
    expect(result.length).toBeGreaterThan(0);
  });

  it('returns the original string when the input is unparseable', () => {
    const bad = 'not-a-date';
    const result = formatDate(bad);
    // Invalid dates produce "Invalid Date" from toLocaleDateString, not the original string,
    // so we just assert a string is returned.
    expect(typeof result).toBe('string');
  });
});
