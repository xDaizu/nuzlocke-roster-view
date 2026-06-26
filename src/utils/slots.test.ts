import { describe, it, expect } from 'vitest';
import { createEmptySlot, normalizeBox } from './slots';

describe('createEmptySlot', () => {
  it('creates a slot with the given id and box', () => {
    const slot = createEmptySlot('slot-3', 'graveyard');
    expect(slot.id).toBe('slot-3');
    expect(slot.box).toBe('graveyard');
  });

  it('defaults to the team box', () => {
    expect(createEmptySlot('x').box).toBe('team');
  });

  it('applies the app default field values', () => {
    const slot = createEmptySlot('x', 'other');
    expect(slot).toMatchObject({
      pokemon: null,
      nickname: '',
      level: 1,
      ability: '',
      pokeball: 'pokeball',
      animated: false,
      staticZoom: 1.5,
      animatedZoom: 1.5,
      place: '',
    });
  });
});

describe('normalizeBox', () => {
  it('passes through valid box values', () => {
    expect(normalizeBox('team')).toBe('team');
    expect(normalizeBox('other')).toBe('other');
    expect(normalizeBox('graveyard')).toBe('graveyard');
  });

  it('coerces invalid or missing values to "other"', () => {
    expect(normalizeBox('')).toBe('other');
    expect(normalizeBox(undefined)).toBe('other');
    expect(normalizeBox(null)).toBe('other');
    expect(normalizeBox('nonsense')).toBe('other');
  });
});
