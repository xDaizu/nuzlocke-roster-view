# Overview

**Nuzlocke Roster View** is a single-page web application for tracking the roster of a
Pokémon [Nuzlocke](https://bulbapedia.bulbagarden.net/wiki/Nuzlocke_Challenge) run — a
self-imposed challenge where caught Pokémon are limited per area and fainted Pokémon are
considered permanently "dead."

The app is a personal/companion tool: a player records each Pokémon they catch, where they
caught it, its nickname, ability and Poké Ball, and moves it between three "boxes" as the
run progresses. It also helps with battle planning via type-matchup analysis.

The entire interface is in **Spanish**.

## Core features

### 1. Three roster "boxes"
Every Pokémon belongs to exactly one box (`slot.box`):

| Box | UI label (Spanish) | Meaning |
| --- | --- | --- |
| `team` | **Equipo** | The active party — fixed at 6 slots, shown in 2×3 grid. |
| `other` | **En el PC** | Stored/benched Pokémon (the PC box). Grows dynamically. |
| `graveyard` | **El cielo** ("the sky") | Fainted/dead Pokémon. Grows dynamically. |

### 2. Fixed team header
A pinned banner at the top of the page always shows the 6 team slots with sprites, level,
and Poké Ball. Clicking a team sprite toggles between a static and an animated (GIF) sprite.
Hovering shows a tooltip with the Pokémon's ability description and capture location.

### 3. Per-slot editor
Select any slot to edit it: choose the species (809-entry autocomplete), nickname, level,
ability (Spanish names + description tooltip), Poké Ball type, which box it lives in,
capture location, static/animated sprite toggle, and per-sprite zoom factors. A live
preview renders the chosen sprite + Poké Ball.

### 4. Capture-location panel ("Lugares con captura")
Groups all Pokémon that have an assigned location, listing which Pokémon came from where.

### 5. Type analysis ("Análisis de Tipos")
Pick any Pokémon and see:
- **Defensive matchups** — types it takes 4×, 2×, ½×, ¼×, or 0× damage from.
- **Offensive STAB danger** — which defending types its same-type-attack-bonus (STAB) moves
  hit hard or weakly. Labels fold in the 1.5× STAB multiplier (so a 2× matchup reads "3x").

### 6. Configurable layout
A config panel lets the user reorder the five panels and set each one's column width
(total must be ≤ 6 columns on large screens).

### 7. Persistence & data portability
- **Save / Load** to `localStorage` with rolling versioned backups.
- **Export to Clipboard** copies the full roster as pretty-printed JSON.
- **Default** button loads a demo roster (`src/data/fixtures.ts`).

## Typical user flow

1. Open the app → any previously saved roster auto-loads from `localStorage`.
2. Click a slot → fill in the Pokémon, nickname, level, ability, ball, place, and box.
3. Move Pokémon between Equipo / En el PC / El cielo by changing the slot's box.
4. Use the type analysis panel to plan upcoming battles.
5. Click **Save** (💾) to persist, or **Export to Clipboard** to back up as JSON.

## What it is *not*

- Not multi-user, not a backend service — everything is client-side and per-browser.
- Not a live game integration — data is entered manually.
- Not authenticated — the `/` and `/public` routes are the same public view.

See [intention.md](./intention.md) for *why* it's built this way and
[architecture.md](./architecture.md) for *how*.
