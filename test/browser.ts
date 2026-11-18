import { after, before } from 'node:test'
import { type Browser, chromium, type Page } from 'playwright'

const demo = new URL('../demo/index.html', import.meta.url).href

let browser: Browser

/** Starts one Chromium for the file's tests and opens the demo at a phone's size. */
export function useDemo(): () => Promise<Page> {
  before(async () => {
    browser = await chromium.launch()
  })
  after(async () => {
    await browser?.close()
  })
  return async () => {
    const page = await browser.newPage({ viewport: { width: 375, height: 812 } })
    await page.goto(demo)
    return page
  }
}

export interface HitArea {
  label: string
  width: number
  height: number
  /** Points 22px from the center, up/down/left/right, that don't land on the control. */
  misses: string[]
}

/** Measures every `[data-control]` on the page and probes its hit area. */
export function measureControls(page: Page): Promise<HitArea[]> {
  return page.$$eval('[data-control]', (els) =>
    els.map((el) => {
      el.scrollIntoView({ block: 'center', inline: 'center' })
      const r = el.getBoundingClientRect()
      const cx = r.left + r.width / 2
      const cy = r.top + r.height / 2
      const probes: Record<string, [number, number]> = {
        up: [cx, cy - 21.5],
        down: [cx, cy + 21.5],
        left: [cx - 21.5, cy],
        right: [cx + 21.5, cy],
      }
      const misses = Object.entries(probes)
        .filter(([, [x, y]]) => {
          const hit = document.elementFromPoint(x, y)
          return !(hit && (hit === el || el.contains(hit)))
        })
        .map(([name]) => name)
      return {
        label: el.getAttribute('aria-label') ?? el.textContent?.trim() ?? el.tagName,
        width: Math.round(r.width),
        height: Math.round(r.height),
        misses,
      }
    }),
  )
}
