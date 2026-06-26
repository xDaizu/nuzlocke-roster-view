# Architecture

A client-only React SPA. There is no server, no API, and no build-time data fetching —
all Pokémon data ships as static JSON bundled by Vite, and all user data lives in the
browser's `localStorage`.

## Bootstrapping

```
index.html
  └─ src/main.tsx            createRoot(...).render(<App/>)
       └─ src/App.tsx        providers + router
```

`App.tsx` mounts, in order:
- `QueryClientProvider` (`@tanstack/react-query`) — **mounted but no queries are used today**.
- `TooltipProvider` (shadcn/Radix tooltips).
- `Toaster` (shadcn) and `Sonner` — two toast systems are both available.
- `BrowserRouter` with a conditional `basename`: only `"/nuzlocke-roster-view"` when the
  host is `*.github.io` in a production build; otherwise `undefined` (root).

Routes:
| Path | Component |
| --- | --- |
| `/` | `PublicView` |
| `/public` | `PublicView` (same component) |
| `*` | `NotFound` |

## The single page: `PublicView.tsx`

`PublicView` is the application. It owns **all** state and passes everything down as props
(no global store, no context beyond the providers above).

### State

| State | Type | Role |
| --- | --- | --- |
| `allSlots` | `TeamPokemon[]` | **Single source of truth.** Every slot in every box. |
| `allPokemon` | `Pokemon[]` | The full Pokédex (loaded once from `pokedex.json`). |
| `selectedSlot` | `number` | Index *within the selected box* currently being edited. |
| `selectedBox` | `'team' \| 'other' \| 'graveyard'` | Which box `selectedSlot` indexes into. |
| `isLoading` | `boolean` | Gates the initial load screen. |
| `panelConfig` | `PanelConfig` | Per-panel column width + display order. |

### Derived data

The three boxes are **computed by filtering**, never stored separately:

```ts
const team        = allSlots.filter(s => (s.box || 'other') === 'team');
const otherBox     = allSlots.filter(s => (s.box || 'other') === 'other');
const graveyardBox = allSlots.filter(s => (s.box || 'other') === 'graveyard');
```

### The id-indirection pattern (important)

`selectedSlot` is an index into a *derived/filtered* array, but mutations must target
`allSlots`. So every update path resolves the slot's stable `id` and then finds its real
index in `allSlots` before calling `updateSlot(actualIndex, updates)`. When you touch slot
editing logic, preserve this: **find by `id`, mutate `allSlots`** — never assume the
filtered index equals the `allSlots` index.

### Lifecycle

- On mount (`useEffect`): `fetchPokemonData()` loads the Pokédex, then
  `storageService.loadTeam()` auto-restores any saved roster into `allSlots`.
- Saving is **explicit** (user clicks Save in `PublicBoxPanel`). There is no autosave.

### Layout / panel system

The five panels render inside a `lg:grid-cols-6` grid. `panelConfig` maps each panel key to
`{ columns, order }`; `PublicView` sorts by `order` and applies a `lg:col-span-N` class
(via a static lookup map so Tailwind's JIT keeps the classes). `PanelConfigPanel` mutates
this config and enforces a soft "≤ 6 columns total" rule.

## Component map

```
PublicView
├─ (fixed header) 6× TeamSlot           team sprites, level, ball, hover tooltip
├─ PublicBoxPanel                        Save / Load / Export / Default buttons
│   └─ 3× PokemonBox  (team/other/graveyard grids; drag-drop wired but inert here)
├─ PublicSlotEditor
│   └─ SlotEditor                        the edit form (species, nickname, level, …)
│       └─ AutocompleteInput             custom combobox (shadcn Command + Popover)
├─ PlacesPanel                           Pokémon grouped by capture location
├─ WeaknessPanel                         defensive matchups + STAB danger
│   ├─ AutocompleteInput
│   └─ uses services/stabService
└─ PanelConfigPanel                      reorder + resize panels
```

Notes:
- **`PublicHeader`** is imported by `PublicView` but never rendered — dead import.
- **`PokemonBox`** has full HTML5 drag-and-drop handlers, but `PublicBoxPanel` does not pass
  `onDragDrop` / `onDragDropExternal`, so reordering by drag is currently inert.
- `SlotEditor` is shared via `PublicSlotEditor`; there is no separate non-public view.

## Services (`src/services/`)

### `storageService.ts` — persistence (active)
A `localStorage` wrapper with safety features:
- Keys: `nuzlocke-roster:team`, `nuzlocke-roster:team-backup-<timestamp>`, `nuzlocke-roster:last-backup`.
- `saveTeam` checks availability + estimated free quota, snapshots the previous value as a
  timestamped backup (keeps `MAX_BACKUPS = 3`), then writes.
- `loadTeam` falls back to the newest parseable backup if the primary key is missing/corrupt.
- Also: `createBackup`, `loadFromBackup`, `restoreFromBackup`, `pruneOldBackups`, `getLastBackupTime`.

> `src/utils/teamStorage.ts` is an **older, unused** implementation (key `nuzlocke-team`,
> obsolete single `zoom` field). Ignore it / candidate for deletion.

### `stabService.ts` — offensive STAB effectiveness (tested)
`getStabEffectiveness(attackingTypes: string[])` → `{ weak, resistant, immune }`.
For each defending type it takes the **max** damage modifier across the attacker's types
(`2 > 1 > 0.5 > 0`) and buckets it: 2× → `weak`, 0.5× → `resistant`, all-0× → `immune`
(1× skipped). Modifiers come from `types.json`. Covered by `stabService.test.ts` (Vitest).

`WeaknessPanel` separately computes **defensive** effectiveness inline (multiplying
`weak_to`/`resistant_to`/`immune_to` across the Pokémon's own types into 4×/2×/½×/¼×/0×
buckets) — that logic is *not* in a service.

## Utilities (`src/utils/pokemonData.ts`)

- `fetchPokemonData()` — dynamic-imports `pokedex.json`, memoised in a module-level cache.
- `getPokemonSpriteUrl(pokemon, animated)` — builds a pokemondb.net Black/White sprite URL
  from the lowercased, hyphenated English name (`.gif` animated / `.png` static).
- `getPokemonSpriteUrl` consumers fall back to the static sprite if the animated GIF 404s.
- `POKEBALL_DATA` — the three ball types and their (wikidex CDN) image URLs.
- `formatPokemonName` — name → slug helper.

## Build & deploy

- **Vite** (`vite.config.ts`): dev server on `:8080`, `@` → `./src`, `componentTagger()`
  plugin only in dev (Lovable), `base` from `VITE_BASE_PATH` env (default `/`).
- **GitHub Pages** (`.github/workflows/deploy.yml`) on push to `main`:
  `npm ci` → build with `VITE_BASE_PATH=/nuzlocke-roster-view/` → `postbuild` copies
  `index.html` to `404.html` (so client-side routes survive a hard refresh) →
  `peaceiris/actions-gh-pages` publishes `dist/`.

See [data-model.md](./data-model.md) for the shapes of `TeamPokemon`, `Pokemon`, and each JSON file.
