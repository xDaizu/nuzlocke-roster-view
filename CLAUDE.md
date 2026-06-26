# CLAUDE.md

Guidance for Claude Code (and humans) working in this repository. This file is the
**quick-reference index**; deeper docs live in [`docs/`](./docs) — read the relevant one
before non-trivial work.

| Doc | Read it when you need… |
| --- | --- |
| [docs/overview.md](./docs/overview.md) | What the app is and does, feature list, user flow |
| [docs/intention.md](./docs/intention.md) | *Why* it exists, design decisions, intended audience |
| [docs/architecture.md](./docs/architecture.md) | Code structure, state flow, component map, deployment |
| [docs/data-model.md](./docs/data-model.md) | Types, the JSON data files, storage keys, sprite URLs |

## What this is (one paragraph)

A single-page web app to track a **Pokémon Nuzlocke** run's roster: a 6-slot **team**,
a **PC box** ("En el PC"), and a **graveyard** ("El cielo") for fainted Pokémon. It also
renders a defensive **type-effectiveness** analysis and an offensive **STAB danger**
report per Pokémon. The UI is in **Spanish**. State persists to `localStorage`. It was
scaffolded with [Lovable](https://lovable.dev) and deploys to GitHub Pages.

## Tech stack

Vite 5 · React 18 · TypeScript · shadcn/ui (Radix primitives) · Tailwind CSS 3 ·
react-router-dom 6 · @tanstack/react-query (mounted but unused) · Vitest.
Build uses `@vitejs/plugin-react-swc`. `@` is an alias for `src/`.

## Commands

```sh
npm run dev        # Vite dev server on http://localhost:8080
npm run build      # production build → dist/
npm run build:dev  # development-mode build
npm run lint       # ESLint (flat config, eslint.config.js)
npm run preview    # preview the production build
npx vitest         # run unit tests (NO `test` script in package.json — call vitest directly)
npx vitest run     # single-run (CI style)
```

Package manager: the repo has **both** `package-lock.json` and `bun.lockb`. `npm` is the
practical default (CI uses `npm ci`); Bun is not installed locally. Pick npm unless told otherwise.

## Conventions

- Functional components only; small and focused. Custom hooks for reusable logic.
- TypeScript: prefer `interface` for object shapes, `type` for unions; avoid `any`.
- Tailwind utility classes for all styling (no CSS modules). Dark purple/slate theme.
- **All user-facing copy is Spanish** and lives in [`src/data/translations.ts`](./src/data/translations.ts) — add strings there, don't hard-code.
- Path imports use the `@/` alias (e.g. `@/components/...`), not relative `../../`.
- Additional rules: see [`.cursor/rules/`](./.cursor/rules) (clean-code, react, typescript, tailwind, codequality).

## Gotchas & known dead code (verified 2026-06-26)

- **Single source of truth** is `allSlots: TeamPokemon[]` in `PublicView.tsx`. The
  `team` / `otherBox` / `graveyardBox` arrays are *derived* by filtering on `slot.box`.
  Editing always finds the real index in `allSlots` by `slot.id` before mutating.
- **Saving requires the user to click Save** (💾 in the Box panel). There is no autosave;
  edits live only in React state until then. Load happens automatically on mount.
- `src/utils/teamStorage.ts` is **dead code** — superseded by `src/services/storageService.ts`
  (different localStorage key and an obsolete `zoom` field). Use `storageService`.
- `src/data/abilities.json` (English) is **unused**; the app reads `abilities_es.json` (Spanish).
- `PublicHeader` is **imported but never rendered** in `PublicView.tsx`.
- `@tanstack/react-query` provider is mounted but **no queries/mutations exist**.
- `PokemonBox` implements drag-and-drop, but `PublicBoxPanel` **does not pass the handlers**,
  so DnD between boxes is currently inert.
- `src/App.css` is not imported (only `src/index.css` is).
- `PublicView.tsx` contains many `console.log` debug statements.
- **WeaknessPanel STAB labels are intentionally "off by 1.5×"**: a 2× matchup is shown as
  "3x" and 0.5× as "0.75x" because STAB attacks already carry a 1.5× multiplier. Not a bug.
- `types.json` has **17 types and no usable Fairy data**; `WeaknessPanel` special-cases
  Fairy (drops it on dual types; treats pure-Fairy as Normal).

## Deployment

GitHub Actions (`.github/workflows/deploy.yml`) on push to `main`: `npm ci` →
`VITE_BASE_PATH=/nuzlocke-roster-view/ npm run build` → `npm run postbuild` (copies
`dist/index.html` → `dist/404.html` for SPA routing) → publishes `dist/` via `gh-pages`.
`App.tsx` only applies the `/nuzlocke-roster-view` router basename when hosted on `*.github.io`.
