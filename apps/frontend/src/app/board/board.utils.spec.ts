import { describe, expect, it } from 'vitest';
import type { Active, Over } from '@dnd-kit/core';
import type { ITicket } from '@org/types';
import { getDropInsertIndex } from './board.utils';

function makeTicket(id: string): ITicket {
  return {
    id,
    title: id,
    status: 'todo',
    priority: 'medium',
    rank: id,
    createdAt: '2026-01-01T00:00:00.000Z',
  };
}

function makeActive(translatedTop: number | null): Active {
  return {
    id: 'active',
    data: { current: undefined },
    rect: { current: { initial: null, translated: translatedTop === null ? null : { top: translatedTop, height: 40 } } },
  } as unknown as Active;
}

function makeOver(id: string, top: number): Over {
  return { id, rect: { top, height: 40 }, disabled: false, data: { current: undefined } } as unknown as Over;
}

describe('getDropInsertIndex', () => {
  const columnTickets = [makeTicket('a'), makeTicket('b')];

  it('inserts at the end when there is no over ticket (dropped on the column itself)', () => {
    expect(getDropInsertIndex(columnTickets, undefined, makeActive(0), makeOver('todo', 0))).toBe(2);
  });

  it('inserts before the over ticket when dragged above its center', () => {
    const over = makeOver('b', 100);
    const active = makeActive(90);
    expect(getDropInsertIndex(columnTickets, columnTickets[1], active, over)).toBe(1);
  });

  it('inserts after the over ticket when dragged past its center', () => {
    const over = makeOver('b', 100);
    const active = makeActive(130);
    expect(getDropInsertIndex(columnTickets, columnTickets[1], active, over)).toBe(2);
  });
});
