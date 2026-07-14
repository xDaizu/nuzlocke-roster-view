import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TeamPokemon } from "@/types/pokemon";
import { MapPin } from "lucide-react";
import { translations } from "@/data/translations";
import PlacesList from "@/components/PlacesList";

interface PlacesPanelProps {
  allSlots: TeamPokemon[];
  placesData: Array<{ id: string; nombre: string }>;
}

const PlacesPanel: React.FC<PlacesPanelProps> = ({ allSlots, placesData }) => {
  return (
    <Card className="bg-slate-800/90 border-purple-500/30 col-span-1">
      <CardHeader>
        <CardTitle className="text-purple-300 flex items-center gap-2">
          <MapPin className="w-5 h-5" />
          {translations.panels.placesPanel}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <PlacesList allSlots={allSlots} placesData={placesData} />
      </CardContent>
    </Card>
  );
};

export default PlacesPanel;
