import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Globe } from "lucide-react";
import { translations } from "@/data/translations";
import { REGION_LIST, RegionId } from "@/data/regions";

interface AppConfigPanelProps {
  region: RegionId;
  onRegionChange: (region: RegionId) => void;
  autosave: boolean;
  onAutosaveChange: (value: boolean) => void;
}

/** App-wide settings (region, autosave, …; designed to grow). */
const AppConfigPanel: React.FC<AppConfigPanelProps> = ({
  region,
  onRegionChange,
  autosave,
  onAutosaveChange,
}) => {
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

        {/* Autosave toggle */}
        <div className="p-3 bg-slate-700/30 rounded-lg border border-slate-600/50">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <Label className="text-white text-sm">{translations.appConfig.autosave}</Label>
              <p className="text-xs text-slate-400">{translations.appConfig.autosaveDescription}</p>
            </div>
            <Switch
              checked={autosave}
              onCheckedChange={onAutosaveChange}
              className="data-[state=checked]:bg-purple-500"
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default AppConfigPanel;
