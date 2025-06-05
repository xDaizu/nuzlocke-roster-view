import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Settings } from "lucide-react";

interface PanelConfig {
  boxPanel: number;
  slotEditor: number;
  placesPanel: number;
  configPanel: number;
}

interface PanelConfigPanelProps {
  config: PanelConfig;
  onConfigChange: (config: PanelConfig) => void;
}

const PanelConfigPanel: React.FC<PanelConfigPanelProps> = ({ config, onConfigChange }) => {
  const updateConfig = (panel: keyof PanelConfig, value: number) => {
    onConfigChange({
      ...config,
      [panel]: value
    });
  };

  const totalColumns = config.boxPanel + config.slotEditor + config.placesPanel + config.configPanel;
  const isValidConfig = totalColumns <= 6;

  return (
    <Card className="bg-slate-800/90 border-purple-500/30">
      <CardHeader>
        <CardTitle className="text-purple-300 flex items-center gap-2">
          <Settings className="w-5 h-5" />
          Configuración de Paneles
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 gap-3">
          {/* Box Panel Config */}
          <div className="space-y-2">
            <Label className="text-white text-sm">Panel de Cajas</Label>
            <Select 
              value={config.boxPanel.toString()} 
              onValueChange={(value) => updateConfig('boxPanel', parseInt(value))}
            >
              <SelectTrigger className="bg-slate-700 border-slate-600 text-white">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-slate-700 border-slate-600">
                {[1, 2, 3, 4, 5, 6].map(num => (
                  <SelectItem key={num} value={num.toString()} className="text-white focus:bg-slate-600">
                    {num} columna{num > 1 ? 's' : ''}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Slot Editor Config */}
          <div className="space-y-2">
            <Label className="text-white text-sm">Editor de Slots</Label>
            <Select 
              value={config.slotEditor.toString()} 
              onValueChange={(value) => updateConfig('slotEditor', parseInt(value))}
            >
              <SelectTrigger className="bg-slate-700 border-slate-600 text-white">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-slate-700 border-slate-600">
                {[1, 2, 3, 4, 5, 6].map(num => (
                  <SelectItem key={num} value={num.toString()} className="text-white focus:bg-slate-600">
                    {num} columna{num > 1 ? 's' : ''}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Places Panel Config */}
          <div className="space-y-2">
            <Label className="text-white text-sm">Panel de Lugares</Label>
            <Select 
              value={config.placesPanel.toString()} 
              onValueChange={(value) => updateConfig('placesPanel', parseInt(value))}
            >
              <SelectTrigger className="bg-slate-700 border-slate-600 text-white">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-slate-700 border-slate-600">
                {[1, 2, 3, 4, 5, 6].map(num => (
                  <SelectItem key={num} value={num.toString()} className="text-white focus:bg-slate-600">
                    {num} columna{num > 1 ? 's' : ''}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Config Panel Config */}
          <div className="space-y-2">
            <Label className="text-white text-sm">Panel de Configuración</Label>
            <Select 
              value={config.configPanel.toString()} 
              onValueChange={(value) => updateConfig('configPanel', parseInt(value))}
            >
              <SelectTrigger className="bg-slate-700 border-slate-600 text-white">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-slate-700 border-slate-600">
                {[1, 2, 3, 4, 5, 6].map(num => (
                  <SelectItem key={num} value={num.toString()} className="text-white focus:bg-slate-600">
                    {num} columna{num > 1 ? 's' : ''}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Total Columns Indicator */}
        <div className="mt-4 p-3 rounded-lg bg-slate-700/50 border border-purple-500/20">
          <div className="flex justify-between items-center">
            <span className="text-white text-sm">Total de columnas:</span>
            <span className={`text-sm font-medium ${isValidConfig ? 'text-green-400' : 'text-red-400'}`}>
              {totalColumns}/6
            </span>
          </div>
          {!isValidConfig && (
            <p className="text-red-400 text-xs mt-1">
              ⚠️ El total excede 6 columnas
            </p>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default PanelConfigPanel; 