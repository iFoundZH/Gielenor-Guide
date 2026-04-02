"use client";

import { Tabs } from "@/components/ui/Tabs";
import { EfficiencyGuideSection } from "@/components/league/EfficiencyGuideSection";
import { GettingStartedSection } from "@/components/league/guides/GettingStartedSection";
import { RelicGuideSection } from "@/components/league/guides/RelicGuideSection";
import { RegionGuideSection } from "@/components/league/guides/RegionGuideSection";
import { CombatBuildSection } from "@/components/league/guides/CombatBuildSection";
import { CombatMasterySection } from "@/components/league/guides/CombatMasterySection";
import { ragingEchoesRank1Guide } from "@/data/guides/efficiency";
import {
  reGettingStarted,
  reRelicGuide,
  reRegionGuide,
  reCombatBuilds,
  reCombatMasteries,
} from "@/data/guides/league/raging-echoes-guides";
import Link from "next/link";

const tabs = [
  { id: "getting-started", label: "Getting Started" },
  { id: "relics", label: "Relic Guide" },
  { id: "regions", label: "Region Guide" },
  { id: "builds", label: "Combat Builds" },
  { id: "masteries", label: "Combat Masteries" },
  { id: "rank1", label: "Rank 1 Guide" },
];

export default function RagingEchoesGuide() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10">
      <div className="flex items-center gap-2 mb-3 text-sm text-osrs-text-dim">
        <Link href="/" className="hover:text-osrs-gold">
          Home
        </Link>
        <span>/</span>
        <Link
          href="/leagues/raging-echoes"
          className="hover:text-osrs-gold"
        >
          Raging Echoes
        </Link>
        <span>/</span>
        <span className="text-osrs-gold">Strategy Guide</span>
      </div>

      <h1
        className="text-3xl font-bold text-osrs-gold text-glow-gold mb-2"
        style={{ fontFamily: "var(--font-runescape)" }}
      >
        Raging Echoes Strategy Guide
      </h1>
      <p className="text-osrs-text-dim mb-8">
        Comprehensive guides for every aspect of the league. 8 relic tiers, 3
        region unlocks (Misthalin + Karamja start). 1,589 tasks, 141,080 total
        points available.
      </p>

      <Tabs tabs={tabs}>
        {(activeTab) => {
          switch (activeTab) {
            case "getting-started":
              return <GettingStartedSection guide={reGettingStarted} />;
            case "relics":
              return <RelicGuideSection guide={reRelicGuide} />;
            case "regions":
              return <RegionGuideSection guide={reRegionGuide} />;
            case "builds":
              return <CombatBuildSection guide={reCombatBuilds} />;
            case "masteries":
              return <CombatMasterySection guide={reCombatMasteries} />;
            case "rank1":
              return <EfficiencyGuideSection guide={ragingEchoesRank1Guide} />;
            default:
              return null;
          }
        }}
      </Tabs>
    </div>
  );
}
