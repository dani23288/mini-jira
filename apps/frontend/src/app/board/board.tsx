import { useState } from 'react';
import {
  DndContext,
  DragOverlay,
  PointerSensor,
  closestCenter,
  pointerWithin,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import type { CollisionDetection, DragEndEvent, DragOverEvent, DragStartEvent } from '@dnd-kit/core';
import type { ITicket, TicketStatus } from '@org/types';
import { TICKET_STATUSES } from '@org/consts';
import { useTickets } from '../../hooks/use-tickets';
import { Button } from '../../components/button/button';
import { SearchBar } from '../../components/search-bar/search-bar';
import { BoardColumn } from '../../components/board-column/board-column';
import { TicketCardOverlay } from '../../components/ticket-card/ticket-card';
import { TicketModal } from '../../components/ticket-modal/ticket-modal';
import { getRankForIndex } from '../../utils/rank';
import { filterTicketsByQuery, getTicketsByStatus } from './board.utils';
import styles from './board.module.css';

export function Board() {
  const { tickets, createTicket, updateTicket, updateStatus, moveTicket, deleteTicket } = useTickets();
  const [editingTicket, setEditingTicket] = useState<ITicket | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeId, setActiveId] = useState<string | null>(null);
  const [overStatus, setOverStatus] = useState<TicketStatus | null>(null);

  const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 8 } }));

  const isModalOpen = !!(isCreating || editingTicket);

  // If the raw pass resolves to a column container (not a card), re-run closestCenter
  // scoped to that column's cards so gaps between cards still resolve precisely.
  const collisionDetection: CollisionDetection = (args) => {
    const pointerCollisions = pointerWithin(args);
    const collisions = pointerCollisions.length > 0 ? pointerCollisions : closestCenter(args);
    const firstCollision = collisions[0];
    if (!firstCollision) {
      return collisions;
    }

    const overId = String(firstCollision.id);
    const isTicketMatch = tickets.some((ticket) => ticket.id === overId);
    if (isTicketMatch) {
      return collisions;
    }

    const columnTicketIds = new Set(
      tickets.filter((ticket) => ticket.status === (overId as TicketStatus)).map((ticket) => ticket.id),
    );
    if (columnTicketIds.size === 0) {
      return collisions;
    }

    const scopedContainers = args.droppableContainers.filter((container) =>
      columnTicketIds.has(String(container.id)),
    );
    const scopedCollisions = closestCenter({ ...args, droppableContainers: scopedContainers });
    return scopedCollisions.length > 0 ? scopedCollisions : collisions;
  };

  const closeModal = () => {
    setIsCreating(false);
    setEditingTicket(null);
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
    const overTicket = tickets.find((ticket) => ticket.id === overId);
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
    const activeTicket = tickets.find((ticket) => ticket.id === activeId);
    const overTicket = tickets.find((ticket) => ticket.id === overId);
    if (!activeTicket) {
      return;
    }
    const destinationStatus: TicketStatus = overTicket ? overTicket.status : (overId as TicketStatus);

    const destinationColumnTickets = getTicketsByStatus(tickets, destinationStatus).filter(
      (ticket) => ticket.id !== activeId,
    );

    let insertIndex = destinationColumnTickets.length;
    if (overTicket) {
      const overIndex = destinationColumnTickets.findIndex((ticket) => ticket.id === overTicket.id);
      const activeRect = active.rect.current.translated;
      const isPastOverCenter = activeRect
        ? activeRect.top + activeRect.height / 2 > over.rect.top + over.rect.height / 2
        : false;
      insertIndex = isPastOverCenter ? overIndex + 1 : overIndex;
    }

    const rank = getRankForIndex(
      destinationColumnTickets.map((ticket) => ticket.rank),
      insertIndex,
    );
    moveTicket(activeId, destinationStatus, rank);
  };

  const visibleTickets = filterTicketsByQuery(tickets, searchQuery);
  const activeTicket = activeId ? tickets.find((ticket) => ticket.id === activeId) ?? null : null;

  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <h1 className={styles.title}>Ticket Desk</h1>
        <div className={styles['header-actions']}>
          <SearchBar value={searchQuery} onChange={setSearchQuery} placeholder="Search tickets…" />
          <Button onClick={() => setIsCreating(true)}>+ New ticket</Button>
        </div>
      </header>

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
              onDeleteTicket={(ticket) => deleteTicket(ticket.id)}
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
