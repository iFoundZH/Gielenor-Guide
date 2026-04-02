import type {
  GettingStartedGuide,
  RelicGuide,
  RegionGuide,
  CombatBuildGuide,
  PactGuide,
} from "@/types/league-guides";

// ---------------------------------------------------------------------------
// Demonic Pacts League (Leagues VI) -- Strategy Guide Data
//
// Relic names, effects, and region data are sourced from the OSRS Wiki.
// Pact effects are speculative (data-mined placeholders) and marked as
// "Expected" throughout. Real values will be confirmed at league launch
// on 15 Apr 2026.
// ---------------------------------------------------------------------------

/**
 * Getting Started guide for the Demonic Pacts League.
 * Walks new players from spawn through late-game progression.
 */
export const dpGettingStarted: GettingStartedGuide = {
  intro:
    "The Demonic Pacts League drops you into Yama's Lair beneath Varlamore " +
    "with a fresh account, 5x XP, and 2x drop rates. Misthalin is completely " +
    "inaccessible for the first time in OSRS league history, so your early " +
    "game revolves around Varlamore's content. Dragon Slayer I and Rune " +
    "Mysteries are auto-completed, giving you immediate access to rune " +
    "equipment and Runecraft altars. Pick your T1 relic quickly and start " +
    "earning points -- Karamja auto-unlocks when you choose your first " +
    "choosable region, expanding your content pool significantly.",

  steps: [
    {
      title: "Spawn in Yama's Lair",
      timeframe: "0-5 minutes",
      objectives: [
        "Enter Civitas illa Fortis from Yama's Lair",
        "Talk to the Leagues Tutor for starter information",
        "Confirm Dragon Slayer I and Rune Mysteries are auto-completed",
        "Collect starting tools and supplies from the Leagues Tutor",
      ],
      tips: [
        "Grab starter tools (axe, pickaxe, net) from the Leagues Tutor immediately",
        "Stepping stones in Yama's Lair allow Agility training from level 1",
        "Your POH is located in Aldarin rather than Rimmington",
      ],
    },
    {
      title: "Varlamore Opening",
      timeframe: "5-30 minutes",
      objectives: [
        "Pick your T1 relic (Endless Harvest, Barbarian Gathering, or Abundance)",
        "Begin easy tasks in Varlamore (Quetzal Transport, wealthy citizen thieving)",
        "Start gathering skills to accumulate early resources",
        "Visit the Hunter Guild for Hunter rumours",
      ],
      tips: [
        "The Colossal Wyrm Agility course is available immediately and awards solid early Agility XP",
        "Mastering Mixology provides early Herblore XP without needing herb seeds",
        "Wealthy citizen thieving is excellent early Thieving XP in Varlamore",
        "Hunter Guild rumours give double XP if you pick Woodsman at T2",
      ],
    },
    {
      title: "Karamja + First Region",
      timeframe: "30-120 minutes",
      objectives: [
        "Earn enough points to unlock your first choosable region",
        "Karamja auto-unlocks when you choose your first region",
        "Explore Karamja content: TzHaar, gem rocks, Brimhaven Agility",
        "Start working toward medium-difficulty tasks",
      ],
      tips: [
        "Fight Caves preparation can begin early with TzHaar monsters for combat XP",
        "Gem rocks on Karamja are great for early Crafting tasks",
        "Brimhaven Agility Arena offers an alternative Agility training method",
        "Karamja tasks are generally lower value -- focus on your chosen region first",
      ],
    },
    {
      title: "Relic Tier 2",
      timeframe: "Around 750 points",
      objectives: [
        "Unlock your T2 relic (Hotfoot or Woodsman)",
        "Begin leveraging the 8x XP multiplier (passive at T2)",
        "Push toward hard-difficulty tasks with your expanded relic toolkit",
        "Build combat stats for upcoming boss content",
      ],
      tips: [
        "Hotfoot auto-cooks fish you catch and auto-smelts ore you mine, providing passive Cooking/Smithing XP alongside gathering",
        "Woodsman pairs well with Barbarian Gathering for hunter chains -- traps auto-bank, double loot",
        "The 8x XP multiplier at T2 significantly accelerates skill leveling",
        "Start banking supplies for Herblore and Crafting tasks you will need later",
      ],
    },
    {
      title: "Mid-Game Push",
      timeframe: "2-8 hours",
      objectives: [
        "Evil Eye (T3) auto-unlocks at 1,500 points -- boss teleports change everything",
        "Begin boss tasks using Evil Eye teleports across all unlocked regions",
        "Push for Conniving Clues (T4) to start the passive clue pipeline",
        "Nature's Accord (T5) opens Farming and fairy ring teleports",
      ],
      tips: [
        "Start boss tasks immediately once Evil Eye is available -- it eliminates all travel time",
        "Conniving Clues at T4 makes every clue scroll complete in minimum steps with maximum rewards",
        "Nature's Accord at T5 lets you farm herbs every minute with 10x noted yield",
        "Use fairy mushroom teleports alongside Evil Eye for comprehensive travel coverage",
      ],
    },
    {
      title: "Late Game",
      timeframe: "8+ hours",
      objectives: [
        "Culling Spree (T6) turns Slayer into the primary point engine",
        "Reloaded (T7) lets you pick a second relic from T1 or T2",
        "T8 choice (Minion or Flask of Fervour) for endgame combat",
        "Push through elite and master tasks for top reward tiers",
      ],
      tips: [
        "With Culling Spree, pick boss Slayer tasks with 5-kill assignments for maximum task throughput",
        "Reloaded at T7 is best used to pick whichever T1/T2 relic you did not choose initially",
        "Minion provides sustained DPS and auto-looting; Flask of Fervour provides burst healing and survivability",
        "Superior Slayer monster chain-spawning from Culling Spree generates elite clue scrolls continuously",
      ],
    },
  ],
};

/**
 * Relic tier-by-tier strategy guide for DP.
 * Rankings reflect efficiency value for general-purpose league progression.
 */
export const dpRelicGuide: RelicGuide = {
  intro:
    "The Demonic Pacts League features 8 relic tiers with a mix of choices " +
    "and mandatory relics. Tiers 1, 2, and 8 offer meaningful choices that " +
    "shape your playstyle. Tiers 3 through 7 are mandatory single-option " +
    "relics that every player receives -- these form the backbone of the " +
    "league's power curve. The Reloaded relic at T7 lets you revisit your " +
    "T1/T2 decision by picking a second relic from those tiers, so your " +
    "initial choice is less punishing than in previous leagues.",

  tiers: [
    {
      tier: 1,
      unlockPoints: 0,
      passiveEffects: [
        "5x XP multiplier",
        "2x item drop rate from eligible sources",
        "Farming ticks every minute instead of every 5 minutes",
        "4x minigame points",
        "Run energy never drains",
        "Clue scrolls drop as stackable scroll boxes with saved progress",
      ],
      relics: [
        {
          name: "Endless Harvest",
          ranking: "S",
          description:
            "All gathered resources auto-bank. Fishing spots, trees, and mining rocks " +
            "never deplete after your initial interaction. Resources from Fishing, " +
            "Woodcutting, and Mining are multiplied by 2x with XP for all additional " +
            "resources.",
          bestFor: [
            "AFK skilling -- gather indefinitely without banking",
            "Ironman-style supply accumulation",
            "Fastest path to early skilling tasks (2x resources halves completion time)",
          ],
          synergyWith: [
            "Hotfoot (auto-cook fish, auto-smelt ore from your banked resources)",
            "Kebos & Kourend (Blast Mine, Tempoross, Woodcutting Guild)",
            "Culling Spree (banked supplies fund extended boss trips)",
          ],
        },
        {
          name: "Barbarian Gathering",
          ranking: "A",
          description:
            "Grants a knapsack (140 capacity, 3 resource types). Bare-hand gathering " +
            "with crystal-tier tool equivalents. 50% second chance on gathering failures. " +
            "10% bonus Strength and Agility XP from gathering.",
          bestFor: [
            "Players who want combat XP alongside gathering (Strength/Agility bonus)",
            "Inventory flexibility with the knapsack system",
            "No-tool gathering for ultimate mobility",
          ],
          synergyWith: [
            "Woodsman (hunter traps auto-bank, double loot pairs with bare-hand gathering)",
            "Wilderness (no risk of losing tools)",
            "Morytania (Hallowed Sepulchre benefits from Agility XP bonus)",
          ],
        },
        {
          name: "Abundance",
          ranking: "A",
          description:
            "All non-combat skills permanently boosted by +10 levels. Gain an additional " +
            "2 XP per XP drop (affected by league multiplier). Generate coins equal to 2x " +
            "XP gained.",
          bestFor: [
            "Completionists who want access to high-level content earlier",
            "GP generation for shop purchases and Construction",
            "Unlocking skill-gated content without grinding levels",
          ],
          synergyWith: [
            "Hotfoot (boosted Agility/Cooking levels + auto-cook/smelt)",
            "Kharidian Desert (Pyramid Plunder with boosted Thieving level)",
            "Any region with level-gated content you want to access early",
          ],
        },
      ],
    },
    {
      tier: 2,
      unlockPoints: 750,
      passiveEffects: [
        "XP multiplier increased from 5x to 8x",
      ],
      relics: [
        {
          name: "Hotfoot",
          ranking: "S",
          description:
            "Fish auto-cook, ore auto-smelts, 100% Agility and Cooking success rate. " +
            "Agility XP while running. Rooftop course laps grant double completion count " +
            "with 25% bonus XP. Marks of grace always 33% spawn chance. 2x termites from " +
            "Colossal Wyrm, 10x crystal shards from Prifddinas course.",
          bestFor: [
            "Combining Fishing + Cooking + Agility into a single activity",
            "Rooftop agility course efficiency (double lap count)",
            "Never failing an Agility obstacle or burning food",
          ],
          synergyWith: [
            "Endless Harvest (auto-banked fish get auto-cooked; auto-banked ore gets auto-smelted)",
            "Kandarin (Seers' rooftop course with double laps, Catherby fishing with auto-cook)",
            "Morytania (Hallowed Sepulchre benefits from 100% Agility success)",
          ],
        },
        {
          name: "Woodsman",
          ranking: "A",
          description:
            "Hunter traps auto-bank with 100% success rate, double loot and XP. Logs " +
            "auto-burn for Firemaking XP. All Fletching items processed at once (stackable " +
            "items capped at 10x per action). Hunter traps drop random seeds. Hunter " +
            "rumours give double XP. Impling loot doubled and noted. Quetzal Whistles " +
            "never lose charges.",
          bestFor: [
            "Hunter-focused progression through Varlamore's Hunter Guild",
            "Passive Firemaking XP from chopping logs",
            "Bulk Fletching for rapid arrow/bolt production",
          ],
          synergyWith: [
            "Barbarian Gathering (bare-hand gathering + auto-bank traps covers all gathering skills)",
            "Varlamore starting region (Hunter Guild rumours with double XP)",
            "Kebos & Kourend (seed drops feed Farming Guild, Tithe Farm integration)",
          ],
        },
      ],
    },
    {
      tier: 3,
      unlockPoints: 1500,
      mandatory: true,
      passiveEffects: [
        "Combat XP (including Hitpoints and Prayer) multiplied by 1.5x (multiplicative with other modifiers)",
        "Bigger and Badder Slayer unlock is free",
        "5x Slayer reward points from tasks with no 5-task requirement",
        "Superior Slayer monsters appear at 1/50 rate",
      ],
      relics: [
        {
          name: "Evil Eye",
          ranking: "S",
          description:
            "Teleport to the entrance of any boss or raid on the combat achievements " +
            "list. Barrows offers chest room or surface teleport. Each Moon of Peril " +
            "targetable individually. Ignores Wilderness teleport restrictions. Cannot " +
            "teleport to areas you have not unlocked.",
          bestFor: [
            "Eliminating all boss travel time across every unlocked region",
            "Rapid boss task cycling with instant teleports",
            "Barrows farming with direct chest room access",
          ],
          synergyWith: [
            "Culling Spree (pick boss Slayer task, teleport instantly, complete in seconds)",
            "Morytania (instant Barrows chest, Nightmare, ToB, Grotesque Guardian access)",
            "Kebos & Kourend (instant CoX, Hydra, Sarachnis teleports)",
          ],
        },
      ],
    },
    {
      tier: 4,
      unlockPoints: 2500,
      mandatory: true,
      passiveEffects: [
        "Item drop rate increased from 2x to 5x",
        "Minigame points boosted from 4x to 8x",
      ],
      relics: [
        {
          name: "Conniving Clues",
          ranking: "S",
          description:
            "Caskets have 1/3 chance to award clue contracts that teleport you to " +
            "your current clue step. 1/4 chance for caskets to contain another clue " +
            "box of the same tier. Creature clue drop rate buffed to 1/15. Skilling " +
            "clue vessels 10x more likely. All clues have minimum steps and maximum " +
            "reward rolls. Emote and Falo steps require no items.",
          bestFor: [
            "Passive clue completion pipeline alongside other activities",
            "Completing clue scroll tasks with minimal time investment",
            "Master clue scrolls in 3-4 steps with maximum rewards",
          ],
          synergyWith: [
            "Culling Spree (superiors drop elite clues, feeding the clue pipeline)",
            "Evil Eye (boss kills at 1/15 clue rate + contracts for instant step travel)",
            "Endless Harvest (skilling vessels 10x more likely while AFK gathering)",
          ],
        },
      ],
    },
    {
      tier: 5,
      unlockPoints: 5000,
      mandatory: true,
      passiveEffects: [
        "XP multiplier increased from 8x to 12x",
      ],
      relics: [
        {
          name: "Nature's Accord",
          ranking: "S",
          description:
            "Grants a fairy mushroom for teleporting to any fairy ring, spirit tree, " +
            "or tool leprechaun. No Farming level requirements for any planting or " +
            "harvesting. 10x noted yield from all patches. Plants never die. 20% seed " +
            "save chance. Auto-completes Tree Gnome Village quest. Ignores Wilderness " +
            "teleport restrictions.",
          bestFor: [
            "Farming tasks completed in minutes with 10x noted yield and 1-minute ticks",
            "Secondary teleport network alongside Evil Eye",
            "Herb runs every few minutes for sustained Herblore supplies",
          ],
          synergyWith: [
            "Woodsman (seed drops from Hunter traps feed Farming patches)",
            "Kebos & Kourend (Farming Guild + Hespori with instant fairy ring access)",
            "Kandarin (Catherby herb patches with fairy ring proximity)",
          ],
        },
      ],
    },
    {
      tier: 6,
      unlockPoints: 8000,
      mandatory: true,
      passiveEffects: [],
      relics: [
        {
          name: "Culling Spree",
          ranking: "S",
          description:
            "Choose Slayer task from 3 options (at least 1 boss task guaranteed). " +
            "Selectable kill count from 5 to 200. Superior Slayer monsters have 50% " +
            "chance to chain-spawn another superior on death. Superiors always drop 1-3 " +
            "elite clues. Free Slayer helm effect without wearing one. All Slayer shop " +
            "perks are free. Rune pouch, Herb sack, and Looting bag available from " +
            "Slayer shop.",
          bestFor: [
            "Turning Slayer into the primary point engine with boss task cycling",
            "Chain-spawning superiors for elite clue generation",
            "Freeing the helm slot by getting Slayer helm effect passively",
          ],
          synergyWith: [
            "Evil Eye (pick boss task, teleport instantly, 5-kill completion, repeat)",
            "Conniving Clues (elite clues from superiors feed the clue pipeline)",
            "Kourend (Catacombs stacking with superior chains) and Morytania (Slayer Tower)",
          ],
        },
      ],
    },
    {
      tier: 7,
      unlockPoints: 16000,
      mandatory: true,
      passiveEffects: [
        "XP multiplier increased from 12x to 16x",
      ],
      relics: [
        {
          name: "Reloaded",
          ranking: "S",
          description:
            "Choose another relic from any tier below this one. This effectively " +
            "lets you pick a second T1 or T2 relic, covering the choice you did not " +
            "make earlier.",
          bestFor: [
            "Picking up the T1/T2 relic you skipped at the start",
            "Combining Endless Harvest + Barbarian Gathering or Hotfoot + Woodsman",
            "Rounding out skill coverage for completionist pushes",
          ],
          synergyWith: [
            "Any T1/T2 relic you did not originally choose",
            "Late-game task coverage (picking Abundance for +10 boost to finish remaining skill tasks)",
            "Hotfoot + Woodsman combo for covering all production and gathering skills",
          ],
        },
      ],
    },
    {
      tier: 8,
      unlockPoints: 25000,
      passiveEffects: [],
      relics: [
        {
          name: "Minion",
          ranking: "S",
          description:
            "Summon a 30-minute combat companion. Stats: 3-10 hit (up to 20 with 5 " +
            "Zamorak items), 1.8s attack speed, 45,000 accuracy. AoE attacks in " +
            "multi-combat. Auto-loots kills with configurable minimum value and noting. " +
            "Damages thrall-immune targets. Does not fight in PvP or against Yama.",
          bestFor: [
            "Sustained DPS increase across all bossing content",
            "Auto-looting for hands-free item collection during combat",
            "AoE damage in multi-combat (Catacombs, Barrows, slayer areas)",
          ],
          synergyWith: [
            "Culling Spree (boss Slayer tasks with minion DPS + auto-loot)",
            "Evil Eye (teleport to boss, summon minion, maximum uptime)",
            "Morytania (Barrows multi-combat AoE, Slayer Tower chaining)",
          ],
        },
        {
          name: "Flask of Fervour",
          ranking: "A",
          description:
            "Full HP, Prayer, and special attack restore on use. Triggers 3 AoE " +
            "explosions dealing 60% of base Prayer level as typeless damage within " +
            "3 tiles. Reduces all damage taken to 0 for 2.4 seconds. Base 3-minute " +
            "cooldown reduced by 0.6s per 10 damage dealt in a single hit.",
          bestFor: [
            "Burst survivability at challenging bosses and raids",
            "Spec weapon cycling (full spec restore enables back-to-back specials)",
            "Emergency recovery during high-risk encounters",
          ],
          synergyWith: [
            "Berserker's Oath pact (full HP restore compensates for no protection prayers) [Expected]",
            "Glass Cannon pact (damage invulnerability window offsets increased damage taken) [Expected]",
            "Kharidian Desert (ToA high invocations where survivability is critical)",
          ],
        },
      ],
    },
  ],
};

/**
 * Region evaluation guide for DP.
 * Regions ranked by overall task density, content breadth, and strategic value.
 * Task counts are omitted (placeholder data -- real counts TBD at launch).
 */
export const dpRegionGuide: RegionGuide = {
  intro:
    "Demonic Pacts features 11 regions with a unique twist: Varlamore is your " +
    "starting region (not Misthalin), Karamja auto-unlocks with your first region " +
    "pick, and Misthalin is completely inaccessible. You choose 3 of the 8 " +
    "choosable regions, so your picks define your entire league experience. " +
    "Region selection should balance boss content for elite/master tasks, skilling " +
    "breadth for easy/medium task volume, and synergy with your relic choices.",

  unlockMechanic:
    "Regions unlock by completing tasks. Your first choosable region triggers Karamja " +
    "as an auto-unlock. Subsequent regions unlock at higher task thresholds. With only " +
    "3 choosable slots, every pick matters -- there is no respec.",

  regions: [
    {
      name: "Kebos & Kourend",
      tier: "S",
      type: "choosable",
      // echoBoss: unconfirmed for DP -- echo bosses have not been announced for this league
      highlights: [
        "Chambers of Xeric (CoX) -- highest raid task density",
        "Alchemical Hydra at 95 Slayer -- massive point farm with boosted drop rates",
        "Wintertodt for Firemaking, GOTR for Runecrafting, Tithe Farm for Farming",
        "Catacombs of Kourend for AoE Slayer with superior chain-spawning",
        "Five Kourend houses with favour-based task chains",
        "Farming Guild and Hespori for passive completions",
      ],
      pickFirstIf:
        "You want the highest task density and broadest content coverage across " +
        "both skilling and PvM.",
      avoidIf:
        "You are focused purely on high-level PvM without any skilling interest -- " +
        "though even then, the task density here is hard to beat.",
    },
    {
      name: "Morytania",
      tier: "S",
      type: "choosable",
      highlights: [
        "Theatre of Blood (ToB) -- dense elite and master task cluster",
        "Barrows -- farmable within hours for early gear and tasks",
        "Nightmare / Phosani's Nightmare for master-tier tasks",
        "Slayer Tower (Gargoyles, Nechryael, Abyssal Demons, Grotesque Guardians)",
        "Hallowed Sepulchre -- best Agility training with its own task chain",
        "Priest in Peril is auto-completed, removing the traditional Morytania quest gate",
      ],
      pickFirstIf:
        "You want early PvM access -- Barrows is farmable at low combat levels " +
        "and provides gear for all three combat styles.",
      avoidIf:
        "You want AFK-friendly skilling content -- Morytania is heavily " +
        "combat-focused.",
    },
    {
      name: "Asgarnia",
      tier: "A",
      type: "choosable",
      highlights: [
        "God Wars Dungeon (all 4 generals + Nex) -- stacking KC tasks from easy through master",
        "Corporeal Beast for sigil tasks",
        "Warriors' Guild for defender tasks",
        "Motherload Mine for Mining task chains",
        "Pest Control with 8x boosted minigame points",
      ],
      pickFirstIf:
        "You want GWD access for BiS gear progression and dense boss variety.",
      avoidIf:
        "You need broad skilling content -- Asgarnia is boss-heavy with " +
        "limited non-combat tasks.",
    },
    {
      name: "Kharidian Desert",
      tier: "A",
      type: "choosable",
      highlights: [
        "Tombs of Amascut (ToA) -- scalable raid with invocation-based tasks",
        "Kalphite Queen for mid-game boss tasks",
        "Pyramid Plunder for Thieving XP and tasks",
        "ToA provides uniques to all raid members if any player receives one",
        "Sophanem content and desert quest chains",
      ],
      pickFirstIf:
        "You want a scalable raid -- ToA adjusts difficulty via invocations, " +
        "creating a ladder of tasks from medium through master.",
      avoidIf:
        "You need early-game content -- ToA requires mid-level gear and " +
        "stats to begin, making early points thin.",
    },
    {
      name: "Kandarin",
      tier: "A",
      type: "choosable",
      highlights: [
        "Zulrah -- consistent point farm with no damage cap or melee immunity in DP",
        "Seers' Village rooftop -- best mid-game Agility course",
        "Catherby -- highest-density fishing location",
        "Demonic Gorillas for zenyte jewelry tasks",
        "Ranging Guild and Piscatoris for Hunter and Ranged coverage",
        "Broad clue scroll geography for Conniving Clues",
      ],
      pickFirstIf:
        "You want a strong all-rounder with fishing, cooking, fletching, and " +
        "a reliable boss (Zulrah) for sustained mid-game points.",
      avoidIf:
        "You want dense boss content -- Kandarin has fewer elite/master boss " +
        "tasks compared to Morytania or Kebos.",
    },
    {
      name: "Fremennik Province",
      tier: "B",
      type: "choosable",
      highlights: [
        "Vorkath -- consistent GP and stacking KC tasks (drops Ava's Assembler directly in DP)",
        "Dagannoth Kings -- ring tasks across all three combat styles",
        "Nex (shared access with Asgarnia)",
        "Lunar Isle spellbook access",
        "Fremennik Slayer Dungeon content",
      ],
      pickFirstIf:
        "You want Vorkath for consistent GP, tasks, and the direct Assembler " +
        "drop without needing DS2 head grind.",
      avoidIf:
        "You need skilling variety -- Fremennik lacks broad non-combat " +
        "content compared to Kandarin or Kebos.",
    },
    {
      name: "Tirannwn",
      tier: "B",
      type: "choosable",
      highlights: [
        "The Gauntlet / Corrupted Gauntlet -- zero gear requirement, high elite/master density",
        "Zalcano for Mining and Smithing tasks",
        "Prifddinas -- best agility course in the game, crystal gear, elven content",
        "Blade of Saeldor as a Gauntlet reward",
        "10x crystal shards from Prifddinas Agility with Hotfoot",
      ],
      pickFirstIf:
        "You are mechanically skilled and want Corrupted Gauntlet as your " +
        "primary endgame grind -- it requires zero gear.",
      avoidIf:
        "You are new to bossing -- Gauntlet has a steep learning curve and " +
        "the region has the fewest total tasks of any choosable region.",
    },
    {
      name: "Wilderness",
      tier: "B",
      type: "choosable",
      highlights: [
        "Callisto/Artio, Venenatis/Spindel, Vet'ion/Calvar'ion -- cave variants for safe farming",
        "Revenant Caves for GP and collection log entries",
        "Corporeal Beast (shared access with Asgarnia)",
        "Chaos Temple for free Prayer training",
        "PvP is disabled in leagues -- all Wilderness content is safe",
        "No Wilderness Medium diary requirement for boss access in DP",
      ],
      pickFirstIf:
        "You want free boss tasks with no PvP risk -- cave boss variants " +
        "are safe and farmable.",
      avoidIf:
        "You want skilling or raid content -- Wilderness has neither and " +
        "content is spread across a large area.",
    },
    {
      name: "Varlamore",
      tier: "B",
      type: "starting",
      // echoBoss: unconfirmed for DP -- echo bosses have not been announced for this league
      highlights: [
        "Fortis Colosseum -- scalable combat challenge with elite/master tasks",
        "Moons of Peril -- individual moon targeting with Evil Eye",
        "Vardorvis -- DT2 boss accessible from the start",
        "Hunter Guild with rumours (double XP with Woodsman)",
        "Colossal Wyrm Agility course from level 1",
        "Mastering Mixology for early Herblore",
        "Hueycoatl and Doom of Mokhaiotl boss content",
      ],
      pickFirstIf:
        "This is your starting region -- you always have it. Focus on exhausting " +
        "Varlamore tasks before spending time in other regions.",
      avoidIf:
        "You cannot avoid Varlamore -- it is always available as your starting region.",
    },
    {
      name: "Karamja",
      tier: "C",
      type: "auto-unlock",
      highlights: [
        "TzHaar content: Fight Caves (Fire Cape) and Fight Pits",
        "Steel and Iron dragons for Slayer",
        "Brimhaven Agility Arena",
        "Gem rocks for early Crafting",
        "Tai Bwo Wannai content",
      ],
      pickFirstIf:
        "You do not choose Karamja -- it auto-unlocks with your first region " +
        "pick. Focus on Fight Caves for an early hard task.",
      avoidIf:
        "You cannot avoid Karamja -- it auto-unlocks automatically. Its " +
        "content is limited but free.",
    },
    {
      name: "Misthalin",
      tier: "C",
      type: "inaccessible",
      highlights: [
        "Completely locked -- a first for OSRS leagues",
        "No access to Lumbridge, Varrock, or Grand Exchange",
        "All Misthalin-based content is unavailable",
      ],
      pickFirstIf:
        "You cannot pick Misthalin -- it is inaccessible in the Demonic Pacts League.",
      avoidIf:
        "You cannot avoid Misthalin -- it is already locked for everyone.",
    },
  ],
};

/**
 * Combat build archetypes for DP.
 * Each build defines a recommended relic path, region picks, pact loadout,
 * and gear progression. Pact entries are speculative.
 */
export const dpCombatBuilds: CombatBuildGuide = {
  intro:
    "Combat builds in the Demonic Pacts League are shaped by three systems: " +
    "relic choices (T1, T2, and T8 are meaningful picks), region selections " +
    "(which bosses and gear you can access), and pacts (risk/reward combat " +
    "modifiers). The following builds represent tested archetypes for different " +
    "playstyles. All builds share the same mandatory relics at T3-T7. Pact " +
    "recommendations are speculative -- exact values and interactions will be " +
    "confirmed at league launch.",

  builds: [
    {
      id: "melee-berserker",
      name: "Melee Berserker",
      style: "Melee",
      difficulty: "Intermediate",
      description:
        "A straightforward melee-focused build that leverages GWD and ToB " +
        "gear progression with Minion for sustained DPS. Auto-banked resources " +
        "from Endless Harvest fund supplies, while Hotfoot handles Agility and " +
        "Cooking passively. Strong at Barrows, GWD, and Slayer content.",
      regions: ["Asgarnia", "Morytania", "Kebos & Kourend"],
      relics: [
        { tier: 1, name: "Endless Harvest" },
        { tier: 2, name: "Hotfoot" },
        { tier: 3, name: "Evil Eye" },
        { tier: 4, name: "Conniving Clues" },
        { tier: 5, name: "Nature's Accord" },
        { tier: 6, name: "Culling Spree" },
        { tier: 7, name: "Reloaded" },
        { tier: 8, name: "Minion" },
      ],
      pacts: ["Melee Might [Expected]", "Glass Cannon [Expected]"],
      gearProgression: [
        {
          phase: "Early (0-2,500 pts)",
          items: [
            "Rune platebody (DS1 auto-completed)",
            "Rune scimitar",
            "Climbing boots",
            "Amulet of power",
          ],
        },
        {
          phase: "Mid (2,500-18,000 pts)",
          items: [
            "Barrows melee sets (Dharok's, Torag's, Verac's)",
            "Dragon scimitar",
            "Warrior ring from DKs (if Fremennik) or berserker ring",
            "Fighter torso from Barbarian Assault",
          ],
        },
        {
          phase: "Late (18,000+ pts)",
          items: [
            "Bandos chestplate and tassets (GWD)",
            "Inquisitor's mace/armour (Nightmare)",
            "Avernic defender (ToB)",
            "Infernal cape (if skilled enough for Inferno)",
          ],
        },
      ],
      strengths: [
        "Excellent gear progression path through Barrows to GWD to ToB",
        "Minion adds sustained DPS and AoE in multi-combat Slayer",
        "Melee Might pact amplifies already-strong melee damage [Expected]",
        "Most bosses are melee-viable, providing broad task coverage",
      ],
      weaknesses: [
        "Glass Cannon pact increases damage taken at punishing bosses [Expected]",
        "Reduced effectiveness in ranged/magic from Melee Might pact [Expected]",
        "GWD requires significant combat stats before it becomes efficient",
        "Relies on prayer for survival at most bosses",
      ],
    },
    {
      id: "ranged-sniper",
      name: "Ranged Sniper",
      style: "Ranged",
      difficulty: "Advanced",
      description:
        "A ranged-primary build that prioritizes safe-spotting and kiting. " +
        "Barbarian Gathering provides bare-hand gathering without tools, " +
        "while Woodsman covers Hunter and Fletching for arrow/bolt production. " +
        "Vorkath (Fremennik) and Hydra (Kebos) are the primary point engines.",
      regions: ["Fremennik Province", "Morytania", "Kebos & Kourend"],
      relics: [
        { tier: 1, name: "Barbarian Gathering" },
        { tier: 2, name: "Woodsman" },
        { tier: 3, name: "Evil Eye" },
        { tier: 4, name: "Conniving Clues" },
        { tier: 5, name: "Nature's Accord" },
        { tier: 6, name: "Culling Spree" },
        { tier: 7, name: "Reloaded" },
        { tier: 8, name: "Minion" },
      ],
      pacts: ["Ranged Fury [Expected]", "Glass Cannon [Expected]"],
      gearProgression: [
        {
          phase: "Early (0-2,500 pts)",
          items: [
            "Green dragonhide set",
            "Maple shortbow or bone crossbow",
            "Ava's accumulator (auto-completed quests chain)",
            "Amulet of power",
          ],
        },
        {
          phase: "Mid (2,500-18,000 pts)",
          items: [
            "Blessed dragonhide set",
            "Rune crossbow with broad bolts",
            "Ava's Assembler (Vorkath drops it directly in DP)",
            "Archer ring from DKs",
          ],
        },
        {
          phase: "Late (18,000+ pts)",
          items: [
            "Armadyl chestplate and chainskirt (requires Asgarnia region)",
            "Masori armour (ToA -- requires Desert pick)",
            "Twisted bow (CoX)",
            "Dizana's quiver (ammo saving enabled by default in DP)",
          ],
        },
      ],
      strengths: [
        "Safest combat style -- safe-spotting and kiting reduce damage taken",
        "Vorkath is a consistent ranged point farm with direct Assembler drop",
        "Woodsman bulk-fletches arrows/bolts for sustained ammo supply",
        "Ranged Fury pact boosts primary style without much downside for ranged-only play [Expected]",
      ],
      weaknesses: [
        "Some bosses resist or are immune to ranged (melee-only phases)",
        "Armadyl/Masori requires Asgarnia or Desert as a region pick",
        "Glass Cannon pact is riskier at bosses where you cannot safe-spot [Expected]",
        "Lower AoE capability than melee in multi-combat Slayer",
      ],
    },
    {
      id: "magic-caster",
      name: "Magic Caster",
      style: "Magic",
      difficulty: "Advanced",
      description:
        "A magic-focused build centered on ToA scaling and AoE Slayer. " +
        "Abundance provides +10 to all non-combat skills (including Magic " +
        "indirectly through faster quest/diary completion), while Hotfoot " +
        "handles Agility and Cooking. Flask of Fervour offers burst recovery " +
        "for high-invocation ToA and challenging raids.",
      regions: ["Kharidian Desert", "Kandarin", "Kebos & Kourend"],
      relics: [
        { tier: 1, name: "Abundance" },
        { tier: 2, name: "Hotfoot" },
        { tier: 3, name: "Evil Eye" },
        { tier: 4, name: "Conniving Clues" },
        { tier: 5, name: "Nature's Accord" },
        { tier: 6, name: "Culling Spree" },
        { tier: 7, name: "Reloaded" },
        { tier: 8, name: "Flask of Fervour" },
      ],
      pacts: ["Magic Surge [Expected]"],
      gearProgression: [
        {
          phase: "Early (0-2,500 pts)",
          items: [
            "Mystic robes",
            "Staff of fire or air",
            "Amulet of magic",
            "God cape from Mage Arena (requires Wilderness region)",
          ],
        },
        {
          phase: "Mid (2,500-18,000 pts)",
          items: [
            "Ahrim's robes (Barrows -- requires Morytania or alternate source)",
            "Trident of the Seas/Swamp",
            "Seers' ring from DKs (if Fremennik picked)",
            "Book of darkness or equivalent",
          ],
        },
        {
          phase: "Late (18,000+ pts)",
          items: [
            "Ancestral robes (CoX)",
            "Sanguinesti staff (ToB -- requires Morytania)",
            "Kodai wand (CoX)",
            "Shadow of Tumeken (ToA)",
          ],
        },
      ],
      strengths: [
        "ToA scales via invocations, creating a task ladder from medium to master",
        "AoE Slayer in Catacombs with Ice Barrage is extremely efficient",
        "Flask of Fervour enables back-to-back spec weapon dumps at bosses",
        "Abundance +10 skill boost accelerates access to level-gated content",
      ],
      weaknesses: [
        "Magic Surge pact reduces melee and ranged effectiveness [Expected]",
        "Magic gear progression is slower without Morytania for Barrows/ToB",
        "Higher rune consumption than other styles (partially offset by GOTR access)",
        "Some late-game BiS magic gear requires Morytania (Sanguinesti, Ancestral via CoX if Kebos)",
      ],
    },
    {
      id: "hybrid-completionist",
      name: "Hybrid Completionist",
      style: "Hybrid",
      difficulty: "Expert",
      description:
        "A no-specialization build for players aiming to complete the widest " +
        "possible range of tasks. Uses all three combat styles as needed. " +
        "Abundance provides +10 skill boost for early access to gated content. " +
        "Hotfoot covers Agility and Cooking. Flask of Fervour enables survival " +
        "at the hardest content without committing to a specific style. Minimal " +
        "or no pacts to avoid off-style penalties.",
      regions: ["Kebos & Kourend", "Morytania", "Kharidian Desert"],
      relics: [
        { tier: 1, name: "Abundance" },
        { tier: 2, name: "Hotfoot" },
        { tier: 3, name: "Evil Eye" },
        { tier: 4, name: "Conniving Clues" },
        { tier: 5, name: "Nature's Accord" },
        { tier: 6, name: "Culling Spree" },
        { tier: 7, name: "Reloaded" },
        { tier: 8, name: "Flask of Fervour" },
      ],
      pacts: [],
      gearProgression: [
        {
          phase: "Early (0-2,500 pts)",
          items: [
            "Rune armour (melee), green dragonhide (ranged), mystic robes (magic)",
            "Rune scimitar, maple shortbow, fire staff",
            "Amulet of power (all-style)",
            "Collect gear sets for all three styles as they drop",
          ],
        },
        {
          phase: "Mid (2,500-18,000 pts)",
          items: [
            "Barrows sets -- Dharok's/Verac's (melee), Karil's (ranged), Ahrim's (magic)",
            "Dragon scimitar, rune crossbow, trident",
            "DK rings (if Fremennik) or imbued rings from NMZ",
            "Fighter torso, void knight set (Pest Control with 8x points)",
          ],
        },
        {
          phase: "Late (18,000+ pts)",
          items: [
            "Raid uniques across all styles (CoX, ToB, ToA)",
            "Inquisitor's (melee), Masori (ranged), Ancestral (magic)",
            "Twisted bow, Sanguinesti staff, Avernic defender",
            "Shadow of Tumeken (ToA with high invocations)",
          ],
        },
      ],
      strengths: [
        "Can complete any task regardless of required combat style",
        "No pact penalties means no boss is off-limits",
        "Broadest gear progression covers all content types",
        "Flask of Fervour provides universal survivability",
        "Abundance +10 boost opens skill-gated content earliest",
      ],
      weaknesses: [
        "No pact bonuses means lower raw DPS than specialized builds",
        "Requires managing three complete gear sets and switching between them",
        "Expert-level boss knowledge needed to handle varied mechanics",
        "Slower per-boss kill times compared to pact-boosted specialists",
        "Most demanding playstyle -- no shortcuts from style specialization",
      ],
    },
  ],
};

/**
 * Pact strategy guide for DP.
 * ALL pact effects are from data-mined placeholders and may change at launch.
 * Rankings reflect expected risk/reward tradeoffs.
 */
export const dpPactGuide: PactGuide = {
  intro:
    "Pacts are the Demonic Pacts League's signature mechanic -- risk/reward " +
    "combat modifiers that replace the combat mastery system from Raging Echoes. " +
    "IMPORTANT: Pact details are secret until the league launches on 15 April " +
    "2026. All bonuses, penalties, and rankings below are based on data-mined " +
    "placeholders and are labeled as 'Expected'. Exact values, interactions, and " +
    "the full pact list may change significantly at launch. Plan flexibly and be " +
    "ready to adapt.",

  pacts: [
    {
      name: "Glass Cannon",
      tier: 2,
      bonus: "Significantly increased damage output in all combat styles [Expected]",
      penalty: "Increased damage taken from all sources [Expected]",
      ranking: "S",
      bestFor: [
        "Speedrunners who can minimize time spent tanking damage",
        "Experienced PvMers who can prayer flick and avoid mechanics",
        "Bosses with safe spots or predictable attack patterns",
      ],
      avoidIf:
        "You cannot consistently avoid damage through prayer or mechanics -- " +
        "the increased damage taken will lead to frequent deaths and wasted time.",
    },
    {
      name: "Berserker's Oath",
      tier: 3,
      bonus: "Major boost to attack speed and damage [Expected]",
      penalty: "Cannot use protection prayers [Expected]",
      ranking: "S",
      bestFor: [
        "Maximum damage output for expert players",
        "Bosses with predictable damage patterns that do not require prayer",
        "Content where kill speed outpaces incoming damage (Hydra, DKs, Barrows)",
      ],
      avoidIf:
        "You rely on protection prayers for survival at any boss -- losing " +
        "them entirely makes raids (ToB, CoX) and pray-flick bosses (Jad, Zuk) " +
        "extremely dangerous.",
    },
    {
      name: "Melee Might",
      tier: 1,
      bonus: "Increased melee damage and accuracy [Expected]",
      penalty: "Reduced effectiveness in other combat styles [Expected]",
      ranking: "A",
      bestFor: [
        "Dedicated melee builds (Bandos, Barrows, Slayer)",
        "Players who plan to use melee for the majority of content",
        "Builds that pair with Minion for sustained melee DPS",
      ],
      avoidIf:
        "You need ranged or magic flexibility -- the off-style penalty " +
        "weakens Zulrah ranged phases, CoX Olm mage hand, and similar encounters.",
    },
    {
      name: "Ranged Fury",
      tier: 1,
      bonus: "Increased ranged damage and accuracy [Expected]",
      penalty: "Reduced effectiveness in other combat styles [Expected]",
      ranking: "A",
      bestFor: [
        "Safe boss kills via safe-spotting and kiting (Vorkath, Hydra)",
        "Players who prioritize safety with ranged distance",
        "Builds centered on twisted bow or blowpipe usage",
      ],
      avoidIf:
        "You need melee for certain bosses -- some content like ToB Nylocas " +
        "and CoX melee hand require competent melee DPS.",
    },
    {
      name: "Vampiric Touch",
      tier: 2,
      bonus: "Heal a percentage of damage dealt [Expected]",
      penalty: "Reduced prayer effectiveness [Expected]",
      ranking: "A",
      bestFor: [
        "Sustained PvM where lifesteal extends trips significantly",
        "Melee builds that deal high consistent damage (more damage = more healing)",
        "Players who want moderate risk with meaningful reward",
      ],
      avoidIf:
        "You rely heavily on prayer for protection -- the reduced prayer " +
        "effectiveness means prayers drain faster and protect less.",
    },
    {
      name: "Magic Surge",
      tier: 1,
      bonus: "Increased magic damage and accuracy [Expected]",
      penalty: "Reduced effectiveness in other combat styles [Expected]",
      ranking: "B",
      bestFor: [
        "Slayer and AoE content (Ice Barrage in Catacombs, burst tasks)",
        "ToA with Shadow of Tumeken",
        "Players who plan magic as their primary style throughout the league",
      ],
      avoidIf:
        "You need melee or ranged for specific bosses -- magic is less " +
        "universally effective than melee or ranged at most bosses, making " +
        "the off-style penalty more punishing.",
    },
  ],

  combos: [
    {
      name: "Glass Berserker",
      pacts: ["Glass Cannon", "Berserker's Oath"],
      synergy:
        "Maximum possible damage output: significantly increased damage from Glass " +
        "Cannon combined with major attack speed and damage boost from Berserker's " +
        "Oath. The fastest theoretical kill times in the league. [Expected]",
      risk:
        "Extreme. No protection prayers AND increased damage taken. Every boss " +
        "hit deals amplified damage with zero prayer mitigation. Deaths will be " +
        "frequent at any content with unavoidable damage. Only viable at bosses " +
        "with safe spots or completely predictable mechanics. [Expected]",
      bestFor:
        "Expert players who can execute flawless mechanics at predictable bosses " +
        "like Hydra, DKs, and Barrows where prayer is optional.",
    },
    {
      name: "Vampiric Berserker",
      pacts: ["Berserker's Oath", "Vampiric Touch"],
      synergy:
        "Lifesteal from Vampiric Touch partially compensates for losing protection " +
        "prayers from Berserker's Oath. Higher damage from Berserker's Oath means " +
        "more HP healed per hit. Creates a self-sustaining damage loop where kill " +
        "speed translates directly into survivability. [Expected]",
      risk:
        "High. No protection prayers but with lifesteal sustain. Still dangerous " +
        "at bosses with burst damage that exceeds your healing rate. Prayer " +
        "reduction from Vampiric Touch is largely irrelevant since Berserker's " +
        "Oath already removes protection prayers. [Expected]",
      bestFor:
        "Players who want high damage without going full glass cannon. The " +
        "lifesteal provides a safety net that pure Glass Berserker lacks.",
    },
    {
      name: "Style Specialist",
      pacts: ["Melee Might", "Glass Cannon"],
      synergy:
        "A single style pact (Melee Might, Ranged Fury, or Magic Surge) combined " +
        "with Glass Cannon for high damage in your chosen style. Glass Cannon's " +
        "all-styles bonus still benefits off-style attacks to some degree, partially " +
        "offsetting the style pact's off-style penalty. [Expected]",
      risk:
        "Moderate. Increased damage taken from Glass Cannon is the main risk. " +
        "Protection prayers remain available, providing a safety net. Off-style " +
        "combat is weakened but not eliminated. [Expected]",
      bestFor:
        "Most players -- this is the recommended combo for anyone who wants " +
        "meaningful pact bonuses with manageable risk.",
    },
    {
      name: "Conservative Start",
      pacts: ["Melee Might"],
      synergy:
        "A single style pact with no additional risk modifiers. Clean damage " +
        "and accuracy boost in your primary style with reduced effectiveness " +
        "in other styles as the only penalty. [Expected]",
      risk:
        "Low. The off-style penalty is the only downside, and it is manageable " +
        "if you primarily use one combat style. No increased damage taken, no " +
        "prayer restrictions. [Expected]",
      bestFor:
        "New league players or anyone who wants a safe entry point. You can " +
        "always add more pacts later once you understand the league's mechanics.",
    },
  ],
};
