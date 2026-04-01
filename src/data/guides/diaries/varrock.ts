import type { AchievementDiaryArea } from "@/types/guides";

export const varrockDiary: AchievementDiaryArea = {
  id: "varrock",
  name: "Varrock",
  wikiUrl: "https://oldschool.runescape.wiki/w/Varrock_Diary",
  tiers: [
    {
      tier: "easy" as AchievementDiaryArea["tiers"][number]["tier"],
      tasks: [
        {
          id: "diary-varrock-easy-1",
          description: "{| class=\"wikitable lighttable qc-active diary-table\" style=width:750px; data-diary-name=\"Varrock\" data-diary-tier=\"Easy\"\n! style=\"width:50%;\" | Task\n! style=\"width:50%;\" | Requirements",
          requirements: [
          ],
        },
        {
          id: "diary-varrock-easy-2",
          description: "Browse Thessalia's store.",
          requirements: [
          ],
        },
        {
          id: "diary-varrock-easy-3",
          description: "Have Aubury teleport you to the Essence mine.\nNote: You can right-click him to teleport.",
          requirements: [
            { type: "quest", description: "Completion of Rune Mysteries" },
          ],
        },
        {
          id: "diary-varrock-easy-4",
          description: "Mine some Iron in the south-east mining patch near Varrock.",
          requirements: [
            { type: "skill", description: "Mining level 15", skill: "Mining", level: 15 },
          ],
        },
        {
          id: "diary-varrock-easy-5",
          description: "Make a normal plank at the Sawmill.",
          requirements: [
          ],
        },
        {
          id: "diary-varrock-easy-6",
          description: "Enter the second level of the Stronghold of Security.",
          requirements: [
          ],
        },
        {
          id: "diary-varrock-easy-7",
          description: "Jump over the fence south of Varrock.",
          requirements: [
            { type: "skill", description: "Agility level 13", skill: "Agility", level: 13 },
          ],
        },
        {
          id: "diary-varrock-easy-8",
          description: "Chop down a dying tree in the Lumber Yard.",
          requirements: [
          ],
        },
        {
          id: "diary-varrock-easy-9",
          description: "Buy a newspaper.\nNote: Can be bought from Benny in Varrock Square.",
          requirements: [
          ],
        },
        {
          id: "diary-varrock-easy-10",
          description: "Give a dog a bone!\nNote: This does not count when done during the investigation segment of Children of the Sun.",
          requirements: [
          ],
        },
        {
          id: "diary-varrock-easy-11",
          description: "Spin a bowl on the pottery wheel and fire it in the oven in Barb Village.",
          requirements: [
            { type: "skill", description: "Crafting level 8", skill: "Crafting", level: 8 },
          ],
        },
        {
          id: "diary-varrock-easy-12",
          description: "Speak to Haig Halen after obtaining at least 50 Kudos.",
          requirements: [
          ],
        },
        {
          id: "diary-varrock-easy-13",
          description: "Craft some Earth runes from Essence.",
          requirements: [
            { type: "skill", description: "Runecraft level 9", skill: "Runecraft", level: 9 },
          ],
        },
        {
          id: "diary-varrock-easy-14",
          description: "Catch some trout in the River Lum at Barbarian Village.",
          requirements: [
            { type: "skill", description: "Fishing level 20", skill: "Fishing", level: 20 },
          ],
        },
        {
          id: "diary-varrock-easy-15",
          description: "Steal from the Tea stall in Varrock.",
          requirements: [
            { type: "skill", description: "Thieving level 5", skill: "Thieving", level: 5 },
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
          id: "diary-varrock-medium-1",
          description: "{| class=\"wikitable lighttable qc-active diary-table\" style=width:750px; data-diary-name=\"Varrock\" data-diary-tier=\"Medium\"\n! style=\"width:50%;\" | Task\n! style=\"width:50%;\" | Requirements",
          requirements: [
          ],
        },
        {
          id: "diary-varrock-medium-2",
          description: "Have the Apothecary in Varrock make you a strength potion.",
          requirements: [
          ],
        },
        {
          id: "diary-varrock-medium-3",
          description: "Enter the Champions' Guild.",
          requirements: [
            { type: "skill", description: "Quest level 32", skill: "Quest", level: 32 },
          ],
        },
        {
          id: "diary-varrock-medium-4",
          description: "Select a colour for your kitten.\nNote: You can only have one kitten (or cat) following you at a time. If you already have one, you'll have to shoo it away, store it in a menagerie, or sell it for death runes to West Ardougne civilians. Storing it in your inventory or bank does not allow you to purchase a new one.",
          requirements: [
            { type: "quest", description: "Completion of Gertrude's Cat" },
          ],
        },
        {
          id: "diary-varrock-medium-5",
          description: "Use the spirit tree north of Varrock.\n''Note: This tree is located in the north-eastern corner of the Grand Exchange.",
          requirements: [
            { type: "quest", description: "Completion of Tree Gnome Village" },
          ],
        },
        {
          id: "diary-varrock-medium-6",
          description: "Perform the 4 emotes from the Stronghold of Security.",
          requirements: [
          ],
        },
        {
          id: "diary-varrock-medium-7",
          description: "Enter the Tolna dungeon after completing A Soul's Bane.",
          requirements: [
            { type: "quest", description: "Completion of A Soul's Bane" },
          ],
        },
        {
          id: "diary-varrock-medium-8",
          description: "Teleport to the digsite using a Digsite pendant.",
          requirements: [
            { type: "skill", description: "Magic level 49", skill: "Magic", level: 49 },
            { type: "quest", description: "Completion of The Dig Site" },
          ],
        },
        {
          id: "diary-varrock-medium-9",
          description: "Cast the teleport to Varrock spell.",
          requirements: [
            { type: "skill", description: "Magic level 25", skill: "Magic", level: 25 },
          ],
        },
        {
          id: "diary-varrock-medium-10",
          description: "Get a Slayer task from Vannaka.",
          requirements: [
            { type: "skill", description: "Combat level 40", skill: "Combat", level: 40 },
          ],
        },
        {
          id: "diary-varrock-medium-11",
          description: "Make 20 Mahogany Planks in one go.\nNote: You can right-click the Sawmill operator to turn your logs into planks. You'll always need 20 mahogany logs, regardless of whether you're using sawmill vouchers.",
          requirements: [
          ],
        },
        {
          id: "diary-varrock-medium-12",
          description: "Pick a White tree fruit.",
          requirements: [
            { type: "skill", description: "Farming level 25", skill: "Farming", level: 25 },
            { type: "quest", description: "Completion of Garden of Tranquillity" },
          ],
        },
        {
          id: "diary-varrock-medium-13",
          description: "Use the balloon to travel from Varrock.\nNote: The destination does not matter for this task. You can even pick a locked destination and not take the trip.",
          requirements: [
            { type: "skill", description: "Farming level 30", skill: "Farming", level: 30 },
            { type: "skill", description: "Firemaking level 40", skill: "Firemaking", level: 40 },
            { type: "quest", description: "Completion of Enlightened Journey" },
          ],
        },
        {
          id: "diary-varrock-medium-14",
          description: "Complete a lap of the Varrock Agility course.",
          requirements: [
            { type: "skill", description: "Agility level 30", skill: "Agility", level: 30 },
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
          id: "diary-varrock-hard-1",
          description: "{| class=\"wikitable lighttable qc-active diary-table\" style=\"width:750px;\" data-diary-name=\"Varrock\" data-diary-tier=\"Hard\"\n! style=\"width:50%;\" | Task\n! style=\"width:50%;\" | Requirements",
          requirements: [
          ],
        },
        {
          id: "diary-varrock-hard-2",
          description: "Trade furs with the Fancy Dress Seller for a spottier cape and equip it.",
          requirements: [
            { type: "skill", description: "Hunter level 66", skill: "Hunter", level: 66 },
            { type: "skill", description: "Hunter level 69", skill: "Hunter", level: 69 },
          ],
        },
        {
          id: "diary-varrock-hard-3",
          description: "Speak to Orlando Smith when you have achieved 153 Kudos.",
          requirements: [
          ],
        },
        {
          id: "diary-varrock-hard-4",
          description: "Make a Waka canoe near Edgeville.",
          requirements: [
            { type: "skill", description: "Woodcutting level 57", skill: "Woodcutting", level: 57 },
          ],
        },
        {
          id: "diary-varrock-hard-5",
          description: "Teleport to Paddewwa.",
          requirements: [
            { type: "skill", description: "Magic level 54", skill: "Magic", level: 54 },
            { type: "quest", description: "Completion of Desert Treasure I" },
          ],
        },
        {
          id: "diary-varrock-hard-6",
          description: "Teleport to Barbarian Village with a skull sceptre.",
          requirements: [
          ],
        },
        {
          id: "diary-varrock-hard-7",
          description: "Chop some yew logs in Varrock and burn them at the top of the Varrock church.\nNote: There is a yew tree next to the church. Completing or updating any other task in-between these steps will reset the progress for this task. In Deadman Mode, the task is instead \"Burn some Yew logs at the top of the Varrock church with 60 Woodcutting.\"",
          requirements: [
            { type: "skill", description: "Woodcutting level 60", skill: "Woodcutting", level: 60 },
            { type: "skill", description: "Firemaking level 60", skill: "Firemaking", level: 60 },
          ],
        },
        {
          id: "diary-varrock-hard-8",
          description: "Have the Varrock estate agent decorate your house with Fancy Stone.\nNote: You must finish the dialogue or the task will not count as completed.",
          requirements: [
            { type: "skill", description: "Construction level 50", skill: "Construction", level: 50 },
          ],
        },
        {
          id: "diary-varrock-hard-9",
          description: "Collect at least 2 yew roots from the Tree patch in Varrock Palace.\n''Note: While 60 Farming is required to grow the yew tree, you'll need 68 Farming to dig up more than a single root.",
          requirements: [
            { type: "skill", description: "Farming level 68", skill: "Farming", level: 68 },
            { type: "skill", description: "Woodcutting level 60", skill: "Woodcutting", level: 60 },
          ],
        },
        {
          id: "diary-varrock-hard-10",
          description: "Pray at the altar in Varrock palace with Smite active.\n''Note: The altar is found on the  of the palace.",
          requirements: [
            { type: "skill", description: "Prayer level 52", skill: "Prayer", level: 52 },
          ],
        },
        {
          id: "diary-varrock-hard-11",
          description: "Squeeze through the obstacle pipe in Edgeville dungeon.",
          requirements: [
            { type: "skill", description: "Agility level 51", skill: "Agility", level: 51 },
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
          id: "diary-varrock-elite-1",
          description: "{| class=\"wikitable lighttable qc-active diary-table\" style=\"width:750px;\" data-diary-name=\"Varrock\" data-diary-tier=\"Elite\"\n! style=\"width:50%;\" |Task\n! style=\"width:50%;\" |Requirements",
          requirements: [
          ],
        },
        {
          id: "diary-varrock-elite-2",
          description: "Create a super combat potion in Varrock west bank.",
          requirements: [
            { type: "skill", description: "Herblore level 90", skill: "Herblore", level: 90 },
            { type: "quest", description: "Completion of Druidic Ritual" },
          ],
        },
        {
          id: "diary-varrock-elite-3",
          description: "Use Lunar magic to make 20 mahogany planks at the Lumberyard.\nNote: You must stand within the Lumber Yard, past the fence.",
          requirements: [
            { type: "skill", description: "Magic level 86", skill: "Magic", level: 86 },
            { type: "quest", description: "Completion of Dream Mentor" },
          ],
        },
        {
          id: "diary-varrock-elite-4",
          description: "Bake a summer pie in the Cooking Guild.\n''Note: Instead of using a range, you can use the Bake Pie spell to prevent burning the pie.",
          requirements: [
            { type: "skill", description: "Cooking level 95", skill: "Cooking", level: 95 },
          ],
        },
        {
          id: "diary-varrock-elite-5",
          description: "Smith and fletch ten rune darts within Varrock.",
          requirements: [
            { type: "skill", description: "Smithing level 89", skill: "Smithing", level: 89 },
            { type: "skill", description: "Fletching level 81", skill: "Fletching", level: 81 },
            { type: "quest", description: "Completion of The Tourist Trap" },
          ],
        },
        {
          id: "diary-varrock-elite-6",
          description: "Craft 100 or more earth runes simultaneously from Essence without the use of Extracts.",
          requirements: [
            { type: "skill", description: "Runecraft level 78", skill: "Runecraft", level: 78 },
            { type: "skill", description: "Runecraft level 52", skill: "Runecraft", level: 52 },
          ],
        },
      ],
      rewards: [
      ],
    },
  ],
};
