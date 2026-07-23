import type { ITicket } from '@org/types';
import { assignSequentialRanks } from '../utils/rank';

export function createMockTickets(): ITicket[] {
  const tickets: Omit<ITicket, 'rank'>[] = [
    {
      id: crypto.randomUUID(),
      title: 'Fix login redirect loop',
      description: 'Users get bounced back to the login page after a successful sign-in on Safari.',
      status: 'todo',
      priority: 'high',
      createdAt: '2026-07-14T09:15:00.000Z',
    },
    {
      id: crypto.randomUUID(),
      title: 'Add empty state illustration',
      description: 'Board looks bare with zero tickets. Needs a friendly empty state.',
      status: 'todo',
      priority: 'low',
      createdAt: '2026-07-15T13:40:00.000Z',
    },
    {
      id: crypto.randomUUID(),
      title: 'Wire up priority badge colors',
      description: 'Match the badge palette to the design tokens.',
      status: 'in-progress',
      priority: 'medium',
      createdAt: '2026-07-16T10:05:00.000Z',
    },
    {
      id: crypto.randomUUID(),
      title: 'Draft onboarding checklist',
      status: 'in-progress',
      priority: 'medium',
      createdAt: '2026-07-17T16:22:00.000Z',
    },
    {
      id: crypto.randomUUID(),
      title: 'Set up pastel design tokens',
      description: 'Colors, type scale, spacing, and shadows for the Ticket Desk theme.',
      status: 'done',
      priority: 'high',
      createdAt: '2026-07-12T08:00:00.000Z',
    },
    {
      id: crypto.randomUUID(),
      title: 'Scaffold Nx workspace',
      status: 'done',
      priority: 'low',
      createdAt: '2026-07-11T11:30:00.000Z',
    },
  ];

  return assignSequentialRanks(tickets);
}
