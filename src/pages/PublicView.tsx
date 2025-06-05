import { useState, useEffect } from "react";
import { TeamPokemon, Pokemon } from "@/types/pokemon";
import { fetchPokemonData, getPokemonSpriteUrl, POKEBALL_DATA } from "@/utils/pokemonData";
import { useToast } from "@/hooks/use-toast";
import PublicHeader from "@/components/PublicHeader";
import PublicAdminPanel from "@/components/PublicAdminPanel";
import PublicSlotEditor from "@/components/PublicSlotEditor";
import { Label } from "@/components/ui/label";
import TeamSlot from "@/components/TeamSlot";
import React from "react";
import abilitiesData from "@/data/abilities_es.json";
import placesData from "@/data/places_es.json";

const PublicView = () => {
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
    const newAllSlots = [...allSlots];
    newAllSlots[slotIndex] = { ...newAllSlots[slotIndex], ...updates };
    setAllSlots(newAllSlots);
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
      box: 'team',
    });
    toast({
      title: "Slot Cleared",
      description: `Slot ${slotIndex + 1} has been cleared`
    });
  };

  const addFixtures = () => {
    const fixtures = [
      { name: 'Mareep', nickname: 'RazorMorel', ability: 'arena-trap', level: 10, place: '', box: 'team' },
      { name: 'Lotad', nickname: 'Calos', level: 8, place: '', box: 'team' },
      { name: 'Turtwig', nickname: 'Pablo', level: 7, place: '', box: 'team' },
      { name: 'Jigglypuff', nickname: 'Vancleemp', ability: 'compound-eyes', level: 10, place: '', box: 'team' }
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

    setAllSlots(newTeam.map(slot => ({ ...slot, box: (slot.box === 'team' || slot.box === 'other' || slot.box === 'graveyard') ? slot.box : 'other' } as TeamPokemon)));
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
                
                return (
                  <TeamSlot
                    key={slot.id}
                    slot={slot}
                    index={teamPokemon[index] ? allSlots.indexOf(teamPokemon[index]) : -1}
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
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <PublicAdminPanel
              team={team}
              otherBox={otherBox}
              graveyardBox={graveyardBox}
              selectedSlot={selectedSlot}
              selectedBox={selectedBox}
              onSlotClick={(box, idx) => { setSelectedBox(box); setSelectedSlot(idx); }}
              onAddFixtures={addFixtures}
              setTeam={setAllSlots}
            />
            <PublicSlotEditor
              currentSlot={
                (() => {
                  const targetSlots = selectedBox === 'team' ? team : selectedBox === 'other' ? otherBox : graveyardBox;
                  let targetSlot = targetSlots[selectedSlot];
                  
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
                  const actualIndex = allSlots.findIndex(slot => slot.id === targetSlot.id);
                  if (actualIndex !== -1) {
                    updateSlot(actualIndex, updates);
                  }
                } else {
                  // Create a new slot and add it to allSlots
                  const newSlotId = `${selectedBox}-${selectedSlot}`;
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
        </div>
      </div>
    </div>
  );
};

export default PublicView;