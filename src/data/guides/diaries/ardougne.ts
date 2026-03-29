import type { AchievementDiaryArea } from "@/types/guides";

export const ardougneDiary: AchievementDiaryArea = {
  id: "ardougne",
  name: "Ardougne",
  wikiUrl: "https://oldschool.runescape.wiki/w/Ardougne_Diary",
  tiers: [
    {
      tier: "easy" as AchievementDiaryArea["tiers"][number]["tier"],
      tasks: [
      ],
      rewards: [
      ],
    },
    {
      tier: "medium" as AchievementDiaryArea["tiers"][number]["tier"],
      tasks: [
        {
          id: "diary-ardougne-medium-1",
          description: "Bucket",
          requirements: [
          ],
        },
      ],
      rewards: [
      ],
    },
    {
      tier: "hard" as AchievementDiaryArea["tiers"][number]["tier"],
      tasks: [
        {
          id: "diary-ardougne-hard-1",
          description: "Karamjan monkey greegree",
          requirements: [
          ],
        },
      ],
      rewards: [
      ],
    },
    {
      tier: "elite" as AchievementDiaryArea["tiers"][number]["tier"],
      tasks: [
        {
          id: "diary-ardougne-elite-1",
          description: "Prior to 11 August 2016, the easy Fishing Trawler task was replaced with \"Fish some raw trout by the Combat Training Camp.\" for Ironman accounts, as they were not allowed to participate in Fishing Trawler at the time of the diary's release.",
          requirements: [
          ],
        },
        {
          id: "diary-ardougne-elite-2",
          description: "As part of the rewards for completing the easy tasks, Two-pints will claim that your success rate of stealing from stalls in Ardougne is increased by 10%. However, there are no odds for stealing from stalls, as you'll only fail if seen by a nearby NPC.",
          requirements: [
          ],
        },
      ],
      rewards: [
      ],
    },
  ],
};
