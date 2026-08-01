import { TICKET_STATUSES } from '@org/consts';
import { getPriorityColorVar } from '../../utils/priority-color';
import { findAssignee, getPriorityLabel, getStatusLabel } from '../../utils/ticket-labels';
import { Avatar } from '../avatar/avatar';
import { DropdownMenu } from '../dropdown-menu/dropdown-menu';
import { getTapeRotation } from './ticket-card.utils';
import type { ITicketCardProps } from './ticket-card.types';
import styles from './ticket-card.module.css';

export function TicketCardBody({ ticket, onEdit, onDelete, onStatusChange }: ITicketCardProps) {
  const priorityLabel = getPriorityLabel(ticket.priority);
  const statusLabel = getStatusLabel(ticket.status);
  const assignee = findAssignee(ticket.assigneeId);

  return (
    <>
      <div
        className={styles.tape}
        style={{
          backgroundColor: getPriorityColorVar(ticket.priority),
          transform: `rotate(${getTapeRotation(ticket.id)})`,
        }}
      />

      <div className={styles.header}>
        <h3 className={styles.title}>{ticket.title}</h3>
        <div className={styles['header-actions']}>
          {assignee && <Avatar initials={assignee.initials} label={`Assigned to ⁨${assignee.name}⁩`} />}
          <DropdownMenu
            triggerLabel="Ticket actions"
            items={[
              { label: 'Edit', onSelect: () => onEdit?.() },
              { label: 'Delete', onSelect: () => onDelete?.(), variant: 'danger' },
            ]}
          />
        </div>
      </div>

      {ticket.description && <p className={styles.description}>{ticket.description}</p>}

      <div className={styles.footer}>
        <span className={styles['priority-badge']} data-priority={ticket.priority}>
          {priorityLabel}
        </span>
        <DropdownMenu
          triggerLabel="Change ticket status"
          triggerClassName={styles['status-trigger']}
          triggerContent={
            <>
              {statusLabel} <span aria-hidden="true">▾</span>
            </>
          }
          items={TICKET_STATUSES.map((option) => ({
            label: option.label,
            onSelect: () => onStatusChange?.(option.value),
            isActive: option.value === ticket.status,
          }))}
        />
      </div>
    </>
  );
}
