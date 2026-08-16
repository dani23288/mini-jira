import { TICKET_STATUSES } from '@org/consts';
import { DropdownMenu } from '../dropdown-menu/dropdown-menu';
import { PriorityBadge } from '../priority-badge/priority-badge';
import { getStatusLabel } from '../../utils/ticket-labels';
import type { IListTableRowProps } from './list-table.types';
import styles from './list-table.module.css';

export function ListTableRow({ ticket, onEdit, onDelete, onStatusChange }: IListTableRowProps) {
  return (
    <tr className={styles['body-row']}>
      <td className={styles['title-cell']}>{ticket.title}</td>
      <td className={styles.cell}>
        <PriorityBadge priority={ticket.priority} />
      </td>
      <td className={styles.cell}>
        <DropdownMenu
          triggerLabel="Change ticket status"
          triggerClassName={styles['status-trigger']}
          triggerContent={
            <>
              {getStatusLabel(ticket.status)} <span aria-hidden="true">▾</span>
            </>
          }
          items={TICKET_STATUSES.map((option) => ({
            label: option.label,
            onSelect: () => onStatusChange(option.value),
            isActive: option.value === ticket.status,
          }))}
        />
      </td>
      <td className={styles['actions-cell']}>
        <DropdownMenu
          triggerLabel="Ticket actions"
          items={[
            { label: 'Edit', onSelect: onEdit },
            { label: 'Delete', onSelect: onDelete, variant: 'danger' },
          ]}
        />
      </td>
    </tr>
  );
}
