import type { SkillTrainingGuide } from "@/types/guides";

export const fletchingP2pGuide: SkillTrainingGuide = {
  skill: "Fletching" as SkillTrainingGuide["skill"],
  variant: "p2p",
  wikiUrl: "https://oldschool.runescape.wiki/w/Pay-to-play_Fletching_training",
  methods: [
    {
      name: "Headless arrows",
      levelRange: [1, 5],
      xpPerHour: null,
      description: "A profitable way of training Fletching is to fletch headless arrows using arrow shafts and feathers. This grants 15 experience per action, for 1 experience per headless arrow fletched.",
      members: true,
    },
    {
      name: "/10: Arrow shafts",
      levelRange: [1, 5],
      xpPerHour: null,
      description: "The best way to get from level 1 to level 5 is by fletching arrow shafts, which give 5 experience per log. {| class=\"wikitable sortable align-center-1 align-center-2 align-center-3 align-left-4\" st...",
      members: true,
    },
    {
      name: "Bows",
      levelRange: [5, 99],
      xpPerHour: null,
      description: "Making bows is a slower, less intensive method of training fletching that is usually cheap or profitable. Fletching unstrung bows is more AFK-able but yields less experience per hour, stringing bow...",
      members: true,
    },
    {
      name: "Battlestaves",
      levelRange: [40, 80],
      xpPerHour: null,
      description: "Fletching battlestaves requires one piece of Celastrus bark, and yields 80 experience per bark. Only level 40 is needed to fletch a battlestaff, which makes it a better training method than fletchi...",
      members: true,
    },
    {
      name: "Redwood shields",
      levelRange: [92, 99],
      xpPerHour: null,
      description: "Redwood shields are an alternative method to fletching bows. Fletching one shield requires two redwood logs, and gives 216 experience per shield. With a Fletching knife, the XP rates increase subst...",
      members: true,
    },
  ],
};
