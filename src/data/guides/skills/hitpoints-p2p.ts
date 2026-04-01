import type { SkillTrainingGuide } from "@/types/guides";

export const hitpointsP2pGuide: SkillTrainingGuide = {
  skill: "Hitpoints" as SkillTrainingGuide["skill"],
  variant: "p2p",
  wikiUrl: "https://oldschool.runescape.wiki/w/Pay-to-play_Hitpoints_training",
  methods: [
    {
      name: "Training Hitpoints through combat",
      levelRange: [1, 99],
      xpPerHour: null,
      description: "Each point of damage dealt directly by the player yields 1.33 Hitpoints XP. Therefore, any combat training method that offers a high XP rate will also train Hitpoints at a high rate. *Melee trainin...",
      members: true,
    },
    {
      name: "Ice Burst/Barrage",
      levelRange: [1, 99],
      xpPerHour: null,
      description: "After completion of Monkey Madness I and Desert Treasure I, with at least 70 Magic, players can cast Ice Burst/Ice Barrage on the Skeletal Monkeys in the Ape Atoll Dungeon, granting a high amount o...",
      members: true,
    },
    {
      name: "Chinchompas",
      levelRange: [1, 99],
      xpPerHour: null,
      description: "Red or black chinchompas can be used in a similar way to barrage spells, by using them on maniacal monkeys on Ape Atoll for fast Ranged and Hitpoints XP.",
      members: true,
    },
    {
      name: "Training Hitpoints alone",
      levelRange: [1, 99],
      xpPerHour: null,
      description: "Skill pures (also known as skillers) or other accounts who wish to train Hitpoints without training other combat skills have a few options. Experience lamps from random events, cleaning finds in th...",
      members: true,
    },
  ],
};
