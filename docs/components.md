# Components

Each component is a class on plain HTML. With a headless library (react-aria, Radix, reka-ui,
bits-ui, Headless UI), put the same class on the element that library renders; the CSS reads
the ARIA and `data-*` state those libraries set ([ADR 0004](decisions/0004-style-state-not-runtime.md)).
Sizes and spacing follow the [guidelines](guidelines.md).

## Button

```html
<button class="btn">Save</button>
<button class="btn btn-outline">Export…</button>
<a class="btn btn-secondary" href="/new">New project</a>
<button class="btn btn-icon btn-ghost" aria-label="Close"><svg>…</svg></button>
```

| Class                                                                      | What                                                              |
| -------------------------------------------------------------------------- | ----------------------------------------------------------------- |
| `btn`                                                                      | The button. Without a variant it's the default, prominent style.  |
| `btn-secondary`, `btn-outline`, `btn-ghost`, `btn-link`, `btn-destructive` | Variants, shadcn's names.                                         |
| `btn-compact`                                                              | 36px tall, for dense desktop screens. The hit area stays 44 × 44. |
| `btn-icon`                                                                 | Square, for an icon alone. Give it an `aria-label`.               |

States it styles:

| State          | Plain HTML                                                             | Headless libraries                  |
| -------------- | ---------------------------------------------------------------------- | ----------------------------------- |
| Pressed        | `:active`                                                              | `[data-pressed]` (react-aria)       |
| Keyboard focus | `:focus-visible`                                                       | `[data-focus-visible]` (react-aria) |
| Disabled       | `:disabled`, `[aria-disabled="true"]`                                  | `[data-disabled]`                   |
| Busy           | `[aria-busy="true"]` shows a spinner; change the label too ("Saving…") | same                                |

Rules from the guidelines: at most one or two default (prominent) buttons per view; a
destructive action is never the default one; labels start with a verb.

## Fields

```html
<div class="field">
  <label class="label" for="email">Email</label>
  <input class="input" id="email" type="email" autocomplete="email" />
  <p class="field-description">We send the sign-in link here.</p>
</div>

<div class="field">
  <label class="label" for="handle">Username</label>
  <input class="input" id="handle" aria-invalid="true" aria-describedby="handle-error" />
  <p class="field-error" id="handle-error">Use at least 3 characters.</p>
</div>
```

| Class                                       | What                                                                                              |
| ------------------------------------------- | ------------------------------------------------------------------------------------------------- |
| `field`                                     | Stacks a label, a control, a description and an error.                                            |
| `label`, `field-description`, `field-error` | The text around a control. Errors use the destructive color and always say what's wrong in words. |
| `input`, `textarea`, `select`               | The controls: 44px tall, text at least 16px so iOS doesn't zoom.                                  |
| `fieldset`, `legend`                        | A group of fields with a heading.                                                                 |

| State     | Plain HTML                                                            | Headless libraries                       |
| --------- | --------------------------------------------------------------------- | ---------------------------------------- |
| Focus     | `:focus-visible`                                                      | `[data-focus-visible]`, `[data-focused]` |
| Invalid   | `:user-invalid` (only after people interact), `[aria-invalid="true"]` | `[data-invalid]`                         |
| Disabled  | `:disabled`                                                           | `[data-disabled]`                        |
| Read only | `[readonly]`                                                          | same                                     |

`select` uses the browser's stylable `<select>` (`appearance: base-select`) where it exists:
its picker looks like a popover and options are 44px rows. Elsewhere, such as Firefox today,
it's the native picker with spotstrap's border and chevron.

There's no compact size for text controls: a 36px input would have a 36px hit area.

## Checkbox, radio group, switch

```html
<label class="choice"><input type="checkbox" class="checkbox" /> Email me about releases</label>

<div class="radio-group" role="radiogroup" aria-label="Plan">
  <label class="choice"><input type="radio" name="plan" class="radio" /> Free</label>
  <label class="choice"><input type="radio" name="plan" class="radio" /> Pro</label>
</div>

<label class="choice"><input type="checkbox" role="switch" class="switch" /> Wi-Fi</label>
```

| Class               | What                                                                                           |
| ------------------- | ---------------------------------------------------------------------------------------------- |
| `choice`            | A 44px row that holds a control and its label; the whole row is the target.                    |
| `checkbox`, `radio` | 20px boxes with a 44 × 44 hit area. Marks are drawn with CSS, so strict CSPs don't block them. |
| `switch`            | Apple's switch, 51 × 31, with a 44px tall hit area. Use it for settings that apply at once.    |
| `radio-group`       | Spaces radio rows 12px apart.                                                                  |

| State                    | Plain HTML                                     | Headless libraries                                                                                                 |
| ------------------------ | ---------------------------------------------- | ------------------------------------------------------------------------------------------------------------------ |
| Checked                  | `:checked`, `[aria-checked="true"]`            | `[data-state="checked"]` (Radix, reka-ui, bits-ui), `[data-checked]` (Headless UI), `[data-selected]` (react-aria) |
| Mixed                    | `:indeterminate`, `[aria-checked="mixed"]`     | `[data-state="indeterminate"]`, `[data-indeterminate]`                                                             |
| Focus, invalid, disabled | `:focus-visible`, `:user-invalid`, `:disabled` | `[data-focus-visible]`, `[data-invalid]`, `[data-disabled]`                                                        |

Unchecked outlines use the muted text color, so they reach WCAG's 3:1 for a control's edge.

## Dialog and popover

```html
<button class="btn btn-destructive" commandfor="confirm" command="show-modal">Delete…</button>
<dialog class="dialog" id="confirm" aria-labelledby="confirm-title">
  <h2 class="dialog-title" id="confirm-title">Delete this project?</h2>
  <p class="dialog-description">Its files and history go too. You can't undo this.</p>
  <div class="dialog-actions">
    <button class="btn btn-outline" commandfor="confirm" command="close">Cancel</button>
    <button class="btn btn-destructive" commandfor="confirm" command="close">Delete</button>
  </div>
</dialog>

<button class="btn btn-outline" commandfor="info" command="toggle-popover">What's this?</button>
<div class="popover" id="info" popover>Backups run every night.</div>
```

No script is needed: `commandfor` and `command` open and close them in every current browser.

| Class                                | What                                                                                                  |
| ------------------------------------ | ----------------------------------------------------------------------------------------------------- |
| `dialog`                             | A modal panel. On screens narrower than 40rem it's a sheet at the bottom, within thumb reach.         |
| `dialog-title`, `dialog-description` | Its heading and text.                                                                                 |
| `dialog-actions`                     | Its buttons. On narrow screens they stack full width, the first one (put Cancel first) at the bottom. |
| `popover`                            | A small panel next to the button that opened it. It flips above when there's no room below.           |

| State   | Plain HTML                | Headless libraries                                                  |
| ------- | ------------------------- | ------------------------------------------------------------------- |
| Open    | `[open]`, `:popover-open` | Mounted content is shown; `[data-state="open"]`                     |
| Closing | —                         | `[data-state="closed"]`, `[data-closed]`, `[data-exiting]` fade out |

Motion: dialogs fade and scale in, sheets slide up. With reduced motion, both only fade.

## Menu, listbox, combobox

These need keyboard handling the browser doesn't have, so in plain HTML they use
`spotstrap/js` (built on [Zag.js](https://zagjs.com)). Framework apps use their own headless
library's Menu, Select or Combobox with the same classes, and don't need the script.

```html
<script type="module">
  import { init } from "spotstrap/js" // or …/spotstrap/dist/js/spotstrap.js from a CDN
  init()
</script>

<div data-spotstrap="menu">
  <button class="btn btn-outline" data-part="trigger" commandfor="actions" command="toggle-popover">Project…</button>
  <div class="menu" id="actions" data-part="content" popover>
    <div class="menu-label">Project</div>
    <button class="menu-item" data-part="item" data-value="rename">Rename…</button>
    <hr class="menu-separator" />
    <button class="menu-item menu-item-destructive" data-part="item" data-value="delete">Delete…</button>
  </div>
</div>

<div class="field" data-spotstrap="listbox" data-name="size">
  <span class="label" data-part="label">Size</span>
  <button class="select" data-part="trigger"><span data-part="value-text" data-placeholder="Pick a size"></span></button>
  <div class="menu" data-part="content">
    <div class="menu-item" data-part="item" data-value="m" data-selected>Medium</div>
    <div class="menu-item" data-part="item" data-value="xl" data-disabled>Extra large</div>
  </div>
</div>

<div class="field" data-spotstrap="combobox" data-name="country">
  <label class="label" data-part="label" for="country">Country</label>
  <div data-part="control"><input class="input" id="country" data-part="input" /></div>
  <div class="menu" data-part="content">
    <div class="menu-item" data-part="item" data-value="hr">Croatia</div>
    <div class="menu-empty" data-part="empty" hidden>No country matches.</div>
  </div>
</div>
```

- **Menu** works without the script too: `popover` and `commandfor` open it, and its items are
  buttons. The script adds arrow keys, typeahead and focus handling, and fires a
  `spotstrap:select` event with `{ value }`.
- **Listbox** is a select you can style. It needs the script; without it, use `select` on a
  native `<select>`. It fires `spotstrap:change` and submits its value under `data-name`.
- **Combobox** filters its items as people type. It fires `spotstrap:change`.
- Lists open below their button and flip above when there's no room.

| Class                          | What                                                          |
| ------------------------------ | ------------------------------------------------------------- |
| `menu`                         | The list panel.                                               |
| `menu-item`                    | A 44px row. `menu-item-destructive` for a destructive action. |
| `menu-label`, `menu-separator` | A group heading and a divider.                                |
| `menu-empty`                   | The message when a combobox matches nothing.                  |
| `menu-compact`                 | 36px rows, on the `menu`.                                     |

| State       | Attributes                                                                                                                                          |
| ----------- | --------------------------------------------------------------------------------------------------------------------------------------------------- |
| Highlighted | `[data-highlighted]` (Zag, Radix, reka-ui, bits-ui), `[data-focus]`, `[data-active]` (Headless UI), `[data-focused]` (react-aria), `:focus-visible` |
| Selected    | `[data-state="checked"]`, `[aria-selected="true"]`, `[aria-checked="true"]`, `[data-selected]`: shows a check                                       |
| Disabled    | `[data-disabled]`, `[aria-disabled="true"]`, `:disabled`                                                                                            |

## Tabs, disclosure, appear

```html
<div class="tabs" data-spotstrap="tabs">
  <div class="tab-list" data-part="list">
    <button class="tab" data-part="trigger" data-value="general">General</button>
    <button class="tab" data-part="trigger" data-value="billing">Billing</button>
  </div>
  <div class="tab-panel" data-part="content" data-value="general">…</div>
  <div class="tab-panel" data-part="content" data-value="billing">…</div>
</div>

<details class="disclosure" name="faq">
  <summary class="disclosure-button">How long are backups kept?</summary>
  <div class="disclosure-panel">Thirty days.</div>
</details>

<p class="appear-up" hidden>Saved a moment ago.</p>
```

- **Tabs** switch with `spotstrap/js`: click, or arrow keys, which select as they move. Without
  the script, every panel shows, one after another. Tabs are 44px tall and the list scrolls
  sideways when it's wider than the screen.
- **Disclosure** is `<details>`: no script. Several with the same `name` open one at a time.
  Where the browser can animate `<details>`, it opens smoothly.
- **Appear** is Headless UI's Transition: `appear` fades an element in when it's shown and out
  when it's hidden, `appear-up` also slides it up, `appear-scale` also grows it. With reduced
  motion, they only fade.

| Class                                                 | What                             |
| ----------------------------------------------------- | -------------------------------- |
| `tabs`, `tab-list`, `tab`, `tab-panel`                | Tabs.                            |
| `disclosure`, `disclosure-button`, `disclosure-panel` | A section that opens and closes. |
| `appear`, `appear-up`, `appear-scale`                 | Enter and exit motion.           |

| State           | Attributes                                                                                                       |
| --------------- | ---------------------------------------------------------------------------------------------------------------- |
| Selected tab    | `[aria-selected="true"]`, `[data-selected]` (react-aria, Zag), `[data-state="active"]` (Radix, reka-ui, bits-ui) |
| Open disclosure | `details[open]`, or on a library's button: `[aria-expanded="true"]`, `[data-state="open"]`, `[data-open]`        |
| Hidden (appear) | `[hidden]`, `[data-closed]` (Headless UI), `[data-state="closed"]`, `[data-exiting]` (react-aria)                |
