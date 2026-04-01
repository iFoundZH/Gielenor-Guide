import type { AchievementDiaryArea } from "@/types/guides";

export const western_provincesDiary: AchievementDiaryArea = {
  id: "western-provinces",
  name: "Western Provinces",
  wikiUrl: "https://oldschool.runescape.wiki/w/Western_Provinces_Diary",
  tiers: [
    {
      tier: "easy" as AchievementDiaryArea["tiers"][number]["tier"],
      tasks: [
        {
          id: "diary-western-provinces-easy-1",
          description: "Catch a Copper Longtail.",
          requirements: [
            { type: "skill", description: "Hunter level 9", skill: "Hunter", level: 9 },
          ],
        },
        {
          id: "diary-western-provinces-easy-2",
          description: "Complete a novice game of Pest Control.\nNote: You must've earnt commendation points for this task to count as completed. In Deadman Mode, the task is instead \"Attempt to board the novice Pest Control lander with at least 40 combat.\"",
          requirements: [
            { type: "skill", description: "Combat level 40", skill: "Combat", level: 40 },
          ],
        },
        {
          id: "diary-western-provinces-easy-3",
          description: "Mine some Iron Ore near Piscatoris.\nNote: This must be done at the Piscatoris mine.",
          requirements: [
            { type: "skill", description: "Mining level 15", skill: "Mining", level: 15 },
          ],
        },
        {
          id: "diary-western-provinces-easy-4",
          description: "Complete a lap of the Gnome agility course.",
          requirements: [
          ],
        },
        {
          id: "diary-western-provinces-easy-5",
          description: "Score a goal in a Gnomeball match.",
          requirements: [
          ],
        },
        {
          id: "diary-western-provinces-easy-6",
          description: "Claim any Chompy bird hat from Rantz.\nNote: You need to have a (comp) ogre bow in your inventory to claim hats.",
          requirements: [
            { type: "quest", description: "Completion of Big Chompy Bird Hunting" },
          ],
        },
        {
          id: "diary-western-provinces-easy-7",
          description: "Teleport to Pest Control using the Minigame Teleport.\nNote: In Deadman Mode, the task is instead \"Travel to the Void Knight Outpost from Port Sarim.\"",
          requirements: [
            { type: "skill", description: "Combat level 40", skill: "Combat", level: 40 },
          ],
        },
        {
          id: "diary-western-provinces-easy-8",
          description: "Collect a swamp toad at the Gnome Stronghold.\nNote: Only a swamp toad collected from the swamp pen north-west of Grand Tree counts for this task.",
          requirements: [
          ],
        },
        {
          id: "diary-western-provinces-easy-9",
          description: "Have Brimstail teleport you to the Essence Mine.\nNote: You can right-click him to teleport.",
          requirements: [
            { type: "quest", description: "Completion of Rune Mysteries" },
          ],
        },
        {
          id: "diary-western-provinces-easy-10",
          description: "Fletch an Oak Shortbow in the Gnome Stronghold.",
          requirements: [
            { type: "skill", description: "Fletching level 20", skill: "Fletching", level: 20 },
          ],
        },
        {
          id: "diary-western-provinces-easy-11",
          description: "Kill a Terrorbird in the Terrorbird enclosure.\n''Note: This enclosure is found in the south-west of the Tree Gnome Stronghold, across the river.",
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
          id: "diary-western-provinces-medium-1",
          description: "Take the agility shortcut from the Grand Tree to Otto's Grotto.",
          requirements: [
            { type: "skill", description: "Agility level 37", skill: "Agility", level: 37 },
            { type: "quest", description: "Completion of Tree Gnome Village" },
          ],
        },
        {
          id: "diary-western-provinces-medium-2",
          description: "Travel to the Gnome Stronghold by Spirit Tree.",
          requirements: [
            { type: "quest", description: "Completion of Tree Gnome Village" },
          ],
        },
        {
          id: "diary-western-provinces-medium-3",
          description: "Trap a Spined Larupia.\n''Note: This creature is found in the Feldip Hunter area.",
          requirements: [
            { type: "skill", description: "Hunter level 31", skill: "Hunter", level: 31 },
          ],
        },
        {
          id: "diary-western-provinces-medium-4",
          description: "Fish some Bass on Ape Atoll.",
          requirements: [
            { type: "skill", description: "Fishing level 46", skill: "Fishing", level: 46 },
          ],
        },
        {
          id: "diary-western-provinces-medium-5",
          description: "Chop and burn some teak logs on Ape Atoll.\nNote: With 50 Woodcutting and 50 Firemaking, you can also chop and burn some mahogany logs here for a hard task.\n\nCompleting or updating any other task in-between these steps will reset the progress for this task.",
          requirements: [
            { type: "skill", description: "Woodcutting level 35", skill: "Woodcutting", level: 35 },
            { type: "skill", description: "Firemaking level 35", skill: "Firemaking", level: 35 },
          ],
        },
        {
          id: "diary-western-provinces-medium-6",
          description: "Complete an intermediate game of Pest Control.\nNote: You must've earnt commendation points for this task to count as completed. In Deadman Mode, the task is instead \"Attempt to board the intermediate Pest Control lander with at least 70 combat.\"",
          requirements: [
            { type: "skill", description: "Combat level 70", skill: "Combat", level: 70 },
          ],
        },
        {
          id: "diary-western-provinces-medium-7",
          description: "Travel to the Feldip Hills by Gnome Glider.",
          requirements: [
            { type: "quest", description: "Completion of The Grand Tree" },
          ],
        },
        {
          id: "diary-western-provinces-medium-8",
          description: "Claim a Chompy bird hat from Rantz after registering at least 125 kills.\nNote: You need to have a (comp) ogre bow in your inventory to claim hats.",
          requirements: [
            { type: "quest", description: "Completion of Big Chompy Bird Hunting" },
          ],
        },
        {
          id: "diary-western-provinces-medium-9",
          description: "Travel from Eagles' Peak to the Feldip Hills by Eagle.\nNote: You'll unlock travel from the Eagles' Peak Dungeon after the required quest.",
          requirements: [
            { type: "quest", description: "Completion of Eagles' Peak" },
          ],
        },
        {
          id: "diary-western-provinces-medium-10",
          description: "Make a Chocolate Bomb at the Grand Tree.",
          requirements: [
            { type: "skill", description: "Cooking level 42", skill: "Cooking", level: 42 },
          ],
        },
        {
          id: "diary-western-provinces-medium-11",
          description: "Complete a delivery for the Gnome Restaurant.",
          requirements: [
            { type: "skill", description: "Cooking level 29", skill: "Cooking", level: 29 },
          ],
        },
        {
          id: "diary-western-provinces-medium-12",
          description: "Turn your small crystal seed into a Crystal saw.\n''Note: You have to enchant it with the singing bowl in Brimstail's cave.",
          requirements: [
            { type: "quest", description: "Completion of The Eyes of Glouphrie" },
          ],
        },
        {
          id: "diary-western-provinces-medium-13",
          description: "Mine some Gold ore underneath the Grand Tree.",
          requirements: [
            { type: "skill", description: "Mining level 40", skill: "Mining", level: 40 },
            { type: "quest", description: "Completion of The Grand Tree" },
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
          id: "diary-western-provinces-hard-1",
          description: "Kill an Elf with a Crystal bow.\nNote: an inactive bow can be used if equipped whilst the elf dies to poison.",
          requirements: [
            { type: "skill", description: "Ranged level 70", skill: "Ranged", level: 70 },
            { type: "quest", description: "Completion of Roving Elves" },
          ],
        },
        {
          id: "diary-western-provinces-hard-2",
          description: "Catch and cook a Monkfish in Piscatoris.\n''Note: Monkfish is caught in the Piscatoris Fishing Colony.",
          requirements: [
            { type: "skill", description: "Fishing level 62", skill: "Fishing", level: 62 },
            { type: "skill", description: "Cooking level 62", skill: "Cooking", level: 62 },
            { type: "quest", description: "Completion of Swan Song" },
          ],
        },
        {
          id: "diary-western-provinces-hard-3",
          description: "Complete a Veteran game of Pest Control.\nNote: You must've earnt commendation points for this task to count as completed. In Deadman Mode, the task is instead \"Attempt to board the veteran Pest Control lander with at least 100 combat.\"",
          requirements: [
            { type: "skill", description: "Combat level 100", skill: "Combat", level: 100 },
          ],
        },
        {
          id: "diary-western-provinces-hard-4",
          description: "Catch a Dashing Kebbit.\nNote: This kebbit is found in the Piscatoris falconry area.",
          requirements: [
            { type: "skill", description: "Hunter level 69", skill: "Hunter", level: 69 },
          ],
        },
        {
          id: "diary-western-provinces-hard-5",
          description: "Complete a lap of the Ape Atoll agility course.",
          requirements: [
            { type: "skill", description: "Agility level 48", skill: "Agility", level: 48 },
          ],
        },
        {
          id: "diary-western-provinces-hard-6",
          description: "Chop and burn some Mahogany logs on Ape Atoll.\nNote: Logs burnt by the Infernal axe do not count towards this task.",
          requirements: [
            { type: "skill", description: "Woodcutting level 50", skill: "Woodcutting", level: 50 },
            { type: "skill", description: "Firemaking level 50", skill: "Firemaking", level: 50 },
          ],
        },
        {
          id: "diary-western-provinces-hard-7",
          description: "Mine some Adamantite ore in Tirannwn.\nNote: This can be done in the Isafdar mine outside of Lletya, or the Trahaearn mine in Prifddinas (with completion of Song of the Elves).",
          requirements: [
            { type: "skill", description: "Mining level 70", skill: "Mining", level: 70 },
          ],
        },
        {
          id: "diary-western-provinces-hard-8",
          description: "Check the health of your Palm tree in Lletya.",
          requirements: [
            { type: "skill", description: "Farming level 68", skill: "Farming", level: 68 },
          ],
        },
        {
          id: "diary-western-provinces-hard-9",
          description: "Claim a Chompy bird hat from Rantz after registering at least 300 kills.\nNote: You need to have a (comp) ogre bow in your inventory to claim hats.",
          requirements: [
            { type: "quest", description: "Completion of Big Chompy Bird Hunting" },
          ],
        },
        {
          id: "diary-western-provinces-hard-10",
          description: "Build an Isafdar painting in your POH Quest hall.",
          requirements: [
            { type: "skill", description: "Construction level 65", skill: "Construction", level: 65 },
            { type: "quest", description: "Completion of Roving Elves" },
          ],
        },
        {
          id: "diary-western-provinces-hard-11",
          description: "Kill Zulrah.\nNote: In Deadman Mode, the task is listed as \"Attempt to visit Zulrah.\", but doing so will not complete the task, and you must kill Zulrah like normal to complete it.",
          requirements: [
          ],
        },
        {
          id: "diary-western-provinces-hard-12",
          description: "Teleport to Ape Atoll.",
          requirements: [
            { type: "skill", description: "Magic level 64", skill: "Magic", level: 64 },
          ],
        },
        {
          id: "diary-western-provinces-hard-13",
          description: "Pickpocket a Gnome.",
          requirements: [
            { type: "skill", description: "Thieving level 75", skill: "Thieving", level: 75 },
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
          id: "diary-western-provinces-elite-1",
          description: "Fletch a Magic Longbow in Tirannwn.",
          requirements: [
            { type: "skill", description: "Fletching level 85", skill: "Fletching", level: 85 },
          ],
        },
        {
          id: "diary-western-provinces-elite-2",
          description: "Kill the Thermonuclear Smoke Devil.\nNote: While this boss normally requires a Slayer task, this is not needed for the first kill. You do not have to contact a Slayer master for this task.\n\nYou must be in the room when its death animation ends, or the task will not be completed. Be mindful of this if you are attempting the Combat Achievements. If this occurs, you will still be able to kill it again without a slayer task.",
          requirements: [
            { type: "skill", description: "Slayer level 93", skill: "Slayer", level: 93 },
          ],
        },
        {
          id: "diary-western-provinces-elite-3",
          description: "Have Prissy Scilla protect your Magic tree.",
          requirements: [
            { type: "skill", description: "Farming level 75", skill: "Farming", level: 75 },
          ],
        },
        {
          id: "diary-western-provinces-elite-4",
          description: "Use the Elven overpass advanced cliffside shortcut.",
          requirements: [
            { type: "skill", description: "Agility level 85", skill: "Agility", level: 85 },
            { type: "quest", description: "Completion of Underground Pass" },
          ],
        },
        {
          id: "diary-western-provinces-elite-5",
          description: "Equip any complete void set.\n''Note: In Deadman Mode, the task is instead \"Speak to the Elite Void Knight after claiming the Western hard diary reward.\"",
          requirements: [
            { type: "skill", description: "Combat level 40", skill: "Combat", level: 40 },
            { type: "skill", description: "Prayer level 22", skill: "Prayer", level: 22 },
            { type: "skill", description: "Attack level 42", skill: "Attack", level: 42 },
            { type: "skill", description: "Strength level 42", skill: "Strength", level: 42 },
            { type: "skill", description: "Defence level 42", skill: "Defence", level: 42 },
            { type: "skill", description: "Hitpoints level 42", skill: "Hitpoints", level: 42 },
            { type: "skill", description: "Ranged level 42", skill: "Ranged", level: 42 },
            { type: "skill", description: "Magic level 42", skill: "Magic", level: 42 },
          ],
        },
        {
          id: "diary-western-provinces-elite-6",
          description: "Claim a Chompy bird hat from Rantz after registering at least 1,000 kills.\nNote: You need to have a (comp) ogre bow in your inventory to claim hats.",
          requirements: [
            { type: "quest", description: "Completion of Big Chompy Bird Hunting" },
          ],
        },
        {
          id: "diary-western-provinces-elite-7",
          description: "Pickpocket an Elf.",
          requirements: [
            { type: "skill", description: "Thieving level 85", skill: "Thieving", level: 85 },
          ],
        },
      ],
      rewards: [
      ],
    },
  ],
};
