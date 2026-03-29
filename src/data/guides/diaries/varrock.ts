import type { AchievementDiaryArea } from "@/types/guides";

export const varrockDiary: AchievementDiaryArea = {
  id: "varrock",
  name: "Varrock",
  wikiUrl: "https://oldschool.runescape.wiki/w/Varrock_Diary",
  tiers: [
    {
      tier: "easy" as AchievementDiaryArea["tiers"][number]["tier"],
      tasks: [
        {
          id: "diary-varrock-easy-1",
          description: "Bones",
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
      ],
      rewards: [
      ],
    },
  ],
};
