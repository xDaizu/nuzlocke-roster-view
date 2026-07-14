import sinnohPlaces from "@/data/sinnoh/places_es.json";
import hoennPlaces from "@/data/hoenn/places_es.json";
import hoennTrackerOrder from "@/data/hoenn/tracker_order.json";
import { TrackerEntry } from "@/types/tracker";

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
  /** In-game progression order (routes, gyms, …), used by the tracker panel. Undefined until built for a region. */
  trackerEntries?: TrackerEntry[];
}

/** Every selectable region and its capture-location data. */
export const REGIONS: Record<RegionId, Region> = {
  sinnoh: { id: "sinnoh", name: "Sinnoh", places: sinnohPlaces },
  hoenn: {
    id: "hoenn",
    name: "Hoenn",
    places: hoennPlaces,
    trackerEntries: hoennTrackerOrder as TrackerEntry[],
  },
};

/** Region selected by default (preserves the pre-region-split behavior). */
export const DEFAULT_REGION: RegionId = "sinnoh";

/** Ordered list of regions, handy for rendering selectors. */
export const REGION_LIST: Region[] = Object.values(REGIONS);

export const getPlacesForRegion = (region: RegionId): Place[] =>
  REGIONS[region].places;

export const getTrackerEntriesForRegion = (region: RegionId): TrackerEntry[] | undefined =>
  REGIONS[region].trackerEntries;

/** All places across every region — used to translate a place caught in a region other than the one currently selected. */
export const getAllPlaces = (): Place[] =>
  REGION_LIST.flatMap(region => region.places);
