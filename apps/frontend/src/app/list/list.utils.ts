import type { Dispatch, SetStateAction } from 'react';
import type { ITicket, SortDirection } from '@org/types';
import { toggleValue } from '../board/board.utils';

export function sortTicketsByPriority(tickets: ITicket[], direction: SortDirection): ITicket[] {
  const sign = direction === 'asc' ? 1 : -1;
  return [...tickets].sort((a, b) => (a.priority - b.priority) * sign);
}

// Builds a toggle handler for a single filter field, so each field doesn't need its own near-duplicate function.
export function createToggleHandler<T>(setState: Dispatch<SetStateAction<T[]>>): (value: T) => void {
  return (value: T) => setState((prev) => toggleValue(prev, value));
}
