import { useState } from 'react';
import type { ReactNode } from 'react';
import type { ITicket, TicketStatus } from '@org/types';
import { useTickets } from '../../hooks/use-tickets';
import { useConfirm } from '../../hooks/use-confirm';
import { useUrlState } from '../../hooks/use-url-state';
import { Button } from '../../components/button/button';
import { ThemeToggle } from '../../components/theme-toggle/theme-toggle';
import { TicketModal } from '../../components/ticket-modal/ticket-modal';
import { BoardView } from '../board/board-view';
import { ListView } from '../list/list-view';
import {
  DELETE_TICKET_CONFIRM_LABEL,
  DELETE_TICKET_CONFIRM_TITLE,
  DELETE_TICKET_CONFIRM_VARIANT,
  getDeleteTicketConfirmBody,
} from './tickets-page.consts';
import styles from './tickets-page.module.css';

type TicketsView = 'board' | 'list';
const VIEW_MODES: TicketsView[] = ['board', 'list'];

export function TicketsPage() {
  const { tickets, createTicket, updateTicket, updateStatus, moveTicket, deleteTicket } = useTickets();
  const confirm = useConfirm();
  const [editingTicket, setEditingTicket] = useState<ITicket | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [urlParams, setUrlParams] = useUrlState();

  const view = (urlParams.get('view') ?? 'board') as TicketsView;
  const setView = (nextView: TicketsView) => {
    setUrlParams((prev) => {
      const next = new URLSearchParams(prev);
      if (nextView === 'board') {
        next.delete('view');
      } else {
        next.set('view', nextView);
      }
      return next;
    });
  };

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

  const viewConfigByMode: Record<TicketsView, { label: string; element: ReactNode }> = {
    board: {
      label: 'Board',
      element: (
        <BoardView
          tickets={tickets}
          onEditTicket={setEditingTicket}
          onDeleteTicket={handleDeleteTicket}
          onStatusChange={handleStatusChange}
          moveTicket={moveTicket}
        />
      ),
    },
    list: {
      label: 'List',
      element: (
        <ListView
          tickets={tickets}
          onEditTicket={setEditingTicket}
          onDeleteTicket={handleDeleteTicket}
          onStatusChange={handleStatusChange}
        />
      ),
    },
  };

  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <h1 className={styles.title}>Ticket Desk</h1>
        <div className={styles['header-actions']}>
          <div className={styles['view-toggle']} role="group" aria-label="Board or list view">
            {VIEW_MODES.map((mode) => (
              <Button
                key={mode}
                type="button"
                variant={view === mode ? 'primary' : 'secondary'}
                aria-pressed={view === mode}
                onClick={() => setView(mode)}
              >
                {viewConfigByMode[mode].label}
              </Button>
            ))}
          </div>
          <ThemeToggle />
          <Button onClick={() => setIsCreating(true)}>+ New ticket</Button>
        </div>
      </header>

      {(viewConfigByMode[view] ?? viewConfigByMode.board).element}

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
