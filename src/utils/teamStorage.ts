
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
      return team;
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
    animated: false
  }));
};
