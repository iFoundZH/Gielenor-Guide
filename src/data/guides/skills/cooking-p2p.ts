import type { SkillTrainingGuide } from "@/types/guides";

export const cookingP2pGuide: SkillTrainingGuide = {
  skill: "Cooking" as SkillTrainingGuide["skill"],
  variant: "p2p",
  wikiUrl: "https://oldschool.runescape.wiki/w/Pay-to-play_Cooking_training",
  methods: [
    {
      name: "Poison karambwan",
      levelRange: [1, 30],
      xpPerHour: null,
      description: "From level 1 to 30, 1-tick cook raw karambwan into poison karambwan. Karambwan can be cooked without tick delay by holding down 1 and rapidly using raw karambwan on a fire or range. This method cos...",
      members: true,
    },
    {
      name: "Cooking fish",
      levelRange: [1, 30],
      xpPerHour: null,
      description: "Alternatively, cook various fish for early experience. This is slower than cooking poison karambwan, but cheaper and less click-intensive. The fish needed for each level range are shown in the tabl...",
      members: true,
    },
    {
      name: "Cooked karambwan",
      levelRange: [30, 99],
      xpPerHour: null,
      description: "Completion of the quest Tai Bwo Wannai Trio is required to successfully cook karambwan.  1-tick cooking karambwan provides the fastest Cooking experience. Karambwan can be cooked without tick delay...",
      members: true,
    },
    {
      name: "Bake Pie",
      levelRange: [10, 99],
      xpPerHour: null,
      description: "Completion of the quest Lunar Diplomacy is required to cast Bake Pie. Baking pies using the Bake Pie spell offers relatively fast experience at a low amount of effort. It also offers passive Magic ...",
      members: true,
    },
    {
      name: "Cooking fish",
      levelRange: [30, 99],
      xpPerHour: null,
      description: "Cooking various fish is a cheap or profitable low-effort alternative to the faster methods. Cooking an inventory of fish takes around 1 minute and 14 seconds in the Hosidius Kitchen, including bank...",
      members: true,
    },
  ],
};
