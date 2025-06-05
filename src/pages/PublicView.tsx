import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { TeamPokemon, Pokemon, PokeballType } from "@/types/pokemon";
import { fetchPokemonData, getPokemonSpriteUrl, POKEBALL_DATA } from "@/utils/pokemonData";
import { useToast } from "@/hooks/use-toast";
import SlotEditor from "@/components/SlotEditor";
import abilitiesData from "@/data/abilities_es.json";
import placesData from "@/data/places_es.json";
import TeamSlot from "@/components/TeamSlot";
import PokemonBox from "@/components/PokemonBox";
import { storageService } from "@/services/storageService";
import { Save, Download, Upload, ArchiveRestore } from "lucide-react";
import { Tooltip, TooltipTrigger, TooltipContent } from "@/components/ui/tooltip";

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
      zoom: 1.5, // Default 1.5x zoom for better visibility
      place: '',
    }))
  );
  const [otherBox, setOtherBox] = useState<TeamPokemon[]>([]);
  const [graveyardBox, setGraveyardBox] = useState<TeamPokemon[]>([]);
  const [allPokemon, setAllPokemon] = useState<Pokemon[]>([]);
  const [selectedSlot, setSelectedSlot] = useState<number>(0);
  const [selectedBox, setSelectedBox] = useState<'team' | 'other' | 'graveyard'>('team');
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
      ability: '',
      pokeball: 'pokeball',
      animated: false,
      zoom: 1.5,
      place: '',
    });
    toast({
      title: "Slot Cleared",
      description: `Slot ${slotIndex + 1} has been cleared`
    });
  };

  const addFixtures = () => {
    const fixtures = [
      { name: 'Mareep', nickname: 'RazorMorel', ability: 'arena-trap', level: 10, place: '' },
      { name: 'Lotad', nickname: 'Calos', level: 8, place: '' },
      { name: 'Turtwig', nickname: 'Pablo', level: 7, place: '' },
      { name: 'Jigglypuff', nickname: 'Vancleemp', ability: 'compound-eyes', level: 10, place: '' }
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
          ability: fixture.ability || '',
          pokeball: 'pokeball' as const,
          animated: false,
          zoom: 1.5,
          place: fixture.place || '',
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
        zoom: 1.5,
        place: '',
      };
    });

    setTeam(newTeam);
    toast({
      title: "Fixtures Added",
      description: "Added test Pokemon to the roster"
    });
  };

  const getCurrentSlot = () => {
    switch (selectedBox) {
      case 'team':
        return team[selectedSlot];
      case 'other':
        return otherBox[selectedSlot] || {
          id: `other-${selectedSlot}`,
          pokemon: null,
          nickname: '',
          level: 1,
          ability: '',
          pokeball: 'pokeball' as const,
          animated: false,
          zoom: 1.5,
          place: '',
        };
      case 'graveyard':
        return graveyardBox[selectedSlot] || {
          id: `graveyard-${selectedSlot}`,
          pokemon: null,
          nickname: '',
          level: 1,
          ability: '',
          pokeball: 'pokeball' as const,
          animated: false,
          zoom: 1.5,
          place: '',
        };
    }
  };

  const currentSlot = getCurrentSlot();

  // Add save/load handlers
  const handleSaveTeam = () => {
    try {
      storageService.saveTeam(team);
      toast({
        title: "Team Saved",
        description: "Your team has been saved to localStorage.",
        variant: "default"
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to save team.",
        variant: "destructive"
      });
    }
  };

  const handleLoadTeam = () => {
    try {
      const loadedTeam = storageService.loadTeam();
      if (loadedTeam && loadedTeam.length === 6) {
        setTeam(loadedTeam);
        toast({
          title: "Team Loaded",
          description: "Your team has been loaded from localStorage.",
          variant: "default"
        });
      } else {
        toast({
          title: "No Saved Team",
          description: "No valid team found in localStorage.",
          variant: "destructive"
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to load team.",
        variant: "destructive"
      });
    }
  };

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
                  placesData={placesData}
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
            {/* Pokemon Boxes */}
            <Card className="bg-slate-800/90 border-purple-500/30 col-span-1">
              <CardHeader>
                <CardTitle className="text-purple-300 flex justify-between items-center">
                  Admin Panel
                  <div className="flex gap-2">
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button
                          onClick={handleSaveTeam}
                          className="bg-green-600 hover:bg-green-700 p-2"
                          size="icon"
                          aria-label="Save Team"
                        >
                          <Save className="w-5 h-5" />
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>Guardar Backup</TooltipContent>
                    </Tooltip>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button
                          onClick={handleLoadTeam}
                          className="bg-blue-600 hover:bg-blue-700 p-2"
                          size="icon"
                          aria-label="Load Team"
                        >
                          <ArchiveRestore className="w-5 h-5" />
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>Restaurar Backup</TooltipContent>
                    </Tooltip>
                  </div>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <PokemonBox
                  title="Team Box"
                  slots={team}
                  maxSlots={6}
                  onSlotClick={(index) => {
                    setSelectedSlot(index);
                    setSelectedBox('team');
                  }}
                  selectedSlot={selectedBox === 'team' ? selectedSlot : undefined}
                  boxType="team"
                />
                
                <PokemonBox
                  title="Other Box"
                  slots={otherBox}
                  maxSlots={12}
                  onSlotClick={(index) => {
                    setSelectedSlot(index);
                    setSelectedBox('other');
                  }}
                  selectedSlot={selectedBox === 'other' ? selectedSlot : undefined}
                  boxType="other"
                />
                
                <PokemonBox
                  title="Graveyard Box"
                  slots={graveyardBox}
                  maxSlots={12}
                  onSlotClick={(index) => {
                    setSelectedSlot(index);
                    setSelectedBox('graveyard');
                  }}
                  selectedSlot={selectedBox === 'graveyard' ? selectedSlot : undefined}
                  boxType="graveyard"
                />
              </CardContent>
              <CardFooter>
                <Button
                  onClick={addFixtures}
                  className="bg-purple-600 hover:bg-purple-700"
                >
                  Default
                </Button>
              </CardFooter>
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
                placesData={placesData}
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
