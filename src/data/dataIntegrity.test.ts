import { describe, it, expect } from 'vitest';
import { POKEBALL_DATA } from './pokemon/pokeballs';
import pokedex from './pokemon/pokedex.json';
import types from './pokemon/types.json';
import placesEs from './places_es.json';
import abilitiesEs from './pokemon/abilities_es.json';
import type { Ability } from '@/types';

// Helper to check object fields and return missing ones
function getMissingFields(obj: any, fields: string[]) {
  return fields.filter(f => !Object.prototype.hasOwnProperty.call(obj, f));
}

describe('Data Integrity', () => {
  it('should load all pokeballs and have required fields', () => {
    expect(POKEBALL_DATA).toBeTypeOf('object');
    Object.entries(POKEBALL_DATA).forEach(([key, value]) => {
      expect(value).toBeTypeOf('object');
      expect(getMissingFields(value, ['name', 'image'])).toEqual([]);
      expect(typeof value.name).toBe('string');
      expect(typeof value.image).toBe('string');
    });
    expect(POKEBALL_DATA).toMatchSnapshot();
  });

  it('should load pokedex and each entry has id, name, type, base', () => {
    expect(Array.isArray(pokedex)).toBe(true);
    pokedex.forEach((entry) => {
      expect(getMissingFields(entry, ['id', 'name', 'type', 'base'])).toEqual([]);
      expect(typeof entry.id).toBe('number');
      expect(typeof entry.name).toBe('object');
      expect(Array.isArray(entry.type)).toBe(true);
      expect(typeof entry.base).toBe('object');
    });
    expect(pokedex).toMatchSnapshot();
  });

  it('should load abilities and each entry matches Ability type', () => {
    const abilitiesData: Ability[] = abilitiesEs as Ability[];
    expect(Array.isArray(abilitiesData)).toBe(true);
    abilitiesData.forEach((ability, i) => {
      const missing = getMissingFields(ability, ['id', 'slug', 'name', 'description']);
      if (missing.length > 0) {
        // eslint-disable-next-line no-console
        console.error(
          `Entry at index ${i} in abilitiesEs is missing fields: [${missing.join(', ')}]`,
          ability
        );
      }
      expect(missing, `Entry at index ${i} in abilitiesEs is missing fields: [${missing.join(', ')}]`).toEqual([]);
      expect(typeof ability.id).toBe('number');
      expect(typeof ability.slug).toBe('string');
      expect(typeof ability.name).toBe('string');
      expect(typeof ability.description === 'string' || ability.description === null).toBe(true);
    });
    expect(abilitiesData).toMatchSnapshot();
  });

  it('should load types and each entry has weak_to, resistant_to, immune_to', () => {
    expect(typeof types).toBe('object');
    Object.entries(types).forEach(([typeName, typeObj]) => {
      expect(getMissingFields(typeObj, ['weak_to', 'resistant_to', 'immune_to'])).toEqual([]);
      expect(Array.isArray(typeObj.weak_to)).toBe(true);
      expect(Array.isArray(typeObj.resistant_to)).toBe(true);
      expect(Array.isArray(typeObj.immune_to)).toBe(true);
    });
    expect(types).toMatchSnapshot();
  });

  it('should load placesEs and be an array of objects with id and nombre', () => {
    expect(Array.isArray(placesEs)).toBe(true);
    placesEs.forEach((place) => {
      expect(getMissingFields(place, ['id', 'nombre'])).toEqual([]);
      expect(typeof place.id).toBe('string');
      expect(typeof place.nombre).toBe('string');
    });
    expect(placesEs).toMatchSnapshot();
  });
}); 