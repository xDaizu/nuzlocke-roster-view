import { describe, it, expect, vi, beforeEach } from 'vitest';
import { POKEBALL_DATA, getPokemonSpriteUrl, formatPokemonName, fetchPokemonData, __clearPokemonDataCache } from './pokemonData';
import type { Pokemon } from '@/types/pokemon';

const mockPokemon: Pokemon = {
  id: 1,
  name: { english: 'Bulbasaur' },
  type: ['Grass', 'Poison'],
  base: {
    HP: 45,
    Attack: 49,
    Defense: 49,
    'Sp. Attack': 65,
    'Sp. Defense': 65,
    Speed: 45,
  },
};

describe('POKEBALL_DATA', () => {
  it('should contain correct pokeball info', () => {
    expect(POKEBALL_DATA.pokeball.name).toBe('Pokeball');
    expect(POKEBALL_DATA.superball.name).toBe('Superball');
    expect(POKEBALL_DATA.sanaball.name).toBe('Sana Ball');
  });
});

describe('getPokemonSpriteUrl', () => {
  it('returns correct static sprite url', () => {
    const url = getPokemonSpriteUrl(mockPokemon);
    expect(url).toBe('https://img.pokemondb.net/sprites/black-white/normal/bulbasaur.png');
  });
  it('returns correct animated sprite url', () => {
    const url = getPokemonSpriteUrl(mockPokemon, true);
    expect(url).toBe('https://img.pokemondb.net/sprites/black-white/anim/normal/bulbasaur.gif');
  });
});

describe('formatPokemonName', () => {
  it('formats names to kebab-case', () => {
    expect(formatPokemonName('Mr. Mime')).toBe('mr-mime');
    expect(formatPokemonName("Farfetch'd")).toBe('farfetch-d');
    expect(formatPokemonName('Porygon-Z')).toBe('porygon-z');
    expect(formatPokemonName('  Pikachu  ')).toBe('pikachu');
  });
});

describe('fetchPokemonData', () => {
  beforeEach(() => {
    __clearPokemonDataCache();
  });
  it('returns pokemon data from injected importFn', async () => {
    const mockData = [mockPokemon];
    const data = await fetchPokemonData(() => Promise.resolve({ default: mockData }));
    expect(data).toEqual(mockData);
  });
  it('returns empty array on error from injected importFn', async () => {
    const data = await fetchPokemonData(() => Promise.reject(new Error('fail')));
    expect(data).toEqual([]);
  });
}); 