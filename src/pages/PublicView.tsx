import { useState, useEffect } from "react";
import { TeamPokemon, Pokemon } from "@/types/pokemon";
import { fetchPokemonData, getPokemonSpriteUrl, POKEBALL_DATA } from "@/utils/pokemonData";
import { useToast } from "@/hooks/use-toast";
import PublicHeader from "@/components/PublicHeader";
import PublicBoxPanel from "@/components/PublicBoxPanel";
import PublicSlotEditor from "@/components/PublicSlotEditor";
import PlacesPanel from "@/components/PlacesPanel";
import PanelConfigPanel from "@/components/PanelConfigPanel";
import { Label } from "@/components/ui/label";
import TeamSlot from "@/components/TeamSlot";
import React from "react";
import abilitiesData from "@/data/abilities_es.json";
import placesData from "@/data/places_es.json";
import { pokemonFixtures } from "@/data/fixtures";

interface PanelConfig {
  boxPanel: number;
  slotEditor: number;
  placesPanel: number;
  configPanel: number;
}

const PublicView = () => {
  // Column span class mapping to ensure Tailwind includes all classes
  const getColSpanClass = (span: number): string => {
    const spanClasses: Record<number, string> = {
      1: 'lg:col-span-1',
      2: 'lg:col-span-2',
      3: 'lg:col-span-3',
      4: 'lg:col-span-4',
      5: 'lg:col-span-5',
      6: 'lg:col-span-6'
    };
    return spanClasses[span] || 'lg:col-span-1';
  };
  const [allSlots, setAllSlots] = useState<TeamPokemon[]>(() => 
    Array.from({ length: 6 }, (_, index) => ({
      id: `slot-${index}`,
      pokemon: null,
      nickname: '',
      level: 1,
      ability: '',
      pokeball: 'pokeball' as const,
      animated: false,
      zoom: 1.5, // Default 1.5x zoom for better visibility
      place: '',
      box: 'team',
    }))
  );
  const [allPokemon, setAllPokemon] = useState<Pokemon[]>([]);
  const [selectedSlot, setSelectedSlot] = useState<number>(0);
  const [selectedBox, setSelectedBox] = useState<'team' | 'other' | 'graveyard'>('team');
  const [isLoading, setIsLoading] = useState(true);
  const [panelConfig, setPanelConfig] = useState<PanelConfig>({
    boxPanel: 2,
    slotEditor: 2,
    placesPanel: 2,
    configPanel: 2
  });
  const { toast } = useToast();

  // Filter slots by box type, defaulting to 'other' if no box is set
  const team = allSlots.filter(slot => (slot.box || 'other') === 'team');
  const otherBox = allSlots.filter(slot => (slot.box || 'other') === 'other');
  const graveyardBox = allSlots.filter(slot => (slot.box || 'other') === 'graveyard');

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

  function normalizeBox(box: any): 'team' | 'other' | 'graveyard' {
    return box === 'team' || box === 'other' || box === 'graveyard' ? box : 'other';
  }

  const updateSlot = (slotIndex: number, updates: Partial<TeamPokemon>) => {
    if (slotIndex < 0 || slotIndex >= allSlots.length) {
      console.error('Invalid slot index:', slotIndex, 'allSlots length:', allSlots.length);
      return;
    }
    
    const newAllSlots = [...allSlots];
    const oldSlot = newAllSlots[slotIndex];
    newAllSlots[slotIndex] = { ...oldSlot, ...updates };
    
    setAllSlots(newAllSlots);
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
      box: 'team',
    });
    toast({
      title: "Slot Cleared",
      description: `Slot ${slotIndex + 1} has been cleared`
    });
  };

  const addFixtures = () => {
    console.log('Loading fixtures...');
    const fixtures = pokemonFixtures;
    
    if (allPokemon.length === 0) {
      console.error('allPokemon is empty! Cannot load fixtures.');
      return;
    }

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
          ability: (fixture as any).ability || '',
          pokeball: (fixture as any).pokeball || 'pokeball',
          animated: false,
          zoom: 1.5,
          place: fixture.place || '',
          box: fixture.box || 'team',
        };
      }
      
      return {
        id: `slot-${index}`,
        pokemon: null,
        nickname: '',
        level: 1,
        ability: '',
        pokeball: 'pokeball' as const,
        animated: false,
        zoom: 1.5,
        place: '',
        box: 'team',
      };
    });

    const finalSlots = newTeam.map(slot => ({ ...slot, box: (slot.box === 'team' || slot.box === 'other' || slot.box === 'graveyard') ? slot.box : 'other' } as TeamPokemon));
    setAllSlots(finalSlots);
    console.log('Fixtures loaded successfully!');
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
      {/* Team Box Header */}
      <div className="fixed top-0 left-0 right-0 z-50 bg-gradient-to-br from-purple-900 via-slate-900 to-red-900 p-4 border-b border-purple-500/30">
        <div className="w-[800px] h-[130px] bg-gradient-to-r from-slate-900 via-purple-900/20 to-slate-900 border-2 border-purple-500/30 rounded-lg overflow-hidden mx-auto">
          <div className="h-full p-3">
            <div className="grid grid-cols-6 gap-2 h-full">
              {Array.from({ length: 6 }, (_, index) => {
                const teamPokemon = allSlots.filter(slot => (slot.box || 'other') === 'team');
                const slot = teamPokemon[index] || {
                  id: `team-header-${index}`,
                  pokemon: null,
                  nickname: '',
                  level: 1,
                  ability: '',
                  pokeball: 'pokeball' as const,
                  animated: false,
                  zoom: 1.5,
                  place: '',
                  box: 'team' as const,
                };
                
                // Find the correct index in allSlots for this team slot
                const actualSlotIndex = teamPokemon[index] ? allSlots.findIndex(s => s.id === teamPokemon[index].id) : -1;
                
                return (
                  <TeamSlot
                    key={slot.id}
                    slot={slot}
                    index={actualSlotIndex}
                    updateSlot={updateSlot}
                    getPokemonSpriteUrl={getPokemonSpriteUrl}
                    pokeballData={POKEBALL_DATA}
                    abilitiesData={abilitiesData}
                    placesData={placesData}
                  />
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Main Content with Top Padding */}
      <div className="pt-[170px] p-4">
        <div className="max-w-6xl mx-auto space-y-4">
          {/* Admin Panel */}
          <div className="grid grid-cols-1 lg:grid-cols-6 gap-6">
            <div className={getColSpanClass(panelConfig.boxPanel)}>
              <PublicBoxPanel
              team={team}
              otherBox={otherBox}
              graveyardBox={graveyardBox}
              selectedSlot={selectedSlot}
              selectedBox={selectedBox}
              onSlotClick={(box, idx) => { 
                console.log('Slot clicked:', box, idx);
                setSelectedBox(box); 
                setSelectedSlot(idx); 
              }}
              onAddFixtures={addFixtures}
              setTeam={setAllSlots}
              />
            </div>
            <div className={getColSpanClass(panelConfig.slotEditor)}>
              <PublicSlotEditor
              currentSlot={
                (() => {
                  const targetSlots = selectedBox === 'team' ? team : selectedBox === 'other' ? otherBox : graveyardBox;
                  let targetSlot = targetSlots[selectedSlot];
                  
                  console.log('Current slot selection:', {
                    selectedBox,
                    selectedSlot,
                    targetSlotsLength: targetSlots.length,
                    targetSlot: targetSlot ? 'exists' : 'null',
                    targetSlotId: targetSlot?.id
                  });
                  
                  // If slot doesn't exist, return a default empty slot
                  if (!targetSlot) {
                    const newSlotId = `${selectedBox}-${selectedSlot}`;
                    targetSlot = {
                      id: newSlotId,
                      pokemon: null,
                      nickname: '',
                      level: 1,
                      ability: '',
                      pokeball: 'pokeball' as const,
                      animated: false,
                      zoom: 1.5,
                      place: '',
                      box: selectedBox,
                    };
                    console.log('Created placeholder slot:', targetSlot);
                  }
                  
                  return targetSlot;
                })()
              }
              allPokemon={allPokemon}
              selectedSlot={selectedSlot}
              onUpdate={(updates) => {
                const targetSlots = selectedBox === 'team' ? team : selectedBox === 'other' ? otherBox : graveyardBox;
                let targetSlot = targetSlots[selectedSlot];
                
                if (targetSlot) {
                  // Find the actual index in allSlots and update
                  const actualIndex = allSlots.findIndex(slot => slot.id === targetSlot.id);
                  if (actualIndex !== -1) {
                    updateSlot(actualIndex, updates);
                  } else {
                    console.error('Could not find slot in allSlots:', targetSlot.id);
                  }
                } else {
                  // Create a new slot and add it to allSlots
                  const newSlotId = `${selectedBox}-${Date.now()}-${selectedSlot}`;
                  const newSlot = {
                    id: newSlotId,
                    pokemon: null,
                    nickname: '',
                    level: 1,
                    ability: '',
                    pokeball: 'pokeball' as const,
                    animated: false,
                    zoom: 1.5,
                    place: '',
                    box: selectedBox,
                    ...updates
                  };
                  setAllSlots(prev => [...prev, newSlot]);
                  console.log('Created new slot:', newSlot);
                }
              }}
              onClear={() => {
                const targetSlots = selectedBox === 'team' ? team : selectedBox === 'other' ? otherBox : graveyardBox;
                const targetSlot = targetSlots[selectedSlot];
                if (targetSlot) {
                  const actualIndex = allSlots.findIndex(slot => slot.id === targetSlot.id);
                  if (actualIndex !== -1) {
                    clearSlot(actualIndex);
                  }
                }
                // If slot doesn't exist, there's nothing to clear
              }}
              />
            </div>
            <div className={getColSpanClass(panelConfig.placesPanel)}>
              <PlacesPanel
                allSlots={allSlots}
                placesData={placesData}
              />
            </div>
            <div className={getColSpanClass(panelConfig.configPanel)}>
              <PanelConfigPanel
                config={panelConfig}
                onConfigChange={setPanelConfig}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PublicView;