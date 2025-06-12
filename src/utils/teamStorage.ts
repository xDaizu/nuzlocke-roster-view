
import { TeamPokemon } from "@/types/pokemon";
import { STORAGE_KEYS, TEAM_CONFIG } from "@/constants";

const STORAGE_KEY = STORAGE_KEYS.LEGACY_TEAM;

export const saveTeam = (team: TeamPokemon[]): void => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(team));
    console.log('Team saved to localStorage:', team);
  } catch (error) {
    console.error('Failed to save team:', error);
  }
};

export const loadTeam = (): TeamPokemon[] => {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      const team = JSON.parse(saved);
      console.log('Team loaded from localStorage:', team);
      
      // Migrate old teams to include new required fields
      return team.map((slot: any) => ({
        ...slot,
        staticZoom: slot.staticZoom || slot.zoom || 1.5,
        animatedZoom: slot.animatedZoom || slot.zoom || 1.5,
        box: slot.box || 'team' // Default to 'team' for legacy data
      }));
    }
  } catch (error) {
    console.error('Failed to load team:', error);
  }
  
  // Return default empty team
  return Array.from({ length: TEAM_CONFIG.DEFAULT_TEAM_SIZE }, (_, index) => ({
    id: `slot-${index}`,
    pokemon: null,
    nickname: '',
    level: TEAM_CONFIG.DEFAULT_LEVEL,
    ability: '',
    pokeball: TEAM_CONFIG.DEFAULT_POKEBALL,
    animated: false,
    staticZoom: TEAM_CONFIG.DEFAULT_ZOOM.STATIC,
    animatedZoom: TEAM_CONFIG.DEFAULT_ZOOM.ANIMATED,
    place: '',
    box: TEAM_CONFIG.DEFAULT_BOX,
  }));
};
