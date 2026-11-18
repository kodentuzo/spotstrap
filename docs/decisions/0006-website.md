---
title: spotstrap.dev is an Astro site in this repo, on GitHub Pages, built with spotstrap
number: 6
status: accepted
implementation: done
date: 2026-11-19
supersedes: []
superseded_by: []
notes: "Built in site/, with the Pages workflow. Goes live with the first push to main, after the one-time setup in docs/releasing.md."
---

# spotstrap.dev is an Astro site in this repo, on GitHub Pages, built with spotstrap

## Context

Spotstrap needs a public home: what it is, how to install it, and one page per component with
a live example and its HTML, the way headlessui.com shows Headless UI. Spotcraft's site
(spotcraft's ADR 0024) already does most of this for its own docs: Astro with no UI framework,
static output, the repository's Markdown rendered at build time, deployed to GitHub Pages.

Two needs differ from spotcraft's site:

- The examples are interactive: Menu, Listbox, Combobox and Tabs need `spotstrap/js`, and a
  preview needs to switch themes, light and dark, and a phone's width. Spotcraft's site has
  no JavaScript at all.
- A phone preview must be a real 375px viewport: the dialog's sheet and other `@media` rules
  depend on the viewport, not on the width of a box in the page.

## Decision

- **Astro, in `site/`**, a private pnpm workspace package that depends on `spotstrap` from
  this repository. The site is styled with spotstrap itself (Tailwind source, the `neutral`
  theme, `dark-class.css`) and uses `spotstrap/js`; whatever is awkward for the site is fixed
  in the library.
- **Static output**, `build.format: 'file'`, no UI framework. Docs pages are the repository's
  Markdown (`docs/`, `CHANGELOG.md`), rendered at build time. Component pages are MDX in the
  site, so `docs/components.md` goes.
- **JavaScript is allowed, from files only:** the CSP is `script-src 'self'`, and a build check
  fails on any inline `<script>`.
- **Examples are HTML fragments** (`site/src/examples/<component>/<name>.html`). Each is built
  into a standalone page with spotstrap's prebuilt CSS, every theme and `spotstrap/js`, and
  shown in an `<iframe>` with its source below. A toolbar switches the theme, light or dark,
  and phone (375px) or full width.
- **GitHub Pages**, deployed by `.github/workflows/pages.yml` on pushes to `main`, which holds
  the released version, so the site shows what's on npm. Custom domain `spotstrap.dev`, DNS on
  Cloudflare pointing at GitHub's Pages addresses, not proxied.
- Code samples are HTML only.

## Consequences

- The docs and the code move together; a release updates both.
- Every example is tested at a phone's width by the same hit-area probe as the library.
- The site can't go live before the first release.
- Pages can't send headers, so the CSP is a meta tag (no `frame-ancestors`).
