import type { ITicketFilters } from '../../board.utils';
import { makeTicket } from './board.utils.stub';

export const dropInsertColumnTickets = [makeTicket('a'), makeTicket('b')];

export const getDropInsertIndexCases = [
  {
    name: 'no over ticket (dropped on the column itself)',
    overTicket: undefined,
    overId: 'todo',
    overTop: 0,
    activeTop: 0,
    expected: 2,
  },
  {
    name: "dragged above the over ticket's center",
    overTicket: dropInsertColumnTickets[1],
    overId: 'b',
    overTop: 100,
    activeTop: 90,
    expected: 1,
  },
  {
    name: "dragged past the over ticket's center",
    overTicket: dropInsertColumnTickets[1],
    overId: 'b',
    overTop: 100,
    activeTop: 130,
    expected: 2,
  },
];

export const toggleValueCases = [
  { name: 'adds the value when not present', values: ['low'], value: 'high', expected: ['low', 'high'] },
  { name: 'removes the value when already present', values: ['low', 'high'], value: 'low', expected: ['high'] },
];

export const filterTicketsCases: { name: string; filters: Partial<ITicketFilters>; expectedIds: string[] }[] = [
  { name: 'returns every ticket when no filters are active', filters: {}, expectedIds: ['a', 'b', 'c'] },
  { name: 'filters by title, case-insensitively', filters: { query: 'LOGIN' }, expectedIds: ['a'] },
  { name: 'filters by priority', filters: { priorities: ['medium', 'low'] }, expectedIds: ['b', 'c'] },
  { name: 'filters by assignee', filters: { assigneeIds: ['dani-k'] }, expectedIds: ['a'] },
  {
    name: 'treats tickets with no assigneeId as matching the "unassigned" filter value',
    filters: { assigneeIds: ['unassigned'] },
    expectedIds: ['c'],
  },
  {
    name: 'combines query, priority, and assignee filters with AND logic (match)',
    filters: { query: 'draft', priorities: ['medium'], assigneeIds: ['jamie-m'] },
    expectedIds: ['b'],
  },
  {
    name: 'combines query, priority, and assignee filters with AND logic (mismatch)',
    filters: { query: 'draft', priorities: ['high'], assigneeIds: ['jamie-m'] },
    expectedIds: [],
  },
];
