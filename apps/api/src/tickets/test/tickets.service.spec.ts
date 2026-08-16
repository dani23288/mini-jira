import { NotFoundException } from '@nestjs/common';
import { beforeEach, describe, expect, it } from 'vitest';
import { TicketsService } from '../tickets.service';
import { makeFindChain, makeModel, makeTicketDoc } from './stubs/tickets.service.stub';

describe('TicketsService', () => {
  describe('find', () => {
    it('builds a mongo query from every provided filter', async () => {
      const model = makeModel();
      const service = new TicketsService(model as never);

      await service.find({ status: 'todo', priority: 3, assigneeId: 'dani-k', search: 'login' });

      expect(model.find).toHaveBeenCalledWith({
        status: 'todo',
        priority: 3,
        assigneeId: 'dani-k',
        title: { $regex: 'login', $options: 'i' },
      });
    });

    it('defaults to sorting by rank ascending when sort/dir are omitted', async () => {
      const model = makeModel();
      const service = new TicketsService(model as never);
      const chain = makeFindChain([]);
      model.find.mockReturnValue(chain);

      await service.find({});

      expect(chain.sort).toHaveBeenCalledWith({ rank: 1 });
    });

    it('applies the requested sort field and direction', async () => {
      const model = makeModel();
      const service = new TicketsService(model as never);
      const chain = makeFindChain([]);
      model.find.mockReturnValue(chain);

      await service.find({ sort: 'priority', dir: 'desc' });

      expect(chain.sort).toHaveBeenCalledWith({ priority: -1 });
    });

    it('maps returned documents through toTicket', async () => {
      const doc = makeTicketDoc('t1', { title: 'Fix login redirect loop' });
      const model = makeModel();
      model.find.mockReturnValue(makeFindChain([doc]));
      const service = new TicketsService(model as never);

      const result = await service.find({});

      expect(result).toEqual([
        expect.objectContaining({ id: 't1', title: 'Fix login redirect loop', createdAt: expect.any(String) }),
      ]);
    });
  });

  describe('create', () => {
    it('computes an end-of-column rank when the target column is empty', async () => {
      const model = makeModel();
      model.create.mockImplementation((attrs: Record<string, unknown>) => Promise.resolve(makeTicketDoc('new', attrs)));
      const service = new TicketsService(model as never);

      const result = await service.create({ title: 'New ticket', status: 'todo' });

      expect(model.find).toHaveBeenCalledWith({ status: 'todo' }, { rank: 1 });
      expect(result.rank).toBeTruthy();
    });

    it('computes a rank after the last existing rank in the target column', async () => {
      const existingRank = 'a0';
      const model = makeModel();
      model.find.mockReturnValue(makeFindChain([{ rank: existingRank }]));
      model.create.mockImplementation((attrs: Record<string, unknown>) => Promise.resolve(makeTicketDoc('new', attrs)));
      const service = new TicketsService(model as never);

      const result = await service.create({ title: 'New ticket', status: 'todo' });

      expect(result.rank > existingRank).toBe(true);
    });

    it('defaults status and priority when not provided', async () => {
      const model = makeModel();
      model.create.mockImplementation((attrs: Record<string, unknown>) => Promise.resolve(makeTicketDoc('new', attrs)));
      const service = new TicketsService(model as never);

      const result = await service.create({ title: 'New ticket' });

      expect(result.status).toBe('todo');
      expect(result.priority).toBe(2);
    });
  });

  describe('update — rank rule', () => {
    let model: ReturnType<typeof makeModel>;
    let service: TicketsService;

    beforeEach(() => {
      model = makeModel();
      service = new TicketsService(model as never);
    });

    it('computes an end-of-column rank when status changes and no rank is sent', async () => {
      const existing = makeTicketDoc('t1', { status: 'todo', rank: 'a0' });
      model.findById.mockReturnValue({ exec: () => Promise.resolve(existing) });
      model.find.mockReturnValue(makeFindChain([{ rank: 'a1' }]));

      const result = await service.update('t1', { status: 'done' });

      expect(model.find).toHaveBeenCalledWith({ status: 'done' }, { rank: 1 });
      expect(result.status).toBe('done');
      expect(result.rank > 'a1').toBe(true);
    });

    it('persists an explicitly sent rank verbatim, even when status also changes', async () => {
      const existing = makeTicketDoc('t1', { status: 'todo', rank: 'a0' });
      model.findById.mockReturnValue({ exec: () => Promise.resolve(existing) });

      const result = await service.update('t1', { status: 'done', rank: 'z9' });

      expect(model.find).not.toHaveBeenCalled();
      expect(result.rank).toBe('z9');
    });

    it('leaves rank untouched when status is unchanged and no rank is sent', async () => {
      const existing = makeTicketDoc('t1', { status: 'todo', rank: 'a0' });
      model.findById.mockReturnValue({ exec: () => Promise.resolve(existing) });

      const result = await service.update('t1', { title: 'Renamed' });

      expect(model.find).not.toHaveBeenCalled();
      expect(result.rank).toBe('a0');
      expect(result.title).toBe('Renamed');
    });

    it('throws NotFoundException when the ticket does not exist', async () => {
      model.findById.mockReturnValue({ exec: () => Promise.resolve(null) });

      await expect(service.update('missing', { title: 'x' })).rejects.toThrow(NotFoundException);
    });
  });

  describe('remove', () => {
    it('throws NotFoundException when the ticket does not exist', async () => {
      const model = makeModel();
      model.findByIdAndDelete.mockReturnValue({ exec: () => Promise.resolve(null) });
      const service = new TicketsService(model as never);

      await expect(service.remove('missing')).rejects.toThrow(NotFoundException);
    });

    it('resolves when the ticket is deleted', async () => {
      const model = makeModel();
      model.findByIdAndDelete.mockReturnValue({ exec: () => Promise.resolve(makeTicketDoc('t1')) });
      const service = new TicketsService(model as never);

      await expect(service.remove('t1')).resolves.toBeUndefined();
    });
  });
});
