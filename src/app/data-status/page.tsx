import syncStatus from "@/data/sync-status.json";
import Link from "next/link";

type LeagueStatus = {
  taskCount: number;
  taskBreakdown: Record<string, number>;
  totalPoints: number;
  relicCount: number;
  relicTierCount: number;
  regionCount: number;
  pactCount: number;
  rewardTierCount: number;
  maxRegions: number;
  lastSynced: string;
};

function StatusDot({ status }: { status: "green" | "yellow" | "red" }) {
  const colors = { green: "bg-osrs-green", yellow: "bg-yellow-500", red: "bg-red-500" };
  return <span className={`inline-block w-2.5 h-2.5 rounded-full ${colors[status]}`} />;
}

function evalStatus(ok: boolean, warn?: boolean): "green" | "yellow" | "red" {
  if (ok) return "green";
  if (warn) return "yellow";
  return "red";
}

export default function DataStatusPage() {
  const generated = new Date(syncStatus.generatedAt);
  const now = new Date();
  const daysSince = Math.floor((now.getTime() - generated.getTime()) / (1000 * 60 * 60 * 24));
  const leagues = syncStatus.leagues as Record<string, LeagueStatus>;

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-10">
      <div className="flex items-center gap-2 mb-3 text-sm text-osrs-text-dim">
        <Link href="/" className="hover:text-osrs-gold">Home</Link>
        <span>/</span>
        <span className="text-osrs-gold">Data Status</span>
      </div>

      <h1
        className="text-3xl font-bold text-osrs-gold mb-2"
        style={{ fontFamily: "var(--font-runescape)" }}
      >
        Data Status
      </h1>
      <p className="text-osrs-text-dim text-sm mb-8">
        Health and completeness of data synced from the OSRS Wiki.
      </p>

      {/* Sync timeline */}
      <div className="bg-osrs-panel border border-osrs-border rounded-lg p-6 mb-8">
        <h2 className="text-lg font-bold text-osrs-gold mb-4" style={{ fontFamily: "var(--font-runescape)" }}>
          Sync Timeline
        </h2>
        <div className="flex items-center gap-3 mb-2">
          <StatusDot status={evalStatus(daysSince <= 2, daysSince <= 7)} />
          <span className="text-osrs-text text-sm">
            Last generated: {generated.toLocaleString()} ({daysSince === 0 ? "today" : `${daysSince}d ago`})
          </span>
        </div>
        <p className="text-xs text-osrs-text-dim">
          Data is synced daily at 06:00 UTC from the OSRS Wiki via automated CI workflow.
          During active leagues, sync runs can also be triggered manually.
        </p>
      </div>

      {/* Per-league breakdown */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        {Object.entries(leagues).map(([id, league]) => (
          <div key={id} className="bg-osrs-panel border border-osrs-border rounded-lg p-6">
            <h3 className="text-lg font-bold text-osrs-gold mb-4" style={{ fontFamily: "var(--font-runescape)" }}>
              {id.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase())}
            </h3>
            <div className="space-y-2 text-sm">
              <Row
                label="Tasks"
                value={`${league.taskCount.toLocaleString()} (${league.totalPoints.toLocaleString()} pts)`}
                status={evalStatus(league.taskCount >= 100, league.taskCount > 0)}
              />
              <Row
                label="Task Breakdown"
                value={Object.entries(league.taskBreakdown).map(([k, v]) => `${k}: ${v}`).join(", ")}
                status="green"
              />
              <Row
                label="Relics"
                value={`${league.relicCount} across ${league.relicTierCount} tiers`}
                status={evalStatus(league.relicCount > 0)}
              />
              <Row
                label="Regions"
                value={`${league.regionCount} (max choosable: ${league.maxRegions})`}
                status={evalStatus(league.regionCount > 1)}
              />
              <Row
                label="Pacts"
                value={league.pactCount.toString()}
                status={evalStatus(true)}
              />
              <Row
                label="Reward Tiers"
                value={`${league.rewardTierCount} (expected 7)`}
                status={evalStatus(league.rewardTierCount === 7)}
              />
              <Row
                label="Last Synced"
                value={league.lastSynced}
                status={evalStatus(true)}
              />
            </div>
          </div>
        ))}
      </div>

      {/* Guide counts */}
      <div className="bg-osrs-panel border border-osrs-border rounded-lg p-6 mb-8">
        <h2 className="text-lg font-bold text-osrs-gold mb-4" style={{ fontFamily: "var(--font-runescape)" }}>
          Guide Data
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm">
          <Row
            label="Skill Guides"
            value={`${syncStatus.guides.skillGuideCount} (${syncStatus.guides.uniqueSkillCount} skills, ${syncStatus.guides.p2pGuideCount} P2P, ${syncStatus.guides.f2pGuideCount} F2P)`}
            status={evalStatus(syncStatus.guides.uniqueSkillCount >= 24)}
          />
          <Row
            label="Diary Areas"
            value={`${syncStatus.guides.diaryAreaCount} (expected 12)`}
            status={evalStatus(syncStatus.guides.diaryAreaCount === 12)}
          />
          <Row
            label="Combat Achievements"
            value={`${syncStatus.guides.combatAchievementTaskCount} tasks across ${syncStatus.guides.combatAchievementTierCount} tiers`}
            status={evalStatus(syncStatus.guides.combatAchievementTierCount === 6)}
          />
          <Row
            label="Quests"
            value={`${syncStatus.data.questCount} (expected 170+)`}
            status={evalStatus(syncStatus.data.questCount >= 170, syncStatus.data.questCount >= 150)}
          />
          <Row
            label="Bosses"
            value={`${syncStatus.data.bossCount} (expected 50+)`}
            status={evalStatus(syncStatus.data.bossCount >= 50, syncStatus.data.bossCount >= 30)}
          />
        </div>
      </div>

      {/* Known quirks */}
      <div className="bg-osrs-panel border border-osrs-border rounded-lg p-6">
        <h2 className="text-lg font-bold text-osrs-gold mb-4" style={{ fontFamily: "var(--font-runescape)" }}>
          Known Data Quirks
        </h2>
        <ul className="space-y-2 text-sm text-osrs-text-dim">
          <li className="flex items-start gap-2">
            <span className="text-yellow-500 mt-0.5">*</span>
            <span>
              <strong className="text-osrs-text">Quest start locations:</strong> ~50 quests may incorrectly map to Misthalin because the wiki
              <code className="text-xs bg-osrs-darker px-1 rounded">|start=</code> field references NPC names rather than locations.
            </span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-yellow-500 mt-0.5">*</span>
            <span>
              <strong className="text-osrs-text">DT2 boss classifications:</strong> Desert Treasure II bosses use league-specific region
              classifications (Duke=Fremennik, Leviathan=Desert, Whisperer=Asgarnia, Vardorvis=Varlamore) rather than geographic locations.
            </span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-yellow-500 mt-0.5">*</span>
            <span>
              <strong className="text-osrs-text">DP placeholder data:</strong> Prior to league launch (Apr 15), DP tasks and pacts
              are speculative placeholders. Full data will be synced automatically after launch.
            </span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-yellow-500 mt-0.5">*</span>
            <span>
              <strong className="text-osrs-text">Missing F2P Hitpoints guide:</strong> Hitpoints only has a P2P guide since wiki content
              redirects to the melee training combined page.
            </span>
          </li>
        </ul>
      </div>
    </div>
  );
}

function Row({ label, value, status }: { label: string; value: string; status: "green" | "yellow" | "red" }) {
  return (
    <div className="flex items-center gap-2">
      <StatusDot status={status} />
      <span className="text-osrs-text font-medium min-w-[120px]">{label}</span>
      <span className="text-osrs-text-dim">{value}</span>
    </div>
  );
}
