import { useEffect, useState } from 'react';
import {
  applyThemeAttribute,
  cycleTheme as cycleThemeValue,
  getStoredTheme,
  storeTheme,
  type ThemePreference,
} from './use-theme.utils';

export function useTheme(): { theme: ThemePreference; cycleTheme: () => void } {
  const [theme, setTheme] = useState<ThemePreference>(getStoredTheme);

  useEffect(() => {
    storeTheme(theme);
    applyThemeAttribute(theme);
  }, [theme]);

  return {
    theme,
    cycleTheme: () => setTheme((prev) => cycleThemeValue(prev)),
  };
}
