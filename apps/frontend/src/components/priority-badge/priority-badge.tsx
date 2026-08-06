import { getPriorityKey, getPriorityLabel } from '../../utils/ticket-labels';
import type { IPriorityBadgeProps } from './priority-badge.types';
import styles from './priority-badge.module.css';

export function PriorityBadge({ priority }: IPriorityBadgeProps) {
  return (
    <span className={styles['priority-badge']} data-priority={getPriorityKey(priority)}>
      {getPriorityLabel(priority)}
    </span>
  );
}
