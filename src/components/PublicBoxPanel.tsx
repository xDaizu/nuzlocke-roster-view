import React from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { TeamPokemon } from "@/types/pokemon";
import PokemonBox from "@/components/PokemonBox";
import { storageService } from "@/services/storageService";
import { Save, ArchiveRestore, Package } from "lucide-react";
import { Tooltip, TooltipTrigger, TooltipContent } from "@/components/ui/tooltip";
import { useToast } from "@/hooks/use-toast";
import { translations } from "@/data/translations";

interface PublicBoxPanelProps {
  team: TeamPokemon[];
  otherBox: TeamPokemon[];
  graveyardBox: TeamPokemon[];
  selectedSlot: number;
  selectedBox: 'team' | 'other' | 'graveyard';
  onSlotClick: (box: 'team' | 'other' | 'graveyard', index: number) => void;
  onAddFixtures: () => void;
  setTeam: (team: TeamPokemon[]) => void;
  columnSpan?: number;
  allSlots: TeamPokemon[]; // Add allSlots for proper save/load
}

const PublicBoxPanel: React.FC<PublicBoxPanelProps> = ({
  team,
  otherBox,
  graveyardBox,
  selectedSlot,
  selectedBox,
  onSlotClick,
  onAddFixtures,
  setTeam,
  allSlots,
}) => {
  const { toast } = useToast();

  const handleSaveTeam = () => {
    try {
      storageService.saveTeam(allSlots); // Save all slots, not just team
      toast({
        title: translations.messages.teamSaved,
        description: translations.messages.teamSavedDesc,
        variant: "default"
      });
    } catch (error) {
      toast({
        title: translations.messages.error,
        description: translations.messages.saveError,
        variant: "destructive"
      });
    }
  };

  const handleLoadTeam = () => {
    try {
      const loadedSlots = storageService.loadTeam();
      if (loadedSlots && loadedSlots.length > 0) {
        setTeam(loadedSlots); // Load all slots
        toast({
          title: translations.messages.teamLoaded,
          description: translations.messages.teamLoadedDesc,
          variant: "default"
        });
      } else {
        toast({
          title: translations.messages.noSavedTeam,
          description: translations.messages.noSavedTeamDesc,
          variant: "destructive"
        });
      }
    } catch (error) {
      toast({
        title: translations.messages.error,
        description: translations.messages.loadError,
        variant: "destructive"
      });
    }
  };

  return (
    <Card className="bg-slate-800/90 border-purple-500/30 col-span-1">
      <CardHeader>
        <CardTitle className="text-purple-300 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <Package className="w-5 h-5" />
            {translations.panels.boxPanel}
          </div>
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
              <TooltipContent>{translations.buttons.save}</TooltipContent>
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
              <TooltipContent>{translations.buttons.load}</TooltipContent>
            </Tooltip>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <PokemonBox
          title={translations.boxes.team}
          slots={team}
          maxSlots={6}
          onSlotClick={(index) => onSlotClick('team', index)}
          selectedSlot={selectedBox === 'team' ? selectedSlot : undefined}
          boxType="team"
        />
        
        <PokemonBox
          title={translations.boxes.other}
          slots={otherBox}
          onSlotClick={(index) => onSlotClick('other', index)}
          selectedSlot={selectedBox === 'other' ? selectedSlot : undefined}
          boxType="other"
        />
        
        <PokemonBox
          title={translations.boxes.graveyard}
          slots={graveyardBox}
          onSlotClick={(index) => onSlotClick('graveyard', index)}
          selectedSlot={selectedBox === 'graveyard' ? selectedSlot : undefined}
          boxType="graveyard"
        />
      </CardContent>
      <CardFooter>
        <Button
          onClick={onAddFixtures}
          className="bg-purple-600 hover:bg-purple-700"
        >
          {translations.buttons.default}
        </Button>
      </CardFooter>
    </Card>
  );
};

export default PublicBoxPanel; 