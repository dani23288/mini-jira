# Ticket Desk — Frontend Plan

## Phase 1 (done)

Data layer
- [x] Shared libs (`packages/shared/types`, `packages/shared/consts`) + design tokens for pastel-pink theme.
- [x] Mock ticket data + `useTickets()` hook (in-memory, no persistence).

Board & components
- [x] Board layout, `TicketCard`, "⋯" menu (Edit/Delete), per-ticket status dropdown, Create/Edit modal — all built.

Wiring
- [x] Board, cards, menu, status control, modal all wired to `useTickets()`.

Search
- [x] Search bar filters cards by title.

Final
- [x] Manual QA pass done, no automated tests phase 1.

## Phase 2 (current)

- [x] Drag-and-drop: cross-column + within-column reordering (`@dnd-kit`), fractional `rank` field, status dropdown kept as non-drag alternative.
- [x] Delete confirmation dialog: `ConfirmDialog` + `useConfirm()` hook, reusable app-wide, keyboard/focus handled.
- [x] Priority + assignee filtering: `assigneeId` on ticket model, filter shelf (`PriorityFilter` + `AssigneeFilter`) AND-combined with search.
- [x] Dark mode: Light/Dark/System via `useTheme()` hook + `ThemeToggle`, no flash-of-wrong-theme on load.

Follow-ups (not scheduled)
- `TicketModal` lacks Escape-to-close + focus-return-to-trigger, unlike newer `ConfirmDialog` (only has click-outside-to-close). Noted during delete-confirmation-dialog work, left out of scope to keep that change focused.

## Phase 3 (planned)

- Separate list/table view (sortable by priority, still filterable by status).
- Real backend: NestJS + GraphQL + MongoDB, swap `useTickets()`'s internals from mock state to real queries/mutations, no change to call signature.
