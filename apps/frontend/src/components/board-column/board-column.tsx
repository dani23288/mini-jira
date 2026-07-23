import { useDroppable } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { TicketCard } from '../ticket-card/ticket-card';
import type { IBoardColumnProps } from './board-column.types';
import styles from './board-column.module.css';

export function BoardColumn({
  status,
  label,
  tickets,
  isDropTarget,
  onEditTicket,
  onDeleteTicket,
  onStatusChange,
}: IBoardColumnProps) {
  const { setNodeRef } = useDroppable({ id: status });
  const listClassName = isDropTarget
    ? `${styles['column-list']} ${styles['column-list-drag-over']}`
    : styles['column-list'];

  return (
    <section className={styles.column} aria-label={label}>
      <div className={styles['column-header']}>
        <h2 className={styles['column-title']}>{label}</h2>
        <span className={styles['column-count']}>{tickets.length}</span>
      </div>
      <SortableContext items={tickets.map((ticket) => ticket.id)} strategy={verticalListSortingStrategy}>
        <div className={listClassName} ref={setNodeRef}>
          {tickets.map((ticket) => (
            <TicketCard
              key={ticket.id}
              ticket={ticket}
              onEdit={() => onEditTicket(ticket)}
              onDelete={() => onDeleteTicket(ticket)}
              onStatusChange={(newStatus) => onStatusChange(ticket, newStatus)}
            />
          ))}
        </div>
      </SortableContext>
    </section>
  );
}
