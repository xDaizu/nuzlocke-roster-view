import React, { useState, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Shield, Zap, X } from "lucide-react";
import typesData from "@/data/types.json";
import AutocompleteInput from "@/components/AutocompleteInput";

interface WeaknessPanelProps {
  allPokemon: any[];
  translations: any;
}

interface TypeEffectiveness {
  veryWeak: string[];      // 4x damage
  weak: string[];          // 2x damage
  resistant: string[];     // 0.5x damage
  veryResistant: string[]; // 0.25x damage
  immune: string[];        // 0x damage
}

const WeaknessPanel: React.FC<WeaknessPanelProps> = ({ allPokemon, translations }) => {
  const [selectedPokemon, setSelectedPokemon] = useState<any>(null);

  // Prepare autocomplete options
  const pokemonOptions = allPokemon.map(pokemon => ({
    value: pokemon.id.toString(),
    label: `#${pokemon.id.toString().padStart(3, '0')} ${pokemon.name.english}`,
    searchText: `${pokemon.id} ${pokemon.name.english} ${pokemon.name.spanish || ''}`
  }));

  // Calculate type effectiveness for single or dual type Pokemon
  const calculateTypeEffectiveness = (types: string[]): TypeEffectiveness => {
    if (!types || types.length === 0) {
      return { veryWeak: [], weak: [], resistant: [], veryResistant: [], immune: [] };
    }

    // Handle Fairy type: filter it out for dual types, or replace with Normal for pure Fairy
    let filteredTypes = types.filter(type => type !== "Fairy");
    
    // If Pokemon only has Fairy type, treat it as Normal type for calculations
    if (filteredTypes.length === 0 && types.includes("Fairy")) {
      filteredTypes = ["Normal"];
    }
    
    if (filteredTypes.length === 0) {
      return { veryWeak: [], weak: [], resistant: [], veryResistant: [], immune: [] };
    }

    const allTypes = Object.keys(typesData);
    const effectiveness: { [key: string]: number } = {};

    // Initialize all types with 1x effectiveness
    allTypes.forEach(type => {
      effectiveness[type] = 1.0;
    });

    // Apply effectiveness for each of the Pokemon's types (excluding Fairy)
    filteredTypes.forEach(pokemonType => {
      const typeData = (typesData as any)[pokemonType];
      if (typeData) {
        // Apply weaknesses (2x damage)
        typeData.weak_to?.forEach((attackType: string) => {
          effectiveness[attackType] *= 2.0;
        });

        // Apply resistances (0.5x damage)
        typeData.resistant_to?.forEach((attackType: string) => {
          effectiveness[attackType] *= 0.5;
        });

        // Apply immunities (0x damage)
        typeData.immune_to?.forEach((attackType: string) => {
          effectiveness[attackType] = 0;
        });
      }
    });

    // Categorize the results into 5 categories
    const veryWeak: string[] = [];      // 4x damage
    const weak: string[] = [];          // 2x damage
    const resistant: string[] = [];     // 0.5x damage
    const veryResistant: string[] = []; // 0.25x damage
    const immune: string[] = [];        // 0x damage

    Object.entries(effectiveness).forEach(([type, multiplier]) => {
      if (multiplier === 0) {
        immune.push(type);
      } else if (multiplier === 4) {
        veryWeak.push(type);
      } else if (multiplier === 2) {
        weak.push(type);
      } else if (multiplier === 0.5) {
        resistant.push(type);
      } else if (multiplier === 0.25) {
        veryResistant.push(type);
      }
    });

    return { veryWeak, weak, resistant, veryResistant, immune };
  };

  const typeEffectiveness = selectedPokemon 
    ? calculateTypeEffectiveness(selectedPokemon.type) 
    : { veryWeak: [], weak: [], resistant: [], veryResistant: [], immune: [] };

  const getTypeColor = (type: string) => {
    const colors: { [key: string]: string } = {
      Normal: "bg-gray-400",
      Fire: "bg-red-500",
      Water: "bg-blue-500",
      Electric: "bg-yellow-400",
      Grass: "bg-green-500",
      Ice: "bg-cyan-300",
      Fighting: "bg-red-700",
      Poison: "bg-purple-500",
      Ground: "bg-yellow-600",
      Flying: "bg-indigo-400",
      Psychic: "bg-pink-500",
      Bug: "bg-green-400",
      Rock: "bg-yellow-800",
      Ghost: "bg-purple-600",
      Dragon: "bg-indigo-700",
      Dark: "bg-gray-800",
      Steel: "bg-gray-500",
      Fairy: "bg-gray-300 opacity-50" // Grayed out for Fairy type
    };
    return colors[type] || "bg-gray-400";
  };

  const getMultiplierText = (multiplier: number) => {
    if (multiplier === 4) return "4x";
    if (multiplier === 2) return "2x";
    if (multiplier === 0.5) return "½x";
    if (multiplier === 0.25) return "¼x";
    return `${multiplier}x`;
  };

  return (
    <Card className="bg-slate-800/50 border-purple-500/20">
      <CardHeader className="pb-3">
        <CardTitle className="text-purple-300 text-lg flex items-center gap-2">
          <Shield className="w-5 h-5" />
          Análisis de Tipos
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
            placeholder="Seleccionar Pokémon"
            emptyMessage="No Pokémon found"
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
                  <h4 className="text-red-600 font-semibold text-sm mb-2 flex items-center gap-1">
                    <Zap className="w-4 h-4" />
                    Muy Débil (4x)
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
                  <h4 className="text-red-400 font-semibold text-sm mb-2 flex items-center gap-1">
                    <Zap className="w-4 h-4" />
                    Débil (2x)
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
                  <h4 className="text-green-400 font-semibold text-sm mb-2 flex items-center gap-1">
                    <Shield className="w-4 h-4" />
                    Resistente (0.5x)
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
                  <h4 className="text-green-600 font-semibold text-sm mb-2 flex items-center gap-1">
                    <Shield className="w-4 h-4" />
                    Muy Resistente (0.25x)
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
                    Inmune
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
          </div>
        ) : (
          <div className="text-center text-slate-400 py-8">
            <Shield className="w-12 h-12 mx-auto mb-2 opacity-50" />
            <p className="text-sm">Selecciona un Pokémon para ver su análisis de tipos</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default WeaknessPanel; 