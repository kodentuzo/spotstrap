# Getting started

Spotstrap is a set of CSS classes (`btn`, `input`, `dialog`…) built from design tokens, with
touch-sized controls and Apple's type scale. Use it in one of three ways.

## With Tailwind v4

```bash
pnpm add spotstrap
```

```css
/* your main CSS file */
@import "tailwindcss";
@import "spotstrap/tailwind.css";
@import "spotstrap/themes/neutral.css";
```

Then write `class="btn"`, `class="input"` and so on. Tailwind only emits the classes you use,
and its own utilities still work next to them.

To follow a `.dark` class on `<html>` instead of the system's light or dark setting (for a
theme toggle), add:

```css
@import "spotstrap/dark-class.css";
```

## Without Tailwind

Link the prebuilt CSS and one theme, from npm or a CDN:

```html
<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/spotstrap/dist/spotstrap.css" />
<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/spotstrap/dist/themes/neutral.css" />
```

Colors follow the system's light or dark setting, or a `dark` or `light` class on `<html>`.
Everything is in CSS layers, so your own CSS wins without `!important`.

## React Native

With [Uniwind](https://uniwind.dev), import the native CSS and a theme, then build components
from recipes. See [React Native](react-native.md).

## Behavior

Dialog, Popover and Disclosure need no JavaScript: they use `<dialog>`, `popover`, `<details>`
and `commandfor` buttons. Menu, Listbox, Combobox and Tabs need keyboard handling the browser
doesn't have. In plain HTML, add:

```html
<script type="module">
  import { init } from "https://cdn.jsdelivr.net/npm/spotstrap/dist/js/spotstrap.js"
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
`spotstrap/tokens.json`, with each color as oklch and hex.

## What to read next

- [Guidelines](guidelines.md): touch sizes, type, buttons, fields, accessibility.
- [Decisions](decisions/README.md): why spotstrap works the way it does.
