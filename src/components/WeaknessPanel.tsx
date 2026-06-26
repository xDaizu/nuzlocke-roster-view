import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Shield, Zap, X } from "lucide-react";
import AutocompleteInput from "@/components/AutocompleteInput";
import { getStabEffectiveness } from '@/services/stabService';
import { calculateTypeEffectiveness } from "@/services/typeEffectivenessService";
import { getTypeColor } from "@/data/typeColors";
import { Pokemon } from "@/types/pokemon";
import { Translations } from "@/data/translations";

interface WeaknessPanelProps {
  allPokemon: Pokemon[];
  translations: Translations;
}

const WeaknessPanel: React.FC<WeaknessPanelProps> = ({ allPokemon, translations }) => {
  const [selectedPokemon, setSelectedPokemon] = useState<Pokemon | null>(null);

  // Prepare autocomplete options
  const pokemonOptions = allPokemon.map(pokemon => ({
    value: pokemon.id.toString(),
    label: `#${pokemon.id.toString().padStart(3, '0')} ${pokemon.name.english}`,
    searchText: `${pokemon.id} ${pokemon.name.english} ${pokemon.name.spanish || ''}`
  }));

  const typeEffectiveness = selectedPokemon
    ? calculateTypeEffectiveness(selectedPokemon.type)
    : { veryWeak: [], weak: [], resistant: [], veryResistant: [], immune: [] };

  return (
    <Card className="bg-slate-800/50 border-purple-500/20">
      <CardHeader className="pb-3">
        <CardTitle className="text-purple-300 text-lg flex items-center gap-2">
          <Shield className="w-5 h-5" />
          {translations.panels.weaknessPanel}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Pokemon Selector */}
        <div className="space-y-2">
          <AutocompleteInput
            value={selectedPokemon?.id?.toString() || ""}
            onChange={(value) => {
              const pokemon = allPokemon.find(p => p.id.toString() === value);
              setSelectedPokemon(pokemon || null);
            }}
            options={pokemonOptions}
            placeholder={translations.weakness.selectPokemon}
            emptyMessage={translations.weakness.emptyMessage}
          />
        </div>

        {selectedPokemon ? (
          <div className="space-y-4">
            {/* Pokemon Info */}
            <div className="flex items-center justify-center gap-3">
              <h3 className="text-white font-bold text-lg">{selectedPokemon.name.english}</h3>
              <div className="flex gap-2">
                {selectedPokemon.type.map((type: string) => (
                  <Badge key={type} className={`${getTypeColor(type)} text-white text-xs`}>
                    {type}
                  </Badge>
                ))}
              </div>
            </div>

            {/* Type Effectiveness */}
            <div className="space-y-3">
              {/* Very Weak (4x) */}
              {typeEffectiveness.veryWeak.length > 0 && (
                <div>
                  <h4 className="text-green-600 font-semibold text-sm mb-2 flex items-center gap-1">
                    <Zap className="w-4 h-4" />
                    {translations.weakness.veryWeak}
                  </h4>
                  <div className="flex flex-wrap gap-1">
                    {typeEffectiveness.veryWeak.map((type) => (
                      <div key={type} className="flex items-center gap-1">
                        <Badge className={`${getTypeColor(type)} text-white text-xs`}>
                          {type}
                        </Badge>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Weak (2x) */}
              {typeEffectiveness.weak.length > 0 && (
                <div>
                  <h4 className="text-green-400 font-semibold text-sm mb-2 flex items-center gap-1">
                    <Zap className="w-4 h-4" />
                    {translations.weakness.weak}
                  </h4>
                  <div className="flex flex-wrap gap-1">
                    {typeEffectiveness.weak.map((type) => (
                      <div key={type} className="flex items-center gap-1">
                        <Badge className={`${getTypeColor(type)} text-white text-xs`}>
                          {type}
                        </Badge>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Resistant (0.5x) */}
              {typeEffectiveness.resistant.length > 0 && (
                <div>
                  <h4 className="text-red-400 font-semibold text-sm mb-2 flex items-center gap-1">
                    <Shield className="w-4 h-4" />
                    {translations.weakness.resistant}
                  </h4>
                  <div className="flex flex-wrap gap-1">
                    {typeEffectiveness.resistant.map((type) => (
                      <div key={type} className="flex items-center gap-1">
                        <Badge className={`${getTypeColor(type)} text-white text-xs`}>
                          {type}
                        </Badge>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Very Resistant (0.25x) */}
              {typeEffectiveness.veryResistant.length > 0 && (
                <div>
                  <h4 className="text-red-600 font-semibold text-sm mb-2 flex items-center gap-1">
                    <Shield className="w-4 h-4" />
                    {translations.weakness.veryResistant}
                  </h4>
                  <div className="flex flex-wrap gap-1">
                    {typeEffectiveness.veryResistant.map((type) => (
                      <div key={type} className="flex items-center gap-1">
                        <Badge className={`${getTypeColor(type)} text-white text-xs`}>
                          {type}
                        </Badge>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Immune (0x) */}
              {typeEffectiveness.immune.length > 0 && (
                <div>
                  <h4 className="text-purple-400 font-semibold text-sm mb-2 flex items-center gap-1">
                    <X className="w-4 h-4" />
                    {translations.weakness.immune}
                  </h4>
                  <div className="flex flex-wrap gap-1">
                    {typeEffectiveness.immune.map((type) => (
                      <div key={type} className="flex items-center gap-1">
                        <Badge className={`${getTypeColor(type)} text-white text-xs`}>
                          {type}
                        </Badge>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* STAB Section */}
            <div className="space-y-3 mt-6">
              <h4 className="text-purple-400 font-semibold text-sm mb-2 flex items-center gap-1">
                {translations.weakness.stabTitle}
              </h4>
              {(() => {
                const stab = getStabEffectiveness(selectedPokemon.type);
                return (
                  <>
                    {/* 2x */}
                    {stab.weak.length > 0 && (
                      <div>
                        <span className="font-semibold text-red-400 text-xs">{translations.weakness.stabWeak}</span>{' '}
                        <span className="flex flex-wrap gap-1">
                          {stab.weak.map((type) => (
                            <Badge key={type} className={`${getTypeColor(type)} text-white text-xs`}>
                              {type}
                            </Badge>
                          ))}
                        </span>
                      </div>
                    )}
                    {/* 0.5x */}
                    {stab.resistant.length > 0 && (
                      <div>
                        <span className="font-semibold text-green-600 text-xs">{translations.weakness.stabResistant}</span>{' '}
                        <span className="flex flex-wrap gap-1">
                          {stab.resistant.map((type) => (
                            <Badge key={type} className={`${getTypeColor(type)} text-white text-xs`}>
                              {type}
                            </Badge>
                          ))}
                        </span>
                      </div>
                    )}
                    {/* 0x */}
                    {stab.immune.length > 0 && (
                      <div>
                        <span className="font-semibold text-green-400 text-xs">{translations.weakness.stabImmune}</span>{' '}
                        <span className="flex flex-wrap gap-1">
                          {stab.immune.map((type) => (
                            <Badge key={type} className={`${getTypeColor(type)} text-white text-xs`}>
                              {type}
                            </Badge>
                          ))}
                        </span>
                      </div>
                    )}
                  </>
                );
              })()}
            </div>
          </div>
        ) : (
          <div className="text-center text-slate-400 py-8">
            <Shield className="w-12 h-12 mx-auto mb-2 opacity-50" />
            <p className="text-sm">{translations.weakness.emptyState}</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default WeaknessPanel; 