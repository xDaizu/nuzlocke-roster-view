import type { PokemonType, TypeEffectiveness, TypeChart } from '@/types';
import typesData from '@/data/pokemon/types.json';

export class TypeRepository {
  private typeChart: TypeChart;

  constructor() {
    this.typeChart = typesData as TypeChart;
  }

  async getAll(): Promise<PokemonType[]> {
    return Object.entries(this.typeChart).map(([name, effectiveness]) => ({
      name,
      effectiveness,
    }));
  }

  async getByName(name: string): Promise<PokemonType | undefined> {
    const effectiveness = this.typeChart[name];
    if (!effectiveness) return undefined;
    return { name, effectiveness };
  }
} 