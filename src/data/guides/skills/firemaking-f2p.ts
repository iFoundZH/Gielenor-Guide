import type { SkillTrainingGuide } from "@/types/guides";

export const firemakingF2pGuide: SkillTrainingGuide = {
  skill: "Firemaking" as SkillTrainingGuide["skill"],
  variant: "f2p",
  wikiUrl: "https://oldschool.runescape.wiki/w/Free-to-play_Firemaking_training",
  methods: [
    {
      name: "Level 1–99",
      levelRange: [1, 99],
      xpPerHour: null,
      description: "This section will show the time and number of logs needed to reach level 99 Firemaking if switching to each newly unlocked log type you can burn as soon as possible. It would take a player approxim...",
      members: false,
    },
    {
      name: "Normal logs",
      levelRange: [1, 15],
      xpPerHour: null,
      description: "The quickest way to get from level 1 to level 15 is by burning normal logs, which grant 40 experience per log. Normal logs from trees, evergreen, dead and dying trees can be cut nearly everywhere i...",
      members: false,
    },
    {
      name: "Oak logs",
      levelRange: [15, 30],
      xpPerHour: null,
      description: "The quickest way to get from level 15 to level 30 is by burning oak logs, which grant 60 experience per log. Oak trees can be cut almost everywhere. Level 15 Woodcutting to cut the oak logs may be ...",
      members: false,
    },
    {
      name: "Willow logs",
      levelRange: [30, 45],
      xpPerHour: null,
      description: "The quickest way to get from level 30 to level 45 is by burning willow logs, which grant 90 experience per log. Willow logs can be bought from other players or they can be cut with a Woodcutting le...",
      members: false,
    },
    {
      name: "Maple logs",
      levelRange: [45, 60],
      xpPerHour: null,
      description: "The quickest way to get from level 45 to level 60 is by burning maple logs, which grant 135 experience per log. Free to play players may cut them or purchase them via the Grand Exchange. Many playe...",
      members: false,
    },
    {
      name: "Yew logs",
      levelRange: [60, 99],
      xpPerHour: null,
      description: "The fastest way to get from level 60 to level 99 is by burning yew logs, which grant 202.5 experience per log. These can be cut yourself, but it is much more efficient overall to buy them from othe...",
      members: false,
    },
    {
      name: "Willow logs",
      levelRange: [30, 99],
      xpPerHour: null,
      description: "Using exclusively willow logs are a cheap, albeit slow, route to achieving level 99 in Firemaking. Burning willow logs grants 90 experience per log. *Experience needed: 13,021,068 *Willow logs need...",
      members: false,
    },
    {
      name: "Maple logs",
      levelRange: [45, 99],
      xpPerHour: null,
      description: "The cheapest way to get from level 45 to level 99 is by burning maple logs, which grants 135 experience per log. Currently, maple logs ( coins) are cheaper than willow logs ( coins), so this method...",
      members: false,
    },
  ],
};
