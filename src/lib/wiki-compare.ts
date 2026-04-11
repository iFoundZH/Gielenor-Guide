import type { PlayerConfig, BuildLoadout, BossPreset } from "@/types/dps";

/**
 * Builds a URL to the OSRS wiki DPS calculator with matching parameters.
 * The wiki calc uses URL hash-based state, but the simplest approach is
 * just linking to the base calc page — users can set it up manually.
 * A full parameter mapping would require reverse-engineering the wiki calc's
 * serialization format which changes over time.
 */
export function buildWikiCalcUrl(
  _player: PlayerConfig,
  _loadout: BuildLoadout,
  _target: BossPreset,
): string {
  return "https://tools.runescape.wiki/osrs-dps/";
}
