import { TICKET_STATUSES } from '@org/consts';
import { getFilterChipClassName } from '../../utils/filter-chip-class-name';
import type { IStatusFilterProps } from './status-filter.types';
import styles from './status-filter.module.css';

const chipClasses = { chip: styles.chip, selected: styles['chip-selected'], muted: styles['chip-muted'] };

export function StatusFilter({ selected, onToggle }: IStatusFilterProps) {
  const hasActiveFilter = selected.length > 0;

  return (
    <div className={styles.group} role="group" aria-label="Filter by status">
      {TICKET_STATUSES.map((option) => {
        const isSelected = selected.includes(option.value);

        return (
          <button
            key={option.value}
            type="button"
            className={getFilterChipClassName(chipClasses, isSelected, hasActiveFilter)}
            aria-pressed={isSelected}
            onClick={() => onToggle(option.value)}
          >
            {option.label}
          </button>
        );
      })}
    </div>
  );
}
