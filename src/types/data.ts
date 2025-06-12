export interface Ability {
  id: number;
  slug: string;
  name: string;
  description: string | null;
}

export interface PokemonType {
  name: string;
  effectiveness: TypeEffectiveness;
}

export interface TypeEffectiveness {
  weak_to: string[]; // names of types
  resistant_to: string[];
  immune_to: string[];
}

export type TypeChart = Record<string, TypeEffectiveness>;

export interface Place {
  id: string;
  name: string;
}

