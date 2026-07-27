import type { Pokemon } from "@/types/pokemon";
import naturesData from "@/data/natures_es.json";

interface StatBarsProps {
  base: Pokemon["base"];
  nature?: string;
}

const STAT_CONFIG: Array<{ key: keyof Pokemon["base"]; label: string }> = [
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

function getStatColor(value: number): string {
  if (value < 60) return "#ef4444"; // red-500
  if (value < 90) return "#f97316"; // orange-500
  if (value < 120) return "#eab308"; // yellow-500
  if (value < 150) return "#22c55e"; // green-500
  return "#06b6d4"; // cyan-500
}

const StatBars: React.FC<StatBarsProps> = ({ base, nature }) => {
  const natureData = naturesData.find((n) => n.slug === nature);

  return (
    <div className="absolute inset-0 z-10 flex flex-col bg-slate-900/90 rounded-lg px-1 pb-1 pt-1">
      {natureData && (
        <div className="text-[8px] leading-none font-bold text-white/90 text-center mb-1">
          {natureData.name}
        </div>
      )}
      <div className="flex items-end justify-between gap-0.5 flex-1">
        {STAT_CONFIG.map(({ key, label }) => {
          const isIncreased = natureData?.increase === key;
          const isDecreased = natureData?.decrease === key;
          const value = Math.round(base[key] * (isIncreased ? 1.1 : isDecreased ? 0.9 : 1));
          const pct = Math.min(100, (value / MAX_STAT_REFERENCE) * 100);
          const color = getStatColor(value);
          const natureColor = isIncreased ? "text-red-400" : isDecreased ? "text-blue-400" : "";
          const labelColor = natureColor || "text-slate-300";
          return (
            <div key={key} className="flex flex-col items-center flex-1 h-full justify-end">
              <span className={`text-[7px] leading-none font-bold h-[7px] ${natureColor}`}>
                {isIncreased ? "+" : isDecreased ? "−" : ""}
              </span>
              <span className={`text-[8px] leading-none font-bold mb-0.5 ${natureColor || "text-white"}`}>{value}</span>
              <div className="w-2 flex-1 max-h-[48px] bg-slate-700/80 rounded-sm flex items-end overflow-hidden">
                <div
                  className="w-full rounded-sm"
                  style={{ height: `${pct}%`, backgroundColor: color }}
                />
              </div>
              <span className={`text-[7px] leading-none mt-0.5 font-semibold ${labelColor}`}>{label}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default StatBars;
