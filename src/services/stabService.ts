import typesData from '@/data/types.json';

export interface StabEffectiveness {
  weak: string[];      // 2x
  resistant: string[]; // 0.5x
  immune: string[];    // 0x
}

function calculateDamageModifier(attackingType: string, defendingType: string): number {
  const defender = typesData[defendingType];
  if (!defender) {
    throw new Error(`Unknown defending type: ${defendingType}`);
  }

  if (defender.weak_to.includes(attackingType)) {
    return 2;
  } else if (defender.resistant_to.includes(attackingType)) {
    return 0.5;
  } else if (defender.immune_to.includes(attackingType)) {
    return 0;
  } else {
    return 1;
  }
}

/**
 * For a given set of types, returns all types that are weak (2x), resistant (0.5x), or immune (0x) to attacks of any of those types.
 * For each defending type, take the maximum effectiveness across all attacking types (2 > 1 > 0.5 > 0).
 * Classify by max effectiveness: 2x goes to weak, 0.5x to resistant, 0x to immune. Skip 1x. Immune only if all attacking types do 0x.
 */
export function getStabEffectiveness(attackingTypes: string[]): StabEffectiveness {
  const weak: string[] = [];
  const resistant: string[] = [];
  const immune: string[] = [];
  const allTypes = Object.keys(typesData);

  for (const defendingType of allTypes) {
    let maxEffectiveness = 0;
    let allZero = true;
    for (const attackingType of attackingTypes) {
      const effectiveness = calculateDamageModifier(attackingType, defendingType);
      if (effectiveness !== 0) allZero = false;
      maxEffectiveness = Math.max(maxEffectiveness, effectiveness);
    }
    if (maxEffectiveness === 2) {
      weak.push(defendingType);
    } else if (maxEffectiveness === 0.5) {
      resistant.push(defendingType);
    } else if (allZero) {
      immune.push(defendingType);
    }
    // skip 1x
  }

  return {
    weak: weak.sort(),
    resistant: resistant.sort(),
    immune: immune.sort(),
  };
}