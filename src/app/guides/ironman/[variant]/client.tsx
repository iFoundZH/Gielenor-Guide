"use client";

import { useState } from "react";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import Link from "next/link";
import type { GuideSection } from "@/types/guides";
import { ironmanGuides } from "@/data/guides/ironman";

const VARIANT_NAMES: Record<string, string> = {
  standard: "Ironman",
  hardcore: "Hardcore Ironman",
  ultimate: "Ultimate Ironman",
  group: "Group Ironman",
};

function SectionTree({ section, depth = 0 }: { section: GuideSection; depth?: number }) {
  const [open, setOpen] = useState(depth < 1);

  return (
    <div className={depth > 0 ? "ml-4 border-l border-osrs-border/30 pl-4" : ""}>
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-2 w-full text-left py-2 hover:text-osrs-gold transition-colors"
      >
        <span className="text-osrs-text-dim text-xs">{open ? "v" : ">"}</span>
        <span className={`font-bold ${depth === 0 ? "text-osrs-gold text-lg" : "text-osrs-text"}`}>
          {section.title}
        </span>
      </button>
      {open && (
        <div className="pb-2">
          {section.content && (
            <p className="text-sm text-osrs-text-dim leading-relaxed mb-3 whitespace-pre-line">
              {section.content}
            </p>
          )}
          {section.subsections.map((sub, i) => (
            <SectionTree key={i} section={sub} depth={depth + 1} />
          ))}
        </div>
      )}
    </div>
  );
}

export function IronmanGuideClient({ variant }: { variant: string }) {
  const guide = ironmanGuides.find((g) => g.variant === variant);
  const displayName = VARIANT_NAMES[variant] || variant;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10">
      <div className="flex items-center gap-2 mb-3 text-sm text-osrs-text-dim">
        <Link href="/" className="hover:text-osrs-gold">Home</Link>
        <span>/</span>
        <Link href="/guides" className="hover:text-osrs-gold">Guides</Link>
        <span>/</span>
        <Link href="/guides/ironman" className="hover:text-osrs-gold">Ironman</Link>
        <span>/</span>
        <span className="text-osrs-gold">{displayName}</span>
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        <div className="flex-1">
          <h1
            className="text-3xl font-bold text-osrs-gold text-glow-gold mb-2"
            style={{ fontFamily: "var(--font-runescape)" }}
          >
            {displayName} Guide
          </h1>

          {!guide ? (
            <Card className="mt-8 text-center py-8">
              <p className="text-osrs-text-dim mb-4">
                No guide data available for {displayName} yet.
              </p>
              <a
                href={`https://oldschool.runescape.wiki/w/${displayName.replace(/ /g, "_")}_guide`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-osrs-gold hover:underline"
              >
                View on OSRS Wiki
              </a>
            </Card>
          ) : (
            <>
              <div className="flex items-center gap-4 mb-6">
                <Badge variant="gold">{guide.sections.length} sections</Badge>
                <a
                  href={guide.wikiUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-osrs-gold hover:underline"
                >
                  Read full article on Wiki
                </a>
              </div>

              <div className="space-y-2">
                {guide.sections.map((section, i) => (
                  <Card key={i}>
                    <SectionTree section={section} />
                  </Card>
                ))}
              </div>
            </>
          )}
        </div>

        {guide && guide.sections.length > 3 && (
          <div className="hidden lg:block lg:w-64">
            <div className="sticky top-20">
              <Card>
                <h3 className="text-sm font-bold text-osrs-text mb-3">Contents</h3>
                <nav className="space-y-1">
                  {guide.sections.map((section, i) => (
                    <div key={i} className="text-xs text-osrs-text-dim hover:text-osrs-gold cursor-pointer">
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
