---
title: Prebuilt themes also follow .dark and .light classes
number: 7
status: accepted
implementation: done
date: 2026-11-19
supersedes: [5]
superseded_by: []
notes: "Partly supersedes ADR 0005: its rule that prebuilt themes follow only the system setting. Built in scripts/build.ts."
---

# Prebuilt themes also follow .dark and .light classes

## Context

[ADR 0005](0005-prebuilt-under-dist.md) made prebuilt themes follow only the system's light or
dark setting, and said a class mode would come if a site asked for it. The website
([ADR 0006](0006-website.md)) asks: its previews switch each example between light and dark,
and sites without Tailwind that have a theme toggle need the same.

This record replaces only ADR 0005's "prebuilt themes follow the system's light or dark
setting".

## Decision

- A prebuilt theme uses its dark colors when `<html>` has the `dark` class, or when the system
  is dark and `<html>` doesn't have the `light` class. Otherwise it uses its light colors.
- `color-scheme` follows the same classes, so native controls and scrollbars match.
- Without either class, nothing changes: the system setting decides, as before.

## Consequences

- A plain site gets a theme toggle by setting one class on `<html>`.
- Each prebuilt theme lists its dark colors twice (media query and class), about 2 kB more.
