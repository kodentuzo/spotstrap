// Runs after `astro build` (adapted from spotcraft's): every page the site must have exists,
// every internal link points at a page or file in dist/, every #anchor exists on its page, and
// no page has an inline <script>, which the CSP would block (docs/decisions/0006-website.md).
import { existsSync, readdirSync, readFileSync, statSync } from 'node:fs'
import { join, relative } from 'node:path'

const dist = new URL('../dist/', import.meta.url).pathname
const site = new URL('../', import.meta.url).pathname
const repo = new URL('../../', import.meta.url).pathname

/** Built file for a site path (`/docs/x` → `docs/x.html`), a static file, or null. */
function fileFor(path: string): string | null {
  const clean = decodeURIComponent(path.split('?')[0]).replace(/\/$/, '') || '/index'
  for (const candidate of [`${clean}.html`, `${clean}/index.html`, clean]) {
    const file = join(dist, candidate)
    if (existsSync(file) && statSync(file).isFile()) return file
  }
  return null
}

function files(dir: string, ext: string): string[] {
  return readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    const path = join(dir, entry.name)
    if (entry.isDirectory()) return files(path, ext)
    return entry.name.endsWith(ext) ? [path] : []
  })
}

const ids = new Map<string, Set<string>>()
function idsOf(file: string): Set<string> {
  let found = ids.get(file)
  if (!found) {
    found = new Set([...readFileSync(file, 'utf8').matchAll(/\sid="([^"]+)"/g)].map((m) => m[1]))
    ids.set(file, found)
  }
  return found
}

const problems: string[] = []

// The pages the site must have: home, the docs, every ADR, every component and every example.
const expected = [
  '/',
  '/404',
  '/docs/getting-started',
  '/docs/theming',
  '/docs/guidelines',
  '/docs/react-native',
  '/docs/decisions',
  '/docs/changelog',
  ...readdirSync(join(repo, 'docs/decisions'))
    .filter((name) => /^\d{4}-[a-z0-9-]+\.md$/.test(name))
    .map((name) => `/docs/decisions/${name.replace(/\.md$/, '')}`),
  ...readdirSync(join(site, 'src/content/components')).map(
    (name) => `/components/${name.replace(/\.mdx$/, '')}`,
  ),
  ...files(join(site, 'src/examples'), '.html').map(
    (file) => `/examples/${relative(join(site, 'src/examples'), file).replace(/\.html$/, '')}`,
  ),
]
for (const path of expected) {
  if (!fileFor(path)) problems.push(`missing page ${path}`)
}
for (const file of ['CNAME', 'robots.txt', 'favicon.svg']) {
  if (!existsSync(join(dist, file))) problems.push(`missing ${file}`)
}

let links = 0
for (const file of files(dist, '.html')) {
  const html = readFileSync(file, 'utf8')
  const page = relative(dist, file)
  for (const [, attrs, body] of html.matchAll(/<script\b([^>]*)>([\s\S]*?)<\/script>/gi)) {
    if (!/\ssrc=/.test(attrs) || body.trim()) problems.push(`${page}: has an inline <script>`)
  }
  for (const [, href] of html.matchAll(/\s(?:href|src)="([^"]*)"/g)) {
    if (/^[a-z]+:|^\/\//i.test(href)) continue
    links++
    const [path, hash] = href.split('#')
    const target = path ? fileFor(path) : file
    if (!target) {
      problems.push(`${page}: broken link ${href}`)
    } else if (hash && target.endsWith('.html') && !idsOf(target).has(decodeURIComponent(hash))) {
      problems.push(`${page}: missing anchor ${href}`)
    }
  }
}

if (problems.length > 0) {
  console.error(problems.join('\n'))
  process.exit(1)
}
console.log(
  `check-links: ${expected.length} pages present, ${links} internal links resolve, no inline scripts`,
)
