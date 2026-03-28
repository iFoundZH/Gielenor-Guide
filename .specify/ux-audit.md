# Gielenor Guide — Comprehensive UX Audit & Phased Improvement Plan

Audited 2026-03-28 from the perspective of both **new OSRS players** (first league) and **experienced players** (returning veterans).

---

## Part 1: Homepage

### What Works
- Strong hero section with clear value proposition ("Your Ultimate OSRS Companion")
- Dynamic league status badge (Coming Soon / Live Now / Ended) is a smart touch
- Feature cards give a quick overview of capabilities
- OSRS-themed dark UI feels authentic and immersive

### Issues Found

| # | Issue | Severity | Who It Hurts |
|---|-------|----------|-------------|
| H1 | **No explanation of what a "league" is.** A new player lands here and sees "Demonic Pacts League" with zero context. What is a league? Why do I need a planner? There's no onboarding copy. | High | New players |
| H2 | **"Open Build Planner" goes straight to the planner with no guidance.** First-time users are dropped into a complex multi-section planner with no walkthrough, tooltips, or suggested first steps. | High | New players |
| H3 | **Feature cards link to pages that are mostly "Coming Soon."** Account Guides, PvM Guides, Skilling Guides — all dead ends. This damages trust and makes the app feel incomplete. Clicking these is a wasted click. | Medium | Everyone |
| H4 | **Stats on the featured league card (94 Relics, 12 Pacts, 43 Tasks) are small and don't explain themselves.** What is a relic? What is a pact? These are league-specific jargon with no hover tooltip or explanation. | Medium | New players |
| H5 | **"League Overview" button isn't obviously differentiated from "Open Build Planner."** Both are CTAs but the Overview is the one new users should click first. The planner button has more visual weight (orange). | Low | New players |
| H6 | **Account type section at the bottom is just badges with no links.** "Built for Every Account Type" shows 5 account types but doesn't link to anything or explain what differs between them. | Low | Everyone |
| H7 | **No "what's new" or changelog.** Returning users have no way to see what's changed since their last visit. | Low | Returning players |

---

## Part 2: Navigation & Header

### What Works
- Dropdown menus for each league are well-organized (Overview, Planner, Tasks, Guide)
- Breadcrumbs on subpages help orientation
- Logo links home

### Issues Found

| # | Issue | Severity | Who It Hurts |
|---|-------|----------|-------------|
| N1 | **No visual indicator for the current/active league.** Both leagues appear equal in the nav. The current league should be visually emphasized (e.g., a "Live" badge next to Demonic Pacts). | Medium | Everyone |
| N2 | **Mobile hamburger menu requires testing.** The dropdown submenus for leagues need to work well on touch — nested hover-based menus are a known mobile UX problem. | Medium | Mobile users |
| N3 | **No quick-access to the planner or tasks from every page.** Once you're deep in the guide or overview, getting to the planner requires navigating through the dropdown. A persistent "My Build" floating button or sidebar shortcut would help. | Medium | Experienced players |
| N4 | **"Guides" nav item leads to a page that's 80% Coming Soon.** This is the most visible link after the leagues — it sets an expectation of content that doesn't exist yet. | Medium | Everyone |

---

## Part 3: League Overview (Demonic Pacts)

### What Works
- Tabbed interface is clean and well-organized (Overview, Regions, Relics, Pacts, Rewards, Mechanics)
- Tab counts (e.g., "Regions (10)", "Relics (7)") give useful at-a-glance info
- Region cards show key content tags, making it easy to evaluate
- "Open Planner" and "Track Tasks" CTAs are always visible at top
- Wiki sync status indicator builds trust in data freshness
- XP scaling and point breakdown tables are informative

### Issues Found

| # | Issue | Severity | Who It Hurts |
|---|-------|----------|-------------|
| O1 | **Overview tab is text-heavy with no visual hierarchy for scanning.** The "About the League" paragraph is a wall of text. Key facts (XP rates, region count, relic count) are buried below in stat cards. Should lead with the visual summary. | Medium | Everyone |
| O2 | **Regions tab doesn't indicate which regions are "meta" or most popular.** An experienced player wants to know: which 3 regions are most commonly picked? There's no community data or recommendation badges. | Medium | Everyone |
| O3 | **Region cards show "Echo Boss" but don't explain what echo bosses are.** This is league-specific terminology with no tooltip or explanation. | Medium | New players |
| O4 | **Relics tab shows all 8 tiers in a single long scroll.** No way to jump to a specific tier. A tier-selector or sticky nav within the tab would help. | Low | Everyone |
| O5 | **Pacts tab doesn't show how pacts interact with each other.** The pact cards are standalone — there's no indication of which pacts synergize or conflict. This is critical info for build planning. | High | Everyone |
| O6 | **Rewards tab is a flat list with no visual progression.** Should feel like a reward track — a visual timeline or progress bar showing the journey from Bronze to Dragon. | Low | Everyone |
| O7 | **Mechanics tab is a flat bullet list.** Key mechanic changes deserve more structure — maybe grouped by category (combat, skilling, QoL) with icons. The auto-completed quests list is just a wall of badges. | Low | Everyone |
| O8 | **No "TL;DR" or quick summary for experienced players.** Veterans don't want to read paragraphs — they want: "3 regions, 8 relic tiers, Misthalin locked, XP starts at 5x." A compact cheat-sheet format. | Medium | Experienced players |

---

## Part 4: Strategy Guide

### What Works
- Four distinct playstyles (Speedrunner, PvM Powerhouse, Completionist, Ironman Optimized) cover major archetypes
- Each guide has recommended relics for all 8 tiers — very specific and actionable
- Three-phase progression (Early/Mid/Late game) is a natural planning framework
- "Open in Planner" button to load the build is excellent workflow

### Issues Found

| # | Issue | Severity | Who It Hurts |
|---|-------|----------|-------------|
| G1 | **"Open in Planner" doesn't actually pre-load the guide's recommended build.** It navigates to the planner but the planner is empty — the recommended relics/pacts aren't pre-selected. This defeats the purpose. | Critical | Everyone |
| G2 | **No explanation of WHY specific relics are recommended.** The guide says "Recommended: Endless Harvest" but doesn't explain why it synergizes with the strategy. This makes it a blind "just trust me" guide. | High | Everyone |
| G3 | **Recommended Pacts section is just a bulleted list of names.** No indication of which pacts to prioritize first, which are optional, or the risk tradeoffs. | Medium | Everyone |
| G4 | **Key Priorities section is generic.** Tips like "Multi-category quests that unlock multiple task categories" apply to every strategy. Where's the strategy-specific advice? | Medium | Experienced players |
| G5 | **No difficulty rating for each strategy.** "Speedrunner (Advanced)" has a badge but there's no explanation of what "Advanced" means — how much league experience is assumed? | Low | New players |
| G6 | **No way to compare strategies side-by-side.** Players often want to weigh two approaches — currently requires switching tabs and remembering. | Low | Everyone |
| G7 | **Progression phases lack concrete milestones.** "Early Game" says "Complete tutorial and grab starting cash" but doesn't specify hour targets, point targets, or what "done with early game" looks like. | Medium | New players |

---

## Part 5: Build Planner

### What Works
- Region selection with 3/3 counter and max enforcement works correctly
- Selected state styling (gold border) is clear
- Relic tier organization with passive effects listed is informative
- Build name and account type customization
- Sidebar with Gielinor Score and Build Summary provides real-time feedback
- Build Analysis panel is comprehensive (synergies, warnings, boss access, task accessibility)
- Share Build produces a URL (shown below the build name field)
- Reset button is available

### Issues Found

| # | Issue | Severity | Who It Hurts |
|---|-------|----------|-------------|
| P1 | **The page is EXTREMELY long.** 8 relic tiers + 12 pacts + regions + analysis = massive scroll. On desktop it's ~5000px tall. On mobile it's ~10000px. There's no way to jump between sections. | Critical | Everyone |
| P2 | **No section navigation / table of contents.** Users must scroll through the entire page to find Tier 6 relics or pacts. Needs anchor links or a sticky section nav. | High | Everyone |
| P3 | **No confirmation dialog on Reset.** Clicking Reset immediately clears all selections with no "Are you sure?" prompt. One accidental click destroys an entire build. | High | Everyone |
| P4 | **Share Build shows the URL in a text field below the build name, which is confusing.** The share URL appears to replace/overlay the build name area. There's no toast notification saying "Copied to clipboard!" — users don't know if it worked. | High | Everyone |
| P5 | **Build Analysis panel is buried at the very bottom.** This is arguably the most valuable part of the planner — synergies, warnings, boss access. But you have to scroll past ALL relics and pacts to see it. It should be much more prominent. | High | Everyone |
| P6 | **Sidebar disappears on mobile.** The Gielinor Score card and Build Summary are only in the desktop sidebar. On mobile, users get no real-time feedback while building — they have to scroll to the very bottom. | High | Mobile users |
| P7 | **Empty planner state has no guidance.** A fresh planner looks identical to a used one — just empty. No "Start by selecting your regions" prompt, no suggested workflow, no link to the strategy guide. | High | New players |
| P8 | **Relic cards don't show which relic synergizes with your current selections.** The analysis panel knows about synergies, but the relic cards themselves don't highlight "This synergizes with your selected pact X." | Medium | Everyone |
| P9 | **No undo functionality.** Accidentally deselecting a region or relic has no undo. Combined with no confirmation dialogs, this makes the planner feel fragile. | Medium | Everyone |
| P10 | **Build Notes textarea has no character count or formatting help.** It's a plain textarea with no indication of purpose or suggestions for what to write. | Low | Everyone |
| P11 | **No way to save multiple builds.** The multi-profile system exists in code (`build-storage.ts`) but isn't exposed in the UI. Players often want to compare 2-3 different builds. | High | Experienced players |
| P12 | **Relics show "0 / 5 (0.0%)" in build summary.** The percentage to one decimal feels overly precise and cluttered for what's essentially 0-5 selections. | Low | Everyone |
| P13 | **No visual distinction between "you haven't picked a relic for this tier" vs "there's no choice for this tier."** Some tiers have only passive effects. Users may think they missed something. | Medium | New players |
| P14 | **Pact cards are all the same visual weight.** High-risk pacts like Glass Cannon look the same as low-risk ones. Risk severity should be visually coded. | Medium | Everyone |

---

## Part 6: Task Tracker

### What Works
- Clean, scannable task list with difficulty and category badges
- Overall progress card with points/total is motivating
- "By Difficulty" breakdown gives a sense of where progress is
- Search and filter (difficulty, category) cover basic needs
- Click-to-complete is intuitive
- Completed tasks have clear visual treatment (green check, strikethrough, dimmed)
- "Show completed" toggle works well

### Issues Found

| # | Issue | Severity | Who It Hurts |
|---|-------|----------|-------------|
| T1 | **No sorting options.** Tasks appear in a fixed order. Can't sort by points (high to low), difficulty, or category. | High | Everyone |
| T2 | **No filter by region.** This is critical — if you chose Asgarnia, Kandarin, Morytania, you want to see only tasks achievable in those regions. Currently all tasks show regardless. | Critical | Everyone |
| T3 | **No integration between planner and task tracker.** The planner knows which regions and relics you've selected. The task tracker should show which tasks are accessible with your current build and which aren't. This is the single biggest missed opportunity. | Critical | Everyone |
| T4 | **No way to undo a task completion.** Accidentally clicking a task marks it complete. You can click again to un-complete, but there's no visual indication that this is possible. | Medium | Everyone |
| T5 | **Progress bar shows points but not reward tier progress visually.** "Next: Bronze (2,490 pts)" is text-only. A visual reward track showing your position relative to each tier would be more motivating. | Medium | Everyone |
| T6 | **No task grouping.** All tasks are in a flat list. Grouping by category, region, or difficulty would make the list much more navigable for 1000+ tasks. | High | Everyone |
| T7 | **Currently only 43 tasks in the data.** The homepage advertises "1000+ Tasks" but the actual task tracker has 43. This is misleading and damages trust. Either the data is incomplete or the marketing is wrong. | Critical | Everyone |
| T8 | **No "recommended next tasks" based on your build.** The planner + task tracker should work together to suggest efficient task completion order. | Medium | Experienced players |
| T9 | **Mobile filter controls take too much vertical space.** Search box + 2 dropdowns + checkbox = significant screen real estate before any tasks are visible. | Low | Mobile users |
| T10 | **No export/import of task progress.** If you clear browser data, all progress is lost. No way to back up or transfer between devices. | Medium | Everyone |

---

## Part 7: Raging Echoes (Previous League)

### What Works
- Consistent UI with Demonic Pacts — same components reused well
- "Demonic Pacts (Current)" link makes it easy to jump to the active league
- Combat Masteries section is well-structured

### Issues Found

| # | Issue | Severity | Who It Hurts |
|---|-------|----------|-------------|
| R1 | **No "this league has ended" banner or treatment.** The page looks identical to the current league. There's no visual indication that this league is over and you can't play it anymore. | High | New players |
| R2 | **Planner and Task Tracker still fully functional for an ended league.** This is confusing — why am I planning a build for a league that's over? Should have an archived/read-only state with explanation. | Medium | New players |
| R3 | **Task data seems minimal (43 tasks) just like DP.** Same data completeness issue as Demonic Pacts. | Medium | Everyone |

---

## Part 8: Guides Directory (/guides)

### What Works
- Clean categorization (League, Account Type, PvM, Skilling)
- Live vs Coming Soon visual distinction

### Issues Found

| # | Issue | Severity | Who It Hurts |
|---|-------|----------|-------------|
| GD1 | **80% of the page is "Coming Soon."** 10 of 13 guide entries are Coming Soon. This makes the page feel like a dead end. | High | Everyone |
| GD2 | **Coming Soon items should either be hidden or show expected dates.** Displaying content you don't have yet is an anti-pattern. Either remove them or say "Coming Q2 2026." | Medium | Everyone |
| GD3 | **No search or filter on guides page.** With only 3 live guides this isn't needed now, but it's not scalable. | Low | Future concern |

---

## Part 9: Mobile Experience

### What Works
- Responsive layout — content reflows properly
- Navigation hamburger menu exists
- Tasks page is usable on mobile

### Issues Found

| # | Issue | Severity | Who It Hurts |
|---|-------|----------|-------------|
| M1 | **Planner is nearly unusable on mobile.** The page is 10,000+ pixels tall on a 375px viewport. Relic cards, pact cards, regions — everything stacks vertically with no way to navigate between sections. | Critical | Mobile users |
| M2 | **Sidebar content (Gielinor Score, Build Summary) disappears on mobile.** These are desktop-only. Mobile users get zero real-time feedback while building. | High | Mobile users |
| M3 | **Filter dropdowns on task tracker are full-width stacked.** Takes up a lot of screen before you see any tasks. Should collapse into a filter toggle or bottom sheet. | Medium | Mobile users |
| M4 | **Region cards on mobile are full-width single column.** Works but means a lot of scrolling through the "Choose 3 Regions" section. | Low | Mobile users |
| M5 | **No touch-optimized interactions.** No swipe gestures, no pull-to-refresh, no bottom navigation bar. The app feels like a desktop site on mobile rather than a mobile-first experience. | Medium | Mobile users |

---

## Part 10: Cross-Cutting / Systemic Issues

| # | Issue | Severity | Who It Hurts |
|---|-------|----------|-------------|
| X1 | **Planner and Task Tracker are completely disconnected.** You plan a build in the planner (regions, relics, pacts) then go to the task tracker which knows nothing about your build. These should be deeply integrated — filter tasks by your build's regions, show which tasks your relics help with, etc. | Critical | Everyone |
| X2 | **No onboarding flow for new users.** First-time visitors get no tour, no "start here" guidance, no explanation of the app's key concepts. | High | New players |
| X3 | **No data persistence beyond localStorage.** Build data is lost if you clear browser data, switch browsers, or switch devices. No export/import, no cloud sync. | Medium | Everyone |
| X4 | **No accessibility considerations visible.** No ARIA labels audited, no keyboard navigation tested, no contrast ratio verification beyond the dark theme. | Medium | Accessibility needs |
| X5 | **Gielinor Score "Top 99.9% of players" is misleading.** There are no other players — this is a local score. The percentile implies a community leaderboard that doesn't exist. | Medium | Everyone |
| X6 | **No loading states or skeleton screens.** Pages render instantly (static), but the localStorage hydration can cause a flash of default state. | Low | Everyone |
| X7 | **Footer "Legal" column is empty.** No privacy policy, no terms of service page. The disclaimer is only in the footer text. | Low | Legal concern |

---

---

# PHASED IMPROVEMENT PLAN

## Phase 1: Critical Fixes & Quick Wins (1-2 days)

*Focus: Fix what's broken and what actively misleads users.*

### Tasks

- [ ] **1.1 — Add Reset confirmation dialog** (P3)
  - Add a modal or `window.confirm()` before clearing the build. "Are you sure? This will clear all selections."

- [ ] **1.2 — Add Share Build toast/feedback** (P4)
  - After clicking Share Build, show a brief "Link copied to clipboard!" toast notification instead of showing the raw URL in the text field.

- [ ] **1.3 — Fix task count discrepancy** (T7)
  - The homepage says "1000+ Tasks" — the tracker has 43. Either update the data or change the marketing. Audit the wiki-sync to see if task import is incomplete.

- [ ] **1.4 — Add "League Ended" banner to Raging Echoes** (R1)
  - Add a prominent yellow/amber banner at the top: "This league ended on 2025-01-08. Content is preserved for reference."

- [ ] **1.5 — Fix "Open in Planner" to pre-load guide builds** (G1)
  - The strategy guide's "Open in Planner" should navigate to the planner WITH the recommended relics/pacts pre-selected. Currently it just navigates to an empty planner.

- [ ] **1.6 — Remove or hide Coming Soon guides** (GD1/GD2)
  - Remove the Coming Soon placeholder entries from /guides and the homepage. Only show content that exists. Add them back when real content is ready.

- [ ] **1.7 — Fix misleading Gielinor Score percentile** (X5)
  - Change "Top 99.9% of players" to something honest like "Score: 0 / 3000" or remove the percentile entirely since there's no real player pool to compare against.

---

## Phase 2: Planner UX Overhaul (3-5 days)

*Focus: Make the planner usable, navigable, and informative.*

### Tasks

- [ ] **2.1 — Add section navigation to planner** (P1/P2)
  - Add a sticky horizontal nav or sidebar TOC: "Regions | Relics | Pacts | Notes | Analysis" with anchor scroll. This is the single biggest usability improvement.

- [ ] **2.2 — Move Build Analysis higher / make it always-visible** (P5)
  - Options: (a) Move analysis into the sidebar, (b) Make it a collapsible panel that's open by default at the top, or (c) Show a summary strip always visible with "View full analysis" expand.

- [ ] **2.3 — Add empty state guidance to planner** (P7)
  - When no selections are made, show: "Start by choosing 3 regions below, then pick relics for each tier. Need help? Check the Strategy Guide." with a link.

- [ ] **2.4 — Add relic synergy indicators** (P8)
  - On each relic card, show a small badge/indicator when it synergizes with currently selected pacts or other relics. "Synergy with Glass Cannon" etc.

- [ ] **2.5 — Visual risk coding for pact cards** (P14)
  - Color-code pact card borders/backgrounds by risk: green (low risk), yellow (medium), orange (high), red (extreme). Make Glass Cannon + Berserker visually alarming.

- [ ] **2.6 — Expose multi-build support** (P11)
  - The code supports multiple profiles/builds. Add a build selector dropdown: "Build 1: My PvM Build | Build 2: Ironman Build | + New Build". Let users save and switch.

- [ ] **2.7 — Add mobile build summary** (P6/M2)
  - On mobile, add a collapsible floating bar at the bottom showing: Gielinor Score, Regions selected (X/3), Relics (X/5). Tapping expands to full summary.

- [ ] **2.8 — Add relic tier quicknav within the relics section** (O4)
  - Small tier buttons (T1-T8) at the top of the "Choose Your Relics" section for quick jumping.

---

## Phase 3: Planner ↔ Task Tracker Integration (3-5 days)

*Focus: Connect the two most important features into a unified experience.*

### Tasks

- [ ] **3.1 — Add region filter to task tracker** (T2)
  - Add a "Region" dropdown filter alongside difficulty and category. Filter tasks to only show those achievable in selected regions.

- [ ] **3.2 — Auto-filter tasks by planner build** (T3/X1)
  - Add a toggle: "Show only tasks for my build." When enabled, read the user's planner selections from localStorage and filter tasks to only those achievable with their chosen regions.

- [ ] **3.3 — Add "accessible" vs "inaccessible" task badges** (T3)
  - If a user has a build saved, show a small lock/unlock icon on each task indicating if it's accessible with their current region selection.

- [ ] **3.4 — Add task sorting** (T1)
  - Sort dropdown: "Default | Points (High → Low) | Points (Low → High) | Difficulty | Category | Region"

- [ ] **3.5 — Add task grouping** (T6)
  - Toggle between flat list and grouped view. Group by: Category, Difficulty, or Region. Collapsible groups with task count and point subtotals.

- [ ] **3.6 — Visual reward tier progress track** (T5)
  - Replace the text "Next: Bronze (2,490 pts)" with a visual reward track — a horizontal bar showing Bronze → Iron → Steel → ... → Dragon with the player's current position marked.

- [ ] **3.7 — "Recommended next tasks" section** (T8)
  - At the top of the task tracker, show 3-5 recommended tasks: highest points-per-effort tasks achievable with the current build. Simple heuristic: uncompleted + in accessible regions + sorted by points.

---

## Phase 4: Onboarding & New Player Experience (2-3 days)

*Focus: Make the app approachable for someone who's never played a league.*

### Tasks

- [ ] **4.1 — Add "What is an OSRS League?" section to homepage** (H1)
  - Brief 2-3 sentence explanation above the featured league card: "Leagues are temporary game modes in Old School RuneScape with boosted XP rates, unique relics that grant powerful abilities, and exclusive rewards. Plan your strategy before launch day."

- [ ] **4.2 — Add contextual tooltips for league jargon** (H4/O3)
  - Add tooltip/popover explanations for: Relic, Pact, Echo Boss, Region Lock, Tier. First instance on each page gets an info icon with hover tooltip.

- [ ] **4.3 — Add "Getting Started" guided flow** (X2)
  - New user landing sequence: (1) Homepage explains leagues → (2) "Get Started" button goes to Overview → (3) Overview has "Ready to plan? Open the Planner" CTA → (4) Planner has empty state guidance pointing to Strategy Guide.

- [ ] **4.4 — Add "Why this relic?" explanations to strategy guide** (G2)
  - Under each recommended relic in the guide, add 1 sentence: "Why: Endless Harvest auto-banks resources, letting you focus on combat tasks without inventory management."

- [ ] **4.5 — Add difficulty context to strategy guides** (G5)
  - Define what Advanced/Intermediate/Expert means: "Advanced: Assumes familiarity with at least one prior league. Knowledge of boss mechanics and efficient pathing."

- [ ] **4.6 — Add progression milestones to guide phases** (G7)
  - Early Game: "Target: 500 points, all easy tasks in starting regions, T1-T3 relics unlocked (~2 hours)"
  - Mid Game: "Target: 5,000 points, Bronze reward tier, first boss kills (~8 hours)"

---

## Phase 5: Information Architecture & Polish (2-3 days)

*Focus: Improve how information is organized and presented across the app.*

### Tasks

- [ ] **5.1 — Add "Quick Facts" summary card to overview** (O8)
  - At the top of the Overview tab: a compact card showing all key facts. "Regions: 3 choosable (+2 auto) | Relics: 8 tiers, 94 choices | Pacts: 12 demonic contracts | XP: 5x–16x | Max Points: 4,290"

- [ ] **5.2 — Add pact interaction indicators** (O5)
  - On the Pacts tab and in the planner, show which pacts synergize (green line/badge) and which conflict (red warning). "Glass Cannon + Berserker's Oath = Extreme Risk"

- [ ] **5.3 — Improve Rewards tab with visual progression** (O6)
  - Replace the flat list with a visual reward track / timeline. Show unlocked/locked tiers with the user's current point total if tasks are being tracked.

- [ ] **5.4 — Restructure Mechanics tab** (O7)
  - Group mechanic changes by category: Combat Changes, Skilling Changes, QoL Changes. Add icons. Make the auto-completed quests list collapsible.

- [ ] **5.5 — Add current league indicator to nav** (N1)
  - Add a small "LIVE" badge or dot next to "Demonic Pacts" in the header nav. Dim "Raging Echoes" slightly or add "Ended" label.

- [ ] **5.6 — Add strategy comparison view** (G6)
  - Side-by-side comparison of 2 strategies showing where their relic picks differ, what pacts each uses, and the tradeoffs.

---

## Phase 6: Data & Content Completeness (2-4 days)

*Focus: Fill in the actual content gaps — the app's value is only as good as its data.*

### Tasks

- [ ] **6.1 — Complete task data import** (T7)
  - Run wiki-sync to get all 1000+ league tasks into the data file. Verify categories, regions, difficulty, and point values are correct.

- [ ] **6.2 — Add region tags to all tasks** (T2)
  - Ensure every task has a `region` field so region-based filtering works. Tasks without a specific region should be tagged as "Any" or "Global."

- [ ] **6.3 — Add skill requirements to tasks**
  - For tasks that require specific skill levels, add `skills` and `skillRequirements` fields. This enables future "Can I do this task?" filtering.

- [ ] **6.4 — Verify relic and pact data accuracy**
  - Cross-reference all relic effects, pact bonuses/penalties, and synergy definitions against the OSRS Wiki. Ensure nothing is outdated or incorrect.

- [ ] **6.5 — Add boss data with region mapping** (already partially exists in build-analysis.ts)
  - Ensure all 48+ bosses have correct region assignments, difficulty ratings, and required combat levels.

---

## Phase 7: Advanced Features (5+ days, lower priority)

*Focus: Features that differentiate Gielenor Guide from alternatives.*

### Tasks

- [ ] **7.1 — Build export/import** (T10/X3)
  - JSON export/import for builds and task progress. "Export to file" and "Import from file" buttons. Enables device transfer and backup.

- [ ] **7.2 — Pre-built "meta" builds**
  - Curate 3-5 community-proven builds that users can one-click load. "Most Popular", "Fastest Bronze", "Ironman Safe", "Max Points."

- [ ] **7.3 — Build comparison mode** (P11 extension)
  - Side-by-side comparison of two saved builds showing: region differences, relic differences, score differences, task accessibility differences.

- [ ] **7.4 — Keyboard shortcuts**
  - For power users: `1-8` to jump to relic tiers, `R` for regions, `P` for pacts, `Esc` to close modals. Not critical but nice for heavy users.

- [ ] **7.5 — PWA support**
  - Add service worker and manifest for Progressive Web App. Enables "Add to Home Screen" on mobile and offline access — useful during league play when the wiki may be slow.

- [ ] **7.6 — Accessibility audit** (X4)
  - Full ARIA label pass, keyboard navigation testing, screen reader compatibility, color contrast verification.

- [ ] **7.7 — Task completion analytics**
  - Show stats: "Points per hour", "Estimated time to next tier", "Most efficient uncompleted tasks." Help players optimize their remaining time.

---

## Priority Summary

| Phase | Effort | Impact | Description |
|-------|--------|--------|-------------|
| **Phase 1** | 1-2 days | High | Critical fixes — broken flows, misleading content |
| **Phase 2** | 3-5 days | Very High | Planner overhaul — the core feature becomes usable |
| **Phase 3** | 3-5 days | Very High | Planner↔Tasks integration — the killer feature |
| **Phase 4** | 2-3 days | High | New player experience — widens the audience |
| **Phase 5** | 2-3 days | Medium | Information architecture — polishes everything |
| **Phase 6** | 2-4 days | High | Data completeness — the content gap is real |
| **Phase 7** | 5+ days | Medium | Advanced features — differentiation |

### The Three Most Impactful Changes

1. **Planner ↔ Task Tracker integration** (Phase 3) — This transforms two disconnected tools into a unified planning experience. "Show me only the tasks I can actually do" is the feature every league player needs.

2. **Planner section navigation + analysis promotion** (Phase 2) — The planner is the flagship feature but it's currently a 5000px scroll with the best content at the bottom. Making it navigable makes it usable.

3. **"Open in Planner" actually loading the build** (Phase 1) — This is the highest-impact quick fix. The guide→planner flow is the natural onboarding path and it's currently broken.
