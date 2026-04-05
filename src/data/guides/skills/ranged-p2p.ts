import type { SkillTrainingGuide } from "@/types/guides";

export const rangedP2pGuide: SkillTrainingGuide = {
  skill: "Ranged" as SkillTrainingGuide["skill"],
  variant: "p2p",
  wikiUrl: "https://oldschool.runescape.wiki/w/Pay-to-play_Ranged_training",
  methods: [
    {
      name: "/36: Questing",
      levelRange: [1, 32],
      xpPerHour: null,
      description: "Early levels can be skipped by completing quests that give Ranged experience. Completing Shadow of the Storm (putting the experience reward on Ranged), Death to the Dorgeshuun, and Horror from the ...",
      members: true,
    },
    {
      name: "Using dwarf multicannon",
      levelRange: [1, 45],
      xpPerHour: null,
      description: "Using the dwarf multicannon, once assembled, offers the fastest experience up to level 45. Players must have completed Dwarf Cannon quest to use and assemble their own dwarf multicannon, but there ...",
      members: true,
    },
    {
      name: "Chinning maniacal monkeys",
      levelRange: [45, 99],
      xpPerHour: null,
      description: "For more information, see Maniacal monkey/Strategies.",
      members: true,
    },
    {
      name: "Gemstone Crab near Tal Teklan in Varlamore has unlimited Hitpoints and only m...",
      levelRange: [1, 45],
      xpPerHour: null,
      description: "Gemstone Crab near Tal Teklan in Varlamore has unlimited Hitpoints and only moves every 10 minutes, thus making it a very afk alternative. Multiple people can attack this crab, removing the risk of...",
      members: true,
    },
    {
      name: "Chinning skeletal monkeys",
      levelRange: [45, 99],
      xpPerHour: null,
      description: "Throwing chinchompas at skeletal monkeys is only recommended for those who cannot access maniacal monkeys. Skeletal monkeys are located in the Ape Atoll Dungeon, which requires partial completion o...",
      members: true,
    },
    {
      name: "Pest Control",
      levelRange: [70, 99],
      xpPerHour: 40000,
      description: "Participating at the Pest Control minigame and spending Void Knight commendation points on Ranged experience is an alternative training method at higher levels. Having a combat level of at least 10...",
      members: true,
    },
    {
      name: "99: Nightmare Zone",
      levelRange: [70, 80],
      xpPerHour: null,
      description: "For more information, see Nightmare Zone/Strategies. Using the normal customisable rumble setup in Nightmare Zone allows for 20 minutes of AFK Ranged training. After 20 minutes, the player will sto...",
      members: true,
    },
    {
      name: "99: Training Ranged with Slayer",
      levelRange: [75, 80],
      xpPerHour: null,
      description: "Using the toxic blowpipe or the venator bow for Slayer training is not considered efficient to do, however it is an option for players who do not value gaining Melee or Magic experience and want so...",
      members: true,
    },
    {
      name: "Monkeys with Venator bow",
      levelRange: [80, 99],
      xpPerHour: 270000,
      description: "As a cheaper (albeit slower) alternative to Chinning, the Venator bow can be used with Amethyst arrows to kill either Skeleton monkeys or Maniacal monkeys to get experience rates between 140,000 an...",
      members: true,
    },
  ],
};
