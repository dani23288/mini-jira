import { useState } from 'react';
import type { ITicket, TicketStatus } from '@org/types';
import { useTickets } from '../../hooks/use-tickets';
import { useConfirm } from '../../hooks/use-confirm';
import { Button } from '../../components/button/button';
import { ThemeToggle } from '../../components/theme-toggle/theme-toggle';
import { TicketModal } from '../../components/ticket-modal/ticket-modal';
import { BoardView } from '../board/board-view';
import {
  DELETE_TICKET_CONFIRM_LABEL,
  DELETE_TICKET_CONFIRM_TITLE,
  DELETE_TICKET_CONFIRM_VARIANT,
  getDeleteTicketConfirmBody,
} from './tickets-page.consts';
import styles from './tickets-page.module.css';

export function TicketsPage() {
  const { tickets, createTicket, updateTicket, updateStatus, moveTicket, deleteTicket } = useTickets();
  const confirm = useConfirm();
  const [editingTicket, setEditingTicket] = useState<ITicket | null>(null);
  const [isCreating, setIsCreating] = useState(false);

  const isModalOpen = !!(isCreating || editingTicket);

  const closeModal = () => {
    setIsCreating(false);
    setEditingTicket(null);
  };

  const handleStatusChange = (ticket: ITicket, status: TicketStatus) => updateStatus(ticket.id, status);

  const handleDeleteTicket = async (ticket: ITicket) => {
    const confirmed = await confirm({
      title: DELETE_TICKET_CONFIRM_TITLE,
      body: getDeleteTicketConfirmBody(ticket.title),
      confirmLabel: DELETE_TICKET_CONFIRM_LABEL,
      confirmVariant: DELETE_TICKET_CONFIRM_VARIANT,
    });
    if (confirmed) {
      deleteTicket(ticket.id);
    }
  };

  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <h1 className={styles.title}>Ticket Desk</h1>
        <div className={styles['header-actions']}>
          <ThemeToggle />
          <Button onClick={() => setIsCreating(true)}>+ New ticket</Button>
        </div>
      </header>

      <BoardView
        tickets={tickets}
        onEditTicket={setEditingTicket}
        onDeleteTicket={handleDeleteTicket}
        onStatusChange={handleStatusChange}
        moveTicket={moveTicket}
      />

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
