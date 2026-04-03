import type { SkillTrainingGuide } from "@/types/guides";

export const runecraftP2pGuide: SkillTrainingGuide = {
  skill: "Runecraft" as SkillTrainingGuide["skill"],
  variant: "p2p",
  wikiUrl: "https://oldschool.runescape.wiki/w/Pay-to-play_Runecraft_training",
  methods: [
    {
      name: "/34: Questing",
      levelRange: [1, 32],
      xpPerHour: null,
      description:
        "Early levels can be skipped by completing quests that give Runecraft experience. Completing Enter the Abyss miniquest, The Ascent of Arceuus, The Eyes of Glouphrie, Temple of the Eye and The Slug M...",
      members: true,
    },
    {
      name: "Making talisman tiaras",
      levelRange: [1, 50],
      xpPerHour: null,
      description:
        "Combining talisman items with tiaras at the corresponding runecrafting altar creates tiara variants. Each tiara gives experience equal to the talisman's altar, providing a way to train without needing pure essence. Useful for early levels before faster methods become available.",
      members: true,
    },
    {
      name: "Lava runes",
      levelRange: [23, 99],
      xpPerHour: null,
      description:
        "Crafting lava runes at the Fire Altar using earth runes and pure essence is the fastest Runecraft training method. Requires a binding necklace for 100% success rate and Magic Imbue (level 82 Magic) to eliminate the need for a talisman. Very click-intensive but offers the highest experience rates.",
      members: true,
    },
    {
      name: "Guardians of the Rift",
      levelRange: [27, 99],
      xpPerHour: null,
      description:
        "Guardians of the Rift is a Runecraft minigame in the Temple of the Eye that provides competitive experience with less intensity than lava runes. Players mine guardian essence, craft runes, and power the Great Guardian. Rewards include the Raiments of the Eye outfit for bonus runes.",
      members: true,
    },
    {
      name: "Ourania Altar",
      levelRange: [1, 99],
      xpPerHour: null,
      description:
        "Crafting runes at the Ourania Altar (also known as the ZMI Altar) is a profitable lower-effort alternative to lava runes. The altar can be accessed at any Runecraft level. Unlike the other runic al...",
      members: true,
    },
    {
      name: "Blood runes via Dark Altar",
      levelRange: [77, 99],
      xpPerHour: null,
      description:
        "At level 77, players can craft blood runes using dark essence fragments at the Blood Altar in Arceuus. Mine dense essence blocks, venerate them at the Dark Altar, then chisel into fragments and craft at the Blood Altar. This is a popular semi-AFK method with decent profit.",
      members: true,
    },
    {
      name: "Arceuus Library",
      levelRange: [1, 99],
      xpPerHour: null,
      description:
        "Helping customers in the Arceuus Library is a viable Runecraft training method that has no requirements. To do this, talk to Villia or Professor Gracklebone to have them request a book. Ask Biblia ...",
      members: true,
    },
    {
      name: "Other combination runes",
      levelRange: [6, 99],
      xpPerHour: null,
      description:
        "Besides lava runes, other combination runes (mist, dust, smoke, steam, mud) can be crafted for Runecraft experience. Each type has different profit margins and experience rates. Requires a binding necklace and the appropriate talisman or Magic Imbue spell.",
      members: true,
    },
    {
      name: "Imbuing desiccated pages",
      levelRange: [50, 99],
      xpPerHour: null,
      description:
        "Fighting the Royal Titans and forfeiting loot to receive desiccated pages can provide competitive runecraft experience rates. The pages are untradeable and stackable, and can be converted into burn...",
      members: true,
    },
    {
      name: "/91: Double cosmic runes",
      levelRange: [59, 82],
      xpPerHour: null,
      description:
        "For more information about runecrafting through the Abyss, see Abyss/Strategies. Crafting cosmic runes requires completion of the Lost City quest. Even though cosmic runes become available at level...",
      members: true,
    },
    {
      name: "Double astral runes",
      levelRange: [82, 99],
      xpPerHour: null,
      description:
        "At level 82, players craft double astral runes per essence at the Astral Altar on Lunar Isle. This method requires completion of Lunar Diplomacy. Using essence pouches and stamina potions, it provides a balance of decent experience and consistent profit.",
      members: true,
    },
    {
      name: "/99: Double nature runes",
      levelRange: [91, 95],
      xpPerHour: null,
      description:
        "For more information about runecrafting through the Abyss, see Abyss/Strategies. Even though nature runes become available at level 44, it is not recommended to craft them before level 91 due to mu...",
      members: true,
    },
    {
      name: "Double law runes",
      levelRange: [95, 99],
      xpPerHour: null,
      description:
        "For more information about runecrafting through the Abyss, see Abyss/Strategies. Crafting double law runes offers very slow experience, but it can yield good profit depending on the rune prices. Pl...",
      members: true,
    },
    {
      name: "Wrath runes",
      levelRange: [95, 99],
      xpPerHour: null,
      description:
        "At level 95, players can craft wrath runes at the Wrath Altar on the Myth's Guild island, requiring completion of Dragon Slayer II. Each essence gives 8 experience. While slow, this method is profitable as wrath runes are in high demand for Surge spells.",
      members: true,
    },
  ],
};
