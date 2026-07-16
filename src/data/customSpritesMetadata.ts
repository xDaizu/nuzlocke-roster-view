export interface CustomSpriteMetadata {
  name: string;
  artist: string;
}

// Keyed by filename without extension. Add an entry here for each new custom sprite file.
export const CUSTOM_SPRITES_METADATA: Record<string, CustomSpriteMetadata> = {
  Remy_OC_Normal: { name: 'Remy (Normal)', artist: '6ancho' },
  Remy_OC_Normal_2: { name: 'Remy (Normal 2)', artist: '6ancho' },
};
