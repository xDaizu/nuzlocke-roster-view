import { useEffect, useState } from "react";
import { TeamPokemon } from "@/types/pokemon";

/**
 * Cycles through `items`, advancing to the next one every `intervalSeconds`.
 * intervalSeconds <= 0 disables cycling; values between 0 and 1 are clamped to 1
 * so the display can't be forced to re-render faster than once per second.
 */
export function useCyclingSlot(items: TeamPokemon[], intervalSeconds: number): TeamPokemon | null {
  const [index, setIndex] = useState(0);
  const effectiveInterval = intervalSeconds > 0 ? Math.max(1, intervalSeconds) : 0;

  useEffect(() => {
    setIndex(0);
  }, [items.length]);

  useEffect(() => {
    if (effectiveInterval <= 0 || items.length <= 1) return;
    const id = setInterval(() => {
      setIndex(prev => (prev + 1) % items.length);
    }, effectiveInterval * 1000);
    return () => clearInterval(id);
  }, [effectiveInterval, items.length]);

  if (items.length === 0) return null;
  return items[index % items.length];
}
