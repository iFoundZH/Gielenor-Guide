import type { AchievementDiaryArea } from "@/types/guides";

export const morytaniaDiary: AchievementDiaryArea = {
  id: "morytania",
  name: "Morytania",
  wikiUrl: "https://oldschool.runescape.wiki/w/Morytania_Diary",
  tiers: [
    {
      tier: "easy" as AchievementDiaryArea["tiers"][number]["tier"],
      tasks: [
        {
          id: "diary-morytania-easy-1",
          description: "{| class=\"wikitable lighttable qc-active diary-table\" style=width:750px; data-diary-name=\"Morytania\" data-diary-tier=\"Easy\"\n! style=\"width:50%;\" | Task\n! style=\"width:50%;\" | Requirements",
          requirements: [
          ],
        },
        {
          id: "diary-morytania-easy-2",
          description: "Craft any Snelm from scratch in Morytania.\n''Note: Must be done outside of Mort Myre Swamp.",
          requirements: [
            { type: "skill", description: "Crafting level 15", skill: "Crafting", level: 15 },
          ],
        },
        {
          id: "diary-morytania-easy-3",
          description: "Cook a thin Snail on the Port Phasmatys range.",
          requirements: [
            { type: "skill", description: "Cooking level 12", skill: "Cooking", level: 12 },
          ],
        },
        {
          id: "diary-morytania-easy-4",
          description: "Get a slayer task from the Slayer Master in Canifis.",
          requirements: [
            { type: "skill", description: "Combat level 20", skill: "Combat", level: 20 },
          ],
        },
        {
          id: "diary-morytania-easy-5",
          description: "Kill a Banshee in the Slayer Tower.",
          requirements: [
            { type: "skill", description: "Slayer level 15", skill: "Slayer", level: 15 },
          ],
        },
        {
          id: "diary-morytania-easy-6",
          description: "Have Sbott in Canifis tan something for you.",
          requirements: [
          ],
        },
        {
          id: "diary-morytania-easy-7",
          description: "Enter Mort Myre Swamp.",
          requirements: [
          ],
        },
        {
          id: "diary-morytania-easy-8",
          description: "Kill a Ghoul.",
          requirements: [
          ],
        },
        {
          id: "diary-morytania-easy-9",
          description: "Place a Scarecrow in the Morytania flower patch.",
          requirements: [
            { type: "skill", description: "Farming level 23", skill: "Farming", level: 23 },
            { type: "skill", description: "Farming level 47", skill: "Farming", level: 47 },
          ],
        },
        {
          id: "diary-morytania-easy-10",
          description: "Offer some bonemeal at the Ectofuntus.",
          requirements: [
          ],
        },
        {
          id: "diary-morytania-easy-11",
          description: "Kill a werewolf in its human form using the Wolfbane Dagger.",
          requirements: [
          ],
        },
        {
          id: "diary-morytania-easy-12",
          description: "Restore your prayer points at the nature altar.\nNote: Requires you to have less than full Prayer points. If able, activate Piety while praying here to complete a hard task.",
          requirements: [
            { type: "quest", description: "Completion of Nature Spirit" },
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
          id: "diary-morytania-medium-1",
          description: "{| class=\"wikitable lighttable qc-active diary-table\" style=width:750px; data-diary-name=\"Morytania\" data-diary-tier=\"Medium\"\n! style=\"width:50%;\" | Task\n! style=\"width:50%;\" | Requirements",
          requirements: [
          ],
        },
        {
          id: "diary-morytania-medium-2",
          description: "Catch a swamp lizard.",
          requirements: [
            { type: "skill", description: "Hunter level 29", skill: "Hunter", level: 29 },
          ],
        },
        {
          id: "diary-morytania-medium-3",
          description: "Complete a lap of the Canifis agility course.",
          requirements: [
            { type: "skill", description: "Agility level 40", skill: "Agility", level: 40 },
          ],
        },
        {
          id: "diary-morytania-medium-4",
          description: "Obtain some Bark from a Hollow tree.",
          requirements: [
            { type: "skill", description: "Woodcutting level 45", skill: "Woodcutting", level: 45 },
          ],
        },
        {
          id: "diary-morytania-medium-5",
          description: "Travel to Dragontooth Isle.\nNote: This task is automatically completed during Ghost Ahoy.",
          requirements: [
          ],
        },
        {
          id: "diary-morytania-medium-6",
          description: "Kill a Terror Dog.",
          requirements: [
            { type: "skill", description: "Slayer level 40", skill: "Slayer", level: 40 },
            { type: "quest", description: "Completion of Lair of Tarn Razorlor" },
          ],
        },
        {
          id: "diary-morytania-medium-7",
          description: "Complete a game of trouble brewing.\nNote: You only have to complete the minigame once, winning it is optional. In Deadman Mode, the task is instead \"Speak to Honest Jimmy about Trouble Brewing.\"",
          requirements: [
            { type: "skill", description: "Cooking level 40", skill: "Cooking", level: 40 },
            { type: "quest", description: "Completion of Cabin Fever" },
          ],
        },
        {
          id: "diary-morytania-medium-8",
          description: "Board the Swampy boat at the Hollows.",
          requirements: [
          ],
        },
        {
          id: "diary-morytania-medium-9",
          description: "Make a batch of cannonballs at the Port Phasmatys furnace.",
          requirements: [
            { type: "skill", description: "Smithing level 35", skill: "Smithing", level: 35 },
            { type: "quest", description: "Completion of Dwarf Cannon" },
          ],
        },
        {
          id: "diary-morytania-medium-10",
          description: "Kill a Fever Spider on Braindeath Island.\nNote: This task is automatically completed during Rum Deal.",
          requirements: [
            { type: "skill", description: "Slayer level 42", skill: "Slayer", level: 42 },
          ],
        },
        {
          id: "diary-morytania-medium-11",
          description: "Use an ectophial to return to Port Phasmatys.",
          requirements: [
            { type: "quest", description: "Completion of Ghosts Ahoy" },
          ],
        },
        {
          id: "diary-morytania-medium-12",
          description: "Mix a Guthix Balance potion while in Morytania.",
          requirements: [
            { type: "skill", description: "Herblore level 22", skill: "Herblore", level: 22 },
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
          id: "diary-morytania-hard-1",
          description: "{| class=\"wikitable lighttable qc-active diary-table\" style=width:750px; data-diary-name=\"Morytania\" data-diary-tier=\"Hard\"\n! style=\"width:50%;\" | Task\n! style=\"width:50%;\" | Requirements",
          requirements: [
          ],
        },
        {
          id: "diary-morytania-hard-2",
          description: "Enter the Kharyrll Portal in your POH.\nNote: Teleporting to Kharyrll from a more expensive portal nexus also counts for this task. Higher-tier materials can optionally be used for the portal and centrepiece.",
          requirements: [
            { type: "skill", description: "Magic level 66", skill: "Magic", level: 66 },
            { type: "skill", description: "Construction level 50", skill: "Construction", level: 50 },
            { type: "quest", description: "Completion of Desert Treasure I" },
          ],
        },
        {
          id: "diary-morytania-hard-3",
          description: "Climb up the advanced spike chain within Slayer Tower.\nNote: This chain is located on the  near the Infernal Mages, leading to the  to near the Nechryael.",
          requirements: [
            { type: "skill", description: "Agility level 71", skill: "Agility", level: 71 },
          ],
        },
        {
          id: "diary-morytania-hard-4",
          description: "Harvest some Watermelon from the Allotment patch on Harmony Island.",
          requirements: [
            { type: "skill", description: "Farming level 47", skill: "Farming", level: 47 },
          ],
        },
        {
          id: "diary-morytania-hard-5",
          description: "Chop and burn some mahogany logs on Mos Le'Harmless.",
          requirements: [
            { type: "skill", description: "Woodcutting level 50", skill: "Woodcutting", level: 50 },
            { type: "skill", description: "Firemaking level 50", skill: "Firemaking", level: 50 },
            { type: "quest", description: "Completion of Cabin Fever" },
          ],
        },
        {
          id: "diary-morytania-hard-6",
          description: "Complete a temple trek with a hard companion.\nNote: Completion of Darkness of Hallowvale unlocks the reverse route. It's not necessary to complete any events for this task. In Deadman Mode, the task is instead \"Speak to a hard companion about completing a Temple Trek.\"",
          requirements: [
            { type: "quest", description: "Completion of In Aid of the Myreque" },
          ],
        },
        {
          id: "diary-morytania-hard-7",
          description: "Kill a Cave Horror.",
          requirements: [
            { type: "skill", description: "Slayer level 58", skill: "Slayer", level: 58 },
            { type: "quest", description: "Completion of Cabin Fever" },
          ],
        },
        {
          id: "diary-morytania-hard-8",
          description: "Harvest some Bittercap Mushrooms from the patch in Canifis.",
          requirements: [
            { type: "skill", description: "Farming level 53", skill: "Farming", level: 53 },
          ],
        },
        {
          id: "diary-morytania-hard-9",
          description: "Pray at the Altar of Nature with Piety activated.",
          requirements: [
            { type: "skill", description: "Prayer level 70", skill: "Prayer", level: 70 },
            { type: "skill", description: "Defence level 70", skill: "Defence", level: 70 },
            { type: "quest", description: "Completion of Nature Spirit" },
          ],
        },
        {
          id: "diary-morytania-hard-10",
          description: "Use the shortcut to get to the bridge over the Salve.\n''Note: You have to use the shortcut to go downwards for this task, not upwards.",
          requirements: [
            { type: "skill", description: "Agility level 65", skill: "Agility", level: 65 },
          ],
        },
        {
          id: "diary-morytania-hard-11",
          description: "Mine some Mithril ore in the Abandoned Mine.",
          requirements: [
            { type: "skill", description: "Mining level 55", skill: "Mining", level: 55 },
            { type: "quest", description: "Completion of Haunted Mine" },
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
          id: "diary-morytania-elite-1",
          description: "{| class=\"wikitable lighttable qc-active diary-table\" style=width:750px; data-diary-name=\"Morytania\" data-diary-tier=\"Elite\"\n! style=\"width:50%;\" | Task\n! style=\"width:50%;\" | Requirements",
          requirements: [
          ],
        },
        {
          id: "diary-morytania-elite-2",
          description: "Catch a shark in Burgh de Rott with your bare hands.",
          requirements: [
            { type: "skill", description: "Fishing level 96", skill: "Fishing", level: 96 },
            { type: "skill", description: "Strength level 76", skill: "Strength", level: 76 },
            { type: "quest", description: "Completion of In Aid of the Myreque" },
          ],
        },
        {
          id: "diary-morytania-elite-3",
          description: "Cremate any Shade remains on a Magic or Redwood pyre.",
          requirements: [
            { type: "skill", description: "Firemaking level 80", skill: "Firemaking", level: 80 },
            { type: "quest", description: "Completion of Shades of Mort'ton" },
          ],
        },
        {
          id: "diary-morytania-elite-4",
          description: "Fertilize the Morytania herb patch using Lunar Magic.\nNote: This herb patch is located west of Port Phasmatys.",
          requirements: [
            { type: "skill", description: "Magic level 83", skill: "Magic", level: 83 },
            { type: "quest", description: "Completion of Lunar Diplomacy" },
          ],
        },
        {
          id: "diary-morytania-elite-5",
          description: "Craft a Black dragonhide body in Canifis bank.",
          requirements: [
            { type: "skill", description: "Crafting level 84", skill: "Crafting", level: 84 },
          ],
        },
        {
          id: "diary-morytania-elite-6",
          description: "Kill an Abyssal demon in the Slayer Tower.\nNote: Abyssal demons on the  do not require a Slayer task to kill like those in the basement.",
          requirements: [
            { type: "skill", description: "Slayer level 85", skill: "Slayer", level: 85 },
          ],
        },
        {
          id: "diary-morytania-elite-7",
          description: "Loot the Barrows chest while wearing any complete barrows set.\n''Note: This includes the weapon that is part of the equipped set.",
          requirements: [
            { type: "skill", description: "Defence level 70", skill: "Defence", level: 70 },
            { type: "skill", description: "Attack level 70", skill: "Attack", level: 70 },
            { type: "skill", description: "Magic level 70", skill: "Magic", level: 70 },
            { type: "skill", description: "Attack level 70", skill: "Attack", level: 70 },
            { type: "skill", description: "Strength level 70", skill: "Strength", level: 70 },
            { type: "skill", description: "Attack level 70", skill: "Attack", level: 70 },
            { type: "skill", description: "Ranged level 70", skill: "Ranged", level: 70 },
          ],
        },
      ],
      rewards: [
      ],
    },
  ],
};
