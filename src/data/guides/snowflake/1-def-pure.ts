import type { SnowflakeGuide } from "@/types/guides";

export const oneDefPureGuide: SnowflakeGuide = {
  id: "1-def-pure",
  name: "1 Defence Pure",
  category: "restriction",
  description:
    "A 1 Defence Pure keeps Defence at level 1 permanently. This is the most popular PvP build in OSRS, sacrificing all defensive capability for the lowest possible combat level relative to offensive power. The restriction also locks out most armour and many quests.",
  sections: [
    {
      title: "Overview",
      level: 0,
      content:
        "A 1 Defence Pure is an account that never trains Defence above level 1. The primary purpose is PvP: by keeping Defence at 1, the account maintains a low combat level while maximizing Attack, Strength, Ranged, and Magic. This creates a powerful offensive build that fights opponents with similar combat levels but far lower offensive stats.\n\nBeyond PvP, many players enjoy the 1 Defence restriction as a PvM and skilling challenge. The inability to wear any armour requiring Defence (which includes most armour in the game) forces creative gear choices and makes boss fights significantly harder.\n\nThe key rule is simple: never gain Defence XP. This means carefully avoiding quests that award Defence XP, never selecting the Defence option in combat, and being cautious with experience lamps and quest rewards. A single mistake can ruin the account permanently, as there is no way to lower a stat in OSRS.",
      subsections: [],
    },
    {
      title: "Available Content",
      level: 0,
      content: "",
      subsections: [
        {
          title: "Quests",
          level: 1,
          content:
            "Quest selection is critical. Many quests award Defence XP as a mandatory reward, permanently disqualifying them. Key quests that are safe for 1 Defence Pures include:\n\n* Animal Magnetism -- awards Ava's Attractor/Accumulator (essential for Ranged training). Does NOT give Defence XP.\n* Monkey Madness I -- awards the ability to wield the dragon scimitar. You must NOT claim the XP reward in Defence. Choose Attack or Strength.\n* Death Plateau -- unlocks climbing boots. No Defence XP.\n* The Grand Tree / Tree Gnome Village -- unlocks gnome transportation. No Defence XP.\n* Desert Treasure I -- unlocks Ancient Magicks. No Defence XP.\n* Horror from the Deep -- unlocks god books. No Defence XP if you do not choose Defence as your reward.\n* Mage Arena I and II -- not quests, but unlock god staves and imbued god capes.\n\nQuests to absolutely avoid include:\n\n* Dragon Slayer I -- awards Defence XP (locks out rune platebody, but pures cannot wear it anyway).\n* Monkey Madness II -- requires 60 Defence.\n* Recipe for Disaster (Barrows gloves subquests) -- several subquests award Defence XP.\n* Lunar Diplomacy -- awards Defence XP.\n* King's Ransom -- awards Defence XP and is required for Piety.",
          subsections: [],
        },
        {
          title: "Gear",
          level: 1,
          content:
            "With 1 Defence, your armour options are limited to items with no Defence requirement:\n\nMelee: Ghostly robes (from The Curse of the Empty Lord miniquest), iron armour (1 Defence requirement), Climbing boots, Regen bracelet, Berserker necklace (with obsidian equipment), Amulet of fury or Amulet of torture, Fire Cape or Infernal Cape, Fighter hat from Barbarian Assault.\n\nRanged: Leather/studded chaps (no Defence requirement), Ranger boots (from medium clue scrolls -- extremely valuable), Robin Hood hat (from hard clue scrolls), Ava's Accumulator/Assembler, God dragonhide vambraces.\n\nMagic: Ghostly robes, Xerician robes (no Defence requirement), Mage's book, Imbued god cape, Eternal boots (requires 75 Magic, 75 Defence -- so NOT available), Mystic boots.\n\nWeapons: Dragon scimitar (after Monkey Madness I), Granite maul, Dragon claws (if obtainable), Armadyl godsword, Toxic blowpipe, Magic shortbow (i), Ancient staff (for Ancient Magicks).",
          subsections: [],
        },
        {
          title: "PvP Builds",
          level: 1,
          content:
            "Several sub-builds exist within the 1 Defence Pure archetype:\n\nGMaul Pure: 50 Attack, high Strength, 1 Defence. Uses granite maul special attack for KO potential. Low combat level, effective in PvP.\n\nDragon Scimitar Pure: 60 Attack, high Strength, 1 Defence. Adds the dragon scimitar as a primary weapon with granite maul as a KO weapon.\n\nAncient Mage Pure: 1 Attack, 1 Strength, 94+ Magic, 1 Defence. Uses Ancient Magicks (Ice Barrage) for PvP. Very specialized build.\n\nRange/Melee Hybrid: High Ranged (85+), 60-75 Attack, high Strength, 1 Defence. Switches between ranged and melee for unpredictable KO potential.\n\nMaxed Pure: 75 Attack (for Armadyl godsword), 99 Strength, 99 Ranged, 94+ Magic, 52 Prayer (for Smite), 1 Defence. The strongest 1 Defence build but highest combat level.",
          subsections: [],
        },
      ],
    },
    {
      title: "Progression Path",
      level: 0,
      content: "",
      subsections: [
        {
          title: "Early Game",
          level: 1,
          content:
            "Begin by completing safe quests that award combat XP: Waterfall Quest (Attack and Strength XP), The Grand Tree (Attack XP), Fight Arena (Attack XP), Tree Gnome Village (Attack XP). These quests skip the slowest early combat levels.\n\nTrain Attack to 50-60 and Strength to 60+ through Slayer or at sandcrabs/ammonite crabs. Crabs are AFK and provide good XP rates without high food consumption.\n\nComplete Animal Magnetism for Ava's device, which retrieves ammunition during Ranged training. This is essential for efficient Ranged levelling.\n\nAvoid clicking the Defence option in combat settings. Use the \"Attack\" or \"Strength\" combat style for melee, \"Accurate\" or \"Rapid\" for Ranged, and any non-Defensive casting option for Magic. Consider using RuneLite's \"Attack Styles\" plugin to warn you if you accidentally switch to a Defence-granting style.",
          subsections: [],
        },
        {
          title: "Mid Game",
          level: 1,
          content:
            "Complete Monkey Madness I for the dragon scimitar (60 Attack). This is a significant quest for a pure because the boss fight (Jungle Demon) must be completed with 1 Defence. Protect from Magic and use Ranged to safespot the demon.\n\nComplete Desert Treasure I for Ancient Magicks if pursuing a mage or hybrid build. The quest bosses are challenging at 1 Defence but manageable with protection prayers.\n\nTrain Prayer to 31 (Protect from Melee) or 43 (all overhead protection prayers) or 44 (Eagle Eye) or 52 (Smite). Each Prayer level increases combat level, so choose your target carefully based on your build.\n\nBegin PvP in the Bounty Hunter crater or PvP Worlds. Start with simple GMaul combos and work up to more complex switches. Practice on free PvP minigames like Last Man Standing first.",
          subsections: [],
        },
        {
          title: "Late Game",
          level: 1,
          content:
            "Max your primary combat stats. Most pures aim for 99 Strength, 99 Ranged, and 94+ Magic (for Ice Barrage). Attack level depends on build: 50 (GMaul), 60 (dragon scimitar), or 75 (Armadyl godsword/Staff of the Dead).\n\nAttempt the Fight Cave for a Fire Cape at 1 Defence. This is a significant challenge and a prestigious achievement. High Ranged (85+) and Protect from Missiles/Magic are required. Blowpipe makes Jad much more manageable.\n\nPursue the Infernal Cape for the ultimate pure achievement. This is exceptionally difficult at 1 Defence and is considered one of the hardest challenges in OSRS.\n\nFarm Vorkath, Zulrah, or other bosses for money-making. These are significantly harder at 1 Defence but very profitable. Zulrah in particular is popular among pures.\n\nCollect rare PvP drops and cosmetics. Ranger boots from medium clues are a highly sought-after item for pures.",
          subsections: [],
        },
      ],
    },
    {
      title: "Tips & Challenges",
      level: 0,
      content:
        "The single biggest danger is accidental Defence XP. Use RuneLite's Attack Style plugin to lock your combat style and display warnings. Never left-click without checking your combat style first.\n\nQuest XP rewards are permanent. Before accepting any quest reward, verify it does not include Defence XP. The OSRS Wiki lists all quest rewards -- check every time.\n\nExperience lamps and books from random events, Achievement Diaries, and other sources can be used on any skill. Never accidentally use them on Defence.\n\nCertain activities award Defence XP unavoidably: Barbarian Assault (Defender role), some Pest Control rewards, and certain diary rewards. Research before participating.\n\nPrayer level directly affects combat level. Every 8 Prayer levels adds 1 combat level (the formula uses Prayer level / 8, rounded down). Plan your Prayer level carefully based on your target combat level.\n\nFood consumption is extremely high in PvM because you take full damage from most attacks. Sharks, anglerfish, and karambwan combo eating are essential techniques.\n\nThe Protect Item prayer (25 Prayer) lets you keep one extra item on death. This is critical when risking valuable gear in PvP.\n\nConsider making a separate main account for questing and content that requires Defence. Many pure owners play both account types.",
      subsections: [],
    },
  ],
};
