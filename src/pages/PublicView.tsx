
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { TeamPokemon, Pokemon, PokeballType } from "@/types/pokemon";
import { fetchPokemonData, getPokemonSpriteUrl, POKEBALL_DATA } from "@/utils/pokemonData";
import { useToast } from "@/hooks/use-toast";

const PublicView = () => {
  const [team, setTeam] = useState<TeamPokemon[]>(() => 
    Array.from({ length: 6 }, (_, index) => ({
      id: `slot-${index}`,
      pokemon: null,
      nickname: '',
      level: 1,
      ability: 'No Skill',
      pokeball: 'pokeball' as const,
      animated: false
    }))
  );
  const [allPokemon, setAllPokemon] = useState<Pokemon[]>([]);
  const [selectedSlot, setSelectedSlot] = useState<number>(0);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    const initializeData = async () => {
      setIsLoading(true);
      try {
        const pokemonData = await fetchPokemonData();
        setAllPokemon(pokemonData);
        console.log('Loaded Pokemon data:', pokemonData.length, 'entries');
      } catch (error) {
        console.error('Error initializing data:', error);
        toast({
          title: "Error",
          description: "Failed to load Pokemon data",
          variant: "destructive"
        });
      } finally {
        setIsLoading(false);
      }
    };

    initializeData();
  }, [toast]);

  const updateSlot = (slotIndex: number, updates: Partial<TeamPokemon>) => {
    const newTeam = [...team];
    newTeam[slotIndex] = { ...newTeam[slotIndex], ...updates };
    setTeam(newTeam);
    console.log('Updated slot', slotIndex, 'with:', updates);
  };

  const clearSlot = (slotIndex: number) => {
    updateSlot(slotIndex, {
      pokemon: null,
      nickname: '',
      level: 1,
      ability: 'No Skill',
      pokeball: 'pokeball',
      animated: false
    });
    toast({
      title: "Slot Cleared",
      description: `Slot ${slotIndex + 1} has been cleared`
    });
  };

  const addFixtures = () => {
    const fixtures = [
      { name: 'Mareep', nickname: 'RazorMorel' },
      { name: 'Lotad', nickname: 'Calos' },
      { name: 'Turtwig', nickname: 'Pablo' },
      { name: 'Jigglypuff', nickname: 'Vancleemp' }
    ];

    const newTeam = Array.from({ length: 6 }, (_, index) => {
      if (index < fixtures.length) {
        const fixture = fixtures[index];
        const pokemon = allPokemon.find(p => 
          p.name.english.toLowerCase() === fixture.name.toLowerCase()
        );
        
        return {
          id: `slot-${index}`,
          pokemon: pokemon || null,
          nickname: fixture.nickname,
          level: 1,
          ability: 'No Skill',
          pokeball: 'pokeball' as const,
          animated: false
        };
      }
      
      return {
        id: `slot-${index}`,
        pokemon: null,
        nickname: '',
        level: 1,
        ability: 'No Skill',
        pokeball: 'pokeball' as const,
        animated: false
      };
    });

    setTeam(newTeam);
    toast({
      title: "Fixtures Added",
      description: "Added test Pokemon to the roster"
    });
  };

  const currentSlot = team[selectedSlot];

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-900 via-slate-900 to-red-900 flex items-center justify-center">
        <div className="text-white text-xl">Loading Pokemon data...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-slate-900 to-red-900 p-4">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Public Widget */}
        <div className="w-[1000px] h-[300px] bg-gradient-to-r from-slate-900 via-purple-900/20 to-slate-900 border-2 border-purple-500/30 rounded-lg overflow-hidden mx-auto">
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

        {/* Admin Panel */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Team Overview */}
          <Card className="bg-slate-800/90 border-purple-500/30">
            <CardHeader>
              <CardTitle className="text-purple-300 flex justify-between items-center">
                Admin Panel
                <Button
                  onClick={addFixtures}
                  className="bg-purple-600 hover:bg-purple-700"
                >
                  Add Fixtures
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-3 gap-3">
                {team.map((slot, index) => (
                  <button
                    key={slot.id}
                    onClick={() => setSelectedSlot(index)}
                    className={`p-3 rounded-lg border-2 transition-all ${
                      selectedSlot === index
                        ? 'border-purple-400 bg-purple-500/20'
                        : 'border-slate-600 bg-slate-700/50 hover:border-purple-500/50'
                    }`}
                  >
                    <div className="text-center">
                      <div className="text-xs text-slate-400 mb-1">Slot {index + 1}</div>
                      {slot.pokemon ? (
                        <>
                          <img
                            src={getPokemonSpriteUrl(slot.pokemon, false)}
                            alt={slot.pokemon.name.english}
                            className="w-12 h-12 mx-auto mb-1"
                            onError={(e) => {
                              const target = e.target as HTMLImageElement;
                              target.style.display = 'none';
                            }}
                          />
                          <div className="text-xs text-white font-medium truncate">
                            {slot.nickname || slot.pokemon.name.english}
                          </div>
                          <div className="text-xs text-purple-300">Lv. {slot.level}</div>
                        </>
                      ) : (
                        <div className="w-12 h-12 bg-slate-600 rounded mx-auto mb-1 flex items-center justify-center">
                          <span className="text-slate-400">?</span>
                        </div>
                      )}
                    </div>
                  </button>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Slot Editor */}
          <Card className="bg-slate-800/90 border-purple-500/30">
            <CardHeader>
              <CardTitle className="text-purple-300 flex justify-between items-center">
                Edit Slot {selectedSlot + 1}
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={() => clearSlot(selectedSlot)}
                  className="bg-red-600 hover:bg-red-700"
                >
                  Clear Slot
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Pokemon Selection */}
              <div className="space-y-2">
                <Label className="text-slate-300">Pokemon</Label>
                <Select
                  value={currentSlot.pokemon?.id.toString() || "none"}
                  onValueChange={(value) => {
                    if (value === "none") {
                      updateSlot(selectedSlot, { pokemon: null });
                    } else {
                      const pokemon = allPokemon.find(p => p.id.toString() === value);
                      if (pokemon) {
                        updateSlot(selectedSlot, { pokemon });
                      }
                    }
                  }}
                >
                  <SelectTrigger className="bg-slate-700 border-slate-600">
                    <SelectValue placeholder="Select a Pokemon" />
                  </SelectTrigger>
                  <SelectContent className="bg-slate-700 border-slate-600 max-h-60">
                    <SelectItem value="none">No Pokemon</SelectItem>
                    {allPokemon.map((pokemon) => (
                      <SelectItem key={pokemon.id} value={pokemon.id.toString()}>
                        #{pokemon.id.toString().padStart(3, '0')} {pokemon.name.english}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Nickname */}
              <div className="space-y-2">
                <Label className="text-slate-300">Nickname</Label>
                <Input
                  value={currentSlot.nickname}
                  onChange={(e) => updateSlot(selectedSlot, { nickname: e.target.value })}
                  placeholder={currentSlot.pokemon?.name.english || "Enter nickname"}
                  className="bg-slate-700 border-slate-600"
                />
              </div>

              {/* Level */}
              <div className="space-y-2">
                <Label className="text-slate-300">Level</Label>
                <Input
                  type="number"
                  min="1"
                  max="100"
                  value={currentSlot.level}
                  onChange={(e) => updateSlot(selectedSlot, { level: parseInt(e.target.value) || 1 })}
                  className="bg-slate-700 border-slate-600"
                />
              </div>

              {/* Ability */}
              <div className="space-y-2">
                <Label className="text-slate-300">Ability</Label>
                <Input
                  value={currentSlot.ability}
                  onChange={(e) => updateSlot(selectedSlot, { ability: e.target.value })}
                  placeholder="Enter ability name"
                  className="bg-slate-700 border-slate-600"
                />
              </div>

              {/* Pokeball */}
              <div className="space-y-2">
                <Label className="text-slate-300">Pokeball</Label>
                <Select
                  value={currentSlot.pokeball}
                  onValueChange={(value: PokeballType) => updateSlot(selectedSlot, { pokeball: value })}
                >
                  <SelectTrigger className="bg-slate-700 border-slate-600">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-slate-700 border-slate-600">
                    {Object.entries(POKEBALL_DATA).map(([key, data]) => (
                      <SelectItem key={key} value={key}>
                        <div className="flex items-center gap-2">
                          <img src={data.image} alt={data.name} className="w-5 h-5" />
                          {data.name}
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Animated Toggle */}
              <div className="flex items-center space-x-2">
                <Switch
                  id="animated"
                  checked={currentSlot.animated}
                  onCheckedChange={(checked) => updateSlot(selectedSlot, { animated: checked })}
                />
                <Label htmlFor="animated" className="text-slate-300">Use animated sprite</Label>
              </div>

              {/* Preview */}
              {currentSlot.pokemon && (
                <div className="mt-4 p-4 bg-slate-700/50 rounded-lg">
                  <Label className="text-slate-300 mb-2 block">Preview</Label>
                  <div className="flex items-center gap-4">
                    <img
                      src={getPokemonSpriteUrl(currentSlot.pokemon, currentSlot.animated)}
                      alt={currentSlot.pokemon.name.english}
                      className="w-16 h-16"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        if (currentSlot.animated) {
                          target.src = getPokemonSpriteUrl(currentSlot.pokemon!, false);
                        }
                      }}
                    />
                    <div>
                      <div className="text-white font-medium">
                        {currentSlot.nickname || currentSlot.pokemon.name.english}
                      </div>
                      <div className="text-purple-300 text-sm">Level {currentSlot.level}</div>
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
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default PublicView;
