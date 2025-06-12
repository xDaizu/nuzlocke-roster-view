import { Pokemon } from "@/types/pokemon";
import { SPRITE_CONFIG } from "@/constants/pokemon";
import { POKEBALL_DATA } from "@/data/pokemon/pokeballs";

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
