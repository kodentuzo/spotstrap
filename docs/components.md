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
