import assert from 'node:assert/strict'
import { test } from 'node:test'
import { themes } from '../scripts/contract.ts'
import { readTheme } from './themes.ts'

// Uniwind reads theme files for React Native, where values must be static: no var(),
// calc(), color-mix() or other functions besides oklch() (ADR 0001). This checks that rule;
// the lifts and bars apps check Uniwind itself.
const allowed =
  /^(oklch\([^()]*\)|none|0|[\d.]+rem|"[^"]+"(, *("[^"]+"|[\w-]+))*|[\w-]+(, *("[^"]+"|[\w-]+))*)$/

for (const name of themes) {
  test(`${name} uses static values only`, async () => {
    const { theme, light, dark } = await readTheme(name)
    const bad = [...theme, ...light, ...dark].filter(([, v]) => !allowed.test(v))
    assert.deepEqual(bad, [])
  })
}

test('a dynamic value is caught', () => {
  for (const v of ['var(--x)', 'calc(1rem * 2)', 'color-mix(in oklab, red, blue)']) {
    assert.equal(allowed.test(v), false, v)
  }
})
