import { useEffect, useRef, useState } from 'react';
import type { ITicket, TicketStatus } from '@org/types';
import { TICKET_PRIORITIES, TICKET_STATUSES } from '@org/consts';
import styles from './ticket-card.module.css';

interface ITicketCardProps {
  ticket: ITicket;
  onEdit: () => void;
  onDelete: () => void;
  onStatusChange: (status: TicketStatus) => void;
}

export function TicketCard({ ticket, onEdit, onDelete, onStatusChange }: ITicketCardProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isMenuOpen) {
      return;
    }
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isMenuOpen]);

  const priorityLabel =
    TICKET_PRIORITIES.find((option) => option.value === ticket.priority)?.label ?? ticket.priority;

  const tapeRotation = ticket.id.charCodeAt(0) % 2 === 0 ? '-1.5deg' : '1.5deg';

  return (
    <div className={styles.card}>
      <div
        className={styles.tape}
        style={{
          backgroundColor: `var(--color-priority-${ticket.priority})`,
          transform: `rotate(${tapeRotation})`,
        }}
      />

      <div className={styles.header}>
        <h3 className={styles.title}>{ticket.title}</h3>
        <div className={styles.menuWrapper} ref={menuRef}>
          <button
            type="button"
            className={styles.menuButton}
            aria-label="Ticket actions"
            aria-haspopup="true"
            aria-expanded={isMenuOpen}
            onClick={() => setIsMenuOpen((open) => !open)}
          >
            ⋯
          </button>
          {isMenuOpen && (
            <div className={styles.menu} role="menu">
              <button
                type="button"
                className={styles.menuItem}
                role="menuitem"
                onClick={() => {
                  setIsMenuOpen(false);
                  onEdit();
                }}
              >
                Edit
              </button>
              <button
                type="button"
                className={styles.menuItemDanger}
                role="menuitem"
                onClick={() => {
                  setIsMenuOpen(false);
                  onDelete();
                }}
              >
                Delete
              </button>
            </div>
          )}
        </div>
      </div>

      {ticket.description && <p className={styles.description}>{ticket.description}</p>}

      <div className={styles.footer}>
        <span className={styles.priorityBadge} data-priority={ticket.priority}>
          {priorityLabel}
        </span>
        <select
          className={styles.statusSelect}
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
