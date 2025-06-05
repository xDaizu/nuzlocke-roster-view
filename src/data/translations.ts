export const translations = {
  // Panel titles and navigation
  panels: {
    boxPanel: "Panel de Cajas",
    slotEditor: "Editor",
    placesPanel: "Lugares con captura",
    configPanel: "Configuración de Paneles"
  },

  // Box types
  boxes: {
    team: "Equipo",
    other: "En el PC", 
    graveyard: "El cielo"
  },

  // Buttons and actions
  buttons: {
    save: "Guardar Backup",
    load: "Restaurar Backup", 
    clear: "Limpiar",
    default: "Default"
  },

  // Forms and inputs
  forms: {
    nickname: "Apodo",
    level: "Nivel",
    ability: "Habilidad",
    pokeball: "Pokéball",
    place: "Lugar",
    box: "Caja",
    pokemon: "Pokémon",
    filterPokemon: "Filtrar Pokemon...",
    filterAbility: "Filtrar habilidades...",
    selectPokemon: "Seleccionar Pokémon",
    selectAbility: "Seleccionar habilidad",
    selectPlace: "Seleccionar lugar",
    selectBox: "Seleccionar caja"
  },

  // Status messages
  messages: {
    loading: "Loading Pokemon data...",
    noPlaces: "No hay lugares registrados",
    assignPlaces: "Asigna lugares a tus Pokémon para verlos aquí",
    teamSaved: "Team Saved",
    teamSavedDesc: "Your team has been saved to localStorage.",
    teamLoaded: "Team Loaded", 
    teamLoadedDesc: "Your team has been loaded from localStorage.",
    noSavedTeam: "No Saved Team",
    noSavedTeamDesc: "No valid team found in localStorage.",
    slotCleared: "Slot Cleared",
    slotClearedDesc: "has been cleared",
    error: "Error",
    saveError: "Failed to save team.",
    loadError: "Failed to load team.",
    pokemonDataError: "Failed to load Pokemon data"
  },

  // Placeholders and defaults
  placeholders: {
    noName: "Sin nombre",
    unknown: "Desconocido",
    pokemonCount: "Pokémon"
  },

  // Configuration
  config: {
    totalColumns: "Total de columnas:",
    exceedsColumns: "⚠️ El total excede 6 columnas",
    columnsSingular: "columna",
    columnsPlural: "columnas"
  }
} as const;

export type TranslationKey = keyof typeof translations; 