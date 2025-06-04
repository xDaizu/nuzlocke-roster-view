
import { Pokemon, PokeballInfo, PokeballType } from "@/types/pokemon";

export const POKEBALL_DATA: Record<PokeballType, PokeballInfo> = {
  pokeball: {
    name: "Pokeball",
    image: "https://images.wikidexcdn.net/mwuploads/wikidex/6/6a/latest/20230115164405/Pok%C3%A9_Ball_EP.png"
  },
  superball: {
    name: "Superball", 
    image: "https://images.wikidexcdn.net/mwuploads/wikidex/3/3f/latest/20230115164421/Super_Ball_EP.png"
  },
  sanaball: {
    name: "Sana Ball",
    image: "https://images.wikidexcdn.net/mwuploads/wikidex/0/08/latest/20230115165144/Sana_Ball_EP.png"
  }
};

export const getPokemonSpriteUrl = (pokemon: Pokemon, animated: boolean = false): string => {
  const name = pokemon.name.english.toLowerCase().replace(/[^a-z0-9]/g, '-').replace(/-+/g, '-').replace(/-$/, '');
  const extension = animated ? 'gif' : 'png';
  const folder = animated ? 'anim/normal' : 'normal';
  return `https://img.pokemondb.net/sprites/black-white/${folder}/${name}.${extension}`;
};

export const formatPokemonName = (name: string): string => {
  return name.toLowerCase().replace(/[^a-z0-9]/g, '-').replace(/-+/g, '-').replace(/^-|-$/g, '');
};

let pokemonDataCache: Pokemon[] | null = null;

export const fetchPokemonData = async (): Promise<Pokemon[]> => {
  if (pokemonDataCache) {
    return pokemonDataCache;
  }
  
  try {
    const response = await fetch('https://raw.githubusercontent.com/fanzeyi/pokemon.json/master/pokedex.json');
    const data = await response.json();
    pokemonDataCache = data;
    return data;
  } catch (error) {
    console.error('Failed to fetch Pokemon data:', error);
    return [];
  }
};
