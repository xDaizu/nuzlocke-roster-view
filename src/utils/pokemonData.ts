import { Pokemon } from "@/types/pokemon";
import { SPRITE_CONFIG } from "@/constants/pokemon";
import { POKEBALL_DATA } from "@/data/pokemon/pokeballs";
import type { TeamPokemon } from '../types/pokemon';

// Re-export POKEBALL_DATA for backward compatibility
export { POKEBALL_DATA };

export const getPokemonSpriteUrl = (pokemon: Pokemon, animated: boolean = false): string => {
  const name = pokemon.name.english.toLowerCase().replace(/[^a-z0-9]/g, '-').replace(/-+/g, '-').replace(/-$/, '');
  const extension = animated ? SPRITE_CONFIG.EXTENSIONS.ANIMATED : SPRITE_CONFIG.EXTENSIONS.STATIC;
  const folder = animated ? SPRITE_CONFIG.FOLDERS.ANIMATED : SPRITE_CONFIG.FOLDERS.STATIC;
  return `${SPRITE_CONFIG.BASE_URL}/${folder}/${name}.${extension}`;
};

export const formatPokemonName = (name: string): string => {
  return name.toLowerCase().replace(/[^a-z0-9]/g, '-').replace(/-+/g, '-').replace(/^-|-$/g, '');
};

let pokemonDataCache: Pokemon[] | null = null;

export const __clearPokemonDataCache = () => { pokemonDataCache = null; };

export const fetchPokemonData = async (importFn?: () => Promise<{ default: Pokemon[] }>): Promise<Pokemon[]> => {
  if (pokemonDataCache) {
    return pokemonDataCache;
  }
  
  try {
    const data = (await (importFn ? importFn() : import("@/data/pokemon/pokedex.json"))).default;
    pokemonDataCache = data;
    return data;
  } catch (error) {
    console.error('Failed to load Pokemon data:', error);
    return [];
  }
};

/**
 * Loads fixtures and transforms them into TeamPokemon[] using the same logic as the app.
 * @param fixtures - The raw fixture data
 * @param allPokemon - The full list of Pokemon
 */
export function loadFixturesToTeamPokemon(
  fixtures: any[],
  allPokemon: Pokemon[]
): TeamPokemon[] {
  const newSlots = fixtures.map((fixture, index) => {
    const pokemon = allPokemon.find(p =>
      p.name.english.toLowerCase() === fixture.name.toLowerCase()
    );

    // Accept both 'other' and 'pc' as 'other' for box
    let box: 'team' | 'other' | 'graveyard' = 'team';
    if (fixture.box === 'team' || fixture.box === 'graveyard') {
      box = fixture.box;
    } else {
      box = 'other';
    }

    return {
      id: `fixture-slot-${index}`,
      pokemon: pokemon || null,
      nickname: fixture.nickname,
      level: fixture.level || 1,
      ability: fixture.ability || '',
      pokeball: fixture.pokeball || 'pokeball',
      animated: false,
      staticZoom: 1.5,
      animatedZoom: 1.5,
      place: fixture.place || '',
      box,
      dead: typeof fixture.dead === 'boolean' ? fixture.dead : false,
    };
  });

  return newSlots;
}
