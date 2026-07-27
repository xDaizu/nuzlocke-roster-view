import { computeStatEntries, getNatureInfo } from "./statHelpers";
import StatColumn from "./StatColumn";
import type { StatLayoutProps } from "./SingleRowStatBars";

/** Two rows of 3 stat bars, with the nature name sandwiched in between. */
const TwoRowStatBars: React.FC<StatLayoutProps> = ({ base, nature }) => {
  const natureData = getNatureInfo(nature);
  const entries = computeStatEntries(base, nature);
  const topRow = entries.slice(0, 3);
  const bottomRow = entries.slice(3);

  return (
    <div className="absolute inset-0 z-10 flex flex-col justify-between bg-slate-900/90 rounded-lg px-1 py-1">
      <div className="flex items-end justify-between gap-0.5 flex-1">
        {topRow.map((entry) => (
          <StatColumn key={entry.key} entry={entry} maxBarPx={18} />
        ))}
      </div>
      {natureData && (
        <div className="text-[8px] leading-none font-bold text-white/90 text-center my-0.5">
          {natureData.name}
        </div>
      )}
      <div className="flex items-end justify-between gap-0.5 flex-1">
        {bottomRow.map((entry) => (
          <StatColumn key={entry.key} entry={entry} maxBarPx={18} />
        ))}
      </div>
    </div>
  );
};

export default TwoRowStatBars;
