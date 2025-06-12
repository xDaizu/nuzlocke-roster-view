import typesData from '@/data/types.json';

export interface StabEffectiveness {
  weak: string[];      // 2x
  resistant: string[]; // 0.5x
  immune: string[];    // 0x
}

/**
 * For a given set of types, returns all types that are weak (2x), resistant (0.5x), or immune (0x) to attacks of any of those types.
 * For each defending type, show the best effectiveness (2x > 1x > 0.5x > 0x) that any attacking type can achieve.
 */
export function getStabEffectiveness(types: string[]): StabEffectiveness {
  const allTypes = Object.keys(typesData);
  const bestEffect: Record<string, number> = {};

  for (const defendType of allTypes) {
    let max = 1;
    let allHalf = true;
    let allZero = true;
    for (const attackType of types) {
      const data = (typesData as any)[attackType];
      if (!data) continue;
      if (data.weak_to?.includes(defendType)) {
        max = Math.max(max, 2);
        allHalf = false;
        allZero = false;
      } else if (data.resistant_to?.includes(defendType)) {
        max = Math.max(max, 0.5);
        allZero = false;
      } else if (data.immune_to?.includes(defendType)) {
        max = Math.max(max, 0);
        allHalf = false;
      } else {
        allHalf = false;
        allZero = false;
      }
    }
    // 2x if any type is 2x
    if (max === 2) {
      bestEffect[defendType] = 2;
    } else if (allHalf) {
      bestEffect[defendType] = 0.5;
    } else if (allZero) {
      bestEffect[defendType] = 0;
    }
    // else: not included (1x or mixed)
  }

  return {
    weak: Object.keys(bestEffect).filter(t => bestEffect[t] === 2).sort(),
    resistant: Object.keys(bestEffect).filter(t => bestEffect[t] === 0.5).sort(),
    immune: Object.keys(bestEffect).filter(t => bestEffect[t] === 0).sort(),
  };
} 