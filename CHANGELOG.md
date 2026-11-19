# Changelog

All notable changes to Spotstrap are documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/), and this
project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html). While the
version is 0.y.z, a breaking change raises the minor version and is listed under **Changed**
or **Removed** with migration steps.

## [Unreleased]

### Added

- **`@kodentuzo/spotstrap/dist/base.css`**: the prebuilt reset, tokens, base layer and type scale
  without the component classes (11 kB, 2.5 kB gzipped), for plain pages that use none of
  them. `dist/spotstrap.css` still has everything.
- **`@kodentuzo/spotstrap/tokens/<theme>.json`**: one theme's tokens, for code that needs just
  one. `tokens.json` still has them all.

### Changed

- **Migration notes:** Getting started covers the prebuilt files' load order, `@layer base`
  for a site's own CSS, taken unprefixed names (`--muted`, `--accent`), where an app's own
  tokens go, focus outline strength and shadcn's `dark:bg-destructive/60`. Prebuilt theme
  files say to load them after the base file.

### Fixed

- **The body's line height is a ratio** (22/17), not a fixed 22px, so text with its own size
  inside the body gets a line height to match. lifts' small two-line captions had grown from
  34px to 44px tall.
- **`tokens.json` hex values match the original brand colors** for the presets that started as
  hex (kodentuzo, librevitalis, librelifts): their oklch values carry more precision, so
  `#0b6e5f` no longer comes back as `#0a6e5f`.

## [0.1.2] - 2026-11-19

### Changed

- **vinskiano's destructive is orange-red** (hue 45, was 27 and 22), so a Delete button no
  longer looks like the crimson primary: light 0.55 0.2 45, dark 0.7 0.191 45. A test keeps
  primary and destructive at least 25° of hue apart in every colored theme.

## [0.1.1] - 2026-11-19

Fixes and notes from the first migrations (tagtape, spotcraft).

### Added

- **shadcn's unprefixed variables** (`--background`, `--primary`, `--secondary`…, `--radius`)
  point at the theme's tokens, so copied shadcn components that use `var(--secondary)` keep
  their colors.

### Changed

- **tagtape and vinskiano dark themes:** primary is lighter (green L 0.62, crimson L 0.65) with
  dark text on it, so it also reads as text on the page (5.7:1 instead of 2.8:1 and 2.5:1).
  Dark-mode buttons in those themes change from a deep fill with white text to a light fill
  with dark text. Every theme's primary now passes WCAG AA as text, checked by a test.
- **Getting started has a "Moving an existing shadcn app" section:** 17px body text,
  default border colors, fonts, `tw-animate-css`, `@source`, tailwind-merge and release-age
  notes, from the first migrations. Theme files say that they name fonts but don't load them.

### Fixed

- **Outline and ghost buttons keep readable text on hover.** They hover onto the accent fill
  and now take the accent's text color with it (`--btn-fg-hover`). In themes with a dark
  accent, such as spotcraft, the text used to vanish on hover.

## [0.1.0] - 2026-11-19

The first release, published as `@kodentuzo/spotstrap` (npm refuses an unscoped `spotstrap`; see
ADR 0008): tokens, themes, touch sizes and Apple's type scale, every component in Headless UI's
list, `@kodentuzo/spotstrap/js` for plain HTML, and React Native recipes.

### Added

- **The website, [spotstrap.dev](https://spotstrap.dev):** a page per component with live
  examples, plus getting started, theming, guidelines and the decisions.
- **Prebuilt themes follow `.dark` and `.light`** on `<html>`, over the system setting, so a
  site without Tailwind can have a theme toggle. Without either class, the system decides.
  See ADR 0007.
- **Toggle buttons:** a `btn` with `aria-pressed="true"` (or `[data-selected]`,
  `[data-state="on"]`) shows as on, with the accent fill.
- **Appear on popovers and dialogs:** `appear`, `appear-up` and `appear-scale` also fade a
  native `[popover]` or `<dialog>` in and out as it opens and closes.
- **Stacked `choice` rows space themselves 12px apart**, so checkboxes, radios and switches keep
  the guidelines' 12px between targets without a wrapper.
- **`@kodentuzo/spotstrap/tailwind.css`** for projects on Tailwind v4: the base layer (page colors, border
  and outline colors) and a `light` variant for themes. Colors follow the system setting.
- **`@kodentuzo/spotstrap/dark-class.css`** makes colors follow a `.dark` class on `<html>` instead.
- **Touch sizes** from Apple's HIG: `--size-control` (44px), `--size-control-compact` (36px)
  and `--gap-control` (12px).
- **Type scale** from Apple's iOS text styles: `text-large-title`, `text-title-1`…`3`,
  `text-headline`, `text-body`, `text-callout`, `text-subhead`, `text-footnote`,
  `text-caption-1` and `-2`. Body text is 17px, and text inputs never go below 16px.
- **Themes** in `@kodentuzo/spotstrap/themes/`: `neutral` (the default, with shadcn's light
  gray accent) and presets for kodentuzo, librevitalis, librelifts (LibreBars uses it too), spotcraft, sokobanko, tagtape and
  vinskiano. Every theme defines the same tokens, in light and dark. Themes name their fonts
  but don't load them.
- **Prebuilt CSS** for sites without Tailwind: `@kodentuzo/spotstrap/dist/spotstrap.css` (base layer, type
  scale, classes) and `@kodentuzo/spotstrap/dist/themes/<name>.css`. Everything is in CSS layers, so a
  page's own CSS wins. See ADR 0005.
- **`@kodentuzo/spotstrap/tokens.json`**: every theme's colors in light and dark, as oklch and hex, plus
  fonts and radii, for meta tags, favicons, manifests and canvas code.
- **Button** (`btn`): shadcn's variants (`btn-secondary`, `btn-outline`, `btn-ghost`,
  `btn-link`, `btn-destructive`), `btn-compact` and `btn-icon`. Every button has a 44 × 44 hit
  area, a pressed state and a busy state (`aria-busy="true"`). Works on `<button>` and `<a>`.
  See `docs/components.md`.
- **Fields:** `field`, `label`, `field-description`, `field-error`, `fieldset`, `legend`, and
  the controls `input`, `textarea` and `select`. Controls are 44px tall with text of at least
  16px. Invalid styles wait for interaction (`:user-invalid`) or `aria-invalid="true"`.
  `select` uses the stylable `<select>` where the browser has it.
- **Checkbox, radio group and switch:** `checkbox`, `radio`, `radio-group`, `switch` and a
  44px `choice` row for a control and its label. The switch has Apple's size (51 × 31). Each
  has a 44 × 44 hit area, and their outlines meet WCAG's 3:1 for controls.
- **Dialog and popover:** `dialog` (with `dialog-title`, `dialog-description`,
  `dialog-actions`) and `popover`, on `<dialog>` and `[popover]`, opened without script by
  `commandfor` buttons. On narrow screens a dialog is a bottom sheet with stacked actions. A
  popover sits next to its button and flips to stay on screen.
- **Menu, listbox and combobox:** `menu`, `menu-item`, `menu-label`, `menu-separator`,
  `menu-empty` and `menu-compact`, styled for every headless library's highlight and
  selection attributes.
- **`@kodentuzo/spotstrap/js`**: keyboard and ARIA behavior for Menu, Listbox and Combobox in plain HTML,
  on Zag.js (`init()`, about 49 kB gzipped). A Menu also works without it, through `popover`
  and `commandfor`.
- **Tabs, disclosure and appear:** `tabs`, `tab-list`, `tab`, `tab-panel` (switched by
  `@kodentuzo/spotstrap/js`); `disclosure`, `disclosure-button`, `disclosure-panel` on `<details>`, with no
  script; and `appear`, `appear-up`, `appear-scale` for enter and exit motion (Headless UI's
  Transition), which only fade with reduced motion.
- **React Native:** `@kodentuzo/spotstrap/native.css` (sizes and type scale for Uniwind) and
  `@kodentuzo/spotstrap/recipes`, functions that return full class strings and a `hitSlop` for each
  component, from the same tokens as the web.

[Unreleased]: https://github.com/kodentuzo/spotstrap/compare/v0.1.2...HEAD
[0.1.2]: https://github.com/kodentuzo/spotstrap/compare/v0.1.1...v0.1.2
[0.1.1]: https://github.com/kodentuzo/spotstrap/compare/v0.1.0...v0.1.1
[0.1.0]: https://github.com/kodentuzo/spotstrap/releases/tag/v0.1.0
