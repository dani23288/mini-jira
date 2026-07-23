import { describe, expect, it } from 'vitest';
import { filterTickets, getDropInsertIndex, toggleValue } from '../board.utils';
import { makeActive, makeOver, makeTicket } from './stubs/board.utils.stub';
import {
  dropInsertColumnTickets,
  filterTicketsCases,
  getDropInsertIndexCases,
  toggleValueCases,
} from './stubs/board.utils.cases';

describe('getDropInsertIndex', () => {
  it.each(getDropInsertIndexCases)(
    'inserts correctly when $name',
    ({ overTicket, overId, overTop, activeTop, expected }) => {
      const result = getDropInsertIndex(
        dropInsertColumnTickets,
        overTicket,
        makeActive(activeTop),
        makeOver(overId, overTop),
      );
      expect(result).toBe(expected);
    },
  );
});

describe('toggleValue', () => {
  it.each(toggleValueCases)('$name', ({ values, value, expected }) => {
    expect(toggleValue(values, value)).toEqual(expected);
  });
});

describe('filterTickets', () => {
  const tickets = [
    makeTicket('a', { title: 'Fix login bug', priority: 'high', assigneeId: 'dani-k' }),
    makeTicket('b', { title: 'Draft onboarding checklist', priority: 'medium', assigneeId: 'jamie-m' }),
    makeTicket('c', { title: 'Scaffold workspace', priority: 'low' }),
  ];
  const noFilters = { query: '', priorities: [], assigneeIds: [] };

  it.each(filterTicketsCases)('$name', ({ filters, expectedIds }) => {
    const result = filterTickets(tickets, { ...noFilters, ...filters });
    expect(result.map((ticket) => ticket.id)).toEqual(expectedIds);
  });
});
