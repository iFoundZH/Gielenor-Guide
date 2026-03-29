import type { AchievementDiaryArea } from "@/types/guides";

export const faladorDiary: AchievementDiaryArea = {
  id: "falador",
  name: "Falador",
  wikiUrl: "https://oldschool.runescape.wiki/w/Falador_Diary",
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
          id: "diary-falador-medium-1",
          description: "It is not possible to skip having to complete Skippy and the Mogres, or needing a fishing explosive, by killing them through a boat cannon through the Sailing skill.",
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
      ],
      rewards: [
      ],
    },
    {
      tier: "elite" as AchievementDiaryArea["tiers"][number]["tier"],
      tasks: [
      ],
      rewards: [
      ],
    },
  ],
};
