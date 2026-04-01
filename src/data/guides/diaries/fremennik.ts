import type { AchievementDiaryArea } from "@/types/guides";

export const fremennikDiary: AchievementDiaryArea = {
  id: "fremennik",
  name: "Fremennik",
  wikiUrl: "https://oldschool.runescape.wiki/w/Fremennik_Diary",
  tiers: [
    {
      tier: "easy" as AchievementDiaryArea["tiers"][number]["tier"],
      tasks: [
        {
          id: "diary-fremennik-easy-1",
          description: "{| class=\"wikitable lighttable qc-active diary-table\" style=width:750px; data-diary-name=\"Fremennik\" data-diary-tier=\"Easy\"\n! style=\"width:50%;\" | Task\n! style=\"width:50%;\" | Requirements",
          requirements: [
          ],
        },
        {
          id: "diary-fremennik-easy-2",
          description: "Catch a Cerulean twitch.\n''Note: These birds are found in the Rellekka Hunter area. While you're here, with a high enough Hunter level you can also complete a medium and a hard task by catching a Snowy knight and Sabre-toothed kyatt, respectively.",
          requirements: [
            { type: "skill", description: "Hunter level 11", skill: "Hunter", level: 11 },
          ],
        },
        {
          id: "diary-fremennik-easy-3",
          description: "Change your boots at Yrsa's Shoe Store.\n''Note: Her shoe store has been removed in an update. You'll now have to talk to her for a makeover for 500 coins. Alternatively, you can freely browse her regular clothing store for the task to count as completed.",
          requirements: [
            { type: "quest", description: "Completion of The Fremennik Trials" },
          ],
        },
        {
          id: "diary-fremennik-easy-4",
          description: "Kill 5 Rock crabs.\n''Note: The giant rock crabs and rock lobsters on Waterbirth Island do not count.",
          requirements: [
          ],
        },
        {
          id: "diary-fremennik-easy-5",
          description: "Craft a tiara from scratch in Rellekka.\nNote: You have to mine silver ore from the Rellekka mine, then use it on the furnace in the city's westernmost building. Completing or updating any other task in-between these steps will reset the progress for this task.",
          requirements: [
            { type: "skill", description: "Crafting level 23", skill: "Crafting", level: 23 },
            { type: "skill", description: "Mining level 20", skill: "Mining", level: 20 },
            { type: "skill", description: "Smithing level 20", skill: "Smithing", level: 20 },
            { type: "quest", description: "Completion of The Fremennik Trials" },
          ],
        },
        {
          id: "diary-fremennik-easy-6",
          description: "Browse the Stonemasons shop.\n''Note: He is located in western Keldagrim. Right-click him to trade.",
          requirements: [
          ],
        },
        {
          id: "diary-fremennik-easy-7",
          description: "Collect 5 Snape grass on Waterbirth Island.\nNote: You can drop and pick up the same snape grass five times.",
          requirements: [
          ],
        },
        {
          id: "diary-fremennik-easy-8",
          description: "Steal from the Keldagrim crafting or baker's stall.\n''Note: These are located on the eastern side of the Keldagrim Palace.",
          requirements: [
            { type: "skill", description: "Thieving level 5", skill: "Thieving", level: 5 },
          ],
        },
        {
          id: "diary-fremennik-easy-9",
          description: "Fill a bucket with water at the Rellekka well.\n''Note: There's a bucket of milk north of the well that can be emptied and filled with water.",
          requirements: [
          ],
        },
        {
          id: "diary-fremennik-easy-10",
          description: "Enter the Troll Stronghold.",
          requirements: [
          ],
        },
        {
          id: "diary-fremennik-easy-11",
          description: "Chop and burn some oak logs in the Fremennik Province.\n''Note: Oak trees can be found near the Rellekka house portal.",
          requirements: [
            { type: "skill", description: "Woodcutting level 15", skill: "Woodcutting", level: 15 },
            { type: "skill", description: "Firemaking level 15", skill: "Firemaking", level: 15 },
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
          id: "diary-fremennik-medium-1",
          description: "{| class=\"wikitable lighttable qc-active diary-table\" style=width:750px; data-diary-name=\"Fremennik\" data-diary-tier=\"Medium\"\n! style=\"width:50%;\" | Task\n! style=\"width:50%;\" | Requirements",
          requirements: [
          ],
        },
        {
          id: "diary-fremennik-medium-2",
          description: "Slay a Brine rat.",
          requirements: [
            { type: "skill", description: "Slayer level 47", skill: "Slayer", level: 47 },
          ],
        },
        {
          id: "diary-fremennik-medium-3",
          description: "Travel to the Snowy Hunter Area via Eagle.\n''Note: You'll unlock travel from the Eagles' Peak Dungeon after the required quest.",
          requirements: [
            { type: "quest", description: "Completion of Eagles' Peak" },
          ],
        },
        {
          id: "diary-fremennik-medium-4",
          description: "Mine some coal in Rellekka.",
          requirements: [
            { type: "skill", description: "Mining level 30", skill: "Mining", level: 30 },
            { type: "quest", description: "Completion of The Fremennik Trials" },
          ],
        },
        {
          id: "diary-fremennik-medium-5",
          description: "Steal from the Rellekka Fish stalls.",
          requirements: [
            { type: "skill", description: "Thieving level 42", skill: "Thieving", level: 42 },
            { type: "quest", description: "Completion of The Fremennik Trials" },
          ],
        },
        {
          id: "diary-fremennik-medium-6",
          description: "Travel to Miscellania by Fairy ring.",
          requirements: [
            { type: "quest", description: "Completion of The Fremennik Trials" },
          ],
        },
        {
          id: "diary-fremennik-medium-7",
          description: "Catch a Snowy knight.",
          requirements: [
            { type: "skill", description: "Hunter level 45", skill: "Hunter", level: 45 },
            { type: "skill", description: "Hunter level 35", skill: "Hunter", level: 35 },
          ],
        },
        {
          id: "diary-fremennik-medium-8",
          description: "Pick up your Pet Rock from your POH Menagerie.\n''Note: You need to use your pet rock on a pet house, then retrieve it off the ground. You cannot be in building mode.",
          requirements: [
            { type: "skill", description: "Construction level 37", skill: "Construction", level: 37 },
          ],
        },
        {
          id: "diary-fremennik-medium-9",
          description: "Visit the Lighthouse from Waterbirth island.\n''Note: You must exit the Waterbirth Island Dungeon on the 5th sublevel.",
          requirements: [
            { type: "skill", description: "Prayer level 43", skill: "Prayer", level: 43 },
            { type: "skill", description: "Agility level 85", skill: "Agility", level: 85 },
            { type: "quest", description: "Completion of Horror from the Deep" },
          ],
        },
        {
          id: "diary-fremennik-medium-10",
          description: "Mine some gold at the Arzinian mine.\n''Note: This task is automatically completed during Between a Rock....",
          requirements: [
            { type: "skill", description: "Mining level 40", skill: "Mining", level: 40 },
            { type: "skill", description: "Defence level 30", skill: "Defence", level: 30 },
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
          id: "diary-fremennik-hard-1",
          description: "{| class=\"wikitable lighttable qc-active diary-table\" style=width:750px; data-diary-name=\"Fremennik\" data-diary-tier=\"Hard\"\n! style=\"width:50%;\" | Task\n! style=\"width:50%;\" | Requirements",
          requirements: [
          ],
        },
        {
          id: "diary-fremennik-hard-2",
          description: "Teleport to Trollheim.",
          requirements: [
            { type: "skill", description: "Magic level 61", skill: "Magic", level: 61 },
            { type: "quest", description: "Completion of Eadgar's Ruse" },
          ],
        },
        {
          id: "diary-fremennik-hard-3",
          description: "Catch a Sabre-toothed Kyatt.",
          requirements: [
            { type: "skill", description: "Hunter level 55", skill: "Hunter", level: 55 },
          ],
        },
        {
          id: "diary-fremennik-hard-4",
          description: "Mix a super defence potion in the Fremennik Province.\n''Note: This has to be done in or near Rellekka.",
          requirements: [
            { type: "skill", description: "Herblore level 66", skill: "Herblore", level: 66 },
          ],
        },
        {
          id: "diary-fremennik-hard-5",
          description: "Steal from the Keldagrim Gem Stall.",
          requirements: [
            { type: "skill", description: "Thieving level 75", skill: "Thieving", level: 75 },
          ],
        },
        {
          id: "diary-fremennik-hard-6",
          description: "Craft a Neitiznot shield on Neitiznot.",
          requirements: [
            { type: "skill", description: "Woodcutting level 56", skill: "Woodcutting", level: 56 },
          ],
        },
        {
          id: "diary-fremennik-hard-7",
          description: "Mine 5 Adamantite ores on Jatizso.",
          requirements: [
            { type: "skill", description: "Mining level 70", skill: "Mining", level: 70 },
          ],
        },
        {
          id: "diary-fremennik-hard-8",
          description: "Obtain 100% support from your kingdom subjects.",
          requirements: [
          ],
        },
        {
          id: "diary-fremennik-hard-9",
          description: "Teleport to Waterbirth Island.",
          requirements: [
            { type: "skill", description: "Magic level 72", skill: "Magic", level: 72 },
            { type: "quest", description: "Completion of Lunar Diplomacy" },
          ],
        },
        {
          id: "diary-fremennik-hard-10",
          description: "Obtain the Blast Furnace Foremans permission to use the Blast Furnace for free.\n''Note: With the requirements, talk to him and use the following dialogue options . Selecting the wrong choices may require you to pay him, in which case you can hop to another world to try again.",
          requirements: [
            { type: "skill", description: "Smithing level 60", skill: "Smithing", level: 60 },
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
          id: "diary-fremennik-elite-1",
          description: "{| class=\"wikitable lighttable qc-active diary-table\" style=width:750px; data-diary-name=\"Fremennik\" data-diary-tier=\"Elite\"\n! style=\"width:50%;\" | Task\n! style=\"width:50%;\" | Requirements",
          requirements: [
          ],
        },
        {
          id: "diary-fremennik-elite-2",
          description: "Kill each of the Dagannoth Kings.\nNote: Completing or updating any other task in-between these steps will reset the progress for this task.",
          requirements: [
            { type: "skill", description: "Agility level 85", skill: "Agility", level: 85 },
          ],
        },
        {
          id: "diary-fremennik-elite-3",
          description: "Craft 56 astral runes simultaneously from Essence without the use of Extracts.",
          requirements: [
            { type: "skill", description: "Runecraft level 82", skill: "Runecraft", level: 82 },
            { type: "quest", description: "Completion of Lunar Diplomacy" },
          ],
        },
        {
          id: "diary-fremennik-elite-4",
          description: "Create a dragonstone amulet in the Neitiznot furnace.\nNote: Crafting a dragonstone amulet (u) is sufficient, you don't need a ball of wool for this task.",
          requirements: [
            { type: "skill", description: "Crafting level 80", skill: "Crafting", level: 80 },
          ],
        },
        {
          id: "diary-fremennik-elite-5",
          description: "Complete a lap of the Rellekka agility course.",
          requirements: [
            { type: "skill", description: "Agility level 80", skill: "Agility", level: 80 },
          ],
        },
        {
          id: "diary-fremennik-elite-6",
          description: "Kill the generals of Armadyl, Bandos, Saradomin and Zamorak in the God Wars Dungeon.\nNote: Having started the The Frozen Door miniquest is recommended to simultaneously unlock the key to Nex. You do not have to kill the generals' bodyguards for this task. Unlike most tasks that involve multiple steps, your progress towards this task will not reset when doing other tasks.",
          requirements: [
            { type: "skill", description: "Agility level 70", skill: "Agility", level: 70 },
            { type: "skill", description: "Strength level 70", skill: "Strength", level: 70 },
            { type: "skill", description: "Hitpoints level 70", skill: "Hitpoints", level: 70 },
            { type: "skill", description: "Ranged level 70", skill: "Ranged", level: 70 },
          ],
        },
        {
          id: "diary-fremennik-elite-7",
          description: "Slay a Spiritual mage within the Godwars Dungeon.",
          requirements: [
            { type: "skill", description: "Slayer level 83", skill: "Slayer", level: 83 },
          ],
        },
      ],
      rewards: [
      ],
    },
  ],
};
