/**
 * Pact Effects & Skill Tree Tests
 *
 * Tests the pact aggregation layer and graph validation:
 * - aggregatePactEffects correctly sums effects
 * - canSelectNode enforces graph adjacency + budget
 * - canDeselectNode prevents disconnection
 * - validateSelection verifies root, connectivity, budget
 * - Unsupported effects are skipped
 */
import { describe, it, expect } from "vitest";
import { aggregatePactEffects } from "@/lib/pact-effects";
import {
  PACT_NODES,
  getNode,
  canSelectNode,
  canDeselectNode,
  validateSelection,
} from "@/data/pacts";
import { PACT_POINT_LIMIT } from "@/types/dps";

// ═══════════════════════════════════════════════════════════════════════
// AGGREGATION
// ═══════════════════════════════════════════════════════════════════════

describe("aggregatePactEffects", () => {
  it("empty selection returns all defaults", () => {
    const pe = aggregatePactEffects([]);
    expect(pe.allStyleAccuracyPercent).toBe(0);
    expect(pe.rangedDamagePercent).toBe(0);
    expect(pe.meleeDamagePercent).toBe(0);
    expect(pe.magicDamagePercent).toBe(0);
    expect(pe.bowFastHits).toBe(false);
    expect(pe.crossbowSlowBigHits).toBe(false);
    expect(pe.lightWeaponDoubleHit).toBe(false);
  });

  it("root node (node1) gives 50% regen ammo", () => {
    const pe = aggregatePactEffects(["node1"]);
    expect(pe.regenAmmoChance).toBe(50);
  });

  it("accuracy nodes sum correctly", () => {
    // node7 = +15%, node55 = +15%, node56 = +15%, node57 = +15%
    const pe = aggregatePactEffects(["node1", "node7", "node6", "node11", "node55", "node56", "node57"]);
    // node7(15) + node11(35) + node55(15) + node56(15) + node57(15) = 95
    expect(pe.allStyleAccuracyPercent).toBe(95);
  });

  it("ranged damage percent nodes sum correctly", () => {
    // node13 (+1%), node15 (+1%), node17 (+1%)
    const pe = aggregatePactEffects(["node1", "node7", "node2", "node13", "node15", "node17"]);
    expect(pe.rangedDamagePercent).toBe(3);
  });

  it("boolean effects toggle on", () => {
    // node20 = bowFastHits
    const pe = aggregatePactEffects(["node1", "node7", "node2", "node3", "node20"]);
    expect(pe.bowFastHits).toBe(true);
  });

  it("crossbow effects aggregate", () => {
    // node21 = crossbowSlowBigHits, node4 = crossbow echo reproc +15%
    const pe = aggregatePactEffects(["node1", "node7", "node2", "node4", "node21"]);
    expect(pe.crossbowSlowBigHits).toBe(true);
    expect(pe.crossbowEchoReprocChance).toBe(15);
  });

  it("unsupported effects are skipped", () => {
    // node26 = Bow Min Hit Stack (unsupported)
    const pe = aggregatePactEffects(["node1", "node7", "node2", "node3", "node20", "node26"]);
    // The unsupported effect shouldn't crash or change anything
    // bowFastHits from node20 should still work
    expect(pe.bowFastHits).toBe(true);
  });

  it("invalid node IDs are silently ignored", () => {
    const pe = aggregatePactEffects(["node1", "nonexistent-node-xyz"]);
    expect(pe.regenAmmoChance).toBe(50);
  });

  it("melee pact chain sums correctly", () => {
    // Build a path: node1→node6→node11→node56→node60→node140→node143→node145→node151→node154→node156
    const ids = ["node1", "node6", "node11", "node56", "node60", "node140", "node143", "node145", "node151", "node154", "node156"];
    const pe = aggregatePactEffects(ids);
    // node140(+1%) + node143(+1%) + node145(+1%) + node151(+1%) + node154(+1%) + node156(+1%) = 6
    expect(pe.meleeDamagePercent).toBe(6);
  });

  it("magic damage nodes sum correctly", () => {
    // node67(+1%), node68(+1%), node69(+1%), node70(+1%)
    const ids = ["node1", "node8", "node58", "node83", "node86", "node67", "node68", "node69", "node70"];
    const pe = aggregatePactEffects(ids);
    expect(pe.magicDamagePercent).toBe(4);
  });

  it("offhand stat boost toggles from node12", () => {
    const pe = aggregatePactEffects(["node1", "node9", "node12"]);
    expect(pe.offhandStatBoost).toBe(true);
  });

  it("echo cascade from node18", () => {
    const ids = ["node1", "node7", "node2", "node13", "node15", "node17", "node18"];
    const pe = aggregatePactEffects(ids);
    expect(pe.rangedEchoCyclical).toBe(true);
  });

  it("earth defence scaling from node129", () => {
    const ids = ["node1", "node8", "node58", "node83", "node86", "node67", "node68", "node69", "node70", "node117", "node124", "node127", "node129"];
    const pe = aggregatePactEffects(ids);
    expect(pe.earthScaleDefenceStat).toBe(12);
  });

  it("spell speed reduction from node122", () => {
    const ids = ["node1", "node8", "node58", "node83", "node86", "node67", "node68", "node69", "node70", "node117", "node124", "node127", "node122"];
    const pe = aggregatePactEffects(ids);
    expect(pe.magicSpellSpeedReduction).toBe(2);
  });

  it("powered staff speed from node133", () => {
    const ids = ["node1", "node8", "node58", "node83", "node86", "node67", "node68", "node69", "node70", "node117", "node124", "node127", "node133"];
    const pe = aggregatePactEffects(ids);
    expect(pe.poweredStaffSpeedReduction).toBe(3);
  });
});

// ═══════════════════════════════════════════════════════════════════════
// GRAPH VALIDATION — canSelectNode
// ═══════════════════════════════════════════════════════════════════════

describe("canSelectNode", () => {
  it("root node can be selected first", () => {
    expect(canSelectNode("node1", new Set())).toBe(true);
  });

  it("non-root node cannot be selected first", () => {
    expect(canSelectNode("node7", new Set())).toBe(false);
  });

  it("adjacent node can be selected", () => {
    // node2 is linked to node1
    expect(canSelectNode("node2", new Set(["node1"]))).toBe(true);
  });

  it("non-adjacent node cannot be selected", () => {
    // node20 is not adjacent to node1
    expect(canSelectNode("node20", new Set(["node1"]))).toBe(false);
  });

  it("already selected node cannot be re-selected", () => {
    expect(canSelectNode("node1", new Set(["node1"]))).toBe(false);
  });

  it("cannot exceed point limit", () => {
    // Create a set at the limit
    const maxSet = new Set<string>();
    for (let i = 0; i < PACT_POINT_LIMIT; i++) {
      maxSet.add(`fake-node-${i}`);
    }
    expect(canSelectNode("node1", maxSet)).toBe(false);
  });

  it("deep path selection works", () => {
    // node1 → node2 → node3 → node6 → node9 → node13
    const selected = new Set(["node1", "node2", "node3", "node6", "node9"]);
    expect(canSelectNode("node13", selected)).toBe(true);
  });
});

// ═══════════════════════════════════════════════════════════════════════
// GRAPH VALIDATION — canDeselectNode
// ═══════════════════════════════════════════════════════════════════════

describe("canDeselectNode", () => {
  it("single node can be deselected", () => {
    expect(canDeselectNode("node1", new Set(["node1"]))).toBe(true);
  });

  it("leaf node can be deselected", () => {
    // node7 is a leaf if only node1 and node7 selected
    expect(canDeselectNode("node7", new Set(["node1", "node7"]))).toBe(true);
  });

  it("bridge node cannot be deselected (would disconnect)", () => {
    // node1 → node2 → node3: removing node2 disconnects node3
    expect(canDeselectNode("node2", new Set(["node1", "node2", "node3"]))).toBe(false);
  });

  it("non-bridge internal node can be deselected if alternate path exists", () => {
    // node1 → node2, node1 → node74: removing node74 doesn't disconnect if node2 is leaf
    expect(canDeselectNode("node74", new Set(["node1", "node2", "node74"]))).toBe(true);
  });

  it("unselected node returns false", () => {
    expect(canDeselectNode("node99", new Set(["node1"]))).toBe(false);
  });
});

// ═══════════════════════════════════════════════════════════════════════
// GRAPH VALIDATION — validateSelection
// ═══════════════════════════════════════════════════════════════════════

describe("validateSelection", () => {
  it("empty selection is valid", () => {
    expect(validateSelection(new Set()).valid).toBe(true);
  });

  it("root only is valid", () => {
    expect(validateSelection(new Set(["node1"])).valid).toBe(true);
  });

  it("connected subtree is valid", () => {
    expect(validateSelection(new Set(["node1", "node2", "node3"])).valid).toBe(true);
  });

  it("disconnected selection is invalid", () => {
    const result = validateSelection(new Set(["node1", "node20"]));
    expect(result.valid).toBe(false);
    expect(result.error).toContain("not connected");
  });

  it("missing root is invalid", () => {
    const result = validateSelection(new Set(["node7"]));
    expect(result.valid).toBe(false);
    expect(result.error).toContain("root");
  });

  it("exceeding point limit is invalid", () => {
    const bigSet = new Set<string>();
    bigSet.add("node1");
    for (let i = 0; i < PACT_POINT_LIMIT; i++) {
      bigSet.add(`node-${i}`);
    }
    const result = validateSelection(bigSet);
    expect(result.valid).toBe(false);
    expect(result.error).toContain("limit");
  });
});

// ═══════════════════════════════════════════════════════════════════════
// PACT NODE DATA INTEGRITY
// ═══════════════════════════════════════════════════════════════════════

describe("pact node data integrity", () => {
  it("all nodes have unique IDs", () => {
    const ids = PACT_NODES.map(n => n.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it("all linkedNodes reference existing nodes", () => {
    const allIds = new Set(PACT_NODES.map(n => n.id));
    for (const node of PACT_NODES) {
      for (const linked of node.linkedNodes) {
        expect(allIds.has(linked)).toBe(true);
      }
    }
  });

  it("links are bidirectional", () => {
    for (const node of PACT_NODES) {
      for (const linked of node.linkedNodes) {
        const targetNode = getNode(linked);
        expect(targetNode).toBeDefined();
        expect(targetNode!.linkedNodes).toContain(node.id);
      }
    }
  });

  it("root node (node1) exists and has links", () => {
    const root = getNode("node1");
    expect(root).toBeDefined();
    expect(root!.linkedNodes.length).toBeGreaterThan(0);
  });

  it("all nodes have at least one effect", () => {
    for (const node of PACT_NODES) {
      expect(node.effects.length).toBeGreaterThan(0);
    }
  });

  it("all nodes have valid position coordinates", () => {
    for (const node of PACT_NODES) {
      expect(Number.isFinite(node.position.x)).toBe(true);
      expect(Number.isFinite(node.position.y)).toBe(true);
    }
  });

  it("all nodes are reachable from root", () => {
    const visited = new Set<string>();
    const queue = ["node1"];
    visited.add("node1");

    while (queue.length > 0) {
      const current = queue.shift()!;
      const node = getNode(current);
      if (!node) continue;
      for (const neighbor of node.linkedNodes) {
        if (!visited.has(neighbor)) {
          visited.add(neighbor);
          queue.push(neighbor);
        }
      }
    }

    // Every node should be reachable from root
    for (const node of PACT_NODES) {
      expect(visited.has(node.id)).toBe(true);
    }
  });

  it("point limit is 40", () => {
    expect(PACT_POINT_LIMIT).toBe(40);
  });
});
