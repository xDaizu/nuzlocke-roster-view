
import React from "react";
import { TeamPokemon } from "@/types/pokemon";
import { getPokemonSpriteUrl } from "@/utils/pokemonData";

interface PokemonBoxProps {
  title: string;
  slots: TeamPokemon[];
  maxSlots: number;
  onSlotClick?: (index: number) => void;
  selectedSlot?: number;
  onDragDrop?: (fromIndex: number, toIndex: number) => void;
  onDragDropExternal?: (fromBox: 'team' | 'other' | 'graveyard', fromIndex: number, toIndex: number) => void;
  boxType: 'team' | 'other' | 'graveyard';
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
}) => {
  // Fill empty slots
  const filledSlots = [...slots];
  while (filledSlots.length < maxSlots) {
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

  return (
    <div className="bg-slate-700/50 rounded-lg p-3">
      <h3 className="text-purple-300 font-medium mb-3 text-sm">{title}</h3>
      <div className={`grid gap-2 ${maxSlots === 6 ? 'grid-cols-3' : 'grid-cols-4'}`}>
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
    </div>
  );
};

export default PokemonBox;
