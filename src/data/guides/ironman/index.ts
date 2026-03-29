import type { IronmanGuide } from "@/types/guides";

import { standardIronmanGuide } from "./standard";
import { ultimateIronmanGuide } from "./ultimate";

export const ironmanGuides: IronmanGuide[] = [
  standardIronmanGuide,
  ultimateIronmanGuide,
];

export function getIronmanGuide(variant: string): IronmanGuide | undefined {
  return ironmanGuides.find((g) => g.variant === variant);
}
