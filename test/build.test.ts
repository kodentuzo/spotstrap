import assert from 'node:assert/strict'
import { readFile } from 'node:fs/promises'
import { test } from 'node:test'
import { colors, themes } from '../scripts/contract.ts'

// `pnpm verify` builds before it tests; run `pnpm build` first when testing alone.
const read = (path: string) => readFile(new URL(`../dist/${path}`, import.meta.url), 'utf8')

test('spotstrap.css is layered, with sizes, type and the base layer', async () => {
  const css = await read('spotstrap.css')
  assert.match(css, /^\/\*.*\*\/\n@layer theme, base, components, utilities;/)
  assert.match(css, /--size-control: 2\.75rem/)
  assert.match(css, /\.text-body \{/)
  assert.match(css, /@layer base \{/)
  assert.doesNotMatch(css, /^:root/m, 'nothing outside a layer')
})

for (const name of themes) {
  test(`the prebuilt ${name} theme has every color, light, dark and .dark`, async () => {
    const css = await read(`themes/${name}.css`)
    const [light, rest] = css.split('@media (prefers-color-scheme: dark)')
    const [dark, darkClass] = rest.split(':root.dark {')
    for (const c of colors) {
      assert.match(light, new RegExp(`--color-${c}: oklch`), `light ${c}`)
      assert.match(dark, new RegExp(`--color-${c}: oklch`), `dark ${c}`)
      assert.match(darkClass, new RegExp(`--color-${c}: oklch`), `.dark ${c}`)
    }
  })
}

test('tokens.json has every theme, color and mode, with hex values', async () => {
  const tokens = JSON.parse(await read('tokens.json'))
  assert.deepEqual(Object.keys(tokens), [...themes])
  for (const name of themes) {
    for (const mode of ['light', 'dark']) {
      for (const c of colors) {
        assert.match(
          tokens[name][mode][c].hex,
          /^#[0-9a-f]{6}([0-9a-f]{2})?$/,
          `${name} ${mode} ${c}`,
        )
      }
    }
  }
})

test('base.css has the base layer and type scale but no component classes', async () => {
  const css = await read('base.css')
  assert.match(css, /^\/\*.*\*\/\n@layer theme, base, components, utilities;/)
  assert.match(css, /@layer base \{/)
  assert.match(css, /\.text-body \{/)
  assert.doesNotMatch(css, /\.btn \{/)
  assert.doesNotMatch(css, /\.dialog \{/)
  const full = await read('spotstrap.css')
  assert.ok(
    css.length < full.length / 2,
    `base.css is ${css.length} bytes, spotstrap.css ${full.length}`,
  )
})

test('each theme also has its own tokens file', async () => {
  const all = JSON.parse(await read('tokens.json'))
  for (const name of themes) {
    assert.deepEqual(JSON.parse(await read(`tokens/${name}.json`)), all[name], name)
  }
})
