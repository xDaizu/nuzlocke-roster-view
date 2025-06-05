
import { useState, useEffect } from "react";
import { TeamPokemon, Pokemon } from "@/types/pokemon";
import { fetchPokemonData } from "@/utils/pokemonData";
import { useToast } from "@/hooks/use-toast";
import PublicHeader from "@/components/PublicHeader";
import PublicAdminPanel from "@/components/PublicAdminPanel";
import PublicSlotEditor from "@/components/PublicSlotEditor";

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

  const handleSlotClick = (box: 'team' | 'other' | 'graveyard', index: number) => {
    setSelectedSlot(index);
    setSelectedBox(box);
  };

  const currentSlot = getCurrentSlot();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-900 via-slate-900 to-red-900 flex items-center justify-center">
        <div className="text-white text-xl">Loading Pokemon data...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-slate-900 to-red-900">
      <PublicHeader team={team} updateSlot={updateSlot} />

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
              onSlotClick={handleSlotClick}
              onAddFixtures={addFixtures}
              setTeam={setTeam}
            />

            <PublicSlotEditor
              currentSlot={currentSlot}
              allPokemon={allPokemon}
              selectedSlot={selectedSlot}
              onUpdate={(updates) => updateSlot(selectedSlot, updates)}
              onClear={() => clearSlot(selectedSlot)}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default PublicView;
