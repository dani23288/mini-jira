import { useState } from 'react';
import { DndContext, DragOverlay } from '@dnd-kit/core';
import type { ITicket, TicketPriority } from '@org/types';
import { ASSIGNEES, TICKET_STATUSES } from '@org/consts';
import { useTickets } from '../../hooks/use-tickets';
import { useConfirm } from '../../hooks/use-confirm';
import { Button } from '../../components/button/button';
import { ThemeToggle } from '../../components/theme-toggle/theme-toggle';
import { SearchBar } from '../../components/search-bar/search-bar';
import { PriorityFilter } from '../../components/priority-filter/priority-filter';
import { AssigneeFilter } from '../../components/assignee-filter/assignee-filter';
import { BoardColumn } from '../../components/board-column/board-column';
import { TicketCardOverlay } from '../../components/ticket-card/ticket-card-overlay';
import { TicketModal } from '../../components/ticket-modal/ticket-modal';
import {
  DELETE_TICKET_CONFIRM_LABEL,
  DELETE_TICKET_CONFIRM_TITLE,
  DELETE_TICKET_CONFIRM_VARIANT,
  getDeleteTicketConfirmBody,
} from './board.consts';
import { filterTickets, getTicketsByStatus, toggleValue } from './board.utils';
import { useBoardDrag } from './use-board-drag';
import styles from './board.module.css';

export function Board() {
  const { tickets, createTicket, updateTicket, updateStatus, moveTicket, deleteTicket } = useTickets();
  const confirm = useConfirm();
  const [editingTicket, setEditingTicket] = useState<ITicket | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedPriorities, setSelectedPriorities] = useState<TicketPriority[]>([]);
  const [selectedAssigneeIds, setSelectedAssigneeIds] = useState<string[]>([]);

  const {
    sensors,
    collisionDetection,
    activeTicket,
    overStatus,
    handleDragStart,
    handleDragOver,
    handleDragEnd,
    handleDragCancel,
  } = useBoardDrag(tickets, moveTicket);

  const isModalOpen = !!(isCreating || editingTicket);

  const closeModal = () => {
    setIsCreating(false);
    setEditingTicket(null);
  };

  const togglePriority = (priority: TicketPriority) => {
    setSelectedPriorities((prev) => toggleValue(prev, priority));
  };

  const toggleAssignee = (assigneeId: string) => {
    setSelectedAssigneeIds((prev) => toggleValue(prev, assigneeId));
  };

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

  const visibleTickets = filterTickets(tickets, {
    query: searchQuery,
    priorities: selectedPriorities,
    assigneeIds: selectedAssigneeIds,
  });

  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <h1 className={styles.title}>Ticket Desk</h1>
        <div className={styles['header-actions']}>
          <ThemeToggle />
          <Button onClick={() => setIsCreating(true)}>+ New ticket</Button>
        </div>
      </header>

      <div className={styles['filter-shelf']}>
        <SearchBar value={searchQuery} onChange={setSearchQuery} placeholder="Search tickets…" />
        <PriorityFilter selected={selectedPriorities} onToggle={togglePriority} />
        <AssigneeFilter assignees={ASSIGNEES} selected={selectedAssigneeIds} onToggle={toggleAssignee} />
      </div>

      <DndContext
        sensors={sensors}
        collisionDetection={collisionDetection}
        onDragStart={handleDragStart}
        onDragOver={handleDragOver}
        onDragEnd={handleDragEnd}
        onDragCancel={handleDragCancel}
      >
        <div className={styles.columns}>
          {TICKET_STATUSES.map((status) => (
            <BoardColumn
              key={status.value}
              status={status.value}
              label={status.label}
              tickets={getTicketsByStatus(visibleTickets, status.value)}
              isDropTarget={status.value === overStatus}
              onEditTicket={setEditingTicket}
              onDeleteTicket={handleDeleteTicket}
              onStatusChange={(ticket, newStatus) => updateStatus(ticket.id, newStatus)}
            />
          ))}
        </div>
        <DragOverlay>{activeTicket && <TicketCardOverlay ticket={activeTicket} />}</DragOverlay>
      </DndContext>

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
