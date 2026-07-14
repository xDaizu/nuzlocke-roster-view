import { TeamPokemon } from "@/types/pokemon";
import { translations } from "@/data/translations";
import { getAllPlaces } from "@/data/regions";

export function usePlacesData(
  allSlots: TeamPokemon[],
  placesData: Array<{ id: string; nombre: string }>
) {
  const uniquePlaces = allSlots
    .filter(slot => slot.pokemon && slot.place && slot.place !== '')
    .map(slot => slot.place)
    .filter((place, index, array) => array.indexOf(place) === index)
    .sort();

  const getPlaceName = (placeId: string) => {
    if (placeId === 'unknown') return translations.placeholders.unknown;
    const place = placesData.find(p => p.id === placeId) ?? getAllPlaces().find(p => p.id === placeId);
    return place ? place.nombre : placeId;
  };

  return { uniquePlaces, getPlaceName };
}
