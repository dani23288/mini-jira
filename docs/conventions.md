# Frontend Conventions

## Component structure

Each component: own folder, named after component, holding:

- `component-name.tsx` — the component
- `component-name.types.ts` — prop types + related interfaces
- `component-name.module.css` — styles

Example: `components/search-bar/` → `search-bar.tsx`, `search-bar.types.ts`, `search-bar.module.css`.

Two optional siblings, when needed:

- `component-name.utils.ts` — pure helpers, used only by this component (e.g. `getTapeRotation` in `ticket-card.utils.ts`).
- `component-name.consts.ts` — local constants, "mapper" objects included (key a value off prop/state union instead of inline ternary — e.g. `TICKET_MODAL_TITLE_BY_MODE` in `ticket-modal.consts.ts`, keyed by `TicketModalMode`).

Don't inline logic or magic numbers/ternaries these files would naturally hold — extract even on first pass.

Extraction rule not components-only — route files under `app/` too. Pure logic (collision detection, derived data) → sibling `.utils.ts`, even if defined inline via `useCallback`/`useMemo` in route component. One-off UI copy (dialog title, button label) → `.consts.ts`, single call site or not.

Mapper (`X_BY_Y`): for values not mechanically derivable from key — real different copy per mode, e.g. `TICKET_MODAL_TITLE_BY_MODE`. Just a fixed transform of the key (prefix, template)? Small function instead, skip mapper.

One component per file. Tightly-coupled variant (drag-overlay, body sub-render) → own file, same folder. Not stacked as extra exports in main `.tsx`.

## Modularity

Extract reusable UI into own component, don't inline repeatedly. `Button`, `SearchBar`, `DropdownMenu` — shared components used across app, not copy-pasted markup with duplicated styles. Stateful interactive widget (dropdown trigger + panel, own open/close state, click-outside handling) → own component, even if only one place uses it today.

Same for small derived expressions, not just markup — value computed identically at 2+ sites (`` `var(--color-priority-${priority})` ``, built separately in `priority-filter.tsx` + `ticket-card.tsx`) → named helper, not re-derived per site.

## Code clarity

Multi-condition filter/predicate: extract each condition into named boolean helper (`matchesQuery`, `matchesPriority`, ...), don't stack anonymous `if` guards. All-`return false` guards → combine into one condition, if it doesn't cost readability.

Comments: one line, max. Needs more? Extract into named function/hook instead — name carries the "why". Paragraph comment above a block = sign block should be its own function, not sign it needs more prose.

Prefer spread over field-by-field relist (`{...menuPosition}`, not `{ top: menuPosition.top, left: menuPosition.left, right: menuPosition.right, width: menuPosition.width }`) when shape matches exactly.

## Naming

- Functions, variables: camelCase (`createTicket`, `handleSubmit`).
- CSS class names: kebab-case (`.menu-item-danger`, `.column-header`). CSS Modules classes with hyphens aren't valid JS identifiers — bracket notation: `styles['menu-item']`, not `styles.menuItem`.
- TypeScript interfaces: `I`-prefixed (`ITicket`, `IButtonProps`). Type aliases (unions, primitives) — no prefix.
- React components: PascalCase (standard, unchanged).

## CSS: no tag/element selectors

Explicit classes, not bare tag selectors — no `h1, h2, h3 {}` or `button, input {}`. Exceptions: universal selector (`*`) for resets like box-sizing, pseudo-classes like `:focus-visible` — not "element" selectors in the sense being avoided. Singleton root nodes (`html`, `body`, `#root`) → explicit class in `index.html` (e.g. `class="app-shell"`), not styled by tag name.

## CSS: tokens, not magic values

Every color: `var(--color-*)` from `tokens.css`. No hex/rgb/rgba literals in component CSS, overlay tints included. Caught duplicate: `confirm-dialog.module.css` + `ticket-modal.module.css` both hardcode identical `rgba(74, 53, 64, 0.35)` overlay tint — should be one `--color-overlay` token, reused. Matters more here than usual — app has light/dark themes, hardcoded literal doesn't flip with theme like a token does.

Repeated magic number (size, width): same deal. Shows up 2+ times, or is real design decision (avatar diameter, column min-width) → token or named const, not bare literal.

## Testing

Spec files: `test/` subfolder next to code they cover, not flat alongside — e.g. `board/test/board.utils.spec.ts` for `board/board.utils.ts`.

Within `test/`, reusable pieces → `stubs/` subfolder, not inline in spec file:

- `stubs/<name>.stub.ts` — fixture builder functions (e.g. `makeTicket`, `makeActive` in `stubs/board.utils.stub.ts`).
- `stubs/<name>.cases.ts` — arrays of cases for `it.each`, spec file just wires cases to assertions.

Prefer `it.each` over near-duplicate `it(...)` blocks whenever multiple tests share assertion shape, differ only in input/output. Cases array mixes differently-shaped inputs (e.g. a `Partial<SomeFilters>` field)? Give it explicit type annotation — TypeScript otherwise widens array-literal fields (string-literal union narrows to plain `string[]`), can silently swallow real type errors.

Example: `apps/frontend/src/app/board/test/` → `board.utils.spec.ts`, `stubs/board.utils.stub.ts`, `stubs/board.utils.cases.ts`.

## Correctness gotchas

No `localeCompare` on opaque/ordinal strings — rank keys, IDs, sort keys. Locale-aware collation, not guaranteed byte-order — can silently reorder results per locale/environment. Plain `<`/`>` comparison instead (`a.rank < b.rank ? -1 : a.rank > b.rank ? 1 : 0`). Save `localeCompare` for real user-facing text. Already broke once in PR #2 — fixed to manual comparator, reasoning on record, then silently reverted back to `localeCompare` in a later commit. Watch the regression, not just the first pass.

Optional entity field fed from string form state: empty string → `undefined` before submit (`value || undefined`, or `value.trim() || undefined` when whitespace-only should count as empty too) — see `handleSubmit` in `ticket-modal.tsx`. Keeps "no value" as absence everywhere, not empty string some places, `undefined` others.

## Shared library structure

Shared code (frontend + future backend) grouped by *kind*, not feature. Each kind: own Nx package under `packages/shared/<kind>/` (currently `types`, `consts`). Inside: per-feature files named after feature — e.g. `packages/shared/types/src/lib/ticket.ts`, `packages/shared/consts/src/lib/ticket.ts`. New feature (e.g. "project") → add `project.ts` to each existing lib, re-export from `index.ts` — not new top-level lib.
