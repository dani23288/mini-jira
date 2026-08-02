import type { ITicket, TicketStatus } from '@org/types';
import { getRankForEnd } from '@org/utils';

// Deleted in phase 3 step 6 once the board reads from the API; sequential-rank assignment
// inlined here rather than reviving assignSequentialRanks for a file about to disappear.
export function createMockTickets(): ITicket[] {
  const drafts: Omit<ITicket, 'rank'>[] = [
    {
      id: crypto.randomUUID(),
      title: 'Fix login redirect loop',
      description: 'Users get bounced back to the login page after a successful sign-in on Safari.',
      status: 'todo',
      priority: 3,
      assigneeId: 'dani-k',
      createdAt: '2026-07-14T09:15:00.000Z',
    },
    {
      id: crypto.randomUUID(),
      title: 'Add empty state illustration',
      description: 'Board looks bare with zero tickets. Needs a friendly empty state.',
      status: 'todo',
      priority: 1,
      createdAt: '2026-07-15T13:40:00.000Z',
    },
    {
      id: crypto.randomUUID(),
      title: 'Wire up priority badge colors',
      description: 'Match the badge palette to the design tokens.',
      status: 'in-progress',
      priority: 2,
      assigneeId: 'jamie-m',
      createdAt: '2026-07-16T10:05:00.000Z',
    },
    {
      id: crypto.randomUUID(),
      title: 'Draft onboarding checklist',
      status: 'in-progress',
      priority: 2,
      assigneeId: 'alex-s',
      createdAt: '2026-07-17T16:22:00.000Z',
    },
    {
      id: crypto.randomUUID(),
      title: 'Set up pastel design tokens',
      description: 'Colors, type scale, spacing, and shadows for the Ticket Desk theme.',
      status: 'done',
      priority: 3,
      assigneeId: 'dani-k',
      createdAt: '2026-07-12T08:00:00.000Z',
    },
    {
      id: crypto.randomUUID(),
      title: 'Scaffold Nx workspace',
      status: 'done',
      priority: 1,
      assigneeId: 'rue-t',
      createdAt: '2026-07-11T11:30:00.000Z',
    },
  ];

  const lastRankByStatus: Partial<Record<TicketStatus, string>> = {};
  return drafts.map((draft) => {
    const rank = getRankForEnd(lastRankByStatus[draft.status] ? [lastRankByStatus[draft.status] as string] : []);
    lastRankByStatus[draft.status] = rank;
    return { ...draft, rank };
  });
}
