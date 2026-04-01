import type { IronmanGuide } from "@/types/guides";

import { standardIronmanGuide } from "./standard";
import { hardcoreIronmanGuide } from "./hardcore";
import { ultimateIronmanGuide } from "./ultimate";
import { groupIronmanGuide } from "./group";

export const ironmanGuides: IronmanGuide[] = [
  standardIronmanGuide,
  hardcoreIronmanGuide,
  ultimateIronmanGuide,
  groupIronmanGuide,
];

export function getIronmanGuide(variant: string): IronmanGuide | undefined {
  return ironmanGuides.find((g) => g.variant === variant);
}
