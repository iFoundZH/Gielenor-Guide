import { LeagueData } from "@/types/league";

export const ragingEchoesLeague: LeagueData = {
  id: "raging-echoes",
  name: "Raging Echoes League",
  leagueNumber: 5,
  description:
    "The 5th Old School RuneScape League. All areas are unlocked from the start with no region restrictions. Echo versions of bosses offer guaranteed uniques after kill count thresholds. Relics provide massive combat, skilling, and utility buffs across 8 tiers. League ran for 6 weeks.",
  startDate: "2024-11-27",
  endDate: "2025-01-08",
  wikiUrl: "https://oldschool.runescape.wiki/w/Raging_Echoes_League",
  lastSynced: "2026-03-28",
  baseXpMultiplier: 5,
  baseDropMultiplier: 2,
  maxRegions: 0,

  regions: [
    {
      id: "all-areas",
      name: "All Areas",
      description: "All regions are accessible from the start in Raging Echoes League.",
      type: "starting",
      keyContent: ["Full map access", "No region restrictions"],
    },
  ],

  relicTiers: [
    {
      tier: 1,
      passiveEffects: ["5x XP rates", "2x drop rates", "Stackable clue scrolls", "Infinite run energy"],
      relics: [
        {
          id: "re-t1-1",
          name: "Trickster",
          tier: 1,
          slot: 1,
          description: "Enhanced Thieving, Agility, and utility skills.",
          effects: [
            "Pickpocketing always succeeds",
            "All agility shortcuts unlocked regardless of level",
            "Double Thieving loot",
            "Run energy restores 5x faster",
          ],
        },
        {
          id: "re-t1-2",
          name: "Endless Harvest",
          tier: 1,
          slot: 1,
          description: "Gathering skills produce double resources that auto-bank.",
          effects: [
            "Double resources from Mining, Woodcutting, Fishing, Farming, Hunter",
            "Resources sent to bank automatically",
            "Gathering nodes don't deplete",
          ],
        },
        {
          id: "re-t1-3",
          name: "Production Prodigy",
          tier: 1,
          slot: 1,
          description: "Production skills are faster with material savings.",
          effects: [
            "All production actions are 2x faster",
            "25% chance to save primary materials",
            "Double XP from production skills",
          ],
        },
      ],
    },
    {
      tier: 2,
      passiveEffects: ["XP multiplier increased to 8x"],
      relics: [
        {
          id: "re-t2-1",
          name: "Banker's Note",
          tier: 2,
          slot: 2,
          description: "Use any item on a banker to note/unnote it for free.",
          effects: [
            "Note/unnote any item at any banker",
            "Works on all items including untradables",
            "Free and instant",
          ],
        },
        {
          id: "re-t2-2",
          name: "Fire Sale",
          tier: 2,
          slot: 2,
          description: "All shop prices reduced. Shops restock instantly.",
          effects: [
            "Shop prices reduced by 50%",
            "All shops restock instantly",
            "Sell items at full high alch value",
          ],
        },
        {
          id: "re-t2-3",
          name: "Fairy's Flight",
          tier: 2,
          slot: 2,
          description: "Access fairy ring and spirit tree networks from anywhere.",
          effects: [
            "Teleport to any fairy ring from anywhere (no staff needed)",
            "Teleport to any spirit tree from anywhere",
            "Combined fairy ring + spirit tree interface",
          ],
        },
      ],
    },
    {
      tier: 3,
      passiveEffects: ["1.5x combat XP (multiplicative)", "5x Slayer points"],
      relics: [
        {
          id: "re-t3-1",
          name: "Equilibrium",
          tier: 3,
          slot: 3,
          description: "Combat XP evenly distributed across all styles.",
          effects: [
            "All combat XP split evenly across Attack, Strength, Defence, Hitpoints, Ranged, and Magic",
            "15% bonus total combat XP",
          ],
        },
        {
          id: "re-t3-2",
          name: "Infernal Gathering",
          tier: 3,
          slot: 3,
          description: "Resources auto-process when gathered.",
          effects: [
            "Ores auto-smelt into bars",
            "Logs auto-burn or auto-fletch",
            "Fish auto-cook",
            "Full XP for both the gathering and processing skill",
          ],
        },
        {
          id: "re-t3-3",
          name: "Knife's Edge",
          tier: 3,
          slot: 3,
          description: "Massive damage boost but capped at 10 HP.",
          effects: [
            "3x damage multiplier on all attacks",
            "Hitpoints permanently capped at 10",
            "Prayer drain rate halved",
          ],
        },
      ],
    },
    {
      tier: 4,
      passiveEffects: ["Drop rate multiplier increased to 5x"],
      relics: [
        {
          id: "re-t4-1",
          name: "Clue Compass",
          tier: 4,
          slot: 4,
          description: "Massive clue scroll enhancements.",
          effects: [
            "10x clue scroll drop rate",
            "Clue caskets give double loot",
            "All clue steps are significantly easier",
          ],
        },
        {
          id: "re-t4-2",
          name: "Soul Stealer",
          tier: 4,
          slot: 4,
          description: "Kills restore prayer and auto-bank drops.",
          effects: [
            "Each kill restores 25% of max prayer",
            "15% chance to auto-bank drops",
            "Bonus Slayer XP on task",
          ],
        },
        {
          id: "re-t4-3",
          name: "Eternal Jewel",
          tier: 4,
          slot: 4,
          description: "All enchanted jewelry has infinite charges.",
          effects: [
            "Ring of dueling, games necklace, glory, etc. never run out",
            "Bonus teleport locations added to jewelry",
          ],
        },
      ],
    },
    {
      tier: 5,
      passiveEffects: ["XP multiplier increased to 12x"],
      relics: [
        {
          id: "re-t5-1",
          name: "Friendly Forager",
          tier: 5,
          slot: 5,
          description: "A pet forager follows you, gathering and processing.",
          effects: [
            "Pet companion gathers resources nearby",
            "Auto-processes and banks gathered items",
            "Works for Mining, Woodcutting, Fishing, and Farming",
          ],
        },
        {
          id: "re-t5-2",
          name: "Last Recall",
          tier: 5,
          slot: 5,
          description: "Return to your last location after teleporting.",
          effects: [
            "After teleporting, can return to previous location",
            "No cooldown",
            "Works with all teleport methods",
          ],
        },
        {
          id: "re-t5-3",
          name: "Globetrotter",
          tier: 5,
          slot: 5,
          description: "Unlimited teleports to visited locations.",
          effects: [
            "Right-click teleport to any previously visited location",
            "No items or runes required",
            "Organized by region",
          ],
        },
      ],
    },
    {
      tier: 6,
      passiveEffects: [],
      relics: [
        {
          id: "re-t6-1",
          name: "Weapon Specialist",
          tier: 6,
          slot: 6,
          description: "All weapons attack at extreme speed with infinite special attack.",
          effects: [
            "All weapons attack at 2-tick speed",
            "Special attack energy is infinite",
            "10% accuracy boost on all attacks",
          ],
        },
        {
          id: "re-t6-2",
          name: "Berserker",
          tier: 6,
          slot: 6,
          description: "Damage scales with missing hitpoints.",
          effects: [
            "Damage increases as HP decreases",
            "At 1 HP: up to 5x damage multiplier",
            "Works with all combat styles",
          ],
        },
        {
          id: "re-t6-3",
          name: "Ruinous Powers",
          tier: 6,
          slot: 6,
          description: "Access to a second prayer book with powerful offensive prayers.",
          effects: [
            "Unlock alternate prayer book with new prayers",
            "Offensive prayers significantly stronger",
            "Can switch prayer books without an altar",
          ],
        },
      ],
    },
    {
      tier: 7,
      passiveEffects: ["XP multiplier increased to 16x"],
      relics: [
        {
          id: "re-t7-1",
          name: "Echo Augmentation",
          tier: 7,
          slot: 7,
          description: "Echo bosses become significantly easier and more rewarding.",
          effects: [
            "Echo boss KC thresholds reduced by 50%",
            "Echo bosses drop double uniques",
            "Echo boss respawn timer halved",
          ],
        },
        {
          id: "re-t7-2",
          name: "Treasure Seeker",
          tier: 7,
          slot: 7,
          description: "Boss drop tables massively improved.",
          effects: [
            "3x unique drop rate from all bosses",
            "Guaranteed pet at specific KC milestones",
            "Double supply drops from bosses",
          ],
        },
        {
          id: "re-t7-3",
          name: "Pocket Crafter",
          tier: 7,
          slot: 7,
          description: "Craft items from your bank with no materials needed.",
          effects: [
            "All crafting/smithing uses bank resources automatically",
            "Can craft anywhere (no furnace/anvil needed)",
            "25% bonus XP from crafting skills",
          ],
        },
      ],
    },
    {
      tier: 8,
      passiveEffects: [],
      relics: [
        {
          id: "re-t8-1",
          name: "Riftwalker",
          tier: 8,
          slot: 8,
          description: "Open portals between any two locations permanently.",
          effects: [
            "Place permanent portals (up to 5) at any location",
            "Instant teleport between portal pairs",
            "Portals persist across sessions",
          ],
        },
        {
          id: "re-t8-2",
          name: "Absolute Unit",
          tier: 8,
          slot: 8,
          description: "Your character becomes enormous with massive stat boosts.",
          effects: [
            "Character model scaled up significantly",
            "+10 to all combat stats",
            "Melee attacks deal AoE damage in a 3x3 area",
            "All incoming damage reduced by 20%",
          ],
        },
        {
          id: "re-t8-3",
          name: "Dodgy Dealings",
          tier: 8,
          slot: 8,
          description: "Every NPC can be pickpocketed for their drop table.",
          effects: [
            "Pickpocket any NPC for items from their drop table",
            "Success rate scales with Thieving level",
            "Works on bosses and monsters",
            "Loot is doubled",
          ],
        },
      ],
    },
  ],

  // Raging Echoes had combat masteries, not pacts
  pacts: [
    {
      id: "re-mastery-melee",
      name: "Melee Mastery",
      tier: 1,
      category: "combat",
      description: "Progressive melee combat enhancement.",
      bonus: "Increases melee accuracy and max hit as you deal melee damage",
      penalty: "Progress resets on death",
    },
    {
      id: "re-mastery-ranged",
      name: "Ranged Mastery",
      tier: 1,
      category: "combat",
      description: "Progressive ranged combat enhancement.",
      bonus: "Increases ranged accuracy and max hit as you deal ranged damage",
      penalty: "Progress resets on death",
    },
    {
      id: "re-mastery-magic",
      name: "Magic Mastery",
      tier: 1,
      category: "combat",
      description: "Progressive magic combat enhancement.",
      bonus: "Increases magic accuracy and max hit as you deal magic damage",
      penalty: "Progress resets on death",
    },
  ],

  tasks: [
    // Easy Tasks
    ...generateTasks("easy", 10, [
      { id: "re-e-1", name: "First Blood", description: "Kill any monster", category: "Combat" },
      { id: "re-e-2", name: "Miner", description: "Mine 50 ores", category: "Mining", skills: ["Mining"] },
      { id: "re-e-3", name: "Lumberjack", description: "Chop 100 logs", category: "Woodcutting", skills: ["Woodcutting"] },
      { id: "re-e-4", name: "Fisher", description: "Catch 50 fish", category: "Fishing", skills: ["Fishing"] },
      { id: "re-e-5", name: "Chef", description: "Cook 25 food items", category: "Cooking", skills: ["Cooking"] },
      { id: "re-e-6", name: "Firelighter", description: "Light 50 fires", category: "Firemaking", skills: ["Firemaking"] },
      { id: "re-e-7", name: "Leather Crafter", description: "Craft 25 leather items", category: "Crafting", skills: ["Crafting"] },
      { id: "re-e-8", name: "Metal Worker", description: "Smith 25 items", category: "Smithing", skills: ["Smithing"] },
      { id: "re-e-9", name: "Bone Burier", description: "Bury 100 bones", category: "Prayer", skills: ["Prayer"] },
      { id: "re-e-10", name: "Rune Runner", description: "Craft 200 runes", category: "Runecraft", skills: ["Runecraft"] },
      { id: "re-e-11", name: "Thief", description: "Pickpocket 50 times", category: "Thieving", skills: ["Thieving"] },
      { id: "re-e-12", name: "Lap Runner", description: "Complete 10 agility laps", category: "Agility", skills: ["Agility"] },
      { id: "re-e-13", name: "Bird Catcher", description: "Catch 25 birds", category: "Hunter", skills: ["Hunter"] },
      { id: "re-e-14", name: "Quest Starter", description: "Complete 5 quests", category: "Quests" },
      { id: "re-e-15", name: "Herb Cleaner", description: "Clean 50 herbs", category: "Herblore", skills: ["Herblore"] },
    ]),
    // Medium Tasks
    ...generateTasks("medium", 30, [
      { id: "re-m-1", name: "Barrows Brother", description: "Complete a Barrows run", category: "Combat" },
      { id: "re-m-2", name: "Slayer Initiate", description: "Complete 25 Slayer tasks", category: "Slayer", skills: ["Slayer"] },
      { id: "re-m-3", name: "Quest Veteran", description: "Complete 25 quests", category: "Quests" },
      { id: "re-m-4", name: "Clue Solver", description: "Complete 10 medium clue scrolls", category: "Clues" },
      { id: "re-m-5", name: "50 Combat", description: "Reach 50 in any combat skill", category: "Combat" },
      { id: "re-m-6", name: "Base 40", description: "Get all skills to at least 40", category: "Skilling" },
      { id: "re-m-7", name: "Green Dragon Hunter", description: "Kill 50 green dragons", category: "Combat" },
      { id: "re-m-8", name: "Pyramid Plunderer", description: "Complete 10 Pyramid Plunder runs", category: "Thieving", skills: ["Thieving"] },
      { id: "re-m-9", name: "Farming Initiate", description: "Complete 25 farming patches", category: "Farming", skills: ["Farming"] },
      { id: "re-m-10", name: "Potion Brewer", description: "Brew 100 potions", category: "Herblore", skills: ["Herblore"] },
    ]),
    // Hard Tasks
    ...generateTasks("hard", 50, [
      { id: "re-h-1", name: "Fire Cape", description: "Complete the TzHaar Fight Caves", category: "Combat" },
      { id: "re-h-2", name: "Zulrah Slayer", description: "Defeat Zulrah", category: "Combat" },
      { id: "re-h-3", name: "GWD Boss", description: "Defeat any God Wars Dungeon boss", category: "Combat" },
      { id: "re-h-4", name: "100 QP", description: "Earn 100 quest points", category: "Quests" },
      { id: "re-h-5", name: "Base 70", description: "Get all skills to at least 70", category: "Skilling" },
      { id: "re-h-6", name: "Elite Clue", description: "Complete an elite clue scroll", category: "Clues" },
      { id: "re-h-7", name: "Echo Boss I", description: "Defeat your first Echo Boss", category: "Echo" },
      { id: "re-h-8", name: "Corrupted Gauntlet", description: "Complete the Corrupted Gauntlet", category: "Combat" },
    ]),
    // Elite Tasks
    ...generateTasks("elite", 100, [
      { id: "re-el-1", name: "Theatre Complete", description: "Complete the Theatre of Blood", category: "Combat" },
      { id: "re-el-2", name: "CoX Clear", description: "Complete the Chambers of Xeric", category: "Combat" },
      { id: "re-el-3", name: "ToA Expert", description: "Complete Tombs of Amascut at 300+ invocation", category: "Combat" },
      { id: "re-el-4", name: "First 99", description: "Achieve level 99 in any skill", category: "Skilling" },
      { id: "re-el-5", name: "Master Clue", description: "Complete a master clue scroll", category: "Clues" },
      { id: "re-el-6", name: "Echo Collector", description: "Defeat 3 different Echo Bosses", category: "Echo" },
    ]),
    // Master Tasks
    ...generateTasks("master", 200, [
      { id: "re-ma-1", name: "Infernal Cape", description: "Complete the Inferno", category: "Combat" },
      { id: "re-ma-2", name: "Max Total", description: "Reach 2277 total level", category: "Skilling" },
      { id: "re-ma-3", name: "Echo Master", description: "Defeat all Echo Bosses at least once", category: "Echo" },
      { id: "re-ma-4", name: "Speed Runner", description: "Complete 500 league tasks", category: "League" },
    ]),
  ],

  rewardTiers: [
    {
      name: "Bronze",
      pointsRequired: 2000,
      color: "#cd7f32",
      rewards: [
        { id: "re-rew-1", name: "Raging Echoes Trophy (Bronze)", description: "A bronze trophy for your POH", type: "trophy" },
      ],
    },
    {
      name: "Iron",
      pointsRequired: 4000,
      color: "#a8a8a8",
      rewards: [
        { id: "re-rew-2", name: "Raging Echoes Trophy (Iron)", description: "An iron trophy for your POH", type: "trophy" },
        { id: "re-rew-3", name: "Echo Home Teleport", description: "Unique home teleport animation", type: "home_teleport" },
      ],
    },
    {
      name: "Steel",
      pointsRequired: 10000,
      color: "#71797E",
      rewards: [
        { id: "re-rew-4", name: "Raging Echoes Trophy (Steel)", description: "A steel trophy for your POH", type: "trophy" },
        { id: "re-rew-5", name: "Echo Hunter Outfit", description: "League hunter outfit", type: "outfit" },
      ],
    },
    {
      name: "Mithril",
      pointsRequired: 20000,
      color: "#4a5d8a",
      rewards: [
        { id: "re-rew-6", name: "Raging Echoes Trophy (Mithril)", description: "A mithril trophy for your POH", type: "trophy" },
        { id: "re-rew-7", name: "Echo Weapon Kit", description: "Cosmetic weapon kit", type: "ornament_kit" },
      ],
    },
    {
      name: "Adamant",
      pointsRequired: 30000,
      color: "#2e8b57",
      rewards: [
        { id: "re-rew-8", name: "Raging Echoes Trophy (Adamant)", description: "An adamant trophy for your POH", type: "trophy" },
        { id: "re-rew-9", name: "Echo Armour Kit", description: "Cosmetic armour kit", type: "ornament_kit" },
      ],
    },
    {
      name: "Rune",
      pointsRequired: 45000,
      color: "#00b4d8",
      rewards: [
        { id: "re-rew-10", name: "Raging Echoes Trophy (Rune)", description: "A rune trophy for your POH", type: "trophy" },
        { id: "re-rew-11", name: "Echoed Title", description: "'Echoed' title", type: "title" },
      ],
    },
    {
      name: "Dragon",
      pointsRequired: 60000,
      color: "#dc2626",
      rewards: [
        { id: "re-rew-12", name: "Raging Echoes Trophy (Dragon)", description: "A dragon trophy for your POH", type: "trophy" },
        { id: "re-rew-13", name: "Echo Home Teleport (Dragon)", description: "Dragon-tier home teleport animation", type: "home_teleport" },
        { id: "re-rew-14", name: "Echo Pet Transmog", description: "Transmog any pet into an echo form", type: "cosmetic" },
      ],
    },
  ],

  autoCompletedQuests: [],
  mechanicChanges: [
    "All areas accessible from the start — no region restrictions",
    "All players are Ironmen",
    "Echo bosses: special versions of existing bosses with guaranteed unique drops",
    "Echo boss guaranteed drops after KC threshold",
    "Combat masteries: progressive combat scaling system",
    "5x XP scaling up to 16x through relic tiers",
    "Stackable clue scroll boxes",
  ],
};

function generateTasks(
  difficulty: "easy" | "medium" | "hard" | "elite" | "master",
  points: number,
  tasks: Array<{ id: string; name: string; description: string; category: string; skills?: string[] }>
) {
  return tasks.map((t) => ({
    ...t,
    difficulty,
    points,
    skills: (t.skills || []) as import("@/types/league").SkillName[],
  }));
}
