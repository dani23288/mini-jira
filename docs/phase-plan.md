# Ticket Desk — Frontend Plan

## Phase 1 (complete)

Data layer
- [x] Shared libs: `packages/shared/types` (`ITicket`, `TicketStatus`, `TicketPriority`, `ICreateTicketInput`, `IUpdateTicketInput`, `IUseTicketsResult`) and `packages/shared/consts` (`TICKET_STATUSES`, `TICKET_PRIORITIES`, defaults).
- [x] Design tokens: CSS custom properties for pastel-pink theme (colors, spacing, typography) in `apps/frontend/src/styles/`.
- [x] Mock ticket data set (`apps/frontend/src/data/mock-tickets.ts`).
- [x] `useTickets()` hook (in-memory, implements `IUseTicketsResult`; resets on refresh, no persistence).

Board & components
- [x] Board layout: columns from `TICKET_STATUSES` config, fluid flex/grid (resize-safe, no dedicated mobile pass).
- [x] `TicketCard`: title, priority badge, description snippet, washi-tape priority accent.
- [x] Card "⋯" menu: Edit, Delete (red). Delete is immediate (no confirmation yet).
- [x] Per-ticket status control (dropdown) — built so a drag-and-drop wrapper can be added later without restructuring.
- [x] Create/Edit modal (shared component). Only `title` required; `description` optional; `priority` defaults to Medium; `status` defaults to first column.

Wiring
- [x] Wire Board + TicketCard to `useTickets()`.
- [x] Wire menu Edit → modal (pre-filled) / Delete → `deleteTicket`.
- [x] Wire status control → `updateStatus`.
- [x] Wire modal submit → `createTicket` / `updateTicket`.

Search
- [x] Search bar above board, filters cards by title.

Final
- [x] Manual QA pass: create, edit, delete, status change, and search all verified working in-browser. Window-resize behavior relies on standard `flex-wrap` CSS (not visually re-verified at a narrow viewport due to a browser-automation tool limitation in this session). No automated tests in phase 1.

## Phase 2 (current)

- Drag-and-drop status changes (layered on top of the existing per-ticket control, same `updateStatus` call).
- Delete confirmation dialog.
- Priority filtering.
- A separate list/table view (sortable by priority, still filterable by status).
- Dark mode: palette + toggle (token structure already supports this from phase 1).
- Real backend: NestJS + GraphQL + MongoDB, swapping `useTickets()`'s internals from mock state to real queries/mutations without changing its call signature.
