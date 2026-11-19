---
title: The npm package is @kodentuzo/spotstrap
number: 8
status: accepted
implementation: done
date: 2026-11-19
supersedes: [2]
superseded_by: []
notes: "Partly supersedes ADR 0002: the package name. Export paths keep their shape under the scope."
---

# The npm package is @kodentuzo/spotstrap

## Context

[ADR 0002](0002-package-and-publishing.md) named the package `spotstrap`, unscoped, since the
name was free. The first publish failed: npm rejects it as "too similar to existing package
bootstrap", a rule against typosquatting that a name lookup doesn't show. No unscoped
`spotstrap` can be published.

This record replaces only the package name in ADR 0002.

## Decision

- The package is **`@kodentuzo/spotstrap`**, owned by the kodentuzo npm organization, like the
  GitHub repository.
- Export paths keep their shape under the scope: `@kodentuzo/spotstrap/tailwind.css`,
  `@kodentuzo/spotstrap/themes/<name>.css`, `@kodentuzo/spotstrap/dist/spotstrap.css`,
  `@kodentuzo/spotstrap/js`, `@kodentuzo/spotstrap/recipes` and so on.
- The product is still called spotstrap, at spotstrap.dev.
- The first release is still 0.1.0: nothing was published under the old name.

## Consequences

- Imports are longer.
- Publishing needs the npm organization: the publish token, and later the trusted publisher,
  are set up for `@kodentuzo/spotstrap`.
- Other packages (a future separate recipes package, for example) can live in the same scope.
