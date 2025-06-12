import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TeamPokemon } from "@/types/pokemon";
import { MapPin } from "lucide-react";
import { translations } from "@/data/translations";
import type { Place } from '@/types';

interface PlacesPanelProps {
  allSlots: TeamPokemon[];
  placesData: Place[];
}

const PlacesPanel: React.FC<PlacesPanelProps> = ({ allSlots, placesData }) => {
  // Get unique places from all Pokemon that have places and Pokemon assigned
  const uniquePlaces = allSlots
    .filter(slot => slot.pokemon && slot.place && slot.place !== '')
    .map(slot => slot.place)
    .filter((place, index, array) => array.indexOf(place) === index)
    .sort();

  // Get place names from placesData
  const getPlaceName = (placeId: string) => {
    if (placeId === 'unknown') return translations.placeholders.unknown;
    const place = placesData.find(p => p.id === placeId);
    return place ? place.name : placeId;
  };

  return (
    <Card className="bg-slate-800/90 border-purple-500/30 col-span-1">
      <CardHeader>
        <CardTitle className="text-purple-300 flex items-center gap-2">
          <MapPin className="w-5 h-5" />
          {translations.panels.placesPanel}
        </CardTitle>
      </CardHeader>
      <CardContent>
        {uniquePlaces.length > 0 ? (
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
        ) : (
          <div className="text-center text-slate-400 py-8">
            <MapPin className="w-12 h-12 mx-auto mb-3 opacity-50" />
            <p>{translations.messages.noPlaces}</p>
            <p className="text-xs mt-1">{translations.messages.assignPlaces}</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default PlacesPanel; 