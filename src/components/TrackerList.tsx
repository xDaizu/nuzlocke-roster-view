import React from "react";
import { TeamPokemon } from "@/types/pokemon";
import { TrackerEntry } from "@/types/tracker";
import { Place } from "@/data/regions";
import { MapPin, Gift, Sparkles } from "lucide-react";
import { translations } from "@/data/translations";
import { getPokemonSpriteUrl } from "@/utils/pokemonData";

interface TrackerListProps {
  allSlots: TeamPokemon[];
  trackerEntries: TrackerEntry[] | undefined;
  placesData: Place[];
  onSelectEncounter?: (entry: TrackerEntry) => void;
  className?: string;
}

const METHOD_BADGE: Record<NonNullable<TrackerEntry["method"]>, { label: string; icon: React.ReactNode }> = {
  gift: { label: translations.tracker.gift, icon: <Gift className="w-3 h-3" /> },
  static: { label: translations.tracker.static, icon: <Sparkles className="w-3 h-3" /> },
  fossil: { label: translations.tracker.fossil, icon: <Sparkles className="w-3 h-3" /> },
};

const TrackerList: React.FC<TrackerListProps> = ({ allSlots, trackerEntries, placesData, onSelectEncounter, className = "" }) => {
  const catchEntries = (trackerEntries ?? [])
    .filter(
      (entry): entry is TrackerEntry & { placeId: string } =>
        (entry.type === "route" || entry.type === "static") && !!entry.placeId
    )
    .sort((a, b) => a.order - b.order);

  if (catchEntries.length === 0) {
    return (
      <div className="text-center text-slate-400 py-8">
        <MapPin className="w-12 h-12 mx-auto mb-3 opacity-50" />
        <p>{translations.messages.trackerUnavailable}</p>
      </div>
    );
  }

  return (
    <div className={`space-y-1 ${className}`}>
      {catchEntries.map((entry) => {
        const caughtSlots = allSlots.filter(slot => slot.pokemon && slot.place === entry.placeId);
        const isCaught = caughtSlots.length > 0;
        const placeName = placesData.find(p => p.id === entry.placeId)?.nombre ?? entry.name;
        const badge = entry.method ? METHOD_BADGE[entry.method] : null;

        return (
          <button
            key={entry.placeId}
            type="button"
            onClick={() => onSelectEncounter?.(entry)}
            title={translations.tracker.createHere}
            className={`w-full flex flex-col gap-1.5 rounded-lg p-2 border text-left transition-colors ${
              isCaught
                ? "bg-green-900/30 border-green-500/40"
                : "bg-slate-700/50 border-slate-600/50 hover:bg-slate-700"
            }`}
          >
            <div className="flex items-center gap-3">
              {isCaught ? (
                <img
                  src={getPokemonSpriteUrl(caughtSlots[0].pokemon!, false)}
                  alt={caughtSlots[0].pokemon!.name.english}
                  className="w-8 h-8 shrink-0"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.style.display = "none";
                  }}
                />
              ) : (
                <div className="w-8 h-8 shrink-0 bg-slate-600 rounded flex items-center justify-center">
                  {badge ? (
                    <span className="text-slate-300">{badge.icon}</span>
                  ) : (
                    <span className="text-slate-400 text-xs">?</span>
                  )}
                </div>
              )}
              <span className={`text-sm font-medium truncate ${isCaught ? "text-white" : "text-slate-300"}`}>
                {placeName}
              </span>
              {badge && (
                <span className="ml-auto shrink-0 flex items-center gap-1 text-[10px] uppercase tracking-wide text-purple-300 bg-purple-500/10 border border-purple-500/30 rounded px-1.5 py-0.5">
                  {badge.icon}
                  {badge.label}
                </span>
              )}
            </div>
            {isCaught && (
              <div className="pl-11 space-y-0.5">
                {caughtSlots.map((slot, index) => (
                  <div key={`${slot.id}-${index}`} className="text-xs text-slate-300 truncate">
                    {slot.nickname || translations.placeholders.noName} ({slot.pokemon?.name.english})
                  </div>
                ))}
              </div>
            )}
          </button>
        );
      })}
    </div>
  );
};

export default TrackerList;
