import type { AchievementDiaryArea } from "@/types/guides";

export const ardougneDiary: AchievementDiaryArea = {
  id: "ardougne",
  name: "Ardougne",
  wikiUrl: "https://oldschool.runescape.wiki/w/Ardougne_Diary",
  tiers: [
    {
      tier: "easy" as AchievementDiaryArea["tiers"][number]["tier"],
      tasks: [
        {
          id: "diary-ardougne-easy-1",
          description: "Have Wizard Cromperty teleport you to the Rune Essence mine.\n''Note: You can right-click him to teleport.",
          requirements: [
            { type: "quest", description: "Completion of Rune Mysteries" },
          ],
        },
        {
          id: "diary-ardougne-easy-2",
          description: "Steal a cake from the Ardougne market stalls.",
          requirements: [
            { type: "skill", description: "Thieving level 5", skill: "Thieving", level: 5 },
          ],
        },
        {
          id: "diary-ardougne-easy-3",
          description: "Sell Silk to Silk trader in Ardougne for 60 coins each.\nNote: You must first offer to sell your silk for 120 coins, then counter his bid with 60 coins. He'll refuse to speak to you if you've just stolen from his silk stall, and his behaviour only resets after you've spent at least ten consecutive minutes outside of Ardougne without logging off.",
          requirements: [
          ],
        },
        {
          id: "diary-ardougne-easy-4",
          description: "Use the altar in East Ardougne's church.\nNote: Requires you to have less than full Prayer points.",
          requirements: [
          ],
        },
        {
          id: "diary-ardougne-easy-5",
          description: "Go out fishing on the Fishing Trawler\n''Note: You only have to start this minigame, completing it is optional.",
          requirements: [
          ],
        },
        {
          id: "diary-ardougne-easy-6",
          description: "Enter the Combat Training Camp north of W. Ardougne.",
          requirements: [
            { type: "quest", description: "Completion of Biohazard" },
          ],
        },
        {
          id: "diary-ardougne-easy-7",
          description: "Have Tindel Marchant identify a Rusted Sword for you.\n''Note: There is a 1/100 chance the sword turns out to be nothing, in which case you'll have to bring a new one.",
          requirements: [
          ],
        },
        {
          id: "diary-ardougne-easy-8",
          description: "Use the Ardougne Lever to teleport to the Wilderness.\n''Note: You can pull the lever there to return.",
          requirements: [
          ],
        },
        {
          id: "diary-ardougne-easy-9",
          description: "View Aleck's Hunter Emporium in Yanille.",
          requirements: [
          ],
        },
        {
          id: "diary-ardougne-easy-10",
          description: "Check what pets you have Insured with Probita in Ardougne.\n''Note: You can right-click her to check.",
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
          id: "diary-ardougne-medium-1",
          description: "Enter the Unicorn pen in Ardougne zoo using Fairy rings.",
          requirements: [
          ],
        },
        {
          id: "diary-ardougne-medium-2",
          description: "Grapple over Yanille's south wall.",
          requirements: [
            { type: "skill", description: "Agility level 39", skill: "Agility", level: 39 },
            { type: "skill", description: "Strength level 38", skill: "Strength", level: 38 },
            { type: "skill", description: "Ranged level 21", skill: "Ranged", level: 21 },
          ],
        },
        {
          id: "diary-ardougne-medium-3",
          description: "Harvest some strawberries from the Ardougne farming patch.",
          requirements: [
            { type: "skill", description: "Farming level 31", skill: "Farming", level: 31 },
          ],
        },
        {
          id: "diary-ardougne-medium-4",
          description: "Cast the Ardougne Teleport spell.",
          requirements: [
            { type: "skill", description: "Magic level 51", skill: "Magic", level: 51 },
            { type: "quest", description: "Completion of Plague City" },
          ],
        },
        {
          id: "diary-ardougne-medium-5",
          description: "Travel to Castlewars by Hot Air Balloon.",
          requirements: [
            { type: "skill", description: "Firemaking level 50", skill: "Firemaking", level: 50 },
            { type: "quest", description: "Completion of Enlightened Journey" },
          ],
        },
        {
          id: "diary-ardougne-medium-6",
          description: "Claim buckets of sand from Bert in Yanille.\n''Note: Ultimate Ironmen must instead fill a bucket with sand from Bert's sand pit.",
          requirements: [
            { type: "quest", description: "Completion of The Hand in the Sand" },
          ],
        },
        {
          id: "diary-ardougne-medium-7",
          description: "Catch any fish on the Fishing Platform.",
          requirements: [
          ],
        },
        {
          id: "diary-ardougne-medium-8",
          description: "Pickpocket the master farmer north of Ardougne.",
          requirements: [
            { type: "skill", description: "Thieving level 38", skill: "Thieving", level: 38 },
          ],
        },
        {
          id: "diary-ardougne-medium-9",
          description: "Collect some Nightshade from the Skavid Caves.\nNote: It can be found in the northernmost cave.",
          requirements: [
          ],
        },
        {
          id: "diary-ardougne-medium-10",
          description: "Kill a swordchick in the Tower of Life.",
          requirements: [
            { type: "quest", description: "Completion of Tower of Life" },
          ],
        },
        {
          id: "diary-ardougne-medium-11",
          description: "Equip Iban's upgraded staff or upgrade an Iban staff.\nNote: You can upgrade the staff without equipping it.",
          requirements: [
            { type: "quest", description: "Completion of Underground Pass" },
          ],
        },
        {
          id: "diary-ardougne-medium-12",
          description: "Visit the Island East of the Necromancer's tower.",
          requirements: [
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
          id: "diary-ardougne-hard-1",
          description: "Recharge some Jewellery at the Totem in the Legends Guild.",
          requirements: [
            { type: "quest", description: "Completion of Legends' Quest" },
          ],
        },
        {
          id: "diary-ardougne-hard-2",
          description: "Enter the Magic Guild.",
          requirements: [
            { type: "skill", description: "Magic level 66", skill: "Magic", level: 66 },
          ],
        },
        {
          id: "diary-ardougne-hard-3",
          description: "Steal from a chest in Ardougne Castle.",
          requirements: [
            { type: "skill", description: "Thieving level 72", skill: "Thieving", level: 72 },
          ],
        },
        {
          id: "diary-ardougne-hard-4",
          description: "Have a zookeeper put you in Ardougne Zoo's monkey cage.",
          requirements: [
          ],
        },
        {
          id: "diary-ardougne-hard-5",
          description: "Teleport to the Watchtower.",
          requirements: [
            { type: "skill", description: "Magic level 58", skill: "Magic", level: 58 },
            { type: "quest", description: "Completion of Watchtower" },
          ],
        },
        {
          id: "diary-ardougne-hard-6",
          description: "Catch a Red Salamander.",
          requirements: [
            { type: "skill", description: "Hunter level 59", skill: "Hunter", level: 59 },
          ],
        },
        {
          id: "diary-ardougne-hard-7",
          description: "Check the health of a Palm tree near tree gnome village.\n''Note: This is the farming patch next to Gileth.",
          requirements: [
            { type: "skill", description: "Farming level 68", skill: "Farming", level: 68 },
          ],
        },
        {
          id: "diary-ardougne-hard-8",
          description: "Pick some Poison Ivy berries from the patch south of Ardougne.\n''Note: This patch is located next to the Ardougne Monastery.",
          requirements: [
            { type: "skill", description: "Farming level 70", skill: "Farming", level: 70 },
          ],
        },
        {
          id: "diary-ardougne-hard-9",
          description: "Smith a Mithril platebody near Ardougne.\nNote: You'll have to use the Port Khazard, Yanille, or West Ardougne anvil for this.",
          requirements: [
            { type: "skill", description: "Smithing level 68", skill: "Smithing", level: 68 },
          ],
        },
        {
          id: "diary-ardougne-hard-10",
          description: "Enter your POH from Yanille.",
          requirements: [
            { type: "skill", description: "Construction level 50", skill: "Construction", level: 50 },
          ],
        },
        {
          id: "diary-ardougne-hard-11",
          description: "Smith a Dragon sq shield in West Ardougne.",
          requirements: [
            { type: "skill", description: "Smithing level 60", skill: "Smithing", level: 60 },
          ],
        },
        {
          id: "diary-ardougne-hard-12",
          description: "Craft some Death runes from Essence.\n''Note: Entering the Death Altar from the Mourner Headquarters is not recommended after the quest. It follows a lengthy route that requires mourner gear, the crystal trinket, the new key, and a death talisman/tiara or catalytic talisman/tiara. It's even possible to lock yourself out of this entrance with the light puzzle, which may require you to enter it via the Abyss anyway to change the rotation of the mirrors again.",
          requirements: [
            { type: "skill", description: "Runecraft level 65", skill: "Runecraft", level: 65 },
            { type: "quest", description: "Completion of Mourning's End Part II" },
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
          id: "diary-ardougne-elite-1",
          description: "Catch a Manta ray in the Fishing Trawler and cook it in Port Khazard.\nNote: Completing or updating any other task in-between these steps will reset the progress for this task.",
          requirements: [
            { type: "skill", description: "Fishing level 81", skill: "Fishing", level: 81 },
            { type: "skill", description: "Cooking level 91", skill: "Cooking", level: 91 },
          ],
        },
        {
          id: "diary-ardougne-elite-2",
          description: "Picklock the door to the basement of Yanille Agility Dungeon.",
          requirements: [
            { type: "skill", description: "Thieving level 82", skill: "Thieving", level: 82 },
          ],
        },
        {
          id: "diary-ardougne-elite-3",
          description: "Pickpocket a Hero.",
          requirements: [
            { type: "skill", description: "Thieving level 80", skill: "Thieving", level: 80 },
          ],
        },
        {
          id: "diary-ardougne-elite-4",
          description: "Make a rune crossbow yourself from scratch within Witchaven or Yanille.\n\nNote: You must use the spinning wheel in Witchaven to make the crossbow string and the anvil in Yanille to make the runite limbs. Fletching the yew stock and completing the rune crossbow can be done in either settlement. Completing or updating any other task in-between these steps will reset the progress for this task.",
          requirements: [
            { type: "skill", description: "Crafting level 10", skill: "Crafting", level: 10 },
            { type: "skill", description: "Smithing level 91", skill: "Smithing", level: 91 },
            { type: "skill", description: "Fletching level 69", skill: "Fletching", level: 69 },
          ],
        },
        {
          id: "diary-ardougne-elite-5",
          description: "Imbue a Salve amulet at Nightmare Zone, or equip a Salve amulet that was imbued there.\nNote: You cannot use a Scroll of imbuing from Emir's Arena or use Zeal Tokens from Soul Wars. In Deadman Mode, the task is \"Attempt to equip an imbued Salve amulet at the Nightmare Zone plinth.\"",
          requirements: [
          ],
        },
        {
          id: "diary-ardougne-elite-6",
          description: "Pick some Torstol from the patch north of Ardougne.",
          requirements: [
            { type: "skill", description: "Farming level 85", skill: "Farming", level: 85 },
          ],
        },
        {
          id: "diary-ardougne-elite-7",
          description: "Complete a lap of Ardougne's rooftop agility course.",
          requirements: [
            { type: "skill", description: "Agility level 90", skill: "Agility", level: 90 },
          ],
        },
        {
          id: "diary-ardougne-elite-8",
          description: "Cast Ice Barrage on another player within Castle Wars.\n''Note: You have to successfully hit the player, so multiple casts are recommended. In Deadman Mode, the task is \"Visit the Castle Wars lobby with at least 94 Magic after completing Desert Treasure I.\"",
          requirements: [
            { type: "skill", description: "Magic level 94", skill: "Magic", level: 94 },
            { type: "quest", description: "Completion of Desert Treasure I" },
          ],
        },
      ],
      rewards: [
      ],
    },
  ],
};
