# Changelog

All notable changes to Spotstrap are documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/), and this
project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html). While the
version is 0.y.z, a breaking change raises the minor version and is listed under **Changed**
or **Removed** with migration steps.

## [Unreleased]

### Added

- **`spotstrap/tailwind.css`** for projects on Tailwind v4: the base layer (page colors, border
  and outline colors) and a `light` variant for themes. Colors follow the system setting.
- **`spotstrap/dark-class.css`** makes colors follow a `.dark` class on `<html>` instead.
- **Touch sizes** from Apple's HIG: `--size-control` (44px), `--size-control-compact` (36px)
  and `--gap-control` (12px).
- **Type scale** from Apple's iOS text styles: `text-large-title`, `text-title-1`…`3`,
  `text-headline`, `text-body`, `text-callout`, `text-subhead`, `text-footnote`,
  `text-caption-1` and `-2`. Body text is 17px, and text inputs never go below 16px.
- **Themes** in `spotstrap/themes/`: `neutral` (the default) and presets for kodentuzo,
  librevitalis, librelifts (LibreBars uses it too), spotcraft, sokobanko, tagtape and
  vinskiano. Every theme defines the same tokens, in light and dark. Themes name their fonts
  but don't load them.
