import Link from "next/link";

export function Footer() {
  return (
    <footer className="border-t border-osrs-border bg-osrs-darker mt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="md:col-span-2">
            <h3
              className="text-osrs-gold text-lg font-bold mb-2"
              style={{ fontFamily: "var(--font-runescape)" }}
            >
              Gielinor Guide
            </h3>
            <p className="text-osrs-text-dim text-sm max-w-md">
              Demonic Pacts League DPS Calculator. Exact OSRS combat formulas,
              all pact modifiers, and a smart gear optimizer.
            </p>
            <p className="text-osrs-text-dim text-xs mt-4">
              Combat data sourced from the{" "}
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
            <h4 className="text-osrs-text font-semibold text-sm mb-3">Tools</h4>
            <ul className="space-y-2">
              <li>
                <Link href="/calculator" className="text-osrs-text-dim text-sm hover:text-osrs-gold transition-colors">
                  DPS Calculator
                </Link>
              </li>
              <li>
                <Link href="/items" className="text-osrs-text-dim text-sm hover:text-osrs-gold transition-colors">
                  Item Database
                </Link>
              </li>
              <li>
                <Link href="/formulas" className="text-osrs-text-dim text-sm hover:text-osrs-gold transition-colors">
                  DPS Formulas
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-osrs-border mt-8 pt-6">
          <div className="text-center text-xs text-osrs-text-dim">
            Gielinor Guide is a fan-made tool and is not affiliated with Jagex Ltd.
            Old School RuneScape is a trademark of Jagex Ltd.
          </div>
        </div>
      </div>
    </footer>
  );
}
