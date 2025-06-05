
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { TeamPokemon, Pokemon, PokeballType } from "@/types/pokemon";
import { saveTeam, loadTeam } from "@/utils/teamStorage";
import { fetchPokemonData, getPokemonSpriteUrl, POKEBALL_DATA } from "@/utils/pokemonData";
import { useToast } from "@/hooks/use-toast";
import { Link } from "react-router-dom";
import SlotEditor from "@/components/SlotEditor";
import PokemonBox from "@/components/PokemonBox";
import placesData from "@/data/places_es.json";

const AdminView = () => {
  const [team, setTeam] = useState<TeamPokemon[]>([]);
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
        const [pokemonData, savedTeam] = await Promise.all([
          fetchPokemonData(),
          Promise.resolve(loadTeam())
        ]);
        
        setAllPokemon(pokemonData);
        setTeam(savedTeam);
        
        // Initialize other boxes with empty slots
        setOtherBox(Array.from({ length: 12 }, (_, index) => ({
          id: `other-${index}`,
          pokemon: null,
          nickname: '',
          level: 1,
          ability: '',
          pokeball: 'pokeball',
          animated: false,
          zoom: 1.5,
          place: '',
        })));
        
        setGraveyardBox(Array.from({ length: 12 }, (_, index) => ({
          id: `graveyard-${index}`,
          pokemon: null,
          nickname: '',
          level: 1,
          ability: '',
          pokeball: 'pokeball',
          animated: false,
          zoom: 1.5,
          place: '',
        })));
        
        console.log('Loaded Pokemon data:', pokemonData.length, 'entries');
        console.log('Loaded team:', savedTeam);
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

  const getBox = (boxType: 'team' | 'other' | 'graveyard') => {
    switch (boxType) {
      case 'team': return team;
      case 'other': return otherBox;
      case 'graveyard': return graveyardBox;
    }
  };

  const setBox = (boxType: 'team' | 'other' | 'graveyard', newBox: TeamPokemon[]) => {
    switch (boxType) {
      case 'team': 
        setTeam(newBox);
        saveTeam(newBox);
        break;
      case 'other': 
        setOtherBox(newBox);
        break;
      case 'graveyard': 
        setGraveyardBox(newBox);
        break;
    }
  };

  const updateSlot = (slotIndex: number, updates: Partial<TeamPokemon>) => {
    const currentBox = getBox(selectedBox);
    const newBox = [...currentBox];
    newBox[slotIndex] = { ...newBox[slotIndex], ...updates };
    setBox(selectedBox, newBox);
    console.log('Updated slot', slotIndex, 'in', selectedBox, 'with:', updates);
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
      description: `Slot ${slotIndex + 1} in ${selectedBox} has been cleared`
    });
  };

  const handleDragDrop = (
    fromBox: 'team' | 'other' | 'graveyard',
    fromIndex: number,
    toBox: 'team' | 'other' | 'graveyard',
    toIndex: number
  ) => {
    const sourceBox = getBox(fromBox);
    const targetBox = getBox(toBox);
    
    const sourcePokemon = sourceBox[fromIndex];
    const targetPokemon = targetBox[toIndex];
    
    // Create new boxes with swapped Pokemon
    const newSourceBox = [...sourceBox];
    const newTargetBox = [...targetBox];
    
    if (fromBox === toBox) {
      // Same box - just swap
      newSourceBox[fromIndex] = targetPokemon;
      newSourceBox[toIndex] = sourcePokemon;
      setBox(fromBox, newSourceBox);
    } else {
      // Different boxes - swap between them
      newSourceBox[fromIndex] = targetPokemon;
      newTargetBox[toIndex] = sourcePokemon;
      setBox(fromBox, newSourceBox);
      setBox(toBox, newTargetBox);
    }
    
    toast({
      title: "Pokemon Moved",
      description: `Pokemon moved from ${fromBox} to ${toBox}`
    });
  };

  const handleSlotClick = (boxType: 'team' | 'other' | 'graveyard', index: number) => {
    setSelectedBox(boxType);
    setSelectedSlot(index);
  };

  const currentSlot = getBox(selectedBox)[selectedSlot];

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
        {/* Header */}
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-400 to-red-400 bg-clip-text text-transparent">
            Nuzlocke Team Admin
          </h1>
          <div className="space-x-2">
            <Link to="/public">
              <Button variant="outline" className="border-purple-500 text-purple-300 hover:bg-purple-500/20">
                View Public Overlay
              </Button>
            </Link>
            <Link to="/">
              <Button variant="outline" className="border-red-500 text-red-300 hover:bg-red-500/20">
                Home
              </Button>
            </Link>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Pokemon Boxes */}
          <Card className="bg-slate-800/90 border-purple-500/30 col-span-1">
            <CardHeader>
              <CardTitle className="text-purple-300">Pokemon Boxes</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <PokemonBox
                title="Team"
                slots={team}
                maxSlots={6}
                onSlotClick={(index) => handleSlotClick('team', index)}
                selectedSlot={selectedBox === 'team' ? selectedSlot : undefined}
                onDragDrop={(fromIndex, toIndex) => handleDragDrop('team', fromIndex, 'team', toIndex)}
                onDragDropExternal={(fromBox, fromIndex, toIndex) => handleDragDrop(fromBox, fromIndex, 'team', toIndex)}
                boxType="team"
              />
              <PokemonBox
                title="Other Box"
                slots={otherBox}
                maxSlots={12}
                onSlotClick={(index) => handleSlotClick('other', index)}
                selectedSlot={selectedBox === 'other' ? selectedSlot : undefined}
                onDragDrop={(fromIndex, toIndex) => handleDragDrop('other', fromIndex, 'other', toIndex)}
                onDragDropExternal={(fromBox, fromIndex, toIndex) => handleDragDrop(fromBox, fromIndex, 'other', toIndex)}
                boxType="other"
              />
              <PokemonBox
                title="Graveyard"
                slots={graveyardBox}
                maxSlots={12}
                onSlotClick={(index) => handleSlotClick('graveyard', index)}
                selectedSlot={selectedBox === 'graveyard' ? selectedSlot : undefined}
                onDragDrop={(fromIndex, toIndex) => handleDragDrop('graveyard', fromIndex, 'graveyard', toIndex)}
                onDragDropExternal={(fromBox, fromIndex, toIndex) => handleDragDrop(fromBox, fromIndex, 'graveyard', toIndex)}
                boxType="graveyard"
              />
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
                      transform: currentSlot.animated ? 'none' : `scale(${currentSlot.zoom || 1.5})`,
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
          </Card>
        </div>
      </div>
    </div>
  );
};

export default AdminView;
