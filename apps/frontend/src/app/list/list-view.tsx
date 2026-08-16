import { useState } from 'react';
import type { SortDirection, TicketPriority, TicketStatus } from '@org/types';
import { ASSIGNEES, TICKET_STATUSES } from '@org/consts';
import { FilterShelf } from '../../components/filter-shelf/filter-shelf';
import { DropdownMenu } from '../../components/dropdown-menu/dropdown-menu';
import { PriorityBadge } from '../../components/priority-badge/priority-badge';
import { getStatusLabel } from '../../utils/ticket-labels';
import { filterTickets, toggleValue } from '../board/board.utils';
import { getAriaSort, sortTicketsByPriority } from './list.utils';
import type { IListViewProps } from './list-view.types';
import styles from './list-view.module.css';

export function ListView({ tickets, onEditTicket, onDeleteTicket, onStatusChange }: IListViewProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedPriorities, setSelectedPriorities] = useState<TicketPriority[]>([]);
  const [selectedAssigneeIds, setSelectedAssigneeIds] = useState<string[]>([]);
  const [selectedStatuses, setSelectedStatuses] = useState<TicketStatus[]>([]);
  const [prioritySort, setPrioritySort] = useState<SortDirection | null>(null);

  const togglePriority = (priority: TicketPriority) => {
    setSelectedPriorities((prev) => toggleValue(prev, priority));
  };

  const toggleAssignee = (assigneeId: string) => {
    setSelectedAssigneeIds((prev) => toggleValue(prev, assigneeId));
  };

  const toggleStatus = (status: TicketStatus) => {
    setSelectedStatuses((prev) => toggleValue(prev, status));
  };

  const togglePrioritySort = () => {
    setPrioritySort((prev) => (prev === 'asc' ? 'desc' : 'asc'));
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

      <div className={styles['table-wrapper']}>
        <table className={styles.table}>
          <thead>
            <tr className={styles['head-row']}>
              <th className={styles['head-cell']} scope="col">
                Title
              </th>
              <th className={styles['head-cell']} scope="col" aria-sort={getAriaSort(prioritySort)}>
                <button type="button" className={styles['sort-button']} onClick={togglePrioritySort}>
                  Priority
                  <span aria-hidden="true">{prioritySort === 'desc' ? '▾' : prioritySort === 'asc' ? '▴' : ''}</span>
                </button>
              </th>
              <th className={styles['head-cell']} scope="col">
                Status
              </th>
              <th className={styles['actions-head-cell']} scope="col">
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {visibleTickets.map((ticket) => (
              <tr key={ticket.id} className={styles['body-row']}>
                <td className={styles['title-cell']}>{ticket.title}</td>
                <td className={styles.cell}>
                  <PriorityBadge priority={ticket.priority} />
                </td>
                <td className={styles.cell}>
                  <DropdownMenu
                    triggerLabel="Change ticket status"
                    triggerClassName={styles['status-trigger']}
                    triggerContent={
                      <>
                        {getStatusLabel(ticket.status)} <span aria-hidden="true">▾</span>
                      </>
                    }
                    items={TICKET_STATUSES.map((option) => ({
                      label: option.label,
                      onSelect: () => onStatusChange(ticket, option.value),
                      isActive: option.value === ticket.status,
                    }))}
                  />
                </td>
                <td className={styles['actions-cell']}>
                  <DropdownMenu
                    triggerLabel="Ticket actions"
                    items={[
                      { label: 'Edit', onSelect: () => onEditTicket(ticket) },
                      { label: 'Delete', onSelect: () => onDeleteTicket(ticket), variant: 'danger' },
                    ]}
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}
