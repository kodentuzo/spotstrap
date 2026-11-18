---
title: Controls are touch-sized and text follows Apple's type scale
number: 3
status: accepted
implementation: planned
date: 2026-11-18
supersedes: []
superseded_by: []
notes: "Decision only; size and type tokens land in the foundation PR."
---

# Controls are touch-sized and text follows Apple's type scale

## Context

shadcn's controls are sized for a mouse: the default button is 36px tall, `sm` is 32px and
icon buttons are 36px square. On a phone that's below every guideline:

| Source | Minimum target |
| --- | --- |
| Apple Human Interface Guidelines | 44 × 44 pt (iOS default control; 28 pt minimum) |
| Material Design | 48 × 48 dp |
| WCAG 2.2, 2.5.8 (AA) | 24 × 24 CSS px |
| WCAG 2.2, 2.5.5 (AAA) | 44 × 44 CSS px |

Web apps built on shadcn then feel different from the same product's React Native app.
vinskiano already works around it by hand (`h-11`). Some screens are dense and desktop-only
(spotcraft's dashboard tables, tagtape's desktop app).

1 CSS px, 1 iOS point and 1 Android dp are the same size, so one number serves all.

## Decision

- **Default control size is 44px** (`--size-control`): buttons, inputs, selects, tabs, menu
  items and list rows are 44px tall; icon buttons are 44 × 44. At every screen size.
- **Compact is 36px** (`--size-control-compact`), opt-in per control, never a global switch.
  Its hit area is still 44 × 44.
- **Small visuals keep a 44 × 44 hit area:** checkboxes, radios, switches, close buttons and
  chips. On the web through padding or a `::before` overlay, on native through `hitSlop`.
- **12px between targets** (`--gap-control`), compact layouts included.
- **Text inputs are at least 16px,** so iOS Safari doesn't zoom on focus.
- **Links inside running text** follow the text size.
- **The type scale is Apple's iOS text styles,** in rem so it follows browser zoom and text
  size:

  | Token | Size / line height (px) | Token | Size / line height (px) |
  | --- | --- | --- | --- |
  | `large-title` | 34 / 41 | `body` | 17 / 22 |
  | `title-1` | 28 / 34 | `callout` | 16 / 21 |
  | `title-2` | 22 / 28 | `subhead` | 15 / 20 |
  | `title-3` | 20 / 25 | `footnote` | 13 / 18 |
  | `headline` | 17 / 22, semibold | `caption-1` | 12 / 16 |
  |  |  | `caption-2` | 11 / 13 |

- Nothing smaller than 11px. No thin, extra-light or light weights for text. Brands change
  the fonts, not the steps.
- Components use these tokens; they never hardcode heights like `h-9`.

## Consequences

- Web and native controls measure the same, and both meet WCAG 2.5.5 (AAA) by default.
- Dense desktop screens get taller than shadcn's defaults, unless they opt in to compact.
- Body text is 17px, not the web's usual 16px.
- shadcn components keep their names but take spotstrap's heights.
- A test renders every control at a 375px viewport and checks its hit area.
