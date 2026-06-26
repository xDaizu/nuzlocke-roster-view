import { useState } from "react";
import { PanelConfig } from "@/types/pokemon";
import PublicBoxPanel from "@/components/PublicBoxPanel";
import PublicSlotEditor from "@/components/PublicSlotEditor";
import PlacesPanel from "@/components/PlacesPanel";
import PanelConfigPanel from "@/components/PanelConfigPanel";
import AppConfigPanel from "@/components/AppConfigPanel";
import WeaknessPanel from "@/components/WeaknessPanel";
import TeamHeader from "@/components/TeamHeader";
import { DEFAULT_REGION, RegionId, getPlacesForRegion } from "@/data/regions";
import { translations } from "@/data/translations";
import { exportTeamToClipboard } from "@/utils/clipboard";
import { getColSpanClass } from "@/utils/panelLayout";
import { usePokemonData } from "@/hooks/usePokemonData";
import { useTeamSlots } from "@/hooks/useTeamSlots";

const PublicView = () => {
  const { allPokemon, isLoading } = usePokemonData();
  const {
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
  } = useTeamSlots(allPokemon);

  const [selectedRegion, setSelectedRegion] = useState<RegionId>(DEFAULT_REGION);
  const placesData = getPlacesForRegion(selectedRegion);

  const [panelConfig, setPanelConfig] = useState<PanelConfig>({
    boxPanel: { columns: 2, order: 1 },
    slotEditor: { columns: 2, order: 2 },
    placesPanel: { columns: 2, order: 3 },
    weaknessPanel: { columns: 2, order: 4 },
    configPanel: { columns: 2, order: 5 },
    appConfigPanel: { columns: 2, order: 6 }
  });

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

      <TeamHeader team={team} allSlots={allSlots} updateSlot={updateSlot} placesData={placesData} />

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
                          onSlotClick={selectSlot}
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
                          currentSlot={getCurrentSlot()}
                          allPokemon={allPokemon}
                          selectedSlot={selectedSlot}
                          onUpdate={updateSelectedSlot}
                          onClear={clearSelectedSlot}
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
