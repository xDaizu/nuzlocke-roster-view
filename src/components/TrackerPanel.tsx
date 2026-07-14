import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TeamPokemon } from "@/types/pokemon";
import { TrackerEntry } from "@/types/tracker";
import { Place } from "@/data/regions";
import { MapPin } from "lucide-react";
import { translations } from "@/data/translations";
import { getPokemonSpriteUrl } from "@/utils/pokemonData";

interface TrackerPanelProps {
  allSlots: TeamPokemon[];
  trackerEntries: TrackerEntry[] | undefined;
  placesData: Place[];
}

const TrackerPanel: React.FC<TrackerPanelProps> = ({ allSlots, trackerEntries, placesData }) => {
  const routeEntries = (trackerEntries ?? []).filter(
    (entry): entry is TrackerEntry & { placeId: string } => entry.type === "route" && !!entry.placeId
  );

  return (
    <Card className="bg-slate-800/90 border-purple-500/30 col-span-1">
      <CardHeader>
        <CardTitle className="text-purple-300 flex items-center gap-2">
          <MapPin className="w-5 h-5" />
          {translations.panels.placesPanel}
        </CardTitle>
      </CardHeader>
      <CardContent>
        {routeEntries.length === 0 ? (
          <div className="text-center text-slate-400 py-8">
            <MapPin className="w-12 h-12 mx-auto mb-3 opacity-50" />
            <p>{translations.messages.trackerUnavailable}</p>
          </div>
        ) : (
          <div className="space-y-1 max-h-[32rem] overflow-y-auto pr-1">
            {routeEntries.map((entry) => {
              const caughtSlot = allSlots.find(slot => slot.pokemon && slot.place === entry.placeId);
              const placeName = placesData.find(p => p.id === entry.placeId)?.nombre ?? entry.name;

              return (
                <div
                  key={entry.placeId}
                  className={`flex items-center gap-3 rounded-lg p-2 border ${
                    caughtSlot
                      ? "bg-green-900/30 border-green-500/40"
                      : "bg-slate-700/50 border-slate-600/50"
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
                      <span className="text-slate-400 text-xs">?</span>
                    </div>
                  )}
                  <span className={`text-sm font-medium truncate ${caughtSlot ? "text-white" : "text-slate-300"}`}>
                    {placeName}
                  </span>
                </div>
              );
            })}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default TrackerPanel;
