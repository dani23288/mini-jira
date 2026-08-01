import { useEffect, useState } from 'react';
import {
  applyThemeAttribute,
  cycleTheme as cycleThemeValue,
  getStoredTheme,
  storeTheme,
  type ThemePreference,
} from './use-theme.utils';

function resolveSystemTheme(): 'light' | 'dark' {
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
}

export function useTheme(): { theme: ThemePreference; cycleTheme: () => void } {
  const [theme, setTheme] = useState<ThemePreference>(getStoredTheme);

  useEffect(() => {
    storeTheme(theme);
    const resolved = theme === 'system' ? resolveSystemTheme() : theme;
    applyThemeAttribute(resolved);
  }, [theme]);

  useEffect(() => {
    if (theme !== 'system') {
      return;
    }
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handleChange = () => applyThemeAttribute(resolveSystemTheme());
    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, [theme]);

  return {
    theme,
    cycleTheme: () => setTheme((prev) => cycleThemeValue(prev)),
  };
}
