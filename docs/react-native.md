# React Native

React Native has no CSS selectors for state and no `::after`, so it gets **recipes**:
functions that take the state as options and return full Uniwind class strings, plus a
`hitSlop` that grows small targets to 44 points. The values come from the same tokens as the
web, and a test checks that they match.

```css
/* global.css */
@import "tailwindcss";
@import "uniwind";
@import "@kodentuzo/spotstrap/native.css";
@import "@kodentuzo/spotstrap/themes/librelifts.css";
```

```tsx
import { button } from '@kodentuzo/spotstrap/recipes'

;<Pressable onPress={save}>
  {({ pressed }) => {
    const b = button({ variant: 'outline', pressed })
    return (
      <View className={b.className} hitSlop={b.hitSlop}>
        <Text className={b.textClassName}>Export…</Text>
      </View>
    )
  }}
</Pressable>
```

Recipes: `button`, `field`, `label`, `fieldDescription`, `fieldError`, `input`, `choice`,
`checkbox`, `radio`, `toggleMark`, `radioGroup`, `switchTrack`, `switchThumb`, `menu`,
`menuItem`, `tabList`, `tab`, `sheet`, `sheetTitle`, `sheetDescription`, `sheetActions`.
`sizes` has the numbers (44, 36, 12…) for anything else.

`native.css` holds the sizes and the type scale without the web's base layer and components,
and points Uniwind at the recipes' classes. Themes name web fonts with fallbacks; React Native
takes one family per font, so set `--font-sans` and friends in your own `@theme` after the
theme. Behavior (focus, menus, dialogs) comes from React Native Reusables or your own
components.

If your components merge classes with `cn()` (tailwind-merge), extend it with
`spotstrapMerge` from `@kodentuzo/spotstrap/merge`, or it drops the recipes' text sizes.
