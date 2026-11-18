// Light or dark for the site: the stored choice, else the system's. Loaded in <head> as a
// file (the CSP forbids inline scripts) so the page never flashes the wrong scheme.
;(() => {
  const root = document.documentElement
  const stored = (() => {
    try {
      return localStorage.getItem('scheme')
    } catch {
      return null
    }
  })()
  const system = matchMedia('(prefers-color-scheme: dark)')
  const apply = (scheme) => {
    root.classList.toggle('dark', scheme === 'dark')
    root.classList.toggle('light', scheme === 'light')
  }
  apply(stored ?? (system.matches ? 'dark' : 'light'))
  system.addEventListener('change', (e) => {
    if (!localStorage.getItem('scheme')) apply(e.matches ? 'dark' : 'light')
  })
  document.addEventListener('click', (e) => {
    const button = e.target instanceof Element && e.target.closest('[data-scheme-toggle]')
    if (!button) return
    const next = root.classList.contains('dark') ? 'light' : 'dark'
    apply(next)
    try {
      localStorage.setItem('scheme', next)
    } catch {}
  })
})()
