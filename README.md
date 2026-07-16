# Nuzlocke Roster View

A web app for tracking your Pokémon Nuzlocke run — team, PC box, and graveyard — with a live public view.

## Stack

- Vite + React + TypeScript
- shadcn/ui + Tailwind CSS

## Development

Node.js and npm are required.

```sh
git clone <YOUR_GIT_URL>
cd nuzlocke-roster-view
npm install
npm run dev
```

The dev server starts at `http://localhost:8080` with hot reload.

## Build & deploy

```sh
npm run build   # outputs to dist/
```

The project deploys to GitHub Pages. The base path is set automatically via `VITE_BASE_PATH`.

## Custom sprites

Some Pokémon support custom OC sprites as an alternative to the official artwork. These are discovered automatically at build time from `src/assets/custom-sprites/{pokemonId}/`.

To add a new custom sprite:
1. Drop the PNG in `src/assets/custom-sprites/{pokemonId}/YourSprite_OC_Variant.png`
2. Add an entry in `src/data/customSpritesMetadata.ts` with the display name and artist credit

In the slot editor, the **Oficial / Custom** switch will be enabled for any Pokémon that has custom sprites available.

## Credits

- Pokémon data from [fanzeyi/pokemon.json](https://github.com/fanzeyi/pokemon.json)
- Official sprites from [Pokémon Database](https://pokemondb.net/)
- **Remy (Latias OC) — Normal** sprite by [6ancho](https://x.com/6ancho_)
- **Remy (Latias OC) — Normal 2** sprite by [6ancho](https://x.com/6ancho_)
