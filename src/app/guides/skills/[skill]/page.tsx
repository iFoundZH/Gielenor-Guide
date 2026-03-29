import { SkillGuideClient } from "./client";

const ALL_SKILLS = [
  "attack", "strength", "defence", "ranged", "prayer", "magic",
  "runecraft", "hitpoints", "crafting", "mining", "smithing",
  "fishing", "cooking", "firemaking", "woodcutting", "agility",
  "herblore", "thieving", "fletching", "slayer", "farming",
  "construction", "hunter",
];

export function generateStaticParams() {
  return ALL_SKILLS.map((skill) => ({ skill }));
}

export default async function SkillGuidePage({ params }: { params: Promise<{ skill: string }> }) {
  const { skill } = await params;
  return <SkillGuideClient skill={skill} />;
}
