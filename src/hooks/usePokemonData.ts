import { useEffect, useState } from "react";
import { Pokemon } from "@/types/pokemon";
import { fetchPokemonData } from "@/utils/pokemonData";
import { useToast } from "@/hooks/use-toast";
import { translations } from "@/data/translations";

/** Load the full Pokémon list once on mount, exposing loading state. */
export function usePokemonData() {
  const [allPokemon, setAllPokemon] = useState<Pokemon[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    const initializeData = async () => {
      setIsLoading(true);
      try {
        const pokemonData = await fetchPokemonData();
        setAllPokemon(pokemonData);
      } catch (error) {
        toast({
          title: translations.messages.error,
          description: translations.messages.pokemonDataError,
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    initializeData();
  }, [toast]);

  return { allPokemon, isLoading };
}
