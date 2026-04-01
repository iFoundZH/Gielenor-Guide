import type { AchievementDiaryArea } from "@/types/guides";

export const faladorDiary: AchievementDiaryArea = {
  id: "falador",
  name: "Falador",
  wikiUrl: "https://oldschool.runescape.wiki/w/Falador_Diary",
  tiers: [
    {
      tier: "easy" as AchievementDiaryArea["tiers"][number]["tier"],
      tasks: [
        {
          id: "diary-falador-easy-1",
          description: "{| class=\"wikitable lighttable qc-active diary-table\" style=width:750px; data-diary-name=\"Falador\" data-diary-tier=\"Easy\"\n! style=\"width:50%;\" | Task\n! style=\"width:50%;\" | Requirements",
          requirements: [
          ],
        },
        {
          id: "diary-falador-easy-2",
          description: "Find out what your family crest is from Sir Renitee\nNote: You must finish the dialogue.",
          requirements: [
            { type: "skill", description: "Construction level 16", skill: "Construction", level: 16 },
          ],
        },
        {
          id: "diary-falador-easy-3",
          description: "Climb over the western Falador wall.",
          requirements: [
            { type: "skill", description: "Agility level 5", skill: "Agility", level: 5 },
          ],
        },
        {
          id: "diary-falador-easy-4",
          description: "Browse Sarah's farm shop.",
          requirements: [
          ],
        },
        {
          id: "diary-falador-easy-5",
          description: "Get a Haircut or a Shave from the Falador Hairdresser.",
          requirements: [
          ],
        },
        {
          id: "diary-falador-easy-6",
          description: "Fill a bucket from the pump north of Falador west bank.",
          requirements: [
          ],
        },
        {
          id: "diary-falador-easy-7",
          description: "Kill a duck in Falador Park.",
          requirements: [
          ],
        },
        {
          id: "diary-falador-easy-8",
          description: "Make a mind tiara.",
          requirements: [
          ],
        },
        {
          id: "diary-falador-easy-9",
          description: "Take the boat to Entrana.",
          requirements: [
          ],
        },
        {
          id: "diary-falador-easy-10",
          description: "Repair a broken strut in the Motherlode Mine.",
          requirements: [
          ],
        },
        {
          id: "diary-falador-easy-11",
          description: "Claim a security book from the Security guard at Port Sarim jail.\nNote: The guard is found upstairs. Ask him about security and finish the dialogue.",
          requirements: [
          ],
        },
        {
          id: "diary-falador-easy-12",
          description: "Smith some Blurite Limbs on Doric's anvil.",
          requirements: [
            { type: "skill", description: "Mining level 10", skill: "Mining", level: 10 },
            { type: "skill", description: "Smithing level 13", skill: "Smithing", level: 13 },
            { type: "quest", description: "Completion of The Knight's Sword" },
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
          id: "diary-falador-medium-1",
          description: "{| class=\"wikitable lighttable qc-active diary-table\" style=width:750px; data-diary-name=\"Falador\" data-diary-tier=\"Medium\"\n! style=\"width:50%;\" | Task\n! style=\"width:50%;\" | Requirements",
          requirements: [
          ],
        },
        {
          id: "diary-falador-medium-2",
          description: "Light a Bullseye lantern at the Chemist's in Rimmington.",
          requirements: [
            { type: "skill", description: "Firemaking level 49", skill: "Firemaking", level: 49 },
          ],
        },
        {
          id: "diary-falador-medium-3",
          description: "Telegrab some Wine of Zamorak at the Chaos Temple by the Wilderness.\nNote: This altar is located north-west of the Goblin Village. You have to be inside the building until the jug appears in your inventory for the task to register as completed.",
          requirements: [
            { type: "skill", description: "Magic level 33", skill: "Magic", level: 33 },
          ],
        },
        {
          id: "diary-falador-medium-4",
          description: "Unlock the Crystal chest in Taverley.",
          requirements: [
          ],
        },
        {
          id: "diary-falador-medium-5",
          description: "Place a Scarecrow in the Falador farm flower patch.",
          requirements: [
            { type: "skill", description: "Farming level 23", skill: "Farming", level: 23 },
            { type: "skill", description: "Farming level 47", skill: "Farming", level: 47 },
          ],
        },
        {
          id: "diary-falador-medium-6",
          description: "Kill a Mogre at Mudskipper Point.",
          requirements: [
            { type: "skill", description: "Slayer level 32", skill: "Slayer", level: 32 },
            { type: "quest", description: "Completion of Skippy and the Mogres" },
          ],
        },
        {
          id: "diary-falador-medium-7",
          description: "Visit the Port Sarim Rat Pits.",
          requirements: [
          ],
        },
        {
          id: "diary-falador-medium-8",
          description: "Grapple up and then jump off the north Falador wall.",
          requirements: [
            { type: "skill", description: "Agility level 11", skill: "Agility", level: 11 },
            { type: "skill", description: "Strength level 37", skill: "Strength", level: 37 },
            { type: "skill", description: "Ranged level 19", skill: "Ranged", level: 19 },
          ],
        },
        {
          id: "diary-falador-medium-9",
          description: "Pickpocket a Falador guard.",
          requirements: [
            { type: "skill", description: "Thieving level 40", skill: "Thieving", level: 40 },
          ],
        },
        {
          id: "diary-falador-medium-10",
          description: "Pray at the Altar of Guthix in Taverley whilst wearing full Initiate.",
          requirements: [
            { type: "skill", description: "Prayer level 10", skill: "Prayer", level: 10 },
            { type: "skill", description: "Defence level 20", skill: "Defence", level: 20 },
            { type: "quest", description: "Completion of Recruitment Drive" },
          ],
        },
        {
          id: "diary-falador-medium-11",
          description: "Mine some Gold ore at the Crafting Guild.",
          requirements: [
            { type: "skill", description: "Crafting level 40", skill: "Crafting", level: 40 },
            { type: "skill", description: "Mining level 40", skill: "Mining", level: 40 },
          ],
        },
        {
          id: "diary-falador-medium-12",
          description: "Squeeze through the crevice in the Dwarven mines.",
          requirements: [
            { type: "skill", description: "Agility level 42", skill: "Agility", level: 42 },
          ],
        },
        {
          id: "diary-falador-medium-13",
          description: "Chop and burn some Willow logs in Taverley.\nNote: Willow trees can be found to the south-east along the lake. Player-grown willow trees do not count towards completing the task.",
          requirements: [
            { type: "skill", description: "Woodcutting level 30", skill: "Woodcutting", level: 30 },
            { type: "skill", description: "Firemaking level 30", skill: "Firemaking", level: 30 },
          ],
        },
        {
          id: "diary-falador-medium-14",
          description: "Craft a fruit basket on the Falador Farm loom.",
          requirements: [
            { type: "skill", description: "Crafting level 36", skill: "Crafting", level: 36 },
            { type: "skill", description: "Farming level 30", skill: "Farming", level: 30 },
          ],
        },
        {
          id: "diary-falador-medium-15",
          description: "Teleport to Falador.",
          requirements: [
            { type: "skill", description: "Magic level 37", skill: "Magic", level: 37 },
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
          id: "diary-falador-hard-1",
          description: "{| class=\"wikitable lighttable qc-active diary-table\" style=width:750px; data-diary-name=\"Falador\" data-diary-tier=\"Hard\"\n! style=\"width:50%;\" | Task\n! style=\"width:50%;\" | Requirements",
          requirements: [
          ],
        },
        {
          id: "diary-falador-hard-2",
          description: "Craft 140 Mind runes simultaneously from Essence without the use of Extracts.\nNote: Mind cores do not count.",
          requirements: [
            { type: "skill", description: "Runecraft level 56", skill: "Runecraft", level: 56 },
            { type: "skill", description: "Runecraft level 42", skill: "Runecraft", level: 42 },
          ],
        },
        {
          id: "diary-falador-hard-3",
          description: "Change your family crest to the Saradomin symbol.\nNote: This is done by talking to Sir Renitee.",
          requirements: [
            { type: "skill", description: "Prayer level 70", skill: "Prayer", level: 70 },
            { type: "skill", description: "Construction level 16", skill: "Construction", level: 16 },
          ],
        },
        {
          id: "diary-falador-hard-4",
          description: "Kill the Giant Mole beneath Falador Park.",
          requirements: [
          ],
        },
        {
          id: "diary-falador-hard-5",
          description: "Kill a Skeletal Wyvern in the Asgarnia Ice Dungeon.",
          requirements: [
            { type: "skill", description: "Slayer level 72", skill: "Slayer", level: 72 },
          ],
        },
        {
          id: "diary-falador-hard-6",
          description: "Complete a lap of the Falador rooftop agility course.",
          requirements: [
            { type: "skill", description: "Agility level 50", skill: "Agility", level: 50 },
          ],
        },
        {
          id: "diary-falador-hard-7",
          description: "Enter the mining guild while wearing a Prospector helmet.\nNote: This helmet can be obtained from the Motherlode Mine or the Volcanic Mine.",
          requirements: [
            { type: "skill", description: "Mining level 60", skill: "Mining", level: 60 },
          ],
        },
        {
          id: "diary-falador-hard-8",
          description: "Kill the Blue Dragon under the Heroes' Guild.",
          requirements: [
          ],
        },
        {
          id: "diary-falador-hard-9",
          description: "Crack a wall safe within Rogues' Den.\nNote: Wall safes in the maze do not count towards completing this task.",
          requirements: [
            { type: "skill", description: "Thieving level 50", skill: "Thieving", level: 50 },
          ],
        },
        {
          id: "diary-falador-hard-10",
          description: "Recharge your prayer in the Port Sarim church while wearing full Proselyte.",
          requirements: [
            { type: "skill", description: "Defence level 30", skill: "Defence", level: 30 },
            { type: "skill", description: "Prayer level 20", skill: "Prayer", level: 20 },
            { type: "quest", description: "Completion of The Slug Menace" },
          ],
        },
        {
          id: "diary-falador-hard-11",
          description: "Enter the Warriors' Guild.",
          requirements: [
          ],
        },
        {
          id: "diary-falador-hard-12",
          description: "Equip a dwarven helmet within the dwarven mines.",
          requirements: [
            { type: "skill", description: "Defence level 50", skill: "Defence", level: 50 },
            { type: "quest", description: "Completion of Grim Tales" },
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
          id: "diary-falador-elite-1",
          description: "{| class=\"wikitable lighttable qc-active diary-table\" style=width:750px; data-diary-name=\"Falador\" data-diary-tier=\"Elite\"\n! style=\"width:50%;\" | Task\n! style=\"width:50%;\" | Requirements",
          requirements: [
          ],
        },
        {
          id: "diary-falador-elite-2",
          description: "Craft 252 Air Runes simultaneously from Essence without the use of Extracts.",
          requirements: [
            { type: "skill", description: "Runecraft level 88", skill: "Runecraft", level: 88 },
            { type: "skill", description: "Runecraft level 77", skill: "Runecraft", level: 77 },
            { type: "skill", description: "Runecraft level 66", skill: "Runecraft", level: 66 },
            { type: "skill", description: "Runecraft level 55", skill: "Runecraft", level: 55 },
          ],
        },
        {
          id: "diary-falador-elite-3",
          description: "Purchase a White 2h Sword from Sir Vyvin.\nNote: Selling this sword to him and then buying it back without having the proper rank does not count for this achievement.",
          requirements: [
            { type: "quest", description: "Completion of Wanted!" },
          ],
        },
        {
          id: "diary-falador-elite-4",
          description: "Find at least 3 magic roots at once when digging up your magic tree in Falador.\nNote: You need to cut the tree down yourself.",
          requirements: [
            { type: "skill", description: "Farming level 91", skill: "Farming", level: 91 },
            { type: "skill", description: "Woodcutting level 75", skill: "Woodcutting", level: 75 },
          ],
        },
        {
          id: "diary-falador-elite-5",
          description: "Perform a skillcape or quest cape emote at the top of Falador Castle.",
          requirements: [
          ],
        },
        {
          id: "diary-falador-elite-6",
          description: "Jump over the strange floor in Taverley dungeon.\nNote: Might take several tries. You must take no damage from the jump.",
          requirements: [
            { type: "skill", description: "Agility level 80", skill: "Agility", level: 80 },
          ],
        },
        {
          id: "diary-falador-elite-7",
          description: "Mix a Saradomin brew in Falador east bank.",
          requirements: [
            { type: "skill", description: "Herblore level 81", skill: "Herblore", level: 81 },
          ],
        },
      ],
      rewards: [
      ],
    },
  ],
};
