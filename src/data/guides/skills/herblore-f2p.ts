import type { SkillTrainingGuide } from "@/types/guides";

export const herbloreF2pGuide: SkillTrainingGuide = {
  skill: "Herblore" as SkillTrainingGuide["skill"],
  variant: "f2p",
  wikiUrl: "https://oldschool.runescape.wiki/w/Herblore_training",
  methods: [
    {
      name: "Making potions",
      levelRange: [1, 99],
      xpPerHour: null,
      description: "For more in depth calculations and variations about the cost per experience, see Calculator:Herblore/Potions.  The most efficient way to gain Herblore experience is to make potions by combining bas...",
      members: false,
    },
    {
      name: "Herb cleaning",
      levelRange: [1, 99],
      xpPerHour: null,
      description: "Cleaning grimy herbs is a slow but easy and profitable method to training Herblore. Since an update on 10 September 2020, cleaning grimy herbs automatically cleans all herbs in the inventory. Playe...",
      members: false,
    },
    {
      name: "Degrime",
      levelRange: [1, 99],
      xpPerHour: null,
      description: "An alternative, less click-intensive method, is to use the degrime Arceuus spell, requiring 70 Magic and the completion of A Kingdom Divided to be cast. You can cast approximately 600 casts per hou...",
      members: false,
    },
    {
      name: "Making Guthix rest",
      levelRange: [1, 99],
      xpPerHour: null,
      description: "A medium-intensity but profitable way to train Herblore is to make Guthix rest, requiring 18 Herblore and partial completion of the One Small Favour quest. Brewing Guthix rest differs from other me...",
      members: false,
    },
    {
      name: "Level 60+/81+: Mastering Mixology",
      levelRange: [60, 99],
      xpPerHour: null,
      description: "At level 60 and with completion of Children of the Sun, players can go to Aldarin and take part in the Mastering Mixology minigame, however it will become more efficient at higher levels, with the ...",
      members: false,
    },
  ],
};
