"use client";

import { useReducer, useMemo, useState, useCallback } from "react";
import type {
  PlayerConfig,
  BossPreset,
  BuildLoadout,
  EquipmentSlot,
  Item,
  OptimizerResult,
  OptimizedConfig,
  DpsResult,
  CombatStyle,
  PotionType,
  PrayerType,
  AttackStyleBonus,
} from "@/types/dps";
import { BOSS_PRESETS } from "@/data/boss-presets";
import { calculateDps } from "@/lib/dps-engine";
import { optimizeBuild } from "@/lib/gear-optimizer";
import { PlayerConfigPanel } from "@/components/calculator/PlayerConfigPanel";
import { BossSelector } from "@/components/calculator/BossSelector";
import { RegionSelector } from "@/components/calculator/RegionSelector";
import { PactSkillTree } from "@/components/calculator/PactSkillTree";
import { GearGrid } from "@/components/calculator/GearGrid";
import { ItemPicker } from "@/components/calculator/ItemPicker";
import { DpsResultCard } from "@/components/calculator/DpsResultCard";
import { DpsBreakdown } from "@/components/calculator/DpsBreakdown";
import { TopBuildsPanel } from "@/components/calculator/TopBuildsPanel";

// ═══════════════════════════════════════════════════════════════════════
// STATE
// ═══════════════════════════════════════════════════════════════════════

interface CalcState {
  player: PlayerConfig;
  target: BossPreset;
  loadout: BuildLoadout;
  lockedSlots: Set<EquipmentSlot>;
}

const DEFAULT_PLAYER: PlayerConfig = {
  attack: 99, strength: 99, defence: 99, ranged: 99, magic: 99, prayer: 99, hitpoints: 99,
  potion: "auto", prayerType: "auto", attackStyle: "auto", combatStyle: "melee",
  regions: ["varlamore", "karamja", "misthalin"],
  activePacts: [],
  voidSet: "auto", onSlayerTask: false, targetDistance: 1,
};

const EMPTY_LOADOUT: BuildLoadout = {
  head: null, cape: null, neck: null, ammo: null, weapon: null,
  body: null, shield: null, legs: null, hands: null, feet: null, ring: null,
};

type Action =
  | { type: "SET_PLAYER"; player: PlayerConfig }
  | { type: "SET_TARGET"; target: BossPreset }
  | { type: "SET_LOADOUT"; loadout: BuildLoadout }
  | { type: "SET_SLOT"; slot: EquipmentSlot; item: Item | null }
  | { type: "TOGGLE_LOCK"; slot: EquipmentSlot };

function reducer(state: CalcState, action: Action): CalcState {
  switch (action.type) {
    case "SET_PLAYER": {
      // Clear loadout when combat style changes (gear is style-specific)
      if (action.player.combatStyle !== state.player.combatStyle) {
        return { ...state, player: action.player, loadout: EMPTY_LOADOUT };
      }
      return { ...state, player: action.player };
    }
    case "SET_TARGET":
      return { ...state, target: action.target };
    case "SET_LOADOUT":
      return { ...state, loadout: action.loadout };
    case "SET_SLOT": {
      const loadout = { ...state.loadout, [action.slot]: action.item };
      // If equipping a 2H weapon, clear shield
      if (action.slot === "weapon" && action.item?.isTwoHanded) {
        loadout.shield = null;
      }
      return { ...state, loadout };
    }
    case "TOGGLE_LOCK": {
      const locked = new Set(state.lockedSlots);
      if (locked.has(action.slot)) locked.delete(action.slot);
      else locked.add(action.slot);
      return { ...state, lockedSlots: locked };
    }
  }
}

// ═══════════════════════════════════════════════════════════════════════
// AUTO RESOLUTION
// ═══════════════════════════════════════════════════════════════════════

function resolveAutoDefaults(style: CombatStyle): {
  potion: Exclude<PotionType, "auto">;
  prayerType: Exclude<PrayerType, "auto">;
  attackStyle: Exclude<AttackStyleBonus, "auto">;
  voidSet: "none" | "void" | "elite-void";
} {
  switch (style) {
    case "melee":
      return { potion: "super-combat", prayerType: "piety", attackStyle: "aggressive", voidSet: "none" };
    case "ranged":
      return { potion: "ranging", prayerType: "rigour", attackStyle: "rapid", voidSet: "none" };
    case "magic":
      return { potion: "magic", prayerType: "augury", attackStyle: "autocast", voidSet: "none" };
  }
}

function resolveAutoForDisplay(player: PlayerConfig): PlayerConfig {
  const defaults = resolveAutoDefaults(player.combatStyle);
  return {
    ...player,
    potion: player.potion === "auto" ? defaults.potion : player.potion,
    prayerType: player.prayerType === "auto" ? defaults.prayerType : player.prayerType,
    attackStyle: player.attackStyle === "auto" ? defaults.attackStyle : player.attackStyle,
    voidSet: player.voidSet === "auto" ? defaults.voidSet : player.voidSet,
  };
}

// ═══════════════════════════════════════════════════════════════════════
// PAGE
// ═══════════════════════════════════════════════════════════════════════

export default function CalculatorPage() {
  const [state, dispatch] = useReducer(reducer, {
    player: DEFAULT_PLAYER,
    target: BOSS_PRESETS[0],
    loadout: EMPTY_LOADOUT,
    lockedSlots: new Set<EquipmentSlot>(),
  });

  const [pickerSlot, setPickerSlot] = useState<EquipmentSlot | null>(null);
  const [optimizerResults, setOptimizerResults] = useState<OptimizerResult[]>([]);
  const [isOptimizing, setIsOptimizing] = useState(false);

  // Compute DPS reactively (resolve auto values for live display)
  const dpsResult: DpsResult | null = useMemo(() => {
    if (!state.loadout.weapon) return null;
    return calculateDps({
      player: resolveAutoForDisplay(state.player),
      loadout: state.loadout,
      target: state.target,
    });
  }, [state.player, state.loadout, state.target]);

  const applyOptimizedConfig = useCallback((opt?: OptimizedConfig) => {
    if (!opt) return;
    const updates: Partial<PlayerConfig> = {};
    if (opt.potion) updates.potion = opt.potion;
    if (opt.prayerType) updates.prayerType = opt.prayerType;
    if (opt.attackStyle) updates.attackStyle = opt.attackStyle;
    if (opt.voidSet) updates.voidSet = opt.voidSet;
    if (opt.activePacts) updates.activePacts = opt.activePacts;
    if (opt.spellMaxHit !== undefined) updates.spellMaxHit = opt.spellMaxHit;
    if (opt.regions) updates.regions = opt.regions;
    if (Object.keys(updates).length > 0) {
      dispatch({ type: "SET_PLAYER", player: { ...state.player, ...updates } });
    }
  }, [state.player]);

  const handleOptimize = useCallback(() => {
    setIsOptimizing(true);
    // Run optimizer in next tick to avoid blocking UI
    setTimeout(() => {
      const lockedLoadout: Partial<BuildLoadout> = {};
      for (const slot of state.lockedSlots) {
        if (state.loadout[slot]) {
          lockedLoadout[slot] = state.loadout[slot];
        }
      }

      const results = optimizeBuild({
        player: state.player,
        target: state.target,
        lockedSlots: lockedLoadout,
        topN: 10,
      });

      setOptimizerResults(results);
      setIsOptimizing(false);

      // Auto-load the best result (loadout + optimized config)
      if (results.length > 0) {
        dispatch({ type: "SET_LOADOUT", loadout: results[0].loadout });
        applyOptimizedConfig(results[0].optimizedConfig);
      }
    }, 10);
  }, [state.player, state.target, state.lockedSlots, state.loadout, applyOptimizedConfig]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
      <h1
        className="text-3xl font-bold text-osrs-gold mb-6"
        style={{ fontFamily: "var(--font-runescape)" }}
      >
        DPS Calculator
      </h1>

      {/* ── FULL-WIDTH PACT TREE ──────────────────────────────── */}
      <div className="bg-osrs-panel border border-osrs-border rounded-xl p-4 mb-6">
        <PactSkillTree
          selected={state.player.activePacts}
          onChange={p => dispatch({ type: "SET_PLAYER", player: { ...state.player, activePacts: p } })}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* ── LEFT PANEL: Configuration ──────────────────────────── */}
        <div className="lg:col-span-3 space-y-6">
          <div className="bg-osrs-panel border border-osrs-border rounded-xl p-4">
            <PlayerConfigPanel
              config={state.player}
              onChange={p => dispatch({ type: "SET_PLAYER", player: p })}
            />
          </div>

          <div className="bg-osrs-panel border border-osrs-border rounded-xl p-4">
            <BossSelector
              selected={state.target}
              onSelect={t => dispatch({ type: "SET_TARGET", target: t })}
            />
          </div>

          <div className="bg-osrs-panel border border-osrs-border rounded-xl p-4">
            <RegionSelector
              selected={state.player.regions}
              onChange={r => dispatch({ type: "SET_PLAYER", player: { ...state.player, regions: r } })}
            />
          </div>
        </div>

        {/* ── CENTER PANEL: Top Builds ──────────────────────────── */}
        <div className="lg:col-span-4">
          <div className="bg-osrs-panel border border-osrs-border rounded-xl p-4">
            <TopBuildsPanel
              results={optimizerResults}
              isRunning={isOptimizing}
              onSelect={(loadout, optimizedConfig) => {
                dispatch({ type: "SET_LOADOUT", loadout });
                applyOptimizedConfig(optimizedConfig);
              }}
              onOptimize={handleOptimize}
            />
          </div>
        </div>

        {/* ── RIGHT PANEL: Gear + DPS ───────────────────────────── */}
        <div className="lg:col-span-5 space-y-4">
          <DpsResultCard result={dpsResult} />

          <div className="bg-osrs-panel border border-osrs-border rounded-xl p-4">
            <GearGrid
              loadout={state.loadout}
              onSlotClick={slot => setPickerSlot(slot)}
              lockedSlots={state.lockedSlots}
            />
          </div>

          <div className="bg-osrs-panel border border-osrs-border rounded-xl p-4">
            <DpsBreakdown breakdown={dpsResult?.breakdown ?? null} />
          </div>
        </div>
      </div>

      {/* Item Picker Modal */}
      {pickerSlot && (
        <ItemPicker
          slot={pickerSlot}
          style={state.player.combatStyle}
          regions={state.player.regions}
          onSelect={item => {
            dispatch({ type: "SET_SLOT", slot: pickerSlot, item });
            setPickerSlot(null);
          }}
          onClose={() => setPickerSlot(null)}
        />
      )}
    </div>
  );
}
