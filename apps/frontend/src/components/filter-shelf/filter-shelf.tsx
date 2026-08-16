import { SearchBar } from '../search-bar/search-bar';
import { PriorityFilter } from '../priority-filter/priority-filter';
import { AssigneeFilter } from '../assignee-filter/assignee-filter';
import type { IFilterShelfProps } from './filter-shelf.types';
import styles from './filter-shelf.module.css';

export function FilterShelf({
  searchQuery,
  onSearchQueryChange,
  assignees,
  selectedPriorities,
  onTogglePriority,
  selectedAssigneeIds,
  onToggleAssignee,
}: IFilterShelfProps) {
  return (
    <div className={styles['filter-shelf']}>
      <SearchBar value={searchQuery} onChange={onSearchQueryChange} placeholder="Search tickets…" />
      <PriorityFilter selected={selectedPriorities} onToggle={onTogglePriority} />
      <AssigneeFilter assignees={assignees} selected={selectedAssigneeIds} onToggle={onToggleAssignee} />
    </div>
  );
}
