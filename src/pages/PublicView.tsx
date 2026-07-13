import { useState, useEffect } from "react";
import { TeamPokemon, Pokemon } from "@/types/pokemon";
import { fetchPokemonData, getPokemonSpriteUrl, POKEBALL_DATA } from "@/utils/pokemonData";
import { useToast } from "@/hooks/use-toast";
import PublicHeader from "@/components/PublicHeader";
import PublicBoxPanel from "@/components/PublicBoxPanel";
import PublicSlotEditor from "@/components/PublicSlotEditor";
import PlacesPanel from "@/components/PlacesPanel";
import PanelConfigPanel from "@/components/PanelConfigPanel";
import AppConfigPanel from "@/components/AppConfigPanel";
import WeaknessPanel from "@/components/WeaknessPanel";
import { Label } from "@/components/ui/label";
import TeamSlot from "@/components/TeamSlot";
import React from "react";
import abilitiesData from "@/data/abilities_es.json";
import { DEFAULT_REGION, RegionId, getPlacesForRegion } from "@/data/regions";
import { pokemonFixtures } from "@/data/fixtures";
import { translations } from "@/data/translations";
import { storageService } from "@/services/storageService";

interface PanelConfig {
  boxPanel: { columns: number; order: number };
  slotEditor: { columns: number; order: number };
  placesPanel: { columns: number; order: number };
  weaknessPanel: { columns: number; order: number };
  configPanel: { columns: number; order: number };
  appConfigPanel: { columns: number; order: number };
}

const DEFAULT_PANEL_CONFIG: PanelConfig = {
  boxPanel: { columns: 2, order: 1 },
  slotEditor: { columns: 2, order: 2 },
  placesPanel: { columns: 2, order: 3 },
  weaknessPanel: { columns: 2, order: 4 },
  configPanel: { columns: 2, order: 5 },
  appConfigPanel: { columns: 2, order: 6 },
};

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
      staticZoom: 1.5, // Default 1.5x zoom for static sprites
      animatedZoom: 1.5, // Default 1.5x zoom for animated sprites
      staticTranslateX: 0,
      staticTranslateY: 0,
      animatedTranslateX: 0,
      animatedTranslateY: 0,
      place: '',
      box: 'team',
    }))
  );
  const [allPokemon, setAllPokemon] = useState<Pokemon[]>([]);
  const [selectedSlot, setSelectedSlot] = useState<number>(0);
  const [selectedBox, setSelectedBox] = useState<'team' | 'other' | 'graveyard'>('team');
  const [isLoading, setIsLoading] = useState(true);

  const [selectedRegion, setSelectedRegion] = useState<RegionId>(() => {
    const saved = storageService.loadAppConfig();
    return (saved?.region as RegionId) ?? DEFAULT_REGION;
  });
  const placesData = getPlacesForRegion(selectedRegion);
  const [panelConfig, setPanelConfig] = useState<PanelConfig>(() => {
    const saved = storageService.loadPanelConfig();
    if (saved) {
      // Merge saved values with defaults to handle new panels added in future versions
      const merged: PanelConfig = { ...DEFAULT_PANEL_CONFIG };
      for (const key of Object.keys(DEFAULT_PANEL_CONFIG) as (keyof PanelConfig)[]) {
        if (saved[key] && typeof saved[key] === 'object') {
          merged[key] = saved[key] as { columns: number; order: number };
        }
      }
      return merged;
    }
    return DEFAULT_PANEL_CONFIG;
  });
  const [autosave, setAutosave] = useState<boolean>(() => {
    const saved = storageService.loadAppConfig();
    // Default to true; only disable if explicitly saved as false
    return saved?.autosave !== false;
  });
  const [showLevel, setShowLevel] = useState<boolean>(() => {
    const saved = storageService.loadAppConfig();
    return saved?.showLevel !== false;
  });
  const [showPokeball, setShowPokeball] = useState<boolean>(() => {
    const saved = storageService.loadAppConfig();
    return saved?.showPokeball !== false;
  });
  // Ref to skip autosave during the initial data-load phase
  const isInitialLoad = React.useRef(true);
  const { toast } = useToast();

  // Persist app-wide settings (region, autosave, display toggles, …) whenever they change
  useEffect(() => {
    storageService.saveAppConfig({ region: selectedRegion, autosave, showLevel, showPokeball });
  }, [selectedRegion, autosave, showLevel, showPokeball]);

  // Persist panel layout config whenever it changes
  useEffect(() => {
    storageService.savePanelConfig(panelConfig as unknown as Record<string, unknown>);
  }, [panelConfig]);

  // Autosave: persist team slots on every change (skip the initial load)
  useEffect(() => {
    if (isInitialLoad.current) return;
    if (autosave) {
      storageService.saveTeam(allSlots);
    }
  }, [allSlots, autosave]);

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
        
        // Check for saved data and load it automatically
        try {
          const savedSlots = storageService.loadTeam();
          if (savedSlots && savedSlots.length > 0) {
            console.log('Found saved data, loading automatically:', savedSlots.length, 'slots');
            setAllSlots(savedSlots);
            toast({
              title: translations.messages.teamLoaded,
              description: "Datos guardados cargados automáticamente",
              variant: "default"
            });
          } else {
            console.log('No saved data found, using default empty slots');
          }
        } catch (loadError) {
          console.error('Error loading saved data:', loadError);
          // Don't show error toast for failed auto-load, just continue with empty slots
        }
      } catch (error) {
        console.error('Error initializing data:', error);
        toast({
          title: translations.messages.error,
          description: translations.messages.pokemonDataError,
          variant: "destructive"
        });
      } finally {
        setIsLoading(false);
        // Mark initial load complete so autosave kicks in for subsequent changes
        isInitialLoad.current = false;
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
      staticZoom: 1.5,
      animatedZoom: 1.5,
      staticTranslateX: 0,
      staticTranslateY: 0,
      animatedTranslateX: 0,
      animatedTranslateY: 0,
      place: '',
      box: 'team',
    });
    toast({
      title: translations.messages.slotCleared,
      description: `Slot ${slotIndex + 1} ${translations.messages.slotClearedDesc}`
    });
  };

  const movePokemon = (
    sourceBox: 'team' | 'other' | 'graveyard',
    sourceIndex: number,
    targetBox: 'team' | 'other' | 'graveyard',
    targetIndex: number
  ) => {
    const sourceSlots = allSlots.filter(s => (s.box || 'other') === sourceBox);
    const targetSlots = allSlots.filter(s => (s.box || 'other') === targetBox);

    const sourceSlot = sourceSlots[sourceIndex];
    // For target, it could be a filled slot or an empty virtual slot
    const targetSlot = targetSlots[targetIndex];

    if (!sourceSlot) return;

    setAllSlots(prev => {
      const next = [...prev];
      const srcIdx = next.findIndex(s => s.id === sourceSlot.id);

      if (sourceBox === targetBox) {
        // Same box: simple swap
        if (!targetSlot) return prev;
        const tgtIdx = next.findIndex(s => s.id === targetSlot.id);
        if (srcIdx === -1 || tgtIdx === -1 || srcIdx === tgtIdx) return prev;
        [next[srcIdx], next[tgtIdx]] = [next[tgtIdx], next[srcIdx]];
      } else {
        // Cross-box move
        if (targetSlot && targetSlot.pokemon) {
          // Swap: move source to target box position, target to source box position
          const tgtIdx = next.findIndex(s => s.id === targetSlot.id);
          const srcPokemonData = { pokemon: next[srcIdx].pokemon, nickname: next[srcIdx].nickname, level: next[srcIdx].level, ability: next[srcIdx].ability, pokeball: next[srcIdx].pokeball, animated: next[srcIdx].animated, staticZoom: next[srcIdx].staticZoom, animatedZoom: next[srcIdx].animatedZoom, staticTranslateX: next[srcIdx].staticTranslateX, staticTranslateY: next[srcIdx].staticTranslateY, animatedTranslateX: next[srcIdx].animatedTranslateX, animatedTranslateY: next[srcIdx].animatedTranslateY, place: next[srcIdx].place };
          const tgtPokemonData = { pokemon: next[tgtIdx].pokemon, nickname: next[tgtIdx].nickname, level: next[tgtIdx].level, ability: next[tgtIdx].ability, pokeball: next[tgtIdx].pokeball, animated: next[tgtIdx].animated, staticZoom: next[tgtIdx].staticZoom, animatedZoom: next[tgtIdx].animatedZoom, staticTranslateX: next[tgtIdx].staticTranslateX, staticTranslateY: next[tgtIdx].staticTranslateY, animatedTranslateX: next[tgtIdx].animatedTranslateX, animatedTranslateY: next[tgtIdx].animatedTranslateY, place: next[tgtIdx].place };
          next[srcIdx] = { ...next[srcIdx], ...tgtPokemonData, box: sourceBox };
          next[tgtIdx] = { ...next[tgtIdx], ...srcPokemonData, box: targetBox };
        } else {
          // Move source pokemon into the target empty slot (change its box)
          // If target is a virtual empty slot, just change the source slot's box
          if (targetSlot) {
            const tgtIdx = next.findIndex(s => s.id === targetSlot.id);
            // Move source data into the target real slot, clear the original source slot
            next[tgtIdx] = { ...next[tgtIdx], pokemon: next[srcIdx].pokemon, nickname: next[srcIdx].nickname, level: next[srcIdx].level, ability: next[srcIdx].ability, pokeball: next[srcIdx].pokeball, animated: next[srcIdx].animated, staticZoom: next[srcIdx].staticZoom, animatedZoom: next[srcIdx].animatedZoom, staticTranslateX: next[srcIdx].staticTranslateX, staticTranslateY: next[srcIdx].staticTranslateY, animatedTranslateX: next[srcIdx].animatedTranslateX, animatedTranslateY: next[srcIdx].animatedTranslateY, place: next[srcIdx].place, box: targetBox };
            next[srcIdx] = { ...next[srcIdx], pokemon: null, nickname: '', level: 1, ability: '', pokeball: 'pokeball', animated: false, staticZoom: 1.5, animatedZoom: 1.5, staticTranslateX: 0, staticTranslateY: 0, animatedTranslateX: 0, animatedTranslateY: 0, place: '' };
          } else {
            // Virtual empty slot in another box: just change this slot's box
            next[srcIdx] = { ...next[srcIdx], box: targetBox };
          }
        }
      }
      return next;
    });
  };


  const addFixtures = () => {
    console.log('Loading fixtures...');
    const fixtures = pokemonFixtures;
    
    if (allPokemon.length === 0) {
      console.error('allPokemon is empty! Cannot load fixtures.');
      return;
    }

    // Process all fixtures, not just the first 6
    const newSlots = fixtures.map((fixture, index) => {
      const pokemon = allPokemon.find(p => 
        p.name.english.toLowerCase() === fixture.name.toLowerCase()
      );
      
              return {
          id: `fixture-slot-${index}`,
          pokemon: pokemon || null,
          nickname: fixture.nickname,
          level: fixture.level || 1,
          ability: (fixture as any).ability || '',
          pokeball: (fixture as any).pokeball || 'pokeball',
          animated: false,
          staticZoom: 1.5,
          animatedZoom: 1.5,
          staticTranslateX: 0,
          staticTranslateY: 0,
          animatedTranslateX: 0,
          animatedTranslateY: 0,
          place: fixture.place || '',
          box: fixture.box || 'team',
        };
    });

    const finalSlots = newSlots.map(slot => ({ ...slot, box: (slot.box === 'team' || slot.box === 'other' || slot.box === 'graveyard') ? slot.box : 'other' } as TeamPokemon));
    setAllSlots(finalSlots);
    console.log('Fixtures loaded successfully!', finalSlots);
  };

  // Export team data to clipboard
  const exportTeamToClipboard = async () => {
    try {
      const team = storageService.loadTeam();
      await navigator.clipboard.writeText(JSON.stringify(team, null, 2));
      toast({
        title: 'Exported!',
        description: 'Team data copied to clipboard.',
        variant: 'default',
      });
    } catch (err) {
      toast({
        title: 'Error',
        description: 'Failed to copy team data to clipboard.',
        variant: 'destructive',
      });
    }
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
          Export Team to Clipboard
        </button>
      </div>
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
                  staticZoom: 1.5,
                  animatedZoom: 1.5,
                  staticTranslateX: 0,
                  staticTranslateY: 0,
                  animatedTranslateX: 0,
                  animatedTranslateY: 0,
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
                    draggable={true}
                    showLevel={showLevel}
                    showPokeball={showPokeball}
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
                            console.log('Slot clicked:', box, idx);
                            setSelectedBox(box); 
                            setSelectedSlot(idx); 
                          }}
                          onAddFixtures={addFixtures}
                          setTeam={setAllSlots}
                          allSlots={allSlots}
                          onMovePokemon={movePokemon}
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
                                  staticZoom: 1.5,
                                  animatedZoom: 1.5,
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
                                staticZoom: 1.5,
                                animatedZoom: 1.5,
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
                          placesData={placesData}
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
                  case 'appConfigPanel':
                    return (
                      <div key={panelKey} className={colSpanClass}>
                        <AppConfigPanel
                          region={selectedRegion}
                          onRegionChange={setSelectedRegion}
                          autosave={autosave}
                          onAutosaveChange={setAutosave}
                          showLevel={showLevel}
                          onShowLevelChange={setShowLevel}
                          showPokeball={showPokeball}
                          onShowPokeballChange={setShowPokeball}
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