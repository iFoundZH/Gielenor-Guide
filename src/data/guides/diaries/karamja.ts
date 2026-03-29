import type { AchievementDiaryArea } from "@/types/guides";

export const karamjaDiary: AchievementDiaryArea = {
  id: "karamja",
  name: "Karamja",
  wikiUrl: "https://oldschool.runescape.wiki/w/Karamja_Diary",
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
          id: "diary-karamja-elite-1",
          description: "The Karamja hard diary reward lamp can now only be used on skills that meet the level 40 requirement.",
          requirements: [
          ],
        },
        {
          id: "diary-karamja-elite-2",
          description: "The Karamja medium diary reward lamp can now only be used on skills that meet the level 30 requirement.",
          requirements: [
          ],
        },
      ],
      rewards: [
      ],
    },
  ],
};
