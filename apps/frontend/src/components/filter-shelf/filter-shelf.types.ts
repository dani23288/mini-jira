import type { TicketPriority, IAssignee } from '@org/types';

export interface IFilterShelfProps {
  searchQuery: string;
  onSearchQueryChange: (query: string) => void;
  assignees: IAssignee[];
  selectedPriorities: TicketPriority[];
  onTogglePriority: (priority: TicketPriority) => void;
  selectedAssigneeIds: string[];
  onToggleAssignee: (assigneeId: string) => void;
}
