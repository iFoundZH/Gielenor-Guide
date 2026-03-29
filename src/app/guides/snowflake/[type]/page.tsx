import { SnowflakeGuideClient } from "./client";
import { snowflakeGuides } from "@/data/guides/snowflake";

export function generateStaticParams() {
  return snowflakeGuides.map((g) => ({ type: g.id }));
}

export default async function SnowflakeGuidePage({ params }: { params: Promise<{ type: string }> }) {
  const { type } = await params;
  return <SnowflakeGuideClient type={type} />;
}
