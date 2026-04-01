"use client";

import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { SectionTree } from "@/components/guides/SectionTree";
import Link from "next/link";
import { mainAccountGuide } from "@/data/guides/main";

export default function MainAccountGuidePage() {
  const guide = mainAccountGuide;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10">
      <div className="flex items-center gap-2 mb-3 text-sm text-osrs-text-dim">
        <Link href="/" className="hover:text-osrs-gold">Home</Link>
        <span>/</span>
        <Link href="/guides" className="hover:text-osrs-gold">Guides</Link>
        <span>/</span>
        <span className="text-osrs-gold">Main Account Guide</span>
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        <div className="flex-1">
          <h1
            className="text-3xl font-bold text-osrs-gold text-glow-gold mb-2"
            style={{ fontFamily: "var(--font-runescape)" }}
          >
            Main Account Guide
          </h1>
          <p className="text-osrs-text-dim mb-6">
            A comprehensive progression guide for main accounts, from Tutorial Island to end-game content.
          </p>

          <div className="flex items-center gap-4 mb-6">
            <Badge variant="gold">{guide.sections.length} sections</Badge>
          </div>

          <div className="space-y-2">
            {guide.sections.map((section, i) => (
              <div key={i} id={`section-${i}`} className="scroll-mt-24">
                <Card>
                  <SectionTree section={section} />
                </Card>
              </div>
            ))}
          </div>
        </div>

        {guide.sections.length > 3 && (
          <div className="hidden lg:block lg:w-64">
            <div className="sticky top-20">
              <Card>
                <h3 className="text-sm font-bold text-osrs-text mb-3">Contents</h3>
                <nav className="space-y-1">
                  {guide.sections.map((section, i) => (
                    <div
                      key={i}
                      className="text-xs text-osrs-text-dim hover:text-osrs-gold cursor-pointer"
                      onClick={() => document.getElementById(`section-${i}`)?.scrollIntoView({ behavior: "smooth", block: "start" })}
                    >
                      {section.title}
                    </div>
                  ))}
                </nav>
              </Card>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
