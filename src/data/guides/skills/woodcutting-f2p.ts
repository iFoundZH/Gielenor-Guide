import type { SkillTrainingGuide } from "@/types/guides";

export const woodcuttingF2pGuide: SkillTrainingGuide = {
  skill: "Woodcutting" as SkillTrainingGuide["skill"],
  variant: "f2p",
  wikiUrl: "https://oldschool.runescape.wiki/w/Free-to-play_Woodcutting_training",
  methods: [
    {
      name: "Levels 1–99",
      levelRange: [1, 99],
      xpPerHour: null,
      description: "",
      members: false,
    },
    {
      name: "Starting experience",
      levelRange: [1, 15],
      xpPerHour: null,
      description: "Starting experience: 0",
      members: false,
    },
    {
      name: "Experience required",
      levelRange: [1, 15],
      xpPerHour: null,
      description: "Experience required: 2,411",
      members: false,
    },
    {
      name: "Logs required",
      levelRange: [1, 15],
      xpPerHour: null,
      description: "Logs required: 97 (2,425 experience)",
      members: false,
    },
    {
      name: "Profit",
      levelRange: [1, 15],
      xpPerHour: null,
      description: "Profit:",
      members: false,
    },
    {
      name: "/60/99: Oak trees",
      levelRange: [15, 30],
      xpPerHour: null,
      description: "At level 15, it is recommended to start cutting oak trees, which grant 37.5 experience per log. Oak trees are found throughout Gielinor. There are several oak tree spots: there are trees south-west...",
      members: false,
    },
    {
      name: "Maple trees",
      levelRange: [45, 99],
      xpPerHour: 36000,
      description: "At level 45, players can cut maple trees, which grant 100 experience per log. Experience rates are about 35% lower than willow trees (when not using tick manipulation), however maples are easier to...",
      members: false,
    },
    {
      name: "Yew trees",
      levelRange: [60, 99],
      xpPerHour: null,
      description: "At level 60, players can cut yew trees, which grant 175 experience per log. While yew logs earn a profit, it is recommended to cut willow or maple trees for experience and use the time saved to ear...",
      members: false,
    },
  ],
};
