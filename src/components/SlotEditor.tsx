import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { TeamPokemon, Pokemon, PokeballType } from "@/types/pokemon";
import React, { useState, useEffect } from "react";
import { AbilitiesRepository } from '@/repositories/AbilitiesRepository';
import type { Ability } from '@/types';
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { translations } from "@/data/translations";
import AutocompleteInput from "@/components/AutocompleteInput";
import type { Place } from '@/types';

interface SlotEditorProps {
  slot: TeamPokemon;
  allPokemon: Pokemon[];
  pokeballData: Record<string, { image: string; name: string }>;
  onUpdate: (updates: Partial<TeamPokemon>) => void;
  onClear: () => void;
  slotIndex?: number;
  showHeader?: boolean;
  placesData: Place[];
  showBoxSelect?: boolean;
}

const abilitiesRepo = new AbilitiesRepository();

const [abilitiesData, setAbilitiesData] = useState<Ability[]>([]);

useEffect(() => {
  abilitiesRepo.getAll().then(setAbilitiesData);
}, []);

const abilityNames = abilitiesData.map((a: Ability) => a.name);
const abilitySlugMap = Object.fromEntries(abilitiesData.map((a: Ability) => [a.slug, a]));
const abilityNameMap = Object.fromEntries(abilitiesData.map((a: Ability) => [a.name, a]));

// Helper to get ability description
const getAbilityDescription = (slugOrName: string) => {
  // Try slug first, then name
  const found = abilitySlugMap[slugOrName] || abilityNameMap[slugOrName];
  return found ? found.description : "";
};

const SlotEditor: React.FC<SlotEditorProps> = ({
  slot,
  allPokemon,
  pokeballData,
  onUpdate,
  onClear,
  slotIndex,
  showHeader = true,
  placesData,
  showBoxSelect = true,
}) => {

  
  // Prepare autocomplete options
  const pokemonOptions = allPokemon.map(pokemon => ({
    value: pokemon.id.toString(),
    label: `#${pokemon.id.toString().padStart(3, '0')} ${pokemon.name.english}`,
    searchText: `${pokemon.id} ${pokemon.name.english}`
  }));

  const abilityOptions = [
    { value: "", label: "Sin habilidad" },
    ...abilitiesData.map((ability: Ability) => ({
      value: ability.slug,
      label: ability.name,
      searchText: `${ability.name} ${ability.description}`
    }))
  ];

  const placeOptions = [
    { value: "", label: "Sin lugar" },
    { value: "unknown", label: translations.placeholders.unknown },
    ...placesData.map((place) => ({
      value: place.id,
      label: place.name,
      searchText: place.name
    }))
  ];



  // Get description for currently selected ability (by slug)
  const selectedAbilityDescription = slot.ability ? getAbilityDescription(slot.ability) : "";

  return (
    <>
      {showHeader && (
        <CardHeader>
          <CardTitle className="text-purple-300 flex justify-between items-center">
            {translations.panels.slotEditor} {slotIndex !== undefined ? slotIndex + 1 : ""}
            <Button
              variant="destructive"
              size="sm"
              onClick={onClear}
              className="bg-red-600 hover:bg-red-700"
            >
              {translations.buttons.clear}
            </Button>
          </CardTitle>
        </CardHeader>
      )}
      <CardContent>
        <form className="grid grid-cols-2 gap-x-4 gap-y-2 items-end">
          {/* Pokemon Selection */}
          <div className="space-y-1">
            <Label className="text-slate-300 text-xs">{translations.forms.pokemon}</Label>
            <AutocompleteInput
              value={slot.pokemon?.id.toString() || ""}
              onChange={(value) => {
                if (value === "") {
                  onUpdate({ pokemon: null });
                } else {
                  const pokemon = allPokemon.find(p => p.id.toString() === value);
                  if (pokemon) {
                    onUpdate({ pokemon });
                  }
                }
              }}
              options={pokemonOptions}
              placeholder={translations.forms.selectPokemon}
              emptyMessage="No Pokemon found"
            />
          </div>

          {/* Nickname */}
          <div className="space-y-1">
            <Label className="text-slate-300 text-xs">{translations.forms.nickname}</Label>
            <Input
              value={slot.nickname}
              onChange={(e) => onUpdate({ nickname: e.target.value })}
              placeholder={slot.pokemon?.name.english || translations.forms.nickname}
              className="bg-slate-700 border-slate-600 h-8 text-xs"
            />
          </div>

          {/* Level and Ability Row */}
          <div className="grid grid-cols-2 gap-4">
            {/* Level */}
            <div className="space-y-1">
              <Label className="text-slate-300 text-xs">{translations.forms.level}</Label>
              <Input
                type="number"
                min="1"
                max="100"
                value={slot.level}
                onChange={(e) => onUpdate({ level: parseInt(e.target.value) || 1 })}
                className="bg-slate-700 border-slate-600 h-8 text-xs"
              />
            </div>

            {/* Ability (Select) */}
            <div className="space-y-1">
              <Label className="text-slate-300 text-xs">{translations.forms.ability}</Label>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <div>
                      <AutocompleteInput
                        value={slot.ability || ""}
                        onChange={(value) => onUpdate({ ability: value })}
                        options={abilityOptions}
                        placeholder={translations.forms.selectAbility}
                        emptyMessage="No abilities found"
                      />
                    </div>
                  </TooltipTrigger>
                  {selectedAbilityDescription && (
                    <TooltipContent className="text-sm max-w-xs">
                      {selectedAbilityDescription}
                    </TooltipContent>
                  )}
                </Tooltip>
              </TooltipProvider>
            </div>
          </div>

          {/* Pokeball and Box (Select) in a row */}
          <div className="flex flex-col sm:flex-row gap-2">
            <div className="space-y-1 w-full sm:w-1/2">
              <Label className="text-slate-300 text-xs">{translations.forms.pokeball}</Label>
              <Select
                value={slot.pokeball}
                onValueChange={(value: PokeballType) => onUpdate({ pokeball: value })}
              >
                <SelectTrigger className="bg-slate-700 border-slate-600 h-8 text-xs">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-slate-700 border-slate-600 text-xs">
                  {Object.entries(pokeballData).map(([key, data]) => (
                    <SelectItem key={key} value={key} className="text-xs">
                      <div className="flex items-center gap-2">
                        <img src={data.image} alt={data.name} className="w-4 h-4" />
                        {data.name}
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            {showBoxSelect && (
              <div className="space-y-1 w-full sm:w-1/2">
                <Label className="text-slate-300 text-xs">{translations.forms.box}</Label>
                <Select
                  value={slot.box}
                  onValueChange={(value) => onUpdate({ box: value as 'team' | 'other' | 'graveyard' })}
                >
                  <SelectTrigger className="bg-slate-700 border-slate-600 h-8 text-xs">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-slate-700 border-slate-600 max-h-60 text-xs">
                    <SelectItem value="team">{translations.boxes.team}</SelectItem>
                    <SelectItem value="other">{translations.boxes.other}</SelectItem>
                    <SelectItem value="graveyard">{translations.boxes.graveyard}</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            )}
          </div>

          {/* Place (Select) */}
          <div className="space-y-1">
            <Label className="text-slate-300 text-xs">{translations.forms.place}</Label>
            <AutocompleteInput
              value={slot.place || ""}
              onChange={(value) => onUpdate({ place: value })}
              options={placeOptions}
              placeholder={translations.forms.selectPlace}
              emptyMessage="No places found"
            />
          </div>

          {/* Animated Toggle */}
          <div className="flex items-center space-x-2 mt-4">
            <Switch
              id="animated"
              checked={slot.animated}
              onCheckedChange={(checked) => onUpdate({ animated: checked })}
            />
            <Label htmlFor="animated" className="text-slate-300 text-xs">Usar GIF animado</Label>
          </div>

          {/* Zoom Controls */}
          <div className="mt-4">
            <div className="grid grid-cols-2 gap-4">
              {/* Static Sprite Zoom */}
              <div className="space-y-1">
                <Label className="text-slate-300 text-xs">Sprite Zoom (Estático)</Label>
                <div className="flex items-center space-x-2">
                  <Input
                    type="number"
                    min="0.5"
                    max="3"
                    step="0.1"
                    value={slot.staticZoom || 1.5}
                    onChange={(e) => onUpdate({ staticZoom: parseFloat(e.target.value) || 1.5 })}
                    className="bg-slate-700 border-slate-600 h-8 text-xs w-16"
                  />
                  <span className="text-slate-400 text-xs">
                    {slot.staticZoom || 1.5}x
                  </span>
                </div>
              </div>
              
              {/* Animated Sprite Zoom */}
              <div className="space-y-1">
                <Label className="text-slate-300 text-xs">Sprite Zoom (Animado)</Label>
                <div className="flex items-center space-x-2">
                  <Input
                    type="number"
                    min="0.5"
                    max="3"
                    step="0.1"
                    value={slot.animatedZoom || 1.0}
                    onChange={(e) => onUpdate({ animatedZoom: parseFloat(e.target.value) || 1.0 })}
                    className="bg-slate-700 border-slate-600 h-8 text-xs w-16"
                  />
                  <span className="text-slate-400 text-xs">
                    {slot.animatedZoom || 1.0}x
                  </span>
                </div>
              </div>
            </div>
          </div>
        </form>
      </CardContent>
    </>
  );
};

export default SlotEditor; 