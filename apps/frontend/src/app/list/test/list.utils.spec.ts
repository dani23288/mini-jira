import { describe, expect, it } from 'vitest';
import { getAriaSort, sortTicketsByPriority } from '../list.utils';
import { getAriaSortCases, sortTicketsByPriorityCases } from './stubs/list.utils.cases';

describe('sortTicketsByPriority', () => {
  it.each(sortTicketsByPriorityCases)('sorts $name', ({ direction, tickets, expectedIds }) => {
    const result = sortTicketsByPriority(tickets, direction);
    expect(result.map((ticket) => ticket.id)).toEqual(expectedIds);
  });
});

describe('getAriaSort', () => {
  it.each(getAriaSortCases)('maps $name to $expected', ({ direction, expected }) => {
    expect(getAriaSort(direction)).toBe(expected);
  });
});
