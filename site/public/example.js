// Runs inside an example page: applies ?theme= and ?scheme=, starts spotstrap/js, and tells
// the page around the iframe how tall the example is.
;(() => {
  const root = document.documentElement
  const params = new URLSearchParams(location.search)
  const themes = JSON.parse(root.dataset.themes || '{}')
  const theme = params.get('theme')
  const system = matchMedia('(prefers-color-scheme: dark)')
  const scheme = () => {
    const chosen = params.get('scheme')
    return chosen === 'light' || chosen === 'dark' ? chosen : system.matches ? 'dark' : 'light'
  }
  const apply = () => {
    const s = scheme()
    root.classList.toggle('dark', s === 'dark')
    root.classList.toggle('light', s === 'light')
  }
  apply()
  system.addEventListener('change', apply)
  document.addEventListener('DOMContentLoaded', () => {
    const link = document.getElementById('theme')
    if (theme && themes[theme] && link) link.href = themes[theme]
    import(root.dataset.spotstrapJs).then((m) => m.init())
    if (window.parent === window) return
    const report = () =>
      window.parent.postMessage(
        { type: 'spotstrap-example', height: Math.ceil(root.scrollHeight) },
        location.origin,
      )
    new ResizeObserver(report).observe(document.body)
    report()
  })
})()
