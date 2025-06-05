import React from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { TeamPokemon } from "@/types/pokemon";
import PokemonBox from "@/components/PokemonBox";
import { storageService } from "@/services/storageService";
import { Save, ArchiveRestore, Package } from "lucide-react";
import { Tooltip, TooltipTrigger, TooltipContent } from "@/components/ui/tooltip";
import { useToast } from "@/hooks/use-toast";

interface PublicBoxPanelProps {
  team: TeamPokemon[];
  otherBox: TeamPokemon[];
  graveyardBox: TeamPokemon[];
  selectedSlot: number;
  selectedBox: 'team' | 'other' | 'graveyard';
  onSlotClick: (box: 'team' | 'other' | 'graveyard', index: number) => void;
  onAddFixtures: () => void;
  setTeam: (team: TeamPokemon[]) => void;
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
}) => {
  const { toast } = useToast();

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

  return (
    <Card className="bg-slate-800/90 border-purple-500/30 col-span-1">
      <CardHeader>
        <CardTitle className="text-purple-300 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <Package className="w-5 h-5" />
            Panel de Cajas
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
          title="Equipo"
          slots={team}
          maxSlots={6}
          onSlotClick={(index) => onSlotClick('team', index)}
          selectedSlot={selectedBox === 'team' ? selectedSlot : undefined}
          boxType="team"
        />
        
        <PokemonBox
          title="En el PC"
          slots={otherBox}
          maxSlots={12}
          onSlotClick={(index) => onSlotClick('other', index)}
          selectedSlot={selectedBox === 'other' ? selectedSlot : undefined}
          boxType="other"
        />
        
        <PokemonBox
          title="El sielo"
          slots={graveyardBox}
          maxSlots={12}
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
          Default
        </Button>
      </CardFooter>
    </Card>
  );
};

export default PublicBoxPanel; 