import { describe, it, expect } from 'vitest';
import { getStabEffectiveness } from './stabService';

describe('getStabEffectiveness', () => {
  it('returns correct STAB effectiveness for Bulbasaur (Grass/Poison)', () => {
    // Bulbasaur is Grass/Poison
    const result = getStabEffectiveness(['Grass', 'Poison']);
    expect(result.weak).toEqual(
      expect.arrayContaining([
        'Fairy', 'Grass', 'Ground', 'Rock', 'Water'
      ])
    );
    expect(result.resistant).toEqual(
      expect.arrayContaining([
        'Poison', 'Steel'
      ])
    );
    expect(result.immune).toEqual([]); // No 0x for Grass or Poison
  });

  it('returns correct STAB effectiveness for Psychic', () => {
    const result = getStabEffectiveness(['Psychic']);
    expect(result.weak).toEqual(
      expect.arrayContaining(['Fighting', 'Poison'])
    );
    expect(result.resistant).toEqual(
      expect.arrayContaining(['Steel', 'Psychic'])
    );
    expect(result.immune).toEqual(['Dark']);
  });

  it('returns correct STAB effectiveness for Fire/Ground', () => {
    const result = getStabEffectiveness(['Fire', 'Ground']);
    expect(result.weak).toEqual(
      expect.arrayContaining([
        'Poison', 'Rock', 'Bug', 'Steel', 'Fire', 'Grass', 'Electric', 'Ice'
      ])
    );
    expect(result.resistant).toEqual([]);
    expect(result.immune).toEqual([]);
  });

  it('returns correct STAB effectiveness for Fire/Water', () => {
    const result = getStabEffectiveness(['Fire', 'Water']);
    expect(result.weak).toEqual(
      expect.arrayContaining([
        'Ground', 'Rock', 'Bug', 'Steel', 'Fire', 'Grass', 'Ice'
      ])
    );
    expect(result.resistant).toEqual(
      expect.arrayContaining(['Water', 'Dragon'])
    );
    expect(result.immune).toEqual([]);
  });

  it('returns correct STAB effectiveness for Normal', () => {
    const result = getStabEffectiveness(['Normal']);
    expect(result.weak).toEqual([]);
    expect(result.resistant).toEqual(
      expect.arrayContaining(['Rock', 'Steel'])
    );
    expect(result.immune).toEqual(['Ghost']);
  });
  
  it('returns 2x if ANY of the 2 is 2x', () => {
    const result = getStabEffectiveness(['Fire', 'Ground']);

    expect(result.weak).toContain('Steel');
  });

  
  it('returns 0,5x if both are 0,5x', () => {
    const result = getStabEffectiveness(['Fire', 'Water']);

    expect(result.resistant).toContain('Dragon');
  });

  
  
  it('returns 0,5x if both are 0,5x', () => {
    const result = getStabEffectiveness(['Psychic', 'Electric']);

    expect(result.immune).toEqual([]);
  });
}); 