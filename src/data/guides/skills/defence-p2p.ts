import type { SkillTrainingGuide } from "@/types/guides";

export const defenceP2pGuide: SkillTrainingGuide = {
  skill: "Defence" as SkillTrainingGuide["skill"],
  variant: "p2p",
  wikiUrl: "https://oldschool.runescape.wiki/w/Pay-to-play_melee_training",
  methods: [
    {
      name: "Questing",
      levelRange: [1, 30],
      xpPerHour: null,
      description:
        "Unlike Attack and Strength, fewer quests offer large Defence experience rewards. Nature Spirit (2,000 XP), The Holy Grail (15,300 XP), and King's Ransom followed by the Knight Waves Training Grounds provide the best quest-based Defence experience. Otherwise, set combat style to Defensive or Controlled while training.",
      members: true,
    },
    {
      name: "Chickens",
      levelRange: [1, 10],
      xpPerHour: null,
      description:
        "Kill chickens near Lumbridge on defensive combat style for early Defence experience. They have only 3 Hitpoints and deal no damage, making them safe for brand new accounts.",
      members: true,
    },
    {
      name: "Rock Crabs",
      levelRange: [10, 60],
      xpPerHour: null,
      description:
        "Rock Crabs near Rellekka have 50 Hitpoints and deal minimal damage, making them a popular low-attention training option. They disguise as rocks and must be reset periodically by walking away. Sand Crabs on the Hosidius coast are a similar alternative.",
      members: true,
    },
    {
      name: "Crabs",
      levelRange: [30, 50],
      xpPerHour: null,
      description:
        "Sand Crabs, Ammonite Crabs, and Rock Crabs are the most popular AFK melee training monsters. They have high Hitpoints, deal low damage, and are aggressive, allowing semi-AFK training. Ammonite Crabs on Fossil Island offer the best experience due to 100 Hitpoints.",
      members: true,
    },
    {
      name: "Chaos druids",
      levelRange: [30, 60],
      xpPerHour: null,
      description:
        "Chaos druids in the Edgeville Dungeon or Taverley Dungeon are easy to kill and frequently drop herbs, providing profit while training. They have low Hitpoints and defence, making them accessible at mid levels.",
      members: true,
    },
    {
      name: "Moss giants",
      levelRange: [40, 60],
      xpPerHour: null,
      description:
        "Moss giants in the Varrock Sewers or Crandor provide steady combat experience with decent Hitpoints. They drop mossy keys for the Bryophyta boss fight and big bones for Prayer training.",
      members: true,
    },
    {
      name: "Nightmare Zone - Normal Rumble",
      levelRange: [50, 70],
      xpPerHour: null,
      description:
        "The Nightmare Zone lets players fight previously defeated quest bosses in a dream. Normal Rumble mode with absorption potions provides consistent AFK melee training. Use the best available melee gear and enable auto-retaliate.",
      members: true,
    },
    {
      name: "Nightmare Zone",
      levelRange: [70, 99],
      xpPerHour: null,
      description:
        "At higher levels, Dharok's set becomes the optimal choice in the Nightmare Zone. Its set effect increases max hit based on missing Hitpoints. Combined with absorption potions and overloads, this provides fast AFK experience. At lower levels, Obsidian armour with a Berserker necklace and Toktz-xil-ak is optimal instead.",
      members: true,
    },
    {
      name: "Scurrius",
      levelRange: [60, 70],
      xpPerHour: null,
      description:
        "Scurrius is a rat boss beneath Varrock that can be fought solo or in groups. The bone mace, created from Scurrius' spine (dropped at 1/33), provides the best experience rates at lower levels. Teaches useful PvM mechanics like prayer switching.",
      members: true,
    },
    {
      name: "Sulphur Nagua",
      levelRange: [60, 99],
      xpPerHour: null,
      description:
        "Sulphur Nagua in Varlamore have negative flat armour, making them weak to double-hit weapons. With Piety, dual macuahuitl, and full blood moon armour, they offer very fast melee experience.",
      members: true,
    },
    {
      name: "Wilderness Slayer",
      levelRange: [60, 70],
      xpPerHour: null,
      description:
        "Wilderness Slayer tasks from Krystilia provide boosted Slayer experience and access to unique Wilderness-only drops. Tasks are completed entirely in the Wilderness, which adds PvP risk but offers better rewards than standard Slayer.",
      members: true,
    },
    {
      name: "Slayer",
      levelRange: [70, 99],
      xpPerHour: null,
      description:
        "Training Slayer alongside melee combat is the most efficient long-term approach. It provides varied combat experience while unlocking profitable boss drops at higher Slayer levels, such as the Abyssal whip from Abyssal demons.",
      members: true,
    },
    {
      name: "Pest Control",
      levelRange: [40, 99],
      xpPerHour: null,
      description:
        "Pest Control is a team-based minigame on the Void Knights' Outpost where players defend portals against waves of pests. Commendation points can be spent on combat experience or Void Knight equipment. Requires 40+ combat level for the novice boat.",
      members: true,
    },
  ],
};
