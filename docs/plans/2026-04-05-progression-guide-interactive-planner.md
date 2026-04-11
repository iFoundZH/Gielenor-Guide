# Progression Guide: Interactive Planner Redesign

## Goal

Transform the Progression Guide from a flat list of phase cards into an interactive planner with a connected timeline, relic lock-in with cascade effects, and visual escalation that communicates journey momentum.

## Design Decisions

- **Core experience**: Interactive Planner — every click reshapes the path with instant visual feedback
- **Pain points addressed**: No relic interaction, phases feel flat
- **Relic interaction model**: Lock-in with cascade (select a relic, see synergies propagate downstream)
- **Phase visual model**: Connected timeline spine with color escalation (blue → green → gold → red)
- **Goal selector**: Collapses into sticky bar with progress ring after selection
- **Scope guard**: No localStorage for relic state, no scroll animations, no custom art, no drag-and-drop

## Architecture

### 1. Timeline Spine (CSS + layout change in ProgressionPhaseCard)

- Vertical line on the left side connecting all phase cards
- Color transitions from cool (early) to warm (late) via CSS gradient
- Milestone nodes at each phase boundary (48-56px circles with tier number)
- Nodes fill gold + checkmark when relic is selected for that tier
- Connection segments between nodes show phase progress
- Mobile: spine becomes thin left border on cards, nodes become inline circles

### 2. Relic Lock-in With Cascade (state in page.tsx, display in ProgressionPhaseCard)

- Relic choices become selectable cards (gold border + glow on select, others dim to 40%)
- Selected relics stored in component state: `Record<number, string>` (tier → relic ID)
- Cascade effects computed from existing POWER_RATINGS + synergy data:
  - Synergy badges on downstream relic choices that pair well
  - Category focus tags glow for categories boosted by selected relics
  - Timeline node fills gold with checkmark
- Deselection: click selected relic to deselect, click different relic to swap
- New helper in optimal-path.ts: `computeRelicCascade(selectedRelics, league)` returns synergy map

### 3. Phase Card Visual Escalation (ProgressionPhaseCard rewrite)

Card anatomy (top to bottom):
1. Timeline node (left spine) — tier number, color-coded
2. Phase header — name + point range, cumulative points. Header background gradient matches timeline color
3. Relic selector — interactive cards (only for phases with relic choices)
4. Passive unlocks — green box with entrance transition
5. Reward milestones — trophy badges with left-border accent
6. Focus areas — compact category badges
7. Key tasks — highlighted sample (unchanged)
8. Expandable full list (unchanged)

Visual escalation:
- Phases 1-2: Clean, minimal. Thin borders, muted nodes, compact padding
- Phases 3-5: Gold-tinted header gradient. Slightly thicker borders. Node glows
- Phases 6+: Ember/red header gradient. border-glow-red. Node pulses with ember-glow animation

### 4. Sticky Goal Bar (PathGoalSelector + ProgressionSummaryCard refactor)

- After goal selection, buttons collapse into compact bar: "Goal: Dragon Tier (42,000 pts)"
- Bar sticks to top of progression area (not page-level sticky)
- Mini progress ring (SVG circle) shows selected points vs goal
- "Change" link re-expands full selector
- Summary stats (task counts, difficulty breakdown) become collapsible detail row inside bar
- Import/Standalone toggle + Exclude Completed move into settings dropdown icon

### 5. Region Toggle Feedback

- When region is toggled, timeline spine flashes gold for 300ms
- CSS animation: quick pulse on the spine element

## Files Modified

| File | Change |
|------|--------|
| `src/components/league/ProgressionPhaseCard.tsx` | Major rewrite: timeline layout, relic selector, visual escalation |
| `src/components/league/ProgressionSummaryCard.tsx` | Refactor into collapsible detail row within sticky bar |
| `src/components/league/PathGoalSelector.tsx` | Add collapse/expand, mini progress ring, sticky behavior |
| `src/app/leagues/demonic-pacts/path/page.tsx` | Timeline container, relic selection state, cascade computation, region feedback |
| `src/app/leagues/raging-echoes/path/page.tsx` | Same changes as DP path page |
| `src/app/globals.css` | Timeline spine styles, phase gradients, pulse animation, progress ring |
| `src/lib/optimal-path.ts` | Add `computeRelicCascade()` helper |

## Out of Scope

- localStorage persistence for relic selections
- Intersection Observer scroll animations
- Pixel art or custom illustrations
- Drag-and-drop reordering
- Side-by-side relic comparison mode
- Changes to the Strategy Guide tabs (separate page)
