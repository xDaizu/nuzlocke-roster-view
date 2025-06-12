// Pokemon sprite configuration
export const SPRITE_CONFIG = {
  BASE_URL: 'https://img.pokemondb.net/sprites/black-white',
  FOLDERS: {
    STATIC: 'normal',
    ANIMATED: 'anim/normal',
  },
  EXTENSIONS: {
    STATIC: 'png',
    ANIMATED: 'gif',
  },
} as const;

// Default team slot configuration
export const TEAM_CONFIG = {
  DEFAULT_TEAM_SIZE: 6,
  DEFAULT_ZOOM: {
    STATIC: 1.5,
    ANIMATED: 1.5,
  },
  DEFAULT_LEVEL: 1,
  DEFAULT_POKEBALL: 'pokeball' as const,
  DEFAULT_BOX: 'team' as const,
} as const; 