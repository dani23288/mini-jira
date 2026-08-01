import { useCallback, useState } from 'react';
import { DndContext, DragOverlay, KeyboardSensor, PointerSensor, useSensor, useSensors } from '@dnd-kit/core';
import type { DragEndEvent, DragOverEvent, DragStartEvent } from '@dnd-kit/core';
import { sortableKeyboardCoordinates } from '@dnd-kit/sortable';
import type { ITicket, TicketPriority, TicketStatus } from '@org/types';
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
import { getRankForIndex } from '../../utils/rank';
import {
  DELETE_TICKET_CONFIRM_LABEL,
  DELETE_TICKET_CONFIRM_TITLE,
  DELETE_TICKET_CONFIRM_VARIANT,
  getDeleteTicketConfirmBody,
} from './board.consts';
import {
  filterTickets,
  findTicketById,
  getBoardCollisionDetection,
  getDropInsertIndex,
  getTicketsByStatus,
  toggleValue,
} from './board.utils';
import styles from './board.module.css';

export function Board() {
  const { tickets, createTicket, updateTicket, updateStatus, moveTicket, deleteTicket } = useTickets();
  const confirm = useConfirm();
  const [editingTicket, setEditingTicket] = useState<ITicket | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedPriorities, setSelectedPriorities] = useState<TicketPriority[]>([]);
  const [selectedAssigneeIds, setSelectedAssigneeIds] = useState<string[]>([]);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [overStatus, setOverStatus] = useState<TicketStatus | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 8 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates }),
  );

  const isModalOpen = !!(isCreating || editingTicket);

  const collisionDetection = useCallback(getBoardCollisionDetection(tickets), [tickets]);

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

  const handleDragStart = (event: DragStartEvent) => {
    setActiveId(String(event.active.id));
  };

  const handleDragOver = (event: DragOverEvent) => {
    const { over } = event;
    if (!over) {
      setOverStatus(null);
      return;
    }
    const overId = String(over.id);
    const overTicket = findTicketById(tickets, overId);
    setOverStatus(overTicket ? overTicket.status : (overId as TicketStatus));
  };

  const handleDragEnd = (event: DragEndEvent) => {
    setActiveId(null);
    setOverStatus(null);
    const { active, over } = event;
    if (!over || active.id === over.id) {
      return;
    }

    const activeId = String(active.id);
    const overId = String(over.id);
    const activeTicket = findTicketById(tickets, activeId);
    const overTicket = findTicketById(tickets, overId);
    if (!activeTicket) {
      return;
    }
    const destinationStatus: TicketStatus = overTicket ? overTicket.status : (overId as TicketStatus);

    const destinationColumnTickets = getTicketsByStatus(tickets, destinationStatus).filter(
      (ticket) => ticket.id !== activeId,
    );
    const insertIndex = getDropInsertIndex(destinationColumnTickets, overTicket, active, over);

    const rank = getRankForIndex(
      destinationColumnTickets.map((ticket) => ticket.rank),
      insertIndex,
    );
    moveTicket(activeId, destinationStatus, rank);
  };

  const visibleTickets = filterTickets(tickets, {
    query: searchQuery,
    priorities: selectedPriorities,
    assigneeIds: selectedAssigneeIds,
  });
  const activeTicket = activeId ? findTicketById(tickets, activeId) ?? null : null;

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
        onDragCancel={() => {
          setActiveId(null);
          setOverStatus(null);
        }}
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
