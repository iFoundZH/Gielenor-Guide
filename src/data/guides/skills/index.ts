import type { SkillTrainingGuide } from "@/types/guides";

import { attackP2pGuide } from "./attack-p2p";
import { attackF2pGuide } from "./attack-f2p";
import { strengthP2pGuide } from "./strength-p2p";
import { strengthF2pGuide } from "./strength-f2p";
import { defenceP2pGuide } from "./defence-p2p";
import { defenceF2pGuide } from "./defence-f2p";
import { rangedP2pGuide } from "./ranged-p2p";
import { rangedF2pGuide } from "./ranged-f2p";
import { prayerP2pGuide } from "./prayer-p2p";
import { prayerF2pGuide } from "./prayer-f2p";
import { magicP2pGuide } from "./magic-p2p";
import { magicF2pGuide } from "./magic-f2p";
import { runecraftP2pGuide } from "./runecraft-p2p";
import { runecraftF2pGuide } from "./runecraft-f2p";
import { hitpointsP2pGuide } from "./hitpoints-p2p";
import { craftingP2pGuide } from "./crafting-p2p";
import { craftingF2pGuide } from "./crafting-f2p";
import { miningP2pGuide } from "./mining-p2p";
import { miningF2pGuide } from "./mining-f2p";
import { smithingP2pGuide } from "./smithing-p2p";
import { smithingF2pGuide } from "./smithing-f2p";
import { fishingP2pGuide } from "./fishing-p2p";
import { fishingF2pGuide } from "./fishing-f2p";
import { cookingP2pGuide } from "./cooking-p2p";
import { cookingF2pGuide } from "./cooking-f2p";
import { firemakingP2pGuide } from "./firemaking-p2p";
import { firemakingF2pGuide } from "./firemaking-f2p";
import { woodcuttingP2pGuide } from "./woodcutting-p2p";
import { woodcuttingF2pGuide } from "./woodcutting-f2p";
import { agilityP2pGuide } from "./agility-p2p";
import { agilityF2pGuide } from "./agility-f2p";
import { herbloreP2pGuide } from "./herblore-p2p";
import { herbloreF2pGuide } from "./herblore-f2p";
import { thievingP2pGuide } from "./thieving-p2p";
import { thievingF2pGuide } from "./thieving-f2p";
import { fletchingP2pGuide } from "./fletching-p2p";
import { fletchingF2pGuide } from "./fletching-f2p";
import { slayerP2pGuide } from "./slayer-p2p";
import { slayerF2pGuide } from "./slayer-f2p";
import { farmingP2pGuide } from "./farming-p2p";
import { farmingF2pGuide } from "./farming-f2p";
import { constructionP2pGuide } from "./construction-p2p";
import { constructionF2pGuide } from "./construction-f2p";
import { hunterP2pGuide } from "./hunter-p2p";
import { hunterF2pGuide } from "./hunter-f2p";
import { sailingP2pGuide } from "./sailing-p2p";
import { sailingF2pGuide } from "./sailing-f2p";

export const skillTrainingGuides: SkillTrainingGuide[] = [
  attackP2pGuide,
  attackF2pGuide,
  strengthP2pGuide,
  strengthF2pGuide,
  defenceP2pGuide,
  defenceF2pGuide,
  rangedP2pGuide,
  rangedF2pGuide,
  prayerP2pGuide,
  prayerF2pGuide,
  magicP2pGuide,
  magicF2pGuide,
  runecraftP2pGuide,
  runecraftF2pGuide,
  hitpointsP2pGuide,
  craftingP2pGuide,
  craftingF2pGuide,
  miningP2pGuide,
  miningF2pGuide,
  smithingP2pGuide,
  smithingF2pGuide,
  fishingP2pGuide,
  fishingF2pGuide,
  cookingP2pGuide,
  cookingF2pGuide,
  firemakingP2pGuide,
  firemakingF2pGuide,
  woodcuttingP2pGuide,
  woodcuttingF2pGuide,
  agilityP2pGuide,
  agilityF2pGuide,
  herbloreP2pGuide,
  herbloreF2pGuide,
  thievingP2pGuide,
  thievingF2pGuide,
  fletchingP2pGuide,
  fletchingF2pGuide,
  slayerP2pGuide,
  slayerF2pGuide,
  farmingP2pGuide,
  farmingF2pGuide,
  constructionP2pGuide,
  constructionF2pGuide,
  hunterP2pGuide,
  hunterF2pGuide,
  sailingP2pGuide,
  sailingF2pGuide,
];

export function getSkillGuide(skill: string, variant: "p2p" | "f2p" = "p2p"): SkillTrainingGuide | undefined {
  return skillTrainingGuides.find((g) => g.skill.toLowerCase() === skill.toLowerCase() && g.variant === variant);
}

export function getSkillsWithGuides(): string[] {
  return [...new Set(skillTrainingGuides.map((g) => g.skill))];
}
