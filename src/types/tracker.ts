export type TrackerEntryType = "route" | "gym";
export type TrackerGroup = "rival" | "gym-leader" | "evil-team" | "elite-four";

export interface TrackerEntry {
  order: number;
  type: TrackerEntryType;
  name: string;
  /** Only present for type "route" — maps to a `Place.id`, null when the entry has no matching place (e.g. "Starter"). */
  placeId?: string | null;
  /** Only present for type "route" — wild species available there. */
  encounters?: string[];
  /** Only present for type "gym". */
  group?: TrackerGroup;
  boss?: string;
  value?: string;
}
