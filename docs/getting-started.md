# Getting started

Spotstrap is a set of CSS classes (`btn`, `input`, `dialog`…) built from design tokens, with
touch-sized controls and Apple's type scale. Use it in one of three ways.

## With Tailwind v4

```bash
pnpm add @kodentuzo/spotstrap
```

```css
/* your main CSS file */
@import "tailwindcss";
@import "@kodentuzo/spotstrap/tailwind.css";
@import "@kodentuzo/spotstrap/themes/neutral.css";
```

Then write `class="btn"`, `class="input"` and so on. Tailwind only emits the classes you use,
and its own utilities still work next to them.

To follow a `.dark` class on `<html>` instead of the system's light or dark setting (for a
theme toggle), add:

```css
@import "@kodentuzo/spotstrap/dark-class.css";
```

## Without Tailwind

Link the prebuilt CSS and one theme, from npm or a CDN:

```html
<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/@kodentuzo/spotstrap/dist/spotstrap.css" />
<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/@kodentuzo/spotstrap/dist/themes/neutral.css" />
```

Colors follow the system's light or dark setting, or a `dark` or `light` class on `<html>`.
Everything is in CSS layers, so your own CSS wins without `!important`.

- **Load the theme after the base file.** Both set the font variables, and the later one wins.
- **`dist/base.css`** is the same base without the component classes (11 kB instead of 43 kB),
  for pages that use none of them.
- **Put your own base rules in `@layer base`.** Unlayered CSS beats every layer, so a plain
  `a { color: inherit }` would override a `.btn` on a link.

## React Native

With [Uniwind](https://uniwind.dev), import the native CSS and a theme, then build components
from recipes. See [React Native](react-native.md).

## Behavior

Dialog, Popover and Disclosure need no JavaScript: they use `<dialog>`, `popover`, `<details>`
and `commandfor` buttons. Menu, Listbox, Combobox and Tabs need keyboard handling the browser
doesn't have. In plain HTML, add:

```html
<script type="module">
  import { init } from "https://cdn.jsdelivr.net/npm/@kodentuzo/spotstrap/dist/js/spotstrap.js"
  init()
</script>
```

In a React, Vue or Svelte app, keep your headless library (react-aria, reka-ui, bits-ui,
Radix, Headless UI) and put spotstrap's classes on the elements it renders. The CSS reads the
state those libraries set ([ADR 0004](decisions/0004-style-state-not-runtime.md)).

## Themes

`neutral` is the default. The others are presets for kodentuzo, librevitalis, librelifts,
spotcraft, sokobanko, tagtape and vinskiano. Themes name fonts but don't load them: load the
font files yourself, for example with Fontsource.

Colors outside CSS (meta `theme-color`, favicons, manifests, canvas code) come from
`@kodentuzo/spotstrap/tokens.json`, with each color as oklch and hex.

## Moving an existing shadcn app

What changes when an app that already uses shadcn (or its own Tailwind theme) switches to
spotstrap's theme:

- **Replace, don't stack.** Remove the app's `:root` / `.dark` color blocks and its
  `@theme inline` mappings; spotstrap's theme defines the same names. shadcn's unprefixed
  variables (`var(--secondary)`) keep working: they point at the theme's tokens.
- **Body text is 17px** (Apple's body size), not 16px. Text without its own size class grows
  by a pixel. Set a size on the element, or `body { font-size: … }` in your own CSS, if a
  layout depends on 16px.
- **Default borders use `--color-border`.** A bare `border` that used to take the text color
  is now the theme's subtle border; write `border-foreground` where you want it dark.
- **Fonts are named, not loaded.** Themes set `--font-sans` and friends; load the font files
  yourself, for example with Fontsource.
- **Keep `tw-animate-css` if your shadcn components animate with it** (enter and exit on
  `data-state` or `data-entering`). spotstrap's `appear` covers native popovers, dialogs and
  `[hidden]`, not those classes.
- **Keep `@source`** for component folders outside your app, so Tailwind still finds their
  classes.
- **`cn` / tailwind-merge:** spotstrap's text sizes (`text-body`, `text-title-1`…) look like
  colors to tailwind-merge. If you merge classes, add them to its `font-size` group.
- **Unprefixed names are taken.** spotstrap defines shadcn's `--background`, `--muted`,
  `--accent`, `--border` and the rest. If your CSS used `--muted` for text or `--accent` for
  a brand color, rename all of them in one change: a missed one silently takes spotstrap's
  meaning.
- **Your own tokens** (a game board's colors, a chart's) go in your CSS next to the theme:
  `@theme` for ones Tailwind should make utilities from, `:root` otherwise. With
  `dark-class.css`, give their dark values under `.dark`.
- **Overriding a text size** (`--text-body`) changes that utility and the body's size; the
  body's line height is a ratio, so it follows.
- **Focus outlines** use the ring color at 50%. A high-contrast theme that wants them solid
  sets `outline-color: var(--color-ring)` in its own base layer.
- **shadcn's `dark:bg-destructive/60`** turns gray in a black-and-white theme, where
  destructive is white. Use `bg-destructive text-destructive-foreground` instead.
- **`disclosure-button` has no side padding**, so it lines up with text. Add `px-*` when it
  sits inside a padded card.
- **pnpm's `minimumReleaseAge`** holds back fresh releases. For your own packages, add them
  to `minimumReleaseAgeExclude`; their provenance is still checked.

## What to read next

- [Guidelines](guidelines.md): touch sizes, type, buttons, fields, accessibility.
- [Decisions](decisions/README.md): why spotstrap works the way it does.
