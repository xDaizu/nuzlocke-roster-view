
import { TeamPokemon } from "@/types/pokemon";

const STORAGE_KEY = 'nuzlocke-team';

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
  return Array.from({ length: 6 }, (_, index) => ({
    id: `slot-${index}`,
    pokemon: null,
    nickname: '',
    level: 1,
    ability: '',
    pokeball: 'pokeball' as const,
    animated: false,
    staticZoom: 1.5,
    animatedZoom: 1.5,
    place: '',
    box: 'team' as const,
  }));
};
