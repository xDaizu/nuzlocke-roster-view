import { computeStatEntries, getNatureInfo, NATURE_NEUTRAL_CLASS, type StatEntry } from "./statHelpers";
import type { StatLayoutProps } from "./SingleRowStatBars";

const CELL_WIDTH_CLASS = "w-8";
const GAP_CLASS = "gap-0";

const LabelsRow: React.FC<{ entries: StatEntry[] }> = ({ entries }) => (
  <div className={`flex justify-center ${GAP_CLASS}`}>
    {entries.map((e) => (
      <span
        key={e.key}
        className={`${CELL_WIDTH_CLASS} text-center text-[7px] leading-none font-semibold ${e.natureColorClass || NATURE_NEUTRAL_CLASS}`}
      >
        {e.sign}
        {e.label}
      </span>
    ))}
  </div>
);

const NumbersRow: React.FC<{ entries: StatEntry[] }> = ({ entries }) => (
  <div className={`flex justify-center ${GAP_CLASS}`}>
    {entries.map((e) => (
      <span
        key={e.key}
        className={`${CELL_WIDTH_CLASS} text-center text-[8px] leading-none font-bold ${e.natureColorClass || "text-white"}`}
      >
        {e.value}
      </span>
    ))}
  </div>
);

/**
 * Bar tracks anchored against the middle divider, growing outward (away from center) as
 * the stat increases. Each track fills its full cell width with no gap between neighbors,
 * so adjacent bars butt up against each other like a step/staircase chart.
 */
const BarsRow: React.FC<{ entries: StatEntry[]; direction: "up" | "down" }> = ({ entries, direction }) => (
  <div className={`flex justify-center ${GAP_CLASS} flex-1`}>
    {entries.map((e) => (
      <div
        key={e.key}
        className={`${CELL_WIDTH_CLASS} h-full bg-slate-700/80 flex overflow-hidden ${
          direction === "up" ? "items-end" : "items-start"
        }`}
      >
        <div className="w-full" style={{ height: `${e.pct}%`, backgroundColor: e.barColor }} />
      </div>
    ))}
  </div>
);

/**
 * Mirrored layout: the nature name sits at the top, labels/numbers/bars radiate
 * outward (top half and bottom half) from a horizontal divider in the middle.
 * Columns pair HP/Speed, Attack/Defense, and Sp. Attack/Sp. Defense so each
 * physical stat lines up above its special counterpart.
 */
const TwoRowStatBars: React.FC<StatLayoutProps> = ({ base, nature }) => {
  const natureData = getNatureInfo(nature);
  const entries = computeStatEntries(base, nature);
  const byKey = (key: StatEntry["key"]) => entries.find((e) => e.key === key)!;

  const topRow = [byKey("HP"), byKey("Attack"), byKey("Sp. Attack")];
  const bottomRow = [byKey("Speed"), byKey("Defense"), byKey("Sp. Defense")];

  return (
    <div className="absolute inset-0 z-10 flex flex-col bg-slate-900/90 rounded-lg px-1 py-1">
      {natureData && (
        <div className="text-[8px] leading-none font-bold text-white/90 text-center mb-1">
          {natureData.name}
        </div>
      )}
      <LabelsRow entries={topRow} />
      <NumbersRow entries={topRow} />
      <BarsRow entries={topRow} direction="up" />
      <div className="h-px bg-white/70 my-0.5" />
      <BarsRow entries={bottomRow} direction="down" />
      <NumbersRow entries={bottomRow} />
      <LabelsRow entries={bottomRow} />
    </div>
  );
};

export default TwoRowStatBars;
