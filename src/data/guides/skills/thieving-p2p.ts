import type { SkillTrainingGuide } from "@/types/guides";

export const thievingP2pGuide: SkillTrainingGuide = {
  skill: "Thieving" as SkillTrainingGuide["skill"],
  variant: "p2p",
  wikiUrl: "https://oldschool.runescape.wiki/w/Pay-to-play_Thieving_training",
  methods: [
    {
      name: "Questing",
      levelRange: [1, 42],
      xpPerHour: null,
      description:
        "Early levels can be skipped by completing quests that give Thieving experience. Completing Biohazard, Hazeel Cult, Fight Arena, Tower of Life, and Tribal Totem grants a total of 7,200 experience, w...",
      members: true,
    },
    {
      name: "/45: Chambers of Xeric thieving room",
      levelRange: [1, 36],
      xpPerHour: null,
      description:
        "From level 1 to 45, you can train Thieving in the Chambers of Xeric raid atop Mount Quidamortem in the Kebos Lowlands. Bring a lockpick (can obtain from a Scavenger inside the raid), then reload th...",
      members: true,
    },
    {
      name: "Chests in Aldarin Villas",
      levelRange: [36, 45],
      xpPerHour: 60000,
      description:
        "Stealing from chests in Aldarin villas offers the fastest experience from level 36 until 45. Each chest gives 200 experience per successful unlock. There is a chance on failure to be teleported out...",
      members: true,
    },
    {
      name: "Blackjacking",
      levelRange: [45, 99],
      xpPerHour: null,
      description:
        "Blackjacking bandits in Pollnivneach is one of the fastest Thieving training methods. From level 45 to 55, blackjack Bearded Pollnivnian bandits. From 55 to 65, target Pollnivnian bandits with scimitars. From 65 onwards, blackjack Menaphite Thugs in the southern part of Pollnivneach.",
      members: true,
    },
    {
      name: "/99: Stealing artefacts",
      levelRange: [49, 65],
      xpPerHour: null,
      description:
        "Stealing artefacts in Port Piscarilius requires 49 Thieving and Piscarilius favour. Players steal artefacts from occupied houses and deliver them to Captain Khaled. The houses have varying levels of danger and reward, scaling with Thieving level.",
      members: true,
    },
    {
      name: "Stealing from Rogues' Castle chests",
      levelRange: [84, 99],
      xpPerHour: null,
      description:
        "Stealing from Rogues' Castle chests in the Wilderness offers the fastest Thieving experience from level 84 onwards. Because the chests are located in the deep Wilderness in a multi-combat zone, it ...",
      members: true,
    },
    {
      name: "Pyramid Plunder",
      levelRange: [91, 99],
      xpPerHour: null,
      description:
        "The Pyramid Plunder minigame offers the fastest Thieving experience outside of the Wilderness from level 91 onwards. The strategy for Thieving experience is to loot the golden chest and all the urn...",
      members: true,
    },
    {
      name: "Men/Women",
      levelRange: [1, 5],
      xpPerHour: null,
      description:
        "From level 1 to 5, pickpocket men or women around Gielinor. Players who have their respawn point in Lumbridge can do so around Lumbridge Castle and simply die to regain Hitpoints. Alternatively, a ...",
      members: true,
    },
    {
      name: "Bakery stalls",
      levelRange: [5, 25],
      xpPerHour: 19200,
      description:
        "From level 5 to 25, steal from the eastern bakery stall in East Ardougne market. Stand under the baker to avoid getting caught by the guards, and drop the loot. Players can gain up to 19,200 experi...",
      members: true,
    },
    {
      name: "Fruit stalls",
      levelRange: [25, 50],
      xpPerHour: 42750,
      description:
        "From level 25 to 50, steal from fruit stalls in Hosidius. The best place to do this is in the easternmost house near the beach (see the map), which has 2 stalls close to each other and no guard dog...",
      members: true,
    },
    {
      name: "Stealing valuables in Varlamore",
      levelRange: [50, 99],
      xpPerHour: 65000,
      description:
        "Stealing valuables in Civitas illa Fortis is a low-effort alternative to the faster methods, allowing for significant AFK time. This method requires level 50 Thieving and completion of Children of ...",
      members: true,
    },
    {
      name: "99: Underwater",
      levelRange: [25, 85],
      xpPerHour: null,
      description:
        'With the completion of Bone Voyage and access to the Fossil Island, underwater thieving (also known as "swimming") becomes available. Unlike most other training methods, it focuses on training two ...',
      members: true,
    },
    {
      name: "Knights of Ardougne",
      levelRange: [55, 99],
      xpPerHour: 252900,
      description:
        "Pickpocketing Knights of Ardougne is a slower but more straightforward alternative to the faster training methods. A knight can be lured so that the player can continuously pickpocket without moving. Completing the Ardougne Diary tiers increases pickpocketing success rate.",
      members: true,
    },
    {
      name: "Dorgesh-Kaan rich chests",
      levelRange: [78, 99],
      xpPerHour: 230000,
      description:
        "Stealing from the rich chests in Dorgesh-Kaan is a fairly low-effort alternative that offers decent experience. Enter one of the two houses in Dorgesh-Kaan that contain two rich chests. Open both c...",
      members: true,
    },
    {
      name: "Sorceress's Garden",
      levelRange: [1, 99],
      xpPerHour: 140000,
      description:
        "The Sorceress's Garden minigame consists of navigating through a maze while avoiding guardians to pick fruit and squeeze them into juice. A pestle and mortar is used to squeeze the fruit into juice...",
      members: true,
    },
    {
      name: "Pickpocketing vyres",
      levelRange: [82, 99],
      xpPerHour: 180000,
      description:
        "Pickpocketing vyres at level 82 with rogue equipment, dodgy necklaces, and the hard Ardougne Diary completed provides good experience and profit. Requires completion of Sins of the Father to access Darkmeyer.",
      members: true,
    },
    {
      name: "Pickpocketing elves",
      levelRange: [85, 99],
      xpPerHour: 150000,
      description:
        "Pickpocketing elves in Prifddinas is a slower but profitable alternative after completing Song of the Elves. The elves in Prifddinas yield enhanced crystal teleport seeds which can be sold for high...",
      members: true,
    },
    {
      name: "Stealing from Port Roberts stalls",
      levelRange: [20, 99],
      xpPerHour: null,
      description:
        "With 50 Sailing, players can steal from the stalls in Port Roberts. Unlike regular stalls, these stalls do not deplete when players steal from them, and as such will be stolen from repeatedly when ...",
      members: true,
    },
    {
      name: "Master Farmers",
      levelRange: [94, 99],
      xpPerHour: 120000,
      description:
        "At level 94 and after completing the hard Ardougne Diary, players can pickpocket Master Farmers at 100% success rate. They yield ranarr and snapdragon seeds, which can be sold for very high profit....",
      members: true,
    },
  ],
};
