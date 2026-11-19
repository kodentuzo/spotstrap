import assert from 'node:assert/strict'
import { test } from 'node:test'
import { measureControls, openDemo, useDemo } from './browser.ts'

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

test('choice rows are 44px tall, and switches are 51 × 31', async () => {
  const page = await open()
  const rows = await page.$$eval('#toggles .choice', (els) =>
    els.map((el) => Math.round(el.getBoundingClientRect().height)),
  )
  for (const h of rows) assert.ok(h >= 44, `row ${h}`)
  const switches = await page.$$eval('#toggles .switch', (els) =>
    els.map((el) => {
      const r = el.getBoundingClientRect()
      return [Math.round(r.width), Math.round(r.height)]
    }),
  )
  for (const s of switches) assert.deepEqual(s, [51, 31])
})

test('tapping the edge of a checkbox hit area toggles it', async () => {
  const page = await open()
  const box = page.locator('#toggles .checkbox').first()
  await box.scrollIntoViewIfNeeded()
  const before = await box.isChecked()
  const r = await box.boundingBox()
  assert.ok(r)
  await page.mouse.click(r.x + r.width / 2, r.y + r.height / 2 - 20)
  assert.equal(await box.isChecked(), !before)
})

test('on a phone, a dialog is a sheet at the bottom with stacked actions', async () => {
  const page = await open()
  await page.click('[commandfor="confirm"][command="show-modal"]')
  const dialog = page.locator('#confirm')
  await dialog.waitFor({ state: 'visible' })
  await page.waitForTimeout(250)
  const r = await dialog.boundingBox()
  assert.ok(r)
  assert.equal(Math.round(r.width), 375)
  assert.equal(Math.round(r.y + r.height), 812)
  const [cancel, del] = await page.$$eval('#confirm .btn', (els) =>
    els.map((el) => el.getBoundingClientRect().top),
  )
  assert.ok(cancel > del, 'Cancel sits below Delete')
  await page.click('#confirm [command="close"] >> text=Cancel')
  await dialog.waitFor({ state: 'hidden' })
})

test('on a wide screen, a dialog is centered', async () => {
  const page = await openDemo({ width: 1024, height: 768 })
  await page.click('[commandfor="confirm"][command="show-modal"]')
  await page.waitForTimeout(250)
  const r = await page.locator('#confirm').boundingBox()
  assert.ok(r)
  assert.equal(Math.round(r.x + r.width / 2), 512)
  assert.ok(r.y > 100)
})

test('a popover opens next to its button, and flips to stay on screen', async () => {
  const page = await open()
  const button = page.locator('[commandfor="info"]')
  await button.click()
  const popover = page.locator('#info')
  await popover.waitFor({ state: 'visible' })
  const [b, p] = [await button.boundingBox(), await popover.boundingBox()]
  assert.ok(b && p)
  const below = p.y - (b.y + b.height)
  const above = b.y - (p.y + p.height)
  assert.ok((below >= 0 && below < 16) || (above >= 0 && above < 16), 'right next to the button')
  assert.ok(p.y >= 0 && p.y + p.height <= 812, 'inside the viewport')
  assert.ok(p.x >= 0 && p.x + p.width <= 375, 'inside the viewport')
})

test('disclosures open one at a time, with no script', async () => {
  const page = await openDemo({ width: 375, height: 812 }, false)
  await page.click('#faq-backups summary')
  assert.equal(await page.$eval('#faq-backups', (el) => (el as HTMLDetailsElement).open), true)
  await page.click('#faq-export summary')
  assert.equal(await page.$eval('#faq-backups', (el) => (el as HTMLDetailsElement).open), false)
  assert.equal(await page.$eval('#faq-export', (el) => (el as HTMLDetailsElement).open), true)
})

test('appear slides while hidden, and only fades with reduced motion', async () => {
  const page = await open()
  // #note starts hidden: the state it fades in from and out to.
  const hidden = () =>
    page.$eval('#note', (el) => {
      const cs = getComputedStyle(el)
      return { property: cs.transitionProperty, opacity: cs.opacity, translate: cs.translate }
    })
  const normal = await hidden()
  assert.match(normal.property, /opacity/)
  assert.equal(normal.opacity, '0')
  assert.equal(normal.translate, '0px 8px')
  await page.emulateMedia({ reducedMotion: 'reduce' })
  const reduced = await hidden()
  assert.equal(reduced.opacity, '0')
  assert.equal(reduced.translate, 'none')
})

test('a shown appear element ends visible', async () => {
  const page = await open()
  await page.click('#toggle-note')
  await page.waitForFunction(
    () => getComputedStyle(document.getElementById('note') as Element).opacity === '1',
  )
})

test('prebuilt themes follow .dark and .light over the system setting', async () => {
  const page = await open()
  const background = () => page.evaluate(() => getComputedStyle(document.body).backgroundColor)
  await page.emulateMedia({ colorScheme: 'light' })
  const light = await background()
  await page.emulateMedia({ colorScheme: 'dark' })
  const dark = await background()
  assert.notEqual(light, dark)
  await page.evaluate(() => document.documentElement.classList.add('light'))
  assert.equal(await background(), light, '.light wins over a dark system')
  await page.evaluate(() => document.documentElement.classList.replace('light', 'dark'))
  await page.emulateMedia({ colorScheme: 'light' })
  assert.equal(await background(), dark, '.dark wins over a light system')
})

test('a toggle button that is on looks different from one that is off', async () => {
  const page = await open()
  const bg = (id: string) => page.$eval(id, (el) => getComputedStyle(el).backgroundColor)
  assert.notEqual(await bg('#toggle-on'), await bg('#toggle-off'))
})

for (const theme of ['neutral', 'spotcraft', 'tagtape', 'vinskiano']) {
  test(`${theme}: outline and ghost buttons keep readable text on hover`, async () => {
    const page = await open()
    await page.evaluate((t) => {
      ;(document.getElementById('theme') as HTMLLinkElement).href = `../dist/themes/${t}.css`
    }, theme)
    await page.waitForLoadState('networkidle')
    for (const scheme of ['light', 'dark'] as const) {
      await page.emulateMedia({ colorScheme: scheme })
      for (const selector of ['#buttons .btn-outline', '#buttons .btn-ghost']) {
        const button = page.locator(selector).first()
        await button.hover()
        await page.waitForTimeout(250) // past the 150ms color transition
        // The browser turns any CSS color into sRGB pixels; WCAG contrast from those.
        const [ratio, fg, bg] = await button.evaluate((el) => {
          const cs = getComputedStyle(el)
          const ctx = document.createElement('canvas').getContext('2d') as CanvasRenderingContext2D
          const lum = (color: string) => {
            ctx.clearRect(0, 0, 1, 1)
            ctx.fillStyle = color
            ctx.fillRect(0, 0, 1, 1)
            const [r, g, b] = [...ctx.getImageData(0, 0, 1, 1).data].map((v) => {
              const c = v / 255
              return c <= 0.04045 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4
            })
            return 0.2126 * r + 0.7152 * g + 0.0722 * b
          }
          const [a, b] = [lum(cs.color), lum(cs.backgroundColor)].sort((x, y) => y - x)
          return [(a + 0.05) / (b + 0.05), cs.color, cs.backgroundColor] as const
        })
        assert.ok(ratio >= 4.5, `${scheme} ${selector}: ${fg} on ${bg} is ${ratio.toFixed(2)}:1`)
      }
    }
  })
}

for (const [label, viewport] of [
  ['phone', { width: 375, height: 812 }],
  ['desktop', { width: 1024, height: 768 }],
] as const) {
  test(`${label}: a library's <div> dialog fits its content, like a native one`, async () => {
    const page = await openDemo(viewport)
    await page.evaluate(() => {
      for (const id of ['lib-backdrop', 'lib-dialog']) {
        ;(document.getElementById(id) as HTMLElement).hidden = false
      }
    })
    await page.waitForTimeout(250)
    const dialog = await page.locator('#lib-dialog').boundingBox()
    const backdrop = await page.locator('#lib-backdrop').boundingBox()
    assert.ok(dialog && backdrop)
    assert.ok(dialog.height < viewport.height / 2, `dialog is ${dialog.height}px tall`)
    assert.equal(Math.round(backdrop.width), viewport.width, 'backdrop covers the screen')
    const buttons = await page.$$eval('#lib-dialog .btn', (els) =>
      els.map((el) => Math.round(el.getBoundingClientRect().height)),
    )
    for (const h of buttons) assert.equal(h, 44, `action button is ${h}px tall`)
    if (label === 'phone') {
      assert.equal(Math.round(dialog.y + dialog.height), viewport.height, 'a sheet at the bottom')
    }
  })
}
