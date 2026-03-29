import type { AchievementDiaryArea } from "@/types/guides";

export const lumbridge_draynorDiary: AchievementDiaryArea = {
  id: "lumbridge-draynor",
  name: "Lumbridge & Draynor",
  wikiUrl: "https://oldschool.runescape.wiki/w/Lumbridge_&_Draynor_Diary",
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
          id: "diary-lumbridge-draynor-elite-1",
          description: "Completing the elite Lumbridge & Draynor diary will now double how much cave goblin wire is received when thieving.",
          requirements: [
          ],
        },
        {
          id: "diary-lumbridge-draynor-elite-2",
          description: "The Lumbridge & Draynor diary is no longer required for several shortcuts.",
          requirements: [
          ],
        },
      ],
      rewards: [
      ],
    },
  ],
};
