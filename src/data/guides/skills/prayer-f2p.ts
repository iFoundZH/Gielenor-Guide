import type { SkillTrainingGuide } from "@/types/guides";

export const prayerF2pGuide: SkillTrainingGuide = {
  skill: "Prayer" as SkillTrainingGuide["skill"],
  variant: "f2p",
  wikiUrl: "https://oldschool.runescape.wiki/w/Free-to-play_Prayer_training",
  methods: [
    {
      name: "Starting off",
      levelRange: [1, 99],
      xpPerHour: null,
      description: "The Restless Ghost provides you with 1,125 Prayer experience which allows a player to raise Prayer from level 1 to 9 upon completion. There are no requirements to begin this quest (melee defensive ...",
      members: false,
    },
    {
      name: "Prayer melee",
      levelRange: [37, 99],
      xpPerHour: null,
      description: "If your desire is to maximise prayer bonus to be able to use prayers for a longer period of time in melee combat, this is the best-in-slot for prayer bonuses. This also suggests that the player has...",
      members: false,
    },
    {
      name: "Camdozaal",
      levelRange: [61, 99],
      xpPerHour: null,
      description: "Offering fish at the altar in the Ruins of Camdozaal is a less click-intensive method of training prayer, requiring at least 7 Fishing and Cooking and completion of the Below Ice Mountain quest. Ha...",
      members: false,
    },
    {
      name: "Bone Yard",
      levelRange: [20, 99],
      xpPerHour: null,
      description: "The Bone Yard in the Wilderness (directly north of Varrock) has many spawns of bones and a few spawns of big bones with no killing required. Recommendations *Food (optional) - There are multiple le...",
      members: false,
    },
    {
      name: "Chaos Temple",
      levelRange: [1, 99],
      xpPerHour: null,
      description: "Burying bones at the south-east Chaos Temple ruins in the Wilderness is more click-intensive but it is located in a lower-leveled Wilderness area (Levels 11–12) making it a slightly safer alternati...",
      members: false,
    },
    {
      name: "Low-level areas",
      levelRange: [1, 99],
      xpPerHour: null,
      description: "Many low level areas consist of people killing monsters. People often do not pick up the bones that lie on the ground, therefore there is often an endless supply of free bones. Areas and enemies in...",
      members: false,
    },
    {
      name: "High-level areas",
      levelRange: [1, 99],
      xpPerHour: null,
      description: "Big bones are dropped by the following monsters in free-to-play in these areas. *Giant frogs (Lumbridge Swamp) *Hill giants (Edgeville Dungeon or Giants' Plateau) *Moss giants (Varrock Sewers or Cr...",
      members: false,
    },
    {
      name: "Buying a bond",
      levelRange: [99, 99],
      xpPerHour: null,
      description: "It should be noted that training Prayer as a member is significantly more cost-effective, so you may want to postpone training until after you become member. One could consider buying a bond and us...",
      members: false,
    },
  ],
};
