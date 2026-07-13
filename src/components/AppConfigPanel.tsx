import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Input } from "@/components/ui/input";
import { Globe } from "lucide-react";
import { translations } from "@/data/translations";
import { REGION_LIST, RegionId } from "@/data/regions";

interface AppConfigPanelProps {
  region: RegionId;
  onRegionChange: (region: RegionId) => void;
  autosave: boolean;
  onAutosaveChange: (value: boolean) => void;
  showLevel: boolean;
  onShowLevelChange: (value: boolean) => void;
  showPokeball: boolean;
  onShowPokeballChange: (value: boolean) => void;
  /** Seconds between swaps for the header's PC preview slot. 0 disables it. */
  pcSlotSeconds: number;
  onPcSlotSecondsChange: (value: number) => void;
  /** Seconds between swaps for the header's graveyard/heaven preview slot. 0 disables it. */
  graveyardSlotSeconds: number;
  onGraveyardSlotSecondsChange: (value: number) => void;
}

/** App-wide settings (region, autosave, display toggles; designed to grow). */
const AppConfigPanel: React.FC<AppConfigPanelProps> = ({
  region,
  onRegionChange,
  autosave,
  onAutosaveChange,
  showLevel,
  onShowLevelChange,
  showPokeball,
  onShowPokeballChange,
  pcSlotSeconds,
  onPcSlotSecondsChange,
  graveyardSlotSeconds,
  onGraveyardSlotSecondsChange,
}) => {
  const cycleSecondsRow = (
    label: string,
    description: string,
    value: number,
    onChange: (v: number) => void,
  ) => (
    <div className="space-y-2 p-3 bg-slate-700/30 rounded-lg border border-slate-600/50">
      <Label className="text-white text-sm">{label}</Label>
      <Input
        type="number"
        min={0}
        step={1}
        value={value}
        onChange={(e) => {
          const parsed = Number(e.target.value);
          onChange(Number.isFinite(parsed) && parsed > 0 ? parsed : 0);
        }}
        className="bg-slate-700 border-slate-600 text-white"
      />
      <p className="text-xs text-slate-400">{description}</p>
    </div>
  );

  const toggleRow = (
    label: string,
    description: string,
    checked: boolean,
    onChange: (v: boolean) => void,
  ) => (
    <div className="p-3 bg-slate-700/30 rounded-lg border border-slate-600/50">
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <Label className="text-white text-sm">{label}</Label>
          <p className="text-xs text-slate-400">{description}</p>
        </div>
        <Switch
          checked={checked}
          onCheckedChange={onChange}
          className="data-[state=checked]:bg-purple-500"
        />
      </div>
    </div>
  );

  return (
    <Card className="bg-slate-800/90 border-purple-500/30">
      <CardHeader>
        <CardTitle className="text-purple-300 flex items-center gap-2">
          <Globe className="w-5 h-5" />
          {translations.panels.appConfigPanel}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Region selector */}
        <div className="space-y-2 p-3 bg-slate-700/30 rounded-lg border border-slate-600/50">
          <Label className="text-white text-sm">{translations.appConfig.region}</Label>
          <Select value={region} onValueChange={(value) => onRegionChange(value as RegionId)}>
            <SelectTrigger className="bg-slate-700 border-slate-600 text-white">
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="bg-slate-700 border-slate-600">
              {REGION_LIST.map((r) => (
                <SelectItem key={r.id} value={r.id} className="text-white focus:bg-slate-600">
                  {r.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <p className="text-xs text-slate-400">{translations.appConfig.regionDescription}</p>
        </div>

        {toggleRow(
          translations.appConfig.autosave,
          translations.appConfig.autosaveDescription,
          autosave,
          onAutosaveChange,
        )}

        {toggleRow(
          translations.appConfig.showLevel,
          translations.appConfig.showLevelDescription,
          showLevel,
          onShowLevelChange,
        )}

        {toggleRow(
          translations.appConfig.showPokeball,
          translations.appConfig.showPokeballDescription,
          showPokeball,
          onShowPokeballChange,
        )}

        {cycleSecondsRow(
          translations.appConfig.pcSlotSeconds,
          translations.appConfig.pcSlotSecondsDescription,
          pcSlotSeconds,
          onPcSlotSecondsChange,
        )}

        {cycleSecondsRow(
          translations.appConfig.graveyardSlotSeconds,
          translations.appConfig.graveyardSlotSecondsDescription,
          graveyardSlotSeconds,
          onGraveyardSlotSecondsChange,
        )}
      </CardContent>
    </Card>
  );
};

export default AppConfigPanel;
