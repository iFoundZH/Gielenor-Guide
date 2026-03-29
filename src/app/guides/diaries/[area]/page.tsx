import { DiaryAreaClient } from "./client";
import { achievementDiaries } from "@/data/guides/diaries";

export function generateStaticParams() {
  return achievementDiaries.map((d) => ({ area: d.id }));
}

export default async function DiaryAreaPage({ params }: { params: Promise<{ area: string }> }) {
  const { area } = await params;
  return <DiaryAreaClient areaId={area} />;
}
