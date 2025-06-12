import { AbilitiesRepository } from './AbilitiesRepository';
import { PlaceRepository } from './PlaceRepository';
import { TypeRepository } from './TypeRepository';

export class RepositoryFactory {
  static createAbilitiesRepository() {
    return new AbilitiesRepository();
  }

  static createPlaceRepository() {
    return new PlaceRepository();
  }

  static createTypeRepository() {
    return new TypeRepository();
  }
} 