import assert from 'node:assert/strict'
import { readdir } from 'node:fs/promises'
import { test } from 'node:test'
import { colors, fonts, radii, shadows, themes } from '../scripts/contract.ts'
import { compileCss } from './compile.ts'
import { readTheme } from './themes.ts'

const colorNames = colors.map((c) => `color-${c}`)
const required = [
  ...colorNames,
  ...fonts.map((f) => `font-${f}`),
  ...radii.map((r) => (r ? `radius-${r}` : 'radius')),
]
const optional = shadows.map((s) => `shadow-${s}`)

test('every theme file is listed in the contract', async () => {
  const files = (await readdir(new URL('../src/themes', import.meta.url))).map((f) =>
    f.replace(/\.css$/, ''),
  )
  assert.deepEqual(files.sort(), [...themes].sort())
})

for (const name of themes) {
  test(`${name} defines exactly the contract's tokens`, async () => {
    const { theme, light, dark } = await readTheme(name)
    const extra = [...theme.keys()].filter((k) => !required.includes(k) && !optional.includes(k))
    assert.deepEqual(extra, [], 'tokens outside the contract')
    for (const k of required) assert.ok(theme.has(k), `@theme is missing --${k}`)
    assert.deepEqual([...light.keys()], colorNames, 'light colors')
    assert.deepEqual([...dark.keys()], colorNames, 'dark colors')
  })

  test(`${name} compiles with Tailwind`, async () => {
    const css = await compileCss(
      `@import "tailwindcss"; @import "./src/tailwind.css"; @import "./src/themes/${name}.css";`,
      ['bg-primary', 'text-primary-foreground', 'rounded-lg', 'font-display', 'bg-sidebar'],
    )
    assert.match(css, /\.bg-primary\s*\{\s*background-color: var\(--color-primary\)/)
    assert.match(css, /prefers-color-scheme: dark/)
  })
}
