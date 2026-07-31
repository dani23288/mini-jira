import { useTheme } from '../../hooks/use-theme';
import { cycleTheme } from '../../hooks/use-theme.utils';
import { THEME_TOGGLE_ICON_BY_THEME, THEME_TOGGLE_LABEL_BY_THEME } from './theme-toggle.consts';
import styles from './theme-toggle.module.css';

export function ThemeToggle() {
  const { theme, cycleTheme: goToNextTheme } = useTheme();
  const nextTheme = cycleTheme(theme);

  return (
    <button
      type="button"
      className={styles.toggle}
      aria-label={`Theme: ${THEME_TOGGLE_LABEL_BY_THEME[theme]}. Click to switch to ${THEME_TOGGLE_LABEL_BY_THEME[nextTheme]}.`}
      onClick={goToNextTheme}
    >
      {THEME_TOGGLE_ICON_BY_THEME[theme]}
    </button>
  );
}
