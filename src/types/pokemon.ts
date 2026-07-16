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
  staticZoom: number; // 1.0 = normal, 1.5 = 150% zoom for static sprites
  animatedZoom: number; // 1.0 = normal, 1.5 = 150% zoom for animated sprites
  staticTranslateX: number; // Horizontal offset in px for static sprite centering
  staticTranslateY: number; // Vertical offset in px for static sprite centering
  animatedTranslateX: number; // Horizontal offset in px for animated sprite centering
  animatedTranslateY: number; // Vertical offset in px for animated sprite centering
  place?: string; // Optional, can be empty or 'unknown'
  box: 'team' | 'other' | 'graveyard';
  /** Key of the selected custom sprite (from CUSTOM_SPRITES_BY_POKEMON). Undefined = use official sprite. */
  customSprite?: string;
}

export type PokeballType = 'pokeball' | 'superball' | 'sanaball';

export interface PokeballInfo {
  name: string;
  image: string;
}
