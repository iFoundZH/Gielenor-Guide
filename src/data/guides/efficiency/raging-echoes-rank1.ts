import type { EfficiencyGuide } from "@/types/efficiency-guide";

export const ragingEchoesRank1Guide: EfficiencyGuide = {
  leagueId: "raging-echoes",
  leagueName: "Raging Echoes League",
  summary: {
    targetPoints: 60000,
    optimalRegions: ["Morytania", "Kourend", "Kandarin"],
    keyInsight:
      "Dragon tier (60,000 pts) is achievable in ~500 hours across 56 days by stacking region-specific task density with relic synergies. Morytania + Kourend + Kandarin yields ~430 region-locked tasks on top of ~400 general tasks, giving you access to 830+ completable tasks worth over 80,000 potential points. The real accelerant is pairing Animal Wrangler (T1) with Dodgy Deals (T2) for instant early Fishing/Hunter/Thieving XP, then layering Slayer Master (T5) and Total Recall (T6) for bossing efficiency once you hit mid-game. Region order matters: Morytania first at 90 tasks gives immediate Barrows access for equipment and echo boss, Kourend second at 200 tasks opens CoX and the largest task pool, and Kandarin third at 400 tasks fills skilling gaps with Zulrah, Seers' agility, and Catherby fishing.",
  },

  regionAnalysis: [
    {
      regionId: "morytania",
      regionName: "Morytania",
      tier: "S",
      totalTasks: 130,
      totalPoints: 11400,
      tasksByDifficulty: { easy: 15, medium: 35, hard: 40, elite: 30, master: 10 },
      estimatedPtsPerHour: 220,
      uniqueBosses: [
        "Theatre of Blood (ToB)",
        "Nightmare / Phosani's Nightmare",
        "Barrows",
        "Grotesque Guardians",
        "Bryophyta (nearby Canifis cave)",
      ],
      reasoning:
        "Morytania is the single highest-value region in RE. Barrows is farmable within hours of unlocking for task completions and equipment upgrades. ToB provides a massive cluster of elite/master tasks once geared. Nightmare drops are boosted with 5x item rates. The Slayer Tower covers Gargoyles, Nechryael, Abyssal demons, and Grotesque Guardians for stacked Slayer tasks. Swamp is one of the densest task regions per hour invested. Echo Barrows is the most accessible echo boss in the game, farmable at mid-level gear with Total Recall for infinite supplies.",
    },
    {
      regionId: "kourend",
      regionName: "Kourend",
      tier: "S",
      totalTasks: 180,
      totalPoints: 14200,
      tasksByDifficulty: { easy: 25, medium: 55, hard: 50, elite: 40, master: 10 },
      estimatedPtsPerHour: 200,
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
        "Largest task pool of any single region by a wide margin. Kourend has unmatched skilling variety: Wintertodt for Firemaking, GOTR for Runecrafting, Tithe Farm for Farming, and Blast Mine for Mining. CoX is the highest-value raid for elite/master task density and BiS drops. Hydra at 95 Slayer is a massive point farm with boosted drop rates. Skotizo via totem farming is basically free master tasks. The sheer breadth of content means you rarely stall on completable tasks.",
    },
    {
      regionId: "kandarin",
      regionName: "Kandarin",
      tier: "A",
      totalTasks: 120,
      totalPoints: 9600,
      tasksByDifficulty: { easy: 18, medium: 35, hard: 35, elite: 25, master: 7 },
      estimatedPtsPerHour: 180,
      uniqueBosses: [
        "Zulrah",
        "Demonic Gorillas",
        "Kraken",
        "Hespori",
      ],
      reasoning:
        "Kandarin rounds out the optimal trio by filling critical skilling gaps. Seers' Village rooftop agility is the best course until Prifddinas. Catherby has the highest-density fishing spots. Zulrah is a consistent point and GP farm with boosted uniques. Demonic Gorillas unlock zenyte jewelry tasks. The Farming Guild and Hespori provide passive task completions. Kandarin diary tasks are some of the most accessible in the game. Main drawback: fewer elite/master tasks than Morytania or Kourend.",
    },
    {
      regionId: "asgarnia",
      regionName: "Asgarnia",
      tier: "A",
      totalTasks: 100,
      totalPoints: 8800,
      tasksByDifficulty: { easy: 12, medium: 28, hard: 28, elite: 24, master: 8 },
      estimatedPtsPerHour: 170,
      uniqueBosses: [
        "General Graardor (Bandos)",
        "Commander Zilyana (Saradomin)",
        "K'ril Tsutsaroth (Zamorak)",
        "Kree'arra (Armadyl)",
        "Nex",
        "Corporeal Beast",
      ],
      reasoning:
        "Asgarnia is the boss density king. GWD alone provides 5 bosses with stacking kill count tasks from easy through master. Corp offers sigil tasks. Warriors' Guild has defender tasks for quick medium/hard points. The downside is that GWD requires significant combat stats and gear before it becomes efficient, making it slower to ramp than Morytania's Barrows. Strong alternative if you plan to focus heavily on PvM over skilling.",
    },
    {
      regionId: "desert",
      regionName: "Desert",
      tier: "A",
      totalTasks: 100,
      totalPoints: 9000,
      tasksByDifficulty: { easy: 10, medium: 25, hard: 30, elite: 27, master: 8 },
      estimatedPtsPerHour: 160,
      uniqueBosses: [
        "Tombs of Amascut (ToA)",
        "Kalphite Queen",
        "Phantom Muspah (DT2 boss access)",
      ],
      reasoning:
        "ToA is the most scalable raid with invocation levels creating a ladder of tasks from medium through master. Pyramid Plunder is excellent Thieving XP alongside Dodgy Deals. The Desert has solid diary tasks. Main issue: content is concentrated around ToA at high levels, so early-game points are thin. KQ tasks require significant setup. Best as a third region if you want raid variety over skilling breadth.",
    },
    {
      regionId: "fremennik",
      regionName: "Fremennik",
      tier: "B",
      totalTasks: 90,
      totalPoints: 7800,
      tasksByDifficulty: { easy: 10, medium: 25, hard: 25, elite: 22, master: 8 },
      estimatedPtsPerHour: 150,
      uniqueBosses: [
        "Vorkath",
        "Dagannoth Kings",
        "Phantom Muspah",
      ],
      reasoning:
        "Vorkath is one of the best GP/hr bosses with stacking KC tasks, and DKs provide ring tasks. Phantom Muspah is accessible and has good task density. The Fremennik Isles quest chain unlocks several task clusters. However, the region lacks skilling breadth compared to Kandarin or Kourend, and Vorkath requires Dragon Slayer II completion which is time-intensive. Lunar Isle spellbook access is nice but Grimoire (T7) makes it redundant.",
    },
    {
      regionId: "tirannwn",
      regionName: "Tirannwn",
      tier: "B",
      totalTasks: 70,
      totalPoints: 6800,
      tasksByDifficulty: { easy: 6, medium: 16, hard: 20, elite: 20, master: 8 },
      estimatedPtsPerHour: 140,
      uniqueBosses: [
        "The Gauntlet / Corrupted Gauntlet",
        "Zalcano",
        "Zulrah (shared with Kandarin)",
      ],
      reasoning:
        "Corrupted Gauntlet is arguably the single best boss in leagues with zero gear requirements and high elite/master task density. Zalcano is easy Mining/Smithing XP and tasks. Prifddinas agility course is the best in game. However, Song of the Elves is a massive quest gate and the region has the fewest total tasks of any choosable region. Elite-heavy distribution means points come late.",
    },
    {
      regionId: "wilderness",
      regionName: "Wilderness",
      tier: "C",
      totalTasks: 80,
      totalPoints: 6400,
      tasksByDifficulty: { easy: 12, medium: 22, hard: 22, elite: 18, master: 6 },
      estimatedPtsPerHour: 120,
      uniqueBosses: [
        "Callisto / Artio",
        "Vet'ion / Calvar'ion",
        "Venenatis / Spindel",
        "Chaos Elemental",
        "Scorpia",
        "King Black Dragon",
      ],
      reasoning:
        "Wilderness has decent boss variety but every boss is in multi-combat or deep Wilderness, making deaths likely and trips short. Revenant caves provide GP but few tasks. The PvP risk is largely eliminated in leagues (separate servers with small populations), but the travel time and inefficiency of Wilderness bossing makes it a poor pts/hr region. Chaos Altar for Prayer is partially obsoleted by Golden God (T4). Only pick this if going all-in on a PvM heavy strategy.",
    },
    {
      regionId: "varlamore",
      regionName: "Varlamore",
      tier: "C",
      totalTasks: 50,
      totalPoints: 4200,
      tasksByDifficulty: { easy: 6, medium: 14, hard: 14, elite: 12, master: 4 },
      estimatedPtsPerHour: 110,
      uniqueBosses: [
        "Fortis Colosseum",
        "Hueycoatl",
      ],
      reasoning:
        "Varlamore is the newest region with the smallest task pool. The Colosseum is a high-skill endgame arena that can produce master task completions, but requires near-maxed stats and late-game relics. Hueycoatl is a newer boss but has limited task density. The region simply lacks the content volume to compete with older regions. Only viable if Colosseum master tasks are your main target and you are already maxing other regions.",
    },
  ],

  optimalRegionPick: {
    primary: ["Morytania", "Kourend", "Kandarin"],
    alternative: ["Morytania", "Kourend", "Asgarnia"],
    mathJustification:
      "Primary pick (Morytania + Kourend + Kandarin) yields ~430 region-specific tasks worth ~35,200 points. Combined with ~400 general tasks (no region lock) worth ~18,000 points, you have access to ~830 tasks totaling ~53,200 points from tasks alone. With echo boss bonuses, diary completions, and milestone tasks, this exceeds Dragon tier (60,000) with margin. The alternative swapping Kandarin for Asgarnia trades ~20 completable tasks and skilling breadth for GWD boss density (5 additional bosses). This only makes sense if you can sustain 6+ hours/day of GWD grinding. For most players, the primary pick is strictly superior because skilling tasks are faster points/hr than boss KC tasks in the first 30 days.",
    unlockOrder: [
      "Morytania (90 tasks) - Barrows is immediately farmable with base 60 combat stats. Provides Barrows equipment for all three combat styles, Slayer Tower access for stacking tasks, and the most accessible echo boss. Prioritize this first because Barrows gear accelerates everything else.",
      "Kourend (200 tasks) - Opens the largest task pool. By 200 tasks you have T3-T4 relics making CoX accessible. Wintertodt and GOTR provide passive skilling tasks while you focus combat. Hydra becomes available once Slayer catches up.",
      "Kandarin (400 tasks) - By 400 tasks you have T5+ relics and the combat power to farm Zulrah and Demonic Gorillas. Seers' agility and Catherby fishing fill remaining skilling tasks. The third region is about task breadth to push from Rune to Dragon tier.",
    ],
  },

  relicPath: [
    {
      tier: 1,
      recommended: "Animal Wrangler",
      alternatives: ["Power Miner", "Lumberjack"],
      reasoning:
        "Animal Wrangler provides the Echo harpoon (crystal-tier, no requirements) with 50% chance on failed fish, auto-banking, 50% auto-cook, and 1-tick-faster fishing. Hunter traps never fail and chinchompa catches are doubled. You also never burn food. This is the fastest path to early tasks because Fishing and Hunter have the densest easy/medium task clusters (catch X fish, catch Y implings, cook Z food) and they all complete simultaneously. Shrimp to swordfish tasks chain naturally in Karamja and Lumbridge.",
      synergyNotes:
        "Pairs with Dodgy Deals (T2) for a skilling-first early game that can hit 750 points in under 3 hours. The auto-cook on fish means you complete Cooking tasks passively. Hunter traps never failing means Herbiboar and chinchompa tasks complete 2x faster than any other T1 choice.",
    },
    {
      tier: 2,
      recommended: "Dodgy Deals",
      alternatives: ["Friendly Forager", "Corner Cutter"],
      reasoning:
        "100% pickpocket success rate with AoE pickpocketing (11x11 area) and auto-repeat until you cannot. Noted loot means no banking. 3x coin pouch cap. This turns Thieving into the fastest skill in the league: Ardy Knights go from ~120k XP/hr to ~800k XP/hr effective rate. Every Thieving task from easy (pickpocket a man) through elite (99 Thieving) becomes trivially fast. The noted loot also solves GP problems for the entire league.",
      synergyNotes:
        "Dodgy Deals + Animal Wrangler covers Fishing, Hunter, Cooking, and Thieving within the first 4 hours. This is roughly 60-80 easy/medium tasks completed before you even touch combat, rocketing you to 1,500+ points for the T3 relic unlock. Friendly Forager is tempting for Herblore but you get Herblore XP passively from many other sources.",
    },
    {
      tier: 3,
      recommended: "Bank Heist",
      alternatives: ["Fairy's Flight", "Clue Compass"],
      reasoning:
        "Instant teleport to any bank, deposit box, or bank chest from anywhere. This eliminates the single biggest time sink in OSRS: travel to and from banks. In leagues where you are grinding bosses for KC tasks, saving 30-60 seconds per trip across thousands of trips is worth dozens of hours. The briefcase also ignores Wilderness teleport restrictions.",
      synergyNotes:
        "Bank Heist + Animal Wrangler auto-banking creates a loop where you almost never manually visit a bank for skilling. For bossing, Bank Heist + Total Recall (T6) later creates the ultimate efficiency loop: recall to boss, bank via briefcase, recall back. Fairy's Flight is the main alternative if you value fairy ring access for Slayer travel, but Bank Heist is strictly better for rank 1 pushing because banking is more frequent than fairy ring usage.",
    },
    {
      tier: 4,
      recommended: "Golden God",
      alternatives: ["Equilibrium", "Reloaded"],
      reasoning:
        "Free High Alchemy with no rune cost, 15% more GP, 65% chance item is preserved, and auto-cast on stacks. This turns every drop into GP without stopping your grind. The auto-alch while moving/attacking means zero downtime. Prayer altar GP-for-XP trade provides free Prayer training. Noted shop purchases solve supply issues. Equilibrium is a strong alternative for XP speed, but Golden God solves GP and Prayer simultaneously which are both bottlenecks at this stage.",
      synergyNotes:
        "Golden God + Dodgy Deals = infinite GP. Pickpocketed noted items auto-alch while you continue thieving. The Prayer component means you never need to grind bones, saving 5-10 hours over the league. Combined with Bank Heist, your inventory efficiency for bossing approaches 100% because you alch drops in-place rather than banking them.",
    },
    {
      tier: 5,
      recommended: "Slayer Master",
      alternatives: ["Production Master", "Treasure Arbiter"],
      reasoning:
        "Always on task for ALL eligible slayer monsters. This means every monster you kill for any reason (bossing, questing, casual combat) counts as a Slayer task with boosted XP and points. Free task skips/blocks, free rune pouches and herb sacks. The 1,000-15,000 bonus XP per 100th unique kill adds up across hundreds of monster types. This relic turns Slayer from a deliberate grind into a passive system that accelerates everything else.",
      synergyNotes:
        "Slayer Master + Morytania (Slayer Tower) + Kourend (Hydra, Catacombs) creates the densest Slayer task ecosystem possible. Every boss you farm for KC tasks simultaneously generates Slayer XP and points. Combined with the T3 passive (5x Slayer points, 1/50 superior rate), you will hit 99 Slayer 30-40% faster than with any other T5. Production Master is strong but you already have 12x XP at this point so artisan speed matters less.",
    },
    {
      tier: 6,
      recommended: "Total Recall",
      alternatives: ["Banker's Note"],
      reasoning:
        "Save your exact position, HP, Prayer, and special attack energy, then teleport back at any time with stats restored. This is the single most powerful bossing relic in RE. Save outside a boss room at full stats, fight until supplies run low, Bank Heist to a bank, resupply, Total Recall back at full stats. This effectively removes travel time from all boss grinds and gives you free stat restoration.",
      synergyNotes:
        "Total Recall + Bank Heist is the defining combo for rank 1 bossing. Your kills/hr on every boss increases by 15-30% because you never waste time traveling. For CoX and ToB, save at the entrance, bank mid-raid if needed, recall back. For GWD (if Asgarnia), save inside the boss room to skip KC entirely on return trips. Banker's Note is the alternative for players who want field-noted drops, but Bank Heist already solves most banking needs.",
    },
    {
      tier: 7,
      recommended: "Grimoire",
      alternatives: ["Overgrown", "Pocket Kingdom"],
      reasoning:
        "Instant spellbook swap from anywhere plus Book of the Dead functionality. This gives simultaneous access to Standard (alch, teleports), Ancient (Ice Barrage for Slayer, blood spells for sustain), Lunar (NPC Contact, Vengeance, Heal Other), and Arceuus (thralls, resurrect) spellbooks. Thralls alone add ~10% DPS to all bossing. Ice Barrage AoE is mandatory for efficient Slayer tasks in Kourend Catacombs and Slayer Tower. The versatility is unmatched at this tier.",
      synergyNotes:
        "Grimoire + Slayer Master + Total Recall = the complete PvM package. Ice Barrage Slayer tasks in the Catacombs while always on-task, thralls for bosses, Vengeance for DPS, and Alch on Standard for drops. Overgrown is tempting for passive Farming tasks but at 16,000 points you should already be deep into bossing where Grimoire provides more points/hr. Pocket Kingdom (Miscellania) is too passive for competitive play.",
    },
    {
      tier: 8,
      recommended: "Specialist",
      alternatives: ["Guardian", "Last Stand"],
      reasoning:
        "All special attacks cost only 20% energy with +100% accuracy. Failed specs restore 10% energy. Kills restore 15% energy. This turns Dragon Claws (normally 50% spec) into a 20% spec with guaranteed accuracy, letting you fire 5 specs before needing a restore. For bossing, this is a 40-60% DPS increase on kill times. Guardian is a strong passive DPS option but Specialist's burst damage is superior for speedkilling bosses (which is what master tasks require: fast kill times).",
      synergyNotes:
        "Specialist + Total Recall (saved at full spec) + Grimoire (thralls + vengeance) creates the ultimate boss killing setup. Save at full spec/HP/prayer outside a boss, spec dump 5 times in rapid succession, use thralls and vengeance for additional DPS, Bank Heist when low, recall back at full spec again. This loop produces the fastest boss kill times in the league and is required for master task speed requirements (e.g., ToB sub-15, CoX sub-20).",
    },
  ],

  taskRouting: [
    {
      name: "Early Rush",
      pointRange: "0 - 4,000",
      strategy:
        "Sprint easy and medium tasks exclusively. Start in Lumbridge/Misthalin with basic skilling: catch shrimp, chop trees, mine copper, light fires. Chain Fishing/Hunter tasks with Animal Wrangler for maximum passive completions. Hit Dodgy Deals at 750 pts and pivot to mass pickpocketing in Lumbridge for 20+ Thieving tasks in under an hour. Complete all quest-free easy tasks before touching combat. At 90 tasks, unlock Morytania and immediately start Barrows for equipment + medium task completions. Target: first 48 hours of league.",
      tasksPerHour: 15,
      pointsPerHour: 300,
    },
    {
      name: "Mid Grind",
      pointRange: "4,000 - 20,000",
      strategy:
        "Shift focus to hard tasks and early bossing. With Barrows gear from Morytania, begin Slayer Tower grinding (Gargoyles, Nechryaels, Abyssal Demons). Unlock Kourend at 200 tasks and start CoX scouting for easy completions. Prioritize tasks with cascading unlocks: completing quests that unlock boss access, hitting Slayer milestones that open new monsters. Use Golden God (T4) to auto-alch all drops for GP and Prayer XP. Begin Wintertodt and GOTR for passive skilling tasks between boss trips. At Slayer Master (T5), every kill counts as on-task, dramatically accelerating the grind. Target: days 3-21.",
      tasksPerHour: 6,
      pointsPerHour: 200,
    },
    {
      name: "Late Push",
      pointRange: "20,000 - 60,000",
      strategy:
        "Elite and master tasks dominate this phase. With Total Recall (T6) and Grimoire (T7), your bossing efficiency peaks. Farm CoX, ToB, and Hydra for elite task completions (KC milestones, unique drops, speed kills). Unlock Kandarin at 400 tasks for Zulrah and remaining skilling tasks. At Specialist (T8), spec-dump bosses for master task speed requirements. Mop up remaining diary tasks, combat achievement crossovers, and collection log fills. Echo bosses become a priority for mastery points and unique tasks. Final 10,000 points come from grinding the long tail of elite/master tasks. Target: days 21-56.",
      tasksPerHour: 3,
      pointsPerHour: 120,
    },
  ],

  dailyMilestones: [
    {
      day: 1,
      targetPoints: 2000,
      targetTier: "Bronze",
      keyActivities: [
        "Complete all Lumbridge/Misthalin easy tasks (skilling, basic quests)",
        "Unlock Animal Wrangler - chain Fishing/Hunter/Cooking tasks in Karamja",
        "Hit 750 pts, unlock Dodgy Deals, mass pickpocket in Lumbridge/Ardougne",
        "Reach 90 tasks completed, unlock Morytania",
        "Begin Barrows runs for gear and medium task completions",
      ],
    },
    {
      day: 3,
      targetPoints: 4000,
      targetTier: "Iron",
      keyActivities: [
        "Full Barrows set acquired, Slayer Tower grinding begins",
        "Unlock Bank Heist (T3) at 1,500 pts for instant banking",
        "Clear remaining medium tasks in Misthalin and Morytania",
        "Start quest chains: Priest in Peril done, Morytania quests progressing",
        "First hard tasks from Barrows KC and Slayer milestones",
      ],
    },
    {
      day: 7,
      targetPoints: 8000,
      targetTier: "Steel (approaching)",
      keyActivities: [
        "Unlock Golden God (T4) at 2,500 pts - auto-alch everything",
        "Combat stats approaching 80+ from Slayer grind",
        "Complete Morytania diary tasks (easy/medium/hard)",
        "Begin Nightmare attempts for hard/elite tasks",
        "Approaching 200 tasks for second region unlock",
      ],
    },
    {
      day: 14,
      targetPoints: 16000,
      targetTier: "Mithril (approaching)",
      keyActivities: [
        "Unlock Kourend at 200 tasks",
        "Slayer Master (T5) unlocked at 5,000 pts - always on task",
        "Begin CoX learning/farming for raid tasks",
        "Start Wintertodt for 99 Firemaking tasks",
        "Total Recall (T6) unlocked at 8,000 pts - bossing efficiency peaks",
        "Hydra accessible if 95 Slayer (likely with 12x XP + always on task)",
      ],
    },
    {
      day: 21,
      targetPoints: 24000,
      targetTier: "Adamant (approaching)",
      keyActivities: [
        "Grimoire (T7) unlocked at 16,000 pts - all spellbooks available",
        "CoX completions stacking, elite raid tasks progressing",
        "ToB learning phase with Barrows/CoX gear",
        "Echo boss farming begins in Morytania",
        "Combat achievements crossover tasks accumulating",
        "GOTR and Tithe Farm for passive Runecrafting/Farming tasks",
      ],
    },
    {
      day: 28,
      targetPoints: 32000,
      targetTier: "Adamant",
      keyActivities: [
        "Specialist (T8) unlocked at 25,000 pts - spec dump bossing begins",
        "ToB completions for elite/master tasks",
        "Approaching 400 tasks for third region unlock",
        "Nightmare uniques starting to drop with boosted rates",
        "Multiple echo bosses defeated for mastery points",
      ],
    },
    {
      day: 35,
      targetPoints: 40000,
      targetTier: "Rune (approaching)",
      keyActivities: [
        "Unlock Kandarin at 400 tasks",
        "Zulrah farming for unique drop tasks and GP",
        "Demonic Gorilla tasks for zenyte completions",
        "Seers' Village agility for remaining Agility tasks",
        "Catherby fishing tasks with Animal Wrangler",
        "Begin master task attempts (CoX sub-times, ToB challenges)",
      ],
    },
    {
      day: 42,
      targetPoints: 48000,
      targetTier: "Rune",
      keyActivities: [
        "Hydra grind for unique drops (boosted rates)",
        "CoX challenge mode for master tasks",
        "All three echo bosses farmed regularly for mastery points",
        "Mop up remaining hard/elite diary tasks across all regions",
        "Collection log fills triggering bonus tasks",
        "Target specific master tasks with highest pts/hr",
      ],
    },
    {
      day: 49,
      targetPoints: 55000,
      targetTier: "Rune (pushing Dragon)",
      keyActivities: [
        "Focus on remaining elite/master tasks exclusively",
        "ToB hard mode attempts for master completions",
        "Speed-kill tasks with Specialist spec dumping",
        "Any remaining skilling 99s for associated tasks",
        "Combat achievement completions for bonus points",
        "Echo boss unique drops with extended grinding",
      ],
    },
    {
      day: 56,
      targetPoints: 60000,
      targetTier: "Dragon",
      keyActivities: [
        "Dragon tier achieved - all reward cosmetics unlocked",
        "Final master task pushes for leaderboard position",
        "Echo boss collection log completions",
        "Any remaining task mop-up for maximum league points",
        "Total playtime target: ~500 hours across 56 days (~9 hrs/day average)",
      ],
    },
  ],

  tierProjections: [
    {
      tierName: "Bronze",
      pointsRequired: 2000,
      estimatedHours: 8,
      estimatedDay: 1,
    },
    {
      tierName: "Iron",
      pointsRequired: 4000,
      estimatedHours: 18,
      estimatedDay: 3,
    },
    {
      tierName: "Steel",
      pointsRequired: 10000,
      estimatedHours: 50,
      estimatedDay: 7,
    },
    {
      tierName: "Mithril",
      pointsRequired: 20000,
      estimatedHours: 110,
      estimatedDay: 14,
    },
    {
      tierName: "Adamant",
      pointsRequired: 30000,
      estimatedHours: 180,
      estimatedDay: 24,
    },
    {
      tierName: "Rune",
      pointsRequired: 45000,
      estimatedHours: 320,
      estimatedDay: 40,
    },
    {
      tierName: "Dragon",
      pointsRequired: 60000,
      estimatedHours: 500,
      estimatedDay: 56,
    },
  ],

  masteryAllocation: {
    primaryStyle: "Melee",
    distribution: [
      {
        style: "Melee",
        points: 6,
        reasoning:
          "6 mastery points in Melee unlocks the tier 6 echo effect: 20% chance to generate echo hits that can chain up to 8 times. Combined with Specialist (T8) for 20% spec cost, Dragon Claws become a machine gun of echoing specs. Melee also benefits from the 50% attack speed reduction at tier 5, turning whip from 4-tick to 2-tick. This is the highest sustained DPS in the league and is required for master task speed requirements at ToB and CoX. Melee T4 healing (5% chance to heal 40% of damage) provides sustain that reduces supply consumption during extended boss grinds.",
      },
      {
        style: "Ranged",
        points: 3,
        reasoning:
          "3 points in Ranged unlocks the 80% attack rate (T3) which turns blowpipe and bowfa into rapid-fire weapons. The T1 minimum hit floor (30% of max) eliminates low hits, and T2 ramping damage (+5% per attack, up to +20%) rewards sustained DPS phases. Ranged is essential for safe-spotting bosses like Zulrah, Vorkath, and for CoX Olm head phase. 3 points is the sweet spot: enough for meaningful DPS improvement without over-investing away from Melee.",
      },
      {
        style: "Magic",
        points: 1,
        reasoning:
          "1 point in Magic unlocks the T1 effect: hits above 90% of max deal 50% bonus damage. This is sufficient for Ice Barrage Slayer tasks (the primary Magic use case) where you are AoE-ing groups and high rolls are frequent. Magic is primarily a utility style in RE (freezes, thralls via Grimoire, blood spells for sustain). Investing more than 1 point has diminishing returns because the T2 ramp-up effect (+5% per tick between attacks) is anti-synergistic with AoE barraging where you attack every tick. Save those points for Melee/Ranged.",
      },
    ],
  },

  echoBossStrategy: [
    {
      boss: "Echo Barrows Brothers",
      region: "Morytania",
      strategy:
        "Echo Barrows is the first echo boss most players should attempt. Accessed via echo orbs dropped from regular Barrows runs (roughly 1 in 15 chests). The echo variant features all six brothers simultaneously with enhanced mechanics: Dharok hits harder, Karil has AoE attacks, Verac always hits through prayer. Strategy: prioritize killing Karil and Ahrim first (highest DPS threats), then Dharok (melee pray flick), then clean up the rest. With Total Recall, save at full stats outside the crypt. Use Ice Barrage from Grimoire to freeze brothers and spec dump with Specialist. Specialist's 20% spec cost means 5 Dragon Claws specs per fight, which is enough to burst down 2-3 brothers before they can stack damage. Bank Heist when supplies drop, recall back at full stats for the next attempt. Drops include echo-enhanced Barrows equipment with boosted stats for league use.",
      kph: 8,
    },
    {
      boss: "Echo Chambers (CoX Echo)",
      region: "Kourend",
      strategy:
        "Echo Chambers is the echo variant of Chambers of Xeric, accessed via echo orbs from regular CoX completions (roughly 1 in 10 completions). This is a solo-scaled enhanced raid with buffed room mechanics: Olm has faster phase transitions, Tekton hits harder and enrages faster, Vasa heals more aggressively. The key is maximizing DPS uptime with Specialist spec dumps on Olm. Use Grimoire for thralls during the entire raid (Book of the Dead effect), swap to Ancient for Ice Barrage on Shamans room, and Lunar for Vengeance on Olm. Total Recall save point outside the raid entrance; if you die, recall back with full supplies instead of restarting. Melee mastery echo hits can chain during Olm melee hand phase, producing insane burst. Target sub-25 minute solos once geared. Drops include echo-enhanced CoX uniques.",
      kph: 2,
    },
    {
      boss: "Echo Kraken",
      region: "Kandarin",
      strategy:
        "Echo Kraken is the Kandarin echo boss, accessed via echo orbs from regular Kraken kills (roughly 1 in 25 kills, improved with boosted drop rates). The echo variant has increased Magic defence, an AoE whirlpool attack, and tentacles that must be killed in a specific order or they regenerate. Strategy: use Ranged mastery (3 points) with a bowfa or blowpipe for consistent DPS against its higher Magic defence. The T1 Ranged minimum hit floor ensures no wasted ticks. Spec dump with Dragon Claws via Specialist when tentacles are down for the burst phase. Grimoire thralls add ~10% extra DPS passively. This is the easiest echo boss of the three optimal regions, making it a good entry point for echo boss mastery point farming. Drops include echo-enhanced trident variants.",
      kph: 12,
    },
  ],
};
