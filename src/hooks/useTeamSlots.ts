import { useEffect, useState } from "react";
import { BoxType, Pokemon, TeamPokemon } from "@/types/pokemon";
import { useToast } from "@/hooks/use-toast";
import { translations } from "@/data/translations";
import { storageService } from "@/services/storageService";
import { createEmptySlot, normalizeBox } from "@/utils/slots";
import { pokemonFixtures } from "@/data/fixtures";

/**
 * Owns the roster state: the flat `allSlots` array, the derived team/PC/graveyard
 * boxes, the current selection, and every slot mutation. Auto-loads a saved team
 * on mount. `allPokemon` is only needed to resolve fixtures.
 */
export function useTeamSlots(allPokemon: Pokemon[]) {
  const [allSlots, setAllSlots] = useState<TeamPokemon[]>(() =>
    Array.from({ length: 6 }, (_, index) => createEmptySlot(`slot-${index}`, 'team'))
  );
  const [selectedSlot, setSelectedSlot] = useState<number>(0);
  const [selectedBox, setSelectedBox] = useState<BoxType>('team');
  const { toast } = useToast();

  // Auto-load saved data on mount; stay on empty slots if none/failed.
  useEffect(() => {
    try {
      const savedSlots = storageService.loadTeam();
      if (savedSlots && savedSlots.length > 0) {
        setAllSlots(savedSlots);
        toast({
          title: translations.messages.teamLoaded,
          description: translations.messages.autoLoaded,
          variant: "default",
        });
      }
    } catch {
      // Don't show error toast for failed auto-load, just continue with empty slots
    }
  }, [toast]);

  // Filter slots by box type, defaulting to 'other' if no box is set
  const team = allSlots.filter(slot => normalizeBox(slot.box) === 'team');
  const otherBox = allSlots.filter(slot => normalizeBox(slot.box) === 'other');
  const graveyardBox = allSlots.filter(slot => normalizeBox(slot.box) === 'graveyard');

  const updateSlot = (slotIndex: number, updates: Partial<TeamPokemon>) => {
    if (slotIndex < 0 || slotIndex >= allSlots.length) {
      return;
    }
    const newAllSlots = [...allSlots];
    newAllSlots[slotIndex] = { ...newAllSlots[slotIndex], ...updates };
    setAllSlots(newAllSlots);
  };

  const clearSlot = (slotIndex: number) => {
    const { id: _id, ...defaults } = createEmptySlot('', 'team');
    updateSlot(slotIndex, defaults);
    toast({
      title: translations.messages.slotCleared,
      description: `Slot ${slotIndex + 1} ${translations.messages.slotClearedDesc}`,
    });
  };

  const addFixtures = () => {
    if (allPokemon.length === 0) {
      return;
    }
    const newSlots: TeamPokemon[] = pokemonFixtures.map((fixture, index) => ({
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

  const selectSlot = (box: BoxType, index: number) => {
    setSelectedBox(box);
    setSelectedSlot(index);
  };

  // The slots of the currently-selected box.
  const selectedBoxSlots =
    selectedBox === 'team' ? team : selectedBox === 'other' ? otherBox : graveyardBox;

  // The slot the editor should show — a placeholder if the selection is empty.
  const getCurrentSlot = (): TeamPokemon =>
    selectedBoxSlots[selectedSlot] ||
    createEmptySlot(`${selectedBox}-${selectedSlot}`, selectedBox);

  const updateSelectedSlot = (updates: Partial<TeamPokemon>) => {
    const targetSlot = selectedBoxSlots[selectedSlot];
    if (targetSlot) {
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
  };

  const clearSelectedSlot = () => {
    const targetSlot = selectedBoxSlots[selectedSlot];
    if (targetSlot) {
      const actualIndex = allSlots.findIndex(slot => slot.id === targetSlot.id);
      if (actualIndex !== -1) {
        clearSlot(actualIndex);
      }
    }
    // If slot doesn't exist, there's nothing to clear
  };

  return {
    allSlots,
    setAllSlots,
    team,
    otherBox,
    graveyardBox,
    selectedSlot,
    selectedBox,
    selectSlot,
    updateSlot,
    addFixtures,
    getCurrentSlot,
    updateSelectedSlot,
    clearSelectedSlot,
  };
}
