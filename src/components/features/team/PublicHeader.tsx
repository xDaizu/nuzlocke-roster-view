import React, { useEffect, useState } from "react";
import { TeamPokemon } from "@/types/pokemon";
import { getPokemonSpriteUrl, POKEBALL_DATA } from "@/utils/pokemonData";
import TeamSlot from "./TeamSlot";
import { PlaceRepository } from '@/repositories/PlaceRepository';
import type { Place } from '@/types';
import { RepositoryFactory } from '@/repositories';
import type { Ability } from '@/types';

interface PublicHeaderProps {
  team: TeamPokemon[];
  updateSlot: (slotIndex: number, updates: Partial<TeamPokemon>) => void;
  placesData: Place[];
}

const abilitiesRepo = RepositoryFactory.createAbilitiesRepository();

const [abilitiesData, setAbilitiesData] = useState<Ability[]>([]);

useEffect(() => {
  abilitiesRepo.getAll().then(setAbilitiesData);
}, []);

const PublicHeader: React.FC<PublicHeaderProps> = ({ team, updateSlot, placesData }) => {
  return (
    <div className="fixed top-0 left-0 right-0 z-50 bg-gradient-to-br from-purple-900 via-slate-900 to-red-900 p-4 border-b border-purple-500/30">
      <div className="w-[800px] h-[130px] bg-gradient-to-r from-slate-900 via-purple-900/20 to-slate-900 border-2 border-purple-500/30 rounded-lg overflow-hidden mx-auto">
        <div className="h-full p-3">
          <div className="grid grid-cols-6 gap-2 h-full">
            {team.map((slot, index) => (
              <TeamSlot
                key={slot.id}
                slot={slot}
                index={index}
                updateSlot={updateSlot}
                getPokemonSpriteUrl={getPokemonSpriteUrl}
                pokeballData={POKEBALL_DATA}
                abilitiesData={abilitiesData}
                placesData={placesData}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PublicHeader;
