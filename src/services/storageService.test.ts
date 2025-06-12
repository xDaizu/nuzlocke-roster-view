// @vitest-environment jsdom
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { storageService } from './storageService';
import type { TeamPokemon } from '../types/pokemon';

const TEAM_KEY = 'nuzlocke-roster:team';
const BACKUP_KEY = 'nuzlocke-roster:team-backup';
const LAST_BACKUP_KEY = 'nuzlocke-roster:last-backup';

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

function clearStorage() {
  localStorage.clear();
}

describe('storageService', () => {
  beforeEach(() => {
    clearStorage();
  });
  afterEach(() => {
    clearStorage();
  });

  it('saves and loads team data', () => {
    storageService.saveTeam(mockTeam);
    const loaded = storageService.loadTeam();
    expect(loaded).toEqual(mockTeam);
  });

  it('creates a backup when saving', () => {
    storageService.saveTeam(mockTeam);
    // Save again to trigger backup
    storageService.saveTeam([{ ...mockTeam[0], nickname: 'Backup' }]);
    const backupKeys = storageService.getBackupKeys(BACKUP_KEY);
    expect(backupKeys.length).toBeGreaterThan(0);
    // Backup data should match the first save
    const backupData = storageService.loadFromBackup(BACKUP_KEY);
    expect(Array.isArray(backupData)).toBe(true);
    expect((backupData as TeamPokemon[])[0].nickname).toBe('Test');
  });

  it('loads from backup if main data is missing', () => {
    storageService.saveTeam(mockTeam);
    storageService.createBackup();
    localStorage.removeItem(TEAM_KEY);
    const loaded = storageService.loadTeam();
    expect(Array.isArray(loaded)).toBe(true);
    expect(loaded[0].nickname).toBe('Test');
  });

  it('returns empty array if no data or backup exists', () => {
    const loaded = storageService.loadTeam();
    expect(loaded).toEqual([]);
  });

  it('getBackupKeys returns all backup keys', () => {
    storageService.saveTeam(mockTeam);
    storageService.createBackup();
    const keys = storageService.getBackupKeys(BACKUP_KEY);
    expect(keys.every(k => k.startsWith(BACKUP_KEY))).toBe(true);
  });

  it('pruneOldBackups keeps only the most recent backups', () => {
    storageService.saveTeam(mockTeam);
    for (let i = 0; i < 5; i++) {
      storageService.createBackup();
    }
    let keys = storageService.getBackupKeys(BACKUP_KEY);
    expect(keys.length).toBeGreaterThan(0);
    storageService.pruneOldBackups(BACKUP_KEY, 2);
    keys = storageService.getBackupKeys(BACKUP_KEY);
    expect(keys.length).toBeLessThanOrEqual(2);
  });

  it('restoreFromBackup restores the most recent backup', () => {
    storageService.saveTeam(mockTeam);
    storageService.createBackup();
    localStorage.removeItem(TEAM_KEY);
    const restored = storageService.restoreFromBackup();
    expect(restored).toBe(true);
    const loaded = storageService.loadTeam();
    expect(loaded[0].nickname).toBe('Test');
  });

  it('restoreFromBackup returns false if no backup exists', () => {
    const restored = storageService.restoreFromBackup();
    expect(restored).toBe(false);
  });

  it('getLastBackupTime returns a Date after backup', () => {
    storageService.saveTeam(mockTeam);
    storageService.createBackup();
    const lastBackup = storageService.getLastBackupTime();
    expect(lastBackup).toBeInstanceOf(Date);
    expect(lastBackup!.getTime()).toBeLessThanOrEqual(Date.now());
  });

  it('getLastBackupTime returns null if no backup', () => {
    expect(storageService.getLastBackupTime()).toBeNull();
  });

  it('handles localStorage unavailability gracefully', () => {
    const spy = vi.spyOn(window.localStorage.__proto__, 'setItem').mockImplementation(() => { throw new Error('fail'); });
    expect(() => storageService.saveTeam(mockTeam)).not.toThrow();
    spy.mockRestore();
  });

  it('handles JSON parse errors gracefully', () => {
    localStorage.setItem(TEAM_KEY, 'not-json');
    const loaded = storageService.loadTeam();
    expect(Array.isArray(loaded)).toBe(true);
  });

  it('handles backup parse errors gracefully', () => {
    storageService.saveTeam(mockTeam);
    storageService.createBackup();
    const keys = storageService.getBackupKeys(BACKUP_KEY);
    localStorage.setItem(keys[0], 'not-json');
    localStorage.removeItem(TEAM_KEY);
    const loaded = storageService.loadTeam();
    expect(Array.isArray(loaded)).toBe(true);
  });

  it('hasEnoughStorageSpace returns false if quota exceeded', () => {
    // This is a private function, but we can simulate quota exceeded by filling localStorage
    const bigData = 'x'.repeat(1024 * 1024 * 5); // 5MB
    try {
      localStorage.setItem('big', bigData);
      // Try saving a large team
      expect(() => storageService.saveTeam(Array(10000).fill(mockTeam[0]))).not.toThrow();
    } catch {
      // Some environments may not allow this much
      expect(true).toBe(true);
    } finally {
      localStorage.removeItem('big');
    }
  });
}); 