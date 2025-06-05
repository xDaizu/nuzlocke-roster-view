import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { TeamPokemon, Pokemon, PokeballType } from "@/types/pokemon";
import React, { useState } from "react";
import abilitiesData from "@/data/abilities_es.json";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { translations } from "@/data/translations";

interface SlotEditorProps {
  slot: TeamPokemon;
  allPokemon: Pokemon[];
  pokeballData: Record<string, { image: string; name: string }>;
  onUpdate: (updates: Partial<TeamPokemon>) => void;
  onClear: () => void;
  slotIndex?: number;
  showHeader?: boolean;
  placesData: Array<{ id: string; nombre: string }>;
  showBoxSelect?: boolean;
}

const abilityNames = abilitiesData.map((a: any) => a.name);
const abilitySlugMap = Object.fromEntries(abilitiesData.map((a: any) => [a.slug, a]));
const abilityNameMap = Object.fromEntries(abilitiesData.map((a: any) => [a.name, a]));

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
  const [abilityFilter, setAbilityFilter] = useState("");
  const [placeFilter, setPlaceFilter] = useState("");
  const [pokemonFilter, setPokemonFilter] = useState("");
  
  // Filter by name
  const filteredAbilities = abilitiesData.filter((a: any) =>
    a.name.toLowerCase().includes(abilityFilter.toLowerCase())
  );
  const filteredPlaces = placesData.filter((p) =>
    p.nombre.toLowerCase().includes(placeFilter.toLowerCase())
  );
  const filteredPokemon = allPokemon.filter((p) =>
    p.name.english.toLowerCase().includes(pokemonFilter.toLowerCase()) ||
    p.id.toString().includes(pokemonFilter)
  );

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
            <Select
              value={slot.pokemon?.id.toString() || "none"}
              onValueChange={(value) => {
                if (value === "none") {
                  onUpdate({ pokemon: null });
                } else {
                  const pokemon = allPokemon.find(p => p.id.toString() === value);
                  if (pokemon) {
                    onUpdate({ pokemon });
                  }
                }
              }}
            >
              <SelectTrigger className="bg-slate-700 border-slate-600 h-8 text-xs">
                <SelectValue placeholder={translations.forms.selectPokemon} />
              </SelectTrigger>
              <SelectContent className="bg-slate-700 border-slate-600 max-h-60 text-xs">
                <div className="px-2 py-1">
                  <Input
                    value={pokemonFilter}
                    onChange={e => setPokemonFilter(e.target.value)}
                    placeholder={translations.forms.filterPokemon}
                    className="mb-1 bg-slate-800 border-slate-600 h-7 text-xs"
                  />
                </div>
                <SelectItem value="none">No Pokemon</SelectItem>
                {filteredPokemon.map((pokemon) => (
                  <SelectItem key={pokemon.id} value={pokemon.id.toString()} className="text-xs">
                    #{pokemon.id.toString().padStart(3, '0')} {pokemon.name.english}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
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
              <Select
                value={slot.ability || "none"}
                onValueChange={(value) => {
                  if (value === "none") {
                    onUpdate({ ability: "" });
                  } else {
                    onUpdate({ ability: value }); // value is the slug
                  }
                }}
              >
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <SelectTrigger className="bg-slate-700 border-slate-600 h-8 text-xs">
                        <SelectValue placeholder={translations.forms.selectAbility} />
                      </SelectTrigger>
                    </TooltipTrigger>
                    {selectedAbilityDescription && (
                      <TooltipContent className="text-sm max-w-xs">
                        {selectedAbilityDescription}
                      </TooltipContent>
                    )}
                  </Tooltip>
                </TooltipProvider>
                <SelectContent className="bg-slate-700 border-slate-600 max-h-60 text-xs">
                  <div className="px-2 py-1">
                    <Input
                      value={abilityFilter}
                      onChange={e => setAbilityFilter(e.target.value)}
                      placeholder={translations.forms.filterAbility}
                      className="mb-1 bg-slate-800 border-slate-600 h-7 text-xs"
                    />
                  </div>
                  <SelectItem value="none">Sin habilidad</SelectItem>
                  {filteredAbilities.map((ability: any) => (
                    <TooltipProvider key={ability.slug}>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <SelectItem
                            value={ability.slug}
                            className="text-xs"
                          >
                            {ability.name}
                          </SelectItem>
                        </TooltipTrigger>
                        {ability.description && (
                          <TooltipContent className="text-sm max-w-xs">
                            {ability.description}
                          </TooltipContent>
                        )}
                      </Tooltip>
                    </TooltipProvider>
                  ))}
                </SelectContent>
              </Select>
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
            <Select
              value={slot.place ? slot.place : "none"}
              onValueChange={(value) => {
                onUpdate({ place: value === "none" ? "" : value });
              }}
            >
              <SelectTrigger className="bg-slate-700 border-slate-600 h-8 text-xs">
                <SelectValue placeholder={translations.forms.selectPlace} />
              </SelectTrigger>
              <SelectContent className="bg-slate-700 border-slate-600 max-h-60 text-xs">
                <div className="px-2 py-1">
                  <Input
                    value={placeFilter}
                    onChange={e => setPlaceFilter(e.target.value)}
                    placeholder="Filtrar lugares..."
                    className="mb-1 bg-slate-800 border-slate-600 h-7 text-xs"
                  />
                </div>
                <SelectItem value="none">Sin lugar</SelectItem>
                <SelectItem value="unknown">{translations.placeholders.unknown}</SelectItem>
                {filteredPlaces.map((place) => (
                  <SelectItem key={place.id} value={place.id} className="text-xs">
                    {place.nombre}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
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