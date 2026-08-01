export type ThemePreference = 'light' | 'dark' | 'system';

const STORAGE_KEY = 'ticket-desk-theme';
const THEME_CYCLE: Record<ThemePreference, ThemePreference> = {
  light: 'dark',
  dark: 'system',
  system: 'light',
};

export function getStoredTheme(): ThemePreference {
  const stored = localStorage.getItem(STORAGE_KEY);
  return stored === 'light' || stored === 'dark' || stored === 'system' ? stored : 'system';
}

export function storeTheme(theme: ThemePreference): void {
  localStorage.setItem(STORAGE_KEY, theme);
}

export function applyThemeAttribute(theme: ThemePreference): void {
  if (theme === 'system') {
    document.documentElement.removeAttribute('data-theme');
  } else {
    document.documentElement.setAttribute('data-theme', theme);
  }
}

export function cycleTheme(current: ThemePreference): ThemePreference {
  return THEME_CYCLE[current];
}
