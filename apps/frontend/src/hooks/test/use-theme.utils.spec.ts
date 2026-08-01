import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { afterEach, describe, expect, it } from 'vitest';
import { cycleTheme, getStoredTheme, STORAGE_KEY } from '../use-theme.utils';
import { cycleThemeCases, getStoredThemeCases } from './stubs/use-theme.utils.cases';

describe('cycleTheme', () => {
  it.each(cycleThemeCases)('$name', ({ current, expected }) => {
    expect(cycleTheme(current)).toBe(expected);
  });
});

describe('getStoredTheme', () => {
  afterEach(() => {
    localStorage.removeItem(STORAGE_KEY);
  });

  it.each(getStoredThemeCases)('$name', ({ stored, expected }) => {
    if (stored === null) {
      localStorage.removeItem(STORAGE_KEY);
    } else {
      localStorage.setItem(STORAGE_KEY, stored);
    }
    expect(getStoredTheme()).toBe(expected);
  });
});

it('keeps the inline FOUC-blocker script in index.html synced with STORAGE_KEY', () => {
  const html = readFileSync(resolve(__dirname, '../../../index.html'), 'utf8');
  expect(html).toContain(STORAGE_KEY);
});
