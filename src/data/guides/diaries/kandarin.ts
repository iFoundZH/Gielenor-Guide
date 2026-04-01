import type { AchievementDiaryArea } from "@/types/guides";

export const kandarinDiary: AchievementDiaryArea = {
  id: "kandarin",
  name: "Kandarin",
  wikiUrl: "https://oldschool.runescape.wiki/w/Kandarin_Diary",
  tiers: [
    {
      tier: "easy" as AchievementDiaryArea["tiers"][number]["tier"],
      tasks: [
        {
          id: "diary-kandarin-easy-1",
          description: "{| class=\"wikitable lighttable qc-active diary-table\" style=width:750px; data-diary-name=\"Kandarin\" data-diary-tier=\"Easy\"\n! style=\"width:50%;\" | Task\n! style=\"width:50%;\" | Requirements",
          requirements: [
          ],
        },
        {
          id: "diary-kandarin-easy-2",
          description: "Catch a Mackerel at Catherby.",
          requirements: [
            { type: "skill", description: "Fishing level 16", skill: "Fishing", level: 16 },
          ],
        },
        {
          id: "diary-kandarin-easy-3",
          description: "Buy a candle from the Chandler in Catherby.",
          requirements: [
          ],
        },
        {
          id: "diary-kandarin-easy-4",
          description: "Collect five Flax from the Seers' flax fields.",
          requirements: [
          ],
        },
        {
          id: "diary-kandarin-easy-5",
          description: "Play the Organ in Seers' church.",
          requirements: [
          ],
        },
        {
          id: "diary-kandarin-easy-6",
          description: "Plant some Jute seeds in the patch north of McGrubor's Wood.\nNote: This is the farming patch next to Rhonen.",
          requirements: [
            { type: "skill", description: "Farming level 13", skill: "Farming", level: 13 },
          ],
        },
        {
          id: "diary-kandarin-easy-7",
          description: "Have Galahad make you a cup of tea.",
          requirements: [
          ],
        },
        {
          id: "diary-kandarin-easy-8",
          description: "Defeat one of each elemental in the workshop.\n''Note: These are the earth, water, air, and fire elemental found on the  of the workshop.",
          requirements: [
          ],
        },
        {
          id: "diary-kandarin-easy-9",
          description: "Get a pet fish from Harry in Catherby.\nNote: You have to talk to Harry with all required items in your inventory.",
          requirements: [
          ],
        },
        {
          id: "diary-kandarin-easy-10",
          description: "Buy a Stew from the Seers' pub.",
          requirements: [
          ],
        },
        {
          id: "diary-kandarin-easy-11",
          description: "Speak to Sherlock.",
          requirements: [
          ],
        },
        {
          id: "diary-kandarin-easy-12",
          description: "Cross the Coal truck log shortcut.\n''Note: You can take a pickaxe to mine coal here to complete a medium task.",
          requirements: [
            { type: "skill", description: "Agility level 20", skill: "Agility", level: 20 },
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
          id: "diary-kandarin-medium-1",
          description: "{| class=\"wikitable lighttable qc-active diary-table\" style=width:750px; data-diary-name=\"Kandarin\" data-diary-tier=\"Medium\"\n! style=\"width:50%;\" | Task\n! style=\"width:50%;\" | Requirements",
          requirements: [
          ],
        },
        {
          id: "diary-kandarin-medium-2",
          description: "Complete a lap of the Barbarian agility course.",
          requirements: [
            { type: "skill", description: "Agility level 35", skill: "Agility", level: 35 },
            { type: "quest", description: "Completion of Alfred Grimhand's Barcrawl" },
          ],
        },
        {
          id: "diary-kandarin-medium-3",
          description: "Create a Super Antipoison potion from scratch in the Seers/Catherby Area.\nNote: Completing or updating any other task in-between adding ingredients will reset the progress for this task.",
          requirements: [
            { type: "skill", description: "Herblore level 48", skill: "Herblore", level: 48 },
          ],
        },
        {
          id: "diary-kandarin-medium-4",
          description: "Enter the Ranging guild.",
          requirements: [
            { type: "skill", description: "Ranged level 40", skill: "Ranged", level: 40 },
          ],
        },
        {
          id: "diary-kandarin-medium-5",
          description: "Use the grapple shortcut to get from the water obelisk to Catherby shore.\n''Note: With 56 Magic, you can bring an unpowered orb and runes for Charge Water Orb to complete a hard task.",
          requirements: [
            { type: "skill", description: "Agility level 36", skill: "Agility", level: 36 },
            { type: "skill", description: "Strength level 22", skill: "Strength", level: 22 },
            { type: "skill", description: "Ranged level 39", skill: "Ranged", level: 39 },
            { type: "skill", description: "Agility level 70", skill: "Agility", level: 70 },
          ],
        },
        {
          id: "diary-kandarin-medium-6",
          description: "Catch and cook a Bass in Catherby.\nNote: Completing or updating any other task in-between these steps will reset the progress for this task.",
          requirements: [
            { type: "skill", description: "Fishing level 46", skill: "Fishing", level: 46 },
            { type: "skill", description: "Cooking level 43", skill: "Cooking", level: 43 },
          ],
        },
        {
          id: "diary-kandarin-medium-7",
          description: "Teleport to Camelot.",
          requirements: [
            { type: "skill", description: "Magic level 45", skill: "Magic", level: 45 },
          ],
        },
        {
          id: "diary-kandarin-medium-8",
          description: "String a Maple shortbow in Seers' Village bank.",
          requirements: [
            { type: "skill", description: "Fletching level 50", skill: "Fletching", level: 50 },
          ],
        },
        {
          id: "diary-kandarin-medium-9",
          description: "Pick some Limpwurt root from the farming patch in Catherby.\nNote: This is the flower patch next to Dantaera.",
          requirements: [
            { type: "skill", description: "Farming level 26", skill: "Farming", level: 26 },
          ],
        },
        {
          id: "diary-kandarin-medium-10",
          description: "Create a Mind helmet.\nNote: This task is automatically completed during Elemental Workshop II.",
          requirements: [
          ],
        },
        {
          id: "diary-kandarin-medium-11",
          description: "Kill a Fire Giant inside Baxtorian Waterfall.",
          requirements: [
          ],
        },
        {
          id: "diary-kandarin-medium-12",
          description: "Complete a wave of Barbarian Assault.",
          requirements: [
          ],
        },
        {
          id: "diary-kandarin-medium-13",
          description: "Steal from the chest in Hemenster.\n''Note: This chest is located in the building between the buildings with the range and anvil.",
          requirements: [
            { type: "skill", description: "Thieving level 47", skill: "Thieving", level: 47 },
          ],
        },
        {
          id: "diary-kandarin-medium-14",
          description: "Travel to McGrubor's Wood by Fairy Ring.",
          requirements: [
          ],
        },
        {
          id: "diary-kandarin-medium-15",
          description: "Mine some coal near the coal trucks.",
          requirements: [
            { type: "skill", description: "Mining level 30", skill: "Mining", level: 30 },
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
          id: "diary-kandarin-hard-1",
          description: "{| class=\"wikitable lighttable qc-active diary-table\" style=width:750px; data-diary-name=\"Kandarin\" data-diary-tier=\"Hard\"\n! style=\"width:50%;\" | Task\n! style=\"width:50%;\" | Requirements",
          requirements: [
          ],
        },
        {
          id: "diary-kandarin-hard-2",
          description: "Catch a Leaping Sturgeon.\n''Note: Must be caught at Otto's Grotto for this task.",
          requirements: [
            { type: "skill", description: "Fishing level 70", skill: "Fishing", level: 70 },
            { type: "skill", description: "Agility level 45", skill: "Agility", level: 45 },
            { type: "skill", description: "Strength level 45", skill: "Strength", level: 45 },
          ],
        },
        {
          id: "diary-kandarin-hard-3",
          description: "Complete a lap of the Seers' Village agility course.",
          requirements: [
            { type: "skill", description: "Agility level 60", skill: "Agility", level: 60 },
          ],
        },
        {
          id: "diary-kandarin-hard-4",
          description: "Create a Yew Longbow from scratch around Seers' Village.\nNote: This requires chopping a yew tree in the village, cutting the yew logs into a yew longbow (u), then finishing it with a bow string. Completing or updating any other task in-between these steps will reset the progress for this task.",
          requirements: [
            { type: "skill", description: "Fletching level 70", skill: "Fletching", level: 70 },
            { type: "skill", description: "Woodcutting level 60", skill: "Woodcutting", level: 60 },
          ],
        },
        {
          id: "diary-kandarin-hard-5",
          description: "Enter the Seers' Village courthouse with piety turned on.",
          requirements: [
            { type: "skill", description: "Prayer level 70", skill: "Prayer", level: 70 },
            { type: "skill", description: "Defence level 70", skill: "Defence", level: 70 },
            { type: "quest", description: "Completion of King's Ransom" },
          ],
        },
        {
          id: "diary-kandarin-hard-6",
          description: "Charge a Water Orb.",
          requirements: [
            { type: "skill", description: "Magic level 56", skill: "Magic", level: 56 },
            { type: "skill", description: "Agility level 70", skill: "Agility", level: 70 },
          ],
        },
        {
          id: "diary-kandarin-hard-7",
          description: "Burn some Maple logs with a bow in Seers' Village.",
          requirements: [
            { type: "skill", description: "Firemaking level 65", skill: "Firemaking", level: 65 },
          ],
        },
        {
          id: "diary-kandarin-hard-8",
          description: "Kill a Shadow Hound in the Shadow dungeon.",
          requirements: [
            { type: "skill", description: "Thieving level 53", skill: "Thieving", level: 53 },
          ],
        },
        {
          id: "diary-kandarin-hard-9",
          description: "Kill a Mithril Dragon.\nNote: The mithril dragon fought during Dragon Slayer II does not count for this task.",
          requirements: [
          ],
        },
        {
          id: "diary-kandarin-hard-10",
          description: "Purchase and equip a granite body from Barbarian Assault.\n''Note: This requires having defeated the Penance Queen at the end of Barbarian Assault. Buying and equipping the granite body counts as two separate steps, and completing or updating any other task in-between these steps will reset the progress for this task.",
          requirements: [
            { type: "skill", description: "Strength level 50", skill: "Strength", level: 50 },
            { type: "skill", description: "Defence level 50", skill: "Defence", level: 50 },
          ],
        },
        {
          id: "diary-kandarin-hard-11",
          description: "Have the Seers' estate agent decorate your house with Fancy Stone.\nNote: You must finish the dialogue or the task will not count as completed.",
          requirements: [
            { type: "skill", description: "Construction level 50", skill: "Construction", level: 50 },
          ],
        },
        {
          id: "diary-kandarin-hard-12",
          description: "Smith an Adamant spear at Otto's Grotto.",
          requirements: [
            { type: "skill", description: "Smithing level 75", skill: "Smithing", level: 75 },
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
          id: "diary-kandarin-elite-1",
          description: "{| class=\"wikitable lighttable qc-active diary-table\" style=width:750px; data-diary-name=\"Kandarin\" data-diary-tier=\"Elite\"\n! style=\"width:50%;\" | Task\n! style=\"width:50%;\" | Requirements",
          requirements: [
          ],
        },
        {
          id: "diary-kandarin-elite-2",
          description: "Read the Blackboard at Barbarian Assault after reaching level 5 in every role.\nNote: These levels are bought with honour points. Assuming no points are spent on armour or gambles, you'll need a total of 5,600 points (1,400 per role). In Deadman Mode, the task is instead \"Read the Blackboard at Barbarian Assault after finishing your training.\"",
          requirements: [
          ],
        },
        {
          id: "diary-kandarin-elite-3",
          description: "Pick some Dwarf weed from the herb patch at Catherby.\nNote: This is the herb patch next to Dantaera.",
          requirements: [
            { type: "skill", description: "Farming level 79", skill: "Farming", level: 79 },
          ],
        },
        {
          id: "diary-kandarin-elite-4",
          description: "Fish and Cook 5 Sharks in Catherby using the Cooking gauntlets.\nNote: You specifically have to use the range in the building between the Catherby bank and the archery shop, the one in the building immediately north of that doesn't count.\n\nExtra sharks provided by Rada's blessing don't add up to the required number. Completing or updating any other task in-between these steps will reset the progress for this task.",
          requirements: [
            { type: "skill", description: "Fishing level 76", skill: "Fishing", level: 76 },
            { type: "skill", description: "Cooking level 80", skill: "Cooking", level: 80 },
            { type: "quest", description: "Completion of Family Crest" },
          ],
        },
        {
          id: "diary-kandarin-elite-5",
          description: "Mix a Stamina Mix on top of the Seers' Village bank.\n''Note: You have to start the Seers' Village Agility Course to climb on top of the bank.",
          requirements: [
            { type: "skill", description: "Herblore level 86", skill: "Herblore", level: 86 },
            { type: "skill", description: "Agility level 60", skill: "Agility", level: 60 },
          ],
        },
        {
          id: "diary-kandarin-elite-6",
          description: "Smith a Rune Hasta at Otto's Grotto.",
          requirements: [
            { type: "skill", description: "Smithing level 90", skill: "Smithing", level: 90 },
          ],
        },
        {
          id: "diary-kandarin-elite-7",
          description: "Construct a Pyre ship from Magic Logs.\nNote: You must use chewed bones for the ship, not mangled bones.",
          requirements: [
            { type: "skill", description: "Firemaking level 85", skill: "Firemaking", level: 85 },
            { type: "skill", description: "Crafting level 85", skill: "Crafting", level: 85 },
          ],
        },
        {
          id: "diary-kandarin-elite-8",
          description: "Teleport to Catherby.",
          requirements: [
            { type: "skill", description: "Magic level 87", skill: "Magic", level: 87 },
            { type: "quest", description: "Completion of Lunar Diplomacy" },
          ],
        },
      ],
      rewards: [
      ],
    },
  ],
};
