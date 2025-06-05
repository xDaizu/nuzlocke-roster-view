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
import SlotEditor from "@/components/SlotEditor";
import abilitiesData from "@/data/abilities.json";
import TeamSlot from "@/components/TeamSlot";

const PublicView = () => {
  const [team, setTeam] = useState<TeamPokemon[]>(() => 
    Array.from({ length: 6 }, (_, index) => ({
      id: `slot-${index}`,
      pokemon: null,
      nickname: '',
      level: 1,
      ability: 'No Skill',
      pokeball: 'pokeball' as const,
      animated: false,
      zoom: 1.5 // Default 1.5x zoom for better visibility
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
      animated: false,
      zoom: 1.5
    });
    toast({
      title: "Slot Cleared",
      description: `Slot ${slotIndex + 1} has been cleared`
    });
  };

  const addFixtures = () => {
    const fixtures = [
      { name: 'Mareep', nickname: 'RazorMorel', ability: 'Arena Trap', level: 10 },
      { name: 'Lotad', nickname: 'Calos', level: 8 },
      { name: 'Turtwig', nickname: 'Pablo', level: 7 },
      { name: 'Jigglypuff', nickname: 'Vancleemp', ability: 'Compound Eyes', level: 10 }
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
          level: fixture.level || 1,
          ability: fixture.ability,
          pokeball: 'pokeball' as const,
          animated: false,
          zoom: 1.5
        };
      }
      
      return {
        id: `slot-${index}`,
        pokemon: null,
        nickname: '',
        level: 1,
        ability: 'No Skill',
        pokeball: 'pokeball' as const,
        animated: false,
        zoom: 1.5
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
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-slate-900 to-red-900">
      {/* Fixed Top Bar with Pokemon Slots */}
      <div className="fixed top-0 left-0 right-0 z-50 bg-gradient-to-br from-purple-900 via-slate-900 to-red-900 p-4 border-b border-purple-500/30">
        <div className="w-[800px] h-[130px] bg-gradient-to-r from-slate-900 via-purple-900/20 to-slate-900 border-2 border-purple-500/30 rounded-lg overflow-hidden mx-auto">
          <div className="h-full p-3">
            <div className="grid grid-cols-6 gap-2 h-full">
              {team.map((slot, index) => (
                <TeamSlot
                  key={slot.id}
                  slot={slot}
                  index={index}
                  updateSlot={updateSlot}
                  getPokemonSpriteUrl={getPokemonSpriteUrl}
                  pokeballData={POKEBALL_DATA}
                  abilitiesData={abilitiesData}
                />
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Main Content with Top Padding */}
      <div className="pt-[170px] p-4">
        <div className="max-w-6xl mx-auto space-y-4">
          {/* Admin Panel */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Team Overview */}
            <Card className="bg-slate-800/90 border-purple-500/30 col-span-1">
              <CardHeader>
                <CardTitle className="text-purple-300 flex justify-between items-center">
                  Admin Panel
                  <Button
                    onClick={addFixtures}
                    className="bg-purple-600 hover:bg-purple-700"
                  >
                    Cargar de Stream
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
            <Card className="bg-slate-800/90 border-purple-500/30 col-span-1 lg:col-span-2">
              <SlotEditor
                slot={currentSlot}
                allPokemon={allPokemon}
                pokeballData={POKEBALL_DATA}
                onUpdate={(updates) => updateSlot(selectedSlot, updates)}
                onClear={() => clearSlot(selectedSlot)}
                slotIndex={selectedSlot}
                showHeader={true}
              />
              {/* Preview */}
              {currentSlot.pokemon && (
                <div className="mt-4 p-4 bg-slate-700/50 rounded-lg">
                  <Label className="text-slate-300 mb-2 block">Preview</Label>
                  <div className="flex items-center gap-4">
                    <img
                      src={getPokemonSpriteUrl(currentSlot.pokemon, currentSlot.animated)}
                      alt={currentSlot.pokemon.name.english}
                      className="w-16 h-16"
                      style={{
                        transform: currentSlot.animated ? 'none' : `scale(${currentSlot.zoom})`,
                        objectPosition: 'center'
                      }}
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
          </div>
        </div>
      </div>
    </div>
  );
};

export default PublicView;
