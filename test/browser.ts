import { readFile } from 'node:fs/promises'
import { createServer, type Server } from 'node:http'
import type { AddressInfo } from 'node:net'
import { extname } from 'node:path'
import { after, afterEach, before } from 'node:test'
import { type Browser, chromium, type Page } from 'playwright'

const root = new URL('..', import.meta.url)
const types: Record<string, string> = {
  '.html': 'text/html',
  '.css': 'text/css',
  '.js': 'text/javascript',
  '.map': 'application/json',
}

let browser: Browser
let server: Server
let base: string
let start: string
const open: Page[] = []

/** Serves `dir` over HTTP: browsers don't load ES modules from file:// URLs. */
function serve(dir: URL): Promise<string> {
  server = createServer(async (req, res) => {
    const path = decodeURIComponent(new URL(req.url ?? '/', 'http://x').pathname)
    try {
      const body = await readFile(new URL(`.${path}`, dir))
      res.writeHead(200, { 'content-type': types[extname(path)] ?? 'application/octet-stream' })
      res.end(body)
    } catch {
      res.writeHead(404).end()
    }
  })
  return new Promise((resolve) =>
    server.listen(0, '127.0.0.1', () => {
      const { port } = server.address() as AddressInfo
      resolve(`http://127.0.0.1:${port}`)
    }),
  )
}

/** Starts a server and one Chromium for the file's tests. */
function useBrowser(dir: URL, path: string) {
  before(async () => {
    base = await serve(dir)
    start = `${base}${path}`
    browser = await chromium.launch()
  })
  // One page at a time: only one can have focus, and keyboard handling checks it.
  afterEach(async () => {
    for (const page of open.splice(0)) await page.context().close()
  })
  after(async () => {
    await browser?.close()
    server?.close()
  })
}

/** The library's demo page (demo/index.html), opened at a phone's size. */
export function useDemo(): () => Promise<Page> {
  useBrowser(root, '/demo/index.html')
  return () => openDemo({ width: 375, height: 812 })
}

/** The built website (site/dist), served as GitHub Pages serves it. */
export function useSite(): (path: string) => Promise<Page> {
  useBrowser(new URL('site/dist/', root), '/')
  return async (path) => {
    const page = await openDemo({ width: 375, height: 812 })
    await page.goto(`${base}${path}`)
    return page
  }
}

/** Opens the demo at another size, in the file's browser, optionally without JavaScript. */
export async function openDemo(
  viewport: { width: number; height: number },
  javaScriptEnabled = true,
): Promise<Page> {
  const context = await browser.newContext({ viewport, javaScriptEnabled })
  const page = await context.newPage()
  open.push(page)
  await page.goto(start)
  return page
}

export interface HitArea {
  label: string
  width: number
  height: number
  /** Points 22px from the center, up/down/left/right, that don't land on the control. */
  misses: string[]
}

/** Measures every control matching `selector` and probes its hit area. */
export function measureControls(page: Page, selector = '[data-control]'): Promise<HitArea[]> {
  return page.$$eval(selector, (els) =>
    els
      // Targets only: visible, enabled, and not a 1px element kept for forms or screen readers.
      .filter((el) => {
        const r = el.getBoundingClientRect()
        const disabled = el.matches(':disabled, [aria-disabled="true"]')
        return (
          r.width > 1 && r.height > 1 && !disabled && getComputedStyle(el).visibility !== 'hidden'
        )
      })
      .map((el) => {
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
            // A tap on a control's own <label> counts: it activates the control.
            const label = hit?.closest('label')
            return !(hit && (hit === el || el.contains(hit) || label?.control === el))
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
