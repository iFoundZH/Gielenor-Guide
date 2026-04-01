import type { AchievementDiaryArea } from "@/types/guides";

export const lumbridge_draynorDiary: AchievementDiaryArea = {
  id: "lumbridge-draynor",
  name: "Lumbridge & Draynor",
  wikiUrl: "https://oldschool.runescape.wiki/w/Lumbridge_&_Draynor_Diary",
  tiers: [
    {
      tier: "easy" as AchievementDiaryArea["tiers"][number]["tier"],
      tasks: [
        {
          id: "diary-lumbridge-draynor-easy-1",
          description: "Complete a lap of the Draynor Village agility course.",
          requirements: [
          ],
        },
        {
          id: "diary-lumbridge-draynor-easy-2",
          description: "Slay a Cave bug beneath Lumbridge Swamp.",
          requirements: [
            { type: "skill", description: "Slayer level 7", skill: "Slayer", level: 7 },
          ],
        },
        {
          id: "diary-lumbridge-draynor-easy-3",
          description: "Have Sedridor teleport you to the Rune essence mine.",
          requirements: [
            { type: "quest", description: "Completion of Rune Mysteries" },
          ],
        },
        {
          id: "diary-lumbridge-draynor-easy-4",
          description: "Craft some water runes from Essence.",
          requirements: [
            { type: "skill", description: "Runecraft level 5", skill: "Runecraft", level: 5 },
          ],
        },
        {
          id: "diary-lumbridge-draynor-easy-5",
          description: "Learn your age from Hans in Lumbridge.",
          requirements: [
          ],
        },
        {
          id: "diary-lumbridge-draynor-easy-6",
          description: "Pickpocket a man or woman in Lumbridge.",
          requirements: [
          ],
        },
        {
          id: "diary-lumbridge-draynor-easy-7",
          description: "Chop and burn some oak logs in Lumbridge.",
          requirements: [
            { type: "skill", description: "Woodcutting level 15", skill: "Woodcutting", level: 15 },
            { type: "skill", description: "Firemaking level 15", skill: "Firemaking", level: 15 },
          ],
        },
        {
          id: "diary-lumbridge-draynor-easy-8",
          description: "Kill a Zombie in Draynor Sewers.",
          requirements: [
          ],
        },
        {
          id: "diary-lumbridge-draynor-easy-9",
          description: "Catch some Anchovies in Al Kharid.",
          requirements: [
            { type: "skill", description: "Fishing level 15", skill: "Fishing", level: 15 },
          ],
        },
        {
          id: "diary-lumbridge-draynor-easy-10",
          description: "Bake some Bread on the Lumbridge kitchen range.",
          requirements: [
            { type: "skill", description: "Cooking level 34", skill: "Cooking", level: 34 },
            { type: "quest", description: "Completion of Cook's Assistant" },
          ],
        },
        {
          id: "diary-lumbridge-draynor-easy-11",
          description: "Mine some Iron ore at the Al Kharid mine.",
          requirements: [
            { type: "skill", description: "Mining level 15", skill: "Mining", level: 15 },
          ],
        },
        {
          id: "diary-lumbridge-draynor-easy-12",
          description: "Enter the H.A.M. Hideout.",
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
          id: "diary-lumbridge-draynor-medium-1",
          description: "Complete a lap of the Al Kharid agility course.",
          requirements: [
            { type: "skill", description: "Agility level 20", skill: "Agility", level: 20 },
          ],
        },
        {
          id: "diary-lumbridge-draynor-medium-2",
          description: "Grapple across the River Lum.",
          requirements: [
            { type: "skill", description: "Agility level 8", skill: "Agility", level: 8 },
            { type: "skill", description: "Strength level 19", skill: "Strength", level: 19 },
            { type: "skill", description: "Ranged level 37", skill: "Ranged", level: 37 },
          ],
        },
        {
          id: "diary-lumbridge-draynor-medium-3",
          description: "Purchase an upgraded device from Ava.",
          requirements: [
            { type: "skill", description: "Ranged level 50", skill: "Ranged", level: 50 },
            { type: "quest", description: "Completion of Animal Magnetism" },
          ],
        },
        {
          id: "diary-lumbridge-draynor-medium-4",
          description: "Travel to the Wizards' Tower by Fairy ring.",
          requirements: [
          ],
        },
        {
          id: "diary-lumbridge-draynor-medium-5",
          description: "Cast the Teleport to Lumbridge spell.",
          requirements: [
            { type: "skill", description: "Magic level 31", skill: "Magic", level: 31 },
          ],
        },
        {
          id: "diary-lumbridge-draynor-medium-6",
          description: "Catch some Salmon in Lumbridge.",
          requirements: [
            { type: "skill", description: "Fishing level 30", skill: "Fishing", level: 30 },
          ],
        },
        {
          id: "diary-lumbridge-draynor-medium-7",
          description: "Craft a coif in the Lumbridge cow pen.\n''Note: Not to be confused with a cowl.",
          requirements: [
            { type: "skill", description: "Crafting level 38", skill: "Crafting", level: 38 },
          ],
        },
        {
          id: "diary-lumbridge-draynor-medium-8",
          description: "Chop some willow logs in Draynor Village.",
          requirements: [
            { type: "skill", description: "Woodcutting level 30", skill: "Woodcutting", level: 30 },
          ],
        },
        {
          id: "diary-lumbridge-draynor-medium-9",
          description: "Pickpocket Martin the Master Gardener.",
          requirements: [
            { type: "skill", description: "Thieving level 38", skill: "Thieving", level: 38 },
          ],
        },
        {
          id: "diary-lumbridge-draynor-medium-10",
          description: "Get a slayer task from Chaeldar.",
          requirements: [
            { type: "skill", description: "Combat level 70", skill: "Combat", level: 70 },
            { type: "quest", description: "Completion of Lost City" },
          ],
        },
        {
          id: "diary-lumbridge-draynor-medium-11",
          description: "Catch an Essence or Eclectic impling in Puro-Puro.",
          requirements: [
            { type: "skill", description: "Hunter level 42", skill: "Hunter", level: 42 },
          ],
        },
        {
          id: "diary-lumbridge-draynor-medium-12",
          description: "Craft some Lava runes at the fire altar in Al Kharid.\n''Note: Use the earth runes you brought on the altar, do not use the essence.",
          requirements: [
            { type: "skill", description: "Runecraft level 23", skill: "Runecraft", level: 23 },
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
          id: "diary-lumbridge-draynor-hard-1",
          description: "Cast Bones to Peaches in Al Kharid palace.\n''Note: Using the Bones to Peaches tablet does not count.",
          requirements: [
            { type: "skill", description: "Magic level 60", skill: "Magic", level: 60 },
          ],
        },
        {
          id: "diary-lumbridge-draynor-hard-2",
          description: "Squeeze past the jutting wall on your way to the cosmic altar.",
          requirements: [
            { type: "skill", description: "Agility level 46", skill: "Agility", level: 46 },
            { type: "quest", description: "Completion of Lost City" },
          ],
        },
        {
          id: "diary-lumbridge-draynor-hard-3",
          description: "Craft 56 Cosmic runes simultaneously from Essence without the use of Extracts.",
          requirements: [
            { type: "skill", description: "Runecraft level 59", skill: "Runecraft", level: 59 },
            { type: "quest", description: "Completion of Lost City" },
          ],
        },
        {
          id: "diary-lumbridge-draynor-hard-4",
          description: "Travel from Lumbridge to Edgeville on a Waka Canoe.",
          requirements: [
            { type: "skill", description: "Woodcutting level 57", skill: "Woodcutting", level: 57 },
          ],
        },
        {
          id: "diary-lumbridge-draynor-hard-5",
          description: "Collect at least 100 Tears of Guthix in one visit.\nNote: This minigame can only be tried once a week, so be aware. Each quest point increases the time you can spend collecting tears by one game tick. It's recommended to have at least 150 quest points before trying this task. See the Tears of Guthix (minigame) page for other strategies you can use to maximize points.",
          requirements: [
            { type: "quest", description: "Completion of Tears of Guthix (quest)" },
          ],
        },
        {
          id: "diary-lumbridge-draynor-hard-6",
          description: "Take the train from Dorgesh-Kaan to Keldagrim.",
          requirements: [
            { type: "quest", description: "Completion of Another Slice of H.A.M." },
          ],
        },
        {
          id: "diary-lumbridge-draynor-hard-7",
          description: "Purchase some Barrows gloves from the Lumbridge bank chest.",
          requirements: [
          ],
        },
        {
          id: "diary-lumbridge-draynor-hard-8",
          description: "Pick some Belladonna from the farming patch at Draynor Manor.",
          requirements: [
            { type: "skill", description: "Farming level 63", skill: "Farming", level: 63 },
          ],
        },
        {
          id: "diary-lumbridge-draynor-hard-9",
          description: "Light your mining helmet in the Lumbridge castle basement.",
          requirements: [
            { type: "skill", description: "Firemaking level 65", skill: "Firemaking", level: 65 },
          ],
        },
        {
          id: "diary-lumbridge-draynor-hard-10",
          description: "Recharge your prayer at Emir's Arena with Smite activated.",
          requirements: [
            { type: "skill", description: "Prayer level 52", skill: "Prayer", level: 52 },
          ],
        },
        {
          id: "diary-lumbridge-draynor-hard-11",
          description: "Craft, string and enchant an Amulet of Power in Lumbridge.\nNote: Doing this upstairs in Lumbridge Castle does not count.",
          requirements: [
            { type: "skill", description: "Crafting level 70", skill: "Crafting", level: 70 },
            { type: "skill", description: "Magic level 57", skill: "Magic", level: 57 },
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
          id: "diary-lumbridge-draynor-elite-1",
          description: "Steal from a Dorgesh-Kaan rich chest.",
          requirements: [
            { type: "skill", description: "Thieving level 78", skill: "Thieving", level: 78 },
            { type: "quest", description: "Completion of Death to the Dorgeshuun" },
          ],
        },
        {
          id: "diary-lumbridge-draynor-elite-2",
          description: "Grapple across a pylon on the Dorgesh-Kaan Agility Course.",
          requirements: [
            { type: "skill", description: "Agility level 70", skill: "Agility", level: 70 },
            { type: "skill", description: "Ranged level 70", skill: "Ranged", level: 70 },
            { type: "skill", description: "Strength level 70", skill: "Strength", level: 70 },
            { type: "quest", description: "Completion of Death to the Dorgeshuun" },
          ],
        },
        {
          id: "diary-lumbridge-draynor-elite-3",
          description: "Chop some magic logs at the Mage Training Arena.",
          requirements: [
            { type: "skill", description: "Woodcutting level 75", skill: "Woodcutting", level: 75 },
          ],
        },
        {
          id: "diary-lumbridge-draynor-elite-4",
          description: "Smith an Adamant platebody down Draynor sewer.",
          requirements: [
            { type: "skill", description: "Smithing level 88", skill: "Smithing", level: 88 },
          ],
        },
        {
          id: "diary-lumbridge-draynor-elite-5",
          description: "Craft 140 or more Water runes simultaneously from Essence without the use of Extracts.",
          requirements: [
            { type: "skill", description: "Runecraft level 76", skill: "Runecraft", level: 76 },
            { type: "skill", description: "Runecraft level 57", skill: "Runecraft", level: 57 },
            { type: "skill", description: "Runecraft level 38", skill: "Runecraft", level: 38 },
          ],
        },
        {
          id: "diary-lumbridge-draynor-elite-6",
          description: "Perform the Quest cape emote in the Wise Old Man's house.",
          requirements: [
          ],
        },
      ],
      rewards: [
      ],
    },
  ],
};
