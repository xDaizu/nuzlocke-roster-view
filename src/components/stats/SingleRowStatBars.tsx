import type { Pokemon } from "@/types/pokemon";
import { computeStatEntries, getNatureInfo } from "./statHelpers";
import StatColumn from "./StatColumn";

export interface StatLayoutProps {
  base: Pokemon["base"];
  nature?: string;
}

/** One row of all 6 stat bars, with the nature name above. */
const SingleRowStatBars: React.FC<StatLayoutProps> = ({ base, nature }) => {
  const natureData = getNatureInfo(nature);
  const entries = computeStatEntries(base, nature);

  return (
    <div className="absolute inset-0 z-10 flex flex-col bg-slate-900/90 rounded-lg px-1 pb-1 pt-1">
      {natureData && (
        <div className="text-[8px] leading-none font-bold text-white/90 text-center mb-1">
          {natureData.name}
        </div>
      )}
      <div className="flex items-end justify-between gap-0.5 flex-1">
        {entries.map((entry) => (
          <StatColumn key={entry.key} entry={entry} maxBarPx={48} />
        ))}
      </div>
    </div>
  );
};

export default SingleRowStatBars;
