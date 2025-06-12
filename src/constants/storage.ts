// Storage keys
export const STORAGE_KEYS = {
  TEAM: 'nuzlocke-roster:team',
  BACKUP_TEAM: 'nuzlocke-roster:team-backup',
  LAST_BACKUP: 'nuzlocke-roster:last-backup',
  // Legacy key from teamStorage
  LEGACY_TEAM: 'nuzlocke-team',
} as const;

// Storage configuration
export const STORAGE_CONFIG = {
  MAX_BACKUPS: 3,
  MAX_STORAGE_SIZE: 10000000, // 10MB safety limit
  TEST_KEY: '__storage_test__',
  QUOTA_TEST_KEY: '__quota_test__',
} as const; 