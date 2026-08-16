import { useState } from 'react';
import { DndContext, DragOverlay } from '@dnd-kit/core';
import type { TicketPriority } from '@org/types';
import { ASSIGNEES, TICKET_STATUSES } from '@org/consts';
import { FilterShelf } from '../../components/filter-shelf/filter-shelf';
import { BoardColumn } from '../../components/board-column/board-column';
import { TicketCardOverlay } from '../../components/ticket-card/ticket-card-overlay';
import { filterTickets, getTicketsByStatus, toggleValue } from './board.utils';
import { useBoardDrag } from './use-board-drag';
import type { IBoardViewProps } from './board-view.types';
import styles from './board-view.module.css';

export function BoardView({ tickets, onEditTicket, onDeleteTicket, onStatusChange, moveTicket }: IBoardViewProps) {
  // risk: deliberately local, not lifted to TicketsPage — this is the useUrlState seam, don't "fix" by lifting.
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

  const togglePriority = (priority: TicketPriority) => {
    setSelectedPriorities((prev) => toggleValue(prev, priority));
  };

  const toggleAssignee = (assigneeId: string) => {
    setSelectedAssigneeIds((prev) => toggleValue(prev, assigneeId));
  };

  const visibleTickets = filterTickets(tickets, {
    query: searchQuery,
    priorities: selectedPriorities,
    assigneeIds: selectedAssigneeIds,
  });

  return (
    <>
      <FilterShelf
        searchQuery={searchQuery}
        onSearchQueryChange={setSearchQuery}
        assignees={ASSIGNEES}
        selectedPriorities={selectedPriorities}
        onTogglePriority={togglePriority}
        selectedAssigneeIds={selectedAssigneeIds}
        onToggleAssignee={toggleAssignee}
      />

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
              onEditTicket={onEditTicket}
              onDeleteTicket={onDeleteTicket}
              onStatusChange={onStatusChange}
            />
          ))}
        </div>
        <DragOverlay>{activeTicket && <TicketCardOverlay ticket={activeTicket} />}</DragOverlay>
      </DndContext>
    </>
  );
}
