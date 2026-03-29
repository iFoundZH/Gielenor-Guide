import type { AchievementDiaryArea } from "@/types/guides";

export const fremennikDiary: AchievementDiaryArea = {
  id: "fremennik",
  name: "Fremennik",
  wikiUrl: "https://oldschool.runescape.wiki/w/Fremennik_Diary",
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
          id: "diary-fremennik-elite-1",
          description: "The Hard diary completion is not a requirement to use the Troll Stronghold agility shortcut anymore. However, the diary completion still changes the Stony Basalt teleport location to the rooftop, closer to the herb patch.",
          requirements: [
          ],
        },
      ],
      rewards: [
      ],
    },
  ],
};
