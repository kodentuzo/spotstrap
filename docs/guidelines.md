# Guidelines

Rules every spotstrap component follows, and that apps built with it should follow too. Most
come from Apple's [Human Interface Guidelines](https://developer.apple.com/design/human-interface-guidelines/);
spotstrap takes Apple's rules for touch, type and interaction, not its colors. Sizes are in
CSS px, which equal iOS points and Android dp.

## Principles

Before a change, ask whether it serves:

- **Purpose:** it helps the core task.
- **Agency:** people stay in control; nothing locks them in, and mistakes are easy to undo.
- **Familiarity:** it works like things people already know, and behaves the same everywhere.
- **Flexibility:** it works for everyone, with any input, at any size.
- **Simplicity:** only what's needed, with a clear hierarchy.
- **Craft:** the details are finished.
- **Delight:** only when it doesn't slow the task.

## Touch targets

- Controls are **44px** tall by default (`--size-control`); icon buttons are 44 × 44.
- **Compact** controls are 36px (`--size-control-compact`), opt-in per control, with a
  44 × 44 hit area.
- Checkboxes, radios, switches, close buttons and chips can look smaller, but their hit area
  is 44 × 44.
- Targets are **12px** apart (`--gap-control`).
- Links inside running text follow the text size.

See [ADR 0003](decisions/0003-touch-sizes-and-type.md).

## Type

- Use the type scale: `large-title`, `title-1`, `title-2`, `title-3`, `headline`, `body`,
  `callout`, `subhead`, `footnote`, `caption-1`, `caption-2`. Body text is 17px.
- Nothing smaller than 11px. No thin, extra-light or light weights for text.
- Tight line height only for one or two lines.
- Sizes are in rem: layouts must work at 200% text size. Rows grow instead of clipping;
  side-by-side content stacks.

## Buttons

- Variants keep shadcn's names: `default`, `secondary`, `outline`, `ghost`, `link`,
  `destructive`.
- **One or two prominent buttons** (`default`) per view at most.
- A destructive action is never the default action.
- Buttons in a set are the same size. Show which one is preferred by its style, not its size.
- Labels are short and start with a verb. Add "…" when the button opens another view.
- Every button has a pressed state.
- A long action shows a spinner in the button and changes its label ("Saving…").

## Text fields

- Every field has a visible label. A placeholder is a hint, never the label.
- Pick `type`, `inputmode` and `autocomplete` to match the data, so phones show the right
  keyboard.
- Text inputs are at least 16px.
- A clear button, when there is one, sits at the trailing end.
- Validate when people leave the field, not while they type.

## Accessibility

- Text contrast meets WCAG AA (4.5:1, or 3:1 for large or bold text) in light **and** dark,
  in every theme.
- Never use color alone to carry meaning; pair it with text or an icon.
- `prefers-reduced-motion`: fades instead of slides and zooms, and no looping motion.
- `prefers-reduced-transparency`: no blur or translucency.
- `prefers-contrast: more`: stronger borders and text.
- Every swipe action also has a button.
- Nothing important dismisses itself.

## Layout

- Respect safe areas: `env(safe-area-inset-*)` with `viewport-fit=cover` on the web, insets
  on native.
- Adapt to the space available (container queries), not to the device. Every width has the
  same features; only how much is shown at once changes.
- Put the most important content first, at the top and leading edge.

## Motion and feedback

- Motion has a purpose, is short, can be skipped, and follows the gesture that started it.
- Motion is never the only signal; pair it with text, or haptics on native.
- Warn only before data loss that can't be undone. Confirm important successes. When
  something fails, say why.
