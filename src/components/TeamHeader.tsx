import { TeamPokemon } from "@/types/pokemon";
import { getPokemonSpriteUrl, POKEBALL_DATA } from "@/utils/pokemonData";
import { createEmptySlot } from "@/utils/slots";
import TeamSlot from "@/components/TeamSlot";
import abilitiesData from "@/data/abilities_es.json";
import { Place } from "@/data/regions";

interface TeamHeaderProps {
  team: TeamPokemon[];
  allSlots: TeamPokemon[];
  updateSlot: (index: number, updates: Partial<TeamPokemon>) => void;
  placesData: Place[];
}

/** Fixed top header showing the 6 team slots. */
const TeamHeader: React.FC<TeamHeaderProps> = ({ team, allSlots, updateSlot, placesData }) => (
  <div className="fixed top-0 left-0 right-0 z-50 bg-gradient-to-br from-purple-900 via-slate-900 to-red-900 p-4 border-b border-purple-500/30">
    <div className="w-[800px] h-[130px] bg-gradient-to-r from-slate-900 via-purple-900/20 to-slate-900 border-2 border-purple-500/30 rounded-lg overflow-hidden mx-auto">
      <div className="h-full p-3">
        <div className="grid grid-cols-6 gap-2 h-full">
          {Array.from({ length: 6 }, (_, index) => {
            const slot = team[index] || createEmptySlot(`team-header-${index}`, 'team');

            // Find the correct index in allSlots for this team slot
            const actualSlotIndex = team[index]
              ? allSlots.findIndex(s => s.id === team[index].id)
              : -1;

            return (
              <TeamSlot
                key={slot.id}
                slot={slot}
                index={actualSlotIndex}
                updateSlot={updateSlot}
                getPokemonSpriteUrl={getPokemonSpriteUrl}
                pokeballData={POKEBALL_DATA}
                abilitiesData={abilitiesData}
                placesData={placesData}
              />
            );
          })}
        </div>
      </div>
    </div>
  </div>
);

export default TeamHeader;
