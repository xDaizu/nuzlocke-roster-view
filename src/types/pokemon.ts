export interface Pokemon {
  id: number;
  name: {
    english: string;
    japanese?: string;
    chinese?: string;
    french?: string;
    spanish?: string;
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

export type BoxType = 'team' | 'other' | 'graveyard';

export interface TeamPokemon {
  id: string;
  pokemon: Pokemon | null;
  nickname: string;
  level: number;
  ability: string;
  pokeball: PokeballType;
  animated: boolean;
  staticZoom: number; // 1.0 = normal, 1.5 = 150% zoom for static sprites
  animatedZoom: number; // 1.0 = normal, 1.5 = 150% zoom for animated sprites
  place?: string; // Optional, can be empty or 'unknown'
  box: BoxType;
}

export type PokeballType = 'pokeball' | 'superball' | 'sanaball';

export interface PokeballInfo {
  name: string;
  image: string;
}

export interface PanelConfig {
  boxPanel: { columns: number; order: number };
  slotEditor: { columns: number; order: number };
  placesPanel: { columns: number; order: number };
  weaknessPanel: { columns: number; order: number };
  configPanel: { columns: number; order: number };
  appConfigPanel: { columns: number; order: number };
}
