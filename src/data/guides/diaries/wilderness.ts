import type { AchievementDiaryArea } from "@/types/guides";

export const wildernessDiary: AchievementDiaryArea = {
  id: "wilderness",
  name: "Wilderness",
  wikiUrl: "https://oldschool.runescape.wiki/w/Wilderness_Diary",
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
          id: "diary-wilderness-elite-1",
          description: "Completion of the medium Widerness Diary will allow players to receive loot from the chest in the Rogues' Castle.",
          requirements: [
          ],
        },
        {
          id: "diary-wilderness-elite-2",
          description: "Completion of the medium Wilderness Diary now grants access to the lairs of Callisto, Venenatis and Vet'ion.",
          requirements: [
          ],
        },
        {
          id: "diary-wilderness-elite-3",
          description: "Completion of the hard Wilderness Diary now grants access to the lairs of Artio, Spindel and Calvar'ion.",
          requirements: [
          ],
        },
        {
          id: "diary-wilderness-elite-4",
          description: "The following are now rewards for players have completed the hard Wilderness diary:",
          requirements: [
          ],
        },
        {
          id: "diary-wilderness-elite-5",
          description: "Spindel, Artio and Calvar'ion are now locked behind the medium Wilderness diary.",
          requirements: [
          ],
        },
      ],
      rewards: [
      ],
    },
  ],
};
