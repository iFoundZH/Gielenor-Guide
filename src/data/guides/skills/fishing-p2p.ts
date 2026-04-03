import type { SkillTrainingGuide } from "@/types/guides";

export const fishingP2pGuide: SkillTrainingGuide = {
  skill: "Fishing" as SkillTrainingGuide["skill"],
  variant: "p2p",
  wikiUrl: "https://oldschool.runescape.wiki/w/Pay-to-play_Fishing_training",
  methods: [
    {
      name: "/33: Questing",
      levelRange: [1, 24],
      xpPerHour: null,
      description:
        "Early levels can be skipped by completing quests that give Fishing experience. Completing Sea Slug, Fishing Contest, and the Freeing Pirate Pete quest of Recipe for Disaster will grant a total of 1...",
      members: true,
    },
    {
      name: "/58: Fly fishing",
      levelRange: [20, 47],
      xpPerHour: null,
      description:
        "3-tick fly fishing trout and salmon offers the fastest Fishing experience up to level 58 when using tick manipulation. Players will need a fly fishing rod and feathers to catch the fish. 3-tick fis...",
      members: true,
    },
    {
      name: "Drift net fishing",
      levelRange: [47, 99],
      xpPerHour: null,
      description:
        "Drift net fishing on Fossil Island provides split experience in both Fishing and Hunter. Players set drift nets in the underwater area and herd shoals of fish into them. It requires 44 Hunter and 47 Fishing to start, and is a good way to train both skills simultaneously.",
      members: true,
    },
    {
      name: "/99: Barbarian Fishing",
      levelRange: [58, 71],
      xpPerHour: null,
      description:
        "3-tick Barbarian Fishing becomes one of the fastest training methods at level 58. This method offers small amounts of passive Agility and Strength experience, which makes it an efficient way to tra...",
      members: true,
    },
    {
      name: "2-tick harpooning swordfish/tuna",
      levelRange: [71, 99],
      xpPerHour: null,
      description:
        "2-tick harpooning swordfish and tuna offers the fastest Fishing experience. Lure two rats west of the Port Piscarilius bank so that they attack the player every two ticks. Equip a shortbow without ...",
      members: true,
    },
    {
      name: "Tempoross",
      levelRange: [35, 99],
      xpPerHour: null,
      description:
        "Fighting the Tempoross offers relatively fast experience and it requires fairly low amount of effort compared to the tick manipulation methods. Not cooking the harpoonfish means getting lower amoun...",
      members: true,
    },
    {
      name: "Aerial fishing",
      levelRange: [43, 99],
      xpPerHour: null,
      description:
        "Aerial fishing is a viable alternative method to train both Fishing and Hunter. However, drift net fishing offers faster experience in both skills, so this method is only recommended for players wh...",
      members: true,
    },
    {
      name: "Monkfish",
      levelRange: [62, 99],
      xpPerHour: null,
      description:
        "After completing the Swan Song quest, players can catch monkfish in the Piscatoris Fishing Colony. Each monkfish grants 120 experience. This is an AFK method that provides decent profit alongside moderate experience rates.",
      members: true,
    },
    {
      name: "Karambwan",
      levelRange: [65, 99],
      xpPerHour: null,
      description:
        "Catching karambwan with a karambwan vessel requires completion of Tai Bwo Wannai Trio. Karambwan are caught from the karambwan fishing spot on the north-east coast of Karamja. They provide decent experience and are always in demand for cooking into combo food.",
      members: true,
    },
    {
      name: "Infernal eel",
      levelRange: [80, 99],
      xpPerHour: null,
      description:
        "Catching infernal eels in the inner part of Mor Ul Rek is a profitable low-effort alternative to the faster methods. To gain access to the area, the player must show a fire cape to a TzHaar-Ket gua...",
      members: true,
    },
    {
      name: "Minnows",
      levelRange: [82, 99],
      xpPerHour: null,
      description:
        "Catching minnows offers relatively slow experience, but it can provide decent profit depending on the Grand Exchange price of raw sharks. This can be done at Kylie Minnow's fishing platform in the ...",
      members: true,
    },
    {
      name: "Anglerfish",
      levelRange: [82, 99],
      xpPerHour: null,
      description:
        "Catching anglerfish in Port Piscarilius requires 100% Piscarilius favour and level 82 Fishing. Each anglerfish grants 120 experience. They are a popular AFK method that provides profit, as anglerfish are widely used for their overheal effect.",
      members: true,
    },
    {
      name: "Dark crabs",
      levelRange: [85, 99],
      xpPerHour: null,
      description:
        "Catching dark crabs in the Resource Area of the deep Wilderness requires level 85 Fishing and a dark fishing bait (purchased from Wilderness NPCs). This is a profitable but risky method due to the Wilderness PvP danger.",
      members: true,
    },
    {
      name: "Sacred eel",
      levelRange: [87, 99],
      xpPerHour: null,
      description:
        "At level 87 and after partially completing Regicide, catching sacred eels at Zul-Andra becomes a profitable low-effort alternative to the faster methods. Sacred eels are caught with a fishing rod a...",
      members: true,
    },
  ],
};
