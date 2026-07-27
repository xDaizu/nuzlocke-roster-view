import React from "react";
import { TeamPokemon } from "@/types/pokemon";
import { TrackerEntry } from "@/types/tracker";
import { Place } from "@/data/regions";
import { MapPin, X } from "lucide-react";
import { translations } from "@/data/translations";
import TrackerList from "@/components/TrackerList";

interface PlacesSidebarProps {
  isOpen: boolean;
  onClose: () => void;
  allSlots: TeamPokemon[];
  placesData: Place[];
  trackerEntries: TrackerEntry[] | undefined;
  onSelectEncounter?: (entry: TrackerEntry) => void;
  missedPlaceIds?: string[];
  onToggleMissed?: (entry: TrackerEntry) => void;
  /** Height of the fixed public header bar, so the sidebar starts right below it. */
  topOffset: number;
}

const PlacesSidebar: React.FC<PlacesSidebarProps> = ({ isOpen, onClose, allSlots, placesData, trackerEntries, onSelectEncounter, missedPlaceIds, onToggleMissed, topOffset }) => {
  return (
    <aside
      className={`fixed right-0 bottom-0 z-40 w-80 max-w-[85vw] bg-slate-800/95 border-l border-purple-500/30 overflow-y-auto overscroll-contain transition-transform duration-300 ${
        isOpen ? 'translate-x-0' : 'translate-x-full pointer-events-none'
      }`}
      style={{ top: topOffset }}
      aria-hidden={!isOpen}
    >
      <div className="sticky top-0 z-10 flex items-center justify-between gap-2 p-4 bg-slate-800/95 border-b border-purple-500/30">
        <div className="text-purple-300 flex items-center gap-2 font-semibold">
          <MapPin className="w-5 h-5" />
          {translations.panels.placesPanel}
        </div>
        <button
          onClick={onClose}
          aria-label="Cerrar"
          className="text-slate-400 hover:text-white transition-colors"
        >
          <X className="w-5 h-5" />
        </button>
      </div>
      <div className="p-4">
        <TrackerList
          allSlots={allSlots}
          trackerEntries={trackerEntries}
          placesData={placesData}
          onSelectEncounter={onSelectEncounter}
          missedPlaceIds={missedPlaceIds}
          onToggleMissed={onToggleMissed}
        />
      </div>
    </aside>
  );
};

export default PlacesSidebar;
