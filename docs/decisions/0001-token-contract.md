---
title: Spotstrap uses shadcn's token names, in oklch, with brand themes
number: 1
status: accepted
implementation: planned
date: 2026-11-18
supersedes: []
superseded_by: []
notes: "Decision only; tokens are built in the foundation PR."
---

# Spotstrap uses shadcn's token names, in oklch, with brand themes

## Context

Spotstrap should serve eight projects: two static Astro sites, spotcraft (SvelteKit and
Astro), lifts and bars (TanStack Start and Expo), sokobanko (Nuxt), tagtape (Electron and
Astro) and vinskiano (TanStack Start). They use two token vocabularies today:

- shadcn's names (`background`, `foreground`, `primary`, `muted`, `border`, `ring`…):
  spotcraft, sokobanko, tagtape, vinskiano.
- Home-grown names (`bg`, `surface`, `raised`, `line`, `text`, `muted`, `accent`,
  `accent-ink`, `fail`): the two websites, lifts and bars. Bars can't adopt React Native
  Reusables because of the mismatch.

Values are hex in some projects and oklch in others. Dark mode follows the system everywhere
except sokobanko, which has a toggle and a `.dark` class. Brand colors are also repeated
outside CSS: `theme-color` meta tags, favicons, manifests, icon scripts and a Pixi palette.

## Decision

- **Names are shadcn's:** `background`, `foreground`, `card`, `popover`, `primary`,
  `secondary`, `muted`, `accent`, `destructive` (each with `-foreground` where shadcn has
  one), `border`, `input`, `ring`, `chart-1`…`chart-5` and the `sidebar-*` set. Spotstrap adds:
  - `surface` and `raised`, the two levels above `background`;
  - font roles `--font-sans`, `--font-display`, `--font-mono`;
  - the size and type tokens of [ADR 0003](0003-touch-sizes-and-type.md).
- **Values are oklch and static.** No `calc()`, `var()` chains or `color-mix()` in theme
  values, so Uniwind (React Native) parses the same file.
- **Dark mode follows the system by default** (`prefers-color-scheme`). Projects with a
  toggle opt in to a `.dark` class variant instead; the theme values are the same.
- **A brand theme sets values only:** accent hue and values, the neutral hue, `--radius`,
  the fonts, and whether shadows are on. It never adds or renames tokens. Spotstrap ships a
  neutral theme and a preset for each project's current look.
- **Tokens are also exported as JSON** (`spotstrap/tokens.json`), resolved per theme and mode,
  for meta tags, favicons, manifests and canvas code.

## Consequences

- shadcn components in React, Svelte and Vue, and React Native Reusables, work without
  renaming anything.
- The two websites, lifts and bars rename their tokens when they adopt spotstrap
  (`bg` → `background`, `text` → `foreground`, `accent` → `primary`, `fail` → `destructive`,
  `line` → `border`).
- Hex values convert to oklch once, in the brand presets.
- A theme can't invent tokens, so components can rely on every token existing.
