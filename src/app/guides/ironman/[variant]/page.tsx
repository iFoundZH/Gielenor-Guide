import { IronmanGuideClient } from "./client";

export function generateStaticParams() {
  return [
    { variant: "standard" },
    { variant: "hardcore" },
    { variant: "ultimate" },
    { variant: "group" },
  ];
}

export default async function IronmanGuidePage({ params }: { params: Promise<{ variant: string }> }) {
  const { variant } = await params;
  return <IronmanGuideClient variant={variant} />;
}
