import sinnohPlaces from "@/data/sinnoh/places_es.json";
import hoennPlaces from "@/data/hoenn/places_es.json";

export interface Place {
  id: string;
  nombre: string;
}

/** Region ids — one folder per region under `src/data/`. */
export type RegionId = "sinnoh" | "hoenn";

export interface Region {
  id: RegionId;
  /** Display name (proper noun, identical in Spanish). */
  name: string;
  places: Place[];
}

/** Every selectable region and its capture-location data. */
export const REGIONS: Record<RegionId, Region> = {
  sinnoh: { id: "sinnoh", name: "Sinnoh", places: sinnohPlaces },
  hoenn: { id: "hoenn", name: "Hoenn", places: hoennPlaces },
};

/** Region selected by default (preserves the pre-region-split behavior). */
export const DEFAULT_REGION: RegionId = "sinnoh";

/** Ordered list of regions, handy for rendering selectors. */
export const REGION_LIST: Region[] = Object.values(REGIONS);

export const getPlacesForRegion = (region: RegionId): Place[] =>
  REGIONS[region].places;

/** All places across every region — used to translate a place caught in a region other than the one currently selected. */
export const getAllPlaces = (): Place[] =>
  REGION_LIST.flatMap(region => region.places);
