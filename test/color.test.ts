import assert from 'node:assert/strict'
import { test } from 'node:test'
import { contrast, parseOklch, toHex } from '../scripts/color.ts'

test('oklch converts to hex', () => {
  assert.equal(toHex('oklch(1 0 0)'), '#ffffff')
  assert.equal(toHex('oklch(0 0 0)'), '#000000')
  assert.equal(toHex('oklch(0.628 0.2577 29.23)'), '#ff0000')
  assert.equal(toHex('oklch(1 0 0 / 10%)'), '#ffffff1a')
})

test('oklch parses percentages and alpha', () => {
  assert.deepEqual(parseOklch('oklch(50% 0.1 120 / 0.5)'), { l: 0.5, c: 0.1, h: 120, a: 0.5 })
})

test('contrast matches WCAG', () => {
  assert.equal(Math.round(contrast('oklch(1 0 0)', 'oklch(0 0 0)')), 21)
  assert.equal(contrast('oklch(0.5 0 0)', 'oklch(0.5 0 0)'), 1)
})
