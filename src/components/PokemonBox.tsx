
import React from "react";
import { TeamPokemon } from "@/types/pokemon";
import { getPokemonSpriteUrl } from "@/utils/pokemonData";

interface PokemonBoxProps {
  title: string;
  slots: TeamPokemon[];
  maxSlots?: number; // Optional for dynamic boxes
  onSlotClick?: (index: number) => void;
  selectedSlot?: number;
  onDragDrop?: (fromIndex: number, toIndex: number) => void;
  onDragDropExternal?: (fromBox: 'team' | 'other' | 'graveyard', fromIndex: number, toIndex: number) => void;
  boxType: 'team' | 'other' | 'graveyard';
  columnSpan?: number; // Column span of the panel containing this box
}

const PokemonBox: React.FC<PokemonBoxProps> = ({
  title,
  slots,
  maxSlots,
  onSlotClick,
  selectedSlot,
  onDragDrop,
  onDragDropExternal,
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
    
    if (pokemonCount === 0) {
      // If no Pokemon, show 0 slots
      targetSlotCount = 0;
    } else {
      // Find the next multiple of "slots per row" and fill to that
      const slotsPerRow = columnSpan * 2;
      const nextMultiple = Math.ceil(pokemonCount / slotsPerRow) * slotsPerRow;
      targetSlotCount = Math.min(nextMultiple, 200);
    }
  } else {
    targetSlotCount = maxSlots || 12;
  }

  // Fill empty slots
  const filledSlots = [...slots];
  while (filledSlots.length < targetSlotCount) {
    filledSlots.push({
      id: `empty-${boxType}-${filledSlots.length}`,
      pokemon: null,
      nickname: '',
      level: 1,
      ability: '',
      pokeball: 'pokeball',
      animated: false,
      zoom: 1.5,
      place: '',
      box: boxType,
    });
  }

  const handleDragStart = (e: React.DragEvent, index: number) => {
    const dragData = {
      boxType,
      index,
      pokemon: filledSlots[index]
    };
    e.dataTransfer.setData('application/json', JSON.stringify(dragData));
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };

  const handleDrop = (e: React.DragEvent, targetIndex: number) => {
    e.preventDefault();
    
    try {
      const dragData = JSON.parse(e.dataTransfer.getData('application/json'));
      const { boxType: sourceBoxType, index: sourceIndex } = dragData;
      
      if (sourceBoxType === boxType) {
        // Same box - use internal drag drop
        onDragDrop?.(sourceIndex, targetIndex);
      } else {
        // Different box - use external drag drop
        onDragDropExternal?.(sourceBoxType, sourceIndex, targetIndex);
      }
    } catch (error) {
      console.error('Error handling drop:', error);
    }
  };

  // Grid layout logic based on panel column span
  const getGridCols = () => {
    if (isTeamBox) return 'grid-cols-3'; // Team always 3 columns (2 rows of 3)
    
    // For dynamic boxes, slots per row = columnSpan * 2
    const slotsPerRow = columnSpan * 2;
    
    // Map to Tailwind grid classes
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
          Vacío
        </div>
      ) : (
        <div className={`grid gap-2 ${getGridCols()}`}>
          {filledSlots.map((slot, index) => (
            <button
            key={slot.id}
            onClick={() => onSlotClick?.(index)}
            draggable={slot.pokemon !== null}
            onDragStart={(e) => handleDragStart(e, index)}
            onDragOver={handleDragOver}
            onDrop={(e) => handleDrop(e, index)}
            className={`p-2 rounded border-2 transition-all ${
              selectedSlot === index
                ? 'border-purple-400 bg-purple-500/20'
                : 'border-slate-600 bg-slate-800/50 hover:border-purple-500/50'
            } ${slot.pokemon ? 'cursor-grab active:cursor-grabbing' : ''}`}
          >
            {slot.pokemon ? (
              <div className="text-center">
                <img
                  src={getPokemonSpriteUrl(slot.pokemon, false)}
                  alt={slot.pokemon.name.english}
                  className="w-8 h-8 mx-auto mb-1 pointer-events-none"
                  style={{
                    transform: `scale(${slot.zoom})`,
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
