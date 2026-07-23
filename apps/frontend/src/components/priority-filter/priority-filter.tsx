import { TICKET_PRIORITIES } from '@org/consts';
import { getFilterChipClassName } from '../../utils/filter-chip-class-name';
import type { IPriorityFilterProps } from './priority-filter.types';
import styles from './priority-filter.module.css';

const chipClasses = { chip: styles.chip, selected: styles['chip-selected'], muted: styles['chip-muted'] };

export function PriorityFilter({ selected, onToggle }: IPriorityFilterProps) {
  const hasActiveFilter = selected.length > 0;

  return (
    <div className={styles.group} role="group" aria-label="Filter by priority">
      {TICKET_PRIORITIES.map((option) => {
        const isSelected = selected.includes(option.value);

        return (
          <button
            key={option.value}
            type="button"
            className={getFilterChipClassName(chipClasses, isSelected, hasActiveFilter)}
            style={{ backgroundColor: `var(--color-priority-${option.value})` }}
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
