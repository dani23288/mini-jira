import type { ThemePreference } from '../../hooks/use-theme.utils';

export const THEME_TOGGLE_ICON_BY_THEME: Record<ThemePreference, string> = {
  light: '☀',
  dark: '☾',
  system: '◐',
};

export const THEME_TOGGLE_LABEL_BY_THEME: Record<ThemePreference, string> = {
  light: 'Light',
  dark: 'Dark',
  system: 'System',
};
