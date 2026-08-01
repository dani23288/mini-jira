import type { ThemePreference } from '../../use-theme.utils';

export const cycleThemeCases: { name: string; current: ThemePreference; expected: ThemePreference }[] = [
  { name: 'light -> dark', current: 'light', expected: 'dark' },
  { name: 'dark -> system', current: 'dark', expected: 'system' },
  { name: 'system -> light', current: 'system', expected: 'light' },
];

export const getStoredThemeCases: { name: string; stored: string | null; expected: ThemePreference }[] = [
  { name: 'stored "light"', stored: 'light', expected: 'light' },
  { name: 'stored "dark"', stored: 'dark', expected: 'dark' },
  { name: 'stored "system"', stored: 'system', expected: 'system' },
  { name: 'stored an invalid value', stored: 'sepia', expected: 'system' },
  { name: 'nothing stored', stored: null, expected: 'system' },
];
