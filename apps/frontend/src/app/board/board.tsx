import { useState } from 'react';
import type { ITicket } from '@org/types';
import { TICKET_STATUSES } from '@org/consts';
import { useTickets } from '../../hooks/use-tickets';
import { TicketCard } from '../../components/ticket-card/ticket-card';
import { TicketModal } from '../../components/ticket-modal/ticket-modal';
import styles from './board.module.css';

export function Board() {
  const { tickets, createTicket, updateTicket, updateStatus, deleteTicket } = useTickets();
  const [editingTicket, setEditingTicket] = useState<ITicket | null>(null);
  const [isCreating, setIsCreating] = useState(false);

  const isModalOpen = isCreating || editingTicket !== null;

  const closeModal = () => {
    setIsCreating(false);
    setEditingTicket(null);
  };

  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <h1 className={styles.title}>Ticket Desk</h1>
        <button type="button" className={styles.newTicketButton} onClick={() => setIsCreating(true)}>
          + New ticket
        </button>
      </header>

      <div className={styles.columns}>
        {TICKET_STATUSES.map((status) => {
          const columnTickets = tickets.filter((ticket) => ticket.status === status.value);
          return (
            <section key={status.value} className={styles.column} aria-label={status.label}>
              <div className={styles.columnHeader}>
                <h2 className={styles.columnTitle}>{status.label}</h2>
                <span className={styles.columnCount}>{columnTickets.length}</span>
              </div>
              <div className={styles.columnList}>
                {columnTickets.map((ticket) => (
                  <TicketCard
                    key={ticket.id}
                    ticket={ticket}
                    onEdit={() => setEditingTicket(ticket)}
                    onDelete={() => deleteTicket(ticket.id)}
                    onStatusChange={(newStatus) => updateStatus(ticket.id, newStatus)}
                  />
                ))}
              </div>
            </section>
          );
        })}
      </div>

      {isModalOpen && (
        <TicketModal
          mode={editingTicket ? 'edit' : 'create'}
          initialTicket={editingTicket ?? undefined}
          onClose={closeModal}
          onSubmit={(values) => {
            if (editingTicket) {
              updateTicket(editingTicket.id, values);
            } else {
              createTicket(values);
            }
            closeModal();
          }}
        />
      )}
    </div>
  );
}
