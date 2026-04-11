"use client";

import Link from "next/link";
import { useState } from "react";

const navItems = [
  { label: "Home", href: "/" },
  { label: "Calculator", href: "/calculator" },
  { label: "Items", href: "/items" },
  { label: "Formulas", href: "/formulas" },
];

export function Header() {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 bg-osrs-darker/95 backdrop-blur-sm border-b border-osrs-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-16">
          <Link href="/" className="flex items-center gap-3 group">
            <div
              className="w-9 h-9 rounded-lg bg-gradient-to-br from-osrs-gold to-demon-ember flex items-center justify-center font-bold text-osrs-darker text-lg"
              style={{ fontFamily: "var(--font-runescape)" }}
            >
              G
            </div>
            <span
              className="text-xl font-bold text-osrs-gold group-hover:text-glow-gold transition-all"
              style={{ fontFamily: "var(--font-runescape)" }}
            >
              Gielinor Guide
            </span>
          </Link>

          <nav className="hidden md:flex items-center gap-1">
            {navItems.map((item) => (
              <Link
                key={item.label}
                href={item.href}
                className="px-4 py-2 rounded-lg text-sm font-medium text-osrs-text-dim hover:text-osrs-gold hover:bg-osrs-panel transition-all"
              >
                {item.label}
              </Link>
            ))}
          </nav>

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

        {mobileOpen && (
          <div className="md:hidden pb-4 border-t border-osrs-border mt-2 pt-2">
            {navItems.map((item) => (
              <Link
                key={item.label}
                href={item.href}
                className="block px-4 py-2 text-sm text-osrs-text-dim hover:text-osrs-gold"
                onClick={() => setMobileOpen(false)}
              >
                {item.label}
              </Link>
            ))}
          </div>
        )}
      </div>
    </header>
  );
}
