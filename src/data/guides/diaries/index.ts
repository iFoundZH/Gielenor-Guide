import type { AchievementDiaryArea } from "@/types/guides";

import { ardougneDiary } from "./ardougne";
import { desertDiary } from "./desert";
import { faladorDiary } from "./falador";
import { fremennikDiary } from "./fremennik";
import { kandarinDiary } from "./kandarin";
import { karamjaDiary } from "./karamja";
import { kourend_kebosDiary } from "./kourend-kebos";
import { lumbridge_draynorDiary } from "./lumbridge-draynor";
import { morytaniaDiary } from "./morytania";
import { varrockDiary } from "./varrock";
import { western_provincesDiary } from "./western-provinces";
import { wildernessDiary } from "./wilderness";

export const achievementDiaries: AchievementDiaryArea[] = [
  ardougneDiary,
  desertDiary,
  faladorDiary,
  fremennikDiary,
  kandarinDiary,
  karamjaDiary,
  kourend_kebosDiary,
  lumbridge_draynorDiary,
  morytaniaDiary,
  varrockDiary,
  western_provincesDiary,
  wildernessDiary,
];

export function getDiary(areaId: string): AchievementDiaryArea | undefined {
  return achievementDiaries.find((d) => d.id === areaId);
}

export function getDiaryAreas(): { id: string; name: string }[] {
  return achievementDiaries.map((d) => ({ id: d.id, name: d.name }));
}
