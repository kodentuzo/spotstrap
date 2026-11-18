import assert from 'node:assert/strict'
import { test } from 'node:test'
import { measureControls, useDemo } from './browser.ts'

// The demo page uses the prebuilt CSS, so `pnpm build` must run first (`pnpm verify` does).
const open = useDemo()

test('every control has a 44 × 44 hit area at 375px', async () => {
  const page = await open()
  const small = (await measureControls(page)).filter((c) => c.misses.length > 0)
  assert.deepEqual(small, [])
})

test('buttons are 44px tall, and compact ones 36px', async () => {
  const page = await open()
  const heights = await page.$$eval('#buttons .btn', (els) =>
    els.map((el) => ({
      compact: el.classList.contains('btn-compact'),
      height: Math.round(el.getBoundingClientRect().height),
    })),
  )
  for (const { compact, height } of heights) assert.equal(height, compact ? 36 : 44)
})

test('icon buttons are square', async () => {
  const page = await open()
  const sizes = await page.$$eval('#buttons .btn-icon', (els) =>
    els.map((el) => {
      const r = el.getBoundingClientRect()
      return Math.round(r.width) - Math.round(r.height)
    }),
  )
  assert.deepEqual(
    sizes,
    sizes.map(() => 0),
  )
})

test('text controls are at least 16px and 44px tall', async () => {
  const page = await open()
  const controls = await page.$$eval('#fields :is(.input, .textarea, .select)', (els) =>
    els.map((el) => ({
      id: el.id,
      fontSize: Number.parseFloat(getComputedStyle(el).fontSize),
      height: Math.round(el.getBoundingClientRect().height),
    })),
  )
  assert.ok(controls.length >= 5)
  for (const c of controls) {
    assert.ok(c.fontSize >= 16, `${c.id} font size ${c.fontSize}`)
    assert.ok(c.height >= 44, `${c.id} height ${c.height}`)
  }
})

test('an invalid field shows a destructive border', async () => {
  const page = await open()
  const border = (id: string) => page.$eval(id, (el) => getComputedStyle(el).borderColor)
  const [invalid, valid] = [await border('#handle'), await border('#email')]
  assert.notEqual(invalid, valid)
})
