import { NATURE_NEUTRAL_CLASS, type StatEntry } from "./statHelpers";

interface StatColumnProps {
  entry: StatEntry;
  maxBarPx: number;
}

/** A single stat's number, +/- sign, vertical bar, and acronym label. Shared visual atom used by every stat layout strategy. */
const StatColumn: React.FC<StatColumnProps> = ({ entry, maxBarPx }) => (
  <div className="flex flex-col items-center flex-1 h-full justify-end">
    <span className={`text-[7px] leading-none font-bold h-[7px] ${entry.natureColorClass}`}>
      {entry.sign}
    </span>
    <span className={`text-[8px] leading-none font-bold mb-0.5 ${entry.natureColorClass || "text-white"}`}>
      {entry.value}
    </span>
    <div
      className="w-2 flex-1 bg-slate-700/80 rounded-sm flex items-end overflow-hidden"
      style={{ maxHeight: maxBarPx }}
    >
      <div className="w-full rounded-sm" style={{ height: `${entry.pct}%`, backgroundColor: entry.barColor }} />
    </div>
    <span className={`text-[7px] leading-none mt-0.5 font-semibold ${entry.natureColorClass || NATURE_NEUTRAL_CLASS}`}>
      {entry.label}
    </span>
  </div>
);

export default StatColumn;
