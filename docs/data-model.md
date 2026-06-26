# Data model & data files

All app data is either a TypeScript type (`src/types/pokemon.ts`), a static JSON file
(`src/data/`), or a `localStorage` entry. Counts below are as of 2026-06-26.

## Core types — `src/types/pokemon.ts`

### `Pokemon`
The Pokédex entry shape (matches `pokedex.json`):
```ts
interface Pokemon {
  id: number;
  name: { english: string; japanese?: string; chinese?: string; french?: string };
  type: string[];                       // 1–2 types, e.g. ["Grass", "Poison"]
  base: { HP; Attack; Defense; "Sp. Attack"; "Sp. Defense"; Speed };  // all number
}
```

### `TeamPokemon`
A roster slot — the unit that is created, edited, filtered into boxes, and persisted:
```ts
interface TeamPokemon {
  id: string;            // stable slot id, e.g. "slot-0", "fixture-slot-2", "other-1719..."
  pokemon: Pokemon | null;
  nickname: string;
  level: number;         // 1–100
  ability: string;       // ability *slug* (matches abilities_es.json `slug`)
  pokeball: PokeballType;
  animated: boolean;     // show animated GIF sprite vs static PNG
  staticZoom: number;    // sprite scale for static sprite (default 1.5)
  animatedZoom: number;  // sprite scale for animated sprite (default 1.5)
  place?: string;        // capture-location id (matches places_es.json `id`), '' , or 'unknown'
  box: 'team' | 'other' | 'graveyard';
}

type PokeballType = 'pokeball' | 'superball' | 'sanaball';
```

> `id` is the join key for editing: filtered-box index → find slot in `allSlots` by `id` →
> mutate. `ability` and `place` store **ids/slugs**, not display names — names are looked up
> from the JSON data at render time.

## Static data files — `src/data/`

| File | Count | Shape | Used? |
| --- | --- | --- | --- |
| `pokedex.json` | 809 | `Pokemon` (see above) | ✅ species list, sprites |
| `types.json` | 17 | `{ [Type]: { weak_to[]; resistant_to[]; immune_to[] } }` | ✅ type analysis & STAB |
| `abilities_es.json` | 307 | `{ id; slug; name; description }` (Spanish) | ✅ ability dropdowns + tooltips |
| `abilities.json` | 191 | `{ name; description; genfamily[] }` (English) | ❌ **unused** |
| `places_es.json` | 68 | `{ id; nombre }` (Spanish; Sinnoh routes) | ✅ capture-location picker |
| `translations.ts` | — | nested `const` object of Spanish UI strings | ✅ all UI copy |
| `fixtures.ts` | 7 | demo roster entries (name/nickname/level/place/box/ability/pokeball) | ✅ "Default" button |

### `types.json` & the Fairy caveat
`types.json` defines defensive relations for **17** types and does **not** carry usable
Fairy data. `WeaknessPanel` therefore special-cases Fairy: it drops Fairy from dual-type
calculations, and treats a pure-Fairy Pokémon as Normal. `stabService` simply iterates the
17 keys present. If you ever add full Fairy support, update `types.json` *and* remove the
special-casing in `WeaknessPanel`.

### Effectiveness semantics
- **Defensive** (in `WeaknessPanel`): start every attacking type at 1×, then for each of the
  Pokémon's own types multiply by 2 (`weak_to`), 0.5 (`resistant_to`), or set 0 (`immune_to`).
  Bucket the products into 4× / 2× / ½× / ¼× / 0×.
- **Offensive STAB** (in `stabService`): for each defending type, take the **max** modifier the
  attacker's type(s) deal; bucket 2× → weak, 0.5× → resistant, all-0× → immune.

### `abilities_es.json` vs `abilities.json`
The app uses the **Spanish** `abilities_es.json` exclusively, keyed by `slug`
(`TeamPokemon.ability` stores the slug). The English `abilities.json` is not imported anywhere.

## Sprite & image URLs (not stored — derived)

Built at render time in `src/utils/pokemonData.ts`:
- **Pokémon sprites** — `https://img.pokemondb.net/sprites/black-white/{normal|anim/normal}/{name}.{png|gif}`
  where `{name}` is the English name lowercased and non-alphanumerics collapsed to `-`.
  Animated GIF failures fall back to the static PNG via the `<img onError>` handler.
- **Poké Balls** — fixed wikidex CDN URLs in `POKEBALL_DATA` (`pokeball`, `superball`, `sanaball`).

## `localStorage` keys (written by `storageService.ts`)

| Key | Contents |
| --- | --- |
| `nuzlocke-roster:team` | the current roster — `JSON.stringify(TeamPokemon[])` |
| `nuzlocke-roster:team-backup-<timestamp>` | timestamped snapshots (up to 3 kept) |
| `nuzlocke-roster:last-backup` | epoch-ms of the last backup |

> The unused legacy `src/utils/teamStorage.ts` would write a different key (`nuzlocke-team`)
> with an obsolete `zoom` field — not used by the app.
