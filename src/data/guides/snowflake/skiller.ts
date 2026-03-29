import type { SnowflakeGuide } from "@/types/guides";

export const skillerGuide: SnowflakeGuide = {
  id: "skiller",
  name: "Skiller",
  category: "restriction",
  description:
    "A Skiller keeps all combat stats (Attack, Strength, Defence, Ranged, Magic, Prayer, Hitpoints) at level 1. The account focuses entirely on non-combat skills, creating a unique challenge where the entire combat system is off-limits. Skillers are one of the oldest and most well-known snowflake account types.",
  sections: [
    {
      title: "Overview",
      level: 0,
      content:
        "A Skiller is an account with all combat stats permanently at level 1 (technically 10 Hitpoints, since that is the minimum starting level, but purist skillers keep all other combat stats at 1). The combat level of a pure skiller is 3, the lowest possible in the game.\n\nThe restriction removes all direct combat from the game. No monsters can be killed, no combat-related quests can be completed (unless they award no combat XP), and no combat gear has any value. Instead, the account focuses on the 15 non-combat skills: Mining, Fishing, Woodcutting, Cooking, Firemaking, Smithing, Crafting, Fletching, Herblore, Runecraft, Construction, Agility, Thieving, Hunter, and Farming.\n\nSkillers have a dedicated community with their own hiscores categories and achievements. Some skillers also maintain 10 HP while training Prayer through bone-based methods (Prayer does not award Hitpoints XP). Others keep Prayer at 1 for the lowest possible combat level.",
      subsections: [],
    },
    {
      title: "Available Content",
      level: 0,
      content: "",
      subsections: [
        {
          title: "Skills",
          level: 1,
          content:
            "All 15 non-combat skills are fully available:\n\nGathering skills (Mining, Fishing, Woodcutting, Hunter, Farming) form the backbone of a skiller's gameplay. These provide resources, money, and experience through straightforward training.\n\nArtisan skills (Smithing, Crafting, Cooking, Fletching, Herblore, Runecraft, Construction) process gathered resources or purchased supplies. Many of these are identical to training on a main account.\n\nSupport skills (Agility, Thieving) are fully trainable. Agility course failures and Thieving stun damage are dangerous at 10 HP but not fatal in most cases.\n\nFiremaking can be trained normally. Wintertodt is accessible but dangerous at 10 HP (damage scales with Hitpoints level, so it actually deals minimal damage to a skiller).\n\nFarming is a signature skiller skill. Farm runs provide steady XP and profit with no combat required.",
          subsections: [],
        },
        {
          title: "Quests",
          level: 1,
          content:
            "Very few quests are completable without gaining combat XP. Those available include:\n\n* Cook's Assistant -- no combat required.\n* Sheep Shearer -- no combat required.\n* Romeo and Juliet -- no combat required.\n* Rune Mysteries -- no combat required.\n* Doric's Quest -- no combat required.\n* Goblin Diplomacy -- no combat required.\n* Imp Catcher -- requires imp beads (can be obtained through trading or other players killing imps near you, but Ironman skillers must find alternative sources).\n* Monk's Friend -- no combat required.\n* Pirate's Treasure -- no combat required.\n* Prince Ali Rescue -- no combat required.\n* Black Knights' Fortress -- can be completed without combat by using specific strategies.\n* Ernest the Chicken -- no combat required.\n* The Restless Ghost -- no combat required (Prayer XP reward, which some skillers avoid).\n\nMost quests in the game require either combat or award combat XP, making the quest list extremely short. The quest point cape is not achievable on a skiller.",
          subsections: [],
        },
        {
          title: "Money Making",
          level: 1,
          content:
            "Without combat drops, skillers rely entirely on skilling for income:\n\nRunecrafting is one of the best money makers. Crafting double nature runes (91+ Runecraft) or blood runes (77+ Runecraft) generates strong GP/hour.\n\nHunter provides good money through black chinchompas (73+ Hunter, but these are in the Wilderness) or red chinchompas (63+ Hunter).\n\nThieving from Master Farmers (38+ Thieving with Rogues' Outfit) provides herb seeds for Farming or direct profit.\n\nFarming high-level herb patches (ranarr, snapdragon, torstol) with ultracompost provides consistent profit per run.\n\nWoodcutting magic logs (75+ Woodcutting) or redwood logs (90+ Woodcutting) generates steady income.\n\nSmithing blast furnace bars (particularly gold bars with goldsmith gauntlets) is profitable.\n\nCrafting can generate profit through gem cutting, glass blowing, or jewelry making.\n\nCooking high-level fish (sharks, anglerfish, dark crabs) purchased raw is a simple money maker.",
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
            "Begin with quests that award skilling XP: Cook's Assistant (Cooking), Doric's Quest (Mining), Sheep Shearer (Crafting). These skip the very early levels of several skills.\n\nTrain Fishing, Mining, and Woodcutting simultaneously in the early levels. These provide raw materials for Cooking, Smithing, and Firemaking respectively.\n\nAgility is worth training early for the run energy regeneration bonus. Start at the Gnome Stronghold course (level 1+) and progress to Draynor (10+), Al Kharid (20+), and Varrock (30+).\n\nThieving provides early money. Pickpocket men and women (level 1), cake stalls (level 5), and silk stalls (level 20) in Ardougne.\n\nJoin the Wintertodt at level 50 Firemaking. At 10 HP, Wintertodt deals minimal damage (1-2 per hit), making it very safe. The rewards provide seeds, ores, logs, and other useful supplies.",
          subsections: [],
        },
        {
          title: "Mid Game",
          level: 1,
          content:
            "Focus on unlocking profitable training methods. Train Thieving to 38+ for Master Farmers (herb seeds) or 55+ for Ardougne Knights (good XP and some profit).\n\nBegin Farming seriously. Do herb runs every 80-90 minutes for consistent profit and XP. Plant the highest-level herb seed you can.\n\nTrain Runecraft for money. Nature runes (44+ Runecraft) are profitable from the start, and double nature runes (91+) are among the best skiller money makers.\n\nLevel Hunter through bird houses (low-level) and falconry (43+), then transition to red chinchompas (63+) or herbiboar (80+).\n\nConstruction is expensive but unlocks a player-owned house with teleports, an altar, and storage. Aim for 50+ Construction for the key furniture unlocks.\n\nWork toward the Graceful outfit through Agility training. The set reduces weight and improves run energy restoration, which is essential for efficient skilling.",
          subsections: [],
        },
        {
          title: "Late Game",
          level: 1,
          content:
            "The ultimate skiller goal is a max total level (excluding combat skills). This means 99 in all 15 non-combat skills, totaling a skill total of 1,493 (plus combat stats at 1/1/1/1/1/10/1).\n\nLate-game training shifts to the most efficient methods: 3-tick Mining, Herbiboar for Hunter, blood/soul Runecraft, and mahogany tables for Construction.\n\nPursue the collection log for skilling content. Many skilling pets (Rock Golem, Heron, Beaver, Tangleroot, Rocky, Rift Guardian) are obtainable. The full skilling pet collection is a prestigious achievement.\n\nAchievement Diaries provide useful rewards. Many diary tasks require combat, but some tiers (particularly Easy) can be completed. The Ardougne Diary (easy) improves Thieving success rates.\n\nTempoross (65 Fishing), Guardians of the Rift (27 Runecraft), and Wintertodt (50 Firemaking) are the primary minigame activities. All are accessible without combat stats.\n\nSome skillers eventually choose to \"break\" the account by gaining combat XP to access new content. This is a personal choice -- there is no shame in evolving the account.",
          subsections: [],
        },
      ],
    },
    {
      title: "Tips & Challenges",
      level: 0,
      content:
        "At combat level 3, you are unable to fight back against any aggressive monster. Certain areas are dangerous: the Wilderness (PKers and monsters), dungeons with aggressive creatures, and some quest areas. Stick to safe zones.\n\nTeleport immediately if attacked by a random event or aggressive NPC. Keep emergency teleports (Ectophial, house teleport, ring of dueling) always available.\n\nRuneLite plugins can prevent accidental combat XP gain. Use the Attack Style plugin to warn you if a combat style is selected, and consider the XP Tracker to monitor any unexpected XP gains.\n\nIronman skillers face additional challenges because they cannot trade for supplies. Every resource must be gathered personally, making skills like Herblore and Crafting significantly harder.\n\nThe 10 HP threshold means Wintertodt is actually safer for skillers than for main accounts. Damage at Wintertodt scales with Hitpoints level, so 10 HP skillers take 1-2 damage per hit, easily outhealed by cakes or basic food.\n\nSome content is permanently locked: all bosses, all combat Slayer tasks, most quests, PvP, raids, and any activity requiring combat stats. Accept these limitations as part of the challenge.\n\nThe skiller community is active and supportive. Join a skiller clan chat for advice, motivation, and shared achievements. Popular skiller clans include those focused on specific goals like max total or pet hunting.\n\nTears of Guthix will go to your lowest skill. Plan which skill receives the weekly XP by keeping your target skill's XP slightly below others.",
      subsections: [],
    },
  ],
};
