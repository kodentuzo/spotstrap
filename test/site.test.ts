import assert from 'node:assert/strict'
import { existsSync, readdirSync } from 'node:fs'
import { join, relative } from 'node:path'
import { test } from 'node:test'
import { measureControls, useSite } from './browser.ts'

// The website's example pages, built (`pnpm verify` builds the site before testing), probed at a
// phone's width: every control on every example has a 44 × 44 hit area.
const dist = new URL('../site/dist/', import.meta.url).pathname
const examplesDir = join(dist, 'examples')
const controls =
  'button, a[href], input:not([type="hidden"]), select, textarea, summary, [role="tab"]'

function pages(dir: string): string[] {
  if (!existsSync(dir)) return []
  return readdirSync(dir, { withFileTypes: true }).flatMap((e) =>
    e.isDirectory()
      ? pages(join(dir, e.name))
      : e.name.endsWith('.html')
        ? [join(dir, e.name)]
        : [],
  )
}

const open = useSite()
const examples = pages(examplesDir).map((file) => `/${relative(dist, file)}`)

test('the site is built', () => {
  assert.ok(examples.length > 10, 'run `pnpm site:build` first')
})

for (const path of examples) {
  test(`${path}: every control has a 44 × 44 hit area at 375px`, async () => {
    const page = await open(`${path}?scheme=light`)
    await page.waitForLoadState('load')
    const small = (await measureControls(page, controls)).filter((c) => c.misses.length > 0)
    assert.deepEqual(small, [], JSON.stringify(small))
  })
}
