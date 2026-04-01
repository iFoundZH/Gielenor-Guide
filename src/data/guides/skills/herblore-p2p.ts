import type { SkillTrainingGuide } from "@/types/guides";

export const herbloreP2pGuide: SkillTrainingGuide = {
  skill: "Herblore" as SkillTrainingGuide["skill"],
  variant: "p2p",
  wikiUrl: "https://oldschool.runescape.wiki/w/Pay-to-play_Herblore_training",
  methods: [
    {
      name: "Quest experience rewards",
      levelRange: [3, 99],
      xpPerHour: null,
      description: "{|class=\"wikitable sortable lighttable qc-active\" style=\"text-align:center;\" !Quest !Experiencereward !Herblore req. !Other requirements",
      members: true,
    },
    {
      name: "Starting off",
      levelRange: [3, 99],
      xpPerHour: null,
      description: "Completing Jungle Potion, Recruitment Drive and The Dig Site quests will get the player from level 3 to 19. Here are some quests that grant Herblore experience which have little or no additional re...",
      members: true,
    },
    {
      name: "Making potions",
      levelRange: [1, 99],
      xpPerHour: null,
      description: "For more in depth calculations and variations about the cost per experience, see Calculator:Herblore/Potions.  The most efficient way to gain Herblore experience is to make potions by combining bas...",
      members: true,
    },
    {
      name: "Making barbarian mixes",
      levelRange: [1, 99],
      xpPerHour: null,
      description: "Barbarian mixes are generally not made as they are rarely traded and may have low value. It is not recommended to make barbarian mixes unless planning to use them. This calculator assumes buying 4 ...",
      members: true,
    },
    {
      name: "Making tar",
      levelRange: [1, 99],
      xpPerHour: null,
      description: "An alternative, potentially cheaper method of training Herblore is making tar. This requires fewer clicks than potion making, since twice as many actions are performed before banking and the durati...",
      members: true,
    },
    {
      name: "Herb cleaning",
      levelRange: [1, 99],
      xpPerHour: null,
      description: "Cleaning grimy herbs is a slow but easy and profitable method to training Herblore. Since an update on 10 September 2020, cleaning grimy herbs automatically cleans all herbs in the inventory. Playe...",
      members: true,
    },
    {
      name: "Degrime",
      levelRange: [1, 99],
      xpPerHour: null,
      description: "An alternative, less click-intensive method, is to use the degrime Arceuus spell, requiring 70 Magic and the completion of A Kingdom Divided to be cast. You can cast approximately 600 casts per hou...",
      members: true,
    },
    {
      name: "Making Guthix rest",
      levelRange: [1, 99],
      xpPerHour: null,
      description: "A medium-intensity but profitable way to train Herblore is to make Guthix rest, requiring 18 Herblore and partial completion of the One Small Favour quest. Brewing Guthix rest differs from other me...",
      members: true,
    },
    {
      name: "Level 60+/81+: Mastering Mixology",
      levelRange: [60, 99],
      xpPerHour: null,
      description: "At level 60 and with completion of Children of the Sun, players can go to Aldarin and take part in the Mastering Mixology minigame, however it will become more efficient at higher levels, with the ...",
      members: true,
    },
  ],
};
