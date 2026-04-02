import type { EfficiencyGuide } from "@/types/efficiency-guide";

export const ragingEchoesRank1Guide: EfficiencyGuide = {
  leagueId: "raging-echoes",
  leagueName: "Raging Echoes League",
  summary: {
    targetPoints: 60000,
    optimalRegions: ["Morytania", "Kourend", "Kandarin"],
    keyInsight:
      "Dragon tier (60,000 pts) is achievable by stacking region-specific task density with relic synergies. Morytania + Kourend + Kandarin yields approximately 323 region-locked tasks on top of 488 general tasks, giving you access to around 811 completable tasks. The real accelerant is pairing Animal Wrangler (T1) with Dodgy Deals (T2) for rapid early Fishing/Hunter/Thieving XP, then layering Slayer Master (T5) and Total Recall (T6) for bossing efficiency once you hit mid-game. Region order matters: Morytania first at 90 tasks gives immediate Barrows access for equipment, Kourend second at 200 tasks opens CoX and a large task pool, and Kandarin third at 400 tasks fills skilling gaps with Zulrah and Catherby fishing.",
  },

  regionAnalysis: [
    {
      regionId: "morytania",
      regionName: "Morytania",
      tier: "S",
      totalTasks: 101,
      totalPoints: 10200,
      tasksByDifficulty: { easy: 7, medium: 35, hard: 31, elite: 23, master: 5 },
      uniqueBosses: [
        "Theatre of Blood (ToB)",
        "Nightmare / Phosani's Nightmare",
        "Barrows",
        "Grotesque Guardians",
      ],
      reasoning:
        "Morytania is the single highest-value region in RE. Barrows is farmable within hours of unlocking for task completions and equipment upgrades. ToB provides a massive cluster of elite/master tasks once geared. Nightmare drops benefit from boosted item rates. The Slayer Tower covers Gargoyles, Nechryael, Abyssal demons, and Grotesque Guardians for stacked Slayer tasks. Echo Nightmare provides mastery points and unique echo boss tasks.",
    },
    {
      regionId: "kourend",
      regionName: "Kourend",
      tier: "S",
      totalTasks: 119,
      totalPoints: 10020,
      tasksByDifficulty: { easy: 15, medium: 41, hard: 38, elite: 22, master: 3 },
      uniqueBosses: [
        "Chambers of Xeric (CoX)",
        "Alchemical Hydra",
        "Skotizo",
        "Sarachnis",
        "Wintertodt",
        "Guardians of the Rift (GOTR)",
      ],
      reasoning:
        "Largest task pool of any single region. Kourend has unmatched skilling variety: Wintertodt for Firemaking, GOTR for Runecrafting, Tithe Farm for Farming, and Blast Mine for Mining. CoX is a high-value raid for elite/master task density and BiS drops. Hydra at 95 Slayer is a strong point farm with boosted drop rates. Skotizo via totem farming provides accessible master tasks. The sheer breadth of content means you rarely stall on completable tasks.",
    },
    {
      regionId: "kandarin",
      regionName: "Kandarin",
      tier: "A",
      totalTasks: 103,
      totalPoints: 8840,
      tasksByDifficulty: { easy: 13, medium: 37, hard: 30, elite: 20, master: 3 },
      uniqueBosses: [
        "Zulrah",
        "Kraken",
        "Thermonuclear Smoke Devil",
      ],
      reasoning:
        "Kandarin rounds out the optimal trio by filling critical skilling gaps. Seers' Village rooftop agility is a strong course until Prifddinas. Catherby has high-density fishing spots. Zulrah is a consistent point and GP farm with boosted uniques. Demonic Gorillas unlock zenyte jewelry tasks. Kandarin diary tasks are among the most accessible in the game. Main drawback: fewer elite/master tasks than Morytania or Kourend.",
    },
    {
      regionId: "asgarnia",
      regionName: "Asgarnia",
      tier: "A",
      totalTasks: 95,
      totalPoints: 9040,
      tasksByDifficulty: { easy: 8, medium: 32, hard: 30, elite: 22, master: 3 },
      uniqueBosses: [
        "General Graardor (Bandos)",
        "Commander Zilyana (Saradomin)",
        "K'ril Tsutsaroth (Zamorak)",
        "Kree'arra (Armadyl)",
        "Nex",
        "Cerberus",
      ],
      reasoning:
        "Asgarnia is the boss density king. GWD alone provides 5 bosses with stacking kill count tasks from easy through master. Corp offers sigil tasks. Warriors' Guild has defender tasks for quick medium/hard points. The downside is that GWD requires significant combat stats and gear before it becomes efficient, making it slower to ramp than Morytania's Barrows. Strong alternative if you plan to focus heavily on PvM over skilling.",
    },
    {
      regionId: "desert",
      regionName: "Desert",
      tier: "A",
      totalTasks: 112,
      totalPoints: 9840,
      tasksByDifficulty: { easy: 15, medium: 39, hard: 34, elite: 19, master: 5 },
      uniqueBosses: [
        "Tombs of Amascut (ToA)",
        "Kalphite Queen",
        "The Leviathan (DT2)",
      ],
      reasoning:
        "ToA is the most scalable raid with invocation levels creating a ladder of tasks from medium through master. Pyramid Plunder is excellent Thieving XP alongside Dodgy Deals. The Desert has solid diary tasks. Main issue: content is concentrated around ToA at high levels, so early-game points are thin. KQ tasks require significant setup. Best as a third region if you want raid variety over skilling breadth.",
    },
    {
      regionId: "fremennik",
      regionName: "Fremennik",
      tier: "B",
      totalTasks: 112,
      totalPoints: 9780,
      tasksByDifficulty: { easy: 14, medium: 32, hard: 41, elite: 23, master: 2 },
      uniqueBosses: [
        "Vorkath",
        "Duke Sucellus (DT2)",
        "Dagannoth Kings",
        "Phantom Muspah",
      ],
      reasoning:
        "Vorkath is one of the best GP bosses with stacking KC tasks, and DKs provide ring tasks. Phantom Muspah is accessible and has good task density. The Fremennik Isles quest chain unlocks several task clusters. However, the region lacks skilling breadth compared to Kandarin or Kourend, and Vorkath requires Dragon Slayer II completion which is time-intensive. Lunar Isle spellbook access is nice but Grimoire (T7) makes it redundant.",
    },
    {
      regionId: "tirannwn",
      regionName: "Tirannwn",
      tier: "B",
      totalTasks: 85,
      totalPoints: 9600,
      tasksByDifficulty: { easy: 8, medium: 16, hard: 33, elite: 24, master: 4 },
      uniqueBosses: [
        "The Gauntlet / Corrupted Gauntlet",
        "Zalcano",
      ],
      reasoning:
        "Corrupted Gauntlet is arguably the single best boss in leagues with zero gear requirements and high elite/master task density. Zalcano is easy Mining/Smithing XP and tasks. Prifddinas agility course is among the best in game. However, Song of the Elves is a massive quest gate and the region has the fewest total tasks of any choosable region. Elite-heavy distribution means points come late.",
    },
    {
      regionId: "wilderness",
      regionName: "Wilderness",
      tier: "C",
      totalTasks: 95,
      totalPoints: 9750,
      tasksByDifficulty: { easy: 9, medium: 26, hard: 31, elite: 26, master: 3 },
      uniqueBosses: [
        "Callisto / Artio",
        "Vet'ion / Calvar'ion",
        "Venenatis / Spindel",
        "Chaos Elemental",
        "Scorpia",
        "King Black Dragon",
      ],
      reasoning:
        "Wilderness has decent boss variety but every boss is in multi-combat or deep Wilderness, making deaths likely and trips short. Revenant caves provide GP but few tasks. The PvP risk is largely eliminated in leagues (separate servers with small populations), but the travel time and inefficiency of Wilderness bossing makes it a weaker region for points. Chaos Altar for Prayer is partially obsoleted by Golden God (T4). Only pick this if going all-in on a PvM heavy strategy.",
    },
    {
      regionId: "varlamore",
      regionName: "Varlamore",
      tier: "C",
      totalTasks: 111,
      totalPoints: 9440,
      tasksByDifficulty: { easy: 12, medium: 40, hard: 39, elite: 15, master: 5 },
      uniqueBosses: [
        "Fortis Colosseum (Sol Heredit)",
        "Hueycoatl",
        "Vardorvis (DT2)",
        "Moons of Peril",
      ],
      reasoning:
        "Varlamore is the newest region with a smaller task pool. The Colosseum is a high-skill endgame arena that can produce master task completions, but requires near-maxed stats and late-game relics. Hueycoatl is a newer boss but has limited task density. The region lacks the content volume to compete with older regions. Only viable if Colosseum master tasks are your main target and you are already maxing other regions.",
    },
  ],

  optimalRegionPick: {
    primary: ["Morytania", "Kourend", "Kandarin"],
    alternative: ["Morytania", "Kourend", "Asgarnia"],
    mathJustification:
      "Primary pick (Morytania + Kourend + Kandarin) yields approximately 323 region-specific tasks worth around 29,060 points. Combined with roughly 488 general tasks (no region lock), you have access to around 811 tasks — comfortably above Dragon tier (60,000) when factoring in all available points. The alternative swapping Kandarin for Asgarnia trades some tasks but gains GWD boss density (5 additional bosses). This only makes sense if you can sustain heavy GWD grinding. For most players, the primary pick is superior because skilling tasks are generally faster to complete than boss KC tasks in the early-to-mid game.",
    unlockOrder: [
      "Morytania (90 tasks) - Barrows is immediately farmable with base 60 combat stats. Provides Barrows equipment for all three combat styles, Slayer Tower access for stacking tasks, and echo boss access. Prioritize this first because Barrows gear accelerates everything else.",
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
        "Animal Wrangler enhances Fishing and Hunter with auto-banking and success rate boosts. Hunter traps never fail and chinchompa catches are doubled. You also never burn food. This is the fastest path to early tasks because Fishing and Hunter have the densest easy/medium task clusters (catch X fish, catch Y implings, cook Z food) and they all complete simultaneously. Shrimp to swordfish tasks chain naturally in Karamja and Lumbridge.",
      synergyNotes:
        "Pairs with Dodgy Deals (T2) for a skilling-first early game that rapidly accumulates points. The auto-cook on fish means you complete Cooking tasks passively. Hunter traps never failing means Herbiboar and chinchompa tasks complete much faster than with any other T1 choice.",
    },
    {
      tier: 2,
      recommended: "Dodgy Deals",
      alternatives: ["Friendly Forager", "Corner Cutter"],
      reasoning:
        "Greatly enhanced pickpocketing with noted loot and AoE. 100% pickpocket success rate with auto-repeat until you cannot. Noted loot means no banking. This turns Thieving into one of the fastest skills in the league. Every Thieving task from easy (pickpocket a man) through elite (99 Thieving) becomes trivially fast. The noted loot also solves GP problems for the entire league.",
      synergyNotes:
        "Dodgy Deals + Animal Wrangler covers Fishing, Hunter, Cooking, and Thieving rapidly in the early game, completing a large number of easy/medium tasks before you need to engage with combat. Friendly Forager is tempting for Herblore but you get Herblore XP passively from many other sources.",
    },
    {
      tier: 3,
      recommended: "Bank Heist",
      alternatives: ["Fairy's Flight", "Clue Compass"],
      reasoning:
        "Instant teleport to any bank, deposit box, or bank chest from anywhere. This eliminates the single biggest time sink in OSRS: travel to and from banks. In leagues where you are grinding bosses for KC tasks, saving time on every trip across thousands of trips adds up enormously.",
      synergyNotes:
        "Bank Heist + Animal Wrangler auto-banking creates a loop where you almost never manually visit a bank for skilling. For bossing, Bank Heist + Total Recall (T6) later creates the ultimate efficiency loop: recall to boss, bank via briefcase, recall back. Fairy's Flight is the main alternative if you value fairy ring access for Slayer travel, but Bank Heist is strictly better for rank 1 pushing because banking is more frequent than fairy ring usage.",
    },
    {
      tier: 4,
      recommended: "Golden God",
      alternatives: ["Equilibrium", "Reloaded"],
      reasoning:
        "Free High Alchemy with no rune cost, item preservation, and auto-cast on stacks. This turns every drop into GP without stopping your grind. The auto-alch while moving/attacking means zero downtime. Prayer altar GP-for-XP trade provides free Prayer training. Noted shop purchases solve supply issues. Equilibrium is a strong alternative for XP speed, but Golden God solves GP and Prayer simultaneously which are both bottlenecks at this stage.",
      synergyNotes:
        "Golden God + Dodgy Deals = infinite GP. Pickpocketed noted items auto-alch while you continue thieving. The Prayer component means you can bypass traditional bone grinding entirely. Combined with Bank Heist, your inventory efficiency for bossing is excellent because you alch drops in-place rather than banking them.",
    },
    {
      tier: 5,
      recommended: "Slayer Master",
      alternatives: ["Production Master", "Treasure Arbiter"],
      reasoning:
        "Always on task for ALL eligible slayer monsters. This means every monster you kill for any reason (bossing, questing, casual combat) counts as a Slayer task with boosted XP and points. Free task skips/blocks, free rune pouches and herb sacks. This relic turns Slayer from a deliberate grind into a passive system that accelerates everything else.",
      synergyNotes:
        "Slayer Master + Morytania (Slayer Tower) + Kourend (Hydra, Catacombs) creates the densest Slayer task ecosystem possible. Every boss you farm for KC tasks simultaneously generates Slayer XP and points. Production Master is strong but you already have high XP multipliers at this point so artisan speed matters less.",
    },
    {
      tier: 6,
      recommended: "Total Recall",
      alternatives: ["Banker's Note"],
      reasoning:
        "Save your exact position, HP, Prayer, and special attack energy, then teleport back at any time with stats restored. This is the single most powerful bossing relic in RE. Save outside a boss room at full stats, fight until supplies run low, Bank Heist to a bank, resupply, Total Recall back at full stats. This effectively removes travel time from all boss grinds and gives you free stat restoration.",
      synergyNotes:
        "Total Recall + Bank Heist is the defining combo for rank 1 bossing. Your kills per hour on every boss increases significantly because you never waste time traveling. For CoX and ToB, save at the entrance, bank mid-raid if needed, recall back. For GWD (if Asgarnia), save inside the boss room to skip KC entirely on return trips. Banker's Note is the alternative for players who want field-noted drops, but Bank Heist already solves most banking needs.",
    },
    {
      tier: 7,
      recommended: "Grimoire",
      alternatives: ["Overgrown", "Pocket Kingdom"],
      reasoning:
        "Instant spellbook swap from anywhere plus Book of the Dead functionality. This gives simultaneous access to Standard (alch, teleports), Ancient (Ice Barrage for Slayer, blood spells for sustain), Lunar (NPC Contact, Vengeance, Heal Other), and Arceuus (thralls, resurrect) spellbooks. Thralls add meaningful DPS to all bossing. Ice Barrage AoE is strong for efficient Slayer tasks in Kourend Catacombs and Slayer Tower. The versatility is unmatched at this tier.",
      synergyNotes:
        "Grimoire + Slayer Master + Total Recall = the complete PvM package. Ice Barrage Slayer tasks in the Catacombs while always on-task, thralls for bosses, Vengeance for DPS, and Alch on Standard for drops. Overgrown is tempting for passive Farming tasks but at 16,000 points you should already be deep into bossing where Grimoire provides stronger returns. Pocket Kingdom (Miscellania) is too passive for competitive play.",
    },
    {
      tier: 8,
      recommended: "Specialist",
      alternatives: ["Guardian", "Last Stand"],
      reasoning:
        "Greatly reduced special attack costs with boosted accuracy. Failed specs restore energy, and kills restore energy. This turns powerful spec weapons like Dragon Claws into repeatable burst damage tools. For bossing, this is a massive DPS increase on kill times. Guardian is a strong passive DPS option but Specialist's burst damage is superior for speedkilling bosses, which is what master tasks often require.",
      synergyNotes:
        "Specialist + Total Recall (saved at full spec) + Grimoire (thralls + vengeance) creates the ultimate boss killing setup. Save at full spec/HP/prayer outside a boss, spec dump rapidly, use thralls and vengeance for additional DPS, Bank Heist when low, recall back at full spec again. This loop produces the fastest boss kill times in the league and is essential for master task speed requirements.",
    },
  ],

  taskRouting: [
    {
      name: "Early Rush",
      pointRange: "0 - 4,000",
      strategy:
        "Sprint easy and medium tasks exclusively. Start in Lumbridge/Misthalin with basic skilling: catch shrimp, chop trees, mine copper, light fires. Chain Fishing/Hunter tasks with Animal Wrangler for maximum passive completions. After unlocking Dodgy Deals, pivot to mass pickpocketing in Lumbridge for rapid Thieving task completions. Complete all quest-free easy tasks before touching combat. At 90 tasks, unlock Morytania and immediately start Barrows for equipment and medium task completions.",
    },
    {
      name: "Mid Grind",
      pointRange: "4,000 - 20,000",
      strategy:
        "Shift focus to hard tasks and early bossing. With Barrows gear from Morytania, begin Slayer Tower grinding (Gargoyles, Nechryaels, Abyssal Demons). Unlock Kourend at 200 tasks and start CoX scouting for easy completions. Prioritize tasks with cascading unlocks: completing quests that unlock boss access, hitting Slayer milestones that open new monsters. Use Golden God (T4) to auto-alch all drops for GP and Prayer XP. Begin Wintertodt and GOTR for passive skilling tasks between boss trips. At Slayer Master (T5), every kill counts as on-task, dramatically accelerating the grind.",
    },
    {
      name: "Late Push",
      pointRange: "20,000 - 60,000",
      strategy:
        "Elite and master tasks dominate this phase. With Total Recall (T6) and Grimoire (T7), your bossing efficiency peaks. Farm CoX, ToB, and Hydra for elite task completions (KC milestones, unique drops, speed kills). Unlock Kandarin at 400 tasks for Zulrah and remaining skilling tasks. At Specialist (T8), spec-dump bosses for master task speed requirements. Mop up remaining diary tasks, combat achievement crossovers, and collection log fills. Echo bosses become a priority for mastery points and unique tasks. Final push comes from grinding the long tail of elite/master tasks.",
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
        "Unlock Dodgy Deals, mass pickpocket in Lumbridge",
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
        "Combat stats progressing well from Slayer grind",
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
        "Hydra accessible if 95 Slayer reached (likely with high XP multiplier + always on task)",
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
        "Focus on highest-value remaining tasks",
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
      ],
    },
  ],

  tierProjections: [
    {
      tierName: "Bronze",
      pointsRequired: 2000,
    },
    {
      tierName: "Iron",
      pointsRequired: 4000,
    },
    {
      tierName: "Steel",
      pointsRequired: 10000,
    },
    {
      tierName: "Mithril",
      pointsRequired: 20000,
    },
    {
      tierName: "Adamant",
      pointsRequired: 30000,
    },
    {
      tierName: "Rune",
      pointsRequired: 45000,
    },
    {
      tierName: "Dragon",
      pointsRequired: 60000,
    },
  ],

  masteryAllocation: {
    primaryStyle: "Melee",
    distribution: [
      {
        style: "Melee",
        points: 6,
        reasoning:
          "Melee provides the strongest sustained DPS for bossing content. Investing heavily unlocks the highest mastery tiers, maximizing damage output for the boss-heavy late game. Melee is the primary style for ToB, CoX melee hand, and most Slayer tasks. The healing and damage bonuses from higher mastery tiers reduce supply consumption during extended boss grinds and are essential for master task speed requirements.",
      },
      {
        style: "Ranged",
        points: 3,
        reasoning:
          "3 points in Ranged provides meaningful improvements to attack speed and damage consistency for blowpipe and bowfa. Ranged is essential for safe-spotting bosses like Zulrah, Vorkath, and for CoX Olm head phase. 3 points is the sweet spot: enough for a strong DPS improvement without over-investing away from Melee.",
      },
      {
        style: "Magic",
        points: 1,
        reasoning:
          "1 point in Magic is sufficient for its primary use cases: Ice Barrage Slayer tasks where you are AoE-ing groups, and thralls via Grimoire. Magic is primarily a utility style in RE (freezes, thralls, blood spells for sustain). Investing more has diminishing returns because most DPS-heavy content favors Melee or Ranged. Save those points for the styles that carry boss encounters.",
      },
    ],
  },

  echoBossStrategy: [
    {
      boss: "Echo Nightmare",
      region: "Morytania",
      strategy:
        "Enhanced version of the Nightmare accessed via echo orbs. Prioritize early for mastery points once you have solid combat stats and gear from Barrows. Use your best available melee gear and relic synergies for efficient farming. With Total Recall, save at full stats near the boss, fight until supplies run low, Bank Heist to resupply, and recall back. Specialist spec dumps provide strong burst damage phases. This is likely the first echo boss you encounter given Morytania is the recommended first region unlock.",
    },
    {
      boss: "Echo Skotizo",
      region: "Kourend",
      strategy:
        "Enhanced version of Skotizo accessed via echo orbs. Skotizo is farmable through totem drops from Catacombs of Kourend and provides strong task completions. Use Total Recall to save at full stats and Bank Heist for quick resupply. Grimoire thralls add passive DPS throughout the fight. As a Kourend echo boss, this pairs naturally with the Catacombs Slayer grind that generates the totems needed for access.",
    },
    {
      boss: "Echo Hespori",
      region: "Kandarin",
      strategy:
        "Enhanced version of Hespori accessed via echo orbs. Hespori is accessible through the Farming Guild and provides a combat-meets-skilling echo boss experience. Use Total Recall to save at full stats and Grimoire for spellbook flexibility. Specialist provides burst damage during vulnerable phases. As the third region unlock, Echo Hespori is your late-game echo boss target for completing the three unique echo boss tasks.",
    },
  ],
};
