import type { SkillTrainingGuide } from "@/types/guides";

export const craftingF2pGuide: SkillTrainingGuide = {
  skill: "Crafting" as SkillTrainingGuide["skill"],
  variant: "f2p",
  wikiUrl: "https://oldschool.runescape.wiki/w/Free-to-play_Crafting_training",
  methods: [
    {
      name: "Levels 1–99",
      levelRange: [1, 99],
      xpPerHour: null,
      description: "Players are encouraged to change between training methods as necessary as the cost of certain methods fluctuates over time.",
      members: false,
    },
  ],
};
