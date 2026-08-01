import { TicketCardBody } from './ticket-card-body';
import type { ITicketCardOverlayProps } from './ticket-card.types';
import styles from './ticket-card.module.css';

export function TicketCardOverlay({ ticket }: ITicketCardOverlayProps) {
  return (
    // inert also strips focusability from nested buttons, so aria-hidden content can't be Tab-reached mid-drag.
    <div className={`${styles.card} ${styles.overlay}`} aria-hidden="true" inert>
      <TicketCardBody ticket={ticket} />
    </div>
  );
}
