import { useState } from 'react';
import type { SortDirection, TicketPriority, TicketStatus } from '@org/types';
import { ASSIGNEES } from '@org/consts';
import { FilterShelf } from '../../components/filter-shelf/filter-shelf';
import { ListTable } from '../../components/list-table/list-table';
import { filterTickets } from '../board/board.utils';
import { createToggleHandler, sortTicketsByPriority } from './list.utils';
import type { IListViewProps } from './list-view.types';

export function ListView({ tickets, onEditTicket, onDeleteTicket, onStatusChange }: IListViewProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedPriorities, setSelectedPriorities] = useState<TicketPriority[]>([]);
  const [selectedAssigneeIds, setSelectedAssigneeIds] = useState<string[]>([]);
  const [selectedStatuses, setSelectedStatuses] = useState<TicketStatus[]>([]);
  const [prioritySort, setPrioritySort] = useState<SortDirection | null>(null);

  const togglePriority = createToggleHandler(setSelectedPriorities);
  const toggleAssignee = createToggleHandler(setSelectedAssigneeIds);
  const toggleStatus = createToggleHandler(setSelectedStatuses);

  const togglePrioritySort = () => {
    setPrioritySort((prev) => (prev === 'asc' ? 'desc' : prev === 'desc' ? null : 'asc'));
  };

  const filteredTickets = filterTickets(tickets, {
    query: searchQuery,
    priorities: selectedPriorities,
    assigneeIds: selectedAssigneeIds,
    statuses: selectedStatuses,
  });
  const visibleTickets = prioritySort ? sortTicketsByPriority(filteredTickets, prioritySort) : filteredTickets;

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
        selectedStatuses={selectedStatuses}
        onToggleStatus={toggleStatus}
      />

      <ListTable
        tickets={visibleTickets}
        prioritySort={prioritySort}
        onTogglePrioritySort={togglePrioritySort}
        onEditTicket={onEditTicket}
        onDeleteTicket={onDeleteTicket}
        onStatusChange={onStatusChange}
      />
    </>
  );
}
