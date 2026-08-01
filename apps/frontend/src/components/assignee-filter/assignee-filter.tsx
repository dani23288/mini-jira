import { UNASSIGNED_ASSIGNEE_ID } from '@org/consts';
import { getFilterChipClassName } from '../../utils/filter-chip-class-name';
import { Avatar } from '../avatar/avatar';
import type { IAssigneeFilterProps } from './assignee-filter.types';
import styles from './assignee-filter.module.css';

const chipClasses = { chip: styles.chip, selected: styles['chip-selected'], muted: styles['chip-muted'] };
const UNASSIGNED_CHIP = { id: UNASSIGNED_ASSIGNEE_ID, name: 'Unassigned', initials: '?' };

export function AssigneeFilter({ assignees, selected, onToggle }: IAssigneeFilterProps) {
  const hasActiveFilter = selected.length > 0;

  return (
    <div className={styles.group} role="group" aria-label="Filter by assignee">
      {[...assignees, UNASSIGNED_CHIP].map((assignee) => {
        const isSelected = selected.includes(assignee.id);
        const isUnassigned = assignee.id === UNASSIGNED_ASSIGNEE_ID;
        return (
          <button
            key={assignee.id}
            type="button"
            className={getFilterChipClassName(chipClasses, isSelected, hasActiveFilter)}
            aria-pressed={isSelected}
            aria-label={assignee.name}
            onClick={() => onToggle(assignee.id)}
          >
            <Avatar
              initials={assignee.initials}
              label={assignee.name}
              className={isUnassigned ? styles.unassigned : undefined}
            />
          </button>
        );
      })}
    </div>
  );
}
