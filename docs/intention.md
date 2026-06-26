# Intention & design decisions

This document captures *why* the project is the way it is — the intent behind the choices,
so changes stay aligned with the original purpose.

## Purpose

A lightweight, personal **companion tool for a Pokémon Nuzlocke run**. During a Nuzlocke a
player must remember a lot of bookkeeping: which Pokémon are in the party, which are benched
in the PC, which have died (and are therefore unusable), where each was caught (the "one
catch per area" rule), and what each one's nickname/ability/ball is. This app is the screen
the player keeps open beside the game to track all of that and to make battle decisions.

The audience is essentially the author and friends following the same run — note the Spanish
UI and the inside-joke nicknames/ball names (e.g. "Sana Ball", graveyard called *"El cielo"*).

## Why these design choices

### Client-only, `localStorage`-backed
There is no account system and no backend on purpose. The tool is single-player, single-device,
and zero-infrastructure — it can be hosted as static files on GitHub Pages for free. Roster
data is small, so `localStorage` (with rolling backups + JSON export) is enough. The
**Export to Clipboard** feature is the manual "sync between devices / share with a friend" path.

### One big stateful page
All state lives in `PublicView`. For an app with one screen and a handful of panels, a global
store (Redux/Zustand) or React Query cache would be over-engineering. The trade-off is that
`PublicView` is large and prop-drills; if the app grows, that's the first thing to refactor.

### `box` as a field, boxes as filters
Rather than three separate arrays, every Pokémon carries a `box` discriminator and the three
boxes are derived by filtering. This makes "moving" a Pokémon a one-field edit and keeps a
single canonical list to save/load — at the cost of the index-vs-id indirection documented in
[architecture.md](./architecture.md).

### Spanish, centralised in `translations.ts`
The intended users are Spanish-speaking, so all copy is Spanish. It's centralised so the tone
(casual, playful) stays consistent and so it *could* be localised later. Keep new strings there.

### Type analysis built in
A Nuzlocke punishes bad matchups harshly (a faint is permanent), so quick type-effectiveness
lookup is a first-class feature, not an afterthought. Two angles are offered deliberately:
- **Defensive** ("what hurts this Pokémon") — for deciding what to send out / keep safe.
- **Offensive STAB danger** ("what does *my* STAB do to the enemy") — for picking attackers.

### The STAB "3x / 0.75x" labelling
STAB (same-type attack bonus) multiplies a move's power by 1.5×. The STAB panel folds that in
when labelling: a 2× type matchup is shown as **"3x"** and a 0.5× as **"0.75x"**. This is
intentional — it shows the *effective* damage of a STAB move, which is what matters in battle.
Don't "fix" these numbers to 2x/0.5x.

### Sprites by convention, not assets
Sprites are pulled live from pokemondb.net by deriving the filename from the English name,
with an automatic static-sprite fallback when an animated GIF is missing. This avoids bundling
hundreds of images, at the cost of depending on an external host and that naming convention.

## Provenance

Scaffolded with [Lovable](https://lovable.dev) (hence `lovable-tagger`, the generic
`vite_react_shadcn_ts` package name, and the full shadcn/ui component set under
`src/components/ui/`). The Lovable origin explains why some scaffolding exists but is unused
(see "known dead code" in [`../CLAUDE.md`](../CLAUDE.md)). Data credits: Pokémon data from
[`fanzeyi/pokemon.json`](https://github.com/fanzeyi/pokemon.json); sprites from pokemondb.net.

## Implications for future work

- **Don't add a backend** unless multi-device sync becomes a hard requirement — it would
  change the project's character. Prefer extending import/export first.
- **Keep copy in `translations.ts`** and in Spanish.
- **Preserve the id-indirection** in slot editing.
- When pruning, the safe-to-remove candidates are listed in `CLAUDE.md` (e.g. `teamStorage.ts`,
  English `abilities.json`, the unused `PublicHeader` import, unused react-query provider).
- The shadcn `ui/` components are a vendored library — treat them as such; don't document or
  refactor them as if they were app code.
