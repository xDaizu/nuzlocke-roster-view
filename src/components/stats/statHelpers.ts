import type { Pokemon } from "@/types/pokemon";
import naturesData from "@/data/natures_es.json";

export const STAT_CONFIG: Array<{ key: keyof Pokemon["base"]; label: string }> = [
  { key: "HP", label: "HP" },
  { key: "Attack", label: "Atk" },
  { key: "Defense", label: "Def" },
  { key: "Sp. Attack", label: "SpA" },
  { key: "Sp. Defense", label: "SpD" },
  { key: "Speed", label: "Spe" },
];

// Reference ceiling for bar-fill percentage; most base stats fall well under this,
// so only truly exceptional stats (Blissey HP, Shuckle Def, etc.) fill completely.
const MAX_STAT_REFERENCE = 200;

// The app-wide color convention for a nature-boosted (red) vs nature-lowered (blue)
// stat, shared by every stat layout so the meaning stays consistent wherever it's used.
export const NATURE_INCREASE_CLASS = "text-red-400";
export const NATURE_DECREASE_CLASS = "text-blue-400";
export const NATURE_NEUTRAL_CLASS = "text-slate-300";

export function getStatBarColor(value: number): string {
  if (value < 60) return "#ef4444"; // red-500
  if (value < 90) return "#f97316"; // orange-500
  if (value < 120) return "#eab308"; // yellow-500
  if (value < 150) return "#22c55e"; // green-500
  return "#06b6d4"; // cyan-500
}

export function getNatureInfo(nature?: string) {
  return naturesData.find((n) => n.slug === nature);
}

export interface StatEntry {
  key: keyof Pokemon["base"];
  label: string;
  value: number;
  pct: number;
  barColor: string;
  /** Empty string when the nature doesn't affect this stat */
  natureColorClass: "" | typeof NATURE_INCREASE_CLASS | typeof NATURE_DECREASE_CLASS;
  sign: "+" | "−" | "";
}

/** Computes the nature-adjusted value, bar fill, and increase/decrease styling for each stat. */
export function computeStatEntries(base: Pokemon["base"], nature?: string): StatEntry[] {
  const natureData = getNatureInfo(nature);
  return STAT_CONFIG.map(({ key, label }) => {
    const isIncreased = natureData?.increase === key;
    const isDecreased = natureData?.decrease === key;
    const value = Math.round(base[key] * (isIncreased ? 1.1 : isDecreased ? 0.9 : 1));
    return {
      key,
      label,
      value,
      pct: Math.min(100, (value / MAX_STAT_REFERENCE) * 100),
      barColor: getStatBarColor(value),
      natureColorClass: isIncreased ? NATURE_INCREASE_CLASS : isDecreased ? NATURE_DECREASE_CLASS : "",
      sign: isIncreased ? "+" : isDecreased ? "−" : "",
    };
  });
}
