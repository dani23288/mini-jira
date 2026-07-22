import { useState } from 'react';
import type { ITicket } from '@org/types';
import { TICKET_STATUSES } from '@org/consts';
import { useTickets } from '../../hooks/use-tickets';
import { Button } from '../../components/button/button';
import { SearchBar } from '../../components/search-bar/search-bar';
import { TicketCard } from '../../components/ticket-card/ticket-card';
import { TicketModal } from '../../components/ticket-modal/ticket-modal';
import { filterTicketsByQuery, getTicketsByStatus } from './board.utils';
import styles from './board.module.css';

export function Board() {
  const { tickets, createTicket, updateTicket, updateStatus, deleteTicket } = useTickets();
  const [editingTicket, setEditingTicket] = useState<ITicket | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const isModalOpen = !!(isCreating || editingTicket);

  const closeModal = () => {
    setIsCreating(false);
    setEditingTicket(null);
  };

  const visibleTickets = filterTicketsByQuery(tickets, searchQuery);

  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <h1 className={styles.title}>Ticket Desk</h1>
        <div className={styles['header-actions']}>
          <SearchBar value={searchQuery} onChange={setSearchQuery} placeholder="Search tickets…" />
          <Button onClick={() => setIsCreating(true)}>+ New ticket</Button>
        </div>
      </header>

      <div className={styles.columns}>
        {TICKET_STATUSES.map((status) => {
          const columnTickets = getTicketsByStatus(visibleTickets, status.value);
          return (
            <section key={status.value} className={styles.column} aria-label={status.label}>
              <div className={styles['column-header']}>
                <h2 className={styles['column-title']}>{status.label}</h2>
                <span className={styles['column-count']}>{columnTickets.length}</span>
              </div>
              <div className={styles['column-list']}>
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
