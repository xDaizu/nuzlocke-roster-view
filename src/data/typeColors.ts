/** Tailwind background class for each Pokémon type badge. */
const TYPE_COLORS: Record<string, string> = {
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
  Fairy: "bg-gray-300 opacity-50", // Grayed out for Fairy type
};

export const getTypeColor = (type: string): string =>
  TYPE_COLORS[type] || "bg-gray-400";
