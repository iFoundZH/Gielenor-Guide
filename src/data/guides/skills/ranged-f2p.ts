import type { SkillTrainingGuide } from "@/types/guides";

export const rangedF2pGuide: SkillTrainingGuide = {
  skill: "Ranged" as SkillTrainingGuide["skill"],
  variant: "f2p",
  wikiUrl: "https://oldschool.runescape.wiki/w/Free-to-play_Ranged_training",
  methods: [
    {
      name: "maximum hit chart (collapsed)",
      levelRange: [1, 99],
      xpPerHour: null,
      description: "{| class=\"wikitable mw-collapsible mw-collapsed\" style=\"text-align:center;\" ! ! colspan=\"5\" |Arrow Type ! |-",
      members: false,
    },
  ],
};
