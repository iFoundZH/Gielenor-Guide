"use client";

import Link from "next/link";
import { useState } from "react";

const navItems = [
  { label: "Home", href: "/" },
  {
    label: "Demonic Pacts",
    href: "/leagues/demonic-pacts",
    status: "live" as const,
    children: [
      { label: "Overview", href: "/leagues/demonic-pacts" },
      { label: "Build Planner", href: "/leagues/demonic-pacts/planner" },
      { label: "Task Tracker", href: "/leagues/demonic-pacts/tasks" },
      { label: "Strategy Guide", href: "/leagues/demonic-pacts/guide" },
    ],
  },
  {
    label: "Raging Echoes",
    href: "/leagues/raging-echoes",
    status: "ended" as const,
    children: [
      { label: "Overview", href: "/leagues/raging-echoes" },
      { label: "Build Planner", href: "/leagues/raging-echoes/planner" },
      { label: "Task Tracker", href: "/leagues/raging-echoes/tasks" },
      { label: "Strategy Guide", href: "/leagues/raging-echoes/guide" },
    ],
  },
  { label: "Guides", href: "/guides" },
];

export function Header() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);

  return (
    <header className="sticky top-0 z-50 bg-osrs-darker/95 backdrop-blur-sm border-b border-osrs-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3 group">
            <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-osrs-gold to-demon-ember flex items-center justify-center font-bold text-osrs-darker text-lg"
              style={{ fontFamily: "var(--font-runescape)" }}>
              G
            </div>
            <span
              className="text-xl font-bold text-osrs-gold group-hover:text-glow-gold transition-all"
              style={{ fontFamily: "var(--font-runescape)" }}
            >
              Gielinor Guide
            </span>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-1">
            {navItems.map((item) => (
              <div
                key={item.label}
                className="relative"
                onMouseEnter={() => item.children && setOpenDropdown(item.label)}
                onMouseLeave={() => setOpenDropdown(null)}
              >
                <Link
                  href={item.href}
                  className="px-4 py-2 rounded-lg text-sm font-medium text-osrs-text-dim hover:text-osrs-gold hover:bg-osrs-panel transition-all flex items-center gap-1.5"
                >
                  {item.label}
                  {"status" in item && item.status === "live" && (
                    <span className="w-1.5 h-1.5 rounded-full bg-osrs-green animate-pulse" />
                  )}
                  {"status" in item && item.status === "ended" && (
                    <span className="text-[10px] text-osrs-text-dim opacity-60">ended</span>
                  )}
                  {item.children && (
                    <svg className="inline-block w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  )}
                </Link>
                {item.children && openDropdown === item.label && (
                  <div className="absolute top-full left-0 mt-1 w-56 bg-osrs-panel border border-osrs-border rounded-lg shadow-xl py-2">
                    {item.children.map((child) => (
                      <Link
                        key={child.href}
                        href={child.href}
                        className="block px-4 py-2 text-sm text-osrs-text-dim hover:text-osrs-gold hover:bg-osrs-panel-hover transition-all"
                      >
                        {child.label}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </nav>

          {/* Mobile toggle */}
          <button
            className="md:hidden p-2 rounded-lg text-osrs-text-dim hover:text-osrs-gold"
            onClick={() => setMobileOpen(!mobileOpen)}
          >
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              {mobileOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>

        {/* Mobile menu */}
        {mobileOpen && (
          <div className="md:hidden pb-4 border-t border-osrs-border mt-2 pt-2">
            {navItems.map((item) => (
              <div key={item.label}>
                <Link
                  href={item.href}
                  className="block px-4 py-2 text-sm text-osrs-text-dim hover:text-osrs-gold"
                  onClick={() => setMobileOpen(false)}
                >
                  {item.label}
                </Link>
                {item.children?.map((child) => (
                  <Link
                    key={child.href}
                    href={child.href}
                    className="block px-8 py-1.5 text-xs text-osrs-text-dim hover:text-osrs-gold"
                    onClick={() => setMobileOpen(false)}
                  >
                    {child.label}
                  </Link>
                ))}
              </div>
            ))}
          </div>
        )}
      </div>
    </header>
  );
}
