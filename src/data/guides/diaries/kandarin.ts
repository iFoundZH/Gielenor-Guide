import type { AchievementDiaryArea } from "@/types/guides";

export const kandarinDiary: AchievementDiaryArea = {
  id: "kandarin",
  name: "Kandarin",
  wikiUrl: "https://oldschool.runescape.wiki/w/Kandarin_Diary",
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
          id: "diary-kandarin-medium-1",
          description: "Completion of the Barbarian Assault tutorial to be able to play the minigame",
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
