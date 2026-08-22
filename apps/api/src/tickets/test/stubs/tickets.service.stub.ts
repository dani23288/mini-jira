import { vi } from 'vitest';

export function makeTicketDoc(id: string, overrides: Record<string, unknown> = {}) {
  const doc: Record<string, unknown> = {
    _id: { toString: () => id },
    title: 'Fix login redirect loop',
    description: undefined,
    status: 'todo',
    priority: 2,
    assigneeId: undefined,
    rank: 'a0',
    createdAt: new Date('2026-01-01T00:00:00.000Z'),
    ...overrides,
  };
  doc.set = (patch: Record<string, unknown>) => Object.assign(doc, patch);
  doc.save = vi.fn(() => Promise.resolve(doc));
  return doc;
}

function makeFindChain(result: unknown[]) {
  const chain = {
    sort: vi.fn(() => chain),
    exec: vi.fn().mockResolvedValue(result),
  };
  return chain;
}

type AnyFn = (...args: any[]) => any;

export function makeModel() {
  return {
    find: vi.fn<AnyFn>(() => makeFindChain([])),
    findById: vi.fn<AnyFn>(() => ({ exec: vi.fn().mockResolvedValue(null) })),
    findByIdAndDelete: vi.fn<AnyFn>(() => ({ exec: vi.fn().mockResolvedValue(null) })),
    create: vi.fn<AnyFn>(),
  };
}

export { makeFindChain };
