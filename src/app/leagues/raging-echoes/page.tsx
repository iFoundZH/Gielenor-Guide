"use client";

import { ragingEchoesLeague } from "@/data/raging-echoes";
import { LeagueOverview } from "@/components/league/LeagueOverview";

export default function RagingEchoesOverview() {
  return (
    <LeagueOverview
      league={ragingEchoesLeague}
      basePath="/leagues/raging-echoes"
      otherLeaguePath="/leagues/demonic-pacts"
      otherLeagueName="Demonic Pacts (Current)"
    />
  );
}
