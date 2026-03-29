import type { SnowflakeGuide } from "@/types/guides";

import { karamjaOnlyGuide } from "./karamja-only";
import { morytaniaOnlyGuide } from "./morytania-only";
import { tirannwnOnlyGuide } from "./tirannwn-only";
import { wildernessOnlyGuide } from "./wilderness-only";
import { oneDefPureGuide } from "./1-def-pure";
import { tenHpGuide } from "./10-hp";
import { skillerGuide } from "./skiller";
import { f2pOnlyGuide } from "./f2p-only";

export const snowflakeGuides: SnowflakeGuide[] = [
  karamjaOnlyGuide,
  morytaniaOnlyGuide,
  tirannwnOnlyGuide,
  wildernessOnlyGuide,
  oneDefPureGuide,
  tenHpGuide,
  skillerGuide,
  f2pOnlyGuide,
];

export function getSnowflakeGuide(id: string): SnowflakeGuide | undefined {
  return snowflakeGuides.find((g) => g.id === id);
}
