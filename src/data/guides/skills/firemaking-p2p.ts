import type { SkillTrainingGuide } from "@/types/guides";

export const firemakingP2pGuide: SkillTrainingGuide = {
  skill: "Firemaking" as SkillTrainingGuide["skill"],
  variant: "p2p",
  wikiUrl: "https://oldschool.runescape.wiki/w/Pay-to-play_Firemaking_training",
  methods: [
    {
      name: "Creating pyre logs",
      levelRange: [1, 30],
      xpPerHour: null,
      description: "",
      members: true,
    },
    {
      name: "99: Burning logs",
      levelRange: [1, 30],
      xpPerHour: null,
      description: "",
      members: true,
    },
    {
      name: "Burning logs on a campfire",
      levelRange: [1, 99],
      xpPerHour: null,
      description: "Burning logs on a forester's campfire is a low-effort alternative to the faster methods. Choose a location where a campfire can be lit right next to a bank, such as the Grand Exchange, Rogues' Den,...",
      members: true,
    },
    {
      name: "Wintertodt",
      levelRange: [50, 99],
      xpPerHour: null,
      description: "Subduing Wintertodt from level 50 Firemaking onwards is a slower, but profitable and low-effort alternative to burning logs. It also grants passive Woodcutting experience from chopping the bruma ro...",
      members: true,
    },
  ],
};
