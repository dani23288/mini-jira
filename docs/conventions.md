# Frontend Conventions

## Component structure

Each component lives in its own folder named after the component, containing:

- `component-name.tsx` — the component itself
- `component-name.types.ts` — its prop types and any related interfaces
- `component-name.module.css` — its styles

Example: `components/search-bar/` → `search-bar.tsx`, `search-bar.types.ts`, `search-bar.module.css`.

A component folder can also hold two optional sibling files when needed:

- `component-name.utils.ts` — pure helper functions used only by this component (e.g. `getTapeRotation` in `ticket-card.utils.ts`).
- `component-name.consts.ts` — local constants, including "mapper" objects that key a value off a prop/state union instead of an inline ternary (e.g. `TICKET_MODAL_TITLE_BY_MODE` in `ticket-modal.consts.ts`, keyed by `TicketModalMode`).

Don't inline logic or magic numbers/ternaries that these files would naturally hold — extract them even on the first pass.

## Modularity

Extract reusable UI into its own component rather than inlining it repeatedly. `Button`, `SearchBar`, and `DropdownMenu` are shared components used across the app — not copy-pasted markup with duplicated styles. A stateful interactive widget (e.g. a dropdown trigger + panel with its own open/close state and click-outside handling) is exactly the kind of thing that belongs in its own component, even if only one place uses it today.

## Naming

- Functions and variables: camelCase (`createTicket`, `handleSubmit`).
- CSS class names: kebab-case (`.menu-item-danger`, `.column-header`). Since CSS Modules classes with hyphens aren't valid JS identifiers, access them with bracket notation: `styles['menu-item']`, not `styles.menuItem`.
- TypeScript interfaces: prefixed with `I` (`ITicket`, `IButtonProps`). Type aliases (unions, primitives) do not get the prefix.
- React components themselves: PascalCase (standard convention, unchanged).

## CSS: no tag/element selectors

Style via explicit classes, not bare tag selectors (no `h1, h2, h3 {}` or `button, input {}`). Exceptions: the universal selector (`*`) for resets like box-sizing, and pseudo-classes like `:focus-visible` — these aren't "element" selectors in the sense being avoided. Singleton root nodes (`html`, `body`, `#root`) get an explicit class in `index.html` (e.g. `class="app-shell"`) rather than being styled by tag name.

## Testing

Spec files live in a `test/` subfolder next to the code they cover, not flat alongside it — e.g. `board/test/board.utils.spec.ts` for `board/board.utils.ts`.

Within `test/`, put reusable pieces in a `stubs/` subfolder rather than inline in the spec file:

- `stubs/<name>.stub.ts` — fixture builder functions (e.g. `makeTicket`, `makeActive` in `stubs/board.utils.stub.ts`).
- `stubs/<name>.cases.ts` — the arrays of cases used by `it.each`, so the spec file only wires cases to assertions.

Prefer `it.each` over near-duplicate `it(...)` blocks whenever multiple tests share the same assertion shape and differ only in input/output. When a cases array mixes differently-shaped inputs (e.g. a `Partial<SomeFilters>` field), give it an explicit type annotation — TypeScript otherwise widens array-literal fields (e.g. a string-literal union narrows to plain `string[]`), which can silently swallow real type errors.

Example: `apps/frontend/src/app/board/test/` → `board.utils.spec.ts`, `stubs/board.utils.stub.ts`, `stubs/board.utils.cases.ts`.

## Shared library structure

Shared code (used by both frontend and the future backend) is grouped by *kind*, not by feature. Each kind is its own Nx package under `packages/shared/<kind>/` (currently `types` and `consts`), and inside it, per-feature files are named after the feature — e.g. `packages/shared/types/src/lib/ticket.ts` and `packages/shared/consts/src/lib/ticket.ts`. A new feature (e.g. "project") would add `project.ts` to each existing lib, re-exported from its `index.ts` — not a new top-level lib.
