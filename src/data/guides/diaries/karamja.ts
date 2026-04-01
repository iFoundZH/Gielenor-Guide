import type { AchievementDiaryArea } from "@/types/guides";

export const karamjaDiary: AchievementDiaryArea = {
  id: "karamja",
  name: "Karamja",
  wikiUrl: "https://oldschool.runescape.wiki/w/Karamja_Diary",
  tiers: [
    {
      tier: "easy" as AchievementDiaryArea["tiers"][number]["tier"],
      tasks: [
        {
          id: "diary-karamja-easy-1",
          description: "Pick 5 bananas from the plantation located east of the volcano.",
          requirements: [
          ],
        },
        {
          id: "diary-karamja-easy-2",
          description: "Use the rope swing to travel to the Moss Giant Island north-west of Karamja.",
          requirements: [
            { type: "skill", description: "Agility level 10", skill: "Agility", level: 10 },
          ],
        },
        {
          id: "diary-karamja-easy-3",
          description: "Mine some gold from the rocks on the north-west peninsula of Karamja.",
          requirements: [
            { type: "skill", description: "Mining level 40", skill: "Mining", level: 40 },
          ],
        },
        {
          id: "diary-karamja-easy-4",
          description: "Travel to Port Sarim via the dock, east of Musa Point.",
          requirements: [
          ],
        },
        {
          id: "diary-karamja-easy-5",
          description: "Travel to Ardougne via the port near Brimhaven.",
          requirements: [
          ],
        },
        {
          id: "diary-karamja-easy-6",
          description: "Explore Cairn Island to the west of Karamja.",
          requirements: [
            { type: "skill", description: "Agility level 15", skill: "Agility", level: 15 },
          ],
        },
        {
          id: "diary-karamja-easy-7",
          description: "Use the Fishing spots north of the banana plantation.\n''Note: Fishing at any of the fishing spots there will count for this task.",
          requirements: [
          ],
        },
        {
          id: "diary-karamja-easy-8",
          description: "Collect 5 seaweed from anywhere on Karamja.\nNote: You can just drop and pick up the same seaweed five times.",
          requirements: [
          ],
        },
        {
          id: "diary-karamja-easy-9",
          description: "Attempt the TzHaar Fight Pits or Fight Cave.\nNote: You can simply enter and leave. No actual attempt is necessary, but the Fight Pits will not allow entrance without at least one other player.",
          requirements: [
          ],
        },
        {
          id: "diary-karamja-easy-10",
          description: "Kill a jogre in the Pothole dungeon.",
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
          id: "diary-karamja-medium-1",
          description: "Claim a ticket from the Agility Arena in Brimhaven.",
          requirements: [
            { type: "skill", description: "Agility level 40", skill: "Agility", level: 40 },
          ],
        },
        {
          id: "diary-karamja-medium-2",
          description: "Discover hidden wall in the dungeon below the volcano.",
          requirements: [
          ],
        },
        {
          id: "diary-karamja-medium-3",
          description: "Visit the Isle of Crandor via the dungeon below the volcano.\n''Note: You must go through the hidden wall, past the lesser demons, and then climb the rope to the surface of Crandor to complete this task.",
          requirements: [
          ],
        },
        {
          id: "diary-karamja-medium-4",
          description: "Use Vigroy and Hajedy's cart service.",
          requirements: [
            { type: "quest", description: "Completion of Shilo Village" },
          ],
        },
        {
          id: "diary-karamja-medium-5",
          description: "Earn 100% favour in the village of Tai Bwo Wannai.",
          requirements: [
            { type: "skill", description: "Woodcutting level 10", skill: "Woodcutting", level: 10 },
            { type: "quest", description: "Completion of Jungle Potion" },
          ],
        },
        {
          id: "diary-karamja-medium-6",
          description: "Cook a spider on a stick.\nNote: Cooking a spider on a shaft also counts for this task. This does not have to be done on Karamja.",
          requirements: [
            { type: "skill", description: "Cooking level 16", skill: "Cooking", level: 16 },
          ],
        },
        {
          id: "diary-karamja-medium-7",
          description: "Charter the Lady of the Waves from Cairn Isle to Port Khazard.",
          requirements: [
            { type: "quest", description: "Completion of Shilo Village" },
          ],
        },
        {
          id: "diary-karamja-medium-8",
          description: "Cut a log from a teak tree.\nNote: Teak trees can be found in the Hardwood Grove or within the harder-to-access Kharazi Jungle.",
          requirements: [
            { type: "skill", description: "Woodcutting level 35", skill: "Woodcutting", level: 35 },
            { type: "skill", description: "Agility level 79", skill: "Agility", level: 79 },
            { type: "quest", description: "Completion of Jungle Potion" },
          ],
        },
        {
          id: "diary-karamja-medium-9",
          description: "Cut a log from a mahogany tree.\nNote: Mahogany trees can be found in the Hardwood Grove or within the harder-to-access Kharazi Jungle.",
          requirements: [
            { type: "skill", description: "Woodcutting level 50", skill: "Woodcutting", level: 50 },
            { type: "skill", description: "Agility level 79", skill: "Agility", level: 79 },
            { type: "quest", description: "Completion of Jungle Potion" },
          ],
        },
        {
          id: "diary-karamja-medium-10",
          description: "Catch a karambwan.",
          requirements: [
            { type: "skill", description: "Fishing level 65", skill: "Fishing", level: 65 },
          ],
        },
        {
          id: "diary-karamja-medium-11",
          description: "Exchange gems for a machete.\n''Note: This is done by talking to Safta Doc with the required items.",
          requirements: [
            { type: "quest", description: "Completion of Jungle Potion" },
          ],
        },
        {
          id: "diary-karamja-medium-12",
          description: "Use the gnome glider to travel to Karamja.",
          requirements: [
            { type: "quest", description: "Completion of The Grand Tree" },
          ],
        },
        {
          id: "diary-karamja-medium-13",
          description: "Grow a healthy fruit tree in the patch near Brimhaven.",
          requirements: [
            { type: "skill", description: "Farming level 27", skill: "Farming", level: 27 },
          ],
        },
        {
          id: "diary-karamja-medium-14",
          description: "Trap a horned graahk.",
          requirements: [
            { type: "skill", description: "Hunter level 41", skill: "Hunter", level: 41 },
          ],
        },
        {
          id: "diary-karamja-medium-15",
          description: "Chop the vines to gain deeper access to Brimhaven Dungeon.\n''Note: These are the vines found immediately within the main entrance.",
          requirements: [
            { type: "skill", description: "Woodcutting level 10", skill: "Woodcutting", level: 10 },
          ],
        },
        {
          id: "diary-karamja-medium-16",
          description: "Cross the lava using the stepping stones within Brimhaven Dungeon.\n''Note: Not to be confused with the stepping stones towards the red dragons.",
          requirements: [
            { type: "skill", description: "Woodcutting level 10", skill: "Woodcutting", level: 10 },
            { type: "skill", description: "Agility level 12", skill: "Agility", level: 12 },
          ],
        },
        {
          id: "diary-karamja-medium-17",
          description: "Climb the stairs within Brimhaven Dungeon.\nNote: You have to climb the stairs south of the stepping stones of the previous task, next to the moss giants.",
          requirements: [
            { type: "skill", description: "Woodcutting level 10", skill: "Woodcutting", level: 10 },
          ],
        },
        {
          id: "diary-karamja-medium-18",
          description: "Charter a ship from the shipyard in the far east of Karamja.\n''Note: The destination does not matter for this task.",
          requirements: [
          ],
        },
        {
          id: "diary-karamja-medium-19",
          description: "Mine a red topaz from a gem rock.\nNote: Gem rocks are found Shilo Village and rarely appear within the Tai Bwo Wannai Cleanup minigame.",
          requirements: [
            { type: "skill", description: "Mining level 40", skill: "Mining", level: 40 },
            { type: "quest", description: "Completion of Jungle Potion" },
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
          id: "diary-karamja-hard-1",
          description: "Become the Champion of the Fight Pits.\n''Note: In Deadman Mode, this task is instead \"Speak to TzHaar-Mej-Kah at the Fight Pits.\"",
          requirements: [
          ],
        },
        {
          id: "diary-karamja-hard-2",
          description: "Kill a Ket-Zek in the Fight Caves.\n''Note: Ket-Zeks start to appear on the 31st wave. You can leave the arena safely after killing it.\n\n''This wave can be reached with relatively little effort, as long as the Yt-MejKots are kept out of melee range and Protect from Missiles is used against the Tok-Xils. Though, you may as well try to complete the entire Fight Caves when going for this task.",
          requirements: [
          ],
        },
        {
          id: "diary-karamja-hard-3",
          description: "Eat an oomlie wrap.",
          requirements: [
            { type: "skill", description: "Cooking level 50", skill: "Cooking", level: 50 },
          ],
        },
        {
          id: "diary-karamja-hard-4",
          description: "Craft some nature runes from Essence.",
          requirements: [
            { type: "skill", description: "Runecraft level 44", skill: "Runecraft", level: 44 },
          ],
        },
        {
          id: "diary-karamja-hard-5",
          description: "Cook a karambwan thoroughly.",
          requirements: [
            { type: "skill", description: "Cooking level 30", skill: "Cooking", level: 30 },
            { type: "quest", description: "Completion of Tai Bwo Wannai Trio" },
          ],
        },
        {
          id: "diary-karamja-hard-6",
          description: "Kill a deathwing in the dungeon under the Kharazi Jungle.",
          requirements: [
            { type: "skill", description: "Agility level 50", skill: "Agility", level: 50 },
            { type: "skill", description: "Thieving level 50", skill: "Thieving", level: 50 },
            { type: "skill", description: "Mining level 52", skill: "Mining", level: 52 },
            { type: "skill", description: "Strength level 50", skill: "Strength", level: 50 },
          ],
        },
        {
          id: "diary-karamja-hard-7",
          description: "Use the crossbow shortcut south of the volcano.",
          requirements: [
            { type: "skill", description: "Agility level 53", skill: "Agility", level: 53 },
            { type: "skill", description: "Ranged level 42", skill: "Ranged", level: 42 },
            { type: "skill", description: "Strength level 21", skill: "Strength", level: 21 },
          ],
        },
        {
          id: "diary-karamja-hard-8",
          description: "Collect 5 palm leaves.\nNote: You can just drop and pick up the same palm leaf five times.",
          requirements: [
            { type: "skill", description: "Agility level 79", skill: "Agility", level: 79 },
          ],
        },
        {
          id: "diary-karamja-hard-9",
          description: "Be assigned a Slayer task by the Slayer Master in Shilo Village.",
          requirements: [
            { type: "skill", description: "Combat level 100", skill: "Combat", level: 100 },
            { type: "skill", description: "Slayer level 50", skill: "Slayer", level: 50 },
            { type: "quest", description: "Completion of Shilo Village" },
          ],
        },
        {
          id: "diary-karamja-hard-10",
          description: "Kill a metal dragon in Brimhaven Dungeon.",
          requirements: [
            { type: "skill", description: "Woodcutting level 10", skill: "Woodcutting", level: 10 },
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
          id: "diary-karamja-elite-1",
          description: "Craft 56 Nature runes simultaneously from Essence without the use of Extracts.",
          requirements: [
            { type: "skill", description: "Runecraft level 91", skill: "Runecraft", level: 91 },
          ],
        },
        {
          id: "diary-karamja-elite-2",
          description: "Equip a Fire Cape or Infernal Cape in Mor Ul Rek.",
          requirements: [
          ],
        },
        {
          id: "diary-karamja-elite-3",
          description: "Check the health of a palm tree in Brimhaven.",
          requirements: [
            { type: "skill", description: "Farming level 68", skill: "Farming", level: 68 },
          ],
        },
        {
          id: "diary-karamja-elite-4",
          description: "Create an antivenom potion whilst standing in the horse shoe mine.",
          requirements: [
            { type: "skill", description: "Herblore level 87", skill: "Herblore", level: 87 },
          ],
        },
        {
          id: "diary-karamja-elite-5",
          description: "Check the health of your Calquat tree patch.\n''Note: This is the farming patch next to Imiago.",
          requirements: [
            { type: "skill", description: "Farming level 72", skill: "Farming", level: 72 },
          ],
        },
      ],
      rewards: [
      ],
    },
  ],
};
