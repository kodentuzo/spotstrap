---
title: One npm package, spotstrap, with Tailwind source, prebuilt CSS and native recipes
number: 2
status: accepted
implementation: planned
date: 2026-11-18
supersedes: []
superseded_by: []
notes: "Decision only; the package skeleton and builds land in the foundation PR."
---

# One npm package, spotstrap, with Tailwind source, prebuilt CSS and native recipes

## Context

Spotstrap's consumers differ in what they can take in:

- Projects on Tailwind v4 with `@tailwindcss/vite` (spotcraft, lifts and bars on the web,
  sokobanko, tagtape, vinskiano) can compile Tailwind source.
- The kodentuzo and librevitalis websites have no Tailwind and a CSP of
  `script-src 'none'`. They can only take a plain CSS file.
- The lifts and bars apps are React Native with Uniwind. Uniwind reads Tailwind v4 CSS,
  including `@utility`, but React Native has no attribute selectors, pseudo-classes or
  pseudo-elements, so state (pressed, checked, open, invalid) can't be styled from CSS
  selectors there.
- Brand colors are also needed outside CSS: meta tags, favicons, manifests, canvas code.

## Decision

- **One package, `spotstrap`, public on npm, MIT.** Its exports:

  | Export | What | For |
  | --- | --- | --- |
  | `spotstrap/tailwind.css` | Tailwind v4 source: tokens, base layer, `@utility` classes | Projects with Tailwind |
  | `spotstrap/spotstrap.css` | Prebuilt CSS, every class, no theme | Sites without Tailwind |
  | `spotstrap/themes/<name>.css` | One theme: the neutral one and a preset per brand | Both |
  | `spotstrap/tokens.json` | Resolved token values per theme and mode | Meta tags, icons, canvas |
  | `spotstrap/recipes` | TS class recipes keyed by state props | React Native (Uniwind) |
  | `spotstrap/js` | Optional behavior for plain HTML ([ADR 0004](0004-style-state-not-runtime.md)) | Sites without a framework |

- **Classes are written once,** as Tailwind `@utility` in the source. The prebuilt CSS and
  the recipes are generated from it at build time, never edited by hand.
- **Brand presets ship in the package,** one per current look (kodentuzo, librevitalis,
  librelifts, spotcraft, sokobanko, tagtape, vinskiano), plus a neutral default.
- **Releases** are `vX.Y.Z` tags on `main`, published by CI with npm trusted publishing and
  provenance. The version follows SemVer; the public API is the export paths, class names,
  token names and recipe signatures.

## Consequences

- Plain sites use spotstrap like Bootstrap: one `<link>` to the CSS and one to a theme.
- Tailwind projects get only the classes they use, and can mix in utilities.
- Renaming a class, token or export is a breaking change.
- The build has three outputs to keep in step with the source; a test checks they match.
