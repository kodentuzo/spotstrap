import assert from 'node:assert/strict'
import { test } from 'node:test'
import { openDemo, useDemo } from './browser.ts'

// spotstrap/js on the demo page: keyboard, selection and filtering, as a person would use them.
const open = useDemo()

test('menu: opens from its button, moves with arrows, selects with Enter, closes', async () => {
  const page = await open()
  const trigger = page.locator('#project-menu [data-part="trigger"]')
  const content = page.locator('#project-menu [data-part="content"]')
  await trigger.click()
  await content.waitFor({ state: 'visible' })
  assert.equal(await trigger.getAttribute('aria-expanded'), 'true')
  // Zag moves focus into the menu on the next frame; keys before that go to the button.
  await page.waitForFunction(() => document.activeElement?.getAttribute('data-part') === 'content')
  await page.keyboard.press('ArrowDown')
  await page.keyboard.press('ArrowDown')
  await page.keyboard.press('Enter')
  await content.waitFor({ state: 'hidden' })
  assert.equal(await page.textContent('#menu-result'), 'Chose duplicate')
  assert.equal(
    await page.evaluate(() => document.activeElement?.getAttribute('data-part')),
    'trigger',
  )
})

test('menu: rows are 44px tall', async () => {
  const page = await open()
  await page.click('#project-menu [data-part="trigger"]')
  const heights = await page.$$eval('#project-menu .menu-item', (els) =>
    els.map((el) => Math.round(el.getBoundingClientRect().height)),
  )
  assert.deepEqual(
    heights,
    heights.map(() => 44),
  )
})

test('menu: works without JavaScript, through popover and commandfor', async () => {
  const page = await openDemo({ width: 375, height: 812 }, false)
  await page.click('#project-menu [data-part="trigger"]')
  await page.locator('#project-actions').waitFor({ state: 'visible' })
})

test('listbox: shows the selected value, and picks another', async () => {
  const page = await open()
  const valueText = page.locator('#size [data-part="value-text"]')
  assert.equal(await valueText.textContent(), 'Medium')
  await page.click('#size [data-part="trigger"]')
  await page.click('#size [data-part="item"][data-value="l"]')
  assert.equal(await valueText.textContent(), 'Large')
  assert.equal(await page.$eval('#size select', (el) => (el as HTMLSelectElement).value), 'l')
})

test('listbox: the keyboard skips a disabled option', async () => {
  const page = await open()
  await page.click('#size [data-part="trigger"]')
  await page.waitForFunction(() => document.activeElement?.getAttribute('data-part') === 'content')
  await page.keyboard.press('End')
  await page.keyboard.press('Enter')
  assert.equal(await page.textContent('#size [data-part="value-text"]'), 'Large')
})

test('listbox: opens above its button when there is no room below', async () => {
  const page = await open()
  await page.click('#size [data-part="trigger"]')
  // Zag positions the list once it has measured it, a frame or two after opening.
  await page.waitForFunction(() =>
    document.querySelector('#size [data-part="content"]')?.hasAttribute('data-placement'),
  )
  await page.waitForTimeout(50)
  const [b, c] = await page.$$eval(
    '#size [data-part="trigger"], #size [data-part="content"]',
    (els) => els.map((el) => el.getBoundingClientRect().toJSON()),
  )
  assert.ok(c.bottom <= 812 && c.top >= 0, 'inside the viewport')
  assert.ok(c.bottom <= b.top || c.top >= b.bottom, 'not over its button')
})

test('combobox: filters as you type and picks with the keyboard', async () => {
  const page = await open()
  const input = page.locator('#country [data-part="input"]')
  await input.fill('cro')
  const visible = await page.$$eval('#country [data-part="item"]', (els) =>
    els.filter((el) => !(el as HTMLElement).hidden).map((el) => el.textContent),
  )
  assert.deepEqual(visible, ['Croatia'])
  await page.keyboard.press('ArrowDown')
  await page.keyboard.press('Enter')
  assert.equal(await input.inputValue(), 'Croatia')
})

test('combobox: says so when nothing matches', async () => {
  const page = await open()
  await page.locator('#country [data-part="input"]').fill('zzz')
  await page.locator('#country [data-part="empty"]').waitFor({ state: 'visible' })
})
