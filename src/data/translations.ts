export const translations = {
  // Panel titles and navigation
  panels: {
    boxPanel: "Panel de Cajas",
    slotEditor: "Editor",
    placesPanel: "Progreso de captura",
    weaknessPanel: "Análisis de Tipos",
    configPanel: "Configuración de Paneles",
    appConfigPanel: "Configuración de la app"
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
    place: "Lugar de captura",
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
    trackerUnavailable: "El progreso de captura no está disponible todavía para esta región",
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
  },

  // Tracker panel (ordered catch-opportunity list)
  tracker: {
    gift: "Regalo",
    static: "Encuentro fijo",
    fossil: "Fósil",
    createHere: "Crear Pokémon capturado aquí",
    missed: "Perdido",
    markMissed: "Marcar oportunidad como perdida",
    unmarkMissed: "Quitar marca de oportunidad perdida"
  },

  // App-wide configuration (region, etc.)
  appConfig: {
    region: "Región",
    regionDescription: "Selecciona la región de tu partida",
    autosave: "Guardado automático",
    autosaveDescription: "Guarda los cambios automáticamente",
    showLevel: "Mostrar nivel",
    showLevelDescription: "Muestra el nivel del Pokémon en la ficha",
    showPokeball: "Mostrar Pokéball",
    showPokeballDescription: "Muestra la Pokéball usada en la captura",
    pcSlotSeconds: "Ciclo del PC (segundos)",
    pcSlotSecondsDescription: "Muestra un Pokémon del PC en la cabecera, cambiando cada N segundos. 0 desactiva esta ranura.",
    graveyardSlotSeconds: "Ciclo del cielo (segundos)",
    graveyardSlotSecondsDescription: "Muestra un Pokémon del cielo en la cabecera, cambiando cada N segundos. 0 desactiva esta ranura.",
    placesDisplay: "Lugares",
    placesDisplayDescription: "Muestra el panel de lugares como un panel fijo o como una barra lateral desplegable",
    placesDisplayPanel: "Panel",
    placesDisplaySidebar: "Barra lateral"
  }
} as const;

export type TranslationKey = keyof typeof translations; 