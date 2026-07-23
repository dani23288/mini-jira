import type { IAssignee } from '@org/types';

export interface IAssigneeFilterProps {
  assignees: IAssignee[];
  selected: string[];
  onToggle: (assigneeId: string) => void;
}
