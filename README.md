# Spotstrap

Bootstrap's reach, shadcn's look, made for phones.

- **No framework needed.** One CSS file and plain HTML. Tailwind and React, Vue or Svelte are
  optional.
- **Feels right on phones.** 44pt touch targets and Apple's type scale, so a web app feels
  native.
- **Web and native match.** The same sizes and tokens in React Native.
- **Your brand in one file.** Change the accent, radius and fonts, and every app follows.

Spotstrap is a styling layer, not a component runtime. Its classes style the states that
headless libraries already expose (react-aria, Radix, reka-ui, bits-ui, Headless UI), and
the browser's own elements (`<dialog>`, `popover`, `<details>`) in plain HTML.

> Status: being designed. Nothing is published yet.

## Scope

- **Tokens:** shadcn's names, in oklch, with light and dark values. Brand themes set the
  values.
- **Sizes and type:** controls are 44px tall by default; the type scale follows Apple's text
  styles.
- **Components:** the Headless UI set. Button, Input, Textarea, Select, Checkbox, Radio Group,
  Switch, Field, Fieldset, Label, Description, Dialog, Popover, Menu, Listbox, Combobox,
  Disclosure, Tabs, Transition.
- **Outputs:** Tailwind v4 source, prebuilt CSS, tokens as JSON, and class recipes for React
  Native (Uniwind).

## Use

With Tailwind v4:

```css
@import "tailwindcss";
@import "spotstrap/tailwind.css";
@import "spotstrap/themes/neutral.css";
/* Optional: follow a .dark class on <html> instead of the system setting. */
@import "spotstrap/dark-class.css";
```

Without Tailwind:

```html
<link rel="stylesheet" href="…/spotstrap/dist/spotstrap.css" />
<link rel="stylesheet" href="…/spotstrap/dist/themes/neutral.css" />
```

Themes: `neutral`, `kodentuzo`, `librevitalis`, `librelifts`, `spotcraft`, `sokobanko`,
`tagtape`, `vinskiano`. They name fonts but don't load them; load the font files yourself.

Colors outside CSS (meta tags, favicons, canvas) come from `spotstrap/tokens.json`.

React Native with Uniwind: import `spotstrap/native.css` and a theme, then build components with
`spotstrap/recipes` ([docs](docs/components.md#react-native)).

Menu, Listbox, Combobox and Tabs in plain HTML need a little script:

```html
<script type="module">
  import { init } from "spotstrap/js"
  init()
</script>
```

## Docs

- [Components](docs/components.md): classes, and the states they style.
- [Guidelines](docs/guidelines.md): the interface rules, taken from Apple's Human Interface
  Guidelines.
- [Decisions](docs/decisions/README.md): architecture decision records.

## License

MIT.
