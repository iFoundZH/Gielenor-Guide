import type { OptimalQuestGuide } from "@/types/guides";

export { mainQuestGuide } from "./optimal-quest-guide";
export { ironmanQuestGuide } from "./optimal-quest-guide-ironman";

import { mainQuestGuide } from "./optimal-quest-guide";
import { ironmanQuestGuide } from "./optimal-quest-guide-ironman";

export const questGuides: OptimalQuestGuide[] = [mainQuestGuide, ironmanQuestGuide];

export function getQuestGuide(variant: "main" | "ironman" = "main"): OptimalQuestGuide {
  return variant === "ironman" ? ironmanQuestGuide : mainQuestGuide;
}
