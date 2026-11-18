import { readFile } from 'node:fs/promises'
import { createServer, type Server } from 'node:http'
import type { AddressInfo } from 'node:net'
import { extname } from 'node:path'
import { after, before } from 'node:test'
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
let demo: string

/** Serves the repo over HTTP: browsers don't load ES modules from file:// URLs. */
function serve(): Promise<string> {
  server = createServer(async (req, res) => {
    const path = decodeURIComponent(new URL(req.url ?? '/', 'http://x').pathname)
    try {
      const body = await readFile(new URL(`.${path}`, root))
      res.writeHead(200, { 'content-type': types[extname(path)] ?? 'application/octet-stream' })
      res.end(body)
    } catch {
      res.writeHead(404).end()
    }
  })
  return new Promise((resolve) =>
    server.listen(0, '127.0.0.1', () => {
      const { port } = server.address() as AddressInfo
      resolve(`http://127.0.0.1:${port}/demo/index.html`)
    }),
  )
}

/** Starts one Chromium for the file's tests and opens the demo at a phone's size. */
export function useDemo(): () => Promise<Page> {
  before(async () => {
    demo = await serve()
    browser = await chromium.launch()
  })
  after(async () => {
    await browser?.close()
    server?.close()
  })
  return () => openDemo({ width: 375, height: 812 })
}

/** Opens the demo at another size, in the file's browser, optionally without JavaScript. */
export async function openDemo(
  viewport: { width: number; height: number },
  javaScriptEnabled = true,
): Promise<Page> {
  const context = await browser.newContext({ viewport, javaScriptEnabled })
  const page = await context.newPage()
  await page.goto(demo)
  return page
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
