import assert from 'node:assert/strict'
import { readFile } from 'node:fs/promises'
import { test } from 'node:test'
import { extendTailwindMerge, twMerge } from 'tailwind-merge'
import { spotstrapMerge, textSizes } from '../src/recipes/merge.ts'

const merge = extendTailwindMerge(spotstrapMerge)

test("plain tailwind-merge drops spotstrap's text sizes (why the config exists)", () => {
  assert.equal(twMerge('text-body text-foreground'), 'text-foreground')
})

test('with the config, a text size and a text color both stay', () => {
  for (const size of textSizes) {
    assert.equal(merge(`text-${size} text-foreground`), `text-${size} text-foreground`)
  }
})

test('with the config, a later text size still replaces an earlier one', () => {
  assert.equal(merge('text-body text-title-1'), 'text-title-1')
  assert.equal(merge('text-sm text-body'), 'text-body')
})

test('the list matches the type scale in src/tokens.css', async () => {
  const tokens = await readFile(new URL('../src/tokens.css', import.meta.url), 'utf8')
  const inCss = [...tokens.matchAll(/--text-([a-z0-9-]+?):/g)]
    .map((m) => m[1])
    .filter((name) => !name.includes('--'))
  assert.deepEqual([...textSizes].sort(), [...new Set(inCss)].sort())
})
