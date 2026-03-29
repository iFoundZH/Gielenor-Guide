"use client";

import { useState } from "react";
import type { GuideSection } from "@/types/guides";

export function SectionTree({ section, depth = 0 }: { section: GuideSection; depth?: number }) {
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
