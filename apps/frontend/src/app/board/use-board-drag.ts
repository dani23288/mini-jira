import { useMemo, useState } from 'react';
import type { DragEndEvent, DragOverEvent, DragStartEvent } from '@dnd-kit/core';
import { KeyboardSensor, PointerSensor, useSensor, useSensors } from '@dnd-kit/core';
import { sortableKeyboardCoordinates } from '@dnd-kit/sortable';
import type { ITicket, IUseTicketsResult, TicketStatus } from '@org/types';
import { getRankForEnd, getRankForIndex } from '../../utils/rank';
import {
  findTicketById,
  getBoardCollisionDetection,
  getDropInsertIndex,
  getTicketsByStatus,
  resolveDestinationStatus,
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
    const { active, over } = event;
    if (!over) {
      setOverStatus(null);
      return;
    }
    const destinationStatus = resolveDestinationStatus(tickets, String(over.id));
    if (!destinationStatus) {
      setOverStatus(null);
      return;
    }
    setOverStatus(destinationStatus);

    // Move the dragged ticket into the destination column's SortableContext as soon as we cross
    // into it. Otherwise its id is missing from that column's items list, so dnd-kit's sorting
    // strategy computes sibling positions against an activeIndex of -1 and their measured rects
    // go bad — which then throws off the before/after neighbors picked on drop.
    const draggedId = String(active.id);
    const activeTicket = findTicketById(tickets, draggedId);
    if (!activeTicket || activeTicket.status === destinationStatus) {
      return;
    }
    const rank = getRankForEnd(
      getTicketsByStatus(tickets, destinationStatus)
        .filter((ticket) => ticket.id !== draggedId)
        .map((ticket) => ticket.rank),
    );
    moveTicket(draggedId, destinationStatus, rank);
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
    const destinationStatus = resolveDestinationStatus(tickets, overId);
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
