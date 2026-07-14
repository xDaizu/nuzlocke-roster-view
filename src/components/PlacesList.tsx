import React from "react";
import { TeamPokemon } from "@/types/pokemon";
import { MapPin } from "lucide-react";
import { translations } from "@/data/translations";
import { usePlacesData } from "@/hooks/usePlacesData";

interface PlacesListProps {
  allSlots: TeamPokemon[];
  placesData: Array<{ id: string; nombre: string }>;
}

const PlacesList: React.FC<PlacesListProps> = ({ allSlots, placesData }) => {
  const { uniquePlaces, getPlaceName } = usePlacesData(allSlots, placesData);

  if (uniquePlaces.length === 0) {
    return (
      <div className="text-center text-slate-400 py-8">
        <MapPin className="w-12 h-12 mx-auto mb-3 opacity-50" />
        <p>{translations.messages.noPlaces}</p>
        <p className="text-xs mt-1">{translations.messages.assignPlaces}</p>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      {uniquePlaces.map((placeId) => {
        const pokemonFromPlace = allSlots.filter(slot =>
          slot.pokemon && slot.place === placeId
        );

        return (
          <div
            key={placeId}
            className="bg-slate-700/50 rounded-lg p-3 border border-purple-500/20"
          >
            <div className="flex items-center gap-2 mb-2">
              <MapPin className="w-4 h-4 text-purple-400" />
              <span className="text-white text-sm font-medium">
                {getPlaceName(placeId)}
              </span>
            </div>
            <div className="space-y-1">
              {pokemonFromPlace.map((slot, index) => (
                <div key={`${slot.id}-${index}`} className="text-xs text-slate-300">
                  {slot.nickname || translations.placeholders.noName} ({slot.pokemon?.name.english || translations.placeholders.unknown})
                </div>
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default PlacesList;
