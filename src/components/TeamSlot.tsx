import React from "react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

interface TeamSlotProps {
  slot: any;
  index: number;
  updateSlot: (index: number, updates: Partial<any>) => void;
  getPokemonSpriteUrl: (pokemon: any, animated: boolean) => string;
  pokeballData: Record<string, { image: string; name: string }>;
  abilitiesData: Array<{ slug: string; name: string; description: string }>;
}

const TeamSlot: React.FC<TeamSlotProps> = ({
  slot,
  index,
  updateSlot,
  getPokemonSpriteUrl,
  pokeballData,
  abilitiesData,
}) => {
  const getAbilityData = (slug: string) => {
    return abilitiesData.find((a) => a.slug === slug);
  };

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <div
            className="bg-slate-800/80 border border-purple-500/20 rounded-lg p-2 flex flex-col items-center justify-between relative overflow-hidden group hover:border-purple-400/40 transition-all duration-300 cursor-pointer"
            onClick={() => slot.pokemon && updateSlot(index, { animated: !slot.animated })}
          >
            {/* Slot number and level indicator */}
            <div className="absolute top-1 left-1 flex flex-col items-start">
              {slot.pokemon && (
                <span className="text-xs font-bold text-purple-200 bg-slate-900/80 rounded px-1 mt-0.5">Lv {slot.level}</span>
              )}
            </div>

            {slot.pokemon ? (
              <>
                {/* Pokemon sprite - with configurable zoom for static sprites */}
                <div className="relative flex-1 flex items-center justify-center min-h-0 w-full">
                  <img
                    src={getPokemonSpriteUrl(slot.pokemon, slot.animated)}
                    alt={slot.pokemon.name.english}
                    className="object-contain drop-shadow-lg"
                    style={{
                      maxHeight: '140px',
                      width: '80%',
                      maxWidth: '80%',
                      // Apply zoom only for static sprites (animated gifs are perfect as-is)
                      transform: slot.animated ? 'none' : `scale(${slot.zoom})`,
                      objectPosition: 'center'
                    }}
                    onError={(e) => {
                      // Fallback to non-animated if animated fails
                      if (slot.animated) {
                        const target = e.target as HTMLImageElement;
                        target.src = getPokemonSpriteUrl(slot.pokemon!, false);
                      }
                    }}
                  />
                  {/* Pokeball indicator */}
                  <div className="absolute -top-1 -right-1">
                    <img
                      src={pokeballData[slot.pokeball].image}
                      alt={pokeballData[slot.pokeball].name}
                      className="w-6 h-6 drop-shadow-md"
                    />
                  </div>
                </div>

                {/* Pokemon info - larger fonts for better readability */}
                <div className="w-full text-center mt-1">
                  <div className="text-md font-bold text-white truncate">
                    {slot.nickname || slot.pokemon.name.english}
                  </div>
                </div>
              </>
            ) : (
              // Empty slot
              <div className="flex-1 flex items-center justify-center text-slate-500">
                <div className="text-center">
                  <div className="w-16 h-16 bg-slate-700/50 rounded-full mb-1 mx-auto flex items-center justify-center">
                    <span className="text-2xl">?</span>
                  </div>
                  <div className="text-sm">Vacío</div>
                </div>
              </div>
            )}
          </div>
        </TooltipTrigger>
        {slot.ability && getAbilityData(slot.ability) && (
          <TooltipContent className="text-sm max-w-xs">
            <div className="font-bold mb-1">{getAbilityData(slot.ability)?.name}</div>
            <div>{getAbilityData(slot.ability)?.description}</div>
          </TooltipContent>
        )}
      </Tooltip>
    </TooltipProvider>
  );
};

export default TeamSlot; 