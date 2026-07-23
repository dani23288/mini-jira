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

- [x] Drag-and-drop: cross-column status changes and within-column reordering (`@dnd-kit`), backed by a fractional-indexing `rank` field so order survives search filtering. Per-ticket status dropdown kept as the non-drag alternative, now built on the custom `dropdown-menu` component. Manually verified in-browser (cross-column moves, reordering, dropping between the last two cards of a column, dropping into an empty column).
- [x] Delete confirmation dialog: generic `ConfirmDialog` component + imperative `useConfirm()` hook (promise-based, backed by a `ConfirmDialogProvider` mounted at the app root) so any future flow can request a confirmation without prop-drilling. Names the ticket in the body copy, new `danger` `Button` variant for the destructive action, Cancel gets initial focus, Escape/click-outside cancel, focus returns to the "⋯" trigger on close. `useConfirm()`'s promise resolution unit-tested (`use-confirm.spec.tsx`); dialog rendering and board wiring manually verified in-browser.
- Priority filtering.
- A separate list/table view (sortable by priority, still filterable by status).
- Dark mode: palette + toggle (token structure already supports this from phase 1).
- Real backend: NestJS + GraphQL + MongoDB, swapping `useTickets()`'s internals from mock state to real queries/mutations without changing its call signature.

Follow-ups (not scheduled)
- `TicketModal` lacks Escape-to-close and focus-return-to-trigger, unlike the newer `ConfirmDialog` (only has click-outside-to-close). Noted during the delete-confirmation-dialog work but left out of scope to keep that change focused.
