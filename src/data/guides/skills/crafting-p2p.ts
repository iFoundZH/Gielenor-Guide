import type { SkillTrainingGuide } from "@/types/guides";

export const craftingP2pGuide: SkillTrainingGuide = {
  skill: "Crafting" as SkillTrainingGuide["skill"],
  variant: "p2p",
  wikiUrl: "https://oldschool.runescape.wiki/w/Pay-to-play_Crafting_training",
  methods: [
    {
      name: "Leather items",
      levelRange: [1, 20],
      xpPerHour: null,
      description: "From level 1 to 20, craft the highest-level leather item available. Leather currently costs  each and all items only require one leather to craft. In order to craft any leather items, you need a ne...",
      members: true,
    },
    {
      name: "/77/99: Cutting gems",
      levelRange: [20, 62],
      xpPerHour: null,
      description: "Cutting (uncut) gems offers the fastest experience up to level 77. However, cutting dragonstones is much more expensive compared to the lower-level gems, so it is recommended to keep cutting diamon...",
      members: true,
    },
    {
      name: "/99: Battlestaves",
      levelRange: [54, 77],
      xpPerHour: null,
      description: "Crafting battlestaves offers relatively fast experience and is usually cheaper compared to other methods. While this method is usually relatively cheap, buying the supplies requires a lot of capita...",
      members: true,
    },
    {
      name: "99: D'hide bodies",
      levelRange: [63, 77],
      xpPerHour: null,
      description: "Crafting d'hide bodies becomes the fastest viable training method from level 77 onwards. Players can begin crafting green d'hide bodies at level 63, or blue d'hide bodies at level 71 as an alternat...",
      members: true,
    },
    {
      name: "/99: Molten glass",
      levelRange: [1, 83],
      xpPerHour: null,
      description: "Blowing molten glass with a glassblowing pipe offers very slow experience rates, but it requires little attention and a low amount of capital. Most low-level items are not viable due to high cost, ...",
      members: true,
    },
    {
      name: "Crafting jewellery",
      levelRange: [5, 99],
      xpPerHour: null,
      description: "Starting at level 5, players can begin crafting gold jewellery using a gold bar and the appropriate mould at a furnace. The type of jewellery crafted depends on the mould used, with rings, necklace...",
      members: true,
    },
    {
      name: "/99: Crafting drift nets",
      levelRange: [26, 46],
      xpPerHour: 60000,
      description: "Drift nets can be crafted from 2 jute fibre each. About 1,000 can be made per hour for 60,000 experience per hour and  coins per hour when using the loom and bank chest at Fossil Island's Museum Ca...",
      members: true,
    },
    {
      name: "Casting Superglass Make",
      levelRange: [61, 99],
      xpPerHour: null,
      description: "Players who have 77 Magic (can be boosted) and have completed Lunar Diplomacy, which requires 61 Crafting along with other requirements (cannot boost from lower levels to complete), can cast Superg...",
      members: true,
    },
    {
      name: "Fixing goblin lamps in Dorgesh-Kaan",
      levelRange: [52, 99],
      xpPerHour: null,
      description: "Lamps can be fixed in Dorgesh-Kaan for both crafting and firemaking experience. This requires completion of The Lost Tribe and level 52 crafting and firemaking. Each lamp requires a light orb to fi...",
      members: true,
    },
    {
      name: "Cutting amethyst",
      levelRange: [83, 99],
      xpPerHour: null,
      description: "Cutting amethyst into ranging material with a chisel will often yield very small losses (or even profits) while also granting more experience than glassblowing, making it a viable method for those ...",
      members: true,
    },
  ],
};
