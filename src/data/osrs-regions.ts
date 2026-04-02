export interface OsrsRegion {
  id: string;
  name: string;
  description: string;
  subAreas: string[];
}

export const osrsRegions: OsrsRegion[] = [
  {
    id: "misthalin",
    name: "Misthalin",
    description: "The central kingdom, home to Lumbridge, Varrock, and the Grand Exchange.",
    subAreas: ["Lumbridge", "Varrock", "Draynor Village", "Edgeville", "Barbarian Village"],
  },
  {
    id: "karamja",
    name: "Karamja",
    description: "A tropical island with jungles, volcanoes, and the TzHaar city.",
    subAreas: ["Brimhaven", "Tai Bwo Wannai", "Shilo Village", "TzHaar City", "Musa Point"],
  },
  {
    id: "asgarnia",
    name: "Asgarnia",
    description: "Home to Falador, the Dwarven Mine, and the Ice Mountain.",
    subAreas: ["Falador", "Port Sarim", "Rimmington", "Taverley", "Burthorpe", "Dwarven Mine"],
  },
  {
    id: "kandarin",
    name: "Kandarin",
    description: "A vast kingdom including Camelot, Ardougne, and the Ranging Guild.",
    subAreas: ["Ardougne", "Camelot", "Catherby", "Seers Village", "Yanille", "Ranging Guild"],
  },
  {
    id: "fremennik",
    name: "Fremennik Province",
    description: "The frozen north, home to the Fremennik people and Neitiznot.",
    subAreas: ["Rellekka", "Neitiznot", "Jatizso", "Waterbirth Island", "Lunar Isle"],
  },
  {
    id: "morytania",
    name: "Morytania",
    description: "A dark swamp region ruled by vampyres, home to Barrows and the Slayer Tower.",
    subAreas: ["Canifis", "Port Phasmatys", "Barrows", "Slayer Tower", "Darkmeyer", "Ver Sinhaza"],
  },
  {
    id: "desert",
    name: "Kharidian Desert",
    description: "The vast desert south of Al Kharid, including Sophanem and the Kalphite Lair.",
    subAreas: ["Al Kharid", "Pollnivneach", "Sophanem", "Nardah", "Kalphite Lair"],
  },
  {
    id: "tirannwn",
    name: "Tirannwn",
    description: "The elven lands to the far west, home to Prifddinas and the Gauntlet.",
    subAreas: ["Prifddinas", "Lletya", "Iorwerth Camp", "Isafdar"],
  },
  {
    id: "wilderness",
    name: "Wilderness",
    description: "The dangerous PvP area north of Edgeville. High risk, high reward.",
    subAreas: ["Edgeville Dungeon", "Revenant Caves", "Mage Arena", "Chaos Temple", "Ferox Enclave"],
  },
  {
    id: "kebos",
    name: "Kebos Lowlands",
    description: "Home to the Farming Guild, Mount Karuulm, and Konar quo Maten.",
    subAreas: ["Farming Guild", "Mount Karuulm", "Battlefront"],
  },
  {
    id: "kourend",
    name: "Great Kourend",
    description: "A massive continent with five houses: Arceuus, Hosidius, Lovakengj, Piscarilius, and Shayzien.",
    subAreas: ["Arceuus", "Hosidius", "Lovakengj", "Piscarilius", "Shayzien"],
  },
  {
    id: "fossil-island",
    name: "Fossil Island",
    description: "An island for skilling, fossils, and the Volcanic Mine.",
    subAreas: ["Volcanic Mine", "Underwater", "Mushroom Forest"],
  },
  {
    id: "varlamore",
    name: "Varlamore",
    description: "A new southern kingdom with unique content and the Colosseum.",
    subAreas: ["Civitas Illa Fortis", "Cam Torum", "Hunter Guild", "Fortis Colosseum"],
  },
  {
    id: "zanaris",
    name: "Zanaris / Other",
    description: "Fairy realm, and various islands and dungeons not tied to a main region.",
    subAreas: ["Zanaris", "Entrana", "Crandor", "Ape Atoll"],
  },
];

export function getOsrsRegion(id: string): OsrsRegion | undefined {
  return osrsRegions.find((r) => r.id === id);
}
