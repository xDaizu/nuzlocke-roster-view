import { describe, it, expect, beforeAll } from 'vitest';
import { pokemonFixtures } from './fixtures';
import pokedexData from './pokemon/pokedex.json';
import abilitiesData from './pokemon/abilities_es.json';
import placesData from './pokemon/places_es.json';
import { POKEBALL_DATA } from '../utils/pokemonData';
import type { TeamPokemon, Pokemon } from '../types/pokemon';
import { loadFixturesToTeamPokemon } from '../utils/pokemonData';

describe('Fixtures Data Integrity', () => {
  let pokemonNames: Set<string>;
  let abilityIds: Set<string>;
  let placeIds: Set<string>;
  let pokeballTypes: Set<string>;
  let allPokemon: Pokemon[];
  let processedFixtures: TeamPokemon[];

  beforeAll(() => {
    // Create lookup sets for validation
    pokemonNames = new Set(pokedexData.map(pokemon => pokemon.name.english));
    abilityIds = new Set(abilitiesData.map(ability => ability.slug));
    placeIds = new Set(placesData.map(place => place.id));
    pokeballTypes = new Set(Object.keys(POKEBALL_DATA));
    allPokemon = pokedexData as Pokemon[];

    // Use the same loader as the app
    processedFixtures = loadFixturesToTeamPokemon(pokemonFixtures, allPokemon);
  });

  // Replicate the app's fixture processing logic
  function processFixturesLikeApp(fixtures: any[], allPokemon: Pokemon[]): TeamPokemon[] {
    const newSlots = fixtures.map((fixture, index) => {
      const pokemon = allPokemon.find(p => 
        p.name.english.toLowerCase() === fixture.name.toLowerCase()
      );
      
      return {
        id: `fixture-slot-${index}`,
        pokemon: pokemon || null,
        nickname: fixture.nickname,
        level: fixture.level || 1,
        ability: (fixture as any).ability || '',
        pokeball: (fixture as any).pokeball || 'pokeball',
        animated: false,
        staticZoom: 1.5,
        animatedZoom: 1.5,
        place: fixture.place || '',
        box: fixture.box || 'team',
      };
    });

    // Apply the same box normalization as the app
    const finalSlots = newSlots.map(slot => ({ 
      ...slot, 
      box: (slot.box === 'team' || slot.box === 'other' || slot.box === 'graveyard') ? slot.box : 'other' 
    } as TeamPokemon));

    return finalSlots;
  }

  describe('Fixtures Loading', () => {
    it('should load fixtures without errors', () => {
      expect(pokemonFixtures, 'pokemonFixtures should be defined').toBeDefined();
      expect(Array.isArray(pokemonFixtures), 'pokemonFixtures should be an array').toBe(true);
      expect(pokemonFixtures.length, 'pokemonFixtures should not be empty').toBeGreaterThan(0);
    });

    it('should have all required properties for each fixture', () => {
      pokemonFixtures.forEach((fixture, index) => {
        expect(fixture, `Fixture at index ${index} is missing 'name':\n${JSON.stringify(fixture, null, 2)}`).toHaveProperty('name');
        expect(fixture, `Fixture at index ${index} is missing 'nickname':\n${JSON.stringify(fixture, null, 2)}`).toHaveProperty('nickname');
        expect(fixture, `Fixture at index ${index} is missing 'level':\n${JSON.stringify(fixture, null, 2)}`).toHaveProperty('level');
        expect(fixture, `Fixture at index ${index} is missing 'box':\n${JSON.stringify(fixture, null, 2)}`).toHaveProperty('box');
        expect(fixture, `Fixture at index ${index} is missing 'pokeball':\n${JSON.stringify(fixture, null, 2)}`).toHaveProperty('pokeball');
      });
    });

    it('should process fixtures using app logic without errors', () => {
      expect(processedFixtures, 'processedFixtures should be defined').toBeDefined();
      expect(Array.isArray(processedFixtures), 'processedFixtures should be an array').toBe(true);
      expect(processedFixtures.length, 'processedFixtures should match fixture count').toBe(pokemonFixtures.length);
    });

    it('should successfully find Pokemon for all fixtures when processed by app', () => {
      const missingPokemon: string[] = [];
      processedFixtures.forEach((processed, index) => {
        if (!processed.pokemon) {
          const originalFixture = pokemonFixtures[index];
          missingPokemon.push(`  - [${index}] "${originalFixture.name}" (nickname: ${originalFixture.nickname}) could not be found in Pokemon data`);
        }
      });
      expect(missingPokemon, `Some fixtures could not be matched to a Pokemon:\n${missingPokemon.join('\n')}`).toEqual([]);
    });
  });

  describe('Pokemon Name Validation', () => {
    it('should have valid Pokemon names that exist in the Pokedex', () => {
      const invalidPokemon: string[] = [];
      pokemonFixtures.forEach((fixture, index) => {
        if (!pokemonNames.has(fixture.name)) {
          invalidPokemon.push(`  - [${index}] "${fixture.name}" (nickname: ${fixture.nickname}) is not in the Pokedex`);
        }
      });
      expect(invalidPokemon, `Invalid Pokemon names found in fixtures:\n${invalidPokemon.join('\n')}`).toEqual([]);
    });

    it('should not have any obvious misspellings in Pokemon names', () => {
      const suspiciousPokemon: string[] = [];
      pokemonFixtures.forEach((fixture, index) => {
        const name = fixture.name.toLowerCase();
        if (name.includes('pokemon') || name.includes('pkm') || name.includes('???')) {
          suspiciousPokemon.push(`  - [${index}] "${fixture.name}" looks like a misspelling or placeholder`);
        }
        if (name.includes('test') || name.includes('temp') || name.includes('placeholder')) {
          suspiciousPokemon.push(`  - [${index}] "${fixture.name}" appears to be a placeholder`);
        }
      });
      expect(suspiciousPokemon, `Suspicious Pokemon names found in fixtures:\n${suspiciousPokemon.join('\n')}`).toEqual([]);
    });
  });

  describe('Ability Validation', () => {
    it('should have valid ability IDs when specified', () => {
      const invalidAbilities: string[] = [];
      pokemonFixtures.forEach((fixture, index) => {
        if (fixture.ability && !abilityIds.has(fixture.ability)) {
          invalidAbilities.push(`  - [${index}] "${fixture.ability}" for ${fixture.name} (nickname: ${fixture.nickname}) is not a valid ability`);
        }
      });
      expect(invalidAbilities, `Invalid ability IDs found in fixtures:\n${invalidAbilities.join('\n')}`).toEqual([]);
    });

    it('should not have placeholder ability values', () => {
      const suspiciousAbilities: string[] = [];
      pokemonFixtures.forEach((fixture, index) => {
        if (fixture.ability) {
          const ability = fixture.ability.toLowerCase();
          if (ability.includes('test') || ability.includes('temp') || ability.includes('placeholder') || ability === 'ability') {
            suspiciousAbilities.push(`  - [${index}] "${fixture.ability}" for ${fixture.name}`);
          }
        }
      });
      expect(suspiciousAbilities, `Suspicious ability values found in fixtures:\n${suspiciousAbilities.join('\n')}`).toEqual([]);
    });
  });

  describe('Place Validation', () => {
    it('should have valid place IDs when specified', () => {
      const invalidPlaces: string[] = [];
      pokemonFixtures.forEach((fixture, index) => {
        if (fixture.place && fixture.place !== '' && !placeIds.has(fixture.place)) {
          invalidPlaces.push(`  - [${index}] "${fixture.place}" for ${fixture.name} (nickname: ${fixture.nickname}) is not a valid place`);
        }
      });
      expect(invalidPlaces, `Invalid place IDs found in fixtures:\n${invalidPlaces.join('\n')}`).toEqual([]);
    });

    it('should not have placeholder place values', () => {
      const suspiciousPlaces: string[] = [];
      pokemonFixtures.forEach((fixture, index) => {
        if (fixture.place && fixture.place !== '') {
          const place = fixture.place.toLowerCase();
          if (place.includes('test') || place.includes('temp') || place.includes('placeholder') || place === 'place') {
            suspiciousPlaces.push(`  - [${index}] "${fixture.place}" for ${fixture.name}`);
          }
        }
      });
      expect(suspiciousPlaces, `Suspicious place values found in fixtures:\n${suspiciousPlaces.join('\n')}`).toEqual([]);
    });
  });

  describe('Pokeball Validation', () => {
    it('should have valid pokeball types', () => {
      const invalidPokeballs: string[] = [];
      pokemonFixtures.forEach((fixture, index) => {
        if (!pokeballTypes.has(fixture.pokeball)) {
          invalidPokeballs.push(`  - [${index}] "${fixture.pokeball}" for ${fixture.name} (nickname: ${fixture.nickname}) is not a valid pokeball type`);
        }
      });
      expect(invalidPokeballs, `Invalid pokeball types found in fixtures:\n${invalidPokeballs.join('\n')}`).toEqual([]);
    });
  });

  describe('Box Validation', () => {
    it('should have valid box values', () => {
      const validBoxes = ['team', 'other', 'graveyard', 'pc'];
      const invalidBoxes: string[] = [];
      pokemonFixtures.forEach((fixture, index) => {
        if (!validBoxes.includes(fixture.box)) {
          invalidBoxes.push(`  - [${index}] "${fixture.box}" for ${fixture.name} (nickname: ${fixture.nickname}) is not a valid box value`);
        }
      });
      expect(invalidBoxes, `Invalid box values found in fixtures:\n${invalidBoxes.join('\n')}`).toEqual([]);
    });
  });

  describe('Level Validation', () => {
    it('should have valid level values', () => {
      const invalidLevels: string[] = [];
      pokemonFixtures.forEach((fixture, index) => {
        if (typeof fixture.level !== 'number' || fixture.level < 1 || fixture.level > 100) {
          invalidLevels.push(`  - [${index}] level ${fixture.level} for ${fixture.name} (nickname: ${fixture.nickname}) is not valid (should be 1-100)`);
        }
      });
      expect(invalidLevels, `Invalid level values found in fixtures:\n${invalidLevels.join('\n')}`).toEqual([]);
    });
  });

  describe('Nickname Validation', () => {
    it('should have non-empty nicknames', () => {
      const emptyNicknames: string[] = [];
      pokemonFixtures.forEach((fixture, index) => {
        if (!fixture.nickname || fixture.nickname.trim() === '') {
          emptyNicknames.push(`  - [${index}] ${fixture.name} has empty nickname`);
        }
      });
      expect(emptyNicknames, `Fixtures with empty nicknames:\n${emptyNicknames.join('\n')}`).toEqual([]);
    });

    it('should not have placeholder nicknames', () => {
      const suspiciousNicknames: string[] = [];
      pokemonFixtures.forEach((fixture, index) => {
        const nickname = fixture.nickname.toLowerCase();
        if (nickname.includes('test') || nickname.includes('temp') || nickname.includes('placeholder') || nickname === 'nickname') {
          suspiciousNicknames.push(`  - [${index}] "${fixture.nickname}" for ${fixture.name}`);
        }
      });
      expect(suspiciousNicknames, `Suspicious nicknames found in fixtures:\n${suspiciousNicknames.join('\n')}`).toEqual([]);
    });
  });

  describe('Data Consistency', () => {
    it('should not have duplicate nicknames', () => {
      const nicknameCount = new Map<string, number>();
      const duplicates: string[] = [];
      pokemonFixtures.forEach((fixture) => {
        const count = nicknameCount.get(fixture.nickname) || 0;
        nicknameCount.set(fixture.nickname, count + 1);
      });
      nicknameCount.forEach((count, nickname) => {
        if (count > 1) {
          duplicates.push(`  - "${nickname}" appears ${count} times`);
        }
      });
      expect(duplicates, `Duplicate nicknames found in fixtures:\n${duplicates.join('\n')}`).toEqual([]);
    });

    it('should have reasonable team composition', () => {
      const teamMembers = pokemonFixtures.filter(f => f.box === 'team');
      const graveyardMembers = pokemonFixtures.filter(f => f.box === 'graveyard');
      const pcMembers = pokemonFixtures.filter(f => f.box === 'other' || f.box === 'pc');
      // Basic sanity checks
      expect(teamMembers.length, 'There should be at least one team member').toBeGreaterThan(0);
      expect(teamMembers.length, 'There should be no more than 6 team members').toBeLessThanOrEqual(6);
      // Log composition for manual review
      console.log('Team composition:');
      console.log(`- Team: ${teamMembers.length} Pokemon`);
      console.log(`- Graveyard: ${graveyardMembers.length} Pokemon`);
      console.log(`- PC/Other: ${pcMembers.length} Pokemon`);
    });
  });

  describe('App Runtime Validation', () => {
    it('should produce valid TeamPokemon objects when processed by app logic', () => {
      processedFixtures.forEach((processed, index) => {
        const original = pokemonFixtures[index];
        
        // Validate structure matches TeamPokemon interface
        expect(processed).toHaveProperty('id');
        expect(processed).toHaveProperty('pokemon');
        expect(processed).toHaveProperty('nickname');
        expect(processed).toHaveProperty('level');
        expect(processed).toHaveProperty('ability');
        expect(processed).toHaveProperty('pokeball');
        expect(processed).toHaveProperty('animated');
        expect(processed).toHaveProperty('staticZoom');
        expect(processed).toHaveProperty('animatedZoom');
        expect(processed).toHaveProperty('place');
        expect(processed).toHaveProperty('box');

        // Validate data integrity after processing
        expect(processed.nickname).toBe(original.nickname);
        expect(processed.level).toBe(original.level);
        expect(processed.place).toBe(original.place || '');
        
        // Validate app-specific defaults are applied
        expect(processed.animated).toBe(false);
        expect(processed.staticZoom).toBe(1.5);
        expect(processed.animatedZoom).toBe(1.5);
        expect(processed.id).toBe(`fixture-slot-${index}`);
      });
    });

    it('should correctly normalize box values during app processing', () => {
      const invalidBoxes: string[] = [];
      
      processedFixtures.forEach((processed, index) => {
        const validBoxes = ['team', 'other', 'graveyard'];
        if (!validBoxes.includes(processed.box)) {
          invalidBoxes.push(`Index ${index}: processed box "${processed.box}" is not valid`);
        }
      });

      expect(invalidBoxes).toEqual([]);
    });

    it('should handle case-insensitive Pokemon name matching like the app', () => {
      const caseIssues: string[] = [];
      
      processedFixtures.forEach((processed, index) => {
        const original = pokemonFixtures[index];
        
        if (processed.pokemon) {
          // Verify the Pokemon was found using case-insensitive matching
          const expectedPokemon = allPokemon.find(p => 
            p.name.english.toLowerCase() === original.name.toLowerCase()
          );
          
          if (!expectedPokemon) {
            caseIssues.push(`Index ${index}: "${original.name}" should have been found with case-insensitive matching`);
          } else if (processed.pokemon.id !== expectedPokemon.id) {
            caseIssues.push(`Index ${index}: Pokemon ID mismatch for "${original.name}"`);
          }
        }
      });

      expect(caseIssues).toEqual([]);
    });

    it('should apply proper defaults for missing properties during app processing', () => {
      processedFixtures.forEach((processed, index) => {
        const original = pokemonFixtures[index];
        
        // Check that defaults are applied correctly
        if (!original.hasOwnProperty('ability')) {
          expect(processed.ability).toBe('');
        }
        
        if (!original.hasOwnProperty('pokeball')) {
          expect(processed.pokeball).toBe('pokeball');
        }
        
        if (!original.hasOwnProperty('place')) {
          expect(processed.place).toBe('');
        }
        
        if (!original.hasOwnProperty('box')) {
          expect(processed.box).toBe('team');
        }
        
        if (!original.hasOwnProperty('level')) {
          expect(processed.level).toBe(1);
        }
      });
    });
  });

  describe('Specific Pokemon Issues', () => {
    it('should not have any known problematic Pokemon names in fixtures', () => {
      const knownIssues: string[] = [];
      
      pokemonFixtures.forEach((fixture, index) => {
        // Check for specific known issues that were previously found and fixed
        switch (fixture.name) {
          case 'Fluffy':
            knownIssues.push(`Index ${index}: "Fluffy" is not a valid Pokemon name (should be "Flaaffy")`);
            break;
          case 'Dribloom':
          case 'Dreebloom':
            knownIssues.push(`Index ${index}: "${fixture.name}" is not a valid Pokemon name (should be "Drifblim")`);
            break;
        }
      });

      // All previously known issues should now be fixed
      expect(knownIssues).toEqual([]);
    });
  });
}); 