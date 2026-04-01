import type { SkillTrainingGuide } from "@/types/guides";

export const farmingP2pGuide: SkillTrainingGuide = {
  skill: "Farming" as SkillTrainingGuide["skill"],
  variant: "p2p",
  wikiUrl: "https://oldschool.runescape.wiki/w/Pay-to-play_Farming_training",
  methods: [
    {
      name: "Questing",
      levelRange: [1, 38],
      xpPerHour: null,
      description: "Early levels can be skipped by completing quests that give Farming experience. Completing the Goblin generals subquest of Recipe for Disaster, Fairytale I - Growing Pains, Forgettable Tale... (requ...",
      members: true,
    },
    {
      name: "Bagged plants",
      levelRange: [1, 15],
      xpPerHour: null,
      description: "The fastest way to train the early levels is to plant bagged plants in the player-owned house. However, it is significantly more expensive than planting seeds. If the garden supplier does not have ...",
      members: true,
    },
    {
      name: "Making supercompost/ultracompost",
      levelRange: [1, 15],
      xpPerHour: null,
      description: "Another option to train the early levels is to make supercompost or ultracompost in a compost bin. Each bucket of supercompost grants 8.5 farming experience, or 10 experience with the addition of v...",
      members: true,
    },
    {
      name: "Farming allotments",
      levelRange: [1, 15],
      xpPerHour: null,
      description: "*Seed Table *Farming/Patch locations *Farming runs",
      members: true,
    },
    {
      name: "Sorceress's garden",
      levelRange: [1, 15],
      xpPerHour: null,
      description: "In the Sorceress's Garden minigame, players can pick sq'irk fruits or herbs from the gardens. No Thieving level is required, but a higher Thieving level increases Thieving experience rates. Picking...",
      members: true,
    },
    {
      name: "Tree runs",
      levelRange: [15, 99],
      xpPerHour: 1200000,
      description: "Tree runs are the most effective way to gain Farming experience. To do this, plant the highest-tier tree, fruit tree, and hardwood tree saplings available, along with the special tree saplings (cal...",
      members: true,
    },
  ],
};
