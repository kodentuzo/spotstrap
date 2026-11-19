# Changelog

All notable changes to Spotstrap are documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/), and this
project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html). While the
version is 0.y.z, a breaking change raises the minor version and is listed under **Changed**
or **Removed** with migration steps.

## [Unreleased]

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

[Unreleased]: https://github.com/kodentuzo/spotstrap/compare/v0.1.0...HEAD
[0.1.0]: https://github.com/kodentuzo/spotstrap/releases/tag/v0.1.0
