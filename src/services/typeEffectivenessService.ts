import typesData from "@/data/types.json";

type TypeChart = Record<
  string,
  { weak_to?: string[]; resistant_to?: string[]; immune_to?: string[] }
>;

export interface TypeEffectiveness {
  veryWeak: string[];      // 4x damage
  weak: string[];          // 2x damage
  resistant: string[];     // 0.5x damage
  veryResistant: string[]; // 0.25x damage
  immune: string[];        // 0x damage
}

const emptyEffectiveness = (): TypeEffectiveness => ({
  veryWeak: [],
  weak: [],
  resistant: [],
  veryResistant: [],
  immune: [],
});

/**
 * Defensive type effectiveness for a single- or dual-type Pokémon.
 *
 * Fairy is not present in types.json, so it is filtered out for dual types and
 * treated as Normal for a pure-Fairy Pokémon (matching the WeaknessPanel UI).
 */
export const calculateTypeEffectiveness = (types: string[]): TypeEffectiveness => {
  if (!types || types.length === 0) {
    return emptyEffectiveness();
  }

  // Handle Fairy type: filter it out for dual types, or replace with Normal for pure Fairy
  let filteredTypes = types.filter(type => type !== "Fairy");

  // If Pokemon only has Fairy type, treat it as Normal type for calculations
  if (filteredTypes.length === 0 && types.includes("Fairy")) {
    filteredTypes = ["Normal"];
  }

  if (filteredTypes.length === 0) {
    return emptyEffectiveness();
  }

  const allTypes = Object.keys(typesData);
  const effectiveness: { [key: string]: number } = {};

  // Initialize all types with 1x effectiveness
  allTypes.forEach(type => {
    effectiveness[type] = 1.0;
  });

  // Apply effectiveness for each of the Pokemon's types (excluding Fairy)
  filteredTypes.forEach(pokemonType => {
    const typeData = (typesData as TypeChart)[pokemonType];
    if (typeData) {
      // Apply weaknesses (2x damage)
      typeData.weak_to?.forEach((attackType: string) => {
        effectiveness[attackType] *= 2.0;
      });

      // Apply resistances (0.5x damage)
      typeData.resistant_to?.forEach((attackType: string) => {
        effectiveness[attackType] *= 0.5;
      });

      // Apply immunities (0x damage)
      typeData.immune_to?.forEach((attackType: string) => {
        effectiveness[attackType] = 0;
      });
    }
  });

  // Categorize the results into 5 categories
  const veryWeak: string[] = [];      // 4x damage
  const weak: string[] = [];          // 2x damage
  const resistant: string[] = [];     // 0.5x damage
  const veryResistant: string[] = []; // 0.25x damage
  const immune: string[] = [];        // 0x damage

  Object.entries(effectiveness).forEach(([type, multiplier]) => {
    if (multiplier === 0) {
      immune.push(type);
    } else if (multiplier === 4) {
      veryWeak.push(type);
    } else if (multiplier === 2) {
      weak.push(type);
    } else if (multiplier === 0.5) {
      resistant.push(type);
    } else if (multiplier === 0.25) {
      veryResistant.push(type);
    }
  });

  return { veryWeak, weak, resistant, veryResistant, immune };
};
