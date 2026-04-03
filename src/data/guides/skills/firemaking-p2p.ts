import type { SkillTrainingGuide } from "@/types/guides";

export const firemakingP2pGuide: SkillTrainingGuide = {
  skill: "Firemaking" as SkillTrainingGuide["skill"],
  variant: "p2p",
  wikiUrl: "https://oldschool.runescape.wiki/w/Pay-to-play_Firemaking_training",
  methods: [
    {
      name: "Burning logs",
      levelRange: [1, 50],
      xpPerHour: null,
      description:
        "The traditional Firemaking method is burning logs with a tinderbox. Use the highest tier of log available: regular logs from level 1, oak from 15, willow from 30, and maple from 45. Stand at the west end of a long, clear stretch and light logs in a line.",
      members: true,
    },
    {
      name: "Creating pyre logs",
      levelRange: [5, 80],
      xpPerHour: null,
      description:
        "Sacred oil from the Shades of Mort'ton minigame can be used on logs to create pyre logs, which are burned on funeral pyres in the Mort'ton shade catacombs. This grants Firemaking and Prayer experience, and is the main way to obtain shade keys for rewards.",
      members: true,
    },
    {
      name: "Burning logs on a campfire",
      levelRange: [1, 99],
      xpPerHour: null,
      description:
        "Burning logs on a forester's campfire is a low-effort alternative to the faster methods. Choose a location where a campfire can be lit right next to a bank, such as the Grand Exchange, Rogues' Den,...",
      members: true,
    },
    {
      name: "Wintertodt",
      levelRange: [50, 99],
      xpPerHour: null,
      description:
        "Subduing Wintertodt from level 50 Firemaking onwards is a slower, but profitable and low-effort alternative to burning logs. It also grants passive Woodcutting experience from chopping the bruma ro...",
      members: true,
    },
  ],
};
