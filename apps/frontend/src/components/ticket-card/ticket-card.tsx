import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { TicketCardBody } from './ticket-card-body';
import type { ITicketCardProps } from './ticket-card.types';
import styles from './ticket-card.module.css';

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
