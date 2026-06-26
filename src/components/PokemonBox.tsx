import React from "react";
import { TeamPokemon } from "@/types/pokemon";
import { getPokemonSpriteUrl } from "@/utils/pokemonData";
import { createEmptySlot } from "@/utils/slots";
import { translations } from "@/data/translations";

interface PokemonBoxProps {
  title: string;
  slots: TeamPokemon[];
  maxSlots?: number; // Optional for dynamic boxes
  onSlotClick?: (index: number) => void;
  selectedSlot?: number;
  boxType: 'team' | 'other' | 'graveyard';
  columnSpan?: number; // Column span of the panel containing this box
}

const PokemonBox: React.FC<PokemonBoxProps> = ({
  title,
  slots,
  maxSlots,
  onSlotClick,
  selectedSlot,
  boxType,
  columnSpan = 2,
}) => {
  // Dynamic sizing logic
  const isDynamicBox = boxType === 'other' || boxType === 'graveyard';
  const isTeamBox = boxType === 'team';
  
  let targetSlotCount: number;
  if (isTeamBox) {
    // Team box is always 6 slots
    targetSlotCount = maxSlots || 6;
  } else if (isDynamicBox) {
    // Dynamic boxes: show pokemon + minimal empty slots for interaction, max 200
    const pokemonCount = slots.filter(slot => slot.pokemon).length;
    const slotsPerRow = columnSpan * 2;
    if (pokemonCount === 0) {
      // If no Pokemon, show a full row of empty slots
      targetSlotCount = slotsPerRow;
    } else {
      // Always at least one empty slot
      let nextMultiple = Math.ceil((pokemonCount + 1) / slotsPerRow) * slotsPerRow;
      if (pokemonCount % slotsPerRow === 0) {
        nextMultiple = pokemonCount + slotsPerRow;
      }
      targetSlotCount = Math.min(nextMultiple, 200);
    }
  } else {
    targetSlotCount = maxSlots || 12;
  }

  // Fill empty slots
  const filledSlots = [...slots];
  while (filledSlots.length < targetSlotCount) {
    filledSlots.push(createEmptySlot(`empty-${boxType}-${filledSlots.length}`, boxType));
  }

  // Add getGridCols function back
  const getGridCols = () => {
    if (isTeamBox) return 'grid-cols-3'; // Team always 3 columns (2 rows of 3)
    // For dynamic boxes, slots per row = columnSpan * 2
    const slotsPerRow = columnSpan * 2;
    const gridClasses: Record<number, string> = {
      2: 'grid-cols-2',
      4: 'grid-cols-4',
      6: 'grid-cols-6',
      8: 'grid-cols-8',
      10: 'grid-cols-10',
      12: 'grid-cols-12'
    };
    return gridClasses[slotsPerRow] || 'grid-cols-4'; // Default fallback
  };

  return (
    <div className="bg-slate-700/50 rounded-lg p-3">
      <h3 className="text-purple-300 font-medium mb-3 text-sm">{title}</h3>
      {targetSlotCount === 0 ? (
        <div className="text-center text-slate-400 py-4 text-xs">
          {translations.messages.empty}
        </div>
      ) : (
        <div className={`grid gap-2 ${getGridCols()}`}>
          {filledSlots.map((slot, index) => (
            <button
            key={slot.id}
            onClick={() => onSlotClick?.(index)}
            className={`p-2 rounded border-2 transition-all ${
              selectedSlot === index
                ? 'border-purple-400 bg-purple-500/20'
                : 'border-slate-600 bg-slate-800/50 hover:border-purple-500/50'
            }`}
          >
            {slot.pokemon ? (
              <div className="text-center">
                <img
                  src={getPokemonSpriteUrl(slot.pokemon, false)}
                  alt={slot.pokemon.name.english}
                  className="w-8 h-8 mx-auto mb-1 pointer-events-none"
                                        style={{
                        transform: 'scale(1.0)',
                        objectPosition: 'center'
                      }}
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.style.display = 'none';
                  }}
                />
                <div className="text-xs text-white font-medium truncate">
                  {slot.nickname || slot.pokemon.name.english}
                </div>
              </div>
            ) : (
              <div className="w-8 h-8 bg-slate-600 rounded mx-auto mb-1 flex items-center justify-center">
                <span className="text-slate-400 text-xs">?</span>
              </div>
            )}
          </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default PokemonBox;
