import type {
  OptimizerConfig,
  OptimizerResult,
  BuildLoadout,
  Item,
  EquipmentSlot,
  CombatStyle,
} from "@/types/dps";
import { ITEMS } from "@/data/items";
import { calculateDps } from "@/lib/dps-engine";

// ═══════════════════════════════════════════════════════════════════════
// PUBLIC API
// ═══════════════════════════════════════════════════════════════════════

export function optimizeGear(config: OptimizerConfig): OptimizerResult[] {
  const { player, target, lockedSlots, topN } = config;
  const style = player.combatStyle;
  const regions = player.regions;

  // Step 1: Get available items by slot (filtered by region + style)
  const slotItems = getSlotCandidates(style, regions, lockedSlots);

  // Step 2: Prune dominated items per slot
  for (const slot of Object.keys(slotItems) as EquipmentSlot[]) {
    if (lockedSlots[slot]) continue; // don't prune locked slots
    slotItems[slot] = pruneDominated(slotItems[slot], style);
  }

  // Step 3: Weapon-first enumeration
  const weapons = slotItems.weapon;
  const heap: OptimizerResult[] = [];

  for (const weapon of weapons) {
    // If 2H, shield slot is blocked
    const shields = weapon.isTwoHanded ? [null] : slotItems.shield;

    for (const shield of shields) {
      // Build the best loadout for this weapon+shield combo
      const loadout = buildBestLoadout(slotItems, weapon, shield, lockedSlots);

      const ctx = { player, loadout, target };
      const result = calculateDps(ctx);

      insertIntoHeap(heap, { loadout, result }, topN);
    }
  }

  return heap.sort((a, b) => b.result.dps - a.result.dps);
}

// ═══════════════════════════════════════════════════════════════════════
// SLOT CANDIDATES
// ═══════════════════════════════════════════════════════════════════════

type SlotItemMap = { [slot in EquipmentSlot]: Item[] };

function getSlotCandidates(
  style: CombatStyle,
  regions: string[],
  locked: Partial<BuildLoadout>,
): SlotItemMap {
  const result: SlotItemMap = {
    head: [], cape: [], neck: [], ammo: [], weapon: [],
    body: [], shield: [], legs: [], hands: [], feet: [], ring: [],
  };

  for (const item of ITEMS) {
    // Region check
    if (item.region && !regions.includes(item.region)) continue;

    // Slot
    const slot = item.slot;

    // If locked, only include the locked item
    if (locked[slot]) continue;

    // Weapon must match combat style
    if (slot === "weapon") {
      if (item.combatStyle && item.combatStyle !== style) continue;
      result.weapon.push(item);
      continue;
    }

    // For non-weapon slots, include if it has any offensive value for the style
    if (isUsefulForStyle(item, style)) {
      result[slot].push(item);
    }
  }

  // Add "none" option for optional slots (ammo, shield, cape, etc.)
  // Weapons must always be filled
  for (const slot of Object.keys(result) as EquipmentSlot[]) {
    if (slot === "weapon") continue;
    if (locked[slot]) {
      result[slot] = [locked[slot]!];
    }
  }

  // Add locked items
  for (const slot of Object.keys(locked) as EquipmentSlot[]) {
    if (locked[slot]) {
      result[slot] = [locked[slot]!];
    }
  }

  return result;
}

function isUsefulForStyle(item: Item, style: CombatStyle): boolean {
  const b = item.bonuses;
  switch (style) {
    case "melee":
      return b.mstr > 0 || b.astab > 0 || b.aslash > 0 || b.acrush > 0 || b.prayer > 0;
    case "ranged":
      return b.rstr > 0 || b.aranged > 0 || b.prayer > 0;
    case "magic":
      return b.mdmg > 0 || b.amagic > 0 || b.prayer > 0;
  }
}

// ═══════════════════════════════════════════════════════════════════════
// DOMINATED ITEM PRUNING
// ═══════════════════════════════════════════════════════════════════════

function pruneDominated(items: Item[], style: CombatStyle): Item[] {
  if (items.length <= 1) return items;

  return items.filter((item, i) => {
    // Keep items with passives — they can't be easily dominated
    if (item.passive) return true;

    for (let j = 0; j < items.length; j++) {
      if (i === j) continue;
      if (dominates(items[j], item, style)) return false;
    }
    return true;
  });
}

function dominates(a: Item, b: Item, style: CombatStyle): boolean {
  // a dominates b if a is >= b in all offensive stats and > in at least one
  const ab = a.bonuses;
  const bb = b.bonuses;

  let strictlyBetter = false;

  switch (style) {
    case "melee": {
      if (ab.mstr < bb.mstr) return false;
      if (ab.astab < bb.astab) return false;
      if (ab.aslash < bb.aslash) return false;
      if (ab.acrush < bb.acrush) return false;
      if (ab.prayer < bb.prayer) return false;
      if (ab.mstr > bb.mstr || ab.astab > bb.astab || ab.aslash > bb.aslash || ab.acrush > bb.acrush || ab.prayer > bb.prayer) strictlyBetter = true;
      break;
    }
    case "ranged": {
      if (ab.rstr < bb.rstr) return false;
      if (ab.aranged < bb.aranged) return false;
      if (ab.prayer < bb.prayer) return false;
      if (ab.rstr > bb.rstr || ab.aranged > bb.aranged || ab.prayer > bb.prayer) strictlyBetter = true;
      break;
    }
    case "magic": {
      if (ab.mdmg < bb.mdmg) return false;
      if (ab.amagic < bb.amagic) return false;
      if (ab.prayer < bb.prayer) return false;
      if (ab.mdmg > bb.mdmg || ab.amagic > bb.amagic || ab.prayer > bb.prayer) strictlyBetter = true;
      break;
    }
  }

  return strictlyBetter;
}

// ═══════════════════════════════════════════════════════════════════════
// BEST LOADOUT CONSTRUCTION
// ═══════════════════════════════════════════════════════════════════════

function buildBestLoadout(
  slotItems: SlotItemMap,
  weapon: Item,
  shield: Item | null,
  locked: Partial<BuildLoadout>,
): BuildLoadout {
  const loadout: BuildLoadout = {
    head: null, cape: null, neck: null, ammo: null,
    weapon, body: null, shield, legs: null,
    hands: null, feet: null, ring: null,
  };

  // Apply locked slots
  for (const slot of Object.keys(locked) as EquipmentSlot[]) {
    if (locked[slot]) {
      loadout[slot] = locked[slot]!;
    }
  }

  // For each non-fixed slot, pick the best item by offensive value
  const style = weapon.combatStyle ?? "melee";
  const freeSlots: EquipmentSlot[] = ["head", "cape", "neck", "ammo", "body", "legs", "hands", "feet", "ring"];

  for (const slot of freeSlots) {
    if (locked[slot]) continue;
    if (slot === "shield" && weapon.isTwoHanded) continue;

    const candidates = slotItems[slot];
    if (candidates.length === 0) continue;

    let bestItem: Item | null = null;
    let bestScore = -Infinity;

    for (const item of candidates) {
      const score = offensiveScore(item, style);
      if (score > bestScore) {
        bestScore = score;
        bestItem = item;
      }
    }

    if (bestItem && bestScore > 0) {
      loadout[slot] = bestItem;
    }
  }

  return loadout;
}

function offensiveScore(item: Item, style: string): number {
  const b = item.bonuses;
  switch (style) {
    case "melee":
      return b.mstr * 2 + Math.max(b.astab, b.aslash, b.acrush) + b.prayer * 0.5;
    case "ranged":
      return b.rstr * 2 + b.aranged + b.prayer * 0.5;
    case "magic":
      return b.mdmg * 3 + b.amagic + b.prayer * 0.5;
    default:
      return 0;
  }
}

// ═══════════════════════════════════════════════════════════════════════
// MIN-HEAP (top N by DPS)
// ═══════════════════════════════════════════════════════════════════════

function insertIntoHeap(heap: OptimizerResult[], item: OptimizerResult, maxSize: number): void {
  if (heap.length < maxSize) {
    heap.push(item);
  } else {
    // Find the minimum DPS in heap
    let minIdx = 0;
    for (let i = 1; i < heap.length; i++) {
      if (heap[i].result.dps < heap[minIdx].result.dps) {
        minIdx = i;
      }
    }
    if (item.result.dps > heap[minIdx].result.dps) {
      heap[minIdx] = item;
    }
  }
}
