// Panel configuration defaults
export const PANEL_CONFIG = {
  DEFAULT_COLUMNS: 1,
  DEFAULT_ORDER: 0,
  MAX_COLUMNS: 12,
  MIN_COLUMNS: 1,
} as const;

// Grid and layout constants
export const LAYOUT = {
  GRID_COLUMNS: 12,
  DEFAULT_GAP: 4,
  BREAKPOINTS: {
    SM: 640,
    MD: 768,
    LG: 1024,
    XL: 1280,
  },
} as const;

// Animation and transition constants
export const ANIMATION = {
  DURATION: {
    FAST: 150,
    NORMAL: 300,
    SLOW: 500,
  },
  EASING: {
    DEFAULT: 'ease-in-out',
    BOUNCE: 'cubic-bezier(0.68, -0.55, 0.265, 1.55)',
  },
} as const; 