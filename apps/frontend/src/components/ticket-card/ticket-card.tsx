import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { TICKET_PRIORITIES, TICKET_STATUSES } from '@org/consts';
import { DropdownMenu } from '../dropdown-menu/dropdown-menu';
import { getTapeRotation } from './ticket-card.utils';
import type { ITicketCardOverlayProps, ITicketCardProps } from './ticket-card.types';
import styles from './ticket-card.module.css';

function TicketCardBody({ ticket, onEdit, onDelete, onStatusChange }: ITicketCardProps) {
  const priorityLabel =
    TICKET_PRIORITIES.find((option) => option.value === ticket.priority)?.label ?? ticket.priority;
  const statusLabel =
    TICKET_STATUSES.find((option) => option.value === ticket.status)?.label ?? ticket.status;

  return (
    <>
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
            onSelect: () => onStatusChange(option.value),
            isActive: option.value === ticket.status,
          }))}
        />
      </div>
    </>
  );
}

export function TicketCard(props: ITicketCardProps) {
  const { ticket } = props;
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: ticket.id,
  });
  const cardClassName = isDragging ? `${styles.card} ${styles.dragging}` : styles.card;

  return (
    <div
      ref={setNodeRef}
      style={{ transform: CSS.Transform.toString(transform), transition }}
      className={cardClassName}
      {...attributes}
      {...listeners}
    >
      <TicketCardBody {...props} />
    </div>
  );
}

export function TicketCardOverlay({ ticket }: ITicketCardOverlayProps) {
  return (
    <div className={`${styles.card} ${styles.overlay}`} aria-hidden="true">
      <TicketCardBody ticket={ticket} onEdit={() => {}} onDelete={() => {}} onStatusChange={() => {}} />
    </div>
  );
}
