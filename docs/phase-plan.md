# Ticket Desk — Frontend Plan

## Phase 1 (current)

Data layer
- [x] Shared libs: `packages/shared/types` (`ITicket`, `TicketStatus`, `TicketPriority`, `ICreateTicketInput`, `IUpdateTicketInput`, `IUseTicketsResult`) and `packages/shared/consts` (`TICKET_STATUSES`, `TICKET_PRIORITIES`, defaults).
- [ ] Design tokens: CSS custom properties for pastel-pink theme (colors, spacing, typography).
- [ ] Mock ticket data set.
- [ ] `useTickets()` hook (in-memory, implements `IUseTicketsResult`; resets on refresh, no persistence).

Board & components
- [ ] Board layout: columns from `TICKET_STATUSES` config, fluid flex/grid (resize-safe, no dedicated mobile pass).
- [ ] `TicketCard`: title, priority badge, description snippet.
- [ ] Card "⋯" menu: Edit, Delete (red). Delete is immediate (no confirmation yet).
- [ ] Per-ticket status control (dropdown/buttons) — built so a drag-and-drop wrapper can be added later without restructuring.
- [ ] Create/Edit modal (shared component). Only `title` required; `description` optional; `priority` defaults to Medium; `status` defaults to first column.

Wiring
- [ ] Wire Board + TicketCard to `useTickets()`.
- [ ] Wire menu Edit → modal (pre-filled) / Delete → `deleteTicket`.
- [ ] Wire status control → `updateStatus`.
- [ ] Wire modal submit → `createTicket` / `updateTicket`.

Search
- [ ] Search bar above board, filters cards by title.

Final
- [ ] Manual QA pass: create, edit, delete, status change, search, window resize. No automated tests in phase 1.

## Phase 2 ideas (not yet scheduled)

- Drag-and-drop status changes (layered on top of the existing per-ticket control, same `updateStatus` call).
- Delete confirmation dialog.
- Priority filtering.
- A separate list/table view (sortable by priority, still filterable by status).
- Dark mode: palette + toggle (token structure already supports this from phase 1).
- Real backend: NestJS + GraphQL + MongoDB, swapping `useTickets()`'s internals from mock state to real queries/mutations without changing its call signature.
