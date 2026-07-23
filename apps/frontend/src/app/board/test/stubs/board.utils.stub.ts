import type { Active, Over } from '@dnd-kit/core';
import type { ITicket } from '@org/types';

export function makeTicket(id: string, overrides: Partial<ITicket> = {}): ITicket {
  return {
    id,
    title: id,
    status: 'todo',
    priority: 'medium',
    rank: id,
    createdAt: '2026-01-01T00:00:00.000Z',
    ...overrides,
  };
}

export function makeActive(translatedTop: number | null): Active {
  return {
    id: 'active',
    data: { current: undefined },
    rect: { current: { initial: null, translated: translatedTop === null ? null : { top: translatedTop, height: 40 } } },
  } as unknown as Active;
}

export function makeOver(id: string, top: number): Over {
  return { id, rect: { top, height: 40 }, disabled: false, data: { current: undefined } } as unknown as Over;
}
