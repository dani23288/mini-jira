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

## Phase 2 (done)

- [x] Drag-and-drop: cross-column + within-column reordering (`@dnd-kit`), fractional `rank` field, status dropdown kept as non-drag alternative.
- [x] Delete confirmation dialog: `ConfirmDialog` + `useConfirm()` hook, reusable app-wide, keyboard/focus handled.
- [x] Priority + assignee filtering: `assigneeId` on ticket model, filter shelf (`PriorityFilter` + `AssigneeFilter`) AND-combined with search.
- [x] Dark mode: Light/Dark/System via `useTheme()` hook + `ThemeToggle`, no flash-of-wrong-theme on load.
- [x] `TicketModal` Escape-to-close + focus-return-to-trigger, matching `ConfirmDialog`. `DropdownMenu`'s own Escape handler now stops propagation so nested Priority/Status/Assignee dropdowns don't also close the modal.
- [x] PR #2 review pass: all 22 review threads resolved (rank-sort comparator, theme-key drift comment, `AssigneeFilter` reusing `Avatar`).

## Phase 3 (done)

Backend — `apps/api`
- [x] NestJS + GraphQL (code-first) + MongoDB Atlas via `@nestjs/mongoose`, `toTicket` mapper. `status` wire as validated `String`, `priority` as `Int`.
- [x] `TicketsService.find(filter)`: server-side filter/sort/search, one query `tickets(status, priority, assigneeId, search, sort, dir)`, 3 mutations (create/update/delete). Rank recomputed server-side on status change (drag sends explicit rank instead).

Shared
- [x] `@org/utils` (`getRankForEnd`/`getRankForIndex`), `TicketPriority` numeric union, `TICKET_PRIORITIES` as `{ value, label, key }`. Deleted mock data + `assignSequentialRanks`.

Frontend
- [x] Apollo Client (Vite proxy to `/graphql`), `useTickets()` rewritten onto real API, optimistic drag, loading/error states.
- [x] `useUrlState` (no router) — URL owns view/filters/sort/dir.
- [x] `TicketsPage` split into `BoardView` / `ListView`; `PriorityBadge` extracted for reuse.
- [x] List view: sortable Priority column (`aria-sort`), `StatusFilter` chips, row actions via shared `DropdownMenu`.

Final
- [x] QA pass: board + list, CRUD, drag-and-drop, filters, search, sort, dark mode, status-change rank fix — all verified against real API + Atlas. No bugs found.

### Deferred to phase 4

- Toast component (banner state shape already right, only render swaps).
- User-defined columns. `String` status already allows it; cost is `@org/types` union to `string`, plus runtime lookup in `BoardColumn` / `ticket-labels`.
- Elastic/Solr search behind `TicketsService.find()`.
- react-router, if deep links are wanted. Move filters into real route state at same time.
- `Promise`-returning mutations, per-mutation `saving` flags.
- Assignee visible in list view (`Avatar` beside title cell).
