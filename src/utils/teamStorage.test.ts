// @vitest-environment jsdom
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { saveTeam, loadTeam } from './teamStorage';
import type { TeamPokemon } from '@/types/pokemon';

const mockTeam: TeamPokemon[] = [
  {
    id: 'slot-0',
    pokemon: null,
    nickname: 'Test',
    level: 10,
    ability: 'overgrow',
    pokeball: 'pokeball',
    animated: false,
    staticZoom: 1.5,
    animatedZoom: 1.5,
    place: 'route-1',
    box: 'team',
  },
];

describe('teamStorage', () => {
  let setItemSpy: any;
  let getItemSpy: any;
  let removeItemSpy: any;

  beforeEach(() => {
    setItemSpy = vi.spyOn(window.localStorage.__proto__, 'setItem');
    getItemSpy = vi.spyOn(window.localStorage.__proto__, 'getItem');
    removeItemSpy = vi.spyOn(window.localStorage.__proto__, 'removeItem');
    setItemSpy.mockClear();
    getItemSpy.mockClear();
    removeItemSpy.mockClear();
  });

  it('saves team to localStorage', () => {
    saveTeam(mockTeam);
    expect(setItemSpy).toHaveBeenCalledWith('nuzlocke-team', JSON.stringify(mockTeam));
  });

  it('loads team from localStorage and migrates legacy fields', () => {
    const legacyTeam = [{
      id: 'slot-0',
      pokemon: null,
      nickname: 'Test',
      level: 10,
      ability: 'overgrow',
      pokeball: 'pokeball',
      animated: false,
      zoom: 2,
      place: 'route-1',
      // box missing
    }];
    getItemSpy.mockReturnValue(JSON.stringify(legacyTeam));
    const loaded = loadTeam();
    expect(loaded[0].staticZoom).toBe(2);
    expect(loaded[0].animatedZoom).toBe(2);
    expect(loaded[0].box).toBe('team');
  });

  it('returns default empty team if nothing in localStorage', () => {
    getItemSpy.mockReturnValue(null);
    const loaded = loadTeam();
    expect(loaded).toHaveLength(6);
    expect(loaded[0].id).toBe('slot-0');
    expect(loaded[5].id).toBe('slot-5');
    expect(loaded[0].pokemon).toBeNull();
  });

  it('returns default empty team on JSON parse error', () => {
    getItemSpy.mockImplementation(() => { throw new Error('fail'); });
    const loaded = loadTeam();
    expect(loaded).toHaveLength(6);
    expect(loaded[0].pokemon).toBeNull();
  });
}); 