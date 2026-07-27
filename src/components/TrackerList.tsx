import React from "react";
import { TeamPokemon } from "@/types/pokemon";
import { TrackerEntry } from "@/types/tracker";
import { Place } from "@/data/regions";
import { MapPin, Gift, Sparkles, X } from "lucide-react";
import { translations } from "@/data/translations";
import { getPokemonSpriteUrl } from "@/utils/pokemonData";

interface TrackerListProps {
  allSlots: TeamPokemon[];
  trackerEntries: TrackerEntry[] | undefined;
  placesData: Place[];
  onSelectEncounter?: (entry: TrackerEntry) => void;
  missedPlaceIds?: string[];
  onToggleMissed?: (entry: TrackerEntry) => void;
  className?: string;
}

const METHOD_BADGE: Record<NonNullable<TrackerEntry["method"]>, { label: string; icon: React.ReactNode }> = {
  gift: { label: translations.tracker.gift, icon: <Gift className="w-3 h-3" /> },
  static: { label: translations.tracker.static, icon: <Sparkles className="w-3 h-3" /> },
  fossil: { label: translations.tracker.fossil, icon: <Sparkles className="w-3 h-3" /> },
};

const TrackerList: React.FC<TrackerListProps> = ({
  allSlots,
  trackerEntries,
  placesData,
  onSelectEncounter,
  missedPlaceIds,
  onToggleMissed,
  className = "",
}) => {
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
        const isMissed = !isCaught && (missedPlaceIds?.includes(entry.placeId) ?? false);
        const placeName = placesData.find(p => p.id === entry.placeId)?.nombre ?? entry.name;
        const badge = entry.method ? METHOD_BADGE[entry.method] : null;

        return (
          <div
            key={entry.placeId}
            className={`flex flex-col gap-1.5 rounded-lg p-2 border transition-colors ${
              isCaught
                ? "bg-green-900/30 border-green-500/40"
                : isMissed
                ? "bg-red-950/30 border-red-500/30"
                : "bg-slate-700/50 border-slate-600/50 hover:bg-slate-700"
            }`}
          >
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => onSelectEncounter?.(entry)}
                title={translations.tracker.createHere}
                className="flex-1 flex items-center gap-3 text-left min-w-0"
              >
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
                ) : isMissed ? (
                  <div className="w-8 h-8 shrink-0 bg-red-900/50 rounded flex items-center justify-center">
                    <X className="w-4 h-4 text-red-400" />
                  </div>
                ) : (
                  <div className="w-8 h-8 shrink-0 bg-slate-600 rounded flex items-center justify-center">
                    {badge ? (
                      <span className="text-slate-300">{badge.icon}</span>
                    ) : (
                      <span className="text-slate-400 text-xs">?</span>
                    )}
                  </div>
                )}
                <span
                  className={`text-sm font-medium truncate ${
                    isCaught ? "text-white" : isMissed ? "text-red-300/80 line-through" : "text-slate-300"
                  }`}
                >
                  {placeName}
                </span>
              </button>
              {badge && (
                <span className="ml-auto shrink-0 flex items-center gap-1 text-[10px] uppercase tracking-wide text-purple-300 bg-purple-500/10 border border-purple-500/30 rounded px-1.5 py-0.5">
                  {badge.icon}
                  {badge.label}
                </span>
              )}
              {!isCaught && onToggleMissed && (
                <button
                  type="button"
                  onClick={() => onToggleMissed(entry)}
                  title={isMissed ? translations.tracker.unmarkMissed : translations.tracker.markMissed}
                  className={`shrink-0 w-6 h-6 flex items-center justify-center rounded transition-colors ${
                    isMissed
                      ? "bg-red-500/80 text-white hover:bg-red-500"
                      : "text-slate-500 hover:text-red-400 hover:bg-red-500/10"
                  }`}
                >
                  <X className="w-3.5 h-3.5" />
                </button>
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
          </div>
        );
      })}
    </div>
  );
};

export default TrackerList;
