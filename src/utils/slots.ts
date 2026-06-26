import { BoxType, TeamPokemon } from "@/types/pokemon";

/** Create an empty team slot with the app's default zoom/pokeball values. */
export const createEmptySlot = (id: string, box: BoxType = 'team'): TeamPokemon => ({
  id,
  pokemon: null,
  nickname: '',
  level: 1,
  ability: '',
  pokeball: 'pokeball',
  animated: false,
  staticZoom: 1.5, // Default 1.5x zoom for static sprites
  animatedZoom: 1.5, // Default 1.5x zoom for animated sprites
  place: '',
  box,
});

/** Coerce an unknown box value to a valid BoxType, defaulting to 'other'. */
export const normalizeBox = (box: unknown): BoxType =>
  box === 'team' || box === 'other' || box === 'graveyard' ? box : 'other';
