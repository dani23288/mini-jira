import type { ISearchBarProps } from './search-bar.types';
import styles from './search-bar.module.css';

export function SearchBar({ value, onChange, placeholder }: ISearchBarProps) {
  return (
    <input
      type="search"
      className={styles['search-input']}
      placeholder={placeholder}
      aria-label={placeholder ?? 'Search'}
      value={value}
      onChange={(event) => onChange(event.target.value)}
    />
  );
}
