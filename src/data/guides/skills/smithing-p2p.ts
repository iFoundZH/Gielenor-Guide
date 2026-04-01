import type { SkillTrainingGuide } from "@/types/guides";

export const smithingP2pGuide: SkillTrainingGuide = {
  skill: "Smithing" as SkillTrainingGuide["skill"],
  variant: "p2p",
  wikiUrl: "https://oldschool.runescape.wiki/w/Pay-to-play_Smithing_training",
  methods: [
    {
      name: "Questing",
      levelRange: [1, 39],
      xpPerHour: null,
      description: "Early levels can be skipped by completing quests that give Smithing experience. Completing The Knight's Sword, Sleeping Giants, Elemental Workshop I and II, The Giant Dwarf, Heroes' Quest, and Free...",
      members: true,
    },
    {
      name: "Anvil smithing",
      levelRange: [1, 40],
      xpPerHour: null,
      description: "From level 1 to 40, smith various items at the anvil just south of the west Varrock bank. Make the highest-level item available for the fastest experience rates. Higher-levelled items require more ...",
      members: true,
    },
    {
      name: "lock the inventory slots where your goldsmith gauntlets or ice gloves are",
      levelRange: [40, 99],
      xpPerHour: null,
      description: "lock the inventory slots where your goldsmith gauntlets or ice gloves are.",
      members: true,
    },
    {
      name: "clear the placeholders for goldsmith gauntlets and ice gloves, and fill the b...",
      levelRange: [40, 99],
      xpPerHour: null,
      description: "clear the placeholders for goldsmith gauntlets and ice gloves, and fill the bank with bank fillers. This way, the player can quickly deposit the bars without depositing any necessary items.",
      members: true,
    },
    {
      name: "Giants' Foundry",
      levelRange: [15, 99],
      xpPerHour: null,
      description: "",
      members: true,
    },
    {
      name: "Blast Furnace",
      levelRange: [15, 99],
      xpPerHour: null,
      description: "Smelting bars (other than gold or silver) at the Blast Furnace offers slow experience, but it usually provides decent profit. Having the ice gloves and coal bag is strongly recommended to significa...",
      members: true,
    },
    {
      name: "Smithing dart tips and nails",
      levelRange: [20, 99],
      xpPerHour: null,
      description: "Smithing dart tips and nails offers slow experience, but it requires little attention. This method usually breaks even or makes a small profit due to their high demand. The player must have complet...",
      members: true,
    },
    {
      name: "Smithing steel cannonballs",
      levelRange: [35, 99],
      xpPerHour: null,
      description: "Smithing steel cannonballs offers even slower experience than dart tips, but requires even less attention, and usually makes a profit. 4 cannonballs are created per steel bar; a double ammo mould s...",
      members: true,
    },
    {
      name: "Smithing armour",
      levelRange: [48, 99],
      xpPerHour: null,
      description: "Smithing armour at an anvil is only recommended for account builds that cannot get goldsmith gauntlets. Depending on the Grand Exchange prices, adamant platebodies can be a viable alternative to sm...",
      members: true,
    },
    {
      name: "99+: Smithing 3-bar rune items",
      levelRange: [95, 98],
      xpPerHour: null,
      description: "Smithing rune platelegs, plateskirts, or 2h swords at an anvil offers decent experience, and it is also profitable. Players will need to have level 99 to be able to make these items, but Kovac's gr...",
      members: true,
    },
  ],
};
