import { describe, expect, it } from 'vitest';
import { sortTicketsByPriority } from '../list.utils';
import { sortTicketsByPriorityCases } from './stubs/list.utils.cases';

describe('sortTicketsByPriority', () => {
  it.each(sortTicketsByPriorityCases)('sorts $name', ({ direction, tickets, expectedIds }) => {
    const result = sortTicketsByPriority(tickets, direction);
    expect(result.map((ticket) => ticket.id)).toEqual(expectedIds);
  });
});
