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

## Phase 3 (current)

Two goals: real backend (NestJS + GraphQL + MongoDB), separate list/table view.

### Decisions

**Backend — `apps/api`**

- Scaffold: `nx g @nx/nest:app api`. Pulls `@nx/nest`, `@nx/node`, `@nx/webpack`.
- DB: MongoDB Atlas free tier. `MONGO_URI` + `PORT` from `apps/api/.env` via `@nestjs/config`. `.env` already gitignored.
- ODM: `@nestjs/mongoose`. Mongo owns `ObjectId _id`. `toTicket(doc)` mapper returns `{ id: doc._id.toString(), ...rest }`. Every read goes through it.
- GraphQL code-first. DTO classes live in `apps/api`, `implement` the `@org/types` interfaces. `@org/types` stays canonical.
- `status` crosses wire as `String`, validated `@IsIn(TICKET_STATUSES.map((s) => s.value))`. Not GraphQL enum — enum wire value is the name, can't hold `in-progress`, and can't grow at runtime when columns become user-defined.
- `priority` crosses wire as `Int`. Mongo stores number, sorts natively on index. Client maps number to label/color.
- Query: `tickets(status, priority, assigneeId, search, sort, dir)`. Filter + sort server-side in Mongo, all behind one `TicketsService.find(filter)`. That method is the seam when search moves to Elastic/Solr later. No `SearchProvider` interface until second engine exists.
- Mutations, 3 total: `createTicket`, `updateTicket(id, input)`, `deleteTicket`.
- Rank rule: status changed AND no rank sent, server computes end-of-column. Rank sent, persist verbatim.
- No seed. Empty board on first run, first ticket created through UI.

**Shared**

- New `packages/shared/utils` (`@org/utils`): `getRankForEnd`, `getRankForIndex`. Owns `fractional-indexing`. Both apps depend on it. `utils/test/rank.spec.ts` moves with it.
- Deleted: `assignSequentialRanks`, `data/mock-tickets.ts`.
- `@org/types`: `TicketPriority` becomes `1 | 2 | 3` (numeric union, not bare `number`, keeps exhaustiveness checks). `TicketStatus` union unchanged this phase.
- `@org/consts`: `TICKET_PRIORITIES` entries become `{ value: 1, label: 'Low', key: 'low' }`. `value` goes on wire and in Mongo, `key` feeds CSS.

**Rank ownership — split**

- Drag: client computes rank via `getRankForIndex`, sends explicit rank. Client knows drop index and both neighbors.
- Create + status-dropdown: server computes end-of-column. Only server knows target column reliably.

**Frontend**

- Apollo Client. Vite proxies `/graphql` to `localhost:3000`, so Apollo `uri` is `'/graphql'` and CORS never comes up.
- `useTickets()` returns `{ tickets, loading, error, createTicket, updateTicket, updateStatus, moveTicket, deleteTicket }`. Mutations stay `void`; hook catches into `error`. Widening to `Promise<void>` later is non-breaking, so not now.
- `updateTicket` / `updateStatus` / `moveTicket` all call the single `updateTicket` mutation. `board.tsx` call sites unchanged.
- Optimistic drag safe: board query never filters by status, drag only mutates `status` + `rank`, so list membership can't change.
- Errors: inline banner inside whichever view triggered the failure. Loading: gates initial query only.

**Views**

- `useUrlState` hook, ~15 lines, `useSyncExternalStore` + `popstate`. No router.
- URL owns `view`, filters, `sort`, `dir`. Maps 1:1 onto server query variables.
- No lifting, no prop drilling: Apollo cache shares tickets, URL shares filters, `ConfirmDialogProvider` already shares confirm. `TicketsPage` keeps modal state, passes `onEditTicket` / `onDeleteTicket` down one level.
- Structure: `TicketsPage` renders `BoardView` or `ListView`.
- List table columns: Title, Priority, Status, Actions. No assignee column (assignee filter still in shelf), no created column.
- Priority header sortable, toggles direction, needs `aria-sort`.
- `StatusFilter` chips in shelf, rendered only when `view=list`. Board keeps expressing status as columns.
- Row actions reuse `DropdownMenu` for both the "⋯" menu and the status cell. Row click does nothing.
- `PriorityBadge` extracted out of `ticket-card.module.css` so table can reuse it.

**Coercion traps.** `<select>` values and URL params are always strings. `'3' !== 3` breaks `TicketModal` and `PriorityFilter` silently. Coerce at both edges:

```ts
onChange={(e) => setPriority(Number(e.target.value) as TicketPriority)}
```

**Bug fixed by construction.** Today `updateTicket` merges changes without recomputing rank (`use-tickets.ts:40`), so changing status from the modal lands the card mid-column. Server rank rule kills it.

**Tests.** Unit only: `TicketsService` rank rule + filter/sort builder against a mocked mongoose `Model`, plus `useUrlState`.

### Implementation order

Backend first, agreed. Steps 1-2 keep app green on mock data before any network exists.

1. [x] **Shared prep.** Create `@org/utils`, move `rank.ts` + spec, delete `assignSequentialRanks`. `TicketPriority` to `1 | 2 | 3`, `TICKET_PRIORITIES` to `{ value, label, key }`. Done, merged to `phase-3` (`05ffb98`).
2. [x] **Frontend priority migration.** `getPriorityLabel`, `getPriorityColorVar`, `data-priority`, `PriorityFilter`, `TicketModal` (`Number()` coercion), `board.utils` stubs + cases. App still runs on mock data. CSS untouched — mapping stays inside the two utils. Done, merged to `phase-3` (`05ffb98`).
3. [x] **API scaffold.** Generate app, wire `@nestjs/config`, connect Atlas, confirm boot. Done, merged via PR #3 (`ccfeed9`).
4. [x] **Persistence.** Mongoose schema, `toTicket` mapper, `TicketsService` with `find(filter)` + rank rule. Unit tests here. Done, merged via PR #3 (`ccfeed9`).
5. [x] **GraphQL layer.** DTOs, resolver, query with args, 3 mutations, `@IsIn` validation. Done, merged via PR #3 (`ccfeed9`).
6. [ ] **Transport swap.** Apollo + Vite proxy, rewrite `useTickets()` internals, add `loading` / `error` / optimistic drag, delete `mock-tickets.ts`. Board fully on real data. Not started.
7. [x] **URL state.** `useUrlState`, move `view` + filters + sort into URL. Done, merged via PR #4 (`c60a28c`).
8. [x] **Shell split.** Extract `TicketsPage`, `BoardView`. Done, merged via PR #5 (`a57d4d2`).
9. [x] **List primitives.** Extract `PriorityBadge`, build `StatusFilter`. Done, merged via PR #6 (`1899e29`).
10. [ ] **List view.** Table, sortable priority header, row actions. Not started.
11. [ ] **QA pass.** Not started.

Steps 6, 10, 11 remain. Worktrees from merged branches never deleted, kept for inspection.

### Deferred to phase 4

- Toast component (banner state shape already right, only render swaps).
- User-defined columns. `String` status already allows it; cost is `@org/types` union to `string`, plus runtime lookup in `BoardColumn` / `ticket-labels`.
- Elastic/Solr search behind `TicketsService.find()`.
- react-router, if deep links are wanted. Move filters into real route state at same time.
- `Promise`-returning mutations, per-mutation `saving` flags.
- Assignee visible in list view (`Avatar` beside title cell).
