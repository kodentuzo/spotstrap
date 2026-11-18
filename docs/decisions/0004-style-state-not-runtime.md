---
title: Spotstrap styles component state; it doesn't ship a component runtime
number: 4
status: accepted
implementation: planned
date: 2026-11-18
supersedes: []
superseded_by: []
notes: "Decision only. Support data checked 2026-11-18; recheck before building each component."
---

# Spotstrap styles component state; it doesn't ship a component runtime

## Context

Spotstrap covers Headless UI's component list: Button, Input, Textarea, Select, Checkbox,
Radio Group, Switch, Field, Fieldset, Label, Description, Dialog, Popover, Menu, Listbox,
Combobox, Disclosure, Tabs and Transition. Its consumers get behavior (focus, keyboard,
ARIA) from different places:

- React apps from react-aria (tagtape, vinskiano), Vue from reka-ui (sokobanko), Svelte from
  bits-ui (spotcraft);
- React Native apps from nothing yet (lifts, bars), with React Native Reusables planned;
- static Astro sites from the browser alone, two of them with `script-src 'none'`.

No JavaScript runtime runs on both the DOM and React Native, and a second one next to
react-aria or reka-ui would fight it. The browser now covers much of the list itself:

| Feature | Support (2026-11) |
| --- | --- |
| `<dialog>`, `popover` attribute, `<details name>` | All current browsers |
| Anchor positioning | All current browsers (Firefox since 147) |
| Invoker commands (`commandfor`, `command`) | All current browsers (Chrome 135, Firefox 144, Safari 26.2) |
| Customizable `<select>` (`appearance: base-select`) | Chromium 135, Safari 27; Firefox behind a flag |

## Decision

- **Spotstrap styles state, it doesn't manage it.** Component classes target the ARIA and
  platform state that every headless library emits:
  - `aria-expanded`, `aria-selected`, `aria-checked`, `aria-pressed`, `aria-invalid`,
    `aria-disabled`, `aria-current`;
  - `:disabled`, `:checked`, `:focus-visible`, `:user-invalid`, `:popover-open`, `[open]`.

  Where a library uses its own attribute for the same state, the selector lists it too:
  `data-state="open|checked"` (Radix, reka-ui, bits-ui), `data-open`, `data-checked`,
  `data-focus` (Headless UI), `data-pressed`, `data-focus-visible`, `data-selected`
  (react-aria).
- **Plain HTML uses the platform first:** `<dialog>` for Dialog, `popover` with anchor
  positioning for Popover and Menu, `<details>` for Disclosure, `commandfor` to open and close
  them without script, and a native `<select>` enhanced with `appearance: base-select` where
  supported (`@supports`), plain elsewhere.
- **`spotstrap/js` is optional** and covers only what the browser lacks: keyboard handling
  for Menu, Listbox, Combobox and Tabs. It's built on Zag.js state machines through
  `@zag-js/vanilla`, and enhances markup that already works without it.
- **Framework apps keep their headless library** (react-aria, reka-ui, bits-ui, Radix,
  Headless UI) and add spotstrap's classes. The docs show one example per framework.
- **React Native uses React Native Reusables** for behavior and `spotstrap/recipes` for
  classes ([ADR 0002](0002-package-and-publishing.md)).

## Consequences

- One stylesheet looks the same over every headless library, with no wrapper packages to
  maintain.
- Spotstrap's CSS must be tested against each library's real markup, not only against its own
  demo HTML.
- Sites with `script-src 'none'` get Dialog, Popover, Disclosure and the form controls, but
  not keyboard-complete Menu, Listbox, Combobox or Tabs.
- Firefox users get a plain native `<select>` until customizable select ships there.
