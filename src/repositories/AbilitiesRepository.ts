import type { Ability } from '@/types';
import abilitiesData from '@/data/pokemon/abilities_es.json';

export class AbilitiesRepository {
  async getAll(): Promise<Ability[]> {
    return abilitiesData as Ability[];
  }

  async getAbility(slug: string): Promise<Ability | undefined> {
    return (abilitiesData as Ability[]).find(a => a.slug === slug);
  }
} 