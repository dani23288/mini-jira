import type { TicketStatus } from '@org/types';
import { TICKET_PRIORITIES, TICKET_STATUSES } from '@org/consts';
import { DropdownMenu } from '../dropdown-menu/dropdown-menu';
import { getTapeRotation } from './ticket-card.utils';
import type { ITicketCardProps } from './ticket-card.types';
import styles from './ticket-card.module.css';

export function TicketCard({ ticket, onEdit, onDelete, onStatusChange }: ITicketCardProps) {
  const priorityLabel =
    TICKET_PRIORITIES.find((option) => option.value === ticket.priority)?.label ?? ticket.priority;

  return (
    <div className={styles.card}>
      <div
        className={styles.tape}
        style={{
          backgroundColor: `var(--color-priority-${ticket.priority})`,
          transform: `rotate(${getTapeRotation(ticket.id)})`,
        }}
      />

      <div className={styles.header}>
        <h3 className={styles.title}>{ticket.title}</h3>
        <DropdownMenu
          triggerLabel="Ticket actions"
          items={[
            { label: 'Edit', onSelect: onEdit },
            { label: 'Delete', onSelect: onDelete, variant: 'danger' },
          ]}
        />
      </div>

      {ticket.description && <p className={styles.description}>{ticket.description}</p>}

      <div className={styles.footer}>
        <span className={styles['priority-badge']} data-priority={ticket.priority}>
          {priorityLabel}
        </span>
        <select
          className={styles['status-select']}
          value={ticket.status}
          aria-label="Ticket status"
          onChange={(event) => onStatusChange(event.target.value as TicketStatus)}
        >
          {TICKET_STATUSES.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
}
