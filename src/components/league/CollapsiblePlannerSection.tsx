"use client";

import { Card } from "@/components/ui/Card";

interface CollapsiblePlannerSectionProps {
  id: string;
  title: string;
  label: string;
  subtitle?: string;
  isExpanded: boolean;
  onToggleExpand: () => void;
  current: number;
  total: number | null;
  isComplete: boolean;
  summaryItems: string[];
  showDoneButton?: boolean;
  onDone?: () => void;
  children: React.ReactNode;
}

export function CollapsiblePlannerSection({
  id,
  title,
  label,
  subtitle,
  isExpanded,
  onToggleExpand,
  current,
  total,
  isComplete: _isComplete,
  summaryItems,
  showDoneButton,
  onDone,
  children,
}: CollapsiblePlannerSectionProps) {
  if (!isExpanded) {
    return (
      <div id={id} className="scroll-mt-24">
        <Card glow="gold">
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-3 min-w-0">
              <span className="text-osrs-green text-lg flex-shrink-0">✓</span>
              <span className="font-bold text-osrs-gold flex-shrink-0" style={{ fontFamily: "var(--font-runescape)" }}>
                {label}
              </span>
              <span className="text-sm text-osrs-text truncate">
                {summaryItems.join(" · ")}
              </span>
            </div>
            <button
              onClick={onToggleExpand}
              className="px-3 py-1 text-xs font-medium rounded-lg border border-osrs-border text-osrs-text-dim hover:text-osrs-gold hover:border-osrs-gold transition-all flex-shrink-0"
            >
              Edit
            </button>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div id={id} className="scroll-mt-24">
      <div className="flex items-center justify-between mb-2">
        <h2 className="text-2xl font-bold text-osrs-gold" style={{ fontFamily: "var(--font-runescape)" }}>
          {title}
        </h2>
        <div className="flex items-center gap-3">
          <span className="text-sm text-osrs-text-dim">
            {current}{total !== null ? ` / ${total}` : ""} selected
          </span>
          {showDoneButton && current > 0 && (
            <button
              onClick={onDone}
              className="px-3 py-1 text-xs font-medium rounded-lg bg-osrs-green/20 text-osrs-green border border-osrs-green/30 hover:bg-osrs-green/30 transition-all"
            >
              Done
            </button>
          )}
        </div>
      </div>
      {subtitle && (
        <p className="text-sm text-osrs-text-dim mb-4">{subtitle}</p>
      )}
      {children}
    </div>
  );
}
