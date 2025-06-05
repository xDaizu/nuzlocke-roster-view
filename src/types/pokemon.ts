export interface Pokemon {
  id: number;
  name: {
    english: string;
    japanese?: string;
    chinese?: string;
    french?: string;
  };
  type: string[];
  base: {
    HP: number;
    Attack: number;
    Defense: number;
    "Sp. Attack": number;
    "Sp. Defense": number;
    Speed: number;
  };
}

export interface TeamPokemon {
  id: string;
  pokemon: Pokemon | null;
  nickname: string;
  level: number;
  ability: string;
  pokeball: PokeballType;
  animated: boolean;
  zoom: number; // 1.0 = normal, 1.5 = 150% zoom (cropped from sides)
  place?: string; // Optional, can be empty or 'unknown'
}

export type PokeballType = 'pokeball' | 'superball' | 'sanaball';

export interface PokeballInfo {
  name: string;
  image: string;
}
