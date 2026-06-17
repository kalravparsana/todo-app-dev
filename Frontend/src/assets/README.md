# Meridian — Design Contract

**Positioning:** The quiet daily line between intention and done — a calm task manager for people who open their list every morning and need it to feel inviting, not accusatory.

**Personality:** approachable · modern · guided · precise (calm focus over feature density; Things 3–inspired restraint with web-native speed)

**Persona:** Elena, a design lead juggling client work and a side project — success is opening Meridian before email, committing to three real tasks, and closing the day without guilt over what slipped.

**Type:** Fraunces (display, headings, hero) + Source Sans 3 (UI/body); scale: hero 64px / page title 32px / section 22px / body 15px / caption 12px; rules: tracking-tight on display, leading-relaxed on body, tabular-nums on counts

**Color:** brand `#2D6A4F` (forest — growth, done, grounded); neutrals warm stone-tinted (`#FAF8F5` → `#1C1917`); semantic today `#C87941` (amber, not alarm-red); tokens in `index.css`; dark mode designed with lifted forest primary on `#141210` surfaces

**Layout:** spacing rhythm 4/8/16/24/32/48/64; marketing airy (max-w-6xl, generous section padding); app efficient (13–14px UI, 40px row height); attention budget enforced — data and primary actions win

**Voice:** calm, specific, gently direct; e.g. "Draw the line on what matters today" / "Nothing committed yet — pick what you'll actually finish."

**Signature moment:** **Commit Rail** on Today — a horizontal progress arc showing only tasks actively committed to today, with a gentle fill animation on completion (not a generic progress bar).

---

## Reference products (workflow step 1)

| Product | Adopt | Avoid |
|---------|-------|-------|
| Things 3 | Calm whitespace, Today as active commitment, semantic color only | Apple-only patterns, manual-only capture |
| Todoist | Quick capture, project organization, natural keyboard flow | Feature density, guilt-red overdue styling |
| Any.do | Friendly onboarding tone | Gradient-heavy marketing clichés |

---

## Motif library (vector-creation)

**Domain:** daily intention, marking completion, gentle structure.

**Motifs:** (1) horizon line / meridian arc, (2) check leaf (organic completion mark), (3) stacked pebble (grouped tasks), (4) single thread line (focus), (5) dawn wedge (today commitment).

**Visual register:** expert / precise / warm — monoline geometric construction, 1.75px stroke, soft 2px corner radii, one small filled accent per icon max.

---

## Asset table

| Page | Surface | Class | Asset file | Justification | Motif(s) | Archetype | Size cap |
|------|---------|-------|------------|---------------|----------|-----------|----------|
| All | Header | Chrome | `logos/logo-mark.svg` | Brand wayfinding | meridian arc | Logo | 32px |
| Landing | Hero | Emotional | `illustrations/hero-dawn.svg` | Persuade: calm morning intention | horizon, dawn wedge | Illustration | ≤42% hero width |
| Today | Empty | Emotional | `illustrations/empty-today.svg` | Explain no commits + point to add | thread line, pebble | Illustration | ≤28% card width |
| Inbox | Empty | Emotional | `illustrations/empty-inbox.svg` | Explain capture-first workflow | stacked pebble | Illustration | ≤28% card |
| Projects | Empty | Emotional | `illustrations/empty-projects.svg` | Explain project grouping | pebble stack | Illustration | ≤28% card |
| App nav | Sidebar | Chrome | `icons/nav-*.svg` | Label nav destinations | universal + motif | Icon | 20px |
| Tasks | List rows | Task | `icons/status-*.svg` | Status at a glance | check leaf | Icon | 18px inline |
| — | Task surfaces with data | Task | — (no illustration) | Data is the content | — | — | — |

**Geometry:** 24×24 icon grid, 1.75px stroke, 2px rect radius, `currentColor` on icons.

**Layout tokens:** illustration clearance 24px from text; header lockup gap 10px; banner template N/A (no announcement bar in v1).

**Dark mode for assets:** icons via `currentColor`; illustrations ship explicit token fills from palette.
