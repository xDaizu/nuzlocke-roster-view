import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Settings, ChevronUp, ChevronDown } from "lucide-react";
import { translations } from "@/data/translations";
import { Button } from "@/components/ui/button";

interface PanelConfig {
  boxPanel: { columns: number; order: number };
  slotEditor: { columns: number; order: number };
  placesPanel: { columns: number; order: number };
  weaknessPanel: { columns: number; order: number };
  configPanel: { columns: number; order: number };
}

interface PanelConfigPanelProps {
  config: PanelConfig;
  onConfigChange: (config: PanelConfig) => void;
}

const PanelConfigPanel: React.FC<PanelConfigPanelProps> = ({ config, onConfigChange }) => {
  const updateConfig = (panel: keyof PanelConfig, columns: number) => {
    onConfigChange({
      ...config,
      [panel]: {
        ...config[panel],
        columns
      }
    });
  };

  const movePanel = (panel: keyof PanelConfig, direction: 'up' | 'down') => {
    const currentOrder = config[panel].order;
    const newOrder = direction === 'up' ? currentOrder - 1 : currentOrder + 1;
    
    // Find panel with the target order
    const targetPanel = Object.entries(config).find(([_, value]) => value.order === newOrder)?.[0] as keyof PanelConfig;
    
    if (targetPanel) {
      onConfigChange({
        ...config,
        [panel]: { ...config[panel], order: newOrder },
        [targetPanel]: { ...config[targetPanel], order: currentOrder }
      });
    }
  };

  const getColumnText = (num: number) => 
    `${num} ${num > 1 ? translations.config.columnsPlural : translations.config.columnsSingular}`;

  const totalColumns = config.boxPanel.columns + config.slotEditor.columns + config.placesPanel.columns + config.weaknessPanel.columns + config.configPanel.columns;
  const isValidConfig = totalColumns <= 6;

  return (
    <Card className="bg-slate-800/90 border-purple-500/30">
      <CardHeader>
        <CardTitle className="text-purple-300 flex items-center gap-2">
          <Settings className="w-5 h-5" />
          {translations.panels.configPanel}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 gap-3">
          {/* Render panels in order */}
          {Object.entries(config)
            .sort(([, a], [, b]) => a.order - b.order)
            .map(([panelKey, panelConfig]) => {
              const panelName = translations.panels[panelKey as keyof typeof translations.panels];
              const isFirst = panelConfig.order === 1;
              const isLast = panelConfig.order === Object.keys(config).length;
              
              return (
                <div key={panelKey} className="space-y-2 p-3 bg-slate-700/30 rounded-lg border border-slate-600/50">
                  <div className="flex items-center justify-between">
                    <Label className="text-white text-sm">{panelName}</Label>
                    <div className="flex items-center gap-1">
                      <span className="text-xs text-slate-400">#{panelConfig.order}</span>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => movePanel(panelKey as keyof PanelConfig, 'up')}
                        disabled={isFirst}
                        className="h-6 w-6 p-0 text-slate-400 hover:text-white"
                      >
                        <ChevronUp className="w-3 h-3" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => movePanel(panelKey as keyof PanelConfig, 'down')}
                        disabled={isLast}
                        className="h-6 w-6 p-0 text-slate-400 hover:text-white"
                      >
                        <ChevronDown className="w-3 h-3" />
                      </Button>
                    </div>
                  </div>
                  <Select 
                    value={panelConfig.columns.toString()} 
                    onValueChange={(value) => updateConfig(panelKey as keyof PanelConfig, parseInt(value))}
                  >
                    <SelectTrigger className="bg-slate-700 border-slate-600 text-white">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-slate-700 border-slate-600">
                      {[1, 2, 3, 4, 5, 6].map(num => (
                        <SelectItem key={num} value={num.toString()} className="text-white focus:bg-slate-600">
                          {getColumnText(num)}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              );
            })}
        </div>

        {/* Total Columns Indicator */}
        <div className="mt-4 p-3 rounded-lg bg-slate-700/50 border border-purple-500/20">
          <div className="flex justify-between items-center">
            <span className="text-white text-sm">{translations.config.totalColumns}</span>
            <span className={`text-sm font-medium ${isValidConfig ? 'text-green-400' : 'text-red-400'}`}>
              {totalColumns}/6
            </span>
          </div>
          {!isValidConfig && (
            <p className="text-red-400 text-xs mt-1">
              {translations.config.exceedsColumns}
            </p>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default PanelConfigPanel; 