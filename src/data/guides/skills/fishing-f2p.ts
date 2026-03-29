import type { SkillTrainingGuide } from "@/types/guides";

export const fishingF2pGuide: SkillTrainingGuide = {
  skill: "Fishing" as SkillTrainingGuide["skill"],
  variant: "f2p",
  wikiUrl: "https://oldschool.runescape.wiki/w/Free-to-play_Fishing_training",
  methods: [
    {
      name: "Raw shrimps and raw anchovies",
      levelRange: [1, 20],
      xpPerHour: 3000,
      description: "Fishing raw shrimps and raw anchovies with a small fishing net at a net fishing location is the fastest way to train fishing at level 1 with experience rates of 1,500–3,000 experience per hour. The...",
      members: false,
    },
    {
      name: "Alternative for raw sardines and raw herring",
      levelRange: [5, 20],
      xpPerHour: 8000,
      description: "Fishing raw sardine and raw herring with a fishing rod and bait at a bait fishing location is the fastest way to train fishing until level 20 with experience rate of 3,000-8,000 experience per hour...",
      members: false,
    },
    {
      name: "Method #1",
      levelRange: [20, 40],
      xpPerHour: null,
      description: "Method #1: Fly fish at Barbarian Village, cook at Barbarian Village permanent fire, bank cooked fish at Ferox Enclave (57 Woodcutting needed for waka canoe, canoe from Barbarian Village to Ferox En...",
      members: false,
    },
    {
      name: "Method #2",
      levelRange: [20, 40],
      xpPerHour: null,
      description: "Method #2: Fly fish at Barbarian Village, bank raw fish at Ferox Enclave (57 Woodcutting needed for waka canoe, canoe from Barbarian Village to Ferox Enclave for banking, and canoe back to Barbaria...",
      members: false,
    },
    {
      name: "Method #3",
      levelRange: [20, 40],
      xpPerHour: null,
      description: "Method #3: Fly fish at Barbarian Village, cook at Barbarian Village permanent fire, drop cooked fish: ~23.5k Fishing XP/hour & ~31k Cooking XP/hour.",
      members: false,
    },
    {
      name: "Catching 150",
      levelRange: [15, 39],
      xpPerHour: null,
      description: "Catching 150-280 shrimp an hour has a profit range of  to .",
      members: false,
    },
    {
      name: "Catching 150",
      levelRange: [15, 39],
      xpPerHour: null,
      description: "Catching 150-280 anchovies an hour has a profit range of  to .",
      members: false,
    },
    {
      name: "Raw lobster",
      levelRange: [40, 49],
      xpPerHour: null,
      description: "For the full guide on catching lobsters, see here.  Fish raw lobsters at Musa Point. Players can expect to make  and 12,600 Fishing experience per hour. To bank the caught raw lobsters, use the boa...",
      members: false,
    },
    {
      name: "Less walking and coins, more experience per hour",
      levelRange: [50, 99],
      xpPerHour: null,
      description: "Less walking and coins, more experience per hour: Sell fish at the Karamja General Store.",
      members: false,
    },
    {
      name: "More total experience and clicks, less walking and coins",
      levelRange: [50, 99],
      xpPerHour: null,
      description: "More total experience and clicks, less walking and coins: Cook the fish after caught.",
      members: false,
    },
  ],
};
