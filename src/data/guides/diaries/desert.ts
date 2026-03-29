import type { AchievementDiaryArea } from "@/types/guides";

export const desertDiary: AchievementDiaryArea = {
  id: "desert",
  name: "Desert",
  wikiUrl: "https://oldschool.runescape.wiki/w/Desert_Diary",
  tiers: [
    {
      tier: "easy" as AchievementDiaryArea["tiers"][number]["tier"],
      tasks: [
        {
          id: "diary-desert-easy-1",
          description: "Players must have started Icthlarin's Little Helper for access to Sophanem.",
          requirements: [
          ],
        },
      ],
      rewards: [
      ],
    },
    {
      tier: "medium" as AchievementDiaryArea["tiers"][number]["tier"],
      tasks: [
      ],
      rewards: [
      ],
    },
    {
      tier: "hard" as AchievementDiaryArea["tiers"][number]["tier"],
      tasks: [
      ],
      rewards: [
      ],
    },
    {
      tier: "elite" as AchievementDiaryArea["tiers"][number]["tier"],
      tasks: [
        {
          id: "diary-desert-elite-1",
          description: "Removed Hard diary requirement to use the Al Kharid Palace window agility shortcut.",
          requirements: [
          ],
        },
        {
          id: "diary-desert-elite-2",
          description: "The Hard diary completion now gives increased experience and marks of grace in the Pollnivneach rooftop course.",
          requirements: [
          ],
        },
      ],
      rewards: [
      ],
    },
  ],
};
