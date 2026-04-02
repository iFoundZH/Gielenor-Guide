"use client";

import { Tabs } from "@/components/ui/Tabs";
import { EfficiencyGuideSection } from "@/components/league/EfficiencyGuideSection";
import { GettingStartedSection } from "@/components/league/guides/GettingStartedSection";
import { RelicGuideSection } from "@/components/league/guides/RelicGuideSection";
import { RegionGuideSection } from "@/components/league/guides/RegionGuideSection";
import { CombatBuildSection } from "@/components/league/guides/CombatBuildSection";
import { PactGuideSection } from "@/components/league/guides/PactGuideSection";
import { demonicPactsRank1Guide } from "@/data/guides/efficiency";
import {
  dpGettingStarted,
  dpRelicGuide,
  dpRegionGuide,
  dpCombatBuilds,
  dpPactGuide,
} from "@/data/guides/league/demonic-pacts-guides";
import Link from "next/link";

const tabs = [
  { id: "getting-started", label: "Getting Started" },
  { id: "relics", label: "Relic Guide" },
  { id: "regions", label: "Region Guide" },
  { id: "builds", label: "Combat Builds" },
  { id: "pacts", label: "Pact Strategies" },
  { id: "rank1", label: "Rank 1 Guide" },
];

export default function StrategyGuide() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10">
      <div className="flex items-center gap-2 mb-3 text-sm text-osrs-text-dim">
        <Link href="/" className="hover:text-osrs-gold">
          Home
        </Link>
        <span>/</span>
        <Link
          href="/leagues/demonic-pacts"
          className="hover:text-osrs-gold"
        >
          Demonic Pacts
        </Link>
        <span>/</span>
        <span className="text-osrs-gold">Strategy Guide</span>
      </div>

      <h1
        className="text-3xl font-bold text-osrs-gold text-glow-gold mb-2"
        style={{ fontFamily: "var(--font-runescape)" }}
      >
        Strategy Guide
      </h1>
      <p className="text-osrs-text-dim mb-8">
        Comprehensive guides for every aspect of the Demonic Pacts League.
        Relics, regions, combat builds, and pact strategies — everything you
        need to plan your league.
      </p>

      <Tabs tabs={tabs}>
        {(activeTab) => {
          switch (activeTab) {
            case "getting-started":
              return <GettingStartedSection guide={dpGettingStarted} />;
            case "relics":
              return <RelicGuideSection guide={dpRelicGuide} />;
            case "regions":
              return <RegionGuideSection guide={dpRegionGuide} />;
            case "builds":
              return <CombatBuildSection guide={dpCombatBuilds} />;
            case "pacts":
              return <PactGuideSection guide={dpPactGuide} />;
            case "rank1":
              return <EfficiencyGuideSection guide={demonicPactsRank1Guide} />;
            default:
              return null;
          }
        }}
      </Tabs>
    </div>
  );
}
