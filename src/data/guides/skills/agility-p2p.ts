import type { SkillTrainingGuide } from "@/types/guides";

export const agilityP2pGuide: SkillTrainingGuide = {
  skill: "Agility" as SkillTrainingGuide["skill"],
  variant: "p2p",
  wikiUrl: "https://oldschool.runescape.wiki/w/Pay-to-play_Agility_training",
  methods: [
    {
      name: "/33: Questing",
      levelRange: [1, 26],
      xpPerHour: null,
      description:
        "Early levels can be skipped by completing quests that give Agility experience. Completing The Tourist Trap (using experience on Agility two times), Recruitment Drive, The Depths of Despair and The ...",
      members: true,
    },
    {
      name: "Brimhaven Agility Arena",
      levelRange: [20, 47],
      xpPerHour: 30000,
      description:
        "Brimhaven Agility Arena offers the fastest experience from level 20 to 47. Players must have 200 coins to pay the entry fee for the course. Level 40 is required to pass all obstacles in the course,...",
      members: true,
    },
    {
      name: "Wilderness Agility Course",
      levelRange: [47, 62],
      xpPerHour: null,
      description:
        "The Wilderness Agility Course at level 52 Wilderness offers the fastest Agility experience from level 47 to 60. It requires 52 Agility to access. Each lap grants 571.4 experience. Being in the Wilderness means there is PvP risk, so bring minimal gear and food.",
      members: true,
    },
    {
      name: "Rooftop Agility Courses",
      levelRange: [1, 99],
      xpPerHour: null,
      description:
        "Rooftop Agility Courses are slower but straightforward and less attention-intensive alternatives to the faster training methods. While training on one of the rooftop courses, there is a chance of f...",
      members: true,
    },
    {
      name: "Edgeville Dungeon monkeybars",
      levelRange: [15, 40],
      xpPerHour: 13200,
      description:
        "Repeatedly crossing the monkeybar shortcut in the Edgeville Dungeon offers up to 13,200 experience per hour. With the right camera angle, it is possible to keep the mouse cursor in one spot and con...",
      members: true,
    },
    {
      name: "Barbarian Fishing",
      levelRange: [15, 74],
      xpPerHour: null,
      description:
        "Barbarian Fishing grants small amounts of passive Agility and Strength experience. Levelling Fishing from level 58 to 99 by Barbarian Fishing would get the player from level 30 Agility to 74. If th...",
      members: true,
    },
    {
      name: "/60: Ape Atoll Agility Course",
      levelRange: [48, 52],
      xpPerHour: 35000,
      description:
        "The Ape Atoll Agility Course is a viable alternative for players who have completed chapter 2 of Monkey Madness I. To access this course, players must wear a ninja monkey greegree (either variant w...",
      members: true,
    },
    {
      name: "/60: Shayzien Advanced Agility Course",
      levelRange: [45, 52],
      xpPerHour: 35000,
      description:
        "The Shayzien Advanced Agility Course is an alternative for players who cannot access the Ape Atoll Agility Course or do not wish to train on the Wilderness Agility Course. Completing this course re...",
      members: true,
    },
    {
      name: "Colossal Wyrm Agility Course",
      levelRange: [50, 62],
      xpPerHour: 30000,
      description:
        "The Colossal Wyrm Agility Course is a less click-intensive course that offers an alternative way to get Amylase crystals. The course rewards blessed bone shards for Prayer xp, and Termites, which c...",
      members: true,
    },
    {
      name: "/90: Werewolf Agility Course",
      levelRange: [60, 80],
      xpPerHour: 55000,
      description:
        "The Werewolf Agility Course is an alternative for those who seek for both decent experience rates and marks of grace. To access this course, players must have completed Creature of Fenkenstrain and...",
      members: true,
    },
    {
      name: "Prifddinas Agility Course",
      levelRange: [75, 99],
      xpPerHour: 65481,
      description:
        "The Prifddinas Agility Course offers a less click-intensive training option from level 75 onwards, being similar to the Rooftop Agility Courses. Players must have completed Song of the Elves to acc...",
      members: true,
    },
  ],
};
