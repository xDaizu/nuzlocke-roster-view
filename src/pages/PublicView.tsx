import { useState, useEffect } from "react";
import { TeamPokemon, Pokemon, BoxType } from "@/types/pokemon";
import { fetchPokemonData, getPokemonSpriteUrl, POKEBALL_DATA } from "@/utils/pokemonData";
import { useToast } from "@/hooks/use-toast";
import PublicBoxPanel from "@/components/PublicBoxPanel";
import PublicSlotEditor from "@/components/PublicSlotEditor";
import PlacesPanel from "@/components/PlacesPanel";
import PanelConfigPanel from "@/components/PanelConfigPanel";
import WeaknessPanel from "@/components/WeaknessPanel";
import { Label } from "@/components/ui/label";
import TeamSlot from "@/components/TeamSlot";
import React from "react";
import abilitiesData from "@/data/abilities_es.json";
import placesData from "@/data/places_es.json";
import { pokemonFixtures } from "@/data/fixtures";
import { translations } from "@/data/translations";
import { storageService } from "@/services/storageService";
import { createEmptySlot, normalizeBox } from "@/utils/slots";
import { exportTeamToClipboard } from "@/utils/clipboard";

interface PanelConfig {
  boxPanel: { columns: number; order: number };
  slotEditor: { columns: number; order: number };
  placesPanel: { columns: number; order: number };
  weaknessPanel: { columns: number; order: number };
  configPanel: { columns: number; order: number };
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
    Array.from({ length: 6 }, (_, index) => createEmptySlot(`slot-${index}`, 'team'))
  );
  const [allPokemon, setAllPokemon] = useState<Pokemon[]>([]);
  const [selectedSlot, setSelectedSlot] = useState<number>(0);
  const [selectedBox, setSelectedBox] = useState<BoxType>('team');
  const [isLoading, setIsLoading] = useState(true);
  const [panelConfig, setPanelConfig] = useState<PanelConfig>({
    boxPanel: { columns: 2, order: 1 },
    slotEditor: { columns: 2, order: 2 },
    placesPanel: { columns: 2, order: 3 },
    weaknessPanel: { columns: 2, order: 4 },
    configPanel: { columns: 2, order: 5 }
  });
  const { toast } = useToast();

  // Filter slots by box type, defaulting to 'other' if no box is set
  const team = allSlots.filter(slot => normalizeBox(slot.box) === 'team');
  const otherBox = allSlots.filter(slot => normalizeBox(slot.box) === 'other');
  const graveyardBox = allSlots.filter(slot => normalizeBox(slot.box) === 'graveyard');

  useEffect(() => {
    const initializeData = async () => {
      setIsLoading(true);
      try {
        const pokemonData = await fetchPokemonData();
        setAllPokemon(pokemonData);

        // Check for saved data and load it automatically
        try {
          const savedSlots = storageService.loadTeam();
          if (savedSlots && savedSlots.length > 0) {
            setAllSlots(savedSlots);
            toast({
              title: translations.messages.teamLoaded,
              description: translations.messages.autoLoaded,
              variant: "default"
            });
          }
        } catch (loadError) {
          // Don't show error toast for failed auto-load, just continue with empty slots
        }
      } catch (error) {
        toast({
          title: translations.messages.error,
          description: translations.messages.pokemonDataError,
          variant: "destructive"
        });
      } finally {
        setIsLoading(false);
      }
    };

    initializeData();
  }, [toast]);

  const updateSlot = (slotIndex: number, updates: Partial<TeamPokemon>) => {
    if (slotIndex < 0 || slotIndex >= allSlots.length) {
      return;
    }
    
    const newAllSlots = [...allSlots];
    const oldSlot = newAllSlots[slotIndex];
    newAllSlots[slotIndex] = { ...oldSlot, ...updates };
    
    setAllSlots(newAllSlots);
  };

  const clearSlot = (slotIndex: number) => {
    const { id, ...defaults } = createEmptySlot('', 'team');
    updateSlot(slotIndex, defaults);
    toast({
      title: translations.messages.slotCleared,
      description: `Slot ${slotIndex + 1} ${translations.messages.slotClearedDesc}`
    });
  };

  const addFixtures = () => {
    const fixtures = pokemonFixtures;

    if (allPokemon.length === 0) {
      return;
    }

    // Process all fixtures, not just the first 6
    const newSlots: TeamPokemon[] = fixtures.map((fixture, index) => ({
      ...createEmptySlot(`fixture-slot-${index}`, normalizeBox(fixture.box || 'team')),
      pokemon: allPokemon.find(p =>
        p.name.english.toLowerCase() === fixture.name.toLowerCase()
      ) || null,
      nickname: fixture.nickname,
      level: fixture.level || 1,
      ability: fixture.ability || '',
      pokeball: fixture.pokeball || 'pokeball',
      place: fixture.place || '',
    }));

    setAllSlots(newSlots);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-900 via-slate-900 to-red-900 flex items-center justify-center">
        <div className="text-white text-xl">{translations.messages.loading}</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-slate-900 to-red-900">
      {/* Export Button */}
      <div className="flex justify-end p-4">
        <button
          onClick={exportTeamToClipboard}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded shadow"
        >
          {translations.buttons.exportClipboard}
        </button>
      </div>
      {/* Team Box Header */}
      <div className="fixed top-0 left-0 right-0 z-50 bg-gradient-to-br from-purple-900 via-slate-900 to-red-900 p-4 border-b border-purple-500/30">
        <div className="w-[800px] h-[130px] bg-gradient-to-r from-slate-900 via-purple-900/20 to-slate-900 border-2 border-purple-500/30 rounded-lg overflow-hidden mx-auto">
          <div className="h-full p-3">
            <div className="grid grid-cols-6 gap-2 h-full">
              {Array.from({ length: 6 }, (_, index) => {
                const slot = team[index] || createEmptySlot(`team-header-${index}`, 'team');
                
                // Find the correct index in allSlots for this team slot
                const actualSlotIndex = team[index] ? allSlots.findIndex(s => s.id === team[index].id) : -1;
                
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
            {/* Render panels in configured order */}
            {Object.entries(panelConfig)
              .sort(([, a], [, b]) => a.order - b.order)
              .map(([panelKey, panelData]) => {
                const colSpanClass = getColSpanClass(panelData.columns);
                
                switch (panelKey) {
                  case 'boxPanel':
                    return (
                      <div key={panelKey} className={colSpanClass}>
                        <PublicBoxPanel
                          team={team}
                          otherBox={otherBox}
                          graveyardBox={graveyardBox}
                          selectedSlot={selectedSlot}
                          selectedBox={selectedBox}
                          onSlotClick={(box, idx) => {
                            setSelectedBox(box);
                            setSelectedSlot(idx);
                          }}
                          onAddFixtures={addFixtures}
                          setTeam={setAllSlots}
                          allSlots={allSlots}
                        />
                      </div>
                    );
                  case 'slotEditor':
                    return (
                      <div key={panelKey} className={colSpanClass}>
                        <PublicSlotEditor
                          currentSlot={
                            (() => {
                              const targetSlots = selectedBox === 'team' ? team : selectedBox === 'other' ? otherBox : graveyardBox;
                              let targetSlot = targetSlots[selectedSlot];

                              // If slot doesn't exist, return a default empty slot
                              if (!targetSlot) {
                                targetSlot = createEmptySlot(`${selectedBox}-${selectedSlot}`, selectedBox);
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
                              }
                            } else {
                              // Create a new slot and add it to allSlots
                              const newSlot: TeamPokemon = {
                                ...createEmptySlot(`${selectedBox}-${Date.now()}-${selectedSlot}`, selectedBox),
                                ...updates,
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
                    );
                  case 'placesPanel':
                    return (
                      <div key={panelKey} className={colSpanClass}>
                        <PlacesPanel
                          allSlots={allSlots}
                          placesData={placesData}
                        />
                      </div>
                    );
                  case 'weaknessPanel':
                    return (
                      <div key={panelKey} className={colSpanClass}>
                        <WeaknessPanel
                          allPokemon={allPokemon}
                          translations={translations}
                        />
                      </div>
                    );
                  case 'configPanel':
                    return (
                      <div key={panelKey} className={colSpanClass}>
                        <PanelConfigPanel
                          config={panelConfig}
                          onConfigChange={setPanelConfig}
                        />
                      </div>
                    );
                  default:
                    return null;
                }
              })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PublicView;