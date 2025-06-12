import type { Place } from '@/types';
import placesData from '@/data/pokemon/places_es.json';

export class PlaceRepository {
  private places: Place[];

  constructor() {
    this.places = placesData as Place[];
  }

  async getAll(): Promise<Place[]> {
    return this.places;
  }

  async getById(id: string): Promise<Place | undefined> {
    return this.places.find(place => place.id === id);
  }
} 