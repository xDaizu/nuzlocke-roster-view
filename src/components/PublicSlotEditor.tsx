
import React from "react";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { TeamPokemon, Pokemon } from "@/types/pokemon";
import { getPokemonSpriteUrl, POKEBALL_DATA } from "@/utils/pokemonData";
import { getCustomSpriteUrl } from "@/data/customSprites";
import SlotEditor from "@/components/SlotEditor";
import { Place } from "@/data/regions";

interface PublicSlotEditorProps {
  currentSlot: TeamPokemon;
  allPokemon: Pokemon[];
  selectedSlot: number;
  onUpdate: (updates: Partial<TeamPokemon>) => void;
  onClear: () => void;
  placesData: Place[];
}

const PublicSlotEditor: React.FC<PublicSlotEditorProps> = ({
  currentSlot,
  allPokemon,
  selectedSlot,
  onUpdate,
  onClear,
  placesData,
}) => {
  return (
    <Card className="bg-slate-800/90 border-purple-500/30 col-span-1 lg:col-span-2">
      <SlotEditor
        slot={currentSlot}
        allPokemon={allPokemon}
        pokeballData={POKEBALL_DATA}
        onUpdate={onUpdate}
        onClear={onClear}
        slotIndex={selectedSlot}
        showHeader={true}
        placesData={placesData}
      />
      {/* Preview */}
      {currentSlot.pokemon && (
        <div className="mt-4 p-4 bg-slate-700/50 rounded-lg">
          <Label className="text-slate-300 mb-2 block">Preview</Label>
          <div className="flex items-center gap-4">
            {(() => {
              const customUrl = currentSlot.customSprite
                ? getCustomSpriteUrl(currentSlot.pokemon!.id, currentSlot.customSprite)
                : undefined;
              const previewSrc = customUrl ?? getPokemonSpriteUrl(currentSlot.pokemon!, currentSlot.animated);
              const zoom = currentSlot.animated && !customUrl ? currentSlot.animatedZoom : currentSlot.staticZoom;
              const tx = currentSlot.animated && !customUrl ? (currentSlot.animatedTranslateX ?? 0) : (currentSlot.staticTranslateX ?? 0);
              const ty = currentSlot.animated && !customUrl ? (currentSlot.animatedTranslateY ?? 0) : (currentSlot.staticTranslateY ?? 0);
              return (
                <img
                  src={previewSrc}
                  alt={currentSlot.pokemon!.name.english}
                  className="w-16 h-16"
                  style={{ transform: `scale(${zoom}) translate(${tx}px, ${ty}px)`, objectPosition: 'center' }}
                  onError={(e) => {
                    if (currentSlot.animated && !customUrl) {
                      (e.target as HTMLImageElement).src = getPokemonSpriteUrl(currentSlot.pokemon!, false);
                    }
                  }}
                />
              );
            })()}
            <div>
              <div className="text-white font-medium">
                {currentSlot.nickname || currentSlot.pokemon.name.english}
              </div>
              {currentSlot.ability && (
                <div className="text-red-300 text-sm">{currentSlot.ability}</div>
              )}
            </div>
            <img
              src={POKEBALL_DATA[currentSlot.pokeball].image}
              alt={POKEBALL_DATA[currentSlot.pokeball].name}
              className="w-8 h-8"
            />
          </div>
        </div>
      )}
    </Card>
  );
};

export default PublicSlotEditor;
