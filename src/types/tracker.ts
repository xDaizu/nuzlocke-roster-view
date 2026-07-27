export type TrackerEntryType = "route" | "gym" | "static";
export type TrackerGroup = "rival" | "gym-leader" | "evil-team" | "elite-four";
/** Only present for type "static" — how the encounter is obtained (badge/flavor only, not gameplay-relevant since encounters are randomized). */
export type StaticMethod = "gift" | "static" | "fossil";

export interface TrackerEntry {
  order: number;
  type: TrackerEntryType;
  name: string;
  /** Maps to a `Place.id` for "route"/"static" entries, null when the entry has no matching place (e.g. "Starter"). */
  placeId?: string | null;
  /** Possible species at this spot. Informational only — with randomizer support enabled, any species can appear here regardless of vanilla pool. */
  encounters?: string[];
  /** Only present for type "gym". */
  group?: TrackerGroup;
  boss?: string;
  value?: string;
  /** Only present for type "static". */
  method?: StaticMethod;
}
