import type { AchievementDiaryArea } from "@/types/guides";

export const wildernessDiary: AchievementDiaryArea = {
  id: "wilderness",
  name: "Wilderness",
  wikiUrl: "https://oldschool.runescape.wiki/w/Wilderness_Diary",
  tiers: [
    {
      tier: "easy" as AchievementDiaryArea["tiers"][number]["tier"],
      tasks: [
        {
          id: "diary-wilderness-easy-1",
          description: "Cast Low Alchemy at the Fountain of Rune.",
          requirements: [
            { type: "skill", description: "Magic level 21", skill: "Magic", level: 21 },
          ],
        },
        {
          id: "diary-wilderness-easy-2",
          description: "Enter the Wilderness from the Ardougne or Edgeville lever.",
          requirements: [
          ],
        },
        {
          id: "diary-wilderness-easy-3",
          description: "Pray at the Chaos Altar in the Western Wilderness.",
          requirements: [
          ],
        },
        {
          id: "diary-wilderness-easy-4",
          description: "Enter the Chaos Runecrafting temple.\n''Note: Entering it through the Tunnel of Chaos or Guardians of the Rift will not count for this task.",
          requirements: [
          ],
        },
        {
          id: "diary-wilderness-easy-5",
          description: "Kill a Mammoth in the Wilderness.\n''Note: Mammoths are found south-east of Ferox Enclave.",
          requirements: [
          ],
        },
        {
          id: "diary-wilderness-easy-6",
          description: "Kill an Earth Warrior in the Wilderness beneath Edgeville.",
          requirements: [
            { type: "skill", description: "Agility level 15", skill: "Agility", level: 15 },
          ],
        },
        {
          id: "diary-wilderness-easy-7",
          description: "Restore some prayer points at the demonic ruins.",
          requirements: [
          ],
        },
        {
          id: "diary-wilderness-easy-8",
          description: "Enter the King Black Dragon's lair.\n''Note: This lair is located beneath the Lava Maze.",
          requirements: [
          ],
        },
        {
          id: "diary-wilderness-easy-9",
          description: "Collect 5 Red spiders' eggs from the Wilderness\nNote: These can be found in the northern part of the Edgeville Dungeon. You can also bring eggs into the wilderness, fulfilling the diary by dropping and picking them up five times.",
          requirements: [
          ],
        },
        {
          id: "diary-wilderness-easy-10",
          description: "Mine some Iron ore in the Wilderness.",
          requirements: [
            { type: "skill", description: "Mining level 15", skill: "Mining", level: 15 },
          ],
        },
        {
          id: "diary-wilderness-easy-11",
          description: "Have the Mage of Zamorak teleport you to the Abyss.\nNote: The one-time teleport to the Abyss from Varrock during Temple of the Eye does not count for this task.",
          requirements: [
            { type: "quest", description: "Completion of Enter the Abyss" },
          ],
        },
        {
          id: "diary-wilderness-easy-12",
          description: "Equip any team cape in the Wilderness.\n''Note: Entering the Wilderness with one already equipped does not count for this task.",
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
          id: "diary-wilderness-medium-1",
          description: "Mine some Mithril ore in the wilderness.",
          requirements: [
            { type: "skill", description: "Mining level 55", skill: "Mining", level: 55 },
          ],
        },
        {
          id: "diary-wilderness-medium-2",
          description: "Chop some yew logs from a fallen Ent.\n''Note: This must be done within the Wilderness. You can find ents north and east of the chaos temple with the elder chaos druids.",
          requirements: [
            { type: "skill", description: "Woodcutting level 61", skill: "Woodcutting", level: 61 },
          ],
        },
        {
          id: "diary-wilderness-medium-3",
          description: "Enter the Wilderness Godwars Dungeon.\n''Note: While you're here, with a high enough Slayer level you can also complete another medium task and a hard task by killing a bloodveld and spiritual warrior, respectively.",
          requirements: [
            { type: "skill", description: "Agility level 60", skill: "Agility", level: 60 },
            { type: "skill", description: "Strength level 60", skill: "Strength", level: 60 },
          ],
        },
        {
          id: "diary-wilderness-medium-4",
          description: "Complete a lap of the Wilderness Agility course.",
          requirements: [
            { type: "skill", description: "Agility level 52", skill: "Agility", level: 52 },
          ],
        },
        {
          id: "diary-wilderness-medium-5",
          description: "Kill a Green Dragon.\nNote: This must be done within the Wilderness.",
          requirements: [
          ],
        },
        {
          id: "diary-wilderness-medium-6",
          description: "Kill an Ankou in the Wilderness.",
          requirements: [
          ],
        },
        {
          id: "diary-wilderness-medium-7",
          description: "Charge an Earth Orb.",
          requirements: [
            { type: "skill", description: "Magic level 60", skill: "Magic", level: 60 },
          ],
        },
        {
          id: "diary-wilderness-medium-8",
          description: "Kill a Bloodveld in the Wilderness Godwars Dungeon.\n''Note: Can be safespotted in the south-west corner while having a Saradomin and Zamorak item equipped.",
          requirements: [
            { type: "skill", description: "Agility level 60", skill: "Agility", level: 60 },
            { type: "skill", description: "Strength level 60", skill: "Strength", level: 60 },
            { type: "skill", description: "Slayer level 50", skill: "Slayer", level: 50 },
          ],
        },
        {
          id: "diary-wilderness-medium-9",
          description: "Talk to the Emblem Trader in Edgeville about emblems. (He's just north of the bank)",
          requirements: [
          ],
        },
        {
          id: "diary-wilderness-medium-10",
          description: "Smith a Golden helmet in the Resource Area.\n''Note: You cannot do this while you already have a gold helmet in your inventory or bank, this must be dropped first. With 75 Smithing, you can bring 2 adamantite bars here as well to smith an adamant scimitar for a hard task.",
          requirements: [
            { type: "skill", description: "Smithing level 50", skill: "Smithing", level: 50 },
          ],
        },
        {
          id: "diary-wilderness-medium-11",
          description: "Open the Muddy Chest in the lava maze.\n''Note: With 53 Fishing, you can bring an oily fishing rod and fishing bait to catch a raw lava eel for a hard task.",
          requirements: [
            { type: "skill", description: "Agility level 82", skill: "Agility", level: 82 },
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
          id: "diary-wilderness-hard-1",
          description: "Cast any of the 3 God spells against another player in the Wilderness.\n''Note: You have to successfully hit the player, so multiple casts are recommended.\n\n''God spells must first be cast 100 times inside the Mage Arena before they can be cast elsewhere, but this task is just as completable inside the arena.",
          requirements: [
            { type: "skill", description: "Magic level 60", skill: "Magic", level: 60 },
            { type: "quest", description: "Completion of Mage Arena I" },
          ],
        },
        {
          id: "diary-wilderness-hard-2",
          description: "Charge an Air Orb.",
          requirements: [
            { type: "skill", description: "Magic level 66", skill: "Magic", level: 66 },
          ],
        },
        {
          id: "diary-wilderness-hard-3",
          description: "Catch a Black Salamander in the Wilderness.",
          requirements: [
            { type: "skill", description: "Hunter level 67", skill: "Hunter", level: 67 },
          ],
        },
        {
          id: "diary-wilderness-hard-4",
          description: "Smith an Adamant scimitar in the Resource Area.\nNote: With 75 Woodcutting and 75 Firemaking, you can bring any axe and a tinderbox to cut and burn some magic logs for an elite task.",
          requirements: [
            { type: "skill", description: "Smithing level 75", skill: "Smithing", level: 75 },
          ],
        },
        {
          id: "diary-wilderness-hard-5",
          description: "Kill a Lava Dragon.\n''Note: Lava dragons are found on Lava Dragon Isle.",
          requirements: [
          ],
        },
        {
          id: "diary-wilderness-hard-6",
          description: "Kill the Chaos Elemental.",
          requirements: [
          ],
        },
        {
          id: "diary-wilderness-hard-7",
          description: "Kill the Crazy Arc., Chaos Fanatic & Scorpia.\nNote: While these bosses can be killed in any order, completing or updating any other task in-between will reset the progress for this task.",
          requirements: [
          ],
        },
        {
          id: "diary-wilderness-hard-8",
          description: "Take the agility shortcut from Trollheim into the Wilderness.\n''Note: Not to be confused with the rocky shortcut further north. The shortcut for this task goes in one direction, and cannot be used to leave the Wilderness again.",
          requirements: [
            { type: "skill", description: "Agility level 64", skill: "Agility", level: 64 },
          ],
        },
        {
          id: "diary-wilderness-hard-9",
          description: "Kill a Spiritual warrior in the Wilderness Godwars Dungeon.\n''Note: With 83 Slayer, you can also kill a spiritual mage here to complete an elite task",
          requirements: [
            { type: "skill", description: "Agility level 60", skill: "Agility", level: 60 },
            { type: "skill", description: "Strength level 60", skill: "Strength", level: 60 },
            { type: "skill", description: "Slayer level 68", skill: "Slayer", level: 68 },
          ],
        },
        {
          id: "diary-wilderness-hard-10",
          description: "Fish some Raw Lava Eel in the Wilderness.",
          requirements: [
            { type: "skill", description: "Fishing level 53", skill: "Fishing", level: 53 },
            { type: "skill", description: "Herblore level 25", skill: "Herblore", level: 25 },
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
          id: "diary-wilderness-elite-1",
          description: "Kill Callisto, Venenatis & Vet'ion.\nNote: The lesser versions of these bosses (Artio, Spindel, and Calvar'ion) also count towards this task. You must have claimed the rewards from the hard diary tasks before you can access these lesser bosses.\n\nWhile these bosses can be killed in any order, completing or updating any other task in-between will reset the progress for this task.",
          requirements: [
          ],
        },
        {
          id: "diary-wilderness-elite-2",
          description: "Teleport to Ghorrock.",
          requirements: [
            { type: "skill", description: "Magic level 96", skill: "Magic", level: 96 },
            { type: "quest", description: "Completion of Desert Treasure I" },
          ],
        },
        {
          id: "diary-wilderness-elite-3",
          description: "Fish and Cook a Dark Crab in the Resource Area.",
          requirements: [
            { type: "skill", description: "Fishing level 85", skill: "Fishing", level: 85 },
            { type: "skill", description: "Cooking level 90", skill: "Cooking", level: 90 },
          ],
        },
        {
          id: "diary-wilderness-elite-4",
          description: "Smith a rune scimitar from scratch in the Resource Area.\nNote: You must kill two Runite Golems and mine them for runite ores, smelt two runite bars in the nearby furnace, then smith the rune scimitar on the anvil. The step for mining the ore is still completed if it is destroyed by an infernal pickaxe.\n\nCompleting or updating any other task in-between these steps will reset the progress for this task.",
          requirements: [
            { type: "skill", description: "Mining level 85", skill: "Mining", level: 85 },
            { type: "skill", description: "Smithing level 90", skill: "Smithing", level: 90 },
          ],
        },
        {
          id: "diary-wilderness-elite-5",
          description: "Steal from the Rogues' chest.\n''Note: You must right-click the chest to search for traps. You'll then be attacked by all nearby rogues.",
          requirements: [
            { type: "skill", description: "Thieving level 84", skill: "Thieving", level: 84 },
          ],
        },
        {
          id: "diary-wilderness-elite-6",
          description: "Slay a spiritual mage inside the wilderness Godwars Dungeon.",
          requirements: [
            { type: "skill", description: "Agility level 60", skill: "Agility", level: 60 },
            { type: "skill", description: "Strength level 60", skill: "Strength", level: 60 },
            { type: "skill", description: "Slayer level 83", skill: "Slayer", level: 83 },
          ],
        },
        {
          id: "diary-wilderness-elite-7",
          description: "Cut and burn some magic logs in the Resource Area.\nNote: Logs burnt by an infernal axe do not count towards this task. Logs may also be burnt on the Forester's Campfire. Completing or updating any other task in-between these steps will reset the progress for this task.",
          requirements: [
            { type: "skill", description: "Woodcutting level 75", skill: "Woodcutting", level: 75 },
            { type: "skill", description: "Firemaking level 75", skill: "Firemaking", level: 75 },
          ],
        },
      ],
      rewards: [
      ],
    },
  ],
};
