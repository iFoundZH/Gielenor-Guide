import type { EfficiencyGuide } from "@/types/efficiency-guide";

export const demonicPactsRank1Guide: EfficiencyGuide = {
  leagueId: "demonic-pacts",
  leagueName: "Demonic Pacts League",
  summary: {
    targetPoints: 56000,
    optimalRegions: ["Kebos & Kourend", "Morytania", "Kandarin"],
    keyInsight:
      "Dragon tier (56,000 pts) is achievable in ~480 hours across 56 days by leveraging Varlamore's starting content with three high-density region picks. Kebos & Kourend + Morytania + Kandarin provides access to the deepest task pools in the game, covering raids (CoX, ToB), high-value Slayer content (Hydra, Slayer Tower, Catacombs), and broad skilling coverage (Wintertodt, GOTR, Catherby, Seers'). Starting in Varlamore with Karamja auto-unlock means immediate access to Fortis Colosseum, Moons of Peril, Hunter Guild, and TzHaar content for early points. The Evil Eye relic (T3) provides instant boss teleports that eliminate travel time across all regions, while Culling Spree (T6) turns Slayer into the league's primary point engine. Conniving Clues (T4) creates a passive clue pipeline that generates thousands of points in the background. With ~1,500 expected tasks and aggressive pact stacking [SPECULATIVE - pact details unknown], 56,000 points is reachable with focused play.",
  },

  regionAnalysis: [
    {
      regionId: "kebos",
      regionName: "Kebos & Kourend",
      tier: "S",
      totalTasks: 195,
      totalPoints: 15400,
      tasksByDifficulty: { easy: 28, medium: 58, hard: 55, elite: 42, master: 12 },
      estimatedPtsPerHour: 210,
      uniqueBosses: [
        "Chambers of Xeric (CoX)",
        "Alchemical Hydra",
        "Skotizo",
        "Sarachnis",
        "Wintertodt",
        "Tempoross",
        "Guardians of the Rift (GOTR)",
      ],
      reasoning:
        "The single largest task pool of any choosable region. Kourend is a self-contained continent with content for every skill: Wintertodt for Firemaking, GOTR for Runecrafting, Tithe Farm for Farming, Blast Mine for Mining, and the Catacombs of Kourend for AoE Slayer. CoX is the highest-value raid for elite/master task density, and Hydra at 95 Slayer is a massive point farm with the league's boosted 5x drop rates. Skotizo via totem farming produces essentially free master tasks. The breadth of content means you rarely stall on completable tasks at any stage of the league. Five Kourend houses each have their own favour-based task chains for easy/medium points. Kebos Lowlands adds Farming Guild and Hespori for passive completions.",
    },
    {
      regionId: "morytania",
      regionName: "Morytania",
      tier: "S",
      totalTasks: 140,
      totalPoints: 12200,
      tasksByDifficulty: { easy: 16, medium: 38, hard: 42, elite: 33, master: 11 },
      estimatedPtsPerHour: 230,
      uniqueBosses: [
        "Theatre of Blood (ToB)",
        "Nightmare / Phosani's Nightmare",
        "Barrows",
        "Grotesque Guardians",
      ],
      reasoning:
        "Morytania has the highest points-per-hour of any region due to Barrows being farmable within hours of unlocking. With the league's 5x drop rates, Barrows equipment flows quickly, enabling immediate combat upgrades. ToB provides a dense cluster of elite/master tasks. The Slayer Tower covers Gargoyles, Nechryael, Abyssal Demons, and Grotesque Guardians for stacking Slayer tasks that pair perfectly with Culling Spree (T6). Hallowed Sepulchre is the best Agility training in the game and has its own task chain. Phosani's Nightmare drops are boosted and generate high-value master tasks. Echo boss content in Morytania [SPECULATIVE - DP echo bosses unconfirmed] would add another layer of master-tier points. Priest in Peril is auto-completed, removing the traditional Morytania quest gate.",
    },
    {
      regionId: "kandarin",
      regionName: "Kandarin",
      tier: "A",
      totalTasks: 125,
      totalPoints: 10000,
      tasksByDifficulty: { easy: 18, medium: 36, hard: 36, elite: 27, master: 8 },
      estimatedPtsPerHour: 185,
      uniqueBosses: [
        "Zulrah",
        "Demonic Gorillas",
        "Kraken",
        "Hespori",
      ],
      reasoning:
        "Kandarin fills critical skilling gaps that Kebos and Morytania lack. Seers' Village rooftop is the best mid-game agility course. Catherby is the highest-density fishing location. Zulrah is a consistent point farm with boosted uniques and no damage cap or melee immunity in this league. Demonic Gorillas unlock zenyte jewelry tasks. The Ranging Guild and Piscatoris add Hunter and Ranged task coverage. Kandarin diary tasks are among the most accessible. The region rounds out a build by providing sustained medium/hard task completions throughout the league when boss grinds stall. Main drawback: fewer master tasks than the S-tier picks.",
    },
    {
      regionId: "asgarnia",
      regionName: "Asgarnia",
      tier: "A",
      totalTasks: 110,
      totalPoints: 9500,
      tasksByDifficulty: { easy: 14, medium: 30, hard: 30, elite: 26, master: 10 },
      estimatedPtsPerHour: 175,
      uniqueBosses: [
        "General Graardor (Bandos)",
        "Commander Zilyana (Saradomin)",
        "K'ril Tsutsaroth (Zamorak)",
        "Kree'arra (Armadyl)",
        "Nex",
        "Corporeal Beast",
      ],
      reasoning:
        "Asgarnia is the boss density champion. GWD alone provides 5 bosses with stacking KC tasks from easy through master. Corp offers sigil tasks. Warriors' Guild has defender tasks for quick medium/hard points. Motherload Mine covers Mining task chains. Pest Control provides easy minigame points (boosted 8x). The downside is that GWD requires significant combat stats and gear before it becomes efficient, making it slower to ramp than Morytania's Barrows. Strong alternative third pick if you plan to focus heavily on PvM and want GWD access over Kandarin's skilling breadth.",
    },
    {
      regionId: "desert",
      regionName: "Kharidian Desert",
      tier: "A",
      totalTasks: 105,
      totalPoints: 9200,
      tasksByDifficulty: { easy: 10, medium: 26, hard: 32, elite: 28, master: 9 },
      estimatedPtsPerHour: 165,
      uniqueBosses: [
        "Tombs of Amascut (ToA)",
        "Kalphite Queen",
      ],
      reasoning:
        "ToA is the most scalable raid with invocation levels creating a ladder of tasks from medium through master. The league buff to ToA (all players receive uniques if any player in the raid gets one) makes group ToA extremely rewarding. Pyramid Plunder is excellent Thieving XP. Desert Treasure II bosses are auto-completed in DP, so Soulreaper Axe pieces drop from every DT2 boss, but you still need the Desert region for ToA access. KQ tasks require setup but are farmable. Main issue: content is concentrated around ToA at high levels, making early-game points thin. Best as a third region if you want raid variety.",
    },
    {
      regionId: "fremennik",
      regionName: "Fremennik Province",
      tier: "B",
      totalTasks: 95,
      totalPoints: 8200,
      tasksByDifficulty: { easy: 11, medium: 26, hard: 26, elite: 23, master: 9 },
      estimatedPtsPerHour: 155,
      uniqueBosses: [
        "Vorkath",
        "Dagannoth Kings",
        "Nex (shared with Asgarnia)",
      ],
      reasoning:
        "Vorkath is one of the best GP/hr bosses with stacking KC tasks, and the league change (drops Ava's Assembler directly instead of head) removes the post-quest grind. DKs provide ring tasks. Lunar Isle spellbook access can be useful but Nature's Accord (T5) gives fairy ring/spirit tree teleports which reduces the value of Lunar teleports. The Fremennik quest chain is long but auto-completed quests help. The region lacks skilling breadth compared to Kandarin or Kebos, making it a weaker third pick. Nex access is shared with Asgarnia, so picking both is redundant for that boss.",
    },
    {
      regionId: "tirannwn",
      regionName: "Tirannwn",
      tier: "B",
      totalTasks: 75,
      totalPoints: 7200,
      tasksByDifficulty: { easy: 6, medium: 17, hard: 22, elite: 22, master: 8 },
      estimatedPtsPerHour: 145,
      uniqueBosses: [
        "The Gauntlet / Corrupted Gauntlet",
        "Zalcano",
      ],
      reasoning:
        "Corrupted Gauntlet is arguably the single best boss in leagues: zero gear requirements, high elite/master task density, and Blade of Saeldor as a reward. Zalcano is easy Mining/Smithing XP and tasks. Prifddinas agility course is the best in the game. However, Song of the Elves is a massive quest gate (though some prerequisites are auto-completed in DP) and the region has the fewest total tasks of any choosable region. Elite-heavy distribution means points come late. Excellent for skilled players who can chain Corrupted Gauntlet completions, but risky as a primary pick due to low total task count.",
    },
    {
      regionId: "wilderness",
      regionName: "Wilderness",
      tier: "B",
      totalTasks: 85,
      totalPoints: 6800,
      tasksByDifficulty: { easy: 12, medium: 24, hard: 24, elite: 19, master: 6 },
      estimatedPtsPerHour: 125,
      uniqueBosses: [
        "Callisto / Artio",
        "Vet'ion / Calvar'ion",
        "Venenatis / Spindel",
        "Chaos Elemental",
        "Scorpia",
        "King Black Dragon",
        "Corporeal Beast",
      ],
      reasoning:
        "The Wilderness has decent boss variety and the league removes the medium diary requirement for boss access. Wilderness bosses have safe-spot cave variants (Artio, Calvar'ion, Spindel) which are farmable without PvP risk. The Chaos Temple provides free Prayer training but league relics reduce Prayer's value as a bottleneck. Corp is accessible here but requires significant setup. Revenant Caves provide GP but few tasks. PvP risk is largely eliminated in leagues (separate servers, small populations), but travel time and the spread of content across the Wilderness make it a poor pts/hr region overall. Only pick this if going all-in on boss KC grinding.",
    },
  ],

  optimalRegionPick: {
    primary: ["Kebos & Kourend", "Morytania", "Kandarin"],
    alternative: ["Kebos & Kourend", "Morytania", "Asgarnia"],
    mathJustification:
      "Primary pick (Kebos + Morytania + Kandarin) yields ~460 region-specific tasks worth ~37,600 points. Combined with Varlamore (~80 starting tasks, ~5,600 pts), Karamja (~45 auto-unlock tasks, ~3,000 pts), and ~350 general non-region tasks (~16,000 pts), you have access to ~935 tasks totaling ~62,200 potential points. This exceeds Dragon tier (56,000) with meaningful margin for incomplete tasks. The alternative swapping Kandarin for Asgarnia trades ~15 completable tasks and skilling breadth for GWD boss density (5 additional bosses, higher master-task ceiling). Asgarnia makes sense only if you can sustain 6+ hours/day of GWD grinding after hitting T6 relics. For most rank 1 pushers, the primary pick is superior because Kandarin's skilling tasks are faster pts/hr than boss KC tasks during weeks 1-4, and you need that early velocity to hit relic unlock thresholds on pace.",
    unlockOrder: [
      "Kebos & Kourend (1st region pick) - Opens the largest task pool immediately. Wintertodt and GOTR are accessible at low levels for passive skilling points while you build combat stats. Catacombs of Kourend provides excellent AoE Slayer from day one. CoX becomes available once combat stats reach base 80s. Hydra unlocks at 95 Slayer which is realistic by week 2 with 12x XP and Culling Spree.",
      "Morytania (2nd region pick) - Barrows is immediately farmable with base 60 combat stats from Kourend Slayer. Provides Barrows equipment for all three combat styles, Slayer Tower access for stacking tasks with Culling Spree, and Hallowed Sepulchre for Agility. ToB becomes the primary elite/master point source once geared.",
      "Kandarin (3rd region pick) - By the time you unlock your third region, you need task breadth to push from Rune to Dragon. Zulrah is immediately farmable with accumulated gear. Seers' agility and Catherby fishing fill remaining skilling milestones. Demonic Gorillas provide zenyte tasks. Kandarin's medium/hard task density fills the gaps between boss KC grinds.",
    ],
  },

  relicPath: [
    {
      tier: 1,
      recommended: "Endless Harvest",
      alternatives: ["Barbarian Gathering", "Abundance"],
      reasoning:
        "Endless Harvest sends all gathered resources to bank with 2x yield and no depletion on initial interaction. This is the fastest path to early skilling tasks because you never bank and every resource is doubled. Fish, logs, and ore accumulate passively while you chain gathering tasks. The auto-banking means you can gather at any spot indefinitely without inventory management. Barbarian Gathering is a strong alternative (crystal-tier tools with bare hands, 50% second-chance on failures, +10% Strength/Agility XP) but the knapsack has a 140-item cap that requires management. Abundance provides a +10 invisible skill boost and GP generation but scales worse than 2x resource yield for task completion speed.",
      synergyNotes:
        "Endless Harvest pairs perfectly with a Kebos-first strategy. Mine at Blast Mine, fish at Tempoross, and chop at the Woodcutting Guild with zero banking. The 2x resources mean every 'gather X items' task completes in half the time. Combined with Woodsman (T2) for Hunter/Fletching coverage, you cover 6+ gathering/production skills passively in the first few hours.",
    },
    {
      tier: 2,
      recommended: "Woodsman",
      alternatives: ["Hotfoot"],
      reasoning:
        "Woodsman provides Hunter traps banking directly, 100% Hunter success rate, double Hunter loot/XP, auto-burn logs for Firemaking XP, and instant Fletching (all items processed at once). This covers Hunter, Firemaking, Fletching, and partial Woodcutting in a single relic. Hunter rumours in Varlamore's Hunter Guild give double XP with Woodsman, and implings drop noted/doubled loot. Hotfoot is a legitimate alternative focused on Agility/Cooking (auto-cook fish, agility course completions grant 2x count + bonus XP, 100% success rate) but Woodsman covers more task categories overall.",
      synergyNotes:
        "Woodsman + Endless Harvest creates a skilling engine: mine ore (auto-banked, 2x), chop logs (auto-burned for FM XP via Woodsman), catch fish (auto-banked, 2x via Endless Harvest), trap hunters (auto-banked, 2x via Woodsman). This combination covers Mining, Fishing, Woodcutting, Firemaking, Hunter, and Fletching tasks within the first 4-6 hours, generating 1,500+ points before combat even begins.",
    },
    {
      tier: 3,
      recommended: "Evil Eye",
      alternatives: [],
      reasoning:
        "Evil Eye is the only T3 relic and is mandatory. It provides instant teleportation to any boss or raid on the combat achievements list, ignoring Wilderness teleport restrictions. This eliminates travel time to every boss in the game once you have the region unlocked. Barrows has the option to teleport directly to the chest room or surface. Each Moon of Peril can be targeted individually. This is the single most impactful quality-of-life relic in the league: every boss trip saves 30-120 seconds of travel, which compounds to dozens of hours saved across the league.",
      synergyNotes:
        "Evil Eye transforms the bossing experience across all regions. In Morytania, instantly teleport to Barrows chest, Nightmare, ToB, or Grotesque Guardians. In Kebos, jump straight to CoX, Hydra, or Sarachnis. Combined with Culling Spree (T6) for boss Slayer task selection, you can pick a boss task and teleport there in under 2 seconds. No other relic in any tier comes close to this time savings for PvM-focused play.",
    },
    {
      tier: 4,
      recommended: "Conniving Clues",
      alternatives: [],
      reasoning:
        "Conniving Clues is the only T4 relic and is mandatory. Clue contracts teleport you to your current clue step (1/3 chance from caskets). Caskets have 1/4 chance to contain another clue box of the same tier, creating chain completions. Creature clue drop rate buffed to 1/15, skilling clue vessels 10x more likely, all clues have minimum steps and maximum reward rolls. Emote/Falo steps require no items. Combined with the T1 passive (stackable scroll boxes, saved progress), this creates a passive clue completion pipeline that generates thousands of points. Master clues become achievable in 3-4 steps with maximum rolls.",
      synergyNotes:
        "Conniving Clues + the T4 passive (5x item drop rate, 8x minigame points) creates an enormous multiplier on clue rewards and task completions. Every boss you kill with Evil Eye has a 1/15 chance to drop a clue. Every clue completes in minimum steps. Every casket can chain into another clue. Clue scroll tasks (complete X clues of Y tier) are among the densest easy/medium/hard task clusters in the game, and this relic turns them all into passive completions alongside your main activity.",
    },
    {
      tier: 5,
      recommended: "Nature's Accord",
      alternatives: [],
      reasoning:
        "Nature's Accord is the only T5 relic and is mandatory. It removes all Farming level requirements for planting/harvesting, provides 10x noted yield from all patches, plants never die, 20% seed saving chance, and grants a fairy mushroom for instant teleportation to any fairy ring, spirit tree, or tool leprechaun. Auto-completes Tree Gnome Village quest. Ignores Wilderness teleport restrictions. Combined with the T5 passive (12x XP multiplier), Farming becomes essentially instant: plant a seed, wait 1 minute (league farming tick), harvest 10x noted yield. Every Farming task in the game becomes trivially fast.",
      synergyNotes:
        "Nature's Accord + 1-minute farming ticks (league passive) means you can complete an entire tree run in under 5 minutes. The fairy mushroom provides a secondary teleport network alongside Evil Eye. For Kebos, this means instant access to the Farming Guild and Hespori without any travel. For Morytania, fairy ring access to Canifis and Slayer Tower shortcuts. The 10x yield with noted output means herb runs alone generate enough materials for all Herblore tasks.",
    },
    {
      tier: 6,
      recommended: "Culling Spree",
      alternatives: [],
      reasoning:
        "Culling Spree is the only T6 relic and is mandatory. Choose your Slayer task from 3 options (at least 1 boss task guaranteed), selectable kill count (5-200), superior Slayer monsters chain-spawn (50% chance on death), superiors always drop 1-3 elite clues, free Slayer helm effect without wearing it, and all Slayer shop perks are free. This turns Slayer into the most powerful point engine in the league. Pick boss tasks with 5 kills, complete them instantly with Evil Eye teleport, get a new task, repeat. Superior chain-spawning with elite clue drops feeds the Conniving Clues pipeline. The free Slayer helm effect frees up a gear slot for every combat scenario.",
      synergyNotes:
        "Culling Spree + Evil Eye + Conniving Clues creates the definitive DP point loop: pick a boss Slayer task (5 kills), Evil Eye teleport to the boss, complete the task, superiors spawn and drop elite clues, complete the clues with Conniving Clues contracts, get a new boss task, teleport, repeat. Each loop generates Slayer XP, boss KC tasks, Slayer task completions, superior kills, clue completions, and collection log entries simultaneously. This is the single highest sustained pts/hr strategy in the league.",
    },
    {
      tier: 7,
      recommended: "[SPECULATIVE] Unknown T7 Relic",
      alternatives: [],
      reasoning:
        "[SPECULATIVE - T7 relic has not been revealed.] Based on previous league patterns (Trailblazer Reloaded and Raging Echoes), T7 typically provides a utility/quality-of-life relic. In Raging Echoes, T7 was Grimoire (instant spellbook swap + Book of the Dead). A similar utility relic for DP could involve spellbook access, noted drops, recall mechanics, or production bonuses. The T7 passive (16x XP) is confirmed, which means any training-based tasks become trivially fast at this point. Whatever T7 provides will amplify the bossing/Slayer loop established by T3-T6.",
      synergyNotes:
        "[SPECULATIVE] If T7 provides spellbook access (like RE's Grimoire), it would enable Ancient spellbook Ice Barrage for Catacombs AoE Slayer, Arceuus thralls for bossing DPS, and Lunar for Vengeance. If it provides a recall mechanic (like RE's Total Recall), it would pair with Evil Eye for zero-travel bossing. Either way, at 16x XP multiplier, the focus shifts entirely to boss KC and master task completion.",
    },
    {
      tier: 8,
      recommended: "Minion",
      alternatives: ["Flask of Fervour"],
      reasoning:
        "Minion summons a powerful combat companion for 30 minutes: 45,000 accuracy, 10 max hit (up to 20 with 5 Zamorak items), 1.8s attack speed, AoE in multi-combat, auto-looting kills, and works on thrall-immune targets. This is a permanent DPS increase of roughly 15-25% depending on the boss. The auto-loot feature means drops are collected without stopping your attack cycle. Flask of Fervour is the alternative: full HP/Prayer/spec restore with AoE damage explosion on a cooldown reduced by dealing damage. Flask is better for burst-focused strategies (spec dump then restore), while Minion is better for sustained DPS across long grinds. For rank 1 pushing, Minion's consistent DPS increase over hundreds of hours of bossing likely outweighs Flask's burst potential.",
      synergyNotes:
        "Minion + Culling Spree boss tasks + Evil Eye teleports creates maximum sustained DPS: teleport to boss, summon minion, boss melts under combined player + minion damage, auto-loot drops, teleport to next boss. The minion's AoE in multi-combat is particularly strong in Catacombs Slayer (chain superiors with Culling Spree), Barrows (hitting multiple brothers), and any multi-target encounter. Flask of Fervour is worth considering if pact penalties [SPECULATIVE] create situations where burst healing/Prayer restoration is critical.",
    },
  ],

  taskRouting: [
    {
      name: "Early Skilling Sprint",
      pointRange: "0 - 10,000",
      strategy:
        "Start in Varlamore with Endless Harvest: fish, mine, and chop in the Civitas illa Fortis area. All resources auto-bank with 2x yield. Complete Hunter rumours at the Hunter Guild for double XP/loot via Woodsman. Chain Varlamore-specific tasks (Quetzal Transport, wealthy citizen thieving, Mastering Mixology). With Karamja auto-unlocked, run Fight Caves prep by training at TzHaar and fishing at Brimhaven. At T3 (Evil Eye), begin boss content: Amoxliatl and Moons of Peril in Varlamore, Fight Caves on Karamja. Unlock Kebos & Kourend as first region pick. Start Wintertodt, GOTR, and Catacombs Slayer immediately. At T4 (Conniving Clues), clue scroll tasks begin completing passively. Target: days 1-7.",
      tasksPerHour: 12,
      pointsPerHour: 280,
    },
    {
      name: "Mid-Game Boss Ramp",
      pointRange: "10,000 - 30,000",
      strategy:
        "Unlock Morytania as second region pick. Immediately farm Barrows with Evil Eye direct teleports (chest room). With T5 (Nature's Accord), Farming tasks auto-complete via 1-minute ticks and 10x yield. Begin ToB learning with Barrows gear. Start Slayer Tower grinding for Gargoyles, Nechryael, Abyssal Demons, and Grotesque Guardians. At T6 (Culling Spree), the boss Slayer loop activates: pick boss tasks (5 kills), Evil Eye teleport, complete, repeat. Superior chain-spawning generates elite clues that feed Conniving Clues. CoX becomes the primary raid focus with Kebos access. Begin Hydra once 95 Slayer is reached (realistic by week 2 with 12x XP + Culling Spree). Phosani's Nightmare for master task attempts. Target: days 7-28.",
      tasksPerHour: 5,
      pointsPerHour: 200,
    },
    {
      name: "Late Dragon Push",
      pointRange: "30,000 - 56,000",
      strategy:
        "Unlock Kandarin as third region pick. Zulrah farming begins immediately (no damage cap in DP). Demonic Gorillas for zenyte tasks. Seers' agility and Catherby fishing mop up remaining skilling gaps. With T7 [SPECULATIVE] and T8 (Minion), bossing DPS peaks. Focus on elite/master tasks exclusively: CoX challenge mode (buffed drop rates in DP), ToB hard mode (shared uniques), ToA at 500+ invocations if Desert was picked. Echo boss content [SPECULATIVE] for mastery points. Speed-kill tasks with Minion's sustained DPS boost. Chain Culling Spree boss tasks with 5-kill assignments for maximum Slayer points and boss KC simultaneously. Mop up remaining diary tasks, combat achievement crossovers, and collection log fills. Target: days 28-56.",
      tasksPerHour: 3,
      pointsPerHour: 130,
    },
  ],

  dailyMilestones: [
    {
      day: 1,
      targetPoints: 2500,
      targetTier: "Bronze",
      keyActivities: [
        "Complete Varlamore starter tasks: exit Yama's Lair, use Quetzal Transport, thieve wealthy citizens",
        "Activate Endless Harvest - chain fishing/mining/woodcutting in Varlamore with 2x auto-banked resources",
        "Activate Woodsman at 750 pts - Hunter rumours at Hunter Guild with double XP/loot, auto-burn logs for FM",
        "Complete easy skilling tasks across all gathering skills (50+ easy tasks possible day 1)",
        "Unlock Kebos & Kourend as first region pick",
        "Begin Wintertodt for Firemaking tasks and supply crates",
      ],
    },
    {
      day: 3,
      targetPoints: 5000,
      targetTier: "Iron",
      keyActivities: [
        "Evil Eye (T3) unlocked - instant boss teleports active",
        "Defeat Amoxliatl in Varlamore for medium task completions",
        "Begin Fight Caves on Karamja for Fire Cape (hard task)",
        "Start Catacombs of Kourend Slayer for AoE training",
        "GOTR for Runecrafting tasks, Tithe Farm for Farming tasks",
        "Clear remaining easy/medium tasks in Varlamore, Karamja, and Kebos",
      ],
    },
    {
      day: 7,
      targetPoints: 10000,
      targetTier: "Steel",
      keyActivities: [
        "Conniving Clues (T4) unlocked - passive clue pipeline begins",
        "Combat stats approaching 80+ from Catacombs Slayer grind",
        "First CoX completions (scouted raids with base 80s)",
        "Unlock Morytania as second region pick",
        "Barrows farming begins immediately via Evil Eye (chest room teleport)",
        "Slayer Tower access: Gargoyles and Nechryael tasks",
      ],
    },
    {
      day: 10,
      targetPoints: 14000,
      targetTier: "Steel (pushing Mithril)",
      keyActivities: [
        "Nature's Accord (T5) unlocked - Farming tasks auto-complete with 10x yield and 1-min ticks",
        "12x XP multiplier active - combat and skilling 99s becoming achievable",
        "Herb runs every few minutes generating Herblore materials for potion tasks",
        "Hallowed Sepulchre runs in Morytania for Agility tasks",
        "Begin ToB learning with Barrows/CoX gear",
        "Approaching 95 Slayer for Hydra access",
      ],
    },
    {
      day: 14,
      targetPoints: 18000,
      targetTier: "Mithril",
      keyActivities: [
        "Culling Spree (T6) unlocked - boss Slayer task loop activates",
        "Pick boss tasks (5 kills) -> Evil Eye teleport -> complete -> repeat cycle begins",
        "Superior chain-spawning generates elite clues for Conniving Clues pipeline",
        "Hydra farming begins (95 Slayer reached with 12x XP + Culling Spree)",
        "CoX completions stacking for elite raid tasks",
        "Multiple 99s achieved for associated skill tasks",
      ],
    },
    {
      day: 21,
      targetPoints: 26000,
      targetTier: "Adamant (approaching)",
      keyActivities: [
        "T7 relic unlocked [SPECULATIVE] - 16x XP active, utility relic amplifies bossing",
        "ToB completions for elite/master tasks",
        "Phosani's Nightmare attempts for master task completions",
        "Echo boss content [SPECULATIVE] farming begins",
        "Combat achievements crossover tasks accumulating",
        "Clue scroll task chains nearing completion across all tiers",
      ],
    },
    {
      day: 28,
      targetPoints: 32000,
      targetTier: "Adamant",
      keyActivities: [
        "Minion (T8) unlocked - sustained DPS boost for all bossing",
        "Feed Zamorak items to Minion whistle for +10 max hit",
        "Unlock Kandarin as third region pick",
        "Zulrah farming begins for unique drop tasks (no damage cap in DP)",
        "Demonic Gorilla tasks for zenyte completions",
        "Seers' agility and Catherby fishing for skilling task mop-up",
      ],
    },
    {
      day: 35,
      targetPoints: 40000,
      targetTier: "Rune (approaching)",
      keyActivities: [
        "Focus on elite/master tasks across all three chosen regions + Varlamore",
        "CoX challenge mode attempts (buffed drop rates in DP)",
        "ToB hard mode for master task completions (shared uniques in DP)",
        "Hydra unique drops with 5x boosted rates",
        "Diary task completion across Morytania, Kandarin, and Kourend",
        "Master clue completions via Conniving Clues pipeline",
      ],
    },
    {
      day: 42,
      targetPoints: 48000,
      targetTier: "Rune",
      keyActivities: [
        "Speed-kill tasks with Minion sustained DPS",
        "Remaining boss KC milestone tasks (100/250/500 KC targets)",
        "Collection log fills triggering bonus tasks",
        "All achievable 99s reached - skill mastery tasks complete",
        "Echo boss unique drops [SPECULATIVE] for master completions",
        "Target highest pts/hr remaining tasks exclusively",
      ],
    },
    {
      day: 56,
      targetPoints: 56000,
      targetTier: "Dragon",
      keyActivities: [
        "Dragon tier achieved - all reward cosmetics unlocked (Demon Skin Colour, Yama's Throne Kit, Home Teleport)",
        "Final master task pushes for leaderboard position",
        "Any remaining elite/master tasks with positive pts/hr",
        "Collection log and combat achievement completions for bonus points",
        "Total playtime target: ~480 hours across 56 days (~8.5 hrs/day average)",
      ],
    },
  ],

  tierProjections: [
    {
      tierName: "Bronze",
      pointsRequired: 2500,
      estimatedHours: 10,
      estimatedDay: 1,
    },
    {
      tierName: "Iron",
      pointsRequired: 5000,
      estimatedHours: 20,
      estimatedDay: 3,
    },
    {
      tierName: "Steel",
      pointsRequired: 10000,
      estimatedHours: 48,
      estimatedDay: 7,
    },
    {
      tierName: "Mithril",
      pointsRequired: 18000,
      estimatedHours: 100,
      estimatedDay: 14,
    },
    {
      tierName: "Adamant",
      pointsRequired: 28000,
      estimatedHours: 170,
      estimatedDay: 24,
    },
    {
      tierName: "Rune",
      pointsRequired: 42000,
      estimatedHours: 310,
      estimatedDay: 40,
    },
    {
      tierName: "Dragon",
      pointsRequired: 56000,
      estimatedHours: 480,
      estimatedDay: 56,
    },
  ],

  pactOptimization: {
    profiles: [
      {
        name: "Conservative Pacts",
        description:
          "[SPECULATIVE - Pact details are secret until league launch.] Based on the placeholder pact data, a conservative approach focuses on a single combat style pact with minimal downside. This is ideal for players who want consistent progress without risk of death or task failure from pact penalties.",
        riskLevel: "conservative",
        pacts: ["Melee Might"],
        reasoning:
          "[SPECULATIVE] Taking only the T1 Melee Might pact provides a clean damage and accuracy boost for the dominant combat style (melee is used for most boss content with Minion's sustained DPS). The penalty of reduced effectiveness in other styles is manageable because Ranged/Magic are secondary in a melee-focused build. Avoiding T2/T3 pacts eliminates any risk of increased damage taken (Glass Cannon) or prayer restrictions (Berserker's Oath). This profile sacrifices potential point bonuses from pact stacking but ensures you never lose time to unnecessary deaths. Recommended for players aiming for Dragon tier with minimal risk.",
      },
      {
        name: "Balanced Pacts",
        description:
          "[SPECULATIVE - Pact details are secret until league launch.] A balanced approach layers a T1 combat pact with a T2 utility pact for meaningful bonuses without crippling downsides. This is the recommended profile for most rank 1 pushers who can adapt their playstyle to moderate penalties.",
        riskLevel: "balanced",
        pacts: ["Melee Might", "Vampiric Touch"],
        reasoning:
          "[SPECULATIVE] Melee Might (T1) for primary combat boost plus Vampiric Touch (T2) for lifesteal sustain. The Vampiric Touch penalty (reduced prayer effectiveness) is manageable because the lifesteal itself replaces some prayer-based sustain. This combination lets you extend boss trips significantly: every hit heals you, reducing food consumption by an estimated 30-50%. Longer trips mean more kills/hr which means more tasks/hr. The prayer reduction is felt most at protection-prayer-dependent bosses like GWD and Nightmare, but with league-boosted gear and Minion's DPS, kill times are fast enough to minimize prayer drain. Avoids Berserker's Oath (T3) because losing protection prayers entirely is too risky for raid content (ToB, CoX).",
      },
      {
        name: "Aggressive Pacts",
        description:
          "[SPECULATIVE - Pact details are secret until league launch.] Maximum pact stacking for the highest possible bonuses at extreme cost. This profile is only viable for highly skilled players who can execute flawless mechanics without protection prayers and while taking increased damage.",
        riskLevel: "aggressive",
        pacts: ["Melee Might", "Glass Cannon", "Berserker's Oath"],
        reasoning:
          "[SPECULATIVE] All three pact tiers stacked: Melee Might (T1) for accuracy/damage, Glass Cannon (T2) for significantly increased damage output across all styles, and Berserker's Oath (T3) for major attack speed and damage boost. The combined penalties are severe: reduced non-melee effectiveness, increased damage taken, and no protection prayers. This turns every boss encounter into a DPS race where you must kill before being killed. With Minion's sustained DPS, Vampiric Touch's lifesteal would have been preferable but Glass Cannon's raw output ceiling is higher. This profile likely produces 20-30% faster kill times than Balanced but with a 3-5x death rate. Only viable at bosses with predictable mechanics (Hydra, Zulrah, Vorkath) where prayer flicking isn't required. Extremely risky at ToB and CoX where protection prayers are near-mandatory for certain phases.",
      },
    ],
    comboAnalysis: [
      {
        combo: ["Melee Might", "Vampiric Touch"],
        synergy:
          "[SPECULATIVE] Melee damage boost + lifesteal creates a self-sustaining melee DPS loop. Higher hits from Melee Might mean more HP healed per hit from Vampiric Touch. This combination is especially strong at bosses where you are constantly dealing damage (Slayer monsters, Barrows, Hydra) and weaker at bosses with long invulnerability phases (Olm, Verzik P1).",
        risk: "Moderate. Reduced prayer effectiveness means slower Prayer drain management and less effective Protect prayers. Protection prayers still work, just reduced, so you can still pray against dangerous mechanics. Main danger is extended trips where prayer runs low faster than expected.",
        reward: "Estimated 15-25% longer boss trips from lifesteal sustain, translating to roughly 10-15% more kills/hr. Over 480 hours of league play, this compounds to thousands of extra kills and dozens of additional task completions.",
      },
      {
        combo: ["Melee Might", "Glass Cannon"],
        synergy:
          "[SPECULATIVE] Pure damage stacking: Melee Might's accuracy/damage plus Glass Cannon's significant output boost across all styles. This maximizes DPS ceiling for speed-kill tasks (sub-X time completions) which are common elite/master tasks. The 'all styles' clause on Glass Cannon means Ranged and Magic still benefit despite Melee Might's off-style penalty, creating a net positive for hybrid bosses like Zulrah.",
        risk: "High. Increased damage taken from Glass Cannon means every boss hit hurts more. Without lifesteal (Vampiric Touch), food consumption spikes. Shorter trips, more banking, more deaths at punishing bosses. Protection prayers still available but you take more when they fail (e.g., Jad/Zuk mechanics, ToB special attacks).",
        reward: "Estimated 20-30% DPS increase over no-pact baseline. Speed-kill master tasks become achievable earlier in the league. Higher burst damage with spec weapons (Dragon Claws, etc.) for boss finishes.",
      },
      {
        combo: ["Melee Might", "Glass Cannon", "Berserker's Oath"],
        synergy:
          "[SPECULATIVE] Maximum offensive stacking. Melee damage, universal damage boost, and major attack speed/damage increase. Attack speed increase from Berserker's Oath is the standout: turning a 4-tick whip into potentially a 3 or 2-tick weapon would be a massive DPS multiplier. Combined with Glass Cannon's output boost, theoretical DPS approaches 2x baseline.",
        risk: "Extreme. No protection prayers (Berserker's Oath) plus increased damage taken (Glass Cannon) means you will die frequently at any boss with unavoidable damage. ToB Verzik, CoX Olm, and Nightmare become extremely dangerous. Jad/Zuk are likely impossible without prayer flicking alternatives. Death costs in time (travel, resupply) may negate the DPS gains. Only viable at bosses with safe spots or completely predictable damage (Hydra, DKs, Barrows).",
        reward: "Theoretical 50-80% DPS increase over baseline. If boss kill times drop below death-risk thresholds, this produces the fastest task completions in the league. Highest ceiling for leaderboard position but highest floor for required player skill.",
      },
      {
        combo: ["Ranged Fury", "Vampiric Touch"],
        synergy:
          "[SPECULATIVE] Alternative to Melee Might for players focusing on ranged bosses. Ranged is the safest combat style (safe-spotting, kiting) and Vampiric Touch provides sustain for extended trips. Strong at Zulrah (ranged phase), Vorkath (if Fremennik picked), Hydra (ranged meta), and CoX Olm head phase. The off-style melee penalty matters less if your build is ranged-primary.",
        risk: "Moderate. Same prayer reduction as Melee Might + Vampiric Touch combo. Ranged is naturally safer due to distance, so the practical risk is lower than melee equivalents. Main concern is reduced melee effectiveness for bosses that require melee switches (ToB Nylocas, CoX melee hand).",
        reward: "Similar 15-25% trip extension from lifesteal. Ranged DPS boost benefits the widest range of boss content since most bosses have a ranged-viable strategy. Slightly lower ceiling than melee but significantly safer execution.",
      },
    ],
  },
};
