
import React, { useState, useEffect } from "react";
import { TeamPokemon } from "@/types/pokemon";
import { getPokemonSpriteUrl, POKEBALL_DATA } from "@/utils/pokemonData";
import { MapPin, Moon } from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import abilitiesData from "@/data/abilities_es.json";
import placesData from "@/data/places_es.json";

interface CarouselSlotProps {
  otherBox: TeamPokemon[];
  graveyardBox: TeamPokemon[];
  intervalSeconds?: number;
}

const CarouselSlot: React.FC<CarouselSlotProps> = ({ 
  otherBox, 
  graveyardBox, 
  intervalSeconds = 10 
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);

  // Combine PC and graveyard boxes, filter out empty slots
  const allPokemon = [...otherBox, ...graveyardBox].filter(slot => slot.pokemon !== null);

  const getAbilityData = (slug: string) => {
    return abilitiesData.find((a) => a.slug === slug);
  };

  useEffect(() => {
    if (allPokemon.length === 0) return;

    const interval = setInterval(() => {
      setIsTransitioning(true);
      
      setTimeout(() => {
        setCurrentIndex(prev => (prev + 1) % allPokemon.length);
        setIsTransitioning(false);
      }, 150); // Half of transition duration
    }, intervalSeconds * 1000);

    return () => clearInterval(interval);
  }, [allPokemon.length, intervalSeconds]);

  const currentSlot = allPokemon[currentIndex];
  const isGraveyard = currentSlot?.box === 'graveyard';
  const isPC = currentSlot?.box === 'other';

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <div className="bg-gradient-to-br from-orange-800/60 to-amber-700/80 border-4 border-orange-400/70 rounded-lg p-2 flex flex-col items-center justify-between relative overflow-hidden group hover:border-orange-300/80 transition-all duration-300 cursor-pointer shadow-lg shadow-orange-500/20">
            {/* Carousel indicator */}
            <div className="absolute top-1 right-1">
              <div className="bg-orange-500/90 text-white text-xs px-1.5 py-0.5 rounded-full font-bold border border-orange-300/50">
                {allPokemon.length > 0 ? `${currentIndex + 1}/${allPokemon.length}` : '0/0'}
              </div>
            </div>

            {currentSlot ? (
              <>
                {/* Level indicator */}
                <div className="absolute top-1 left-1">
                  <span className="text-xs font-bold text-orange-200 bg-slate-900/90 rounded px-1 border border-orange-400/30">
                    Lv {currentSlot.level}
                  </span>
                </div>

                {/* Pokemon sprite with transition and box-specific styling */}
                <div className="relative flex-1 flex items-center justify-center min-h-0 w-full">
                  {/* Moon icon for PC Pokemon */}
                  {isPC && (
                    <div className="absolute -top-2 -left-1 z-10 text-blue-300 animate-pulse">
                      <Moon className="w-4 h-4 drop-shadow-md" />
                    </div>
                  )}
                  
                  <div 
                    className={`transition-all duration-300 ${
                      isTransitioning ? 'opacity-0 scale-95' : 'opacity-100 scale-100'
                    } ${isGraveyard ? 'grayscale' : ''}`}
                  >
                    <img
                      src={getPokemonSpriteUrl(currentSlot.pokemon, currentSlot.animated)}
                      alt={currentSlot.pokemon.name.english}
                      className={`object-contain drop-shadow-lg ${
                        isGraveyard ? 'opacity-80' : isPC ? 'opacity-90' : 'opacity-100'
                      }`}
                      style={{
                        maxHeight: '140px',
                        width: '80%',
                        maxWidth: '80%',
                        transform: `scale(${currentSlot.animated ? currentSlot.animatedZoom : currentSlot.staticZoom})`,
                        objectPosition: 'center'
                      }}
                      onError={(e) => {
                        if (currentSlot.animated) {
                          const target = e.target as HTMLImageElement;
                          target.src = getPokemonSpriteUrl(currentSlot.pokemon!, false);
                        }
                      }}
                    />
                  </div>
                  
                  {/* Pokeball indicator */}
                  <div className="absolute -top-1 -right-1">
                    <img
                      src={POKEBALL_DATA[currentSlot.pokeball].image}
                      alt={POKEBALL_DATA[currentSlot.pokeball].name}
                      className={`w-6 h-6 drop-shadow-md ${isGraveyard ? 'grayscale opacity-70' : ''}`}
                    />
                  </div>
                </div>

                {/* Pokemon info */}
                <div className="w-full text-center mt-1">
                  <div 
                    className={`text-md font-bold truncate transition-all duration-300 ${
                      isTransitioning ? 'opacity-0' : 'opacity-100'
                    } ${isGraveyard ? 'text-gray-300' : 'text-white'}`}
                  >
                    {currentSlot.nickname || currentSlot.pokemon.name.english}
                  </div>
                </div>

                {/* Box indicator with enhanced styling */}
                <div className="absolute bottom-1 right-1">
                  <div className={`text-xs px-1.5 py-0.5 rounded-full font-medium border ${
                    isGraveyard
                      ? 'bg-red-600/90 text-white border-red-400/50' 
                      : 'bg-blue-600/90 text-white border-blue-400/50'
                  }`}>
                    {isGraveyard ? '💀' : '💤'}
                  </div>
                </div>

                {/* Graveyard overlay effect */}
                {isGraveyard && (
                  <div className="absolute inset-0 bg-black/20 rounded-lg pointer-events-none" />
                )}
              </>
            ) : (
              // Empty state
              <div className="flex-1 flex items-center justify-center text-orange-400">
                <div className="text-center">
                  <div className="w-16 h-16 bg-orange-700/30 rounded-full mb-1 mx-auto flex items-center justify-center border-2 border-orange-500/30">
                    <span className="text-2xl">🔄</span>
                  </div>
                  <div className="text-sm">Carrusel</div>
                </div>
              </div>
            )}
          </div>
        </TooltipTrigger>
        {currentSlot && (
          <TooltipContent className="text-sm max-w-xs">
            <div className="font-bold mb-1">{getAbilityData(currentSlot.ability)?.name}</div>
            <div>{getAbilityData(currentSlot.ability)?.description}</div>
            {currentSlot.place && (
              <div className="flex items-center justify-center gap-1 text-xs text-purple-800 mt-0.5">
                <MapPin className="w-3 h-3 inline-block" />
                {currentSlot.place === 'unknown'
                  ? 'Desconocido'
                  : (placesData.find((p) => p.id === currentSlot.place)?.nombre || currentSlot.place)}
              </div>
            )}
            <div className="text-xs text-slate-400 mt-1">
              Caja: {currentSlot.box === 'graveyard' ? 'Cementerio' : 'PC'}
            </div>
          </TooltipContent>
        )}
      </Tooltip>
    </TooltipProvider>
  );
};

export default CarouselSlot;
