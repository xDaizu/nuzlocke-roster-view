import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TeamPokemon } from "@/types/pokemon";
import { TrackerEntry } from "@/types/tracker";
import { Place } from "@/data/regions";
import { MapPin, Gift, Sparkles } from "lucide-react";
import { translations } from "@/data/translations";
import { getPokemonSpriteUrl } from "@/utils/pokemonData";

interface TrackerPanelProps {
  allSlots: TeamPokemon[];
  trackerEntries: TrackerEntry[] | undefined;
  placesData: Place[];
  onSelectEncounter?: (entry: TrackerEntry) => void;
}

const METHOD_BADGE: Record<NonNullable<TrackerEntry["method"]>, { label: string; icon: React.ReactNode }> = {
  gift: { label: translations.tracker.gift, icon: <Gift className="w-3 h-3" /> },
  static: { label: translations.tracker.static, icon: <Sparkles className="w-3 h-3" /> },
  fossil: { label: translations.tracker.fossil, icon: <Sparkles className="w-3 h-3" /> },
};

const TrackerPanel: React.FC<TrackerPanelProps> = ({ allSlots, trackerEntries, placesData, onSelectEncounter }) => {
  const catchEntries = (trackerEntries ?? [])
    .filter(
      (entry): entry is TrackerEntry & { placeId: string } =>
        (entry.type === "route" || entry.type === "static") && !!entry.placeId
    )
    .sort((a, b) => a.order - b.order);

  return (
    <Card className="bg-slate-800/90 border-purple-500/30 col-span-1">
      <CardHeader>
        <CardTitle className="text-purple-300 flex items-center gap-2">
          <MapPin className="w-5 h-5" />
          {translations.panels.placesPanel}
        </CardTitle>
      </CardHeader>
      <CardContent>
        {catchEntries.length === 0 ? (
          <div className="text-center text-slate-400 py-8">
            <MapPin className="w-12 h-12 mx-auto mb-3 opacity-50" />
            <p>{translations.messages.trackerUnavailable}</p>
          </div>
        ) : (
          <div className="space-y-1 max-h-[32rem] overflow-y-auto pr-1">
            {catchEntries.map((entry) => {
              const caughtSlot = allSlots.find(slot => slot.pokemon && slot.place === entry.placeId);
              const placeName = placesData.find(p => p.id === entry.placeId)?.nombre ?? entry.name;
              const badge = entry.method ? METHOD_BADGE[entry.method] : null;

              return (
                <button
                  key={entry.placeId}
                  type="button"
                  onClick={() => onSelectEncounter?.(entry)}
                  title={translations.tracker.createHere}
                  className={`w-full flex items-center gap-3 rounded-lg p-2 border text-left transition-colors ${
                    caughtSlot
                      ? "bg-green-900/30 border-green-500/40"
                      : "bg-slate-700/50 border-slate-600/50 hover:bg-slate-700"
                  }`}
                >
                  {caughtSlot ? (
                    <img
                      src={getPokemonSpriteUrl(caughtSlot.pokemon!, false)}
                      alt={caughtSlot.pokemon!.name.english}
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
                  <span className={`text-sm font-medium truncate ${caughtSlot ? "text-white" : "text-slate-300"}`}>
                    {placeName}
                  </span>
                  {badge && (
                    <span className="ml-auto shrink-0 flex items-center gap-1 text-[10px] uppercase tracking-wide text-purple-300 bg-purple-500/10 border border-purple-500/30 rounded px-1.5 py-0.5">
                      {badge.icon}
                      {badge.label}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default TrackerPanel;
