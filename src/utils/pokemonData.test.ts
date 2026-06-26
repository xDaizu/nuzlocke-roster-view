import { describe, it, expect } from 'vitest';
import { getPokemonSpriteUrl } from './pokemonData';
import { Pokemon } from '@/types/pokemon';

const makePokemon = (english: string): Pokemon => ({
  id: 1,
  name: { english },
  type: ['Normal'],
  base: {
    HP: 1,
    Attack: 1,
    Defense: 1,
    'Sp. Attack': 1,
    'Sp. Defense': 1,
    Speed: 1,
  },
});

describe('getPokemonSpriteUrl', () => {
  it('builds a static PNG url by default', () => {
    expect(getPokemonSpriteUrl(makePokemon('Bulbasaur'))).toBe(
      'https://img.pokemondb.net/sprites/black-white/normal/bulbasaur.png'
    );
  });

  it('builds an animated GIF url when requested', () => {
    expect(getPokemonSpriteUrl(makePokemon('Bulbasaur'), true)).toBe(
      'https://img.pokemondb.net/sprites/black-white/anim/normal/bulbasaur.gif'
    );
  });

  it('sanitizes names with spaces and punctuation', () => {
    expect(getPokemonSpriteUrl(makePokemon('Mr. Mime'))).toBe(
      'https://img.pokemondb.net/sprites/black-white/normal/mr-mime.png'
    );
  });

  it('strips trailing separators from symbol-only suffixes', () => {
    expect(getPokemonSpriteUrl(makePokemon('Nidoran♀'))).toBe(
      'https://img.pokemondb.net/sprites/black-white/normal/nidoran.png'
    );
  });
});
