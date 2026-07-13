
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
      
      // Migrate old teams to include zoom and translate fields
      return team.map((slot: any) => ({
        ...slot,
        zoom: slot.zoom || 1.5, // legacy field
        staticZoom: slot.staticZoom ?? 1.5,
        animatedZoom: slot.animatedZoom ?? 1.5,
        staticTranslateX: slot.staticTranslateX ?? 0,
        staticTranslateY: slot.staticTranslateY ?? 0,
        animatedTranslateX: slot.animatedTranslateX ?? 0,
        animatedTranslateY: slot.animatedTranslateY ?? 0,
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
    zoom: 1.5,
    staticZoom: 1.5,
    animatedZoom: 1.5,
    staticTranslateX: 0,
    staticTranslateY: 0,
    animatedTranslateX: 0,
    animatedTranslateY: 0,
    box: 'team' as const,
  }));
};
