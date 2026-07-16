import { CUSTOM_SPRITES_METADATA } from './customSpritesMetadata';

export interface CustomSpriteEntry {
  key: string;
  name: string;
  artist: string;
  url: string;
}

// Discovered at build time — no runtime fetch needed.
const spriteModules = import.meta.glob<string>(
  '../assets/custom-sprites/**/*.png',
  { eager: true, query: '?url', import: 'default' },
);

export const CUSTOM_SPRITES_BY_POKEMON: Record<number, CustomSpriteEntry[]> = {};

for (const [modulePath, url] of Object.entries(spriteModules)) {
  const match = modulePath.match(/\/(\d+)\/([^/]+)\.png$/);
  if (!match) continue;

  const pokemonId = parseInt(match[1], 10);
  const fileBasename = match[2];
  const meta = CUSTOM_SPRITES_METADATA[fileBasename];
  if (!meta) continue;

  if (!CUSTOM_SPRITES_BY_POKEMON[pokemonId]) {
    CUSTOM_SPRITES_BY_POKEMON[pokemonId] = [];
  }
  CUSTOM_SPRITES_BY_POKEMON[pokemonId].push({ key: fileBasename, ...meta, url });
}

export function getCustomSpritesForPokemon(pokemonId: number): CustomSpriteEntry[] {
  return CUSTOM_SPRITES_BY_POKEMON[pokemonId] ?? [];
}

export function getCustomSpriteUrl(pokemonId: number, key: string): string | undefined {
  return CUSTOM_SPRITES_BY_POKEMON[pokemonId]?.find((s) => s.key === key)?.url;
}
