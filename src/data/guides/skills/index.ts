import type { SkillTrainingGuide } from "@/types/guides";

import { rangedP2pGuide } from "./ranged-p2p";
import { rangedF2pGuide } from "./ranged-f2p";
import { magicP2pGuide } from "./magic-p2p";
import { magicF2pGuide } from "./magic-f2p";
import { runecraftP2pGuide } from "./runecraft-p2p";
import { runecraftF2pGuide } from "./runecraft-f2p";
import { craftingP2pGuide } from "./crafting-p2p";
import { craftingF2pGuide } from "./crafting-f2p";
import { miningP2pGuide } from "./mining-p2p";
import { miningF2pGuide } from "./mining-f2p";
import { smithingP2pGuide } from "./smithing-p2p";
import { smithingF2pGuide } from "./smithing-f2p";
import { fishingP2pGuide } from "./fishing-p2p";
import { fishingF2pGuide } from "./fishing-f2p";
import { cookingP2pGuide } from "./cooking-p2p";
import { firemakingP2pGuide } from "./firemaking-p2p";
import { firemakingF2pGuide } from "./firemaking-f2p";
import { woodcuttingP2pGuide } from "./woodcutting-p2p";
import { woodcuttingF2pGuide } from "./woodcutting-f2p";
import { constructionP2pGuide } from "./construction-p2p";
import { hunterP2pGuide } from "./hunter-p2p";

export const skillTrainingGuides: SkillTrainingGuide[] = [
  rangedP2pGuide,
  rangedF2pGuide,
  magicP2pGuide,
  magicF2pGuide,
  runecraftP2pGuide,
  runecraftF2pGuide,
  craftingP2pGuide,
  craftingF2pGuide,
  miningP2pGuide,
  miningF2pGuide,
  smithingP2pGuide,
  smithingF2pGuide,
  fishingP2pGuide,
  fishingF2pGuide,
  cookingP2pGuide,
  firemakingP2pGuide,
  firemakingF2pGuide,
  woodcuttingP2pGuide,
  woodcuttingF2pGuide,
  constructionP2pGuide,
  hunterP2pGuide,
];

export function getSkillGuide(skill: string, variant: "p2p" | "f2p" = "p2p"): SkillTrainingGuide | undefined {
  return skillTrainingGuides.find((g) => g.skill.toLowerCase() === skill.toLowerCase() && g.variant === variant);
}

export function getSkillsWithGuides(): string[] {
  return [...new Set(skillTrainingGuides.map((g) => g.skill))];
}
