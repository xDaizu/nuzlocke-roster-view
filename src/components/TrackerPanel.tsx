import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TeamPokemon } from "@/types/pokemon";
import { TrackerEntry } from "@/types/tracker";
import { Place } from "@/data/regions";
import { MapPin } from "lucide-react";
import { translations } from "@/data/translations";
import TrackerList from "@/components/TrackerList";

interface TrackerPanelProps {
  allSlots: TeamPokemon[];
  trackerEntries: TrackerEntry[] | undefined;
  placesData: Place[];
  onSelectEncounter?: (entry: TrackerEntry) => void;
}

const TrackerPanel: React.FC<TrackerPanelProps> = ({ allSlots, trackerEntries, placesData, onSelectEncounter }) => {
  return (
    <Card className="bg-slate-800/90 border-purple-500/30 col-span-1">
      <CardHeader>
        <CardTitle className="text-purple-300 flex items-center gap-2">
          <MapPin className="w-5 h-5" />
          {translations.panels.placesPanel}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <TrackerList
          allSlots={allSlots}
          trackerEntries={trackerEntries}
          placesData={placesData}
          onSelectEncounter={onSelectEncounter}
          className="max-h-[32rem] overflow-y-auto pr-1"
        />
      </CardContent>
    </Card>
  );
};

export default TrackerPanel;
