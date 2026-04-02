import type {
  GettingStartedGuide,
  RelicGuide,
  RegionGuide,
  CombatBuildGuide,
  CombatMasteryGuide,
} from "@/types/league-guides";

// =============================================================================
// Raging Echoes League (Leagues V) — Strategy Guide Data
// Ended January 22, 2025
// 1,589 tasks (224 easy / 536 medium / 437 hard / 345 elite / 47 master)
// 141,080 total points
// =============================================================================

export const reGettingStarted: GettingStartedGuide = {
  intro:
    "The Raging Echoes League features 1,589 tasks across 11 regions, 23 relics across 8 tiers, and 3 combat masteries with unique echo boss variants. This guide walks you through the first hours of the league, from spawning in Lumbridge to unlocking your first echo boss encounter.",
  steps: [
    {
      title: "Spawn & Setup",
      timeframe: "0-5 minutes",
      objectives: [
        "Spawn in Misthalin and speak to the League Sage near Lumbridge",
        "Claim your starter kit with basic tools and supplies",
        "Open the task list and familiarize yourself with the interface",
        "Review the relic and region unlock thresholds",
      ],
      tips: [
        "Misthalin and Karamja are your starting regions and are always available",
        "Pin a few easy tasks from the task list so you have immediate goals",
        "Check the league HUD to understand point thresholds for relics and regions",
      ],
    },
    {
      title: "Opening Skills",
      timeframe: "5-30 minutes",
      objectives: [
        "Pick your Tier 1 relic — this shapes your early skilling strategy",
        "Begin completing easy tasks in Misthalin and Karamja",
        "Train a few gathering skills to start banking resources",
        "Aim for at least 15-20 easy tasks in this window",
      ],
      tips: [
        "Animal Wrangler is the most versatile T1 relic — fishing auto-bank with auto-cook plus hunter buffs cover many early tasks",
        "Power Miner is excellent if you plan to rush smithing chains early",
        "Don't commit to grinding one skill — breadth of tasks completed matters more than depth for unlocking regions",
        "Easy tasks are only worth 10 points each, but they count toward the 90-task threshold for your first region unlock",
      ],
    },
    {
      title: "First Region Unlock",
      timeframe: "30-120 minutes",
      objectives: [
        "Complete 90 tasks to unlock your first choosable region",
        "Choose your first region based on your build plan and goals",
        "Begin exploring new region content and tasks immediately",
        "Start working toward the 750-point threshold for your T2 relic",
      ],
      tips: [
        "Morytania is the most popular first pick — Barrows provides strong early gear and the Hallowed Sepulchre is excellent for agility tasks",
        "Kourend is a strong alternative if you want access to Wintertodt and GOTR for early skilling tasks",
        "Your first region choice has the biggest impact on your league experience — pick based on content you enjoy",
        "After unlocking a region, scan its task list immediately for quick wins you can complete right away",
      ],
    },
    {
      title: "Relic Tier 2",
      timeframe: "At 750 points",
      objectives: [
        "Unlock and choose your Tier 2 relic",
        "Begin leveraging T2 relic effects for faster task completion",
        "Push toward 200 tasks for your second region unlock",
        "Start pursuing combat milestones for mastery points",
      ],
      tips: [
        "Dodgy Deals is the fastest GP and task combo — greatly increased pickpocket success with noted loot is incredibly powerful",
        "Corner Cutter is the safest choice for newer players — 100% agility success rate removes frustration and double marks are great income",
        "Friendly Forager supports herblore pipelines early if you plan to do a lot of PvM later",
        "Start thinking about which combat mastery you want to invest in based on your preferred style",
      ],
    },
    {
      title: "Mid-Game Push",
      timeframe: "2-8 hours",
      objectives: [
        "Complete 200 tasks to unlock your second choosable region",
        "Unlock T3 and T4 relics as you pass 1,500 and 2,500 points",
        "Earn your first combat mastery points from milestone kills",
        "Begin engaging with mid-level boss content in your unlocked regions",
      ],
      tips: [
        "Focus on breadth across skills rather than maxing one — task completion thresholds reward variety",
        "Combat mastery points come from specific milestones like defeating a Giant, soloing Scurrius, and reaching combat level 100",
        "At T4, Reloaded lets you pick a second relic from T1-T3 — this is extremely powerful and the most popular T4 choice",
        "Start collecting clue scrolls if you have Clue Compass — they become a major point source mid-game",
      ],
    },
    {
      title: "Late Game",
      timeframe: "8+ hours",
      objectives: [
        "Complete 400 tasks to unlock your third and final choosable region",
        "Push through T5-T8 relic unlocks at 5,000 / 8,000 / 16,000 / 25,000 points",
        "Defeat echo bosses for mastery points and elite task completions",
        "Aim for your target reward tier based on total points earned",
      ],
      tips: [
        "Echo bosses are the real endgame — each unlocked region has one, and defeating unique echo bosses grants mastery points",
        "Mastery Tier 6 effects are game-changing: Melee echoes chain up to 8 times, Ranged never misses, Magic guarantees max hits on low-HP targets",
        "T8 relics like Last Stand (survive lethal damage with 255 stats for 16 ticks) enable otherwise impossible boss strategies",
        "Reward tiers are at 2,000 / 4,000 / 10,000 / 20,000 / 30,000 / 45,000 / 60,000 points — plan your grind accordingly",
      ],
    },
  ],
};

// =============================================================================
// Relic Guide — All 8 Tiers, 23 Relics
// =============================================================================

export const reRelicGuide: RelicGuide = {
  intro:
    "Raging Echoes features 23 relics across 8 tiers, unlocked at specific point thresholds. Each tier offers a choice between 2-3 relics that permanently shape your account. Tier 4's Reloaded relic is unique — it lets you pick a second relic from any earlier tier. Choose based on your region picks and content goals.",
  tiers: [
    {
      tier: 1,
      unlockPoints: 0,
      mandatory: true,
      passiveEffects: [
        "Chosen at league start — defines your early gathering strategy",
      ],
      relics: [
        {
          name: "Animal Wrangler",
          ranking: "S",
          description:
            "Fishing auto-banks catches and auto-cooks them. Hunter receives significant buffs. Most versatile opening relic covering two gathering skills.",
          bestFor: [
            "General-purpose accounts",
            "Players who want flexible early skilling",
            "Builds that need cooking XP passively",
          ],
          synergyWith: [
            "Friendly Forager",
            "Bank Heist",
            "Production Master",
          ],
        },
        {
          name: "Power Miner",
          ranking: "A",
          description:
            "Mining auto-banks ore and auto-smelts it into bars. Strong for smithing task chains and supplies crafting pipelines with processed materials.",
          bestFor: [
            "Smithing-focused accounts",
            "Players rushing gear upgrades",
            "Builds that want passive bar stock",
          ],
          synergyWith: ["Production Master", "Banker's Note", "Golden God"],
        },
        {
          name: "Lumberjack",
          ranking: "B",
          description:
            "Woodcutting auto-banks logs and auto-burns or auto-fletches them. Niche compared to the others but strong if your build relies on fletching or firemaking.",
          bestFor: [
            "Fletching-focused builds",
            "Firemaking task completionists",
            "Players targeting Wintertodt with Kourend",
          ],
          synergyWith: ["Fairy's Flight", "Overgrown", "Equilibrium"],
        },
      ],
    },
    {
      tier: 2,
      unlockPoints: 750,
      passiveEffects: [
        "Second relic choice — shapes your money-making and traversal",
      ],
      relics: [
        {
          name: "Dodgy Deals",
          ranking: "S",
          description:
            "Greatly increased pickpocket success rate with noted loot. AoE pickpocketing hits multiple NPCs simultaneously and stalls never deplete. Insane GP generation and thieving XP.",
          bestFor: [
            "GP generation",
            "Fast thieving tasks",
            "Players who want early financial freedom",
          ],
          synergyWith: ["Golden God", "Bank Heist", "Banker's Note"],
        },
        {
          name: "Corner Cutter",
          ranking: "A",
          description:
            "100% agility course success rate with double course completions. Marks of grace convert to GP. Safest and most consistent T2 option.",
          bestFor: [
            "New league players",
            "Agility task completion",
            "Players who want consistent, low-effort progression",
          ],
          synergyWith: [
            "Clue Compass",
            "Total Recall",
            "Fairy's Flight",
          ],
        },
        {
          name: "Friendly Forager",
          ranking: "A",
          description:
            "Gathering skills passively fill an herb pouch. High secondary ingredient preservation and all potions are created as 4-dose. Excellent herblore support.",
          bestFor: [
            "PvM-focused accounts needing potions",
            "Herblore task completion",
            "Players planning heavy bossing",
          ],
          synergyWith: [
            "Animal Wrangler",
            "Production Master",
            "Slayer Master",
          ],
        },
      ],
    },
    {
      tier: 3,
      unlockPoints: 1500,
      passiveEffects: [
        "Teleportation relic — dramatically improves travel efficiency",
      ],
      relics: [
        {
          name: "Bank Heist",
          ranking: "S",
          description:
            "Teleport to any bank or deposit box in your unlocked regions. Universal utility that saves enormous time on every activity.",
          bestFor: [
            "All playstyles",
            "Efficient players",
            "Anyone who values time savings over niche bonuses",
          ],
          synergyWith: ["Dodgy Deals", "Golden God", "Banker's Note"],
        },
        {
          name: "Clue Compass",
          ranking: "A",
          description:
            "Teleport directly to STASH units and your current clue scroll step location. Massive quality of life for clue scroll completion.",
          bestFor: [
            "Clue scroll enthusiasts",
            "Players pairing with Treasure Arbiter at T5",
            "Completionists targeting clue tasks",
          ],
          synergyWith: [
            "Treasure Arbiter",
            "Corner Cutter",
            "Fairy's Flight",
          ],
        },
        {
          name: "Fairy's Flight",
          ranking: "A",
          description:
            "Teleport to fairy rings, spirit trees, and tool leprechauns. Best travel relic for farming runs and reaching remote areas.",
          bestFor: [
            "Farming-focused accounts",
            "Players with multiple spread-out regions",
            "Builds pairing with Overgrown at T7",
          ],
          synergyWith: ["Overgrown", "Lumberjack", "Equilibrium"],
        },
      ],
    },
    {
      tier: 4,
      unlockPoints: 2500,
      passiveEffects: [
        "Major power spike — each option fundamentally changes your account",
      ],
      relics: [
        {
          name: "Reloaded",
          ranking: "S",
          description:
            "Pick a second relic from any Tier 1, Tier 2, or Tier 3 choice you previously passed on. Doubles your passive relic coverage and is the most flexible option by far.",
          bestFor: [
            "All playstyles",
            "Players who want a second gathering relic",
            "Anyone who regrets skipping a powerful T1-T3 option",
          ],
          synergyWith: [
            "Any T1-T3 relic you missed",
            "Pairs especially well with a second teleport relic",
          ],
        },
        {
          name: "Golden God",
          ranking: "A",
          description:
            "Free high alchemy with chance to preserve items on alchemy. Shops give noted items. Prayer points restored from spending GP. Strong GP engine and prayer sustain.",
          bestFor: [
            "GP generation without thieving",
            "Prayer-focused accounts",
            "Players who skipped Dodgy Deals",
          ],
          synergyWith: ["Dodgy Deals", "Bank Heist", "Slayer Master"],
        },
        {
          name: "Equilibrium",
          ranking: "B",
          description:
            "Gain bonus XP equal to 10-20% of your total level per action. Slow to build but becomes extremely powerful at high total levels. Rewards breadth of training.",
          bestFor: [
            "Long-term grinders",
            "Completionists training all skills",
            "Patient players who want maximum late-game XP rates",
          ],
          synergyWith: [
            "Lumberjack",
            "Friendly Forager",
            "Production Master",
          ],
        },
      ],
    },
    {
      tier: 5,
      unlockPoints: 5000,
      passiveEffects: [
        "Specialization tier — defines your primary content focus",
      ],
      relics: [
        {
          name: "Production Master",
          ranking: "S",
          description:
            "Batch-process all crafting-type skills at once — create an entire inventory of items in a single action. Massive time saver for any processing skill.",
          bestFor: [
            "Efficient players",
            "Crafting/smithing/herblore task rushers",
            "Anyone who processes large volumes of materials",
          ],
          synergyWith: [
            "Power Miner",
            "Friendly Forager",
            "Banker's Note",
          ],
        },
        {
          name: "Slayer Master",
          ranking: "A",
          description:
            "Always considered on-task for Slayer. All Slayer perks are free. Milestone Slayer XP rewards. Turns every combat encounter into Slayer progress.",
          bestFor: [
            "PvM-focused accounts",
            "Players who want passive Slayer XP everywhere",
            "Builds centered on combat and bossing",
          ],
          synergyWith: ["Guardian", "Last Stand", "Specialist"],
        },
        {
          name: "Treasure Arbiter",
          ranking: "A",
          description:
            "Greatly increased clue drop rate from all sources. Greatly increased vessel capacity. Always receive maximum casket rewards with minimum steps per clue.",
          bestFor: [
            "Clue scroll specialists",
            "Players who paired Clue Compass at T3",
            "Completionists who want unique items from caskets",
          ],
          synergyWith: [
            "Clue Compass",
            "Corner Cutter",
            "Fairy's Flight",
          ],
        },
      ],
    },
    {
      tier: 6,
      unlockPoints: 8000,
      passiveEffects: [
        "Quality-of-life tier — both options dramatically reduce busywork",
      ],
      relics: [
        {
          name: "Total Recall",
          ranking: "S",
          description:
            "Save and restore your exact location, inventory, and stats at any time. Enables seamless bossing efficiency — bank, restore gear, and teleport back instantly.",
          bestFor: [
            "Bossers",
            "Echo boss hunters",
            "Players who want zero downtime between kills",
          ],
          synergyWith: ["Last Stand", "Specialist", "Slayer Master"],
        },
        {
          name: "Banker's Note",
          ranking: "A",
          description:
            "Note and unnote items anywhere without a bank. Excellent for extended trips, resource gathering, and avoiding banking entirely.",
          bestFor: [
            "Skillers who gather in remote areas",
            "Players who skipped Bank Heist at T3",
            "Builds that process materials in the field",
          ],
          synergyWith: [
            "Production Master",
            "Power Miner",
            "Friendly Forager",
          ],
        },
      ],
    },
    {
      tier: 7,
      unlockPoints: 16000,
      passiveEffects: [
        "Deep specialization — powerful effects for committed builds",
      ],
      relics: [
        {
          name: "Grimoire",
          ranking: "S",
          description:
            "Swap between all spellbooks freely with no restrictions. Also grants access to the Book of the Dead. Unlocks full magic versatility for any combat situation.",
          bestFor: [
            "PvM accounts",
            "Players who use multiple spellbooks",
            "Magic-focused builds and hybrid fighters",
          ],
          synergyWith: ["Last Stand", "Guardian", "Total Recall"],
        },
        {
          name: "Overgrown",
          ranking: "A",
          description:
            "Crops never die, auto-harvest and auto-replant on completion, and high seed preservation. Turns farming into a fully passive income stream.",
          bestFor: [
            "Farming task completionists",
            "Herblore pipeline support",
            "Players who paired Fairy's Flight at T3",
          ],
          synergyWith: [
            "Fairy's Flight",
            "Friendly Forager",
            "Production Master",
          ],
        },
        {
          name: "Pocket Kingdom",
          ranking: "B",
          description:
            "Access the Kingdom of Miscellania from anywhere with double resource output. Niche but provides steady passive resources without maintenance.",
          bestFor: [
            "Passive resource gatherers",
            "Completionists who want set-and-forget income",
            "Players in the very late game looking for marginal gains",
          ],
          synergyWith: ["Banker's Note", "Golden God", "Equilibrium"],
        },
      ],
    },
    {
      tier: 8,
      unlockPoints: 25000,
      passiveEffects: [
        "Capstone relic — the most powerful combat effects in the league",
      ],
      relics: [
        {
          name: "Last Stand",
          ranking: "S",
          description:
            "Survive what would be lethal damage, then gain 255 in all combat stats for 16 game ticks (9.6 seconds). 3-minute cooldown. The ultimate safety net that doubles as a massive damage window.",
          bestFor: [
            "Bossers pushing difficult content",
            "Echo boss specialists",
            "Players who want a safety net for risky encounters",
          ],
          synergyWith: ["Total Recall", "Grimoire", "Slayer Master"],
        },
        {
          name: "Specialist",
          ranking: "A",
          description:
            "Special attack energy costs reduced by 20%. Special attack accuracy boosted by 100%. Energy restored on kills. Turns spec weapons into your primary damage source.",
          bestFor: [
            "Players with strong spec weapons (Dragon Claws, AGS, Twisted Bow spec)",
            "Builds focused on fast boss kills",
            "Ranged-focused accounts using special attacks frequently",
          ],
          synergyWith: ["Total Recall", "Slayer Master", "Guardian"],
        },
        {
          name: "Guardian",
          ranking: "A",
          description:
            "Summon a 30-minute combat thrall that adapts to your target's weakness. The thrall attacks with AoE and persists through area transitions. Strong sustained DPS boost.",
          bestFor: [
            "Slayer grinders",
            "Players who prefer sustained damage over burst",
            "AoE-heavy content like Catacombs or multi-combat zones",
          ],
          synergyWith: ["Slayer Master", "Grimoire", "Last Stand"],
        },
      ],
    },
  ],
};

// =============================================================================
// Region Guide — 2 Starting + 9 Choosable Regions
// =============================================================================

export const reRegionGuide: RegionGuide = {
  intro:
    "Raging Echoes has 11 regions: Misthalin and Karamja are always available as starting regions, and you unlock 3 additional regions from the 9 choosable options at 90, 200, and 400 tasks completed. Each choosable region contains a unique echo boss — an enhanced variant of a signature boss with new mechanics and better loot.",
  unlockMechanic:
    "Regions unlock at task completion milestones: 90 tasks for your first choice, 200 tasks for your second, and 400 tasks for your third. These thresholds count total tasks completed regardless of difficulty or point value.",
  regions: [
    {
      name: "Misthalin",
      tier: "B",
      type: "starting",
      highlights: [
        "Lumbridge, Varrock, and the Grand Exchange area",
        "Early-game skilling: mining, smithing, cooking, fishing",
        "Scurrius boss for an early combat mastery point",
        "Many easy and medium tasks for fast region unlock progress",
      ],
      pickFirstIf:
        "Always available — no choice needed. Focus on completing easy tasks here for quick region unlock progress.",
      avoidIf:
        "Cannot be avoided — it is a starting region. Content here dries up in the mid-game.",
    },
    {
      name: "Karamja",
      tier: "B",
      type: "starting",
      highlights: [
        "TzTok-Jad in the Fight Caves (combat mastery point)",
        "Brimhaven Dungeon and agility arena",
        "Good fishing and mining spots",
        "Access to gem rocks and nature rune crafting",
      ],
      pickFirstIf:
        "Always available — no choice needed. Prioritize Fight Caves for Jad kill which grants a combat mastery point.",
      avoidIf:
        "Cannot be avoided — it is a starting region. Less task density than Misthalin.",
    },
    {
      name: "Morytania",
      tier: "S",
      type: "choosable",
      echoBoss: "Echo Nightmare",
      highlights: [
        "Barrows for strong early-to-mid game gear",
        "Theatre of Blood for endgame PvM",
        "Nightmare and Phosani's Nightmare",
        "Hallowed Sepulchre — best agility training and rewards",
        "Slayer Tower with excellent task density",
      ],
      pickFirstIf:
        "You want the strongest all-around first region with immediate gear upgrades from Barrows and top-tier agility from the Sepulchre.",
      avoidIf:
        "You dislike PvM-heavy content or prefer skilling-focused regions.",
    },
    {
      name: "Kourend",
      tier: "S",
      type: "choosable",
      echoBoss: "Echo Skotizo",
      highlights: [
        "Chambers of Xeric (CoX) — premier raid content",
        "Alchemical Hydra for high-value Slayer",
        "Wintertodt for easy firemaking and resource tasks",
        "Guardians of the Rift (GOTR) for runecraft",
        "Tithe Farm for farming tasks",
      ],
      pickFirstIf:
        "You want early access to Wintertodt and GOTR for fast skilling tasks, with CoX and Hydra for endgame PvM.",
      avoidIf:
        "You have no interest in raids or prefer combat content accessible at lower levels.",
    },
    {
      name: "Asgarnia",
      tier: "A",
      type: "choosable",
      echoBoss: "Echo Cerberus",
      highlights: [
        "God Wars Dungeon — all four generals plus Nex",
        "Corporeal Beast for high-level group PvM",
        "Warriors' Guild for defenders",
        "Falador and Taverley Dungeon",
      ],
      pickFirstIf:
        "You want access to GWD generals for iconic gear (Bandos, Armadyl, Saradomin, Zamorak) and enjoy traditional PvM.",
      avoidIf:
        "GWD bosses require moderate combat levels — not ideal as a first pick if you want immediate task access.",
    },
    {
      name: "Kandarin",
      tier: "A",
      type: "choosable",
      echoBoss: "Echo Hespori",
      highlights: [
        "Zulrah for Blowpipe and Magic Fang",
        "Seers' Village for fletching, agility course, and maple trees",
        "Catherby for fishing and cooking",
        "Piscatoris for Minnows and monkfish",
      ],
      pickFirstIf:
        "You want Zulrah for powerful ranged/magic gear and enjoy a region that blends skilling with profitable bossing.",
      avoidIf:
        "You already have strong gear plans from other regions and don't need Blowpipe.",
    },
    {
      name: "Desert",
      tier: "A",
      type: "choosable",
      echoBoss: "Echo Tempoross",
      highlights: [
        "Tombs of Amascut (ToA) — scalable raid with top-tier loot",
        "Kalphite Queen for mid-game bossing",
        "Pyramid Plunder for thieving training",
        "Sophanem and Pollnivneach content",
      ],
      pickFirstIf:
        "You want access to ToA as your endgame raid — it scales to your level and gear, making it accessible earlier than other raids.",
      avoidIf:
        "ToA requires significant quest and skill investment before it becomes accessible.",
    },
    {
      name: "Fremennik",
      tier: "A",
      type: "choosable",
      echoBoss: "Echo Phantom Muspah",
      highlights: [
        "Vorkath for consistent high-value drops",
        "Dagannoth Kings (DKS) for ring upgrades",
        "Lunar Isle for Lunar spellbook",
        "Rellekka and Neitiznot/Jatizso quest content",
      ],
      pickFirstIf:
        "You want Vorkath for reliable GP and resources, plus DKS rings are universally useful upgrades.",
      avoidIf:
        "You prefer raid content over solo bossing, or your build doesn't benefit from Fremennik quest rewards.",
    },
    {
      name: "Tirannwn",
      tier: "A",
      type: "choosable",
      echoBoss: "Echo Araxxor",
      highlights: [
        "Corrupted Gauntlet — best self-sufficient PvM content",
        "Zalcano for mining-based bossing",
        "Prifddinas — endgame city with high-level skilling",
        "Crystal equipment and enhanced crystal weapon seeds",
      ],
      pickFirstIf:
        "You want the Corrupted Gauntlet — it requires no external gear, making it ideal for league ironman-style play. Prifddinas access is a huge bonus.",
      avoidIf:
        "Song of the Elves quest requirements are steep. Not ideal as a first pick unless you can rush prerequisites.",
    },
    {
      name: "Wilderness",
      tier: "B",
      type: "choosable",
      echoBoss: "Echo Nex",
      highlights: [
        "Callisto, Venenatis, and Vet'ion wilderness bosses",
        "Revenant Caves with PvP disabled in leagues",
        "Wilderness Slayer for bonus points",
        "Chaos Temple for prayer training",
      ],
      pickFirstIf:
        "You enjoy wilderness bosses and want safe revenant cave farming with PvP disabled. The Chaos Temple offers the best prayer XP.",
      avoidIf:
        "Wilderness content is niche and has fewer total tasks than most other regions. Generally picked third if at all.",
    },
    {
      name: "Varlamore",
      tier: "B",
      type: "choosable",
      echoBoss: "Echo Wintertodt",
      highlights: [
        "Fortis Colosseum for endgame wave-based combat",
        "Moons of Peril for group PvM",
        "Hunter Guild for advanced hunter training",
        "Newer content with unique tasks",
      ],
      pickFirstIf:
        "You want Fortis Colosseum for wave-based endgame combat and enjoy the newer Varlamore content.",
      avoidIf:
        "Varlamore has fewer established money-makers and less task density compared to veteran regions like Morytania or Kourend.",
    },
  ],
};

// =============================================================================
// Combat Build Guide — 4 Recommended Builds
// =============================================================================

export const reCombatBuilds: CombatBuildGuide = {
  intro:
    "These builds combine region picks, relic choices, and combat mastery allocations into cohesive strategies. Each build is designed around a specific playstyle and endgame goal. Adapt them to your preferences — the best build is one you enjoy playing.",
  builds: [
    {
      id: "re-melee-tank",
      name: "Melee Focused Tank",
      style: "Melee",
      difficulty: "Intermediate",
      description:
        "A durable melee build that leverages Barrows gear from Morytania, transitions into Bandos from Asgarnia, and uses CoX from Kourend as the endgame raid. Heavy melee mastery investment for echo hits and attack speed.",
      regions: ["Morytania", "Kourend", "Asgarnia"],
      relics: [
        { tier: 1, name: "Power Miner" },
        { tier: 2, name: "Corner Cutter" },
        { tier: 3, name: "Bank Heist" },
        { tier: 4, name: "Reloaded" },
        { tier: 5, name: "Slayer Master" },
        { tier: 6, name: "Banker's Note" },
        { tier: 7, name: "Grimoire" },
        { tier: 8, name: "Guardian" },
      ],
      mastery: [
        "Melee-heavy allocation",
        "Prioritize T3 and T5 for attack speed reductions",
        "T6 melee for chaining echo hits",
      ],
      gearProgression: [
        {
          phase: "Early (Misthalin/Karamja)",
          items: [
            "Iron/Steel armor from Power Miner smelting",
            "Rune scimitar from smithing or shops",
            "Amulet of strength",
          ],
        },
        {
          phase: "Mid (Morytania unlock)",
          items: [
            "Barrows armor sets (Dharok's, Torag's, Verac's)",
            "Barrows weapons for specific encounters",
            "Fighter torso from Barbarian Assault (with Asgarnia)",
          ],
        },
        {
          phase: "Late (GWD access)",
          items: [
            "Bandos chestplate and tassets",
            "Godsword (any variant from GWD)",
            "Dragon defender from Warriors' Guild",
          ],
        },
        {
          phase: "Endgame (CoX)",
          items: [
            "Avernic defender from ToB",
            "Elder maul or Dragon hunter lance from CoX",
            "Infernal cape if Jad/Zuk completed",
          ],
        },
      ],
      strengths: [
        "Extremely tanky — can facetank most bosses with Barrows and Bandos",
        "Guardian thrall adds sustained AoE damage without input",
        "Slayer Master means every kill contributes to Slayer progress",
        "Simple to play — melee is straightforward and forgiving",
      ],
      weaknesses: [
        "Lacks ranged/magic flexibility for certain boss mechanics",
        "Slower at bosses with melee-unfriendly mechanics (Zulrah, certain CoX rooms)",
        "Guardian is less impactful on single-target encounters",
        "Relies on Asgarnia as a third pick which delays GWD gear access",
      ],
    },
    {
      id: "re-ranged-dps",
      name: "Ranged DPS",
      style: "Ranged",
      difficulty: "Advanced",
      description:
        "A ranged-focused build that maximizes DPS through Ranged mastery's scaling damage and never-miss T6. Desert provides ToA, Fremennik gives Vorkath, and Varlamore adds Colosseum content. Specialist at T8 turns spec weapons into your primary damage source.",
      regions: ["Desert", "Fremennik", "Varlamore"],
      relics: [
        { tier: 1, name: "Animal Wrangler" },
        { tier: 2, name: "Friendly Forager" },
        { tier: 3, name: "Clue Compass" },
        { tier: 4, name: "Golden God" },
        { tier: 5, name: "Treasure Arbiter" },
        { tier: 6, name: "Total Recall" },
        { tier: 7, name: "Grimoire" },
        { tier: 8, name: "Specialist" },
      ],
      mastery: [
        "Ranged-heavy allocation",
        "T2 scaling damage per hit is core to sustained DPS",
        "T6 never-miss in PvM eliminates accuracy concerns entirely",
      ],
      gearProgression: [
        {
          phase: "Early (Misthalin/Karamja)",
          items: [
            "Leather armor and shortbow",
            "Bone crossbow from drops",
            "Green/blue d'hide from crafting",
          ],
        },
        {
          phase: "Mid (Desert unlock)",
          items: [
            "Black d'hide from crafting or drops",
            "Rune crossbow",
            "Broad bolts from Slayer",
          ],
        },
        {
          phase: "Late (Fremennik unlock)",
          items: [
            "Armadyl crossbow or dragon crossbow",
            "Vorkath drops for consistent GP and supplies",
            "Archer's ring from DKS",
          ],
        },
        {
          phase: "Endgame (ToA/Colosseum)",
          items: [
            "Twisted bow or Bow of Faerdhinen",
            "Masori armor from ToA",
            "Zaryte crossbow or Dizana's quiver from Colosseum",
          ],
        },
      ],
      strengths: [
        "Ranged T6 never-miss makes every hit count — extremely high effective DPS",
        "Specialist turns spec weapons like Dark Bow into repeatable nukes",
        "Total Recall enables seamless boss resupply loops",
        "Treasure Arbiter + Clue Compass for massive clue scroll point generation",
      ],
      weaknesses: [
        "Lacks early gear — ranged equipment is harder to acquire than melee",
        "Clue/treasure relic combo is strong for points but weaker for raw combat power",
        "Desert and Fremennik lack overlap — tasks are spread across different content",
        "Advanced difficulty — requires good knowledge of boss mechanics to capitalize on DPS",
      ],
    },
    {
      id: "re-magic-aoe",
      name: "Magic AoE",
      style: "Magic",
      difficulty: "Advanced",
      description:
        "A magic-focused build that excels at multi-target encounters through AoE spells and magic mastery scaling. Kourend provides CoX and GOTR, Kandarin gives Zulrah, and Fremennik adds DKS and Vorkath. Last Stand at T8 is the ultimate safety net for pushing difficult content.",
      regions: ["Kourend", "Kandarin", "Fremennik"],
      relics: [
        { tier: 1, name: "Lumberjack" },
        { tier: 2, name: "Dodgy Deals" },
        { tier: 3, name: "Fairy's Flight" },
        { tier: 4, name: "Equilibrium" },
        { tier: 5, name: "Production Master" },
        { tier: 6, name: "Total Recall" },
        { tier: 7, name: "Overgrown" },
        { tier: 8, name: "Last Stand" },
      ],
      mastery: [
        "Magic-heavy allocation",
        "T2 damage scaling between attacks rewards slow, powerful spells",
        "T6 guaranteed max hit on low-HP targets is incredible for finishing bosses",
      ],
      gearProgression: [
        {
          phase: "Early (Misthalin/Karamja)",
          items: [
            "Wizard robes and elemental staves",
            "Fire Strike/Bolt for early combat",
            "Mystic robes from drops or shops",
          ],
        },
        {
          phase: "Mid (Kourend unlock)",
          items: [
            "Iban's staff equivalent or upgraded magic weapons",
            "Runes from GOTR for sustained casting",
            "Prayer gear for protection prayers",
          ],
        },
        {
          phase: "Late (Kandarin unlock)",
          items: [
            "Trident of the Swamp from Slayer",
            "Zulrah drops — Toxic Blowpipe for ranged swap, Magic Fang",
            "Occult necklace",
          ],
        },
        {
          phase: "Endgame (CoX/DKS)",
          items: [
            "Ancestral robes from CoX",
            "Kodai wand from CoX",
            "Sanguinesti staff from ToB if accessible",
          ],
        },
      ],
      strengths: [
        "Magic mastery T6 guarantees max hits on weakened targets — incredible finishing power",
        "Last Stand provides a safety net for pushing content above your gear level",
        "Overgrown + Fairy's Flight creates a completely passive farming pipeline",
        "Production Master + Equilibrium for extremely fast skilling progression",
      ],
      weaknesses: [
        "Magic gear takes longer to acquire than melee or ranged equivalents",
        "Equilibrium is slow to ramp — underpowered early, overpowered late",
        "No Morytania access means no Barrows, ToB, or Sepulchre",
        "Lumberjack is the weakest T1 relic — requires deliberate play around it",
      ],
    },
    {
      id: "re-hybrid-all",
      name: "Hybrid All-Rounder",
      style: "Hybrid",
      difficulty: "Expert",
      description:
        "A versatile hybrid build that can tackle any content in the league. Morytania provides Barrows and ToB, Kourend gives CoX and Hydra, and Kandarin adds Zulrah. Spreads mastery points across all three styles for flexibility. Requires strong game knowledge to maximize.",
      regions: ["Morytania", "Kourend", "Kandarin"],
      relics: [
        { tier: 1, name: "Animal Wrangler" },
        { tier: 2, name: "Dodgy Deals" },
        { tier: 3, name: "Clue Compass" },
        { tier: 4, name: "Golden God" },
        { tier: 5, name: "Treasure Arbiter" },
        { tier: 6, name: "Total Recall" },
        { tier: 7, name: "Grimoire" },
        { tier: 8, name: "Specialist" },
      ],
      mastery: [
        "Balanced allocation across all three styles",
        "Melee T3 and Ranged T3 for attack speed on both styles",
        "Flexibility to adapt mastery to whatever content you're doing",
      ],
      gearProgression: [
        {
          phase: "Early (Misthalin/Karamja)",
          items: [
            "Mixed combat gear from shops and drops",
            "Animal Wrangler for passive food from fishing",
            "Basic melee and ranged setups",
          ],
        },
        {
          phase: "Mid (Morytania unlock)",
          items: [
            "Full Barrows sets — Dharok's for melee, Karil's for ranged",
            "Ibans staff for magic",
            "Hallowed Sepulchre for agility and ring of endurance",
          ],
        },
        {
          phase: "Late (Kourend/Kandarin unlocks)",
          items: [
            "Zulrah uniques — Blowpipe, Trident, Serpentine Helm",
            "Hydra leather and claw",
            "CoX uniques as they come",
          ],
        },
        {
          phase: "Endgame",
          items: [
            "Best-in-slot from each combat style via raids",
            "Grimoire for spellbook swapping between encounters",
            "Specialist for spec weapon burst with Total Recall for resupply",
          ],
        },
      ],
      strengths: [
        "Can tackle every boss in every unlocked region effectively",
        "Grimoire spellbook swapping enables optimal spell usage per encounter",
        "Treasure Arbiter + Clue Compass generates enormous passive points",
        "Three top-tier PvM regions (Morytania, Kourend, Kandarin) cover almost all endgame content",
      ],
      weaknesses: [
        "Expert difficulty — requires knowing which style to use and when to swap",
        "Spread mastery points mean no Tier 6 mastery effect in any style",
        "Jack of all trades, master of none — each style is weaker than a dedicated build",
        "Golden God and Dodgy Deals are both GP relics — may feel redundant if GP is not a bottleneck",
      ],
    },
  ],
};

// =============================================================================
// Combat Mastery Guide
// =============================================================================

export const reCombatMasteries: CombatMasteryGuide = {
  intro:
    "Combat Mastery is a unique Raging Echoes system that lets you invest 10 mastery points across three combat styles: Melee, Ranged, and Magic. Each style has 6 tiers of increasingly powerful effects. Mastery points are earned from specific combat milestones, not from general XP — plan your point acquisition path based on your build.",
  pointSources: [
    "Defeat a Giant",
    "Defeat 10 monsters with combat level 100+",
    "Solo defeat Scurrius",
    "Defeat a monster requiring 55+ Slayer",
    "Defeat TzTok-Jad in the Fight Caves",
    "Reach combat level 100",
    "Defeat one Echo Boss",
    "Defeat two unique Echo Bosses",
    "Defeat three unique Echo Bosses",
    "Defeat TzKal-Zuk",
  ],
  universalPassives: [
    "High chance to save ammo, runes, and charges",
    "Increased healing from all sources",
    "Significantly increased accuracy for all styles",
    "Reduced damage taken",
    "Increased prayer point gain from all sources",
    "Attacks gain prayer penetration",
  ],
  styles: [
    {
      name: "Melee Mastery",
      style: "melee",
      strengths: [
        "Highest burst potential with echo hits that chain multiple times at T6",
        "Strong sustain with T4 lifesteal chance",
        "Attack speed reductions at T3 and T5 compound with weapon speed",
      ],
      bestFor: [
        "Frontline tanking and bossing",
        "Sustained melee DPS with Bandos/Barrows gear",
        "Players who prefer simple, reliable combat",
      ],
      tiers: [
        {
          tier: 1,
          effect:
            "Chance to roll damage twice, taking the highest result",
        },
        {
          tier: 2,
          effect:
            "Chance for echo hits — additional hits at reduced max hit",
        },
        {
          tier: 3,
          effect: "Increased attack speed",
        },
        {
          tier: 4,
          effect: "Chance to heal from damage dealt",
        },
        {
          tier: 5,
          effect: "Significantly increased attack speed",
        },
        {
          tier: 6,
          effect:
            "Greatly increased echo hit chance with multi-target chaining",
        },
      ],
    },
    {
      name: "Ranged Mastery",
      style: "ranged",
      strengths: [
        "Consistent damage floor with T1 minimum damage guarantee",
        "Scaling damage per hit at T2 rewards sustained combat",
        "T6 never-miss eliminates accuracy as a concern entirely",
      ],
      bestFor: [
        "Safe DPS from distance",
        "Boss encounters with ranging-friendly mechanics",
        "Players who value consistency over burst",
      ],
      tiers: [
        {
          tier: 1,
          effect: "Minimum damage roll is raised to a portion of your max hit",
        },
        {
          tier: 2,
          effect:
            "Each subsequent hit increases max hit, resetting after several stacks",
        },
        {
          tier: 3,
          effect: "Increased attack speed",
        },
        {
          tier: 4,
          effect: "Periodic hits heal a small amount of HP",
        },
        {
          tier: 5,
          effect: "Significantly increased attack speed",
        },
        {
          tier: 6,
          effect: "Never miss in PvM — all attacks hit their target",
        },
      ],
    },
    {
      name: "Magic Mastery",
      style: "magic",
      strengths: [
        "Extreme scaling on high-damage hits with T1 bonus on near-max rolls",
        "Passive damage growth between attacks at T2 rewards methodical play",
        "T6 is devastating on high-HP bosses — guaranteed max hits when target HP is low",
      ],
      bestFor: [
        "AoE encounters and multi-target Slayer",
        "High-HP boss finishing",
        "Players who enjoy strategic, timing-based combat",
      ],
      tiers: [
        {
          tier: 1,
          effect:
            "Hits near your max hit receive a bonus damage multiplier",
        },
        {
          tier: 2,
          effect:
            "Max hit increases for each tick between attacks, stacking multiple times",
        },
        {
          tier: 3,
          effect: "Increased attack speed",
        },
        {
          tier: 4,
          effect:
            "Near-max hits heal you for a portion of damage dealt",
        },
        {
          tier: 5,
          effect: "Significantly increased attack speed",
        },
        {
          tier: 6,
          effect:
            "Max hit scales with target's remaining HP. Low hits are boosted to your max hit",
        },
      ],
    },
  ],
  distributions: [
    {
      name: "Melee Main",
      description:
        "Maximizes melee mastery for the devastating T6 chaining echo hits. Puts leftover points into ranged for the minimum damage floor and magic for the high-hit bonus.",
      allocation: [
        { style: "Melee", points: 7 },
        { style: "Ranged", points: 2 },
        { style: "Magic", points: 1 },
      ],
      bestFor:
        "Speed-focused melee builds that want maximum DPS through echo hit chains and attack speed reductions",
    },
    {
      name: "Ranged Specialist",
      description:
        "Invests heavily into ranged mastery for the T6 never-miss effect. Melee receives two points for the double-roll and echo hit, while magic gets one point for the high-hit bonus.",
      allocation: [
        { style: "Melee", points: 2 },
        { style: "Ranged", points: 7 },
        { style: "Magic", points: 1 },
      ],
      bestFor:
        "Safe, consistent ranged damage with guaranteed hits — ideal for players who prefer ranging bosses from a distance",
    },
    {
      name: "Magic Specialist",
      description:
        "Pushes magic mastery to T6 for guaranteed max hits on weakened targets. Two ranged points for the damage floor and scaling, one melee point for the double damage roll.",
      allocation: [
        { style: "Melee", points: 1 },
        { style: "Ranged", points: 2 },
        { style: "Magic", points: 7 },
      ],
      bestFor:
        "Slayer and AoE grinding with devastating finishing power on high-HP bosses",
    },
    {
      name: "Balanced Fighter",
      description:
        "Spreads points evenly to access T3 attack speed reductions in at least two styles. Sacrifices T6 capstone effects for flexibility across all combat situations.",
      allocation: [
        { style: "Melee", points: 4 },
        { style: "Ranged", points: 3 },
        { style: "Magic", points: 3 },
      ],
      bestFor:
        "Completionists who want to engage with all combat content without being locked into one style",
    },
  ],
};
