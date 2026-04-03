import type { SkillTrainingGuide } from "@/types/guides";

export const magicP2pGuide: SkillTrainingGuide = {
  skill: "Magic" as SkillTrainingGuide["skill"],
  variant: "p2p",
  wikiUrl: "https://oldschool.runescape.wiki/w/Pay-to-play_Magic_training",
  methods: [
    {
      name: "/34: Questing",
      levelRange: [1, 10],
      xpPerHour: null,
      description:
        "Early levels can be skipped by completing quests that give Magic experience. Completing Witch's Potion and Imp Catcher gives a total of 1,200 Magic experience, which is enough to get from level 1 t...",
      members: true,
    },
    {
      name: "/99: Enchanting bolts",
      levelRange: [4, 55],
      xpPerHour: null,
      description:
        "Enchanting gem-tipped bolts using the Enchant Crossbow Bolt spell is one of the fastest ways to train magic and can be done while running or doing other activities. Each cast enchants a set of 10 b...",
      members: true,
    },
    {
      name: "Lvl-1 Enchant",
      levelRange: [7, 21],
      xpPerHour: 32000,
      description:
        "From level 7 to 21, enchant sapphire or opal jewellery by using the Lvl-1 Enchant spell. The spell can be cast manually every 3 ticks, and each cast gives 17.5 experience. Players can gain up to ar...",
      members: true,
    },
    {
      name: "Low Level Alchemy",
      levelRange: [21, 55],
      xpPerHour: 60000,
      description:
        'At level 21, cast Low Level Alchemy (also known as "low alching") to convert items into coins. The spell can be cast every 3 ticks, and each cast gives 31 experience. This method can be done while ...',
      members: true,
    },
    {
      name: "Killing crabs",
      levelRange: [1, 55],
      xpPerHour: null,
      description:
        "Killing crabs with combat spells requires very little attention and offers relatively fast experience at lower levels. Use the highest-level combat spell available for the best damage output. Playe...",
      members: true,
    },
    {
      name: "Exploiting elemental weaknesses",
      levelRange: [1, 55],
      xpPerHour: null,
      description:
        "Elemental weaknesses increase both accuracy and damage on their corresponding elemental spell by a certain percentage, and commonly-accessible monsters have up to 100% elemental weakness. This allo...",
      members: true,
    },
    {
      name: "Splashing combat spells",
      levelRange: [1, 55],
      xpPerHour: 37800,
      description:
        "Splashing combat spells on weak monsters offers very slow experience, but only requires player input once every 20 minutes. To splash, attack an NPC while wearing equipment that gives at least -64 ...",
      members: true,
    },
    {
      name: "+: Grand Library of Great Kourend",
      levelRange: [20, 55],
      xpPerHour: 200000,
      description:
        "This minigame, which involves finding and delivering the requested books to characters in the Arceuus Library, offers fantastic experience rates without spending any runes. Each book delivered prov...",
      members: true,
    },
    {
      name: "Superheat Item",
      levelRange: [43, 55],
      xpPerHour: null,
      description:
        "From level 43 to 55, one possible option is to cast Superheat Item to smelt ores into bars. The spell can be cast every 3 ticks, and each cast gives 53 Magic experience. This method offers relative...",
      members: true,
    },
    {
      name: "Camelot Teleport",
      levelRange: [45, 55],
      xpPerHour: 80000,
      description:
        "Repeatedly casting Camelot Teleport offers around 80,000 experience per hour, with 55.5 experience per cast. Training from level 45 to 55 requires a total of 1,895 law runes, which costs  assuming ...",
      members: true,
    },
    {
      name: "Bursting/barraging on Ancient Magicks",
      levelRange: [62, 99],
      xpPerHour: null,
      description:
        "After completing the Desert Treasure I quest, the player unlocks Ancient Magicks. The burst and barrage spells on this spellbook can be used to kill multiple monsters at once in multi-combat areas....",
      members: true,
    },
    {
      name: "String Jewellery",
      levelRange: [80, 99],
      xpPerHour: null,
      description:
        "Casting String Jewellery on the Lunar spellbook requires relatively low amount of effort. The spell takes 1.8 seconds per amulet strung, or 48.6 seconds for an inventory, and gives 4 Crafting exper...",
      members: true,
    },
    {
      name: "Plank Make",
      levelRange: [86, 99],
      xpPerHour: null,
      description:
        "Completion of the quest Dream Mentor is required to cast Plank Make. At level 86, players can auto-cast Plank Make on mahogany logs. This method will generate around 90,000 Magic experience per hou...",
      members: true,
    },
    {
      name: "Profitable methods",
      levelRange: [7, 99],
      xpPerHour: null,
      description:
        "While it may be beneficial to find a consistent money maker and then train Magic with the faster but more expensive methods, it is possible to train magic without any loss. There is no way to profi...",
      members: true,
    },
    {
      name: "Tele-alching",
      levelRange: [55, 80],
      xpPerHour: 144600,
      description:
        '"Tele-alching" is a method which combines the two elements of casting High Level Alchemy and teleporting. To do this, cast High Level Alchemy followed by any teleport then wait 3 game ticks (1.8 se...',
      members: true,
    },
    {
      name: "Stun-alching",
      levelRange: [80, 99],
      xpPerHour: null,
      description:
        "At level 80 Magic, Stun-alching becomes available, but does cost much more than high alchemy which is generally profitable or free. The player is to cast High Alchemy, then cast Stun on an NPC, and...",
      members: true,
    },
  ],
};
