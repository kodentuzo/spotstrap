import tailwindcss from '@tailwindcss/vite'
import { defineConfig } from 'astro/config'

// Static output for GitHub Pages (docs/decisions/0006-website.md). No UI framework; the few
// scripts are files, since the CSP allows only 'self'.
export default defineConfig({
  site: 'https://spotstrap.dev',
  output: 'static',
  // `/docs/theming` is written as `docs/theming.html`, which Pages serves at that URL.
  build: { format: 'file', inlineStylesheets: 'never' },
  trailingSlash: 'never',
  // Astro's dev toolbar injects inline scripts.
  devToolbar: { enabled: false },
  vite: {
    plugins: [tailwindcss()],
    // Inline nothing, so every script and asset is a file the CSP allows.
    build: { assetsInlineLimit: 0 },
    // Docs pages are the repository's Markdown (docs/, CHANGELOG.md), read at build time.
    server: { fs: { allow: ['..'] } },
  },
})
