import { afterEach, describe, expect, it } from 'vitest';
import { cycleTheme, getStoredTheme } from '../use-theme.utils';
import { cycleThemeCases, getStoredThemeCases } from './stubs/use-theme.utils.cases';

const STORAGE_KEY = 'ticket-desk-theme';

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
