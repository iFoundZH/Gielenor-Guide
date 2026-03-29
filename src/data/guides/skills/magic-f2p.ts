import type { SkillTrainingGuide } from "@/types/guides";

export const magicF2pGuide: SkillTrainingGuide = {
  skill: "Magic" as SkillTrainingGuide["skill"],
  variant: "f2p",
  wikiUrl: "https://oldschool.runescape.wiki/w/Free-to-play_Magic_training",
  methods: [
    {
      name: "Level 1–17",
      levelRange: [1, 17],
      xpPerHour: null,
      description: "Casting Wind Strike on the cows around Lumbridge is a good way to get a few levels quickly, and also profit from the cowhides that they drop. You can either sell the hides, or tan them at Ellis, th...",
      members: false,
    },
  ],
};
