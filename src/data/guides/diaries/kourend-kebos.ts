import type { AchievementDiaryArea } from "@/types/guides";

export const kourend_kebosDiary: AchievementDiaryArea = {
  id: "kourend-kebos",
  name: "Kourend & Kebos",
  wikiUrl: "https://oldschool.runescape.wiki/w/Kourend_&_Kebos_Diary",
  tiers: [
    {
      tier: "easy" as AchievementDiaryArea["tiers"][number]["tier"],
      tasks: [
        {
          id: "diary-kourend-kebos-easy-1",
          description: "Mine some Iron at the Mount Karuulm mine.",
          requirements: [
            { type: "skill", description: "Mining level 15", skill: "Mining", level: 15 },
          ],
        },
        {
          id: "diary-kourend-kebos-easy-2",
          description: "Kill a Sandcrab.",
          requirements: [
          ],
        },
        {
          id: "diary-kourend-kebos-easy-3",
          description: "Hand in a book at the Arceuus Library.",
          requirements: [
          ],
        },
        {
          id: "diary-kourend-kebos-easy-4",
          description: "Steal from a Hosidius Food Stall.",
          requirements: [
            { type: "skill", description: "Thieving level 25", skill: "Thieving", level: 25 },
          ],
        },
        {
          id: "diary-kourend-kebos-easy-5",
          description: "Browse the Warrens General Store.",
          requirements: [
          ],
        },
        {
          id: "diary-kourend-kebos-easy-6",
          description: "Take a boat to Land's End.\nNote: You have to travel with Veos from Port Sarim or Port Piscarilius.",
          requirements: [
          ],
        },
        {
          id: "diary-kourend-kebos-easy-7",
          description: "Pray at the Altar in Kourend Castle\n''Note: This altar is found on the top floor of the castle.",
          requirements: [
          ],
        },
        {
          id: "diary-kourend-kebos-easy-8",
          description: "Dig up some Saltpetre.",
          requirements: [
          ],
        },
        {
          id: "diary-kourend-kebos-easy-9",
          description: "Enter your Player Owned House from Hosidius.",
          requirements: [
            { type: "skill", description: "Construction level 25", skill: "Construction", level: 25 },
          ],
        },
        {
          id: "diary-kourend-kebos-easy-10",
          description: "Do a lap of either tier of the Shayzien Agility Course.",
          requirements: [
          ],
        },
        {
          id: "diary-kourend-kebos-easy-11",
          description: "Create a Strength potion in the Lovakengj Pub.",
          requirements: [
            { type: "skill", description: "Herblore level 12", skill: "Herblore", level: 12 },
            { type: "quest", description: "Completion of Druidic Ritual" },
          ],
        },
        {
          id: "diary-kourend-kebos-easy-12",
          description: "Fish a Trout from the River Molch.\n''Note: The fishing spot is found south-east of the Farming Guild.",
          requirements: [
            { type: "skill", description: "Fishing level 20", skill: "Fishing", level: 20 },
          ],
        },
        {
          id: "diary-kourend-kebos-easy-13",
          description: "}\n\n===Rewards===\n*Rada's blessing 1:\n**Three daily teleports to the Kourend Woodland\n**2% chance to catch two fish at once anywhere when equipped, excluding at Tempoross' Cove (no additional experience granted)\n*Antique lamp worth 2,500 experience in any skill of at least level 30\n*Entrance fee for the Crabclaw Isle lowered to 5,000 coins, down from 10,000 coins\n*Doubled chance at receiving a Xeric's talisman from lizardmen, lizardman brutes, and lizardman shamans (1/125, up from 1/250)\n*20% discount on Eodan's tanning services \n*Access to the cooking ranges in the Hosidius Kitchen, which have an additive 5% increased success rate over other ranges\n*The farming patches in Hosidius, south of the church, will never get diseased",
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
          id: "diary-kourend-kebos-medium-1",
          description: "Travel to the Fairy Ring south of Mount Karuulm.",
          requirements: [
          ],
        },
        {
          id: "diary-kourend-kebos-medium-2",
          description: "Kill a Lizardman.",
          requirements: [
          ],
        },
        {
          id: "diary-kourend-kebos-medium-3",
          description: "Use Kharedst's memoirs to teleport to all five cities in Great Kourend.",
          requirements: [
            { type: "quest", description: "Completion of The Depths of Despair" },
          ],
        },
        {
          id: "diary-kourend-kebos-medium-4",
          description: "Mine some Volcanic Sulphur.",
          requirements: [
            { type: "skill", description: "Mining level 42", skill: "Mining", level: 42 },
          ],
        },
        {
          id: "diary-kourend-kebos-medium-5",
          description: "Enter the Farming Guild.\nNote: You have to walk through the guild's main entrance.",
          requirements: [
            { type: "skill", description: "Farming level 45", skill: "Farming", level: 45 },
          ],
        },
        {
          id: "diary-kourend-kebos-medium-6",
          description: "Switch to the Necromancy Spellbook at Tyss.",
          requirements: [
          ],
        },
        {
          id: "diary-kourend-kebos-medium-7",
          description: "Repair a Piscarilius crane.",
          requirements: [
            { type: "skill", description: "Crafting level 30", skill: "Crafting", level: 30 },
            { type: "skill", description: "Construction level 30", skill: "Construction", level: 30 },
          ],
        },
        {
          id: "diary-kourend-kebos-medium-8",
          description: "Deliver some intelligence to Captain Ginea.",
          requirements: [
          ],
        },
        {
          id: "diary-kourend-kebos-medium-9",
          description: "Catch a Bluegill on Molch Island.",
          requirements: [
            { type: "skill", description: "Fishing level 43", skill: "Fishing", level: 43 },
            { type: "skill", description: "Hunter level 35", skill: "Hunter", level: 35 },
          ],
        },
        {
          id: "diary-kourend-kebos-medium-10",
          description: "Use the boulder leap shortcut in the Arceuus essence mine.",
          requirements: [
            { type: "skill", description: "Agility level 49", skill: "Agility", level: 49 },
          ],
        },
        {
          id: "diary-kourend-kebos-medium-11",
          description: "Subdue the Wintertodt\n''Note: You must earn at least 500 points.",
          requirements: [
            { type: "skill", description: "Firemaking level 50", skill: "Firemaking", level: 50 },
          ],
        },
        {
          id: "diary-kourend-kebos-medium-12",
          description: "Catch a Chinchompa in the Kourend Woodland.",
          requirements: [
            { type: "skill", description: "Hunter level 53", skill: "Hunter", level: 53 },
          ],
        },
        {
          id: "diary-kourend-kebos-medium-13",
          description: "Chop some Mahogany logs north of the Farming Guild.",
          requirements: [
            { type: "skill", description: "Woodcutting level 50", skill: "Woodcutting", level: 50 },
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
          id: "diary-kourend-kebos-hard-1",
          description: "Enter the Woodcutting Guild.",
          requirements: [
            { type: "skill", description: "Woodcutting level 60", skill: "Woodcutting", level: 60 },
          ],
        },
        {
          id: "diary-kourend-kebos-hard-2",
          description: "Smelt an Adamantite bar in The Forsaken Tower.\n''Note: Using the Superheat Item spell does not count.",
          requirements: [
            { type: "skill", description: "Smithing level 70", skill: "Smithing", level: 70 },
            { type: "quest", description: "Completion of The Forsaken Tower" },
          ],
        },
        {
          id: "diary-kourend-kebos-hard-3",
          description: "Kill a Lizardman Shaman in the Lizardman Temple.",
          requirements: [
          ],
        },
        {
          id: "diary-kourend-kebos-hard-4",
          description: "Mine some Lovakite.",
          requirements: [
            { type: "skill", description: "Mining level 65", skill: "Mining", level: 65 },
          ],
        },
        {
          id: "diary-kourend-kebos-hard-5",
          description: "Plant some Logavano seeds at the Tithe Farm.",
          requirements: [
            { type: "skill", description: "Farming level 74", skill: "Farming", level: 74 },
          ],
        },
        {
          id: "diary-kourend-kebos-hard-6",
          description: "Kill a Zombie in the Shayzien Crypts.",
          requirements: [
          ],
        },
        {
          id: "diary-kourend-kebos-hard-7",
          description: "Teleport to Xeric's Heart using Xeric's Talisman.",
          requirements: [
          ],
        },
        {
          id: "diary-kourend-kebos-hard-8",
          description: "Deliver an artefact to Captain Khaled.",
          requirements: [
            { type: "skill", description: "Thieving level 49", skill: "Thieving", level: 49 },
          ],
        },
        {
          id: "diary-kourend-kebos-hard-9",
          description: "Kill a Wyrm in the Karuulm Slayer Dungeon.",
          requirements: [
            { type: "skill", description: "Slayer level 62", skill: "Slayer", level: 62 },
          ],
        },
        {
          id: "diary-kourend-kebos-hard-10",
          description: "Cast Monster Examine on a Troll south of Mount Quidamortem.",
          requirements: [
            { type: "skill", description: "Magic level 66", skill: "Magic", level: 66 },
            { type: "quest", description: "Completion of Dream Mentor" },
          ],
        },
        {
          id: "diary-kourend-kebos-hard-11",
          description: "}\n\n===Rewards===\n*Rada's blessing 3:\n**Unlimited teleports to the Kourend Woodland\n**Three daily teleports to the top of Mount Karuulm\n**6% chance to catch two fish at once anywhere when equipped, excluding at Tempoross' Cove (no additional experience granted)\n**Has a Prayer bonus of +1 when equipped, similar to the god blessings\n*Ash sanctifier, claimable from Tyss\n**An additional item that, when carried, causes demonic ashes dropped from killed monsters to be automatically scattered, granting half the Prayer experience that would have been granted for scattering them normally\n**This item is charged with death runes\n*Antique lamp worth 15,000 experience in any skill of at least level 50\n*Any slayer helmet can be used in place of a Shayzien helm (5) for its protection against lizardman shamans, after talking to Captain Cleive (requires having the helm in your collection log)\n*60% discount on Eodan's tanning services, up from 40%\n*5% increased chance to save a \"harvest life\" at the herb patches in Hosidius and the Farming Guild, slightly increasing your harvest yield\n*Thirus offers you 40 dynamite for free every day, worth a total of  coins on the Grand Exchange",
          requirements: [
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
          id: "diary-kourend-kebos-elite-1",
          description: "Craft one or more Blood runes from Dark essence.\n''Note: This requires mining a dark essence block and breaking it down into fragments, then using those fragments on the Kourend Blood Altar.",
          requirements: [
            { type: "skill", description: "Runecraft level 77", skill: "Runecraft", level: 77 },
            { type: "skill", description: "Mining level 38", skill: "Mining", level: 38 },
            { type: "skill", description: "Crafting level 38", skill: "Crafting", level: 38 },
          ],
        },
        {
          id: "diary-kourend-kebos-elite-2",
          description: "Chop some Redwood logs.",
          requirements: [
            { type: "skill", description: "Woodcutting level 90", skill: "Woodcutting", level: 90 },
          ],
        },
        {
          id: "diary-kourend-kebos-elite-3",
          description: "Defeat Skotizo in the Catacombs of Kourend.",
          requirements: [
          ],
        },
        {
          id: "diary-kourend-kebos-elite-4",
          description: "Catch an Anglerfish and cook it whilst in Great Kourend.",
          requirements: [
            { type: "skill", description: "Fishing level 82", skill: "Fishing", level: 82 },
            { type: "skill", description: "Cooking level 84", skill: "Cooking", level: 84 },
          ],
        },
        {
          id: "diary-kourend-kebos-elite-5",
          description: "Kill a Hydra in the Karuulm Slayer Dungeon.",
          requirements: [
            { type: "skill", description: "Slayer level 95", skill: "Slayer", level: 95 },
          ],
        },
        {
          id: "diary-kourend-kebos-elite-6",
          description: "Create an Ape Atoll teleport tablet.",
          requirements: [
            { type: "skill", description: "Magic level 90", skill: "Magic", level: 90 },
          ],
        },
        {
          id: "diary-kourend-kebos-elite-7",
          description: "Complete a Raid in the Chambers of Xeric.",
          requirements: [
          ],
        },
        {
          id: "diary-kourend-kebos-elite-8",
          description: "Create your own Battlestaff from scratch within the Farming Guild.",
          requirements: [
            { type: "skill", description: "Farming level 85", skill: "Farming", level: 85 },
            { type: "skill", description: "Fletching level 40", skill: "Fletching", level: 40 },
          ],
        },
      ],
      rewards: [
      ],
    },
  ],
};
