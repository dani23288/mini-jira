import { useMemo, useState } from 'react';
import type { DragEndEvent, DragOverEvent, DragStartEvent } from '@dnd-kit/core';
import { KeyboardSensor, PointerSensor, useSensor, useSensors } from '@dnd-kit/core';
import { sortableKeyboardCoordinates } from '@dnd-kit/sortable';
import type { ITicket, IUseTicketsResult, TicketStatus } from '@org/types';
import { getRankForIndex } from '../../utils/rank';
import {
  findTicketById,
  getBoardCollisionDetection,
  getDropInsertIndex,
  getTicketsByStatus,
  isTicketStatus,
} from './board.utils';

export function useBoardDrag(tickets: ITicket[], moveTicket: IUseTicketsResult['moveTicket']) {
  const [activeId, setActiveId] = useState<string | null>(null);
  const [overStatus, setOverStatus] = useState<TicketStatus | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 8 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates }),
  );

  const collisionDetection = useMemo(() => getBoardCollisionDetection(tickets), [tickets]);

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
    if (overTicket) {
      setOverStatus(overTicket.status);
      return;
    }
    if (!isTicketStatus(overId)) {
      setOverStatus(null);
      return;
    }
    setOverStatus(overId);
  };

  const handleDragEnd = (event: DragEndEvent) => {
    setActiveId(null);
    setOverStatus(null);
    const { active, over } = event;
    if (!over || active.id === over.id) {
      return;
    }

    const draggedId = String(active.id);
    const overId = String(over.id);
    const activeTicket = findTicketById(tickets, draggedId);
    const overTicket = findTicketById(tickets, overId);
    if (!activeTicket) {
      return;
    }
    const destinationStatus = overTicket?.status ?? (isTicketStatus(overId) ? overId : null);
    if (!destinationStatus) {
      return;
    }

    const destinationColumnTickets = getTicketsByStatus(tickets, destinationStatus).filter(
      (ticket) => ticket.id !== draggedId,
    );
    const insertIndex = getDropInsertIndex(destinationColumnTickets, overTicket, active, over);

    const rank = getRankForIndex(
      destinationColumnTickets.map((ticket) => ticket.rank),
      insertIndex,
    );
    moveTicket(draggedId, destinationStatus, rank);
  };

  const handleDragCancel = () => {
    setActiveId(null);
    setOverStatus(null);
  };

  const activeTicket = activeId ? findTicketById(tickets, activeId) ?? null : null;

  return {
    sensors,
    collisionDetection,
    activeTicket,
    overStatus,
    handleDragStart,
    handleDragOver,
    handleDragEnd,
    handleDragCancel,
  };
}
