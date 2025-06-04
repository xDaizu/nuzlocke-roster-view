
import { useState, useEffect } from "react";
import { TeamPokemon } from "@/types/pokemon";
import { loadTeam } from "@/utils/teamStorage";
import { getPokemonSpriteUrl, POKEBALL_DATA } from "@/utils/pokemonData";

const PublicView = () => {
  const [team, setTeam] = useState<TeamPokemon[]>([]);

  useEffect(() => {
    const loadTeamData = () => {
      const savedTeam = loadTeam();
      setTeam(savedTeam);
    };

    // Load initial data
    loadTeamData();

    // Listen for storage changes (when admin updates team)
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'nuzlocke-team') {
        loadTeamData();
      }
    };

    window.addEventListener('storage', handleStorageChange);
    
    // Also check for changes periodically (for same-tab updates)
    const interval = setInterval(loadTeamData, 1000);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      clearInterval(interval);
    };
  }, []);

  return (
    <div className="w-[1000px] h-[300px] bg-gradient-to-r from-slate-900 via-purple-900/20 to-slate-900 border-2 border-purple-500/30 rounded-lg overflow-hidden">
      <div className="h-full p-4">
        <div className="grid grid-cols-6 gap-3 h-full">
          {team.map((slot, index) => (
            <div
              key={slot.id}
              className="bg-slate-800/80 border border-purple-500/20 rounded-lg p-3 flex flex-col items-center justify-between relative overflow-hidden group hover:border-purple-400/40 transition-all duration-300"
            >
              {/* Slot number indicator */}
              <div className="absolute top-1 left-1 text-xs font-bold text-purple-300/60">
                {index + 1}
              </div>

              {slot.pokemon ? (
                <>
                  {/* Pokemon sprite - main focal point */}
                  <div className="relative flex-1 flex items-center justify-center">
                    <img
                      src={getPokemonSpriteUrl(slot.pokemon, slot.animated)}
                      alt={slot.pokemon.name.english}
                      className="max-w-full max-h-full object-contain drop-shadow-lg"
                      style={{ maxHeight: '120px' }}
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
                        src={POKEBALL_DATA[slot.pokeball].image}
                        alt={POKEBALL_DATA[slot.pokeball].name}
                        className="w-6 h-6 drop-shadow-md"
                      />
                    </div>
                  </div>

                  {/* Pokemon info */}
                  <div className="w-full text-center space-y-1">
                    <div className="text-sm font-bold text-white truncate">
                      {slot.nickname || slot.pokemon.name.english}
                    </div>
                    <div className="text-xs text-purple-300 font-medium">
                      Lv. {slot.level}
                    </div>
                    {slot.ability && (
                      <div className="text-xs text-red-300 truncate" title={slot.ability}>
                        {slot.ability}
                      </div>
                    )}
                  </div>
                </>
              ) : (
                // Empty slot
                <div className="flex-1 flex items-center justify-center text-slate-500">
                  <div className="text-center">
                    <div className="w-16 h-16 bg-slate-700/50 rounded-full mb-2 mx-auto flex items-center justify-center">
                      <span className="text-2xl">?</span>
                    </div>
                    <div className="text-xs">Empty Slot</div>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default PublicView;
