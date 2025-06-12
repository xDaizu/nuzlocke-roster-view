import type { PokeballType, PokeballInfo } from '@/types/pokemon';

// Pokeball data repository
export const POKEBALL_DATA: Record<PokeballType, PokeballInfo> = {
  pokeball: {
    name: "Pokeball",
    image: "https://images.wikidexcdn.net/mwuploads/wikidex/6/6a/latest/20230115164405/Pok%C3%A9_Ball_EP.png"
  },
  superball: {
    name: "Superball", 
    image: "https://images.wikidexcdn.net/mwuploads/wikidex/3/3f/latest/20230115164421/Super_Ball_EP.png"
  },
  sanaball: {
    name: "Sana Ball",
    image: "https://images.wikidexcdn.net/mwuploads/wikidex/0/08/latest/20230115165144/Sana_Ball_EP.png"
  }
}; 