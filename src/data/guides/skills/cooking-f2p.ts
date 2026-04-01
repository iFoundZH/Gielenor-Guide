import type { SkillTrainingGuide } from "@/types/guides";

export const cookingF2pGuide: SkillTrainingGuide = {
  skill: "Cooking" as SkillTrainingGuide["skill"],
  variant: "f2p",
  wikiUrl: "https://oldschool.runescape.wiki/w/Free-to-play_Cooking_training",
  methods: [
    {
      name: "=",
      levelRange: [45, 50],
      xpPerHour: null,
      description: "Swordfish can be caught in Musa Point in Karamja once level 50 Fishing is attained. Swordfish yields 140 experience each cooking. However, swordfish catching speed is the slowest among all free-to-...",
      members: false,
    },
  ],
};
