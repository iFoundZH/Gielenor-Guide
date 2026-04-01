import type { AchievementDiaryArea } from "@/types/guides";

export const desertDiary: AchievementDiaryArea = {
  id: "desert",
  name: "Desert",
  wikiUrl: "https://oldschool.runescape.wiki/w/Desert_Diary",
  tiers: [
    {
      tier: "easy" as AchievementDiaryArea["tiers"][number]["tier"],
      tasks: [
        {
          id: "diary-desert-easy-1",
          description: "{| class=\"wikitable lighttable qc-active diary-table\" style=width:750px; data-diary-name=\"Desert\" data-diary-tier=\"Easy\"\n! style=\"width:50%;\" | Task\n! style=\"width:50%;\" | Requirements",
          requirements: [
          ],
        },
        {
          id: "diary-desert-easy-2",
          description: "Catch a Golden Warbler.",
          requirements: [
            { type: "skill", description: "Hunter level 5", skill: "Hunter", level: 5 },
          ],
        },
        {
          id: "diary-desert-easy-3",
          description: "Mine 5 clay in the north-eastern desert.",
          requirements: [
          ],
        },
        {
          id: "diary-desert-easy-4",
          description: "Enter the Kalphite Hive.",
          requirements: [
          ],
        },
        {
          id: "diary-desert-easy-5",
          description: "Enter the Desert with a set of Desert robes equipped.\n''Note: Not to be confused with the desert outfit, which doesn't count for this task. You also cannot use the black desert shirt or black desert robe.",
          requirements: [
          ],
        },
        {
          id: "diary-desert-easy-6",
          description: "Kill a Vulture\nNote: These are found north of Menaphos or Sophanem.",
          requirements: [
          ],
        },
        {
          id: "diary-desert-easy-7",
          description: "Have the Nardah Herbalist clean a Herb for you.",
          requirements: [
          ],
        },
        {
          id: "diary-desert-easy-8",
          description: "Collect 5 Potato Cactus from the Kalphite Hive.\nNote: You can bring a single potato cactus to the lair, then drop and pick it up five times.",
          requirements: [
          ],
        },
        {
          id: "diary-desert-easy-9",
          description: "Sell some artefacts to Simon Templeton.\nNote: The pyramid top from the nearby Agility Pyramid does not count.",
          requirements: [
          ],
        },
        {
          id: "diary-desert-easy-10",
          description: "Open the Sarcophagus in the first room of Pyramid Plunder",
          requirements: [
            { type: "skill", description: "Thieving level 21", skill: "Thieving", level: 21 },
          ],
        },
        {
          id: "diary-desert-easy-11",
          description: "Cut a desert cactus open to fill a waterskin.",
          requirements: [
          ],
        },
        {
          id: "diary-desert-easy-12",
          description: "Travel from the Shantay Pass to Pollnivneach by Magic Carpet.",
          requirements: [
          ],
        },
      ],
      rewards: [
      ],
    },
    {
      tier: "medium" as AchievementDiaryArea["tiers"][number]["tier"],
      tasks: [
        {
          id: "diary-desert-medium-1",
          description: "{| class=\"wikitable lighttable qc-active diary-table\" style=width:750px; data-diary-name=\"Desert\" data-diary-tier=\"Medium\"\n! style=\"width:50%;\" | Task\n! style=\"width:50%;\" | Requirements",
          requirements: [
          ],
        },
        {
          id: "diary-desert-medium-2",
          description: "Climb to the summit of the Agility Pyramid.",
          requirements: [
            { type: "skill", description: "Agility level 30", skill: "Agility", level: 30 },
          ],
        },
        {
          id: "diary-desert-medium-3",
          description: "Slay a desert lizard.",
          requirements: [
            { type: "skill", description: "Slayer level 22", skill: "Slayer", level: 22 },
          ],
        },
        {
          id: "diary-desert-medium-4",
          description: "Catch an Orange Salamander.",
          requirements: [
            { type: "skill", description: "Hunter level 47", skill: "Hunter", level: 47 },
          ],
        },
        {
          id: "diary-desert-medium-5",
          description: "Steal a feather from the Desert Phoenix.",
          requirements: [
            { type: "skill", description: "Thieving level 25", skill: "Thieving", level: 25 },
          ],
        },
        {
          id: "diary-desert-medium-6",
          description: "Travel to Uzer via Magic Carpet.",
          requirements: [
            { type: "quest", description: "Completion of The Golem" },
          ],
        },
        {
          id: "diary-desert-medium-7",
          description: "Travel to the Desert via Eagle.\n''Note: You'll unlock travel from the Eagles' Peak Dungeon after the required quest.",
          requirements: [
            { type: "quest", description: "Completion of Eagles' Peak" },
          ],
        },
        {
          id: "diary-desert-medium-8",
          description: "Pray at the Elidinis statuette in Nardah\nNote: Requires you to have less than full Prayer points.",
          requirements: [
            { type: "quest", description: "Completion of Spirits of the Elid" },
          ],
        },
        {
          id: "diary-desert-medium-9",
          description: "Create a combat potion in the desert.",
          requirements: [
            { type: "skill", description: "Herblore level 36", skill: "Herblore", level: 36 },
          ],
        },
        {
          id: "diary-desert-medium-10",
          description: "Teleport to Enakhra's Temple with the Camulet.",
          requirements: [
            { type: "quest", description: "Completion of Enakhra's Lament" },
          ],
        },
        {
          id: "diary-desert-medium-11",
          description: "Visit the Genie.\nNote: This task is automatically completed during Spirits of the Elid.",
          requirements: [
          ],
        },
        {
          id: "diary-desert-medium-12",
          description: "Teleport to Pollnivneach with a redirected teleport to house tablet.\nNote: Ironmen must instead enter their house via the Pollnivneach house portal.",
          requirements: [
            { type: "skill", description: "Construction level 20", skill: "Construction", level: 20 },
          ],
        },
        {
          id: "diary-desert-medium-13",
          description: "Chop some Teak Logs near Uzer.\nNote: Teak trees are found north-east of the oasis.",
          requirements: [
            { type: "skill", description: "Woodcutting level 35", skill: "Woodcutting", level: 35 },
          ],
        },
      ],
      rewards: [
      ],
    },
    {
      tier: "hard" as AchievementDiaryArea["tiers"][number]["tier"],
      tasks: [
        {
          id: "diary-desert-hard-1",
          description: "{| class=\"wikitable lighttable qc-active diary-table\" style=width:750px; data-diary-name=\"Desert\" data-diary-tier=\"Hard\"\n! style=\"width:50%;\" | Task\n! style=\"width:50%;\" | Requirements",
          requirements: [
          ],
        },
        {
          id: "diary-desert-hard-2",
          description: "Knock out and pickpocket a Menaphite Thug.",
          requirements: [
            { type: "skill", description: "Thieving level 65", skill: "Thieving", level: 65 },
          ],
        },
        {
          id: "diary-desert-hard-3",
          description: "Mine some Granite.",
          requirements: [
            { type: "skill", description: "Mining level 45", skill: "Mining", level: 45 },
          ],
        },
        {
          id: "diary-desert-hard-4",
          description: "Refill your waterskins in the Desert using Lunar magic.\n''Note: The spell must be cast outside of a desert settlement.",
          requirements: [
            { type: "skill", description: "Magic level 68", skill: "Magic", level: 68 },
            { type: "quest", description: "Completion of Dream Mentor" },
          ],
        },
        {
          id: "diary-desert-hard-5",
          description: "Kill the Kalphite Queen.",
          requirements: [
          ],
        },
        {
          id: "diary-desert-hard-6",
          description: "Complete a lap of the Pollnivneach agility course.",
          requirements: [
            { type: "skill", description: "Agility level 70", skill: "Agility", level: 70 },
          ],
        },
        {
          id: "diary-desert-hard-7",
          description: "Slay a Dust Devil in the desert cave with a Slayer helmet equipped.",
          requirements: [
            { type: "skill", description: "Slayer level 65", skill: "Slayer", level: 65 },
            { type: "skill", description: "Defence level 10", skill: "Defence", level: 10 },
            { type: "skill", description: "Crafting level 55", skill: "Crafting", level: 55 },
          ],
        },
        {
          id: "diary-desert-hard-8",
          description: "Activate Ancient Magicks at the altar in the Jaldraocht Pyramid.",
          requirements: [
            { type: "quest", description: "Completion of Desert Treasure I" },
          ],
        },
        {
          id: "diary-desert-hard-9",
          description: "Defeat a Locust Rider with Keris.\n''Note: This weapon only has to be equipped as it dies, allowing you to deal damage with other weapons.",
          requirements: [
            { type: "skill", description: "Attack level 50", skill: "Attack", level: 50 },
          ],
        },
        {
          id: "diary-desert-hard-10",
          description: "Burn some yew logs on the Nardah Mayor's balcony.\n''Note: He lives directly east of the central fountain.",
          requirements: [
            { type: "skill", description: "Firemaking level 60", skill: "Firemaking", level: 60 },
          ],
        },
        {
          id: "diary-desert-hard-11",
          description: "Create a Mithril Platebody in Nardah.\n''Note: The anvil is found in the westernmost building.",
          requirements: [
            { type: "skill", description: "Smithing level 68", skill: "Smithing", level: 68 },
          ],
        },
      ],
      rewards: [
      ],
    },
    {
      tier: "elite" as AchievementDiaryArea["tiers"][number]["tier"],
      tasks: [
        {
          id: "diary-desert-elite-1",
          description: "{| class=\"wikitable lighttable qc-active diary-table\" style=width:750px; data-diary-name=\"Desert\" data-diary-tier=\"Elite\"\n! style=\"width:50%;\" | Task\n! style=\"width:50%;\" | Requirements",
          requirements: [
          ],
        },
        {
          id: "diary-desert-elite-2",
          description: "Bake a wild pie at the Nardah Clay Oven.",
          requirements: [
            { type: "skill", description: "Cooking level 85", skill: "Cooking", level: 85 },
          ],
        },
        {
          id: "diary-desert-elite-3",
          description: "Cast Ice Barrage against a foe in the Desert\n''Note: The spell must be cast outside of a desert settlement, and must successfully hit.",
          requirements: [
            { type: "skill", description: "Magic level 94", skill: "Magic", level: 94 },
            { type: "quest", description: "Completion of Desert Treasure I" },
          ],
        },
        {
          id: "diary-desert-elite-4",
          description: "Fletch some Dragon darts at the Bedabin Camp.",
          requirements: [
            { type: "skill", description: "Fletching level 95", skill: "Fletching", level: 95 },
          ],
        },
        {
          id: "diary-desert-elite-5",
          description: "Speak to the KQ head in your POH.\nNote: The Kalphite Queen has a 1/128 chance of dropping her head on death, and is guaranteed to drop a tattered head on the 256th kill, both of which can be used to create the KQ head.",
          requirements: [
            { type: "skill", description: "Construction level 78", skill: "Construction", level: 78 },
            { type: "quest", description: "Completion of Priest in Peril" },
          ],
        },
        {
          id: "diary-desert-elite-6",
          description: "Steal from the Grand Gold Chest in the final room of Pyramid Plunder.",
          requirements: [
            { type: "skill", description: "Thieving level 91", skill: "Thieving", level: 91 },
          ],
        },
        {
          id: "diary-desert-elite-7",
          description: "Restore at least 85 Prayer points when praying at the Altar in Sophanem.",
          requirements: [
            { type: "skill", description: "Prayer level 85", skill: "Prayer", level: 85 },
          ],
        },
      ],
      rewards: [
      ],
    },
  ],
};
