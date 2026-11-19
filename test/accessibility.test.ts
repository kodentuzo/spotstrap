import assert from 'node:assert/strict'
import { test } from 'node:test'
import { contrast, parseOklch } from '../scripts/color.ts'
import { themes } from '../scripts/contract.ts'
import { readTheme } from './themes.ts'

// Text on its background must reach WCAG AA, 4.5:1 (docs/guidelines.md, Accessibility).
// Destructive is also text: field errors use it on the page and on cards. So is primary:
// apps write labels and links in it, so it must read on the page in dark mode too.
const textPairs = [
  ['foreground', 'background'],
  ['card-foreground', 'card'],
  ['popover-foreground', 'popover'],
  ['primary-foreground', 'primary'],
  ['secondary-foreground', 'secondary'],
  ['muted-foreground', 'background'],
  ['muted-foreground', 'muted'],
  ['muted-foreground', 'card'],
  ['accent-foreground', 'accent'],
  ['destructive-foreground', 'destructive'],
  ['destructive', 'background'],
  ['destructive', 'card'],
  ['primary', 'background'],
  ['primary', 'card'],
  ['sidebar-foreground', 'sidebar'],
  ['sidebar-primary-foreground', 'sidebar-primary'],
  ['sidebar-accent-foreground', 'sidebar-accent'],
] as const

for (const name of themes) {
  for (const mode of ['light', 'dark'] as const) {
    test(`${name} ${mode}: text meets WCAG AA contrast`, async () => {
      const colors = (await readTheme(name))[mode]
      const low = textPairs
        .map(([fg, bg]) => {
          const ratio = contrast(colors.get(`color-${fg}`) ?? '', colors.get(`color-${bg}`) ?? '')
          return { pair: `${fg} on ${bg}`, ratio: Math.round(ratio * 100) / 100 }
        })
        .filter((r) => r.ratio < 4.5)
      assert.deepEqual(low, [])
    })
  }
}

// A destructive action must not look like the primary one (docs/guidelines.md, Buttons). When
// both are colored, their hues stay at least 25° apart; a gray or black-and-white theme
// (neutral, sokobanko) marks destructive by words and placement instead.
for (const name of themes) {
  for (const mode of ['light', 'dark'] as const) {
    test(`${name} ${mode}: destructive doesn't look like primary`, async () => {
      const colors = (await readTheme(name))[mode]
      const p = parseOklch(colors.get('color-primary') ?? '')
      const d = parseOklch(colors.get('color-destructive') ?? '')
      if (p.c < 0.05 || d.c < 0.05) return
      const diff = Math.abs(p.h - d.h) % 360
      const hue = Math.min(diff, 360 - diff)
      assert.ok(hue >= 25, `primary and destructive hues are ${hue.toFixed(1)}° apart`)
    })
  }
}
