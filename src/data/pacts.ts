import type { PactNode } from "@/types/dps";
import { PACT_POINT_LIMIT } from "@/types/dps";

// ═══════════════════════════════════════════════════════════════════════
// DEMONIC PACTS SKILL TREE — sourced from wiki DPS calc (dbrow_definitions.json)
// ~85 nodes in a connected graph. Root = node1. 40 points to spend.
// Every node is a buff — no penalty pacts exist in the tree.
// ═══════════════════════════════════════════════════════════════════════

export const PACT_NODES: PactNode[] = [
  // ══════════════════════════════════════════════════════════════════════
  // ROOT
  // ══════════════════════════════════════════════════════════════════════
  { id: "node1", name: "Regenerate", description: "+50% chance to Regenerate runes, ammo and charges", branch: null, size: "node_major",
    effects: [{ type: "talent_regen_ammo", value: 50 }],
    linkedNodes: ["node6", "node7", "node8", "node9", "node10"],
    position: { x: 500, y: 500 } },

  // ══════════════════════════════════════════════════════════════════════
  // CENTRAL SPINE — ACCURACY + DEFENCE + REGEN
  // ══════════════════════════════════════════════════════════════════════
  { id: "node6", name: "Fortify I", description: "+5 Defence boost", branch: null, size: "node_minor",
    effects: [{ type: "talent_defence_boost", value: 5 }],
    linkedNodes: ["node1", "node11"],
    position: { x: 430, y: 430 } },

  { id: "node7", name: "Precision I", description: "+15% accuracy on all combat styles", branch: null, size: "node_minor",
    effects: [{ type: "talent_all_style_accuracy", value: 15 }],
    linkedNodes: ["node1", "node2"],
    position: { x: 500, y: 400 } },

  { id: "node8", name: "Fortify II", description: "+5 Defence boost", branch: null, size: "node_minor",
    effects: [{ type: "talent_defence_boost", value: 5 }],
    linkedNodes: ["node1", "node58"],
    position: { x: 570, y: 430 } },

  { id: "node9", name: "Distant Precision", description: "5% + 5% per tile: chance to roll max accuracy", branch: null, size: "node_major",
    effects: [{ type: "talent_max_accuracy_roll_from_range", value: true }],
    linkedNodes: ["node1", "node12", "node59"],
    position: { x: 580, y: 500 } },

  { id: "node10", name: "Regenerate II", description: "+30% chance to Regenerate", branch: null, size: "node_major",
    effects: [{ type: "talent_regen_ammo", value: 30 }],
    linkedNodes: ["node1", "node44", "node45", "node46", "node47", "node48"],
    position: { x: 420, y: 500 } },

  { id: "node11", name: "Focus I", description: "+35% accuracy on all combat styles", branch: null, size: "node_major",
    effects: [{ type: "talent_all_style_accuracy", value: 35 }],
    linkedNodes: ["node6", "node55", "node56"],
    position: { x: 380, y: 360 } },

  { id: "node12", name: "Off-hand Mastery", description: "Off-hand equipped: +5 melee str, +5 ranged str, +2% magic dmg", branch: null, size: "node_major",
    effects: [{ type: "talent_offhand_stat_boost", value: true }],
    linkedNodes: ["node9", "node84", "node85"],
    position: { x: 650, y: 500 } },

  // ══════════════════════════════════════════════════════════════════════
  // RANGED BRANCH (south)
  // ══════════════════════════════════════════════════════════════════════
  { id: "node2", name: "Ranged Echo", description: "When you Regenerate ammo, +25% chance to fire a Ranged echo", branch: "ranged", size: "node_major",
    effects: [{ type: "talent_ranged_regen_echo_chance", value: 25 }],
    linkedNodes: ["node7", "node3", "node4", "node5", "node13"],
    position: { x: 500, y: 300 } },

  { id: "node3", name: "True Shot", description: "Bow Ranged echoes never miss", branch: "ranged", size: "node_major",
    effects: [{ type: "talent_bow_always_pass_accuracy", value: true, unsupported: true }],
    linkedNodes: ["node2", "node20"],
    position: { x: 400, y: 260 } },

  { id: "node4", name: "Bolt Echo", description: "Crossbow: +15% chance to trigger Ranged echoes", branch: "ranged", size: "node_major",
    effects: [{ type: "talent_crossbow_echo_reproc_chance", value: 15 }],
    linkedNodes: ["node2", "node21"],
    position: { x: 500, y: 240 } },

  { id: "node5", name: "Thrown Echo", description: "Thrown: echoes have 20% chance to max hit", branch: "ranged", size: "node_major",
    effects: [{ type: "talent_thrown_maxhit_echoes", value: 20, unsupported: true }],
    linkedNodes: ["node2", "node22"],
    position: { x: 600, y: 260 } },

  { id: "node13", name: "Ranged Power I", description: "+1% ranged damage", branch: "ranged", size: "node_minor",
    effects: [{ type: "talent_percentage_ranged_damage", value: 1 }],
    linkedNodes: ["node2", "node14", "node15"],
    position: { x: 460, y: 280 } },

  { id: "node14", name: "Ranged Prayers", description: "Ranged prayers are 30% more effective", branch: "ranged", size: "node_major",
    effects: [{ type: "talent_buffed_ranged_prayers", value: true }],
    linkedNodes: ["node13", "node16"],
    position: { x: 420, y: 220 } },

  { id: "node15", name: "Ranged Power II", description: "+1% ranged damage", branch: "ranged", size: "node_minor",
    effects: [{ type: "talent_percentage_ranged_damage", value: 1 }],
    linkedNodes: ["node13", "node17"],
    position: { x: 480, y: 220 } },

  { id: "node16", name: "HP Ranged Str", description: "Ranged str +1 per 10 HP difference (current vs max)", branch: "ranged", size: "node_major",
    effects: [{ type: "talent_ranged_strength_hp_difference", value: true, unsupported: true }],
    linkedNodes: ["node14"],
    position: { x: 380, y: 180 } },

  { id: "node17", name: "Ranged Power III", description: "+1% ranged damage", branch: "ranged", size: "node_minor",
    effects: [{ type: "talent_percentage_ranged_damage", value: 1 }],
    linkedNodes: ["node15", "node18", "node19", "node38"],
    position: { x: 500, y: 180 } },

  { id: "node18", name: "Echo Cascade", description: "Ranged echoes can trigger additional echoes at half chance (up to 4 times)", branch: "ranged", size: "node_major",
    effects: [{ type: "talent_ranged_echo_cyclical", value: true }],
    linkedNodes: ["node17", "node23"],
    position: { x: 460, y: 140 } },

  { id: "node19", name: "Ranged Power IV", description: "+1% ranged damage", branch: "ranged", size: "node_minor",
    effects: [{ type: "talent_percentage_ranged_damage", value: 1 }],
    linkedNodes: ["node17", "node24", "node25", "node39"],
    position: { x: 540, y: 140 } },

  // Bow sub-branch
  { id: "node20", name: "Rapid Fire", description: "Bows attack 1 tick faster", branch: "ranged", size: "node_major",
    effects: [{ type: "talent_bow_fast_hits", value: true }],
    linkedNodes: ["node3", "node26", "node27"],
    position: { x: 340, y: 200 } },

  // Crossbow sub-branch
  { id: "node21", name: "Crossbow Mastery", description: "Crossbows +2 ticks slower but +70% damage", branch: "ranged", size: "node_major",
    effects: [{ type: "talent_crossbow_slow_big_hits", value: true }],
    linkedNodes: ["node4", "node29", "node30"],
    position: { x: 500, y: 160 } },

  // Thrown sub-branch
  { id: "node22", name: "Thrown Melee Scale", description: "Thrown: ranged str increased by 80% of melee str", branch: "ranged", size: "node_major",
    effects: [{ type: "talent_thrown_weapon_melee_str_scale", value: true }],
    linkedNodes: ["node5", "node32", "node33"],
    position: { x: 660, y: 200 } },

  { id: "node23", name: "Ranged Power V", description: "+1% ranged damage", branch: "ranged", size: "node_minor",
    effects: [{ type: "talent_percentage_ranged_damage", value: 1 }],
    linkedNodes: ["node18"],
    position: { x: 420, y: 100 } },

  { id: "node24", name: "Ranged Power VI", description: "+1% ranged damage", branch: "ranged", size: "node_minor",
    effects: [{ type: "talent_percentage_ranged_damage", value: 1 }],
    linkedNodes: ["node19"],
    position: { x: 520, y: 100 } },

  { id: "node25", name: "Ranged Power VII", description: "+1% ranged damage", branch: "ranged", size: "node_minor",
    effects: [{ type: "talent_percentage_ranged_damage", value: 1 }],
    linkedNodes: ["node19"],
    position: { x: 560, y: 100 } },

  // Bow capstones
  { id: "node26", name: "Bow Min Hit Stack", description: "Hitting increases min hit by 1, caps at 15% of base max", branch: "ranged", size: "node_capstone",
    effects: [{ type: "talent_bow_min_hit_stacking_increase", value: true, unsupported: true }],
    linkedNodes: ["node20"],
    position: { x: 300, y: 140 } },

  { id: "node27", name: "Ranged Power VIII", description: "+1% ranged damage", branch: "ranged", size: "node_minor",
    effects: [{ type: "talent_percentage_ranged_damage", value: 1 }],
    linkedNodes: ["node20", "node28"],
    position: { x: 360, y: 140 } },

  { id: "node28", name: "Bow Max Hit Stack", description: "Hitting increases max hit by 1, caps at 15% of base max", branch: "ranged", size: "node_capstone",
    effects: [{ type: "talent_bow_max_hit_stacking_increase", value: true, unsupported: true }],
    linkedNodes: ["node27"],
    position: { x: 340, y: 80 } },

  // Crossbow capstones
  { id: "node29", name: "Always Max", description: "Crossbow hits ALWAYS deal max damage", branch: "ranged", size: "node_capstone",
    effects: [{ type: "talent_crossbow_max_hit", value: true }],
    linkedNodes: ["node21"],
    position: { x: 460, y: 100 } },

  { id: "node30", name: "Ranged Power IX", description: "+1% ranged damage", branch: "ranged", size: "node_minor",
    effects: [{ type: "talent_percentage_ranged_damage", value: 1 }],
    linkedNodes: ["node21", "node31"],
    position: { x: 540, y: 60 } },

  { id: "node31", name: "Double Roll", description: "Crossbow attacks roll accuracy twice (Fang-style)", branch: "ranged", size: "node_capstone",
    effects: [{ type: "talent_crossbow_double_accuracy_roll", value: true }],
    linkedNodes: ["node30"],
    position: { x: 500, y: 40 } },

  // Thrown capstones
  { id: "node32", name: "Thrown Accuracy", description: "Thrown: +60 ranged accuracy bonus", branch: "ranged", size: "node_capstone",
    effects: [{ type: "talent_thrown_weapon_accuracy", value: 60 }],
    linkedNodes: ["node22"],
    position: { x: 700, y: 140 } },

  { id: "node33", name: "Ranged Power X", description: "+1% ranged damage", branch: "ranged", size: "node_minor",
    effects: [{ type: "talent_percentage_ranged_damage", value: 1 }],
    linkedNodes: ["node22", "node34"],
    position: { x: 640, y: 140 } },

  { id: "node34", name: "Multi-Target Thrown", description: "Thrown: attack hits an additional nearby target", branch: "ranged", size: "node_capstone",
    effects: [{ type: "talent_thrown_weapon_multi", value: true, unsupported: true }],
    linkedNodes: ["node33"],
    position: { x: 660, y: 80 } },

  // Echo chance nodes
  { id: "node38", name: "Echo Chance I", description: "+5% Ranged echo chance", branch: "ranged", size: "node_major",
    effects: [{ type: "talent_ranged_regen_echo_chance", value: 5 }],
    linkedNodes: ["node17"],
    position: { x: 480, y: 160 } },

  { id: "node39", name: "Echo Chance II", description: "+5% Ranged echo chance", branch: "ranged", size: "node_major",
    effects: [{ type: "talent_ranged_regen_echo_chance", value: 5 }],
    linkedNodes: ["node19"],
    position: { x: 560, y: 160 } },

  // ══════════════════════════════════════════════════════════════════════
  // REGEN SUB-BRANCH (elemental regen bonuses, from node10)
  // ══════════════════════════════════════════════════════════════════════
  { id: "node44", name: "Magic Level Boost", description: "Regen runes: Magic level +1 per regen for 30 ticks (cap +10)", branch: "magic", size: "node_major",
    effects: [{ type: "talent_regen_magic_level_boost", value: 10, unsupported: true }],
    linkedNodes: ["node10"],
    position: { x: 340, y: 540 } },

  { id: "node45", name: "Air Rune Prayer", description: "Regen air runes: 15% chance to restore 1 prayer per rune", branch: null, size: "node_major",
    effects: [{ type: "talent_airrune_regen_prayer_restore", value: 15, unsupported: true }],
    linkedNodes: ["node10"],
    position: { x: 360, y: 580 } },

  { id: "node46", name: "Water Rune Heal", description: "Regen water runes: healed for 1 per rune", branch: null, size: "node_major",
    effects: [{ type: "talent_waterrune_regen_healing", value: 1, unsupported: true }],
    linkedNodes: ["node10"],
    position: { x: 380, y: 560 } },

  { id: "node47", name: "Fire Rune Damage", description: "Regen fire runes: +1 damage per rune regenerated", branch: "magic", size: "node_major",
    effects: [{ type: "talent_firerune_regen_damage_boost", value: 1, unsupported: true }],
    linkedNodes: ["node10"],
    position: { x: 400, y: 580 } },

  { id: "node48", name: "Earth Rune Defence", description: "Regen earth runes: +1 Defence per rune for 30t (cap 20%)", branch: null, size: "node_major",
    effects: [{ type: "talent_earthrune_regen_defence_boost", value: 1, unsupported: true }],
    linkedNodes: ["node10"],
    position: { x: 420, y: 560 } },

  // Powered staff regen nodes
  { id: "node53", name: "Staff Regen Water", description: "Powered staff regen also generates 1 water rune", branch: "magic", size: "node_major",
    effects: [{ type: "talent_regen_stave_charges_water", value: true, unsupported: true }],
    linkedNodes: ["node46"],
    position: { x: 360, y: 620 } },

  { id: "node54", name: "Staff Regen Fire", description: "Powered staff regen also generates 1 fire rune", branch: "magic", size: "node_major",
    effects: [{ type: "talent_regen_stave_charges_fire", value: true, unsupported: true }],
    linkedNodes: ["node47"],
    position: { x: 400, y: 640 } },

  // ══════════════════════════════════════════════════════════════════════
  // ACCURACY SPINE (secondary, from node11)
  // ══════════════════════════════════════════════════════════════════════
  { id: "node55", name: "Precision II", description: "+15% accuracy on all combat styles", branch: null, size: "node_minor",
    effects: [{ type: "talent_all_style_accuracy", value: 15 }],
    linkedNodes: ["node11", "node57"],
    position: { x: 320, y: 320 } },

  { id: "node56", name: "Precision III", description: "+15% accuracy on all combat styles", branch: null, size: "node_minor",
    effects: [{ type: "talent_all_style_accuracy", value: 15 }],
    linkedNodes: ["node11", "node60"],
    position: { x: 340, y: 400 } },

  { id: "node57", name: "Precision IV", description: "+15% accuracy on all combat styles", branch: null, size: "node_minor",
    effects: [{ type: "talent_all_style_accuracy", value: 15 }],
    linkedNodes: ["node55", "node65"],
    position: { x: 260, y: 300 } },

  { id: "node58", name: "Focus II", description: "+35% accuracy on all combat styles", branch: null, size: "node_major",
    effects: [{ type: "talent_all_style_accuracy", value: 35 }],
    linkedNodes: ["node8", "node82", "node83"],
    position: { x: 640, y: 380 } },

  { id: "node59", name: "Overheal I", description: "Pact healing overheals up to +30% of base HP", branch: null, size: "node_major",
    effects: [{ type: "talent_overhealing_via_talents", value: 30, unsupported: true }],
    linkedNodes: ["node9"],
    position: { x: 650, y: 560 } },

  // ══════════════════════════════════════════════════════════════════════
  // MELEE BRANCH (right side)
  // ══════════════════════════════════════════════════════════════════════
  { id: "node60", name: "Regenerate III", description: "+30% chance to Regenerate", branch: null, size: "node_major",
    effects: [{ type: "talent_regen_ammo", value: 30 }],
    linkedNodes: ["node56", "node61", "node62", "node140"],
    position: { x: 300, y: 460 } },

  { id: "node61", name: "Fortify III", description: "+15 Defence boost", branch: null, size: "node_major",
    effects: [{ type: "talent_defence_boost", value: 15 }],
    linkedNodes: ["node60"],
    position: { x: 240, y: 500 } },

  { id: "node62", name: "Regen IV", description: "+5% chance to Regenerate", branch: null, size: "node_minor",
    effects: [{ type: "talent_regen_ammo", value: 5 }],
    linkedNodes: ["node60"],
    position: { x: 260, y: 460 } },

  { id: "node63", name: "Fortify IV", description: "+5 Defence boost", branch: null, size: "node_minor",
    effects: [{ type: "talent_defence_boost", value: 5 }],
    linkedNodes: ["node74"],
    position: { x: 160, y: 580 } },

  { id: "node64", name: "Fortify V", description: "+5 Defence boost", branch: null, size: "node_minor",
    effects: [{ type: "talent_defence_boost", value: 5 }],
    linkedNodes: ["node74"],
    position: { x: 200, y: 620 } },

  { id: "node65", name: "Style Swap", description: "Max hitting from 3+ tiles: next different-style hit deals +25%", branch: null, size: "node_major",
    effects: [{ type: "talent_max_hit_style_swap", value: true, unsupported: true }],
    linkedNodes: ["node57"],
    position: { x: 200, y: 260 } },

  // Melee damage spine
  { id: "node140", name: "Melee Power I", description: "+1% melee damage", branch: "melee", size: "node_minor",
    effects: [{ type: "talent_percentage_melee_damage", value: 1 }],
    linkedNodes: ["node60", "node141", "node142", "node143"],
    position: { x: 240, y: 540 } },

  { id: "node141", name: "Thorns Double", description: "Thorns hits twice (second hit at 50% damage)", branch: "melee", size: "node_capstone",
    effects: [{ type: "talent_thorns_double_hit", value: true, unsupported: true }],
    linkedNodes: ["node140", "node139"],
    position: { x: 180, y: 520 } },

  { id: "node142", name: "Light Weapon Speed", description: "Melee weapons <1kg attack 1 tick faster", branch: "melee", size: "node_major",
    effects: [{ type: "talent_light_weapon_faster", value: true }],
    linkedNodes: ["node140", "node144"],
    position: { x: 200, y: 580 } },

  { id: "node143", name: "Melee Power II", description: "+1% melee damage", branch: "melee", size: "node_minor",
    effects: [{ type: "talent_percentage_melee_damage", value: 1 }],
    linkedNodes: ["node140", "node145", "node150"],
    position: { x: 280, y: 580 } },

  { id: "node144", name: "Spec Restore", description: "Melee hits restore 2% special attack energy", branch: "melee", size: "node_capstone",
    effects: [{ type: "talent_hit_restore_spec_energy", value: 2, unsupported: true }],
    linkedNodes: ["node142"],
    position: { x: 160, y: 640 } },

  { id: "node145", name: "Melee Power III", description: "+1% melee damage", branch: "melee", size: "node_minor",
    effects: [{ type: "talent_percentage_melee_damage", value: 1 }],
    linkedNodes: ["node143", "node151", "node146"],
    position: { x: 240, y: 620 } },

  { id: "node150", name: "Blindbag Chance+", description: "Per unique heavy weapon in inv: Blindbag chance +2% (max 5)", branch: "melee", size: "node_major",
    effects: [{ type: "talent_unique_blindbag_chance", value: true, unsupported: true }],
    linkedNodes: ["node143", "node152"],
    position: { x: 320, y: 620 } },

  { id: "node151", name: "Melee Power IV", description: "+1% melee damage", branch: "melee", size: "node_minor",
    effects: [{ type: "talent_percentage_melee_damage", value: 1 }],
    linkedNodes: ["node145", "node153", "node154"],
    position: { x: 200, y: 660 } },

  { id: "node152", name: "Blindbag Damage+", description: "Per unique heavy weapon in inv: Blindbag max hit +2% (max 5)", branch: "melee", size: "node_capstone",
    effects: [{ type: "talent_unique_blindbag_damage", value: 2, unsupported: true }],
    linkedNodes: ["node150"],
    position: { x: 360, y: 660 } },

  { id: "node153", name: "Distance Max Hit", description: "Max hit +4% + 4% per 3 tiles of distance", branch: "melee", size: "node_major",
    effects: [{ type: "talent_percentage_melee_maxhit_distance", value: 4 }],
    linkedNodes: ["node151", "node155"],
    position: { x: 160, y: 700 } },

  { id: "node154", name: "Melee Power V", description: "+1% melee damage", branch: "melee", size: "node_minor",
    effects: [{ type: "talent_percentage_melee_damage", value: 1 }],
    linkedNodes: ["node151", "node156"],
    position: { x: 240, y: 700 } },

  { id: "node155", name: "Melee Range Boost", description: "If melee range >= 4, increase to 7. Halberds slower than 5t set to 5t", branch: "melee", size: "node_capstone",
    effects: [{ type: "talent_melee_range_conditional_boost", value: true, unsupported: true }],
    linkedNodes: ["node153"],
    position: { x: 120, y: 740 } },

  { id: "node156", name: "Melee Power VI", description: "+1% melee damage", branch: "melee", size: "node_minor",
    effects: [{ type: "talent_percentage_melee_damage", value: 1 }],
    linkedNodes: ["node154", "node157", "node162"],
    position: { x: 280, y: 740 } },

  { id: "node157", name: "2H Melee Echo", description: "2H melee: 5% chance to trigger Ranged echo (uses melee stats)", branch: "melee", size: "node_major",
    effects: [{ type: "talent_2h_melee_echos", value: true }],
    linkedNodes: ["node156"],
    position: { x: 220, y: 780 } },

  { id: "node161", name: "Melee Power VII", description: "+1% melee damage", branch: "melee", size: "node_minor",
    effects: [{ type: "talent_percentage_melee_damage", value: 1 }],
    linkedNodes: ["node162", "node163", "node165"],
    position: { x: 360, y: 800 } },

  { id: "node162", name: "Prayer Str Bonus", description: "Melee str increased by 50% of worn prayer bonus", branch: "melee", size: "node_major",
    effects: [{ type: "talent_melee_strength_prayer_bonus", value: true }],
    linkedNodes: ["node156", "node161"],
    position: { x: 320, y: 780 } },

  { id: "node163", name: "Melee Power VIII", description: "+1% melee damage", branch: "melee", size: "node_minor",
    effects: [{ type: "talent_percentage_melee_damage", value: 1 }],
    linkedNodes: ["node161"],
    position: { x: 400, y: 840 } },

  { id: "node165", name: "Overheal Consumption", description: "Consume 5 overheal HP to increase min hit by 5", branch: "melee", size: "node_major",
    effects: [{ type: "talent_overheal_consumption_boost", value: true, unsupported: true }],
    linkedNodes: ["node161"],
    position: { x: 320, y: 840 } },

  // Light/heavy melee weapon nodes
  { id: "node71", name: "Thorns", description: "Shield equipped: Thorns effect deals 3 damage when attacked", branch: "melee", size: "node_major",
    effects: [{ type: "talent_thorns_damage", value: 3, unsupported: true }],
    linkedNodes: ["node74"],
    position: { x: 120, y: 560 } },

  { id: "node72", name: "Light Double Hit", description: "Weapons <1kg: always trigger extra hit at 40% of base max", branch: "melee", size: "node_major",
    effects: [{ type: "talent_light_weapon_doublehit", value: true }],
    linkedNodes: ["node74"],
    position: { x: 140, y: 620 } },

  { id: "node73", name: "Blindbag Attack", description: "Heavy weapons (>=1kg): 15% chance of Blindbag attack", branch: "melee", size: "node_major",
    effects: [{ type: "talent_free_random_weapon_attack_chance", value: 15 }],
    linkedNodes: ["node74"],
    position: { x: 100, y: 640 } },

  { id: "node74", name: "Distance Min Hit", description: "Melee min hit +3, plus +3 per tile distance", branch: "melee", size: "node_major",
    effects: [{ type: "talent_distance_melee_minhit", value: 3, unsupported: true }],
    linkedNodes: ["node60", "node63", "node64", "node71", "node72", "node73", "node79"],
    position: { x: 180, y: 560 } },

  { id: "node79", name: "Multi-Hit Str", description: "Light (<1kg) or 1H weapons: melee str increased by 20% of Strength level", branch: "melee", size: "node_major",
    effects: [{ type: "talent_multi_hit_str_increase", value: true }],
    linkedNodes: ["node74", "node80"],
    position: { x: 120, y: 500 } },

  { id: "node80", name: "Melee Heal Chance I", description: "Melee/Thorns: +10% chance to heal based on distance", branch: "melee", size: "node_major",
    effects: [{ type: "talent_melee_distance_healing_chance", value: 10, unsupported: true }],
    linkedNodes: ["node79"],
    position: { x: 80, y: 460 } },

  { id: "node43", name: "2H Range Double", description: "2H weapons: melee range doubled", branch: "melee", size: "node_major",
    effects: [{ type: "talent_melee_range_multiplier", value: 2, unsupported: true }],
    linkedNodes: ["node74"],
    position: { x: 100, y: 600 } },

  // ══════════════════════════════════════════════════════════════════════
  // MAGIC BRANCH (upper left / left side)
  // ══════════════════════════════════════════════════════════════════════
  { id: "node66", name: "Prayer Pen I", description: "+15% prayer penetration", branch: null, size: "node_minor",
    effects: [{ type: "talent_prayer_pen_all", value: 15, unsupported: true }],
    linkedNodes: ["node58"],
    position: { x: 700, y: 340 } },

  { id: "node67", name: "Magic Power I", description: "+1% magic damage", branch: "magic", size: "node_minor",
    effects: [{ type: "talent_percentage_magic_damage", value: 1 }],
    linkedNodes: ["node86", "node68"],
    position: { x: 780, y: 420 } },

  { id: "node68", name: "Magic Power II", description: "+1% magic damage", branch: "magic", size: "node_minor",
    effects: [{ type: "talent_percentage_magic_damage", value: 1 }],
    linkedNodes: ["node67", "node69", "node107"],
    position: { x: 820, y: 460 } },

  { id: "node69", name: "Magic Power III", description: "+1% magic damage", branch: "magic", size: "node_minor",
    effects: [{ type: "talent_percentage_magic_damage", value: 1 }],
    linkedNodes: ["node68", "node70", "node112"],
    position: { x: 860, y: 500 } },

  { id: "node70", name: "Magic Power IV", description: "+1% magic damage", branch: "magic", size: "node_minor",
    effects: [{ type: "talent_percentage_magic_damage", value: 1 }],
    linkedNodes: ["node69", "node117"],
    position: { x: 900, y: 540 } },

  { id: "node81", name: "Fortify VI", description: "+5 Defence boost", branch: null, size: "node_minor",
    effects: [{ type: "talent_defence_boost", value: 5 }],
    linkedNodes: ["node86"],
    position: { x: 720, y: 440 } },

  { id: "node82", name: "Precision V", description: "+15% accuracy on all combat styles", branch: null, size: "node_minor",
    effects: [{ type: "talent_all_style_accuracy", value: 15 }],
    linkedNodes: ["node58"],
    position: { x: 680, y: 340 } },

  { id: "node83", name: "Precision VI", description: "+15% accuracy on all combat styles", branch: null, size: "node_minor",
    effects: [{ type: "talent_all_style_accuracy", value: 15 }],
    linkedNodes: ["node58", "node86"],
    position: { x: 700, y: 400 } },

  { id: "node84", name: "Shield Reflect", description: "Shield: 0.1% per Defence level to reflect all damage", branch: null, size: "node_major",
    effects: [{ type: "talent_shield_reflect", value: true, unsupported: true }],
    linkedNodes: ["node12"],
    position: { x: 700, y: 520 } },

  { id: "node85", name: "Free Spec", description: "20% chance special attacks don't consume energy", branch: null, size: "node_major",
    effects: [{ type: "talent_spec_for_free", value: 20, unsupported: true }],
    linkedNodes: ["node12"],
    position: { x: 700, y: 560 } },

  { id: "node86", name: "Focus III", description: "+35% accuracy on all combat styles", branch: null, size: "node_major",
    effects: [{ type: "talent_all_style_accuracy", value: 35 }],
    linkedNodes: ["node83", "node81", "node67", "node87"],
    position: { x: 740, y: 400 } },

  { id: "node87", name: "Regenerate IV", description: "+30% chance to Regenerate", branch: null, size: "node_major",
    effects: [{ type: "talent_regen_ammo", value: 30 }],
    linkedNodes: ["node86", "node88"],
    position: { x: 780, y: 460 } },

  { id: "node88", name: "Distance Spec", description: "Attack from 2+ tiles: restore 2% spec energy", branch: null, size: "node_major",
    effects: [{ type: "talent_restore_sa_energy_from_distance", value: true, unsupported: true }],
    linkedNodes: ["node87"],
    position: { x: 820, y: 500 } },

  // Regen nodes
  { id: "node92", name: "Regen V", description: "+5% chance to Regenerate", branch: null, size: "node_minor",
    effects: [{ type: "talent_regen_ammo", value: 5 }],
    linkedNodes: ["node87"],
    position: { x: 800, y: 440 } },

  { id: "node93", name: "Regen VI", description: "+5% chance to Regenerate", branch: null, size: "node_minor",
    effects: [{ type: "talent_regen_ammo", value: 5 }],
    linkedNodes: ["node87"],
    position: { x: 760, y: 480 } },

  // Defence nodes (various locations)
  { id: "node94", name: "Fortify VII", description: "+5 Defence boost", branch: null, size: "node_minor",
    effects: [{ type: "talent_defence_boost", value: 5 }],
    linkedNodes: ["node96"],
    position: { x: 680, y: 600 } },

  { id: "node95", name: "Fortify VIII", description: "+5 Defence boost", branch: null, size: "node_minor",
    effects: [{ type: "talent_defence_boost", value: 5 }],
    linkedNodes: ["node96"],
    position: { x: 720, y: 620 } },

  { id: "node96", name: "Overheal II", description: "Pact healing overheals up to +30% of base HP", branch: null, size: "node_major",
    effects: [{ type: "talent_overhealing_via_talents", value: 30, unsupported: true }],
    linkedNodes: ["node59", "node94", "node95"],
    position: { x: 700, y: 600 } },

  // Prayer pen nodes
  { id: "node91", name: "Prayer Pen II", description: "+15% prayer penetration", branch: null, size: "node_minor",
    effects: [{ type: "talent_prayer_pen_all", value: 15, unsupported: true }],
    linkedNodes: ["node66"],
    position: { x: 740, y: 320 } },

  { id: "node97", name: "Prayer Pen III", description: "+15% prayer penetration", branch: null, size: "node_minor",
    effects: [{ type: "talent_prayer_pen_all", value: 15, unsupported: true }],
    linkedNodes: ["node96"],
    position: { x: 740, y: 640 } },

  { id: "node98", name: "Fortify IX", description: "+5 Defence boost", branch: null, size: "node_minor",
    effects: [{ type: "talent_defence_boost", value: 5 }],
    linkedNodes: ["node100"],
    position: { x: 780, y: 660 } },

  { id: "node99", name: "Fortify X", description: "+5 Defence boost", branch: null, size: "node_minor",
    effects: [{ type: "talent_defence_boost", value: 5 }],
    linkedNodes: ["node100"],
    position: { x: 760, y: 680 } },

  { id: "node100", name: "Overheal III", description: "Pact healing overheals up to +30% of base HP", branch: null, size: "node_major",
    effects: [{ type: "talent_overhealing_via_talents", value: 30, unsupported: true }],
    linkedNodes: ["node96", "node98", "node99", "node101", "node102"],
    position: { x: 760, y: 660 } },

  { id: "node101", name: "Prayer Pen IV", description: "+15% prayer penetration", branch: null, size: "node_minor",
    effects: [{ type: "talent_prayer_pen_all", value: 15, unsupported: true }],
    linkedNodes: ["node100"],
    position: { x: 800, y: 680 } },

  { id: "node102", name: "Prayer Restore", description: "No protection prayers: restore 1 prayer/15t", branch: null, size: "node_major",
    effects: [{ type: "talent_prayer_restore_no_overhead", value: true, unsupported: true }],
    linkedNodes: ["node100"],
    position: { x: 780, y: 700 } },

  // Spell speed nodes
  { id: "node122", name: "Spell Speed", description: "Spellbook combat spells: -2 ticks speed (min 2t = 1.2s)", branch: "magic", size: "node_major",
    effects: [{ type: "talent_magic_attack_speed_traditional", value: 2 }],
    linkedNodes: ["node127"],
    position: { x: 940, y: 620 } },

  { id: "node133", name: "Powered Staff Speed", description: "Powered staves: -3 ticks speed, 1H staves lose 8 max hit (min 1t)", branch: "magic", size: "node_major",
    effects: [{ type: "talent_magic_attack_speed_powered", value: 3 }],
    linkedNodes: ["node127"],
    position: { x: 960, y: 660 } },

  // Air spell nodes
  { id: "node107", name: "Air Prayer Damage", description: "Air spells: +7% damage per active prayer", branch: "magic", size: "node_major",
    effects: [{ type: "talent_air_spell_damage_active_prayers", value: 7 }],
    linkedNodes: ["node68", "node108", "node109", "node111"],
    position: { x: 860, y: 440 } },

  { id: "node108", name: "Magic Power V", description: "+1% magic damage", branch: "magic", size: "node_minor",
    effects: [{ type: "talent_percentage_magic_damage", value: 1 }],
    linkedNodes: ["node107"],
    position: { x: 900, y: 420 } },

  { id: "node109", name: "Air Max Hit Prayer", description: "Air spells: +1% chance to max hit per prayer bonus", branch: "magic", size: "node_capstone",
    effects: [{ type: "talent_air_spell_max_hit_prayer_bonus", value: 1, unsupported: true }],
    linkedNodes: ["node107"],
    position: { x: 880, y: 400 } },

  { id: "node111", name: "Smoke = Air", description: "Smoke spells count as air", branch: "magic", size: "node_major",
    effects: [{ type: "talent_smoke_counts_as_air", value: true, unsupported: true }],
    linkedNodes: ["node107"],
    position: { x: 840, y: 400 } },

  // Water spell nodes
  { id: "node112", name: "Water HP Damage", description: "Water spells: +20% damage at 100% health (scales)", branch: "magic", size: "node_major",
    effects: [{ type: "talent_water_spell_damage_high_hp", value: true }],
    linkedNodes: ["node69", "node113", "node114", "node123"],
    position: { x: 900, y: 500 } },

  { id: "node113", name: "Magic Power VI", description: "+1% magic damage", branch: "magic", size: "node_minor",
    effects: [{ type: "talent_percentage_magic_damage", value: 1 }],
    linkedNodes: ["node112"],
    position: { x: 940, y: 480 } },

  { id: "node114", name: "Water Heal", description: "Water spell hits heal you for 60% of damage dealt", branch: "magic", size: "node_capstone",
    effects: [{ type: "talent_water_spell_bouce_heal", value: true, unsupported: true }],
    linkedNodes: ["node112"],
    position: { x: 920, y: 460 } },

  { id: "node123", name: "Ice = Water", description: "Ice spells count as water", branch: "magic", size: "node_major",
    effects: [{ type: "talent_ice_counts_as_water", value: true, unsupported: true }],
    linkedNodes: ["node112"],
    position: { x: 880, y: 520 } },

  // Fire spell nodes
  { id: "node117", name: "Fire HP Consume", description: "Fire spells burn 6% of your max HP to add 2x that as damage", branch: "magic", size: "node_major",
    effects: [{ type: "talent_fire_hp_consume_for_damage", value: true, unsupported: true }],
    linkedNodes: ["node70", "node118", "node119", "node124"],
    position: { x: 940, y: 560 } },

  { id: "node118", name: "Magic Power VII", description: "+1% magic damage", branch: "magic", size: "node_minor",
    effects: [{ type: "talent_percentage_magic_damage", value: 1 }],
    linkedNodes: ["node117"],
    position: { x: 980, y: 540 } },

  { id: "node119", name: "Fire Burn Bounce", description: "Fire spell hits apply burn and bounce to nearby targets", branch: "magic", size: "node_capstone",
    effects: [{ type: "talent_fire_spell_burn_bounce", value: true, unsupported: true }],
    linkedNodes: ["node117"],
    position: { x: 960, y: 520 } },

  { id: "node124", name: "Blood = Fire", description: "Blood spells count as fire", branch: "magic", size: "node_major",
    effects: [{ type: "talent_blood_counts_as_fire", value: true, unsupported: true }],
    linkedNodes: ["node117"],
    position: { x: 920, y: 580 } },

  // Earth spell nodes
  { id: "node127", name: "Earth Def Reduce", description: "Earth spell hits reduce enemy Defence & Magic Def by 2", branch: "magic", size: "node_major",
    effects: [{ type: "talent_earth_reduce_defence", value: true, unsupported: true }],
    linkedNodes: ["node124", "node128", "node129", "node131", "node122", "node133"],
    position: { x: 960, y: 600 } },

  { id: "node128", name: "Magic Power VIII", description: "+1% magic damage", branch: "magic", size: "node_minor",
    effects: [{ type: "talent_percentage_magic_damage", value: 1 }],
    linkedNodes: ["node127"],
    position: { x: 1000, y: 580 } },

  { id: "node129", name: "Earth Def Scale", description: "Earth spells: +1 flat damage per 12 Defence levels", branch: "magic", size: "node_capstone",
    effects: [{ type: "talent_earth_scale_defence_stat", value: 12 }],
    linkedNodes: ["node127"],
    position: { x: 980, y: 560 } },

  { id: "node131", name: "Shadow = Earth", description: "Shadow spells count as earth", branch: "magic", size: "node_major",
    effects: [{ type: "talent_shadow_counts_as_earth", value: true, unsupported: true }],
    linkedNodes: ["node127"],
    position: { x: 940, y: 640 } },

  // Powered staff regen nodes (from magic side)
  { id: "node166", name: "Staff Regen Air", description: "Powered staff regen also generates 1 air rune", branch: "magic", size: "node_major",
    effects: [{ type: "talent_regen_stave_charges_air", value: true, unsupported: true }],
    linkedNodes: ["node45"],
    position: { x: 340, y: 620 } },

  { id: "node167", name: "Staff Regen Earth", description: "Powered staff regen also generates 1 earth rune", branch: "magic", size: "node_major",
    effects: [{ type: "talent_regen_stave_charges_earth", value: true, unsupported: true }],
    linkedNodes: ["node48"],
    position: { x: 440, y: 620 } },

  // Misc utility nodes
  { id: "node103", name: "Prayer Pen V", description: "+15% prayer penetration", branch: null, size: "node_minor",
    effects: [{ type: "talent_prayer_pen_all", value: 15, unsupported: true }],
    linkedNodes: ["node102"],
    position: { x: 820, y: 720 } },

  { id: "node106", name: "Prayer Pen VI", description: "+15% prayer penetration", branch: null, size: "node_minor",
    effects: [{ type: "talent_prayer_pen_all", value: 15, unsupported: true }],
    linkedNodes: ["node103"],
    position: { x: 840, y: 740 } },

  { id: "node134", name: "Prayer Pen VII", description: "+15% prayer penetration", branch: null, size: "node_minor",
    effects: [{ type: "talent_prayer_pen_all", value: 15, unsupported: true }],
    linkedNodes: ["node131"],
    position: { x: 960, y: 680 } },

  { id: "node135", name: "Shield Block Heal", description: "0-damage hits with shield/off-hand: heal 2 + restore 2 prayer", branch: null, size: "node_major",
    effects: [{ type: "talent_shield_block_heal", value: true, unsupported: true }],
    linkedNodes: ["node84"],
    position: { x: 720, y: 540 } },

  { id: "node136", name: "Prayer Pen VIII", description: "+15% prayer penetration", branch: null, size: "node_minor",
    effects: [{ type: "talent_prayer_pen_all", value: 15, unsupported: true }],
    linkedNodes: ["node134"],
    position: { x: 980, y: 700 } },

  { id: "node139", name: "Defence Recoil", description: "Recoil/Thorns: +1% of total defence bonuses as damage", branch: null, size: "node_major",
    effects: [{ type: "talent_defence_recoil_scaling", value: true, unsupported: true }],
    linkedNodes: ["node141"],
    position: { x: 160, y: 500 } },

  { id: "node146", name: "Melee Heal Chance II", description: "Melee/Thorns: +10% chance to heal based on distance", branch: "melee", size: "node_major",
    effects: [{ type: "talent_melee_distance_healing_chance", value: 10, unsupported: true }],
    linkedNodes: ["node145"],
    position: { x: 200, y: 640 } },

  { id: "node164", name: "Prayer Pen IX", description: "+15% prayer penetration", branch: null, size: "node_minor",
    effects: [{ type: "talent_prayer_pen_all", value: 15, unsupported: true }],
    linkedNodes: ["node136"],
    position: { x: 1000, y: 720 } },
];

// ═══════════════════════════════════════════════════════════════════════
// LOOKUP HELPERS
// ═══════════════════════════════════════════════════════════════════════

const nodeMap = new Map(PACT_NODES.map(n => [n.id, n]));

export function getNode(id: string): PactNode | undefined {
  return nodeMap.get(id);
}

export function getAllNodes(): PactNode[] {
  return PACT_NODES;
}

// ═══════════════════════════════════════════════════════════════════════
// GRAPH VALIDATION
// ═══════════════════════════════════════════════════════════════════════

const ROOT_NODE = "node1";

/** Check if a node can be selected given the current selection */
export function canSelectNode(nodeId: string, selected: Set<string>): boolean {
  if (selected.has(nodeId)) return false;
  if (selected.size >= PACT_POINT_LIMIT) return false;

  // Root node can always be selected first
  if (nodeId === ROOT_NODE && selected.size === 0) return true;

  // Must be adjacent to at least one already-selected node
  const node = nodeMap.get(nodeId);
  if (!node) return false;
  return node.linkedNodes.some(id => selected.has(id));
}

/** Check if a node can be deselected without disconnecting the tree */
export function canDeselectNode(nodeId: string, selected: Set<string>): boolean {
  if (!selected.has(nodeId)) return false;

  // If only 1 node selected, can always deselect
  if (selected.size === 1) return true;

  // Build the graph of remaining selected nodes (without this node)
  const remaining = new Set(selected);
  remaining.delete(nodeId);

  // BFS from any remaining node — all must be reachable
  const start = remaining.values().next().value!;
  const visited = new Set<string>();
  const queue = [start];
  visited.add(start);

  while (queue.length > 0) {
    const current = queue.shift()!;
    const node = nodeMap.get(current);
    if (!node) continue;
    for (const neighbor of node.linkedNodes) {
      if (remaining.has(neighbor) && !visited.has(neighbor)) {
        visited.add(neighbor);
        queue.push(neighbor);
      }
    }
  }

  return visited.size === remaining.size;
}

/** Validate a full selection: connected, within budget, and root is included */
export function validateSelection(selected: Set<string>): { valid: boolean; error?: string } {
  if (selected.size === 0) return { valid: true };
  if (selected.size > PACT_POINT_LIMIT) return { valid: false, error: `Exceeds ${PACT_POINT_LIMIT} point limit` };
  if (!selected.has(ROOT_NODE)) return { valid: false, error: "Must include root node" };

  // Check connectivity via BFS from root
  const visited = new Set<string>();
  const queue = [ROOT_NODE];
  visited.add(ROOT_NODE);

  while (queue.length > 0) {
    const current = queue.shift()!;
    const node = nodeMap.get(current);
    if (!node) continue;
    for (const neighbor of node.linkedNodes) {
      if (selected.has(neighbor) && !visited.has(neighbor)) {
        visited.add(neighbor);
        queue.push(neighbor);
      }
    }
  }

  if (visited.size !== selected.size) return { valid: false, error: "Selection is not connected" };
  return { valid: true };
}
