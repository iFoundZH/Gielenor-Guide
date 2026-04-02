import Link from "next/link";
import syncStatus from "@/data/sync-status.json";

export function Footer() {
  return (
    <footer className="border-t border-osrs-border bg-osrs-darker mt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="md:col-span-2">
            <h3
              className="text-osrs-gold text-lg font-bold mb-2"
              style={{ fontFamily: "var(--font-runescape)" }}
            >
              Gielinor Guide
            </h3>
            <p className="text-osrs-text-dim text-sm max-w-md">
              Your companion for Old School RuneScape. Interactive league planners,
              up-to-date guides synced with the OSRS Wiki, and strategies for
              every account type.
            </p>
            <p className="text-osrs-text-dim text-xs mt-4">
              Data sourced from the{" "}
              <a
                href="https://oldschool.runescape.wiki"
                target="_blank"
                rel="noopener noreferrer"
                className="text-osrs-gold hover:underline"
              >
                Old School RuneScape Wiki
              </a>{" "}
              under CC BY-NC-SA 3.0.
            </p>
          </div>

          <div>
            <h4 className="text-osrs-text font-semibold text-sm mb-3">Leagues</h4>
            <ul className="space-y-2">
              <li>
                <Link href="/leagues/demonic-pacts" className="text-osrs-text-dim text-sm hover:text-osrs-gold transition-colors">
                  Demonic Pacts League
                </Link>
              </li>
              <li>
                <Link href="/leagues/demonic-pacts/planner" className="text-osrs-text-dim text-sm hover:text-osrs-gold transition-colors">
                  Build Planner
                </Link>
              </li>
              <li>
                <Link href="/leagues/demonic-pacts/tasks" className="text-osrs-text-dim text-sm hover:text-osrs-gold transition-colors">
                  Task Tracker
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-osrs-text font-semibold text-sm mb-3">Resources</h4>
            <ul className="space-y-2">
              <li>
                <Link href="/guides" className="text-osrs-text-dim text-sm hover:text-osrs-gold transition-colors">
                  All Guides
                </Link>
              </li>
              <li>
                <a
                  href="https://oldschool.runescape.wiki"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-osrs-text-dim text-sm hover:text-osrs-gold transition-colors"
                >
                  OSRS Wiki
                </a>
              </li>
              <li>
                <Link href="/data-status" className="text-osrs-text-dim text-sm hover:text-osrs-gold transition-colors">
                  Data Status
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-osrs-border mt-8 pt-6 space-y-2">
          <div className="text-center text-xs text-osrs-text-dim">
            Data synced: {new Date(syncStatus.generatedAt).toLocaleDateString()}{" "}
            | {syncStatus.data.questCount} quests | {syncStatus.data.bossCount} bosses{" "}
            | <Link href="/data-status" className="text-osrs-gold hover:underline">Data Status</Link>
          </div>
          <div className="text-center text-xs text-osrs-text-dim">
            Gielinor Guide is a fan-made tool and is not affiliated with Jagex Ltd.
            Old School RuneScape is a trademark of Jagex Ltd.
          </div>
        </div>
      </div>
    </footer>
  );
}
