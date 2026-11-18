---
title: Prebuilt CSS has its own paths under spotstrap/dist
number: 5
status: accepted
implementation: done
date: 2026-11-18
supersedes: [2]
superseded_by: [7]
notes: "Partly supersedes ADR 0002: the export paths of the prebuilt CSS. Built in scripts/build.ts."
---

# Prebuilt CSS has its own paths under spotstrap/dist

## Context

[ADR 0002](0002-package-and-publishing.md) gave themes one path, `spotstrap/themes/<name>.css`,
for both Tailwind projects and sites without Tailwind, and put the prebuilt base at
`spotstrap/spotstrap.css`.

A theme's source uses `@theme` and `@variant`, which only Tailwind understands; a site
without Tailwind needs it compiled. One path can't serve both by export conditions: Tailwind
resolves package CSS with the `style` condition, and so does Vite for plain CSS imports, so a
Vite site without Tailwind would get the source.

This record replaces only the paths of the prebuilt files in ADR 0002.

## Decision

- **Source,** for Tailwind projects: `spotstrap/tailwind.css`, `spotstrap/dark-class.css`,
  `spotstrap/themes/<name>.css`.
- **Prebuilt,** for everything else: `spotstrap/dist/spotstrap.css` and
  `spotstrap/dist/themes/<name>.css`. The same paths work on a CDN
  (`…/npm/spotstrap/dist/spotstrap.css`).
- **Tokens** stay at `spotstrap/tokens.json`.
- Every prebuilt file starts with `@layer theme, base, components, utilities;` and keeps all
  its rules in those layers, so the page's own unlayered CSS always wins.
- Prebuilt themes follow the system's light or dark setting.

## Consequences

- The import path says what a file is: `dist/` means compiled.
- Plain sites can't switch themes with a `.dark` class yet; that needs a class-based prebuilt
  variant if a site asks for it.
