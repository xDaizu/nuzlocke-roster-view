import { describe, it, expect, beforeEach, vi } from 'vitest';
import { storageService } from './storageService';
import { createEmptySlot } from '@/utils/slots';
import { TeamPokemon } from '@/types/pokemon';

// Minimal in-memory localStorage implementation for the node test environment.
class LocalStorageMock {
  private store = new Map<string, string>();
  get length() {
    return this.store.size;
  }
  clear() {
    this.store.clear();
  }
  getItem(key: string): string | null {
    return this.store.has(key) ? this.store.get(key)! : null;
  }
  setItem(key: string, value: string) {
    this.store.set(key, String(value));
  }
  removeItem(key: string) {
    this.store.delete(key);
  }
  key(index: number): string | null {
    return Array.from(this.store.keys())[index] ?? null;
  }
}

const sampleTeam = (): TeamPokemon[] => [
  { ...createEmptySlot('slot-0', 'team'), nickname: 'Pablo', level: 14 },
  createEmptySlot('slot-1', 'other'),
];

beforeEach(() => {
  vi.stubGlobal('localStorage', new LocalStorageMock());
  // Silence the service's console.error diagnostics during tests.
  vi.spyOn(console, 'error').mockImplementation(() => {});
});

describe('storageService', () => {
  it('returns an empty array when nothing is saved', () => {
    expect(storageService.loadTeam()).toEqual([]);
  });

  it('round-trips a saved team', () => {
    const team = sampleTeam();
    storageService.saveTeam(team);
    expect(storageService.loadTeam()).toEqual(team);
  });

  it('creates a backup of the previous team when saving over an existing one', () => {
    storageService.saveTeam(sampleTeam());
    storageService.saveTeam(sampleTeam()); // second save backs up the first
    const backups = storageService.getBackupKeys('nuzlocke-roster:team-backup');
    expect(backups.length).toBeGreaterThanOrEqual(1);
  });

  it('prunes old backups down to the requested count', () => {
    const prefix = 'nuzlocke-roster:team-backup';
    for (let i = 0; i < 5; i++) {
      localStorage.setItem(`${prefix}-${i}`, '[]');
    }
    storageService.pruneOldBackups(prefix, 2);
    expect(storageService.getBackupKeys(prefix).length).toBe(2);
  });
});
